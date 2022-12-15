# My wedding welcome message APP

This is for my wedding.
This APP manages welcome messages for guests of my wedding party. 
The guests accept the LINE account of my party and access this system via LINE API.

## Objectives

The main objective is to send a welcome message to guests from us. 
The message is written to each guest and can only be accessed by the intended guest. 
This app also has an easter egg message. 
It is for multiple guest but not for all. 

Also, this APP is used for sending information about our wedding. i.e. date time, location... 
Moreover, this app accepts images and videos. When those are sent, they will be stored in the S3 bucket. 

## Structure

### Overview

![structure](/img/structure.drawio.svg)

The messages is hosted at the DynamoDB.
That is written by us. Using managing App that is using APPSync on this diagram.

This app uses two Line message API, one is for guests, and the other is for a host. 

### Create Messages

The message creation is done by manager console. 
It uses AppSync to communicate with the DynamoDB. 
The complicated process is processed by the lambda function. 

![create-message](/img/create-message.drawio.svg)

### Line interaction

#### User action 

The user can five actions.

![user-action](/img/user-action.drawio.svg)

##### Send a message

When the user sends a text message, the lambda query against the DynamoDB to find a message and easter egg message. 
If the data is found for the requesting user, return the message to the user. 
At the same time, the message user sends is provided to the host. 
If the user input data is not found, return notifying message that you are not a correct text message input. 

##### Send Image(s) or Video(s)

Users can send an image or video. 
When it is sent, lambda will put it to the S3 bucket. 
And randomly, some image, video or text message returns to the user. 

##### Send a Post Back

When user send a post-back message, lambda returns the information.

##### Follow

When the user follows the line account, the user name is hosted in DynamoDB. 

### Host message

When the host sends a message to this system, it is sent to the clients.

## Folder

| Folder          | Detail                                |
| :-------------- | :------------------------------------ |
| graphql         | GQL definition                        |
| manager-console | Message CRUD console created by React |
| lambda          | Lambda's program                      |
| tools           | The tools to update the Line console  |

### Lambda Folder

| Folder           | Detail                       |
| :--------------- | :--------------------------- |
| hostFunction     | For host (groom and bride)   |
| main             | The main function guests use |
| resolverFunction | This is for the DynamoDB     |
