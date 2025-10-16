import React, { useEffect, useState, Fragment } from "react";
import { Box, Paper, Typography, Input, InputAdornment, IconButton, Button, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { styled, useTheme } from "@mui/system";
import { useSnackbar } from "notistack";
import { WARNING_TOP_CENTER } from "src/utils/snackbar-utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrice, pay, resetTicketList, selectTicketSlice } from "src/redux/slices/ticketSlice";
import { BeatLoader } from "react-spinners";
import { FormattedNumber, FormattedRelativeTime } from "react-intl";

const CustomClass = styled(Box)((theme) => ({
    height: "100%",
    ".paper": {
        color: theme.theme.palette.commonText.black,
        backgroundColor: theme.theme.palette.commonText.grayWhite,
        padding: theme.theme.spacing(4, 4, 4, 4),
        height: "100%",
    },
    ".input": {
        color: theme.theme.palette.commonText.black,
    },
    "& div.MuiOutlinedInput-root fieldset, & div.MuiOutlinedInput-root fieldset": {
        borderColor: theme.theme.palette.light.main,
    },
    //dev
    "& label.css-1xrr2oo-MuiFormLabel-root-MuiInputLabel-root, & label.css-od53of-MuiFormLabel-root-MuiInputLabel-root":
        {
            color: theme.theme.palette.light.main,
        },
    //prod
    "& label.css-b0coh3": {
        color: "#24BD9D !important",
    },
    ".isPayed": {
        fontWeight: "bold",
        color: theme.theme.palette.light.main,
    },
    ".inputInvalid": {
        "&:invalid": {
            border: "red solid 2px",
        },
    },
}));

const PayTicket = () => {
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const [loadingPay, setLoadingPay] = useState(false);
    const { enqueueSnackbar: eq } = useSnackbar();
    const ticketList = useSelector((state) => selectTicketSlice(state).data);
    const imgGameData = useSelector((state) => state.gameSlice.data);
    const qrImage = useSelector((state) => state.ticketSlice.qrImage);
    var imgPaidGame = imgGameData
        .filter((ele) => {
            return ele.type == 2;
        })
        .map((ele) => {
            return {
                title: ele.name,
                id: ele._id,
            };
        });

    useEffect(() => {
        if (ticketList.length > 0) {
            const stopTimeout = setTimeout(() => {
                dp(resetTicketList());
            }, 120000);
            return () => {
                {
                    clearTimeout(stopTimeout);
                }
            };
        }
    }, [ticketList]);

    const patternInput = /^[\d ]*$/im;
    const handleChangeId = (e) => {
        var data = patternInput.test(e.target.value);
        if (data) {
            setMin("");
            setMax("");
            setId(e.target.value);
        }
    };
    const patternRange = /^[\d]*$/im;
    const handleChangeRange = (e) => {
        if (patternRange.test(e.target.value)) {
            setId("");
            e.target.name == "min" ? setMin(e.target.value) : setMax(e.target.value);
        }
    };
    const dp = useDispatch();
    const handleFetchPrice = async () => {
        const idList = id
            .trim()
            .split(" ")
            .map((id) => parseInt(id))
            .filter((ele) => ele);
        const minVal = parseInt(min);
        const maxVal = parseInt(max);
        if (idList.length == 0 && (isNaN(minVal) || isNaN(maxVal))) {
            eq("You must input id list to get price!!!", WARNING_TOP_CENTER);
            return;
        }
        if (idList.length == 0 && minVal > maxVal) {
            eq("Min value must be smaller than max value!!!", WARNING_TOP_CENTER);
            return;
        }
        if (idList.length == 0 && (isNaN(minVal) || isNaN(maxVal) || maxVal - minVal > 50)) {
            eq("Fetching max 50 ticket per time!!", WARNING_TOP_CENTER);
            return;
        }
        setLoading(true);
        var idArr = [];
        if (idList.length > 0) {
            idArr = idArr.concat(idList);
        } else {
            for (var i = minVal; i <= maxVal; i++) {
                idArr.push(i);
            }
        }
        await dp(fetchPrice({ idList: idArr, eq }));
        setLoading(false);
    };

    const handleTime = (timeIn) => {
        var now = new Date();
        return (timeIn - now) / 1000;
    };
    const totalPrice = () => {
        return ticketList.reduce((partialSum, a) => (!a.isPayed ? partialSum + a.cost : partialSum), 0);
    };
    const handlePay = async () => {
        setLoadingPay(true);
        const idListCheck = ticketList.map((ticket) => ticket.ticketId);
        await dp(pay({ listId: idListCheck, eq }));
        setMin("");
        setMax("");
        setId("");
        setLoadingPay(false);
    };
    const clearList = () => {
        dp(resetTicketList());
        setMin("");
        setMax("");
        setId("");
    };
    const theme = useTheme();
    return (
        <CustomClass>
            <Paper className="paper">
                <Box display="flex" justifyContent="start" flexDirection="column" height="100%">
                    <Box>
                        <Box display="flex" style={{ width: "100%" }} alignItems="center">
                            <Typography mr={1}>ID: </Typography>
                            <Input
                                className="input"
                                name="id"
                                value={id}
                                type="text"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setId("")}>
                                            <ClearIcon ml={1} color="primary" />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{ className: "inputInvalid", pattern: "[0-9 ]+" }}
                                fullWidth
                                onChange={(e) => handleChangeId(e)}
                            />
                        </Box>
                        <Box py={1}></Box>
                        <Box display="flex" style={{ width: "100%" }} alignItems="center">
                            <TextField
                                label="From"
                                variant="outlined"
                                fullWidth
                                name="min"
                                value={min}
                                inputProps={{ className: "input inputInvalid" }}
                                onChange={(e) => handleChangeRange(e)}
                            />
                            <Box px={1}></Box>
                            <TextField
                                label="To"
                                variant="outlined"
                                fullWidth
                                name="max"
                                value={max}
                                inputProps={{ className: "input" }}
                                onChange={(e) => handleChangeRange(e)}
                            />
                        </Box>
                        <Box py={2}></Box>
                        <Box textAlign="center">
                            <Button variant="contained" onClick={handleFetchPrice} disabled={loading}>
                                {loading ? <BeatLoader color={theme.palette.commonText.white} size={8} /> : "Get Price"}
                            </Button>
                            <Box py={1}></Box>
                        </Box>
                    </Box>
                    <Box style={{ textAlign: "center" }}>
                        <img src={qrImage} />
                    </Box>
                    {ticketList.length > 0 ? (
                        <Fragment>
                            <hr />
                            <Box py={1}></Box>
                            <Box>
                                <Button variant="contained" onClick={handlePay} disabled={loadingPay}>
                                    {loadingPay ? <BeatLoader color="#fff" size={8} /> : "Pay"}
                                </Button>
                                &nbsp;
                                <Button variant="contained" onClick={() => clearList()}>
                                    Clear
                                </Button>
                            </Box>
                            <Box py={1}></Box>
                            <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                                Total Price:
                                <Typography>
                                    &nbsp;{<FormattedNumber value={parseInt(totalPrice())} />}&nbsp;VNĐ
                                </Typography>
                            </Box>
                        </Fragment>
                    ) : null}
                    {ticketList.map((ticket, index) => {
                        const title = imgPaidGame.find((o) => o.id === ticket.gameId);
                        return (
                            <Fragment key={index}>
                                <Box py={1}></Box>
                                <hr />
                                <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                                    <Typography className={ticket.isPayed ? "isPayed" : ""}>ID: </Typography>
                                    <Typography className={ticket.isPayed ? "isPayed" : ""}>
                                        &nbsp;{ticket.ticketId}&nbsp;{ticket.isPayed ? " This ticket is payed" : null}
                                    </Typography>
                                </Box>
                                <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                                    Type:&nbsp;
                                    <Typography>
                                        {ticket.type == 1 && "Day ticket"}
                                        {ticket.type == 2 && "Turn ticket"}
                                        {ticket.type == 3 && "Paid Game"}
                                    </Typography>
                                </Box>
                                <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                                    Status: Ticket booked{" "}
                                    <Typography>
                                        &nbsp;
                                        {
                                            <FormattedRelativeTime
                                                value={handleTime(new Date(ticket.timeIn))}
                                                numeric="auto"
                                                updateIntervalInSeconds={1}
                                            />
                                        }
                                        &nbsp;
                                    </Typography>
                                </Box>
                                <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                                    Discount:
                                    <Typography>&nbsp;{ticket.discount}&nbsp;%&nbsp;</Typography>
                                </Box>
                                <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                                    Price:
                                    <Typography>
                                        &nbsp;{<FormattedNumber value={parseInt(ticket.cost)} />}&nbsp;VNĐ&nbsp;
                                    </Typography>
                                </Box>
                            </Fragment>
                        );
                    })}
                </Box>
            </Paper>
        </CustomClass>
    );
};

export default PayTicket;
