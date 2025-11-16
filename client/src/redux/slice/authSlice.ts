import { axiosClient } from "@/helper/axiosClient";
import type { IUser } from "@/types/user";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const register = createAsyncThunk("auth/register", async (formData: FormData, thunkApi) => {
    try {
        const response = await axiosClient.post("/auth/register", formData);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          error.response?.data?.detail || "Registration failed"
        );
      }
    }
})


export const login = createAsyncThunk("auth/login", async (formData: FormData, thunkApi) => {
    try {
        const response = await axiosClient.post("/auth/login", formData);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          error.response?.data?.detail || "Registration failed"
        );
      }
    }
})


export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
    try {
        const response = await axiosClient.post("/auth/logout");
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          error.response?.data?.detail || "Registration failed"
        );
      }
    }
})


export const currentUser = createAsyncThunk("auth/currentUser", async (_, thunkApi) => {
    try {
        const response = await axiosClient.get("/auth/me");
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          error.response?.data?.detail || "Registration failed"
        );
      }
    }
})


interface AuthState {
    user: IUser | null;
    loading: boolean;
    error: string | null;
}


const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })

        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        builder.addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
        })
        builder.addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        builder.addCase(currentUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        builder.addCase(currentUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })

        builder.addCase(currentUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    }
});

export const authReducer = authSlice.reducer;