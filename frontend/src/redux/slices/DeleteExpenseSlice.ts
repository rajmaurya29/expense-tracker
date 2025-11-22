import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'
import api from '../../../utils/api'
import { getFilterParams } from '../../../utils/getFilterParams';
const API_URL = import.meta.env.VITE_API_URL as string;


export const deleteExpense=createAsyncThunk(
    "deleteExpense",async (id:number,thunkAPI)=>{
        try{
            const state:any=thunkAPI.getState();
            const params=getFilterParams(state);
            const response= await api.delete(`${API_URL}/expense/${id}`,
               { params}
            )
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)

interface ExpenseState{
    expense:any,
    loading:boolean,
    error:any
}

const initialState:ExpenseState={
    expense:[],
    loading:false,
    error:null
};

const DeleteExpenseSlice=createSlice({
    name:"deleteExpense",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(deleteExpense.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(deleteExpense.fulfilled,(state,action)=>{
            state.expense=action.payload
        })
        builder.addCase(deleteExpense.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default DeleteExpenseSlice.reducer