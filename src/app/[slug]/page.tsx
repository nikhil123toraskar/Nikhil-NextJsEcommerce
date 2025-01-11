import Add from "@/components/Add"
import CustomizeProducts from "@/components/CustomizeProducts"
import ProductImages from "@/components/ProductImages"
import { wixClientServer } from "@/lib/wixClientServer"
import { notFound } from "next/navigation"
import DOMPurify from "isomorphic-dompurify";

const SinglePage = async ({params} : {params: {slug: string}}) => {


  const wixClient = await wixClientServer();

  const products = await wixClient.products
  .queryProducts()
  .eq("slug",params.slug)
  .find();

  if(!products.items[0]){
    return notFound()
  }

  const product = products.items[0];
  
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/*IMG*/}
      <div className="w-full lg:w-1/2 lg:sticky top-28 h-max">
        <ProductImages items={product.media?.items}></ProductImages>
      </div>
      {/*TEXTS*/}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="mt-8 font-medium text-4xl">{product.name}</h1>
        <div
          className="text-gray-500"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product.description || ""),
          }}
        ></div>
        <div className="h-[2px] bg-gray-100"></div>
        {product.priceData?.price === product.priceData?.discountedPrice ? (
          <h2 className="font-medium text-2xl">
            ₹{product.priceData?.discountedPrice}
          </h2>
        ) : (
          <div className="flex items-center gap-4">
            <h3 className="line-through text-gray-500 text-xl">
              ₹{product.priceData?.price}
            </h3>
            <h2 className="font-medium text-2xl">
              ₹{product.priceData?.discountedPrice}
            </h2>
          </div>
        )}
        <div className="h-[2px] bg-gray-100"></div>
        {product.variants && product.productOptions ? (
          <CustomizeProducts
            productId={product._id!}
            variants={product.variants}
            productOptions={product.productOptions!}
          />
        ) : (
          <Add productId={product._id!} variantId = "00000000-0000-0000-000000000000" stockNumber={product.stock?.quantity || 0}></Add>
        )}

        <div className="h-[2px] bg-gray-100"></div>
        {product.additionalInfoSections?.map((section: any) => (
          <div className="text-sm" key={section.title}>
            <h1 className="font-medium">{section.title}</h1>
            <div
              className="text-gray-500"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(section.description),
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SinglePage