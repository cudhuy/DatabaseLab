import React from "react";
import { styled } from "@mui/system";
import { Box, Typography, Grid } from "@mui/material";
import Title from "src/components/Title";
import GroupIcon from "@mui/icons-material/Group";
import SafetyImage from "../assets/Safety.png";
import QualityImage from "../assets/Quality.png";
import TrustImage from "../assets/Trust.png";
import DesignImage from "../assets/Design.png";

const Custom = styled(Box)(() => ({
    ".image": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "260px",
        width: "100%",
    },
}));
const OurRide = () => {
    return (
        <Custom width={"100%"}>
            <Title text="Our Ride" icon={<GroupIcon />}></Title>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={6} xl={3} style={{ textAlign: "center" }}>
                    <img src={SafetyImage} />
                </Grid>
                <Grid item xs={12} md={6} xl={3} style={{ textAlign: "center" }}>
                    <img src={QualityImage} />
                </Grid>
                <Grid item xs={12} md={6} xl={3} style={{ textAlign: "center" }}>
                    <img src={TrustImage} />
                </Grid>
                <Grid item xs={12} md={6} xl={3} style={{ textAlign: "center" }}>
                    <img src={DesignImage} />
                </Grid>
            </Grid>
        </Custom>
    );
};

export default OurRide;
