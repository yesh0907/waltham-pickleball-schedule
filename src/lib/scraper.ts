import { chromium } from "playwright";
import {
  TimeSlots,
  type AvailabilityResponse,
  type CourtSchedule,
  type Schedule,
} from "@/types/scraper.types";
import moment from "moment-timezone";

const BOOKING_PAGE =
  "https://anc.apm.activecommunities.com/walthamrecreation/reservation/landing/quick?locale=en-US&groupId=2";
const AVAILABILITY_ENDPOINT =
  "https://anc.apm.activecommunities.com/walthamrecreation/rest/reservation/quickreservation/availability?locale=en-US";

function getTmrDate(): moment.Moment {
  return moment().tz("America/New_York").add(1, "day").startOf("day");
}

// format date to be like the following 2024-10-19
function formatDate(d: moment.Moment): string {
  return d.format("YYYY-MM-DD");
}

async function getAvailability(): Promise<AvailabilityResponse> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(BOOKING_PAGE);

  // Get tomorrow's date in the format used by the availability API (e.g., 2024-10-19)
  const tmr = getTmrDate();
  const tmrFormattedDate = formatDate(tmr);

  // Get the CSRF token from the page
  const csrfToken = await page.evaluate(() => {
    return (window as any).__csrfToken || null;
  });
  if (!csrfToken) {
    throw new Error("CSRF token not found");
  }

  // Prepare the request headers
  const headers = {
    "Content-Type": "application/json",
    "x-csrf-token": csrfToken,
  };

  // Prepare the request body
  const body = {
    facility_group_id: 2, // site's tennis/pickleball group id
    customer_id: 0,
    reserve_date: tmrFormattedDate,
    start_time: null,
    end_time: null,
    resident: true,
    reload: false,
    change_time_range: false,
  };

  console.log(`Getting availability for ${tmrFormattedDate}`);

  // Make the fetch request in the context of the webpage
  const res: AvailabilityResponse = await page.evaluate(
    async ({
      url,
      headers,
      body,
    }: {
      url: string;
      headers: HeadersInit;
      body: Record<string, any>;
    }) => {
      const resp = await fetch(url, {
        method: "POST",
        headers,
        mode: "cors",
        credentials: "include",
        body: JSON.stringify(body),
      });
      return await resp.json();
    },
    {
      url: AVAILABILITY_ENDPOINT,
      headers,
      body,
    }
  );

  await browser.close();

  return res;
}

export async function scrape() {
  const {
    body: { availability },
  } = await getAvailability();

  // only care about Lowell courts with nets because thats where I play
  const courts = availability.resources.filter((resource) =>
    resource.resource_name.match(/^Lowell #\d+ Pickleball \(Nets\)$/)
  );

  const courtSchedules: CourtSchedule[] = courts.map((resource) => {
    const schedule: Schedule = resource.time_slot_details.reduce(
      (acc, timeSlot, idx) => {
        const time = TimeSlots[idx];
        return {
          ...acc,
          [time]: {
            booked: !!timeSlot.status,
          },
        };
      },
      {} as Schedule
    );

    return {
      name: resource.resource_name,
      schedule,
    } as CourtSchedule;
  });

  const tmrDate = formatDate(getTmrDate());

  return {
    date: tmrDate,
    schedules: courtSchedules,
  };
}
