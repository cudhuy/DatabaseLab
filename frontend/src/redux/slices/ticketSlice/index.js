import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER, WARNING_TOP_CENTER } from "src/utils/snackbar-utils";
import { FS } from "src/redux/slices/other/constant";

const client = Axios.create({
    baseURL: process.env.REACT_APP_BASEURL,
});

export const buyPaidGameTicket = createAsyncThunk(
    "ticketSlice/buyPaidGameTicket",
    async ({ id, numberOfTicket, eq, setNumberOfTicket }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.accountData.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await client.post(
                "/api/v1/entranceTicket",
                { gameId: id, tickNum: numberOfTicket, typeTicket: 3 },
                config
            );
            console.log(response);
            const listIDShow = response.data;
            listIDShow.sort(function (a, b) {
                return a - b;
            });
            eq(`Buy successfully: ${listIDShow.toString()}`, SUCCESS_TOP_CENTER);
            setNumberOfTicket(1);
            return response;
        } catch (err) {
            console.log(err);
            eq(err.response.data.message, ERR_TOP_CENTER);
            return err.response;
        }
    }
);

export const bookTicket = createAsyncThunk("ticketSlice/bookTicket", async ({ name, email, id, eq }, thunkAPI) => {
    try {
        const body = { name, email, id };
        const response = await client.post("/api/v1/eventbooking", body);
        console.log(response);
        eq("Book ticket successfull, please check you email", SUCCESS_TOP_CENTER);
        return response;
    } catch (err) {
        console.log(err);
        eq(err.response.data.message, WARNING_TOP_CENTER);
    }
});

export const sellTicketDiscount = createAsyncThunk(
    "ticketSlice/sellTicketDiscount",
    async ({ discountId, typeTicket, tickNum, eq, setIdList, setName, setEmail, reset }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.accountData.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const body = { tickNum, typeTicket, code: discountId };
            const response = await client.post("/api/v1/entranceticket", body, config);
            console.log(response);
            const listId = response.data.result;
            listId.sort(function (a, b) {
                return a - b;
            });
            setIdList(listId);
            setName(response.data.name);
            setEmail(response.data.email);
            eq("Sell ticket successfully", SUCCESS_TOP_CENTER);
            reset();
            return response;
        } catch (err) {
            console.log(err);
            console.log(err.response.data.message);
            eq(err.response.data.message, ERR_TOP_CENTER);
        }
    }
);

export const sellTicket = createAsyncThunk(
    "ticketSlice/sellTicket",
    async ({ name, email, typeTicket, tickNum, eq }, thunkAPI) => {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        try {
            if (name && email) {
                const response = await client.post("/api/v1/dailycustomer", { name, email }, config);
                console.log(response);
            }
        } catch (err) {
            console.log(err);
            eq("Useranme or email is not valid", WARNING_TOP_CENTER);
        }
        const body = { tickNum, typeTicket };
        const response = await client.post("/api/v1/entranceticket", body, config);
        console.log(response);
        return response;
    }
);

export const fetchPrice = createAsyncThunk("ticketSlice/fetchPrice", async ({ idList, eq }, thunkAPI) => {
    const token = thunkAPI.getState().authSlice.accountData.token;
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        const response = await client.patch("/api/v1/entranceticket", { listId: idList }, config);
        console.log(response);
        if (response.error) {
            console.log(response.error);
            eq("Error while fetching price", ERR_TOP_CENTER);
            return {
                tickList: [],
                totalCost: 0,
            };
        }
        if (response.data.tickList.length == 0) {
            eq("These ticket is not existed", WARNING_TOP_CENTER);
            return {
                tickList: [],
                totalCost: 0,
            };
        }
        // game lẻ éo làm QR, game thg thì làm gây lỗi
        // const qrData = await client.post("/api/v1/pay/mintQR", { listId: idList }, config);
        // console.log(qrData);
        eq("You are seeing the newest price!", SUCCESS_TOP_CENTER);
        const data = {
            tickList: response.data.tickList,
            totalCost: response.data.totalCost,
            qrImage: null,
        };
        return data;
    } catch (err) {
        console.log(err);
        eq("Error happend. Please try again!", ERR_TOP_CENTER);
        return {
            tickList: [],
            totalCost: 0,
        };
    }
});

export const pay = createAsyncThunk("ticketSlice/pay", async ({ listId, eq }, thunkAPI) => {
    const token = thunkAPI.getState().authSlice.accountData.token;
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    var response = await client.patch("/api/v1/entranceticket/payment", { listId }, config);
    console.log(response);
    if (response.error) {
        eq("Error while making payment!", ERR_TOP_CENTER);
        console.log(response.error);
        return;
    }
    eq("Pay successfully!", SUCCESS_TOP_CENTER);
    thunkAPI.dispatch(fetchPrice({ idList: listId, eq }));
    return response;
});

const initialState = {
    data: [],
    totalCost: 0,
    loadingBookTicket: FS.INITIAL,
    qrImage: "",
};

const ticketSlice = createSlice({
    name: "ticketSlice",
    initialState: initialState,
    reducers: {
        resetTicketList: (state, _) => {
            state.data = [];
            state.qrImage = "";
        },
    },
    extraReducers: {
        [fetchPrice.fulfilled]: (state, action) => {
            state.data = action.payload.tickList;
            state.totalCost = action.payload.totalCost;
            state.qrImage = action.payload.qrImage;
        },
        [fetchPrice.rejected]: (state, action) => {
            console.log(action);
        },
        [bookTicket.pending]: (state, _) => {
            state.loadingBookTicket = FS.FETCHING;
        },
        [bookTicket.rejected]: (state, _) => {
            state.loadingBookTicket = FS.FAIL;
        },
        [bookTicket.fulfilled]: (state, _) => {
            state.loadingBookTicket = FS.SUCCESS;
        },
    },
});
export const selectTicketSlice = (state) => state.ticketSlice;
export default ticketSlice.reducer;

export const { resetTicketList } = ticketSlice.actions;
