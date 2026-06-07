import { FinanceDashboardLayout } from "@/components/FinanceDashboardLayout";
import { Card } from "@/components/ui/card";

export default function Goals() {
  return (
    <FinanceDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Metas de Economia</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">Página de metas em desenvolvimento</p>
        </Card>
      </div>
    </FinanceDashboardLayout>
  );
}
