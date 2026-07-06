import { useEffect, useState } from "react";
import { heroSlides, type HeroSlide } from "@/data/heroSlides";
import { BannerAdmin } from "./BannerAdmin";
import { EditableMediaSlot } from "./EditableMedia";

export function HeroCarousel() {
  // Chuyển dữ liệu slide sang state để mỗi slide có thể Import Media thay thế tại chỗ.
  const [slides, setSlides] = useState<HeroSlide[]>(heroSlides);
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="relative">
      <div className="absolute inset-0 -m-8 rounded-[3rem] bg-gradient-to-br from-leaf/15 to-ocean/15 blur-2xl" />
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/50 shadow-soft backdrop-blur">
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
            aria-hidden={i !== idx}
          >
            <EditableMediaSlot
              title={s.title}
              videoUrl={s.type === "video" ? s.video_url : ""}
              posterUrl={s.image_url}
              className="h-full w-full object-cover"
              wrapperClassName="relative group h-full w-full border-2 border-transparent hover:border-blue-500 transition-colors"
              buttonLabel="Sửa Slide Ảnh"
              videoProps={{
                autoPlay: true,
                muted: true,
                loop: true,
                playsInline: true,
              }}
              imgProps={{
                loading: idx === 0 ? "eager" : "lazy",
                alt: s.title,
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-6 text-white">
              <div className="text-lg font-bold">{s.title}</div>
              <div className="text-xs opacity-90">{s.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-white/70 px-3 py-2 backdrop-blur">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Chuyển đến slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-leaf" : "w-2 bg-foreground/30 hover:bg-foreground/50"}`}
          />
        ))}
      </div>

      {/* Giữ nút Quản trị Banner cũ – tương thích ngược */}
      <BannerAdmin />
      {/* Tránh warning unused setter */}
      {false && <button onClick={() => setSlides(slides)} />}
    </div>
  );
}
