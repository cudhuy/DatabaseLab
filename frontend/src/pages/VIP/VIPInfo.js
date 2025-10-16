import React, { useState, Fragment } from "react";
import { Box, Typography, Paper, Grid, Button, TextField } from "@mui/material";
import VIPImg from "src/pages/staff/VIPManagement/assets/vip.png";
import { styled, useTheme } from "@mui/system";
import Shield from "./assets/Shield.png";
import { useDispatch, useSelector } from "react-redux";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER, WARNING_TOP_CENTER } from "src/utils/snackbar-utils";
import { useSnackbar } from "notistack";
import { BeatLoader } from "react-spinners";
import { exchangeVoucher } from "src/redux/slices/vipSlice";

const CustomClass = styled(Box)((theme) => ({
    ".paper": {
        backgroundColor: theme.theme.palette.commonText.grayWhite,
        padding: "25px",
        borderRadius: "10px",
    },
    ".middle": {
        color: theme.theme.palette.commonText.white,
        backgroundImage: `url(${Shield})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center, center",
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "156px",
        height: "190px",
        margin: "0 auto",
    },
}));

const VIP = () => {
    const vipAccount = useSelector((state) => state.vipSlice.infoVIP);
    const listVoucher = useSelector((state) => state.vipSlice.listVoucher);
    const [point, setPoint] = useState(parseInt(vipAccount.point));
    const patternRange = /^[\d]*$/im;
    const { enqueueSnackbar: eq } = useSnackbar();
    const dp = useDispatch();
    const handleChangePoint = (e) => {
        if (patternRange.test(e.target.value)) {
            if (e.target.value > vipAccount.point) {
                eq(`Number of point max is ${parseInt(vipAccount.point)} only!!!`, WARNING_TOP_CENTER);
                setPoint("");
                return;
            }
            setPoint(e.target.value);
        }
    };
    const [loading, setLoading] = useState(false);
    const exchangeForVoucher = async () => {
        try {
            if (parseInt(point) <= 0 || parseInt(point) > vipAccount.point) {
                eq("Invalid input!", ERR_TOP_CENTER);
                return;
            }
            setLoading(true);
            await dp(exchangeVoucher({ point: parseInt(point), vipId: vipAccount.uuid }));
            eq("Successfully exchange!!", SUCCESS_TOP_CENTER);
            setPoint(0);
        } catch (err) {
            console.log(err);
            eq(err.message, ERR_TOP_CENTER);
        } finally {
            setLoading(false);
        }
    };
    const theme = useTheme();
    return (
        <CustomClass>
            <Box width="100%">
                <img width="50%" src={VIPImg} style={{ display: "block", margin: "0 auto" }} />
            </Box>
            <Paper elevation={0} className="paper">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                        <Box py={1}></Box>
                        <Typography>
                            <span style={{ fontWeight: "bold" }}>Name: </span>&nbsp;{vipAccount.name}
                        </Typography>
                        <Box py={1}></Box>
                        <Typography>
                            <span style={{ fontWeight: "bold" }}>Email: </span>&nbsp;{vipAccount.email}
                        </Typography>
                        <Box py={1}></Box>
                        <Typography>
                            <span style={{ fontWeight: "bold" }}>Phone number: </span>&nbsp;{vipAccount.phone}
                        </Typography>
                        <Box py={1}></Box>
                        <Typography>
                            <span style={{ fontWeight: "bold" }}>Due date: </span>&nbsp;
                            {vipAccount.dueDate.toLocaleString()}
                        </Typography>
                        <Box py={1}></Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Box className="middle">
                            <Typography style={{ fontWeight: "bold", fontSize: "25px" }}>Your Point</Typography>
                            <Typography style={{ fontSize: "25px" }}>{parseInt(vipAccount.point)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item md={1}></Grid>
                    <Grid item xs={12} md={4}>
                        <Box py={1}></Box>
                        <TextField
                            label="Point to exchange"
                            fullWidth
                            value={point}
                            onChange={(e) => handleChangePoint(e)}
                        />
                        <Box py={1}></Box>
                        <Typography>Discount:&nbsp;{point / 10000}%</Typography>
                        <Box py={1}></Box>
                        <Button variant="contained" fullWidth onClick={exchangeForVoucher} disabled={loading}>
                            {loading ? (
                                <BeatLoader color={theme.palette.commonText.white} size={8} />
                            ) : (
                                "Exchange for voucher"
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Box py={1}></Box>
            {listVoucher.length > 0 && <Typography>You have&nbsp;{listVoucher.length}&nbsp;voucher:</Typography>}
            {listVoucher.map((ele, index) => (
                <Fragment key={index}>
                    <Typography>
                        Code:&nbsp;{ele.voucherCode}&nbsp;-&nbsp;{ele.discount}%
                    </Typography>
                </Fragment>
            ))}
        </CustomClass>
    );
};

export default VIP;
