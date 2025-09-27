import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL as string;


export const categoryIncome=createAsyncThunk(
    "categoryIncome",async (_,thunkAPI)=>{
        try{
            const response= await axios.get(`${API_URL}/income/categoryIncome/`,
               { withCredentials:true}
            )
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)

interface CategoryIncomeState{
    income:any,
    loading:boolean,
    error:any
}

const initialState:CategoryIncomeState={
    income:[],
    loading:false,
    error:null
};

const CategoryIncomeSlice=createSlice({
    name:"CategoryIncome",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(categoryIncome.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(categoryIncome.fulfilled,(state,action)=>{
            state.income=action.payload
        })
        builder.addCase(categoryIncome.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default CategoryIncomeSlice.reducer