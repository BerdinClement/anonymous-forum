# Base image for building
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# --- Runtime image ---
FROM node:24-alpine

WORKDIR /app

# Copy only what's needed to run
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
