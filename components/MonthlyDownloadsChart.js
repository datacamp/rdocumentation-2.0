import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

// copied from tailwind.config.js
const colors = {
  'dc-navy': '#05192D',
  'dc-yellow': '#FCCE0D',
};

export default function MonthlyDownloadsChart({ isDark, monthlyDownloads }) {
  return (
    <ResponsiveContainer height={50} width="100%">
      <AreaChart
        data={monthlyDownloads}
        margin={{
          bottom: 0,
          left: 5,
          right: 5,
          top: 5,
        }}
      >
        <XAxis dataKey="month" hide />
        <Area
          dataKey="downloads"
          fill={isDark ? colors['dc-yellow'] : colors['dc-navy']}
          name="Downloads"
          stroke={isDark ? colors['dc-yellow'] : colors['dc-navy']}
          type="monotone"
        />
        <Tooltip
          contentStyle={isDark ? { backgroundColor: colors['dc-navy'] } : {}}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
