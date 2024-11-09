import moment from "moment-timezone";

const TZ = "America/New_York";

// format date to be like the following 2024-10-19
export function formatDate(d: moment.Moment): string {
  return d.format("YYYY-MM-DD");
}

export function getTdyDate(): moment.Moment {
  return moment().tz(TZ);
}

export function getTmrDate(): moment.Moment {
  return moment().tz(TZ).add(1, "day").startOf("day");
}
