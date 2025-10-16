import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import Axios from "axios";
import { FS } from "src/redux/slices/other/constant";

const client = Axios.create({
    baseURL: process.env.REACT_APP_BASEURL,
});

export const fetchAll = createAsyncThunk("statisticsSlice/fetchAll", async (_, thunkAPI) => {
    await Promise.all([
        thunkAPI.dispatch(fetchTotalProfit()),
        thunkAPI.dispatch(fetchTicketData()),
        thunkAPI.dispatch(fetchPaidGameData({ tab: 0 })),
        thunkAPI.dispatch(fetchVIPRanking()),
    ]);
});

export const fetchTotalProfit = createAsyncThunk("statisticsSlice/fetchTotalProfit", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await client.get("/api/v1/metadata/totalprofit", config);
        return response.data;
    } catch (err) {
        console.log(err);
        thunkAPI.rejectWithValue(err.response.data);
    }
});

export const fetchTicketData = createAsyncThunk("statisticsSlice/fetchTicketData", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await client.get("/api/v1/metadata/ticket", config);
        const data = [
            {
                name: "Number of turn ticket",
                type: "column",
                data: Object.entries(response.data).map((ele) => [
                    parseInt(ele[0]),
                    ele[1][0]?.totalNumber ? ele[1][0].totalNumber : 0,
                ]),
            },
            {
                name: "Number of day ticket",
                type: "column",
                data: Object.entries(response.data).map((ele) => [
                    parseInt(ele[0]),
                    ele[1][1]?.totalNumber ? ele[1][1].totalNumber : 0,
                ]),
            },
            {
                name: "Number of paid-game ticket",
                type: "line",
                data: Object.entries(response.data).map((ele) => [
                    parseInt(ele[0]),
                    ele[1][2]?.totalNumber ? ele[1][2].totalNumber : 0,
                ]),
            },

            // nếu muốn data k có thì k hiện trên chart thì dùng đoạn code dưới
            // {
            //     name: "Number of turn ticket",
            //     type: "column",
            //     data: Object.entries(response.data).filter(ele => ele[1] && ele[1][0]?.totalNumber).map(ele => ([
            //         parseInt(ele[0]), (ele[1][0].totalNumber)//có data mới in ra
            //     ]))
            // },
            // {
            //     name: "Number of day ticket",
            //     type: "column",
            //     data: Object.entries(response.data).filter(ele => ele[1] && ele[1][1]?.totalNumber).map(ele => ([
            //         parseInt(ele[0]), (ele[1][1].totalNumber)
            //     ]))
            // },
            // {
            //     name: "Number of paid-game ticket",
            //     type: "line",
            //     data: Object.entries(response.data).filter(ele => ele[1] && ele[1][2]?.totalNumber).map(ele => ([
            //         parseInt(ele[0]), (ele[1][2].totalNumber)
            //     ]))
            // },
        ];
        return data;
    } catch (err) {
        console.log(err);
        thunkAPI.rejectWithValue(err.response.data);
    }
});

export const fetchPaidGameData = createAsyncThunk("statisticsSlice/fetchPaidGameData", async ({ tab }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await client.get("/api/v1/metadata/game", config);
        var profit = {
            day: response.data.day.map((res) => ({
                name: res.name,
                y: res.totalProfit,
            })),
            week: response.data.week.map((res) => ({
                name: res.name,
                y: res.totalProfit,
            })),
            month: response.data.month.map((res) => ({
                name: res.name,
                y: res.totalProfit,
            })),
        };
        const tickNum = {
            day: response.data.day.map((res) => ({
                name: res.name,
                y: res.totalNumber,
            })),
            week: response.data.week.map((res) => ({
                name: res.name,
                y: res.totalNumber,
            })),
            month: response.data.month.map((res) => ({
                name: res.name,
                y: res.totalNumber,
            })),
        };
        return {
            profit: profit,
            tickNum: tickNum,
        };
    } catch (err) {
        console.log(err);
        thunkAPI.rejectWithValue(err.response.data);
    }
});

export const fetchVIPRanking = createAsyncThunk("statisticsSlice/fetchVIPRanking", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await client.get("/api/v1/metadata/vip", config);
        console.log(response);
        return {
            num: response.data.count,
            data: response.data.vipStatisTic.map((res) => ({
                name: res.name,
                payment: res.totalPayment || 0,
                id: res.vipCode,
                tickNum: res.totalTicketBuy,
            })),
        };
    } catch (err) {
        console.log(err);
        thunkAPI.rejectWithValue(err.response.data);
    }
});

const initialState = {
    fetchingStatus: FS.INITIAL,
    entranceTicketProfit: null,
    paidGameTicketProfit: null,
    ticketStatistics: [],
    profitPaidGame: null,
    tickNumPaidGame: null,
    vipRanking: [],
    vipNum: 0,
};

const statisticsSlice = createSlice({
    name: "statisticsSlice",
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchTotalProfit.fulfilled]: (state, action) => {
            state.entranceTicketProfit = action.payload.entrance;
            state.paidGameTicketProfit = action.payload.game;
        },
        [fetchAll.fulfilled]: (state, action) => {
            state.fetchingStatus = FS.SUCCESS;
        },
        [fetchAll.rejected]: (state, action) => {
            state.fetchingStatus = FS.FAIL;
        },
        [fetchAll.pending]: (state, action) => {
            state.fetchingStatus = FS.FETCHING;
        },
        [fetchTicketData.fulfilled]: (state, action) => {
            state.ticketStatistics = action.payload;
        },
        [fetchPaidGameData.fulfilled]: (state, action) => {
            state.profitPaidGame = action.payload.profit;
            state.tickNumPaidGame = action.payload.tickNum;
        },
        [fetchVIPRanking.fulfilled]: (state, action) => {
            state.vipNum = action.payload.num;
            state.vipRanking = action.payload.data;
        },
        [fetchVIPRanking.rejected]: (state, action) => {
            state.fetchingStatus = FS.FAIL;
        },
        [fetchTotalProfit.rejected]: (state, action) => {
            state.fetchingStatus = FS.FAIL;
        },
        [fetchTicketData.rejected]: (state, action) => {
            state.fetchingStatus = FS.FAIL;
        },
        [fetchPaidGameData.rejected]: (state, action) => {
            state.fetchingStatus = FS.FAIL;
        },
    },
});

export const selectStatisticsSlice = (state) => state.vipSlice;
export default statisticsSlice.reducer;
