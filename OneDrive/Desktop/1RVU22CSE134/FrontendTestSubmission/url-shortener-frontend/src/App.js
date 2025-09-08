
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UrlShortenerPage from './UrlShortenerPage';
import StatisticsPage from './StatisticsPage';


function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#eee', marginBottom: '2rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>URL Shortener</Link>
        <Link to="/statistics">Statistics</Link>
      </nav>
      <Routes>
        <Route path="/" element={<UrlShortenerPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
