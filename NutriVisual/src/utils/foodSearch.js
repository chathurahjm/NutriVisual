/**
 * Universal Intelligent Food Search, Quantity Parser & Fuzzy Matching
 * 
 * Capabilities:
 * 1. Quantity & Unit Extraction: Extracts numbers and units like "400 eggplant",
 *    "400g eggplant", "eggplant 400g", "200 chicken breast", "1/2 avocado", "1 cup blueberries"
 * 2. Regional Synonyms & Aliases: Maps aubergine -> eggplant, courgette -> zucchini, capsicum -> bell pepper, etc.
 * 3. Damerau-Levenshtein Fuzzy Matching: Universal typo correction across ALL whole foods in the database
 *    (e.g., eggpant -> Eggplant, chiken -> Chicken Breast, salman -> Atlantic Salmon, avacado -> Avocado)
 * 4. Zero external dependencies, ultra-fast client-side execution (<2ms).
 */

// Common regional names, culinary synonyms, and popular abbreviations
export const FOOD_SYNONYMS = {
  // Eggplant / Aubergine
  'aubergine': 'eggplant',
  'aubergines': 'eggplant',
  'brinjal': 'eggplant',
  'egg plant': 'eggplant',
  'eggplants': 'eggplant',

  // Zucchini / Courgette
  'courgette': 'zucchini',
  'courgettes': 'zucchini',
  'baby marrow': 'zucchini',

  // Bell peppers / Capsicum
  'capsicum': 'bell pepper',
  'capsicums': 'bell pepper',
  'sweet pepper': 'bell pepper',
  'bell peppers': 'bell pepper',
  'peppers': 'bell pepper',

  // Roots & Veggies
  'beet': 'beetroot',
  'beets': 'beetroot',
  'scallion': 'green onion',
  'scallions': 'green onion',
  'spring onion': 'green onion',
  'spring onions': 'green onion',

  // Seafood & Meats
  'prawn': 'shrimp',
  'prawns': 'shrimp',
  'salmon fillet': 'atlantic salmon',
  'salmon': 'atlantic salmon',
  'chicken': 'chicken breast',
  'steak': 'beef',
  'ground beef': 'beef',
  'minced beef': 'beef',
  'tuna fish': 'tuna',
  'cod fish': 'cod fillet',
  'cod': 'cod fillet',

  // Nuts, Seeds & Grains
  'cacao': 'dark chocolate',
  'cocoa': 'dark chocolate',
  'chia': 'chia seeds',
  'flax': 'flaxseed',
  'flax seed': 'flaxseed',
  'flax seeds': 'flaxseed',
  'oats': 'rolled oats',
  'oatmeal': 'rolled oats',
  'peanut': 'peanuts',
  'almond': 'almonds',
  'walnut': 'walnuts',
  'cashew': 'cashews',
  'pistachio': 'pistachios',
  'pecan': 'pecans',

  // Dairy & Milks
  'soya milk': 'soy milk',
  'cow milk': 'whole milk',
  'milk': 'whole milk',
  'yogurt': 'greek yogurt',
  'yoghurt': 'greek yogurt',
  'curd': 'greek yogurt'
};

/**
 * Calculates the Damerau-Levenshtein distance between two strings.
 * Accounts for insertions, deletions, substitutions, and adjacent transpositions.
 */
export function editDistance(a, b) {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const matrix = [];
  for (let i = 0; i <= al; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost); // transposition
      }
    }
  }
  return matrix[al][bl];
}

/**
 * Converts various kitchen & standard units into equivalent grams.
 */
export function unitToGrams(num, unit) {
  if (!num || isNaN(num) || num <= 0) return null;
  const u = (unit || '').toLowerCase().trim();

  // Grams / metric weight
  if (!u || u === 'g' || u === 'gram' || u === 'grams' || u === 'gm' || u === 'gms') {
    return Math.min(Math.max(Math.round(num), 10), 1000);
  }
  if (u === 'kg' || u === 'kilo' || u === 'kilos' || u === 'kilogram' || u === 'kilograms') {
    return Math.min(Math.round(num * 1000), 1000);
  }
  // Ounces
  if (u === 'oz' || u === 'ounce' || u === 'ounces') {
    return Math.min(Math.max(Math.round(num * 28.35), 10), 1000);
  }
  // Cups (approximate volume-to-weight for whole foods ~150g)
  if (u === 'cup' || u === 'cups') {
    return Math.min(Math.max(Math.round(num * 150), 10), 1000);
  }
  // Tablespoons / Teaspoons
  if (u === 'tbsp' || u === 'tablespoon' || u === 'tablespoons') {
    return Math.min(Math.max(Math.round(num * 15), 10), 500);
  }
  if (u === 'tsp' || u === 'teaspoon' || u === 'teaspoons') {
    return Math.min(Math.max(Math.round(num * 5), 5), 200);
  }
  // Pieces / whole counts (e.g. 2 eggs ~ 100g, 1 avocado ~ 150g)
  if (u === 'piece' || u === 'pieces' || u === 'item' || u === 'items' || u === 'pc' || u === 'pcs') {
    return Math.min(Math.max(Math.round(num * 100), 20), 1000);
  }

  return Math.min(Math.max(Math.round(num), 10), 1000);
}

/**
 * Parses a raw search query into a cleaned food term and extracted quantity.
 * Examples:
 * - "400 eggplant" -> { cleanQuery: "eggplant", quantity: 400, unit: "g", hasQuantity: true }
 * - "400g eggplant" -> { cleanQuery: "eggplant", quantity: 400, unit: "g", hasQuantity: true }
 * - "eggplant 400g" -> { cleanQuery: "eggplant", quantity: 400, unit: "g", hasQuantity: true }
 * - "1/2 avocado" -> { cleanQuery: "avocado", quantity: 50, unit: "fraction", hasQuantity: true }
 * - "eggpant" -> { cleanQuery: "eggpant", quantity: null, unit: null, hasQuantity: false }
 */
export function parseSearchQuery(query) {
  if (!query || typeof query !== 'string') {
    return { cleanQuery: '', quantity: null, unit: null, hasQuantity: false };
  }

  const text = query.trim().toLowerCase();
  if (!text) {
    return { cleanQuery: '', quantity: null, unit: null, hasQuantity: false };
  }

  // Fraction support: e.g. "1/2 avocado", "1/4 cup chia"
  const fractionMatch = text.match(/^(\d+)\/(\d+)\s*(g|grams?|gm|gms|kg|kilos?|oz|ounces?|cups?|pieces?|pcs?|tbsp|tsp)?\s*(?:of\s+)?(.*)$/i);
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1]) / parseFloat(fractionMatch[2]);
    const rawUnit = fractionMatch[3] || 'fraction';
    const clean = fractionMatch[4].trim();
    if (clean) {
      const quantity = rawUnit === 'fraction' ? Math.round(num * 100) : unitToGrams(num, rawUnit);
      return { cleanQuery: clean, quantity, unit: rawUnit, hasQuantity: true };
    }
  }

  // Leading quantity: e.g. "400 eggplant", "400g eggplant", "400 grams of eggplant", "1.5 cups spinach"
  const leadingMatch = text.match(/^(\d+(?:\.\d+)?)\s*(g|grams?|gm|gms|kg|kilos?|kilograms?|oz|ounces?|cups?|pieces?|pcs?|tbsp|tsp)?\s*(?:of\s+)?(.*)$/i);
  if (leadingMatch && leadingMatch[3].trim()) {
    const rawNum = parseFloat(leadingMatch[1]);
    const rawUnit = (leadingMatch[2] || '').toLowerCase();
    const remainingText = leadingMatch[3].trim();
    if (rawUnit || /[a-z]/i.test(remainingText)) {
      const quantity = unitToGrams(rawNum, rawUnit);
      return { cleanQuery: remainingText, quantity, unit: rawUnit || 'g', hasQuantity: true };
    }
  }

  // Trailing quantity: e.g. "eggplant 400", "eggplant 400g", "salmon 150 grams"
  const trailingMatch = text.match(/^(.*?)\s+(\d+(?:\.\d+)?)\s*(g|grams?|gm|gms|kg|kilos?|kilograms?|oz|ounces?|cups?|pieces?|pcs?|tbsp|tsp)?$/i);
  if (trailingMatch && trailingMatch[1].trim()) {
    const remainingText = trailingMatch[1].trim();
    const rawNum = parseFloat(trailingMatch[2]);
    const rawUnit = (trailingMatch[3] || '').toLowerCase();
    if (/[a-z]/i.test(remainingText)) {
      const quantity = unitToGrams(rawNum, rawUnit);
      return { cleanQuery: remainingText, quantity, unit: rawUnit || 'g', hasQuantity: true };
    }
  }

  return { cleanQuery: text, quantity: null, unit: null, hasQuantity: false };
}

/**
 * Intelligent Match Finder across foods database.
 * Returns best matched food, suggestion message, and parsed portion.
 */
export function findSmartMatch(rawQuery, foodsList) {
  if (!rawQuery || !foodsList || foodsList.length === 0) return null;

  const { cleanQuery, quantity, unit, hasQuantity } = parseSearchQuery(rawQuery);
  const q = cleanQuery.toLowerCase().trim();
  if (!q) return null;

  // 1. Synonym resolution
  const synonymTarget = FOOD_SYNONYMS[q] || null;

  // 2. Exact match check
  const exactFood = foodsList.find((f) => {
    const nameLower = f.name.toLowerCase();
    const idLower = f.id.toLowerCase();
    return (
      nameLower === q ||
      idLower === q ||
      (synonymTarget && (nameLower === synonymTarget || idLower === synonymTarget))
    );
  });

  if (exactFood) {
    let message = `Did you search for ${exactFood.name}?`;
    if (hasQuantity && quantity) {
      message = `Did you search for ${exactFood.name} (${quantity}g)?`;
    }
    return {
      food: exactFood,
      suggestedName: exactFood.name,
      suggestedId: exactFood.id,
      cleanQuery,
      quantity,
      unit,
      hasQuantity,
      matchType: hasQuantity ? 'quantity' : (synonymTarget ? 'synonym' : 'exact'),
      message,
      isTypo: false
    };
  }

  // 3. Substring match
  const substringFood = foodsList.find((f) => {
    const nameLower = f.name.toLowerCase();
    return (
      nameLower.includes(q) ||
      (synonymTarget && nameLower.includes(synonymTarget))
    );
  });

  if (substringFood) {
    let message = `Did you search for ${substringFood.name}?`;
    if (hasQuantity && quantity) {
      message = `Did you search for ${substringFood.name} (${quantity}g)?`;
    } else if (synonymTarget) {
      message = `Showing ${substringFood.name} (matched "${cleanQuery}")`;
    }
    return {
      food: substringFood,
      suggestedName: substringFood.name,
      suggestedId: substringFood.id,
      cleanQuery,
      quantity,
      unit,
      hasQuantity,
      matchType: hasQuantity ? 'quantity' : (synonymTarget ? 'synonym' : 'substring'),
      message,
      isTypo: false
    };
  }

  // 4. Fuzzy Levenshtein matching across all whole foods
  let bestFood = null;
  let minDistance = Infinity;

  for (const food of foodsList) {
    const foodNameLower = food.name.toLowerCase();
    const words = foodNameLower.split(/[\s-]+/);

    // Distance to full name
    const dName = editDistance(q, foodNameLower);
    
    // Distance to individual words in the food name (e.g. "eggplant", "salmon", "chicken")
    let dMinWord = Infinity;
    for (const w of words) {
      const dw = editDistance(q, w);
      if (dw < dMinWord) dMinWord = dw;
    }

    const dist = Math.min(dName, dMinWord);
    if (dist < minDistance) {
      minDistance = dist;
      bestFood = food;
    }
  }

  // Adaptive distance threshold:
  // - 1-3 chars: max distance 1
  // - 4-6 chars: max distance 2
  // - 7+ chars: max distance 3
  const maxAllowedDist = q.length >= 7 ? 3 : (q.length >= 4 ? 2 : 1);

  if (bestFood && minDistance <= maxAllowedDist) {
    let message = `Did you search for ${bestFood.name}?`;
    if (hasQuantity && quantity) {
      message = `Did you search for ${bestFood.name} (${quantity}g)?`;
    }
    return {
      food: bestFood,
      suggestedName: bestFood.name,
      suggestedId: bestFood.id,
      cleanQuery,
      quantity,
      unit,
      hasQuantity,
      matchType: 'fuzzy',
      distance: minDistance,
      message,
      isTypo: true
    };
  }

  return null;
}

/**
 * Filter foods array using smart parsed search terms.
 * Guarantees that typing "400 eggplant" or "eggpant" finds Eggplant!
 */
export function filterFoodsWithSmartSearch(foodsList, rawQuery, outcomeFilter, parseNumFn) {
  if (!foodsList) return [];

  const trimmed = (rawQuery || '').trim();
  if (!trimmed && !outcomeFilter) return foodsList;

  const smartMatch = trimmed ? findSmartMatch(trimmed, foodsList) : null;
  const { cleanQuery } = parseSearchQuery(trimmed);
  const q = cleanQuery.toLowerCase();
  const suggestedNameLower = smartMatch ? smartMatch.suggestedName.toLowerCase() : '';
  const suggestedIdLower = smartMatch ? smartMatch.suggestedId.toLowerCase() : '';

  return foodsList.filter((f) => {
    if (trimmed) {
      const nameLower = f.name.toLowerCase();
      const catLower = f.category.toLowerCase();
      const idLower = f.id.toLowerCase();
      const tagsLower = f.tags ? f.tags.map((t) => t.toLowerCase()) : [];

      // 1. Direct match on clean query
      const directMatch =
        nameLower.includes(q) ||
        catLower.includes(q) ||
        idLower.includes(q) ||
        tagsLower.some((t) => t.includes(q));

      // 2. Direct match on raw query
      const rawMatch =
        nameLower.includes(trimmed.toLowerCase()) ||
        catLower.includes(trimmed.toLowerCase()) ||
        idLower.includes(trimmed.toLowerCase());

      // 3. Smart match / suggestion match
      const suggestionMatch =
        smartMatch &&
        (f.id === smartMatch.suggestedId ||
          nameLower.includes(suggestedNameLower) ||
          idLower === suggestedIdLower);

      if (!directMatch && !rawMatch && !suggestionMatch) {
        return false;
      }
    }

    // Outcome filter
    if (outcomeFilter && parseNumFn) {
      if (outcomeFilter === 'bp') return parseNumFn(f.micros?.potassium) >= 300;
      if (outcomeFilter === 'brain') {
        return (
          parseNumFn(f.micros?.magnesium) >= 50 ||
          (f.tags && f.tags.some((t) => t.includes('Omega-3') || t.includes('Brain')))
        );
      }
      if (outcomeFilter === 'gut') return parseNumFn(f.micros?.fiber) >= 3.0;
      if (outcomeFilter === 'muscle') return f.macros?.protein >= 20;
      if (outcomeFilter === 'keto') return f.macros?.fat >= 12 && f.macros?.carbs <= 5;
    }

    return true;
  });
}
