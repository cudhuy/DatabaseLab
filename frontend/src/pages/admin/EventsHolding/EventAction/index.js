import { Box, Paper, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Empty from "src/components/Empty";
import { styled, useTheme } from "@mui/system";
import noel from "src/pages/EventsPage/assets/noel.jpg";
import empty from "src/pages/admin/GamesManagement/assets/empty.png";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { createNewEvent, deleteEvent, editEvent, fetchEvent } from "src/redux/slices/eventSliceV2";
import { BeatLoader } from "react-spinners";

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

const EventAction = () => {
    const event = useSelector((state) => state.eventSliceV2.event);

    const [image, setImage] = useState(event.url || empty);
    const [imageSending, setImageSending] = useState("");
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
        setImageSending(event.target.files[0]);
    };
    const [title, setTitle] = useState(event?.title);
    const [description, setDescription] = useState(event?.description);
    const [discount, setDiscount] = useState(event?.discount);
    const [duration, setDuration] = useState(event?.duration);
    const { enqueueSnackbar: eq } = useSnackbar();
    const dp = useDispatch();

    const [deleteDialogIsOpen, setOpenDeleteDialog] = useState(false);
    const openDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };
    const closeDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };
    const [loadingDelete, setLoadingDelete] = useState(false);
    const successDeleteEvent = () => {
        setTitle("");
        setDiscount(0);
        setDescription("");
        setImage(empty);
        setDuration(1);
        closeDeleteDialog();
    };
    const handleDeleteEvent = async () => {
        setLoadingDelete(true);
        await dp(deleteEvent({ eq, successDeleteEvent }));
        setLoadingDelete(false);
    };

    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const openEditDialog = () => {
        setEditDialogIsOpen(true);
        setTitle(event?.title);
        setDiscount(event?.discount);
        setDescription(event?.description);
        setImage(event.url || empty);
        setDuration(1);
    };
    const closeEditDialog = () => {
        setEditDialogIsOpen(false);
    };
    const [loadingEdit, setLoadingEdit] = useState(false);
    const handleEditEvent = async (e) => {
        e.preventDefault();
        setLoadingEdit(true);
        await dp(editEvent({ title, description, discount, imageSending, duration, eq, closeEditDialog }));
        setLoadingEdit(false);
    };
    const theme = useTheme();

    return (
        <CustomClass>
            <Box style={{ textAlign: "center" }}>
                <Button variant="contained" onClick={openEditDialog}>
                    Edit
                </Button>
                <Dialog
                    open={editDialogIsOpen}
                    onClose={closeEditDialog}
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
                        <form onSubmit={handleEditEvent}>
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
                                            <img width="100%" style={{ borderRadius: "15px" }} src={image} />
                                        </Box>
                                    </label>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    style={{ display: "flex", flexDirection: "column", justifyContent: "space-around" }}
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
                                    <Button type="submit" variant="contained" fullWidth disabled={loadingEdit}>
                                        {loadingEdit ? (
                                            <BeatLoader color={theme.palette.commonText.white} size={8} />
                                        ) : (
                                            "Confirm Edit"
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                </Dialog>
                <span> </span>
                <Button variant="contained" onClick={openDeleteDialog}>
                    Delete
                </Button>
                <Dialog
                    open={deleteDialogIsOpen}
                    onClose={closeDeleteDialog}
                    PaperProps={{
                        style: {
                            backgroundColor: theme.palette.commonText.white,
                        },
                    }}
                >
                    <DialogTitle>
                        <Typography style={{ textAlign: "center" }}>
                            Are you sure want to delete this event ?
                        </Typography>
                    </DialogTitle>
                    <DialogContent style={{ padding: "20px" }}>
                        <Button
                            fullWidth
                            onClick={() => handleDeleteEvent()}
                            variant="contained"
                            disabled={loadingDelete}
                        >
                            {loadingDelete ? (
                                <BeatLoader color={theme.palette.commonText.white} size={8} />
                            ) : (
                                "Confirm Delete"
                            )}
                        </Button>
                    </DialogContent>
                </Dialog>
            </Box>
        </CustomClass>
    );
};

export default EventAction;
