import { OAuthStrategy, createClient } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { cookies } from "next/headers";


export const wixClientServer = async () => {

    let refreshToken;
    try {

        const cookieStore = cookies()
        refreshToken = JSON.parse(cookieStore.get("refreshToken")?.value || "{}");

    } catch (error) {

    }

    const wixClient = createClient({
        modules: {
            products,
            collections,
            //services
        },
        auth: OAuthStrategy({
            clientId: process.env.NEXTJS_PUBLIC_WIX_CLIENTID!,
            tokens: {
                refreshToken, accessToken: { value: "", expiresAt: 0 },
            },
        }),
    });

    return wixClient;
}