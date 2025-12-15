#!/bin/bash

# Script de teste para a API CRUD
# Substitua {api-id} pela URL real da sua API após o deploy
BASE_URL="http://localhost:4566/_aws/execute-api/qtlunbspvm/local"

echo "=== Testando API CRUD com SNS ==="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper: extrai o valor de "id" do JSON (sem jq)
extract_id() {
  local json="$1"

  # Pega tudo após a primeira ocorrência de "id"
  local tail="${json#*\"id\"}"

  # Se não encontrou, retorna vazio
  if [ "$tail" = "$json" ]; then
    echo ""
    return
  fi

  # Pega tudo após o primeiro :
  tail="${tail#*:}"

  # Remove espaços, aspas, vírgulas e chaves do começo
  tail="${tail# }"
  tail="${tail#\"}"

  # Agora tail começa com o ID; corta até a próxima aspas
  local id="${tail%%\"*}"
  echo "$id"
}

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

echo "$CREATE_RESPONSE"

ITEM_ID="$(extract_id "$CREATE_RESPONSE")"
if [ -z "$ITEM_ID" ]; then
  echo -e "${RED}Não foi possível extrair o ID do item. Resposta acima.${NC}"
  exit 1
fi

echo -e "${GREEN}Item criado com ID: $ITEM_ID${NC}"
echo ""

# 2. Criar outro item
echo -e "${BLUE}2. Criando outro item...${NC}"
SECOND_RESPONSE=$(curl -s -X POST "${BASE_URL}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mouse Logitech",
    "description": "Mouse sem fio Logitech MX Master 3",
    "price": 450.00,
    "category": "Periféricos"
  }')
echo "$SECOND_RESPONSE"
echo ""

# 3. Listar todos os itens
echo -e "${BLUE}3. Listando todos os itens...${NC}"
LIST_RESPONSE=$(curl -s "${BASE_URL}/items")
echo "$LIST_RESPONSE"
echo ""

# 4. Buscar item específico
echo -e "${BLUE}4. Buscando item por ID: $ITEM_ID${NC}"
GET_RESPONSE=$(curl -s "${BASE_URL}/items/${ITEM_ID}")
echo "$GET_RESPONSE"
echo ""

# 5. Atualizar item
echo -e "${BLUE}5. Atualizando item: $ITEM_ID${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "${BASE_URL}/items/${ITEM_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Dell Atualizado",
    "price": 3200.00
  }')
echo "$UPDATE_RESPONSE"
echo ""

# 6. Verificar atualização
echo -e "${BLUE}6. Verificando item atualizado...${NC}"
GET_UPDATED_RESPONSE=$(curl -s "${BASE_URL}/items/${ITEM_ID}")
echo "$GET_UPDATED_RESPONSE"
echo ""

# 7. Deletar item
echo -e "${BLUE}7. Deletando item: $ITEM_ID${NC}"
DELETE_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/items/${ITEM_ID}")
echo "$DELETE_RESPONSE"
echo ""

# 8. Verificar que foi deletado
echo -e "${BLUE}8. Verificando que o item foi deletado...${NC}"
GET_DELETED_RESPONSE=$(curl -s "${BASE_URL}/items/${ITEM_ID}")
echo "$GET_DELETED_RESPONSE"
echo ""

echo -e "${GREEN}=== Testes concluídos! ===${NC}"
echo ""
echo "Verifique os logs do subscriber Lambda para ver as notificações SNS:"
echo "serverless logs -f notificationSubscriber
