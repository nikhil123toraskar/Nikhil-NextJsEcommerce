import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";

const PRODUCT_PER_PAGE = 8;

type Props = {
  categoryId?: string;
  limit?: number;
  searchParams?: any;
  showPagination?: boolean;
  aiProductIds?: string[];
};

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
  showPagination = true,
  aiProductIds,
}: Props) => {
  const wixClient = await wixClientServer();

  const isAISearch =
    Array.isArray(aiProductIds) && aiProductIds.length > 0;

  let items: products.Product[] = [];
  let hasPrev = false;
  let hasNext = false;
  let currentPage = searchParams?.page
    ? parseInt(searchParams.page)
    : 0;

  /* =========================
     AI SEARCH (AI decides relevance)
  ========================== */
  if (isAISearch) {
    const res = await wixClient.products
      .queryProducts()
      .hasSome("_id", aiProductIds)
      .find();

    // Preserve AI ranking order
    items = aiProductIds
      .map(id => res.items.find(p => p._id === id))
      .filter(Boolean) as products.Product[];

    items = items.slice(0, PRODUCT_PER_PAGE);
  }

  /* =========================
     NON-AI FLOW (Wix decides relevance)
  ========================== */
  else {
    let productQuery = wixClient.products
      .queryProducts()
      .hasSome("productType", [
        searchParams?.type || "physical",
        "digital",
      ])
      .gt("priceData.price", searchParams?.min || 0)
      .lt("priceData.price", searchParams?.max || 9999999)
      .limit(limit || PRODUCT_PER_PAGE)
      .skip(
        searchParams?.page
          ? parseInt(searchParams.page) *
              (limit || PRODUCT_PER_PAGE)
          : 0
      );

    if (categoryId) {
      productQuery = productQuery.eq("collectionIds", categoryId);
    }

    if (searchParams?.sort) {
      const [sortType, sortBy] = searchParams.sort.split(" ");
      if (sortType === "asc") productQuery = productQuery.ascending(sortBy);
      if (sortType === "desc") productQuery = productQuery.descending(sortBy);
    }

    const res = await productQuery.find();
    items = res.items;
    hasPrev = res.hasPrev();
    hasNext = res.hasNext();
    showPagination = true;

    /* 🔍 Text filtering (UI-side, optional) */
    
    if (searchParams?.name) {
      const query = searchParams.name.toLowerCase();
      items = items.filter(product =>
        product.name?.toLowerCase().includes(query)
      );
    }
  }

  return (
    <div>
      <div className="flex gap-x-8 gap-y-6 mt-12 justify-between flex-wrap">
        {items.map((product: products.Product) => (
          <Link
            href={"/" + product.slug}
            className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
            key={product._id}
          >
            <div className="relative w-full h-80">
              {product.media?.mainMedia?.image?.url && (
                <Image
                  src={product.media.mainMedia.image.url}
                  alt=""
                  fill
                  sizes="25vw"
                  className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity duration-500"
                />
              )}
              {product.media?.items?.[1]?.image?.url && (
                <Image
                  src={product.media.items[1].image.url}
                  alt=""
                  fill
                  sizes="25vw"
                  className="absolute object-cover rounded-md"
                />
              )}
            </div>

            <div className="flex justify-between gap-4">
              <span className="w-3/4 font-medium">{product.name}</span>
              <span className="w-1/4 font-semibold">
                ₹ {product.priceData?.price}
              </span>
            </div>

            {product.additionalInfoSections && (
              <div
                className="text-sm text-gray-500"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    product.additionalInfoSections.find(
                      (s: any) => s.title === "ShortDesc"
                    )?.description || ""
                  ),
                }}
              />
            )}

            <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-sm hover:bg-lama hover:text-white">
              Add to Cart
            </button>
          </Link>
        ))}
      </div>

      {showPagination  && (
        <Pagination
          currentPage={currentPage}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}
    </div>
  );
};

export default ProductList;
