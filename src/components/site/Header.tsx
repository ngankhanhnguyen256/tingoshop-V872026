import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingCart, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { SearchOverlay } from "./SearchOverlay";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { label: "Trang Chủ", href: "#" },
  { label: "Sản Phẩm", href: "#products" },
  { label: "Combo Tiết Kiệm", href: "#products" },
  { label: "Câu Chuyện", href: "#journey" },
  { label: "Sức Khỏe", href: "#knowledge" },
  { label: "Theo Dõi Đơn Hàng", href: "/tra-cuu-don-hang" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { count } = useCart();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-ocean text-primary-foreground font-bold">T</span>
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-leaf">TIN</span>
            <span className="text-ocean">GO</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <a key={n.label} href={n.href} className="text-sm font-medium text-foreground/80 transition-colors hover:text-leaf">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen(true)} aria-label="Tìm kiếm" className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 hover:bg-secondary hover:text-foreground">
            <Search className="h-4.5 w-4.5" />
          </button>
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenu((v) => !v)}
                aria-label="Tài khoản"
                className="flex h-10 items-center gap-2 rounded-full bg-leaf-soft px-3 text-sm font-bold text-leaf hover:bg-leaf-soft/80"
              >
                <User className="h-4 w-4" />
                <span className="hidden max-w-[120px] truncate sm:inline">{user?.name}</span>
              </button>
              {userMenu && (
                <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
                  <div className="border-b border-border px-4 py-3">
                    <div className="text-sm font-bold">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">{user?.phone}</div>
                  </div>
                  <button
                    onClick={() => { setUserMenu(false); logout(); }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-destructive hover:bg-secondary"
                  >
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => openAuthModal("login")} aria-label="Đăng nhập" className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 hover:bg-secondary hover:text-foreground">
              <User className="h-4.5 w-4.5" />
            </button>
          )}
          <Link to="/checkout" aria-label="Giỏ hàng" className="relative grid h-10 w-10 place-items-center rounded-full text-foreground/70 hover:bg-secondary hover:text-foreground">
            <ShoppingCart className="h-4.5 w-4.5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-ocean px-1 text-[10px] font-bold text-ocean-foreground">
                {count}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} className="ml-1 grid h-10 w-10 place-items-center rounded-full hover:bg-secondary lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {nav.map((n) => (
              <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
