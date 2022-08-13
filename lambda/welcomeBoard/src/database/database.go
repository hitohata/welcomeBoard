package database

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type MessageItem struct {
	Keyword string `dynamodbav:keyword`
	Name    string `dynamodbav:name`
	Message string `dynamodbav:message`
}

func GetMessage(keyword string) (string, error) {

	client, err := MessageDynamoClient()

	if err != nil {
		panic(err.Error())
	}

	get_input := dynamodb.GetItemInput{
		Key: map[string]types.AttributeValue{
			"Keyword": &types.AttributeValueMemberS{
				Value: keyword,
			},
		},
		TableName: aws.String("MessageTable"),
	}

	resp, err := client.GetItem(context.TODO(), &get_input)

	if err != nil {
		return "", err
	}

	resp.Item

}
