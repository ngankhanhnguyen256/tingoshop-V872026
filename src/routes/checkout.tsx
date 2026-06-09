import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Lock, Minus, Plus, QrCode, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart, formatPrice } from "@/hooks/useCart";
import { useAuth, postOrderWebhook } from "@/hooks/useAuth";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Thanh Toán — TINGO" },
      { name: "description", content: "Hoàn tất đơn hàng TINGO của bạn an toàn và nhanh chóng." },
    ],
  }),
  component: CheckoutPage,
});

type Method = "cod" | "bank";

function randomOrderId() {
  return "TG" + Math.random().toString(36).slice(2, 7).toUpperCase() + Date.now().toString().slice(-4);
}

// Khoá lưu các đơn hàng vừa đặt (chưa sync lên Google Sheets) để trang tra cứu đọc
const PENDING_ORDERS_KEY = "tingo_pending_orders_v1";

export type PendingOrder = {
  orderId: string;
  customer: string;
  phone: string;
  address: string;
  note?: string;
  method: Method;
  total: number;
  orderDate: string;
  status: "Chờ xác nhận đơn";
  createdAt: string;
};

function savePendingOrder(o: PendingOrder) {
  try {
    const raw = localStorage.getItem(PENDING_ORDERS_KEY);
    const list: PendingOrder[] = raw ? JSON.parse(raw) : [];
    list.unshift(o);
    localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {}
}

function CheckoutPage() {
  const { items, subtotal, setQty, removeItem, clear } = useCart();
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [method, setMethod] = useState<Method>("cod");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBank, setShowBank] = useState(false);

  // Tự điền thông tin khi đã đăng nhập
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name,
        phone: f.phone || user.phone,
      }));
    }
  }, [user]);

  const shipping = 0;
  const total = subtotal + shipping;

  const canSubmit = useMemo(
    () => items.length > 0 && form.name.trim() && form.phone.trim() && form.address.trim(),
    [items, form],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // ÉP ĐĂNG NHẬP TRƯỚC KHI THANH TOÁN
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    const id = randomOrderId();
    const today = new Date();
    const orderDate = today.toLocaleDateString("vi-VN");

    // Tạo đơn với trạng thái mặc định "Chờ xác nhận đơn"
    const pending: PendingOrder = {
      orderId: id,
      customer: form.name.trim(),
      phone: form.phone.replace(/\s+/g, "").trim(),
      address: form.address.trim(),
      note: form.note.trim() || undefined,
      method,
      total,
      orderDate,
      status: "Chờ xác nhận đơn",
      createdAt: today.toISOString(),
    };
    savePendingOrder(pending);

    // Gửi đơn ra webhook (Google Sheets / Make / Zapier) - chuẩn bị cho cột "Trạng Thái Đơn Hàng"
    postOrderWebhook({
      type: "order_created",
      ...pending,
      items: items.map((it) => ({ id: it.id, name: it.name, qty: it.qty, price: it.price })),
    });

    setOrderId(id);
    if (method === "cod") setShowSuccess(true);
    else setShowBank(true);
  };

  const finishOrder = () => {
    clear();
    setShowSuccess(false);
    setShowBank(false);
    navigate({ to: "/tra-cuu-don-hang" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-leaf-soft/40 via-background to-background">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ocean hover:underline">
          <ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">
          Thanh toán <span className="text-gradient-brand">TINGO</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Hoàn tất đơn hàng của bạn — nhanh chóng, an toàn, miễn phí vận chuyển.</p>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            {/* LEFT — customer info */}
            <div className="space-y-6">
              <section className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
                <h2 className="text-xl font-extrabold">Thông tin nhận hàng</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Họ và tên *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Nguyễn Văn A" />
                  <Field label="Số điện thoại *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="09xx xxx xxx" />
                  <div className="sm:col-span-2">
                    <Field label="Địa chỉ nhận hàng *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Ghi chú đơn hàng
                    </label>
                    <textarea
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      rows={3}
                      placeholder="Thời gian nhận, lưu ý khi giao..."
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-leaf focus:ring-2 focus:ring-leaf/20"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
                <h2 className="text-xl font-extrabold">Phương thức thanh toán</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <PaymentOption
                    selected={method === "cod"}
                    onClick={() => setMethod("cod")}
                    icon={<Truck className="h-5 w-5" />}
                    title="Thanh toán khi nhận hàng"
                    desc="COD — kiểm tra hàng trước khi thanh toán"
                  />
                  <PaymentOption
                    selected={method === "bank"}
                    onClick={() => setMethod("bank")}
                    icon={<QrCode className="h-5 w-5" />}
                    title="Chuyển khoản ngân hàng"
                    desc="Quét QR — xác nhận tự động trong vài phút"
                  />
                </div>
              </section>
            </div>

            {/* RIGHT — order summary */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <section className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold">Đơn hàng của bạn</h2>
                  <span className="rounded-full bg-leaf-soft px-3 py-1 text-xs font-bold text-leaf">
                    {items.length} sản phẩm
                  </span>
                </div>

                <ul className="mt-5 divide-y divide-border">
                  {items.map((it) => (
                    <li key={it.id} className="flex gap-3 py-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-leaf">
                        {it.thumb ? (
                          <img src={it.thumb} alt={it.name} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="line-clamp-2 text-sm font-bold">{it.name}</h3>
                          <button
                            type="button"
                            onClick={() => removeItem(it.id)}
                            aria-label="Xoá"
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-border">
                            <button
                              type="button"
                              onClick={() => setQty(it.id, it.qty - 1)}
                              className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary"
                              aria-label="Giảm"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold">{it.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(it.id, it.qty + 1)}
                              className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary"
                              aria-label="Tăng"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-extrabold text-leaf">{it.price}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  <Row label="Tạm tính" value={formatPrice(subtotal)} />
                  <Row label="Phí vận chuyển" value={<span className="text-leaf">Miễn phí</span>} />
                  <div className="mt-3 flex items-center justify-between border-t border-dashed border-border pt-3">
                    <span className="text-base font-bold">Tổng cộng</span>
                    <span className="text-2xl font-extrabold text-leaf">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-ocean px-7 py-4 text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isAuthenticated ? <ShoppingBag className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {isAuthenticated ? "Xác nhận đặt hàng" : "Đăng nhập để thanh toán"}
                </button>
                {!isAuthenticated && (
                  <p className="mt-2 text-center text-xs font-semibold text-ocean">
                    Bạn cần đăng nhập bằng số điện thoại trước khi hoàn tất đơn hàng.
                  </p>
                )}
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Bằng việc đặt hàng, bạn đồng ý với Điều khoản & Chính sách bảo mật của TINGO.
                </p>

              </section>
            </aside>
          </form>
        )}
      </main>
      <Footer />

      {showSuccess && orderId && <SuccessModal orderId={orderId} total={total} onClose={finishOrder} />}
      {showBank && orderId && (
        <BankModal
          orderId={orderId}
          total={total}
          onConfirmed={() => {
            setShowBank(false);
            setShowSuccess(true);
          }}
          onClose={() => setShowBank(false)}
        />
      )}
    </div>
  );
}

function Field({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-leaf focus:ring-2 focus:ring-leaf/20"
      />
    </div>
  );
}

function PaymentOption({
  selected, onClick, icon, title, desc,
}: { selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
        selected
          ? "border-leaf bg-leaf-soft/50 shadow-soft"
          : "border-border bg-background hover:border-leaf/40"
      }`}
    >
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${selected ? "bg-gradient-ocean text-primary-foreground" : "bg-secondary text-foreground/70"}`}>
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-bold">{title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>
      </span>
      <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${selected ? "border-leaf bg-leaf text-primary-foreground" : "border-border"}`}>
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="mt-12 rounded-3xl border border-border bg-card p-12 text-center shadow-soft">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-leaf">
        <ShoppingBag className="h-7 w-7 text-primary-foreground" />
      </div>
      <h2 className="mt-4 text-2xl font-bold">Giỏ hàng đang trống</h2>
      <p className="mt-2 text-muted-foreground">Hãy thêm sản phẩm TINGO yêu thích vào giỏ để bắt đầu thanh toán.</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-ocean px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow"
      >
        Khám phá sản phẩm
      </Link>
    </div>
  );
}

function ModalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-glow animate-in fade-in zoom-in-95">
        {children}
      </div>
    </div>
  );
}

function SuccessModal({ orderId, total, onClose }: { orderId: string; total: number; onClose: () => void }) {
  return (
    <ModalShell>
      <div className="bg-gradient-ocean p-6 text-center text-primary-foreground">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/20 backdrop-blur">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-2xl font-extrabold">Đặt hàng thành công!</h3>
        <p className="mt-1 text-sm opacity-90">Cảm ơn bạn đã tin chọn TINGO 💚</p>
      </div>
      <div className="p-6">
        <div className="rounded-2xl bg-secondary/60 p-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mã đơn hàng</div>
          <div className="mt-1 text-2xl font-extrabold tracking-wider text-leaf">{orderId}</div>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm">
          <span className="text-muted-foreground">Tổng thanh toán</span>
          <span className="font-extrabold text-leaf">{formatPrice(total)}</span>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 24 giờ.
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-gradient-ocean px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft"
        >
          Hoàn tất
        </button>
      </div>
    </ModalShell>
  );
}

function BankModal({
  orderId, total, onConfirmed, onClose,
}: { orderId: string; total: number; onConfirmed: () => void; onClose: () => void }) {
  const content = `TINGO ${orderId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    `BANK:TINGO|AMOUNT:${total}|NOTE:${content}`,
  )}`;
  return (
    <ModalShell>
      <div className="p-6">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-leaf-soft text-leaf">
            <QrCode className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-xl font-extrabold">Quét mã QR để thanh toán</h3>
          <p className="mt-1 text-sm text-muted-foreground">Sử dụng app ngân hàng để quét mã bên dưới</p>
        </div>

        <div className="mt-5 grid place-items-center rounded-2xl border border-border bg-white p-4">
          <img src={qrUrl} alt={`QR thanh toán ${orderId}`} width={220} height={220} className="rounded-lg" />
        </div>

        <div className="mt-4 space-y-2 rounded-2xl bg-secondary/60 p-4 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Ngân hàng</span><span className="font-bold">Vietcombank</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Số tài khoản</span><span className="font-bold">0123 456 789</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Chủ tài khoản</span><span className="font-bold">CTY TINGO</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Số tiền</span><span className="font-extrabold text-leaf">{formatPrice(total)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Nội dung</span><span className="font-bold text-ocean">{content}</span></div>
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm font-bold hover:bg-secondary">
            Huỷ
          </button>
          <button onClick={onConfirmed} className="flex-1 rounded-full bg-gradient-ocean px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft">
            Tôi đã chuyển khoản
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
