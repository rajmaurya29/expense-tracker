import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import type { ChartData, ChartOptions, TooltipItem } from "chart.js";
import { MdArrowOutward } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import RecentTransactionComponent from "./RecentTransactionComponent";
import PiechartIncome from "../components/PiechartIncome";
// import DownloadCSV from "../components/DownloadCSV";
const API_URL = import.meta.env.VITE_API_URL as string;

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

type Txn = {
  title: string;
  date: string;
  amount: string;
  category: string;
  notes: string;
  icon?: string;
};

type Total = {
  date: string;
  amount: string;
  total:string;
};

type Txn_Income = {
  source: string;
  date: string;
  amount: string;
  category: string;
  notes: string;
  icon?: string;
};

type TTxn = {
  "total amount": any;
  "total income": any;
  "total expense": any;
};

const inr = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const currency = (n: number) => inr.format(n);
const doughnutColors = ["#7c3aed", "#fb923c", "#ef4444"];

const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [totalBalance, setTotalBalance] = useState("");
  const [totalIncome, setTotalIncome] = useState("");
  const [totalExpenses, setTotalExpenses] = useState("");
  // const [recentTxns, setRecentTxns] = useState<Txn[]>([]);
  const [recentTotal, setRecentTotal] = useState<Total[]>([]);
  const [incomeList, setIncomeList] = useState<Txn_Income[]>([]);
  const [expenseList, setExpenseList] = useState<Txn[]>([]);
  const userSelector = useSelector((s: RootState) => s.userInfo);

  useEffect(() => {
    if (!userSelector.userInfo) navigate("/login");
  }, [userSelector.userInfo, navigate]);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await axios.get<TTxn>(`${API_URL}/users/total/`, {
          withCredentials: true,
        });
        setTotalBalance(String(res.data["total amount"] ?? 0));
        setTotalIncome(String(res.data["total income"] ?? 0));
        setTotalExpenses(String(res.data["total expense"] ?? 0));
      } catch (error) {
        console.log(error);
      }
    };
    fetchTotal();
  }, []);

  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     try {
  //       const res = await axios.get<Txn[]>("http://127.0.0.1:8000/users/transactions/", {
  //         withCredentials: true,
  //       });
  //       setRecentTxns(res.data ?? []);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchTransactions();
  // }, []);

  
  useEffect(() => {
    const fetchTotal= async () => {
      try {
        const res = await axios.get<Total[]>(`${API_URL}/users/recent-total/`, {
          withCredentials: true,
        });
        setRecentTotal(res.data ?? []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTotal();
  }, []);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const res = await axios.get<Txn_Income[]>(`${API_URL}/income/transactions/`, {
          withCredentials: true,
        });
        setIncomeList(res.data ?? []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchIncome();
  }, []);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get<Txn[]>(`${API_URL}/expense/transactions/`, {
          withCredentials: true,
        });
        setExpenseList(res.data ?? []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchExpense();
  }, []);

  const kpi = useMemo(
    () => ({
      balance: totalBalance,
      income: totalIncome,
      expenses: totalExpenses,
    }),
    [totalBalance, totalIncome, totalExpenses]
  );

  // Line: use returned recentTxns (labels + signed values)
  const lineData: ChartData<"line"> = useMemo(() => {
    
    const labels = recentTotal.map((t) => t.date);
    const values = recentTotal.map((t) => Number(t.total) || 0);
    const safeLabels = labels.length ? labels : [new Date().toISOString().slice(0, 10)];
    const safeValues = values.length ? values : [1];
    return {
      labels: safeLabels,
      datasets: [
        {
          label: "Total Amount",
          data: safeValues,
          borderColor: "#7c3aed",
          backgroundColor: "rgba(124, 58, 237, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#7c3aed",
          borderWidth: 3,
        },
      ],
    };
  }, [recentTotal]);

  const lineOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { color: "#374151", font: { size: 13, weight: "bold" } },
        },
        title: {
          display: true,
          text: "Last 10 total over Time",
          color: "#111827",
          font: { size: 17, weight: "bold" },
          padding: { top: 6, bottom: 12 },
        },
        tooltip: {
          callbacks: {
            label: (ctx: TooltipItem<"line">) =>
              ` ${ctx.dataset.label}: ${currency(Number(ctx.parsed.y) || 0)}`,
          },
        },
      },
      elements: {
        line: { borderWidth: 3 },
        point: { radius: 4, hoverRadius: 6 },
      },
      scales: {
        x: {
          title: { display: true, text: "Date", color: "#374151" },
          grid: { color: "#e5e7eb" },
          ticks: { color: "#6b7280" },
        },
        y: {
          title: { display: true, text: "Amount (INR)", color: "#374151" },
          beginAtZero: false,
          grid: { color: "#e5e7eb" },
          ticks: {
            callback: (val) => currency(Number(val)),
            color: "#6b7280",
          },
        },
      },
    }),
    []
  );

  const doughnutData: ChartData<"doughnut"> = useMemo(() => {
    const values = [kpi.balance, kpi.income, kpi.expenses];
    return {
      labels: ["Total Balance", "Total Income", "Total Expenses"],
      datasets: [
        {
          data: values.map((v) => Math.max(0, Number(v) || 0)),
          backgroundColor: doughnutColors,
          borderColor: "#ffffff",
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    };
  }, [kpi]);

  const doughnutOptions: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "64%",
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
          backgroundColor: "#111827",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 10,
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${currency(Number(ctx.parsed) || 0)}`,
          },
        },
      },
    }),
    []
  );

  // const leftRecent = recentTxns.slice(0, 5);
  // const rightRecent = recentTxns.slice(5, 10);

  return (
    <div className="page-wrap page-lg">
     
      {/* TOP: Left = Line, Right = Doughnut */}
      <section className="card card-elevated card-lg">
        <div className="grid-split">
          <div className="chart-left">
            <div className="chartjs-box h-320">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
          <div className="chart-right">
            <div className="doughnut-wrap">
              <div className="doughnut-box h-320 max-w-460">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="doughnut-center">
                  <div className="center-title-pie">Total Balance- {currency(Number(totalBalance) || 0)}</div>
                  {/* <div className="center-value-pie">{currency(Number(totalBalance) || 0)}</div> */}
                </div>
              </div>
              <ul className="legend">
                <li><span className="dot" style={{ background: "#7c3aed" }} /> Total Balance</li>
                <li><span className="dot" style={{ background: "#fb923c" }} /> Total Income</li>
                <li><span className="dot" style={{ background: "#ef4444" }} /> Total Expenses</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="card card-elevated card-lg section-tight">
        <div className="kpi-grid kpi-grid-balanced">
          <div className="kpi-card">
            <div className="kpi-icon kpi-purple">💳</div>
            <div className="kpi-meta">
              <div className="kpi-title">Total Balance</div>
              <div className="kpi-value">{currency(Number(totalBalance) || 0)}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon kpi-orange">🧾</div>
            <div className="kpi-meta">
              <div className="kpi-title">Total Income</div>
              <div className="kpi-value">{currency(Number(totalIncome) || 0)}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon kpi-red">💸</div>
            <div className="kpi-meta">
              <div className="kpi-title">Total Expenses</div>
              <div className="kpi-value">{currency(Number(totalExpenses) || 0)}</div>
            </div>
          </div>
        </div>
      </section>

     <RecentTransactionComponent/>
      {/* Bottom: Incomes | Expenses equal halves */}
      <section className="card card-elevated card-lg">
        <div className="grid-split">
          {/* Incomes */}
          <div className="col">
            <div className="list-head">
              <h3 className="card-title">Incomes</h3>
              {/* <DownloadCSV/> */}
              
              <button className="btn btn-outline btn-xs" onClick={()=>navigate("/")}>
                See all <MdArrowOutward size={14} />
              </button>
            </div>
            <ul className="dash-list dense list-fixed">
              {incomeList.map((t, i) => {
                const amt = Number(t.amount) || 0;
                const isPositive = amt >= 0;
                return (
                  <li key={`inc-${i}`} className="dash-row row-tight">
                    <div className="dash-left-row">
                      <div className="dash-avatar" aria-hidden>
                        <span className="dash-emoji">{t.icon || "🧾"}</span>
                      </div>
                      <div>
                        <div className="dash-title">{t.source}</div>
                        <div className="dash-sub">{t.date}</div>
                      </div>
                    </div>
                    <div className={`dash-amt ${!isPositive ? "down" : "up"}`}>
                      {isPositive ? "+ " : "− "}
                      {currency(Math.abs(amt))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Expenses */}
          <div className="col">
            <div className="list-head">
              <h3 className="card-title">Expenses</h3>
              <button className="btn btn-outline btn-xs">
                See all <MdArrowOutward size={14} />
              </button>
            </div>
            <ul className="dash-list dense list-fixed">
              {expenseList.map((t, i) => {
                const amt = Number(t.amount) || 0;
                return (
                  <li key={`exp-${i}`} className="dash-row row-tight">
                    <div className="dash-left-row">
                      <div className="dash-avatar" aria-hidden>
                        <span className="dash-emoji">{t.icon || "🧾"}</span>
                      </div>
                      <div>
                        <div className="dash-title">{t.title}</div>
                        <div className="dash-sub">{t.date}</div>
                      </div>
                    </div>
                    <div className={`dash-amt ${"down"}`}>− {currency(Math.abs(amt))}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardScreen;
