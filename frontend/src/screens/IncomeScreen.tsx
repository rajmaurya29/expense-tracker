import React, { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import type { ChartOptions, ChartData, TooltipItem } from "chart.js";
import { useDispatch,useSelector } from "react-redux";
import type { RootState,AppDispatch } from "../redux/store";
import { income } from "../redux/slices/IncomeSlice";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

// type IncomePoint = { label: string; value: number };
type IncomeItem = { id: string; title: string; date: string; amount: number; category?: string };

// const incomeSeries: IncomePoint[] = [
//   { label: "1st Jan", value: 11200 },
//   { label: "4th Jan", value: 8600 },
//   { label: "6th Jan", value: 8200 },
//   { label: "7th Jan", value: 15000 },
//   { label: "8th Jan", value: 1200 },
//   { label: "9th Jan", value: 7600 },
//   { label: "10th Jan", value: 10800 },
//   { label: "11th Jan", value: 12400 },
//   { label: "13th Jan", value: 9800 },
//   { label: "12th Feb", value: 12900 },
// ];

const sources: IncomeItem[] = [
  { id: "1", title: "Salary", date: "12th Feb 2025", amount: 12000, category: "Job" },
  { id: "2", title: "E‑commerce Sales", date: "11th Feb 2025", amount: 11900, category: "Business" },
  { id: "3", title: "Interest from Savings", date: "13th Jan 2025", amount: 9600, category: "Passive" },
  { id: "4", title: "Graphic Design", date: "10th Jan 2025", amount: 10500, category: "Freelance" },
  { id: "5", title: "Affiliate Payout", date: "8th Jan 2025", amount: 4200, category: "Passive" },
  { id: "6", title: "Stock Dividends", date: "5th Jan 2025", amount: 3100, category: "Passive" },
];

/* Expenses demo data for the Doughnut */

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const niceMax = (v: number) => {
  const magnitude = Math.pow(10, Math.floor(Math.log10(v)));
  const options = [2, 2.5, 5, 10].map((k) => k * magnitude);
  return options.find((o) => o >= v) ?? Math.ceil(v / magnitude) * magnitude;
};

const IncomeScreen: React.FC = () => {
  useEffect(()=>{
    dispatch(income());
  },[])

  const incomeSelector=useSelector((state:RootState)=>state.userIncome.userIncome)
  const [category, setCategory] = useState<string>("__ALL__");

  const incomeLabels = incomeSelector.map((i)=>i.categoryName);
  const expenseValues = incomeSelector.map((i)=>Number(i.amount));
  const expenseColors = ["#8b5cf6", "#a78bfa", "#7dd3fc", "#34d399", "#f472b6", "#fbbf24"];

  // Derived categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    incomeSelector.forEach((i) => i.categoryName && set.add(i.categoryName));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  // Filtered list + split halves
  const filtered = useMemo(
    () => (category === "__ALL__" ? incomeSelector : incomeSelector.filter((i) => i.categoryName === category)),
    [category]
  );
  const mid = Math.ceil(filtered.length / 2);
  const leftHalf = filtered.slice(0, mid);
  const rightHalf = filtered.slice(mid);

  // Bar chart data/options (thicker bars, currency ticks)
  const yMax = niceMax(Math.max(...incomeSelector.map((d:any) =>Number(d.amount)), 1));

  const barData: ChartData<"bar"> = {
    labels: incomeSelector.map((d:any) => d.date),
    datasets: [
      {
        label: "Income",
        data: incomeSelector.map((d:any) => d.amount),
        backgroundColor: () => {
          // dual-layer look: gradient-like by using two colors via scriptable for each bar
          // Chart.js single dataset => use a solid main color. We'll mimic depth via border/hover.
          return "#7c3aed";
        },
        borderColor: "#6d28d9",
        borderWidth: 1.5,
        borderRadius: 10,        // rounded corners
        barPercentage: 0.7,      // broader bars
        categoryPercentage: 0.7, // spacing between bars
        hoverBackgroundColor: "#8b5cf6",
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { right: 8, left: 8, top: 4, bottom: 0 } },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        borderColor: "#1f2937",
        borderWidth: 0,
        callbacks: {
          label: (ctx: TooltipItem<"bar">) => ` ${currency(Number(ctx.parsed.y || 0))}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        suggestedMax: yMax,
        grid: { color: "#eef2f7" },
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
          callback: (val) => currency(Number(val)),
        },
      },
    },
  };

  // Doughnut (expenses by category)
  const doughnutData: ChartData<"doughnut"> = {
    labels: incomeLabels,
    datasets: [
      {
        data: expenseValues,
        backgroundColor: expenseColors,
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "64%", // donut thickness
    plugins: {
      legend: { display: false }, // we’ll render a custom legend list under the chart
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        callbacks: {
          label: (ctx) => {
            const val = Number(ctx.parsed);
            const total = expenseValues.reduce((a, b) => a + b, 0);
            const pct = Math.round((val / total) * 100);
            return ` ${ctx.label}: ${currency(val)} · ${pct}%`;
          },
        },
      },
      title: { display: false },
    },
  };

  const expenseTotal = expenseValues.reduce((a, b) => a + b, 0);
  const dispatch=useDispatch<AppDispatch>();
  
  
  return (
    <div className="page-wrap page-lg">
      {/* Overview: Bar (left ~60%) + Doughnut (right ~40%) */}
      <section className="card card-elevated card-lg">
        <header className="card-head card-head-split">
          <div>
            <h2 className="card-title card-title-lg">Overview</h2>
            <p className="card-subtitle card-subtitle-lg">Income over time and expenses by category.</p>
          </div>
          <div className="actions-row">
            <button className="btn btn-light btn-pill btn-lg" aria-label="Add income">
              <span className="btn-icon btn-icon-lg">+</span> Add Income
            </button>
          </div>
        </header>

        <div className="chart-grid">
          {/* Bar (60%) */}
          <div className="chart-left">
            <div className="chartjs-box">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Doughnut (40%) */}
          <div className="chart-right">
            <div className="pie-wrap">
              <div className="chartjs-pie">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>

              {/* Legend under the donut */}
              <ul className="pie-legend">
                {incomeLabels.map((lbl, i) => {
                  const val = expenseValues[i];
                  const pct = Math.round((val / expenseTotal) * 100);
                  return (
                    <li key={lbl} className="pie-legend-item">
                      <span className="dot" style={{ background: expenseColors[expenseValues.length%i] }} />
                      <span className="name">{lbl}</span>
                      <span className="val">
                        {currency(val)} · {pct}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Income Sources with category dropdown, split into two columns */}
      <section className="card card-elevated card-lg">
        <header className="sources-head">
          <h3 className="card-title card-title-lg">Income Sources</h3>
          <div className="sources-tools">
            <select
              className="select select-lg"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="__ALL__">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button className="btn btn-outline btn-lg">Download</button>
          </div>
        </header>

        <div className="columns-2 columns-2-lg">
          <ul className="list list-lg">
            {leftHalf.map((item) => (
              <li key={item.id} className="list-row list-row-lg hoverable">
                <div className="list-left">
                  <div className="avatar-dot avatar-dot-lg" aria-hidden />
                  <div>
                    <div className="list-title list-title-lg">{item.source}</div>
                    <div className="list-sub list-sub-lg">{item.date}</div>
                  </div>
                </div>
                <div className="list-right">
                  <span className="amount amount-lg up">+ {currency(Number(item.amount))}</span>
                  {item.categoryName && <span className="chip chip-green chip-lg">{item.categoryName}</span>}
                </div>
              </li>
            ))}
          </ul>

          <ul className="list list-lg">
            {rightHalf.map((item) => (
              <li key={item.id} className="list-row list-row-lg hoverable">
                <div className="list-left">
                  <div className="avatar-dot avatar-dot-lg" aria-hidden />
                  <div>
                    <div className="list-title list-title-lg">{item.source}</div>
                    <div className="list-sub list-sub-lg">{item.date}</div>
                  </div>
                </div>
                <div className="list-right">
                  <span className="amount amount-lg up">+ {currency(Number(item.amount))}</span>
                  {item.categoryName && <span className="chip chip-green chip-lg">{item.categoryName}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default IncomeScreen;
