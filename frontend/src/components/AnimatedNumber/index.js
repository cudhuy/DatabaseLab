import React, { useEffect, useRef, useState } from "react";

const AnimatedNumber = ({ value, formatValue, duration }) => {
    const [number, setNumber] = useState(0);
    const timeLoop = Math.floor(duration / 50);
    const timerRef = useRef();
    useEffect(() => {
        if (value != number) {
            const delta = (value - number) / timeLoop;
            clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setNumber((prev) => {
                    if (Math.abs(value - prev) > Math.abs(delta)) {
                        return prev + delta;
                    } else {
                        clearInterval(timerRef.current);
                        return value;
                    }
                });
            }, 50);
        }
    }, [value]);

    return formatValue(number);
};

export default AnimatedNumber;
