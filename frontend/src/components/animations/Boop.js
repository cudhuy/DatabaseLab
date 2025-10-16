import React, { useEffect } from "react";
import { animated, useSpring } from "react-spring";

const Boop = ({ x = 0, y = 0, rotation = 0, scale = 1, timing = 150, children, display = "inline-block" }) => {
    const [isBooped, setIsBooped] = React.useState(false);
    const style = useSpring({
        display: display,
        backfaceVisibility: "hidden",
        transform: isBooped
            ? `translate(${x}px, ${y}px)
                rotate(${rotation}deg)
                scale(${scale})`
            : "translate(0px, 0px)\
                rotate(0deg)\
                scale(1)",
        config: {
            tension: 300,
            friction: 10,
        },
    });
    useEffect(() => {
        if (!isBooped) {
            return;
        }
        const timeoutId = window.setTimeout(() => {
            setIsBooped(false);
        }, timing);
        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [isBooped, timing]);
    const trigger = () => {
        setIsBooped(true);
    };
    return (
        <animated.span onMouseEnter={trigger} style={style}>
            {children}
        </animated.span>
    );
};

export default Boop;
