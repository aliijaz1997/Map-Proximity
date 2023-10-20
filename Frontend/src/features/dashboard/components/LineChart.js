import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function LineChart({ users }) {
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
  ];

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Number of users joining per month",
        data: labels.map((_value, idx) => {
          return users[idx]?.count;
        }),
        borderColor: "rgb(139, 69, 19)",
        backgroundColor: "rgba(139, 69, 19, 0.5)",
      },
    ],
  };

  return (
    <TitleCard title={"New Users"}>
      <Line data={data} options={options} />
    </TitleCard>
  );
}

export default LineChart;
