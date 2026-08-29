# 💼 Job Portal & AI Resume Analyzer

A full-stack **MERN-based Online Job Portal and AI-powered Resume Analyzer** designed to help job seekers discover suitable opportunities, apply for jobs, and evaluate their resumes using ATS-style analysis.

The platform combines **job search, job applications, resume analysis, ATS scoring, keyword detection, user profiles, and an admin job-management system** into one application.

---

## 🚀 Project Overview

Finding suitable jobs and optimizing a resume for Applicant Tracking Systems (ATS) can be challenging for job seekers.

This project provides a complete platform where users can:

- Create an account and manage their profile
- Upload their resume
- Analyze their resume using AI
- Get an ATS compatibility score
- Identify missing keywords
- Search and filter job opportunities
- Apply for jobs
- Track their applications

Administrators can manage companies, jobs, and job-related data through the admin panel.

---

## ✨ Key Features

### 👤 Job Seeker

- User registration and login
- Secure authentication
- User profile management
- Resume upload
- AI-powered resume analysis
- ATS score analysis
- Missing keyword detection
- Resume improvement insights
- Job search
- Job filtering
- Job application
- Application management

### 🤖 AI Resume Analyzer

The Resume Analyzer evaluates uploaded resumes and provides useful insights such as:

- ATS compatibility score
- Resume strengths
- Missing keywords
- Relevant skills
- Improvement suggestions
- Job-related keyword matching

The AI analysis is powered by the **Google Gemini API**.

### 🔎 Job Search & Filtering

Users can search for jobs based on:

- Location
- Job type
- Skills
- Job title
- Company

Supported job types include:

- Full Time
- Part Time
- Internship
- Freelance

### 👨‍💼 Admin Panel

Administrators can:

- Add companies
- Create job postings
- Manage jobs
- View job information
- Manage applications
- Export job-related data

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Redux Toolkit
- JavaScript
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer

### AI & Resume Analysis

- Google Gemini API
- PDF Resume Processing
- ATS-style Resume Analysis
- Keyword Analysis

### Other Tools

- Git
- GitHub
- jsPDF

---

## 🏗️ Project Architecture

```text
Job Portal & Resume Analyzer
│
├── frontend2/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── assets/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── package.json
│   └── ...
│
├── datauri.js
├── multer.js
├── FilterCard.jsx
├── Resumepage.jsx
├── .gitignore
└── README.md


🔄 Application Workflow

                 ┌──────────────────┐
                 │      User        │
                 └────────┬─────────┘
                          │
             ┌────────────▼────────────┐
             │   Register / Login      │
             └────────────┬────────────┘
                          │
              ┌───────────▼───────────┐
              │    User Dashboard     │
              └───────────┬───────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
     Search Jobs     Upload Resume    Manage Profile
          │               │
          ▼               ▼
     Apply for Job    AI Resume Analysis
                          │
                          ▼
                    ATS Score
                          │
                          ▼
                  Missing Keywords
                          │
                          ▼
                  Improvement Tips

📊 Resume Analysis Flow

Resume PDF
    │
    ▼
Resume Upload
    │
    ▼
Resume Processing
    │
    ▼
AI Analysis
    │
    ├── ATS Score
    ├── Skills Analysis
    ├── Keyword Analysis
    ├── Missing Keywords
    └── Suggestions
    │
    ▼
Analysis Report
        