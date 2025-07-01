import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req: Request) {
  type ClerkEvent = {
    data: { id: string };
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
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix_signature");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt:ClerkEvent;

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

  const { id } = evt.data;
//   const eventType = evt.type;

  if (evt.type === "user.created") {
    console.log(`User created ${id}`);
  }
  if (evt.type === "user.updated") {
    console.log(`User updated ${id}`);
  }
  if (evt.type === "user.deleted") {
    console.log(`User deleted ${id}`);
  }

  return new Response("Webhook received", { status: 200 });
}
