import Stripe from "stripe";
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const body = await req.text();
  const whsec = process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whsec);
  } catch (err:any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  // TODO: mark user entitlement
  return new Response("ok", { status: 200 });
}
