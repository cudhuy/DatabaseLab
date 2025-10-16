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
import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/system";
import Close from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import logoImg from "src/assets/images/logos/Tinkerbellgarden.png";
import Slide from "@mui/material/Slide";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { userLogin } from "src/redux/slices/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { FS } from "src/redux/slices/other/constant";
import { useFormik } from "formik";

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

const LoginDialog = ({ onClose, open }) => {
    const theme = useTheme();
    // const [refFocus, setRefFocus] = useState(0);
    const validate = (values) => {
        const errors = {};
        if (values.userName === "") {
            errors.userName = "Please enter username";
        }
        if (values.password === "") {
            errors.password = "Please enter password";
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            userName: "",
            password: "",
        },
        validate,
        onSubmit: () => {
            handleLogin();
        },
    });
    const dp = useDispatch();
    const auth = useSelector((state) => state.authSlice);

    const close = () => {
        formik.resetForm();
        onClose();
    };

    const handleLogin = async () => {
        const user = {
            loginName: formik.values.userName,
            password: formik.values.password,
        };

        dp(userLogin(user));
    };
    const onClickLogin = () => {
        formik.submitForm();
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
                    <Box style={{ display: "flex", justifyContent: "center" }}>
                        <img src={logoImg} style={{ height: "80px" }} />
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
                        // onClick={() => setRefFocus(0)}
                    >
                        Login
                    </Typography>
                    <Typography
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: "small",
                        }}
                        className="fontsmall"
                    >
                        For staff and admin and VIP member only
                    </Typography>
                </DialogTitle>
                <DialogContent className="background">
                    <Typography style={{ margin: "6px 0px", fontSize: "16px" }}>Username</Typography>
                    <FormControl fullWidth focused={true}>
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
                            // onClick={() => setRefFocus(0)}
                            // inputRef={(input) => {
                            //     if (input && refFocus == 0) input.focus();
                            // }}
                            onKeyPress={(e) => handleKeyDown(e)}
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
                            // onClick={() => setRefFocus(1)}
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
                        disabled={auth.loginStatus === FS.FETCHING}
                    >
                        {auth.loginStatus === FS.FETCHING ? (
                            <BeatLoader color={theme.palette.commonText.white} size={8} />
                        ) : (
                            "Login"
                        )}
                    </Button>
                </DialogActions>
            </CustomStyle>
        </Dialog>
    );
};

export default LoginDialog;
