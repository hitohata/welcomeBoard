package database

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type MessageItem struct {
	Keyword string `dynamodbav:"Keyword"`
	Name    string `dynamodbav:"Name"`
	Message string `dynamodbav:"Message"`
}

func GetMessage(keyword string) (MessageItem, error) {

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
		return MessageItem{}, err
	}

	item := MessageItem{}
	err = attributevalue.UnmarshalMap(resp.Item, &item)

	if err != nil {
		return MessageItem{}, err
	}

	return item, nil
}
