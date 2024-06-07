'use client'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { lusitana } from '../fonts';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Register the Filler plugin for area charts
);

export default function RevenueLineChart({ revenue }) {
  const labels = revenue.map((month) => month.month);
  const data = revenue.map((month) => month.revenue);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data,
        fill: true, // Enable fill to create an area chart
        backgroundColor: 'rgba(56, 189, 248, 0.2)', // Semi-transparent fill color
        borderColor: 'rgba(56, 189, 248, 1)', // Line color
        pointBackgroundColor: 'rgba(56, 189, 248, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(56, 189, 248, 1)',
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
        font: {
          family: `${lusitana.className}`,
          size: 18,
        },
        color: '#333',
      },
      tooltip: {
        backgroundColor: 'rgba(56, 189, 248, 0.8)',
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `Revenue: BDT ${(value).toFixed(1)} TK`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `BDT ${(value / 1000).toFixed(0)}K`;
          },
          font: {
            size: 14,
          },
          color: '#333',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 14,
          },
          color: '#333',
        },
        grid: {
          display: false, // Hide X-axis grid lines
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
