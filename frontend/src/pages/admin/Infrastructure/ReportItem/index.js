import React, { useState } from "react";
import { Box, Paper, Typography, Grid, Button, List, ListItemButton, Collapse } from "@mui/material";
import { styled } from "@mui/system";
import ButtonDeleteAll from "src/pages/admin/Infrastructure/ButtonDeleteAll";
import ReportSubItem from "src/pages/admin/Infrastructure/ReportSubItem";

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

const ListReport = ({ game, reportedItem }) => {
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
                            <Typography className="listReportTitle">{game.title}</Typography>
                        </Grid>
                    </Grid>
                </ListItemButton>
            </Paper>
            <Collapse in={isOpen} timeout="auto">
                <Box>
                    {reportedItem.map((item) => (
                        <Box key={item.id} style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                            <Box py={0.5}></Box>
                            <ReportSubItem report={item} game={game} />
                        </Box>
                    ))}
                    <Box py={0.5}></Box>
                    {reportedItem.length > 1 ? <ButtonDeleteAll game={game} reports={reportedItem} /> : null}
                </Box>
            </Collapse>
        </CustomClass>
    );
};

export default ListReport;
