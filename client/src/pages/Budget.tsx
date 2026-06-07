import { FinanceDashboardLayout } from "@/components/FinanceDashboardLayout";
import { Card } from "@/components/ui/card";

export default function Budget() {
  return (
    <FinanceDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Orçamento Mensal</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">Página de orçamento em desenvolvimento</p>
        </Card>
      </div>
    </FinanceDashboardLayout>
  );
}
