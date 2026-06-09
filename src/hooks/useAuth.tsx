import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// TODO: Dán URL Webhook (Google Sheets / Make / Zapier) để xuất dữ liệu User
export const USER_WEBHOOK_URL = "";
// TODO: Dán URL Webhook nhận đơn hàng mới
export const ORDER_WEBHOOK_URL = "";

const USER_KEY = "tingo_user_v1";
const USERS_KEY = "tingo_users_v1";

export type TingoUser = {
  phone: string;
  name: string;
  createdAt: string;
};

type StoredUser = TingoUser & { password: string };

type AuthCtx = {
  user: TingoUser | null;
  isAuthenticated: boolean;
  loginModalOpen: boolean;
  modalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  login: (phone: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { phone: string; name: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

function loadUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveUsers(list: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

async function postWebhook(url: string, payload: unknown) {
  if (!url) return; // chưa cấu hình
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // tránh CORS chặn khi dùng webhook đơn giản
      mode: "no-cors",
    });
  } catch (e) {
    console.warn("[TINGO] Webhook lỗi:", e);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TingoUser | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"login" | "register">("login");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const openAuthModal = useCallback((tab: "login" | "register" = "login") => {
    setModalTab(tab);
    setLoginModalOpen(true);
  }, []);
  const closeAuthModal = useCallback(() => setLoginModalOpen(false), []);

  const login = useCallback<AuthCtx["login"]>(async (phone, password) => {
    const p = phone.replace(/\s+/g, "").trim();
    if (!p || !password) return { ok: false, error: "Vui lòng nhập đầy đủ thông tin." };
    const users = loadUsers();
    const found = users.find((u) => u.phone === p);
    if (!found) return { ok: false, error: "Số điện thoại chưa được đăng ký." };
    if (found.password !== password) return { ok: false, error: "Mật khẩu không đúng." };
    const next: TingoUser = { phone: found.phone, name: found.name, createdAt: found.createdAt };
    localStorage.setItem(USER_KEY, JSON.stringify(next));
    setUser(next);
    setLoginModalOpen(false);
    return { ok: true };
  }, []);

  const register = useCallback<AuthCtx["register"]>(async ({ phone, name, password }) => {
    const p = phone.replace(/\s+/g, "").trim();
    if (!/^0\d{8,10}$/.test(p)) return { ok: false, error: "Số điện thoại không hợp lệ." };
    if (!name.trim()) return { ok: false, error: "Vui lòng nhập họ tên." };
    if (password.length < 6) return { ok: false, error: "Mật khẩu cần tối thiểu 6 ký tự." };
    const users = loadUsers();
    if (users.some((u) => u.phone === p)) return { ok: false, error: "Số điện thoại đã được đăng ký." };
    const createdAt = new Date().toISOString();
    const stored: StoredUser = { phone: p, name: name.trim(), password, createdAt };
    users.push(stored);
    saveUsers(users);
    const next: TingoUser = { phone: stored.phone, name: stored.name, createdAt };
    localStorage.setItem(USER_KEY, JSON.stringify(next));
    setUser(next);
    setLoginModalOpen(false);

    // Đóng gói & gửi dữ liệu user ra webhook (Google Sheets / Make / Zapier)
    postWebhook(USER_WEBHOOK_URL, {
      type: "user_register",
      phone: next.phone,
      name: next.name,
      createdAt: next.createdAt,
    });

    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      isAuthenticated: !!user,
      loginModalOpen,
      modalTab,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      logout,
    }),
    [user, loginModalOpen, modalTab, openAuthModal, closeAuthModal, login, register, logout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      user: null,
      isAuthenticated: false,
      loginModalOpen: false,
      modalTab: "login",
      openAuthModal: () => {},
      closeAuthModal: () => {},
      login: async () => ({ ok: false, error: "Auth chưa sẵn sàng" }),
      register: async () => ({ ok: false, error: "Auth chưa sẵn sàng" }),
      logout: () => {},
    };
  }
  return ctx;
}

// Gửi đơn hàng ra webhook (dùng ở trang checkout)
export async function postOrderWebhook(payload: Record<string, unknown>) {
  await postWebhook(ORDER_WEBHOOK_URL, payload);
}
