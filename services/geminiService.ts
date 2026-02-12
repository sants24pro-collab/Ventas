
import { GoogleGenAI } from "@google/genai";
import { Product, Sale } from "../types.ts";

export const getAIInventoryAnalysis = async (products: Product[], sales: Sale[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Como consultor experto en negocios, analiza estos datos:
    PRODUCTOS: ${JSON.stringify(products.map(p => ({ n: p.name, s: p.stock, t: p.minStockThreshold })))}
    VENTAS: ${JSON.stringify(sales.map(s => ({ p: s.productName, q: s.quantity, t: s.totalPrice })))}
    
    Genera un informe ejecutivo breve en JSON con:
    - analysis: Un resumen motivador y perspicaz del estado del negocio.
    - tips: 3 recomendaciones tácticas para maximizar beneficios.
    - alerts: Advertencias sobre productos críticos.
    
    Formato JSON estricto:
    { "analysis": "...", "tips": ["...", "...", "..."], "alerts": ["...", "..."] }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      analysis: "El análisis inteligente no está disponible temporalmente, pero tus datos están seguros.",
      tips: ["Mantén un control diario del stock", "Identifica tus productos más vendidos", "Asegúrate de tener siempre un margen de beneficio saludable"],
      alerts: ["Revisa manualmente los niveles de stock bajo en la pestaña de Inventario"]
    };
  }
};
