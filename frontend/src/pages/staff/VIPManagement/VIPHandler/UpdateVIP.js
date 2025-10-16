import { Box, Paper, Typography, Grid, TextField, Button, Tabs, Tab, AppBar } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import LostCard from "src/pages/staff/VIPManagement/VIPHandler/LostCard.js";
import UpdateInfo from "src/pages/staff/VIPManagement/VIPHandler/UpdateInfo.js";
import PayVIP from "src/pages/staff/VIPManagement/VIPHandler/PayVIP.js";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
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
function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

export default function VerticalTabs() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ bgcolor: "commonText.grayWhite", display: "flex", minHeight: 224, borderRadius: "10px" }}>
            <Box sx={{ flexShrink: 0, height: "auto" }}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: "divider", height: "100%" }}
                >
                    <Tab label="Update Information" {...a11yProps(0)} />
                    <Tab label="Lost Card" {...a11yProps(1)} />
                    <Tab label="Pay VIP" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <Box style={{ width: "100%" }}>
                <TabPanel value={value} index={0}>
                    <UpdateInfo />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <LostCard />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <PayVIP />
                </TabPanel>
            </Box>
        </Box>
    );
}
