import CardContainer from '@/demo/villagefund/components/common/CardContainter';
import WeeklyActivityChart from '@/demo/villagefund/components/sections/dashboard/activity/WeeklyActivityChart';
import { type TransactionDataType, transactionData } from '@/demo/villagefund/data/activity-chart';
import ReactECharts from 'echarts-for-react';
import { useChartResize } from '@/demo/villagefund/providers/useEchartResize';
import { useRef, useState } from 'react';

const WeeklyActivity = () => {
  const chartRef = useRef<ReactECharts>(null);
  const [chartData] = useState<TransactionDataType>(transactionData);
  useChartResize(chartRef as any);

  return (
    <CardContainer title="Weekly Activity">
      <WeeklyActivityChart chartRef={chartRef} seriesData={chartData} />
    </CardContainer>
  );
};

export default WeeklyActivity;