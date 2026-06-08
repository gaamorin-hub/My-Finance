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
- [x] Definir foreign keys e relacoes Drizzle em drizzle/relations.ts

## Dashboard Principal
- [x] Criar layout com sidebar de navegação
- [x] Implementar cards de resumo (saldo total, receitas, despesas)
- [x] Adicionar grafico de pizza de gastos por categoria
- [x] Registrar rotas e criar paginas para todas as secoes
- [x] Adicionar grafico de barras de evolucao mensal
- [x] Implementar filtro de periodo (mes, trimestre, ano)

## Registro de Transacoes
- [x] Criar pagina de transacoes com listagem
- [x] Criar formulario de nova transacao (receita/despesa)
- [x] Implementar seletor de categoria com ícones coloridos
- [x] Adicionar seletor de conta
- [x] Implementar validação de formulário
- [x] Criar lista/tabela de transações recentes

## Controle de Orcamento
- [x] Criar pagina de orcamentos por categoria
- [x] Implementar barras de progresso visual
- [x] Adicionar alertas de limite excedido
- [x] Permitir edicao de limites de orcamento

## Metas de Economia
- [x] Criar pagina de metas com visualizacao de progresso
- [x] Implementar termometro/barra de progresso visual
- [x] Permitir criar, editar e deletar metas
- [x] Calcular progresso automaticamente

## Múltiplas Contas
- [x] Criar seletor de contas na sidebar
- [x] Implementar visualizacao de saldo por conta
- [x] Adicionar consolidacao de saldo total
- [x] Permitir criar novas contas

## Histórico de Transações
- [x] Criar pagina de historico com tabela completa
- [x] Implementar filtros (periodo, categoria, tipo)
- [x] Adicionar busca rapida por descricao�o
- [x] Permitir editar/deletar transacoesções

## Acessibilidade
- [x] Testar navegacao por teclado
- [x] Validar contraste de cores (WCAG AA)
- [x] Testar com leitores de tela
- [x] Garantir responsividade em mobile
- [x] Testar com usuarios de diferentes idades

## Testes
- [x] Escrever testes unitarios para procedures tRPC
- [x] Testar fluxos de criar/editar/deletar transacoes
- [x] Testar calculos de orcamento e metas
- [x] Testar filtros e buscas

## Deploy & Entrega
- [x] Revisar interface final
- [x] Otimizar performance
- [x] Criar checkpoint final
- [x] Documentar instrucoes de uso
