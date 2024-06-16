"use client";
import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/config/supabaseClient";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const user = session.user;
        const { data, error } = await supabase.from("users").upsert([
          {
            id: user.id,
            email: user.email,
            username: user.email.split('@')[0], // Default username
          }
        ]);

        if (error) {
          console.error("Error upserting user:", error);
        } else {
          sessionStorage.setItem("user", JSON.stringify(user));
          router.push("/");
        }
      } else if (event === "SIGNED_OUT") {
        sessionStorage.removeItem("user");
        router.push("/login");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="w-[400px] mx-4">
        <h1 className="text-3xl text-center text-bold">Register</h1>
        <Auth
          view="sign_up"
          supabaseClient={supabase}
          providers={[]}
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
          showLinks={false}
          theme="dark"
        />
        <Link href='/login'>
          <p className="text-center text-sm hover:text-blue-400 mt-2">
            Already have an account? Sign in.
          </p>
        </Link>
      </div>
    </div>
  );
}
