import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { bootstrapAdminIfEmpty } from "@/lib/media.functions";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const bootstrap = useServerFn(bootstrapAdminIfEmpty);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const refresh = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user ? { email: data.user.email ?? undefined } : null);
    if (data.user) {
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!role);
    } else {
      setIsAdmin(false);
    }
  };
  useEffect(() => { refresh(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      const fn = mode === "signin" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
      const { error } = await fn.call(supabase.auth, { email, password });
      if (error) throw error;
      await refresh();
      setMsg(mode === "signin" ? "Đăng nhập thành công." : "Đăng ký thành công. Bạn có thể bootstrap admin bên dưới.");
    } catch (err) {
      setMsg((err as Error).message);
    } finally { setLoading(false); }
  };

  const doBootstrap = async () => {
    setLoading(true); setMsg(null);
    try {
      const res = await bootstrap();
      await refresh();
      setMsg(res.granted ? "Đã cấp quyền Admin cho tài khoản này." : res.isAdmin ? "Bạn đã là admin." : "Đã có admin khác trong hệ thống — không thể bootstrap.");
    } catch (err) { setMsg((err as Error).message); }
    finally { setLoading(false); }
  };

  const signOut = async () => { await supabase.auth.signOut(); await refresh(); };

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản trị Media</h1>
          <Link to="/" className="text-xs text-ocean hover:underline">← Về trang chủ</Link>
        </div>

        {user ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-secondary p-3 text-sm">
              Đăng nhập: <b>{user.email}</b><br />
              Quyền admin: {isAdmin ? <span className="text-emerald-600 font-bold">CÓ</span> : <span className="text-red-600 font-bold">CHƯA</span>}
            </div>
            {!isAdmin && (
              <button onClick={doBootstrap} disabled={loading} className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
                Bootstrap Admin (chỉ chạy được nếu chưa có admin nào)
              </button>
            )}
            <button onClick={signOut} className="w-full rounded-md border border-border px-4 py-2 text-sm">Đăng xuất</button>
            {isAdmin && (
              <p className="text-xs text-muted-foreground">
                Đã sẵn sàng lưu Media vĩnh viễn. Về <Link to="/" className="underline">trang chủ</Link>, thêm <code>?edit=true</code> vào URL nếu bạn đang ở domain production, sau đó bấm nút <b>Import Media</b> (màu xanh lá = chế độ Cloud) trên từng ảnh/video.
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="flex gap-2 text-sm">
              <button type="button" onClick={() => setMode("signin")} className={`flex-1 rounded-md px-3 py-1.5 ${mode === "signin" ? "bg-foreground text-background" : "bg-secondary"}`}>Đăng nhập</button>
              <button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-md px-3 py-1.5 ${mode === "signup" ? "bg-foreground text-background" : "bg-secondary"}`}>Đăng ký</button>
            </div>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@tingoshop.com" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu (≥ 6 ký tự)" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <button type="submit" disabled={loading} className="w-full rounded-md bg-ocean px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
              {loading ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập" : "Đăng ký"}
            </button>
          </form>
        )}

        {msg && <div className="mt-4 rounded-md bg-secondary p-3 text-xs">{msg}</div>}
      </div>
    </div>
  );
}
