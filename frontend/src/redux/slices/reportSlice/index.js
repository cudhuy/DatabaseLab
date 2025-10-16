import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import Axios from "axios";
import { mergeObject } from "src/utils";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER, WARNING_TOP_CENTER } from "src/utils/snackbar-utils";
import { FS } from "src/redux/slices/other/constant";

const client = Axios.create({
    baseURL: process.env.REACT_APP_BASEURL,
});

export const fetchFirstTime = createAsyncThunk("reportSlice/fetchFirstTime", async (_, thunkAPI) => {
    await thunkAPI.dispatch(fetchReport({}));
});


export const fetchReport = createAsyncThunk("reportSlice/fetchReport", async (params, thunkAPI) => {
    try {
        const { start, end, listId = [], listStatus = [0, 1], search, sort = -1 } = params;
        var dateEnd;
        if (end) dateEnd = new Date(new Date(end).getTime() + 86400000);
        const res = await client
            .get(`/api/v1/maintainance/?listStatus=${JSON.stringify(listStatus)}`, {
                params: {
                    start,
                    end: dateEnd,
                    listId,
                    search,
                    sort,
                },
            })
            .then((res) => res.data);
        console.log(res.docs);
        return res.docs.map((item) => {
            return {
                title: item?.title,
                gameId: item?.gameId,
                description: item?.description,
                image: item?.url,
                state: item?.status,
                date: item?.date,
                id: item._id,
                type: item?.kind,
            };
        });
    } catch (err) {
        console.log(err);
    }
});

export const createNewReport = createAsyncThunk(
    "reportSlice/createNewReport",
    async ({ imageSending, title, description, eq, gameId }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.accountData.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const uploadData = new FormData();
            uploadData.append("image", imageSending);
            uploadData.append("title", title);
            uploadData.append("description", description);
            uploadData.append("gameId", gameId);
            console.log(uploadData);
            const response = await client.post("/api/v1/maintainance", uploadData, config);
            console.log(response);
            eq("Create new report successfully", SUCCESS_TOP_CENTER);
            return {
                title: response.data?.title,
                gameId: response.data?.gameId,
                description: response.data?.description,
                image: response.data?.image?.url,
                state: response.data?.status,
                date: response.data?.date,
                id: response.data._id,
            };
        } catch (err) {
            console.log(err);
            eq(err.response.data.message, ERR_TOP_CENTER);
            return err.response;
        }
    }
);

export const editReport = createAsyncThunk(
    "reportSlice/editReport",
    async ({ imageSending, title, description, eq, gameId, id, status = 0 }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.accountData.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const uploadData = new FormData();
            uploadData.append("image", imageSending);
            uploadData.append("title", title);
            uploadData.append("description", description);
            uploadData.append("gameId", gameId);
            uploadData.append("status", status);
            const response = await client.patch(`api/v1/maintainance/${id}`, uploadData, config);
            await thunkAPI.dispatch(fetchReport(thunkAPI.getState().reportSlice.reportConfig));
            eq("Edit report successfully!!", SUCCESS_TOP_CENTER);
            return;
        } catch (err) {
            console.log(err);
            eq(err.response.data.message, ERR_TOP_CENTER);
            return;
        }
    }
);

export const deleteReports = createAsyncThunk(
    "reportSlice/deleteReports",
    async ({ idList, eq, closeDialog, fetchData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.accountData.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            console.log(idList);
            await client.post("/api/v1/maintainance/delete", { listId: idList }, config);
            eq("Successfully delete report!!", SUCCESS_TOP_CENTER);
            fetchData();
            closeDialog();
            return;
        } catch (err) {
            console.log(err);
            eq(err.response.data?.message, ERR_TOP_CENTER);
            return;
        }
    }
);

const initialState = {
    fetchingStatus: FS.INITIAL,
    reports: [],
    reportConfig: {
        start: null,
        end: null,
        listId: [],
        listStatus: [0, 1],
        search: undefined,
        sort: -1,
    },
};

const reportSlice = createSlice({
    name: "reportSlice",
    initialState: initialState,
    reducers: {
        updateReportConfig: (state, action) => {
            state.reportConfig = mergeObject(state.reportConfig, action.payload);
            if (action.payload.start) {
                state.reportConfig.start = action.payload.start;
            }
            //mergeObject nó k chơi kiểu date
            if (action.payload.end) {
                state.reportConfig.end = action.payload.end;
            }
        },
    },
    extraReducers: {
        [fetchReport.fulfilled]: (state, action) => {
            state.reports = action.payload;
            state.fetchingStatus = FS.SUCCESS;
        },
        [fetchFirstTime.pending]: (state, action) => {
            state.fetchingStatus = FS.FETCHING;
        },
        [fetchReport.rejected]: (state, action) => {
            state.fetchingStatus = FS.FAIL;
        },
        [createNewReport.fulfilled]: (state, action) => {
            state.reports = [...state.reports, action.payload];
        },
    },
});

export const selectReportSlice = (state) => state.reportSlice;
export default reportSlice.reducer;
export const { updateReportConfig } = reportSlice.actions;

export const selectUnresolvedReport = createDraftSafeSelector(
    (state) => selectReportSlice(state).reports,
    (reports) => {
        if (reports.length == 0) return [];
        else return reports.filter((report) => report.state == 0);
    }
);
export const selectTypeReport = createDraftSafeSelector(
    [(state) => selectReportSlice(state).reports, (state, type) => type],
    (reports, type) => {
        if (reports.length == 0) return [];
        else return reports.filter((report) => report.type == type);
    }
);
