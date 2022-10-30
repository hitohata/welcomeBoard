import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ListEasterEggsQuery, useListEasterEggsQuery } from "graphql/generated";
import React, { useState } from "react";
import { LoadingHearts } from "utils/Loading";
import { CreateEasterEgg } from "MessageViews/EasterEgg/CreateEasterEgg/CreateEasterEgg";

type UnwrapArray<T> = T extends Array<infer R> ? R : never

export const ListEasterEggs: React.FC = () => {

    const {loading, data, error} = useListEasterEggsQuery({
        fetchPolicy: "no-cache"
    });

    if (loading) { return <LoadingHearts /> };

    return (
        <>
            <Box sx={{padding: 5}}>
                {(data && data.listEasterEggs)
                    ? data.listEasterEggs.map(el => (
                        <EasterEgg Keyword={el!.Keyword} key={el!.Keyword} />
                    ))
                    : <Typography>Not Found</Typography>
                }
                { error && <Typography>{ error.message }</Typography> }
            </Box>
        </>
    )
}

const EasterEgg: React.FC<UnwrapArray<ListEasterEggsQuery['listEasterEggs']>> = (props) => {

    const [open, setOpen] = useState<boolean>(false);

    return (
        <React.Fragment>
            {
                open
                ? (
                    <div>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                        <CreateEasterEgg keyword={ props?.Keyword } />
                    </div>
                )
                : (
                    <div>
                        <Button onClick={() => setOpen(true)}>
                            <Typography>
                                {`${props?.Keyword}`}
                            </Typography>
                        </Button>
                    </div>
                )
            }
        </React.Fragment>
    )

}
