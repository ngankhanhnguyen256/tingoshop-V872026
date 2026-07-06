import { ShoppingCart } from "lucide-react";
import cereal from "@/assets/product-cereal.jpg";
import curcumin from "@/assets/product-curcumin.jpg";
import protein from "@/assets/product-protein.jpg";
import quantum from "@/assets/product-quantum.jpg";
import coffee from "@/assets/product-coffee.jpg";
import yensao from "@/assets/product-yensao.jpg";
import tra from "@/assets/product-tra.jpg";
import sam from "@/assets/product-sam.jpg";
import { useCart } from "@/hooks/useCart";
import { EditableImage } from "./EditableMedia";

type Product = { id: string; img: string; name: string; tag: string; price: string };

const products: Product[] = [
  { id: "p-cereal", img: cereal, name: "HYDRONGEN QUANTUM", tag: "NGƯỚC ION KIỀM", price: "754.455đ" },
  { id: "p-curcumin", img: curcumin, name: "VHEALTH SCL", tag: "BỘT DINH DƯỠNG", price: "652.000đ" },
  { id: "p-protein", img: protein, name: "VHEALTH TRÀ XANH", tag: "​BỘT DINH DƯỠNG", price: "652.000đ" },
  { id: "p-quantum", img: quantum, name: "VSPORTGEL", tag: "GEL NĂNG LƯỢNG", price: "1.900.545đ" },
  { id: "p-coffee", img: coffee, name: "CÀ PHÊ LINKNEW", tag: "Thức uống năng lượng", price: "407.000đ" },
  { id: "p-yensao", img: yensao, name: "GREEN QUANTUM", tag: "Nước uống cô đặc", price: "220.000đ" },
  { id: "p-tra", img: tra, name: "TOPAPRO", tag: "THỰC PHẨM BỔ SUNG", price: "680.000đ" },
  { id: "p-sam", img: sam, name: "VHEALTH 2 VỊ", tag: "COMBO DINH DƯỠNG", price: "1.323.000đ" },
];

export function ProductGrid() {
  const { addItem } = useCart();
  return (
    <section id="products" className="scroll-mt-24 bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Sản Phẩm Liên Quan</span>
            <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">Khám phá thêm</h2>
          </div>
          <a href="#" className="text-sm font-bold text-ocean hover:underline">
            Xem tất cả →
          </a>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((p) => (
            <article
              key={p.id}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="relative aspect-square overflow-hidden bg-gradient-leaf">
                <EditableImage
                  mediaKey={`product.${p.id}`}
                  src={p.img}
                  alt={p.name}
                  width={768}
                  height={768}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4 sm:p-5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ocean sm:text-xs">{p.tag}</div>
                <h3 className="mt-1 text-sm font-bold sm:text-base">{p.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-leaf sm:text-lg">{p.price}</span>
                  <button
                    onClick={() => addItem({ id: p.id, name: p.name, price: p.price, thumb: p.img })}
                    aria-label={`Thêm ${p.name} vào giỏ`}
                    className="grid h-9 w-9 place-items-center rounded-full bg-gradient-ocean text-primary-foreground transition-transform hover:scale-110 sm:h-10 sm:w-10"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
