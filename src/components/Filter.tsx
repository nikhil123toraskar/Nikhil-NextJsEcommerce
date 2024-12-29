
"use client"
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ChangeEvent, ReactEventHandler } from "react";

const Filter = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {replace} = useRouter();

    const handleChange=(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const {name, value} = e.target;
        console.log(name, value);
        const params = new URLSearchParams(searchParams);
        params.set(name, value);
        replace(`${pathname}?${params.toString()}`)
    }

  return (
    <div className='mt-12 flex justify-between'>
        <div className='flex gap-6 flex-wrap'>
            <select onChange={handleChange} name="type" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
                <option>Type</option>
                <option value="physical">physical</option>
                <option value="digital">digital</option>
            </select>
            <input onChange={handleChange} type="text" name="min" placeholder="min price" className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"/>
            <input onChange={handleChange} type="text" name="max" placeholder="max price" className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"/>
            
            <select onChange={handleChange} name="cat" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
                <option>Category</option>``
                <option value="new">New Arrival</option>
                <option value="popular">Popular</option>
            </select>
            <select onChange={handleChange} name="" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
                <option>All Filters</option>
            </select>
        </div>
        <div className=''>
        <select onChange={handleChange} name="sort" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-400">
                
                <option>Sort By</option>
                <option value="asc price">Price (Low to High)</option>
                <option value="desc price">Price (High to Low)</option>
                <option value="asc lastUpdated">Newest</option>
                <option value="desc lastUpdated">Oldest</option>
            </select>
        </div>
    </div>
  )
}

export default Filter