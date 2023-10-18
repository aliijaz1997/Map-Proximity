import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MonthlyRidesChart({ ridesPerMonth, earningsPerMonth }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Rides",
        data: ridesPerMonth.map((ride) => {
          return ride;
        }),
        backgroundColor: "rgba(255, 228, 225, 1.0)",
      },
      {
        label: "Earning",
        data: earningsPerMonth.map((earning) => {
          return earning;
        }),
        backgroundColor: "rgba(25, 25, 112, 1.0)",
      },
    ],
  };

  return (
    <TitleCard title={"Comparison of Rides and Earnings"}>
      <Bar options={options} data={data} />
    </TitleCard>
  );
}

export default MonthlyRidesChart;
