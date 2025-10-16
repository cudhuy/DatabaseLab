import React, { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Typography,
    Grid,
    TextField,
    DialogTitle,
    Slide,
    IconButton,
    DialogActions,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import empty from "src/pages/admin/GamesManagement/assets/empty.png";
import { BeatLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { deleteReports, fetchReport } from "src/redux/slices/reportSlice";
import { useSnackbar } from "notistack";
import { Close } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CustomClass = styled(Box)((theme) => ({}));

const ButtonDeleteAll = ({ game, reports }) => {
    const [deleteDialogIsOpen, triggerDeleteDialog] = useState(false);
    const openDeleteReportDialog = () => {
        triggerDeleteDialog(true);
    };
    const closeDeleteDialog = () => {
        triggerDeleteDialog(false);
    };
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

    const [loadingDelete, setLoadingDelete] = useState(false);
    const dp = useDispatch();
    const { enqueueSnackbar: eq } = useSnackbar();

    const handleDeleteAll = async () => {
        setLoadingDelete(true);
        const data = reports.map((report) => {
            return report.id;
        });
        await dp(deleteReports({ idList: data, eq, closeDeleteDialog, fetchData }));
        setLoadingDelete(false);
    };
    const theme = useTheme();
    return (
        <CustomClass>
            <span style={{ paddingLeft: "10px" }}></span>
            <Button variant="outlined" onClick={openDeleteReportDialog}>
                Delete All
            </Button>
            <Dialog
                open={deleteDialogIsOpen}
                onClose={closeDeleteDialog}
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
                            <IconButton aria-label="close" onClick={closeDeleteDialog}>
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
                            onClick={() => handleDeleteAll()}
                            disabled={loadingDelete}
                        >
                            {loadingDelete ? (
                                <BeatLoader color={theme.palette.commonText.white} size={8} />
                            ) : (
                                "Delete all now"
                            )}
                        </Button>
                    </DialogActions>
                </CustomClass>
            </Dialog>
        </CustomClass>
    );
};

export default ButtonDeleteAll;
