const Filter = () => {
  return (
    <div className='mt-12 flex justify-between'>
        <div className='flex gap-6 flex-wrap'>
            <select name="type" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
                <option>Type</option>
                <option value="physical">physical</option>
                <option value="digital">digital</option>
            </select>
            <input type="text" name="min" placeholder="min price" className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"/>
            <input type="text" name="max" placeholder="max price" className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"/>
            <select name="size" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
                <option>Size</option>
                <option value="">xl</option>
                <option value="">2xl</option>
            </select>
            <select name="Color" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
                <option>Color</option>
                <option value="">black</option>
                <option value="">blue</option>
            </select>
            <select name="ribbon" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
                <option>Category</option>
                <option value="">New Arrival</option>
                <option value="">Popular</option>
            </select>
            <select name="" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
                <option>All Filters</option>
            </select>
        </div>
        <div className=''>
        <select name="" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-400">
                
                <option>Sort By</option>
                <option>Price (Low to High)</option>
                <option>Price (High to Low)</option>
                <option>Newest</option>
                <option>Oldest</option>
            </select>
        </div>
    </div>
  )
}

export default Filter