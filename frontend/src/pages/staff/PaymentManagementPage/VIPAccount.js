import {
    Box,
    Paper,
    TextField,
    Button,
    Grid,
    Typography,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Slide,
} from "@mui/material";
import React, { useEffect, useState, Fragment } from "react";
import { alpha, styled, useTheme } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import VIPImg from "src/pages/staff/VIPManagement/assets/vip.png";
import { useSnackbar } from "notistack";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER, WARNING_TOP_CENTER } from "src/utils/snackbar-utils";
import { Close } from "@mui/icons-material";
import ScanDialog from "../VIPManagement/VIPHandler/ScanDialog";
import { fetchDataAuto, sellTicketVIP } from "src/redux/slices/vipSlice";
import { BeatLoader } from "react-spinners";

const CustomClass = styled(Box)((theme) => ({
    height: "100%",
    ".paper": {
        backgroundColor: theme.theme.palette.commonText.grayWhite,
        padding: "20px",
        borderRadius: "10px",
    },
    ".input": {
        color: theme.theme.palette.commonText.white,
    },
    ".code": {
        textAlign: "center",
        color: alpha(theme.theme.palette.commonText.black, 0.7),
        border: "1px solid black",
        borderRadius: "20px",
        padding: "5px",
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

const VIPAccount = () => {
    const [listVoucher, setListVoucher] = useState([]);
    const [code, setCode] = useState("CODE");
    const [voucher, setVoucher] = useState("");
    const [fiveChar, setFiveChar] = useState("");
    const { enqueueSnackbar: eq } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [point, setPoint] = useState(0);
    const [dueDate, setDueDate] = useState("");
    const [idList, setIdList] = useState([]);
    const dp = useDispatch();

    const [eventCode, setEventCode] = useState("");
    const [numberOfTicket, setNumberOfTicket] = useState(1);
    const [typeTicket, setTypeTicket] = useState(true);

    const changeType = (e) => {
        if (e.target.id == "turntickVIP") setTypeTicket(e.target.checked);
        else setTypeTicket(!e.target.checked);
    };

    const changeFiveChar = (e) => {
        if (e.target.value.length < 5) {
            setFiveChar(e.target.value);
        } else if (e.target.value.length == 5) {
            setFiveChar(e.target.value);
            setCode(e.target.value);
            // eq("Set code successfully", SUCCESS_TOP_CENTER);
        }
    };

    const [isOpen, setOpenDialog] = useState(false);
    const openDialog = () => {
        setOpenDialog(true);
    };
    const closeDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        if (code != "CODE") {
            handleFetchDataAuto();
        }
    }, [code]);

    const handleFetchDataAuto = async () => {
        try {
            const response = await dp(fetchDataAuto({ code }));
            setPoint(response.payload.point);
            setDueDate(response.payload.dueDate);
            setListVoucher(response.payload.voucherList);
        } catch (err) {
            console.log(err);
            eq("VIP error", ERR_TOP_CENTER);
            setPoint(0);
            setDueDate("");
            setCode("CODE");
            setFiveChar("");
            setListVoucher([]);
        }
    };

    const patternRange = /^[\d]*$/im;
    const handleChangeTickNum = (e) => {
        if (patternRange.test(e.target.value)) {
            if (e.target.value > 50) {
                eq("Number of ticket max is 50 only!!!", WARNING_TOP_CENTER);
                setNumberOfTicket("");
                return;
            }
            setNumberOfTicket(e.target.value);
        }
    };

    const reset = () => {
        setEventCode("");
        setNumberOfTicket(1);
        setTypeTicket(true);
        setPoint(0);
        setDueDate("");
        setCode("CODE");
        setFiveChar("");
        setListVoucher([]);
        setVoucher("");
    };

    const handleSellTicketVIP = async (e) => {
        try {
            e.preventDefault();
            if (numberOfTicket <= 0 || code == " CODE") {
                throw Error("Please input all field!!");
            }
            setLoading(true);
            const response = await dp(
                sellTicketVIP({ code, eventCode, numberOfTicket, typeTicket, voucher: voucher.trim() })
            );
            eq("Sell ticket successfully", SUCCESS_TOP_CENTER);
            setIdList(response.payload.idList);
            reset();
        } catch (err) {
            console.log(err);
            eq(err.message, ERR_TOP_CENTER);
            setCode("CODE");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idList.length > 0) {
            const stopTimeout = setTimeout(() => {
                setIdList([]);
            }, 120000);
            return () => {
                {
                    clearTimeout(stopTimeout);
                }
            };
        }
    }, [idList]);
    const theme = useTheme();
    return (
        <CustomClass>
            <Paper className="paper">
                <Grid container spacing={5}>
                    <Grid item xs={12} md={6}>
                        <Box style={{ textAlign: "center" }}>
                            <img width="40%" src={VIPImg} style={{ display: "block", margin: "0 auto" }} />
                        </Box>
                        <Box style={{ display: "flex", justifyContent: "space-around" }}>
                            <TextField
                                label="Use 5 character"
                                style={{ width: "40%" }}
                                size="small"
                                value={fiveChar}
                                onChange={changeFiveChar}
                            />
                            <Button variant="contained" style={{ width: "40%" }} onClick={openDialog}>
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
                                    <DialogContent className="background" style={{ padding: "20px" }} minheight={360}>
                                        {isOpen && (
                                            <ScanDialog
                                                setCode={setCode}
                                                closeDialog={closeDialog}
                                                setFiveChar={setFiveChar}
                                            />
                                        )}
                                    </DialogContent>
                                </CustomClass>
                            </Dialog>
                        </Box>
                        <Box py={1} />
                        <Box className="code"> {code.substring(0, 5)} </Box>
                        <Box py={1} />
                        <Typography style={{ fontSize: "larger" }}>
                            Point:&nbsp;{parseInt(point)}&nbsp;-&nbsp;Due Date: {dueDate.toLocaleString()}
                        </Typography>
                        <Typography style={{ fontSize: "larger" }}></Typography>
                        {listVoucher.length > 0 && (
                            <Typography>You have&nbsp;{listVoucher.length}&nbsp;voucher:</Typography>
                        )}
                        {listVoucher.map((ele, index) => (
                            <Fragment key={index}>
                                <Typography>
                                    Code:&nbsp;{ele.voucherCode}&nbsp;-&nbsp;{ele.discount}%
                                </Typography>
                            </Fragment>
                        ))}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <form onSubmit={handleSellTicketVIP}>
                            <TextField
                                label="Event discount number"
                                size="small"
                                fullWidth
                                value={eventCode}
                                onChange={(e) => setEventCode(e.target.value)}
                            />
                            <Box py={1}></Box>
                            <TextField
                                label="VIP Voucher Code"
                                size="small"
                                fullWidth
                                value={voucher}
                                onChange={(e) => setVoucher(e.target.value)}
                            />
                            <Box py={1}></Box>
                            <TextField
                                label="Number of ticket"
                                size="small"
                                required
                                fullWidth
                                value={numberOfTicket}
                                onChange={handleChangeTickNum}
                            />
                            <label htmlFor="dayticketVIP">Day Ticket</label>
                            <Checkbox id="dayticketVIP" checked={!typeTicket} onChange={(e) => changeType(e)} />
                            <label htmlFor="turntickVIP">Turn Ticket</label>
                            <Checkbox id="turntickVIP" checked={typeTicket} onChange={(e) => changeType(e)} />
                            <Box py={1}></Box>
                            <Box textAlign="center">
                                <Button variant="contained" disabled={loading} type="submit">
                                    {loading ? (
                                        <BeatLoader color={theme.palette.commonText.white} size={8} />
                                    ) : (
                                        "Sell ticket"
                                    )}
                                </Button>
                            </Box>
                        </form>
                        <Box py={1}></Box>
                        {idList.length != 0 ? (
                            <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                                ID List:{" "}
                                {idList.map((id) => (
                                    <Typography key={id}>&nbsp;{id}&nbsp;</Typography>
                                ))}
                            </Box>
                        ) : null}
                    </Grid>
                </Grid>
            </Paper>
        </CustomClass>
    );
};

export default VIPAccount;
