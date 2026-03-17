import CardContainer from '@/demo/villagefund/components/common/CardContainter';
import ExpenseStatisticsChart from '@/demo/villagefund/components/sections/dashboard/expense/ExpenseStatisticsChart';
import { expenseData, type ExpenseDataType } from '@/demo/villagefund/data/expense-chart';
import ReactECharts from 'echarts-for-react';
import { useChartResize } from '@/demo/villagefund/providers/useEchartResize';
import { useEffect, useRef, useState } from 'react';

const ExpenseStatistics = () => {
  const chartRef = useRef<ReactECharts>(null);
  const [chartData, setChartData] = useState<ExpenseDataType>([]);
  useChartResize(chartRef as any);
  // Fetch sales data
  useEffect(() => {
    const fetchData = () => {
      setChartData(expenseData);
    };

    fetchData();
  }, []);
  return (
    <CardContainer title="Expense Statistics">
      <ExpenseStatisticsChart chartRef={chartRef} seriesData={chartData} />
    </CardContainer>
  );
};

export default ExpenseStatistics;
