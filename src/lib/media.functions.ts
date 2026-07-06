import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Bootstrap: nếu chưa có admin nào trong hệ thống, gán quyền admin
 * cho user hiện tại. Chạy 1 lần bởi người đầu tiên đăng ký ở /admin.
 * Sau đó chỉ admin hiện có mới có thể tạo thêm admin (qua DB).
 */
export const bootstrapAdminIfEmpty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);

    if ((count ?? 0) > 0) {
      // Đã có admin → chỉ cho biết trạng thái hiện tại của user
      const { data } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId)
        .eq("role", "admin")
        .maybeSingle();
      return { granted: false, isAdmin: !!data };
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { granted: true, isAdmin: true };
  });
