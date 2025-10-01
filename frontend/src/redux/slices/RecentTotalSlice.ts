import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL as string;



export const recentTotals=createAsyncThunk(
    "recentTotal",async (_,thunkAPI)=>{
        try{
            const response =await axios.get<Total[]>(`${API_URL}/users/recent-total/`, {
          withCredentials: true,
        });
            // console.log(response.data)
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)


type Total = {
  date: string;
  amount: string;
  total:string;
};
interface totalState{
    recentTotal:Total[],
    loading:boolean,
    error:any
}

const initialState:totalState={
    recentTotal:[],
    loading:false,
    error:null
};

const RecentTotalSlice=createSlice({
    name:"RecentTotal",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(recentTotals.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(recentTotals.fulfilled,(state,action)=>{
            state.recentTotal=action.payload;
            // console.log("action-",action.payload)
        })
        builder.addCase(recentTotals.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default RecentTotalSlice.reducer