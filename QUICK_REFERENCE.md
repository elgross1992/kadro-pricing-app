# Kadro Pricing App - Quick Reference

## Gross Margin Calculation

The app uses **markup on cost** methodology:

**Formula:**
- If total internal cost = $50,000
- Min margin = 30%
- Max margin = 40%

**Price Range:**
- Min Price = $50,000 × 1.30 = $65,000
- Max Price = $50,000 × 1.40 = $70,000

This means you're adding 30-40% on top of your cost as profit margin.

## Common Workflows

### Workflow 1: Initial Estimate (Role-Based)
1. Create new project from template
2. Adjust tasks and day estimates
3. Ensure each task has a role assigned
4. Set min/max margin percentages
5. Get price range for client
6. Save and mark as "Draft"

**Use Case:** Quick estimate for sales conversations

### Workflow 2: Fixed Bid (Resource-Based)
1. Open approved estimate
2. Assign specific resources to each task
3. App automatically uses their actual rates
4. Get precise cost calculation
5. Save and mark as "Approved"

**Use Case:** Final pricing after client approval

### Workflow 3: Custom Project
1. Create new project from closest template
2. Add custom tasks as needed
3. Delete irrelevant template tasks
4. Assign roles/resources
5. Calculate and save

**Use Case:** Unique project requirements

## Key Shortcuts

### Adding Tasks Quickly
- Template tasks pre-populated ✓
- Add button for one-off tasks ✓
- Copy entire task row (future enhancement)

### Editing Estimates
- Click directly in table cells to edit
- Changes calculate instantly
- Save button persists everything

### Resource Assignment
- Dropdown filters to only show people with the right role
- "Use role rate" option keeps using default
- Switch between role/resource rates anytime

## Data Management

### Backup Your Data
```bash
cp -r data/ data-backup-$(date +%Y%m%d)/
```

### Export Project (Manual for now)
1. Copy data from summary card
2. Paste into client proposal
3. PDF export coming in Phase 2

### Reset to Defaults
Delete the `data/` directory and restart the server. It will recreate with default templates.

## Tips & Best Practices

### Template Management
- Keep templates updated with recent learnings
- Add tasks you frequently forget
- Remove rarely-used tasks
- Review quarterly

### Resource Rates
- Update rates when people get raises
- Keep CIO/Executive rate high
- Use loaded rates (salary + benefits + overhead)

### Margins
- Higher margins for risky/complex projects
- Lower margins for proven, simple projects
- Consider competition and client budget

### Project Tracking
- Use "Draft" for in-progress estimates
- Use "Approved" for client-accepted projects
- Create new version if client requests changes

## Common Issues

**Tasks disappearing after refresh:**
- Click "Save Changes" before leaving page
- Auto-save coming in future update

**Price seems wrong:**
- Check that all tasks have roles assigned
- Verify resource rates are correct
- Ensure margins are percentages (30, not 0.30)

**Can't find a project:**
- Check Projects page for full list
- Use browser search (Ctrl/Cmd+F)
- Sort by date created (most recent first)

## Future Features Preview

### Phase 2 - JIRA Integration
- Pull task lists from completed projects
- See actual vs estimated hours
- Get AI suggestions for estimates

### Phase 3 - Advanced Features
- PDF export with Kadro branding
- Email estimates directly to clients
- Project comparison reports
- Resource utilization dashboard
- Historical margin analysis

## Contact

Questions? Talk to your dev team or Evan!
