import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Templates from './pages/Templates';
import Projects from './pages/Projects';
import ProjectEstimate from './pages/ProjectEstimate';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <div className="nav-brand">
            <h1>Kadro Pricing</h1>
          </div>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/templates">Templates</Link>
            <Link to="/projects">Projects</Link>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectEstimate />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
