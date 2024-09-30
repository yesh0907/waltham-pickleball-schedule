import { chromium, expect } from "@playwright/test";

const BOOKING_PAGE =
  "https://anc.apm.activecommunities.com/walthamrecreation/reservation/landing/quick?locale=en-US&groupId=2";

// METHOD #1: use the UI and select the date and then get the availability
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(BOOKING_PAGE, {
    waitUntil: "networkidle",
  });

  // Get tomorrow's date in the format used on the page (e.g., "Thu, Oct 19, 2024")
  const tmr = new Date();
  tmr.setDate(tmr.getDate() + 1);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const tmrFormattedDate = tmr.toLocaleDateString("en-US", options);

  // select tomorrow's date
  const dateSelector = await page.getByLabel("Date picker, current date");
  await dateSelector.click();
  await page.getByLabel(tmrFormattedDate).click();

  // verify the date is selected correctly
  const expectedSelectedDate = tmr.toLocaleDateString("en-US", {
    ...options,
    weekday: "short",
  });
  await expect(dateSelector).toHaveValue(expectedSelectedDate);

  // get the data from the table

  await browser.close();
})();
