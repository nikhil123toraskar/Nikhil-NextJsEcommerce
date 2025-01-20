"use client"

import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cart from "./CartModel";
import { useWixClient } from "@/hooks/useWixClient";
import Cookies from "js-cookie";
import { useCartStore } from "@/hooks/useCartStore";

const NavIcons = () => {
  const cartRef = useRef<HTMLDivElement>(null);



  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);

  const myWixClient = useWixClient();
  const isLoggedIn = myWixClient.auth.loggedIn();
  const router = useRouter()

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsProfileOpen(prev => !prev);
    }
  }

  const {cart, counter, getCart} = useCartStore();

  useEffect(()=> {
      
      getCart(myWixClient);

  }, [myWixClient,getCart]);

  //AUTH with WIX managed login

  // const login = async () => {
  //   const loginRequestData = myWixClient.auth.generateOAuthData(
  //     "http://localhost:3000/"
  //   );
    

  //   localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequestData));
  //   const { authUrl} = await myWixClient.auth.getAuthUrl(loginRequestData);
  //   window.location.href = authUrl;
  // }

  const handleLogout = async ()=> {
    setIsLoading(true);
    Cookies.remove("refreshToken");
    const { logoutUrl } = await myWixClient.auth.logout(window.location.href);
    setIsLoading(false);
    setIsProfileOpen(false);
    router.push(logoutUrl);
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        onClick={handleProfile}
        src="/profile.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
      />
      {isProfileOpen && (
        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-10">
          <Link href="/">Profile</Link>
          <div onClick={handleLogout} className="mt-2 cursor-pointer">{isLoading ? "Logging out" : "Logout"}</div>
        </div>
      )}
      <Image
        src="/notification.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
      />
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image
          src="/cart.png"
          alt=""
          width={22}
          height={22}
          className="cursor-pointer"
        />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-lama flex items-center text-sm text-white justify-center rounded-full">
          {counter}
        </div>
      </div>
      <div ref={cartRef}>
      {isCartOpen && <Cart></Cart>}
    </div>
    </div>
  );
}

export default NavIcons