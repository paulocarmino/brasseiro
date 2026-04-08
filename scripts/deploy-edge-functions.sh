#!/bin/bash
# deploy-edge-functions.sh
#
# Script automático para deploy de Edge Functions do Supabase para K8s
# Detecta novas funções, calcula hashes, cria ConfigMaps e atualiza deployment

# Carregar variáveis do .env se existir
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
fi

# Configurações (usa .env ou fallback para padrões)
NAMESPACE="${K8S_NAMESPACE:-supabase}"
DEPLOYMENT="${K8S_DEPLOYMENT:-supabase-functions}"
FUNCTIONS_DIR="supabase/functions"
MOUNT_BASE="/home/deno/functions"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Arrays para tracking
declare -a UPDATED_FUNCTIONS
declare -a SKIPPED_FUNCTIONS
declare -a FAILED_FUNCTIONS

main() {
  echo -e "${BLUE}🚀 Deploy de Edge Functions para K8s${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${BLUE}📍 Namespace: ${NAMESPACE}${NC}"
  echo -e "${BLUE}📦 Deployment: ${DEPLOYMENT}${NC}"
  echo ""

  # 1. Verificar dependências
  check_dependencies

  # 2. Verificar se diretório de funções existe
  if [ ! -d "$FUNCTIONS_DIR" ]; then
    echo -e "${RED}❌ Diretório $FUNCTIONS_DIR não encontrado${NC}"
    exit 1
  fi

  # 3. Listar todas as funções
  local has_functions=false
  for function_dir in "$FUNCTIONS_DIR"/*; do
    if [ -d "$function_dir" ]; then
      has_functions=true
      function_name=$(basename "$function_dir")
      process_function "$function_name"
    fi
  done

  if [ "$has_functions" = false ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Nenhuma função encontrada em $FUNCTIONS_DIR${NC}"
    exit 0
  fi

  # 4. Restart dos pods (se houver mudanças)
  if [ ${#UPDATED_FUNCTIONS[@]} -gt 0 ]; then
    restart_deployment
  else
    echo ""
    echo -e "${BLUE}ℹ️  Nenhuma mudança detectada, pods não serão reiniciados${NC}"
  fi

  # 5. Relatório final
  print_summary
}

process_function() {
  local function_name=$1
  local index_file="$FUNCTIONS_DIR/$function_name/index.ts"

  echo ""
  echo -e "${BLUE}📦 Processando: $function_name${NC}"

  # Verificar se index.ts existe
  if [ ! -f "$index_file" ]; then
    echo -e "  ${YELLOW}⚠️  index.ts não encontrado, pulando...${NC}"
    SKIPPED_FUNCTIONS+=("$function_name (sem index.ts)")
    return
  fi

  # Calcular hash do conteúdo
  local new_hash=$(sha256sum "$index_file" | awk '{print $1}')

  # Verificar se ConfigMap já existe
  local configmap_name="edge-function-$function_name"
  local existing_hash=$(kubectl get configmap "$configmap_name" -n "$NAMESPACE" \
    -o jsonpath='{.metadata.annotations.content-hash}' 2>/dev/null)

  if [ "$existing_hash" == "$new_hash" ]; then
    echo -e "  ${GREEN}✅ Sem mudanças (hash: ${new_hash:0:8}...)${NC}"
    SKIPPED_FUNCTIONS+=("$function_name")
    return
  fi

  # Criar/atualizar ConfigMap
  echo -e "  ${BLUE}🔄 Atualizando ConfigMap...${NC}"
  if create_or_update_configmap "$function_name" "$index_file" "$new_hash"; then
    # Garantir que volume está montado no deployment
    ensure_volume_mounted "$function_name"

    UPDATED_FUNCTIONS+=("$function_name")
    echo -e "  ${GREEN}✅ Atualizado (hash: ${new_hash:0:8}...)${NC}"
  else
    FAILED_FUNCTIONS+=("$function_name")
    echo -e "  ${RED}❌ Erro ao atualizar ConfigMap${NC}"
  fi
}

create_or_update_configmap() {
  local function_name=$1
  local index_file=$2
  local hash=$3
  local configmap_name="edge-function-$function_name"

  # Gerar YAML temporário
  local temp_yaml=$(mktemp)

  cat > "$temp_yaml" <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: $configmap_name
  namespace: $NAMESPACE
  labels:
    function: $function_name
    managed-by: deploy-edge-functions-script
  annotations:
    content-hash: "$hash"
data:
  index.ts: |
$(cat "$index_file" | sed 's/^/    /')
EOF

  # Aplicar ConfigMap
  kubectl apply -f "$temp_yaml" >/dev/null 2>&1
  local result=$?

  rm -f "$temp_yaml"
  return $result
}

ensure_volume_mounted() {
  local function_name=$1
  local volume_name="${function_name}-function"
  local configmap_name="edge-function-$function_name"
  local mount_path="$MOUNT_BASE/$function_name"

  # Verificar se volume já existe
  local existing_volume=$(kubectl get deployment "$DEPLOYMENT" -n "$NAMESPACE" \
    -o jsonpath="{.spec.template.spec.volumes[?(@.name=='$volume_name')].name}" 2>/dev/null)

  if [ -n "$existing_volume" ]; then
    echo -e "  ${BLUE}ℹ️  Volume já montado${NC}"
    return 0
  fi

  echo -e "  ${BLUE}🔧 Adicionando volume ao deployment...${NC}"

  # Patch para adicionar volume
  kubectl patch deployment "$DEPLOYMENT" -n "$NAMESPACE" --type='json' -p="[
    {
      \"op\": \"add\",
      \"path\": \"/spec/template/spec/volumes/-\",
      \"value\": {
        \"name\": \"$volume_name\",
        \"configMap\": {
          \"name\": \"$configmap_name\"
        }
      }
    }
  ]" >/dev/null 2>&1

  # Patch para adicionar volumeMount
  kubectl patch deployment "$DEPLOYMENT" -n "$NAMESPACE" --type='json' -p="[
    {
      \"op\": \"add\",
      \"path\": \"/spec/template/spec/containers/0/volumeMounts/-\",
      \"value\": {
        \"name\": \"$volume_name\",
        \"mountPath\": \"$mount_path\"
      }
    }
  ]" >/dev/null 2>&1

  if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✅ Volume adicionado${NC}"
  else
    echo -e "  ${YELLOW}⚠️  Erro ao adicionar volume (pode já existir)${NC}"
  fi
}

restart_deployment() {
  echo ""
  echo -e "${BLUE}♻️  Reiniciando pods...${NC}"
  kubectl rollout restart deployment "$DEPLOYMENT" -n "$NAMESPACE" >/dev/null 2>&1

  # Aguardar rollout
  echo -e "  ${BLUE}⏳ Aguardando rollout...${NC}"
  kubectl rollout status deployment "$DEPLOYMENT" -n "$NAMESPACE" --timeout=60s >/dev/null 2>&1

  if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✅ Pods reiniciados com sucesso${NC}"
  else
    echo -e "  ${YELLOW}⚠️  Timeout ao aguardar rollout (pode estar em progresso)${NC}"
  fi
}

check_dependencies() {
  local missing_deps=false

  if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl não encontrado${NC}"
    echo "   Instale: https://kubernetes.io/docs/tasks/tools/"
    missing_deps=true
  fi

  if ! command -v sha256sum &> /dev/null; then
    echo -e "${RED}❌ sha256sum não encontrado${NC}"
    missing_deps=true
  fi

  if [ "$missing_deps" = true ]; then
    exit 1
  fi
}

print_summary() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${BLUE}📊 Resumo${NC}"
  echo ""

  if [ ${#UPDATED_FUNCTIONS[@]} -gt 0 ]; then
    echo -e "${GREEN}✅ Atualizadas (${#UPDATED_FUNCTIONS[@]}):${NC}"
    for func in "${UPDATED_FUNCTIONS[@]}"; do
      echo "  - $func"
    done
    echo ""
  fi

  if [ ${#SKIPPED_FUNCTIONS[@]} -gt 0 ]; then
    echo -e "${YELLOW}⏭️  Sem mudanças (${#SKIPPED_FUNCTIONS[@]}):${NC}"
    for func in "${SKIPPED_FUNCTIONS[@]}"; do
      echo "  - $func"
    done
    echo ""
  fi

  if [ ${#FAILED_FUNCTIONS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Erros (${#FAILED_FUNCTIONS[@]}):${NC}"
    for func in "${FAILED_FUNCTIONS[@]}"; do
      echo "  - $func"
    done
    echo ""
    exit 1
  fi

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [ ${#UPDATED_FUNCTIONS[@]} -gt 0 ]; then
    echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
  else
    echo -e "${BLUE}ℹ️  Nenhuma alteração necessária${NC}"
  fi
}

# Executar função principal
main
