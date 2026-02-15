# Build Stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

RUN go build -o main server.go

# Final Stage
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .


# Expose port
EXPOSE 8080

CMD ["./main"]
