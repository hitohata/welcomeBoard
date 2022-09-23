import { Button } from "@mui/material"
import { ReactNode } from "react";
import { Mode } from "../MessageTopView";
import { Box } from "@mui/material";

interface IProps {
    mode: Mode
    handleSetMode: (mode: Mode) => void
    children: ReactNode
}

export const ModeWrapper: React.FC<IProps> = (props) => {

    const { mode, handleSetMode, children } = props;

    const modeList: Mode[] = Object.entries(Mode).map(([_, value]) => value);

    return (
        <>
            <Box sx={{ marginBottom: 5 }}>
                { modeList.map(el => el !== mode &&
                    <Button
                        key={ el }
                        onClick={ () => handleSetMode(el)}
                    >
                        { el }
                    </Button>
                ) }
            </Box>
            {children}
        </>
    );
}
