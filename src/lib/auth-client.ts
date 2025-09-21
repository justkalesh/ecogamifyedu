"use client"
import { createAuthClient } from "better-auth/react"
import { useEffect, useState } from "react"

export const authClient = createAuthClient({
   baseURL: typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL,
  fetchOptions: {
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : ""}`,
      },
      onSuccess: (ctx) => {
          const authToken = ctx.response.headers.get("set-auth-token")
          // Store the token securely (e.g., in localStorage)
          if(authToken){
            localStorage.setItem("bearer_token", authToken);
          }
      }
  }
});

type SessionData = ReturnType<typeof authClient.useSession>

export function useSession(): SessionData {
   const [session, setSession] = useState<any>(null);
   const [isPending, setIsPending] = useState(true);
   const [error, setError] = useState<any>(null);

   const refetch = () => {
      setIsPending(true);
      setError(null);
      fetchSession();
   };

   const ensureDeviceUserId = () => {
      if (typeof window === 'undefined') return;
      try {
        let uid = localStorage.getItem("x_user_id");
        if (!uid || !uid.trim()) {
          const gen = (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function')
            ? globalThis.crypto.randomUUID()
            : `device-${Math.random().toString(36).slice(2)}-${Date.now()}`;
          localStorage.setItem("x_user_id", gen);
        }
      } catch {}
   };

   const fetchSession = async () => {
      try {
         const res = await authClient.getSession({
            fetchOptions: {
               auth: {
                  type: "Bearer",
                  token: typeof window !== 'undefined' ? localStorage.getItem("bearer_token") || "" : "",
               },
            },
         });
         setSession(res.data);
         setError(null);

         // Sync x_user_id for personalized progress
         if (typeof window !== 'undefined') {
           if (res?.data?.user?.id) {
             localStorage.setItem("x_user_id", res.data.user.id);
           } else {
             ensureDeviceUserId();
           }
         }
      } catch (err) {
         setSession(null);
         setError(err);
         // No session -> ensure we still have a stable device id
         ensureDeviceUserId();
      } finally {
         setIsPending(false);
      }
   };

   useEffect(() => {
      // On first mount, ensure there's at least a device id before any UI mounts
      ensureDeviceUserId();
      fetchSession();
   }, []);

   return { data: session, isPending, error, refetch };
}