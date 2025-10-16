import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Typography,
    FormControl,
    Button,
    TextField,
} from "@mui/material";
import React, { useState } from "react";
import { styled, useTheme } from "@mui/system";
import Close from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import Slide from "@mui/material/Slide";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { createNewUser, fetchAllNormalAccount } from "src/redux/slices/listAccountSlice";
import { useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";

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
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const CreateDialog = ({ onClose, open, loading, setLoading }) => {
    const { enqueueSnackbar: eq } = useSnackbar();
    const theme = useTheme();
    const validate = (values) => {
        const errors = {};
        if (values.userName === "") {
            errors.userName = "Please enter username";
        } else if (values.userName.length < 6) {
            errors.userName = "Username must have at least 6 characters";
        }
        if (values.password === "") {
            errors.password = "Please enter password";
        } else if (values.password.length < 8) {
            errors.password = "Password must have at least 8 characters";
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            userName: "",
            password: "",
        },
        validate,
        onSubmit: async () => {
            await handleCreate();
        },
    });
    const dp = useDispatch();

    const close = () => {
        formik.resetForm();
        onClose();
    };

    const handleCreate = async () => {
        setLoading(true);
        const user = {
            loginName: formik.values.userName,
            password: formik.values.password,
        };
        const response = await dp(createNewUser({ user })); //await hoàn toàn đúng
        if (response.error) {
            console.log(response.error);
            eq("Some errors occured! Make sure loginName is unique", ERR_TOP_CENTER);
            setLoading(false);
            return;
        }
        await dp(fetchAllNormalAccount());
        eq("New account is created", SUCCESS_TOP_CENTER);
        close();
        setLoading(false);
    };
    const onClickLogin = async () => {
        await formik.submitForm();
    };

    const handleKeyDown = (e) => {
        if (e.key == "Enter") formik.submitForm();
    };

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth={"xs"} TransitionComponent={Transition} keepMounted>
            <CustomStyle>
                <DialogTitle className="background">
                    <Box className="closeButton">
                        <IconButton aria-label="close" onClick={close}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Typography
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "10px",
                            fontWeight: "600",
                            fontSize: "40px",
                        }}
                        className="font"
                    >
                        Create account
                    </Typography>
                </DialogTitle>
                <DialogContent className="background">
                    <Typography style={{ margin: "6px 0px", fontSize: "16px" }}>Username</Typography>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            value={formik.values.userName}
                            name="userName"
                            error={!!formik.errors.userName}
                            helperText={formik.errors.userName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBoxIcon style={{ fontSize: "20px" }} />
                                    </InputAdornment>
                                ),
                            }}
                            size="small"
                            placeholder={"User name"}
                        />
                    </FormControl>
                    <Typography style={{ margin: "8px 0px 6px 0px", fontSize: "16px" }}>Password</Typography>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            style={{ height: "40px" }}
                            type="password"
                            value={formik.values.password}
                            name="password"
                            error={!!formik.errors.password}
                            helperText={formik.errors.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon style={{ fontSize: "20px" }} />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder={"Password"}
                            size="small"
                            onKeyPress={(e) => handleKeyDown(e)}
                        />
                    </FormControl>
                    <Box sx={{ marginBottom: "10px" }}></Box>
                </DialogContent>
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
                        onClick={onClickLogin}
                        onKeyPress={(e) => handleKeyDown(e)}
                        disabled={loading}
                    >
                        {loading ? <BeatLoader color={theme.palette.commonText.white} size={8} /> : "Create account"}
                    </Button>
                </DialogActions>
            </CustomStyle>
        </Dialog>
    );
};

export default CreateDialog;
