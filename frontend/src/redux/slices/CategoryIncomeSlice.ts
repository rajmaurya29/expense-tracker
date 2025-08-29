import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const categoryIncome=createAsyncThunk(
    "categoryIncome",async (_,thunkAPI)=>{
        try{
            const response= await axios.get("http://127.0.0.1:8000/income/categoryIncome/",
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