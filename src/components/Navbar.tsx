import Link from "next/link"
import Menu from "./Menu"
import Image from "next/image";
import SearchBar from "./SearchBar";
import dynamic from "next/dynamic";
//import NavIcons from "./NavIcons"; using dynamic import
const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const NavabarPage = () => {
  return (
    <div className='sticky top-0 z-50 bg-white shadow-md h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64'>
        {/*MOBILE*/}      
      <div className='h-full flex justify-between items-center md:hidden'>
        <Link href="/">
          {/* <div className="tracking-wide text-2xl">FastLane</div> */}
          <Image src="/mastercard.png" alt="" className='max-w-36 mt-4' width={180} height={180}/>
        </Link>
        <Menu></Menu>
      </div>
      {/*BIGGER SCREENS*/}
      <div className="sticky hidden md:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" >
            <Image src="/mastercard.png" alt="" className='max-w-36 mt-4' width={200} height={200}/>
           
          </Link>
          <div className='hidden xl:flex gap-4'>
            <Link href="/">Homepage</Link>
            <Link href="/">Shop</Link>
            <Link href="/">Deals</Link>
            <Link href="/">About</Link>
            <Link href="/">Contact</Link>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 flex items-center justify-between gap-8">
          <SearchBar/>
          <NavIcons/>
        </div>
      </div>
    </div>
  )
}

export default NavabarPage