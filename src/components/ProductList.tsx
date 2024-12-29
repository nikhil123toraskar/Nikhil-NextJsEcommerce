

import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image"
import Link from "next/link"
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";

const PRODUCT_PER_PAGE = 8;

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId?: string;
  limit?: number;
  searchParams?: any;
}) => {

  const wixClient = await wixClientServer();

  let productQuery = wixClient.products
    .queryProducts()
    .startsWith("name", searchParams?.name || "")
    .eq("collectionIds", categoryId)
    .hasSome("productType", [searchParams?.type || "physical", "digital"])
    .gt("priceData.price", searchParams?.min || 0)
    .lt("priceData.price", searchParams?.max || 9999999)
    .limit(limit || PRODUCT_PER_PAGE)
    .skip(searchParams?.page ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE) : 0)
 
    if(searchParams?.sort){
      const [sortType, sortBy] = searchParams.sort.split(" ");

      if(sortType === "asc"){
        productQuery = productQuery.ascending(sortBy);
      }
      if(sortType === "desc"){
        productQuery = productQuery.descending(sortBy);
      }
    }
    const res = await productQuery.find();

    console.log(res);


  return (
    <div className="flex gap-x-8 gap-y-6 mt-12 justify-between flex-wrap">
      {res.items.map((product: products.Product) => (
        <Link
          href={"/" + product.slug}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
          key={product._id}
        >
          <div className="relative w-full h-80">
            {product.media?.mainMedia?.image?.url && (
              <Image
                src={product.media?.mainMedia?.image?.url || "/product.png"}
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
              />
            )}
            {product.media?.items && (
              <Image
                src={product.media?.items[1].image?.url || "/product.png"}
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex justify-between gap-4">
            <span className="w-3/4 font-medium">{product.name}</span>
            <span className="w-1/4 flex-2 font-semibold">₹ {product.priceData?.price}</span>
          </div>

          {product.additionalInfoSections && (
            <div className="text-sm text-gray-500" dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                    product.additionalInfoSections.find(
                (section: any) => section.title === "ShortDesc"
              )?.description || ""
              ),
              }}>
            </div>
          )}

          <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-sm hover:bg-lama hover:text-white">
            Add to Cart
          </button>
        </Link>
        
      ))}
        <Pagination currentPage={res.currentPage || 0} hasPrev={res.hasPrev()} hasNext={res.hasNext()}/>
    </div>
  );
};

export default ProductList