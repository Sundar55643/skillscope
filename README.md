# SkillScope – Developer Skills Gap Analyzer (https://skillscope-navy.vercel.app/)

A React.js application that analyzes job descriptions, compares them with a user's skills, and generates a personalized learning roadmap to help developers become job-ready.

## Overview

Finding out whether you're qualified for a job can be time-consuming. Developers often struggle to identify missing skills and prioritize what to learn next.

**SkillScope** solves this problem by analyzing a job description and comparing it against a user's current skill set. It provides:

* Readiness Score
* Skill Gap Analysis
* Personalized Learning Roadmap
* Interactive Skill Match Visualization

The goal is to help students, freshers, and professionals understand how close they are to meeting job requirements and what they should learn next.

---

## Features

### Job Description Analysis

Paste a job description and extract the key skills required for the role.

### Readiness Score

Measure how well your current skills match the job requirements.

### Skill Gap Detection

Identify missing or weak skills that need improvement.

### Personalized Learning Path

Generate a structured roadmap to close skill gaps efficiently.

### Interactive Radar Charts

Visualize skill matching and proficiency levels using Recharts.

### Fast Client-Side Processing

No backend required. All analysis runs directly in the browser.

### Continuous Deployment

Automatically deployed through Vercel on every GitHub push.

---

## Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* Vite

### State Management

* useState
* useReducer
* useEffect

### Data Visualization

* Recharts

### Deployment & Tools

* Git
* GitHub
* Vercel

---

## Screenshots

### Home Page

*Add screenshot here*

### Skill Gap Analysis

*Add screenshot here*

### Readiness Dashboard

*Add screenshot here*

### Radar Chart Visualization

*Add screenshot here*

---

## Project Architecture

```text
User Input
     │
     ▼
Job Description Analysis
     │
     ▼
Skill Matching Engine
     │
     ├── Readiness Score
     ├── Missing Skills
     └── Learning Recommendations
     │
     ▼
Results Dashboard + Radar Charts
```

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Sundar55643/skillscope.git
```

### Navigate to Project Directory

```bash
cd skillscope
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## Folder Structure

```text
skillscope/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── assets/
│   └── App.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---

## Challenges Faced

One of the biggest challenges was managing complex application state across multiple features such as job description analysis, skill profiling, recommendations, and result visualization.

To solve this, I implemented React's **useReducer** hook, which provided a cleaner and more scalable approach to state management than relying solely on multiple useState hooks.

Another challenge was presenting skill-match data in a way that users could quickly understand. This was addressed using interactive radar charts built with Recharts.

---

## Key Learnings

* Advanced React state management using useReducer
* Building reusable React components
* Data visualization with Recharts
* Client-side data processing
* Responsive UI design
* Continuous deployment with Vercel
* Git and GitHub workflow

---

## Future Improvements

* AI-powered job description analysis
* Resume upload and parsing
* User authentication
* Saved skill profiles
* Role-specific learning recommendations
* Export reports as PDF
* Multi-job comparison dashboard

---

## Author

**Sundara Moorthi M**

* GitHub: https://github.com/Sundar55643
* LinkedIn: Add LinkedIn URL
* Email: [sundaramoorthi5673@gmail.com](mailto:sundaramoorthi5673@gmail.com)

---

## Support

If you found this project useful, consider giving it a star on GitHub. It helps others discover the project and motivates future improvements.
