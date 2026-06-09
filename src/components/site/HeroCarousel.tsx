import { useEffect, useState } from "react";
import { heroSlides, type HeroSlide } from "@/data/heroSlides";
import { BannerAdmin } from "./BannerAdmin";

function isYouTube(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}

function toYouTubeEmbed(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&mute=1&loop=1&playlist=${m[1]}&controls=0&modestbranding=1` : url;
}

function SlideMedia({ s, eager }: { s: HeroSlide; eager?: boolean }) {
  if (s.type === "video" && s.video_url) {
    if (isYouTube(s.video_url)) {
      return (
        <iframe
          src={toYouTubeEmbed(s.video_url)}
          title={s.title}
          className="h-full w-full object-cover"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return (
      <video
        src={s.video_url}
        poster={s.image_url}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <img
      src={s.image_url}
      alt={s.title}
      className="h-full w-full object-cover"
      loading={eager ? "eager" : "lazy"}
    />
  );
}

export function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % heroSlides.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 -m-8 rounded-[3rem] bg-gradient-to-br from-leaf/15 to-ocean/15 blur-2xl" />
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/50 shadow-soft backdrop-blur">
        {heroSlides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
            aria-hidden={i !== idx}
          >
            <SlideMedia s={s} eager={idx === 0} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-6 text-white">
              <div className="text-lg font-bold">{s.title}</div>
              <div className="text-xs opacity-90">{s.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-white/70 px-3 py-2 backdrop-blur">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Chuyển đến slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-leaf" : "w-2 bg-foreground/30 hover:bg-foreground/50"}`}
          />
        ))}
      </div>

      <BannerAdmin />
    </div>
  );
}
