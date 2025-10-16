import React, { useState } from "react";
import { Box, Paper, Typography, Grid, Button, List, ListItemButton, Collapse, Grow } from "@mui/material";
import { styled } from "@mui/system";
import ButtonCreateNewReport from "src/pages/staff/ReportInfrastructure/ButtonCreateNewReport";
import ReportSubItem from "src/pages/staff/ReportInfrastructure/ReportSubItem";

const CustomClass = styled(Box)((theme) => ({
    ".paperListReport": {
        backgroundColor: theme.theme.palette.commonText.grayWhite,
        cursor: "pointer",
    },
    ".paperListReport:hover": {
        transition: "0.2s",
        backgroundColor: theme.theme.palette.hover.white,
    },
    ".listReportTitle": {
        fontWeight: "bold",
    },
    ".listItemButton": {
        padding: "10px",
    },
}));

const ReportItem = ({ game, reportedItem }) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerAction = () => {
        setIsOpen(!isOpen);
    };

    return (
        <CustomClass>
            <Paper className="paperListReport" onClick={triggerAction}>
                <ListItemButton className="listItemButton">
                    <Grid container spacing={3}>
                        <Grid item xs={1}>
                            <img width="100%" src={game?.url} />
                        </Grid>
                        <Grid item>
                            <Typography className="listReportTitle">{game?.title}</Typography>
                        </Grid>
                    </Grid>
                </ListItemButton>
            </Paper>
            <Grow in={isOpen} timeout="auto" unmountOnExit>
                <Box>
                    {reportedItem.map((item, index) => (
                        <Box key={index} style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                            <Box py={0.5}></Box>
                            <ReportSubItem report={item} game={game} />
                        </Box>
                    ))}
                    <Box py={0.5}></Box>
                    <ButtonCreateNewReport game={game} />
                </Box>
            </Grow>
        </CustomClass>
    );
};

export default ReportItem;
