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
    Select,
    MenuItem,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import empty from "src/pages/admin/GamesManagement/assets/empty.png";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { createNewReport, fetchReport, editReport } from "src/redux/slices/reportSlice";
import DeleteReportAction from "src/pages/admin/Infrastructure/DeleteReportAction";

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
    const theme = useTheme();
    const [dialogIsOpen, setOpenDialog] = useState(false);
    const openDialog = () => {
        setOpenDialog(true);
        setStatus(report.state);
        setTitle(report?.title);
        setDescription(report?.description);
        setImage(report.image || empty);
    };
    const closeDialog = () => {
        setOpenDialog(false);
    };

    const [status, setStatus] = useState(report.state);
    const [title, setTitle] = useState(report?.title);
    const [description, setDescription] = useState(report?.description);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const { enqueueSnackbar: eq } = useSnackbar();
    const dp = useDispatch();
    const [image, setImage] = useState(report.image || empty);
    const [imageSending, setImageSending] = useState("");
    const handleEditNewReport = async (e) => {
        e.preventDefault();
        setLoadingEdit(true);
        await dp(editReport({ imageSending, title, description, eq, gameId: game._id, id: report.id, status }));
        setLoadingEdit(false);
    };

    return (
        <CustomClass>
            <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} md={7} lg={8} xl={9}>
                    <Paper className="paperListReport">
                        <ListItemButton className="listItemButton" onClick={openDialog}>
                            <Box style={{ display: "flex" }}>
                                <img width="40px" src={report.image} />
                                <span>&nbsp;&nbsp;</span>
                                <span className="titleOfListSubItem">{report.title}</span>
                            </Box>
                        </ListItemButton>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5} lg={4} xl={3}>
                    <DeleteReportAction {...{ report, game }} />
                </Grid>
            </Grid>
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
                                <label>
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
                                    <Typography>{title}</Typography>
                                </Box>
                                <Box style={{ display: "flex" }}>
                                    <label htmlFor="des">
                                        <Typography>Report Date:&nbsp;</Typography>
                                    </label>
                                    <Typography>{new Date(report.date).toLocaleString()}</Typography>
                                </Box>
                                <Box style={{ display: "flex", alignItems: "center" }}>
                                    <label htmlFor="des">
                                        <Typography>Description:&nbsp;</Typography>
                                    </label>
                                    <TextField
                                        id="des"
                                        type="text"
                                        fullWidth
                                        multiline
                                        size="small"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Box>
                                <TextField
                                    select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    size="small"
                                    label="Status"
                                    SelectProps={{
                                        MenuProps: {
                                            PaperProps: {
                                                sx: {
                                                    color: theme.palette.commonText.white,
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value={0}>Reporting&nbsp;</MenuItem>
                                    <MenuItem value={1}>Fixing&nbsp;</MenuItem>
                                    <MenuItem value={2}>Fixed&nbsp;</MenuItem>
                                </TextField>
                                <Button type="submit" variant="contained" fullWidth disabled={loadingEdit}>
                                    {loadingEdit ? (
                                        <BeatLoader color={theme.palette.commonText.white} size={8} />
                                    ) : (
                                        "Update new status"
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
