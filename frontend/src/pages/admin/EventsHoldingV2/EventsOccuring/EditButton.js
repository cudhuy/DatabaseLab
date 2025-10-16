import React, { useState, Fragment } from "react";
import { Paper, Grid, Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import StopEventButton from "src/pages/admin/EventsHoldingV2/EventsOccuring/StopEventButton";
import { BeatLoader } from "react-spinners";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import empty from "src/pages/admin/GamesManagement/assets/empty.png";

const EditButton = ({ event }) => {
    const [loading, setLoading] = useState(false);
    const [dialogIsOpen, setOpenDialog] = useState(false);
    const [image, setImage] = useState(event.image || empty);
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
    const { enqueueSnackbar: eq } = useSnackbar();
    const dp = useDispatch();
    const openDialog = () => {
        setOpenDialog(true);
    };
    const closeDialog = () => {
        setOpenDialog(false);
    };
    const editEvent = (e) => {
        setLoading(true);
        e.preventDefault();
        setLoading(false);
    };
    const theme = useTheme();
    return (
        <Fragment>
            <Button variant="contained" onClick={openDialog} disabled={event.isStop || loading}>
                {loading ? <BeatLoader color={theme.palette.commonText.white} size={8} /> : "Edit Event Info"}
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
                        Edit Event&nbsp;{event?.title}
                    </Typography>
                </DialogTitle>
                <DialogContent style={{ padding: "20px" }}>
                    <form onSubmit={editEvent}>
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
                                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                                    {loading ? (
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
        </Fragment>
    );
};

export default EditButton;
