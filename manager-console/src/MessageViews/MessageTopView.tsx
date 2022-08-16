import { useState } from "react"

export enum Mode {
    CREATE_MODE = "CreateMode",
    LIST_MODE = "ListMode"
}

export const MessageTopView: React.FC = () => {

    const [mode, setMode] = useState<Mode | undefined>(undefined);

    const handleSetMode = (mode: Mode) => {
        setMode(mode);
    };

    switch (mode) {
        case Mode.CREATE_MODE:
            return (<></>)
        default:
            return (<></>)
    }

}
