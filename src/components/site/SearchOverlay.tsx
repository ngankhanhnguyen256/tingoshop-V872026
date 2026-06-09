import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { searchIndex } from "@/data/searchIndex";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return searchIndex.slice(0, 6);
    return searchIndex.filter(
      (it) =>
        it.name.toLowerCase().includes(term) ||
        it.desc.toLowerCase().includes(term) ||
        (it.price ?? "").toLowerCase().includes(term),
    );
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-12">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-background shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm sản phẩm, bài viết, mức giá…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={onClose} aria-label="Đóng" className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">Không tìm thấy kết quả cho "{q}".</p>
          ) : (
            results.map((r) => (
              <a
                key={r.id}
                href={r.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-secondary"
              >
                <img src={r.thumb} alt="" loading="lazy" className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">{r.name}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                      {r.kind === "product" ? "Sản phẩm" : "Cẩm nang"}
                    </span>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{r.desc}</div>
                </div>
                {r.price && <div className="text-sm font-bold text-leaf">{r.price}</div>}
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
