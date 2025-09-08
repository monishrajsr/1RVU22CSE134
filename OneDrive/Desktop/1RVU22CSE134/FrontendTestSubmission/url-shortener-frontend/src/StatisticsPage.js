import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Grid, Alert } from '@mui/material';
import axios from 'axios';


const StatisticsPage = () => {
  const [codes, setCodes] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load codes from sessionStorage (created URLs in this session)
  useEffect(() => {
    const stored = sessionStorage.getItem('shortenedCodes');
    if (stored) {
      setCodes(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (codes.length === 0) return;
    setLoading(true);
    Promise.all(
      codes.map(code =>
        axios.get(`http://localhost:3000/shorturls/${code}/stats`)
          .then(res => ({ code, ...res.data }))
          .catch(err => ({ code, error: err.response?.data?.error || 'Unknown error' }))
      )
    ).then(results => {
      setStats(results);
      setLoading(false);
    });
  }, [codes]);

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          URL Shortener Statistics
        </Typography>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {!loading && stats.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>No URLs shortened in this session.</Alert>
        )}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {stats.map((stat, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper elevation={3} sx={{ p: 2, background: stat.error ? '#ffebee' : '#f5faff' }}>
                <Typography variant="h6" sx={{ color: '#1565c0' }}>Shortened URL: <a href={`http://localhost:3000/${stat.code}`} target="_blank" rel="noopener noreferrer">http://localhost:3000/{stat.code}</a></Typography>
                {stat.error ? (
                  <Typography color="error">Error: {stat.error}</Typography>
                ) : (
                  <>
                    <Typography><strong>Original URL:</strong> {stat.originalUrl}</Typography>
                    <Typography><strong>Created At:</strong> {stat.createdAt}</Typography>
                    <Typography><strong>Expiry:</strong> {stat.expiry}</Typography>
                    <Typography><strong>Total Clicks:</strong> {stat.totalClicks}</Typography>
                    <Box mt={2}>
                      <Typography variant="subtitle1">Click Details:</Typography>
                      {stat.clickDetails.length === 0 ? (
                        <Typography>No clicks yet.</Typography>
                      ) : (
                        <ul>
                          {stat.clickDetails.map((click, i) => (
                            <li key={i}>
                              <strong>Time:</strong> {click.timestamp} | <strong>Source:</strong> {click.userAgent} | <strong>IP:</strong> {click.ip}
                              {click.location && (
                                <> | <strong>Location:</strong> {click.location}</>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Box>
                  </>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default StatisticsPage;
