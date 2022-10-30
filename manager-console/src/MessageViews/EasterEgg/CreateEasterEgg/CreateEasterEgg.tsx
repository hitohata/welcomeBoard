import { Button, Grid, Popover, TextField, Typography } from "@mui/material";
import { useAddEasterEggMutation, useGetActiveUsersQuery, useGetEasterEggLazyQuery, AddEasterEggMutationVariables, useDeleteEasterEggMutation } from "graphql/generated";
import { MarginTopComponent } from "MessageViews/components/styled/MarginTop";
import { PaddingContent } from "MessageViews/components/styled/Padding";
import React, { useEffect, useState } from "react";
import { LoadingHearts } from "utils/Loading";
import { SelectUsers } from "./SelectUsers";

interface IProps {
    keyword?: string
}

export const CreateEasterEgg: React.FC<IProps> = (props) => {

    const { keyword } = props;

    const activeUsersState = useGetActiveUsersQuery({fetchPolicy: "cache-first"});
    const [getEasterEgg, getEasterEggState] = useGetEasterEggLazyQuery();
    const [addEasterEgg, addEasterEggState] = useAddEasterEggMutation();
    const [deleteEasterEgg, deleteEasterEggState] = useDeleteEasterEggMutation();

    const [easterEgg, setEasterEgg] = useState<AddEasterEggMutationVariables>({Keyword: "", Message: "", TargetUsers: []})

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

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

    const handlerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleUpdateTargetUsers = (users: string[]) => {
        setEasterEgg({
            ...easterEgg,
            TargetUsers: users
        })
    };

    const handleDeleteEasterEgg = () => {
        if (easterEgg.Keyword) {
            deleteEasterEgg({
                variables: {
                    Keyword: easterEgg.Keyword
                }
            })
        }
    }

    if (activeUsersState.loading || getEasterEggState.loading || addEasterEggState.loading || deleteEasterEggState.loading) { return <LoadingHearts /> }

    return (
        <PaddingContent>
            <Grid container={ true }>
                <Grid item={ true } xs={ 12 } sm={ 6 }>
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
                    <React.Fragment>
                        <Button onClick={handlerClick}>Target Users</Button>
                        <Popover
                           id={id}
                           open={open}
                           anchorEl={anchorEl}
                           onClose={() => setAnchorEl(null)}
                           anchorOrigin={{
                             vertical: 'bottom',
                             horizontal: 'left',
                           }}
                        >
                            <SelectUsers
                                users={ activeUsersState.data?.getActiveUsers?.ActiveUsers || [] }
                                selectedUsers={ 
                                    easterEgg.TargetUsers && typeof easterEgg.TargetUsers !== "string" 
                                    ? easterEgg.TargetUsers 
                                    : []
                                }
                                handleSelectUser={ handleUpdateTargetUsers }
                            />
                        </Popover>
                    </React.Fragment>
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
                <MarginTopComponent>
                    <Grid container={ true } spacing={ 5 }>
                        <Grid item={ true } xs={6}>
                            <Button
                                onClick={ handlePost }
                                variant="outlined"
                            >
                                Post
                            </Button>
                        </Grid>
                        <Grid item={ true } xs={6}>
                            <Button
                                disabled={ easterEgg ? false : true }
                                onClick={ handleDeleteEasterEgg }
                                variant="outlined"
                                color="secondary"
                            >
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </MarginTopComponent>
            </Grid>
        </PaddingContent>
    )

}
