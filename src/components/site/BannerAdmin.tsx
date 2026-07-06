import { useEffect, useState } from "react";
import { Settings, X } from "lucide-react";
import { heroSlides } from "@/data/heroSlides";
import { isEditMode } from "./EditableMedia";

// Chỉ hiển thị trong môi trường dev / preview Lovable.
export function BannerAdmin() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => setShow(isEditMode()), []);
  if (!show) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-soft backdrop-blur hover:bg-white"
      >
        <Settings className="h-3.5 w-3.5" /> Quản trị Banner
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/40 p-4">
          <div className="flex h-full w-full max-w-md flex-col overflow-hidden rounded-2xl bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-lg font-bold">Quản trị Banner</h3>
                <p className="text-xs text-muted-foreground">Click vào ảnh/video bên dưới và dùng Visual Edits để Upload file hoặc dán URL.</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Đóng" className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {heroSlides.map((s, idx) => (
                <div key={s.id} className="rounded-xl border border-border bg-card p-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold">Slide {idx + 1} — {s.type === "video" ? "Video" : "Ảnh"}</span>
                    <span className="text-muted-foreground">{s.id}</span>
                  </div>
                  <div className="aspect-video overflow-hidden rounded-lg bg-secondary">
                    {s.type === "video" && s.video_url ? (
                      <video src={s.video_url} poster={s.image_url} muted loop playsInline className="h-full w-full object-cover" />
                    ) : (
                      <img src={s.image_url} alt={s.title} className="h-full w-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="mt-2 text-sm font-semibold">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
