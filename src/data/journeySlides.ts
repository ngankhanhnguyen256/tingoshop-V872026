import hero from "@/assets/hero-splash.jpg";

export type JourneySlide = {
  id: string;
  video_url: string;
  poster_url: string;
  title: string;
  caption: string;
};

// Tối đa 5 slide. Slide nào để trống cả video_url và poster_url sẽ tự động bị ẩn.
// Visual Edits: click trực tiếp vào <img /> hoặc <video /> để Upload file hoặc dán URL.
export const journeySlides: JourneySlide[] = [
  { id: "j1", video_url: "", poster_url: hero, title: "Khởi nguồn TINGO", caption: "Hành trình từ cánh đồng nguyên liệu sạch tới ly nước cuối cùng." },
  { id: "j2", video_url: "", poster_url: hero, title: "Công nghệ chuẩn ISO", caption: "Nhà máy đạt chuẩn ISO 22000:2018 — minh bạch từng giọt." },
  { id: "j3", video_url: "", poster_url: hero, title: "Cộng đồng TINGO", caption: "50.000+ khách hàng đã đồng hành cùng lối sống xanh." },
  { id: "j4", video_url: "", poster_url: "", title: "Slide 4", caption: "Để trống — slide sẽ tự ẩn." },
  { id: "j5", video_url: "", poster_url: "", title: "Slide 5", caption: "Để trống — slide sẽ tự ẩn." },
];
