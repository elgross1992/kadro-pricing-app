import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFormData, setTaskFormData] = useState({
    description: '',
    estimateDays: '',
    roleId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesData, rolesData] = await Promise.all([
        api.getTemplates(),
        api.getRoles()
      ]);
      setTemplates(templatesData);
      setRoles(rolesData);
      if (templatesData.length > 0) {
        setSelectedTemplate(templatesData[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskFormData({ description: '', estimateDays: '', roleId: '' });
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskFormData({
      description: task.description,
      estimateDays: task.estimateDays,
      roleId: task.roleId
    });
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const updatedTasks = selectedTemplate.tasks.filter(t => t.id !== taskId);
      const updatedTemplate = {
        ...selectedTemplate,
        tasks: updatedTasks
      };
      await api.updateTemplate(selectedTemplate.id, updatedTemplate);
      setSelectedTemplate(updatedTemplate);
      loadData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    
    try {
      const taskData = {
        description: taskFormData.description,
        estimateDays: parseFloat(taskFormData.estimateDays),
        roleId: parseInt(taskFormData.roleId)
      };

      let updatedTasks;
      if (editingTask) {
        updatedTasks = selectedTemplate.tasks.map(t =>
          t.id === editingTask.id ? { ...t, ...taskData } : t
        );
      } else {
        const newTask = {
          id: selectedTemplate.tasks.length > 0 
            ? Math.max(...selectedTemplate.tasks.map(t => t.id)) + 1 
            : 1,
          ...taskData
        };
        updatedTasks = [...selectedTemplate.tasks, newTask];
      }

      const updatedTemplate = {
        ...selectedTemplate,
        tasks: updatedTasks
      };

      await api.updateTemplate(selectedTemplate.id, updatedTemplate);
      setSelectedTemplate(updatedTemplate);
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const calculateTemplateTotals = (template) => {
    if (!template || !template.tasks) return { totalDays: 0, totalHours: 0, totalCost: 0 };
    
    let totalDays = 0;
    let totalCost = 0;

    template.tasks.forEach(task => {
      totalDays += task.estimateDays;
      const role = roles.find(r => r.id === task.roleId);
      if (role) {
        const hours = task.estimateDays * 8;
        totalCost += hours * role.defaultRate;
      }
    });

    return {
      totalDays,
      totalHours: totalDays * 8,
      totalCost
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totals = selectedTemplate ? calculateTemplateTotals(selectedTemplate) : null;

  return (
    <div>
      <div className="page-header">
        <h2>Templates</h2>
        <p>Manage platform-specific task templates</p>
      </div>

      <div className="card">
        <div className="flex gap-2 mb-3">
          {templates.map(template => (
            <button
              key={template.id}
              className={`btn ${selectedTemplate?.id === template.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedTemplate(template)}
            >
              {template.platform}
            </button>
          ))}
        </div>

        {selectedTemplate && (
          <>
            <div className="flex-between mb-3">
              <h3>{selectedTemplate.platform} Template</h3>
              <button className="btn btn-success" onClick={handleAddTask}>
                Add Task
              </button>
            </div>

            {totals && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '1rem',
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Total Days</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{totals.totalDays}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Total Hours</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{totals.totalHours}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Est. Cost</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{formatCurrency(totals.totalCost)}</div>
                </div>
              </div>
            )}

            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>Task Description</th>
                  <th>Days</th>
                  <th>Hours</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedTemplate.tasks.map(task => (
                  <tr key={task.id}>
                    <td>{task.description}</td>
                    <td>{task.estimateDays}</td>
                    <td>{task.estimateDays * 8}</td>
                    <td>{getRoleName(task.roleId)}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleEditTask(task)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTask ? 'Edit Task' : 'Add Task'}</h3>
            </div>
            
            <form onSubmit={handleSubmitTask}>
              <div className="form-group">
                <label>Task Description</label>
                <input
                  type="text"
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimate (Days)</label>
                <input
                  type="number"
                  step="0.5"
                  value={taskFormData.estimateDays}
                  onChange={(e) => setTaskFormData({ ...taskFormData, estimateDays: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Assigned Role</label>
                <select
                  value={taskFormData.roleId}
                  onChange={(e) => setTaskFormData({ ...taskFormData, roleId: e.target.value })}
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update' : 'Add'} Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Templates;
