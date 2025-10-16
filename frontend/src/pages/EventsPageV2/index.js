import React from "react";
import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import tinkerLogo from "src/assets/images/logos/Tinkerbellgarden.png";
import EventOccuringDisplay from "./EventOccuringDisplay";
import { useSelector } from "react-redux";
import { selectRunningEvent } from "src/redux/slices/eventSliceV2";
import Empty from "src/components/Empty";

const CustomClass = styled(Box)((theme) => ({
    ".titleEventOccuring": {
        textAlign: "center",
        fontWeight: "bolder",
        fontSize: "larger",
        marginBottom: "10px",
    },
}));

const EventsHoldingV2 = () => {
    const runningEvent = useSelector((state) => selectRunningEvent(state));
    const theme = useTheme();
    return (
        <CustomClass>
            <Typography className={"titleEventOccuring"}>Ocurring Events</Typography>
            {runningEvent.map((event) => (
                <Box key={event._id}>
                    <EventOccuringDisplay event={event} />
                    <Box py={1}></Box>
                </Box>
            ))}
            {runningEvent.length == 0 && (
                <Box py={3} textAlign="center">
                    <Empty color={theme.palette.commonText.black} title="There is no event now" />
                </Box>
            )}
        </CustomClass>
    );
};

export default EventsHoldingV2;
