import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// sections
import { AppWidgetSummary } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Stock Management </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Bonjour, Ahmed Alami
        </Typography>

        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Matériels" total={54} icon={'ant-design:android-filled'} />
          </Grid> */}

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Matériels" total={54} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Commande En Attente" total={22} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Matériel(s) Non utilisé(s)" total={13} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}
