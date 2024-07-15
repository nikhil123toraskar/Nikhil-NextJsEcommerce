import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import Image from "next/image";
import { wixClientServer } from "@/lib/wixClientServer";
import { Suspense } from "react";



const ListPage = async ({searchParams} : {searchParams? : any}) => {


    const wixClient = await wixClientServer();

    const cats = await wixClient.collections
    .getCollectionBySlug(searchParams.cat || "all-products");


    
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/*CAMPAIGN*/}
      <div className="bg-gradient-to-r from-pink-100 to-pink-200 px-4` flex justify-between h-64">
        <div className="w-1/2 sm:w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-lg sm:text-4xl font-semibold sm:leading-[48px] text-black">
            Grab up to 50% off on <br /> Selected Products
          </h1>
          <button className="text-xs py-2 px-4 rounded-3xl w-max bg-lama sm:text-sm sm:py-3 sm:px-5 text-white">
            Buy Now
          </button>
        </div>
        <div className="relative w-1/2 sm:w-1/3">
          <Image
            src="/woman.png"
            alt=""
            fill
            className="object-contain"
          ></Image>
        </div>
      </div>
      {/*Filter*/}
      <Filter></Filter>
       {/*Product Component*/}
      <h1 className="mt-12 text-xl font-semibold">Shoes For You!</h1>
      <Suspense fallback={"Loading....."}>
     
      <ProductList categoryId={cats.collection?._id || "00000000-000000-000000-000000000001" } searchParams={searchParams}/>
      </Suspense>
    </div>
  );
};

export default ListPage;
