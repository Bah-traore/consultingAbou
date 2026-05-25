"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  FileText, 
  Mail, 
  Calendar,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface AdminSidebarProps {
  onLogout?: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, color: 'text-blue-600' },
    { href: '/admin/services', label: 'Services', icon: Briefcase, color: 'text-purple-600' },
    { href: '/admin/partenaires', label: 'Partenaires', icon: Users, color: 'text-green-600' },
    { href: '/admin/temoignages', label: 'Témoignages', icon: MessageSquare, color: 'text-orange-600' },
    { href: '/admin/articles', label: 'Articles', icon: FileText, color: 'text-red-600' },
    { href: '/admin/contacts', label: 'Contacts', icon: Mail, color: 'text-cyan-600' },
    { href: '/admin/rendezvous', label: 'Rendez-vous', icon: Calendar, color: 'text-pink-600' },
    { href: '/admin/slides', label: 'Diaporama', icon: ImageIcon, color: 'text-indigo-600' },
    { href: '/admin/customization', label: 'Personnalisation', icon: Settings, color: 'text-teal-600' },
  ];
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    if (onLogout) {
      onLogout();
    } else {
      router.push('/admin/login');
    }
  };
  
  return (
    <>
      {/* Sidebar - Fixed */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                <Image
                  src="/img/Abou%20consulting%20transparent.webp"
                  alt="Abou BAH Consulting"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-xs text-slate-400">Abou BAH Consulting</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
              Navigation
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : item.color}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* User Section & Logout */}
          <div className="p-4 border-t border-slate-700 bg-slate-800">
            <Button 
              variant="ghost"
              className="w-full gap-2 text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </>
  );
}
