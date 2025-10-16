import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import Banner from "./Banner";
import Event from "./Event";
import { Box, Container } from "@mui/material";
import OurRide from "src/pages/HomePage/OurRide";
import Games from "src/pages/HomePage/Games";
import Feedback from "src/pages/HomePage/Feedback";
// import { AnimationOnScroll } from "react-animation-on-scroll";

const HomePage = () => {
    return (
        <Fragment>
            <Container maxWidth="xxl">
                <Box>
                    <Helmet>
                        <title>Tinkerbell Garden - HomePage</title>
                    </Helmet>
                    <Banner />
                    <Event />
                    <OurRide />
                    {/* <AnimationOnScroll
                        animateOnce={true}
                        initiallyVisible={false}
                        duration={1}
                        animateIn="animate__swing"
                    > */}
                    <Games />
                    {/* </AnimationOnScroll> */}
                </Box>
            </Container>
            <Box py={2}></Box>
            {/* <AnimationOnScroll animateOnce={true} initiallyVisible={false} duration={1} animateIn="animate__swing"> */}
            <Feedback />
            {/* </AnimationOnScroll> */}
        </Fragment>
    );
};

export default HomePage;
