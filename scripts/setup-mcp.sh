#!/bin/bash

# ============================================
# Supabase MCP Server Setup Script
# ============================================
# Este script configura o MCP Server do Supabase
# no Claude Code usando as credenciais do .env local
#
# Uso: pnpm setup:mcp
# ============================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Supabase MCP Server Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 1. Verificar se .env existe
if [ ! -f .env ]; then
  echo -e "${RED}❌ Erro: Arquivo .env não encontrado${NC}"
  echo -e "${YELLOW}💡 Execute: cp .env.example .env${NC}"
  echo -e "${YELLOW}   Depois edite o .env com suas credenciais do Supabase${NC}"
  exit 1
fi

# 2. Carregar variáveis do .env
echo -e "${BLUE}📄 Carregando credenciais do .env...${NC}"

# Source .env sem exportar (apenas para leitura)
set -a
source .env
set +a

# 3. Validar variáveis obrigatórias
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${RED}❌ Erro: Variáveis do Supabase não configuradas no .env${NC}"
  echo ""
  echo -e "${YELLOW}Configure as seguintes variáveis no .env:${NC}"
  echo -e "  ${YELLOW}SUPABASE_URL${NC}"
  echo -e "  ${YELLOW}SUPABASE_ANON_KEY${NC}"
  echo -e "  ${YELLOW}SUPABASE_SERVICE_ROLE_KEY${NC}"
  echo ""
  echo -e "${YELLOW}💡 Obtenha esses valores em: Supabase Dashboard > Settings > API${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Credenciais encontradas${NC}"

# 4. Verificar se MCP Server está instalado globalmente
MCP_SERVER_PATH="$HOME/lab/.mcp-servers/supabase/dist/index.js"

if [ ! -f "$MCP_SERVER_PATH" ]; then
  echo -e "${RED}❌ Erro: MCP Server não encontrado em $MCP_SERVER_PATH${NC}"
  echo ""
  echo -e "${YELLOW}Instalação necessária:${NC}"
  echo -e "  ${YELLOW}cd ~/lab/.mcp-servers${NC}"
  echo -e "  ${YELLOW}git clone https://github.com/canbolayir/self-hosted-supabase-mcp supabase${NC}"
  echo -e "  ${YELLOW}cd supabase${NC}"
  echo -e "  ${YELLOW}npm install && npm run build${NC}"
  exit 1
fi

echo -e "${GREEN}✓ MCP Server instalado${NC}"

# 5. Determinar caminho do arquivo de configuração do Claude Code
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  CLAUDE_CONFIG_DIR="$HOME/.config/Claude"
else
  echo -e "${RED}❌ Sistema operacional não suportado: $OSTYPE${NC}"
  exit 1
fi

CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"

# 6. Criar diretório se não existir
mkdir -p "$CLAUDE_CONFIG_DIR"

# 7. Criar ou atualizar arquivo de configuração
echo -e "${BLUE}🔧 Atualizando configuração do Claude Code...${NC}"

# Criar configuração JSON temporária
cat > /tmp/mcp-config-temp.json <<EOF
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["$MCP_SERVER_PATH"],
      "env": {
        "SUPABASE_URL": "$SUPABASE_URL",
        "SUPABASE_ANON_KEY": "$SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY": "$SUPABASE_SERVICE_ROLE_KEY"
      }
    }
  }
}
EOF

# Se arquivo não existe, criar novo
if [ ! -f "$CLAUDE_CONFIG_FILE" ]; then
  cp /tmp/mcp-config-temp.json "$CLAUDE_CONFIG_FILE"
  echo -e "${GREEN}✓ Arquivo de configuração criado${NC}"
else
  # Arquivo existe - fazer merge (sobrescrever apenas a seção "supabase")
  # Por simplicidade, vamos sobrescrever tudo (pode ser melhorado com jq no futuro)
  cp /tmp/mcp-config-temp.json "$CLAUDE_CONFIG_FILE"
  echo -e "${GREEN}✓ Configuração atualizada${NC}"
fi

# Limpar arquivo temporário
rm /tmp/mcp-config-temp.json

# 8. Sucesso!
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ MCP Server configurado com sucesso!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📍 Configuração salva em:${NC}"
echo -e "   $CLAUDE_CONFIG_FILE"
echo ""
echo -e "${YELLOW}🔄 Próximos passos:${NC}"
echo -e "   1. ${BLUE}Reinicie o Claude Desktop${NC}"
echo -e "   2. ${BLUE}As 42 ferramentas do Supabase estarão disponíveis${NC}"
echo ""
echo -e "${YELLOW}💡 Dica:${NC} Quando trocar de projeto, rode ${BLUE}pnpm setup:mcp${NC} novamente"
echo ""
