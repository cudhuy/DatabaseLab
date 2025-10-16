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
    DialogContent,
    Slide,
    IconButton,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/system";
import { Close } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";
import ScanDialog from "./ScanDialog";
import { useDispatch } from "react-redux";
import { updateVIPInfo } from "src/redux/slices/vipSlice";
import { BeatLoader } from "react-spinners";

const CustomClass = styled(Box)((theme) => ({
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
    ".input": {
        "&:invalid": {
            border: "red solid 2px",
        },
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const UpdateInfo = () => {
    const [code, setCode] = useState("CODE");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [fiveChar, setFiveChar] = useState("");
    const { enqueueSnackbar: eq } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const dp = useDispatch();

    const changeFiveChar = (e) => {
        if (e.target.value.length < 5) {
            setFiveChar(e.target.value);
        } else if (e.target.value.length == 5) {
            setFiveChar(e.target.value);
            setCode(e.target.value);
        }
    };

    const [isOpen, setOpenDialog] = useState(false);
    const openDialog = () => {
        setOpenDialog(true);
    };
    const closeDialog = () => {
        setOpenDialog(false);
    };

    const updateInfoVIP = async (e) => {
        try {
            e.preventDefault();
            if (name.length <= 0 || email.length <= 0 || phone.length <= 0 || code.length <= 0) {
                throw Error("Please input all field!!");
            }
            setLoading(true);
            await dp(updateVIPInfo({ name, email, phone, code }));
            eq("Update Information successfully!!", SUCCESS_TOP_CENTER);
            setCode("CODE");
            setName("");
            setEmail("");
            setPhone("");
            setFiveChar("");
        } catch (err) {
            console.log(err);
            eq(err.message, ERR_TOP_CENTER);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeData = (e) => {
        if (e.target.name.toString() == "name") {
            setName(e.target.value);
        } else if (e.target.name.toString() == "email") {
            setEmail(e.target.value);
        } else if (e.target.name.toString() == "phone") {
            setPhone(e.target.value);
        }
    };
    const theme = useTheme();
    return (
        <CustomClass>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Use 5 character"
                        size="small"
                        value={fiveChar}
                        fullWidth
                        onChange={changeFiveChar}
                    />
                    <Box py={1}></Box>
                    <Button fullWidth size="large" variant="contained" onClick={openDialog}>
                        Use QR Code
                    </Button>
                    <Dialog
                        open={isOpen}
                        onClose={closeDialog}
                        maxWidth={"lg"}
                        TransitionComponent={Transition}
                        keepMounted
                    >
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
                                {isOpen && (
                                    <ScanDialog setCode={setCode} closeDialog={closeDialog} setFiveChar={setFiveChar} />
                                )}
                            </DialogContent>
                        </CustomClass>
                    </Dialog>
                    <Box py={1}></Box>
                    <Box className="code"> {code.substring(0, 5)} </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <form onSubmit={updateInfoVIP}>
                        <TextField
                            id="regisName"
                            fullWidth
                            size="small"
                            type="text"
                            name="name"
                            label="Name"
                            value={name}
                            onChange={(e) => handleChangeData(e)}
                            inputProps={{ className: "input", pattern: "[A-Za-z\\s]{1,100}" }}
                        />
                        <Box py={0.5}></Box>
                        <TextField
                            id="regisMail"
                            fullWidth
                            size="small"
                            type="email"
                            name="email"
                            label="Email"
                            value={email}
                            onChange={(e) => handleChangeData(e)}
                        />
                        <Box py={0.5}></Box>
                        <TextField
                            id="regisPhone"
                            fullWidth
                            type="text"
                            size="small"
                            name="phone"
                            label="Phone Number"
                            value={phone}
                            onChange={(e) => handleChangeData(e)}
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
                                "Update new information VIP member"
                            )}
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </CustomClass>
    );
};

export default UpdateInfo;
