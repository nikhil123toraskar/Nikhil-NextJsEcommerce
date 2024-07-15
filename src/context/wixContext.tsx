"use client"

import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import Cookies from "js-cookie";
import { createContext, ReactNode } from "react";

const refreshToken = JSON.parse(Cookies.get("refreshToken") || "{}");

const wixClient = createClient({
    modules: {
        products,
        collections,
        //services
    },
    auth: OAuthStrategy({
        clientId: '5604bf31-0355-43b0-8c7a-6f8d1265f8db',//process.env.NEXTJS_PUBLIC_WIX_CLIENTID!,
        tokens: {
            refreshToken, accessToken: { value: "", expiresAt: 0 },
        },
    }),
});

export type WixClient = typeof wixClient;

export const WixClientContext = createContext<WixClient>(wixClient);

export const WixClientContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <WixClientContext.Provider value={wixClient}>
      {children}
    </WixClientContext.Provider>
  );
};
