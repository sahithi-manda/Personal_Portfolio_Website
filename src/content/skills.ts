// Skills constellation. Every skill names its evidence: a lab, a role or a certification.

export type SkillSystem = 'core' | 'learning' | 'vision' | 'language' | 'data' | 'tools';

export interface Skill {
  id: string;
  name: string;
  system: SkillSystem;
  /** 1 = primary, 2 = working, 3 = familiar. Drives star size only. */
  weight: 1 | 2 | 3;
  about: string;
  evidence: string[];
}

export const systems: Record<SkillSystem, { label: string; blurb: string }> = {
  core: { label: 'Languages', blurb: 'What I write models and tools in.' },
  learning: { label: 'ML & Deep Learning', blurb: 'Modelling and training.' },
  vision: { label: 'Computer Vision', blurb: 'Seeing with pixels.' },
  language: { label: 'NLP & GenAI', blurb: 'Working with text and language models.' },
  data: { label: 'Data', blurb: 'Wrangling, storing and showing data.' },
  tools: { label: 'Tooling', blurb: 'Shipping and collaborating.' },
};

export const skills: Skill[] = [
  // Languages
  { id: 'python', name: 'Python', system: 'core', weight: 1, about: 'Primary language for every ML, CV and data project.', evidence: ['All six labs', 'Cisco Python Essentials 1'] },
  { id: 'typescript', name: 'TypeScript', system: 'core', weight: 2, about: 'Typed step engine and React UI for the DSA Visualizer.', evidence: ['LAB-03 Smart DSA Visualizer'] },
  { id: 'java', name: 'Java', system: 'core', weight: 3, about: 'Fundamentals; used for an academic hospital-management system.', evidence: ['Resume: Java (Basics)'] },
  { id: 'web', name: 'HTML / CSS / JS', system: 'core', weight: 3, about: 'Front-end foundations for demos and interfaces.', evidence: ['Resume: Web Technologies'] },

  // ML & DL
  { id: 'ml', name: 'Machine Learning', system: 'learning', weight: 1, about: 'Regression, classification and clustering with proper splits and evaluation.', evidence: ['Labmentix internship', 'LAB-02 PCA + ANN'] },
  { id: 'sklearn', name: 'scikit-learn', system: 'learning', weight: 1, about: 'MLPClassifier, TF-IDF, scalers, splits and metrics.', evidence: ['LAB-02', 'LAB-04', 'LAB-06'] },
  { id: 'tensorflow', name: 'TensorFlow / Keras', system: 'learning', weight: 2, about: 'Built and compared SimpleRNN and LSTM sequence models.', evidence: ['LAB-06 Tesla Forecasting'] },
  { id: 'pytorch', name: 'PyTorch', system: 'learning', weight: 3, about: 'Pretrained ResNet18 inference with torchvision transforms.', evidence: ['LAB-05 Image & Text Recognition'] },
  { id: 'dl', name: 'Deep Learning', system: 'learning', weight: 2, about: 'Recurrent networks for time series; CNN inference for vision.', evidence: ['LAB-06', 'LAB-05'] },
  { id: 'ann', name: 'Neural Networks (ANN)', system: 'learning', weight: 2, about: 'Multi-layer perceptron classification on PCA signatures.', evidence: ['LAB-02'] },
  { id: 'pca', name: 'PCA', system: 'learning', weight: 2, about: 'Eigen-decomposition implemented from scratch with NumPy.', evidence: ['LAB-02'] },

  // Vision
  { id: 'cv', name: 'Computer Vision', system: 'vision', weight: 1, about: 'Face recognition pipelines, eigenfaces and pretrained classifiers.', evidence: ['LAB-01', 'LAB-02', 'LAB-05'] },
  { id: 'opencv', name: 'OpenCV', system: 'vision', weight: 1, about: 'Capture, resizing, colour conversion and preprocessing.', evidence: ['LAB-01', 'LAB-02'] },
  { id: 'facerec', name: 'Face Recognition', system: 'vision', weight: 2, about: '128-d dlib encodings matched against an enrolled registry.', evidence: ['LAB-01'] },
  { id: 'ocr', name: 'OCR', system: 'vision', weight: 3, about: 'EasyOCR text extraction with confidences and boxes.', evidence: ['LAB-05'] },

  // NLP & GenAI
  { id: 'nlp', name: 'NLP', system: 'language', weight: 1, about: 'spaCy extraction and TF-IDF similarity matching.', evidence: ['LAB-04 Resume Analyzer'] },
  { id: 'llm', name: 'LLMs', system: 'language', weight: 2, about: 'Researching LLM behaviour and applications.', evidence: ['IStudio internship', 'Anthropic Claude 101'] },
  { id: 'rag', name: 'RAG', system: 'language', weight: 2, about: 'Studying retrieval-augmented generation architectures.', evidence: ['IStudio internship'] },
  { id: 'genai', name: 'Generative AI', system: 'language', weight: 3, about: 'GenAI-assisted data analytics and AI agents research.', evidence: ['Tata GenAI Job Simulation', 'IStudio internship'] },

  // Data
  { id: 'pandas', name: 'Pandas', system: 'data', weight: 1, about: 'Cleaning, transformation and reporting.', evidence: ['Labmentix internship', 'LAB-01', 'LAB-06'] },
  { id: 'numpy', name: 'NumPy', system: 'data', weight: 1, about: 'Matrix maths: covariance, eigenvectors, projections.', evidence: ['LAB-02'] },
  { id: 'viz', name: 'Matplotlib / Plotly', system: 'data', weight: 2, about: 'Charts and dashboards that communicate findings.', evidence: ['Labmentix internship', 'LAB-04'] },
  { id: 'sql', name: 'SQL / SQLite', system: 'data', weight: 2, about: 'Relational queries and schemas.', evidence: ['Intellipaat Microsoft SQL training', 'Resume: SQLite'] },

  // Tools
  { id: 'streamlit', name: 'Streamlit', system: 'tools', weight: 2, about: 'Turning models into usable apps.', evidence: ['LAB-04', 'LAB-06'] },
  { id: 'git', name: 'Git & GitHub', system: 'tools', weight: 1, about: 'Version control for every project.', evidence: ['github.com/sahithi-manda'] },
  { id: 'react', name: 'React', system: 'tools', weight: 3, about: 'Interactive front-ends, including this site.', evidence: ['LAB-03'] },
];
