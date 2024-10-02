import { waitUntil } from "@vercel/functions";
import { kv } from "@vercel/kv";
import { scrape } from "@/lib/scraper";

export const dynamic = "force-dynamic";

// need to add some auth mechanism to api
export function GET() {
  waitUntil(scrapeAndStoreData());
  return Response.json({
    success: true,
  });
}

async function scrapeAndStoreData() {
  const { date, schedules } = await scrape();
  console.log(`got schedule for ${date}`);
  await kv.set(date, schedules);
}
