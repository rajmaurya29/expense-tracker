import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'
import api from '../../../utils/api'
import { getFilterParams } from '../../../utils/getFilterParams';

const API_URL = import.meta.env.VITE_API_URL as string;


type Txn = {
  title: string;
  date: string;
  amount: string;
  category: string;
  notes: string;
  icon?: string;
};



export const dashboardExpenses=createAsyncThunk(
    "dashboardExpenses",async (_,thunkAPI)=>{
        try{
            const state:any=thunkAPI.getState();
            const params=getFilterParams(state);
            const response =await api.get<Txn[]>(`${API_URL}/expense/transactions/`, {params});
            // console.log(response.data)
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)

interface expenseState{
    dashboardExpense:Txn[],
    loading:boolean,
    error:any
}

const initialState:expenseState={
    dashboardExpense:[],
    loading:false,
    error:null
};

const DashboardExpenseSlice=createSlice({
    name:"dashboardExpense",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(dashboardExpenses.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(dashboardExpenses.fulfilled,(state,action)=>{
            state.dashboardExpense=action.payload;
            // console.log("action-",action.payload)
        })
        builder.addCase(dashboardExpenses.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default DashboardExpenseSlice.reducer