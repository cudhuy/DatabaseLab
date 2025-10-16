import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthSlice } from "src/redux/slices/auth-slice";
import AvatarButton from "../AvatarButton";
import LoginDialog from "../LoginDialog";
import { useSnackbar } from "notistack";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";
import { FS } from "src/redux/slices/other/constant";
import { useNavigate } from "react-router-dom";
import { fetchVIPAccount } from "src/redux/slices/vipSlice";

const CustomClass = styled(Box)((theme) => ({
    ".login": {
        color: theme.theme.palette.primary.main,
        cursor: "pointer",
        "&:hover": {
            color: theme.theme.palette.commonText.black,
        },
    },
}));

const LoginButton = () => {
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const auth = useSelector((state) => selectAuthSlice(state));
    const role = auth?.accountData?.role;

    const openDialog = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const dp = useDispatch();
    const fetchVIP = async () => {
        await dp(fetchVIPAccount());
    };
    useEffect(() => {
        if (role == "customer") {
            localStorage.setItem("token", auth.accountData.token);
            fetchVIP();
        }
        if (auth.accountData && auth.loginStatus !== FS.FETCHING && auth.loginStatus !== FS.INITIAL) {
            localStorage.setItem("token", auth.accountData.token);
            enqueueSnackbar("Login Success", SUCCESS_TOP_CENTER);
            if (role == "admin") {
                navigate("/admin/accountmanagement");
            } else if (role == "staff") {
                navigate("/staff/paymentmanagement");
            } else if (role == "vip") {
                navigate("/vip");
            }
            handleClose();
        }
        if (auth.error && auth.loginStatus !== FS.FETCHING && auth.loginStatus !== FS.INITIAL) {
            if (auth.error.includes("Login")) {
                enqueueSnackbar(auth.error, ERR_TOP_CENTER);
            } else if (auth.error.includes("Password")) {
                enqueueSnackbar(auth.error, ERR_TOP_CENTER);
            } else {
                enqueueSnackbar("Something went wrong.Please login again!", ERR_TOP_CENTER);
            }
        }
    }, [auth]);

    //K tốt vì admin k vào được trang của user
    // useEffect(() => {
    //     if (role == "admin") {
    //         navigate("/admin/accountmanagement");
    //     } else if (role == "staff") {
    //         navigate("/staff/paymentmanagement");
    //     } else {
    //         navigate("/");
    //     }
    // }, [role]);

    return (
        <CustomClass>
            {role ? (
                role == "admin" ? (
                    <AvatarButton text="AD" />
                ) : role == "staff" ? (
                    <AvatarButton text="ST" />
                ) : (
                    <AvatarButton text="VIP" />
                )
            ) : (
                <Box>
                    <Typography
                        style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                        onClick={openDialog}
                        className={"login"}
                    >
                        Login
                    </Typography>
                    <LoginDialog onClose={handleClose} open={open} />
                </Box>
            )}
        </CustomClass>
    );
};

export default LoginButton;
