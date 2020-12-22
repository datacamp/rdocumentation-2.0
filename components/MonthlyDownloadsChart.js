import { ResponsiveContainer, AreaChart, Tooltip, Area, XAxis } from 'recharts';

// copied from tailwind.config.js
const colors = {
  'dc-navy': '#05192D',
  'dc-yellow': '#FCCE0D',
};

export default function MonthlyDownloadsChart({ monthlyDownloads, isDark }) {
  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart
        data={monthlyDownloads}
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
