"use client";

import { IoMdSearch } from "react-icons/io";
import SearchResult from "./SearchResult";
import { useState, useRef, useEffect } from "react";

export default function SearchEvent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchRef} // Attach the ref
      className="border border-white rounded-lg backdrop-blur-lg w-full lg:w-2/3 2xl:w-1/2 cursor-pointer group flex flex-col overflow-hidden"
      onClick={() => setIsSearchOpen(!isSearchOpen)}
    >
      <div className="flex items-center gap-1 p-4 w-full">
        <IoMdSearch className="size-6 fill-white" />
        <input
          type="text"
          placeholder="Dans quel évènement souhaitez-vous participer?"
          className="outline-0 bg-transparent placeholder:font-normal text-white w-full cursor-pointer"
        />
      </div>

      <div
        className={`
          border-white  text-white overflow-y-auto scrollbar-hide no-scrollbar 
          transition-all duration-300 ease-in-out origin-top
          ${
            isSearchOpen
              ? "max-h-[calc(800px-4rem)] border-t"
              : "max-h-0 border-0"
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-3 p-4">
          <div className="border border-white/70 text-sm flex flex-wrap sm:flex-row justify-between rounded w-full px-4 py-2">
            <button className="focus:bg-primaryBlue rounded-lg px-3 py-2 flex-shrink-0 flex-grow-0 text-left">
              Tous les résultats
            </button>
            <button className="focus:bg-primaryBlue rounded-lg px-3 py-2 flex-shrink-0 flex-grow-0 text-left">
              Évènements
            </button>
            <button className="focus:bg-primaryBlue rounded-lg px-3 py-2 flex-shrink-0 flex-grow-0 text-left">
              Lieu
            </button>
            <button className="focus:bg-primaryBlue rounded-lg px-3 py-2 flex-shrink-0 flex-grow-0 text-left">
              Artistes
            </button>
          </div>

          <span className="text-sm font-light self-start">
            Résultats de la recherche
          </span>
          {[...Array(5)].map((_, index) => (
            <SearchResult key={index} />
          ))}
          <button className="bg-white text-black self-center p-3 rounded-xl">
            Plus de résultats
          </button>
        </div>
      </div>
    </div>
  );
}
