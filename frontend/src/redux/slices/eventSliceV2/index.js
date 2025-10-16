import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import Axios from "axios";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER } from "src/utils/snackbar-utils";

const client = Axios.create({
    baseURL: process.env.REACT_APP_BASEURL
});

export const fetchEvent = createAsyncThunk("eventSliceV2/fetchEvent", async (_, thunkAPI) => {
    try {
        const response = await client.get("/api/v1/event/new");
        const response2 = await client.get("/api/v1/event/running");
        console.log(response);
        console.log(response2);
        console.log(response.data[0]?.startBookingTime);
        return response2.data.map((d) => ({
            image: d?.url,
            title: d?.title,
            description: d?.description,
            id: d?.id,
            discount: d?.discount,
            startBookingTime: d?.startBookingTime,
            endBookingTime: d?.endBookingTime,
            startTime: d?.startTime,
            endTime: d?.endTime,
            isStop: d?.isStop,
        })).concat(response.data.map((d) => ({
            image: d?.url,
            title: d?.title,
            description: d?.description,
            id: d?.id,
            discount: d?.discount,
            startBookingTime: d?.startBookingTime,
            endBookingTime: d?.endBookingTime,
            startTime: d?.startTime,
            endTime: d?.endTime,
            isStop: false,
        })));
    } catch (err) {
        console.log(err);
        return null;
    }
});

export const startEvent = createAsyncThunk(
    "eventSliceV2/startEvent",
    async ({ eq, startBookingTime, endBookingTime, startTime, endTime, id, finishStartEvent }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.accountData.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await client.patch(
                `/api/v1/event/${id}`,
                { meta: { startBookingTime, endBookingTime, startTime, endTime } },
                config
            );
            console.log(response);
            await thunkAPI.dispatch(fetchEvent());
            eq("Event started!", SUCCESS_TOP_CENTER);
            finishStartEvent();
            return;
        } catch (err) {
            console.log(err.response);
            eq(err.response.data.message, ERR_TOP_CENTER);
            return;
        }
    }
);

export const editEvent = createAsyncThunk(
    "eventSliceV2/editEvent",
    async ({ title, description, discount, imageSending, id, eq, closeDialog, newEvent = true }, thunkAPI) => {
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
            uploadData.append("title", title);
            const response = await client.patch(`/api/v1/event/${id}`, uploadData, config);
            await thunkAPI.dispatch(fetchEvent());
            console.log(response);
            eq("Edit event successfully", SUCCESS_TOP_CENTER);
            console.log(response);
            closeDialog();
            return;
        } catch (err) {
            console.log(err.response);
            eq(err.response.data.message, ERR_TOP_CENTER);
            return;
        }
    }
);

export const createNewEvent = createAsyncThunk(
    "eventSliceV2/createNewEvent",
    async ({ title, description, discount, imageSending, eq, closeCreateDialog }, thunkAPI) => {
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
            const response = await client.post("/api/v1/event", uploadData, config);
            console.log(response);
            eq("Create new event successfully!", SUCCESS_TOP_CENTER);
            closeCreateDialog();
            return {
                image: response?.data?.image?.url,
                title: response?.data?.title,
                description: response?.data?.description,
                id: response?.data?._id,
                discount: response?.data?.discount,
                startBookingTime: null,
                endBookingTime: null,
                startTime: null,
                endTime: null,
                isStop: null,
            };
        } catch (err) {
            console.log(err);
            eq(err.response.data.message, ERR_TOP_CENTER);
            return null;
        }
    }
);

export const deleteEvent = createAsyncThunk("eventSliceV2/deleteEvent", async ({ eq, id }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await client.delete(`/api/v1/event/new/${id}`, config);
        console.log(response);
        await thunkAPI.dispatch(fetchEvent());
        eq("Delete successfully!!!", SUCCESS_TOP_CENTER);
        return { id };
    } catch (err) {
        console.log(err);
        eq(err.response.data.message, ERR_TOP_CENTER);
        return null;
    }
});

export const stopEvent = createAsyncThunk("eventSliceV2/stopEvent", async ({ eq, id, closeDialog }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().authSlice.accountData.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await client.patch(`api/v1/event/${id}/stop`, config);
        console.log(response);
        eq("Stop event successfully!!!", SUCCESS_TOP_CENTER);
        closeDialog();
        return { id };
    } catch (err) {
        console.log(err);
        eq(err.response.data.message, ERR_TOP_CENTER);
        return null;
    }
});

export const deleteRunningEvent = createAsyncThunk(
    "eventSliceV2/deleteRunningEvent",
    async ({ eq, id, closeDialog }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().authSlice.accountData.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await client.delete(`/api/v1/event/running/${id}`, config);
            console.log(response);
            eq("Delete successfully!!!", SUCCESS_TOP_CENTER);
            closeDialog();
            return { id };
        } catch (err) {
            console.log(err);
            eq(err.response.data.message, ERR_TOP_CENTER);
            return null;
        }
    }
);

const initialState = {
    event: [],
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
        [fetchEvent.fulfilled]: (state, action) => {
            state.event = action.payload;
        },
        [fetchEvent.rejected]: (state, action) => {
            state.event = null;
        },
        [createNewEvent.fulfilled]: (state, action) => {
            state.event = [...state.event, action.payload];
        },
        // [startEvent.fulfilled]: (state, action) => {
        //     if (action.payload?.id) {
        //         state.event = state.event.map((ele) => {
        //             if (ele.id != action.payload.id) {
        //                 return ele;
        //             }
        //             const data = {
        //                 ...ele,
        //                 ...action.payload,
        //             };
        //             return data;
        //         });
        //     }
        // },
        // [editEvent.fulfilled]: (state, action) => {
        //     if (action.payload?.id) {
        //         state.event = state.event.map((ele) => {
        //             if (ele.id != action.payload.id) {
        //                 return ele;
        //             }
        //             const data = {
        //                 ...action.payload,
        //             };
        //             return data;
        //         });
        //     }
        // },
        [deleteRunningEvent.fulfilled]: (state, action) => {
            if (action.payload?.id) {
                state.event = state.event.map((ele) => {
                    if (ele.id != action.payload.id) {
                        return ele;
                    }
                    return {
                        ...ele,
                        startBookingTime: null,
                        endBookingTime: null,
                        startTime: null,
                        endTime: null,
                        isStop: null,
                        isDeleted: true,
                    };
                });
            }
        },
        [stopEvent.fulfilled]: (state, action) => {
            if (action.payload?.id) {
                state.event = state.event.map((ele) => {
                    if (ele.id != action.payload.id) {
                        return ele;
                    }
                    return {
                        ...ele,
                        isStop: true,
                    };
                });
            }
        },
    },
});
export const selecteventSliceV2 = (state) => state.eventSliceV2;
export default eventSliceV2.reducer;

export const { resetEvent } = eventSliceV2.actions;

export const selectAllEvent = createDraftSafeSelector(
    (state) => selecteventSliceV2(state).event,
    (e) => {
        if (!e) return null;
        else
            return e.filter((d) => {
                return !d.startTime;
            });
    }
);

export const selectRunningEvent = createDraftSafeSelector(
    (state) => selecteventSliceV2(state).event,
    (e) => {
        if (!e) return null;
        else return e.filter((d) => d.startTime);
    }
);
