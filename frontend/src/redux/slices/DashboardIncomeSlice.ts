import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'
import api from '../../../utils/api'
import { getFilterParams } from '../../../utils/getFilterParams';
// const API_URL = import.meta.env.VITE_API_URL as string;


type Txn_Income = {
  source: string;
  date: string;
  amount: string;
  category: string;
  notes: string;
  icon?: string;
};


export const dashboardIncomes=createAsyncThunk(
    "dashboardIncomes",async (_,thunkAPI)=>{
        try{
            const state:any=thunkAPI.getState();
            const params=getFilterParams(state);
            const response =await api.get<Txn_Income[]>(`/income/transactions/`,{params});
            // console.log(response.data)
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)

interface totalState{
    dashboardIncome:Txn_Income[],
    loading:boolean,
    error:any
}

const initialState:totalState={
    dashboardIncome:[],
    loading:false,
    error:null
};

const DashboardIncomeSlice=createSlice({
    name:"DashboardIncome",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(dashboardIncomes.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(dashboardIncomes.fulfilled,(state,action)=>{
            state.dashboardIncome=action.payload;
            // console.log("action-",action.payload)
        })
        builder.addCase(dashboardIncomes.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default DashboardIncomeSlice.reducer