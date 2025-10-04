import  { useEffect, useState, useMemo } from "react";
import type { RootState, AppDispatch } from "../redux/store";
import { useSelector,useDispatch } from "react-redux";
import { MdArrowOutward } from "react-icons/md";
import { recentTransactions } from "../redux/slices/RecentTransactionSlice";
import { totalTransactions } from "../redux/slices/TotalTransactionSlice";
const API_URL = import.meta.env.VITE_API_URL as string;

type Txn = {
  title: string;
  date: string;
  amount: string;
  category: string;
  notes: string;
  icon?: string;
};

type FetchState = { loading: boolean; error: string | null };

const inr = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const currency = (n: number) => inr.format(n);

function RecentTransactionComponent() {
  const dispatch=useDispatch<AppDispatch>();
  const [initialTxns, setInitialTxns] = useState<Txn[]>([]);
  const [allTxns, setAllTxns] = useState<Txn[] | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  const [initialState, setInitialState] = useState<FetchState>({ loading: true, error: null });
  const [allState, setAllState] = useState<FetchState>({ loading: false, error: null });
  const recentTransactionSelector=useSelector((s:RootState)=>s.recentTransaction)
  const totalTransactionSelector=useSelector((s:RootState)=>s.totalTransaction)

  useEffect(()=>{
    if(recentTransactionSelector.recentTransaction.length==0)
    dispatch(recentTransactions())
  },[dispatch,recentTransactionSelector])


  useEffect(() => {
    let abort = false;
    const fetchInitial = async () => {
      setInitialState({ loading: true, error: null });
      try {
        
        
        if (abort) return;
        const list = Array.isArray(recentTransactionSelector.recentTransaction) ? recentTransactionSelector.recentTransaction: [];
        // console.log(recentTransactionSelector)
        setInitialTxns(list.slice(0, 10));
        setInitialState({ loading: false, error: null });
      } catch (err: any) {
        if (abort) return;
        setInitialTxns([]);
        setInitialState({
          loading: false,
          error: err?.message || "Failed to load transactions",
        });
      }
    };
    fetchInitial();
    return () => {
      abort = true;
    };
  }, [recentTransactionSelector]);

  const handleToggle = async () => {
    if (!expanded) {
      // console.log(allTxns)
      if (allTxns && allTxns.length==0) {
        
        setAllState({ loading: true, error: null });
        dispatch(totalTransactions());
        
      }
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  useEffect(()=>{
    if(totalTransactionSelector.totalTransaction){
      setAllTxns(totalTransactionSelector.totalTransaction);
          setAllState({ loading: false, error: null });
    }

  },[totalTransactionSelector.totalTransaction])


  const showLoading =
    (!expanded && initialState.loading) || (expanded && allState.loading);
  const showError =
    (!expanded && initialState.error) || (expanded && allState.error);

  const displayedTxns = expanded ? allTxns ?? initialTxns : initialTxns;

  const mid = Math.ceil(displayedTxns.length / 2);
  const leftRecent = useMemo(() => displayedTxns.slice(0, mid), [displayedTxns]);
  const rightRecent = useMemo(() => displayedTxns.slice(mid), [displayedTxns]);

  return (
    <section className="card card-elevated card-lg recent-card">
      {/* unified header row */}
      <div className="recent-header">
        <h3 className="card-title">Recent Transactions</h3>
        <div>
          <a
          href={`${API_URL}/users/transactions/csv/`}
          download
          className="btn btn-outline btn-xs-download see-all-btn"
        >
          Download CSV
        </a>
        <button
          className="btn btn-outline btn-xs see-all-btn"
          onClick={handleToggle}
          disabled={showLoading}
          aria-expanded={expanded}
        >
          {expanded ? "Close" : "See all"} <MdArrowOutward size={14} />
        </button>
        </div>
      </div>

      {/* content area with two columns that collapse on mobile */}
      <div className="recent-grid">
        <div className="col">
          {showLoading ? (
            <div className="dash-placeholder">Loading...</div>
          ) : showError ? (
            <div className="dash-error">{showError}</div>
          ) : (
            <ul className="dash-list dense list-fixed">
              {leftRecent.map((t, i) => {
                const amt = Number(t.amount) || 0;
                const isExpense = amt < 0;
                return (
                  <li key={`l-${i}`} className="dash-row row-tight">
                    <div className="dash-left-row">
                      <div className="dash-avatar" aria-hidden>
                        <span className="dash-emoji">{t.icon || "🧾"}</span>
                      </div>
                      <div>
                        <div className="dash-title">{t.title}</div>
                        <div className="dash-sub">{t.date}</div>
                      </div>
                    </div>
                    <div className={`dash-amt ${isExpense ? "down" : "up"}`}>
                      {isExpense ? "− " : "+ "}
                      {currency(Math.abs(amt))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="col">
          {showLoading ? (
            <div className="dash-placeholder">Loading...</div>
          ) : showError ? (
            <div className="dash-error">{showError}</div>
          ) : (
            <ul className="dash-list dense list-fixed">
              {rightRecent.map((t, i) => {
                const amt = Number(t.amount) || 0;
                const isExpense = amt < 0;
                return (
                  <li key={`r-${i}`} className="dash-row row-tight">
                    <div className="dash-left-row">
                      <div className="dash-avatar" aria-hidden>
                        <span className="dash-emoji">{t.icon || "🧾"}</span>
                      </div>
                      <div>
                        <div className="dash-title">{t.title}</div>
                        <div className="dash-sub">{t.date}</div>
                      </div>
                    </div>
                    <div className={`dash-amt ${isExpense ? "down" : "up"}`}>
                      {isExpense ? "− " : "+ "}
                      {currency(Math.abs(amt))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default RecentTransactionComponent;
