import CardContainer from '@/demo/villagefund/components/common/CardContainter';
import BalanceHistoryChart from '@/demo/villagefund/components/sections/dashboard/balance/BalanceHistoryChart';
import { balanceData, type BalanceDataType } from '@/demo/villagefund/data/balance-chart';
import ReactECharts from 'echarts-for-react';
import { useChartResize } from '@/demo/villagefund/providers/useEchartResize';
import { useEffect, useRef, useState } from 'react';

const BalanceHistory = () => {
  const chartRef = useRef<ReactECharts>(null);
  const [chartData, setChartData] = useState<BalanceDataType>([]);
  useChartResize(chartRef as any);

  // แก้ไข useEffect
  useEffect(() => {
    setChartData(balanceData);
  }, []); // เรียกครั้งเดียวตอน mount

  return (
    <CardContainer title="Balance History">
      <BalanceHistoryChart chartRef={chartRef} seriesData={chartData} />
    </CardContainer>
  );
};

export default BalanceHistory;
