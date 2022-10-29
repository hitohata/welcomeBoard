import { Button, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AddMessageMutationVariables, MessageInput, useAddMessageMutation, useGetMessageLazyQuery } from "../../../graphql/generated"
import { LoadingHearts } from "utils/Loading";

interface IProps {
    keyword?: string
}

export const CreateMessage:React.FC<IProps> = (props) => {

    const { keyword } = props;

    const [getMessage, getMessageState] = useGetMessageLazyQuery();
    const [addMessage, addMessageState]= useAddMessageMutation()

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

    const handleMessageInput = (key: keyof MessageInput) => (input: React.ChangeEvent<HTMLInputElement>) => {
        setMessage({
            ...message,
            [key]: input.target.value
        })
    };

    if (getMessageState.loading) { return <LoadingHearts /> }
    if (addMessageState.loading) { return <LoadingHearts /> }

    return (
        <React.Fragment>
            <Grid container={ true } sx={{
                padding: 5
            }}>
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
                    <TextField
                        id="Name"
                        label="Name"
                        variant="standard"
                        value={ message.Name || "" }
                        onChange={ handleMessageInput("Name") }
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
                <Grid item={ true } xs={ 12 }>
                    <Button
                        onClick={ handlePost }
                        variant="outlined"
                    >
                        Post
                    </Button>
                </Grid>
                { getMessageState.error && <Typography>{getMessageState.error.message}</Typography> }
                { addMessageState.error && <Typography>{ addMessageState.error.message }</Typography> }
            </Grid>
        </React.Fragment>
    )

}
