import React, { Fragment } from "react";
import { Box, Paper, Typography, TableHead, Table, TableRow, TableCell, TableBody } from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import { FormattedNumber } from "react-intl";

const CustomClass = styled(Box)((theme) => ({
    ".paperRanking": {
        backgroundColor: theme.theme.palette.commonText.grayWhite,
        padding: "20px",
    },
    ".numberRankText": {
        fontSize: "28px",
        textAlign: "center",
        fontWeight: "bold",
    },
    ".textRank": {
        fontSize: "28px",
        fontWeight: "bold",
        textAlign: "center",
    },
    ".textContent": {
        fontSize: "larger",
    },
    ".textHead": {
        fontWeight: "bold",
    },
    ".responsive": {
        [theme.theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
}));

const VIPRanking = () => {
    const vipList = useSelector((state) => state.statisticsSlice.vipRanking);
    const vipNum = useSelector((state) => state.statisticsSlice.vipNum);
    return (
        <CustomClass>
            <Paper className="paperRanking">
                <Typography className="numberRankText">Total number of VIP: {vipNum}</Typography>
                <Typography className="textRank">VIP Ranking</Typography>
                <Box py={1}></Box>
                <Table>
                    <TableHead>
                        <TableCell className="textContent textHead">TOP</TableCell>
                        <TableCell className="textContent textHead">NAME</TableCell>
                        <TableCell className="textContent textHead">TOTAL PAYMENT</TableCell>
                        <TableCell className="textContent textHead responsive">Number of ticket</TableCell>
                        <TableCell className="textContent textHead responsive">ID</TableCell>
                    </TableHead>
                    <TableBody>
                        {vipList.map((ele, index) => (
                            <TableRow key={index}>
                                <TableCell className="textContent">{index + 1}.</TableCell>
                                <TableCell className="textContent">{ele.name}</TableCell>
                                <TableCell className="textContent ">
                                    <FormattedNumber value={parseInt(ele.payment)} />
                                    &nbsp;VNĐ
                                </TableCell>
                                <TableCell className="textContent responsive">{ele.tickNum}&nbsp;Tickets</TableCell>
                                <TableCell className="textContent responsive">{ele.id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </CustomClass>
    );
};

export default VIPRanking;
