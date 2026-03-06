const { GoogleGenAI } = require('@google/genai');

console.log("OCR Service Loaded / Refreshing ENV");

/**
 * @param {Buffer} imageBuffer - The uploaded image buffer
 * @param {String} mimeType - The mimeType of the uploaded image
 * @returns {Promise<Array>} - Array of parsed menu items {name, price}
 */
const parseMenuFromImage = async (imageBuffer, mimeType = 'image/jpeg') => {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
            throw new Error('Valid GEMINI_API_KEY is missing in the .env file');
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Convert buffer to base64
        const base64Image = imageBuffer.toString('base64');

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    parts: [
                        { text: "Extract exactly all the menu items and their prices from this image. Return the result strictly as a valid JSON array of objects, where each object has a 'name' (string) and a 'price' (number). Do not include any other text, markdown formatting, or explanations. Only output the JSON." },
                        { inlineData: { mimeType: mimeType, data: base64Image } }
                    ]
                }
            ]
        });

        // The response text should be JSON, but we clean it just in case
        let text = response.text;
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const menuItems = JSON.parse(text);
            return menuItems;
        } catch (e) {
            console.error("Failed to parse Gemini response as JSON:", text);
            throw new Error("Failed to parse menu items from AI");
        }
    } catch (error) {
        console.error('Error during AI Menu parsing:', error);
        throw error;
    }
};

module.exports = { parseMenuFromImage };
