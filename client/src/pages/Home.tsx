import { FinanceDashboardLayout } from "@/components/FinanceDashboardLayout";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowDownRight, ArrowUpRight, Eye, EyeOff, TrendingUp } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function Home() {
  const [showBalance, setShowBalance] = useState(true);
  const accountsQuery = trpc.accounts.list.useQuery({} as any);
  const transactionsQuery = trpc.transactions.list.useQuery({} as any);
  const budgetsQuery = trpc.budgets.list.useQuery({} as any);

  const accounts = accountsQuery.data || [];
  const transactions = transactionsQuery.data || [];
  const budgets = budgetsQuery.data || [];

  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Dados para gráfico de pizza
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const existing = acc.find((item) => item.name === `Categoria ${t.categoryId}`);
        if (existing) {
          existing.value += parseFloat(t.amount);
        } else {
          acc.push({ name: `Categoria ${t.categoryId}`, value: parseFloat(t.amount) });
        }
        return acc;
      },
      [] as Array<{ name: string; value: number }>
    );

  const COLORS = ["#06d6a0", "#1d3557", "#2d5a7b", "#f4a261", "#e76f51", "#457b9d"];

  // Dados para gráfico de barras
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthStr = date.toISOString().slice(0, 7);
    const monthTransactions = transactions.filter((t) => t.date.toISOString().slice(0, 7) === monthStr);
    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return {
      month: date.toLocaleDateString("pt-BR", { month: "short" }),
      income,
      expense,
    };
  });

  return (
    <FinanceDashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Bem-vindo!</h1>
          <p className="text-gray-400">Aqui está seu resumo financeiro</p>
        </div>

        {/* Main Balance Card */}
        <div className="card gradient-primary p-8 rounded-3xl shadow-2xl hover-lift">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-white/80 text-sm font-medium mb-2">Saldo Total</p>
              <div className="flex items-center gap-3">
                <h2 className="text-5xl font-bold text-white">
                  {showBalance ? `R$ ${totalBalance.toFixed(2)}` : "••••••"}
                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {showBalance ? (
                    <Eye className="w-6 h-6 text-white" />
                  ) : (
                    <EyeOff className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
            </div>
            <TrendingUp className="w-12 h-12 text-white/30" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-white/60 text-xs font-medium mb-1">RECEITAS</p>
              <p className="text-2xl font-bold text-white">R$ {totalIncome.toFixed(2)}</p>
            </div>
            <div className="flex-1">
              <p className="text-white/60 text-xs font-medium mb-1">DESPESAS</p>
              <p className="text-2xl font-bold text-white">R$ {totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contas */}
          <Card className="bg-black/40 border-white/10 p-6 rounded-2xl hover-lift">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium">Contas Ativas</p>
                <p className="text-3xl font-bold text-white mt-2">{accounts.length}</p>
              </div>
              <div className="p-3 bg-[#06d6a0]/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#06d6a0]" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-[#06d6a0] rounded-full"></span>
              Todas ativas
            </div>
          </Card>

          {/* Transações */}
          <Card className="bg-black/40 border-white/10 p-6 rounded-2xl hover-lift">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium">Transações</p>
                <p className="text-3xl font-bold text-white mt-2">{transactions.length}</p>
              </div>
              <div className="p-3 bg-[#1d3557]/20 rounded-lg">
                <ArrowUpRight className="w-6 h-6 text-[#1d3557]" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-[#1d3557] rounded-full"></span>
              Este mês
            </div>
          </Card>

          {/* Orçamentos */}
          <Card className="bg-black/40 border-white/10 p-6 rounded-2xl hover-lift">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium">Orçamentos</p>
                <p className="text-3xl font-bold text-white mt-2">{budgets.length}</p>
              </div>
              <div className="p-3 bg-[#f4a261]/20 rounded-lg">
                <ArrowDownRight className="w-6 h-6 text-[#f4a261]" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-[#f4a261] rounded-full"></span>
              Ativos
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="bg-black/40 border-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Gastos por Categoria</h3>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }: any) => `${name}: R$ ${value.toFixed(0)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                Nenhuma despesa registrada
              </div>
            )}
          </Card>

          {/* Bar Chart */}
          <Card className="bg-black/40 border-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Evolução Mensal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
                  formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`}
                />
                <Bar dataKey="income" fill="#06d6a0" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill="#e76f51" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-black/40 border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-6">Transações Recentes</h3>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.type === "income"
                        ? "bg-[#06d6a0]/20"
                        : "bg-[#e76f51]/20"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownRight className={`w-5 h-5 text-[#06d6a0]`} />
                    ) : (
                      <ArrowUpRight className={`w-5 h-5 text-[#e76f51]`} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-lg font-bold ${
                    transaction.type === "income" ? "text-[#06d6a0]" : "text-[#e76f51]"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"} R$ {parseFloat(transaction.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </FinanceDashboardLayout>
  );
}
