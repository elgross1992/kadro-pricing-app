import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    templateId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, templatesData] = await Promise.all([
        api.getProjects(),
        api.getTemplates()
      ]);
      setProjects(projectsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const template = templates.find(t => t.id === parseInt(formData.templateId));
      
      // Clone template tasks with new IDs for the project
      const tasks = template.tasks.map((task, index) => ({
        ...task,
        id: index + 1,
        resourceId: null // Will be set when assigning resources
      }));

      const projectData = {
        name: formData.name,
        platform: template.platform,
        templateId: template.id,
        status: 'draft',
        tasks: tasks,
        minMargin: 30,
        maxMargin: 40
      };

      const newProject = await api.createProject(projectData);
      setShowModal(false);
      setFormData({ name: '', templateId: '' });
      navigate(`/projects/${newProject.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await api.deleteProject(id);
        loadData();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
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
        <div className="flex-between">
          <div>
            <h2>Projects</h2>
            <p>Manage project estimates and pricing</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            New Project
          </button>
        </div>
      </div>

      <div className="card">
        {projects.length === 0 ? (
          <div className="text-center" style={{ padding: '3rem', color: '#666' }}>
            <h3 style={{ marginBottom: '1rem' }}>No projects yet</h3>
            <p style={{ marginBottom: '1.5rem' }}>Create your first project estimate to get started</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Create First Project
            </button>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Total Tasks</th>
                <th>Est. Range</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.platform}</td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: 
                        project.status === 'approved' ? '#d4edda' :
                        project.status === 'draft' ? '#fff3cd' : '#d1ecf1',
                      color:
                        project.status === 'approved' ? '#155724' :
                        project.status === 'draft' ? '#856404' : '#0c5460'
                    }}>
                      {project.status}
                    </span>
                  </td>
                  <td>{project.tasks?.length || 0}</td>
                  <td>
                    {project.minPrice && project.maxPrice
                      ? `${formatCurrency(project.minPrice)} - ${formatCurrency(project.maxPrice)}`
                      : 'Not calculated'}
                  </td>
                  <td>{formatDate(project.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/projects/${project.id}`}>
                        <button className="btn btn-secondary">View</button>
                      </Link>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Project</h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Acme Corp Shopify Store"
                  required
                />
              </div>

              <div className="form-group">
                <label>Platform Template</label>
                <select
                  value={formData.templateId}
                  onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                  required
                >
                  <option value="">Select a platform</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.platform} ({template.tasks.length} tasks)
                    </option>
                  ))}
                </select>
                <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                  This will load the template tasks, which you can then customize for this project.
                </small>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
