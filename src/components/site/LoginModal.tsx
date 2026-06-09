import { useEffect, useState } from "react";
import { X, Phone, User as UserIcon, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login, register, modalTab } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(modalTab);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTab(modalTab);
      setError(null);
    }
  }, [open, modalTab]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = tab === "login"
      ? await login(phone, password)
      : await register({ phone, name, password });
    setLoading(false);
    if (!res.ok) setError(res.error || "Có lỗi xảy ra.");
    else {
      setPhone(""); setName(""); setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-background shadow-2xl">
        <div className="relative bg-gradient-leaf p-7 text-center">
          <button onClick={onClose} aria-label="Đóng" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/70 hover:bg-white">
            <X className="h-4 w-4" />
          </button>
          <h2 className="text-2xl font-extrabold">
            {tab === "login" ? "Đăng nhập TINGO" : "Tạo tài khoản TINGO"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {tab === "login"
              ? "Đăng nhập bằng số điện thoại để tiếp tục."
              : "Đăng ký nhanh bằng số điện thoại của bạn."}
          </p>
        </div>

        <div className="p-6">
          <div className="mb-4 flex rounded-full bg-secondary p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setTab("login"); setError(null); }}
              className={`flex-1 rounded-full px-3 py-2 transition ${tab === "login" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => { setTab("register"); setError(null); }}
              className={`flex-1 rounded-full px-3 py-2 transition ${tab === "register" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Đăng ký
            </button>
          </div>

          <form className="space-y-3" onSubmit={onSubmit}>
            {tab === "register" && (
              <InputRow icon={<UserIcon className="h-4 w-4" />}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Họ và tên"
                  className="w-full bg-transparent text-sm outline-none"
                  required
                />
              </InputRow>
            )}
            <InputRow icon={<Phone className="h-4 w-4" />}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Số điện thoại (VD: 0901234567)"
                className="w-full bg-transparent text-sm outline-none"
                required
                inputMode="tel"
                autoComplete="tel"
              />
            </InputRow>
            <InputRow icon={<Lock className="h-4 w-4" />}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className="w-full bg-transparent text-sm outline-none"
                required
                autoComplete={tab === "login" ? "current-password" : "new-password"}
              />
            </InputRow>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-ocean px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : tab === "login" ? "Đăng nhập" : "Đăng ký ngay"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {tab === "login" ? (
              <>Chưa có tài khoản?{" "}
                <button onClick={() => { setTab("register"); setError(null); }} className="font-semibold text-leaf hover:underline">
                  Đăng ký ngay
                </button>
              </>
            ) : (
              <>Đã có tài khoản?{" "}
                <button onClick={() => { setTab("login"); setError(null); }} className="font-semibold text-leaf hover:underline">
                  Đăng nhập
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function InputRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 focus-within:border-leaf">
      <span className="text-muted-foreground">{icon}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
