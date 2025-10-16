import React, { Fragment, useState } from "react";
import { Button, Dialog, DialogActions, DialogTitle, IconButton, Slide, Typography } from "@mui/material";
import { BeatLoader } from "react-spinners";
import { Box, useTheme } from "@mui/system";
import { Close } from "@mui/icons-material";
import styled from "@emotion/styled";
import { deleteUser, fetchAllNormalAccount } from "src/redux/slices/listAccountSlice";
import { useDispatch } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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

const DeleteButton = (props) => {
    const theme = useTheme();
    const { loadingDelete, index, detail, setLoadingDelete, ...buttonProps } = props;
    const [open, setOpen] = useState(false);
    const dp = useDispatch();

    const handleDelete = async (id, index) => {
        setLoadingDelete([...loadingDelete, index]);
        await dp(deleteUser(id));
        await dp(fetchAllNormalAccount());
        setLoadingDelete(loadingDelete.filter((item) => item != index));
        setOpen(false);
    };

    const openDialog = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Button {...buttonProps} disabled={loadingDelete.includes(index)} onClick={openDialog}>
                {loadingDelete.includes(index) ? (
                    <BeatLoader color={theme.palette.commonText.white} size={4} />
                ) : (
                    "Delete"
                )}
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
                            onClick={() => handleDelete(detail.id, index)}
                            disabled={loadingDelete.includes(index)}
                        >
                            {loadingDelete.includes(index) ? (
                                <BeatLoader color={theme.palette.commonText.white} size={8} />
                            ) : (
                                "Delete now"
                            )}
                        </Button>
                    </DialogActions>
                </CustomStyle>
            </Dialog>
        </Fragment>
    );
};

export default DeleteButton;
