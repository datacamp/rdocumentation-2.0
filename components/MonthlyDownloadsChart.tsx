import { useContext } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { ThemeContext } from '../pages/_app';

// copied from tailwind.config.js
const colors = {
  'dc-navy': '#05192D',
  'dc-yellow': '#FCCE0D',
};

type Props = {
  monthlyDownloads: Array<{ downloads: number; month: string }>;
};

export default function MonthlyDownloadsChart({ monthlyDownloads }: Props) {
  const { theme } = useContext(ThemeContext);
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
          fill={theme === 'light' ? colors['dc-navy'] : colors['dc-yellow']}
          name="Downloads"
          stroke={theme === 'light' ? colors['dc-navy'] : colors['dc-yellow']}
          type="monotone"
        />
        <Tooltip
          contentStyle={
            theme === 'light' ? {} : { backgroundColor: colors['dc-navy'] }
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
