package main

import (
	"context"
	"log"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
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
			},
		}))

	if err != nil {
		log.Fatal(err)
	}

	client := dynamodb.NewFromConfig(cfg)

	create_table_input := &dynamodb.CreateTableInput{
		AttributeDefinitions: []types.AttributeDefinition{
			{
				AttributeName: aws.String("Keyword"),
				AttributeType: "S",
			},
		},
		KeySchema: []types.KeySchemaElement{
			{
				AttributeName: aws.String("Keyword"),
				KeyType: "HASH",
			},
		},
		TableName: aws.String("WeddingMessage"),
		BillingMode: "PAY_PAR_REQUEST",
	}

	resp, err := client.CreateTable(context.TODO(), create_table_input)

	if (err != nil) {
		log.Fatal(err.Error())
	}

	fmt.Println("resp", resp)

}
