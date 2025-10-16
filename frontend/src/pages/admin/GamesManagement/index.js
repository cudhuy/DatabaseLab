import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Typography, Dialog, DialogContent, TextField, FormControl, Grid, Select, MenuItem } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import ListGame from "src/pages/admin/GamesManagement/ListGame";
import empty from "src/pages/admin/GamesManagement/assets/empty.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewGame, fetchAllGames, updateCommonPrice } from "src/redux/slices/gameslice";
import { BeatLoader } from "react-spinners";
import { useSnackbar } from "notistack";
import { SUCCESS_TOP_CENTER, ERR_TOP_CENTER } from "src/utils/snackbar-utils";
import { FormattedNumber } from "react-intl";

const CustomClass = styled(Box)((theme) => ({
    ".title": {
        color: theme.theme.palette.primary.main,
        fontSize: "larger",
        fontWeight: "bold",
        textAlign: "center",
        cursor: "pointer",
        userSelect: "none",
    },
    ".hr": {
        borderTop: "1px solid",
        borderColor: theme.theme.palette.light.main,
    },
    ".dialogCommonGame": {
        padding: "20px",
    },
}));

const GamesManagement = () => {
    const theme = useTheme();
    const imgGameData = useSelector((state) => state.gameSlice.data);
    const turnPriceCommon = useSelector((state) => state.gameSlice.turnPrice);
    const dayPriceCommon = useSelector((state) => state.gameSlice.dayPrice);
    const imgCommonGames = imgGameData
        .filter((ele) => {
            return ele.type == 1;
        })
        .map((ele) => {
            return {
                url: ele?.image?.url,
                title: ele?.name,
                description: ele?.description,
                type: ele?.type,
                price: ele?.price,
                _id: ele._id,
            };
        });
    const imgPaidGame = imgGameData
        .filter((ele) => {
            return ele.type == 2;
        })
        .map((ele) => {
            return {
                url: ele?.image?.url,
                title: ele?.name,
                description: ele?.description,
                type: ele?.type,
                price: ele?.price,
                _id: ele?._id,
            };
        });

    const [open, setOpen] = useState(false);
    const openDialog = () => {
        setOpen(true);
    };
    const closeDialog = () => {
        setOpen(false);
    };
    const [turnPrice, setTurnPrice] = useState(turnPriceCommon);
    const [dayPrice, setDayPrice] = useState(dayPriceCommon);
    const [loadingEditCommonPrice, setLoadingEditCommonPrice] = useState(false);
    const handleEditCommonPrice = async () => {
        setLoadingEditCommonPrice(true);
        if(turnPrice > 0 && dayPrice > 0) {
            const response = await dp(updateCommonPrice({ turnPrice, dayPrice }));
            console.log(response);
            if (response.error) {
                eq("Cannot update common price!!", ERR_TOP_CENTER);
                console.log(response.error);
                setLoadingEditCommonPrice(false);
                return;
            }
            eq("Update common price successfully!!", SUCCESS_TOP_CENTER);
        }
        else{
            eq("Invalid price input!!", ERR_TOP_CENTER);
        }
        setLoadingEditCommonPrice(false);
    };

    const [openCommon, setOpenCommon] = useState(false);
    const openCommonDialog = () => {
        setTitle("");
        setType(1);
        setPrice(0);
        setDescription("");
        setImageSending("");
        setImage(empty);
        setOpenCommon(true);
    };
    const closeCommon = () => {
        setOpenCommon(false);
    };

    const [image, setImage] = useState(empty);
    const [imageSending, setImageSending] = useState("");
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
        setImageSending(event.target.files[0]);
    };
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState(1);
    const [price, setPrice] = useState(0);
    const dp = useDispatch();
    const { enqueueSnackbar: eq } = useSnackbar();

    const [loadingCreate, setLoadingCreate] = useState(false);
    const handleAdd = async (e) => {
        e.preventDefault();
        setLoadingCreate(true);
        if(price > 0){
            const response = await dp(addNewGame({ title, description, type, price, imageSending }));
            if (response.error) {
                console.log(response.error);
                eq("Fail to add new game", ERR_TOP_CENTER);
                setLoadingCreate(false);
                return;
            }
            eq("Add new game successfully", SUCCESS_TOP_CENTER);
            closeCommon();
            await dp(fetchAllGames());
        }
        else{
            eq("Invalid price !!!", ERR_TOP_CENTER);
        }
        setLoadingCreate(false);
    };

    return (
        <CustomClass>
            <Helmet>
                <title>Tinkerbell Garden - Games Management</title>
            </Helmet>
            <Box py={1}></Box>
            <Button variant="contained" onClick={openCommonDialog} disabled={loadingCreate}>
                {loadingCreate ? <BeatLoader color={theme.palette.commonText.white} size={8} /> : "+ Add new game"}
            </Button>
            <Box py={1}></Box>
            <Typography className="title" onDoubleClick={openDialog}>
                Common Games
            </Typography>
            <Typography className="title" onDoubleClick={openDialog}>
                Turn ticket:&nbsp;{<FormattedNumber value={parseInt(turnPrice)} />}&nbsp;VNĐ / 2h
            </Typography>
            <Typography className="title" onDoubleClick={openDialog}>
                Day ticket:&nbsp;{<FormattedNumber value={parseInt(dayPrice)} />}&nbsp;VNĐ / 1day
            </Typography>
            <Dialog
                onClose={closeDialog}
                open={open}
                maxWidth="md"
                PaperProps={{
                    style: {
                        backgroundColor: theme.palette.commonText.grayWhite,
                    },
                }}
            >
                <DialogContent className="dialogContent">
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <label htmlFor="turnprice">
                            <Typography style={{ whiteSpace: "nowrap" }}>Turn Price:&nbsp;</Typography>
                        </label>
                        <TextField
                            type="number"
                            id="turnprice"
                            value={turnPrice}
                            onChange={(e) => setTurnPrice(e.target.value)}
                            fullWidth
                        />
                    </Box>
                    <Box py={1}></Box>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <label htmlFor="dayprice">
                            <Typography style={{ whiteSpace: "nowrap" }}>Day Price:&nbsp;</Typography>
                        </label>
                        <TextField
                            type="number"
                            id="dayprice"
                            value={dayPrice}
                            onChange={(e) => setDayPrice(e.target.value)}
                            fullWidth
                        />
                    </Box>
                    <Box py={1}></Box>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleEditCommonPrice}
                        disabled={loadingEditCommonPrice}
                    >
                        {loadingEditCommonPrice ? (
                            <BeatLoader color={theme.palette.commonText.white} size={8} />
                        ) : (
                            "Confirm Edit"
                        )}
                    </Button>
                </DialogContent>
            </Dialog>
            <Box className="hr"></Box>
            <Box py={1}></Box>
            <Dialog
                open={openCommon}
                onClose={closeCommon}
                maxWidth="lg"
                PaperProps={{
                    style: {
                        backgroundColor: theme.palette.commonText.grayWhite,
                    },
                }}
            >
                <DialogContent className="dialogCommonGame">
                    <form onSubmit={handleAdd}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <input
                                    accept="image/*"
                                    hidden
                                    id="raised-button-file"
                                    type="file"
                                    onChange={onImageChange}
                                />
                                <label htmlFor="raised-button-file">
                                    <img width="100%" src={image} alt="" />
                                </label>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box style={{ display: "flex", alignItems: "center" }}>
                                    <label htmlFor="title">
                                        <Typography>Title:&nbsp;</Typography>
                                    </label>
                                    <TextField
                                        id="title"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Box>
                                <Box py={1}></Box>
                                <Box style={{ display: "flex" }}>
                                    <label htmlFor="des">
                                        <Typography>Description:&nbsp;</Typography>
                                    </label>
                                    <TextField
                                        id="des"
                                        type="text"
                                        fullWidth
                                        multiline
                                        size="small"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Box>
                                <Box py={1}></Box>
                                <Box style={{ display: "flex", alignItems: "center" }}>
                                    <label htmlFor="type">
                                        <Typography>Type:&nbsp;</Typography>
                                    </label>
                                    <TextField
                                        id="type"
                                        value={type}
                                        select
                                        onChange={(e) => setType(e.target.value)}
                                        SelectProps={{
                                            MenuProps: {
                                                PaperProps: {
                                                    sx: {
                                                        backgroundColor: theme.palette.commonText.grayWhite,
                                                        color: theme.palette.commonText.black,
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem value={1}>Common Game</MenuItem>
                                        <MenuItem value={2}>Paid Game</MenuItem>
                                    </TextField>
                                </Box>
                                <Box py={1}></Box>
                                <Box style={{ display: "flex", alignItems: "center" }}>
                                    <label htmlFor="price">
                                        <Typography>Price:&nbsp;</Typography>
                                    </label>
                                    <TextField
                                        id="price"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </Box>
                                <Box py={1}></Box>
                                <Box style={{ textAlign: "center" }}>
                                    <Button type="submit" disabled={loadingCreate} variant="contained">
                                        {loadingCreate ? (
                                            <BeatLoader color={theme.palette.commonText.white} size={8} />
                                        ) : (
                                            "Confirm Create"
                                        )}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
            <Box py={2}></Box>
            <ListGame data={imgCommonGames} />

            <Box py={2}></Box>

            <Typography className="title">Paid Game</Typography>
            <Box className="hr"></Box>
            <Box py={2}></Box>
            <ListGame data={imgPaidGame} />

            <Box py={1}></Box>
        </CustomClass>
    );
};

export default GamesManagement;
