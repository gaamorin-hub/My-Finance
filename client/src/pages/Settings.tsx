import { FinanceDashboardLayout } from "@/components/FinanceDashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <FinanceDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Configurações</h1>
        
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Perfil</h2>
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground">Nome</p>
              <p className="text-lg font-semibold">{user?.name || "Não informado"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="text-lg font-semibold">{user?.email || "Não informado"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Segurança</h2>
          <Button 
            onClick={() => logout()} 
            variant="destructive"
            className="w-full"
          >
            Sair da Conta
          </Button>
        </Card>
      </div>
    </FinanceDashboardLayout>
  );
}
