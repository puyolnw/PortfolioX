import { Grid } from '@mui/material';
import { memo } from 'react';
import WeeklyActivity from '@/demo/villagefund/components/sections/dashboard/activity/WeeklyActivity';
import BalanceHistory from '@/demo/villagefund/components/sections/dashboard/balance/BalanceHistory';
import MyCards from '@/demo/villagefund/components/sections/dashboard/creditCards/MyCards';
import ExpenseStatistics from '@/demo/villagefund/components/sections/dashboard/expense/ExpenseStatistics';
import InvoiceOverviewTable from '@/demo/villagefund/components/sections/dashboard/invoice/InvoiceOverviewTable';
import RecentTransactions from '@/demo/villagefund/components/sections/dashboard/transactions/RecentTransaction';
import QuickTransfer from '@/demo/villagefund/components/sections/dashboard/transfer/QuickTransfer';

const Dashboard = memo(() => {
  return (
    <Grid container spacing={{ xs: 2.5, sm: 3 }} mb={3}>
      {/* ------------- Card section ---------------- */}
      <Grid size={{ xs: 12, xl: 8 }} zIndex={1}>
        <MyCards />
      </Grid>
      <Grid size={{ xs: 12, xl: 4 }} zIndex={1}>
        <RecentTransactions />
      </Grid>

      {/* ------------- Chart section ---------------- */}
      <Grid size={{ xs: 12, lg: 8 }} zIndex={1}>
        <WeeklyActivity />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <ExpenseStatistics />
      </Grid>

      {/* ------------- Slider section ---------------- */}
      <Grid size={{ xs: 12, lg: 6, xxl: 4 }} zIndex={1}>
        <QuickTransfer />
      </Grid>
      <Grid size={{ xs: 12, lg: 6, xxl: 8 }} zIndex={1}>
        <BalanceHistory />
      </Grid>

      {/* ------------- Data-Grid section ---------------- */}
      <Grid size={{ xs: 12 }}>
        <InvoiceOverviewTable />
      </Grid>
    </Grid>
  );
});

export default Dashboard;