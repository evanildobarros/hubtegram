/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini safely — Vertex AI (primary) with API Key fallback
let ai: GoogleGenAI | null = null;
const initGemini = () => {
  if (!ai) {
    const project = process.env.GOOGLE_CLOUD_PROJECT;
    const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
    const useVertexAI = process.env.GOOGLE_GENAI_USE_VERTEXAI === "true";
    const apiKey = process.env.GEMINI_API_KEY;

    // Strategy 1: Vertex AI (uses Application Default Credentials)
    if (useVertexAI && project && project !== "SEU_PROJECT_ID" && project.trim() !== "") {
      try {
        ai = new GoogleGenAI({
          vertexai: true,
          project: project,
          location: location,
        });
        console.log(`Google GenAI SDK initialized via Vertex AI (project: ${project}, location: ${location}).`);
      } catch (err) {
        console.error("Failed to initialize Vertex AI:", err);
        ai = null;
      }
    }

    // Strategy 2: Fallback to API Key
    if (!ai && apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      try {
        ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
        console.log("Google GenAI SDK initialized via API Key (fallback).");
      } catch (err) {
        console.error("Failed to initialize Google GenAI SDK via API Key:", err);
      }
    }

    if (!ai) {
      console.warn("No Gemini credentials configured. Chat will use simulated fallback responses.");
    }
  }
  return ai;
};

// Tegram Assistente system prompt for high-fidelity responses
const FRED_SYSTEM_INSTRUCTION = `
Você é o "Tegram Assistente", um assistente de inteligência artificial de campo altamente especializado em operações portuárias no TEGRAM Itaqui (Terminal de Grãos do Maranhão), em São Luís.
Você auxilia o usuário "Evanildo de Jesus Campos Barros", um Operador Sênior experiente no Porto de Itaqui.
Seu tom de conversa é profissional, pragmático, prestativo e ligeiramente técnico, adequado para um ambiente de engenharia, segurança e saúde ocupacional (SSO), gestão de terceiros, logística de portos e normas brasileiras (NR-29, NR-15, NR-16, NR-35).

Instruções fundamentais:
1. Responda em português de maneira direta e resumida, privilegiando listas ordenadas ou em tópicos para fatiar o tempo gasto preenchendo relatórios ou PowerPoints.
2. Seja especialista e guie o usuário sobre as funcionalidades do aplicativo:
   - **Gestão de Contratadas e Mobilização**: Diga que o usuário pode pré-cadastrar funcionários de terceiros e anexar ASOs e certificados na aba "SSO/Terceiros" para validação imediata ("Tudo aprovado e tudo beleza!").
   - **Matriz de Treinamento e Exames**: O app avisa automaticamente os vencimentos de ASO ou treinamentos vencendo em menos de 30 dias na aba "SSO/Terceiros", protegendo contra multas trabalhistas.
   - **Inspeções Fotográficas**: Explique que registrar vistorias de campo e checklists agora é 100% digital na aba "Campo" -> "Vistorias", com exportação automática de relatórios formatados em HTML, eliminando totalmente a montagem manual de slides em PowerPoint!
   - **Fluxos de Resposta (Plano de Ação)**: Qualquer não-conformidade (como mato alto ou capina necessária) gera um chamado automático para o dono da área pertinente (como o Mário Pinto). Ao simular o perfil do gestor, ele pode anexar fotos de resolução e responder na própria plataforma.
3. Seja pragmático, prestativo e reforce a cultura de conformidade ESG e segurança (zero acidentes!) no Tegram do Itaqui.
`;

// Helper: fallback responses when API Key is missing or invalid
const getFallbackResponse = (message: string): string => {
  const msgLower = message.toLowerCase();
  
  if (msgLower.includes("terceir") || msgLower.includes("contrata") || msgLower.includes("mobiliz") || msgLower.includes("aso") || msgLower.includes("mário silva")) {
    return "Olá, Evanildo! Nossa Gestão de Terceiros aponta que você pode pré-cadastrar de forma digital os profissionais terceirizados na aba 'SSO/Terceiros'. Se você anexar os envelopes de ASO, Ficha Cadastral e NRs, o validador automático apontará o status como Liberado ('Tudo aprovado e bilesa!'), evitando furos de conformidade ou exames ASO expirados. No momento, o trabalhador Mário Silva possui ASO vencendo em 20 dias.";
  }
  
  if (msgLower.includes("inspe") || msgLower.includes("vistoria") || msgLower.includes("relat") || msgLower.includes("checklist") || msgLower.includes("capina") || msgLower.includes("ppt") || msgLower.includes("powerpoint")) {
    return "Excelente iniciativa, Barros! Eliminamos a montagem manual de relatórios no PowerPoint. Agora, ao conduzir uma Vistoria de Campo na aba 'Campo' -> 'Vistorias', o sistema consolida as fotos e respostas e gera automaticamente um CARD formatado para impressão. Além disso, se você apontar 'Não Conforme' na limpeza/capina, um Plano de Ação é emitido de imediato para o supervisor da área (ex: Mário Pinto), permitindo que ele responda e anexe evidências de resolução na plataforma.";
  }

  if (msgLower.includes("esg") || msgLower.includes("pegada") || msgLower.includes("co2") || msgLower.includes("metas")) {
    return "Olá, Evanildo! Nosso painel ESG aponta que estamos dentro da meta este mês com 42.5 tCO2e (redução de 8% vs mês anterior). Nossa reciclagem está estável em 92% (1.2t orgânicos e 0.4t inertes). Gostaria de exportar o relatório PDF para homologação?";
  }
  if (msgLower.includes("nr") || msgLower.includes("segurança") || msgLower.includes("alerta") || msgLower.includes("acidente")) {
    return "Confirmado, operador Barros. No momento, temos 0 alertas pendentes de NR-15/NR-16. Registramos 14.2 mil horas trabalhadas sem acidentes de trabalho. Mantenha os EPIs regulamentares!";
  }
  if (msgLower.includes("aula") || msgLower.includes("lms") || msgLower.includes("curso")) {
    return "Sua próxima aula presencial de Eletromecânica está agendada para Terça-Festa às 15:30. Seu progresso do módulo de Eletromecânica está em 50%. Quer que eu recapitule os principais materiais das correias transportadoras?";
  }
  if (msgLower.includes("presença") || msgLower.includes("gps") || msgLower.includes("local")) {
    return "Para registrar presença de campo, acesse a aba 'Campo' -> 'Presença GPS' no rodapé. O sistema colherá sua geolocalização NTP segura com margem de 8 metros (Terminal da Ponta da Espera).";
  }
  return "Olá, Evanildo! Estou pronto para auxiliar na coordenação de campo, segurança regulamentar de terceiros e checklists digitais sem PowerPoint. Como posso te apoiar com as correias, moegas, capina de pátio ou mobilização de ASOs hoje?";
};

// API routes FIRST
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const securePassword = process.env.LOGIN_PASSWORD || "tegram2026";
  
  if (password === securePassword) {
    // Map username to realistic human name
    let formattedName = "Evanildo de Jesus Campos Barros";
    if (username !== 'evanildo.barros' && username.includes('.')) {
      const parts = username.split('.');
      formattedName = parts.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') + " (Operador)";
    } else if (username !== 'evanildo.barros') {
      formattedName = username;
    }
    
    return res.json({ success: true, name: formattedName });
  } else {
    return res.status(401).json({ success: false, error: "Senha incorreta. Tente novamente." });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message, chatHistory = [] } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Mensagem é obrigatória." });
  }

  // Attempt to initialize or use Gemini SDK
  const client = initGemini();

  if (!client) {
    // Return simulated AI companion text
    const text = getFallbackResponse(message);
    return res.json({ text, isSimulated: true });
  }

  try {
    // Setup chat thread with system instruction
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: "user", parts: [{ text: FRED_SYSTEM_INSTRUCTION }] },
        ...chatHistory.map((h: any) => ({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        })),
        { role: "user", parts: [{ text: message }] }
      ]
    });

    const reply = response.text || "Sem resposta do modelo.";
    res.json({ text: reply, isSimulated: false });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Graceful fallback and error logging
    const text = getFallbackResponse(message);
    res.json({ text, error: error.message, isSimulated: true });
  }
});

// Serve health status
app.get("/api/health", (req, res) => {
  const useVertexAI = process.env.GOOGLE_GENAI_USE_VERTEXAI === "true";
  const hasProject = !!process.env.GOOGLE_CLOUD_PROJECT;
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  res.json({ 
    status: "ok", 
    aiMode: useVertexAI && hasProject ? "vertex_ai" : hasApiKey ? "api_key" : "fallback",
    geminiConfigured: !!ai 
  });
});

// Configure Vite or Serve static resources based on environment
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Static server mounted in production mode directing to:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TEGRAM OS full-stack server listening at http://0.0.0.0:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Failed to start TEGRAM OS Server:", err);
});
