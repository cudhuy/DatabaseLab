import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    List,
    ListItemButton,
    Collapse,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import ButtonCreateNewReport from "src/pages/staff/ReportInfrastructure/ButtonCreateNewReport";
import empty from "src/pages/admin/GamesManagement/assets/empty.png";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { editReport } from "src/redux/slices/reportSlice";

const CustomClass = styled(Box)((theme) => ({
    ".paperListReport": {
        backgroundColor: theme.theme.palette.commonText.grayWhite,
        cursor: "pointer",
    },
    ".paperListReport:hover": {
        transition: "0.2s",
        backgroundColor: theme.theme.palette.hover.white,
    },
    ".listReportTitle": {
        fontWeight: "bold",
    },
    ".listItemButton": {
        padding: "10px",
    },
    ".titleOfListSubItem": {
        whiteSpace: "nowrap",
        overflow: "hidden",
    },
    ".wrapperDialogContent": {
        padding: "20px",
    },
}));

const ListSubItem = ({ report, game }) => {
    const [dialogIsOpen, setOpenDialog] = useState(false);
    const openDialog = () => {
        setOpenDialog(true);
    };
    const closeDialog = () => {
        setOpenDialog(false);
    };

    const [title, setTitle] = useState(report?.title);
    const [description, setDescription] = useState(report?.description);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const { enqueueSnackbar: eq } = useSnackbar();
    const dp = useDispatch();
    const [image, setImage] = useState(report.image || empty);
    const [imageSending, setImageSending] = useState("");
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
        setImageSending(event.target.files[0]);
    };
    const handleEditNewReport = async (e) => {
        e.preventDefault();
        setLoadingEdit(true);
        await dp(editReport({ imageSending, title, description, eq, gameId: game._id, id: report.id }));
        setLoadingEdit(false);
    };
    const theme = useTheme();

    return (
        <CustomClass>
            <Paper className="paperListReport">
                <ListItemButton className="listItemButton" onClick={openDialog}>
                    <Grid container spacing={3}>
                        <Grid item xs={1}>
                            <img width="100%" src={report.image} />
                        </Grid>
                        <Grid item xs={11}>
                            <Typography className="titleOfListSubItem">{report.title}</Typography>
                        </Grid>
                    </Grid>
                </ListItemButton>
            </Paper>
            <Dialog
                open={dialogIsOpen}
                onClose={closeDialog}
                maxWidth="lg"
                PaperProps={{
                    style: {
                        backgroundColor: theme.palette.commonText.grayWhite,
                    },
                }}
            >
                <DialogTitle>
                    <Typography style={{ textAlign: "center", fontWeight: "bold", fontSize: "larger" }}>
                        Edit the report&nbsp;{`"${title}"`}
                    </Typography>
                </DialogTitle>
                <DialogContent className="wrapperDialogContent">
                    <form onSubmit={handleEditNewReport}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
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
                                        required
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
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
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
        </CustomClass>
    );
};

export default ListSubItem;
