"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, Loader2, Save } from "lucide-react";

type Profile = {
  id: number;
  userId: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
};

export default function ProfileForm() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<Profile>>({});

  const token = useMemo(
    () => (typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null),
    [typeof window]
  );

  useEffect(() => {
    let abort = false;
    async function load() {
      if (!session && !isPending) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/profile", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(session?.user?.id ? { "x-user-id": session.user.id } : {}),
          },
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`Failed to load profile (${res.status})`);
        }
        const data: Profile = await res.json();
        if (!abort) setForm(data);
      } catch (e: any) {
        if (!abort) setError(e.message || "Failed to load profile");
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => {
      abort = true;
    };
  }, [session, isPending, token]);

  const onChange = (key: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFilePick = async (file?: File) => {
    if (!file) return;
    // Convert to data URL for preview and storage. Server accepts data: URLs.
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setForm((prev) => ({ ...prev, avatarUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        displayName: (form.displayName ?? "").trim() || null,
        bio: (form.bio ?? "").trim() || null,
        avatarUrl: form.avatarUrl ?? null,
        twitterUrl: (form.twitterUrl ?? "").trim() || null,
        linkedinUrl: (form.linkedinUrl ?? "").trim() || null,
        githubUrl: (form.githubUrl ?? "").trim() || null,
        websiteUrl: (form.websiteUrl ?? "").trim() || null,
        instagramUrl: (form.instagramUrl ?? "").trim() || null,
        youtubeUrl: (form.youtubeUrl ?? "").trim() || null,
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(session?.user?.id ? { "x-user-id": session.user.id } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        const msg = err?.error || `Failed to save (${res.status})`;
        throw new Error(msg);
      }

      const updated: Profile = await res.json();
      setForm(updated);
      setSuccess("Profile updated");
      // Optionally refresh the route to update any server components
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return <div className="h-40 animate-pulse rounded-xl bg-foreground/5" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Please log in to edit your profile.</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button onClick={() => router.push("/auth/login?redirect=/profile")}>Login</Button>
          <Button variant="outline" onClick={() => router.push("/auth/signup")}>Create account</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-foreground/5" aria-hidden />
      ) : (
        <>
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-[96px_1fr] gap-6 sm:gap-8 items-start">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-20 w-20 ring-2 ring-emerald-200 dark:ring-emerald-900/40 shadow-sm">
                <AvatarImage src={(form.avatarUrl as string) || undefined} alt={form.displayName || "Avatar"} />
                <AvatarFallback>
                  {(form.displayName?.[0] || session.user.name?.[0] || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer rounded-md border px-2 py-1 hover:bg-accent">
                <Input type="file" accept="image/*" className="hidden" onChange={(e) => handleFilePick(e.target.files?.[0])} />
                <ImageIcon className="h-4 w-4" /> Upload
              </label>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 flex-1">
              <div>
                <Label htmlFor="displayName" className="mb-1.5 block text-sm font-medium">Display name</Label>
                <Input id="displayName" value={form.displayName ?? ""} onChange={onChange("displayName")} placeholder={session.user.name || "Your name"} className="h-10" />
              </div>
              <div>
                <Label htmlFor="bio" className="mb-1.5 block text-sm font-medium">Bio</Label>
                <Textarea id="bio" value={form.bio ?? ""} onChange={onChange("bio")} placeholder="Tell others about you" rows={4} className="min-h-[96px]" />
              </div>
              <div>
                <Label htmlFor="avatarUrl" className="mb-1.5 block text-sm font-medium">Avatar URL</Label>
                <Input id="avatarUrl" value={form.avatarUrl ?? ""} onChange={onChange("avatarUrl")} placeholder="https://... or leave empty to use upload" className="h-10" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <Label htmlFor="twitterUrl" className="mb-1.5 block text-sm font-medium">X (Twitter)</Label>
              <Input id="twitterUrl" value={form.twitterUrl ?? ""} onChange={onChange("twitterUrl")} placeholder="https://x.com/username" className="h-10" />
            </div>
            <div>
              <Label htmlFor="linkedinUrl" className="mb-1.5 block text-sm font-medium">LinkedIn</Label>
              <Input id="linkedinUrl" value={form.linkedinUrl ?? ""} onChange={onChange("linkedinUrl")} placeholder="https://linkedin.com/in/username" className="h-10" />
            </div>
            <div>
              <Label htmlFor="githubUrl" className="mb-1.5 block text-sm font-medium">GitHub</Label>
              <Input id="githubUrl" value={form.githubUrl ?? ""} onChange={onChange("githubUrl")} placeholder="https://github.com/username" className="h-10" />
            </div>
            <div>
              <Label htmlFor="websiteUrl" className="mb-1.5 block text-sm font-medium">Website</Label>
              <Input id="websiteUrl" value={form.websiteUrl ?? ""} onChange={onChange("websiteUrl")} placeholder="https://example.com" className="h-10" />
            </div>
            <div>
              <Label htmlFor="instagramUrl" className="mb-1.5 block text-sm font-medium">Instagram</Label>
              <Input id="instagramUrl" value={form.instagramUrl ?? ""} onChange={onChange("instagramUrl")} placeholder="https://instagram.com/username" className="h-10" />
            </div>
            <div>
              <Label htmlFor="youtubeUrl" className="mb-1.5 block text-sm font-medium">YouTube</Label>
              <Input id="youtubeUrl" value={form.youtubeUrl ?? ""} onChange={onChange("youtubeUrl")} placeholder="https://youtube.com/@channel" className="h-10" />
            </div>
          </div>

          <div className="pt-2 sm:pt-4 flex items-center gap-3">
            <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save changes
            </Button>
            <Button type="button" variant="outline" onClick={() => router.refresh()} disabled={saving}>
              Reset
            </Button>
          </div>
        </>
      )}
    </form>
  );
}