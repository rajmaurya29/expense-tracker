import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'
import api from '../../../utils/api'
import { getFilterParams } from '../../../utils/getFilterParams';
const API_URL = import.meta.env.VITE_API_URL as string;


export const createIncome=createAsyncThunk(
    "createIncome",async ({source,amount,categoryName,notes,date}:{source:string,amount:string,categoryName:string,notes:string,date:string},thunkAPI)=>{
        try{
            const state:any=thunkAPI.getState();
            const params=getFilterParams(state);
            const response= await api.post(`${API_URL}/income/`,{source,amount,category:categoryName,notes,date},
               {params}
            )
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)

interface IncomeState{
    income:any,
    loading:boolean,
    error:any
}

const initialState:IncomeState={
    income:[],
    loading:false,
    error:null
};

const CreateIncomeSlice=createSlice({
    name:"User",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(createIncome.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(createIncome.fulfilled,(state,action)=>{
            state.income=action.payload
        })
        builder.addCase(createIncome.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default CreateIncomeSlice.reducer