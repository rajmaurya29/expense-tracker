import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const createExpense=createAsyncThunk(
    "createExpense",async ({title,amount,categoryName,notes,date}:{title:string,amount:string,categoryName:string,notes:string,date:string},thunkAPI)=>{
        try{
            const response= await axios.post("http://127.0.0.1:8000/expense/create/",{title,amount,category:categoryName,notes,date},
               { withCredentials:true}
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

const CreateExpenseSlice=createSlice({
    name:"CreateExpense",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(createExpense.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(createExpense.fulfilled,(state,action)=>{
            state.expense=action.payload
        })
        builder.addCase(createExpense.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
    }
})

export default CreateExpenseSlice.reducer