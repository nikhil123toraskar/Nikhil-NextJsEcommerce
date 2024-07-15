import Image from "next/image"
import Link from "next/link"
import { wixClientServer } from "@/lib/wixClientServer";

const CategoryList = async () => {

    const wixClient = await wixClientServer();

    const cats = await wixClient.collections
    .queryCollections()
    .find();


  return (
      <div className='px-4 overflow-x-scroll scroll-hide' >
          <div className='flex gap-8 md:gap-8'>
              {cats.items.map((item) => (
                  <Link
                      key={item._id}
                      href={`/list?cat=${item.slug}`}
                      className="flex-shrink-0 sm:w-1/2 lg:w-1/4 xl:w-1/6">
                      <div className='relative bg-no-repeat bg-center bg-contain bg-slate-100 shadow-md shadow-gray-500 w-full min-w-60 block lg:w-full h-96 max-h-120 sm:max-w-96'>
                          <Image
                              src={item.media?.mainMedia?.image?.url || "cat.png"}
                              alt=""
                              fill
                          />
                      </div>
                      <h1 className="mt-4 font-semibold text-cl tracking-wide">{item.name}</h1>
                  </Link>))}
          </div>

    </div>
  )
}

export default CategoryList