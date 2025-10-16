import {
    Box,
    Paper,
    Button,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Grid,
    TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import WrapperAdmin from "src/pages/admin/WrapperAdmin";
import { styled, alpha, useTheme } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAccount, selectAccounts } from "src/redux/slices/listAccountSlice";
import { css } from "@emotion/react";
import FadeLoader from "react-spinners/FadeLoader";
import CreateNewButton from "./CreateNewButton";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import Helmet from "react-helmet";
import VIPManagement from "./VIPManagement.js";

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
    ".bodyText": {
        color: theme.theme.palette.commonText.white,
        fontWeight: "medium",
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

const override = css`
    display: block;
    margin: 0 auto;
`;

const CellHeader = styled(TableCell)(() => ({
    border: 0,
}));

const CellBody = styled(TableCell)((theme) => ({
    border: 0,
    paddingTop: theme.theme.spacing(1),
    paddingBottom: theme.theme.spacing(1),
}));

const AccountManagementPage = () => {
    const accounts = useSelector((state) => selectAccounts(state));
    const dp = useDispatch();
    const [loadingDelete, setLoadingDelete] = useState([]);
    const theme = useTheme();
    const [searchUsername, setSearchUsername] = useState("");

    useEffect(() => {
        if (accounts.length == 0) {
            init();
        }
    }, []);
    async function init() {
        await Promise.all([dp(fetchAllAccount())]);
    }

    return (
        <WrapperAdmin>
            <Box>
                <Helmet>
                    <title>Tinkerbell Garden - Accounts</title>
                </Helmet>
            </Box>
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
                        Account Management
                    </Typography>
                    <CreateNewButton />
                    <span>&nbsp;&nbsp;</span>
                    <NormTextField
                        variant="outlined"
                        label="Search by username"
                        size="small"
                        inputProps={{ className: "input" }}
                        style={{ marginTop: "3px" }}
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                    />
                    <Typography className="text">List account of staff:</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow className="header">
                                    <CellHeader>
                                        <Typography className="headerText">ACCOUNT</Typography>
                                    </CellHeader>
                                    <CellHeader className="responsive">
                                        <Typography className="headerText">ROLE</Typography>
                                    </CellHeader>
                                    <CellHeader align="center">
                                        <Typography className="headerText">ACTIONS</Typography>
                                    </CellHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {accounts.map((detail, index) => {
                                    if (
                                        detail.loginName.toLowerCase().includes(searchUsername.toLowerCase()) ||
                                        searchUsername == ""
                                    ) {
                                        if (detail.role == "admin") {
                                            return (
                                                <TableRow
                                                    key={index}
                                                    className={index % 2 ? "normal padding" : "color padding"}
                                                >
                                                    <CellBody>
                                                        <Typography className="bodyText">{detail.loginName}</Typography>
                                                    </CellBody>
                                                    <CellBody className="responsive">
                                                        <Typography className="bodyText">
                                                            {detail.role.toUpperCase()}
                                                        </Typography>
                                                    </CellBody>
                                                    <CellBody align="center">
                                                        <Grid container spacing={1} justifyContent="center">
                                                            <Grid item xs={12}>
                                                                <EditButton
                                                                    variant="contained"
                                                                    style={{ width: "50%" }}
                                                                    loadingDelete={loadingDelete}
                                                                    setLoadingDelete={setLoadingDelete}
                                                                    index={index}
                                                                    detail={detail}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </CellBody>
                                                </TableRow>
                                            );
                                        }
                                        return (
                                            <TableRow
                                                key={index}
                                                className={index % 2 ? "normal padding" : "color padding"}
                                            >
                                                <CellBody>
                                                    <Typography className="bodyText">{detail.loginName}</Typography>
                                                </CellBody>
                                                <CellBody className="responsive">
                                                    <Typography className="bodyText">
                                                        {detail.role.toUpperCase()}
                                                    </Typography>
                                                </CellBody>
                                                <CellBody align="center">
                                                    <Grid container spacing={1} justifyContent="center">
                                                        <Grid item xs={6}>
                                                            <EditButton
                                                                variant="contained"
                                                                style={{ width: "50%", float: "right" }}
                                                                loadingDelete={loadingDelete}
                                                                index={index}
                                                                setLoadingDelete={setLoadingDelete}
                                                                detail={detail}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <DeleteButton
                                                                loadingDelete={loadingDelete}
                                                                index={index}
                                                                detail={detail}
                                                                setLoadingDelete={setLoadingDelete}
                                                                variant="contained"
                                                                style={{ width: "50%", float: "left" }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </CellBody>
                                            </TableRow>
                                        );
                                    }
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {
                        // tăng trải nghiệm ng dùng hơn là biến loading
                        accounts.length == 0 && (
                            <Box style={{ marginTop: "20px" }}>
                                <FadeLoader color={theme.palette.primary.main} size={200} css={override} />
                            </Box>
                        )
                    }
                </Paper>
                <Box py={2}></Box>
                <VIPManagement />
            </CustomClass>
        </WrapperAdmin>
    );
};

export default AccountManagementPage;
