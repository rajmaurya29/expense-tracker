import type {RootState} from "../src/redux/store";



export function getFilterParams(state:RootState){
        // const selector=useSelector((s:RootState)=>s.filter);
        const {label,from,to}=state.filter || {};
        let fromDate=from?new Date(from):null;
        let toDate=to?new Date(to):null;
        let today=new Date();
        if(label=="Last 3 Months"){
            fromDate=new Date();
            fromDate.setMonth(today.getMonth()-3);
            toDate=today;
        }
        else if(label=="Last Month"){
            fromDate=new Date();
            fromDate.setMonth(today.getMonth()-1);
            toDate=today;
            // console.log(fromDate.toISOString())
        }
        else if(label=="All"){
            fromDate=toDate=null;
        }
        else if(label== "Custom Range"){
            // console.log("work");
            fromDate=state.filter.from?new Date(state.filter.from):null;
            toDate=state.filter.to?new Date(state.filter.to):null;
        }
        return {
            ...(fromDate ? {from:fromDate.toISOString().split("T")[0] }: {}),
            ...(toDate?{to:toDate.toISOString().split("T")[0] }: {}),
        }
}

