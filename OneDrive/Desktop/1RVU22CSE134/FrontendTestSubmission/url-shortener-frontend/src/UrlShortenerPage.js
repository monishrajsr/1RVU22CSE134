// ...existing code...
// ...existing code...


import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { logFrontendEvent } from './LoggingMiddlewareClient';

const MAX_URLS = 5;

const initialInputs = Array(MAX_URLS).fill().map(() => ({
  url: '',
  validity: '',
  shortcode: '',
}));

const initialErrors = Array(MAX_URLS).fill().map(() => ({
  url: '',
  validity: '',
  shortcode: '',
}));

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const UrlShortenerPage = () => {
  const [inputs, setInputs] = useState(initialInputs);
  const [errors, setErrors] = useState(initialErrors);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (idx, field, value) => {
    const newInputs = [...inputs];
    newInputs[idx][field] = value;
    setInputs(newInputs);
  };

  const validateInputs = () => {
    const newErrors = inputs.map((input) => {
      const err = { url: '', validity: '', shortcode: '' };
      if (input.url && !validateUrl(input.url)) {
        err.url = 'Invalid URL format';
      }
      if (input.validity && (!/^\d+$/.test(input.validity) || parseInt(input.validity) <= 0)) {
        err.validity = 'Validity must be a positive integer';
      }
      return err;
    });
    setErrors(newErrors);
    return newErrors.every(e => !e.url && !e.validity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateInputs()) return;
    setLoading(true);
    logFrontendEvent('Submitting URL shortening form');
    try {
      const requests = inputs
        .map((input) => input.url ? {
          url: input.url,
          validity: input.validity ? parseInt(input.validity) : undefined,
          shortcode: input.shortcode || undefined,
        } : null)
        .filter(Boolean)
        .map((payload) =>
          axios.post('http://localhost:3000/shorturls', payload)
        );
      const responses = await Promise.allSettled(requests);
      const newResults = responses.map((res, idx) => {
        if (res.status === 'fulfilled') {
          logFrontendEvent(`Shortened URL: ${inputs[idx].url} -> ${res.value.data.shortLink}`);
          return {
            original: inputs[idx].url,
            short: res.value.data.shortLink,
            expiry: res.value.data.expiry,
            error: null,
            code: (inputs[idx].shortcode || res.value.data.shortLink.split('/').pop()),
          };
        } else {
          logFrontendEvent(`Error shortening URL: ${inputs[idx].url}`, 'error');
          return {
            original: inputs[idx].url,
            short: '',
            expiry: '',
            error: res.reason?.response?.data?.error || 'Unknown error',
            code: (inputs[idx].shortcode || ''),
          };
        }
      });
      setResults(newResults);
      // Store successful codes in sessionStorage for statistics page
      const successfulCodes = newResults.filter(r => r.short && r.code).map(r => r.code);
      if (successfulCodes.length > 0) {
        const prev = sessionStorage.getItem('shortenedCodes');
        const allCodes = prev ? Array.from(new Set([...JSON.parse(prev), ...successfulCodes])) : successfulCodes;
        sessionStorage.setItem('shortenedCodes', JSON.stringify(allCodes));
      }
    } catch (err) {
      setError('Failed to shorten URLs. Please try again.');
      logFrontendEvent('Failed to shorten URLs', 'error');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          URL Shortener
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#555' }}>
          Enter up to 5 URLs to shorten. Optionally set expiry and preferred shortcode.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {inputs.map((input, idx) => (
              <Grid item xs={12} key={idx}>
                <Paper elevation={3} sx={{ p: 2, mb: 2, background: '#f5faff' }}>
                  <Typography variant="h6" sx={{ color: '#1565c0' }}>URL #{idx + 1}</Typography>
                  <TextField
                    label="Original URL"
                    value={input.url}
                    onChange={e => handleChange(idx, 'url', e.target.value)}
                    error={!!errors[idx].url}
                    helperText={errors[idx].url}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Validity (minutes)"
                    value={input.validity}
                    onChange={e => handleChange(idx, 'validity', e.target.value)}
                    error={!!errors[idx].validity}
                    helperText={errors[idx].validity}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Preferred Shortcode"
                    value={input.shortcode}
                    onChange={e => handleChange(idx, 'shortcode', e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }} disabled={loading}>
              Shorten URLs
            </Button>
            {loading && <CircularProgress size={24} />}
          </Box>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {results.length > 0 && (
          <Box mt={4}>
            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>Shortened URLs</Typography>
            <Grid container spacing={2}>
              {results.map((res, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <Paper elevation={2} sx={{ p: 2, mb: 2, background: res.error ? '#ffebee' : '#e3f2fd' }}>
                    <Typography><strong>Original:</strong> {res.original}</Typography>
                    {res.short ? (
                      <Typography><strong>Shortened:</strong> <a href={res.short} target="_blank" rel="noopener noreferrer">{res.short}</a></Typography>
                    ) : (
                      <Typography color="error"><strong>Error:</strong> {res.error}</Typography>
                    )}
                    <Typography><strong>Expiry:</strong> {res.expiry || '-'}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default UrlShortenerPage;
