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
  summary:
    'Third-year B.Tech Computer Science student specialising in Artificial Intelligence and Machine Learning, with hands-on experience in machine learning, computer vision, data analysis and AI application development through internships and academic projects.',
  intent:
    'I build practical AI systems end to end: from cleaning the data and choosing the model, to measuring it honestly and shipping something people can use.',
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
  {
    id: 'ml',
    title: 'Machine Learning',
    body: 'Regression, classification and clustering pipelines with scikit-learn: preprocessing, model comparison and evaluation.',
  },
  {
    id: 'cv',
    title: 'Computer Vision',
    body: 'Face recognition with OpenCV and dlib encodings, eigenfaces with PCA, and pretrained CNN inference with PyTorch.',
  },
  {
    id: 'nlp',
    title: 'NLP & LLM systems',
    body: 'TF-IDF matching and spaCy extraction in shipped tools; research on AI agents, LLMs and RAG during my IStudio internship.',
  },
  {
    id: 'data',
    title: 'Data analysis',
    body: 'Cleaning, transforming and visualising real datasets to surface customer-behaviour trends, as done at Labmentix.',
  },
];
