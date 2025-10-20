import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography } from '@mui/material';
// components
// sections
import { AppWidgetSummary } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  // const [LenderCount, setLenderCount] = useState([]);
  // const [PackageCount, setPackageCount] = useState([]);
  // const [, setLoader] = useState(false);
  // const token = localStorage.getItem('accessToken');

  // const user = useCallback(() => {
  //   setLoader(true);
  //   instance
  //     .get('lender')
  //     .then((response) => {
  //       setLoader(false);
  //       setLenderCount(response?.data?.data?.length);
  //       console.log(response, 'user api');
  //     })
  //     .catch((error) => {
  //       setLoader(false);
  //       console.log(error);
  //     });
  //   console.log(token);
  // }, [token]);

  // const viewpackage = useCallback(() => {
  //   setLoader(true);

  //   instance
  //     .get('package')
  //     .then((response) => {
  //       setLoader(false);
  //       setPackageCount(response?.data?.data?.length);
  //       console.log(response, 'series api');
  //     })
  //     .catch((error) => {
  //       setLoader(false);
  //       console.log(error);
  //     });
  //   console.log(token);
  // }, [token]);

  // useEffect(() => {
  //   user();
  //   viewpackage();
  // }, [user, viewpackage]);
  return (
    <>
      <Helmet>
        <title> Dashboard | Assignment Help </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary title="Blog" total="5" icon={'ant-design:user'} />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Package"
              total={PackageCount}
              color="info"
              icon={'eos-icons:subscriptions-created'}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
