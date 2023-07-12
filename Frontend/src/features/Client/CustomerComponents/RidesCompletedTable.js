import TitleCard from "../../../components/Cards/TitleCard";

const userSourceData = [
  { name: "Hifz", location: "Plot 12, Block D, Multan", driver: "John" },
  { name: "Hifz", location: "Plot 12, Block D, Multan", driver: "John" },
  { name: "Hifz", location: "Plot 12, Block D, Multan", driver: "John" },
  { name: "Hifz", location: "Plot 12, Block D, Multan", driver: "John" },
  { name: "Hifz", location: "Plot 12, Block D, Multan", driver: "John" },
];

function CustomerRidesStatus() {
  return (
    <TitleCard title={"Rides History"}>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th className="normal-case">Name</th>
              <th className="normal-case">Location</th>
              <th className="normal-case">Driver</th>
            </tr>
          </thead>
          <tbody>
            {userSourceData.map((u, k) => {
              return (
                <tr key={k}>
                  <th>{k + 1}</th>
                  <td>{u.name}</td>
                  <td>{u.location}</td>
                  <td>{u.driver}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
}

export default CustomerRidesStatus;
