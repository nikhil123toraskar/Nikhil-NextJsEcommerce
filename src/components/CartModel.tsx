"use client"

import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import Image from "next/image";
import { media as wixMedia } from "@wix/sdk";

const Cart = () => {

    const wixClient = useWixClient();
    const {cart, isLoading, removeItem} = useCartStore();
    console.log(cart,'cart');



  return (
    <div className='w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-10 bg-white top-12 right-0 flex flex-col'>
        {isLoading ?  ("Loading...") : !cart.lineItems ? (
            <div className=''>Cart is empty</div>
        ) : (<>
        <h2 className='mb-6 left-6'>Shopping Cart</h2>
        <div className='flex flex-col gap-8'>
        {cart.lineItems.map(item=>(
            
            <div className='flex gap-6' key={item._id}>
               {item.image && <Image 
                    src={wixMedia.getScaledToFillImageUrl(item.image,72,96,{})}
                    alt=""
                    width={72}
                    height={96}
                    className='object-cover rounded-md'
                />}
                <div className='flex flex-col justify-between w-full'>
                    {/*TOP*/}
                    <div className=''>
                        {/*TITLE*/}
                            <div className='flex items-center justify-between gap-8'>
                                <h3 className="font-semibold">{item.productName?.original}</h3>
                                <div className='p-1 text-md bg-gray-50 rounded-sm flex items-center gap-2'>
                                  {item.quantity && item.quantity > 1 && <div className='text-xs text-green-500'>{item.quantity} x </div>} ₹ {item.price?.amount}</div>
                            </div>
                        {/*DESC*/}
                            <div className='text-sm text-gray-500'>
                                {item.availability?.status}
                            </div>
                        
                    </div>
                    {/*BOTTOM*/}
                    <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>Qty. {item.quantity}</span>
                            <span className='text-blue-500 cursor-pointer' onClick={()=>removeItem(wixClient,item._id!)} >Remove</span>
                        </div>
                </div>
            </div>
        ))}
            {/*BOTTOM*/}

            <div className=''>
                <div className='flex justify-between items-center font-semibold'>
                    <span className=''>Subtotal</span>
                    <span className=""></span>
                </div>
                
                    <p className='text-gray-500 text-sm mt-2 mb-4'>
                        Shipping and taxes calculated at the checkout
                    </p>

                <div className='flex justify-between text-sm'>
                    <button className='rounded-md py-2 px-4 ring-1 ring-gray-300'>View Cart</button>
                    <button className='rounded-md 
                    py-2 
                    px-4
                  bg-black
                  text-white
                    ring-1
                  ring-gray-300
                    cursor-pointer
                    disabled:cursor-not-allowed disabled:opacity-75' disabled={isLoading}>Checkout</button>
                </div>
            </div>
        
            </div>
            </>
        )}
    </div>
  )
}

export default Cart