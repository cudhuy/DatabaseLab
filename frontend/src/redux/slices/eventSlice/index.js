import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import Axios from "axios";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";

const client = Axios.create({
    // baseURL: "https://tinkerbell-garden.herokuapp.com",
    baseURL: process.env.REACT_APP_BASEURL
});

export const fetchEvent = createAsyncThunk("eventSliceV2/fetchEvent", async (_, { rejectWithValue }) => {
    try {
        const response = await client.get("/api/v1/event");
        console.log(response);
        if (response.data._id)
            return {
                title: response?.data?.title,
                url: response.data?.image?.url,
                discount: response.data?.discount,
                description: response.data?.description,
                _id: response.data?._id,
                start: new Date(response.data?.timeStart),
                duration: response.data?.duration,
            };
        else return null;
    } catch (err) {
        console.log(err);
        rejectWithValue(err.response);
    }
});

export const editEvent = createAsyncThunk(
    "eventSliceV2/editEvent",
    async ({ title, description, discount, imageSending, duration, eq, closeEditDialog }, thunkAPI) => {
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
            uploadData.append("discount", discount);
            uploadData.append("duration", duration);
            const response = await client.patch("/api/v1/event", uploadData, config);
            console.log(response);
            eq("Edit event successfully", SUCCESS_TOP_CENTER);
            closeEditDialog();
            return {
                title: response.data.event.title,
                url: response.data.event.image.url,
                discount: response.data.event.discount,
                description: response.data.event.description,
                _id: response.data.event._id,
                start: new Date(response.data.event.timeStart),
                duration: response.data.event.duration,
            };
        } catch (err) {
            console.log(err.response);
            eq(err.response.data.message, ERR_TOP_CENTER);
            return null;
        }
    }
);

export const createNewEvent = createAsyncThunk(
    "eventSliceV2/createNewEvent",
    async (
        { mailDailyCustomer, title, description, discount, imageSending, duration, eq, closeCreateDialog },
        thunkAPI
    ) => {
        try {
            const token = thunkAPI.getState().authSlice.accountData.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const uploadData = new FormData();
            uploadData.append("image", imageSending);
            uploadData.append("title", title);
            uploadData.append("description", description);
            uploadData.append("discount", discount);
            uploadData.append("duration", duration);
            const response = await client.post("/api/v1/event", uploadData, config);
            console.log(response);
            eq("Create new event successfully!", SUCCESS_TOP_CENTER);
            closeCreateDialog();
            return {
                title: response.data.title,
                url: response.data?.image?.url,
                discount: response.data.discount,
                description: response.data.description,
                _id: response.data._id,
                start: new Date(response.data.timeStart),
                duration: response.data.duration,
            };
        } catch (err) {
            console.log(err);
            eq(err.response.data.message, ERR_TOP_CENTER);
            return null;
        } finally {
            try {
                const token = thunkAPI.getState().authSlice.accountData.token;
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                if (mailDailyCustomer) {
                    await client.post("api/v1/event/sendmail", {}, config);
                    eq("Send email successfully!", SUCCESS_TOP_CENTER);
                }
            } catch (err) {
                console.log(err);
                eq(err.response.data.message, ERR_TOP_CENTER);
            }
        }
    }
);

export const deleteEvent = createAsyncThunk(
    "eventSliceV2/deleteEvent",
    async ({ eq, successDeleteEvent }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.accountData.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await client.delete("/api/v1/event", config);
            console.log(response);
            eq("Delete successfully!!!", SUCCESS_TOP_CENTER);
            successDeleteEvent();
            return response;
        } catch (err) {
            console.log(err);
            eq(err.response.data.message, ERR_TOP_CENTER);
            const event = thunkAPI.getState().reportSlice.event;
            return event;
        }
    }
);

const initialState = {
    event: null,
};

const eventSliceV2 = createSlice({
    name: "eventSliceV2",
    initialState: initialState,
    reducers: {
        resetEvent: (state, action) => {
            state.event = null;
        },
    },
    extraReducers: {
        [createNewEvent.fulfilled]: (state, action) => {
            state.event = action.payload;
        },
        [editEvent.fulfilled]: (state, action) => {
            state.event = action.payload;
        },
        [fetchEvent.fulfilled]: (state, action) => {
            state.event = action.payload;
        },
        [fetchEvent.rejected]: (state, action) => {
            state.event = null;
        },
        [deleteEvent.fulfilled]: (state, action) => {
            state.event = null;
        },
    },
});
export const selecteventSliceV2 = (state) => state.eventSliceV2;
export default eventSliceV2.reducer;

export const { resetEvent } = eventSliceV2.actions;
