import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL as string;


export const deleteIncome=createAsyncThunk(
    "deleteIncome",async (id:number,thunkAPI)=>{
        try{
            const response= await axios.delete(`${API_URL}/income/${id}`,
               { withCredentials:true}
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

const DeleteIncomeSlice=createSlice({
    name:"deleteIncome",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(deleteIncome.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(deleteIncome.fulfilled,(state,action)=>{
            state.income=action.payload
        })
        builder.addCase(deleteIncome.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default DeleteIncomeSlice.reducer