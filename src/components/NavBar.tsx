"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession, authClient } from "@/lib/auth-client";
import { MoreVertical, User, Settings, HelpCircle, LogOut, Sun, Moon, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const links = [
  { href: "/", label: "Home" },
  { href: "/lessons", label: "Lessons" },
  { href: "/challenges", label: "Challenges" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const { setTheme } = useTheme();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    const loadProfile = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch("/api/profile", {
          headers: { "x-user-id": session.user.id },
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!aborted) {
          setAvatarUrl(data?.avatarUrl || null);
          setDisplayName(data?.displayName || null);
        }
      } catch (_) {}
    };
    loadProfile();
    return () => {
      aborted = true;
    };
  }, [session?.user?.id]);

  const handleSignOut = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : "";
    const { error } = await authClient.signOut({
      fetchOptions: { headers: { Authorization: `Bearer ${token}` } },
    });
    if (!error?.code) {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
    }
  };

  const go = (href: string) => router.push(href);

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <img src="/ecolearn-icon.svg" alt="EcoLearn logo" className="h-6 w-6" />
          <span className="leading-none">EcoLearn</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className="hidden sm:block">
                <Button variant={active ? "default" : "ghost"} className={active ? "bg-green-600 hover:bg-green-700 text-white" : ""}>
                  {label}
                </Button>
              </Link>
            );
          })}

          {/* Auth-aware actions */}
          {isPending ? (
            <div className="ml-2 h-9 w-[220px] animate-pulse rounded-md bg-foreground/10" aria-hidden />
          ) : session?.user ? (
            <div className="ml-2 flex items-center gap-1">
              {/* Profile avatar always visible in navbar */}
              <Button variant="ghost" size="icon" className="hover:bg-foreground/10" onClick={() => go("/profile")}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl ?? undefined} alt={displayName ?? session.user.name ?? "Profile"} />
                  <AvatarFallback className="bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Open profile</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-foreground/10">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48">
                  {/* Nav links (mobile) */}
                  {links.map(({ href, label }) => (
                    <DropdownMenuItem key={href} onClick={() => go(href)} className="sm:hidden">
                      {label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="sm:hidden" />
                  {/* Theme */}
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" /> Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" /> Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" /> System
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {/* Removed Profile from More menu */}
                  <DropdownMenuItem onClick={() => go("/settings")}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => go("/about")}>
                    <HelpCircle className="mr-2 h-4 w-4" /> Help
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
              </Link>
              {/* Theme menu for guests */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-foreground/10">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-40">
                  {/* Nav links (mobile) */}
                  {links.map(({ href, label }) => (
                    <DropdownMenuItem key={href} onClick={() => go(href)} className="sm:hidden">
                      {label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="sm:hidden" />
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" /> Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" /> Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" /> System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}