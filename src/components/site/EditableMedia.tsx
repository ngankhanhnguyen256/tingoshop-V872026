import {
  useEffect,
  useRef,
  useState,
  type ImgHTMLAttributes,
  type VideoHTMLAttributes,
} from "react";
import { Upload } from "lucide-react";

/**
 * Nút "Import Media" hiển thị ở góc phải mỗi vùng media.
 * Luôn hiển thị (không ẩn theo môi trường) để đảm bảo có thể thao tác
 * trong Preview / Production nội bộ.
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

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="absolute top-2 right-2 z-50 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-bold shadow-lg opacity-100 block pointer-events-auto inline-flex items-center gap-1 hover:bg-blue-700"
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

/* Base wrapper class: relative group + hover border xanh xác nhận Editable */
const EDITABLE_WRAPPER =
  "relative group h-full w-full border-2 border-transparent hover:border-blue-500 transition-colors";

/* ------------------------------- Editable Image ------------------------------ */

type EditableImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  wrapperClassName?: string;
};

export function EditableImage({
  src,
  wrapperClassName,
  className,
  ...rest
}: EditableImageProps) {
  const [current, setCurrent] = useState<string>(src);
  useEffect(() => setCurrent(src), [src]);

  return (
    <div className={wrapperClassName ?? EDITABLE_WRAPPER}>
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
  wrapperClassName,
  className,
  ...rest
}: EditableVideoProps) {
  const [curSrc, setCurSrc] = useState<string | undefined>(src);
  const [curPoster, setCurPoster] = useState<string | undefined>(poster);
  useEffect(() => setCurSrc(src), [src]);
  useEffect(() => setCurPoster(poster), [poster]);

  return (
    <div className={wrapperClassName ?? EDITABLE_WRAPPER}>
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
          else setCurPoster(u);
        }}
      />
    </div>
  );
}
