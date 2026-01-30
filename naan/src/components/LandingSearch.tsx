"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SearchModal } from "./SearchModal";

export function LandingSearch() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="w-full max-w-2xl relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="text-slate-400 group-focus-within:text-primary transition-colors w-6 h-6" />
                </div>
                <input
                    className="w-full h-16 pl-14 pr-4 rounded-2xl border border-slate-200 bg-white shadow-elegant text-lg placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none cursor-pointer"
                    placeholder="Search for professors, courses, clubs, or events..."
                    type="text"
                    readOnly
                    onClick={() => setIsOpen(true)}
                    onFocus={() => setIsOpen(true)}
                />
            </div>
            <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
