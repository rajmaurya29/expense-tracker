import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const deleteIncome=createAsyncThunk(
    "deleteIncome",async ({source,amount,categoryName,notes,date}:{source:string,amount:string,categoryName:string,notes:string,date:string},thunkAPI)=>{
        try{
            const response= await axios.post("http://127.0.0.1:8000/income/create/",{source,amount,category:categoryName,notes,date},
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