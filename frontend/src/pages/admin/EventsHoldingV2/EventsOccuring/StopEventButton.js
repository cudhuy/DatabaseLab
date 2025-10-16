import React, { useState, Fragment } from "react";
import { Paper, Grid, Box, Typography, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { BeatLoader } from "react-spinners";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { stopEvent } from "src/redux/slices/eventSliceV2";

const StopEventButton = ({ event }) => {
    const [dialogIsOpen, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const dp = useDispatch();
    const { enqueueSnackbar: eq } = useSnackbar();
    const openDialog = () => {
        setOpenDialog(true);
    };
    const closeDialog = () => {
        setOpenDialog(false);
    };
    const handleStopEvent = async (e) => {
        setLoading(true);
        e.preventDefault();
        await dp(stopEvent({ eq, id: event.id, closeDialog }));
        setLoading(false);
    };
    const theme = useTheme();
    return (
        <Fragment>
            <Button
                variant="contained"
                disabled={
                    event.isStop == true ||
                    new Date(event.startBookingTime) > new Date() ||
                    new Date(event.endBookingTime) < new Date() ||
                    loading
                }
                onClick={openDialog}
            >
                {loading ? <BeatLoader color={theme.palette.commonText.white} size={8} /> : "Stop Selling Ticket"}
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
                        Are you sure want to stop event ?
                    </Typography>
                </DialogTitle>
                <DialogContent style={{ padding: "0px 20px 20px 20px" }}>
                    <Typography style={{ marginBottom: "20px", textAlign: "center" }}>
                        This action cannot be undone. Customer won{"'"}t be able to booking ticket for this event.
                    </Typography>
                    <form onSubmit={handleStopEvent}>
                        <Button fullWidth variant="contained" type="submit" disabled={loading}>
                            {loading ? (
                                <BeatLoader color={theme.palette.commonText.white} size={8} />
                            ) : (
                                `Confirm stop the event ${event?.title}`
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default StopEventButton;
