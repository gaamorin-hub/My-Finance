import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

interface TransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const accountsQuery = trpc.accounts.list.useQuery();
  const categoriesQuery = trpc.categories.list.useQuery({ type });
  const createTransactionMutation = trpc.transactions.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description || !categoryId || !accountId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      await createTransactionMutation.mutateAsync({
        type,
        amount,
        description,
        categoryId: parseInt(categoryId),
        accountId: parseInt(accountId),
        date: new Date(date),
      });

      toast.success("Transação registrada com sucesso!");
      setAmount("");
      setDescription("");
      setCategoryId("");
      setAccountId("");
      setDate(new Date().toISOString().split("T")[0]);
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao registrar transação");
      console.error(error);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de Transação */}
          <div>
            <Label htmlFor="type" className="text-lg font-semibold mb-2 block">
              Tipo
            </Label>
            <Select value={type} onValueChange={(value) => setType(value as "income" | "expense")}>
              <SelectTrigger id="type" className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conta */}
          <div>
            <Label htmlFor="account" className="text-lg font-semibold mb-2 block">
              Conta
            </Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger id="account" className="h-12 text-base">
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
                {accountsQuery.data?.map((account) => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Categoria */}
          <div>
            <Label htmlFor="category" className="text-lg font-semibold mb-2 block">
              Categoria
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category" className="h-12 text-base">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoriesQuery.data?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data */}
          <div>
            <Label htmlFor="date" className="text-lg font-semibold mb-2 block">
              Data
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* Valor */}
          <div>
            <Label htmlFor="amount" className="text-lg font-semibold mb-2 block">
              Valor (R$)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="h-12 text-base"
            />
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-lg font-semibold mb-2 block">
              Descrição
            </Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Compra no supermercado"
              className="h-12 text-base"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={createTransactionMutation.isPending}
            className="flex-1 h-12 text-base"
          >
            {createTransactionMutation.isPending ? "Salvando..." : "Registrar Transação"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12 text-base"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
