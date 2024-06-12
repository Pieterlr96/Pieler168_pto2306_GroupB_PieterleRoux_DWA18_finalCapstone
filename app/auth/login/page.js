"use client";
import React from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  supabase.auth.onAuthStateChange( async (event, session) => {
    

    if (event === "INITIAL_SESSION") {
      // router.push("/");
      // handle initial session
    } else if (event === "SIGNED_IN") {
      const isUser = sessionStorage.getItem("user");
      if(!isUser){

        sessionStorage.setItem("user", JSON.stringify(session.user));
        router.push("/");
        router.refresh();
      }
      // handle sign in event
    } else if (event === "SIGNED_OUT") {
      // handle sign out event
    } else if (event === "PASSWORD_RECOVERY") {
      // handle password recovery event
    } else if (event === "TOKEN_REFRESHED") {
      // handle token refreshed event
    } else if (event === "USER_UPDATED") {
      // handle user updated event
    }
  });
  // call unsubscribe to remove the callback
  // data.subscription.unsubscribe();
  
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="w-[400px] mx-4">
        <h1 className="text-3xl text-center text-bold">Login</h1>
        <Auth
          view="sign_in"
          supabaseClient={supabase}
          providers={[]}
          redirectTo="/"
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "red",
                  brandAccent: "darkred",
                },
              },
            },
          }}
          // link_text={()=>router.push("/register")}
          showLinks={false}
          theme="dark"
        />
        <Link href='/register'>
          <p className="text-center text-sm hover:text-blue-400 mt-2">
            Don&rsquo;t have an account?{" "}Register
          </p>
        </Link>
      </div>
    </div>
  );
}
