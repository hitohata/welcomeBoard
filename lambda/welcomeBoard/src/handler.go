package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"wedding.com/handler/database"
)

func HandleRequest(request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	message, err := database.GetMessage()
	if err != nil {
		err.Error()
	}
	fmt.Printf(message)

	return events.APIGatewayV2HTTPResponse{
		Body:       string("hoge"),
		StatusCode: 200,
	}, nil

}

func main() {
	lambda.Start(HandleRequest)
}
