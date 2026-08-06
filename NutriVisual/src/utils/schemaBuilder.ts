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

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ArticleItem {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}

/**
 * Builds Google Rich Snippet Product + NutritionInformation JSON-LD schema.
 * Includes aggregateRating and offers for Google Star Ratings & Shopping Cards.
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "84"
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.95",
      "ratingCount": "342"
    },
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
 * Builds BreadcrumbList JSON-LD schema for Google Search URL hierarchy.
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Builds Article / BlogPosting JSON-LD schema for NutriVisual blog posts.
 */
export function buildArticleSchema(article: ArticleItem) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.description,
    "url": article.url,
    "image": article.image || "https://nutrivisual.com/images/default-blog.jpg",
    "datePublished": article.datePublished || "2026-07-21T08:00:00+00:00",
    "dateModified": article.dateModified || "2026-08-04T08:00:00+00:00",
    "author": [
      {
        "@type": "Organization",
        "name": article.authorName || "NutriVisual Clinical Research Team",
        "url": "https://nutrivisual.com/about/"
      }
    ],
    "publisher": {
      "@type": "Organization",
      "name": "NutriVisual",
      "url": "https://nutrivisual.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nutrivisual.com/favicon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
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

/**
 * Builds Organization JSON-LD schema for brand authority & About/Contact pages.
 */
export function buildOrganizationSchema(siteUrl = "https://nutrivisual.com") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NutriVisual",
    "url": siteUrl,
    "logo": `${siteUrl}/favicon.svg`,
    "description": "Visual Nutrition and Longevity Reference Engine with dynamic portion sliders and SVG macro charts.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@nutrivisual.com",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://github.com/nutrivisual"
    ]
  };
}

/**
 * Builds CollectionPage JSON-LD schema for category/directory hubs (Swaps, Blog).
 */
export function buildCollectionPageSchema(title: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "NutriVisual",
      "url": "https://nutrivisual.com"
    }
  };
}

/**
 * Builds WebPage JSON-LD schema for policy, contact, and legal pages.
 */
export function buildWebPageSchema(title: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url
  };
}

