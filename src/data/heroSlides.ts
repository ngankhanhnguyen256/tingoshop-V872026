import cereal from "@/assets/product-cereal.jpg";
import curcumin from "@/assets/product-curcumin.jpg";
import protein from "@/assets/product-protein.jpg";
import quantum from "@/assets/product-quantum.jpg";
import chocolate from "@/assets/product-chocolate.jpg";
import hero from "@/assets/hero-splash.jpg";

export type HeroSlide = {
  id: string;
  type: "image" | "video";
  image_url: string;
  video_url: string;
  title: string;
  subtitle: string;
};

// Mỗi slide: chọn type='image' để hiển thị image_url, hoặc type='video' để hiển thị video_url.
// video_url hỗ trợ link YouTube (tự nhúng) hoặc file .mp4 (tự loop).
export const heroSlides: HeroSlide[] = [
  { id: "s1", type: "video", image_url: hero, video_url: "", title: "Tươi mát từng giọt", subtitle: "Rót đầy năng lượng tự nhiên" },
  { id: "s2", type: "video", image_url: hero, video_url: "", title: "Nước bắn tinh khôi", subtitle: "Sạch từ thiên nhiên" },
  { id: "s3", type: "video", image_url: hero, video_url: "", title: "Khơi nguồn sức sống", subtitle: "Mỗi ngày một ly TINGO" },
  { id: "s4", type: "image", image_url: chocolate, video_url: "", title: "TINGO Chocolate", subtitle: "Sức khoẻ toàn diện trong 1 ly" },
  { id: "s5", type: "image", image_url: cereal, video_url: "", title: "TINGO Cereal", subtitle: "Ngũ cốc dinh dưỡng" },
  { id: "s6", type: "image", image_url: curcumin, video_url: "", title: "Nước Ion Kiềm Công Nghệ Lượng Tử", subtitle: " Bí Quyết Giảm Mệt Mỏi Tức Thì " },
  { id: "s7", type: "image", image_url: protein, video_url: "", title: " Bí Quyết Giảm Mệt Mỏi Tức Thì ", subtitle: "\n" },
  { id: "s8", type: "image", image_url: quantum, video_url: "", title: "TINGO Quantum H₂", subtitle: "Nước Hydrogen" },
  { id: "s9", type: "image", image_url: hero, video_url: "", title: "Bộ sưu tập TINGO", subtitle: "Sống xanh mỗi ngày" },
  { id: "s10", type: "image", image_url: chocolate, video_url: "", title: "TINGO Premium", subtitle: "Trao gửi yêu thương" },
];
