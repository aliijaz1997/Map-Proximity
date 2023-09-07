import { useEffect, useState } from "react";

function CountdownTimer({ durationText }) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Parse the distanceText to extract the duration (e.g., "2 days 10 hours 24 mins 2 secs")
    const parts = durationText.split(" ");
    const daysIndex = parts.indexOf("days");
    const hoursIndex = parts.indexOf("hours");
    const minsIndex = parts.indexOf("mins");
    const secsIndex = parts.indexOf("secs");

    let newTotalSeconds = 0;

    if (daysIndex !== -1)
      newTotalSeconds += parseInt(parts[daysIndex - 1]) * 24 * 60 * 60;
    if (hoursIndex !== -1)
      newTotalSeconds += parseInt(parts[hoursIndex - 1]) * 60 * 60;
    if (minsIndex !== -1)
      newTotalSeconds += parseInt(parts[minsIndex - 1]) * 60;
    if (secsIndex !== -1) newTotalSeconds += parseInt(parts[secsIndex - 1]);

    // Update the countdown every second
    const countdownInterval = setInterval(() => {
      if (newTotalSeconds > 0) {
        const newDays = Math.floor(newTotalSeconds / (24 * 60 * 60));
        const newHours = Math.floor(
          (newTotalSeconds % (24 * 60 * 60)) / (60 * 60)
        );
        const newMinutes = Math.floor((newTotalSeconds % (60 * 60)) / 60);
        const newSeconds = newTotalSeconds % 60;

        setDays(newDays);
        setHours(newHours);
        setMinutes(newMinutes);
        setSeconds(newSeconds);

        newTotalSeconds -= 1;
      }
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(countdownInterval);
  }, [durationText]);

  return (
    <div className="rounded-md bg-black text-white m-6 p-4 flex justify-center gap-5">
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{ "--value": days }}>{days}</span>
        </span>
        days
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{ "--value": hours }}>{hours}</span>
        </span>
        hours
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{ "--value": minutes }}>{minutes}</span>
        </span>
        min
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{ "--value": seconds }}>{seconds}</span>
        </span>
        sec
      </div>
    </div>
  );
}

export default CountdownTimer;
