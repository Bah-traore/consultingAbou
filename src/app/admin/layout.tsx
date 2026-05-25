import { Metadata } from "next";
import { AdminSidebar } from '@/components/AdminSidebar';
import AdminLayoutClient from './AdminLayoutClient';

export const metadata: Metadata = {
  title: "Administration - Abou BAH Consulting",
  description: "Interface d'administration",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
