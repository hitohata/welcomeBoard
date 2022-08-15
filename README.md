# My wedding welcome message APP

This is for my wedding.
This APP manages welcome messages for guests of my wedding party. 
The guests accept the LINE account of my party and access this system via LINE API.

## Structure

![structure](/img/structure.drawio.svg)

The messages is hosted at the DynamoDB.
That is written by us. Using managing App that is using APPSync on this diagram.

## Folder

| Folder | Detail |
| :----- | :----- |
| graphql | GQL definition |
| manager-console | Message CRUD console created by React |
