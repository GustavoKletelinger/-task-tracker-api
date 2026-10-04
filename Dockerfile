# 1. Imagem base, ja com Node instalado
FROM node:22-alpine

# 2. Habilita o pnpm (ja vem com o Node via corepack)
RUN corepack enable

# 3. Diretorio de trabalho dentro do container
WORKDIR /app

# 4. Copia so o manifesto de dependencias primeiro (aproveita cache do Docker)
COPY package.json pnpm-lock.yaml* ./

# 5. Instala as dependencias
RUN pnpm install --ignore-scripts

# 6. Copia o restante do codigo-fonte
COPY . .

# 7. Expoe a porta que a API usa
EXPOSE 3000

# 8. Comando para iniciar a aplicacao em modo desenvolvimento
CMD ["pnpm", "dev"]
