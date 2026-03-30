"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import AiLoader from "./AiLoader";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const currentSearchParams = searchParams?.toString() ?? "";

  useEffect(() => {
    setIsSearching(false);
  }, [currentSearchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = formData.get("name")?.toString().trim();

    if (!query) return;

    const params = new URLSearchParams();
    params.set("name", query);

    const newSearchParams = params.toString();
    if (newSearchParams === currentSearchParams) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    router.push(`/shop?${newSearchParams}`);
  };

  return (
    <div className="flex items-center gap-3 flex-1">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-4 bg-gray-100 p-2 rounded-md flex-1"
      >
        <input
          name="name"
          type="text"
          placeholder="Search with AI…"
          className="flex-1 bg-transparent outline-none"
        />
        <button type="submit">
          <Image src="/search.png" alt="" width={16} height={16} />
        </button>
      </form>
      {isSearching ? <AiLoader fullScreen /> : null}
    </div>
  );
};

export default SearchBar;

