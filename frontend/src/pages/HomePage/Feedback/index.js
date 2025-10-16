import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { styled } from "@mui/system";
import finalBackground from "src/pages/HomePage/assets/a.png";
import b from "src/pages/HomePage/assets/b.png";
import c from "src/pages/HomePage/assets/c.png";
import Boop from "src/components/animations/Boop";
import { AnimationOnScroll } from "react-animation-on-scroll";

const Custom = styled(Box)((theme) => ({
    ".Container": {
        display: "flex",
        flexDirection: "column",
        backgroundImage: `url(${finalBackground})`,
        backgroundPositionX: "center",
        backgroundPositionY: "center",
        backgroundRepeat: "no-repeat",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        padding: "30px",
    },
    ".title": {
        fontSize: "30px",
        fontWeight: "bolder",
        textAlign: "center",
    },
    ".paper": {
        backgroundColor: theme.theme.palette.commonText.white,
        padding: "30px",
        height: "100%",
    },
    ".name": {
        fontSize: "large",
        fontWeight: "bold",
    },
    ".des": {
        fontSize: "small",
        color: theme.theme.palette.light.main,
    },
    ".remark": {
        fontFamily: "Roboto",
        fontWeight: "lighter",
    },
}));

const Feedback = () => {
    return (
        <Custom>
            <Box className="Container">
                <Typography className="title">
                    <Boop y={10} timing={100}>
                        Client&apos;s Feedback
                    </Boop>
                </Typography>
                <Box py={1}></Box>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={6}>
                        <AnimationOnScroll
                            animateOnce={true}
                            initiallyVisible={false}
                            duration={1}
                            animateIn="animate__swing"
                            style={{ height: "100%" }}
                        >
                            <Paper className="paper">
                                <Box style={{ display: "flex", alignItems: "center" }}>
                                    <img src={b} width="50px" />
                                    <Box px={1}></Box>
                                    <Box>
                                        <Typography className="name">Ms. John Doe</Typography>
                                        <Typography className="des">
                                            The jury in the contest to choose the most beautiful park in Viet Nam
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box py={1}></Box>
                                <Typography className="remark">
                                    A fantastic organisation! Great cutomer support from beginning to end of the
                                    process. The team are really informed and go the extra mile at every stage. I would
                                    recommend them unreservedly.
                                </Typography>
                            </Paper>
                        </AnimationOnScroll>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AnimationOnScroll
                            animateOnce={true}
                            initiallyVisible={false}
                            duration={1}
                            animateIn="animate__swing"
                            style={{ height: "100%" }}
                        >
                            <Paper className="paper">
                                <Box style={{ display: "flex", alignItems: "center" }}>
                                    <img src={c} width="50px" />
                                    <Box px={1}></Box>
                                    <Box>
                                        <Typography className="name">Mr. Bill Gates</Typography>
                                        <Typography className="des">The famous interior designer of Vietnam</Typography>
                                    </Box>
                                </Box>
                                <Box py={1}></Box>
                                <Typography className="remark">
                                    Tinkerbell Garden represents among the highest levels of customer service I have
                                    experienced. Information was accurate, responses to queries were turned around very
                                    fast. Answers were clear and where necessary detailed enough for us to make informed
                                    decisions quickly.
                                </Typography>
                            </Paper>
                        </AnimationOnScroll>
                    </Grid>
                </Grid>
            </Box>
        </Custom>
    );
};

export default Feedback;
