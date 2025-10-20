/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
// import { styled } from '@mui/material/styles';
import { Avatar, Box, Drawer, Typography } from '@mui/material';
import axios from 'axios';
// mock
// import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import image from '../../../components/logo/logo3.png';

// ----------------------------------------------------------------------

const NAV_WIDTH = 281;

// const StyledAccount = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(2, 2.5),
//   borderRadius: Number(theme.shape.borderRadius) * 1.5,
//   backgroundColor: alpha(theme.palette.red[500], 0.12),
//   backgroundColor: 'red',
// }));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const [, setLoader] = useState(false);
  const [, setProfileData] = useState('');
  const token = localStorage.getItem('accessToken');
  // const profile = useCallback(() => {
  //   setLoader(true);
  //   const config = {
  //     method: 'get',
  //     url: 'https://sarealtvapi.developer-iu.xyz/api/user',
  //     headers: {
  //       Accept: 'application/json',
  //       Authorization: `Bearer ${JSON.parse(token)}`,
  //     },
  //   };

  //   axios(config)
  //     .then((response) => {
  //       setLoader(false);
  //       setProfileData(response?.data);
  //       console.log(response?.data, 'profile api');
  //     })
  //     .catch((error) => {
  //       setLoader(false);
  //       console.log(error);
  //     });
  //   console.log(token);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[token])
  // useEffect(() => {
  //   profile();
  // }, [profile]);

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ height: '92px', width: "100%",backgroundColor: "#ff5a3c", marginBottom: "20px", }}>
        <Avatar src={image} alt="" sx={{ height: 'auto', width: "110px", objectFit: 'cover' }}/>
      </Box>


      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: '#ff5a3c',
              paddingRight: '3px',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
