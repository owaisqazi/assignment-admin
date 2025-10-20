/* eslint-disable no-unused-vars */
import { useEffect, useState,useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// mocks_
import account from '../../../_mock/account';
import image from '../../../components/logo/logo3.png';

// ----------------------------------------------------------------------

// const MENU_OPTIONS = [
//   {
//     label: 'Home',
//     icon: 'eva:home-fill',
//   },
//   {
//     label: 'Profile',
//     icon: 'eva:person-fill',
//   },
//   {
//     label: 'Settings',
//     icon: 'eva:settings-2-fill',
//   },
// ];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [, setLoader] = useState(false);
  const [ProfileData, setProfileData] = useState('');
  const token = localStorage.getItem('accessToken');
  // eslint-disable-next-line no-unused-vars
  const currentprotocol = window.location.protocol;
const Navigate = useNavigate();

  // const profile = useCallback(() => {
  //   setLoader(true);
  //   const config = {
  //     method: 'get',
  //     url: `${currentprotocol}//sarealtvapi.developer-iu.xyz/api/user`,
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
  // },[currentprotocol,token])
  // useEffect(() => {
  //   profile();
  // }, [profile]);
  const [open, setOpen] = useState(null);

  // const Navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const logout = () => {
    localStorage.clear('accessToken');
    Navigate('/login');
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              // borderRadius: '50%',
              position: 'absolute',
              // bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Box sx={{ height: '70px', width: "100%",backgroundColor: "#ff5a3c", marginBottom: "20px" }}>
        <Avatar src={image} alt="" sx={{ height: 'auto', width: "110px", objectFit: 'cover' }}/>
      </Box>
        {/* {token ? (
          <Avatar src='/favicon/favicon.ico' alt="adimn Pic" />
        ) : (
          <Avatar src='/favicon/favicon.ico' alt="photoURL" />
        )} */}
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          {token ? (
            <Typography variant="subtitle2" noWrap>
               Assignment Help
            </Typography>
          ) : (
            <Typography variant="subtitle2" noWrap>
              Assignment Help
            </Typography>
          )}

          {token ? (
            <Typography variant="subtitle2" noWrap>
              {ProfileData?.email}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {account.email}
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </Stack> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
