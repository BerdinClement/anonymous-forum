# Base image
FROM node:24-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the default NestJS port
EXPOSE 3000

# Run the app
CMD ["node", "dist/main"]
