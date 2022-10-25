import { Hearts } from "react-loader-spinner";
import { useWindowSize } from "../hooks/useWindowSize";
import { Box } from "@mui/material";

export const LoadingHearts: React.FC = () => {

    const size = useWindowSize();

    return (
	    <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: size.height,
            width: size.width
        }}>
            <Hearts
                height={ size.height / 2 }
                width={ size.width / 2 }
                color="red"
            />
        </Box>
	);
}
