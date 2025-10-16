import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { BeatLoader } from "react-spinners";
import ButtonStartEvent from "./ButtonStartEvent";
import EditButton from "./EditEventButton";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { deleteEvent } from "src/redux/slices/eventSliceV2";

const CustomClass = styled(Box)((theme) => ({
    ".wrapper": {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    ".titleItem": {
        fontSize: "larger",
        color: theme.theme.palette.commonText.black,
        textAlign: "center",
        fontWeight: "bold",
    },
}));

const EventItem = ({ event }) => {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const dp = useDispatch();
    const { enqueueSnackbar: eq } = useSnackbar();
    const handleDeleteEvent = async () => {
        setLoadingDelete(true);
        await dp(deleteEvent({ eq, id: event.id }));
        setLoadingDelete(false);
    };
    const theme = useTheme();
    return (
        <CustomClass>
            <Box className="wrapper">
                <Typography className="titleItem">{event?.title}</Typography>
                <Box py={1}></Box>
                <img width="80%" src={event?.image} />
                <Box py={1}></Box>
                <Box>
                    <ButtonStartEvent event={event} /> <EditButton event={event} />{" "}
                    <Button variant="contained" onClick={handleDeleteEvent} disabled={loadingDelete}>
                        {loadingDelete ? <BeatLoader color={theme.palette.commonText.white} size={8} /> : "Delete"}
                    </Button>
                </Box>
            </Box>
        </CustomClass>
    );
};

export default EventItem;
