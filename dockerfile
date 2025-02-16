# ---- Base Image ----
    FROM node:22.14.0-alpine3.21 AS builder

    WORKDIR /app
    
    # Copy only necessary files
    COPY ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ./
    COPY package.json pnpm-lock.yaml ./
    
    # Enable Corepack & Install Dependencies
    RUN corepack enable && pnpm install --no-frozen-lockfile
    
    # Copy the backend code
    COPY . .
    
    # ---- Production Image ----
    FROM node:22.14.0-alpine3.21
    
    WORKDIR /app
    
    # Copy built files from the builder stage
    COPY --from=builder /app /app
    
    # Expose port
    EXPOSE 3001
    
    # Start the server
    CMD ["node", "dist/index.js"]
    