import { Zap, Sprout, Sun, Truck } from "lucide-react";

const items = [
  {
    icon: Zap,
    title: "Năng Lượng Sạch",
    desc: "Thay vì nạp năng lượng \"rỗng\" từ đường tinh luyện gây mệt mỏi nhanh, cơ thể bạn cần Complex Carbs (tinh bột phức hợp) từ ngũ cốc nguyên cám. Chúng giải phóng năng lượng từ từ, giữ đường huyết ổn định suốt ngày dài. Mẹo hay: Kết hợp ngũ cốc và cacao nguyên chất giàu Flavonoid giúp bạn tỉnh táo, no lâu và giữ dáng hiệu quả. Chỉ 3 phút mỗi sáng với V-Health là đủ năng lượng bền vững cho cả ngày bận rộn.",
    tone: "leaf",
  },
  {
    icon: Sprout,
    title: "Đạm Đậu Nành",
    desc: "Hệ tiêu hóa quá tải vì đạm động vật nhiều cholesterol? Hãy chuyển sang đạm thực vật từ đậu Hà Lan tinh khiết. Đây là nguồn protein lành tính, giàu axit amin thiết yếu nhưng hoàn toàn không chứa chất béo bão hòa. Điểm cộng lớn: Đạm đậu Hà Lan cực kỳ dễ tiêu, không gây đầy bụng, ợ hơi, giúp bảo vệ tim mạch và nhẹ nhàng với cả dạ dày nhạy cảm của người lớn tuổi hoặc người ăn xanh.",
    tone: "ocean",
  },
  {
    icon: Sun,
    title: "Nước Ion Kiềm Công Nghệ Lượng Tử",
    desc: "Không chỉ là nước uống giải khát, nước Ion Kiềm Quantum ứng dụng công nghệ lượng tử hiện đại mang đến nguồn nước giàu tính kiềm tự nhiên và nồng độ Hydrogen cao. Giá trị thực: Các cụm phân tử nước siêu nhỏ giúp thẩm thấu nhanh vào từng tế bào, trung hòa axit dư thừa và đào thải độc tố tối ưu. Sử dụng mỗi ngày là bí quyết đơn giản nhất để chống oxy hóa, giúp cơ thể luôn cân bằng, khỏe khoắn.",
    tone: "leaf",
  },
  {
    icon: Truck,
    title: " Bí Quyết Giảm Mệt Mỏi Tức Thì ",
    desc: "Khi cơ thể cạn kiệt năng lượng do vận động mạnh hoặc làm việc quá sức, việc bổ sung đúng chất là cực kỳ quan trọng. Sự kết hợp giữa năng lượng chuyển hóa nhanh, Khoáng chất (Magnesi, Kẽm) and Vitamin nhóm B (B1, B5, B6) chính là \"chìa khóa\" giúp cơ bắp phục hồi, giảm tình trạng uể oải, chuột rút. Mẹo nhỏ: Bỏ túi 1 gói V-Sport Gel để bù khoáng, đập tan mệt mỏi và lấy lại phong độ tức thì.",
    tone: "ocean",
  },
];

export function Features() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">
            Vì Sao Chọn TINGO
          </span>
          <h2 className="mt-4 text-4xl font-extrabold md:text-5xl text-center">
            Sống khoẻ mỗi ngày <br />
            <span className="text-gradient-brand">từ những điều tự nhiên</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {items.map((it) => {
            const isLeaf = it.tone === "leaf";
            const Icon = it.icon;
            return (
              <div
                key={it.title}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-soft"
              >
                <div
                  className={`absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl transition-opacity group-hover:opacity-100 ${
                    isLeaf ? "bg-leaf/15 opacity-50" : "bg-ocean/15 opacity-50"
                  }`}
                />
                <div
                  className={`relative grid h-14 w-14 place-items-center rounded-2xl ${
                    isLeaf ? "bg-leaf-soft text-leaf" : "bg-accent text-ocean"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="relative mt-5 text-lg font-bold">{it.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {it.desc}
                </p>
                <a
                  href="#knowledge"
                  className={`relative mt-5 inline-flex items-center gap-1 text-xs font-bold hover:underline ${
                    isLeaf ? "text-leaf" : "text-ocean"
                  }`}
                >
                  Tìm hiểu thêm →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
