import { Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Hearts } from "react-loader-spinner";
import { MessageInput, useAddMessageMutation, useGetMessageLazyQuery } from "../../graphql/generated"

export const CreateMessage:React.FC<string | undefined> = (keyword) => {

    const [getMessage, getMessageState] = useGetMessageLazyQuery();
    const [addMessage, addMessageState]= useAddMessageMutation()

    const [message, setMessage] = useState<MessageInput>({Keyword:""})

    useEffect(() => {
        if (keyword) {
            getMessage({ variables: { keyword: keyword } });
        };
    }, [keyword, getMessage])

    useEffect(() => {
        if (getMessageState.data?.getMessage) {
            setMessage({
                Keyword: getMessageState.data.getMessage.Keyword,
                Name: getMessageState.data.getMessage.Name,
                Message: getMessageState.data.getMessage.Message
            });
        };
    }, [getMessageState.data])

    const handlePost = () => {
        addMessage({
            variables: {
                keyword: message.Keyword,
                name: message.Name,
                message: message.Message,
            },
        })
    }

    const handleMessageInput = (key: keyof MessageInput) => (input: React.ChangeEvent<HTMLInputElement>) => {
        setMessage({
            ...message,
            [key]: input
        })
    };

    if (getMessageState.loading) { return <Hearts /> }

    return (
        <React.Fragment>
            <>
            { keyword
                ? <Typography>{ keyword }</Typography>
                : <TextField
                    id="keyword"
                    label="Keyword"
                    value={message.Keyword}
                    onChange={ handleMessageInput("Keyword") }
                />
            }
            </>
            <TextField
                id="Name"
                label="Name"
                value={ message.Name || "" }
                onChange={ handleMessageInput("Name") }
            />
            <TextField
                id="message"
                label="Message"
                multiline={true}
                rows={5}
                value={ message.Message || "" }
                onChange={ handleMessageInput("Message") }
            />
            { getMessageState.error &&
                <Typography>{getMessageState.error.message}</Typography>
            }
            { addMessageState.error &&
                <Typography>{ addMessageState.error.message }</Typography>
            }
            <Button
                onChange={ handlePost }
                variant="outlined"
            >
                Post
            </Button>
        </React.Fragment>
    )

}
