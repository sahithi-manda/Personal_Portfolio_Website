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
    paragraphs: [
      'I’m an AI / ML engineer who loves the whole journey of a model: from messy raw data, to the right architecture, to a tool real people can actually use. Turning an idea into a working intelligent system is the part of engineering that excites me most.',
      'I’ve built a face-recognition attendance system with at-risk analytics, implemented eigenfaces from first principles, trained recurrent networks to forecast stock prices, and shipped an NLP résumé analyser that reads a CV the way screening software does.',
      'At IStudio I research AI agents, large language models and retrieval-augmented generation while helping develop and test ML solutions. At Labmentix I turned raw customer data into clear, decision-ready insight through careful cleaning, analysis and visualisation.',
      'I care about honest evaluation, clean engineering and clear communication: measuring what a model really does, and explaining it so anyone can trust it. I’m always learning, and I’m excited to bring that energy to a team building AI that matters.',
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
