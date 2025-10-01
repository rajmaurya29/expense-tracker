import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL as string;



export const totalTransactions=createAsyncThunk(
    "totalTransaction",async (_,thunkAPI)=>{
        try{
            const response =await axios.get<Txn[]>(`${API_URL}/users/transactions-total/`, {
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
    totalTransaction:Txn[],
    loading:boolean,
    error:any
}

const initialState:totalState={
    totalTransaction:[],
    loading:false,
    error:null
};

const TotalTransactionSlice=createSlice({
    name:"totalTransaction",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(totalTransactions.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(totalTransactions.fulfilled,(state,action)=>{
            state.totalTransaction=action.payload;
            // console.log("action-",action.payload)
        })
        builder.addCase(totalTransactions.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default TotalTransactionSlice.reducer