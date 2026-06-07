import { useAuth } from "@/_core/hooks/useAuth";
import { FinanceDashboardLayout } from "@/components/FinanceDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowDownRight, ArrowUpLeft, TrendingUp, Wallet } from "lucide-react";
import { useLocation } from "wouter";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  // Fetch data
  const accountsQuery = trpc.accounts.list.useQuery(undefined, { enabled: isAuthenticated });
  const transactionsQuery = trpc.transactions.list.useQuery({}, { enabled: isAuthenticated });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 p-4">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">💰 Finanças Acessíveis</h1>
            <p className="text-xl md:text-2xl text-foreground mb-2">Controle financeiro elegante e acessível</p>
            <p className="text-lg text-muted-foreground">Para todas as idades, com interface clara e intuitiva</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 text-left">
              <TrendingUp className="w-8 h-8 text-success mb-3" />
              <h3 className="text-xl font-bold mb-2">Dashboard Inteligente</h3>
              <p className="text-muted-foreground">Visualize seu saldo, receitas e despesas em tempo real com gráficos interativos</p>
            </Card>

            <Card className="p-6 text-left">
              <Wallet className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-xl font-bold mb-2">Múltiplas Contas</h3>
              <p className="text-muted-foreground">Gerencie carteira, conta corrente, poupança e outros com saldo consolidado</p>
            </Card>

            <Card className="p-6 text-left">
              <ArrowDownRight className="w-8 h-8 text-destructive mb-3" />
              <h3 className="text-xl font-bold mb-2">Registro Simples</h3>
              <p className="text-muted-foreground">Adicione receitas e despesas com categorias coloridas e ícones visuais</p>
            </Card>

            <Card className="p-6 text-left">
              <ArrowUpLeft className="w-8 h-8 text-success mb-3" />
              <h3 className="text-xl font-bold mb-2">Orçamento & Metas</h3>
              <p className="text-muted-foreground">Controle limites de gastos e acompanhe suas metas de economia</p>
            </Card>
          </div>

          <Button
            onClick={() => navigate(getLoginUrl())}
            size="lg"
            className="text-lg px-8 py-6 h-auto"
          >
            Começar Agora
          </Button>
        </div>
      </div>
    );
  }

  // Calculate totals
  const transactions = transactionsQuery.data || [];
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const monthlyTransactions = transactions.filter(t => 
    t.date.toISOString().slice(0, 7) === currentMonth
  );

  const totalIncome = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalBalance = (accountsQuery.data || []).reduce((sum, a) => sum + parseFloat(a.balance), 0);

  // Prepare chart data
  const expensesByCategory = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((acc: Record<string, number>, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const pieData = Object.entries(expensesByCategory).map(([categoryId, amount]) => ({
    name: `Categoria ${categoryId}`,
    value: amount,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <FinanceDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Bem-vindo, {user?.name}!</h1>
          <p className="text-lg text-muted-foreground">Aqui está um resumo de suas finanças</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-premium">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-lg mb-2">Saldo Total</p>
                <p className="text-4xl font-bold text-primary">R$ {totalBalance.toFixed(2)}</p>
              </div>
              <Wallet className="w-12 h-12 text-primary/20" />
            </div>
          </Card>

          <Card className="card-premium">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-lg mb-2">Receitas (Mês)</p>
                <p className="text-4xl font-bold text-success">R$ {totalIncome.toFixed(2)}</p>
              </div>
              <ArrowUpLeft className="w-12 h-12 text-success/20" />
            </div>
          </Card>

          <Card className="card-premium">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-lg mb-2">Despesas (Mês)</p>
                <p className="text-4xl font-bold text-destructive">R$ {totalExpense.toFixed(2)}</p>
              </div>
              <ArrowDownRight className="w-12 h-12 text-destructive/20" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="card-premium">
            <h2 className="text-2xl font-bold mb-6">Gastos por Categoria</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${typeof value === 'number' ? value.toFixed(2) : value}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">Nenhuma despesa registrada este mês</p>
            )}
          </Card>

          {/* Recent Transactions */}
          <Card className="card-premium">
            <h2 className="text-2xl font-bold mb-6">Transações Recentes</h2>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <p className={`text-lg font-bold ${transaction.type === "income" ? "text-success" : "text-destructive"}`}>
                    {transaction.type === "income" ? "+" : "-"} R$ {parseFloat(transaction.amount).toFixed(2)}
                  </p>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Nenhuma transação registrada</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </FinanceDashboardLayout>
  );
}
