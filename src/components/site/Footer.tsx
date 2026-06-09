import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-ocean opacity-90" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-3xl font-extrabold text-primary-foreground md:text-4xl">
              Nhận ưu đãi 10% cho đơn đầu tiên
            </h3>
            <p className="mt-2 text-primary-foreground/80">
              Đăng ký nhận tin để cập nhật sản phẩm mới và bí quyết sống khoẻ.
            </p>
          </div>
          <form className="flex w-full gap-2 rounded-full bg-white p-1.5 shadow-glow">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="flex-1 rounded-full bg-transparent px-5 py-2 text-sm text-foreground outline-none"
            />
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-ocean px-6 py-3 text-sm font-bold text-primary-foreground">
              Đăng Ký <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-ocean font-bold">T</span>
            <span className="text-xl font-extrabold">TINGO</span>
          </div>
          <p className="mt-4 text-sm text-background/70">
            Đồ uống & dinh dưỡng sức khoẻ từ nguyên liệu tự nhiên Việt Nam.
          </p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-leaf">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-leaf">Sản Phẩm</h4>
          <ul className="mt-4 space-y-2 text-sm text-background/70">
            {[
              { label: "TINGO Chocolate", href: "#spotlight" },
              { label: "TINGO Cereal", href: "#products" },
              { label: "TINGO Curcumin", href: "#products" },
              { label: "TINGO Protein", href: "#products" },
              { label: "TINGO Quantum", href: "#products" },
            ].map((x) => (
              <li key={x.label}><a href={x.href} className="hover:text-background">{x.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-leaf">Hỗ Trợ</h4>
          <ul className="mt-4 space-y-2 text-sm text-background/70">
            {[
              { label: "Chính sách vận chuyển", href: "#" },
              { label: "Chính sách đổi trả", href: "#" },
              { label: "Chính sách bảo mật", href: "#" },
              { label: "Câu hỏi thường gặp", href: "#" },
              { label: "Liên hệ", href: "#journey" },
            ].map((x) => (
              <li key={x.label}><a href={x.href} className="hover:text-background">{x.label}</a></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <h4 className="text-sm font-bold uppercase tracking-wider text-leaf">Liên Hệ</h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <a
              href="https://maps.google.com/?q=1/12+Linh+Dong+Thu+Duc+HCM"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-leaf/40 hover:bg-white"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-leaf-soft text-leaf">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-leaf">Địa chỉ</div>
                <div className="mt-1 text-sm text-background/80 group-hover:text-foreground">
                  1/12 Linh Đông, TP. Thủ Đức, TP.HCM
                </div>
              </div>
            </a>
            <a
              href="tel:02822107946"
              className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-ocean/40 hover:bg-white"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-ocean">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-ocean">Hotline</div>
                <div className="mt-1 text-sm text-background/80 group-hover:text-foreground">
                  028 2210 7946
                </div>
              </div>
            </a>
            <a
              href="mailto:hello@tingo.vn"
              className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-leaf/40 hover:bg-white"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-leaf-soft text-leaf">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-leaf">Email</div>
                <div className="mt-1 text-sm text-background/80 group-hover:text-foreground">
                  hello@tingo.vn
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-background/60 md:flex-row">
          <p>© 2026 TINGO. Một sản phẩm của Công ty TNHH Nước Giải Khát TINGO Việt Nam.</p>
          <p>Hoạt động vĩnh viễn với tên miền Tenten và Vercel.</p>
        </div>
      </div>
    </footer>
  );
}
