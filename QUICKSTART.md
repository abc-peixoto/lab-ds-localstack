# Guia Rápido de Início

## Passos Rápidos

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar LocalStack (opcional - será iniciado automaticamente)

```bash
docker-compose up -d
```

Ou manualmente:

```bash
docker run --rm -it -p 4566:4566 localstack/localstack
```

### 3. Fazer Deploy

```bash
npm run deploy
```

### 4. Obter URL da API

Após o deploy, copie a URL da API do output. Ela será algo como:

```text
http://localhost:4566/restapis/{api-id}/local/_user_request_
```

### 5. Testar a API

#### Criar um item:

```bash
curl -X POST http://localhost:4566/restapis/{api-id}/local/_user_request_/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste", "price": 100}'
```

#### Listar itens:

```bash
curl http://localhost:4566/restapis/{api-id}/local/_user_request_/items
```

### 6. Ver Logs

```bash
# Logs do subscriber (notificações SNS)
serverless logs -f notificationSubscriber --stage local --tail

# Logs de criação
serverless logs -f createItem --stage local --tail
```

## Estrutura de Dados

### Criar Item (POST /items)

```json
{
  "name": "Nome do Item",        // Obrigatório
  "description": "Descrição",    // Opcional
  "price": 100.00,               // Opcional (padrão: 0)
  "category": "Categoria"        // Opcional (padrão: "general")
}
```

### Atualizar Item (PUT /items/{id})

```json
{
  "name": "Novo Nome",           // Opcional
  "price": 200.00                // Opcional
  // Qualquer combinação dos campos acima
}
```

## Troubleshooting

- **LocalStack não inicia**: Verifique se Docker está rodando
- **Erro no deploy**: Verifique se LocalStack está acessível em `http://localhost:4566`
- **Notificações não funcionam**: Verifique os logs do subscriber Lambda

Para mais detalhes, consulte o [README.md](README.md).
