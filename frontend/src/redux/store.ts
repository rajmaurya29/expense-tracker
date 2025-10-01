import { configureStore } from '@reduxjs/toolkit'  
import sidebarSlice  from './slices/SidebarSlice';
import UserSlice from './slices/UserSlice'
import IncomeSlice from './slices/IncomeSlice';
import CreateIncomeSlice from './slices/CreateIncomeSlice';
import  CategoryIncomeSlice  from './slices/CategoryIncomeSlice';
import  ExpenseSlice  from './slices/ExpenseSlice';
import CreateExpenseSlice from './slices/CreateExpenseSlice';
import DeleteIncomeSlice  from './slices/DeleteIncomeSlice';
import DeleteExpenseSlice from './slices/DeleteExpenseSlice';
import  CategoryExpenseSlice  from './slices/CategoryExpenseSlice';
import TotalAmountSlice from './slices/TotalAmountSlice'
import RecentTotalSlice from './slices/RecentTotalSlice'
import  dashboardIncomes  from './slices/DashboardIncomeSlice';
import  dashboardExpenses  from './slices/DashboardExpenseSlice';
import  recentTransactions  from './slices/RecentTransactionSlice';
import  totalTransactions  from './slices/TotalTransactionSlice';

export const store=configureStore({
    reducer:{
        toggleSidbar:sidebarSlice,
        userInfo:UserSlice,
        userIncome:IncomeSlice,
        createIncome:CreateIncomeSlice,
        categoryIncome:CategoryIncomeSlice,
        createExpense:CreateExpenseSlice,
        userExpense:ExpenseSlice,
        deleteIncome:DeleteIncomeSlice,
        deleteExpense:DeleteExpenseSlice,
        categoryExpense:CategoryExpenseSlice,
        totalAmount:TotalAmountSlice,
        recentTotal:RecentTotalSlice,
        dashboardIncome:dashboardIncomes,
        dashboardExpense:dashboardExpenses,
        recentTransaction:recentTransactions,
        totalTransaction:totalTransactions
    }
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;