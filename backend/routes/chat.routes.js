import express from "express";
import { createRequire } from "module";
import multer from "multer";
import fs from "fs";
import mammoth from "mammoth";
import PPTX2Json from "pptx2json";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// -----------------------------
// Initialize everything first
// -----------------------------
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse"); // pdf-parse in ESM
const router = express.Router();  // ✅ router declared first
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// -----------------------------
// NORMAL CHAT ENDPOINT
// -----------------------------
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

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file)
      return res.status(400).json({ error: "No file uploaded" });

    let extractedText = "";
    const ext = file.originalname.split(".").pop().toLowerCase();

    // PDF
    if (file.mimetype === "application/pdf" || ext === "pdf") {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdf(dataBuffer);
      extractedText = pdfData.text;
    }
    // DOCX
    else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      ext === "docx"
    ) {
      const doc = await mammoth.extractRawText({ path: file.path });
      extractedText = doc.value;
    }
    // PPTX
    else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      ext === "pptx"
    ) {
      // Create parser
      const pptx2json = new PPTX2Json();
      const pptResult = await pptx2json.toJson(file.path); // use toJson()

      // Combine all text from slides
      extractedText = pptResult.slides
        ?.map((slide) =>
          slide.texts
            ? slide.texts.map((t) => t.text).join("\n")
            : ""
        )
        .join("\n\n") ?? "";
    }
    else {
      fs.unlinkSync(file.path);
      return res
        .status(400)
        .json({ error: "Unsupported file format. Upload PDF, DOCX, or PPTX." });
    }

    fs.unlinkSync(file.path); // cleanup

    if (!extractedText.trim()) {
      return res.status(400).json({ error: "Could not extract text from file" });
    }

    // Send to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are LearnStack, an AI that summarizes uploaded documents.",
        },
        {
          role: "user",
          content: extractedText.substring(0, 8000),
        },
      ],
    });

    res.json({
      text: response.choices[0].message.content,
    });
  } catch (err) {
    console.error("Document Error:", err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Failed to process the uploaded file" });
  }
});

export default router;
