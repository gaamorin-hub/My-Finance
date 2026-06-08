import { FinanceDashboardLayout } from "@/components/FinanceDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TransactionForm } from "@/components/TransactionForm";
import { trpc } from "@/lib/trpc";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Transactions() {
  const [showForm, setShowForm] = useState(false);
  const transactionsQuery = trpc.transactions.list.useQuery({});

  return (
    <FinanceDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Transações</h1>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-5 h-5" />
            Nova Transação
          </Button>
        </div>

        {showForm && (
          <TransactionForm
            onSuccess={() => {
              setShowForm(false);
              transactionsQuery.refetch();
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Histórico de Transações</h2>
          {transactionsQuery.data && transactionsQuery.data.length > 0 ? (
            <div className="space-y-4">
              {transactionsQuery.data.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <p className={`text-lg font-bold ${transaction.type === "income" ? "text-success" : "text-destructive"}`}>
                    {transaction.type === "income" ? "+" : "-"} R$ {parseFloat(transaction.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhuma transação registrada</p>
          )}
        </Card>
      </div>
    </FinanceDashboardLayout>
  );
}
