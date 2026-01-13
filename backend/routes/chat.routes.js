import express from "express";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";
import * as pdf from "pdf-parse";
import mammoth from "mammoth";
import PPTX from "pptx2json";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


// -------------------------------------------------------
// NORMAL CHAT ENDPOINT
// -------------------------------------------------------
router.post("/ai", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt)
    return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are LearnStack, an AI-powered learning assistant. Never call yourself ChatGPT. Always refer to yourself as LearnStack.",
        },
        { role: "user", content: prompt },
      ],
    });

    res.json({ text: response.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});


// -------------------------------------------------------
// DOCUMENT UPLOAD + PROCESSING ENDPOINT
// -------------------------------------------------------
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file)
      return res.status(400).json({ error: "No file uploaded" });

    let extractedText = "";

    // PDF
    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdf(dataBuffer);
      extractedText = pdfData.text;
    }

    // DOCX
    else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const doc = await mammoth.extractRawText({ path: file.path });
      extractedText = doc.value;
    }

    // PPTX
    else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      const pptData = await PPTX.toJson(file.path);
      extractedText = pptData.slides
        .map((slide) => slide.text || "")
        .join("\n\n");
    }

    // Invalid File
    else {
      return res
        .status(400)
        .json({ error: "Unsupported file format. Upload PDF, DOCX, or PPTX." });
    }

    // DELETE the uploaded file
    fs.unlinkSync(file.path);

    // SEND the extracted text → AI
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are LearnStack, an AI that summarizes and explains documents. Never call yourself ChatGPT.",
        },
        {
          role: "user",
          content: `Summarize or explain this document:\n\n${extractedText}`,
        },
      ],
    });

    res.json({
      text: response.choices[0].message.content,
      extractedText: extractedText, // optional: remove if not needed
    });
  } catch (err) {
    console.error("Document Error:", err);
    res.status(500).json({ error: "Failed to process the uploaded file" });
  }
});

export default router;
