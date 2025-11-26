export const callGemini = async (prompt, systemInstruction = "") => {
  const apiKey = ""; // La clave se inyecta automáticamente en el entorno
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      }
    );
    
    if (!response.ok) {
      throw new Error('Error en la respuesta de Gemini');
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude procesar eso.";
  } catch (error) {
    console.error("Error llamando a Gemini:", error);
    return "Tuve un pequeño problema de conexión. ¿Podrías intentarlo de nuevo?";
  }
};
