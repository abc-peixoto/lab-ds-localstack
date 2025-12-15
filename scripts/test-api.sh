#!/bin/bash

# Script de teste para a API CRUD
# Substitua {api-id} pela URL real da sua API após o deploy

BASE_URL="http://localhost:4566/restapis/{api-id}/local/_user_request_"

echo "=== Testando API CRUD com SNS ==="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Criar item
echo -e "${BLUE}1. Criando um novo item...${NC}"
CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Dell",
    "description": "Notebook Dell Inspiron 15 3000",
    "price": 3500.00,
    "category": "Eletrônicos"
  }')

echo "$CREATE_RESPONSE" | jq '.'
ITEM_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.id')
echo -e "${GREEN}Item criado com ID: $ITEM_ID${NC}"
echo ""

# 2. Criar outro item
echo -e "${BLUE}2. Criando outro item...${NC}"
curl -s -X POST "${BASE_URL}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mouse Logitech",
    "description": "Mouse sem fio Logitech MX Master 3",
    "price": 450.00,
    "category": "Periféricos"
  }' | jq '.'
echo ""

# 3. Listar todos os itens
echo -e "${BLUE}3. Listando todos os itens...${NC}"
curl -s "${BASE_URL}/items" | jq '.'
echo ""

# 4. Buscar item específico
echo -e "${BLUE}4. Buscando item por ID: $ITEM_ID${NC}"
curl -s "${BASE_URL}/items/${ITEM_ID}" | jq '.'
echo ""

# 5. Atualizar item
echo -e "${BLUE}5. Atualizando item: $ITEM_ID${NC}"
curl -s -X PUT "${BASE_URL}/items/${ITEM_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Dell Atualizado",
    "price": 3200.00
  }' | jq '.'
echo ""

# 6. Verificar atualização
echo -e "${BLUE}6. Verificando item atualizado...${NC}"
curl -s "${BASE_URL}/items/${ITEM_ID}" | jq '.'
echo ""

# 7. Deletar item
echo -e "${BLUE}7. Deletando item: $ITEM_ID${NC}"
curl -s -X DELETE "${BASE_URL}/items/${ITEM_ID}" | jq '.'
echo ""

# 8. Verificar que foi deletado
echo -e "${BLUE}8. Verificando que o item foi deletado...${NC}"
curl -s "${BASE_URL}/items/${ITEM_ID}" | jq '.'
echo ""

echo -e "${GREEN}=== Testes concluídos! ===${NC}"
echo ""
echo "Verifique os logs do subscriber Lambda para ver as notificações SNS:"
echo "serverless logs -f notificationSubscriber --stage local --tail"

