package database

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

func MessageDynamoClient() (*dynamodb.Client, error) {

	conf, err := config.LoadDefaultConfig(context.TODO(), func(o *config.LoadOptions) error {
		o.Region = "ap-northeast-1"
		return nil
	})

	if err != nil {
		return nil, err
	}

	db := dynamodb.NewFromConfig(conf)

	return db, nil

}
