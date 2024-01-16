# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the rest of the source code to the working directory
COPY . .

RUN rm -rf /root/.cache/puppeteer

# Install Chromium in the Alpine container
RUN apk add --no-cache chromium

# Set the CHROME_BIN environment variable
ENV CHROME_BIN=/usr/bin/chromium-browser

# Configurar as permissões para o diretório de instalação do Chromium
RUN chmod -R +x /usr/bin/chromium-browser

# Install application dependencies
RUN npm install

# Configurar o Puppeteer para usar o Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Expose the server on port 3000
EXPOSE 3000

# Command to start the application when the container is run
CMD ["node", "index.js"]
