import Stripe from "stripe";
export async function POST() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price_data: { currency:"usd", product_data:{ name:"Resume Export (No Watermark)" }, unit_amount: 350 }, quantity:1 }],
    success_url: process.env.NEXT_PUBLIC_APP_URL + "/generator?success=1",
    cancel_url: process.env.NEXT_PUBLIC_APP_URL + "/generator?canceled=1",
  });
  return Response.json({ url: session.url });
}
