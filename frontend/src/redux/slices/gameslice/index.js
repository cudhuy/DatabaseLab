import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import Axios from "axios";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";

const client = Axios.create({
    baseURL: process.env.REACT_APP_BASEURL,
});

export const fetchAllGames = createAsyncThunk("gameSlice/fetchAllGames", async (_, thunkAPI) => {
    const gamesData = await client.get("/api/v1/game");
    console.log(gamesData);
    // await Promise.all(
    //     gamesData.data.map((ele) => thunkAPI.dispatch(fetchImg({ url: ele.image.url, title: ele.title })))
    // );
    return gamesData.data;
});

// export const fetchImg = createAsyncThunk("gameSlice/fetchImg", async ({url, title}, thunkAPI) => {
//     console.log(url);
//     console.log(title);
// });

export const addNewGame = createAsyncThunk(
    "gameSlice/addNewGame",
    async ({ title, description, type, price, imageSending }, thunkAPI) => {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const uploadData = new FormData();
        uploadData.append("image", imageSending);
        uploadData.append("name", title);
        uploadData.append("description", description);
        uploadData.append("type", type);
        uploadData.append("price", price);

        const response = await client.post("/api/v1/game", uploadData, config);
        return response;
    }
);

export const deleteGame = createAsyncThunk("gameSlice/deleteGame", async ({ id, eq, closeDeleteDialog }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        await client.delete(`/api/v1/game/${id}`, config);
        eq("Delete game successfully!!", SUCCESS_TOP_CENTER);
        closeDeleteDialog();
        return { id };
    } catch (err) {
        console.log(err.response);
        eq(err.response.data.message, ERR_TOP_CENTER);
        return {};
    }
});

export const editGame = createAsyncThunk(
    "gameSlice/editGame",
    async ({ title, description, type, price, imageSending, id, eq }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.accountData.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const uploadData = new FormData();
            uploadData.append("image", imageSending);
            uploadData.append("name", title);
            uploadData.append("description", description);
            uploadData.append("type", type);
            uploadData.append("price", price);

            const response = await client.patch(`/api/v1/game/${id}`, uploadData, config);
            eq("Successfully update!!", SUCCESS_TOP_CENTER);
            thunkAPI.dispatch(fetchAllGames());
            // return {
            //     image: { url: response.data.game?.image?.url },
            //     name: response.data.game.name,
            //     description: response.data.game?.description,
            //     type: response.data.game?.type,
            //     price: response.data.game?.price,
            //     _id: response.data.game._id,
            // };
            return;
        } catch (err) {
            console.log(err.response);
            eq(err.response.data.message, ERR_TOP_CENTER);
            return {};
        }
    }
);

export const updateCommonPrice = createAsyncThunk(
    "gameSlice/updateCommonPrice",
    async ({ turnPrice, dayPrice }, thunkAPI) => {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const ticketPrice = {
            day: dayPrice,
            turn: turnPrice,
        };
        console.log(ticketPrice);
        const response = await client.patch("/api/v1/constant", { ticketPrice }, config);
        console.log(response);
        thunkAPI.dispatch(fetchCommonPrice());
        return response;
    }
);

export const fetchCommonPrice = createAsyncThunk("gameSlice/fetchCommonPrice", async (_, thunkAPI) => {
    try {
        const response = await client.get("/api/v1/constant");
        return {
            turnPrice: response.data.ticketPrice.turn,
            dayPrice: response.data.ticketPrice.day,
        };
    } catch (err) {
        console.log(err);
        return {};
    }
});

const initialState = {
    data: [],
    turnPrice: 100000,
    dayPrice: 300000,
    extraPrice: 50000,
};

const gameSlice = createSlice({
    name: "gameSlice",
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchAllGames.fulfilled]: (state, action) => {
            state.data = action.payload.games;
        },
        // [updateCommonPrice.fulfilled]: (state, action) => {
        //     state.turnPrice = action.payload.turnPrice;
        //     state.dayPrice = action.payload.dayPrice;
        // },
        [deleteGame.fulfilled]: (state, action) => {
            state.data = state.data.filter((ele) => {
                return ele._id != action.payload.id;
            });
        },
        // [editGame.fulfilled]: (state, action) => {
        //     state.data = state.data.map((ele) => {
        //         if (ele._id == action.payload._id) {
        //             return action.payload;
        //         }
        //         return ele;
        //     });
        // },
        [fetchCommonPrice.fulfilled]: (state, action) => {
            state.turnPrice = action.payload.turnPrice;
            state.dayPrice = action.payload.dayPrice;
        },
    },
});
export const selectGameSlice = (state) => state.gameSlice;
export default gameSlice.reducer;
