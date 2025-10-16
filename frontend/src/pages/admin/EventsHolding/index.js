import { Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, TextField, Checkbox } from "@mui/material";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { styled, useTheme } from "@mui/system";
import empty from "src/pages/admin/GamesManagement/assets/empty.png";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { createNewEvent } from "src/redux/slices/eventSliceV2";
import { BeatLoader } from "react-spinners";
import EventDisplay from "src/components/EventDisplay";
import EventAction from "src/pages/admin/EventsHolding/EventAction";

const CustomClass = styled(Box)((theme) => ({
    ".paper": {
        backgroundColor: theme.theme.palette.commonText.white,
        borderBottom: "1px solid #ededed",
        padding: "20px",
        maxWidth: "70%",
        margin: "0 auto",
        borderRadius: "20px",
    },
    ".dialogContent": {
        padding: "20px",
    },
}));

const EventsPage = () => {
    const event = useSelector((state) => state.eventSliceV2.event);
    const [title, setTitle] = useState(event?.title);
    const [description, setDescription] = useState(event?.description);
    const [discount, setDiscount] = useState(event?.discount);
    const [duration, setDuration] = useState(event?.duration);

    const [createDialogIsOpen, setOpenCreateDialog] = useState(false);
    const openCreateDialog = () => {
        setTitle("");
        setDiscount("");
        setDescription("");
        setImage(empty);
        setDuration(1);
        setOpenCreateDialog(true);
    };
    const closeCreateDialog = () => {
        setOpenCreateDialog(false);
    };
    const [image, setImage] = useState(empty);
    const [imageSending, setImageSending] = useState("");
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
        setImageSending(event.target.files[0]);
    };
    const { enqueueSnackbar: eq } = useSnackbar();
    const dp = useDispatch();

    const [loadingCreate, setLoadingCreate] = useState(false);
    const handleCreateNewEvent = async (e) => {
        e.preventDefault();
        setLoadingCreate(true);
        await dp(
            createNewEvent({
                title,
                description,
                discount,
                imageSending,
                duration,
                mailDailyCustomer,
                eq,
                closeCreateDialog,
            })
        );
        setLoadingCreate(false);
    };

    const [mailDailyCustomer, setMailDailyCustomer] = useState(false);
    const theme = useTheme();

    return (
        <CustomClass>
            <Helmet>
                <title>Tinkerbell Garden - Hold Events</title>
            </Helmet>
            <Box py={2}></Box>
            {!event ? (
                <Box style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography style={{ fontSize: "larger" }}>There is no event, let&apos;s create one!!</Typography>
                    <Box py={1}></Box>
                    <Button variant="contained" size="large" onClick={openCreateDialog} disabled={loadingCreate}>
                        {loadingCreate ? (
                            <BeatLoader color={theme.palette.commonText.white} size={8} />
                        ) : (
                            "Create A New Event"
                        )}
                    </Button>
                    <Dialog
                        open={createDialogIsOpen}
                        onClose={closeCreateDialog}
                        maxWidth="xl"
                        PaperProps={{
                            style: {
                                backgroundColor: theme.palette.commonText.grayWhite,
                            },
                        }}
                    >
                        <DialogTitle>
                            <Typography style={{ textAlign: "center", fontWeight: "bold", fontSize: "larger" }}>
                                New Event
                            </Typography>
                        </DialogTitle>
                        <DialogContent style={{ padding: "20px" }}>
                            <form onSubmit={handleCreateNewEvent}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <input
                                            accept="image/*"
                                            hidden
                                            id="raised-button-file"
                                            type="file"
                                            onChange={onImageChange}
                                        />
                                        <label htmlFor="raised-button-file">
                                            <Box style={{ width: "299px", height: "300px" }}>
                                                <img
                                                    width="100%"
                                                    height="100%"
                                                    style={{ borderRadius: "15px" }}
                                                    src={image}
                                                />
                                            </Box>
                                        </label>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-around",
                                        }}
                                    >
                                        <Box style={{ display: "flex", alignItems: "center" }}>
                                            <label htmlFor="title">
                                                <Typography>Title:&nbsp;</Typography>
                                            </label>
                                            <TextField
                                                id="title"
                                                type="text"
                                                fullWidth
                                                size="small"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </Box>
                                        <Box style={{ display: "flex" }}>
                                            <label htmlFor="des">
                                                <Typography>Description:&nbsp;</Typography>
                                            </label>
                                            <TextField
                                                id="des"
                                                type="text"
                                                fullWidth
                                                multiline
                                                size="small"
                                                maxRows={4}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </Box>
                                        <Box style={{ display: "flex", alignItems: "center" }}>
                                            <label htmlFor="duration">
                                                <Typography>Duration:&nbsp;</Typography>
                                            </label>
                                            <TextField
                                                id="duration"
                                                type="number"
                                                fullWidth
                                                size="small"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                            />
                                            <span>&nbsp;days</span>
                                        </Box>
                                        <Box style={{ display: "flex", alignItems: "center" }}>
                                            <label htmlFor="discount">
                                                <Typography>Discount:&nbsp;</Typography>
                                            </label>
                                            <TextField
                                                id="discount"
                                                type="number"
                                                fullWidth
                                                size="small"
                                                value={discount}
                                                onChange={(e) => setDiscount(e.target.value)}
                                            />
                                        </Box>
                                        <Box>
                                            <Box style={{ display: "flex", alignItems: "center" }}>
                                                <Checkbox
                                                    checked={mailDailyCustomer}
                                                    name="turntick"
                                                    onChange={(e) => setMailDailyCustomer(e.target.checked)}
                                                />
                                                <Typography>Send email to all daily customer</Typography>
                                            </Box>
                                        </Box>
                                        <Button type="submit" variant="contained" fullWidth disabled={loadingCreate}>
                                            {loadingCreate ? (
                                                <BeatLoader color={theme.palette.commonText.white} size={8} />
                                            ) : (
                                                "Confirm Create"
                                            )}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </DialogContent>
                    </Dialog>
                </Box>
            ) : (
                <EventDisplay>
                    <EventAction />
                </EventDisplay>
            )}
            <Box py={2}></Box>
        </CustomClass>
    );
};

export default EventsPage;
