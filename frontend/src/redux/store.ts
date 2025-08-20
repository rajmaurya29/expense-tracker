import { configureStore } from '@reduxjs/toolkit'  
import sidebarSlice  from './slices/SidebarSlice';
import UserSlice from './slices/UserSlice'

export const store=configureStore({
    reducer:{
        toggleSidbar:sidebarSlice,
        userInfo:UserSlice
    }
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;