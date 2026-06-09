import cereal from "@/assets/product-cereal.jpg";
import curcumin from "@/assets/product-curcumin.jpg";
import protein from "@/assets/product-protein.jpg";
import quantum from "@/assets/product-quantum.jpg";
import chocolate from "@/assets/product-chocolate.jpg";
import coffee from "@/assets/product-coffee.jpg";
import yensao from "@/assets/product-yensao.jpg";
import tra from "@/assets/product-tra.jpg";
import sam from "@/assets/product-sam.jpg";

export type SearchItem = {
  id: string;
  kind: "product" | "article";
  name: string;
  desc: string;
  price?: string;
  thumb: string;
  href: string;
};

export const searchIndex: SearchItem[] = [
  { id: "p-choco", kind: "product", name: "TINGO Chocolate", desc: "Bữa ăn thay thế cao cấp vị cacao", price: "652.909đ", thumb: chocolate, href: "#spotlight" },
  { id: "p-cereal", kind: "product", name: "TINGO Cereal", desc: "Ngũ cốc dinh dưỡng nguyên cám", price: "407.455đ", thumb: cereal, href: "#products" },
  { id: "p-curcumin", kind: "product", name: "TINGO Curcumin Shot", desc: "Nghệ & gừng đậm đặc", price: "220.909đ", thumb: curcumin, href: "#products" },
  { id: "p-protein", kind: "product", name: "TINGO Protein Bar", desc: "Đạm đậu nành thực vật", price: "189.000đ", thumb: protein, href: "#products" },
  { id: "p-quantum", kind: "product", name: "TINGO Quantum H₂", desc: "Nước Hydrogen tinh khiết", price: "780.545đ", thumb: quantum, href: "#products" },
  { id: "p-coffee", kind: "product", name: "Cà Phê TINGO", desc: "Thức uống năng lượng tự nhiên", price: "850.000đ", thumb: coffee, href: "#products" },
  { id: "p-yensao", kind: "product", name: "Tổ Yến Đông Trùng Hạ Thảo", desc: "Bồi bổ cao cấp", price: "920.000đ", thumb: yensao, href: "#products" },
  { id: "p-tra", kind: "product", name: "Trà Thảo Mộc TINGO", desc: "Thanh nhiệt, giải độc", price: "45.000đ", thumb: tra, href: "#products" },
  { id: "p-sam", kind: "product", name: "Nước Sâm Rong Biển TINGO", desc: "Giải nhiệt mùa hè", price: "35.000đ", thumb: sam, href: "#products" },
  { id: "a-1", kind: "article", name: "Cẩm nang dinh dưỡng TINGO", desc: "Bài viết chuyên sâu về chế độ ăn cân bằng", thumb: cereal, href: "#knowledge" },
  { id: "a-2", kind: "article", name: "Video hướng dẫn sống khỏe", desc: "Series video chăm sóc sức khỏe mỗi ngày", thumb: protein, href: "#knowledge" },
];
