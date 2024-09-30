import { chromium } from "@playwright/test";
import type { AvailabilityResponse } from "./types";

const BOOKING_PAGE =
  "https://anc.apm.activecommunities.com/walthamrecreation/reservation/landing/quick?locale=en-US&groupId=2";
const AVAILABILITY_ENDPOINT =
  "https://anc.apm.activecommunities.com/walthamrecreation/rest/reservation/quickreservation/availability?locale=en-US";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(BOOKING_PAGE, {
    waitUntil: "networkidle",
  });

  // Get tomorrow's date in the format used by the availability API (e.g., "2024-10-19)
  const tmr = new Date();
  tmr.setDate(tmr.getDate() + 1);
  const tmrFormattedDate = tmr.toISOString().split("T")[0];

  // Get the CSRF token from the page
  const csrfToken = await page.evaluate(() => {
    return (window as any).__csrfToken || null;
  });
  if (!csrfToken) {
    console.error("CSRF token not found");
    return;
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

  // Make the fetch request
  let res: AvailabilityResponse;
  try {
    res = await page.evaluate(
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

    await Bun.write("schedule.json", JSON.stringify(res));
  } catch (error) {
    console.error("Error fetching availability:", error);
  }

  await browser.close();
})();
