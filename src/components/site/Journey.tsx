import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { journeySlides } from "@/data/journeySlides";
import { EditableMediaSlot } from "./EditableMedia";

export function Journey() {
  // Chỉ hiển thị slide có ảnh hoặc video hợp lệ; tối đa 5 slide
  const [slides] = useState(
    journeySlides
      .filter(
        (j) =>
          (j.poster_url && j.poster_url.trim() !== "") ||
          (j.video_url && j.video_url.trim() !== ""),
      )
      .slice(0, 5),
  );

  const [i, setI] = useState(0);

  if (slides.length === 0) return null;

  const safeIndex = i % slides.length;
  const s = slides[safeIndex];

  return (
    <section id="journey" className="scroll-mt-24 bg-foreground py-24 text-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Câu Chuyện</span>
          <h2 className="mt-4 text-4xl font-extrabold md:text-5xl text-center">
            HÀNH TRÌNH <span className="text-gradient-brand">TINGO</span>
          </h2>
          <p className="mt-4 text-background/70">
            Theo dõi câu chuyện đằng sau từng sản phẩm — từ nguyên liệu đến tay người tiêu dùng.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="mx-auto aspect-[3/4] w-full max-w-md bg-black">
            <EditableMediaSlot
              title={s.title}
              videoUrl={s.video_url}
              posterUrl={s.poster_url}
              className="h-full w-full object-cover"
              videoProps={{ controls: true, playsInline: true }}
              imgProps={{ loading: "lazy", alt: s.title }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <h3 className="text-xl font-bold">{s.title}</h3>
              <p className="text-sm text-background/70">{s.caption}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setI((p) => (p - 1 + slides.length) % slides.length)}
                aria-label="Slide trước"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-background/70">
                {safeIndex + 1} / {slides.length}
              </span>
              <button
                onClick={() => setI((p) => (p + 1) % slides.length)}
                aria-label="Slide kế"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnails — mỗi ô có nút Import Media riêng */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {slides.map((j, idx) => (
            <button
              key={j.id}
              onClick={() => setI(idx)}
              className={`overflow-hidden rounded-2xl border text-left transition-all ${
                idx === safeIndex ? "border-leaf" : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className="aspect-[3/4] bg-black">
                <EditableMediaSlot
                  title={j.title}
                  videoUrl={j.video_url}
                  posterUrl={j.poster_url}
                  className="h-full w-full object-cover"
                  videoProps={{ muted: true, playsInline: true }}
                  imgProps={{ loading: "lazy", alt: j.title }}
                />
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold">{j.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
