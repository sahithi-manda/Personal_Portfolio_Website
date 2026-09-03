import type { PortfolioProject } from '../types/project';

/**
 * Curated fallback projects to display if GitHub API is unreachable,
 * rate-limited, or during initial offline load.
 */
export const fallbackProjects: PortfolioProject[] = [
  {
    id: 'ai-study-planner',
    title: 'AI-Powered Study Planner',
    description:
      'An intelligent study planning application that creates personalized preparation schedules and custom task recommendations dynamically aligned with user constraints and study targets.',
    tech: ['Python', 'Streamlit', 'SQLite', 'Pandas'],
    github: 'https://github.com/sahithi-manda/AI-Study-Planner',
    liveUrl: null,
    stars: 1,
    forks: 0,
    language: 'Python',
    featured: true,
    displayOrder: 1,
    gridClass: 'md:col-span-3',
    updatedAt: '2026-02-15T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'pca-ann-face-recognition',
    title: 'Face Recognition: PCA & ANN',
    description:
      'A mathematical and neural facial classifier model using Principal Component Analysis for dimensional reduction and Artificial Neural Networks for identity sorting.',
    tech: ['Python', 'OpenCV', 'TensorFlow', 'PCA', 'ANN'],
    github: 'https://github.com/sahithi-manda/PCA_ANN-FaceRecogination',
    liveUrl: null,
    stars: 1,
    forks: 0,
    language: 'Python',
    featured: true,
    displayOrder: 2,
    gridClass: 'md:col-span-3',
    updatedAt: '2026-02-10T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'ai-recommendation-system',
    title: 'AI Recommendation System',
    description:
      'A recommendation engine generating content preferences matching using vectorized user metadata and item indexing algorithms.',
    tech: ['Python', 'Pandas', 'Scikit-Learn'],
    github: 'https://github.com/sahithi-manda/AI_Recommendation_System',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: true,
    displayOrder: 3,
    gridClass: 'md:col-span-2',
    updatedAt: '2026-02-05T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'rule-based-ai-chatbot',
    title: 'Rule-Based AI Chatbot',
    description:
      'An interactive chatbot implementation using rule-based natural language processing heuristics for guided communication sequences.',
    tech: ['Python', 'NLP', 'Regex'],
    github: 'https://github.com/sahithi-manda/Rule-Based-AI-Chatbot',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-2',
    updatedAt: '2026-01-28T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'image-text-recognition-ocr',
    title: 'Image & Text Recognition OCR',
    description:
      'An image classification and optical character recognition dashboard using PyTorch, ResNet18 feature maps, and EasyOCR parsing.',
    tech: ['PyTorch', 'ResNet18', 'EasyOCR', 'Computer Vision'],
    github: 'https://github.com/sahithi-manda/Image_or_Text_Recognition',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-2',
    updatedAt: '2026-01-20T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'ai-attendance-face-recognition',
    title: 'AI Attendance Face Recognition',
    description:
      'An automated classroom/office attendance logging platform that tracks student check-ins in real-time via live video facial scanning.',
    tech: ['Python', 'OpenCV', 'Face Recognition', 'NumPy'],
    github: 'https://github.com/sahithi-manda/AI-Based-Attendance-using-Face-Recogination',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-3',
    updatedAt: '2026-01-15T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'ai-student-score-predictor',
    title: 'AI Student Score Predictor',
    description:
      'A predictive regression machine learning model forecasting final grades and academic scores based on weekly study durations and test attributes.',
    tech: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'],
    github: 'https://github.com/sahithi-manda/AI-Powered-Student-Score-Predictor',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-3',
    updatedAt: '2026-01-10T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'ai-resume-analyzer',
    title: 'AI Resume Analyzer',
    description:
      'An intelligent parsing dashboard that analyzes resumes against criteria metrics and recommends optimizations using NLP techniques.',
    tech: ['Python', 'Streamlit', 'NLP', 'PyPDF2'],
    github: 'https://github.com/sahithi-manda/AI-Resume-Analyzer',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-3',
    updatedAt: '2026-01-05T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'customer-segmentation-analysis',
    title: 'Customer Segmentation Analysis',
    description:
      'An unsupervised clustering study segmenting retail buyer segments into behavioral profiles using the K-Means clustering algorithm.',
    tech: ['Python', 'K-Means', 'Scikit-Learn', 'Seaborn'],
    github: 'https://github.com/sahithi-manda/Customer-Segmentation',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-3',
    updatedAt: '2025-12-25T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'data-classification-using-ai',
    title: 'Data Classification using AI',
    description:
      'A comparison pipeline training various classification models (Decision Trees, SVMs) to categorize multidimensional tabular datasets.',
    tech: ['Python', 'Jupyter', 'Scikit-Learn'],
    github: 'https://github.com/sahithi-manda/Data-Classification-using-AI',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-2',
    updatedAt: '2025-12-15T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'emi-prediction-project',
    title: 'EMI Prediction Project',
    description:
      'A machine learning prediction engine checking loan repayment probabilities and monthly EMI default risks based on customer profiles.',
    tech: ['Python', 'Pandas', 'Scikit-Learn'],
    github: 'https://github.com/sahithi-manda/EMI_Prediction_Project',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-2',
    updatedAt: '2025-12-05T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'house-price-predictor',
    title: 'House Price Predictor',
    description:
      'A regression modeling web tool designed to evaluate real estate market valuations using location trends and structure features.',
    tech: ['Python', 'Jupyter', 'Pandas', 'Scikit-Learn'],
    github: 'https://github.com/sahithi-manda/House-Price-Predictor',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-2',
    updatedAt: '2025-11-20T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'loan-default-prediction',
    title: 'Loan Default Prediction',
    description:
      'A predictive credit risk analytics project assessing default liabilities and applicant classification for mortgage approvals.',
    tech: ['Python', 'Jupyter', 'Scikit-Learn', 'Pandas'],
    github: 'https://github.com/sahithi-manda/Loan-Default-Prediction',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-3',
    updatedAt: '2025-11-10T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'student-performance-prediction',
    title: 'Student Performance Prediction',
    description:
      'A machine learning analytics model identifying key behavioral and demographic factors influencing student learning outcomes.',
    tech: ['Python', 'Pandas', 'Scikit-Learn'],
    github: 'https://github.com/sahithi-manda/Student-Performance-Prediction',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-3',
    updatedAt: '2025-10-25T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'tesla-stock-price-prediction',
    title: 'Tesla Stock Price Prediction',
    description:
      'A time-series prediction project using Long Short-Term Memory (LSTM) recurrent neural networks to forecast future Tesla stock market prices.',
    tech: ['Python', 'LSTM', 'TensorFlow', 'Jupyter'],
    github: 'https://github.com/sahithi-manda/Tesla-Stock-Price-Prediction',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-3',
    updatedAt: '2025-10-15T00:00:00Z',
    isFromGitHub: false,
  },
  {
    id: 'bus-reservation-system',
    title: 'Bus Reservation System',
    description:
      'A booking ledger application coordinating transit bookings, route tables, passenger reservations, and ticketing operations.',
    tech: ['Python', 'SQLite'],
    github: 'https://github.com/sahithi-manda/bus-reservation-system',
    liveUrl: null,
    stars: 0,
    forks: 0,
    language: 'Python',
    featured: false,
    gridClass: 'md:col-span-3',
    updatedAt: '2025-10-01T00:00:00Z',
    isFromGitHub: false,
  },
];

/**
 * Intelligent description and tech dictionary for existing repos if GitHub description is empty
 */
export const repoCuratedKnowledge: Record<string, { title: string; description: string; tech: string[]; featured?: boolean; displayOrder?: number }> = {
  'AI-Study-Planner': {
    title: 'AI-Powered Study Planner',
    description:
      'An intelligent study planning application that creates personalized preparation schedules and custom task recommendations dynamically aligned with user constraints and study targets.',
    tech: ['Python', 'Streamlit', 'SQLite', 'Pandas'],
    featured: true,
    displayOrder: 1,
  },
  'PCA_ANN-FaceRecogination': {
    title: 'Face Recognition: PCA & ANN',
    description:
      'A mathematical and neural facial classifier model using Principal Component Analysis for dimensional reduction and Artificial Neural Networks for identity sorting.',
    tech: ['Python', 'OpenCV', 'TensorFlow', 'PCA', 'ANN'],
    featured: true,
    displayOrder: 2,
  },
  'AI_Recommendation_System': {
    title: 'AI Recommendation System',
    description:
      'A recommendation engine generating content preferences matching using vectorized user metadata and item indexing algorithms.',
    tech: ['Python', 'Pandas', 'Scikit-Learn'],
    featured: true,
    displayOrder: 3,
  },
  'Rule-Based-AI-Chatbot': {
    title: 'Rule-Based AI Chatbot',
    description:
      'An interactive chatbot implementation using rule-based natural language processing heuristics for guided communication sequences.',
    tech: ['Python', 'NLP', 'Regex'],
  },
  'Image_or_Text_Recognition': {
    title: 'Image & Text Recognition OCR',
    description:
      'An image classification and optical character recognition dashboard using PyTorch, ResNet18 feature maps, and EasyOCR parsing.',
    tech: ['PyTorch', 'ResNet18', 'EasyOCR'],
  },
  'AI-Based-Attendance-using-Face-Recogination': {
    title: 'AI Attendance Face Recognition',
    description:
      'An automated classroom/office attendance logging platform that tracks student check-ins in real-time via live video facial scanning.',
    tech: ['Python', 'OpenCV', 'Face Recognition'],
  },
  'AI-Powered-Student-Score-Predictor': {
    title: 'AI Student Score Predictor',
    description:
      'A predictive regression machine learning model forecasting final grades and academic scores based on weekly study durations and test attributes.',
    tech: ['Python', 'Scikit-Learn', 'Pandas'],
  },
  'AI-Resume-Analyzer': {
    title: 'AI Resume Analyzer',
    description:
      'An intelligent parsing dashboard that analyzes resumes against criteria metrics and recommends optimizations using NLP techniques.',
    tech: ['Python', 'Streamlit', 'NLP', 'PyPDF2'],
  },
  'Customer-Segmentation': {
    title: 'Customer Segmentation Analysis',
    description:
      'An unsupervised clustering study segmenting retail buyer segments into behavioral profiles using the K-Means clustering algorithm.',
    tech: ['Python', 'K-Means', 'Scikit-Learn', 'Seaborn'],
  },
  'Data-Classification-using-AI': {
    title: 'Data Classification using AI',
    description:
      'A comparison pipeline training various classification models (Decision Trees, SVMs) to categorize multidimensional tabular datasets.',
    tech: ['Python', 'Jupyter', 'Scikit-Learn'],
  },
  'EMI_Prediction_Project': {
    title: 'EMI Prediction Project',
    description:
      'A machine learning prediction engine checking loan repayment probabilities and monthly EMI default risks based on customer profiles.',
    tech: ['Python', 'Pandas', 'Scikit-Learn'],
  },
  'House-Price-Predictor': {
    title: 'House Price Predictor',
    description:
      'A regression modeling web tool designed to evaluate real estate market valuations using location trends and structure features.',
    tech: ['Python', 'Jupyter', 'Pandas', 'Scikit-Learn'],
  },
  'Loan-Default-Prediction': {
    title: 'Loan Default Prediction',
    description:
      'A predictive credit risk analytics project assessing default liabilities and applicant classification for mortgage approvals.',
    tech: ['Python', 'Jupyter', 'Scikit-Learn', 'Pandas'],
  },
  'Student-Performance-Prediction': {
    title: 'Student Performance Prediction',
    description:
      'A machine learning analytics model identifying key behavioral and demographic factors influencing student learning outcomes.',
    tech: ['Python', 'Pandas', 'Scikit-Learn'],
  },
  'Tesla-Stock-Price-Prediction': {
    title: 'Tesla Stock Price Prediction',
    description:
      'A time-series prediction project using Long Short-Term Memory (LSTM) recurrent neural networks to forecast future Tesla stock market prices.',
    tech: ['Python', 'LSTM', 'TensorFlow', 'Jupyter'],
  },
  'bus-reservation-system': {
    title: 'Bus Reservation System',
    description:
      'A booking ledger application coordinating transit bookings, route tables, passenger reservations, and ticketing operations.',
    tech: ['Python', 'SQLite'],
  },
  'Hospital_Management_System': {
    title: 'Hospital Management System',
    description:
      'A comprehensive healthcare information and management system handling patient registration, appointments, medical records, and billing.',
    tech: ['Java', 'SQL', 'Database Systems'],
  },
};
