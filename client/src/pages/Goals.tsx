import { FinanceDashboardLayout } from "@/components/FinanceDashboardLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { TrendingUp } from "lucide-react";

export default function Goals() {
  const goalsQuery = trpc.savingsGoals.list.useQuery();

  return (
    <FinanceDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Metas de Economia</h1>

        {goalsQuery.data && goalsQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {goalsQuery.data.map((goal) => {
              const target = parseFloat(goal.targetAmount);
              const current = parseFloat(goal.currentAmount || "0");
              const percentage = (current / target) * 100;
              const remaining = target - current;

              return (
                <Card key={goal.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{goal.name}</h3>
                      <p className="text-muted-foreground">Meta de economia</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-success/20" />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-muted-foreground text-sm">Acumulado</p>
                        <p className="text-2xl font-bold text-success">R$ {current.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Meta</p>
                        <p className="text-2xl font-bold">R$ {target.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Faltam</p>
                        <p className="text-2xl font-bold text-primary">R$ {remaining.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Progresso</span>
                        <span className="font-semibold text-success">{percentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(percentage, 100)} className="h-3" />
                    </div>

                    {percentage >= 100 && (
                      <p className="text-success font-semibold text-center">
                        🎉 Meta atingida!
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground py-8">
              Nenhuma meta de economia configurada. Crie uma meta para começar a poupar!
            </p>
          </Card>
        )}
      </div>
    </FinanceDashboardLayout>
  );
}
