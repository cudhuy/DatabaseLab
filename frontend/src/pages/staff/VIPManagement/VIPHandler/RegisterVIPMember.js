import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid, TextField, Button } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/system";
import VIPImg from "src/pages/staff/VIPManagement/assets/vip.png";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { registerVIP } from "src/redux/slices/vipSlice";
import { useSnackbar } from "notistack";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";

const CustomClass = styled(Box)((theme) => ({
    ".paper": {
        backgroundColor: theme.theme.palette.commonText.grayWhite,
        padding: "20px",
        borderRadius: "10px",
    },
    ".title": {
        textAlign: "center",
        fontSize: "30px",
        fontWeight: "bold",
        color: theme.theme.palette.footer,
    },
    ".cost": {
        textAlign: "center",
        fontSize: "25px",
        fontWeight: "",
        color: theme.theme.palette.footer,
    },
    ".code": {
        textAlign: "center",
        color: alpha(theme.theme.palette.commonText.black, 0.4),
        border: "1px solid black",
        borderRadius: "20px",
        padding: "10px",
    },
}));

const RegisterVIPMember = () => {
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("CODE");
    const dp = useDispatch();
    const { enqueueSnackbar: eq } = useSnackbar();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const handleRegister = async (e) => {
        try {
            if (name == "" || email == "" || phone == "") {
                throw Error("Lack of information");
            }
            if (/\d/.test(name)) {
                throw Error("Wrong name");
            }
            e.preventDefault();
            setLoading(true);
            const response = await dp(registerVIP({ name, email, phone })).unwrap();
            eq("Register VIP successfully", SUCCESS_TOP_CENTER);
            setCode(response.data);
            setName("");
            setEmail("");
            setPhone("");
        } catch (err) {
            console.log(err);
            eq(err.message, ERR_TOP_CENTER);
        } finally {
            setLoading(false);
        }
    };

    const patternRange = /^[\d]*$/im;
    const phoneChange = (e) => {
        if (patternRange.test(e.target.value)) {
            setPhone(e.target.value);
        }
    };

    useEffect(() => {
        const stopTimeout = setTimeout(() => {
            setCode("CODE");
        }, 20000);
        return () => {
            clearTimeout(stopTimeout);
        };
    }, [code]);
    const theme = useTheme();
    return (
        <CustomClass>
            <Paper elevation={0} className="paper">
                <Typography className="title">Register VIP Member</Typography>
                <Typography className="cost">Cost: 400,000VNĐ</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <form onSubmit={handleRegister}>
                            <label htmlFor="regisName">Name: </label>
                            <TextField
                                // xử lý lỗi trong textfield, đỡ dùng formik
                                error={/\d/.test(name)}
                                helperText={/\d/.test(name) ? "Name cannot contain number" : null}
                                id="regisName"
                                fullWidth
                                size="small"
                                type="text"
                                placeholder="Nguyen Van A"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label htmlFor="regisMail">Email: </label>
                            <TextField
                                id="regisMail"
                                fullWidth
                                size="small"
                                type="email"
                                value={email}
                                placeholder="hieucuopbien123@gmail.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="regisPhone">Phone Number: </label>
                            <TextField
                                id="regisPhone"
                                fullWidth
                                type="text"
                                size="small"
                                placeholder="0382776646"
                                value={phone}
                                helperText="This phone number'll be used for username login"
                                onChange={(e) => phoneChange(e)}
                            />
                            <Box py={1}></Box>
                            <Button
                                variant="contained"
                                style={{ margin: "0 auto", display: "block" }}
                                size="large"
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? (
                                    <BeatLoader color={theme.palette.commonText.white} size={8} />
                                ) : (
                                    "Register VIP member"
                                )}
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <img width="60%" src={VIPImg} style={{ display: "block", margin: "0 auto" }} />
                        <Box py={1} />
                        <Box className="code"> {code.substring(0, 5)} </Box>
                    </Grid>
                </Grid>
            </Paper>
        </CustomClass>
    );
};

export default RegisterVIPMember;
