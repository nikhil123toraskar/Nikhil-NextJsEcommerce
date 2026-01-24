import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";

// NOTE: clientId can stay hardcoded for now (we’ll env-ify later)
const wixClient = createClient({
  modules: { products },
  auth: OAuthStrategy({
    clientId: process.env.WIX_CLIENT_ID || "5604bf31-0355-43b0-8c7a-6f8d1265f8db" ,
  }),
});

export async function fetchProductsByIds(ids) {
  const result = await wixClient.products
    .queryProducts()
    .in("id", ids)
    .find();

  // Build quick lookup map
  const map = {};
  for (const item of result.items) {
    map[item._id] = item;
  }

  return map;
}
