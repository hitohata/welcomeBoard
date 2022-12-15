import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useGetActiveUsersQuery } from "graphql/generated"

interface IProps {
    targetUser?: string
    handleSelectUser: (user: string) => void
}

export const TargetUserList: React.FC<IProps> = (props) => {

    const { targetUser, handleSelectUser } = props;

    const { data, error } = useGetActiveUsersQuery({fetchPolicy: "cache-first"});

    const handleChange = (event: SelectChangeEvent) => {
        handleSelectUser(event.target.value as string)
    }

    if (!data?.getActiveUsers?.ActiveUsers) {return <></>}

    return (
        <FormControl fullWidth={ true }>
            <InputLabel id="demo-simple-select-label">User</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={ targetUser || "" }
                label="User"
                onChange={ handleChange }
            >
                { data.getActiveUsers.ActiveUsers.map((user, index) => (
                    <MenuItem value={user} key={index}>{user}</MenuItem>
                )) }
            </Select>
            { error && <Typography>{error.message}</Typography> }
        </FormControl>
    )

}
