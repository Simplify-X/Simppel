  // @ts-nocheck
  import React, { useState, useEffect } from 'react';
  import Table from '@mui/material/Table';
  import TableBody from '@mui/material/TableBody';
  import TableCell from '@mui/material/TableCell';
  import TableContainer from '@mui/material/TableContainer';
  import TableHead from '@mui/material/TableHead';
  import TableRow from '@mui/material/TableRow';
  import Card from '@mui/material/Card';
  import Button from '@mui/material/Button';
  import Typography from '@mui/material/Typography';
  import { useTheme } from '@mui/material/styles';
  import TablePagination from '@mui/material/TablePagination';
  import axios from 'axios';
  import Loader from 'src/@core/components/ui/Loader'
  import IconButton from '@mui/material/IconButton'
  import CloseIcon from '@mui/icons-material/Close'

  const KeywordResults = ({ keyword, language, location, onClose }) => {
    const theme = useTheme();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const login = 'algarmakany.ext@nubedian.de';
      const password = 'c151ace8a34616d9';
      const cred = Buffer.from(`${login}:${password}`).toString('base64');
      const apiUrl = "https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/live"

      const requestData = [
        {
          keywords: {keyword},
          location_name: {location},
          language_name: {language},
          search_partners: true
        },
      ];

      const config = {
        headers: {
          Authorization: `Basic ${cred}`,
          'Content-Type': 'application/json',
        },
      };

      axios
        .post(apiUrl, requestData, config)
        .then((response) => {
          setRows(response.data.tasks[0]?.result || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }, []);

    const handleChangePage = (_, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    if (loading) {
      return <Loader />
    }

    return (
      <Card
        sx={{
          position: 'relative',
          maxWidth: '90%',
          mx: 'auto',
          mt: 10,
          mb: 2,
          p: theme.spacing(6),
          boxShadow: `0px 0px 8px 0px ${theme.palette.primary.main}`,
        }}
      >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1,
        }}
      >
        <CloseIcon />
      </IconButton>
        <Typography variant='h5' sx={{ mb: 2 }}>
          Keyword results for "{keyword}"
        </Typography>
        <Button variant='contained' sx={{ mb: 4, mt: 8 }}>
          Download My Keywords
        </Button>
        {loading ? (
          <Typography variant='subtitle1' sx={{ mb: 4, mt: 8 }}>
            Loading...
          </Typography>
        ) : (
          <Typography variant='subtitle1' sx={{ mb: 4, mt: 8 }}>
            Showing {rowsPerPage} of {rows.length} keywords
          </Typography>
        )}
        {loading ? (
          <Typography variant='subtitle1' sx={{ mb: 4, mt: 8 }}>
            Loading...
          </Typography>
        ) : (
          <TableContainer>
            <Table aria-label='keyword results table'>
              <TableHead>
                <TableRow>
                  <TableCell>Keywords</TableCell>
                  <TableCell align='right'>Search volume</TableCell>
                  <TableCell align='right'>Top of page bid (low range)</TableCell>
                  <TableCell align='right'>Top of page bid (high range)</TableCell>
                  <TableCell align='right'>Competition</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component='th' scope='row'>
                        {row.keyword}
                      </TableCell>
                      <TableCell align='right'>{row.search_volume}</TableCell>
                      <TableCell align='right'>{row.top_of_page_bid_low}</TableCell>
                      <TableCell align='right'>{row.top_of_page_bid_high}</TableCell>
                      <TableCell align='right'>{row.competition}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {loading ? (
          <Typography variant='subtitle1' sx={{ mb: 4, mt: 8 }}>
            Loading...
          </Typography>
        ) : (
          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Card>
    );
  };

  export default KeywordResults;
