# SkinWise AI – Skin Health Awareness & AI-Powered Skin Analysis

<p align="center">
  <strong>Making Skin Health Awareness Smarter, Simpler, and More Accessible.</strong>
</p>

SkinWise AI is a web-based skin health awareness platform designed to help users understand common skin conditions, learn about skin cancer, identify potential warning signs, and access dermatologist information. It also includes an experimental AI-powered skin image classification feature using a deep learning model trained on the HAM10000 dataset.

## 🌟 Key Features

### 1. User Authentication
- User registration and login.
- Secure password hashing using bcrypt.
- JWT-based authentication.
- Protected application routes.

### 2. Skin Health Information
- Educational information about different types of skin cancer.
- Information about common skin diseases.
- Symptoms, warning signs, and risk factors.
- General skin health and prevention guidance.

### 3. AI-Powered Skin Image Analysis
- Upload skin lesion images for experimental classification.
- Deep learning model based on EfficientNetB0.
- Trained using the HAM10000 dataset.
- Displays the top three predicted categories with confidence scores.
- Supports JPG, PNG, and WEBP image uploads.

### 4. Skin Health Questionnaire
- Ten-question skin health screening flow.
- Questions related to skin changes and warning signs.
- Provides general awareness and guidance.
- Encourages professional medical consultation when appropriate.

### 5. Find a Dermatologist
- Dedicated dermatologist-finding section.
- Helps users explore dermatologist resources.

### 6. Skin Health Blog
- Educational blog section.
- Skin health awareness content.
- Informative articles and user-oriented resources.

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML5, CSS3 |
| Routing | React Router |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | JWT, bcrypt |
| Machine Learning | Python, TensorFlow, Keras |
| Deep Learning Model | EfficientNetB0 |
| ML API | FastAPI, Uvicorn |
| Dataset | HAM10000 |
| Image Processing | Pillow, NumPy |
| ML Data Processing | Pandas, Scikit-learn |

## 🧠 Machine Learning Implementation

SkinWise AI integrates an experimental skin lesion classification model trained on the HAM10000 dataset.

**Dataset:** [HAM10000 – Kaggle](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000)

The dataset contains 10,015 dermatoscopic images across seven diagnostic categories.

### Classification Categories

| Label | Category |
|---|---|
| AKIEC | Actinic keratoses / intraepithelial carcinoma |
| BCC | Basal cell carcinoma |
| BKL | Benign keratosis-like lesions |
| DF | Dermatofibroma |
| MEL | Melanoma |
| NV | Melanocytic nevi |
| VASC | Vascular lesions |

### Model Workflow

1. User uploads a skin lesion image.
2. The image is received by the FastAPI backend.
3. The image is resized and preprocessed.
4. EfficientNetB0 processes the image.
5. The model generates classification scores.
6. The top three predictions are returned to the frontend.

**Note:** Model confidence scores are not probabilities of having cancer and should not be interpreted as diagnostic results.

## 📁 Project Structure

```text
SkinWise/
│
├── public/
│
├── src/
│   ├── components/
│   ├── context/
│   ├── css/
│   ├── App.js
│   └── index.js
│
├── server/
│   ├── routes/
│   ├── .env.example
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── ml-service/
│   ├── data/
│   ├── models/
│   ├── app.py
│   ├── train.py
│   ├── requirements.txt
│   └── README.md
│
├── package.json
├── package-lock.json
├── start-backend.bat
├── run-skinwise.bat
└── README.md
```

## ⚙️ Installation and Setup

Follow these steps to run SkinWise AI locally.

### Prerequisites

Install the following:

- Node.js and npm
- Python 3.10 or 3.11 (recommended for TensorFlow 2.15.1)
- PostgreSQL
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/AVI25Kaur/SkinWise.git

cd SkinWise
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Configure the PostgreSQL Backend

Navigate to the server directory:

```bash
cd server
```

Create a copy of `.env.example` named `.env`.

Configure your PostgreSQL credentials:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=skinwise
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_SSL=false

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d

CLIENT_ORIGIN=http://localhost:3000
```

Create a PostgreSQL database named `skinwise` before starting the backend.

Install backend dependencies:

```bash
npm install
```

Start the backend:

```bash
npm start
```

The backend runs on:

`http://localhost:5000`

### Step 4: Configure the Machine Learning Service

Open another terminal:

```bash
cd ml-service
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
python -m pip install --upgrade pip

pip install -r requirements.txt
```

### Step 5: Download the HAM10000 Dataset

Download the dataset from:

https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000

After extracting it, organize the files as follows:

```text
ml-service/
│
└── data/
    ├── HAM10000_metadata.csv
    │
    └── HAM10000_images/
        ├── ISIC_0024306.jpg
        ├── ISIC_0024307.jpg
        └── ...
```

Copy all images from both HAM10000 image folders into `HAM10000_images`.

**Important:** The dataset is not included in this GitHub repository because of its large size and separate dataset terms.

### Step 6: Train the AI Model

From inside the `ml-service` directory, run:

```bash
python train.py
```

The training script uses EfficientNetB0 transfer learning and saves the trained model and label information inside:

```text
ml-service/models/
    skinwise_ham10000.keras
    labels.json
```

Training may take some time depending on your system.

### Step 7: Start the ML API

Run:

```bash
uvicorn app:app --reload --port 8000
```

The ML API will be available at:

`http://localhost:8000`

API health endpoint:

`http://localhost:8000/health`

Interactive API documentation:

`http://localhost:8000/docs`

### Step 8: Start the React Frontend

Open another terminal in the project root:

```bash
npm start
```

The application will open at:

`http://localhost:3000`

You can also use the provided Windows launcher:

```bash
run-skinwise.bat
```

This starts the Node.js backend and React frontend. The PostgreSQL database must already be configured. Start the ML service separately when using AI Skin Check.

## 🔗 Important Application Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/about` | About SkinWise |
| `/login` | User login |
| `/signup` | User registration |
| `/home` | User dashboard |
| `/info` | Skin health information |
| `/get-tested` | Skin health testing information |
| `/ai-skin-check` | AI skin image analysis |
| `/find-a-dermatologist` | Find dermatologists |
| `/blog` | Skin health blog |

Some application routes require user authentication.

## 🔒 Security and Privacy

- Passwords are hashed before storage.
- JWT authentication is used for protected routes.
- Database credentials and secrets should be stored in environment variables.
- Never commit `.env` files or private credentials to GitHub.
- Keep datasets and generated model weights outside the repository unless intentionally distributed.

## ⚠️ Medical Disclaimer

SkinWise AI is an educational and research-oriented project. Its AI classification feature is experimental and is not clinically validated.

- It does not provide medical diagnoses.
- It cannot confirm or rule out skin cancer.
- Model confidence scores should not be treated as medical certainty.
- The questionnaire is not a validated clinical risk assessment.
- Users should consult qualified dermatologists or healthcare professionals about new, changing, bleeding, crusting, or non-healing skin lesions.

Never delay medical consultation based on the application's output.

## 🚀 Future Enhancements

- Improve model performance with more diverse and representative datasets.
- Evaluate the model on independent clinical datasets.
- Enhance accessibility and mobile responsiveness.
- Add multilingual skin health awareness resources.
- Expand dermatologist discovery features.
- Improve model monitoring and prediction explanations.

## 👩‍💻 Project Repository

**GitHub:** [AVI25Kaur/SkinWise](https://github.com/AVI25Kaur/SkinWise)

## 🙏 Acknowledgements

- [HAM10000 Dataset](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000)
- [TensorFlow](https://www.tensorflow.org/)
- [React](https://react.dev/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Scikit-learn](https://scikit-learn.org/)

---

<p align="center">
  <strong>SkinWise AI – Promoting Awareness, Encouraging Prevention, and Supporting Better Skin Health.</strong>
</p>
>>>>>>> aefe4eb6 (Initial SkinWise project upload)
"# Skinwise" 
