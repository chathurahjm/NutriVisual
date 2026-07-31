/**
 * NutriVisual Schema Builder Utility
 * Provides Google-compliant Rich Snippet JSON-LD structured data generators
 * for Recipe, NutritionInformation, WebApplication, FAQPage, and HowTo schemas.
 */

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  image?: string;
  calories: number;
  servingBaseGrams: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
  micronutrients?: Record<string, string | number>;
  benefits?: string[];
  description?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

export interface RecipeItem {
  name: string;
  description: string;
  image: string[];
  recipeCategory?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string;
  ingredients: string[];
  instructions: { name: string; text: string }[];
  food: FoodItem;
}

/**
 * Builds Google Rich Snippet Product + NutritionInformation JSON-LD schema.
 */
export function buildNutritionProductSchema(food: FoodItem, pageUrl: string) {
  const description = food.description || 
    `${food.name} nutrition profile: ${food.calories} kcal, ${food.macros.protein}g protein, ${food.macros.fat}g fat per ${food.servingBaseGrams}g serving.`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": food.name,
    "image": food.image ? [food.image] : ["https://nutrivisual.com/images/default-food.jpg"],
    "description": description,
    "category": food.category || "Nutrition",
    "url": pageUrl,
    "brand": {
      "@type": "Brand",
      "name": "NutriVisual"
    },
    "nutrition": {
      "@type": "NutritionInformation",
      "servingSize": `${food.servingBaseGrams} grams`,
      "calories": `${food.calories} calories`,
      "fatContent": `${food.macros.fat} g`,
      "carbohydrateContent": `${food.macros.carbs} g`,
      "proteinContent": `${food.macros.protein} g`,
      ...(food.macros.fiber !== undefined && { "fiberContent": `${food.macros.fiber} g` }),
      ...(food.macros.sugar !== undefined && { "sugarContent": `${food.macros.sugar} g` })
    }
  };
}

/**
 * Builds Recipe + NutritionInformation JSON-LD schema.
 */
export function buildRecipeSchema(recipe: RecipeItem) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipe.name,
    "image": recipe.image,
    "description": recipe.description,
    "recipeCategory": recipe.recipeCategory || "Healthy Meal",
    "prepTime": recipe.prepTime || "PT10M",
    "cookTime": recipe.cookTime || "PT15M",
    "totalTime": recipe.totalTime || "PT25M",
    "recipeYield": recipe.recipeYield || "1 serving",
    "recipeIngredient": recipe.ingredients,
    "recipeInstructions": recipe.instructions.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": step.name,
      "text": step.text
    })),
    "author": {
      "@type": "Organization",
      "name": "NutriVisual",
      "url": "https://nutrivisual.com"
    },
    "nutrition": {
      "@type": "NutritionInformation",
      "servingSize": `${recipe.food.servingBaseGrams} grams`,
      "calories": `${recipe.food.calories} calories`,
      "fatContent": `${recipe.food.macros.fat} g`,
      "carbohydrateContent": `${recipe.food.macros.carbs} g`,
      "proteinContent": `${recipe.food.macros.protein} g`,
      ...(recipe.food.macros.fiber !== undefined && { "fiberContent": `${recipe.food.macros.fiber} g` }),
      ...(recipe.food.macros.sugar !== undefined && { "sugarContent": `${recipe.food.macros.sugar} g` })
    }
  };
}

/**
 * Builds WebApplication JSON-LD schema for site branding & software metadata.
 */
export function buildWebApplicationSchema(siteUrl = "https://nutrivisual.com") {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "NutriVisual",
    "url": siteUrl,
    "description": "Visual Nutrition and Longevity Reference Engine with dynamic portion sliders and SVG macro charts.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "NutriVisual",
      "url": siteUrl
    }
  };
}

/**
 * Builds FAQPage JSON-LD schema for rich FAQ snippets in search results.
 */
export function buildFAQPageSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Builds HowTo JSON-LD schema for step-by-step guides (e.g. food portion comparisons).
 */
export function buildHowToSchema(title: string, description: string, steps: HowToStep[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.url && { "url": step.url }),
      ...(step.image && { "image": step.image })
    }))
  };
}
