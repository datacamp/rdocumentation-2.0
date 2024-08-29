import { useRouter } from 'next/router';

const top50Paths = [
  '/packages/stats/versions/3.6.2/topics/glm',
  '/packages/base/versions/3.6.2/topics/merge',
  '/packages/stats/versions/3.6.2/topics/t.test',
  '/packages/pheatmap/versions/1.0.12/topics/pheatmap',
  '/packages/stats/versions/3.6.2/topics/lm',
  '/packages/graphics/versions/3.6.2/topics/plot',
  '/packages/base/versions/3.6.2/topics/grep',
  '/packages/AlphaPart/versions/0.9.8/topics/write.csv',
  '/packages/base/versions/3.6.2/topics/lapply',
  '/packages/dplyr/versions/0.7.8/topics/filter',
  '/packages/base/versions/3.6.2/topics/Round',
  '/packages/utils/versions/3.6.2/topics/read.table',
  '/packages/data.table/versions/1.15.4/topics/fread',
  '/packages/base/versions/3.6.2/topics/ifelse',
  '/packages/base/versions/3.6.2/topics/data.frame',
  '/packages/base/versions/3.6.2/topics/as.Date',
  '/packages/base/versions/3.6.2/topics/sample',
  '/packages/stats/versions/3.6.2/topics/wilcox.test',
  '/packages/base/versions/3.6.2/topics/table',
  '/packages/stats/versions/3.6.2/topics/quantile',
  '/packages/stats/versions/3.6.2/topics/cor',
  '/packages/base/versions/3.6.2/topics/cbind',
  '/packages/xlsx/versions/0.6.5/topics/write.xlsx',
  '/packages/utils/versions/3.6.2/topics/write.table',
  '/packages/base/versions/3.6.2/topics/seq',
  '/packages/readxl/versions/0.1.1/topics/read_excel',
  '/packages/base/versions/3.6.2/topics/paste',
  '/packages/stats/versions/3.6.2/topics/p.adjust',
  '/packages/base/versions/3.6.2/topics/rep',
  '/packages/base/versions/3.6.2/topics/factor',
  '/packages/stats/versions/3.6.2/topics/prcomp',
  '/packages/utils/versions/3.6.2/topics/install.packages',
  '/packages/stats/versions/3.6.2/topics/optim',
  '/packages/stats/versions/3.6.2/topics/aggregate',
  '/packages/stats/versions/3.6.2/topics/hclust',
  '/packages/base/versions/3.6.2/topics/list.files',
  '/packages/lme4/versions/1.1-35.5/topics/lmer',
  '/packages/dplyr/versions/1.0.10/topics/case_when',
  '/packages/stats/versions/3.6.2/topics/chisq.test',
  '/packages/base/versions/3.6.2/topics/scale',
  '/packages/ggpubr/versions/0.6.0/topics/stat_compare_means',
  '/packages/reshape2/versions/1.4.4/topics/melt',
  '/packages/dplyr/versions/1.0.10/topics/count',
  '/packages/graphics/versions/3.6.2/topics/hist',
  '/packages/stats/versions/3.6.2/topics/cor.test',
  '/packages/mice/versions/3.16.0/topics/mice',
  '/packages/forecast/versions/8.23.0/topics/auto.arima',
  '/packages/base/versions/3.6.2/topics/substr',
];

export const useRenderCourseAds = () => {
  const router = useRouter();

  console.log(JSON.stringify(router));

  return top50Paths.includes(router.asPath);
};
