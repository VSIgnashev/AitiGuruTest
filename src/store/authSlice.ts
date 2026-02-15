import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type {User} from "../types.ts";
import api from "../api.ts";
import type {AxiosError} from "axios";
import type {PayloadAction} from "@reduxjs/toolkit";


interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}


interface LoginPayload {
  login: string;
  password: string;
  rememberMe: boolean;
}


interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}


const getStoredToken = (): string | null => {
  return sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
}

const getStoredUser = (): User | null => {
  const user = sessionStorage.getItem("user") || localStorage.getItem("user");
  return user ? (JSON.parse(user) as User) : null;

};


const initialState: AuthState = {
  user: getStoredUser(),
  accessToken: getStoredToken(),
  refreshToken:
    sessionStorage.getItem("refreshToken") || localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!getStoredToken(),
  loading: false,
  error: null
};

export const login = createAsyncThunk<LoginResponse, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload, thunkAPI) => {
    try {


      const body: LoginRequest = {
        username: payload.login,
        password: payload.password
      }

      const res = await api.post<LoginResponse>("/auth/login", body);


      const storage = payload.rememberMe ? localStorage : sessionStorage;
      storage.setItem("accessToken", res.data.accessToken);
      storage.setItem("refreshToken", res.data.refreshToken);
      storage.setItem("user", JSON.stringify(res.data.user));

      return res.data;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const message = axiosErr.response?.data?.message ?? axiosErr.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk<void, void>("auth/logout", async () => {
  sessionStorage.clear();
  localStorage.clear();
});


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Login failed";
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });

  }
})

export default authSlice.reducer;