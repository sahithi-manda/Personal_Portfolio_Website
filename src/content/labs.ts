// Featured project "labs". Written from each repository's README and source.
// Results are only listed where they appear in the repo's own notebook output.

export type SpecimenKind = 'sorting' | 'facescan' | 'eigen' | 'ocr' | 'resume' | 'timeseries';

export interface Lab {
  id: string;
  code: string;
  title: string;
  kicker: string;
  specimen: SpecimenKind;
  overview: string;
  problem: string;
  stack: string[];
  architecture: { label: string; detail: string }[];
  implementation: string[];
  results?: { label: string; value: string; note?: string }[];
  honestNote?: string;
  github: string;
  live?: string;
}

const gh = (repo: string) => `https://github.com/sahithi-manda/${repo}`;

export const labs: Lab[] = [
  {
    id: 'attendance',
    code: 'LAB-01',
    title: 'AI Attendance System',
    kicker: 'Computer vision · Desktop app',
    specimen: 'facescan',
    overview:
      'A desktop attendance system that recognises enrolled students from a webcam feed, logs attendance automatically, and turns the log into analytics: at-risk detection, predictive alerts and exports.',
    problem:
      'Manual roll-calls waste class time and are easy to game. The goal was hands-free attendance plus early warnings for students whose attendance is slipping.',
    stack: ['Python', 'OpenCV', 'face_recognition (dlib)', 'NumPy', 'Pandas', 'CustomTkinter'],
    architecture: [
      { label: 'Capture', detail: 'Webcam frames via OpenCV, downscaled to ¼ for real-time speed.' },
      { label: 'Encode', detail: '128-d face encodings with face_recognition (dlib), cached in memory.' },
      { label: 'Match', detail: 'Live encodings compared against the enrolled registry; boxes scaled back up.' },
      { label: 'Log', detail: 'CSV-backed registry and attendance log via a db_handler layer.' },
      { label: 'Analyse', detail: 'Flags students with a >15% drop over 14 days; projects who will fall below 75%.' },
    ],
    implementation: [
      'Modular core: face_engine, analytics, db_handler, email_handler, auth, kept separate from the GUI layer.',
      'Registration flow captures a webcam frame and stores the first detected face encoding.',
      'Daily, monthly and overall reports exported as CSV; absence notifications sent by email.',
      'CustomTkinter light-theme UI with dashboard, scanner, search-and-verify and reports tabs.',
    ],
    honestNote:
      'An anti-spoofing interface (blink / texture checks) is scaffolded in the codebase but not yet implemented: it currently passes every face.',
    github: gh('AI-Based-Attendance-using-Face-Recogination'),
  },
  {
    id: 'eigenfaces',
    code: 'LAB-02',
    title: 'Face Recognition: PCA + ANN',
    kicker: 'Classical CV · From-scratch PCA',
    specimen: 'eigen',
    overview:
      'Face recognition built from first principles: eigenfaces computed by hand with NumPy, then classified by a multi-layer perceptron.',
    problem:
      'Raw 100×100 images are 10,000-dimensional. The question: how few principal components can still separate identities?',
    stack: ['Python', 'NumPy', 'OpenCV', 'scikit-learn', 'Matplotlib'],
    architecture: [
      { label: 'Preprocess', detail: 'Grayscale, resize to 100×100, flatten: a 10,000 × 450 data matrix.' },
      { label: 'Centre', detail: 'Subtract the mean face from every sample.' },
      { label: 'Decompose', detail: 'Eigen-decomposition of the compact 450 × 450 covariance (the "snapshot" trick).' },
      { label: 'Project', detail: 'Top-k eigenvectors form eigenfaces; each face becomes a k-d signature.' },
      { label: 'Classify', detail: 'MLPClassifier (100 hidden units) trained on the signatures.' },
    ],
    implementation: [
      'Covariance, eigenvectors and projections implemented directly with NumPy rather than sklearn.PCA.',
      'Swept k ∈ {5, 10, 15, 20, 25} to chart accuracy against the number of components.',
      'Visualised the first ten eigenfaces to inspect which facial regions carry the most variance.',
      'Inference path applies the same mean-subtraction and projection to unseen images.',
    ],
    results: [
      { label: 'Dataset', value: '450 images', note: '100×100 grayscale' },
      { label: 'Components', value: 'k = 20' },
      { label: 'Test accuracy', value: '40.6%', note: '60/40 split, from the notebook' },
      { label: 'Re-runs', value: '44–49%', note: 'MLP unseeded; chance is 11.1%' },
    ],
    honestNote:
      'Accuracy is a baseline. Natural next steps are whitening, more components and an SVM comparison.',
    github: gh('PCA_ANN-FaceRecogination'),
  },
  {
    id: 'dsa',
    code: 'LAB-03',
    title: 'Smart DSA Visualizer',
    kicker: 'Algorithms · Web engine',
    specimen: 'sorting',
    overview:
      'A web app that animates data structures and algorithms step by step, with synchronised code highlighting, plain-language explanations and live metrics.',
    problem:
      'Static diagrams don’t show pointers moving, recursion unwinding or why one sort beats another. Learners need to scrub through execution.',
    stack: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Vitest'],
    architecture: [
      { label: 'Algorithms', detail: 'Pure TS implementations emit typed steps: COMPARE, SWAP, PIVOT, VISIT, PUSH…' },
      { label: 'Engine', detail: 'A decoupled state machine records snapshot streams for step / rewind / time-travel.' },
      { label: 'Explain', detail: 'A generator turns each step into a sentence, e.g. “Comparing A[3] (8) and A[4] (5)”.' },
      { label: 'Render', detail: 'Visualisers for arrays, stacks, queues, BST, heaps and graphs.' },
    ],
    implementation: [
      '17 algorithms and structures: six sorts, two searches, stack, queue, linked list, BST, heap, BFS, DFS, Dijkstra, A*.',
      'Comparison mode benchmarks 2–4 algorithms on the same seed with comparisons, writes and accesses.',
      'Code panel in Python and TypeScript highlights the executing line.',
      'Vitest suite covers edge cases: empty, duplicates, reversed, single element, negatives.',
    ],
    results: [{ label: 'Unit tests', value: '39 passing', note: 'Vitest' }],
    github: gh('Smart_DSA_Visualizer'),
  },
  {
    id: 'resume',
    code: 'LAB-04',
    title: 'AI Resume Analyzer',
    kicker: 'NLP · Streamlit app',
    specimen: 'resume',
    overview:
      'Upload a PDF resume and get extracted skills, an ATS-style score, job-description matching with missing keywords, a predicted role and improvement suggestions.',
    problem:
      'Applicants can’t see how keyword-driven screening reads their resume. The tool makes that matching visible and actionable.',
    stack: ['Python', 'Streamlit', 'spaCy', 'scikit-learn', 'PyPDF2', 'Plotly', 'Pandas'],
    architecture: [
      { label: 'Parse', detail: 'PyPDF2 extracts raw text from the uploaded PDF.' },
      { label: 'Extract', detail: 'Skills matched against a curated skills.csv vocabulary.' },
      { label: 'Match', detail: 'TF-IDF vectors + cosine similarity between resume and job description.' },
      { label: 'Classify', detail: 'Keyword-scored role prediction across job categories.' },
      { label: 'Report', detail: 'Plotly dashboard and downloadable JSON analysis.' },
    ],
    implementation: [
      'Without a JD, a structural score rewards length and the presence of experience, education and skills sections.',
      'With a JD, the score is TF-IDF cosine similarity, plus a list of JD skills missing from the resume.',
      'Rule-based suggestions for action verbs, metrics and section structure.',
    ],
    github: gh('AI-Resume-Analyzer'),
  },
  {
    id: 'vision',
    code: 'LAB-05',
    title: 'Image & Text Recognition',
    kicker: 'Deep learning inference · CLI',
    specimen: 'ocr',
    overview:
      'A command-line tool that runs two pretrained recognisers on any image: ImageNet object classification with ResNet18 and text extraction with EasyOCR.',
    problem:
      'Show how far off-the-shelf pretrained models go with no training, and present their confidence clearly.',
    stack: ['Python', 'PyTorch', 'torchvision', 'ResNet18', 'EasyOCR', 'Pillow'],
    architecture: [
      { label: 'Input', detail: 'User image, or auto-generated sample images on first run.' },
      { label: 'Classify', detail: 'torchvision ResNet18 with default transforms; top-5 softmax labels.' },
      { label: 'Read', detail: 'EasyOCR readtext(): strings, per-line confidence and bounding boxes.' },
      { label: 'Output', detail: '--mode image | text | both, formatted terminal report.' },
    ],
    implementation: [
      'Inference only: model.eval() and torch.no_grad(); no training loop.',
      'Sample generator so the project runs out of the box.',
    ],
    results: [{ label: 'OCR sample', value: '99.65%', note: 'confidence on the bundled text sample (README)' }],
    github: gh('Image_or_Text_Recognition'),
  },
  {
    id: 'tesla',
    code: 'LAB-06',
    title: 'Tesla Stock Forecasting',
    kicker: 'Deep learning · Time series',
    specimen: 'timeseries',
    overview:
      'Sequence models trained on Tesla’s adjusted close price since 2010, compared head to head and served through a Streamlit app for 1, 5 and 10-day forecasts.',
    problem:
      'Can a recurrent network learn useful short-horizon structure from price history alone, and does a gated LSTM beat a plain RNN?',
    stack: ['Python', 'TensorFlow / Keras', 'scikit-learn', 'Pandas', 'Streamlit', 'Matplotlib'],
    architecture: [
      { label: 'Window', detail: 'MinMax-scaled Adj Close cut into 60-day sliding windows.' },
      { label: 'Models', detail: 'SimpleRNN(64) and LSTM(64), each with Dropout(0.2) → Dense(1).' },
      { label: 'Train', detail: 'Adam + MSE, 80/20 chronological split, early stopping (patience 5).' },
      { label: 'Forecast', detail: 'Recursive multi-step prediction, inverse-scaled to dollars.' },
    ],
    implementation: [
      'Chronological split avoids leaking future prices into training.',
      'Both models saved; the Streamlit app loads the LSTM and the fitted scaler.',
      'App validates uploads (needs ≥ 60 rows) and plots forecast against the last 60 actual days.',
    ],
    results: [
      { label: 'SimpleRNN RMSE', value: '$13.00', note: 'test set' },
      { label: 'LSTM RMSE', value: '$18.79', note: 'test set' },
    ],
    honestNote:
      'On this split the simpler RNN outperformed the LSTM: a useful reminder that more model capacity is not automatically better.',
    github: gh('Tesla-Stock-Price-Prediction'),
  },
  {
    id: 'interview',
    code: 'LAB-07',
    title: 'AI Interview Intelligence Platform',
    kicker: 'LLM · Full-stack',
    specimen: 'resume',
    overview:
      'A deployed mock-interview platform: it parses a resume and job description, matches skills, generates tailored questions with Gemini and scores the answers.',
    problem:
      'Generic interview prep ignores the gap between a specific candidate and a specific role. Each step needs structured, reliable LLM output, not free text.',
    stack: ['Python', 'FastAPI', 'Gemini API', 'PostgreSQL', 'SQLAlchemy', 'React', 'TypeScript', 'pytest'],
    architecture: [
      { label: 'Parse', detail: 'PyPDF2 / python-docx extract resume text; Gemini builds a structured candidate profile.' },
      { label: 'Match', detail: 'Job description analysis and skill matching produce a gap report.' },
      { label: 'Interview', detail: 'Question generation, answer evaluation and follow-ups, all JSON-mode output validated by Pydantic.' },
      { label: 'Serve', detail: 'FastAPI (11 routers, JWT + bcrypt) on Render; React frontend on Vercel.' },
    ],
    implementation: [
      '9 Gemini modules, each with a response schema and model_validate_json validation.',
      'SQLAlchemy models with Alembic migrations on PostgreSQL (Supabase).',
      '12-page React 19 + TypeScript frontend with Recharts analytics.',
      'pytest API tests mock the LLM calls to cover auth and the full resume-to-interview pipeline.',
    ],
    results: [{ label: 'Backend tests', value: '4 / 4', note: 'pytest, LLM calls mocked' }],
    github: gh('AI_Interview_Intelligence_Platform'),
    live: 'https://ai-interview-intelligence-platform-mocha.vercel.app/',
  },
  {
    id: 'emipredict',
    code: 'LAB-08',
    title: 'EMIPredict AI',
    kicker: 'ML · Classification + Regression',
    specimen: 'timeseries',
    overview:
      'Predicts loan eligibility and the maximum affordable EMI from an applicant profile, served in a multi-page Streamlit app.',
    problem:
      'Lenders need two answers per applicant (lend or not, and how much monthly repayment is sustainable), and the eligible class is a 22% minority.',
    stack: ['Python', 'scikit-learn', 'Pandas', 'Streamlit', 'joblib'],
    architecture: [
      { label: 'Data', detail: '2,500 synthetic applicants (seeded generator), 8 features, 22% eligible.' },
      { label: 'Pipeline', detail: 'ColumnTransformer (scaling + one-hot) shared by training and inference.' },
      { label: 'Models', detail: 'Logistic Regression vs Random Forest; Linear Regression vs Random Forest.' },
      { label: 'Serve', detail: 'Streamlit app with risk bands, a loan-capacity calculator and feature importances.' },
    ],
    implementation: [
      'Selected Logistic Regression on F1, not accuracy, because of class imbalance.',
      'The forest was more precise but missed 47% of eligible applicants.',
      'Random Forest regressor cut MAE 42% compared with linear regression.',
    ],
    results: [
      { label: 'Eligibility F1', value: '73.6%', note: 'accuracy 89.8%' },
      { label: 'EMI R²', value: '0.819', note: 'MAE ₹3,577' },
    ],
    honestNote: 'Labels come from known rules on synthetic data, so the scores show how well the models recover those rules, not real-world lending performance.',
    github: gh('EMI_Prediction_Project'),
  },
  {
    id: 'housing',
    code: 'LAB-09',
    title: 'California House Prices',
    kicker: 'ML · Regression',
    specimen: 'timeseries',
    overview: 'Predicts district median house value from 1990 census features and serves the model in Streamlit.',
    problem: 'House value depends non-linearly on income and location, which a linear model cannot capture.',
    stack: ['Python', 'scikit-learn', 'Pandas', 'Seaborn', 'Streamlit'],
    architecture: [
      { label: 'Data', detail: '20,640 districts, 8 features, no missing values.' },
      { label: 'Models', detail: 'Linear Regression baseline vs Random Forest, tuned with GridSearchCV.' },
      { label: 'Serve', detail: 'train.py rebuilds the model; the app trains it on first run.' },
    ],
    implementation: [
      'Median income is the strongest single predictor (r = 0.69).',
      'Tuning added little over the default forest; the gain comes from the model family.',
    ],
    results: [
      { label: 'Tuned RF R²', value: '0.804', note: 'RMSE ≈ $50.6k' },
      { label: 'Linear R²', value: '0.576', note: 'RMSE ≈ $74.6k' },
    ],
    github: gh('House-Price-Predictor'),
  },
];
