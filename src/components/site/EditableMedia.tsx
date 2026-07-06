import {
  useEffect,
  useRef,
  useState,
  type ImgHTMLAttributes,
  type VideoHTMLAttributes,
} from "react";
import { Upload } from "lucide-react";

/**
 * Nút "Import Media" hiển thị ở góc phải mỗi vùng media (chỉ trong Preview/DEV).
 * Khi click sẽ mở hộp thoại chọn tệp thủ công từ máy tính.
 */
function ImportButton({
  accept,
  onFile,
  label = "Import Media",
}: {
  accept: string;
  onFile: (url: string, file: File) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (!import.meta.env.DEV) return null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="pointer-events-auto absolute right-2 top-2 z-30 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-md ring-1 ring-black/5 backdrop-blur transition hover:bg-white"
        aria-label={label}
      >
        <Upload className="h-3 w-3" />
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

/* ------------------------------- Editable Image ------------------------------ */

type EditableImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  /** class cho div bao ngoài; mặc định fill parent để giữ nguyên aspect / bo góc */
  wrapperClassName?: string;
};

export function EditableImage({
  src,
  wrapperClassName = "relative h-full w-full",
  className,
  ...rest
}: EditableImageProps) {
  const [current, setCurrent] = useState<string>(src);
  useEffect(() => setCurrent(src), [src]);

  return (
    <div className={wrapperClassName}>
      <img {...rest} src={current} className={className} />
      <ImportButton accept="image/*" onFile={(u) => setCurrent(u)} />
    </div>
  );
}

/* ------------------------------- Editable Video ------------------------------ */

type EditableVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "poster"> & {
  src?: string;
  poster?: string;
  wrapperClassName?: string;
};

export function EditableVideo({
  src,
  poster,
  wrapperClassName = "relative h-full w-full",
  className,
  ...rest
}: EditableVideoProps) {
  const [curSrc, setCurSrc] = useState<string | undefined>(src);
  const [curPoster, setCurPoster] = useState<string | undefined>(poster);
  useEffect(() => setCurSrc(src), [src]);
  useEffect(() => setCurPoster(poster), [poster]);

  return (
    <div className={wrapperClassName}>
      <video
        {...rest}
        src={curSrc || undefined}
        poster={curPoster || undefined}
        className={className}
      />
      <ImportButton
        accept="video/*,image/*"
        onFile={(u, file) => {
          if (file.type.startsWith("video")) setCurSrc(u);
          else setCurPoster(u);
        }}
      />
    </div>
  );
}

/* --------------------------- Editable Media Slot --------------------------- */
/**
 * Dành cho khối vừa có thể là iframe YouTube, vừa có thể là <video> file:
 * - Nếu videoUrl là YouTube  → render iframe.
 * - Nếu là file .mp4/blob    → render <video>.
 * - Nếu chưa có video        → render <img> poster.
 * Khi Import file video sẽ tự chuyển sang <video>; import ảnh sẽ đổi poster.
 */

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
  wrapperClassName = "relative h-full w-full",
  videoProps,
  imgProps,
}: {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  className?: string;
  wrapperClassName?: string;
  videoProps?: VideoHTMLAttributes<HTMLVideoElement>;
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
}) {
  const [curVideo, setCurVideo] = useState<string | undefined>(videoUrl);
  const [curPoster, setCurPoster] = useState<string | undefined>(posterUrl);
  useEffect(() => setCurVideo(videoUrl), [videoUrl]);
  useEffect(() => setCurPoster(posterUrl), [posterUrl]);

  return (
    <div className={wrapperClassName}>
      {curVideo && isYouTube(curVideo) ? (
        <iframe
          src={toYouTubeEmbed(curVideo)}
          title={title}
          className={className}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : curVideo ? (
        <video
          {...videoProps}
          src={curVideo}
          poster={curPoster || undefined}
          className={className}
        />
      ) : (
        <img
          {...imgProps}
          src={curPoster}
          alt={imgProps?.alt ?? title ?? ""}
          className={className}
        />
      )}
      <ImportButton
        accept="video/*,image/*"
        onFile={(u, file) => {
          if (file.type.startsWith("video")) setCurVideo(u);
          else {
            setCurPoster(u);
            // Nếu chưa có video, poster mới cũng đóng vai trò ảnh chính
          }
        }}
      />
    </div>
  );
}
