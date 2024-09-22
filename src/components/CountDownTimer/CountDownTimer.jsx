import React, { useEffect, useRef, useState } from "react";

import CountDownCard from "./CountDownCard.jsx";
import "./index.css";

const END_DATE = "2024-10-11T09:00:00.000Z";
const CountDownTimer = () => {
  function timeUntil(targetDate) {
    const now = new Date(); // Get the current date and time
    const target = new Date(targetDate); // Set the target date

    // Calculate the difference in milliseconds
    const timeDiff = target.getTime() - now.getTime();

    // If the date has passed, return 0 for all units
    if (timeDiff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  //card ref
  const SecondsCardRef = useRef(null);
  const MinutesCardRef = useRef(null);
  const HoursCardRef = useRef(null);
  const DaysCardRef = useRef(null);

  const {
    days: daysUntil,
    hours: hoursUntil,
    minutes: minutesUntil,
    seconds: secondsUntil,
  } = timeUntil(END_DATE);

  //state
  const [days, setDays] = useState(daysUntil);
  const [hours, setHours] = useState(hoursUntil);
  const [minutes, setMinutes] = useState(minutesUntil);
  const [seconds, setSeconds] = useState(secondsUntil);
  useEffect(() => {
    seconds === 0 && setSeconds(59);
    minutes === 0 && setMinutes(59);
    if (seconds > 0) {
      setTimeout(() => {
        setSeconds(seconds - 1);
        SecondsCardRef.current.classList.toggle("rotate");
      }, 1000);
    }
    if (seconds === 0 && minutes > 0) {
      setMinutes(minutes - 1);
      MinutesCardRef.current.classList.toggle("rotate");
    }
  }, [seconds, minutes]);
  useEffect(() => {
    hours === 0 && setHours(23);
    if (minutes === 0 && hours > 0) {
      setHours(hours - 1);
      HoursCardRef.current.classList.toggle("rotate");
    }
  }, [minutes, hours]);
  useEffect(() => {
    hours === 0 &&
      setDays(days - 1) &&
      DaysCardRef.current.classList.toggle("rotate");
  }, [hours, days]);
  return (
    <div className="countdown__container">
      <CountDownCard label="days" number={days} cardRef={DaysCardRef} />
      <CountDownCard label="hours" number={hours} cardRef={HoursCardRef} />
      <CountDownCard
        label="minutes"
        number={minutes}
        cardRef={MinutesCardRef}
      />
      <CountDownCard
        label="seconds"
        number={seconds}
        cardRef={SecondsCardRef}
      />
    </div>
  );
};

export default CountDownTimer;
