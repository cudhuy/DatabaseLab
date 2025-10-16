import { Box, Button, Typography, Slide, Dialog, DialogTitle, IconButton, DialogActions } from "@mui/material";
import React, { useState } from "react";
import { styled, alpha, useTheme } from "@mui/system";
import { useDispatch } from "react-redux";
import { deleteUser, deleteVIPUser, fetchAllVIPAccount } from "src/redux/slices/listAccountSlice";
import { BeatLoader } from "react-spinners";
import { Close } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CustomClass = styled(Box)((theme) => ({
    ".wrapper": {
        padding: theme.theme.spacing(3, 5, 3, 5),
        borderRadius: "15px",
    },
    ".button": {
        borderRadius: "15px",
        fontSize: "large",
        fontWeight: "medium",
    },
    ".text": {
        color: theme.theme.palette.commonText.white,
        fontWeight: "lighter",
        marginBottom: "10px",
        marginTop: "10px",
    },
    ".header": {
        backgroundColor: alpha(theme.theme.palette.background.header.main, 0.8),
        "& th:last-child": {
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "10px",
        },
        "& th:first-of-type": {
            borderBottomLeftRadius: "10px",
            borderTopLeftRadius: "10px",
        },
    },
    ".normal": {
        backgroundColor: alpha(theme.theme.palette.background.header.main, 0.2),
        "& td:last-child": {
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "10px",
        },
        "& td:first-of-type": {
            borderBottomLeftRadius: "10px",
            borderTopLeftRadius: "10px",
        },
    },
    ".headerText": {
        fontSize: "large",
        fontWeight: "bolder",
    },
    ".headerTextCenter": {
        fontSize: "large",
        fontWeight: "bolder",
        textAlign: "center",
    },
    ".bodyText": {
        color: theme.theme.palette.commonText.white,
        fontWeight: "medium",
    },
    ".bodyTextCenter": {
        color: theme.theme.palette.commonText.white,
        fontWeight: "medium",
        textAlign: "center",
    },
    ".responsive": {
        [theme.theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
    ".input": {
        color: theme.theme.palette.commonText.white,
    },
}));
const CustomStyle = styled(Box)((theme) => ({
    ".background": {
        backgroundColor: theme.theme.palette.background.header.main,
        overflow: "hidden",
    },
    ".font": {
        color: theme.theme.palette.primary.main,
    },
    ".fontsmall": {
        color: theme.theme.palette.secondary.main,
    },
    ".closeButton": {
        display: "flex",
        justifyContent: "flex-end",
    },
}));

const VIPDeleteButton = ({ id, uuid }) => {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [open, setOpen] = useState(false);
    const openDialog = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const dp = useDispatch();

    const handleDelete = async (id, uuid) => {
        setLoadingDelete(true);
        await Promise.all([dp(deleteVIPUser(uuid))]);
        await dp(fetchAllVIPAccount());
        setLoadingDelete(false);
        setOpen(false);
    };
    const theme = useTheme();
    return (
        <CustomClass>
            <Button variant="contained" onClick={openDialog} disabled={loadingDelete}>
                {loadingDelete ? <BeatLoader color={theme.palette.commonText.white} size={4} /> : "Delete"}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth={"xs"}
                TransitionComponent={Transition}
                keepMounted
            >
                <CustomStyle>
                    <DialogTitle className="background">
                        <Box className="closeButton">
                            <IconButton aria-label="close" onClick={handleClose}>
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
                            onClick={() => handleDelete(id, uuid)}
                            disabled={loadingDelete}
                        >
                            {loadingDelete ? (
                                <BeatLoader color={theme.palette.commonText.white} size={8} />
                            ) : (
                                "Delete now"
                            )}
                        </Button>
                    </DialogActions>
                </CustomStyle>
            </Dialog>
        </CustomClass>
    );
};

export default VIPDeleteButton;
