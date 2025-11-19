# Kadro Pricing App

A modern web application for managing eCommerce project estimates, built with React and Node.js.

## Features

### Phase 1 (Current)
- **Resource Management**: Manage team members with their roles and loaded labor rates
- **Template Management**: Create and maintain platform-specific task templates (Shopify, BigCommerce, Adobe Commerce)
- **Project Estimation**: 
  - Start from templates and customize tasks
  - Adjust estimates in real-time
  - Set min/max gross margins
  - Get instant pricing ranges
- **Resource Assignment**: Assign specific team members to tasks for fixed bid calculations
- **Dashboard**: Overview of projects, resources, and templates

### Phase 2/3 (Future)
- JIRA integration for historical data
- AI-powered estimate suggestions based on past projects
- PDF export and email functionality
- Advanced reporting and analytics

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Node.js with Express
- **Data Storage**: JSON files (easily migrated to PostgreSQL later)
- **Styling**: Custom CSS

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. **Clone or download this project**

2. **Install backend dependencies:**
```bash
cd kadro-pricing-app
npm install
```

3. **Install frontend dependencies:**
```bash
cd client
npm install
cd ..
```

### Running the Application

You'll need two terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd kadro-pricing-app
npm start
```
Server will run on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd kadro-pricing-app/client
npm run dev
```
Frontend will run on `http://localhost:3000`

Open your browser to `http://localhost:3000`

## Usage Guide

### First Time Setup

1. **Review Roles**: The app comes with 8 default roles (Developer, Front End Developer, Project Manager, Designer, QA Lead, Tech Lead, BSA, Executive) with default rates. You can edit these in the Resources page.

2. **Add Resources**: Go to Resources → Add Resource to add your team members with their specific loaded labor rates.

3. **Review Templates**: Check the Templates page to see the default task lists for each platform. Customize them to match your typical projects.

### Creating a Project Estimate

1. **Create New Project**:
   - Go to Projects → New Project
   - Enter project name
   - Select a platform template
   - Click Create

2. **Customize the Estimate**:
   - Review and edit task descriptions
   - Adjust day estimates (use 0.5 increments)
   - Change role assignments as needed
   - Add or remove tasks

3. **Set Margins**:
   - Enter your minimum and maximum gross margin percentages
   - The app automatically calculates your price range

4. **For Fixed Bids**:
   - Assign specific resources to tasks
   - The app uses their actual rates instead of role defaults
   - Save and mark as "Approved"

### Understanding the Calculations

- **Days to Hours**: Days × 8 = Hours
- **Task Cost**: Hours × Rate (either resource rate or role default rate)
- **Total Cost**: Sum of all task costs
- **Price Range**: 
  - Min Price = Total Cost × (1 + Min Margin %)
  - Max Price = Total Cost × (1 + Max Margin %)

## Data Storage

All data is stored in JSON files in the `data/` directory:
- `roles.json` - Role definitions and default rates
- `resources.json` - Team members and their rates
- `templates.json` - Platform task templates
- `projects.json` - Project estimates

**Backup**: Simply copy the `data/` directory to backup your estimates.

## Deployment

### Quick Deploy Options:

1. **Railway.app** (Recommended):
   - Connect your Git repo
   - Railway auto-detects Node.js
   - Set build command: `cd client && npm install && npm run build`
   - Set start command: `npm start`
   - Done!

2. **Render.com**:
   - Similar to Railway
   - Free tier available

3. **Your own server**:
   ```bash
   cd client
   npm run build
   # Serve the dist/ folder with your backend
   ```

### Environment Variables
Currently none needed! The app works out of the box.

## Future Enhancements

### JIRA Integration (Phase 2)
When ready to add JIRA integration:
1. Add JIRA API credentials to environment variables
2. Create endpoints to fetch historical task data
3. Implement ML model for estimate suggestions
4. Update UI to show "suggested" vs "manual" estimates

### Database Migration
When you outgrow JSON files:
1. Install PostgreSQL
2. Create schema matching the JSON structure
3. Add database connection pool
4. Update API endpoints to use SQL queries
5. Migration script to import existing JSON data

## Development

### Project Structure
```
kadro-pricing-app/
├── server.js           # Express backend
├── data/              # JSON data storage
├── client/
│   ├── src/
│   │   ├── pages/     # React pages
│   │   ├── utils/     # API utilities
│   │   ├── App.jsx    # Main app component
│   │   └── main.jsx   # Entry point
│   └── index.html
└── README.md
```

### Adding a New Feature

1. **Backend**: Add endpoint to `server.js`
2. **API**: Add function to `client/src/utils/api.js`
3. **Frontend**: Update relevant page component
4. **Test**: Check both UI and data persistence

## Troubleshooting

**Port already in use:**
- Backend: Change PORT in server.js
- Frontend: Change port in client/vite.config.js

**Data not persisting:**
- Check that the `data/` directory exists
- Verify file permissions

**Can't connect frontend to backend:**
- Ensure backend is running on port 3001
- Check proxy settings in vite.config.js

## Support

For issues or questions:
1. Check this README
2. Review the code comments
3. Your dev team can help with customizations!

## License

Proprietary - Kadro Internal Use Only
