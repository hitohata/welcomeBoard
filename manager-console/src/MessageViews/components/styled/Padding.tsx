import { Container } from "@mui/system"

interface IProps {
    children: React.ReactNode
}

export const PaddingContent: React.FC<IProps> = (props) => {
    return (
        <Container maxWidth="md">
            <div style={{padding: "10px"}}>
                {props.children}
            </div>
        </Container>
    )
}
