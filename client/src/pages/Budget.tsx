import { FinanceDashboardLayout } from "@/components/FinanceDashboardLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { AlertCircle } from "lucide-react";

export default function Budget() {
  const budgetsQuery = trpc.budgets.list.useQuery({});
  const transactionsQuery = trpc.transactions.list.useQuery({});

  const currentMonth = new Date().toISOString().slice(0, 7);

  // Calcular gastos por categoria neste mês
  const monthlyExpenses = (transactionsQuery.data || [])
    .filter(t => t.type === "expense" && t.date.toISOString().slice(0, 7) === currentMonth)
    .reduce((acc: Record<number, number>, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  return (
    <FinanceDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Orçamento Mensal</h1>

        {budgetsQuery.data && budgetsQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {budgetsQuery.data.map((budget) => {
              const spent = monthlyExpenses[budget.categoryId] || 0;
              const limit = parseFloat(budget.limit);
              const percentage = (spent / limit) * 100;
              const isExceeded = spent > limit;

              return (
                <Card key={budget.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">Categoria {budget.categoryId}</h3>
                      <p className="text-muted-foreground">Limite: R$ {limit.toFixed(2)}</p>
                    </div>
                    {isExceeded && (
                      <AlertCircle className="w-6 h-6 text-destructive" />
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">Gasto: R$ {spent.toFixed(2)}</span>
                      <span className={`font-semibold ${isExceeded ? "text-destructive" : "text-success"}`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-3"
                    />
                  </div>

                  {isExceeded && (
                    <p className="text-destructive font-semibold">
                      Excedido em R$ {(spent - limit).toFixed(2)}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground py-8">
              Nenhum orçamento configurado. Configure seus limites de gastos por categoria.
            </p>
          </Card>
        )}
      </div>
    </FinanceDashboardLayout>
  );
}
