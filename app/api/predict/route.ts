import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { NutritionalAnalysis, ApiPredictRequest } from '@/types/nutrition';

export async function POST(req: NextRequest) {
  try {
    const body: ApiPredictRequest = await req.json();
    const {
      image,
      mimeType = 'image/jpeg',
      portionSizeMultiplier = 1.0,
      portionLabel = 'Medium (1.0x)',
      cookingMethod = 'Grilled/Baked',
      mealType = 'Lunch',
      remainingDailyCalories = 2000,
    } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image payload provided.' },
        { status: 400 }
      );
    }

    // Read API key from x-gemini-key header or server env variable
    const customApiKey = req.headers.get('x-gemini-key');
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Gemini API key is missing. Please configure GEMINI_API_KEY in .env.local or enter a custom key in settings.',
        },
        { status: 401 }
      );
    }

    // Initialize Official @google/genai SDK
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    const promptText = `Act as an expert AI nutritionist. Analyze the food or meal in the provided image.

USER SPECIFIED MEAL CONTEXT & PREPARATION:
- Portion Size: ${portionLabel} (${portionSizeMultiplier}x portion factor)
- Cooking / Preparation Method: ${cookingMethod}
- Meal Context: ${mealType}

DAILY CALORIE BUDGET CONTEXT:
The user has ${remainingDailyCalories} kcal left today. If this meal exceeds or takes up more than 50% of their remaining budget, generate 2-3 healthier, lower-calorie alternatives for this exact dish that maintain similar taste/protein profiles.

IMPORTANT GUIDELINES:
1. Identify the primary dish in "food_name".
2. Adjust total_calories, protein_g, carbs_g, fat_g, and ingredient breakdown accordingly:
   - The user indicates this meal was prepared via ${cookingMethod} and is a ${portionLabel} portion (${portionSizeMultiplier}x multiplier).
   - Higher portion sizes or deep-fried methods significantly increase total calories and fat estimates.
3. Breakdown the dish into individual food components or ingredients in the "items" array. For each item, specify its name, estimated portion/weight (e.g. "150g" or "1 cup"), and individual calories.
4. If this meal exceeds or takes up more than 50% of the user's remaining budget (${remainingDailyCalories} kcal), generate 2-3 healthier, lower-calorie alternatives for this exact dish that maintain similar taste/protein profiles in the "alternatives" array. Otherwise return an empty array for "alternatives". For each alternative, specify "name", "calories", "caloriesSaved" (difference between original dish total_calories and alternative calories), and "swapReason".
5. If the image is NOT edible food or drink, set "food_name" to "Non-Food Item Detected", set all nutrient values to 0, confidence_score to "Low", items to empty array, alternatives to empty array, and explain in health_tip.
6. Return ONLY a strict JSON object matching the schema.`;

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
              description: 'Estimated total calories in kcal adjusted for portion and cooking method',
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
              description: 'Nutritional advice or health tip tailored to cooking method',
            },
            items: {
              type: Type.ARRAY,
              description: 'Itemized breakdown of food components/ingredients',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'Ingredient/item name' },
                  portion: { type: Type.STRING, description: 'Portion or weight (e.g. 150g)' },
                  calories: { type: Type.NUMBER, description: 'Individual item calories' },
                },
                required: ['name', 'portion', 'calories'],
              },
            },
            alternatives: {
              type: Type.ARRAY,
              description: 'Healthier, lower-calorie alternatives if meal exceeds or takes up >50% of remaining budget',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'Name of the alternative dish' },
                  calories: { type: Type.NUMBER, description: 'Estimated calories for alternative dish' },
                  caloriesSaved: { type: Type.NUMBER, description: 'Calorie savings compared to original dish' },
                  swapReason: { type: Type.STRING, description: 'Explanation for why this is a good healthier swap' },
                },
                required: ['name', 'calories', 'caloriesSaved', 'swapReason'],
              },
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
            'items',
            'alternatives',
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      return NextResponse.json(
        { success: false, error: 'Empty response from Gemini API.' },
        { status: 500 }
      );
    }

    let parsedData: NutritionalAnalysis;
    try {
      parsedData = JSON.parse(responseText);
      parsedData.portionSizeMultiplier = portionSizeMultiplier;
      parsedData.portionLabel = portionLabel;
      parsedData.cookingMethod = cookingMethod;
      parsedData.mealType = mealType;
    } catch (parseError) {
      console.error('Failed to parse Gemini response JSON:', responseText, parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON response from AI model.' },
        { status: 500 }
      );
    }

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
            'Invalid Gemini API Key. Please check your Google AI Studio key in settings.',
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
        error: errorMessage || 'An unexpected error occurred during analysis.',
      },
      { status: 500 }
    );
  }
}
