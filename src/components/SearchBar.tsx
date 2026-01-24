"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchBar = () => {
  const router = useRouter();
  const [aiMode, setAiMode] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = formData.get("name")?.toString().trim();

    if (!query) return;

    const baseUrl = `/shop?name=${encodeURIComponent(query)}`;
    const finalUrl = aiMode ? `${baseUrl}&mode=ai` : baseUrl;

    router.push(finalUrl);
  };

  return (
    <div className="flex items-center gap-3 flex-1">
      {/* AI Toggle */}
      <button
        type="button"
        onClick={() => setAiMode((prev) => !prev)}
        className={`px-3 py-2 rounded-md text-sm font-medium border transition
          ${
            aiMode
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        title="Toggle AI search"
      >
        AI
      </button>

      {/* Search form */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-4 bg-gray-100 p-2 rounded-md flex-1"
      >
        <input
          name="name"
          type="text"
          placeholder={aiMode ? "Search with AI…" : "Search products"}
          className="flex-1 bg-transparent outline-none"
        />
        <button type="submit">
          <Image src="/search.png" alt="" width={16} height={16} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
