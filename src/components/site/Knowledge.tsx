import { useState } from "react";
import { BookOpen, ImageIcon } from "lucide-react";
import cereal from "@/assets/product-cereal.jpg";
import protein from "@/assets/product-protein.jpg";
import curcumin from "@/assets/product-curcumin.jpg";
import quantum from "@/assets/product-quantum.jpg";
import { EditableImage, EditableMediaSlot } from "./EditableMedia";

type Slot = {
  id: string;
  title: string;
  text: string;
  image_url: string;
  video_url: string; // YouTube URL hoặc .mp4
};

const initialSlots: Slot[] = [
  { id: "slot-1", title: "Năng Lượng Sạch", text: "\n", image_url: cereal, video_url: "" },
  { id: "slot-2", title: "Đạm Đậu Nành", text: "\n", image_url: protein, video_url: "" },
  { id: "slot-3", title: "Nước Ion Kiềm Công Nghệ Lượng Tử", text: "\n", image_url: curcumin, video_url: "" },
  { id: "slot-4", title: " Bí Quyết Giảm Mệt Mỏi Tức Thì ", text: "​", image_url: quantum, video_url: "" },
];

export function Knowledge() {
  const [slots] = useState<Slot[]>(initialSlots);

  return (
    <section id="knowledge" className="scroll-mt-24 bg-gradient-to-b from-white via-leaf-soft/30 to-accent/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">Kiến Thức TINGO</span>
          <h2 className="mt-4 text-4xl font-extrabold md:text-5xl text-center">
            CẨM NANG DINH DƯỠNG & <span className="text-gradient-brand">SỨC KHỎE TINGO</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            4 chuyên mục — Sống khỏe mỗi ngày. Click xuống xem chi tiết.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {slots.map((s, idx) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-white/80 p-3 transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-leaf-soft text-leaf font-bold">{idx + 1}</span>
              <span className="text-sm font-semibold">{s.title}</span>
            </a>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {slots.map((s) => (
            <article
              key={s.id}
              id={s.id}
              className="scroll-mt-24 group relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-soft transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf-soft text-leaf">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{s.title}</h3>
              </div>

              <div className="mt-4 aspect-video overflow-hidden rounded-2xl bg-gradient-leaf">
                <EditableImage
                  src={s.image_url}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.text}</p>

              <div className="mx-auto mt-4 aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl bg-foreground/90">
                <EditableMediaSlot
                  title={s.title}
                  videoUrl={s.video_url}
                  posterUrl={s.image_url}
                  className="h-full w-full object-cover"
                  videoProps={{ controls: true, playsInline: true }}
                  imgProps={{ loading: "lazy", alt: s.title }}
                />
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <ImageIcon className="h-3.5 w-3.5" /> Import ảnh / video trực tiếp từ máy.
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
