# Usa imagem base do Node
FROM node:18-alpine

# Cria diretório de trabalho
WORKDIR /app

# Copia os arquivos
COPY package*.json ./
RUN npm install

COPY . .

# Expõe a porta (ajusta se for diferente)
EXPOSE 3000

# Comando para rodar o app
CMD ["npm", "run", "start"]
