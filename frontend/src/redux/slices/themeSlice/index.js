import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isDarkMode: false,
};

export const checkTheme = createAsyncThunk("themeSlice/checkTheme", async(_, thunkAPI) => {
    const isDarkMode = localStorage.getItem("theme");
    console.log(isDarkMode);
    return (isDarkMode == "true");
});

const themeSlice = createSlice({
    name: "themeSlice",
    initialState: initialState,
    reducers: {
        triggerMode: (state, action) => {
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem("theme", state.isDarkMode);
        },
    },
    extraReducers: {
        [checkTheme.fulfilled]: (state, action) => {
            state.isDarkMode = action.payload;
            console.log(state.isDarkMode);
        }
    },
});
export const selectThemeSlice = (state) => state.themeSlice;
export default themeSlice.reducer;

export const { triggerMode } = themeSlice.actions;
