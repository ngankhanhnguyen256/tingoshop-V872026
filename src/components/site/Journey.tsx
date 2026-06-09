import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { journeySlides } from "@/data/journeySlides";

function isYouTube(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}
function toEmbed(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

export function Journey() {
  // Chỉ hiển thị slide có ảnh hoặc video hợp lệ; tối đa 5 slide
  const slides = journeySlides
    .filter((j) => (j.poster_url && j.poster_url.trim() !== "") || (j.video_url && j.video_url.trim() !== ""))
    .slice(0, 5);

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
          <div className="aspect-video w-full bg-black">
            {s.video_url ? (
              isYouTube(s.video_url) ? (
                <iframe
                  src={toEmbed(s.video_url)}
                  title={s.title}
                  className="h-full w-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={s.video_url}
                  poster={s.poster_url || undefined}
                  controls
                  playsInline
                  className="h-full w-full object-cover"
                />
              )
            ) : (
              <img src={s.poster_url} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
            )}
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
              <span className="text-xs text-background/70">{safeIndex + 1} / {slides.length}</span>
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

        {/* Thumbnails — Visual Edits click từng ảnh để Upload file hoặc dán URL */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {slides.map((j, idx) => (
            <button
              key={j.id}
              onClick={() => setI(idx)}
              className={`overflow-hidden rounded-2xl border text-left transition-all ${idx === safeIndex ? "border-leaf" : "border-white/10 hover:border-white/30"}`}
            >
              <div className="aspect-video bg-black">
                {j.video_url && !isYouTube(j.video_url) ? (
                  <video src={j.video_url} poster={j.poster_url || undefined} muted className="h-full w-full object-cover" />
                ) : (
                  <img src={j.poster_url} alt={j.title} loading="lazy" className="h-full w-full object-cover" />
                )}
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
