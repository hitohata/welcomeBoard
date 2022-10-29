import { useState } from "react"
import { Button, Grid } from "@mui/material";
import { CreateMessage } from "./Message/CreateMessage/CreateMessage";
import { ListMessages } from "./Message/ListMessages/ListMessages"
import { ModeWrapper } from "./Wrapper/ModeWrapper";

export enum Mode {
    CREATE_MESSAGE_MODE = "CreateMessageMode",
    CREATE_EASTER_EGG_MODE = "CreateEasterEggMode",
    LIST_MESSAGE_MODE = "ListMessageMode",
    LIST_EASTER_EGG_MODE = "ListEasterEggMode",
    TOP_MODE = "TopMode",
}

export const MessageTopView: React.FC = () => {

    const [mode, setMode] = useState<Mode>(Mode.TOP_MODE);

    const handleSetMode = (mode: Mode) => {
        setMode(mode);
    };

    if (mode === Mode.CREATE_MESSAGE_MODE) {
        return (
            <ModeWrapper mode={mode} handleSetMode={handleSetMode}>
                <CreateMessage />
            </ModeWrapper>
        );
    }

    if (mode === Mode.LIST_MESSAGE_MODE) {
        return (
            <ModeWrapper mode={mode} handleSetMode={handleSetMode}>
                <ListMessages />
            </ModeWrapper>
        );
    }

    // Top Mode
    return (
		<ModeWrapper mode={mode} handleSetMode={handleSetMode}>
			<SelectMode handleSetMode={handleSetMode} />
		</ModeWrapper>
	);
}

interface ISelectMode {
    handleSetMode: (mode: Mode) => void
}

const SelectMode: React.FC<ISelectMode> = (props) => {

    const { handleSetMode } = props;


    return (
        <Grid container={ true } spacing={ 3 }>
            <Grid item={ true } xs={ 12 }>
                <Button onClick={ () => handleSetMode(Mode.LIST_MESSAGE_MODE) } >
                    Message List
                </Button>
            </Grid>
            <Grid item={ true } xs={ 12 }>
                <Button onClick={ () => handleSetMode(Mode.CREATE_MESSAGE_MODE)} >
                    Create A New Message
                </Button>
            </Grid>
        </Grid>
    )
}
