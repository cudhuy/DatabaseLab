const globalStyleCSS = {
    "*": {
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
    },
    html: {
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        height: "100%",
        width: "100%",
        overflowY: "scroll",
        scrollBehavior: "smooth",
    },
    body: {
        height: "100%",
        width: "100%",
    },
    "#root": {
        height: "100%",
        width: "100%",
    },
    // input: {
    //     "&::placeholder": {
    //         fontStyle: "italic"
    //     },
    // },
};

export default globalStyleCSS;
