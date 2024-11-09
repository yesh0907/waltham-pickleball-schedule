import { Hono } from "hono";
import { scrape } from "./scraper";
import { createClient } from "redis";
import { formatDate, getTdyDate } from "./utils";

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
  console.error(`Redis client error:`, err);
});

await client.connect();

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello PB Scraper!");
});

app.get("/scrape", async (c) => {
  const { date, schedules } = await scrape();
  await client.set(date, JSON.stringify(schedules));

  return c.json(
    {
      success: true,
    },
    200
  );
});

app.get("/schedules", async (c) => {
  const date = formatDate(getTdyDate());
  const schedules = await client.get(date);
  if (!schedules) {
    return c.json({
      schedules: null,
      error: true,
      message: "no schedules available",
    });
  }
  return c.json({
    schedules: JSON.parse(schedules),
    error: false,
  });
});

export default app;
