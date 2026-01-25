"use client";

import { Suspense } from "react";
import ProductList from "@/components/ProductList";

export default function ShopClient({
  searchParams,
  aiProductIds,
}: {
  searchParams: any;
  aiProductIds?: string[];
}) {
  return (
    <Suspense
      key={searchParams?.name} // 🔥 THIS is the fix
      fallback={<div className="py-20 text-center">🤖 AI is thinking…</div>}
    >
      <ProductList
        searchParams={searchParams}
        aiProductIds={aiProductIds}
        showPagination={false}
      />
    </Suspense>
  );
}
