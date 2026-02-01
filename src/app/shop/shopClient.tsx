"use client";

import { Suspense } from "react";
import AiLoader from "@/components/AiLoader";

export default function ShopClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <Suspense fallback={<AiLoader />}>
        {children}
      </Suspense>
    </div>
  );
}