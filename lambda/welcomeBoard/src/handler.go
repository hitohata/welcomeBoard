package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
	"wedding.com/handler/database"
)

type MyEvent struct {
	Name string `json:"name"`
}

func HandleRequest(ctx context.Context, name MyEvent) (string, error) {
	message, err := database.GetMessage()
	if err != nil {
		err.Error()
	}
	fmt.Printf(message)
	return fmt.Sprintf("Hello %s", name.Name), nil
}

func main() {
	lambda.Start(HandleRequest)
}
