# CRUD Serverless com Notificações SNS

Sistema CRUD completo implementado com arquitetura serverless utilizando Serverless Framework e LocalStack, com integração de notificações via Amazon SNS.

## 📋 Descrição

Este projeto implementa uma API REST completa com operações CRUD (Create, Read, Update, Delete) para gerenciamento de itens, utilizando:

- **AWS Lambda**: Funções serverless para lógica de negócio
- **API Gateway**: Exposição dos endpoints REST
- **DynamoDB**: Banco de dados NoSQL para persistência
- **Amazon SNS**: Serviço de notificações em tópico
- **LocalStack**: Emulador local dos serviços AWS

## 🚀 Funcionalidades

- ✅ CRUD completo com 4 operações básicas via endpoints REST
- ✅ Notificação SNS quando um item é criado ou atualizado
- ✅ Subscriber Lambda que recebe e processa as notificações
- ✅ Validação de dados de entrada nas operações de criação e atualização
- ✅ Ambiente local simulado com LocalStack

## 📁 Estrutura do Projeto

```
.
├── src/
│   ├── handlers/          # Funções Lambda
│   │   ├── createItem.js
│   │   ├── listItems.js
│   │   ├── getItem.js
│   │   ├── updateItem.js
│   │   ├── deleteItem.js
│   │   └── notificationSubscriber.js
│   └── utils/             # Utilitários
│       ├── dynamodb.js
│       ├── sns.js
│       ├── validation.js
│       └── response.js
├── serverless.yml         # Configuração do Serverless Framework
├── package.json
└── README.md
```

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (versão 18 ou superior)
2. **Docker** e **Docker Compose** (para o LocalStack)
3. **npm** ou **yarn**

## 📦 Instalação

1. Clone o repositório (ou navegue até o diretório do projeto)

2. Instale as dependências:

```bash
npm install
```

3. Certifique-se de que o Docker está rodando

4. O LocalStack será iniciado automaticamente quando você fizer o deploy, mas você também pode iniciá-lo manualmente:

```bash
docker run --rm -it -p 4566:4566 -p 4571:4571 localstack/localstack
```

Ou usando Docker Compose (crie um arquivo `docker-compose.yml` se preferir):

```yaml
version: '3.8'
services:
  localstack:
    container_name: localstack
    image: localstack/localstack:latest
    ports:
      - "4566:4566"
      - "4571:4571"
    environment:
      - SERVICES=lambda,dynamodb,sns,apigateway
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
    volumes:
      - "./.localstack:/tmp/localstack"
```

## 🚀 Executando o Projeto

### 1. Deploy no LocalStack

Execute o deploy da aplicação:

```bash
npm run deploy
```

Ou diretamente:

```bash
serverless deploy --stage local
```

Este comando irá:
- Criar a tabela DynamoDB
- Criar o tópico SNS
- Configurar as funções Lambda
- Configurar os endpoints da API Gateway
- Configurar o subscriber Lambda para o tópico SNS

### 2. Obter a URL da API

Após o deploy, você verá a URL da API no output. Ela será algo como:

```
https://xxxxx.execute-api.us-east-1.amazonaws.com/local
```

Ou se estiver usando LocalStack:

```
http://localhost:4566/restapis/xxxxx/local/_user_request_
```

### 3. Testar os Endpoints

#### Criar um Item (POST)

```bash
curl -X POST http://localhost:4566/restapis/{api-id}/local/_user_request_/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook",
    "description": "Notebook Dell Inspiron 15",
    "price": 3500.00,
    "category": "Eletrônicos"
  }'
```

#### Listar Todos os Itens (GET)

```bash
curl http://localhost:4566/restapis/{api-id}/local/_user_request_/items
```

#### Buscar Item por ID (GET)

```bash
curl http://localhost:4566/restapis/{api-id}/local/_user_request_/items/{id}
```

#### Atualizar Item (PUT)

```bash
curl -X PUT http://localhost:4566/restapis/{api-id}/local/_user_request_/items/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Atualizado",
    "price": 3200.00
  }'
```

#### Deletar Item (DELETE)

```bash
curl -X DELETE http://localhost:4566/restapis/{api-id}/local/_user_request_/items/{id}
```

## 📝 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/items` | Criar novo item + notificação SNS |
| GET | `/items` | Listar todos os itens |
| GET | `/items/{id}` | Buscar item por ID |
| PUT | `/items/{id}` | Atualizar item existente + notificação SNS |
| DELETE | `/items/{id}` | Remover item |

## 🔔 Notificações SNS

O sistema publica notificações no tópico SNS quando:

- Um item é **criado** (evento `CREATED`)
- Um item é **atualizado** (evento `UPDATED`)

O subscriber Lambda (`notificationSubscriber`) é automaticamente invocado quando uma mensagem é publicada no tópico, processando e registrando a notificação.

### Estrutura da Mensagem SNS

```json
{
  "eventType": "CREATED" | "UPDATED",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "item": {
    "id": "uuid",
    "name": "Nome do Item",
    "description": "Descrição",
    "price": 100.00,
    "category": "Categoria"
  }
}
```

## ✅ Validação de Dados

### Criação de Item

- `name`: Obrigatório, string não vazia, máximo 100 caracteres
- `description`: Opcional, string, máximo 500 caracteres
- `price`: Opcional, número não negativo (padrão: 0)
- `category`: Opcional, string (padrão: "general")

### Atualização de Item

- Pelo menos um campo deve ser fornecido
- Mesmas regras de validação da criação para cada campo

## 📊 Verificando Logs

Para ver os logs das funções Lambda:

```bash
# Logs de uma função específica
serverless logs -f createItem --stage local --tail

# Logs do subscriber
serverless logs -f notificationSubscriber --stage local --tail
```

## 🧹 Removendo o Deploy

Para remover todos os recursos criados:

```bash
npm run remove
```

Ou:

```bash
serverless remove --stage local
```

## 🧪 Exemplo de Teste Completo

Aqui está um exemplo de fluxo completo de teste:

```bash
# 1. Criar um item
RESPONSE=$(curl -X POST http://localhost:4566/restapis/{api-id}/local/_user_request_/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto Teste",
    "description": "Descrição do produto",
    "price": 99.99,
    "category": "Teste"
  }')

# 2. Extrair o ID do item criado
ITEM_ID=$(echo $RESPONSE | jq -r '.data.id')

# 3. Listar todos os itens
curl http://localhost:4566/restapis/{api-id}/local/_user_request_/items

# 4. Buscar o item específico
curl http://localhost:4566/restapis/{api-id}/local/_user_request_/items/$ITEM_ID

# 5. Atualizar o item
curl -X PUT http://localhost:4566/restapis/{api-id}/local/_user_request_/items/$ITEM_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto Teste Atualizado",
    "price": 89.99
  }'

# 6. Deletar o item
curl -X DELETE http://localhost:4566/restapis/{api-id}/local/_user_request_/items/$ITEM_ID
```

## 🔍 Verificando Recursos no LocalStack

Você pode verificar os recursos criados usando a AWS CLI configurada para LocalStack:

```bash
# Listar tabelas DynamoDB
aws --endpoint-url=http://localhost:4566 dynamodb list-tables

# Listar tópicos SNS
aws --endpoint-url=http://localhost:4566 sns list-topics

# Listar funções Lambda
aws --endpoint-url=http://localhost:4566 lambda list-functions
```

## 📚 Tecnologias Utilizadas

- **Serverless Framework**: Framework para deploy de aplicações serverless
- **LocalStack**: Emulador local dos serviços AWS
- **AWS Lambda**: Funções serverless para lógica de negócio
- **API Gateway**: Exposição dos endpoints REST
- **DynamoDB**: Banco de dados NoSQL para persistência
- **Amazon SNS**: Serviço de notificações em tópico
- **Node.js**: Runtime das funções Lambda

## 🐛 Troubleshooting

### LocalStack não inicia

Certifique-se de que:
- Docker está rodando
- A porta 4566 não está em uso
- Você tem permissões suficientes para executar Docker

### Erro ao fazer deploy

- Verifique se o LocalStack está rodando
- Certifique-se de que todas as dependências foram instaladas (`npm install`)
- Verifique os logs do LocalStack

### Notificações SNS não funcionam

- Verifique se o tópico SNS foi criado corretamente
- Verifique se o subscriber Lambda tem permissão para ser invocado pelo SNS
- Verifique os logs do subscriber Lambda

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

## 👥 Autores

Desenvolvido como parte do Laboratório de Desenvolvimento de Aplicações Móveis e Distribuídas.

---

**Nota**: Este projeto utiliza LocalStack para simular serviços AWS localmente. Para produção, você precisaria configurar credenciais AWS reais e fazer deploy em uma conta AWS real.
