'use client'

export function DateDisplay() {
  const today = new Date();
  const month = today.toLocaleString("default", { month: "short" });
  const date = today.getDate();
  
  return (
    <h1 className="text-lg font-semibold">
      {`${month} ${date}`} Pickleball Court Schedule
    </h1>
  );
} 