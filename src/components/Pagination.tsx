"use client"
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const Pagination = ({ currentPage, hasPrev, hasNext }: { currentPage: number, hasPrev: boolean, hasNext: boolean }) => {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const createPageUrl = (pageNumber: number) => {
        
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        replace(`${pathname}?${params.toString()}`)
    };

    return (
        <div className='mt-12 flex justify-between w-full '>
            <button onClick={()=>createPageUrl(currentPage-1)} className="rounded-md text-white w-24 cursor-pointer disabled:cursor-not-allowed p-2 disabled:bg-pink-200 bg-lama px-4 text-sm " disabled={!hasPrev}>
                Previous
            </button>
            <button onClick={()=>createPageUrl(currentPage+1)} className="rounded-md text-white w-24 cursor-pointer disabled:cursor-not-allowed p-2 disabled:bg-pink-200 bg-lama px-4 text-sm" disabled={!hasNext}>
                Next
            </button>
        </div>
    )
}

export default Pagination