import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import { FS } from "../other/constant";
import { ERR_TOP_CENTER } from "src/utils/snackbar-utils";
import Axios from "axios";

const initState = {
    accountData: undefined,
    loginStatus: FS.INITIAL,
    error: undefined,
};
const client = Axios.create({
    // baseURL: "https://tinkerbell-garden.herokuapp.com",
    baseURL: process.env.REACT_APP_BASEURL
});
export const userLogin = createAsyncThunk("authSlice/userLogin", async (user, thunkAPI) => {
    try {
        console.log(process.env.REACT_APP_BASEURL);
        const res = await client.post("/api/v1/auth/login", user).then((res) => res.data);
        console.log(res);
        return res;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const checkAuth = createAsyncThunk("authSlice/checkAuth", async ({ eq }, thunkAPI) => {
    try {
        const token = localStorage.getItem("token");
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        if (token) {
            const accountData = await client.get("/api/v1/auth", config);
            console.log(accountData);
            if (accountData) {
                thunkAPI.dispatch(updateAccountData(accountData.data));
                thunkAPI.dispatch(updateToken({ token }));
            }
        }
    } catch (err) {
        eq("Your login is expired, please try again!", ERR_TOP_CENTER);
        localStorage.removeItem("token");
    }
});

const authSlice = createSlice({
    name: "authSlice",
    initialState: initState,
    reducers: {
        updateAccountData: (state, action) => {
            state.accountData = action.payload.data;
        },
        updateToken: (state, action) => {
            state.accountData.token = action.payload.token;
        },
    },
    extraReducers: {
        [userLogin.pending](state, _) {
            state.loginStatus = FS.FETCHING;
        },
        [userLogin.fulfilled](state, action) {
            state.loginStatus = FS.SUCCESS;
            state.accountData = action.payload.data;
            state.error = undefined;
        },
        [userLogin.rejected](state, action) {
            state.loginStatus = FS.FAIL;
            state.user = undefined;
            state.error = action.payload.message;
        },
    },
});
export const selectAuthSlice = (state) => state.authSlice;
export default authSlice.reducer;
export const { updateAccountData, updateToken } = authSlice.actions;

export const selectToken = createDraftSafeSelector(
    (state) => selectAuthSlice(state).accountData,
    (accountData) => {
        if (!accountData.token) return null;
        else return accountData.token;
    }
);

export const selectRole = createDraftSafeSelector(
    (state) => selectAuthSlice(state).accountData,
    (accountData) => {
        if (!accountData) return null;
        else return accountData?.role;
    }
);
