import express from "express";
import ollama from "ollama";
import { PDFParse } from "pdf-parse";
import cors from "cors";
import path from "path";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static("build"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Extract text from the user's CV PDF
async function extractPdfText(buffer) {
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();
  await parser.destroy();

  return data.text.replace(/\s+/g, " ").trim();
}

// Generate embeddings for any given text
async function generateEmbedding(text) {
  const response = await ollama.embed({
    model: "gemma:2b",
    input: text,
  });
  console.log(response.embeddings[0]);
  return response.embeddings[0];
}

// Use LLM to generate cover letter based on job + CV context
async function generateCoverLetter(cvText, jobDescription) {
  const systemPrompt = `
You are an expert career assistant who writes professional, concise, and engaging cover letters.
Generate a tailored cover letter based on the candidate’s CV and the job description.
Return only the cover letter text, formatted in proper paragraphs.
`;

  const userPrompt = `
CV:
${cvText.slice(0, 4000)}  <!-- limit text to avoid token overflow -->

Job Description:
${jobDescription}
`;

  const completion = await ollama.chat({
    model: "gemma:2b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return completion.message.content;
}

app.get("/", (_, res) => {
  res.sendFile(path.join(path.dirname, "build/index.html"));
});

app.post("/upload", async (req, res) => {
  const body = req.body;
  //   console.log(req.body);

  try {
    // Extracting text from CV...
    const cvText = await extractPdfText(body.fileContent);

    // Generating embeddings...
    const cvEmbedding = await generateEmbedding(cvText);
    const jobEmbedding = await generateEmbedding(body.description);
    console.log(
      "✅ Embeddings generated (length):",
      cvEmbedding.length,
      jobEmbedding.length
    );

    // Generating cover letter...
    const coverLetter = await generateCoverLetter(cvText, body.description);

    res.json({ coverLetter });
  } catch (error) {
    console.log(error);
    res.json({
      status: "fail",
      error,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
