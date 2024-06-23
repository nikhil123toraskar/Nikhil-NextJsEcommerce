"use client"

import Image from "next/image"
import { useState } from "react";

const images = [
  {
    id: 1,
    url: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg",
  },
  {
    id: 2,
    url: "https://images.pexels.com/photos/277667/pexels-photo-277667.jpeg",
  },
  {
    id: 3,
    url: "https://images.pexels.com/photos/7031412/pexels-photo-7031412.jpeg",
  },
  {
    id: 4,
    url: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg  ",
  },
];

const ProductImages = () => {
    const [index, setIndex] = useState(0);

  return (
    <div className="">
      <div className="h-[500px] relative">
        <Image
          src={images[index].url}
          alt=""
          sizes="50vw"
          fill
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex flex-row gap-4 mt-8 justify-between cursor-pointer">
        {
        images.map((img,i) => (
            <div className="w-1/4 h-32 relative gap-4 mt-8" key={img.id} onClick={() => setIndex(i)}>
                <Image
                    src={img.url}
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