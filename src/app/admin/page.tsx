"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminTabs } from "@/components/admin/AdminTabs";

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminTabs />
    </AdminGuard>
  );
}