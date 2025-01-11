import CategoryList from "@/components/CategoryList"
import Loading from "@/components/Loading"
import ProductList from "@/components/ProductList"
import Slider from "@/components/Slider"
import { WixClientContext } from "@/context/wixContext"
import { useWixClient } from "@/hooks/useWixClient"
import { wixClientServer } from "@/lib/wixClientServer"
import { Suspense, useContext, useEffect } from "react"

const HomePage = async () => {

/*   const wixClient = useWixClient();

  useEffect(() => {
    const getProducts = async () => {
      const res = await wixClient.products.queryProducts().find();
      console.log(res);
    };

    getProducts();
  }, [wixClient]);
 */

/*   const wixClient = await wixClientServer();

  const res = await wixClient.products.queryProducts().find();

  console.log(res);
 */
  return (
    <div className=''>
      <Slider/>

      <div className='mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64'>
        <h1 className="text-2xl font-semibold"> Featured Products</h1>
        <Suspense fallback={<Loading />} >
          <ProductList showPagination={false} limit={4} categoryId = {process.env.FEATURED_PRODUCT_CATEGORY_ID!}/>
        </Suspense>

      </div>

      <div className='mt-24'>
        <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 font-semibold mb-12">Categories</h1>
        <Suspense fallback={<Loading />} >    
        <CategoryList />
        </Suspense>
      </div>

      <div className='mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64'>
        <h1 className="text-2xl font-semibold"> New Products</h1>
        <Suspense fallback={<Loading />} >
          <ProductList showPagination={false} limit={8} categoryId = {process.env.NEXT_CATEGORY_ID!}/>
        </Suspense>
       {/*  <ProductList /> */}
      </div>

    </div>
  )
}

export default HomePage