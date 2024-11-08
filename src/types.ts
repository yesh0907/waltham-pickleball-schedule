interface TimeSlotDetail {
    status: number;
    selected: boolean;
  }
  
  interface Resource {
    resource_id: number;
    resource_name: string;
    package_id: number;
    package_name: null | string;
    type_id: number;
    type_name: string;
    warning_messages: string[];
    time_slot_details: TimeSlotDetail[];
    attendance: number;
  }
  
  interface Availability {
    time_increment: number;
    default_starting_time: string;
    default_ending_time: string;
    time_slots: string[];
    resources: Resource[];
  }
  
  interface AvailabilityBody {
    availability: Availability;
  }
  
  interface PageInfo {
    order_by: string;
    total_records_per_page: number;
    total_records: number;
    page_number: number;
    order_option: string;
    total_page: number;
  }
  
  interface APIResponseHeaders {
    sessionRefreshedOn: null | string;
    sessionExtendedCount: number;
    response_code: string;
    response_message: string;
    page_info: PageInfo;
  }
  
  export interface AvailabilityResponse {
    headers: APIResponseHeaders;
    body: AvailabilityBody;
  }
  
  export const TimeSlots = ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM"] as const;
  export type TimeSlot = (typeof TimeSlots)[number];
  export type Schedule = Record<TimeSlot, { booked: boolean }>;
  
  export interface CourtSchedule {
    name: string;
    schedule: Schedule;
  }
  