# Finanças Acessíveis - TODO

## Design System & Configuração
- [x] Definir paleta de cores elegante e sofisticada (tema claro com acentos premium)
- [x] Configurar tipografia com fontes grandes e legíveis (16pt+ para corpo)
- [x] Implementar tokens de design em CSS (cores, espaçamento, sombras)
- [x] Criar componentes base acessíveis (botões amplos, inputs grandes, cards)

## Estrutura de Banco de Dados
- [x] Criar tabelas: users, accounts, transactions, categories, budgets, savings_goals
- [x] Definir tipos TypeScript
- [x] Executar migrações SQL
- [ ] Definir foreign keys e relações Drizzle em drizzle/relations.ts

## Dashboard Principal
- [x] Criar layout com sidebar de navegação
- [x] Implementar cards de resumo (saldo total, receitas, despesas)
- [x] Adicionar grafico de pizza de gastos por categoria
- [x] Registrar rotas e criar paginas para todas as secoes
- [ ] Adicionar grafico de barras de evolucao mensal
- [ ] Implementar filtro de período (mês, trimestre, ano)

## Registro de Transacoes
- [x] Criar pagina de transacoes com listagem
- [ ] Criar formulario de nova transacao (receita/despesa)
- [ ] Implementar seletor de categoria com ícones coloridos
- [ ] Adicionar seletor de conta
- [ ] Implementar validação de formulário
- [ ] Criar lista/tabela de transações recentes

## Controle de Orçamento
- [ ] Criar página de orçamentos por categoria
- [ ] Implementar barras de progresso visual
- [ ] Adicionar alertas de limite excedido
- [ ] Permitir edição de limites de orçamento

## Metas de Economia
- [ ] Criar página de metas com visualização de progresso
- [ ] Implementar termômetro/barra de progresso visual
- [ ] Permitir criar, editar e deletar metas
- [ ] Calcular progresso automaticamente

## Múltiplas Contas
- [ ] Criar seletor de contas na sidebar
- [ ] Implementar visualização de saldo por conta
- [ ] Adicionar consolidação de saldo total
- [ ] Permitir criar novas contas

## Histórico de Transações
- [ ] Criar página de histórico com tabela completa
- [ ] Implementar filtros (período, categoria, tipo)
- [ ] Adicionar busca rápida por descrição
- [ ] Permitir editar/deletar transações

## Acessibilidade
- [ ] Testar navegação por teclado
- [ ] Validar contraste de cores (WCAG AA)
- [ ] Testar com leitores de tela
- [ ] Garantir responsividade em mobile
- [ ] Testar com usuários de diferentes idades

## Testes
- [ ] Escrever testes unitários para procedures tRPC
- [ ] Testar fluxos de criar/editar/deletar transações
- [ ] Testar cálculos de orçamento e metas
- [ ] Testar filtros e buscas

## Deploy & Entrega
- [ ] Revisar interface final
- [ ] Otimizar performance
- [ ] Criar checkpoint final
- [ ] Documentar instruções de uso
