import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { MdArrowOutward } from "react-icons/md";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

type Txn = {
  id: string | number;
  title: string;
  date: string;
  amount: number;
  icon?: string;
};

// KPIs (mock)
const totalBalance = 91100;
const totalIncome = 98200;
const totalExpenses = 7100;

// Lists (mock)
const recentTxns: Txn[] = [
  { id: "t1", title: "Shopping", date: "17th Feb 2025", amount: -430, icon: "🛍️" },
  { id: "t2", title: "Travel", date: "13th Feb 2025", amount: -670, icon: "✈️" },
  { id: "t3", title: "Salary", date: "12th Feb 2025", amount: 12000, icon: "💼" },
  { id: "t4", title: "Electricity Bill", date: "11th Feb 2025", amount: -200, icon: "💡" },
  { id: "t5", title: "Loan Repayment", date: "10th Feb 2025", amount: -600, icon: "🏦" },
];

const incomeList: Txn[] = [
  { id: "i1", title: "Salary", date: "12th Feb 2025", amount: 12000, icon: "💼" },
  { id: "i2", title: "Side Project", date: "08th Feb 2025", amount: 800, icon: "🧑‍💻" },
  { id: "i3", title: "Dividends", date: "05th Feb 2025", amount: 320, icon: "🏦" },
  { id: "i4", title: "Freelance", date: "02nd Feb 2025", amount: 950, icon: "🧾" },
];

const expenseList: Txn[] = [
  { id: "e1", title: "Shopping", date: "17th Feb 2025", amount: -430, icon: "🛍️" },
  { id: "e2", title: "Travel", date: "13th Feb 2025", amount: -670, icon: "✈️" },
  { id: "e3", title: "Electricity Bill", date: "11th Feb 2025", amount: -200, icon: "💡" },
  { id: "e4", title: "Loan Repayment", date: "10th Feb 2025", amount: -600, icon: "🏦" },
];

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const doughnutColors = ["#7c3aed", "#fb923c", "#ef4444"];

const DashboardScreen: React.FC = () => {
  const kpi = useMemo(
    () => ({ balance: totalBalance, income: totalIncome, expenses: totalExpenses }),
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

  return (
    <div className="page-wrap page-lg">
      {/* KPIs */}
      <section className="card card-elevated card-lg section-tight">
        <div className="kpi-grid kpi-grid-balanced">
          <div className="kpi-card">
            <div className="kpi-icon kpi-purple">💳</div>
            <div className="kpi-meta">
              <div className="kpi-title">Total Balance</div>
              <div className="kpi-value">{currency(kpi.balance)}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon kpi-orange">🧾</div>
            <div className="kpi-meta">
              <div className="kpi-title">Total Income</div>
              <div className="kpi-value">{currency(kpi.income)}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon kpi-red">💸</div>
            <div className="kpi-meta">
              <div className="kpi-title">Total Expenses</div>
              <div className="kpi-value">{currency(kpi.expenses)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent + Doughnut */}
      <section className="card card-elevated card-lg">
        <div className="dash-grid align-stretch">
          {/* Recent Transactions */}
          <div className="dash-left">
            <div className="dash-head spaced">
              <h3 className="card-title">Recent Transactions</h3>
              <button className="btn btn-outline btn-pill btn-compact" style={{ width: "auto" }}>
                See All <MdArrowOutward style={{ marginLeft: 6 }} />
              </button>
            </div>

            <ul className="dash-list dense">
              {recentTxns.map((t) => {
                const isExpense = t.amount < 0;
                return (
                  <li key={t.id} className="dash-row hoverable row-tight">
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
                      {currency(Math.abs(t.amount))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Financial Overview */}
          <div className="dash-right">
            <div className="dash-head spaced-right">
              <h3 className="card-title">Financial Overview</h3>
            </div>

            <div className="doughnut-wrap center-v">
              <div className="doughnut-box doughnut-tall">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="doughnut-center">
                  <div className="center-title">Total Balance</div>
                  <div className="center-value">{currency(kpi.balance)}</div>
                </div>
              </div>

              <ul className="legend legend-tight">
                <li><span className="dot" style={{ background: "#7c3aed" }} /> Total Balance</li>
                <li><span className="dot" style={{ background: "#fb923c" }} /> Total Income</li>
                <li><span className="dot" style={{ background: "#ef4444" }} /> Total Expenses</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom: Incomes (left) and Expanses (right) */}
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
              {incomeList.map((t) => (
                <li key={t.id} className="dash-row hoverable row-tight">
                  <div className="dash-left-row">
                    <div className="dash-avatar" aria-hidden>
                      <span className="dash-emoji">{t.icon || "🧾"}</span>
                    </div>
                    <div>
                      <div className="dash-title">{t.title}</div>
                      <div className="dash-sub">{t.date}</div>
                    </div>
                  </div>
                  <div className="badge badge-green">+ {currency(Math.abs(t.amount))}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Expanses */}
          <div className="card-block">
            <div className="dash-head spaced">
              <h3 className="card-title">Expanses</h3>
              <button className="btn btn-outline btn-pill btn-compact" style={{ width: "auto" }}>
                See All <MdArrowOutward style={{ marginLeft: 6 }} />
              </button>
            </div>

            <ul className="dash-list dense">
              {expenseList.map((t) => (
                <li key={t.id} className="dash-row hoverable row-tight">
                  <div className="dash-left-row">
                    <div className="dash-avatar" aria-hidden>
                      <span className="dash-emoji">{t.icon || "🧾"}</span>
                    </div>
                    <div>
                      <div className="dash-title">{t.title}</div>
                      <div className="dash-sub">{t.date}</div>
                    </div>
                  </div>
                  <div className="badge badge-red">− {currency(Math.abs(t.amount))}</div>
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
