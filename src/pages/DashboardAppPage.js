import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useKeycloak } from 'keycloak-react-web';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// sections
import { AppWidgetSummary } from '../sections/@dashboard/app';
import { useAccessToken } from '../services/AccessTokenProvider';
import { DashboardService } from '../services/DashbordService';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  const [countMat,setCountMat] = useState(0);
  const [pendingCmdCount,setPendingCmdCount] = useState(0);
  const [matNotUsed,setMatNotUsed] = useState(0);
  const [name, setName] = useState("");

  const { keycloak } = useKeycloak();
  const { setAccessToken } = useAccessToken();

  // Check if the user is authenticated
  if (keycloak.authenticated) {
    // Access the access token
    const accessToken = keycloak.token;

    // Store the access token in the context
    setAccessToken(accessToken);

    // ...
  }

  useEffect(() => {
    if(keycloak.authenticated){
      setName(keycloak.tokenParsed.name);
    }
    DashboardService.materielsCount(localStorage.getItem('access_token')).then((data) => setCountMat(data));
    DashboardService.pendingCmdCount(localStorage.getItem('access_token')).then((data) => setPendingCmdCount(data));
    DashboardService.countMaterielsNotUsed(localStorage.getItem('access_token')).then((data) => setMatNotUsed(data));
  }, []);


  return (
    <>
      <Helmet>
        <title> Stock Management </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Bonjour, {name}
        </Typography>

        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Matériels" total={54} icon={'ant-design:android-filled'} />
          </Grid> */}

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Matériels" total={countMat} color="info" icon={'teenyicons:screen-alt-solid'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Commande En Attente" total={pendingCmdCount} color="warning" icon={'icon-park-solid:shopping'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Matériel(s) Non utilisé(s)" total={matNotUsed} color="error" icon={'ic:round-stop-screen-share'} />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}
