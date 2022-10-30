import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

interface IProps {
    users: string[],
    selectedUsers: string[],
    handleSelectUser: (users: string[]) => void
}

export const SelectUsers: React.FC<IProps> = (props) => {

    const { users, selectedUsers, handleSelectUser } = props;


    const handleToggle = (user: string) => () => {
        const existence = selectedUsers.some(el => (el === user));

        if (existence) {
            const removedUserList = selectedUsers.filter(el => el !== user);
            handleSelectUser(removedUserList);
        } else {
            const addedUserList = [...selectedUsers, user];
            handleSelectUser(addedUserList);
        }

    };

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {users.map((user) => {
            const labelId = `checkbox-list-label-${user}`;

            return (
            <ListItem
                key={user}
            >
                <ListItemButton role={undefined} onClick={handleToggle(user)}>
                <ListItemIcon>
                    <Checkbox
                    edge="start"
                    checked={selectedUsers.some(el => el === user)}
                    tabIndex={-1}
                    inputProps={{ 'aria-labelledby': labelId }}
                    />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${user}`} />
                </ListItemButton>
            </ListItem>
            );
        })}
        </List>
    );
}
