package main

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

const AWS_REGION = "ap-northeast-1"
const DYNAMO_ENDPOINT = "http://welcome-message-dynamo:8000"

func main() {

	custom_resolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			PartitionID:   "aws",
			URL:           DYNAMO_ENDPOINT,
			SigningRegion: AWS_REGION,
		}, nil
	})

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion("ap-northeast-1"),
		config.WithCredentialsProvider(credentials.StaticCredentialsProvider{
			Value: aws.Credentials{
				AccessKeyID:     "dummyKey",
				SecretAccessKey: "dummyKey",
			},
		}),
		config.WithEndpointResolverWithOptions(custom_resolver),
	)

	if err != nil {
		log.Fatal("InvalidConfig", err)
	}

	client := dynamodb.NewFromConfig(cfg)

	create_table_input := &dynamodb.CreateTableInput{
		AttributeDefinitions: []types.AttributeDefinition{
			{
				AttributeName: aws.String("Keyword"),
				AttributeType: types.ScalarAttributeTypeS,
			},
		},
		KeySchema: []types.KeySchemaElement{
			{
				AttributeName: aws.String("Keyword"),
				KeyType:       types.KeyTypeHash,
			},
		},
		TableName:   aws.String("WeddingMessage"),
		BillingMode: types.BillingModePayPerRequest,
	}

	resp, err := client.CreateTable(context.TODO(), create_table_input)

	if err != nil {
		log.Fatal("CreateTableFailed:", err.Error())
	}

	fmt.Println(*resp.TableDescription.TableArn)
	fmt.Println(resp.TableDescription.KeySchema)
	fmt.Println(*resp.TableDescription.TableName)
	fmt.Println(resp.TableDescription.AttributeDefinitions)
}
