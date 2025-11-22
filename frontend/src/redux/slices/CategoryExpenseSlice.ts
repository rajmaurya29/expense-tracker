import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../../utils/api'
import { getFilterParams } from '../../../utils/getFilterParams';
// import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL as string;

export const categoryExpense=createAsyncThunk(
    "categoryExpense",async (_,thunkAPI)=>{
        try{
            const state:any=thunkAPI.getState();
            const params=getFilterParams(state);
            const response= await api.get(`${API_URL}/expense/expenseCategory/`,{params}
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