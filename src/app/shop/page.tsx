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
  const isAIMode = searchParams?.mode === "ai";
  let aiProductIds: string[] | undefined = undefined;
  console.log("isAIMode:", isAIMode, "searchParams:", searchParams);

  /* =========================
     AI SEARCH ORCHESTRATION
  ========================== */
  if (isAIMode && searchParams?.name) {
    try {
      const res = await fetch(
        "api/ai/recommend",
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

      if (Array.isArray(data?.result?.results)) {
        aiProductIds = data.result.results.map((item: any) => item.id);
      }
    } catch (err) {
      console.error("AI search failed:", err);
    }
  }

 return (
  <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
   
      <ProductList
        searchParams={searchParams}
        aiProductIds={aiProductIds}
        showPagination={false}
      />
  </div>
);
};

export default ShopPage;


