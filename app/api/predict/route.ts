import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { NutritionalAnalysis } from '@/types/nutrition';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, mimeType = 'image/jpeg' } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image data provided in payload.' },
        { status: 400 }
      );
    }

    // Read API key from x-gemini-key header or server environment variable
    const customApiKey = req.headers.get('x-gemini-key');
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Gemini API key is missing or unconfigured. Please configure GEMINI_API_KEY in .env.local or enter a custom key in settings.',
        },
        { status: 401 }
      );
    }

    // Initialize Official @google/genai SDK
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    const promptText = `Act as an expert nutritionist. Analyze the food or meal in the provided image.

Provide a realistic, accurate estimate of its nutritional values for a typical serving.

IMPORTANT GUIDELINES:
1. Identify the primary dish or food items clearly in "food_name".
2. If the image is NOT food, drinks, or an edible meal, set "food_name" to "Non-Food Item Detected", set all nutrient values (total_calories, protein_g, carbs_g, fat_g) to 0, set "confidence_score" to "Low", and explain in "health_tip" that the uploaded photo does not appear to contain food.
3. Return ONLY a strict JSON object matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: image,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            food_name: {
              type: Type.STRING,
              description: 'Name of the recognized dish or food items',
            },
            total_calories: {
              type: Type.NUMBER,
              description: 'Estimated total calories in kcal',
            },
            protein_g: {
              type: Type.NUMBER,
              description: 'Estimated protein in grams',
            },
            carbs_g: {
              type: Type.NUMBER,
              description: 'Estimated carbohydrates in grams',
            },
            fat_g: {
              type: Type.NUMBER,
              description: 'Estimated total fat in grams',
            },
            confidence_score: {
              type: Type.STRING,
              description: 'Confidence rating: High, Medium, or Low',
            },
            health_tip: {
              type: Type.STRING,
              description: 'Dietary insight, health recommendation, or advice',
            },
          },
          required: [
            'food_name',
            'total_calories',
            'protein_g',
            'carbs_g',
            'fat_g',
            'confidence_score',
            'health_tip',
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      return NextResponse.json(
        { success: false, error: 'Empty response received from Gemini API model.' },
        { status: 500 }
      );
    }

    // Parse JSON output
    let parsedData: NutritionalAnalysis;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response JSON:', responseText, parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON response received from AI model.' },
        { status: 500 }
      );
    }

    // Check if non-food item
    const isNonFood =
      parsedData.food_name.toLowerCase().includes('non-food') ||
      (parsedData.total_calories === 0 &&
        parsedData.protein_g === 0 &&
        parsedData.carbs_g === 0 &&
        parsedData.fat_g === 0);

    return NextResponse.json({
      success: true,
      data: parsedData,
      isNonFood,
    });
  } catch (error: any) {
    console.error('Error in /api/predict route:', error);

    const errorMessage = error?.message || String(error);

    // Handle common API key & quota errors
    if (
      errorMessage.includes('API_KEY_INVALID') ||
      errorMessage.includes('API key not valid') ||
      errorMessage.includes('401') ||
      errorMessage.includes('403')
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid Gemini API Key. Please check your Google AI Studio key and try again.',
        },
        { status: 401 }
      );
    }

    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gemini API quota exceeded or rate limited. Please try again in a moment.',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage || 'An unexpected error occurred during image analysis.',
      },
      { status: 500 }
    );
  }
}
