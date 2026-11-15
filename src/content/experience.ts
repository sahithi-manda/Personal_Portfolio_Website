export interface Role {
  company: string;
  role: string;
  period: string;
  current?: boolean;
  points: string[];
  tags: string[];
}

export const roles: Role[] = [
  {
    company: 'IStudio',
    role: 'AI/ML Intern',
    period: 'Mar 2026 – Present',
    current: true,
    points: [
      'Assist in developing and testing AI/ML solutions, supporting machine learning workflows and experimentation.',
      'Research AI agents, LLMs and RAG systems; analyse datasets to identify trends and insights.',
      'Work with mentors and project teams on AI research and implementation initiatives.',
    ],
    tags: ['LLMs', 'RAG', 'AI Agents', 'Experimentation'],
  },
  {
    company: 'Labmentix',
    role: 'AI/ML Intern',
    period: 'Aug 2025 – Feb 2026',
    points: [
      'Applied machine learning and data analysis to datasets to identify customer-behaviour trends.',
      'Structured, cleaned and transformed data; built visualisations and reports to communicate findings.',
      'Worked through analytical challenges with the team and delivered insights through reporting.',
    ],
    tags: ['EDA', 'Data Cleaning', 'Visualisation', 'Reporting'],
  },
];

export interface Certification {
  title: string;
  issuer: string;
}

// From the resume. No "verified" claims without credential links.
export const certifications: Certification[] = [
  { title: 'Python Essentials 1', issuer: 'Cisco Networking Academy' },
  { title: 'GenAI Powered Data Analytics Job Simulation', issuer: 'Tata (Forage)' },
  { title: 'Claude 101', issuer: 'Anthropic' },
  { title: 'Microsoft SQL Certification Training', issuer: 'Intellipaat' },
  { title: 'Introduction to Modern AI', issuer: 'Cisco Networking Academy' },
];
