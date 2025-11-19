import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

function ProjectEstimate() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [roles, setRoles] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    description: '',
    estimateDays: '',
    roleId: ''
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [projectData, rolesData, resourcesData] = await Promise.all([
        api.getProject(id),
        api.getRoles(),
        api.getResources()
      ]);
      
      setProject(projectData);
      setRoles(rolesData);
      setResources(resourcesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const calculateCosts = () => {
    if (!project || !project.tasks) return { totalCost: 0, totalDays: 0, totalHours: 0 };
    
    let totalCost = 0;
    let totalDays = 0;

    project.tasks.forEach(task => {
      totalDays += task.estimateDays;
      const hours = task.estimateDays * 8;
      
      // Use resource rate if assigned, otherwise use role default rate
      if (task.resourceId) {
        const resource = resources.find(r => r.id === task.resourceId);
        if (resource) {
          totalCost += hours * resource.loadedRate;
        }
      } else if (task.roleId) {
        const role = roles.find(r => r.id === task.roleId);
        if (role) {
          totalCost += hours * role.defaultRate;
        }
      }
    });

    const minMargin = project.minMargin || 30;
    const maxMargin = project.maxMargin || 40;
    
    const minPrice = totalCost * (1 + minMargin / 100);
    const maxPrice = totalCost * (1 + maxMargin / 100);

    return {
      totalCost,
      totalDays,
      totalHours: totalDays * 8,
      minPrice,
      maxPrice,
      minMargin,
      maxMargin
    };
  };

  const handleTaskChange = (taskId, field, value) => {
    const updatedTasks = project.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, [field]: field === 'estimateDays' ? parseFloat(value) : parseInt(value) };
      }
      return task;
    });
    
    setProject({ ...project, tasks: updatedTasks });
  };

  const handleMarginChange = (field, value) => {
    setProject({ ...project, [field]: parseFloat(value) });
  };

  const handleAddTask = () => {
    const taskData = {
      id: project.tasks.length > 0 ? Math.max(...project.tasks.map(t => t.id)) + 1 : 1,
      description: newTask.description,
      estimateDays: parseFloat(newTask.estimateDays),
      roleId: parseInt(newTask.roleId),
      resourceId: null
    };

    setProject({
      ...project,
      tasks: [...project.tasks, taskData]
    });

    setNewTask({ description: '', estimateDays: '', roleId: '' });
    setShowAddTask(false);
  };

  const handleDeleteTask = (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setProject({
        ...project,
        tasks: project.tasks.filter(t => t.id !== taskId)
      });
    }
  };

  const handleSave = async () => {
    try {
      const costs = calculateCosts();
      const updatedProject = {
        ...project,
        minPrice: costs.minPrice,
        maxPrice: costs.maxPrice,
        totalCost: costs.totalCost
      };
      
      await api.updateProject(id, updatedProject);
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const costs = calculateCosts();
      const updatedProject = {
        ...project,
        status: newStatus,
        minPrice: costs.minPrice,
        maxPrice: costs.maxPrice,
        totalCost: costs.totalCost
      };
      
      await api.updateProject(id, updatedProject);
      setProject(updatedProject);
      alert(`Project marked as ${newStatus}!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  const getResourceName = (resourceId) => {
    const resource = resources.find(r => r.id === resourceId);
    return resource ? resource.name : '';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const costs = calculateCosts();

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h2>{project.name}</h2>
            <p>{project.platform} Project Estimate</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary" onClick={() => navigate('/projects')}>
              Back to Projects
            </button>
            <button className="btn btn-success" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="estimate-summary">
        <h3>Estimate Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <h4>Total Days</h4>
            <div className="value">{costs.totalDays}</div>
          </div>
          <div className="summary-item">
            <h4>Total Hours</h4>
            <div className="value">{costs.totalHours}</div>
          </div>
          <div className="summary-item">
            <h4>Internal Cost</h4>
            <div className="value">{formatCurrency(costs.totalCost)}</div>
          </div>
          <div className="summary-item">
            <h4>Price Range</h4>
            <div className="value" style={{ fontSize: '1.25rem' }}>
              {formatCurrency(costs.minPrice)} - {formatCurrency(costs.maxPrice)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Minimum Margin (%)
            </label>
            <input
              type="number"
              value={project.minMargin || 30}
              onChange={(e) => handleMarginChange('minMargin', e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Maximum Margin (%)
            </label>
            <input
              type="number"
              value={project.maxMargin || 40}
              onChange={(e) => handleMarginChange('maxMargin', e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => handleStatusChange('draft')}
            disabled={project.status === 'draft'}
          >
            Mark as Draft
          </button>
          <button 
            className="btn btn-success"
            onClick={() => handleStatusChange('approved')}
            disabled={project.status === 'approved'}
          >
            Mark as Approved
          </button>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="card">
        <div className="flex-between mb-2">
          <h3>Tasks</h3>
          <button className="btn btn-primary" onClick={() => setShowAddTask(!showAddTask)}>
            {showAddTask ? 'Cancel' : 'Add Task'}
          </button>
        </div>

        {showAddTask && (
          <div style={{ 
            padding: '1rem', 
            background: '#f8f9fa', 
            borderRadius: '4px', 
            marginBottom: '1rem' 
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Task Description
                </label>
                <input
                  type="text"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Days
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newTask.estimateDays}
                  onChange={(e) => setNewTask({ ...newTask, estimateDays: e.target.value })}
                  placeholder="Days"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Role
                </label>
                <select
                  value={newTask.roleId}
                  onChange={(e) => setNewTask({ ...newTask, roleId: e.target.value })}
                >
                  <option value="">Select role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <button 
                className="btn btn-success"
                onClick={handleAddTask}
                disabled={!newTask.description || !newTask.estimateDays || !newTask.roleId}
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="tasks-table-container">
          <table className="table tasks-table">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Task Description</th>
                <th style={{ width: '10%' }}>Days</th>
                <th style={{ width: '10%' }}>Hours</th>
                <th style={{ width: '15%' }}>Role</th>
                <th style={{ width: '15%' }}>Resource</th>
                <th style={{ width: '10%' }}>Rate</th>
                <th style={{ width: '5%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {project.tasks && project.tasks.map(task => {
                const hours = task.estimateDays * 8;
                let rate = 0;
                
                if (task.resourceId) {
                  const resource = resources.find(r => r.id === task.resourceId);
                  rate = resource ? resource.loadedRate : 0;
                } else if (task.roleId) {
                  const role = roles.find(r => r.id === task.roleId);
                  rate = role ? role.defaultRate : 0;
                }

                return (
                  <tr key={task.id}>
                    <td>
                      <input
                        type="text"
                        value={task.description}
                        onChange={(e) => handleTaskChange(task.id, 'description', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.5"
                        value={task.estimateDays}
                        onChange={(e) => handleTaskChange(task.id, 'estimateDays', e.target.value)}
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td>{hours}</td>
                    <td>
                      <select
                        value={task.roleId || ''}
                        onChange={(e) => handleTaskChange(task.id, 'roleId', e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="">Select role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={task.resourceId || ''}
                        onChange={(e) => handleTaskChange(task.id, 'resourceId', e.target.value || null)}
                        style={{ width: '100%' }}
                      >
                        <option value="">Use role rate</option>
                        {resources
                          .filter(r => r.roleId === task.roleId)
                          .map(resource => (
                            <option key={resource.id} value={resource.id}>
                              {resource.name}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td>{formatCurrency(rate)}/hr</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <h3>Export & Share</h3>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Export this estimate for client presentation or internal review.
        </p>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => alert('PDF export coming soon!')}>
            Export to PDF
          </button>
          <button className="btn btn-secondary" onClick={() => alert('Email feature coming soon!')}>
            Email Estimate
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectEstimate;
