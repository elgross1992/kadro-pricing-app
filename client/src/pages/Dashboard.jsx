import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalResources: 0,
    totalTemplates: 0,
    recentProjects: []
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [projects, resources, templates] = await Promise.all([
        api.getProjects(),
        api.getResources(),
        api.getTemplates()
      ]);

      setStats({
        totalProjects: projects.length,
        totalResources: resources.length,
        totalTemplates: templates.length,
        recentProjects: projects.slice(-5).reverse()
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome to Kadro Pricing App</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <div className="stat-value">{stats.totalProjects}</div>
        </div>
        <div className="stat-card">
          <h3>Resources</h3>
          <div className="stat-value">{stats.totalResources}</div>
        </div>
        <div className="stat-card">
          <h3>Templates</h3>
          <div className="stat-value">{stats.totalTemplates}</div>
        </div>
      </div>

      <div className="card">
        <div className="flex-between mb-2">
          <h3>Recent Projects</h3>
          <Link to="/projects">
            <button className="btn btn-primary">New Project</button>
          </Link>
        </div>
        
        {stats.recentProjects.length === 0 ? (
          <p className="text-center" style={{ color: '#666', padding: '2rem' }}>
            No projects yet. Create your first project to get started!
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Est. Range</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProjects.map(project => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.platform}</td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: project.status === 'approved' ? '#d4edda' : '#fff3cd',
                      color: project.status === 'approved' ? '#155724' : '#856404'
                    }}>
                      {project.status}
                    </span>
                  </td>
                  <td>
                    {project.minPrice && project.maxPrice
                      ? `${formatCurrency(project.minPrice)} - ${formatCurrency(project.maxPrice)}`
                      : 'Not calculated'}
                  </td>
                  <td>{formatDate(project.createdAt)}</td>
                  <td>
                    <Link to={`/projects/${project.id}`}>
                      <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3>Quick Links</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/resources" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px', textAlign: 'center' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Manage Resources</h4>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>Add and edit team members</p>
            </div>
          </Link>
          <Link to="/templates" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px', textAlign: 'center' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Manage Templates</h4>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>Edit platform task lists</p>
            </div>
          </Link>
          <Link to="/projects" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px', textAlign: 'center' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>View All Projects</h4>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>See all estimates</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
