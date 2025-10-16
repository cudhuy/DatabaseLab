import React, { useState } from "react";
import { Paper, Box, Grid, Typography, TextField, Button } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { FormattedNumber } from "react-intl";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { buyPaidGameTicket } from "src/redux/slices/ticketSlice";
import { SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";

const CustomClass = styled(Box)((theme) => ({
    ".paperGameItem": {
        padding: "20px",
        backgroundColor: theme.theme.palette.commonText.grayWhite,
    },
    ".titleGameItem": {
        textAlign: "center",
        fontSize: "larger",
        fontWeight: "bold",
    },
    ".gamePriceText": {
        textAlign: "center",
        fontSize: "larger",
    },
}));

const GameItem = ({ data }) => {
    const [numberOfTicket, setNumberOfTicket] = useState(1);
    const [loading, setLoading] = useState(false);
    const dp = useDispatch();
    const { enqueueSnackbar: eq } = useSnackbar();
    const handleBuyTicket = async () => {
        setLoading(true);
        await dp(buyPaidGameTicket({ id: data.id, numberOfTicket, eq, setNumberOfTicket }));
        setLoading(false);
    };
    const theme = useTheme();
    return (
        <CustomClass>
            <Paper className="paperGameItem">
                <Grid container spacing={3}>
                    <Grid item xs={6} md={5}>
                        <img width="100%" src={data.url} />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Typography className="titleGameItem">{data.title}</Typography>
                        <Typography className="gamePriceText">
                            {data.price != 0 ? (
                                <Typography>{<FormattedNumber value={parseInt(data.price)} />}&nbsp;VNĐ</Typography>
                            ) : (
                                "Free"
                            )}
                        </Typography>
                        <Box py={1}></Box>
                        <TextField
                            fullWidth
                            variant="standard"
                            label="Number Of Ticket"
                            type="number"
                            value={numberOfTicket}
                            onChange={(e) => setNumberOfTicket(e.target.value)}
                        />
                        <Box py={1}></Box>
                        <Typography>
                            Price:&nbsp;
                            {data.price != 0 ? (
                                <span>
                                    {<FormattedNumber value={parseInt(data.price * numberOfTicket)} />}&nbsp;VNĐ
                                </span>
                            ) : (
                                "Free"
                            )}
                        </Typography>
                        <Box py={1}></Box>
                        <Button fullWidth onClick={handleBuyTicket} variant="contained" disabled={loading}>
                            {loading ? (
                                <BeatLoader color={theme.palette.commonText.white} size={8} />
                            ) : (
                                `Buy ${numberOfTicket} tickets`
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </CustomClass>
    );
};

export default GameItem;
