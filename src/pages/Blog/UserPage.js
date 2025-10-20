/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState, useCallback } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { instance } from '../../config/Http';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// import Button from '../../src/theme/overrides/Button';

// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'title', label: 'Title', alignRight: false },
  // { id: 'discription', label: 'Description', alignRight: false },
  { id: 'image', label: 'Image', alignCenter: true },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'action', label: 'Action', alignCenter: true },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [page, setPage] = useState(0);
  const imageBasedUrl = 'https://assignmenthelpapi.dev-sh.xyz/storage/';

  const [order, setOrder] = useState('asc');

  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [USERLIST, setUSERLIST] = useState([]);
  const [loader, setLoader] = useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.firstName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const token = localStorage.getItem('accessToken');
  const currentprotocol = window.location.protocol;

  const user = useCallback(() => {
    setLoader(true);

    instance
      .get('admin/post')
      .then((response) => {
        console.log(response,"response");
        setLoader(false);
        setUSERLIST(response.data?.post);
        setStatusChanges(response?.data?.data?.map((e) => e));
        localStorage.setItem('lenderLength', response?.data?.data?.length);
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
  }, [token]);

  useEffect(() => {
    user();
  }, [user]);

  const delet = (id) => {
    setLoader(true);
    try {
      instance.delete(`admin/post/${id}`).then((response) => {
        if (response?.data.status === true) {
          setLoader(false);
          Swal.fire({
            title: 'Good job! ',
            text: 'Your Blog deleted successFully',
            icon: 'success',
            button: 'Ok',
          });
          user();
        } else {
          setLoader(false);
        }
      });
    } catch (error) {
      setLoader(false);
      console.log(error, ' user error');
      Swal.fire({
        title: 'Some Thing Went Wrong! ',
        text: error?.message,
        icon: 'danger',
        button: 'Ok',
      });
    }
  };
  const [StatusChanges, setStatusChanges] = useState();
  const statusChanged = (id) => {
    setLoader(true);
    try {
      const config = {
        method: 'get',
        url: `https://companyapi.dev-sh.xyz/api/lender/status/${id}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };
      axios(config).then((response) => {
        // setStatusChanges(response?.data?.lender);
        console.log(response, 'user =======');
        if (response?.data?.status === true) {
          setLoader(false);
          Swal.fire({
            title: 'Good job! ',
            text: response?.data?.message,
            icon: 'success',
            button: 'Ok',
          });
          user();
        } else {
          setLoader(false);
        }
      });
    } catch (error) {
      setLoader(false);
      console.log(error, ' user error');
      Swal.fire({
        title: 'Some Thing Went Wrong! ',
        text: error?.message,
        icon: 'danger',
        button: 'Ok',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title> Blog | The Company </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Blog
          </Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard/addblog')} sx={{ backgroundColor: 'red' }} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Blog
          </Button>
        </Stack>

        <Card>
          <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, backgroundColor: 'white' }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  <Backdrop sx={{ color: 'red', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loader}>
                    <CircularProgress color="inherit" />
                  </Backdrop>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, title, image, status } = row;
                    const selectedUser = selected.indexOf(title) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell>
                          <Typography variant="subtitle2" noWrap>
                            {id}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">{title}</TableCell>

                        {/* <TableCell align="left">{discription}</TableCell> */}
                        <TableCell align="left">
                          <img src={imageBasedUrl + image} style={{width:'80px',height:'80px',borderRadius:'50%'}} />
                        </TableCell>
                        <TableCell align="left">{status}</TableCell>
                        {/* <TableCell align="left">
                          <MenuItem sx={{ color: 'error.main' }} onClick={() => statusChanged(id)}>
                            {status === 'Active' ? (
                              <Iconify icon="ion:toggle-outline" width="40px" height="40px" color="#ff5a3c" sx={{}} />
                            ) : (
                              <Iconify icon="ion:toggle-outline" width="40px" height="40px" hFlip="true" />
                            )}
                          </MenuItem>
                        </TableCell> */}

                        <TableCell style={{ width: '30%', display: 'flex' }}>
                          <MenuItem sx={{ color: 'error.main' }} onClick={() => navigate(`/dashboard/editblog/${id}` , {state : row})}>
                            <EditIcon color="#ff5a3c" sx={{}} />
                          </MenuItem>
                          <MenuItem sx={{ color: 'error.main' }} onClick={() => delet(id)}>
                            <Iconify icon={'eva:trash-2-outline'} sx={{}} />
                          </MenuItem>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
