import type {RootState} from "../src/redux/store";


export function getFilterParams(state:RootState){
        const {label,from,to}=state.filter || {};
        let fromDate=from?new Date(from):null;
        let toDate=to?new Date(to):null;
        let today=new Date();
        if(label=="last3months"){
            fromDate=new Date();
            fromDate.setMonth(today.getMonth()-3);
            toDate=today;
        }
        else if(label=="lastMonth"){
            fromDate=new Date();
            fromDate.setMonth(today.getMonth()-1);
            toDate=today;
        }
        else if(label=="all"){
            fromDate=toDate=null;
        }
        return {
            ...(fromDate ? {from:fromDate.toISOString().split("T")[0] }: {}),
            ...(toDate?{to:toDate.toISOString().split("T")[0] }: {}),
        }
}

