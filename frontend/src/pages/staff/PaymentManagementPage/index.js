import {
    Box,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    Input,
    InputLabel,
    Paper,
    Typography,
    InputAdornment,
    TextField,
    Checkbox,
    Button,
    Tab,
    Tabs,
    AppBar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SwipeableViews from "react-swipeable-views";
import React, { useState } from "react";
import WrapperStaff from "src/pages/staff/WrapperStaff";
import { styled } from "@mui/system";
import SellTicket from "./SellTicket";
import PayTicket from "./PayTicket";
import Helmet from "react-helmet";
import DiscountReserve from "./DiscountReserve";
import VIPAccount from "./VIPAccount";
import PaidGame from "./PaidGame";

const CustomClass = styled(Box)((theme) => ({
    ".header": {
        backgroundColor: theme.theme.palette.primary.main,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "larger",
        color: theme.theme.palette.commonText.white,
        padding: "10px",
        borderTopRightRadius: "10px",
        borderTopLeftRadius: "10px",
    },
    ".wrapper": {
        marginBottom: "20px",
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const PaymentManagementPage = () => {
    const theme = useTheme();
    const [value, setValue] = useState(0);
    return (
        <WrapperStaff>
            <Box>
                <Helmet>
                    <title>Tinkerbell Garden - Payment</title>
                </Helmet>
            </Box>
            <CustomClass>
                <Box className="header">Entrance Ticket To Tinkerbell Garden</Box>
                <AppBar
                    position="static"
                    color="primary"
                    sx={{
                        boxShadow: "none",
                        borderBottomRightRadius: "10px",
                        borderBottomLeftRadius: "10px",
                    }}
                >
                    <Tabs
                        value={value}
                        onChange={(e, newValue) => setValue(newValue)}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Sell Normal Ticket" />
                        <Tab label="Discount Reserve" />
                        <Tab label="VIP Account" />
                        <Tab label="Paid Game" />
                        <Tab label="Payment Making" />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={value}
                    onChangeIndex={(e) => setValue(e.target.value)}
                >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <SellTicket />
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <DiscountReserve />
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        <VIPAccount />
                    </TabPanel>
                    <TabPanel value={value} index={3} dir={theme.direction}>
                        <PaidGame />
                    </TabPanel>
                    <TabPanel value={value} index={4} dir={theme.direction}>
                        <PayTicket />
                    </TabPanel>
                </SwipeableViews>
            </CustomClass>
        </WrapperStaff>
    );
};

export default PaymentManagementPage;
