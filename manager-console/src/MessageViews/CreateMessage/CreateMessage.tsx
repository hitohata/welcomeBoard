import { useEffect, useState } from "react";
import { MessageInput, useAddMessageMutation, useGetMessageLazyQuery } from "../../graphql/generated"

export const CreateMessage:React.FC<string | undefined> = (keyword) => {

    const [getMessage, getMessageState] = useGetMessageLazyQuery();
    useAddMessageMutation()

    const [message, setMessage] = useState<MessageInput>()

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

    const handleMessageInput = (key: keyof MessageInput)

}
