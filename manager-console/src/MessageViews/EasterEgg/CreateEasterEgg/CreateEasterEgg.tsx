import { Button, Grid, TextField, Typography } from "@mui/material";
import { useAddEasterEggMutation, useGetActiveUsersQuery, useGetEasterEggLazyQuery, AddEasterEggMutationVariables } from "graphql/generated";
import React, { useEffect, useState } from "react";
import { LoadingHearts } from "utils/Loading";

interface IProps {
    keyword?: string
}

export const CreateMessage: React.FC<IProps> = (props) => {

    const { keyword } = props;

    const activeUsersState = useGetActiveUsersQuery({fetchPolicy: "cache-first"});
    const [getEasterEgg, getEasterEggState] = useGetEasterEggLazyQuery();
    const [addEasterEgg, addEasterEggState] = useAddEasterEggMutation();

    const [easterEgg, setEasterEgg] = useState<AddEasterEggMutationVariables>({Keyword: "", Message: "", TargetUsers: []})

    useEffect(() => {
        if (keyword) {
            getEasterEgg({
                variables: { Keyword: keyword },
                fetchPolicy: "no-cache"
            })
        }
    }, [keyword, getEasterEgg]);

    useEffect(() => {
        if (getEasterEggState.data?.getEasterEgg) {
            setEasterEgg({
                Keyword: getEasterEggState.data.getEasterEgg.Keyword,
                TargetUsers: getEasterEggState.data.getEasterEgg.TargetUsers,
                Message: getEasterEggState.data.getEasterEgg.Message
            })
        }
    }, [getEasterEggState.data]);

    const handlePost = () => {
        addEasterEgg({
            variables: {
                Keyword: easterEgg.Keyword,
                TargetUsers: easterEgg.TargetUsers,
                Message: easterEgg.Message
            }
        })
    };

    const handleMessageInput = (key: keyof Omit<AddEasterEggMutationVariables, "TargetUsers">) => (input: React.ChangeEvent<HTMLInputElement>) => {
        setEasterEgg({
            ...easterEgg,
            [key]: input.target.value
        })
    };

    if (activeUsersState.loading || getEasterEggState.loading || addEasterEggState.loading) { return <LoadingHearts /> }

    return (
        <React.Fragment>
            <Grid container={ true } xs={ 12 } sm={ 6 }>
                { keyword
                    ? <Typography>{ keyword }</Typography>
                    : <TextField
                        id="Keyword"
                        label="Keyword"
                        variant="standard"
                        value={easterEgg.Keyword}
                        onChange={ handleMessageInput("Keyword")}
                    />
                }
            </Grid>
            <Grid item={ true } xs={ 12 } sm={ 6 }>
                <TextField
                    id=""
                />
            </Grid>
            <Grid item={ true } xs={ 12 }>
                <TextField
                    id="message"
                    label="Message"
                    variant="standard"
                    multiline={ true }
                    fullWidth={ true }
                    rows={ 5 }
                    value={ easterEgg.Message || "" }
                    onChange={ handleMessageInput("Message")}
                />
            </Grid>
            <Grid item={ true } xs={12}>
                <Button
                    onClick={ handlePost }
                    variant="outlined"
                >
                    Post
                </Button>
            </Grid>
        </React.Fragment>
    )

}
