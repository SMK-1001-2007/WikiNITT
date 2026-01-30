"use client";
import { signIn, useSession } from "next-auth/react";
import { UserMenu } from "@/components/Navbar";
import {
    Menu,
    Loader2,
} from 'lucide-react'
import LogoIcon from "@/components/logo.svg";
import Link from "next/link";

export default function LandingNavbar() {

    const { status } = useSession()

    return (
        <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-md border-b border-border-light shadow-sm">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button
                            type="button"
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg opacity-0 pointer-events-none cursor-default"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex ms-2 items-center group">
                            <LogoIcon className="h-8 w-8 mr-2 fill-white bg-blue-900 rounded-md p-1.5 group-hover:bg-blue-800 transition-colors" />
                            <span className="self-center text-xl font-bold whitespace-nowrap text-blue-900">
                                Wiki
                            </span>
                            <span className="self-center text-xl font-bold whitespace-nowrap text-amber-600">
                                NITT
                            </span>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            className="text-sm font-medium text-text-muted hover:text-blue-900 transition-colors"
                            href="/articles"
                        >
                            Articles
                        </Link>
                        <Link
                            className="text-sm font-medium text-text-muted hover:text-blue-900 transition-colors"
                            href="/c"
                        >
                            Community
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        {status === "loading" && (
                            <div className="w-8 h-8 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                            </div>
                        )}

                        {status === "unauthenticated" && (
                            <button
                                onClick={() => signIn("dauth")}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Login
                            </button>
                        )}

                        {status === "authenticated" && <UserMenu />}
                    </div>
                </div>
            </div>
        </header>
    )
}