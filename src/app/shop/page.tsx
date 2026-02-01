import ProductList from "@/components/ProductList";
import ShopClient from "./shopClient";

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
  let aiProductIds: string[] | undefined = undefined;

  if (searchParams?.name) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/recommend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchParams.name }),
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (Array.isArray(data?.result?.results)) {
        aiProductIds = data.result.results.map((r: any) => r.id);
      }
    } catch (err) {
      console.error("AI search failed:", err);
    }
  }

  return (
    <ShopClient>
      <ProductList
        searchParams={searchParams}
        aiProductIds={aiProductIds}
        showPagination={false}
      />
    </ShopClient>
  );
};

export default ShopPage;