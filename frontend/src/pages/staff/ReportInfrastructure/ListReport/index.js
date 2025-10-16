import React from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import { styled } from "@mui/system";
import ReportItem from "src/pages/staff/ReportInfrastructure/ReportItem";
import { useSelector } from "react-redux";
import { selectUnresolvedReport } from "src/redux/slices/reportSlice";

const ListReport = ({ games }) => {
    const reports = useSelector((state) => selectUnresolvedReport(state));

    return (
        <Box>
            <Grid container spacing={3}>
                {games.map((game, index) => (
                    <Grid key={index} item xs={11} md={6}>
                        <ReportItem reportedItem={reports.filter((ele) => ele.gameId == game._id)} game={game} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ListReport;
