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

// copied from tailwind.config.js
const colors = {
  'dc-navy': '#05192D',
  'dc-yellow': '#FCCE0D',
};

export default function MonthlyDownloadsChart({ isDark }) {
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
          stroke={isDark ? colors['dc-yellow'] : colors['dc-navy']}
          fill={isDark ? colors['dc-yellow'] : colors['dc-navy']}
        />
        <Tooltip
          contentStyle={isDark ? { backgroundColor: colors['dc-navy'] } : {}}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
