import { useLayoutEffect, useState} from "react"

interface IWindowSize {
    height: number,
    width: number
}

export const useWindowSize = (): IWindowSize => {

    const [size, setSize] = useState<IWindowSize>({height: 0, width: 0});

    useLayoutEffect(() => {
        const updateSize = (): void => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener("resize", updateSize);
        updateSize();

        return () => window.removeEventListener("resize", updateSize);
    }, [])

    return size
};
