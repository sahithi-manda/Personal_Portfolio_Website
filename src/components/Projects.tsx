import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import { useMousePosition } from '../hooks/useMousePosition';
import { CardTilt3D } from './CardTilt3D';

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  gridClass: string;
}

const projectsData: Project[] = [
  {
    title: 'AI-Powered Study Planner',
    description: 'An intelligent study planning application that creates personalized preparation schedules and custom task recommendations dynamically aligned with user constraints and study targets.',
    tech: ['Python', 'Streamlit', 'SQLite'],
    github: 'https://github.com/sahithi-manda/AI-Study-Planner',
    gridClass: 'md:col-span-3',
  },
  {
    title: 'Face Recognition: PCA & ANN',
    description: 'A mathematical and neural facial classifier model using Principal Component Analysis for dimensional reduction and Artificial Neural Networks for identity sorting.',
    tech: ['Python', 'OpenCV', 'TensorFlow', 'PCA', 'ANN'],
    github: 'https://github.com/sahithi-manda/PCA_ANN-FaceRecogination',
    gridClass: 'md:col-span-3',
  },
  {
    title: 'AI Recommendation System',
    description: 'A recommendation engine generating content preferences matching using vectorized user metadata and item indexing algorithms.',
    tech: ['Python', 'Pandas', 'Scikit-Learn'],
    github: 'https://github.com/sahithi-manda/AI_Recommendation_System',
    gridClass: 'md:col-span-2',
  },
  {
    title: 'Rule-Based AI Chatbot',
    description: 'An interactive chatbot implementation using rule-based natural language processing heuristics for guided communication sequences.',
    tech: ['Python', 'NLP'],
    github: 'https://github.com/sahithi-manda/Rule-Based-AI-Chatbot',
    gridClass: 'md:col-span-2',
  },
  {
    title: 'Image & Text Recognition OCR',
    description: 'An image classification and optical character recognition dashboard using PyTorch, ResNet18 feature maps, and EasyOCR parsing.',
    tech: ['PyTorch', 'ResNet18', 'EasyOCR'],
    github: 'https://github.com/sahithi-manda/Image_or_Text_Recognition',
    gridClass: 'md:col-span-2',
  },
  {
    title: 'AI Attendance Face Recognition',
    description: 'An automated classroom/office attendance logging platform that tracks student check-ins in real-time via live video facial scanning.',
    tech: ['Python', 'OpenCV', 'Face Recognition'],
    github: 'https://github.com/sahithi-manda/AI-Based-Attendance-using-Face-Recogination',
    gridClass: 'md:col-span-3',
  },
  {
    title: 'AI Student Score Predictor',
    description: 'A predictive regression machine learning model forecasting final grades and academic scores based on weekly study durations and test attributes.',
    tech: ['Python', 'Scikit-Learn', 'Pandas'],
    github: 'https://github.com/sahithi-manda/AI-Powered-Student-Score-Predictor',
    gridClass: 'md:col-span-3',
  },
  {
    title: 'AI Resume Analyzer',
    description: 'An intelligent parsing dashboard that analyzes resumes against criteria metrics and recommends optimizations using NLP techniques.',
    tech: ['Python', 'Streamlit', 'NLP', 'PyPDF2'],
    github: 'https://github.com/sahithi-manda/AI-Resume-Analyzer',
    gridClass: 'md:col-span-3',
  },
  {
    title: 'Customer Segmentation Analysis',
    description: 'An unsupervised clustering study segmenting retail buyer segments into behavioral profiles using the K-Means clustering algorithm.',
    tech: ['Python', 'K-Means', 'Scikit-Learn', 'Seaborn'],
    github: 'https://github.com/sahithi-manda/Customer-Segmentation',
    gridClass: 'md:col-span-3',
  },
  {
    title: 'Data Classification using AI',
    description: 'A comparison pipeline training various classification models (Decision Trees, SVMs) to categorize multidimensional tabular datasets.',
    tech: ['Python', 'Jupyter', 'Scikit-Learn'],
    github: 'https://github.com/sahithi-manda/Data-Classification-using-AI',
    gridClass: 'md:col-span-2',
  },
  {
    title: 'EMI Prediction Project',
    description: 'A machine learning prediction engine checking loan repayment probabilities and monthly EMI default risks based on customer profiles.',
    tech: ['Python', 'Pandas', 'Scikit-Learn'],
    github: 'https://github.com/sahithi-manda/EMI_Prediction_Project',
    gridClass: 'md:col-span-2',
  },
  {
    title: 'House Price Predictor',
    description: 'A regression modeling web tool designed to evaluate real estate market valuations using location trends and structure features.',
    tech: ['Python', 'Jupyter', 'Pandas', 'Scikit-Learn'],
    github: 'https://github.com/sahithi-manda/House-Price-Predictor',
    gridClass: 'md:col-span-2',
  },
  {
    title: 'Loan Default Prediction',
    description: 'A predictive credit risk analytics project assessing default liabilities and applicant classification for mortgage approvals.',
    tech: ['Python', 'Jupyter', 'Scikit-Learn', 'Pandas'],
    github: 'https://github.com/sahithi-manda/Loan-Default-Prediction',
    gridClass: 'md:col-span-3',
  },
  {
    title: 'Student Performance Prediction',
    description: 'A machine learning analytics model identifying key behavioral and demographic factors influencing student learning outcomes.',
    tech: ['Python', 'Pandas', 'Scikit-Learn'],
    github: 'https://github.com/sahithi-manda/Student-Performance-Prediction',
    gridClass: 'md:col-span-3',
  },
  {
    title: 'Tesla Stock Price Prediction',
    description: 'A time-series prediction project using Long Short-Term Memory (LSTM) recurrent neural networks to forecast future Tesla stock market prices.',
    tech: ['Python', 'LSTM', 'TensorFlow', 'Jupyter'],
    github: 'https://github.com/sahithi-manda/Tesla-Stock-Price-Prediction',
    gridClass: 'md:col-span-3',
  },
  {
    title: 'Bus Reservation System',
    description: 'A booking ledger application coordinating transit bookings, route tables, passenger reservations, and ticketing operations.',
    tech: ['Python', 'SQLite'],
    github: 'https://github.com/sahithi-manda/bus-reservation-system',
    gridClass: 'md:col-span-3',
  },
];

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { containerRef, handleMouseMove } = useMousePosition();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
      className={`${project.gridClass} group h-full`}
    >
      <CardTilt3D className="h-full">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="glow-card glass-panel glass-panel-hover p-6 md:p-8 rounded-xl h-full flex flex-col justify-between relative overflow-hidden"
        >
        <div>
          {/* Header Link */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-accentBlue transition-colors duration-300">
              {project.title}
            </h4>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-textMuted hover:text-white p-2 rounded-lg bg-white/5 border border-white/15 hover:border-white/20 transition-all"
              aria-label="GitHub Repository"
            >
              <FiArrowUpRight size={16} />
            </a>
          </div>

          {/* Description */}
          <p className="text-sm text-textMuted leading-relaxed mb-6 font-medium">
            {project.description}
          </p>
        </div>

        {/* Footer Tech Badges */}
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 border border-white/5 text-accentBlue"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* GitHub Action */}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 group-hover:text-white transition-colors border-b border-white/10 group-hover:border-accentBlue pb-1"
          >
            <FaGithub size={13} />
            <span>View Source Code</span>
          </a>
        </div>
        </div>
      </CardTilt3D>
    </motion.div>
  );
};

export const Projects = () => {
  return (
    <section id="projects" className="py-24 px-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="h-[1px] w-6 bg-accentBlue" />
          <span className="text-xs uppercase tracking-widest text-accentBlue font-bold">Portfolios</span>
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight metallic-text uppercase"
        >
          Featured AI & ML Projects
        </motion.h3>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {projectsData.map((project, idx) => (
          <ProjectCard key={project.title} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
};
