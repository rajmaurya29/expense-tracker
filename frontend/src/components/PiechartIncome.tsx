// PiechartIncome.tsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { RootState } from "../redux/store";
import { categoryIncome } from "../redux/slices/CategoryIncomeSlice";
import { useDispatch } from "react-redux";
import type {  AppDispatch } from "../redux/store";
import { income } from "../redux/slices/IncomeSlice";
// Vibrant colors (repeat if more than 15 categories)
const COLORS = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
  "#9966FF", "#FF9F40", "#E91E63", "#00BCD4"
];

const PiechartIncome: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(income());
    dispatch(categoryIncome());
  }, [dispatch]);
  const category_nameSelector = useSelector((s: RootState) => s.categoryIncome.income?.category_name) as
      | string[]
      | undefined;;
  const category_frequencySelector =useSelector((s: RootState) => s.categoryIncome.income?.category_frequency);
   const category_name: string[] = Array.isArray(category_nameSelector) ? category_nameSelector : [];
  const category_frequency: number[] = Array.isArray(category_frequencySelector) ? category_frequencySelector : [];
    console.log(category_name);
  // Map data for recharts
  const data = category_name.map((name: string, index: number) => ({
    name,
    value: category_frequency[index]
  }));

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow rounded-2xl">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            labelLine={false}
          >
            {data.map((_:any, index:any) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`Frequency: ${value}`]} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        {data.map((entry:any, index:any) => (
          <div key={index} className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span className="text-sm text-gray-700">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PiechartIncome;
