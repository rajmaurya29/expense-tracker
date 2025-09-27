import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL as string;

export const categoryExpense=createAsyncThunk(
    "categoryExpense",async (_,thunkAPI)=>{
        try{
            const response= await axios.get(`${API_URL}/expense/expenseCategory/`,
               { withCredentials:true}
            )
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)

interface CategoryExpenseState{
    expense:any,
    loading:boolean,
    error:any
}

const initialState:CategoryExpenseState={
    expense:[],
    loading:false,
    error:null
};

const CategoryExpenseSlice=createSlice({
    name:"CategoryExpense",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(categoryExpense.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(categoryExpense.fulfilled,(state,action)=>{
            state.expense=action.payload
        })
        builder.addCase(categoryExpense.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default CategoryExpenseSlice.reducer