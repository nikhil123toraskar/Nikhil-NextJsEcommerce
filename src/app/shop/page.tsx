import ProductList from "@/components/ProductList";

type ShopPageProps = {
  searchParams?: {
    name?: string;
    mode?: string;
    page?: string;
    sort?: string;
    min?: string;
    max?: string;
    type?: string;
  };
};

const ShopPage = async ({ searchParams }: ShopPageProps) => {
    console.log("ShopPage searchParams:", searchParams);
  const isAIMode = searchParams?.mode=== "ai";
  console.log("Is AI Mode:", isAIMode);
  let aiProductIds: string[] | undefined = undefined;

  /* =========================
     AI SEARCH ORCHESTRATION
  ========================== */
  if (isAIMode && searchParams?.name) {
    try {
      const res = await fetch(
        "http://localhost:3000/api/ai/recommend",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchParams.name,
          }),
          cache: "no-store",
        }
      );

      const data = await res.json();
      console.log("AI Recommendation Data:", data);

        if (Array.isArray(data?.result?.results)) {
            aiProductIds = data.result.results.map((item: any) => item.id);
        }
        console.log("AI Product IDs:", aiProductIds);
    } catch (err) {
      console.error("AI search failed:", err);
    }
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <ProductList
        searchParams={searchParams}
        aiProductIds={aiProductIds}
        showPagination={!isAIMode}
      />
    </div>
  );
};

export default ShopPage;
