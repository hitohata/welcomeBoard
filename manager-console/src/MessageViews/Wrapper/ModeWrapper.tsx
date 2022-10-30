import { Button } from "@mui/material"
import { ReactNode } from "react";
import { Mode } from "../MessageTopView";
import { Box } from "@mui/material";
import { PaddingContent } from "MessageViews/components/styled/Padding";

interface IProps {
    mode: Mode
    handleSetMode: (mode: Mode) => void
    children: ReactNode
}

export const ModeWrapper: React.FC<IProps> = (props) => {

    const { mode, handleSetMode, children } = props;

    const modeList: Mode[] = Object.entries(Mode).map(([_, value]) => value).filter(modeElement => modeElement !== Mode.TOP_MODE);

    return (
        <>
            <Button>Top</Button>
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
