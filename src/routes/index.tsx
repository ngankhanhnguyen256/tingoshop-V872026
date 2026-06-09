import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { Spotlight } from "@/components/site/Spotlight";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Knowledge } from "@/components/site/Knowledge";
import { Journey } from "@/components/site/Journey";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TINGO — Đồ Uống & Dinh Dưỡng Sức Khỏe Tự Nhiên" },
      {
        name: "description",
        content:
          "TINGO mang đến đồ uống dinh dưỡng sạch từ thiên nhiên: cacao, ngũ cốc, đạm đậu nành, sữa non & nghệ. Cân bằng cơ thể, khơi nguồn năng lượng mỗi ngày.",
      },
      { property: "og:title", content: "TINGO — Dinh Dưỡng Sống Từ Thiên Nhiên" },
      { property: "og:description", content: "Đồ uống dinh dưỡng sạch hàng đầu cho người Việt." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header />
      <main>
        <Hero />
        <Features />
        <Spotlight />
        <ProductGrid />
        <Knowledge />
        <Journey />
      </main>
      <Footer />
    </div>
  );
}
