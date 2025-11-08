# 📨 AI Cover Letter Generator (Node.js + Ollama)

This project is an **Express.js** application that generates professional cover letters using your **CV (PDF)** and a **Job Description**.
It uses **Ollama** for local LLM inference and embeddings.

---

## 🚀 Features

- Upload a PDF CV
- Extracts text content from the PDF
- Generates vector embeddings using `ollama` (model: `gemma:2b`)
- Creates a tailored, AI-generated cover letter using your CV and job description

---

## 🧰 Requirements

Before running the app, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version ≥ 18)
- [npm](https://www.npmjs.com/)
- [Ollama](https://ollama.com/download) (for local model inference)
- Model pulled locally:

  ```bash
  ollama pull gemma:2b
  ```

---

## 📦 Installation

1. **Clone this repository**

   ```bash
   git clone https://github.com/abdulganiyy/cvwriter.git
   cd cvwriter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Make sure Ollama is running locally**

   - Open a terminal and start Ollama if it’s not running:

     ```bash
     ollama serve
     ```

   - Verify it works:

     ```bash
     ollama list
     ```

---

## 🏃 Run the App

Start the development server:

```bash
node index.js
```

By default, the server will start at:

```
http://localhost:8000
```

---

## 🧪 API Endpoints

### `POST /upload`

Generates a cover letter based on the uploaded CV and job description.

#### Request body:

```json
{
  "fileContent": "<base64-encoded PDF data>",
  "description": "Software engineer position focusing on full-stack web development..."
}
```

#### Response:

```json
{
  "coverLetter": "Dear Hiring Manager, ..."
}
```

---

## 🗂 Project Structure

```
.
├── build/                # Optional frontend build (e.g., React app)
├── index.js              # Main Express app
├── package.json
└── README.md
```

---

## ⚙️ Notes

- You can integrate a frontend that uploads the CV (PDF) and job description via `fetch('/upload')`.
- The current embedding model is `gemma:2b`. You can switch to another available embedding model by changing:

  ```js
  model: "gemma:2b";
  ```

  to something like `"Qwen2:0.5b"`

- Ensure your machine has enough RAM and CPU to run `gemma:2b`.

---

## 🧩 Example Frontend Fetch Request

```js
const handleUpload = async (pdfBase64, description) => {
  const res = await fetch("http://localhost:8000/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileContent: pdfBase64,
      description,
    }),
  });

  const data = await res.json();
  console.log("Generated Cover Letter:", data.coverLetter);
};
```

---
