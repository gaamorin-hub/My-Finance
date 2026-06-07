import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ReactNode } from "react";
import {
  BarChart3,
  Wallet,
  TrendingUp,
  Target,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <BarChart3 className="w-6 h-6" /> },
  { label: "Transações", href: "/transactions", icon: <Wallet className="w-6 h-6" /> },
  { label: "Orçamento", href: "/budget", icon: <TrendingUp className="w-6 h-6" /> },
  { label: "Metas", href: "/goals", icon: <Target className="w-6 h-6" /> },
  { label: "Histórico", href: "/history", icon: <History className="w-6 h-6" /> },
  { label: "Contas", href: "/accounts", icon: <Wallet className="w-6 h-6" /> },
];

interface FinanceDashboardLayoutProps {
  children: ReactNode;
}

export function FinanceDashboardLayout({ children }: FinanceDashboardLayoutProps) {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-2xl font-bold text-primary">💰 Finanças</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label={sidebarOpen ? "Fechar sidebar" : "Abrir sidebar"}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-lg font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-muted"
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
          {sidebarOpen && user && (
            <div className="px-4 py-2 text-sm">
              <p className="text-muted-foreground">Conectado como</p>
              <p className="font-semibold text-foreground truncate">{user.name || user.email}</p>
            </div>
          )}
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-lg font-medium"
            title={!sidebarOpen ? "Configurações" : undefined}
          >
            <Settings className="w-6 h-6 flex-shrink-0" />
            {sidebarOpen && <span>Configurações</span>}
          </button>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full justify-start gap-4 h-12 text-lg"
          >
            <LogOut className="w-6 h-6" />
            {sidebarOpen && <span>Sair</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
