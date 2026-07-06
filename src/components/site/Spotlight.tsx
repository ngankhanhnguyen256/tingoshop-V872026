import { ShoppingCart, Check } from "lucide-react";
import chocolate from "@/assets/product-chocolate.jpg";
import { useCart } from "@/hooks/useCart";
import { EditableImage } from "./EditableMedia";

export function Spotlight() {
  const { addItem } = useCart();
  return (
    <section id="spotlight" className="scroll-mt-24 bg-gradient-leaf py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            Lựa Chọn Tháng Này
          </span>
          <h2 className="mt-4 text-4xl font-extrabold md:text-5xl text-center">
            Tâm điểm <span className="text-gradient-brand">sức khoẻ</span>
          </h2>
        </div>

        <div className="mt-14 grid items-center gap-10 overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/70 p-8 shadow-soft backdrop-blur lg:grid-cols-2 lg:p-12">
          <div className="relative">
            <div className="absolute inset-0 -m-4 rounded-[2.5rem] bg-gradient-to-br from-ocean/20 to-leaf/20 blur-2xl" />
            <img
              src={chocolate}
              alt="TINGO Chocolate Meal Replacement"
              width={1024}
              height={1024}
              loading="lazy"
              className="relative rounded-2xl"
            />
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-ocean/10 px-3 py-1 text-xs font-bold text-ocean">
              Bán Chạy #1
            </span>
            <h3 className="mt-4 text-4xl font-extrabold md:text-5xl whitespace-pre-line">BỘT DINH DƯỠNG{"\n"}VHEALTH 2 VỊ</h3>
            <p className="mt-3 text-lg text-muted-foreground">
              ​
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Pha 1 gói Vhealth với khoảng 150ml nước",
                "Ngon hơn khi pha với nước ấm",
                "Có thể pha với nước lọc, sữa, nước hoa quả... khuấy đều và thưởng thức",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-leaf text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-end gap-4">
              <div>
                <div className="text-xs text-muted-foreground line-through">790.000đ</div>
                <div className="text-4xl font-extrabold text-leaf">790.000đ</div>
              </div>
              <span className="mb-1 rounded-full bg-leaf-soft px-3 py-1 text-xs font-bold text-leaf">
                -16%
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => addItem({ id: "p-choco", name: "TINGO Chocolate", price: "652.909đ", thumb: chocolate })}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-ocean px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.02]"
              >
                <ShoppingCart className="h-4 w-4" /> Thêm Vào Giỏ
              </button>
              <button className="rounded-full border border-foreground/15 bg-white px-6 py-3.5 text-sm font-semibold hover:bg-secondary">
                Mua Ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
