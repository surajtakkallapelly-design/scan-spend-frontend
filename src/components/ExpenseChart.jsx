import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export function CategoryPie({ data }) {
  const labels = Object.keys(data || {});
  const values = Object.values(data || {});
  const colors = ['#22d3ee', '#38bdf8', '#818cf8', '#c084fc', '#f472b6'];
  return <Pie data={{ labels, datasets: [{ data: values, backgroundColor: colors }] }} />;
}

export function SpendingLine({ points }) {
  const labels = points.map(p => p.label);
  const values = points.map(p => p.value);
  return <Line data={{ labels, datasets: [{ label: 'Monthly', data: values, borderColor: '#22d3ee' }] }} />;
}
