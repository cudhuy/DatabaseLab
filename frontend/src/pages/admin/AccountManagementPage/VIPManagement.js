import {
    Box,
    Paper,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
} from "@mui/material";
import React, { useState } from "react";
import { styled, alpha, useTheme } from "@mui/system";
import { useSelector } from "react-redux";
import { selectVIPAccounts } from "src/redux/slices/listAccountSlice";
import Empty from "src/components/Empty";
import VIPDeleteButton from "./VIPDeleteButton";

const CustomClass = styled(Box)((theme) => ({
    ".wrapper": {
        padding: theme.theme.spacing(3, 5, 3, 5),
        borderRadius: "15px",
    },
    ".button": {
        borderRadius: "15px",
        fontSize: "large",
        fontWeight: "medium",
    },
    ".text": {
        color: theme.theme.palette.commonText.white,
        fontWeight: "lighter",
        marginBottom: "10px",
        marginTop: "10px",
    },
    ".header": {
        backgroundColor: alpha(theme.theme.palette.background.header.main, 0.8),
        "& th:last-child": {
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "10px",
        },
        "& th:first-of-type": {
            borderBottomLeftRadius: "10px",
            borderTopLeftRadius: "10px",
        },
    },
    ".normal": {
        backgroundColor: alpha(theme.theme.palette.background.header.main, 0.2),
        "& td:last-child": {
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "10px",
        },
        "& td:first-of-type": {
            borderBottomLeftRadius: "10px",
            borderTopLeftRadius: "10px",
        },
    },
    ".headerText": {
        fontSize: "large",
        fontWeight: "bolder",
    },
    ".headerTextCenter": {
        fontSize: "large",
        fontWeight: "bolder",
        textAlign: "center",
    },
    ".bodyText": {
        color: theme.theme.palette.commonText.white,
        fontWeight: "medium",
    },
    ".bodyTextCenter": {
        color: theme.theme.palette.commonText.white,
        fontWeight: "medium",
        textAlign: "center",
    },
    ".responsive": {
        [theme.theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
    ".input": {
        color: theme.theme.palette.commonText.white,
    },
}));

const NormTextField = styled(TextField)((theme) => ({
    "& .MuiFormLabel-colorPrimary": {
        color: theme.theme.palette.light.main,
    },
    "& fieldset": {
        borderColor: theme.theme.palette.light.main,
        borderWidth: 1,
    },
}));

const CellHeader = styled(TableCell)(() => ({
    border: 0,
}));

const CellBody = styled(TableCell)((theme) => ({
    border: 0,
    paddingTop: theme.theme.spacing(1),
    paddingBottom: theme.theme.spacing(1),
}));

const VIPManagement = () => {
    const [searchUsername, setSearchUsername] = useState("");
    const [searchID, setSearchID] = useState("");
    const VIPAccounts = useSelector((state) => selectVIPAccounts(state));
    const theme = useTheme();

    return (
        <CustomClass>
            <Paper elevation={0} className="wrapper">
                <Typography
                    style={{
                        color: theme.palette.commonText.white,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "larger",
                    }}
                >
                    VIP Management
                </Typography>
                <NormTextField
                    variant="outlined"
                    label="Search by username"
                    size="small"
                    inputProps={{ className: "input" }}
                    style={{ marginTop: "3px" }}
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                />
                <span>&nbsp;&nbsp;</span>
                <NormTextField
                    variant="outlined"
                    label="Search by id"
                    size="small"
                    inputProps={{ className: "input" }}
                    style={{ marginTop: "3px" }}
                    value={searchID}
                    onChange={(e) => setSearchID(e.target.value)}
                />
                <Box py={1}></Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow className="header">
                                <CellHeader className="responsive">
                                    <Typography className="headerText">NAME</Typography>
                                </CellHeader>
                                <CellHeader className="responsive">
                                    <Typography className="headerTextCenter">PHONE</Typography>
                                </CellHeader>
                                <CellHeader className="responsive">
                                    <Typography className="headerTextCenter">POINT</Typography>
                                </CellHeader>
                                <CellHeader className="responsive">
                                    <Typography className="headerTextCenter">Status</Typography>
                                </CellHeader>
                                <CellHeader>
                                    <Typography className="headerTextCenter">ID</Typography>
                                </CellHeader>
                                <CellHeader align="center">
                                    <Typography className="headerText">ACTION</Typography>
                                </CellHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {VIPAccounts.map((detail, index) => {
                                if (
                                    (detail.name.toLowerCase().includes(searchUsername.toLowerCase()) ||
                                        searchUsername == "") &&
                                    (searchID == "" || detail.id.toLowerCase().includes(searchID.toLowerCase()))
                                ) {
                                    return (
                                        <TableRow
                                            key={detail.id}
                                            className={index % 2 ? "normal padding" : "color padding"}
                                        >
                                            <CellBody className="responsive">
                                                <Typography className="bodyText">{detail.name}</Typography>
                                            </CellBody>
                                            <CellBody className="responsive">
                                                <Typography className="bodyTextCenter">{detail.phone}</Typography>
                                            </CellBody>
                                            <CellBody className="responsive">
                                                <Typography className="bodyTextCenter">
                                                    {parseInt(detail.point)}
                                                </Typography>
                                            </CellBody>
                                            <CellBody className="responsive">
                                                <Typography className="bodyTextCenter">
                                                    {new Date() >= detail.dueDate ? "Expired" : "Active"}
                                                </Typography>
                                            </CellBody>
                                            <CellBody>
                                                <Typography className="bodyTextCenter">{detail.id}</Typography>
                                            </CellBody>
                                            <CellBody align="center">
                                                <VIPDeleteButton id={detail.id} uuid={detail.uuid} />
                                            </CellBody>
                                        </TableRow>
                                    );
                                }
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {VIPAccounts.length == 0 && (
                    <Box py={3} textAlign="center">
                        <Empty color={theme.palette.commonText.white} title="There is no VIP Account" />
                    </Box>
                )}
            </Paper>
        </CustomClass>
    );
};

export default VIPManagement;
