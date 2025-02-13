import { useState, useEffect } from "react";

const CountdownTimer = ({ createdAt }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const endTime = new Date(createdAt);
    endTime.setDate(endTime.getDate() + 10); // 10 din ka end time

    const interval = setInterval(() => {
      const now = new Date();
      const difference = endTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <div className="text-2xl font-bold text-white tracking-wide">
      {timeLeft.days > 0 ? (
        // Jab days baqi ho
        <>{timeLeft.days} days {timeLeft.hours} hrs {timeLeft.minutes} min</>
      ) : (
        // Jab sirf hours aur minutes baqi ho
        <>
          {timeLeft.hours} hrs {timeLeft.minutes} min {timeLeft.seconds} Sec
        </>
      )}
    </div>
  );
};

export default CountdownTimer;
