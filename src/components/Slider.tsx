"use client"

import { transform } from "next/dist/build/swc"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const slides = [
  {
    id: 1,
    title: "Affordable Luxury At Your Fingertips",
    description: "Sale! Up to 50% off!",
    //img: "https://www.berrylush.com/cdn/shop/files/1_ec81a72a-19c5-46e3-8cb6-6fb15c32a0ad.jpg?v=1708597063&width=700",
    img:"/55.jpg",
    url: "/",
    bg: "bg-gradient-to-r from-green-100 to-white-50"
  },
  {
    id: 2,
    title: "New Arrivals dropping every week!",
    description: "Curated Collections for every mood",
    //img: "https://www.berrylush.com/cdn/shop/products/6_6d691086-9e93-4f2e-ab3b-49f31777ec42.jpg?v=1696351500&width=700",
    img: "/88888.jpg",
    url: "/",
    bg: "bg-gradient-to-r from-pink-50 to-blue-300"
  },
  {
    id: 3,
    title: "Bold Looks for the Bright Days",
    description: "Shop the Street Style Edit!",
    //img: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600",
    img:"/slider3.jpg",
    url: "/",
    bg: "bg-gradient-to-r from-green-50 to-purple-50"
  }
]

const Slider = () => {
  const [current, setCurrent] = useState(0);

  //  useEffect(()=> {
  //   const interval = setInterval(()=> {
  //     setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  //   }, 3000);

  //   return () => clearInterval(interval);
    
  //}) 

  return (
    <div className='h-[calc(100vh-80px)] overflow-hidden shadow-md'>
      <div className='w-max h-full flex transition-all ease-in-out duration-1000'
      style={ {transform: `translateX(-${current * 100}vw)`} }>
        {slides.map((slide) => (
          <div className={`${slide.bg} w-screen flex flex-col gap-16 xl:flex-row`} key={slide.id}>
            {/*TEXT CONTAINER*/}
            <div className='h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center'>
              <h2 className='font-serif text-xl lg:text-3xl 3xl:text-5xl'>{slide.description}</h2>
              <h1 className='text-5xl lg:text-6xl 2xl:text-8xl font-semibold'>{slide.title}</h1>
              <Link href={slide.url}>
                <button className="hover:bg-gray-700 rounded-md bg-black text-white py-3 px-4">SHOP NOW</button>
              </Link>
            </div>
            {/*IMAGE CONTAINER*/}
            <div className='h-1/2 xl:w-1/2 xl:h-full relative'>
              <Image src={slide.img} alt="" fill sizes="100%" className='object-cover' style={{objectPosition: '50% 0%'}}/>
            </div>
          </div>
        ))}
      </div>
      <div className='absolute m-auto left-1/2 bottom-8 flex gap-4'>
      {
        slides.map((slide, index)=> (
          <div
          className={`w-3 h-3 rounded-full ring-1 ring-black cursor-pointer flex items-center justify-center
          ${current === index ? "scale-150" : ""}`}
          key={slide.id}
          onClick={()=> setCurrent(index)}
          >
          { current === index && ( <div className='w-[6px] h-[6px] bg-black rounded-full'></div>) }
          </div>
        ))
      }
      </div>
    </div>
  )
}

export default Slider


