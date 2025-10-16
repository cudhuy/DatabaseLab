import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import Axios from "axios";

const client = Axios.create({
    baseURL: process.env.REACT_APP_BASEURL,
});

export const fetchAllAccount = createAsyncThunk("listAccountSlice/fetchAllAccount", async (_, thunkAPI) => {
    await Promise.all(thunkAPI.dispatch(fetchAllNormalAccount()), thunkAPI.dispatch(fetchAllVIPAccount()));
});

export const fetchAllVIPAccount = createAsyncThunk("listAccountSlice/fetchAllVIPAccount", async (_, thunkAPI) => {
    const token = thunkAPI.getState().authSlice.accountData.token;
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const accountList = await client.get("/api/v1/vip", config);
    return accountList.data.map((d) => ({
        name: d.name,
        role: "VIP",
        id: d.vipCode,
        phone: d.phone,
        point: d.point,
        dueDate: new Date(d.dateEnd),
        uuid: d._id,
    }));
});

export const fetchAllNormalAccount = createAsyncThunk("listAccountSlice/fetchAllNormalAccount", async (_, thunkAPI) => {
    const token = thunkAPI.getState().authSlice.accountData.token;
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const accountList = await client.get("/api/v1/users", config);
    console.log(accountList);
    return accountList.data.map((account) => ({
        loginName: account.loginName,
        role: account.role,
        id: account.id,
    }));
});

export const createNewUser = createAsyncThunk("listAccountSlice/createNewUser", async ({ user }, thunkAPI) => {
    const token = thunkAPI.getState().authSlice.accountData.token;
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await client.post("/api/v1/users", user, config);
    return response;
});

export const deleteUser = createAsyncThunk("listAccountSlice/deleteUser", async (id, thunkAPI) => {
    const token = thunkAPI.getState().authSlice.accountData.token;
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    console.log(id);
    const response = await client.delete(`/api/v1/users/${id}`, config);
    return response;
});

export const deleteVIPUser = createAsyncThunk("listAccountSlice/deleteVIPUser", async (uuid, thunkAPI) => {
    const token = thunkAPI.getState().authSlice.accountData.token;
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await client.post("/api/v1/vip/delete", { listUuid: [uuid] }, config);
    return response;
});

export const editUser = createAsyncThunk(
    "listAccountSlice/createNewUser",
    async ({ id, password, adminPassword, adminName }, thunkAPI) => {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const body = { adminPassword, adminName, password };
        console.log(body);
        const response = await client.patch(`/api/v1/users/${id}`, body, config);
        console.log(response);
        return response;
    }
);

const initialState = {
    accounts: null,
    vipAccount: null,
};

const listAccountSlice = createSlice({
    name: "listAccountSlice",
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [fetchAllNormalAccount.rejected]: (state, action) => {
            console.log(action);
        },
        [fetchAllNormalAccount.fulfilled]: (state, action) => {
            state.accounts = action.payload;
        },
        [fetchAllVIPAccount.rejected]: (state, action) => {
            console.log(action);
        },
        [fetchAllVIPAccount.fulfilled]: (state, action) => {
            state.vipAccount = action.payload;
        },
    },
});
export const selectListAccountSlice = (state) => state.listAccountSlice;
export default listAccountSlice.reducer;

export const selectAccounts = createDraftSafeSelector(
    (state) => selectListAccountSlice(state).accounts,
    (accounts) => {
        if (!accounts) {
            return [];
        }
        const staffList = accounts.filter((data) => data.role == "staff");
        const adminList = accounts.filter((data) => data.role == "admin");
        return adminList.concat(staffList);
    }
);

export const selectVIPAccounts = createDraftSafeSelector(
    (state) => selectListAccountSlice(state).vipAccount,
    (vipAccount) => {
        if (!vipAccount) {
            return [];
        }
        return vipAccount;
    }
);
