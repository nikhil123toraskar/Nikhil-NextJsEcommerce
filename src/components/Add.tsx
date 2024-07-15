"use client";
import { useState } from "react";

const Add = ({
  productId,
  variantId,
  stockNumber,
}: {
  productId: string;
  variantId: string;
  stockNumber: number;
}) => {
  const [quantity, seQuantity] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      <h4>Choose a Quantity</h4>
      <div className="flex justify-between ">
        <div className="flex items-center gap-6">
          <div className="flex justify-between items-center py-2 px-4 rounded-3xl gap-6 w-36 ring-gray-300 bg-gray-100 ">
            <button
              onClick={() => seQuantity(quantity - 1)}
              disabled={quantity == 0}
            >
              -
            </button>
            {quantity}
            <button onClick={() => seQuantity(quantity + 1)}  disabled={quantity == stockNumber} >+</button>
          </div>
          <div className="text-xs">
            Only <span className="text-orange-500">{stockNumber} items</span> left! <br />{" "}
            {"Don't"} miss it
          </div>
        </div>
        <div className="flex justify-evenly cursor-pointer gap-4 rounded-3xl w-36 py-2 px-6 ring-1 text-lama text-sm ring-lama bg-white hover:bg-lama hover:text-white">
          <button>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Add;
