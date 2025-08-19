import { configureStore } from '@reduxjs/toolkit'  
import sidebarSlice  from './slices/SidebarSlice';

export const store=configureStore({
    reducer:{
        toggleSidbar:sidebarSlice
    }
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;