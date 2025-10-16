import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Input, InputAdornment, IconButton, Checkbox, Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { styled, useTheme } from "@mui/system";
import { sellTicket } from "src/redux/slices/ticketSlice";
import { useDispatch } from "react-redux";
import { SUCCESS_TOP_CENTER, ERR_TOP_CENTER, WARNING_TOP_CENTER } from "src/utils/snackbar-utils";
import { useSnackbar } from "notistack";
import { BeatLoader } from "react-spinners";

const CustomClass = styled(Box)((theme) => ({
    height: "100%",
    ".paper": {
        color: theme.theme.palette.commonText.black,
        background: theme.theme.palette.commonText.grayWhite,
        padding: theme.theme.spacing(4, 4, 4, 4),
        height: "100%",
    },
    ".input": {
        color: theme.theme.palette.commonText.black,
    },
}));

const SellTicket = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [tickNum, setTickNum] = useState("1");
    const [typeTicket, setTypeTicket] = useState(true);
    const [loading, setLoading] = useState(false);
    const [idList, setIdList] = useState([]);
    const dp = useDispatch();
    const { enqueueSnackbar: eq } = useSnackbar();
    const changeType = (e) => {
        if (e.target.name == "turntick") setTypeTicket(e.target.checked);
        else setTypeTicket(!e.target.checked);
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

    const reset = () => {
        setName("");
        setEmail("");
        setTickNum(1);
        setTypeTicket(true);
    };

    const handleSellTicket = async () => {
        const tickNumValue = parseInt(tickNum);
        if (tickNumValue > 0) {
            setLoading(true);
            const bodyRequest = {
                name,
                email,
                typeTicket: typeTicket + 1,
                tickNum: tickNumValue,
                eq,
            };
            const response = await dp(sellTicket(bodyRequest));
            if (response.error) {
                setLoading(false);
                eq(response.error.message, ERR_TOP_CENTER);
            }
            const listId = response.payload.data.result;
            listId.sort(function (a, b) {
                return a - b;
            });
            setIdList(listId);
            eq("Sell ticket successfully", SUCCESS_TOP_CENTER);
            reset();
            setLoading(false);
        } else {
            eq("Please input number of ticket you want to buy > 0", WARNING_TOP_CENTER);
        }
    };

    const patternRange = /^[\d]*$/im;
    const handleChangeTickNum = (e) => {
        if (patternRange.test(e.target.value)) {
            if (e.target.value > 50) {
                eq("Number of ticket max is 50 only!!!", WARNING_TOP_CENTER);
                setTickNum("");
                return;
            }
            setTickNum(e.target.value);
        }
    };
    const theme = useTheme();
    return (
        <CustomClass>
            <Paper className="paper">
                <Box display="flex" justifyContent="start" flexDirection="column" height="100%">
                    <Box display="flex" style={{ width: "100%" }} alignItems="center">
                        <Typography mr={1}>Name: </Typography>
                        <Input
                            className="input"
                            name="name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setName("")}>
                                        <ClearIcon ml={1} color="primary" />
                                    </IconButton>
                                </InputAdornment>
                            }
                            autoComplete="off"
                        />
                    </Box>
                    <Box display="flex" style={{ width: "100%" }} alignItems="center">
                        <Typography mr={1}>Email: </Typography>
                        <Input
                            className="input"
                            name="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setEmail("")}>
                                        <ClearIcon ml={1} color="primary" />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </Box>
                    <Box display="flex" style={{ width: "100%" }} alignItems="center" justifyContent="flex-start">
                        <Typography mr={1} style={{ whiteSpace: "nowrap" }}>
                            Number of tickets:{" "}
                        </Typography>
                        <Input
                            className="input"
                            name="tickNum"
                            type="text"
                            value={tickNum}
                            fullWidth
                            onChange={(e) => handleChangeTickNum(e)}
                        />
                    </Box>
                    <Box display="flex" style={{ width: "100%" }} alignItems="center" justifyContent="flex-start">
                        <Typography value={typeTicket == 0}>Day Ticket</Typography>
                        <Checkbox name="daytick" checked={!typeTicket} onChange={(e) => changeType(e)} />
                        <Typography>Turn Ticket</Typography>
                        <Checkbox checked={typeTicket} name="turntick" onChange={(e) => changeType(e)} />
                    </Box>
                    <Box py={1}></Box>
                    <Box textAlign="center">
                        <Button variant="contained" onClick={handleSellTicket} disabled={loading}>
                            {loading ? <BeatLoader color={theme.palette.commonText.white} size={8} /> : "Sell ticket"}
                        </Button>
                    </Box>
                    <Box py={1}></Box>
                    {idList.length != 0 ? (
                        <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                            ID List:{" "}
                            {idList.map((id) => (
                                <Typography key={id}>&nbsp;{id}&nbsp;</Typography>
                            ))}
                        </Box>
                    ) : null}
                </Box>
            </Paper>
        </CustomClass>
    );
};

export default SellTicket;
