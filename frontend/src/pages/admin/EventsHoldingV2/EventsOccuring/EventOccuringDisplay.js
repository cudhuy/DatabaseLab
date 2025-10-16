import React, { useState } from "react";
import { Paper, Grid, Box, Typography, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { alpha, styled, useTheme } from "@mui/system";
import StopEventButton from "src/pages/admin/EventsHoldingV2/EventsOccuring/StopEventButton";
import EditButton from "./EditButton";
import { BeatLoader } from "react-spinners";
import { deleteRunningEvent } from "src/redux/slices/eventSliceV2";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";

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
    const [loading, setLoading] = useState(false);
    const [dialogIsOpen, setOpenDialog] = useState(false);
    const { enqueueSnackbar: eq } = useSnackbar();
    const dp = useDispatch();
    const openDialog = () => {
        setOpenDialog(true);
    };
    const closeDialog = () => {
        setOpenDialog(false);
    };
    const handleDeleteEvent = async (e) => {
        setLoading(true);
        e.preventDefault();
        await dp(deleteRunningEvent({ eq, id: event.id, closeDialog }));
        setLoading(false);
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
                        <Box py={1}></Box>
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
                        <Box>
                            <StopEventButton event={event} /> {/* <EditButton event={event}/> */}{" "}
                            <Button variant="contained" onClick={openDialog} disabled={loading}>
                                {loading ? (
                                    <BeatLoader color={theme.palette.commonText.white} size={8} />
                                ) : (
                                    "Delete Event"
                                )}
                            </Button>
                            <Dialog
                                open={dialogIsOpen}
                                onClose={closeDialog}
                                maxWidth="xl"
                                PaperProps={{
                                    style: {
                                        backgroundColor: theme.palette.commonText.grayWhite,
                                    },
                                }}
                            >
                                <DialogTitle>
                                    <Typography style={{ textAlign: "center", fontWeight: "bold", fontSize: "larger" }}>
                                        Are you sure want to delete event ?
                                    </Typography>
                                </DialogTitle>
                                <DialogContent style={{ padding: "0px 20px 20px 20px" }}>
                                    <Typography style={{ marginBottom: "20px", textAlign: "center" }}>
                                        This action cannot be undone.
                                    </Typography>
                                    <form onSubmit={handleDeleteEvent}>
                                        <Button fullWidth variant="contained" disabled={loading} type="submit">
                                            {loading ? (
                                                <BeatLoader color={theme.palette.commonText.white} size={8} />
                                            ) : (
                                                `Confirm delele the event ${event?.title}`
                                            )}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </CustomClass>
    );
};

export default EventOccuringDisplay;
