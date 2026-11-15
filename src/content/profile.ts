// Single source of truth for personal content.
// Every statement here is taken from the resume (public/Sahithi_Reddy_resume.pdf)
// or the public GitHub repositories. Keep it that way.

export const profile = {
  name: 'Sahithi Reddy',
  fullName: 'Sahithi Reddy Manda',
  role: 'AI / ML Engineer',
  tagline: 'Engineering Intelligence. Building the Future.',
  location: 'Hyderabad, India',
  email: 'sahithi2703@gmail.com',
  github: 'https://github.com/sahithi-manda',
  githubHandle: 'sahithi-manda',
  linkedin: 'https://www.linkedin.com/in/sahithi-reddy-manda-0a218732b',
  resume: '/Sahithi_Reddy_resume.pdf',
  about: {
    lead: 'I build AI that works outside the notebook.',
    body: 'AI / ML engineer specialising in machine learning, computer vision and applied NLP. I take models from raw data to working tools, from face-recognition systems and from-scratch eigenfaces to sequence forecasting and résumé analysis, with honest evaluation and clean engineering at every step.',
    facts: [
      { label: 'Now', value: 'AI/ML Intern, IStudio: AI agents, LLMs & RAG' },
      { label: 'Previously', value: 'AI/ML Intern, Labmentix: data analysis & insight' },
      { label: 'Education', value: 'B.Tech CSE (AI & ML), Sreyas Institute' },
    ],
  },
};

export const stats = [
  { value: '02', label: 'AI/ML internships' },
  { value: '15+', label: 'Public projects' },
  { value: '05', label: 'Certifications' },
];

export const education = {
  degree: 'B.Tech, Computer Science (AI & ML)',
  school: 'Sreyas Institute of Engineering and Technology',
  period: '2024 – 2028',
  coursework: ['Data Structures', 'Machine Learning', 'DBMS'],
};

export const focusAreas = [
  { id: 'ml', title: 'Machine Learning', body: 'Regression, classification & clustering with scikit-learn' },
  { id: 'cv', title: 'Computer Vision', body: 'Face recognition, eigenfaces, CNN inference' },
  { id: 'nlp', title: 'NLP & LLMs', body: 'TF-IDF matching, spaCy, agents & RAG research' },
  { id: 'data', title: 'Data Analysis', body: 'Cleaning, EDA and clear visual reporting' },
];
