"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { ModeToggle } from "../theme-change-button";
import { Button } from "../appUI/button";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/appUI/sheet";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Context } from "@/State";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function Navbar() {
  const router = useRouter();
  const { dispatch } = useContext(Context);
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    localStorage.removeItem("history");
    sessionStorage.removeItem("user");
    router.push("/");
    setUser(null);
  };
  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      // console.log("get user ---->", user);
      dispatch({ type: "User", payload: user });
      // setLoading(false);
    }

    getUser();
  }, []);
  return (
    <nav className="z-50 fixed top-0 right-0 left-0 p-4  text-white font-semibold tracking-wide flex justify-between items-center bg-[#030712] h-[60px]">
      <Link href="/" className="text-2xl uppercase pl-2">
        PODCAST
      </Link>

      <div className="min-[520px]:flex gap-2  items-center pr-2 hidden">
        {user ? (
          <ModeToggle setUser={setUser} className="mr-2" />
        ) : (
          <>
            <Link href="/login" className="mr-2">
              <Button size="">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="">Register</Button>
            </Link>
          </>
        )}
      </div>
      <div className=" min-[520px]:hidden">
        <Sheet>
          <SheetTrigger>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 justify-start">
              {user ? (
                <>
                  <Link href="/favorite">
                    <SheetClose asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-sm p-2 justify-start w-full border-b rounded-none"
                      >
                        Favorite Podcasts
                      </Button>
                    </SheetClose>
                  </Link>
                  <Link href="/history">
                    <SheetClose asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-sm p-2 justify-start w-full border-b rounded-none"
                      >
                        Listening History
                      </Button>
                    </SheetClose>
                  </Link>
                  <SheetClose asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-sm p-2 justify-start w-full border-b rounded-none"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </SheetClose>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <SheetClose asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-sm p-2 justify-start w-full border-b rounded-none"
                      >
                        Login
                      </Button>
                    </SheetClose>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-sm p-2 justify-start w-full border-b rounded-none"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export default Navbar;
