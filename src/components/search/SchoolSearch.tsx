"use client";

import { useState, useRef, useEffect } from "react";
import { useSchoolSearch } from "@/hooks/useSchoolSearch";
import type { School } from "@/lib/maps/types";

interface SchoolSearchProps {
  onSelect: (school: School) => void;
  selectedSchool: School | null;
}

export function SchoolSearch({ onSelect, selectedSchool }: SchoolSearchProps) {
  const { query, setQuery, results, isComposingRef } = useSchoolSearch();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(school: School) {
    onSelect(school);
    setQuery(school.name);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-xl">
      <input
        type="text"
        value={selectedSchool && !isOpen ? selectedSchool.name : query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={(e) => {
          isComposingRef.current = false;
          setQuery(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false);
        }}
        placeholder="학교 이름으로 검색..."
        className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-slate-500 outline-none ring-blue-500/50 transition-all focus:border-blue-500/30 focus:ring-2"
      />
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#111827] shadow-2xl">
          {results.map((school) => (
            <li key={school.id}>
              <button
                className="w-full px-5 py-3 text-left transition-colors hover:bg-white/5"
                onClick={() => handleSelect(school)}
              >
                <span className="block text-sm font-medium text-white">{school.name}</span>
                <span className="block text-xs text-slate-500">{school.address}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
