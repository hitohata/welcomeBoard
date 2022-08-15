import { useAddMessageMutation, useGetMessageLazyQuery } from "../../graphql/generated"

export const CreateMessage:React.FC<string | undefined> = (keyword) => {

    const [] = useGetMessageLazyQuery()
    useAddMessageMutation()

}
