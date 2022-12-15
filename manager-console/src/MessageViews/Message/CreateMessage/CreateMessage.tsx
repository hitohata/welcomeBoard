import { Button, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AddMessageMutationVariables, MessageInput, useAddMessageMutation, useDeleteMessageMutation, useGetMessageLazyQuery } from "../../../graphql/generated"
import { LoadingHearts } from "utils/Loading";
import { MarginTopComponent } from "MessageViews/components/styled/MarginTop";
import { PaddingContent } from "MessageViews/components/styled/Padding";
import { TargetUserList } from "MessageViews/Message/CreateMessage/TargetUserList";

interface IProps {
    keyword?: string
}

export const CreateMessage:React.FC<IProps> = (props) => {

    const { keyword } = props;

    const [getMessage, getMessageState] = useGetMessageLazyQuery();
    const [addMessage, addMessageState]= useAddMessageMutation();
    const [deleteMessage, deleteMessageState] = useDeleteMessageMutation()

    const [message, setMessage] = useState<AddMessageMutationVariables>({Keyword:"", Name: "", Message: ""})

    useEffect(() => {
        if (keyword) {
            getMessage({
                variables: { Keyword: keyword },
                fetchPolicy: "no-cache"
            });
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
                Keyword: message.Keyword,
                Name: message.Name,
                Message: message.Message,
            },
        })
    }

    const handleDelete = () => {
        if (message.Keyword) {
			deleteMessage({
				variables: {
					Keyword: message.Keyword,
				},
			});
		}
    }

    const handleMessageInput = (key: keyof MessageInput) => (input: React.ChangeEvent<HTMLInputElement>) => {
        setMessage({
            ...message,
            [key]: input.target.value
        })
    };

    const handleSelectUser = (user: string) => {
        setMessage({
            ...message,
            Name: user
        })
    }

    if (getMessageState.loading) { return <LoadingHearts /> }
    if (addMessageState.loading) { return <LoadingHearts /> }
    if (deleteMessageState.loading) { return <LoadingHearts /> }

    return (
        <PaddingContent>
            <Grid container={ true }>
                <Grid item={ true } xs={ 12 } sm={ 6 }>
                    { keyword
                        ? <Typography>{ keyword }</Typography>
                        : <TextField
                            id="keyword"
                            label="Keyword"
                            variant="standard"
                            value={message.Keyword}
                            onChange={ handleMessageInput("Keyword") }
                        />
                    }
                </Grid>
                <Grid item={ true } xs={ 12 } sm={ 6 }>
                    <TargetUserList
                        targetUser={ message.Name ? message.Name : undefined }
                        handleSelectUser={ handleSelectUser }
                    />
                </Grid>
                <Grid item={ true } xs={ 12 }>
                    <TextField
                        id="message"
                        label="Message"
                        variant="standard"
                        multiline={true}
                        fullWidth={ true }
                        rows={5}
                        value={ message.Message || "" }
                        onChange={ handleMessageInput("Message") }
                    />
                </Grid>
                <MarginTopComponent>
                    <Grid container={ true } spacing={ 5 }>
                        <Grid item={ true } xs={ 6 }>
                            <Button
                                onClick={ handlePost }
                                variant="outlined"
                            >
                                Post
                            </Button>
                        </Grid>
                        <Grid item={ true } xs={ 6 }>
                            <Button
                                disabled={ message.Keyword ? false : true }
                                onClick={ handleDelete }
                                variant="outlined"
                                color="secondary"
                            >
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </MarginTopComponent>
                { getMessageState.error && <Typography>{getMessageState.error.message}</Typography> }
                { addMessageState.error && <Typography>{ addMessageState.error.message }</Typography> }
            </Grid>
        </PaddingContent>
    )

}
