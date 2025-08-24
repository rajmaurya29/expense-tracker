import React, { useMemo, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

type ExpensePoint = { label: string; value: number };
type ExpenseItem = { id: string; title: string; date: string; amount: number; category?: string };

const expenseSeries: ExpensePoint[] = [
  { label: "1st Jan", value: 4200 },
  { label: "4th Jan", value: 3600 },
  { label: "6th Jan", value: 2800 },
  { label: "7th Jan", value: 5200 },
  { label: "8th Jan", value: 900 },
  { label: "9th Jan", value: 3100 },
  { label: "10th Jan", value: 3900 },
  { label: "11th Jan", value: 4400 },
  { label: "13th Jan", value: 3500 },
  { label: "12th Feb", value: 4800 },
];

const expenses: ExpenseItem[] = [
  { id: "e1", title: "Rent", date: "12th Feb 2025", amount: 1800, category: "Housing" },
  { id: "e2", title: "Groceries", date: "11th Feb 2025", amount: 700, category: "Food" },
  { id: "e3", title: "Internet & Utilities", date: "10th Feb 2025", amount: 320, category: "Utilities" },
  { id: "e4", title: "Public Transport", date: "9th Feb 2025", amount: 240, category: "Transport" },
  { id: "e5", title: "Dining Out", date: "8th Feb 2025", amount: 210, category: "Food" },
  { id: "e6", title: "Streaming Services", date: "6th Feb 2025", amount: 60, category: "Entertainment" },
  { id: "e7", title: "Gym Membership", date: "4th Feb 2025", amount: 45, category: "Health" },
  { id: "e8", title: "Movie Night", date: "1st Feb 2025", amount: 35, category: "Entertainment" },
];

const pieLabels = ["Housing", "Food", "Transport", "Utilities", "Entertainment", "Health", "Other"];
const pieColors = ["#8b5cf6", "#a78bfa", "#7dd3fc", "#34d399", "#f472b6", "#fbbf24", "#94a3b8"];

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const niceMax = (v: number) => {
  const magnitude = Math.pow(10, Math.floor(Math.log10(v || 1)));
  const options = [2, 2.5, 5, 10].map((k) => k * magnitude);
  return options.find((o) => o >= v) ?? Math.ceil(v / magnitude) * magnitude;
};

// Build category totals for doughnut from the expenses list
const buildPieFromExpenses = (items: ExpenseItem[]) => {
  const totals = new Map<string, number>();
  items.forEach((it) => {
    const key = it.category ?? "Other";
    totals.set(key, (totals.get(key) || 0) + it.amount);
  });
  // Ensure consistent label order
  const data = pieLabels.map((lbl) => totals.get(lbl) || 0);
  const total = data.reduce((a, b) => a + b, 0);
  return { data, total };
};

const ExpenseScreen: React.FC = () => {
  // Category filter for the list
  const [category, setCategory] = useState<string>("__ALL__");

  // Derived categories (from current expenses list)
  const categories = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((e) => e.category && set.add(e.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  // Filtered list
  const filtered = useMemo(
    () => (category === "__ALL__" ? expenses : expenses.filter((e) => e.category === category)),
    [category]
  );

  // Split into two columns
  const mid = Math.ceil(filtered.length / 2);
  const leftHalf = filtered.slice(0, mid);
  const rightHalf = filtered.slice(mid);

  // Bar chart (Expense Overview)
  const yMax = niceMax(Math.max(...expenseSeries.map((d) => d.value), 1));

  const barData: ChartData<"bar"> = {
    labels: expenseSeries.map((d) => d.label),
    datasets: [
      {
        label: "Expense",
        data: expenseSeries.map((d) => d.value),
        backgroundColor: "#7c3aed",
        borderColor: "#6d28d9",
        borderWidth: 1.5,
        borderRadius: 10,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
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

  // Doughnut from current expenses (keeps in sync with list)
  const { data: pieDataArray, total: pieTotal } = useMemo(() => buildPieFromExpenses(expenses), []);
  const doughnutData: ChartData<"doughnut"> = {
    labels: pieLabels,
    datasets: [
      {
        data: pieDataArray,
        backgroundColor: pieColors,
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

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
          label: (ctx) => {
            const val = Number(ctx.parsed);
            const total = pieDataArray.reduce((a, b) => a + b, 0);
            const pct = total ? Math.round((val / total) * 100) : 0;
            return ` ${ctx.label}: ${currency(val)} · ${pct}%`;
          },
        },
      },
    },
  };

  return (
    <div className="page-wrap page-lg">
      {/* Overview: Bar (left ~60%) + Doughnut (right ~40%) */}
      <section className="card card-elevated card-lg">
        <header className="card-head card-head-split">
          <div>
            <h2 className="card-title card-title-lg">Expense Overview</h2>
            <p className="card-subtitle card-subtitle-lg">
              Monitor spending trends and category distribution.
            </p>
          </div>
          <div className="actions-row">
            <button className="btn btn-light btn-pill btn-lg" aria-label="Add expense">
              <span className="btn-icon btn-icon-lg">+</span> Add Expense
            </button>
          </div>
        </header>

        <div className="chart-grid">
          {/* Bar (~60%) */}
          <div className="chart-left">
            <div className="chartjs-box">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Doughnut (~40%) */}
          <div className="chart-right">
            <div className="pie-wrap">
              <div className="chartjs-pie">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>

              <ul className="pie-legend">
                {pieLabels.map((lbl, i) => {
                  const val = pieDataArray[i] || 0;
                  const pct = pieTotal ? Math.round((val / pieTotal) * 100) : 0;
                  return (
                    <li key={lbl} className="pie-legend-item">
                      <span className="dot" style={{ background: pieColors[i] }} />
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

      {/* Expense items with Category dropdown, two-column layout */}
      <section className="card card-elevated card-lg">
        <header className="sources-head">
          <h3 className="card-title card-title-lg">Expense Items</h3>
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
                    <div className="list-title list-title-lg">{item.title}</div>
                    <div className="list-sub list-sub-lg">{item.date}</div>
                  </div>
                </div>
                <div className="list-right">
                  <span className="amount amount-lg down">- {currency(item.amount)}</span>
                  {item.category && <span className="chip chip-red chip-lg">{item.category}</span>}
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
                    <div className="list-title list-title-lg">{item.title}</div>
                    <div className="list-sub list-sub-lg">{item.date}</div>
                  </div>
                </div>
                <div className="list-right">
                  <span className="amount amount-lg down">- {currency(item.amount)}</span>
                  {item.category && <span className="chip chip-red chip-lg">{item.category}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ExpenseScreen;
