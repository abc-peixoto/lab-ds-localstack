# Exemplos de requisições HTTP para testar a API

Use estas requisições com a extensão REST Client do VS Code ou similar

@baseUrl = <http://localhost:4566/restapis/{api-id}/local/_user_request>_
@contentType = application/json

## 1. Criar um novo item

POST {{baseUrl}}/items
Content-Type: {{contentType}}

{
  "name": "Notebook Dell",
  "description": "Notebook Dell Inspiron 15 3000",
  "price": 3500.00,
  "category": "Eletrônicos"
}

## 2. Criar outro item

POST {{baseUrl}}/items
Content-Type: {{contentType}}

{
  "name": "Mouse Logitech",
  "description": "Mouse sem fio Logitech MX Master 3",
  "price": 450.00,
  "category": "Periféricos"
}

## 3. Listar todos os itens

GET {{baseUrl}}/items

### 4. Buscar item por ID (substitua {id} pelo ID real)

GET {{baseUrl}}/items/{id}

## 5. Atualizar item (substitua {id} pelo ID real)

PUT {{baseUrl}}/items/{id}
Content-Type: {{contentType}}

{
  "name": "Notebook Dell Atualizado",
  "price": 3200.00
}

## 6. Atualizar apenas o preço

PUT {{baseUrl}}/items/{id}
Content-Type: {{contentType}}

{
  "price": 3100.00
}

## 7. Deletar item (substitua {id} pelo ID real)

DELETE {{baseUrl}}/items/{id}

### 8. Teste de validação - nome vazio (deve retornar erro)

POST {{baseUrl}}/items
Content-Type: {{contentType}}

{
  "name": "",
  "price": 100
}

## 9. Teste de validação - preço negativo (deve retornar erro)

POST {{baseUrl}}/items
Content-Type: {{contentType}}

{
  "name": "Produto Teste",
  "price": -10
}
