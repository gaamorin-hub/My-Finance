import { FinanceDashboardLayout } from "@/components/FinanceDashboardLayout";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Wallet } from "lucide-react";

export default function Accounts() {
  const accountsQuery = trpc.accounts.list.useQuery();

  return (
    <FinanceDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Minhas Contas</h1>
        
        {accountsQuery.data && accountsQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accountsQuery.data.map((account) => (
              <Card key={account.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">{account.name}</h3>
                  <Wallet className="w-8 h-8 text-primary/20" />
                </div>
                <p className="text-muted-foreground mb-2">{account.type}</p>
                <p className="text-3xl font-bold text-primary">R$ {parseFloat(account.balance).toFixed(2)}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground py-8">Nenhuma conta registrada</p>
          </Card>
        )}
      </div>
    </FinanceDashboardLayout>
  );
}
