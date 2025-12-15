# Script de teste para a API CRUD (PowerShell)
# Substitua {api-id} pela URL real da sua API após o deploy

$BaseUrl = "http://localhost:4566/restapis/{api-id}/local/_user_request_"

Write-Host "=== Testando API CRUD com SNS ===" -ForegroundColor Cyan
Write-Host ""

# 1. Criar item
Write-Host "1. Criando um novo item..." -ForegroundColor Blue
$createBody = @{
    name = "Notebook Dell"
    description = "Notebook Dell Inspiron 15 3000"
    price = 3500.00
    category = "Eletrônicos"
} | ConvertTo-Json

$createResponse = Invoke-RestMethod -Uri "$BaseUrl/items" -Method Post -Body $createBody -ContentType "application/json"
$createResponse | ConvertTo-Json -Depth 10
$itemId = $createResponse.data.id
Write-Host "Item criado com ID: $itemId" -ForegroundColor Green
Write-Host ""

# 2. Criar outro item
Write-Host "2. Criando outro item..." -ForegroundColor Blue
$createBody2 = @{
    name = "Mouse Logitech"
    description = "Mouse sem fio Logitech MX Master 3"
    price = 450.00
    category = "Periféricos"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BaseUrl/items" -Method Post -Body $createBody2 -ContentType "application/json" | ConvertTo-Json -Depth 10
Write-Host ""

# 3. Listar todos os itens
Write-Host "3. Listando todos os itens..." -ForegroundColor Blue
Invoke-RestMethod -Uri "$BaseUrl/items" -Method Get | ConvertTo-Json -Depth 10
Write-Host ""

# 4. Buscar item específico
Write-Host "4. Buscando item por ID: $itemId" -ForegroundColor Blue
Invoke-RestMethod -Uri "$BaseUrl/items/$itemId" -Method Get | ConvertTo-Json -Depth 10
Write-Host ""

# 5. Atualizar item
Write-Host "5. Atualizando item: $itemId" -ForegroundColor Blue
$updateBody = @{
    name = "Notebook Dell Atualizado"
    price = 3200.00
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BaseUrl/items/$itemId" -Method Put -Body $updateBody -ContentType "application/json" | ConvertTo-Json -Depth 10
Write-Host ""

# 6. Verificar atualização
Write-Host "6. Verificando item atualizado..." -ForegroundColor Blue
Invoke-RestMethod -Uri "$BaseUrl/items/$itemId" -Method Get | ConvertTo-Json -Depth 10
Write-Host ""

# 7. Deletar item
Write-Host "7. Deletando item: $itemId" -ForegroundColor Blue
Invoke-RestMethod -Uri "$BaseUrl/items/$itemId" -Method Delete | ConvertTo-Json -Depth 10
Write-Host ""

# 8. Verificar que foi deletado
Write-Host "8. Verificando que o item foi deletado..." -ForegroundColor Blue
try {
    Invoke-RestMethod -Uri "$BaseUrl/items/$itemId" -Method Get | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Item não encontrado (esperado após deletar)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== Testes concluídos! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Verifique os logs do subscriber Lambda para ver as notificações SNS:"
Write-Host "serverless logs -f notificationSubscriber --stage local --tail"

