import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Input, InputAdornment, IconButton, Checkbox, Button, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { styled, useTheme } from "@mui/system";
import { sellTicket, sellTicketDiscount } from "src/redux/slices/ticketSlice";
import { useDispatch } from "react-redux";
import { SUCCESS_TOP_CENTER, ERR_TOP_CENTER, WARNING_TOP_CENTER } from "src/utils/snackbar-utils";
import { useSnackbar } from "notistack";
import { BeatLoader } from "react-spinners";

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
}));

const NormTextField = styled(TextField)((theme) => ({
    "& .MuiFormLabel-colorPrimary": {
        color: theme.theme.palette.primary.main,
    },
    "& fieldset": {
        borderColor: theme.theme.palette.primary.main,
        borderWidth: 1,
    },
}));

const DiscountReserve = () => {
    const [typeTicket, setTypeTicket] = useState(true);
    const [loading, setLoading] = useState(false);
    const [idList, setIdList] = useState([]);
    const dp = useDispatch();
    const { enqueueSnackbar: eq } = useSnackbar();
    const changeType = (e) => {
        if (e.target.name == "turntick") setTypeTicket(e.target.checked);
        else setTypeTicket(!e.target.checked);
    };

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    useEffect(() => {
        if (idList.length > 0) {
            const stopTimeout = setTimeout(() => {
                setIdList([]);
                setName("");
                setEmail("");
            }, 120000);
            return () => {
                {
                    clearTimeout(stopTimeout);
                }
            };
        }
    }, [idList, name, email]);

    const reset = () => {
        setTickNum("1");
        setTypeTicket(true);
        setDiscountNumber("");
    };

    const handleSellTicketDiscount = async (e) => {
        e.preventDefault();
        const tickNumValue = parseInt(tickNum);
        if (tickNumValue > 0) {
            setLoading(true);
            const bodyRequest = {
                typeTicket: typeTicket + 1,
                tickNum: tickNumValue,
                discountId: discountNumber,
                setIdList,
                setName,
                setEmail,
                reset,
                eq,
            };
            await dp(sellTicketDiscount(bodyRequest));
            setLoading(false);
        } else {
            eq("Please input number of ticket you want to buy > 0", WARNING_TOP_CENTER);
        }
    };

    const [discountNumber, setDiscountNumber] = useState("");
    const patternRange = /^[\d]*$/im;
    const changeDiscountNum = (e) => {
        setDiscountNumber(e.target.value);
    };
    const [tickNum, setTickNum] = useState("1");
    const changeTicketNumber = (e) => {
        if (patternRange.test(e.target.value)) {
            setTickNum(e.target.value);
        }
    };
    const theme = useTheme();

    return (
        <CustomClass>
            <Paper className="paper">
                <Box display="flex" justifyContent="start" flexDirection="column" height="100%">
                    <form onSubmit={handleSellTicketDiscount}>
                        <NormTextField
                            label="Discount ID"
                            required
                            variant="outlined"
                            fullWidth
                            inputProps={{ className: "input" }}
                            onChange={changeDiscountNum}
                            value={discountNumber}
                            size="small"
                        />
                        <Box py={1}></Box>
                        <NormTextField
                            label="Number Of Ticket"
                            required
                            variant="outlined"
                            fullWidth
                            inputProps={{ className: "input" }}
                            onChange={changeTicketNumber}
                            value={tickNum}
                            size="small"
                        />
                        <Box py={1}></Box>
                        <Box display="flex" style={{ width: "100%" }} alignItems="center" justifyContent="flex-start">
                            <Typography value={typeTicket == 0}>Day Ticket</Typography>
                            <Checkbox name="daytick" checked={!typeTicket} onChange={(e) => changeType(e)} />
                            <Typography>Turn Ticket</Typography>
                            <Checkbox checked={typeTicket} name="turntick" onChange={(e) => changeType(e)} />
                        </Box>
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
                </Box>
                <Box py={1}></Box>
                {email != "" ? (
                    <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                        Email: <Typography>&nbsp;{email}&nbsp;</Typography>
                    </Box>
                ) : null}
                {name != "" ? (
                    <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                        Name: <Typography>&nbsp;{name}&nbsp;</Typography>
                        <Box py={1}></Box>
                    </Box>
                ) : null}
                {idList.length > 0 ? (
                    <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                        ID Ticket Discount:{" "}
                        {idList.map((id, index) => {
                            if (index < 5) return <Typography key={id}>&nbsp;{id}&nbsp;</Typography>;
                        })}
                    </Box>
                ) : null}
                {idList.length > 5 ? (
                    <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                        ID Ticket Discount:{" "}
                        {idList.map((id, index) => {
                            if (index > 4) return <Typography key={id}>&nbsp;{id}&nbsp;</Typography>;
                        })}
                    </Box>
                ) : null}
            </Paper>
        </CustomClass>
    );
};

export default DiscountReserve;
