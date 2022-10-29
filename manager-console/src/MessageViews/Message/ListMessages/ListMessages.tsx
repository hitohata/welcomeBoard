import { Typography, Box } from "@mui/material"
import { ListMessagesQuery, useListMessagesQuery } from "graphql/generated"
import { useState } from "react"
import { LoadingHearts } from "utils/Loading"
import { Button } from "@mui/material";
import { CreateMessage } from "MessageViews/Message/CreateMessage/CreateMessage";

type UnwrapArray<T> = T extends Array<infer R> ? R : never

export const ListMessages: React.FC = () => {

    const { loading, error, data } = useListMessagesQuery({
        fetchPolicy: "no-cache"
    })

    if (loading) {
        return <LoadingHearts />
    }

    return <>
        <Box sx={{ padding: 5 }}>
            { (data && data.listMessages) 
                ? data.listMessages.map(el => (
                    <Message key={el.Keyword} message={ el } />
                ))
                : <Typography>Not Found</Typography>
            }
            { error && <Typography>{ error.message }</Typography> }
        </Box>
    </>
}

interface IMessage {
    message: UnwrapArray<ListMessagesQuery['listMessages']>
}

const Message: React.FC<IMessage> = (props) => {

    const { message } = props

    const [open, setOpen] = useState<boolean>(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
        {
            open
            ? (
                <div>
                    <Button onClick={ handleClose }>Close</Button>
                    <CreateMessage keyword={ message.Keyword } />
                </div>
            )
            : (
                <div>
                    <Button onClick={ handleOpen }>
                        <Typography>
                            { `${message.Keyword} ${message.Name || ""}` }
                        </Typography>
                    </Button>
                </div>
            )
        }
        </>
    )
}
