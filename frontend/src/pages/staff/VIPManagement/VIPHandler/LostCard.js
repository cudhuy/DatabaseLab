import React, { useState } from "react";
import { Box, Paper, Typography, Grid, TextField, Button } from "@mui/material";
import { alpha, styled, useTheme } from "@mui/system";
import VIPImg from "src/pages/staff/VIPManagement/assets/vip.png";
import { BeatLoader } from "react-spinners";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";
import { retrieveInfo } from "src/redux/slices/vipSlice";

const CustomClass = styled(Box)((theme) => ({
    ".code": {
        textAlign: "center",
        color: alpha(theme.theme.palette.commonText.black, 0.7),
        border: "1px solid black",
        borderRadius: "20px",
        padding: "10px",
    },
}));

const LostCard = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("CODE");
    const { enqueueSnackbar: eq } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const dp = useDispatch();

    const handleRetrieveInfo = async (e) => {
        try {
            e.preventDefault();
            if (name.length <= 0 || email.length <= 0 || phone.length <= 0) {
                throw Error("Please input all field!!");
            }
            setLoading(true);
            const response = await dp(retrieveInfo({ name, email, phone }));
            eq("Retrieve information successfully!!", SUCCESS_TOP_CENTER);
            setCode(response.payload.data);
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
    const theme = useTheme();
    return (
        <CustomClass>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <form onSubmit={handleRetrieveInfo}>
                        <label htmlFor="regisName">Name: </label>
                        <TextField
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
                            placeholder="hieucuopbien123@gmail.com"
                            value={email}
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
                            onChange={(e) => phoneChange(e)}
                        />
                        <Box py={1}></Box>
                        <Button
                            variant="contained"
                            style={{ margin: "0 auto", display: "block" }}
                            size="large"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <BeatLoader color={theme.palette.commonText.white} size={8} />
                            ) : (
                                "Retrieve info of VIP member"
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
        </CustomClass>
    );
};

export default LostCard;
