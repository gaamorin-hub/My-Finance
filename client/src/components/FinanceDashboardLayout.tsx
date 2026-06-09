import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Settings,
  Target,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <Home className="w-5 h-5" /> },
  { label: "Transações", href: "/transactions", icon: <CreditCard className="w-5 h-5" /> },
  { label: "Orçamento", href: "/budget", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "Metas", href: "/goals", icon: <Target className="w-5 h-5" /> },
  { label: "Histórico", href: "/history", icon: <TrendingUp className="w-5 h-5" /> },
  { label: "Contas", href: "/accounts", icon: <Wallet className="w-5 h-5" /> },
];

interface FinanceDashboardLayoutProps {
  children: React.ReactNode;
}

export function FinanceDashboardLayout({ children }: FinanceDashboardLayoutProps) {
  const [location, navigate] = useLocation();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#0f1f2e] flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-[#06d6a0]/20 border-t-[#06d6a0] rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#0f1f2e] flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="text-6xl">💰</div>
          <h1 className="text-4xl font-bold text-white">Finanças Acessíveis</h1>
          <p className="text-xl text-gray-300">Controle financeiro elegante e intuitivo</p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="btn-secondary text-lg px-8 py-4"
          >
            Entrar com Manus
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#0f1f2e] flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } fixed md:relative md:translate-x-0 left-0 top-0 h-screen bg-black/80 backdrop-blur-md border-r border-white/10 transition-all duration-300 flex flex-col z-40`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="text-2xl">💰</div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#06d6a0] to-[#1d3557] bg-clip-text text-transparent">
                Finanças
              </h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={sidebarOpen ? "Fechar sidebar" : "Abrir sidebar"}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-[#06d6a0] to-[#05a87f] text-black shadow-lg shadow-[#06d6a0]/20"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 space-y-2">
          {sidebarOpen && user && (
            <div className="px-4 py-2 text-sm">
              <p className="text-gray-400">Conectado como</p>
              <p className="font-semibold text-white truncate">{user.name || user.email}</p>
            </div>
          )}
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors font-medium text-gray-300 hover:text-white"
            title={!sidebarOpen ? "Configurações" : undefined}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Configurações</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors font-medium text-red-400 hover:text-red-300"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
