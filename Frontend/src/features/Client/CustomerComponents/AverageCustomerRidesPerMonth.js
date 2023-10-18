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
import { useGetCustomerStatsQuery } from "../../../app/service/api";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader/Loader";

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

function CustomerStats() {
  const { user } = useSelector((state) => state.auth);
  const { data: rideRecord, isLoading } = useGetCustomerStatsQuery({
    id: user.uid,
  });
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
        fill: true,
        label: "Rides Per month",
        data: labels.map((_month, idx) => {
          return rideRecord?.monthlyRides[idx].ridesCount;
        }),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  if (!rideRecord || !user || isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 shadow-lg rounded-md">
          <div class="p-4 text-white">
            <div class="text-xl font-semibold">Average Rides Per Month</div>
            <div class="text-3xl font-bold">
              {rideRecord.monthlyRides.length / 12}
            </div>
          </div>
        </div>

        <div class="card bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg rounded-md">
          <div class="p-4 text-white">
            <div class="text-xl font-semibold">Customer Category</div>
            <div class="text-3xl font-bold">{rideRecord.customerCategory}</div>
          </div>
        </div>

        <div class="card bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 shadow-lg rounded-md">
          <div class="p-4 text-white">
            <div class="text-xl font-semibold">Average Spending</div>
            <div class="text-3xl font-bold">
              {rideRecord.averageAmount.toFixed(2)} USD
            </div>
          </div>
        </div>
      </div>

      <TitleCard title={"Average rides per month"}>
        <Line data={data} options={options} />
      </TitleCard>
    </div>
  );
}

export default CustomerStats;
