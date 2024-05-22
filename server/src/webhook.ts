import { Webhook } from "svix";
import bodyParser from "body-parser";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import { Router } from "express";
import db from "./db/drizzle";
import { user } from "./db/schema";

const router = Router();

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async function (req, res) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("You need a WEBHOOK_SECRET in your .env");
    }

    // Get the headers and body
    const headers = req.headers;
    const payload = req.body;

    // Get the Svix headers for verification
    const svix_id = headers["svix-id"] as string;
    const svix_timestamp = headers["svix-timestamp"] as string;
    const svix_signature = headers["svix-signature"] as string;

    // If there are no Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If the verification fails, error out and  return error code
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err: any) {
      console.log("Error verifying webhook:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Do something with the payload
    // For this guide, you simply log the payload to the console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    console.log("Webhook body:", evt.data);

    if (eventType == "user.created") {
      const { universityName } = evt.data.unsafe_metadata;
      const emailAddress = evt.data.email_addresses[0].email_address;
      await db.insert(user).values({
        id: id!,
        email: emailAddress,
        firstName: evt.data.first_name!,
        lastName: evt.data.last_name!,
        universityName: universityName as string,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  }
);

export default router;