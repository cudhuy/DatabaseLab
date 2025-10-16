import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import React, { useState } from "react";
import { styled, useTheme } from "@mui/system";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import BookingDialog from "src/pages/EventsPage/BookingDialog";
import { FS } from "src/redux/slices/other/constant";

const CustomClass = styled(Box)((theme) => ({
    ".paper": {
        backgroundColor: theme.palette.commonText.white,
        borderBottom: "1px solid",
        borderBottomColor: theme.theme.palette.commonText.grayWhite,
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

const BookingAction = () => {
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
            <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={openBookDialog}
                disabled={loadingBookTicket == FS.FETCHING}
            >
                {loadingBookTicket == FS.FETCHING ? (
                    <BeatLoader color={theme.palette.commonText.white} size={8} />
                ) : (
                    "Book ticket"
                )}
            </Button>
            <BookingDialog {...{ bookDialogIsOpen, closeBookDialog }} />
        </CustomClass>
    );
};

export default BookingAction;
