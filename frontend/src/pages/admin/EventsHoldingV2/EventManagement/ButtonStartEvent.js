import React, { useState, Fragment } from "react";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    TextField,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import { BeatLoader } from "react-spinners";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch } from "react-redux";
import { startEvent } from "src/redux/slices/eventSliceV2";
import { useSnackbar } from "notistack";

const ButtonStartEvent = ({ event }) => {
    const [loading, setLoading] = useState(false);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const theme = useTheme();
    const dp = useDispatch();
    const { enqueueSnackbar: eq } = useSnackbar();
    const isHidden = useMediaQuery(theme.breakpoints.up(900));
    const openDialog = () => {
        setDialogIsOpen(true);
    };
    const closeDialog = () => {
        setDialogIsOpen(false);
    };
    const [startBookingTime, setStartBookingTime] = useState(new Date());
    const handleChangeStartDate = (e) => {
        setStartBookingTime(new Date(e));
    };
    const [endBookingTime, setEndBookingTime] = useState(new Date());
    const handleChangeEndDate = (e) => {
        setEndBookingTime(new Date(e));
    };
    const [endEventTime, setEndEventTime] = useState(new Date());
    const handleChangeEndEventDate = (e) => {
        setEndEventTime(new Date(e));
    };
    const [startEventTime, setStartEventTime] = useState(new Date());
    const handleChangeStartEventDate = (e) => {
        setStartEventTime(new Date(e));
    };
    const finishStartEvent = () => {
        closeDialog();
    };
    const handleStartEvent = async (e) => {
        console.log(e);
        setLoading(true);
        e.preventDefault();
        await dp(
            startEvent({
                eq,
                startBookingTime,
                endBookingTime,
                startTime: startEventTime,
                endTime: endEventTime,
                id: event.id,
                finishStartEvent,
            })
        );
        setLoading(false);
    };
    const overrideTheme = createTheme({
        palette: {
            background: {
                paper: theme.palette.commonText.grayWhite,
            },
            primary: { main: "#099D7E" },
        },
    });
    return (
        <Fragment>
            <Button variant="contained" onClick={openDialog} disabled={loading || event?.startTime}>
                {loading ? <BeatLoader color={theme.palette.commonText.white} size={8} /> : "Start Event"}
            </Button>
            <Dialog
                open={dialogIsOpen}
                onClose={closeDialog}
                maxWidth="xl"
                PaperProps={{
                    style: {
                        backgroundColor: theme.palette.commonText.grayWhite,
                    },
                }}
            >
                <DialogTitle>
                    <Typography style={{ textAlign: "center", fontWeight: "bold", fontSize: "larger" }}>
                        Start event&nbsp;{event?.title}
                    </Typography>
                </DialogTitle>
                <DialogContent style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={5}>
                            <img width="100%" style={{ borderRadius: "15px" }} src={event?.image} />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <form
                                onSubmit={handleStartEvent}
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-around",
                                }}
                            >
                                <ThemeProvider theme={overrideTheme}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <DateTimePicker
                                                    label={
                                                        <Typography style={{ color: theme.palette.primary.main }}>
                                                            Start Booking Time
                                                        </Typography>
                                                    }
                                                    value={startBookingTime}
                                                    onChange={(e) => handleChangeStartDate(e)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            fullWidth
                                                            sx={{
                                                                svg: { color: theme.palette.primary.main },
                                                            }}
                                                            style={{ marginTop: "10px" }}
                                                            {...params}
                                                        />
                                                    )}
                                                />
                                                <span>&nbsp;&nbsp;</span>
                                                <DateTimePicker
                                                    label={
                                                        <Typography style={{ color: theme.palette.primary.main }}>
                                                            Start Event Time
                                                        </Typography>
                                                    }
                                                    value={startEventTime}
                                                    onChange={(e) => handleChangeStartEventDate(e)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            fullWidth
                                                            sx={{
                                                                svg: { color: theme.palette.primary.main },
                                                            }}
                                                            style={{ marginTop: "10px" }}
                                                            {...params}
                                                        />
                                                    )}
                                                    PaperProps={
                                                        isHidden == true && {
                                                            style: {
                                                                position: "relative",
                                                                top: -100,
                                                            },
                                                        }
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DateTimePicker
                                                    label={
                                                        <Typography style={{ color: theme.palette.primary.main }}>
                                                            End Booking Time
                                                        </Typography>
                                                    }
                                                    value={endBookingTime}
                                                    onChange={(e) => handleChangeEndDate(e)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            fullWidth
                                                            sx={{
                                                                svg: { color: theme.palette.primary.main },
                                                            }}
                                                            style={{ marginTop: "10px" }}
                                                            {...params}
                                                        />
                                                    )}
                                                />
                                                <span>&nbsp;&nbsp;</span>
                                                <DateTimePicker
                                                    label={
                                                        <Typography style={{ color: theme.palette.primary.main }}>
                                                            End Event Time
                                                        </Typography>
                                                    }
                                                    value={endEventTime}
                                                    onChange={(e) => handleChangeEndEventDate(e)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            fullWidth
                                                            sx={{
                                                                svg: { color: theme.palette.primary.main },
                                                            }}
                                                            style={{ marginTop: "10px" }}
                                                            {...params}
                                                        />
                                                    )}
                                                    PaperProps={
                                                        isHidden == true && {
                                                            style: {
                                                                position: "relative",
                                                                top: -100,
                                                            },
                                                        }
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </LocalizationProvider>
                                </ThemeProvider>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={loading}
                                    style={{ marginTop: "10px" }}
                                >
                                    {loading ? (
                                        <BeatLoader color={theme.palette.commonText.white} size={8} />
                                    ) : (
                                        "Confirm start event"
                                    )}
                                </Button>
                            </form>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default ButtonStartEvent;
