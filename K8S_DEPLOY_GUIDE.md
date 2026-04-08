# 🚀 Deploy Edge Functions no Kubernetes (K3s)

## 📋 Pré-requisitos

Você está rodando Supabase via Helm chart: https://github.com/supabase-community/supabase-kubernetes

As Edge Functions precisam de:
1. **ConfigMaps** com o código TypeScript
2. **Secrets** com as variáveis de ambiente
3. **Volume mounts** no pod do Edge Runtime

---

## ⚙️ Configuração

**Configure o namespace e deployment do K8s no `.env`:**

```bash
# Copie o .env.example se ainda não tiver .env
cp .env.example .env

# Edite o .env e adicione suas configurações K8s
K8S_NAMESPACE=calm-river
K8S_DEPLOYMENT=calm-river-supabase-functions
```

**Como descobrir os valores corretos:**

```bash
# Listar namespaces disponíveis
kubectl get namespaces

# Listar deployments no namespace do Supabase
kubectl get deployments -n <seu-namespace>

# O deployment geralmente tem um nome como:
# - supabase-functions
# - <namespace>-supabase-functions
# - functions
```

**Fallback padrão:** Se não configurar, o script usa `supabase` como namespace e `supabase-functions` como deployment.

---

## ⚡ Deploy Automático (RECOMENDADO)

**Novo workflow simplificado!** Use o script automatizado para deploy de Edge Functions.

### Como Usar

```bash
# Deploy todas as funções de supabase/functions/
pnpm deploy:functions
```

**O que o script faz automaticamente:**
1. ✅ Detecta todas as funções em `supabase/functions/`
2. ✅ Calcula hash SHA256 do código (detecta mudanças)
3. ✅ Cria/atualiza ConfigMaps automaticamente
4. ✅ Adiciona volumes ao deployment (se necessário)
5. ✅ Reinicia pods (apenas se houver mudanças)
6. ✅ Exibe relatório detalhado

### Workflow de Desenvolvimento

```bash
# 1. Criar nova função
mkdir supabase/functions/my-new-function
cat > supabase/functions/my-new-function/index.ts <<EOF
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  return new Response(JSON.stringify({ message: "Hello World!" }), {
    headers: { "Content-Type": "application/json" },
  })
})
EOF

# 2. Deploy automático
pnpm deploy:functions

# 3. Testar
curl https://supa-calm-river.paulocarmino.com/functions/v1/my-new-function
```

### Output Esperado

```
🚀 Deploy de Edge Functions para K8s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Processando: webhook-receiver
  ✅ Sem mudanças (hash: 3f2a1b9e...)

📦 Processando: execute-workflow
  ✅ Sem mudanças (hash: 7c8d4e1f...)

📦 Processando: my-new-function
  🔄 Atualizando ConfigMap...
  🔧 Adicionando volume ao deployment...
  ✅ Volume adicionado
  ✅ Atualizado (hash: 9a5f2c3d...)

♻️  Reiniciando pods...
  ⏳ Aguardando rollout...
  ✅ Pods reiniciados com sucesso

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Resumo

✅ Atualizadas (1):
  - my-new-function

⏭️  Sem mudanças (2):
  - webhook-receiver
  - execute-workflow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Deploy concluído com sucesso!
```

### Vantagens do Script Automático

- 🚀 **Zero configuração manual** - Não precisa editar YAMLs ou deployments
- 🔍 **Detecção inteligente** - Só atualiza o que mudou (via hash SHA256)
- 📦 **Idempotente** - Rodar múltiplas vezes é seguro
- 🎯 **Escalável** - Adicione quantas funções quiser
- 🔄 **CI/CD Ready** - Pode integrar em pipelines

### Troubleshooting

**Erro: kubectl não encontrado**
```bash
# Instale kubectl: https://kubernetes.io/docs/tasks/tools/
```

**Erro: Timeout ao aguardar rollout**
- Normal em clusters lentos, verifique com: `kubectl get pods -n supabase -w`

**Erro ao adicionar volume**
- Pode significar que o volume já existe (ok!)
- Verifique: `kubectl get deployment supabase-functions -n supabase -o yaml`

---

## 🛠️ Deploy Manual (Legado)

**⚠️ Use apenas se o script automático não estiver disponível!**

Os passos abaixo são mantidos para referência e troubleshooting avançado.

---

## 🔧 Passo 1: Criar Secrets para as Functions

```bash
kubectl create secret generic supabase-edge-functions-secrets \
  --namespace=supabase \
  --from-literal=SUPABASE_URL=https://supa-calm-river.paulocarmino.com \
  --from-literal=SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3Njc5Mjg4ODgsImV4cCI6MjA4MzI4ODg4OH0.FHdRL2wKezI-xEqf8sEz7KEBTB6PKU0lb2ttchqzDJ8
```

**⚠️ Ajuste o namespace se necessário!**

---

## 🔧 Passo 2: Aplicar os ConfigMaps

```bash
kubectl apply -f k8s-deploy-functions.yaml
```

Isso criará:
- `edge-function-webhook-receiver` ConfigMap
- `edge-function-execute-workflow` ConfigMap

Verifique:
```bash
kubectl get configmaps -n supabase | grep edge-function
```

---

## 🔧 Passo 3: Configurar o Helm Values

Você precisa atualizar o `values.yaml` do Helm chart para montar as functions.

**Opção A: Via values.yaml**

Adicione no seu `values.yaml`:

```yaml
functions:
  # ... configuração existente

  # Montar ConfigMaps como volumes
  volumes:
    - name: webhook-receiver-function
      configMap:
        name: edge-function-webhook-receiver
    - name: execute-workflow-function
      configMap:
        name: edge-function-execute-workflow

  volumeMounts:
    - name: webhook-receiver-function
      mountPath: /home/deno/functions/webhook-receiver
      readOnly: true
    - name: execute-workflow-function
      mountPath: /home/deno/functions/execute-workflow
      readOnly: true

  # Secrets com env vars
  envFrom:
    - secretRef:
        name: supabase-edge-functions-secrets
```

**Opção B: Patch direto no deployment (mais rápido para testar)**

```bash
# Editar o deployment do edge runtime
kubectl edit deployment supabase-functions -n supabase
```

Adicione na spec:
```yaml
spec:
  template:
    spec:
      containers:
      - name: functions
        envFrom:
        - secretRef:
            name: supabase-edge-functions-secrets
        volumeMounts:
        - name: webhook-receiver
          mountPath: /home/deno/functions/webhook-receiver
          readOnly: true
        - name: execute-workflow
          mountPath: /home/deno/functions/execute-workflow
          readOnly: true
      volumes:
      - name: webhook-receiver
        configMap:
          name: edge-function-webhook-receiver
      - name: execute-workflow
        configMap:
          name: edge-function-execute-workflow
```

---

## 🔧 Passo 4: Reiniciar o Edge Runtime

```bash
# Se usou Opção A (Helm upgrade)
helm upgrade supabase supabase/supabase -f values.yaml -n supabase

# Se usou Opção B (patch manual)
kubectl rollout restart deployment supabase-functions -n supabase
```

Aguarde os pods subirem:
```bash
kubectl get pods -n supabase -w
```

---

## ✅ Passo 5: Verificar Deployment

### 5.1 Verificar ConfigMaps montados

```bash
kubectl exec -it deployment/supabase-functions -n supabase -- ls -la /home/deno/functions/
```

Você deve ver:
```
drwxr-xr-x webhook-receiver/
drwxr-xr-x execute-workflow/
```

### 5.2 Verificar conteúdo

```bash
kubectl exec -it deployment/supabase-functions -n supabase -- cat /home/deno/functions/webhook-receiver/index.ts
```

### 5.3 Verificar secrets

```bash
kubectl exec -it deployment/supabase-functions -n supabase -- env | grep SUPABASE
```

Deve mostrar:
```
SUPABASE_URL=https://supa-calm-river.paulocarmino.com
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 5.4 Verificar logs

```bash
kubectl logs -f deployment/supabase-functions -n supabase
```

---

## 🧪 Passo 6: Testar as Functions

### 6.1 Testar webhook-receiver

```bash
curl -X POST \
  'https://supa-calm-river.paulocarmino.com/functions/v1/webhook-receiver?workflowId=7ed0629a-77a5-49f4-9402-7a328e11c444' \
  -H 'Content-Type: application/json' \
  -d '{"test": "Kubernetes deployment test!"}'
```

**Resposta esperada:**
```json
{
  "success": true,
  "executionId": "uuid-aqui",
  "message": "Workflow execution started"
}
```

### 6.2 Verificar no banco

```bash
psql "postgresql://postgres:vpXmE4Q4SEie2SL2zGaVCzK0@64.181.228.28:30434/postgres" \
  -c "SELECT id, status, started_at FROM workflow_executions ORDER BY started_at DESC LIMIT 1;"
```

### 6.3 Verificar na UI

Abra: http://localhost:5173/workflows/7ed0629a-77a5-49f4-9402-7a328e11c444/executions

A execução deve aparecer!

---

## 🐛 Troubleshooting

### Functions não aparecem

```bash
# Verificar se ConfigMaps existem
kubectl get configmaps -n supabase | grep edge-function

# Verificar se estão montados nos pods
kubectl describe pod -l app=supabase-functions -n supabase | grep -A 10 "Mounts:"
```

### Erro "No such file or directory"

Significa que o volume mount não está configurado corretamente. Verifique o deployment.

### Erro 500 nas functions

```bash
# Ver logs detalhados
kubectl logs -f deployment/supabase-functions -n supabase --tail=100

# Ver eventos do pod
kubectl get events -n supabase --sort-by='.lastTimestamp' | grep functions
```

### Secrets não carregam

```bash
# Verificar se secret existe
kubectl get secret supabase-edge-functions-secrets -n supabase -o yaml

# Recrear secret se necessário
kubectl delete secret supabase-edge-functions-secrets -n supabase
# ... e criar novamente com o comando do Passo 1
```

---

## 🔄 Atualizar Functions (após mudanças no código)

**Método Automático (Recomendado):**
```bash
pnpm deploy:functions
```

**Método Manual (Legado):**
```bash
# 1. Deletar ConfigMaps antigos
kubectl delete configmap edge-function-webhook-receiver edge-function-execute-workflow -n supabase

# 2. Aplicar novos ConfigMaps (arquivo obsoleto)
kubectl apply -f k8s-deploy-functions.yaml

# 3. Reiniciar pods (força reload)
kubectl rollout restart deployment supabase-functions -n supabase
```

---

## 📊 Comandos Úteis

```bash
# Ver todas as functions deployadas
kubectl exec -it deployment/supabase-functions -n supabase -- ls -la /home/deno/functions/

# Tail nos logs em tempo real
kubectl logs -f deployment/supabase-functions -n supabase

# Ver variáveis de ambiente
kubectl exec -it deployment/supabase-functions -n supabase -- env

# Descrever deployment
kubectl describe deployment supabase-functions -n supabase

# Ver status dos pods
kubectl get pods -n supabase -l app=supabase-functions
```

---

## 🎯 Checklist Final

- [ ] Secrets criados e verificados
- [ ] ConfigMaps aplicados
- [ ] Helm values atualizado OU deployment patchado
- [ ] Pods reiniciados
- [ ] Functions apareceram em `/home/deno/functions/`
- [ ] Teste via curl retornou success
- [ ] Execution apareceu no banco
- [ ] UI mostra a execução

**Tudo funcionando? FASE 4 está 100% completa! 🚀**

---

## 📝 Alternativa: Deploy Local para Testes

Se quiser testar localmente primeiro:

```bash
# Iniciar Supabase local
supabase start

# Servir functions localmente
supabase functions serve

# Testar
curl -X POST 'http://localhost:54321/functions/v1/webhook-receiver?workflowId=...' \
  -H 'Content-Type: application/json' \
  -d '{"test": "local"}'
```
