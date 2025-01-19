import { OAuthStrategy, createClient } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { cookies } from "next/headers";
import { members } from '@wix/members';


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
           // orders,
            members,
        },
        auth: OAuthStrategy({
            clientId: process.env.NEXT_PUBLIC_WIX_CLIENTID!,
            tokens: {
                refreshToken, accessToken: { value: "", expiresAt: 0 },
            },
        }),
    });

    return wixClient;
}