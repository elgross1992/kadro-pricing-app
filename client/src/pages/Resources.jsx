import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

function Resources() {
  const [resources, setResources] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    roleId: '',
    loadedRate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resourcesData, rolesData] = await Promise.all([
        api.getResources(),
        api.getRoles()
      ]);
      setResources(resourcesData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        roleId: parseInt(formData.roleId),
        loadedRate: parseFloat(formData.loadedRate)
      };

      if (editingResource) {
        await api.updateResource(editingResource.id, data);
      } else {
        await api.createResource(data);
      }

      setShowModal(false);
      setEditingResource(null);
      setFormData({ name: '', roleId: '', loadedRate: '' });
      loadData();
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      roleId: resource.roleId,
      loadedRate: resource.loadedRate
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        await api.deleteResource(id);
        loadData();
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingResource(null);
    setFormData({ name: '', roleId: '', loadedRate: '' });
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h2>Resources</h2>
            <p>Manage team members and their loaded labor rates</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add Resource
          </button>
        </div>
      </div>

      <div className="card">
        {resources.length === 0 ? (
          <p className="text-center" style={{ color: '#666', padding: '2rem' }}>
            No resources yet. Add your first team member to get started!
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Loaded Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(resource => (
                <tr key={resource.id}>
                  <td>{resource.name}</td>
                  <td>{getRoleName(resource.roleId)}</td>
                  <td>{formatCurrency(resource.loadedRate)}/hour</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn btn-secondary"
                        onClick={() => handleEdit(resource)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(resource.id)}
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

      {/* Role Reference Card */}
      <div className="card">
        <h3>Default Role Rates</h3>
        <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem' }}>
          These are the default rates used when a role is assigned to a task. Individual resources can have different rates.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {roles.map(role => (
            <div key={role.id} style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{role.name}</div>
              <div style={{ color: '#4a9eff', fontSize: '1.25rem', fontWeight: '600' }}>
                {formatCurrency(role.defaultRate)}/hr
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingResource ? 'Edit Resource' : 'Add Resource'}</h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name} (Default: {formatCurrency(role.defaultRate)}/hr)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Loaded Rate ($/hour)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.loadedRate}
                  onChange={(e) => setFormData({ ...formData, loadedRate: e.target.value })}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingResource ? 'Update' : 'Add'} Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resources;
