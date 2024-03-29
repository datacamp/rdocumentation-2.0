import {
  endOfMonth,
  format,
  formatISO,
  startOfMonth,
  subMonths,
} from 'date-fns';

import { sumByGroup } from './utils';

export async function getMonthlyDownloads(packageName: string) {
  const today = new Date();

  // start of month, 1 year ago
  const startDate = formatISO(startOfMonth(subMonths(today, 12)), {
    representation: 'date',
  });

  // end of last month
  const endDate = formatISO(endOfMonth(subMonths(today, 1)), {
    representation: 'date',
  });

  // get the daily data
  const res = await fetch(
    `https://cranlogs.r-pkg.org/downloads/daily/${startDate}:${endDate}/${packageName}`,
  );
  const dailyDownloads = (await res.json())[0].downloads;

  // if none, then return empty array
  if (!dailyDownloads) return null;

  // add month labels to the data
  const dailyDownloadsWithMonths = dailyDownloads.map((singleDay) => ({
    ...singleDay,
    month: format(new Date(singleDay.day), 'MMMM yyyy'),
  }));

  // calculate downloads by month
  const monthlyDownloadsRaw = sumByGroup(
    dailyDownloadsWithMonths,
    'month',
    'downloads',
  );

  // return an array of objects in the correct format
  const months = Object.keys(monthlyDownloadsRaw);
  const downloads = Object.values(monthlyDownloadsRaw);

  return months
    .map((month, i) => ({
      downloads: downloads[i],
      month,
    }))
    .slice(-12);
}
