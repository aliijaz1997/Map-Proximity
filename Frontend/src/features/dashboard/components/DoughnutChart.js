import {
  Chart as ChartJS,
  Filler,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";

ChartJS.register(ArcElement, Tooltip, Legend, Tooltip, Filler, Legend);

function DoughnutChart({ stats }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const labels = ["Admins", "Drivers", "Customers"];

  const data = {
    labels,
    datasets: [
      {
        label: "Roles count of users",
        data: [stats.totalAdmins, stats.totalDrivers, stats.totalCustomers],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <TitleCard title={"Users count role wise"}>
      <Doughnut options={options} data={data} />
    </TitleCard>
  );
}

export default DoughnutChart;
