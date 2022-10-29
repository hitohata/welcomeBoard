import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ListEasterEggsQuery, useListEasterEggsLazyQuery, useListEasterEggsQuery } from "graphql/generated";
import React, { useState } from "react";
import { LoadingHearts } from "utils/Loading";

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
                    ? data.listEasterEggs.map(el => (Me))
                    : 
                }
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
                        <Button onClick={() => setOpen(false)}></Button>
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
