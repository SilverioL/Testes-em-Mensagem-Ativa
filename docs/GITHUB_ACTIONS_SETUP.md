# GitHub Actions CI/CD Setup

## Secrets necessários no GitHub

Para que a pipeline funcione corretamente, você precisa configurar os seguintes secrets no GitHub:

### 1. Acesse o repositório no GitHub
- Vá para Settings > Secrets and variables > Actions

### 2. Adicione os seguintes Repository Secrets:

- `IBM_CLOUD_API_KEY`: Sua chave de API do IBM Cloud
- `MIRROR_GITHUB_PAT`: Personal Access Token para espelhar repositórios (opcional, apenas se usar o workflow mirror.yml)
- Outros secrets específicos do seu ambiente (se necessários)

### 3. Configuração do .env

Se você precisar de variáveis específicas no arquivo .env, edite o step "Replace tokens in .env" 
no arquivo `.github/workflows/ci-cd.yml` para incluir as variáveis necessárias.

Exemplo:
```yaml
- name: Replace tokens in .env
  uses: cschleiden/replace-tokens@v1
  with:
    files: '.env'
    tokenPrefix: '#{'
    tokenSuffix: '}#'
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    API_KEY: ${{ secrets.API_KEY }}
    NODE_ENV: production
```

### 4. Estrutura da Pipeline

A pipeline está dividida em dois jobs:

1. **Build**: 
   - Executa testes
   - Faz build da aplicação
   - Cria artefato

2. **Deploy**: 
   - Baixa o artefato
   - Configura ambiente
   - Faz deploy no IBM Cloud Code Engine

### 5. Triggers

A pipeline é executada quando:
- Há push nas branches `master` ou `dev`
- Há pull request para as branches `master` ou `dev`

O deploy só acontece em push para `master` ou `dev`.

### 6. Personalização

Ajuste as seguintes variáveis no arquivo `ci-cd.yml` conforme seu ambiente:

- `CONTAINER_REGISTRY`
- `IMAGE_NAME`
- `IMAGE_TAG`
- `IBM_CLOUD_REGION`
- `IBM_CLOUD_RESOURCE_GROUP`
- `IBM_CLOUD_ACCOUNT`
- `CODE_ENGINE_PROJECT`
- `CODE_ENGINE_APP`
