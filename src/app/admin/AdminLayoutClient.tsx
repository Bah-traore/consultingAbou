"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from '@/components/AdminSidebar';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const isLoginPage = /^\/admin\/login\/?$/.test(pathname);

  return (
    <div className="min-h-screen bg-slate-50">
      {!isLoginPage && <AdminSidebar />}
      <div className={!isLoginPage ? "lg:ml-72" : ""}>
        {children}
      </div>
    </div>
  );
}