import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import Axios from "axios";
import { FS } from "src/redux/slices/other/constant";

const client = Axios.create({
    baseURL: process.env.REACT_APP_BASEURL,
});

export const registerVIP = createAsyncThunk("vipSlice/registerVIP", async ({ name, email, phone }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await client.post("/api/v1/vip", { name, email, phone }, config);
        console.log(response);
        return { data: response.data.vipCode };
    } catch (err) {
        console.log(err);
        throw Error(err.response.data.message);
    }
});

export const updateVIPInfo = createAsyncThunk(
    "vipSlice/updateVIPInfo",
    async ({ name, email, phone, code }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.accountData.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            var response;
            if (code.length <= 5) {
                response = await client.patch("api/v1/vip", { name, email, phone, code }, config);
            } else {
                response = await client.patch("api/v1/vip", { name, email, phone, uuid: code }, config);
            }
            console.log(response);
            return response;
        } catch (err) {
            console.log(err);
            thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const retrieveInfo = createAsyncThunk("vipSlice/retrieveInfo", async ({ name, email, phone }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await client.patch("api/v1/vip", { name, email, phone, password: true }, config);
        console.log(response);
        return { data: response.data.vipCode };
    } catch (err) {
        console.log(err);
        thunkAPI.rejectWithValue(err.response.data);
    }
});

export const payVIP = createAsyncThunk("vipSlice/payVIP", async ({ code }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const body = {
            extend: true,
        };
        if (code.length <= 5) {
            body.code = code;
        } else {
            body.uuid = code;
        }
        console.log(body);
        const response = await client.patch("api/v1/vip", body, config);
        console.log(response);
        return;
    } catch (err) {
        console.log(err);
        thunkAPI.rejectWithValue(err.response.data);
    }
});

export const fetchDataAuto = createAsyncThunk("vipSlice/fetchDataAuto", async ({ code }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        var response;
        var data;
        if (code.length <= 5) {
            response = await client.get(`api/v1/vip/bycode/${code}`, config);
        } else {
            response = await client.get(`api/v1/vip/byid/${code}`, config);
        }
        console.log(response);
        const voucherRes = await client.post("/api/v1/vipvoucher/getvoucher", { vipId: response.data._id }, config);
        console.log(voucherRes);
        //trước vip fetch voucher của chính họ chỉ được bằng uuid,
        //bh staff cũng phải fetch được voucher của VIP chỉ dựa vào code 5 ký tự or uuid
        data = {
            point: response.data.point,
            dueDate: new Date(response.data.dateEnd),
            voucherList: voucherRes.data.map((v) => ({
                discount: v.discount,
                voucherCode: v.voucherCode,
            })),
        };
        return data;
    } catch (err) {
        console.log(err);
        thunkAPI.rejectWithValue(err.response.data);
    }
});

export const sellTicketVIP = createAsyncThunk(
    "vipSlice/sellTicketVIP",
    async ({ code, eventCode, numberOfTicket, typeTicket, voucher }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.accountData.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            var body = {
                typeTicket: typeTicket + 1,
                tickNum: numberOfTicket,
            };
            if (code.length <= 5) {
                body.vipCode = code;
            } else {
                body.uuid = code;
            }
            if (eventCode) {
                body.code = eventCode;
            }
            if (voucher) {
                body.vipVoucherCode = voucher;
            }
            const response = await client.post("api/v1/entranceticket/vip", body, config);
            console.log(response);
            return {
                idList: response.data.result,
            };
        } catch (err) {
            console.log(err);
            // thunkAPI.rejectWithValue({error: err.response.data});
            throw new Error(err.response.data); //phải dùng cái này mới check được lỗi
        }
    }
);

export const fetchVIPAccount = createAsyncThunk("vipSlice/fetchVIPAccount", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await client.post(
            "/api/v1/vip/phone",
            { phone: thunkAPI.getState().authSlice.accountData.loginName },
            config
        );
        console.log(response);
        thunkAPI.dispatch(fetchVoucher({ vipId: response.data._id }));
        return {
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            dueDate: new Date(response.data.dateEnd),
            point: response.data.point,
            id: response.data.vipCode,
            uuid: response.data._id,
        };
    } catch (err) {
        console.log(err);
        thunkAPI.rejectWithValue(err.response.data);
    }
});

export const fetchVoucher = createAsyncThunk("vipSlice/fetchVoucher", async ({ vipId }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await client.post("/api/v1/vipvoucher/getvoucher", { vipId }, config);
        console.log(response);
        return response.data == "" ? [] : response.data;
    } catch (err) {
        console.log(err);
        thunkAPI.rejectWithValue(err.response.data);
    }
});

export const exchangeVoucher = createAsyncThunk("vipSlice/exchangeVoucher", async ({ point, vipId }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await client.post("/api/v1/vipvoucher", { discount: point / 10000, vipId }, config);
        console.log(response);
        thunkAPI.dispatch(fetchVoucher({ vipId }));
        return point;
    } catch (err) {
        console.log(err);
        thunkAPI.rejectWithValue(err.response.data);
    }
});

const initialState = {
    fetchingStatus: FS.INITIAL,
    infoVIP: null,
    listVoucher: [],
};

const vipSlice = createSlice({
    name: "vipSlice",
    initialState: initialState,
    reducers: {
        resetVipInfo: (state, action) => {
            state.infoVIP = null;
        },
    },
    extraReducers: {
        [fetchVIPAccount.fulfilled]: (state, action) => {
            state.infoVIP = action.payload;
            state.fetchingStatus = FS.SUCCESS;
        },
        [fetchVIPAccount.rejected]: (state, action) => {
            state.infoVIP = null;
            state.fetchingStatus = FS.FAIL;
        },
        [fetchVIPAccount.pending]: (state, action) => {
            state.fetchingStatus = FS.FETCHING;
        },
        [exchangeVoucher.fulfilled]: (state, action) => {
            state.infoVIP.point = state.infoVIP.point - action.payload;
        },
        [fetchVoucher.fulfilled]: (state, action) => {
            state.listVoucher = action.payload;
        },
        [registerVIP.rejected]: (state, action) => {
            console.log(action);
        },
        [registerVIP.fulfilled]: (state, action) => {
            console.log(action);
        },
    },
});

export const selectVipSlice = (state) => state.vipSlice;
export default vipSlice.reducer;
export const { resetVipInfo, updateLoginName } = vipSlice.actions;
