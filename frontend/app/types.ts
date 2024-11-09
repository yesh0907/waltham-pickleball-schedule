export interface TimeSlot {
  booked: boolean;
}

export interface CourtSchedule {
  "8AM": TimeSlot;
  "10AM": TimeSlot;
  "12PM": TimeSlot;
  "2PM": TimeSlot;
  "4PM": TimeSlot;
  "6PM": TimeSlot;
}

export interface Court {
  name: string;
  schedule: CourtSchedule;
}

export interface ApiResponse {
  schedules: Court[];
  error: boolean;
}