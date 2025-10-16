import React, { useState, Fragment } from "react";
import { styled, useTheme } from "@mui/system";
import ItemImg from "src/pages/JoinPage/ItemImg";
import { Box, Grid, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { FormattedNumber } from "react-intl";

const CustomClass = styled(Box)((theme) => ({
    ".wrapper": {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    ".title": {
        fontSize: "larger",
        color: theme.theme.palette.commonText.black,
        textAlign: "center",
    },
    ".wrapper:hover": {
        ".title": {
            color: theme.theme.palette.primary.main,
        },
    },
    ".dialogContainer": {
        padding: "20px",
        display: "flex",
    },
    ".description": {
        fontFamily: "Roboto !important",
        fontWeight: "lighter !important",
    },
}));

const Item = ({ data }) => {
    const [open, setOpen] = useState(false);
    const closeDialog = () => {
        setOpen(false);
    };
    const showData = () => {
        setOpen(true);
    };
    const theme = useTheme();
    return (
        <CustomClass>
            <Box className="wrapper" onClick={showData}>
                <img width="80%" src={data?.url} />
                <Box py={1}></Box>
                <Typography className="title">{data.title}</Typography>
            </Box>
            <Dialog
                open={open}
                onClose={closeDialog}
                maxWidth={"md"}
                PaperProps={{
                    style: {
                        backgroundColor: theme.palette.commonText.grayWhite,
                    },
                }}
            >
                <DialogTitle>
                    <Typography
                        className="dialogTitle"
                        style={{ fontSize: "larger", fontWeight: "bold", textAlign: "center" }}
                    >
                        {data.title}
                    </Typography>
                </DialogTitle>
                <DialogContent className="dialogContainer">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <img src={data?.url} style={{ maxWidth: "100%" }} />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={6}
                            style={{ display: "flex", flexDirection: "column", justifyContent: "space-around" }}
                        >
                            <Typography style={{ fontFamily: "Roboto" }}>{data?.description}</Typography>
                            <Box>
                                <Typography>
                                    <span style={{ fontFamily: "Roboto" }}>Type:&nbsp;</span>
                                    <span style={{ fontWeight: "bold" }}>
                                        {data.type == 1 ? "Common Game" : "Paid Game"}
                                    </span>
                                </Typography>
                                <Typography>
                                    <span style={{ fontFamily: "Roboto" }}>Price:&nbsp;</span>
                                    {data.price == 0 ? (
                                        <span style={{ fontWeight: "bold" }}>included in the entrance ticket</span>
                                    ) : (
                                        <span style={{ fontWeight: "bold" }}>
                                            <FormattedNumber value={parseInt(data.price)} />
                                            &nbsp;VNĐ
                                        </span>
                                    )}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </CustomClass>
    );
};

export default Item;
