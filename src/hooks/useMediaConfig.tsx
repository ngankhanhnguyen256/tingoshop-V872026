import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

type MediaEntry = { url: string; media_type: string };
type MediaMap = Record<string, MediaEntry>;

type Ctx = {
  ready: boolean;
  isAdmin: boolean;
  userEmail: string | null;
  resolve: (key: string | undefined, fallback: string) => string;
  resolveType: (key: string | undefined, fallback: "image" | "video") => "image" | "video";
  save: (key: string, file: File) => Promise<{ url: string; media_type: string }>;
  refresh: () => Promise<void>;
};

const MediaCtx = createContext<Ctx | null>(null);

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export function MediaConfigProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<MediaMap>({});
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("media_config")
      .select("key,url,media_type");
    if (error) console.error("[MediaConfig] load error", error);
    const next: MediaMap = {};
    (data ?? []).forEach((row) => {
      next[row.key] = { url: row.url, media_type: row.media_type };
    });
    setMap(next);
    setReady(true);
  }, []);

  const checkAdmin = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAdmin(false);
      setUserEmail(null);
      return;
    }
    setUserEmail(user.email ?? null);
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (error) console.error("[MediaConfig] role check error", error);
    setIsAdmin(!!data);
  }, []);

  useEffect(() => {
    load();
    checkAdmin();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
        checkAdmin();
      }
    });
    return () => { sub.subscription.unsubscribe(); };
  }, [load, checkAdmin]);

  const resolve = useCallback(
    (key: string | undefined, fallback: string) => (key && map[key]?.url) || fallback,
    [map],
  );
  const resolveType = useCallback(
    (key: string | undefined, fallback: "image" | "video") =>
      (key && (map[key]?.media_type as "image" | "video")) || fallback,
    [map],
  );

  const save = useCallback(
    async (key: string, file: File) => {
      if (!key) throw new Error("Thiếu mediaKey");
      // Verify session at call time (không phụ thuộc vào state race)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Chưa đăng nhập. Mở /admin để đăng nhập trước.");

      const safeKey = key.replace(/[^a-z0-9_.-]/gi, "_");
      const ext = file.name.split(".").pop() || "bin";
      const path = `${safeKey}/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
      if (upErr) throw new Error(`Upload lỗi: ${upErr.message}`);

      const { data: signed, error: signErr } = await supabase.storage
        .from("media")
        .createSignedUrl(path, TEN_YEARS);
      if (signErr || !signed) throw new Error(`Sign URL lỗi: ${signErr?.message ?? "unknown"}`);

      const media_type = file.type.startsWith("video") ? "video" : "image";
      const url = signed.signedUrl;

      const { error: dbErr } = await supabase
        .from("media_config")
        .upsert({ key, url, media_type, updated_by: user.id }, { onConflict: "key" });
      if (dbErr) throw new Error(`Ghi DB lỗi: ${dbErr.message} (cần quyền admin)`);

      setMap((prev) => ({ ...prev, [key]: { url, media_type } }));
      return { url, media_type };
    },
    [],
  );

  const value = useMemo<Ctx>(
    () => ({ ready, isAdmin, userEmail, resolve, resolveType, save, refresh: load }),
    [ready, isAdmin, userEmail, resolve, resolveType, save, load],
  );

  return <MediaCtx.Provider value={value}>{children}</MediaCtx.Provider>;
}

export function useMediaConfig(): Ctx {
  const ctx = useContext(MediaCtx);
  if (!ctx) throw new Error("useMediaConfig must be used within MediaConfigProvider");
  return ctx;
}
