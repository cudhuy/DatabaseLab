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
    IconButton,
    Slide,
    DialogActions,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import empty from "src/pages/admin/GamesManagement/assets/empty.png";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { Close } from "@mui/icons-material";
import { BeatLoader } from "react-spinners";
import { deleteReports, fetchReport } from "src/redux/slices/reportSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CustomClass = styled(Box)((theme) => ({}));

const DeleteReportAction = ({ report, game }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const openDialog = () => {
        setIsOpen(true);
    };
    const closeDialog = () => {
        setIsOpen(false);
    };
    const dp = useDispatch();
    const { enqueueSnackbar: eq } = useSnackbar();
    const { reportConfig } = useSelector((state) => state.reportSlice);
    const fetchData = async () => {
        let start = reportConfig.start,
            end = reportConfig.end,
            listId = reportConfig.listId,
            listStatus = reportConfig.listStatus,
            search = reportConfig.search,
            sort = reportConfig.gamsorteId;
        await Promise.all([dp(fetchReport({ start, end, listStatus, listId, search, sort }))]);
    };

    const handleDelete = async () => {
        setLoadingDelete(true);
        await dp(deleteReports({ idList: [report.id], eq, closeDialog, fetchData }));
        setLoadingDelete(false);
    };
    const theme = useTheme();

    return (
        <CustomClass>
            <Button variant="contained" fullWidth onClick={openDialog}>
                Delete Report
            </Button>
            <Dialog
                open={isOpen}
                onClose={closeDialog}
                fullWidth
                maxWidth={"xs"}
                TransitionComponent={Transition}
                keepMounted
                PaperProps={{
                    style: {
                        backgroundColor: theme.palette.commonText.grayWhite,
                    },
                }}
            >
                <CustomClass>
                    <DialogTitle className="background">
                        <Box className="closeButton">
                            <IconButton aria-label="close" onClick={closeDialog}>
                                <Close />
                            </IconButton>
                        </Box>
                        <Typography
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "10px",
                                fontWeight: "600",
                                fontSize: "20px",
                            }}
                            className="font"
                        >
                            Are you sure want to delete this account ?
                        </Typography>
                    </DialogTitle>
                    <DialogActions className="background">
                        <Button
                            color="primary"
                            variant="contained"
                            style={{
                                display: "flex",
                                flex: 1,
                                margin: "0px 14px 10px 14px",
                                borderRadius: "15px",
                            }}
                            onClick={() => handleDelete()}
                            disabled={loadingDelete}
                        >
                            {loadingDelete ? (
                                <BeatLoader color={theme.palette.commonText.white} size={8} />
                            ) : (
                                "Delete now"
                            )}
                        </Button>
                    </DialogActions>
                </CustomClass>
            </Dialog>
        </CustomClass>
    );
};

export default DeleteReportAction;
