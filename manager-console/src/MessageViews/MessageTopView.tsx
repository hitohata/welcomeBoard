import { useState } from "react"
import { Button, Grid } from "@mui/material";
import { CreateMessage } from "./CreateMessage/CreateMessage";
import { ListMessages } from "./ListMessages/ListMessages"
import { ModeWrapper } from "./Wrapper/ModeWrapper";

export enum Mode {
    CREATE_MODE = "CreateMode",
    LIST_MODE = "ListMode",
    TOP_MODE = "TopMode"
}

export const MessageTopView: React.FC = () => {

    const [mode, setMode] = useState<Mode>(Mode.TOP_MODE);

    const handleSetMode = (mode: Mode) => {
        setMode(mode);
    };

    if (mode === Mode.CREATE_MODE) {
        return (
            <ModeWrapper mode={mode} handleSetMode={handleSetMode}>
                <CreateMessage />
            </ModeWrapper>
        );
    }

    if (mode === Mode.LIST_MODE) {
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
                <Button onClick={ () => handleSetMode(Mode.LIST_MODE) } >
                    Message List
                </Button>
            </Grid>
            <Grid item={ true } xs={ 12 }>
                <Button onClick={ () => handleSetMode(Mode.CREATE_MODE)} >
                    Create A New Message
                </Button>
            </Grid>
        </Grid>
    )
}
