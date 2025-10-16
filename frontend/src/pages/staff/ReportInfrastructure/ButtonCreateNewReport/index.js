import React, { useState } from "react";
import { Box, Button, Dialog, DialogContent, Typography, Grid, TextField, DialogTitle } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import empty from "src/pages/admin/GamesManagement/assets/empty.png";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { createNewReport } from "src/redux/slices/reportSlice";
import { useSnackbar } from "notistack";

const CustomClass = styled(Box)((theme) => ({}));

const ButtonCreateNewReport = ({ game }) => {
    const [createDialogIsOpen, triggerCreateDialog] = useState(false);
    const openCreateReportDialog = () => {
        triggerCreateDialog(true);
    };
    const closeCreateDialog = () => {
        triggerCreateDialog(false);
    };

    const [loadingCreate, setLoadingCreate] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(empty);
    const [imageSending, setImageSending] = useState(null);
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
        setImageSending(event.target.files[0]);
    };
    const dp = useDispatch();
    const { enqueueSnackbar: eq } = useSnackbar();

    const handleCreateNewReport = async (e) => {
        e.preventDefault();
        setLoadingCreate(true);
        await dp(createNewReport({ imageSending, title, description, eq, gameId: game._id }));
        setLoadingCreate(false);
    };
    const theme = useTheme();
    return (
        <CustomClass>
            <span style={{ paddingLeft: "10px" }}></span>
            <Button variant="outlined" onClick={openCreateReportDialog}>
                Create New Report
            </Button>
            <Dialog
                open={createDialogIsOpen}
                onClose={closeCreateDialog}
                PaperProps={{
                    style: {
                        backgroundColor: theme.palette.commonText.grayWhite,
                    },
                }}
                maxWidth="lg"
            >
                <DialogTitle>
                    <Typography style={{ textAlign: "center", fontWeight: "bold", fontSize: "larger" }}>
                        Create new report for&nbsp;{game.title}
                    </Typography>
                </DialogTitle>
                <DialogContent style={{ padding: "20px" }}>
                    <form onSubmit={handleCreateNewReport}>
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
                                    <img width="100%" src={image} alt="" />
                                </label>
                            </Grid>
                            <Grid item xs={12} md={7}>
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
                                        required
                                    />
                                </Box>
                                <Box py={1}></Box>
                                <Box style={{ display: "flex" }}>
                                    <label htmlFor="des">
                                        <Typography>Description:&nbsp;</Typography>
                                    </label>
                                    <TextField
                                        id="des"
                                        type="text"
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        size="small"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Box>
                                <Box py={1}></Box>
                                <Box style={{ textAlign: "center" }}>
                                    <Button type="submit" disabled={loadingCreate} variant="contained">
                                        {loadingCreate ? (
                                            <BeatLoader color={theme.palette.commonText.white} size={8} />
                                        ) : (
                                            "Confirm this report"
                                        )}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        </CustomClass>
    );
};

export default ButtonCreateNewReport;
