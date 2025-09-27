// DoughnutIncome.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Doughnut } from "react-chartjs-2";
import type { RootState, AppDispatch } from "../redux/store";
import { categoryIncome } from "../redux/slices/CategoryIncomeSlice";
import { income } from "../redux/slices/IncomeSlice";

import type { ChartData, ChartOptions, Plugin } from "chart.js";


// Vibrant colors (repeat if more than 8 categories)
const COLORS: string[] = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
  "#9966FF", "#FF9F40", "#E91E63", "#00BCD4",
];

// Plugin to show total in center
const centerText: Plugin = {
  id: "centerText",
  beforeDraw: (chart) => {
    const { width, height, ctx } = chart;
    const total = (chart.data.datasets[0].data as number[]).reduce(
  (a, b) => a + b,
  0
);


    ctx.save();
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`₹${total}`, width / 2, height / 2);
    ctx.restore();
  },
};

const PiechartIncome: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(income());
    dispatch(categoryIncome());
  }, [dispatch]);

  // Selectors
  const categoryNames = useSelector(
    (state: RootState) => state.categoryIncome.income?.category_name
  ) as string[] | undefined;

  const categoryFrequencies = useSelector(
    (state: RootState) => state.categoryIncome.income?.category_frequency
  ) as number[] | undefined;

  // Ensure arrays
  const category_name: string[] = Array.isArray(categoryNames) ? categoryNames : [];
  const category_frequency: number[] = Array.isArray(categoryFrequencies) ? categoryFrequencies : [];

  // Chart.js Data
  const data: ChartData<"doughnut"> = {
    labels: category_name,
    datasets: [
      {
        label: "Income Categories",
        data: category_frequency,
        backgroundColor: COLORS,
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 15, // 👈 pop-out effect on hover
      },
    ],
  };

  // Chart.js Options
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%", // size of doughnut hole
    plugins: {
      legend: {
        display: false, // we’ll create a custom legend
      },
      tooltip: {
        enabled: false, // disable tooltip box
      },
    },
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white shadow rounded-2xl">
      <div className="w-full h-80">
        <Doughnut data={data} options={options} plugins={[centerText]} />
      </div>

      {/* Custom Legend */}
      <div className="flex flex-wrap justify-center mt-5 gap-4">
        {category_name.map((label, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-gray-700 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PiechartIncome;
