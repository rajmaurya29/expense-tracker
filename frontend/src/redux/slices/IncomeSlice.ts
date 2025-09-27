import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL as string;


export const income=createAsyncThunk(
    "income",async (_,thunkAPI)=>{
        try{
            const response= await axios.get(`${API_URL}/income/get/`,
               { "withCredentials":true}
            )
            // console.log(response.data)
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)
interface IncomeItem {
  id: number;
  user: number;
  source: string;
  amount: string;       
  categoryName: string;
  date: string;       
  notes: string;
}

interface incomeState{
    userIncome:IncomeItem[],
    loading:boolean,
    error:any
}

const initialState:incomeState={
    userIncome:[],
    loading:false,
    error:null
};

const IncomeSlice=createSlice({
    name:"UserIncome",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(income.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(income.fulfilled,(state,action)=>{
            state.userIncome=action.payload;
            // console.log("action-",action.payload)
        })
        builder.addCase(income.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default IncomeSlice.reducer