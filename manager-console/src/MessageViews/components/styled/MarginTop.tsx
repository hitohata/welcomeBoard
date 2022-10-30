interface IProps {
    children: React.ReactNode
}

export const MarginTopComponent: React.FC<IProps> = (props) => {
    return (
        <div style={{marginTop: "50px"}}>
            {props.children}
        </div>
    )
}
