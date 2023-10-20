import UserCountStat from "./components/UserCountStat";

import LineChart from "./components/LineChart";
import DoughnutChart from "./components/DoughnutChart";
import HeatMap from "./components/HeatMap";
import { useGetAdminStatsQuery } from "../../app/service/api";
import Loader from "../../components/Loader/Loader";

function Dashboard() {
  const { data: stats, isLoading } = useGetAdminStatsQuery();
  console.log(stats);
  if (isLoading && !stats) {
    return <Loader />;
  }
  return (
    <>
      <div className="grid lg:grid-cols-1 grid-cols-1 gap-6">
        <UserCountStat stats={stats} />
      </div>

      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <LineChart users={stats.monthlyData} />
        <DoughnutChart stats={stats} />
      </div>

      <div className="grid mt-4">
        <HeatMap />
      </div>
    </>
  );
}

export default Dashboard;
