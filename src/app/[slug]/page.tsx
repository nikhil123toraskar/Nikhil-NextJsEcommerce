import Add from "@/components/Add"
import CustomizeProducts from "@/components/CustomizeProducts"
import ProductImages from "@/components/ProductImages"

const SinglePage = () => {
  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16'>
      {/*IMG*/}
      <div className=' w-full lg:w-1/2  lg:sticky top-20 h-max'>
      <ProductImages></ProductImages>
      </div>
      {/*TEXTS*/}
      <div className='w-full lg:w-1/2 flex flex-col gap-6'>
        <h1 className="font-medium text-4xl">Product Name</h1>
        <div className='text-gray-500'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed a optio quia
          quibusdam eveniet dolore sint eos distinctio, harum,
          eligendi possimus deleniti perferendis cupiditate ullam odit perspiciatis rem. Asperiores, quia!
        </div>
        <div className='h-[2px] bg-gray-100'></div>
        <div className='flex items-center gap-4'>
          <h3 className="line-through text-gray-500 text-xl">₹499</h3>
          <h2 className="font-medium text-2xl">₹449</h2>
        </div>
        <div className='h-[2px] bg-gray-100'></div>
        <CustomizeProducts></CustomizeProducts>
        <Add></Add>
        <div className='h-[2px] bg-gray-100'></div>
        <h1 className="font-medium">Product Information</h1>
        <div className='text-gray-500'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed a optio quia
          quibusdam eveniet dolore sint eos distinctio, harum,
          eligendi possimus deleniti perferendis cupiditate ullam odit perspiciatis rem. Asperiores, quia!
        </div>
        <h1 className="font-medium">Return and Refund Policy</h1>
        <div className='text-gray-500'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed a optio quia
          quibusdam eveniet dolore sint eos distinctio, harum,
          eligendi possimus deleniti perferendis cupiditate ullam odit perspiciatis rem. Asperiores, quia!
        </div>
        <h1 className="font-medium">Shipping Information</h1>
        <div className='text-gray-500'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed a optio quia
          quibusdam eveniet dolore sint eos distinctio, harum,
          eligendi possimus deleniti perferendis cupiditate ullam odit perspiciatis rem. Asperiores, quia!
        </div>
      </div>
    </div>
  )
}

export default SinglePage