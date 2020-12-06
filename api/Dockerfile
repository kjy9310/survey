FROM golang:latest

ARG app_env

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./
# Download all dependencies.
RUN go mod download

COPY . .

CMD go build -o api . && go run api.go