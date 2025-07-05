import { Webhook } from "svix";
// import { headers } from "next/headers";
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

  // const headerPayload =  headers();
  // const svix_id = headerPayload.get("svix-id");
  // const svix_timestamp = headerPayload.get("svix-timestamp");
  // const svix_signature = headerPayload.get("svix_signature");


  console.log("About to run the req.headers....")
  const svix_id = req.headers.get("svix-id") ?? "";
  const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
  const svix_signature = req.headers.get("svix-signature") ?? "";
    console.log("req.headers retrieved")

  if (!svix_id || !svix_signature || !svix_timestamp) {
    console.log("Missing headers", { svix_id, svix_signature, svix_timestamp });
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  };

  console.log("req.headers confirmed...")

  // const payload = await req.json();
  // const payload = await req.text();
  // const body = JSON.stringify(payload);
  const body = await req.text()

  let evt: ClerkEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    }) as ClerkEvent;
    console.log("This is the evt properties:",evt)
  } catch (error) {
    console.log("Error:Could not verify webhook:", error);
    return new Response("Error:verification error", {
      status: 400,
    });
  }

  const { id } = evt?.data;
  const eventType = evt.type;
  console.log("this is the eventType:",eventType)

  if (eventType === "user.created" || eventType === "user.updated") {
    const { first_name, last_name, image_url, email_addresses } = evt.data;
    console.log("Ran successfully...")
    try {
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses
      );
      console.log("Ran createOrUpdateUser successfully...")

      if (user && eventType === "user.created") {
        try {
          const clerk = await clerkClient();
          await clerk.users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: user._id,
            },
          });
          console.log("Ran updateUserMetadata successfully...")
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
