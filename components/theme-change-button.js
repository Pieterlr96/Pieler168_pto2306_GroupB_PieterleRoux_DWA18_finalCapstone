import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/appUI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/appUI/dropdown-menu";
import supabase from "@/config/supabaseClient";
import { useRouter } from "next/navigation";

export function ModeToggle({ setUser }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Additional backend operations (if needed)
      localStorage.removeItem("history");
      sessionStorage.removeItem("user");
      router.push("/");
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

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
