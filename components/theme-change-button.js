import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/appUI/button";

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

// Dynamic import for client-side rendering
const useRouter = () => import("next/router").then((mod) => mod.useRouter);
const createClient = () =>
  import("@supabase/supabase-js").then((mod) => mod.createClient);

export function ModeToggle({ setUser }) {
  const [router, setRouter] = React.useState(null);
  const [supabase, setSupabase] = React.useState(null);

  React.useEffect(() => {
    useRouter().then((router) => setRouter(router));
    createClient().then((supabase) => setSupabase(supabase));
  }, []);

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
