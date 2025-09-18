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
import type { ChartData, ChartOptions } from "chart.js";
import { MdArrowOutward } from "react-icons/md";

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
  // id: string | number;
  title: string;
  date: string;
  amount: string;
  category:string;
  notes:string;
  icon?: string;
};

type TTxn = {
  // id: string | number;
  total: string;
  income: string;
  expense: string;
};
// KPIs (mock)
// const totalBalance = 91100;
// const totalIncome = 98200;
// const totalExpenses = 7100;


// Lists (mock)



// const recentTxns: Txn[] = [
// {
//         "title": "rent",
//         "amount": "239.00",
//         "category": "Housing",
//         "date": "2025-09-02",
//         "notes": "no"
//     }  // {  title: "Travel", date: "13th Feb 2025", amount: -670, icon: "✈️" },
//   // { id: "t3", title: "Salary", date: "12th Feb 2025", amount: 12000, icon: "💼" },
//   // { id: "t4", title: "Electricity Bill", date: "11th Feb 2025", amount: -200, icon: "💡" },
//   // { id: "t5", title: "Loan Repayment", date: "10th Feb 2025", amount: -600, icon: "🏦" },
//   // { id: "t6", title: "Snacks", date: "09th Feb 2025", amount: -25, icon: "🍪" },
//   // { id: "t7", title: "Freelance", date: "08th Feb 2025", amount: 950, icon: "🧾" },
//   // { id: "t8", title: "Dividends", date: "05th Feb 2025", amount: 320, icon: "🏦" },
//   // { id: "t9", title: "Fuel", date: "04th Feb 2025", amount: -70, icon: "⛽" },
//   // { id: "t10", title: "Groceries", date: "02nd Feb 2025", amount: -120, icon: "🛒" },
// ];

// const incomeList: Txn[] = [
// {
//         "title": "rent",
//         "amount": "-239.00",
//         "category": "Housing",
//         "date": "2025-09-02",
//         "notes": "no"
//     }   // { id: "i2", title: "Side Project", date: "08th Feb 2025", amount: 800, icon: "🧑‍💻" },
//   // { id: "i3", title: "Dividends", date: "05th Feb 2025", amount: 320, icon: "🏦" },
//   // { id: "i4", title: "Freelance", date: "02nd Feb 2025", amount: -500, icon: "🧾" }, // test negative
// ];

// const expenseList: Txn[] = [
// {
//         "title": "rent",
//         "amount": "-239.00",
//         "category": "Housing",
//         "date": "2025-09-02",
//         "notes": "no"
//     }   // { id: "e2", title: "Travel", date: "13th Feb 2025", amount: -670, icon: "✈️" },
//   // { id: "e3", title: "Electricity Bill", date: "11th Feb 2025", amount: -200, icon: "💡" },
//   // { id: "e4", title: "Loan Repayment", date: "10th Feb 2025", amount: -600, icon: "🏦" },
// ];

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const doughnutColors = ["#7c3aed", "#fb923c", "#ef4444"];

const DashboardScreen: React.FC = () => {

  const[totalBalance,setTotalBalance]=useState("");
  const[totalIncome,setTotalIncome]=useState("");
  const[totalExpenses,setTotalExpenses]=useState("");
  const[recentTxns,setRecentTxns]=useState<Txn[]>([])
  const[incomeList,setIncomeList]=useState<Txn[]>([])
  const[expenseList,setExpenseList]=useState<Txn[]>([])
  useEffect(()=>{
    const fetchTotal=async ()=>{
      try{
        const res=await axios.get<TTxn[]>("http://127.0.0.1:8000/users/total/",
          {withCredentials:true}
        );
        setTotalBalance(String(res.data[0]))
        setTotalIncome(String(res.data[1]))
        setTotalExpenses(String(res.data[2]))
        console.log(res.data[0])
      }
      catch(error){
        console.log(error);
      }
    }
    fetchTotal();
  },[])
  useEffect(()=>{
    const fetchTransactions=async ()=>{
      try{
        const res=await axios.get<Txn[]>("http://127.0.0.1:8000/users/transactions/",
          {withCredentials:true}
        );
        setRecentTxns(res.data)
      }
      catch(error){
        console.log(error);
      }
    }
    fetchTransactions();
  },[])

  useEffect(()=>{
    const fetchIncome=async ()=>{
      try{
        const res=await axios.get<Txn[]>("http://127.0.0.1:8000/income/transactions/",
          {withCredentials:true}
        );
        setIncomeList(res.data)
      }
      catch(error){
        console.log(error);
      }
    }
    fetchIncome();
  },[])

  useEffect(()=>{
    const fetchExpense=async ()=>{
      try{
        const res=await axios.get<Txn[]>("http://127.0.0.1:8000/expense/transactions/",
          {withCredentials:true}
        );
        setExpenseList(res.data)
      }
      catch(error){
        console.log(error);
      }
    }
    fetchExpense();
  },[])

  const kpi = useMemo(
    () => ({ balance: totalBalance, income: totalIncome, expenses: totalExpenses }),
    []
  );

  // Top-left Line Chart (category x-axis)
  const lineData: ChartData<"line"> = useMemo(() => {
    return {
      labels: recentTxns.map((t) => t.date),
      datasets: [
        {
          label: "Total Income",
          data: recentTxns.map((t) => Number(t.amount)),
          borderColor: "#7c3aed",
          backgroundColor: "rgba(124, 58, 237, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: "#7c3aed",
          borderWidth: 3,
        },
      ],
    };
  }, []);

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: "#374151", font: { size: 14, weight: "bold" } },
      },
      title: {
        display: true,
        text: "Income Over Time",
        color: "#111827",
        font: { size: 18, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
    },
    elements: {
      line: { borderWidth: 3 },
      point: { radius: 6, hoverRadius: 8 },
    },
    scales: {
      x: {
        title: { display: true, text: "Date", color: "#374151" },
        grid: { color: "#e5e7eb" },
      },
      y: {
        title: { display: true, text: "Amount (USD)", color: "#374151" },
        beginAtZero: false, // allow negatives
        grid: { color: "#e5e7eb" },
        ticks: {
          callback: (val) => currency(Number(val)),
        },
      },
    },
  };

  // Top-right Doughnut
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

  const doughnutOptions: ChartOptions<"doughnut"> = {
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
  };

  // Recent Transactions split (5 left + 5 right)
  const leftRecent = recentTxns.slice(0, 5);
  const rightRecent = recentTxns.slice(5, 10);

  return (
    <div className="page-wrap page-lg">
      {/* TOP: Left = Line, Right = Doughnut */}
      <section className="card card-elevated card-lg">
        <div className="dash-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="chart-left">
            <div className="chartjs-box" style={{ height: 360 }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
          <div className="chart-right">
            <div className="doughnut-wrap">
              <div className="doughnut-box" style={{ height: 360, maxWidth: 460, width: "100%" }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="doughnut-center">
                  <div className="center-title">Total Balance</div>
                  <div className="center-value">{currency(Number(totalBalance))}</div>
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
              <div className="kpi-value">{currency(Number(totalBalance))}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon kpi-orange">🧾</div>
            <div className="kpi-meta">
              <div className="kpi-title">Total Income</div>
              <div className="kpi-value">{currency(Number(totalIncome))}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon kpi-red">💸</div>
            <div className="kpi-meta">
              <div className="kpi-title">Total Expenses</div>
              <div className="kpi-value">{currency(Number(totalExpenses))}</div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT: Left 5 + Right 5 */}
      <section className="card card-elevated card-lg">
        <div className="dash-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Left: 5 most recent */}
          <div className="dash-left">
            <div className="dash-head spaced">
              <h3 className="card-title">Recent Transactions</h3>
              <button className="btn btn-outline btn-pill btn-compact" style={{ width: "auto" }}>
                See All <MdArrowOutward style={{ marginLeft: 6 }} />
              </button>
            </div>
            <ul className="dash-list dense">
              {leftRecent.map((t,index) => {
                const isExpense = Number(t.amount) < 0;
                return (
                  <li key={index} className="dash-row hoverable row-tight">
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
                      {currency(Math.abs(Number(t.amount)))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: next 5 */}
          <div className="dash-right">
            <div className="dash-head spaced-right">
              <h3 className="card-title">More Transactions</h3>
              <button className="btn btn-outline btn-pill btn-compact" style={{ width: "auto" }}>
                See All <MdArrowOutward style={{ marginLeft: 6 }} />
              </button>
            </div>
            <ul className="dash-list dense">
              {rightRecent.map((t,index) => {
                const isExpense = Number(t.amount) < 0;
                return (
                  <li key={index} className="dash-row hoverable row-tight">
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
                      {currency(Math.abs(Number(t.amount)))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom: Incomes (left) and Expenses (right) */}
      <section className="card card-elevated card-lg">
        <div className="two-col">
          {/* Incomes */}
          <div className="card-block">
            <div className="dash-head spaced">
              <h3 className="card-title">Incomes</h3>
              <button className="btn btn-outline btn-pill btn-compact" style={{ width: "auto" }}>
                See All <MdArrowOutward style={{ marginLeft: 6 }} />
              </button>
            </div>

            <ul className="dash-list dense">
              {incomeList.map((t,index) => (
                <li key={index} className="dash-row hoverable row-tight">
                  <div className="dash-left-row">
                    <div className="dash-avatar" aria-hidden>
                      <span className="dash-emoji">{t.icon || "🧾"}</span>
                    </div>
                    <div>
                      <div className="dash-title">{t.title}</div>
                      <div className="dash-sub">{t.date}</div>
                    </div>
                  </div>
                  <div className={`badge ${Number(t.amount) >= 0 ? "badge-green" : "badge-red"}`}>
                    {Number(t.amount) >= 0 ? "+ " : "− "}
                    {currency(Math.abs(Number(t.amount)))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Expenses */}
          <div className="card-block">
            <div className="dash-head spaced">
              <h3 className="card-title">Expenses</h3>
              <button className="btn btn-outline btn-pill btn-compact" style={{ width: "auto" }}>
                See All <MdArrowOutward style={{ marginLeft: 6 }} />
              </button>
            </div>

            <ul className="dash-list dense">
              {expenseList.map((t,index) => (
                <li key={index} className="dash-row hoverable row-tight">
                  <div className="dash-left-row">
                    <div className="dash-avatar" aria-hidden>
                      <span className="dash-emoji">{t.icon || "🧾"}</span>
                    </div>
                    <div>
                      <div className="dash-title">{t.title}</div>
                      <div className="dash-sub">{t.date}</div>
                    </div>
                  </div>
                  <div className="badge badge-red">− {currency(Math.abs(Number(t.amount)))}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardScreen;

