"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import * as Avatar from "@radix-ui/react-avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function ModeToggle({ setUser }) {
  const { setTheme } = useTheme();
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    localStorage.removeItem("history");
    sessionStorage.removeItem("user");
    router.push("/");
    setUser(null);
  };
  React.useEffect(() => {
    setTheme("dark");
  }, []);
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Action</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href="/favorite">
          <DropdownMenuItem>Favorite Shows</DropdownMenuItem>
        </Link>
        <Link href="/history">
          <DropdownMenuItem>Listening History</DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
