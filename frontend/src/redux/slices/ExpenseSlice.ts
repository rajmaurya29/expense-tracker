import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL as string;


export const expense=createAsyncThunk(
    "expense",async (_,thunkAPI)=>{
        try{
            const response= await axios.get(`${API_URL}/expense/`,
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
interface ExpenseItem {
  id: number;
  user: number;
  title: string;
  amount: string;       
  categoryName: string;
  date: string;       
  notes: string;
}

interface expenseState{
    userExpense:ExpenseItem[],
    loading:boolean,
    error:any
}

const initialState:expenseState={
    userExpense:[],
    loading:false,
    error:null
};

const ExpenseSlice=createSlice({
    name:"userExpense",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(expense.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(expense.fulfilled,(state,action)=>{
            state.userExpense=action.payload;
            // console.log("action-",action.payload)
        })
        builder.addCase(expense.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default ExpenseSlice.reducer