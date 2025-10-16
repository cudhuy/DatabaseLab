import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    Slide,
} from "@mui/material";
import { alpha, styled, useTheme } from "@mui/system";
import VIPImg from "src/pages/staff/VIPManagement/assets/vip.png";
import { FormattedNumber } from "react-intl";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";
import { useSnackbar } from "notistack";
import { Close } from "@mui/icons-material";
import ScanDialog from "src/pages/staff/VIPManagement/VIPHandler/ScanDialog";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { payVIP } from "src/redux/slices/vipSlice";

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
    ".code": {
        textAlign: "center",
        color: alpha(theme.theme.palette.commonText.black, 0.7),
        border: "1px solid black",
        borderRadius: "20px",
        padding: "10px",
    },
    ".background": {
        backgroundColor: theme.theme.palette.background.header.main,
        overflow: "hidden",
    },
    ".closeButton": {
        position: "absolute",
        right: 0,
    },
    ".font": {
        textAlign: "center",
        fontSize: "25px",
        fontWeight: "bold",
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const PayVIP = () => {
    const [code, setCode] = useState("CODE");
    const cost = 400000;
    const [fiveChar, setFiveChar] = useState("");
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar: eq } = useSnackbar();
    const dp = useDispatch();

    const changeFiveChar = (e) => {
        if (e.target.value.length < 5) {
            setFiveChar(e.target.value);
        } else if (e.target.value.length == 5) {
            setFiveChar(e.target.value);
            setCode(e.target.value);
            // eq("Code is OK", SUCCESS_TOP_CENTER);
        }
    };

    const [isOpen, setOpenDialog] = useState(false);
    const openDialog = () => {
        setOpenDialog(true);
    };
    const closeDialog = () => {
        setOpenDialog(false);
    };

    const handlePayVIP = async () => {
        try {
            if (code.length < 5) {
                throw Error("Please input VIP card number!!");
            }
            setLoading(true);
            await dp(payVIP({ code }));
            eq("Pay VIP successfully!!", SUCCESS_TOP_CENTER);
            setCode("CODE");
            setFiveChar("");
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
            <Typography>Cost:&nbsp;{<FormattedNumber value={parseInt(cost)} />}&nbsp;VNĐ</Typography>
            <Box py={1}></Box>
            <TextField
                label="Use 5 digit"
                size="small"
                fullWidth
                value={fiveChar}
                onChange={(e) => changeFiveChar(e)}
            />
            <Box py={1}></Box>
            <Button fullWidth size="large" variant="contained" onClick={openDialog}>
                Use QR Code
            </Button>
            <Dialog open={isOpen} onClose={closeDialog} maxWidth={"lg"} TransitionComponent={Transition} keepMounted>
                <CustomClass>
                    <DialogTitle className="background" style={{ padding: "20px 20px 0px 20px" }}>
                        <Box className="closeButton">
                            <IconButton aria-label="close" onClick={closeDialog}>
                                <Close />
                            </IconButton>
                        </Box>
                        <Typography className="font">Scan QR code</Typography>
                    </DialogTitle>
                    <DialogContent className="background" style={{ padding: "20px" }} minHeight={360}>
                        {isOpen && <ScanDialog setCode={setCode} closeDialog={closeDialog} setFiveChar={setFiveChar} />}
                    </DialogContent>
                </CustomClass>
            </Dialog>
            <Box py={1}></Box>
            <Box className="code"> {code.substring(0, 5)} </Box>
            <Box py={1}></Box>
            <Button
                variant="contained"
                style={{ width: "50%", display: "block", margin: "0 auto" }}
                onClick={handlePayVIP}
                disabled={loading}
            >
                {loading ? <BeatLoader color={theme.palette.commonText.white} size={8} /> : "Pay VIP for 1 year"}
            </Button>
        </CustomClass>
    );
};

export default PayVIP;
