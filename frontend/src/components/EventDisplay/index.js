import { Box, Paper, Typography, Grid } from "@mui/material";
import React from "react";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";

const CustomClass = styled(Box)((theme) => ({
    ".paper": {
        backgroundColor: theme.theme.palette.commonText.white,
        borderBottom: "1px solid #ededed",
        padding: "20px",
        maxWidth: "70%",
        margin: "0 auto",
        borderRadius: "20px",
    },
    ".paper:hover": {
        transition: "5s",
        color: theme.theme.palette.primary.main,
    },
}));

const EventDisplay = (props) => {
    const event = useSelector((state) => state.eventSliceV2.event);

    return (
        <CustomClass>
            <Paper elevation={0} className="paper">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <img width="100%" style={{ borderRadius: "15px" }} src={event?.url} />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={5}
                        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                    >
                        <Typography style={{ textAlign: "center", fontSize: "larger", fontWeight: "bold" }}>
                            {event?.title}
                        </Typography>
                        <Box py={1}></Box>
                        <Typography style={{ fontFamily: "Roboto" }}>
                            Event start from:
                            <span style={{ fontWeight: "bold" }}>&nbsp;{event?.start.toLocaleDateString("en-US")}</span>
                        </Typography>
                        <Typography style={{ fontFamily: "Roboto" }}>
                            Event is held in<span style={{ fontWeight: "bold" }}>&nbsp;{event?.duration} days</span>
                        </Typography>
                        <Typography style={{ fontFamily: "Roboto" }}>
                            <span style={{ fontWeight: "bold" }}>Description: &nbsp;</span>
                            {event?.description}
                        </Typography>
                        <Box py={1}></Box>
                        <h3 component="h1">
                            Discount:&nbsp;<span>{event?.discount}&nbsp;%</span>
                        </h3>
                        {props.children}
                    </Grid>
                </Grid>
            </Paper>
        </CustomClass>
    );
};

export default EventDisplay;
