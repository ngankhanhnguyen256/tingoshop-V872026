import {
  useEffect,
  useRef,
  useState,
  type ImgHTMLAttributes,
  type VideoHTMLAttributes,
} from "react";
import { Upload, Loader2, Cloud } from "lucide-react";
import { useMediaConfig } from "@/hooks/useMediaConfig";

/**
 * Nút "Import Media" CHỈ hiển thị trong môi trường phát triển
 * hoặc trên preview của Lovable. Khi deploy production (Vercel /
 * tên miền khách hàng) nút bị ẩn hoàn toàn khỏi DOM.
 */
export function isEditMode(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  const search = window.location.search;
  if (search.includes("edit=true")) return true;
  if (host === "localhost" || host === "127.0.0.1") return true;
  if (import.meta.env.DEV) return true;
  if (host.startsWith("id-preview--")) return true;
  if (host.endsWith("-dev.lovable.app")) return true;
  if (host.endsWith(".lovable.dev")) return true;
  return false;
}

function ImportButton({
  accept,
  onFile,
  label = "Import Media",
  busy = false,
  persistent = false,
}: {
  accept: string;
  onFile: (url: string, file: File) => void;
  label?: string;
  busy?: boolean;
  persistent?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => setShow(isEditMode()), []);
  if (!show) return null;

  return (
    <>
      <button
        type="button"
        disabled={busy}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className={`absolute top-2 right-2 z-50 ${persistent ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"} text-white px-3 py-1 rounded-md text-xs font-bold shadow-lg opacity-100 block pointer-events-auto inline-flex items-center gap-1 disabled:opacity-70`}
        aria-label={label}
        title={persistent ? "Lưu vĩnh viễn vào Cloud (đã đăng nhập admin)" : "Chỉ hiển thị tạm — đăng nhập /admin để lưu vĩnh viễn"}
      >
        {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : persistent ? <Cloud className="h-3 w-3" /> : <Upload className="h-3 w-3" />}
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(URL.createObjectURL(file), file);
          e.target.value = "";
        }}
      />
    </>
  );
}

const EDITABLE_WRAPPER =
  "relative group h-full w-full border-2 border-transparent hover:border-blue-500 transition-colors";

/* ------------------------------- Editable Image ------------------------------ */

type EditableImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  mediaKey?: string;
  wrapperClassName?: string;
  buttonLabel?: string;
};

export function EditableImage({
  src,
  mediaKey,
  wrapperClassName,
  className,
  buttonLabel,
  ...rest
}: EditableImageProps) {
  const { resolve, save, isAdmin } = useMediaConfig();
  const [override, setOverride] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => setOverride(null), [src, mediaKey]);

  const current = override ?? resolve(mediaKey, src);

  const handleFile = async (blobUrl: string, file: File) => {
    setOverride(blobUrl);
    if (mediaKey) {
      setBusy(true);
      try {
        await save(mediaKey, file);
        setOverride(null);
      } catch (e) {
        console.error("[EditableImage] save failed", e);
        alert(`Không lưu được vĩnh viễn: ${(e as Error).message}\n\nẢnh chỉ hiển thị tạm. Vào /admin đăng nhập tài khoản admin rồi thử lại.`);
      } finally {
        setBusy(false);
      }
    }
  };

  return (
    <div className={wrapperClassName ?? EDITABLE_WRAPPER}>
      <img {...rest} src={current} className={className} />
      <ImportButton
        accept="image/*"
        onFile={handleFile}
        label={buttonLabel}
        busy={busy}
        persistent={!!mediaKey && isAdmin}
      />
    </div>
  );
}

/* ------------------------------- Editable Video ------------------------------ */

type EditableVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "poster"> & {
  src?: string;
  poster?: string;
  mediaKey?: string;
  wrapperClassName?: string;
};

export function EditableVideo({
  src,
  poster,
  mediaKey,
  wrapperClassName,
  className,
  ...rest
}: EditableVideoProps) {
  const { resolve, save, isAdmin } = useMediaConfig();
  const [override, setOverride] = useState<{ src?: string; poster?: string }>({});
  const [busy, setBusy] = useState(false);
  useEffect(() => setOverride({}), [src, poster, mediaKey]);

  const curSrc = override.src ?? (mediaKey ? resolve(mediaKey, src ?? "") : src);
  const curPoster = override.poster ?? poster;

  const handleFile = async (blobUrl: string, file: File) => {
    if (file.type.startsWith("video")) setOverride((p) => ({ ...p, src: blobUrl }));
    else setOverride((p) => ({ ...p, poster: blobUrl }));

    if (mediaKey && isAdmin) {
      setBusy(true);
      try {
        await save(mediaKey, file);
        setOverride({});
      } catch (e) {
        console.error("[EditableVideo] save failed", e);
      } finally {
        setBusy(false);
      }
    }
  };

  return (
    <div className={wrapperClassName ?? EDITABLE_WRAPPER}>
      <video {...rest} src={curSrc || undefined} poster={curPoster || undefined} className={className} />
      <ImportButton
        accept="video/*,image/*"
        onFile={handleFile}
        busy={busy}
        persistent={!!mediaKey && isAdmin}
      />
    </div>
  );
}

/* --------------------------- Editable Media Slot --------------------------- */

function isYouTube(url?: string) {
  return !!url && /youtube\.com|youtu\.be/.test(url);
}
function toYouTubeEmbed(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

export function EditableMediaSlot({
  videoUrl,
  posterUrl,
  title,
  className,
  wrapperClassName,
  videoProps,
  imgProps,
  buttonLabel,
  mediaKey,
}: {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  className?: string;
  wrapperClassName?: string;
  videoProps?: VideoHTMLAttributes<HTMLVideoElement>;
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
  buttonLabel?: string;
  mediaKey?: string;
}) {
  const { resolve, resolveType, save, isAdmin } = useMediaConfig();
  const [override, setOverride] = useState<{ video?: string; poster?: string }>({});
  const [busy, setBusy] = useState(false);
  useEffect(() => setOverride({}), [videoUrl, posterUrl, mediaKey]);

  const storedType = resolveType(mediaKey, videoUrl ? "video" : "image");
  const storedUrl = mediaKey ? resolve(mediaKey, "") : "";

  const curVideo =
    override.video ??
    (storedType === "video" && storedUrl ? storedUrl : videoUrl);
  const curPoster =
    override.poster ??
    (storedType === "image" && storedUrl ? storedUrl : posterUrl);

  const handleFile = async (blobUrl: string, file: File) => {
    if (file.type.startsWith("video")) setOverride((p) => ({ ...p, video: blobUrl }));
    else setOverride((p) => ({ ...p, poster: blobUrl }));

    if (mediaKey && isAdmin) {
      setBusy(true);
      try {
        await save(mediaKey, file);
        setOverride({});
      } catch (e) {
        console.error("[EditableMediaSlot] save failed", e);
      } finally {
        setBusy(false);
      }
    }
  };

  return (
    <div className={wrapperClassName ?? EDITABLE_WRAPPER}>
      {curVideo && isYouTube(curVideo) ? (
        <iframe
          src={toYouTubeEmbed(curVideo)}
          title={title}
          className={className}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : curVideo ? (
        <video {...videoProps} src={curVideo} poster={curPoster || undefined} className={className} />
      ) : (
        <img {...imgProps} src={curPoster} alt={imgProps?.alt ?? title ?? ""} className={className} />
      )}
      <ImportButton
        accept="video/*,image/*"
        label={buttonLabel}
        onFile={handleFile}
        busy={busy}
        persistent={!!mediaKey && isAdmin}
      />
    </div>
  );
}
