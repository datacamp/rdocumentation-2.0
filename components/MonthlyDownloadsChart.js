import { ResponsiveContainer, AreaChart, Tooltip, Area, XAxis } from 'recharts';

const data = [
  {
    month: 'January 2020',
    downloads: 8000,
  },
  {
    month: 'Feburary 2020',
    downloads: 7000,
  },
  {
    month: 'March 2020',
    downloads: 6000,
  },
  {
    month: 'April 2020',
    downloads: 5000,
  },
  {
    month: 'May 2020',
    downloads: 7000,
  },
  {
    month: 'June 2020',
    downloads: 6000,
  },
  {
    month: 'July 2020',
    downloads: 7000,
  },
  {
    month: 'August 2020',
    downloads: 8000,
  },
  {
    month: 'September 2020',
    downloads: 7000,
  },
  {
    month: 'October 2020',
    downloads: 9000,
  },
  {
    month: 'November 2020',
    downloads: 9000,
  },
  {
    month: 'December 2020',
    downloads: 10000,
  },
];

export default function MonthlyDownloadsChart() {
  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 0,
        }}
      >
        <XAxis dataKey="month" hide />
        <Area
          type="monotone"
          name="Downloads"
          dataKey="downloads"
          stroke="#05192D"
          fill="#05192D"
        />
        <Tooltip />
      </AreaChart>
    </ResponsiveContainer>
  );
}
