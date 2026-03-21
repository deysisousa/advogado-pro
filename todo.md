# Advogado Pro - TODO

## Fase 1: Autenticação e Perfil de Advogado
- [ ] Schema do banco de dados com tabelas de usuários e advogados
- [ ] Procedures tRPC para autenticação (login/logout)
- [ ] Procedures tRPC para cadastro e atualização de perfil de advogado
- [ ] Página de perfil do advogado com edição de informações (OAB, especialidades)

## Fase 2: Dashboard Principal
- [ ] Dashboard elegante com resumo de processos
- [ ] Exibição de prazos próximos com alertas visuais
- [ ] Exibição de publicações recentes
- [ ] Estatísticas do advogado (total de processos, casos ativos, etc)
- [ ] Gráficos de desempenho e atividades

## Fase 3: Gestão de Processos
- [ ] CRUD completo de processos (criar, editar, visualizar, excluir)
- [ ] Campos: número, cliente, assunto, status, tribunal, juiz, descrição
- [ ] Listagem de processos com filtros e busca
- [ ] Visualização detalhada de cada processo

## Fase 4: Sistema de Prazos
- [ ] CRUD de prazos vinculados a processos
- [ ] Campos: descrição, data, prioridade, tipo
- [ ] Alertas visuais para prazos próximos
- [ ] Listagem com filtros por prioridade e status

## Fase 5: Integração com API CNJ (DataJud)
- [ ] Configuração da APIKey do CNJ
- [ ] Procedure para buscar publicações na API DataJud
- [ ] Sincronização automática de publicações por advogado
- [ ] Tratamento de erros e rate limiting

## Fase 6: Gestão de Publicações
- [ ] Listagem de publicações do Diário Oficial
- [ ] Filtros por data e processo
- [ ] Visualização detalhada de publicações
- [ ] Vinculação automática de publicações a processos

## Fase 7: Sistema de Documentos
- [ ] Upload de arquivos (petições, contratos, sentenças)
- [ ] Organização por processo
- [ ] Listagem e download de documentos
- [ ] Visualização de metadados (tipo, data, tamanho)

## Fase 8: Controle Financeiro
- [ ] CRUD de transações (receitas e despesas)
- [ ] Vinculação a processos e clientes
- [ ] Relatórios financeiros
- [ ] Gráficos de receitas vs despesas

## Fase 9: Interface Elegante
- [ ] Design sofisticado e limpo
- [ ] Tema profissional com cores apropriadas
- [ ] Responsividade completa (mobile, tablet, desktop)
- [ ] Animações suaves e transições

## Fase 10: GitHub e Deploy
- [ ] Criar repositório privado no GitHub
- [ ] Configurar CI/CD para deploy automático
- [ ] Primeiro commit com código funcional
- [ ] Documentação README

## Fase 11: Testes e Qualidade
- [ ] Testes unitários para procedures críticas
- [ ] Testes de integração com API CNJ
- [ ] Validação de dados em formulários

## Fase 12: Entrega Final
- [ ] Guia de uso para o usuário (leigo)
- [ ] Instruções de manutenção
- [ ] Suporte inicial
