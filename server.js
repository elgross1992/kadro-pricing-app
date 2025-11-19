const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/dist')));

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const ROLES_FILE = path.join(DATA_DIR, 'roles.json');
const RESOURCES_FILE = path.join(DATA_DIR, 'resources.json');
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Initialize data directory and files
async function initializeData() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize roles if not exists
    try {
      await fs.access(ROLES_FILE);
    } catch {
      const defaultRoles = [
        { id: 1, name: 'Developer', defaultRate: 85 },
        { id: 2, name: 'Front End Developer', defaultRate: 80 },
        { id: 3, name: 'Project Manager', defaultRate: 95 },
        { id: 4, name: 'Designer', defaultRate: 75 },
        { id: 5, name: 'QA Lead', defaultRate: 70 },
        { id: 6, name: 'Tech Lead', defaultRate: 110 },
        { id: 7, name: 'BSA', defaultRate: 90 },
        { id: 8, name: 'Executive', defaultRate: 150 }
      ];
      await fs.writeFile(ROLES_FILE, JSON.stringify(defaultRoles, null, 2));
    }
    
    // Initialize resources if not exists
    try {
      await fs.access(RESOURCES_FILE);
    } catch {
      await fs.writeFile(RESOURCES_FILE, JSON.stringify([], null, 2));
    }
    
    // Initialize templates if not exists
    try {
      await fs.access(TEMPLATES_FILE);
    } catch {
      const defaultTemplates = [
        {
          id: 1,
          name: 'Shopify',
          platform: 'Shopify',
          tasks: [
            { id: 1, description: 'Project Kickoff & Discovery', estimateDays: 2, roleId: 3 },
            { id: 2, description: 'Technical Architecture', estimateDays: 3, roleId: 6 },
            { id: 3, description: 'Theme Setup & Configuration', estimateDays: 5, roleId: 1 },
            { id: 4, description: 'Custom Theme Development', estimateDays: 10, roleId: 2 },
            { id: 5, description: 'Product Data Migration', estimateDays: 3, roleId: 7 },
            { id: 6, description: 'Third-Party Integrations', estimateDays: 5, roleId: 1 },
            { id: 7, description: 'QA Testing', estimateDays: 4, roleId: 5 },
            { id: 8, description: 'User Acceptance Testing', estimateDays: 2, roleId: 3 },
            { id: 9, description: 'Launch & Deployment', estimateDays: 1, roleId: 6 }
          ]
        },
        {
          id: 2,
          name: 'BigCommerce',
          platform: 'BigCommerce',
          tasks: [
            { id: 1, description: 'Project Kickoff & Discovery', estimateDays: 2, roleId: 3 },
            { id: 2, description: 'Technical Architecture', estimateDays: 3, roleId: 6 },
            { id: 3, description: 'Stencil Theme Development', estimateDays: 12, roleId: 2 },
            { id: 4, description: 'Product Catalog Setup', estimateDays: 4, roleId: 7 },
            { id: 5, description: 'Payment Gateway Integration', estimateDays: 3, roleId: 1 },
            { id: 6, description: 'Shipping Configuration', estimateDays: 2, roleId: 1 },
            { id: 7, description: 'QA Testing', estimateDays: 5, roleId: 5 },
            { id: 8, description: 'User Acceptance Testing', estimateDays: 2, roleId: 3 },
            { id: 9, description: 'Launch & Deployment', estimateDays: 1, roleId: 6 }
          ]
        },
        {
          id: 3,
          name: 'Adobe Commerce',
          platform: 'Adobe Commerce',
          tasks: [
            { id: 1, description: 'Project Kickoff & Discovery', estimateDays: 3, roleId: 3 },
            { id: 2, description: 'Technical Architecture & Planning', estimateDays: 5, roleId: 6 },
            { id: 3, description: 'Infrastructure Setup', estimateDays: 3, roleId: 1 },
            { id: 4, description: 'Custom Module Development', estimateDays: 15, roleId: 1 },
            { id: 5, description: 'Frontend Theme Development', estimateDays: 12, roleId: 2 },
            { id: 6, description: 'Data Migration', estimateDays: 8, roleId: 7 },
            { id: 7, description: 'Third-Party Integrations', estimateDays: 7, roleId: 1 },
            { id: 8, description: 'Performance Optimization', estimateDays: 4, roleId: 6 },
            { id: 9, description: 'QA Testing', estimateDays: 6, roleId: 5 },
            { id: 10, description: 'User Acceptance Testing', estimateDays: 3, roleId: 3 },
            { id: 11, description: 'Launch & Deployment', estimateDays: 2, roleId: 6 }
          ]
        }
      ];
      await fs.writeFile(TEMPLATES_FILE, JSON.stringify(defaultTemplates, null, 2));
    }
    
    // Initialize projects if not exists
    try {
      await fs.access(PROJECTS_FILE);
    } catch {
      await fs.writeFile(PROJECTS_FILE, JSON.stringify([], null, 2));
    }
    
    console.log('Data files initialized successfully');
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Helper functions
async function readJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// ROLES ENDPOINTS
app.get('/api/roles', async (req, res) => {
  try {
    const roles = await readJSON(ROLES_FILE);
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/roles', async (req, res) => {
  try {
    const roles = await readJSON(ROLES_FILE);
    const newRole = {
      id: roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1,
      ...req.body
    };
    roles.push(newRole);
    await writeJSON(ROLES_FILE, roles);
    res.json(newRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/roles/:id', async (req, res) => {
  try {
    const roles = await readJSON(ROLES_FILE);
    const index = roles.findIndex(r => r.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Role not found' });
    }
    roles[index] = { ...roles[index], ...req.body, id: parseInt(req.params.id) };
    await writeJSON(ROLES_FILE, roles);
    res.json(roles[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/roles/:id', async (req, res) => {
  try {
    const roles = await readJSON(ROLES_FILE);
    const filtered = roles.filter(r => r.id !== parseInt(req.params.id));
    await writeJSON(ROLES_FILE, filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RESOURCES ENDPOINTS
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await readJSON(RESOURCES_FILE);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/resources', async (req, res) => {
  try {
    const resources = await readJSON(RESOURCES_FILE);
    const newResource = {
      id: resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1,
      ...req.body
    };
    resources.push(newResource);
    await writeJSON(RESOURCES_FILE, resources);
    res.json(newResource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/resources/:id', async (req, res) => {
  try {
    const resources = await readJSON(RESOURCES_FILE);
    const index = resources.findIndex(r => r.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    resources[index] = { ...resources[index], ...req.body, id: parseInt(req.params.id) };
    await writeJSON(RESOURCES_FILE, resources);
    res.json(resources[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/resources/:id', async (req, res) => {
  try {
    const resources = await readJSON(RESOURCES_FILE);
    const filtered = resources.filter(r => r.id !== parseInt(req.params.id));
    await writeJSON(RESOURCES_FILE, filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TEMPLATES ENDPOINTS
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await readJSON(TEMPLATES_FILE);
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/templates/:id', async (req, res) => {
  try {
    const templates = await readJSON(TEMPLATES_FILE);
    const template = templates.find(t => t.id === parseInt(req.params.id));
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/templates', async (req, res) => {
  try {
    const templates = await readJSON(TEMPLATES_FILE);
    const newTemplate = {
      id: templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1,
      ...req.body
    };
    templates.push(newTemplate);
    await writeJSON(TEMPLATES_FILE, templates);
    res.json(newTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/templates/:id', async (req, res) => {
  try {
    const templates = await readJSON(TEMPLATES_FILE);
    const index = templates.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Template not found' });
    }
    templates[index] = { ...templates[index], ...req.body, id: parseInt(req.params.id) };
    await writeJSON(TEMPLATES_FILE, templates);
    res.json(templates[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/templates/:id', async (req, res) => {
  try {
    const templates = await readJSON(TEMPLATES_FILE);
    const filtered = templates.filter(t => t.id !== parseInt(req.params.id));
    await writeJSON(TEMPLATES_FILE, filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PROJECTS ENDPOINTS
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    const newProject = {
      id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      ...req.body
    };
    projects.push(newProject);
    await writeJSON(PROJECTS_FILE, projects);
    res.json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    const index = projects.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    projects[index] = { 
      ...projects[index], 
      ...req.body, 
      id: parseInt(req.params.id),
      updatedAt: new Date().toISOString()
    };
    await writeJSON(PROJECTS_FILE, projects);
    res.json(projects[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    const filtered = projects.filter(p => p.id !== parseInt(req.params.id));
    await writeJSON(PROJECTS_FILE, filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Catch-all route to serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});