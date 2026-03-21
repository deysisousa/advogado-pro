# Advogado Pro - Sistema de Gestão Jurídica Integrado CNJ

Um sistema completo e elegante para advogados gerenciarem processos, prazos, publicações e finanças, com integração automática à API Pública do DataJud (CNJ).

## 🎯 Funcionalidades Principais

### 1. **Autenticação Segura**
- Login via Manus OAuth
- Perfil personalizado para cada advogado
- Logout seguro

### 2. **Dashboard Inteligente**
- Resumo de processos ativos
- Alertas de prazos próximos
- Estatísticas financeiras em tempo real
- Publicações recentes do Diário Oficial

### 3. **Gestão de Processos**
- Criar, editar e deletar processos
- Registrar número, cliente, assunto, tribunal e juiz
- Acompanhar status de cada processo
- Descrição detalhada de cada caso

### 4. **Sistema de Prazos**
- Criar prazos vinculados a processos
- Prioridades: Baixa, Média, Alta
- Alertas visuais para prazos próximos
- Marcar prazos como concluídos

### 5. **Integração CNJ (DataJud)**
- Sincronização automática de publicações
- Busca por advogado e processo
- Vinculação automática a processos
- Acesso direto aos documentos

### 6. **Gestão de Documentos**
- Upload de petições, sentenças, contratos
- Organização por processo
- Links para download
- Rastreamento de tipos de documento

### 7. **Controle Financeiro**
- Registro de receitas e despesas
- Vinculação a processos específicos
- Relatórios e gráficos
- Cálculo automático de saldo

### 8. **Configurações de Perfil**
- Atualizar informações profissionais
- Registrar OAB
- Especialidades
- Endereço e contato

---

## 🚀 Como Usar (Guia para Leigos)

### **Primeiro Acesso**

1. Acesse o site da aplicação
2. Clique em "Entrar" ou "Começar Agora"
3. Faça login com sua conta Manus
4. Você será redirecionado ao dashboard

### **Configurar Seu Perfil**

1. Clique em **Configurações** (ícone de engrenagem no menu lateral)
2. Preencha seus dados profissionais:
   - **OAB**: Seu número de inscrição (obrigatório)
   - **Especialidades**: Áreas em que você atua (ex: Direito Civil, Trabalhista)
   - **Telefone**: Seu contato
   - **Endereço**: Onde fica seu escritório
3. Clique em **Criar Perfil** (primeira vez) ou **Atualizar Perfil**

### **Adicionar um Processo**

1. No dashboard, clique em **Novo Processo** (botão azul)
2. Preencha os dados:
   - **Número**: Ex: 0000001-00.2024.1.01.0000
   - **Cliente**: Nome de quem você está representando
   - **Assunto**: Do que trata o processo
   - **Status**: Em andamento, Concluído, etc.
   - **Tribunal**: Qual tribunal (opcional)
   - **Juiz**: Nome do juiz (opcional)
3. Clique em **Criar Processo**

### **Criar um Prazo**

1. Vá para **Prazos** no menu
2. Clique em **Novo Prazo**
3. Preencha:
   - **Descrição**: Ex: "Prazo para contestação"
   - **Data**: Quando vence
   - **Processo**: Selecione o processo relacionado
   - **Prioridade**: Escolha entre Baixa, Média ou Alta
4. Clique em **Criar Prazo**
5. O sistema alertará automaticamente quando faltar 7 dias!

### **Registrar uma Receita ou Despesa**

1. Vá para **Financeiro**
2. Clique em **Nova Transação**
3. Escolha se é **Receita** ou **Despesa**
4. Preencha:
   - **Descrição**: Ex: "Honorários do cliente X"
   - **Valor**: Quanto é
   - **Data**: Quando ocorreu
   - **Categoria**: Tipo de receita/despesa (opcional)
   - **Processo**: Se está vinculada a um processo (opcional)
5. Clique em **Registrar**

### **Adicionar um Documento**

1. Vá para **Documentos**
2. Clique em **Novo Documento**
3. Preencha:
   - **Nome**: Ex: "Petição inicial"
   - **Tipo**: Escolha entre Petição, Sentença, Contrato, etc.
   - **Link**: Cole a URL do arquivo (se estiver online)
   - **Processo**: Selecione o processo
4. Clique em **Adicionar**

### **Ver Publicações do Diário Oficial**

1. Vá para **Publicações**
2. Todas as publicações relacionadas aos seus processos aparecem aqui
3. Clique no ícone de link para abrir a publicação original

---

## 🔧 Informações Técnicas

### **Stack Tecnológico**
- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Express.js + tRPC
- **Banco de Dados**: MySQL
- **Autenticação**: Manus OAuth
- **API Externa**: DataJud (CNJ)

### **Estrutura de Pastas**
```
advogado-pro-cnj/
├── client/                 # Frontend React
│   └── src/pages/         # Páginas da aplicação
├── server/                # Backend Express
│   └── routers.ts         # Endpoints tRPC
├── drizzle/               # Migrações do banco
└── README.md              # Este arquivo
```

### **Variáveis de Ambiente (Já Configuradas)**
- `DATABASE_URL`: Conexão com MySQL
- `JWT_SECRET`: Segurança das sessões
- `VITE_APP_ID`: ID da aplicação Manus
- `OAUTH_SERVER_URL`: URL do servidor OAuth

---

## 📊 API do CNJ (DataJud)

A aplicação está pré-configurada para usar a **API Pública do DataJud** do CNJ.

**O que ela faz:**
- Busca automaticamente publicações relacionadas aos seus processos
- Vincula publicações aos processos corretos
- Atualiza regularmente os dados

**Chave de Acesso:**
- A chave já está configurada no sistema
- Não precisa fazer nada!

---

## 🐛 Solução de Problemas

### **"Não consigo fazer login"**
- Verifique se está usando uma conta Manus válida
- Limpe os cookies do navegador e tente novamente

### **"Meu processo não aparece"**
- Certifique-se de que criou o perfil primeiro (Configurações)
- Recarregue a página (F5)

### **"Os prazos não aparecem"**
- Verifique se criou prazos vinculados a processos
- Confirme que a data está preenchida

### **"Publicações não sincronizam"**
- A sincronização é automática, pode levar alguns minutos
- Recarregue a página para atualizar

---

## 📞 Suporte

Se encontrar problemas:
1. Recarregue a página (F5)
2. Limpe o cache do navegador
3. Tente em outro navegador
4. Entre em contato com o suporte

---

## 📝 Notas Importantes

- **Seus dados são privados**: Apenas você consegue ver suas informações
- **Backup automático**: Todos os dados são salvos no banco de dados
- **Segurança**: Usamos criptografia e autenticação segura
- **Integração CNJ**: Totalmente legal e autorizada

---

## 🎓 Dicas de Uso

1. **Use prazos com prioridades** para não perder prazos importantes
2. **Vincule documentos aos processos** para ter tudo organizado
3. **Acompanhe o financeiro** para saber quanto está ganhando
4. **Atualize regularmente** o status dos processos
5. **Use a busca** para encontrar processos antigos rapidamente

---

**Versão**: 1.0.0  
**Data**: Março de 2026  
**Desenvolvido com ❤️ para advogados**
