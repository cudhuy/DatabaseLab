import React, { useState } from "react";
import { Paper, Grid, Box, Typography, Button } from "@mui/material";
import { alpha, styled, useTheme } from "@mui/system";
import { useSelector } from "react-redux";
import { FS } from "src/redux/slices/other/constant";
import { BeatLoader } from "react-spinners";
import BookingDialog from "./BookingDialog";

const CustomClass = styled(Box)((theme) => ({
    ".paper": {
        backgroundColor: alpha(theme.theme.palette.commonText.black, 0.2),
        padding: "20px",
        maxWidth: "90%",
        margin: "0 auto",
        borderRadius: "20px",
    },
}));

const EventOccuringDisplay = ({ event }) => {
    const [bookDialogIsOpen, setOpenBookDialog] = useState(false);
    const loadingBookTicket = useSelector((state) => state.ticketSlice.loadingBookTicket);
    const openBookDialog = () => {
        setOpenBookDialog(true);
    };
    const closeBookDialog = () => {
        setOpenBookDialog(false);
    };
    const theme = useTheme();
    return (
        <CustomClass>
            <Paper elevation={0} className="paper">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                        <img width="100%" style={{ borderRadius: "15px" }} src={event?.image} />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={7}
                        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                    >
                        <Typography style={{ textAlign: "center", fontSize: "larger", fontWeight: "bold" }}>
                            {event?.title}
                        </Typography>
                        <Typography style={{ fontFamily: "Roboto" }}>
                            <span style={{ fontWeight: "bold" }}>Description: &nbsp;</span>
                            {event?.description}
                        </Typography>
                        <Typography style={{ fontFamily: "Roboto" }}>
                            Available booking time: From
                            <span style={{ fontWeight: "bold" }}>
                                &nbsp;{new Date(event.startBookingTime).toLocaleString()}
                            </span>
                            &nbsp;To
                            <span style={{ fontWeight: "bold" }}>
                                &nbsp;{new Date(event.endBookingTime).toLocaleString()}
                            </span>
                        </Typography>
                        <Typography style={{ fontFamily: "Roboto" }}>
                            Ticket sale: From
                            <span style={{ fontWeight: "bold" }}>
                                &nbsp;{new Date(event.startTime).toLocaleString()}
                            </span>
                            &nbsp;To
                            <span style={{ fontWeight: "bold" }}>&nbsp;{new Date(event.endTime).toLocaleString()}</span>
                        </Typography>
                        <Box py={1}></Box>
                        <h3 component="h1">
                            Discount:&nbsp;<span>{event?.discount}&nbsp;%</span>
                        </h3>
                        {event.isStop == true ? (
                            <Typography style={{ textAlign: "center" }}>This event is closed</Typography>
                        ) : (
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={openBookDialog}
                                disabled={
                                    loadingBookTicket == FS.FETCHING ||
                                    new Date(event.startBookingTime) > new Date() ||
                                    new Date(event.endBookingTime) < new Date()
                                }
                            >
                                {loadingBookTicket == FS.FETCHING ? (
                                    <BeatLoader color={theme.palette.commonText.white} size={8} />
                                ) : (
                                    "Book ticket"
                                )}
                            </Button>
                        )}
                        <BookingDialog {...{ bookDialogIsOpen, closeBookDialog, id: event.id }} />
                    </Grid>
                </Grid>
            </Paper>
        </CustomClass>
    );
};

export default EventOccuringDisplay;
