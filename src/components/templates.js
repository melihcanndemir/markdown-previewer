// Template presets for quick start

export const TEMPLATE_PRESETS = {
  blank: {
    id: 'blank',
    name: 'Blank Document',
    icon: '📄',
    category: 'General',
    content: '# New Document\n\nStart writing here...',
  },

  blogPost: {
    id: 'blogPost',
    name: 'Blog Post',
    icon: '✍️',
    category: 'Writing',
    content: `# Blog Post Title

**Published:** ${new Date().toLocaleDateString()}
**Author:** Your Name
**Tags:** #topic #category

---

## Introduction

Write your engaging introduction here. Hook your readers with an interesting opening.

## Main Content

### Section 1

Your main points go here. Use clear headings to organize your thoughts.

### Section 2

Continue developing your ideas. Add examples, data, or stories to support your points.

### Section 3

Build on previous sections. Keep your readers engaged.

## Key Takeaways

- First important point
- Second important point
- Third important point

## Conclusion

Wrap up your post with a strong conclusion. Leave readers with something to think about.

---

**What did you think?** Leave a comment below!
`,
  },

  readme: {
    id: 'readme',
    name: 'README.md',
    icon: '📚',
    category: 'Development',
    content: `# Project Name

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/username/repo)

> Brief description of your project

![Project Screenshot](screenshot.png)

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/username/project.git

# Navigate to directory
cd project

# Install dependencies
npm install
\`\`\`

## Usage

\`\`\`bash
# Run the project
npm start
\`\`\`

## Configuration

\`\`\`javascript
const config = {
  option1: 'value1',
  option2: 'value2'
};
\`\`\`

## API Documentation

### Endpoints

- \`GET /api/endpoint\` - Description
- \`POST /api/endpoint\` - Description

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/username/project](https://github.com/username/project)

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
`,
  },

  technicalDocs: {
    id: 'technicalDocs',
    name: 'Technical Documentation',
    icon: '📖',
    category: 'Development',
    content: `# Technical Documentation

**Version:** 1.0
**Last Updated:** ${new Date().toLocaleDateString()}

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API Reference](#api-reference)
4. [Configuration](#configuration)
5. [Troubleshooting](#troubleshooting)

---

## Overview

### Purpose

Describe the purpose and scope of this system/component.

### Key Features

- Feature 1
- Feature 2
- Feature 3

### System Requirements

- Node.js >= 14.0
- npm >= 6.0
- Other dependencies

---

## Architecture

### High-Level Design

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Server    │────▶│  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
\`\`\`

### Components

#### Component A
Description of component A and its responsibilities.

#### Component B
Description of component B and its responsibilities.

---

## API Reference

### Authentication

\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user",
  "password": "pass"
}
\`\`\`

**Response:**
\`\`\`json
{
  "token": "jwt-token-here",
  "expiresIn": 3600
}
\`\`\`

### Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | /api/users | Get all users | Yes |
| POST   | /api/users | Create user | Yes |
| PUT    | /api/users/:id | Update user | Yes |
| DELETE | /api/users/:id | Delete user | Yes |

---

## Configuration

### Environment Variables

\`\`\`bash
# .env file
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key
\`\`\`

### Config File

\`\`\`javascript
module.exports = {
  server: {
    port: process.env.PORT || 3000,
    host: 'localhost'
  },
  database: {
    url: process.env.DATABASE_URL
  }
};
\`\`\`

---

## Troubleshooting

### Common Issues

**Issue:** Server won't start
**Solution:** Check if port is already in use

**Issue:** Database connection failed
**Solution:** Verify DATABASE_URL in .env file

### Debug Mode

\`\`\`bash
DEBUG=* npm start
\`\`\`

---

## Additional Resources

- [Official Documentation](https://example.com)
- [Community Forum](https://forum.example.com)
- [GitHub Issues](https://github.com/user/repo/issues)
`,
  },

  meetingNotes: {
    id: 'meetingNotes',
    name: 'Meeting Notes',
    icon: '📝',
    category: 'Business',
    content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Time:** HH:MM - HH:MM
**Location:** Conference Room / Zoom
**Attendees:** Name 1, Name 2, Name 3

---

## Agenda

1. Review previous action items
2. Discussion topic 1
3. Discussion topic 2
4. Next steps

---

## Discussion Points

### Topic 1: [Title]

**Key Points:**
- Point 1
- Point 2
- Point 3

**Decisions:**
- Decision 1
- Decision 2

### Topic 2: [Title]

**Key Points:**
- Point 1
- Point 2

**Open Questions:**
- Question 1?
- Question 2?

---

## Action Items

| Task | Assigned To | Due Date | Status |
|------|-------------|----------|--------|
| Task 1 | Name | YYYY-MM-DD | ⏳ Pending |
| Task 2 | Name | YYYY-MM-DD | ⏳ Pending |
| Task 3 | Name | YYYY-MM-DD | ⏳ Pending |

---

## Next Meeting

**Date:** TBD
**Topics:**
- Follow-up on action items
- New agenda items

---

**Notes compiled by:** Your Name
`,
  },

  todoList: {
    id: 'todoList',
    name: 'Todo List',
    icon: '✅',
    category: 'Productivity',
    content: `# Todo List

**Date:** ${new Date().toLocaleDateString()}

---

## Today's Priorities

- [ ] High priority task 1
- [ ] High priority task 2
- [ ] High priority task 3

## Work Tasks

### Project A
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Project B
- [ ] Task 1
- [ ] Task 2

## Personal

- [ ] Personal task 1
- [ ] Personal task 2
- [ ] Personal task 3

---

## Completed ✓

- [x] Completed task 1
- [x] Completed task 2

---

## Notes

Add any additional notes or reminders here.

---

**Progress:** 0/10 tasks completed
`,
  },

  projectProposal: {
    id: 'projectProposal',
    name: 'Project Proposal',
    icon: '💼',
    category: 'Business',
    content: `# Project Proposal

**Project Name:** [Your Project Name]
**Prepared by:** Your Name
**Date:** ${new Date().toLocaleDateString()}
**Version:** 1.0

---

## Executive Summary

Brief overview of the project, its goals, and expected outcomes.

---

## Background

### Current Situation

Describe the current state and what problem needs to be solved.

### Opportunity

Explain the opportunity this project presents.

---

## Objectives

1. **Primary Objective:** Main goal of the project
2. **Secondary Objectives:**
   - Objective 1
   - Objective 2
   - Objective 3

---

## Scope

### In Scope
- Item 1
- Item 2
- Item 3

### Out of Scope
- Item 1
- Item 2

---

## Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1: Planning | 2 weeks | Project plan, requirements |
| Phase 2: Development | 6 weeks | MVP, testing |
| Phase 3: Launch | 2 weeks | Deployment, documentation |

---

## Budget

| Item | Cost | Notes |
|------|------|-------|
| Development | $XX,XXX | Description |
| Tools & Services | $X,XXX | Description |
| Contingency (10%) | $X,XXX | Buffer |
| **Total** | **$XX,XXX** | |

---

## Resources Required

### Team
- Project Manager - 1
- Developers - 2
- Designer - 1

### Tools & Technology
- Tool 1
- Tool 2
- Tool 3

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Risk 1 | High | Medium | Mitigation strategy |
| Risk 2 | Medium | Low | Mitigation strategy |

---

## Success Metrics

- Metric 1: Target value
- Metric 2: Target value
- Metric 3: Target value

---

## Next Steps

1. Review and approve proposal
2. Allocate resources
3. Begin planning phase

---

**Approval**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Sponsor | | | |
| Project Manager | | | |
`,
  },

  bugReport: {
    id: 'bugReport',
    name: 'Bug Report',
    icon: '🐛',
    category: 'Development',
    content: `# Bug Report

**Date:** ${new Date().toLocaleDateString()}
**Reporter:** Your Name
**Priority:** 🔴 High / 🟡 Medium / 🟢 Low
**Status:** 🆕 New

---

## Description

Brief description of the bug.

---

## Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

---

## Expected Behavior

What you expected to happen.

---

## Actual Behavior

What actually happened.

---

## Screenshots

![Screenshot](url-to-screenshot)

---

## Environment

- **OS:** Windows 11 / macOS / Linux
- **Browser:** Chrome 120 / Firefox 121 / Safari 17
- **Version:** v1.0.0
- **Device:** Desktop / Mobile

---

## Additional Context

Any other information about the problem.

---

## Possible Solution

If you have suggestions on how to fix the bug.

---

## Related Issues

- #123
- #456
`,
  },

  resume: {
    id: 'resume',
    name: 'Resume/CV',
    icon: '👤',
    category: 'Personal',
    content: `# Your Name

📧 your.email@example.com | 📱 +1-234-567-8900
🔗 [LinkedIn](https://linkedin.com/in/yourname) | 💻 [GitHub](https://github.com/yourname) | 🌐 [Portfolio](https://yourwebsite.com)

---

## Professional Summary

Results-driven professional with X years of experience in [your field]. Skilled in [key skills]. Passionate about [your passion].

---

## Skills

### Technical Skills
- **Languages:** JavaScript, Python, Java
- **Frameworks:** React, Node.js, Express
- **Tools:** Git, Docker, AWS
- **Databases:** MongoDB, PostgreSQL, Redis

### Soft Skills
- Leadership & Team Management
- Problem Solving
- Communication
- Project Management

---

## Work Experience

### Senior Software Engineer
**Company Name** | City, State | Jan 2020 - Present

- Achievement or responsibility with quantifiable results
- Led a team of X developers to deliver Y project
- Improved system performance by X%
- Technologies used: React, Node.js, AWS

### Software Engineer
**Previous Company** | City, State | Jan 2018 - Dec 2019

- Achievement or responsibility
- Developed feature X that increased user engagement by Y%
- Collaborated with cross-functional teams
- Technologies used: Python, Django, PostgreSQL

---

## Education

### Master of Science in Computer Science
**University Name** | City, State | 2016 - 2018
- GPA: 3.8/4.0
- Relevant Coursework: Algorithms, Machine Learning, Distributed Systems

### Bachelor of Science in Computer Engineering
**University Name** | City, State | 2012 - 2016
- GPA: 3.7/4.0
- Dean's List (4 semesters)

---

## Projects

### Project Name 1
[GitHub](https://github.com/user/project) | [Live Demo](https://demo.com)

Brief description of the project and your role. Technologies used: React, Node.js, MongoDB.

### Project Name 2
[GitHub](https://github.com/user/project) | [Live Demo](https://demo.com)

Brief description of the project and your role. Technologies used: Python, TensorFlow, AWS.

---

## Certifications

- AWS Certified Solutions Architect (2023)
- Google Cloud Professional (2022)
- Certified Scrum Master (2021)

---

## Awards & Recognition

- Employee of the Year (2022)
- Best Innovation Award (2021)

---

## Languages

- English (Native)
- Spanish (Fluent)
- French (Intermediate)

---

*References available upon request*
`,
  },
};

export const TEMPLATE_CATEGORIES = {
  all: 'All Templates',
  general: 'General',
  writing: 'Writing',
  development: 'Development',
  business: 'Business',
  productivity: 'Productivity',
  personal: 'Personal',
};
