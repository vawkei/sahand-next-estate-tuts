import { Webhook } from "svix";
import { headers } from "next/headers";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  console.log("🔔 Webhook route hit");

  type ClerkEvent = {
    data: {
      id: string;
      first_name: string;
      last_name: string;
      image_url: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      email_addresses: any[];
    };
    type: "user.created" | "user.updated" | "user.deleted";
  };

  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error:Please add SIGNING_SECRET from Clerk dashboard to .env"
    );
  }

  const wh = new Webhook(SIGNING_SECRET);

  const headerPayload = await headers();
  console.log("📦 Incoming headers:");
  for (const [key, value] of headerPayload.entries()) {
    console.log(`${key}: ${value}`);
  }
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix_signature");

  if (!svix_id || !svix_signature || !svix_timestamp) {
     console.log("Missing headers", { svix_id, svix_signature, svix_timestamp });
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: ClerkEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    }) as ClerkEvent;
  } catch (error) {
    console.log("Error:Could not verify webhook:", error);
    return new Response("Error:verification error", {
      status: 400,
    });
  }

  const { id } = evt?.data;
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { first_name, last_name, image_url, email_addresses } = evt.data;
    try {
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses
      );

      if (user && eventType === "user.created") {
        try {
          const clerk = await clerkClient();
          await clerk.users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: user._id,
            },
          });
        } catch (error) {
          console.log("Error:Could not update user metadata:", error);
        }
      }
    } catch (error) {
      console.log("Error:Could not create or update user:", error);
      return new Response("Error:Could not create or update user:", {
        status: 400,
      });
    }

    console.log(`User created or updated`);
  }
  // if (evt.type === "user.updated") {
  //   console.log(`User updated`);
  // }
  if (eventType === "user.deleted") {
    try {
      await deleteUser(id);
    } catch (error) {
      console.log("Error:Could not delete user:", error);
      return new Response("Error:Could not delete user:", {
        status: 400,
      });
    }

    console.log(`User deleted`);
  }

  return new Response("Webhook received", { status: 200 });
}
