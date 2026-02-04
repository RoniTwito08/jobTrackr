FROM node:20-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy server code
COPY server .

EXPOSE 3000

CMD ["npm", "start"]
