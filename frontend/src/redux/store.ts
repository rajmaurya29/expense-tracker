import { configureStore } from '@reduxjs/toolkit'  
import sidebarSlice  from './slices/SidebarSlice';
import UserSlice from './slices/UserSlice'
import IncomeSlice from './slices/IncomeSlice';
import CreateIncomeSlice from './slices/CreateIncomeSlice';
import  CategoryIncomeSlice  from './slices/CategoryIncomeSlice';
export const store=configureStore({
    reducer:{
        toggleSidbar:sidebarSlice,
        userInfo:UserSlice,
        userIncome:IncomeSlice,
        createIncome:CreateIncomeSlice,
        categoryIncome:CategoryIncomeSlice
    }
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;