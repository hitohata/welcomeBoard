package main

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type Message struct {
	KeyWord string `dynamodbav: "keyword"`
	Name string `dynamodbav: "name"`
	Message string `dynamodbav: "message"`
}

const AWS_REGION = "ap-northeast-1"
const DYNAMO_ENDPOINT = "http://welcome-message-local"

func main() {

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion("ap-northeast-1"),
		config.WithCredentialsProvider(credentials.StaticCredentialsProvider{
			Value: aws.Credentials{
				AccessKeyID:     "dummyKey",
				SecretAccessKey: "dummyKey",
				SessionToken:    "",
				Source:          DYNAMO_ENDPOINT,
			},
		}))

	if err != nil {
		log.Fatal(err)
	}

	client := dynamodb.NewFromConfig(cfg)

	resp, err := &client.CreateTable({
		TableName: "WeddingMessageTable",
	})

}
