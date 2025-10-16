import React from "react";
import { Avatar, Paper, List, Button, Box, Divider } from "@mui/material";
import { updateAccountData } from "src/redux/slices/auth-slice";
import { useDispatch } from "react-redux";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import { selectAuthSlice } from "src/redux/slices/auth-slice";
import { useNavigate } from "react-router-dom";
import { resetVipInfo } from "src/redux/slices/vipSlice";

const CustomClass = styled(Box)((theme) => ({
    ".dropdownWrapper": {
        position: "relative",
        "&:hover .dropdownContent": {
            visibility: "visible",
            opacity: 1,
        },
    },
    ".dropdownContent": {
        position: "absolute",
        top: "100%",
        right: 0,
        zIndex: 100,
        borderRadius: "10px",
        padding: "10px",
        width: "fit-content",
    },
    ".loginName": {
        color: theme.theme.palette.light.main,
        textAlign: "center",
    },
    ".textButton": {
        fontWeight: "bold",
        color: theme.theme.palette.commonText.white,
        whiteSpace: "nowrap",
    },
}));

const AvatarButton = ({ text }) => {
    const { loginName } = useSelector((state) => selectAuthSlice(state).accountData);
    const dp = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        dp(updateAccountData({ data: null }));
        dp(resetVipInfo());
        navigate("/");
    };

    return (
        <CustomClass>
            <Box className="dropdownWrapper">
                <Avatar>{text}</Avatar>
                <Paper className="dropdownContent">
                    <List className="loginName">{loginName}</List>
                    <Divider />
                    <Box py={1}></Box>
                    <Button className="textButton" fullWidth variant="contained" onClick={handleLogout}>
                        Log out
                    </Button>
                </Paper>
            </Box>
        </CustomClass>
    );
};

export default AvatarButton;
