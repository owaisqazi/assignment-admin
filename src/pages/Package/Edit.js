/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [time, setTime] = useState('');
  const [period, setPeriod] = useState('');
  const [Desc, setDesc] = useState('');
  const [Error, setError] = useState('');
  const [loader, setLoader] = useState(false);

  const Navigate = useNavigate();

  const token = localStorage.getItem('accessToken');
  const { id } = useParams();

  const ShowPackage = () => {
    setLoader(true);
    try {
      const config = {
        method: 'get',
        url: `https://companyapi.dev-sh.xyz/api/package/${id}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };
      axios(config)
        .then((response) => {
          setLoader(false);
          const {id,name,desc,period,price,time} = response?.data?.package;
          setName(name);
          setDesc(desc);
          setPeriod(period);
          setPrice(price);
          setTime(time);
          console.log(response, ' Packgeapi');
        })
        .catch((error) => {
          setLoader(false);
          console.log(error, ' Packgeapi');
        });
    } catch (error) {
      setLoader(false);
      setError(error?.response?.data?.errors);
    }
  };

  useEffect(() => {
    ShowPackage();
  }, []);

  const UpdatePackage = () => {
    setLoader(true);
    try {
      const PackageData = new URLSearchParams();
      PackageData.append('name', name);
      PackageData.append('price', price);
      PackageData.append('time', time);
      PackageData.append('period', period);
      PackageData.append('desc', Desc);

      const config = {
        method: 'put',
        url: `https://companyapi.dev-sh.xyz/api/package/${id}`,
        data: PackageData,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };
      axios(config)
        .then((response) => {
          setLoader(false);
          console.log(response, ' Packgeapi');
          Swal.fire({
            title: 'Good job! ',
            text: response?.data?.message,
            icon: 'success',
            button: 'Ok',
          });
          Navigate('/dashboard/viewpackage');
        })
        .catch((error) => {
          setLoader(false);
          const key = Object.keys(error?.response?.data?.errors);
          key.forEach((e) => {
            Swal.fire({
              title: 'Opps! ',
              text: error?.response?.data.errors[e][0],
              icon: 'error',
              button: 'Ok',
            });
          });
        });
    } catch (error) {
      setLoader(false);
      setError(error?.response?.data?.errors);
    }
  };

  return (
    <>
      <Helmet>
        <title> Update Package | The Company </title>
      </Helmet>
      <Backdrop sx={{ color: 'red', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loader}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card style={{ width: '50%', margin: 'auto' }}>
        <CardContent>
          <h1 color="text.secondary">Update Package</h1>
          <Box
            sx={{
              width: 500,
              maxWidth: '100%',
            }}
          >
            <TextField
              fullWidth
              id="fullWidth"
              placeholder="Enter Name"
              value={name}
              sx={{ mb: 2 }}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-danger">{Error?.name}</p>
          </Box>
          <Box
            sx={{
              width: 500,
              maxWidth: '100%',
            }}
          >
            <TextField
              fullWidth
              id="fullWidth"
              value={price}
              placeholder="Enter Prcie"
              sx={{ mb: 2 }}
              onChange={(e) => setPrice(e.target.value)}
            />
            <p className="text-danger">{Error?.name}</p>
          </Box>
          <Box
            sx={{
              width: 500,
              maxWidth: '100%',
            }}
          >
            <TextField
              fullWidth
              id="fullWidth"
              value={time}
              placeholder="Enter Time"
              sx={{ mb: 2 }}
              onChange={(e) => setTime(e.target.value)}
            />
            <p className="text-danger">{Error?.name}</p>
          </Box>
          <Box
            sx={{
              width: 500,
              maxWidth: '100%',
            }}
          >
            <TextField
              fullWidth
              id="fullWidth"
              value={period}
              placeholder="Enter Period"
              sx={{ mb: 2 }}
              onChange={(e) => setPeriod(e.target.value)}
            />
            <p className="text-danger">{Error?.name}</p>
          </Box>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-multiline-static"
              multiline
              rows={4}
              value={Desc}
              placeholder="Enter Description"
              sx={{ mb: 3 }}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Button size="large" variant="contained" sx={{ backgroundColor: '#ff5a3c', my: 2 }} 
          onClick={UpdatePackage}
          >
            Update
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default Edit;
