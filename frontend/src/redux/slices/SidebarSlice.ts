import { createSlice } from '@reduxjs/toolkit'


interface SidebarState{
    isOpen:boolean;
}

const initialState:SidebarState={
    isOpen:false
}
const sidebarSlice=createSlice({
    name:"Sidebar",
    initialState,
    reducers:{
        toggleSidebar:(state)=>{
            state.isOpen=!state.isOpen;
        },
        closeSidebar:(state)=>{
            state.isOpen=false;
        },
        openSidebar:(state)=>{
            state.isOpen=true;
        }
    }
})

export const {toggleSidebar,closeSidebar,openSidebar}=sidebarSlice.actions;
export default sidebarSlice.reducer;