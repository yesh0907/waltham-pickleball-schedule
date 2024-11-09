"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ApiResponse, Court } from "../types";
import { Badge } from "@/components/ui/badge";

async function fetchSchedules(): Promise<ApiResponse> {
  const response = await fetch(
    "https://pickleball-court-schedule.fly.dev/schedules"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch schedules");
  }
  return response.json();
}

function parseTimeToHours(timeStr: string): number {
  const hour = parseInt(timeStr.replace(/[APM]/g, ""));
  return timeStr.includes("PM") && hour !== 12 ? hour + 12 : hour;
}

function TimeSlotDisplay({ time, booked }: { time: string; booked: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
      <span className="text-sm font-medium">{time}</span>
      <Badge
        variant={booked ? "destructive" : "default"}
        className={`ml-2 ${!booked ? "bg-green-500 hover:bg-green-600" : ""}`}
      >
        {booked ? "Booked" : "Available"}
      </Badge>
    </div>
  );
}

function CourtCard({ court }: { court: Court }) {
  const timeSlots = Object.entries(court.schedule);
  const currentHour = new Date().getHours();

  // Filter out past time slots
  const upcomingTimeSlots = timeSlots.filter(([time]) => {
    const slotHour = parseTimeToHours(time);
    return slotHour >= currentHour || currentHour - slotHour <= 2;
  });

  // Sort time slots chronologically
  upcomingTimeSlots.sort(([timeA], [timeB]) => {
    return parseTimeToHours(timeA) - parseTimeToHours(timeB);
  });

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 text-primary">{court.name}</h3>
      {upcomingTimeSlots.length > 0 ? (
        <div className="space-y-2">
          {upcomingTimeSlots.map(([time, slot]) => (
            <TimeSlotDisplay key={time} time={time} booked={slot.booked} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-2">
          No more available times today
        </p>
      )}
    </Card>
  );
}

export function CourtSchedule() {
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        Error loading schedules. Please try again later.
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="space-y-4 max-w-md mx-auto">
        {data?.schedules.map((court) => (
          <CourtCard key={court.name} court={court} />
        ))}
      </div>
    </div>
  );
}
