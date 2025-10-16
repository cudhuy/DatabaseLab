import React, { Fragment, useState } from "react";
import { Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import { BeatLoader } from "react-spinners";
import empty from "src/pages/admin/GamesManagement/assets/empty.png";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { createNewEvent } from "src/redux/slices/eventSliceV2";
import { useTheme } from "@mui/system";

const CreateEventButton = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState(10);

    const [createDialogIsOpen, setOpenCreateDialog] = useState(false);
    const openCreateDialog = () => {
        setTitle("");
        setDiscount("");
        setDescription("");
        setImage(empty);
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
                eq,
                closeCreateDialog,
            })
        );
        setLoadingCreate(false);
    };
    const theme = useTheme();
    return (
        <Fragment>
            <Button variant="contained" onClick={openCreateDialog}>
                {" "}
                Create New Event
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
                            <Grid item xs={12} md={5}>
                                <input
                                    accept="image/*"
                                    hidden
                                    id="raised-button-file"
                                    type="file"
                                    onChange={onImageChange}
                                />
                                <label htmlFor="raised-button-file">
                                    <img width="100%" style={{ borderRadius: "15px" }} src={image} />
                                </label>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={7}
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
                                        minRows={3}
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
        </Fragment>
    );
};

export default CreateEventButton;
