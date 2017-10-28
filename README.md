# ALAE - AccessibilityLessAsError

Resumo


## Dependencia

Instalar o `pa11y`:

```
npm install -g pa11y
```

Exemplo de comando para gerar o report do `pa11y`:

```
pa11y www.exemplo.com.br -r json > report.json
```

## Instalação

Clone o repositório:
```
git clone https://github.com/alanepontes/alae-app.git
cd alae-app
```

Instale as dependencias:
```
npm install
```

Adicione o report gerado pelo `pa11y` e rode o seguinte comando:
```
npm run build
```