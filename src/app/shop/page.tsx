import ProductList from "@/components/ProductList";
import ShopClient from "./shopClient";
import { headers } from "next/headers";

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
      /* =========================================
         Dynamically resolve correct base URL
      ========================================= */

      const headersList = headers();
      const host = headersList.get("host");

      const protocol = "http";

      const baseUrl = `${protocol}://${host}`;

      /* =========================================
         Call recommend API
      ========================================= */

      const res = await fetch(
        `${baseUrl}/api/ai/recommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchParams.name,
          }),
          cache: "no-store",
        }
      );

      if (!res.ok) {
        console.error("Recommend API failed:", res.status);
      } else {
        const data = await res.json();

        if (Array.isArray(data?.result?.results)) {
          aiProductIds = data.result.results.map(
            (r: any) => r.id
          );
        }
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