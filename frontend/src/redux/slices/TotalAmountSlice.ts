import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL as string;


type TTxn = {
  "total amount": any;
  "total income": any;
  "total expense": any;
};

export const totalAmount=createAsyncThunk(
    "totalAmount",async (_,thunkAPI)=>{
        try{
            const response= await axios.get<TTxn>(`${API_URL}/users/total/`, {
          withCredentials: true,
        });
            // console.log(response.data)
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)


interface totalState{
    amount:TTxn|null,
    loading:boolean,
    error:any
}

const initialState:totalState={
    amount:null,
    loading:false,
    error:null
};

const TotalAmountSlice=createSlice({
    name:"TotalAmount",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(totalAmount.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(totalAmount.fulfilled,(state,action)=>{
            state.amount=action.payload;
            // console.log("action-",action.payload)
        })
        builder.addCase(totalAmount.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default TotalAmountSlice.reducer