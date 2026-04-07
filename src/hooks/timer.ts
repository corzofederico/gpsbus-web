import { useEffect, useState } from "react";

export function useClock(delay: number = 1000) {
  const [now,setTime] = useState(new Date().getTime() / 1000);

  useEffect(() => {
    function tick() {
      setTime(new Date().getTime() / 1000);
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);

  return now;
}