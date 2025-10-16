import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import React, { useState } from "react";
import { useTheme, styled } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { bookTicket } from "src/redux/slices/ticketSlice";
import { WARNING_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";
import { useSnackbar } from "notistack";
import { FS } from "src/redux/slices/other/constant";

const CustomClass = styled(Box)((theme) => ({
    ".title": {
        textAlign: "center",
        fontSize: "larger",
        fontWeight: "bold",
    },
}));

const BookingDialog = ({ bookDialogIsOpen, closeBookDialog }) => {
    const event = useSelector((state) => state.eventSliceV2.event);
    const dp = useDispatch();
    const { enqueueSnackbar: eq } = useSnackbar();
    const theme = useTheme();
    const loadingBookTicket = useSelector((state) => state.ticketSlice.loadingBookTicket);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const handleBookTicket = async (e) => {
        e.preventDefault();
        await dp(bookTicket({ name, email, eq }));
    };
    return (
        <Dialog
            open={bookDialogIsOpen}
            onClose={closeBookDialog}
            maxWidth="xl"
            PaperProps={{
                style: {
                    backgroundColor: theme.palette.commonText.grayWhite,
                },
            }}
        >
            <CustomClass>
                <DialogTitle>
                    <Typography className="title">BOOK TICKET</Typography>
                </DialogTitle>
                <DialogContent style={{ padding: "30px", minWidth: "40%" }}>
                    <Typography style={{ textAlign: "center" }}>
                        Reserving ticket for the event
                        <span style={{ fontWeight: "bold" }}>&nbsp;{event?.title}&nbsp;</span>would save you
                        <span style={{ fontWeight: "bold" }}>&nbsp;{event?.discount}%</span>
                    </Typography>
                    <Box py={1}></Box>
                    <form onSubmit={handleBookTicket}>
                        <TextField
                            placeholder="Your Name"
                            fullWidth
                            onChange={(e) => setName(e.target.value)}
                        ></TextField>
                        <Box py={1}></Box>
                        <TextField
                            placeholder="Your Email"
                            fullWidth
                            onChange={(e) => setEmail(e.target.value)}
                        ></TextField>
                        <Box py={1}></Box>
                        <Button fullWidth variant="contained" type="submit" disabled={loadingBookTicket == FS.FETCHING}>
                            {loadingBookTicket == FS.FETCHING ? (
                                <BeatLoader color={theme.palette.commonText.white} size={8} />
                            ) : (
                                "Book now"
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </CustomClass>
        </Dialog>
    );
};

export default BookingDialog;
