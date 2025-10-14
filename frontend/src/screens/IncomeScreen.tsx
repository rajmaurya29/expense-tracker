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
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { income } from "../redux/slices/IncomeSlice";
import { MdDelete, MdClose } from "react-icons/md";
import { createIncome } from "../redux/slices/CreateIncomeSlice";
import { categoryIncome } from "../redux/slices/CategoryIncomeSlice";
import { deleteIncome } from "../redux/slices/DeleteIncomeSlice";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL as string;

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

type IncomeRow = {
  id: string | number;
  source?: string;
  date: string;
  amount: string | number;
  categoryName?: string;
  notes?: string;
};

type DraftIncome = {
  source: string;
  amount: string;
  category: string;
  notes: string;
  date: string; // yyyy-mm-dd
};
const inr = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const currency = (n: number) => inr.format(n);

const niceMax = (v: number) => {
  if (!isFinite(v) || v <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(v)));
  const options = [2, 2.5, 5, 10].map((k) => k * magnitude);
  return options.find((o) => o >= v) ?? Math.ceil(v / magnitude) * magnitude;
};

const IncomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate=useNavigate();

  // Fetch data
  useEffect(() => {
    dispatch(income());
    dispatch(categoryIncome());
  }, [dispatch]);

  // Selectors with safe fallbacks
  const incomeSelector = useSelector((s: RootState) => s.userIncome.userIncome) as IncomeRow[] | undefined;
  const categoryNameSelector = useSelector((s: RootState) => s.categoryIncome.income?.category_name) as
    | string[]
    | undefined;
  const categoryFrequencySelector = useSelector((s: RootState) => s.categoryIncome.income?.category_frequency) as
    | number[]
    | undefined;
  const userSelector=useSelector((s:RootState)=>s.userInfo)
  
    useEffect(()=>{
      if(!userSelector.userInfo) navigate("/login");
    })
  const rows: IncomeRow[] = Array.isArray(incomeSelector) ? incomeSelector : [];
  // const rows_bar: IncomeRow[] = Array.isArray(incomeSelector) ? incomeSelector : [];
  const catNames: string[] = Array.isArray(categoryNameSelector) ? categoryNameSelector : [];
  const catFreqs: number[] = Array.isArray(categoryFrequencySelector) ? categoryFrequencySelector : [];

  // Category filter
  const [category, setCategory] = useState<string>("__ALL__");

  // Modal state
  const [isModalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<DraftIncome>({
    source: "",
    amount: "",
    category: "",
    notes: "",
    date: new Date().toISOString().slice(0, 10),
  });

  // Distinct categories for dropdown
  const categories = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((i) => i.categoryName && set.add(i.categoryName));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  // Filtered list + halves
  const filtered = useMemo(
    () => (category === "__ALL__" ? rows : rows.filter((i) => i.categoryName === category)),
    [rows, category]
  );
  const mid = Math.ceil(filtered.length / 2);
  const leftHalf = filtered.slice(0, mid);
  const rightHalf = filtered.slice(mid);

  // Bar chart config
  const yMax = niceMax(Math.max(1, ...rows.map((d) => Number(d.amount) || 0)));
  const barData: ChartData<"bar"> = {
    // d.toReversed()
    // const d1=rows.toReversed();
    labels: rows.slice().reverse().map((d) => d.date),
    datasets: [
      {
        label: "Income",
        data: rows.slice().reverse().map((d) => Number(d.amount) || 0),
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
    layout: { padding: { right: 8, left: 8, top: 4, bottom: 0} },
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

  // Doughnut chart config (uses category totals from selector)
const incomeColors = [
  "#1E88E5", // blue
  "#43A047", // green
  "#FB8C00", // orange
  "#E53935", // red
  "#8E24AA", // purple
  "#FDD835", // yellow
];
  const doughnutData: ChartData<"doughnut"> = {
    labels: catNames,
    datasets: [
      {
        data: catFreqs,
        backgroundColor: catFreqs.map((_, i) => incomeColors[i % incomeColors.length]),
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
            const val = Number(ctx.parsed) || 0;
            const total = (Array.isArray(catFreqs) ? catFreqs : []).reduce((a, b) => a + b, 0) || 1;
            const pct = Math.round((val / total) * 100);
            return ` ${ctx.label}: ${currency(val)} · ${pct}%`;
          },
        },
      },
    },
  };
  const totalIncome = (Array.isArray(catFreqs) ? catFreqs : []).reduce((a, b) => a + b, 0);

  // Modal handlers
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const onChangeDraft = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft((d) => ({ ...d, [name]: value }));
  };
  const onSubmitDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(draft.amount);
    if (!draft.source.trim() || !draft.category.trim() || !draft.date || !isFinite(amt) || amt <= 0) {
      alert("Please fill Source, Category, valid Amount, and Date.");
      return;
    }
    // Persist
    dispatch(
      createIncome({
        source: draft.source,
        amount: String(amt),
        categoryName: draft.category,
        notes: draft.notes,
        date: draft.date,
      })
    ).finally(() => {
      dispatch(income());
      dispatch(categoryIncome());
    });

    closeModal();
    setDraft({
      source: "",
      amount: "",
      category: "",
      notes: "",
      date: new Date().toISOString().slice(0, 10),
    });
  };

  // Delete handler (wire to real thunk)
  const onDeleteIncome = (id:  number) => {
    if (confirm("Delete this income item?")) {
      // console.log(id)
      dispatch(deleteIncome(id)).then(() => { dispatch(income()); dispatch(categoryIncome()); });
    }
  };

  return (
    <div className="page-wrap page-lg">
      {/* Overview */}
       {/* <PiechartIncome/> */}
      <section className="card card-elevated card-lg">
        <header className="card-head card-head-split">
          <div>
            <h2 className="card-title card-title-lg">Overview</h2>
            <p className="card-subtitle card-subtitle-lg">Income over time and income share by category.</p>
          </div>
        <div className="actions-row">
            <button className="btn btn-light btn-pill btn-lg" aria-label="Add income" onClick={openModal}>
              <span className="btn-icon btn-icon-lg">+</span> Add Income
            </button>
          </div>
        </header>

        <div className="chart-grid">
          {/* Bar chart */}
          <div className="chart-left">
            <div className="chartjs-box">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Doughnut */}
          <div className="chart-right">
            <div className="pie-wrap">
              <div className="chartjs-pie">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
              <ul className="pie-legend">
                {catNames.map((lbl, i) => {
                  const val = catFreqs[i] ?? 0;
                  const pct = totalIncome ? Math.round((val / totalIncome) * 100) : 0;
                  return (
                    <li key={`${lbl}-${i}`} className="pie-legend-item">
                      <span className="dot" style={{ background: incomeColors[i % incomeColors.length] }} />
                      <span className="name">{lbl}</span>
                      <span className="val">
                        {currency(Number(val) || 0)} · {pct}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Income Sources */}
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
            <button className="btn btn-outline btn-xs-download see-all-btn">
              <a
          href={`${API_URL}/income/transactions/csv/`}
          download
          className="btn btn-outline btn-xs-download see-all-btn"
        >
          Download CSV
        </a>
            </button>
          </div>
        </header>

        <div className="columns-2 columns-2-lg">
          {/* Left column */}
          <ul className="list list-lg">
            {leftHalf.map((item) => (
              <li key={item.id} className="list-row list-row-lg hoverable">
                <div className="list-left">
                  <div className="dash-avatar" aria-hidden>
                        <span className="dash-emoji">{ "🧾"}</span>
                      </div>
                  <div>
                    <div className="list-title list-title-lg">{item.source ?? item.categoryName ?? "Income"}</div>
                    <div className="list-sub list-sub-lg">{item.date}</div>
                  </div>
                </div>
                <div className="list-right">
                  <span className="amount amount-lg up">+ {currency(Number(item.amount) || 0)}</span>
                  {item.categoryName && <span className="chip chip-green chip-lg">{item.categoryName}</span>}
                  <button className="icon-btn danger" aria-label="Delete income" title="Delete" onClick={() => onDeleteIncome(Number(item.id))}>
                    <MdDelete size={18} />
                  </button>
                </div>
              </li>
            ))}
            {leftHalf.length === 0 && <li className="empty-row">No items</li>}
          </ul>

          {/* Right column */}
          <ul className="list list-lg">
            {rightHalf.map((item) => (
              <li key={item.id} className="list-row list-row-lg hoverable">
                <div className="list-left">
                  <div className="dash-avatar" aria-hidden>
                        <span className="dash-emoji">{ "🧾"}</span>
                      </div>
                  <div>
                    <div className="list-title list-title-lg">{item.source ?? item.categoryName ?? "Income"}</div>
                    <div className="list-sub list-sub-lg">{item.date}</div>
                  </div>
                </div>
                <div className="list-right">
                  <span className="amount amount-lg up">+ {currency(Number(item.amount) || 0)}</span>
                  {item.categoryName && <span className="chip chip-green chip-lg">{item.categoryName}</span>}
                  <button className="icon-btn danger" aria-label="Delete income" title="Delete" onClick={() => onDeleteIncome(Number(item.id))}>
                    <MdDelete size={18} />
                  </button>
                </div>
              </li>
            ))}
            {rightHalf.length === 0 && <li className="empty-row">No items</li>}
          </ul>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-head">
              <h3 className="modal-title">Add Income</h3>
              <button className="icon-btn" aria-label="Close" onClick={closeModal}>
                <MdClose size={20} />
              </button>
            </div>

            <form className="modal-body" onSubmit={onSubmitDraft}>
              <div className="form-row">
                <label className="form-label" htmlFor="source">Source</label>
                <input
                  id="source"
                  name="source"
                  className="form-input"
                  placeholder="e.g., Salary, Freelance, Sales"
                  value={draft.source}
                  onChange={onChangeDraft}
                  required
                />
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="amount">Amount</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="e.g., 1200"
                  value={draft.amount}
                  onChange={onChangeDraft}
                  required
                  min={0}
                />
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  className="form-input"
                  placeholder="e.g., Job, Business, Passive"
                  value={draft.category}
                  onChange={onChangeDraft}
                  required
                />
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-input"
                  placeholder="Optional notes"
                  rows={3}
                  value={draft.notes}
                  onChange={onChangeDraft}
                />
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="date">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="form-input"
                  value={draft.date}
                  onChange={onChangeDraft}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeScreen;
