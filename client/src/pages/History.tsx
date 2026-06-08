import { FinanceDashboardLayout } from "@/components/FinanceDashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function History() {
  const transactionsQuery = trpc.transactions.list.useQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  const filteredTransactions = (transactionsQuery.data || []).filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesMonth = t.date.toISOString().slice(0, 7) === filterMonth;
    return matchesSearch && matchesType && matchesMonth;
  });

  return (
    <FinanceDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Histórico de Transações</h1>

        {/* Filtros */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search" className="text-lg font-semibold mb-2 block">
                Buscar
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="Digite a descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-lg font-semibold mb-2 block">
                Tipo
              </Label>
              <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                <SelectTrigger id="type" className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="month" className="text-lg font-semibold mb-2 block">
                Mês
              </Label>
              <Input
                id="month"
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>
        </Card>

        {/* Lista de Transações */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            Transações ({filteredTransactions.length})
          </h2>

          {filteredTransactions.length > 0 ? (
            <div className="space-y-3">
              {filteredTransactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString("pt-BR", {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <p
                      className={`text-xl font-bold ${
                        transaction.type === "income" ? "text-success" : "text-destructive"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"} R${" "}
                      {parseFloat(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma transação encontrada com os filtros aplicados
            </p>
          )}
        </Card>
      </div>
    </FinanceDashboardLayout>
  );
}
