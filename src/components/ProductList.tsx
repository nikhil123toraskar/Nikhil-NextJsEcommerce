import Image from "next/image"
import Link from "next/link"

const ProductList = () => {
    return (
        <div className='flex gap-x-8 gap-y-6 mt-12 justify-between flex-wrap'>
            <Link
                href='/test'
                className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]">
                <div className='relative w-full h-80'>

                    <Image
                        src='https://images.pexels.com/photos/3697717/pexels-photo-3697717.jpeg'
                        alt=""
                        fill
                        sizes="25vw"
                        className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
                    />

                    <Image
                        src='https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg'
                        alt=""
                        fill
                        sizes="25vw"
                        className="absolute object-cover rounded-md"
                    />
                </div>
                <div className='flex justify-between'>
                    <span className="font-medium">Product Name</span>
                    <span className="font-semibold">Rs. 499</span>
                </div>
                <div className=''>My Description</div>
                <button className='rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-sm hover:bg-lama hover:text-white'>Add to Cart</button>
            </Link>

            <Link
                href='/test'
                className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]">
                <div className='relative w-full h-80'>

                    <Image
                        src='https://images.pexels.com/photos/3434962/pexels-photo-3434962.jpeg'
                        alt=""
                        fill
                        sizes="25vw"
                        className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
                    />

                    <Image
                        src='https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg'
                        alt=""
                        fill
                        sizes="25vw"
                        className="absolute object-cover rounded-md"
                    />
                </div>
                <div className='flex justify-between'>
                    <span className="font-medium">Product Name</span>
                    <span className="font-semibold">Rs. 499</span>
                </div>
                <div className=''>My Description</div>
                <button className='rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-sm hover:bg-lama hover:text-white'>Add to Cart</button>
            </Link>

            <Link
                href='/test'
                className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]">
                <div className='relative w-full h-80'>

                    <Image
                        src='https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg'
                        alt=""
                        fill
                        sizes="25vw"
                        className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
                    />

                    <Image
                        src='https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg'
                        alt=""
                        fill
                        sizes="25vw"
                        className="absolute object-cover rounded-md"
                    />
                </div>
                <div className='flex justify-between'>
                    <span className="font-medium">Product Name</span>
                    <span className="font-semibold">Rs. 499</span>
                </div>
                <div className=''>My Description</div>
                <button className='rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-sm hover:bg-lama hover:text-white'>Add to Cart</button>
            </Link>

            <Link
                href='/test'
                className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]">
                <div className='relative w-full h-80'>

                    <Image
                        src='https://images.pexels.com/photos/4355342/pexels-photo-4355342.jpeg'
                        alt=""
                        fill
                        sizes="25vw"
                        className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
                    />

                    <Image
                        src='https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg'
                        alt=""
                        fill
                        sizes="25vw"
                        className="absolute object-cover rounded-md"
                    />
                </div>
                <div className='flex justify-between'>
                    <span className="font-medium">Product Name</span>
                    <span className="font-semibold">Rs. 499</span>
                </div>
                <div className=''>My Description</div>
                <button className='rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-sm hover:bg-lama hover:text-white'>Add to Cart</button>
            </Link>
        </div>
    )
}

export default ProductList