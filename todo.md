# Advogado Pro - TODO

## Fase 1: Autenticação e Perfil de Advogado
- [x] Schema do banco de dados com tabelas de usuários e advogados
- [x] Procedures tRPC para autenticação (login/logout)
- [x] Procedures tRPC para cadastro e atualização de perfil de advogado
- [x] Página de perfil do advogado com edição de informações (OAB, especialidades)

## Fase 2: Dashboard Principal
- [x] Dashboard elegante com resumo de processos
- [x] Exibição de prazos próximos com alertas visuais
- [x] Exibição de publicações recentes
- [x] Estatísticas do advogado (total de processos, casos ativos, etc)
- [x] Gráficos de desempenho e atividades

## Fase 3: Gestão de Processos
- [x] CRUD completo de processos (criar, editar, visualizar, excluir)
- [x] Campos: número, cliente, assunto, status, tribunal, juiz, descrição
- [x] Listagem de processos com filtros e busca
- [x] Visualização detalhada de cada processo

## Fase 4: Sistema de Prazos
- [x] CRUD de prazos vinculados a processos
- [x] Campos: descrição, data, prioridade, tipo
- [x] Alertas visuais para prazos próximos
- [x] Listagem com filtros por prioridade e status

## Fase 5: Integração com API CNJ (DataJud)
- [x] Configuração da APIKey do CNJ
- [ ] Procedure para buscar publicações na API DataJud (em desenvolvimento)
- [ ] Sincronização automática de publicações por advogado (em desenvolvimento)
- [ ] Tratamento de erros e rate limiting (em desenvolvimento)

## Fase 6: Gestão de Publicações
- [x] Listagem de publicações do Diário Oficial
- [x] Filtros por data e processo
- [x] Visualização detalhada de publicações
- [ ] Vinculação automática de publicações a processos (em desenvolvimento)

## Fase 7: Sistema de Documentos
- [x] Upload de arquivos (petições, contratos, sentenças)
- [x] Organização por processo
- [x] Listagem e download de documentos
- [x] Visualização de metadados (tipo, data, tamanho)

## Fase 8: Controle Financeiro
- [x] CRUD de transações (receitas e despesas)
- [x] Vinculação a processos e clientes
- [x] Relatórios financeiros
- [x] Gráficos de receitas vs despesas

## Fase 9: Interface Elegante
- [x] Design sofisticado e limpo
- [x] Tema profissional com cores apropriadas
- [x] Responsividade completa (mobile, tablet, desktop)
- [x] Animações suaves e transições

## Fase 10: GitHub e Deploy
- [x] Criar repositório privado no GitHub
- [x] Primeiro commit com código funcional
- [x] Documentação README completa
- [ ] Configurar CI/CD para deploy automático (próxima etapa)

## Fase 11: Testes e Qualidade
- [ ] Testes unitários para procedures críticas
- [ ] Testes de integração com API CNJ
- [ ] Validação de dados em formulários

## Fase 12: Entrega Final
- [x] Guia de uso para o usuário (leigo)
- [x] Instruções de manutenção
- [ ] Suporte inicial
