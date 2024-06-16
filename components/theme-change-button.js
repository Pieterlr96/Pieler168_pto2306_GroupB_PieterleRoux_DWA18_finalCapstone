import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/appUI/button";
import { useRouter } from 'next/router'; 
import { createClient } from '@supabase/supabase-js'; 


// Dynamic import for client-side rendering
const DropdownMenu = React.lazy(() =>
  import("@/components/appUI/dropdown-menu")
);
const DropdownMenuContent = React.lazy(() =>
  import("@/components/appUI/dropdown-menu").then((mod) => ({
    default: mod.DropdownMenuContent,
  }))
);
const DropdownMenuItem = React.lazy(() =>
  import("@/components/appUI/dropdown-menu").then((mod) => ({
    default: mod.DropdownMenuItem,
  }))
);
const DropdownMenuTrigger = React.lazy(() =>
  import("@/components/appUI/dropdown-menu").then((mod) => ({
    default: mod.DropdownMenuTrigger,
  }))
);

function ThemeChangeButton() {
  const router = useRouter(); // Call useRouter at the top level
  const [supabase, setSupabase] = React.useState(null);

  React.useEffect(() => {
    // Removed the routerInstance code since useRouter is now called at the top level

    // For async operations not related to hooks, use an IIFE or directly use promises
    (async () => {
      const supabaseInstance = await createClient();
      setSupabase(supabaseInstance);
    })();
  }, []);

  return { router, supabase };
}


export function ModeToggle({ setUser }) {
  const { router, supabase } = useInitialize();

  const handleLogout = async () => {
    if (!supabase) return;

    try {
      await supabase.auth.signOut();
      localStorage.removeItem("history");
      sessionStorage.removeItem("user");
      router.push("/");
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const [open, setOpen] = React.useState(false);

  if (!DropdownMenu || !DropdownMenuContent || !DropdownMenuItem || !DropdownMenuTrigger || !router || !supabase) {
    // Components not yet loaded, return placeholder or loading indicator
    return <div>Loading...</div>;
  }

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
