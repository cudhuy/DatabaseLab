import React from "react";
import { styled } from "@mui/system";
import { Box, Grid } from "@mui/material";
import Title from "src/components/Title";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import SummerImage from "../assets/1.jpg";
import HalloweenImage from "../assets/2.jpg";
import ChristmasImage from "../assets/3.jpg";
import { useNavigate } from "react-router-dom";

const CustomClass = styled(Box)(() => ({
    ".imag": {
        objectFit: "contain",
        borderRadius: "20px",
        cursor: "pointer",
        "&:hover": {
            objectFit: "none",
        },
    },
}));

const Event = () => {
    const navigate = useNavigate();
    const moveToEvents = () => {
        navigate("/events");
    };
    return (
        <CustomClass id="event">
            <Box onClick={moveToEvents} style={{ cursor: "pointer" }}>
                <Title text={"Events"} icon={<TheaterComedyIcon />}></Title>
            </Box>
            <Grid container spacing={3} justifyContent="center">
                <Grid item lg={4}>
                    <img
                        src={SummerImage}
                        width="100%"
                        height="380px"
                        className="imag"
                        onClick={() => moveToEvents()}
                    />
                </Grid>
                <Grid item lg={4}>
                    <img
                        src={HalloweenImage}
                        width="100%"
                        height="380px"
                        className="imag"
                        onClick={() => moveToEvents()}
                    />
                </Grid>
                <Grid item lg={4}>
                    <img
                        src={ChristmasImage}
                        width="100%"
                        height="380px"
                        className="imag"
                        onClick={() => moveToEvents()}
                    />
                </Grid>
            </Grid>
        </CustomClass>
    );
};

export default Event;
