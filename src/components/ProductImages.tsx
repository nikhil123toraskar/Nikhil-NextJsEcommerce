"use client"

import Image from "next/image"
import { useState } from "react";


const ProductImages = ({items}:{items:any}) => {
    const [index, setIndex] = useState(0);

  return (
    <div className="">
      <div className="h-[500px] relative">
        <Image
          src={items[index].image.url}
          alt=""
          sizes="50vw"
          fill
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex flex-row gap-4 justify-between cursor-pointer">
        {
        items.map((item:any,i:number) => (
            <div className="hover:scale-110 hover:z-50 hover:border-2 hover:rounded-md hover:border-gray-400 w-1/4 h-32 relative gap-4 mt-8" key={item._id} onMouseEnter={()=>setIndex(i)} onClick={() => setIndex(i)}>
                <Image
                    src={item.image.url}
                    alt=""
                    fill
                    sizes="30vw"
                    className="rounded-md object-cover"
                />
            </div>
        ))}
      </div>
    </div>
  );
}

export default ProductImages