import React, { useState } from "react";
import { styled, useTheme } from "@mui/system";
import {
    Box,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { deleteGame, editGame, fetchAllGames } from "src/redux/slices/gameslice";
import { BeatLoader } from "react-spinners";
import { useSnackbar } from "notistack";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";
import empty from "src/pages/admin/GamesManagement/assets/empty.png";

const CustomClass = styled(Box)((theme) => ({
    ".wrapper": {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    ".titleItem": {
        fontSize: "larger",
        color: theme.theme.palette.commonText.black,
        textAlign: "center",
        fontWeight: "bold",
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
    const theme = useTheme();
    const dp = useDispatch();

    const [openDelete, setOpenDelete] = useState(false);
    const closeDeleteDialog = () => {
        setOpenDelete(false);
    };
    const openDeleteDialog = () => {
        setOpenDelete(true);
    };

    const [loadingDelete, setLoadingDelete] = useState(false);
    const { enqueueSnackbar: eq } = useSnackbar();
    const handleDeleteItem = async (id) => {
        setLoadingDelete(true);
        await dp(deleteGame({ id, eq, closeDeleteDialog }));
        setLoadingDelete(false);
    };

    const [openEdit, setOpenEdit] = useState(false);
    const closeEditDialog = () => {
        setOpenEdit(false);
    };
    const openEditDialog = () => {
        setImage(data.url || empty);
        setImageSending(data.url || null);
        setTitle(data.title);
        setDescription(data?.description);
        setType(data.type);
        setPrice(data.price);
        setOpenEdit(true);
    };
    const [image, setImage] = useState(data.url || empty);
    const [imageSending, setImageSending] = useState(data.url || null);
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
        setImageSending(event.target.files[0]);
    };
    const [title, setTitle] = useState(data.title);
    const [description, setDescription] = useState(data.description);
    const [type, setType] = useState(data.type);
    const [price, setPrice] = useState(data.price);

    const [loadingEdit, setLoadingEdit] = useState(false);
    const handleEdit = async (e) => {
        e.preventDefault();
        setLoadingEdit(true);
        await dp(editGame({ title, description, type, price, imageSending, id: data._id, eq }));
        setLoadingEdit(false);
    };

    return (
        <CustomClass>
            <Box className="wrapper">
                <Typography className="titleItem">{data?.title}</Typography>
                <Box py={1}></Box>
                <img width="80%" src={data?.url} />
                <Box py={1}></Box>
                <Box>
                    <Button variant="contained" onClick={openEditDialog} disabled={loadingEdit || loadingDelete}>
                        {loadingEdit || loadingDelete ? (
                            <BeatLoader color={theme.palette.commonText.white} size={8} />
                        ) : (
                            "Edit Game"
                        )}
                    </Button>
                    <span> </span>
                    <Button variant="contained" onClick={openDeleteDialog} disabled={loadingDelete}>
                        {loadingDelete ? <BeatLoader color={theme.palette.commonText.white} size={8} /> : "Delete Game"}
                    </Button>
                </Box>
            </Box>
            <Dialog
                open={openDelete}
                onClose={closeDeleteDialog}
                PaperProps={{
                    style: {
                        backgroundColor: theme.palette.commonText.grayWhite,
                    },
                }}
            >
                <DialogTitle>
                    <Typography style={{ textAlign: "center" }}>Are you sure want to delete this item ?</Typography>
                </DialogTitle>
                <DialogContent style={{ padding: "20px" }}>
                    <Button
                        fullWidth
                        onClick={() => handleDeleteItem(data._id)}
                        variant="contained"
                        disabled={loadingDelete}
                    >
                        {loadingDelete ? (
                            <BeatLoader color={theme.palette.commonText.white} size={8} />
                        ) : (
                            "Confirm Delete"
                        )}
                    </Button>
                </DialogContent>
            </Dialog>
            <Dialog
                open={openEdit}
                onClose={closeEditDialog}
                maxWidth="lg"
                PaperProps={{
                    style: {
                        backgroundColor: theme.palette.commonText.grayWhite,
                    },
                }}
            >
                <DialogContent className="dialogCommonGame">
                    <form onSubmit={handleEdit}>
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
                                        minRows={3}
                                        maxRows={5}
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
                                {data.type != 1 ? (
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
                                ) : null}
                                <Box py={1}></Box>
                                <Box style={{ textAlign: "center" }}>
                                    <Button type="submit" disabled={loadingEdit || loadingDelete} variant="contained">
                                        {loadingEdit || loadingDelete ? (
                                            <BeatLoader color={theme.palette.commonText.white} size={8} />
                                        ) : (
                                            "Confirm Edit"
                                        )}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        </CustomClass>
    );
};

export default Item;
