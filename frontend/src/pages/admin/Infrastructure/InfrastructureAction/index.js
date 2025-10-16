import React, { useState } from "react";
import {
    TextField,
    Box,
    Grid,
    FormControlLabel,
    Checkbox,
    MenuItem,
    Typography,
    createTheme,
    ThemeProvider,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSelector, useDispatch } from "react-redux";
import { updateReportConfig } from "src/redux/slices/reportSlice";

const CustomClass = styled(Box)((theme) => ({
    ".test": { backgroundColor: "red" },
}));

const InfrastructureActions = ({ gameType, setGameType }) => {
    const reportConfig = useSelector((state) => state.reportSlice.reportConfig);
    const dp = useDispatch();
    const theme = useTheme();
    const overrideTheme = createTheme({
        palette: {
            background: {
                paper: "#F4EEEE",
            },
            primary: { main: "#099D7E" },
        },
    });

    const handleSearchTitle = (e) => {
        const searchData = e.target.value;
        dp(updateReportConfig({ search: searchData }));
    };
    const handleChangeCheckbox = (e, value) => {
        const tempData = reportConfig.listStatus.includes(value)
            ? reportConfig.listStatus.filter((item) => item != value)
            : [...reportConfig.listStatus, value];
        dp(updateReportConfig({ listStatus: tempData }));
    };

    // const [gameType, setGameType] = useState(0);
    // const [state, setState] = useState([]);

    const handleChangeStartDate = (e) => {
        if (e) dp(updateReportConfig({ start: new Date(e) }));
        else dp(updateReportConfig({ start: null }));
    };
    const handleChangeEndDate = (e) => {
        if (e) dp(updateReportConfig({ end: new Date(e) }));
        else dp(updateReportConfig({ end: null }));
    };

    return (
        <CustomClass>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <TextField
                        size="small"
                        label="Search by title"
                        variant="outlined"
                        fullWidth
                        value={reportConfig.search}
                        onChange={(e) => handleSearchTitle(e)}
                        style={{ marginTop: "10px" }}
                    ></TextField>
                </Grid>
                <Grid item>
                    <ThemeProvider theme={overrideTheme}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={
                                    <Typography style={{ color: theme.palette.primary.main }}>Start Time</Typography>
                                }
                                value={reportConfig.start}
                                onChange={(e) => handleChangeStartDate(e)}
                                format="DD-MM-YYYY"
                                renderInput={(params) => (
                                    <TextField
                                        sx={{
                                            svg: { color: theme.palette.primary.main },
                                        }}
                                        style={{ marginTop: "10px" }}
                                        size="small"
                                        {...params}
                                    />
                                )}
                                // PaperProps={{
                                //     style: {
                                //         backgroundColor: "#F4EEEE",
                                //     },
                                // }}
                            />
                            <span>&nbsp;&nbsp;</span>
                            <DatePicker
                                label={<Typography style={{ color: theme.palette.primary.main }}>End Time</Typography>}
                                value={reportConfig.end}
                                onChange={(e) => handleChangeEndDate(e)}
                                format="DD-MM-YYYY"
                                renderInput={(params) => (
                                    <TextField
                                        sx={{
                                            svg: { color: theme.palette.primary.main },
                                        }}
                                        style={{ marginTop: "10px" }}
                                        size="small"
                                        {...params}
                                    />
                                )}
                                // PaperProps={{
                                //     style: {
                                //         backgroundColor: "#F4EEEE",
                                //     },
                                // }}
                            />
                        </LocalizationProvider>
                    </ThemeProvider>
                </Grid>
                <Grid item>
                    <TextField
                        id="type"
                        label={<Typography style={{ color: theme.palette.primary.main }}>Type</Typography>}
                        value={gameType}
                        onChange={(e) => setGameType(e.target.value)}
                        size="small"
                        style={{ marginTop: "10px", minWidth: "150px" }}
                        select
                        className="check1"
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        backgroundColor: theme.palette.commonText.grayWhite,
                                        color: theme.palette.commonText.black,
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem value={0}>All Type&nbsp;</MenuItem>
                        <MenuItem value={1}>Common Game&nbsp;</MenuItem>
                        <MenuItem value={2}>Paid Game&nbsp;</MenuItem>
                    </TextField>
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={reportConfig.listStatus.includes(0)}
                                onChange={(e) => handleChangeCheckbox(e, 0)}
                            />
                        }
                        label="Reporting"
                    />
                    <span>&nbsp;&nbsp;</span>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={reportConfig.listStatus.includes(1)}
                                onChange={(e) => handleChangeCheckbox(e, 1)}
                            />
                        }
                        label="Fixing"
                    />
                    <span>&nbsp;&nbsp;</span>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={reportConfig.listStatus.includes(2)}
                                onChange={(e) => handleChangeCheckbox(e, 2)}
                            />
                        }
                        label="Fixed"
                    />
                </Grid>
            </Grid>
        </CustomClass>
    );
};

export default InfrastructureActions;
