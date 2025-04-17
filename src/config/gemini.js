import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyClh4di - APnZJNlp3SdCVfxuPNGXrSvBXc";

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

function downloadBase64File(base64Data, mimeType, filename) {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const byteArray = new Uint8Array(byteArrays);
  const blob = new Blob([byteArray], { type: mimeType });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

async function runChat(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  const candidates = result.response.candidates;

  for (
    let candidateIndex = 0;
    candidateIndex < candidates.length;
    candidateIndex++
  ) {
    const candidate = candidates[candidateIndex];
    if (!candidate.content?.parts) continue;

    for (
      let partIndex = 0;
      partIndex < candidate.content.parts.length;
      partIndex++
    ) {
      const part = candidate.content.parts[partIndex];
      if (part.inlineData) {
        const mimeType = part.inlineData.mimeType;
        const base64Data = part.inlineData.data;
        const extension = mimeType.split("/")[1];
        const filename = `output_${candidateIndex}_${partIndex}.${extension}`;
        downloadBase64File(base64Data, mimeType, filename);
      }
    }
  }

  const text = candidates[0]?.content?.parts[0]?.text || "";
  console.log(text);
  return text;
}

export default runChat;
