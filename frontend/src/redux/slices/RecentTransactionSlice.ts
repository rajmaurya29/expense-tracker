import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL as string;



export const recentTransactions=createAsyncThunk(
    "recentTransaction",async (_,thunkAPI)=>{
        try{
            const response =await axios.get<Txn[]>(`${API_URL}/users/transactions/?limit=10`, {
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



type Txn = {
  title: string;
  date: string;
  amount: string;
  category: string;
  notes: string;
  icon?: string;
};

interface totalState{
    recentTransaction:Txn[],
    loading:boolean,
    error:any
}

const initialState:totalState={
    recentTransaction:[],
    loading:false,
    error:null
};

const RecentTransactionSlice=createSlice({
    name:"recentTransaction",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(recentTransactions.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(recentTransactions.fulfilled,(state,action)=>{
            state.recentTransaction=action.payload;
            // console.log("action-",action.payload)
        })
        builder.addCase(recentTransactions.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default RecentTransactionSlice.reducer