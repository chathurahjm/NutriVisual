import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const foodsFilePath = path.resolve(__dirname, '../src/data/foods.json');
const currentFoods = JSON.parse(fs.readFileSync(foodsFilePath, 'utf8'));

console.log(`Current foods in database: ${currentFoods.length}`);

export const new50Foods = [
  // --- FRUITS (12) ---
  {
    "id": "banana",
    "name": "Banana",
    "category": "Fruits",
    "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 89,
    "macros": { "fat": 0.3, "carbs": 22.8, "protein": 1.1 },
    "micros": { "potassium": "358 mg", "magnesium": "27 mg", "fiber": "2.6 g" },
    "benefits": ["Rapid Glycogen Replenishment", "Heart & Electrolyte Balance", "Digestive Motility Support"],
    "tags": ["High Potassium", "Pre-Workout Fuel", "Whole Food Carb"]
  },
  {
    "id": "apple",
    "name": "Apple",
    "category": "Fruits",
    "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 52,
    "macros": { "fat": 0.2, "carbs": 13.8, "protein": 0.3 },
    "micros": { "potassium": "107 mg", "magnesium": "5 mg", "fiber": "2.4 g" },
    "benefits": ["Pectin Prebiotic Fiber", "Quercetin Cellular Antioxidant", "Postprandial Glycemic Stability"],
    "tags": ["Gut Health", "High Fiber", "Low Calorie"]
  },
  {
    "id": "orange",
    "name": "Orange",
    "category": "Fruits",
    "image": "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 47,
    "macros": { "fat": 0.1, "carbs": 11.8, "protein": 0.9 },
    "micros": { "potassium": "181 mg", "magnesium": "10 mg", "fiber": "2.4 g" },
    "benefits": ["Immune Defense Vitamin C", "Hesperidin Vascular Support", "Cellular Hydration Balance"],
    "tags": ["Vitamin C", "Citrus Bioflavonoids", "Hydration"]
  },
  {
    "id": "strawberries",
    "name": "Strawberries",
    "category": "Fruits",
    "image": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 32,
    "macros": { "fat": 0.3, "carbs": 7.7, "protein": 0.7 },
    "micros": { "potassium": "153 mg", "magnesium": "13 mg", "fiber": "2.0 g" },
    "benefits": ["Pelargonidin Anthocyanin Defense", "Ultra Low Glycemic Impact", "Endothelial Function Optimization"],
    "tags": ["Low Calorie", "Antioxidant Rich", "Keto Friendly"]
  },
  {
    "id": "watermelon",
    "name": "Watermelon",
    "category": "Fruits",
    "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 30,
    "macros": { "fat": 0.2, "carbs": 7.6, "protein": 0.6 },
    "micros": { "potassium": "112 mg", "magnesium": "10 mg", "fiber": "0.4 g" },
    "benefits": ["L-Citrulline Nitric Oxide Boost", "92% Cellular Hydration Fluid", "Lycopene Free Radical Shield"],
    "tags": ["High Hydration", "Blood Flow", "Post-Workout"]
  },
  {
    "id": "mango",
    "name": "Mango",
    "category": "Fruits",
    "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 60,
    "macros": { "fat": 0.4, "carbs": 15.0, "protein": 0.8 },
    "micros": { "potassium": "168 mg", "magnesium": "10 mg", "fiber": "1.6 g" },
    "benefits": ["Mangiferin Super-Antioxidant", "Natural Amylase Digestive Enzymes", "Beta-Carotene Vision Defense"],
    "tags": ["Tropical Fruit", "Vitamin A", "Digestive Support"]
  },
  {
    "id": "kiwi",
    "name": "Kiwi",
    "category": "Fruits",
    "image": "https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 61,
    "macros": { "fat": 0.5, "carbs": 14.7, "protein": 1.1 },
    "micros": { "potassium": "312 mg", "magnesium": "17 mg", "fiber": "3.0 g" },
    "benefits": ["Actinidin Proteolytic Enzyme", "Double RDA Vitamin C & E", "Natural Serotonin Sleep Induction"],
    "tags": ["High Vitamin C", "Gut Motility", "Sleep Support"]
  },
  {
    "id": "papaya",
    "name": "Papaya",
    "category": "Fruits",
    "image": "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 43,
    "macros": { "fat": 0.3, "carbs": 10.8, "protein": 0.5 },
    "micros": { "potassium": "182 mg", "magnesium": "21 mg", "fiber": "1.7 g" },
    "benefits": ["Papain Protein Assimilation", "High Bioavailability Lycopene", "Gastrointestinal Mucosa Soothing"],
    "tags": ["Digestive Enzymes", "Anti-Inflammatory", "Low Calorie"]
  },
  {
    "id": "pineapple",
    "name": "Pineapple",
    "category": "Fruits",
    "image": "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 50,
    "macros": { "fat": 0.1, "carbs": 13.1, "protein": 0.5 },
    "micros": { "potassium": "109 mg", "magnesium": "12 mg", "fiber": "1.4 g" },
    "benefits": ["Bromelain Systemic Enzyme Action", "Post-Exercise Soreness Reduction", "Manganese Superoxide Dismutase"],
    "tags": ["Bromelain", "Anti-Inflammatory", "Tropical"]
  },
  {
    "id": "grapes",
    "name": "Red Grapes",
    "category": "Fruits",
    "image": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 69,
    "macros": { "fat": 0.2, "carbs": 18.1, "protein": 0.7 },
    "micros": { "potassium": "191 mg", "magnesium": "7 mg", "fiber": "0.9 g" },
    "benefits": ["Skin Resveratrol Sirtuin Activation", "Vascular Endothelial Flexibility", "Microcirculatory Blood Flow"],
    "tags": ["Resveratrol", "Cardiovascular", "Natural Energy"]
  },
  {
    "id": "cherries",
    "name": "Sweet Cherries",
    "category": "Fruits",
    "image": "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 63,
    "macros": { "fat": 0.2, "carbs": 16.0, "protein": 1.1 },
    "micros": { "potassium": "222 mg", "magnesium": "11 mg", "fiber": "2.1 g" },
    "benefits": ["Endogenous Melatonin Support", "Plasma Uric Acid Reduction", "Delayed Onset Muscle Soreness (DOMS) Relief"],
    "tags": ["Sleep Support", "Joint Health", "Post-Workout"]
  },
  {
    "id": "grapefruit",
    "name": "Pink Grapefruit",
    "category": "Fruits",
    "image": "https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 42,
    "macros": { "fat": 0.1, "carbs": 10.7, "protein": 0.8 },
    "micros": { "potassium": "135 mg", "magnesium": "9 mg", "fiber": "1.6 g" },
    "benefits": ["Naringenin Insulin Sensitizer", "AMPK Pathway Stimulation", "Metabolic Thermogenesis Support"],
    "tags": ["Metabolism", "Low Glycemic", "Citrus"]
  },

  // --- VEGETABLES & GREENS (10) ---
  {
    "id": "cucumber",
    "name": "Cucumber",
    "category": "Vegetables",
    "image": "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 15,
    "macros": { "fat": 0.1, "carbs": 3.6, "protein": 0.7 },
    "micros": { "potassium": "147 mg", "magnesium": "13 mg", "fiber": "0.5 g" },
    "benefits": ["Bioactive Silica for Connective Tissue", "Cucurbitacin Anti-Inflammatory Response", "Ultra Low Calorie Hydration Load"],
    "tags": ["Ultra Low Calorie", "Hydration", "Keto Friendly"]
  },
  {
    "id": "green-peas",
    "name": "Green Peas",
    "category": "Vegetables",
    "image": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 84,
    "macros": { "fat": 0.2, "carbs": 15.6, "protein": 5.4 },
    "micros": { "potassium": "271 mg", "magnesium": "36 mg", "fiber": "5.5 g" },
    "benefits": ["Highest Vegetable Protein Density", "Prebiotic Fermentable Fiber", "Satiety Hormone (GLP-1) Support"],
    "tags": ["Plant Protein", "High Fiber", "Microbiome"]
  },
  {
    "id": "celery",
    "name": "Celery",
    "category": "Vegetables",
    "image": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 16,
    "macros": { "fat": 0.2, "carbs": 3.0, "protein": 0.7 },
    "micros": { "potassium": "260 mg", "magnesium": "11 mg", "fiber": "1.6 g" },
    "benefits": ["3-n-Butylphthalide Arterial Wall Relaxation", "Natural Balanced Electrolyte Water", "Apigenin Neuroprotective Flavonoid"],
    "tags": ["Blood Pressure", "Electrolytes", "Zero Guilt"]
  },
  {
    "id": "cremini-mushrooms",
    "name": "Cremini Mushrooms",
    "category": "Vegetables",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 22,
    "macros": { "fat": 0.1, "carbs": 4.3, "protein": 2.5 },
    "micros": { "potassium": "448 mg", "magnesium": "12 mg", "fiber": "0.6 g" },
    "benefits": ["Ergothioneine Mitochondrial Longevity Shield", "Beta-Glucan Immune Cell Priming", "Potassium-Dense Vasodilation"],
    "tags": ["Potassium Bomb", "Immune Defense", "Longevity Fungi"]
  },
  {
    "id": "red-onion",
    "name": "Red Onion",
    "category": "Vegetables",
    "image": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 40,
    "macros": { "fat": 0.1, "carbs": 9.3, "protein": 1.1 },
    "micros": { "potassium": "146 mg", "magnesium": "10 mg", "fiber": "1.7 g" },
    "benefits": ["High Quercetin Bioavailability", "Fructooligosaccharide (FOS) Gut Prebiotic", "Alliin Circulatory Endothelium Defense"],
    "tags": ["Quercetin", "Prebiotic", "Heart Health"]
  },
  {
    "id": "green-beans",
    "name": "Green Beans",
    "category": "Vegetables",
    "image": "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 35,
    "macros": { "fat": 0.3, "carbs": 7.9, "protein": 1.9 },
    "micros": { "potassium": "209 mg", "magnesium": "25 mg", "fiber": "3.2 g" },
    "benefits": ["Chlorophyll Detoxification Pathways", "Bioavailable Silicon for Bone Collagen", "Gentle Low-FODMAP Digestive Transit"],
    "tags": ["Low FODMAP", "Bone Health", "Fiber Rich"]
  },
  {
    "id": "eggplant",
    "name": "Eggplant",
    "category": "Vegetables",
    "image": "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 35,
    "macros": { "fat": 0.2, "carbs": 8.7, "protein": 0.8 },
    "micros": { "potassium": "123 mg", "magnesium": "14 mg", "fiber": "2.5 g" },
    "benefits": ["Nasunin Neural Membrane Antioxidant", "Bile Acid Binding Lipid Clearance", "Postprandial Glycemic Damping"],
    "tags": ["Brain Antioxidant", "Low Calorie", "Mediterranean"]
  },
  {
    "id": "bok-choy",
    "name": "Bok Choy",
    "category": "Vegetables",
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 12,
    "macros": { "fat": 0.2, "carbs": 1.8, "protein": 1.6 },
    "micros": { "potassium": "371 mg", "magnesium": "19 mg", "fiber": "1.0 g" },
    "benefits": ["Sulforaphane Phase II Liver Detox", "Superior Bioavailable Plant Calcium", "Estrogen Clearance Modulation"],
    "tags": ["Cruciferous", "High Potassium", "Bone Density"]
  },
  {
    "id": "swiss-chard",
    "name": "Swiss Chard",
    "category": "Vegetables",
    "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 20,
    "macros": { "fat": 0.1, "carbs": 4.1, "protein": 1.9 },
    "micros": { "potassium": "549 mg", "magnesium": "86 mg", "fiber": "2.1 g" },
    "benefits": ["Super-High Magnesium & Potassium Combo", "Syringic Acid Alpha-Glucosidase Inhibitor", "Nitric Oxide Microvascular Flush"],
    "tags": ["Magnesium Rich", "Potassium Bomb", "Alkaline Leafy"]
  },
  {
    "id": "cabbage",
    "name": "Green Cabbage",
    "category": "Vegetables",
    "image": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 25,
    "macros": { "fat": 0.1, "carbs": 5.8, "protein": 1.3 },
    "micros": { "potassium": "170 mg", "magnesium": "12 mg", "fiber": "2.5 g" },
    "benefits": ["L-Glutamine Gut Mucosa Healing", "Indole-3-Carbinol Hormone Optimization", "Vitamin K1 Osteocalcin Activation"],
    "tags": ["Gut Lining", "Cruciferous", "Budget Staple"]
  },

  // --- WHOLE GRAINS & LEGUMES (9) ---
  {
    "id": "rolled-oats",
    "name": "Rolled Oats (Cooked)",
    "category": "Whole Grains",
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 71,
    "macros": { "fat": 1.5, "carbs": 12.0, "protein": 2.5 },
    "micros": { "potassium": "70 mg", "magnesium": "27 mg", "fiber": "1.7 g" },
    "benefits": ["Beta-Glucan Viscous Fiber LDL Clearance", "Avenanthramides Arterial Anti-Inflammatory", "Sustained Low-GI Energy Arc"],
    "tags": ["Heart Healthy", "Beta-Glucan", "Breakfast Staple"]
  },
  {
    "id": "chickpeas",
    "name": "Chickpeas (Cooked)",
    "category": "Whole Grains",
    "image": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 164,
    "macros": { "fat": 2.6, "carbs": 27.4, "protein": 8.9 },
    "micros": { "potassium": "291 mg", "magnesium": "48 mg", "fiber": "7.6 g" },
    "benefits": ["Type-3 Resistant Starch Butyrate Fuel", "High Protein & Fiber Satiety Matrix", "Folate & Molybdenum Sulfite Clearance"],
    "tags": ["High Fiber", "Plant Protein", "Gut Microbiome"]
  },
  {
    "id": "black-beans",
    "name": "Black Beans (Cooked)",
    "category": "Whole Grains",
    "image": "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 132,
    "macros": { "fat": 0.5, "carbs": 23.7, "protein": 8.9 },
    "micros": { "potassium": "355 mg", "magnesium": "60 mg", "fiber": "8.7 g" },
    "benefits": ["Dark Seed Coat Anthocyanin Shield", "Fermentable Prebiotic Fiber Powerhouse", "Second-Meal Glycemic Stabilization"],
    "tags": ["High Fiber", "Anthocyanins", "Longevity Legume"]
  },
  {
    "id": "kidney-beans",
    "name": "Red Kidney Beans (Cooked)",
    "category": "Whole Grains",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 127,
    "macros": { "fat": 0.5, "carbs": 22.8, "protein": 8.7 },
    "micros": { "potassium": "403 mg", "magnesium": "45 mg", "fiber": "6.4 g" },
    "benefits": ["Concentrated Dietary Potassium (403mg)", "Colonic Epithelial Integrity Protection", "Very Low Insulinogenic Index"],
    "tags": ["Potassium Rich", "Plant Protein", "Metabolic Health"]
  },
  {
    "id": "sweet-corn",
    "name": "Sweet Corn (Cooked)",
    "category": "Whole Grains",
    "image": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 96,
    "macros": { "fat": 1.5, "carbs": 21.0, "protein": 3.4 },
    "micros": { "potassium": "218 mg", "magnesium": "26 mg", "fiber": "2.4 g" },
    "benefits": ["Lutein & Zeaxanthin Macular Pigment Defense", "Ferulic Acid Bound Antioxidant Release", "Insoluble Cellulose Digestive Bulk"],
    "tags": ["Eye Health", "Whole Grain", "Natural Energy"]
  },
  {
    "id": "whole-wheat-bread",
    "name": "Whole Wheat Bread",
    "category": "Whole Grains",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 247,
    "macros": { "fat": 3.4, "carbs": 41.3, "protein": 13.0 },
    "micros": { "potassium": "250 mg", "magnesium": "82 mg", "fiber": "6.8 g" },
    "benefits": ["Intact Wheat Germ & Aleurone Layer", "Cellular Energy B-Complex Spectrum", "Slow-Starch Hydrolysis for Even Energy"],
    "tags": ["Whole Grain", "B Vitamins", "Daily Staple"]
  },
  {
    "id": "sourdough-bread",
    "name": "Sourdough Bread",
    "category": "Whole Grains",
    "image": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 226,
    "macros": { "fat": 1.8, "carbs": 44.0, "protein": 8.1 },
    "micros": { "potassium": "115 mg", "magnesium": "28 mg", "fiber": "2.2 g" },
    "benefits": ["Lactic Acid Fermentation Pre-Digestion", "Phytate Breakdown Mineral Unlocking", "Significantly Lower Postprandial Glucose"],
    "tags": ["Fermented", "Gut Friendly", "Low FODMAP Bread"]
  },
  {
    "id": "buckwheat",
    "name": "Buckwheat (Cooked)",
    "category": "Whole Grains",
    "image": "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 92,
    "macros": { "fat": 0.6, "carbs": 19.9, "protein": 3.4 },
    "micros": { "potassium": "88 mg", "magnesium": "51 mg", "fiber": "2.7 g" },
    "benefits": ["Rutin Bioflavonoid Microvascular Strength", "100% Gluten-Free Pseudocereal", "D-Chiro-Inositol Insulin Signaling"],
    "tags": ["Gluten Free", "Circulation", "Magnesium"]
  },
  {
    "id": "barley",
    "name": "Pearl Barley (Cooked)",
    "category": "Whole Grains",
    "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 123,
    "macros": { "fat": 0.4, "carbs": 28.2, "protein": 2.3 },
    "micros": { "potassium": "93 mg", "magnesium": "22 mg", "fiber": "3.8 g" },
    "benefits": ["Lowest Glycemic Index of All Cereal Grains", "Dual Fiber Viscous Cholesterol Trapping", "Microbial Short-Chain Fatty Acid Catalyst"],
    "tags": ["Low GI", "Beta-Glucan", "Satiety"]
  },

  // --- PROTEINS & SEAFOOD (9) ---
  {
    "id": "canned-tuna-water",
    "name": "Chunk Light Tuna (in Water)",
    "category": "Proteins",
    "image": "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 116,
    "macros": { "fat": 0.8, "carbs": 0.0, "protein": 25.5 },
    "micros": { "potassium": "237 mg", "magnesium": "27 mg", "fiber": "0 g" },
    "benefits": ["Peak Protein-to-Calorie Ratio (88%)", "Heavy Metal Counterbalancing Selenium", "Rapid Leucine MPS Trigger"],
    "tags": ["High Protein", "Low Fat", "Budget Protein"]
  },
  {
    "id": "halibut",
    "name": "Pacific Halibut (Cooked)",
    "category": "Proteins",
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 111,
    "macros": { "fat": 1.7, "carbs": 0.0, "protein": 22.5 },
    "micros": { "potassium": "528 mg", "magnesium": "28 mg", "fiber": "0 g" },
    "benefits": ["Extreme Potassium Density (528mg/100g)", "Marine Anti-Inflammatory Lipids", "Ultra Lean Muscle Protein Synthesis"],
    "tags": ["Lean Fish", "High Potassium", "High Protein"]
  },
  {
    "id": "ground-turkey-93-7",
    "name": "Lean Ground Turkey (93/7)",
    "category": "Proteins",
    "image": "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 203,
    "macros": { "fat": 11.2, "carbs": 0.0, "protein": 24.3 },
    "micros": { "potassium": "285 mg", "magnesium": "25 mg", "fiber": "0 g" },
    "benefits": ["High Tryptophan Neurotransmitter Support", "Bioavailable Heme Iron & Zinc", "Complete Muscle Repair Amino Spectrum"],
    "tags": ["High Protein", "Meal Prep", "Lean Meat"]
  },
  {
    "id": "chicken-thigh",
    "name": "Chicken Thigh (Skinless, Roasted)",
    "category": "Proteins",
    "image": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 179,
    "macros": { "fat": 8.4, "carbs": 0.0, "protein": 24.7 },
    "micros": { "potassium": "239 mg", "magnesium": "22 mg", "fiber": "0 g" },
    "benefits": ["Higher Zinc & Heme Iron than Breast", "Myoglobin Muscle Cellular Respiration", "Satiating Monounsaturated Fatty Acids"],
    "tags": ["High Protein", "Iron Rich", "Flavorful Lean"]
  },
  {
    "id": "mussels",
    "name": "Blue Mussels (Cooked)",
    "category": "Proteins",
    "image": "https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 172,
    "macros": { "fat": 4.5, "carbs": 7.4, "protein": 23.8 },
    "micros": { "potassium": "268 mg", "magnesium": "37 mg", "fiber": "0 g" },
    "benefits": ["World Record Vitamin B12 Concentration", "Heme Iron & Manganese Superoxide Defense", "Marine Glycogen Energy Reserve"],
    "tags": ["B12 Powerhouse", "Zinc & Iron", "Seafood Superfood"]
  },
  {
    "id": "scallops",
    "name": "Sea Scallops (Steamed)",
    "category": "Proteins",
    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 111,
    "macros": { "fat": 0.8, "carbs": 5.4, "protein": 20.5 },
    "micros": { "potassium": "314 mg", "magnesium": "37 mg", "fiber": "0 g" },
    "benefits": ["Taurine Cardiovascular Cytoprotection", "Magnesium Induced Vascular Relaxation", "Ultra Lean Pure Protein Density"],
    "tags": ["Taurine", "Lean Protein", "Heart Health"]
  },
  {
    "id": "pork-chop",
    "name": "Pork Loin Chop (Lean, Broiled)",
    "category": "Proteins",
    "image": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 196,
    "macros": { "fat": 9.2, "carbs": 0.0, "protein": 26.7 },
    "micros": { "potassium": "399 mg", "magnesium": "25 mg", "fiber": "0 g" },
    "benefits": ["Top Meat Source of Thiamine (Vitamin B1)", "High Potassium-to-Sodium Circulatory Balance", "Full Leucine Satiety Curve"],
    "tags": ["Thiamine B1", "High Protein", "Lean Meat"]
  },
  {
    "id": "seitan",
    "name": "Seitan (Vital Wheat Gluten)",
    "category": "Proteins",
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 143,
    "macros": { "fat": 1.9, "carbs": 3.8, "protein": 25.0 },
    "micros": { "potassium": "100 mg", "magnesium": "25 mg", "fiber": "0.6 g" },
    "benefits": ["Peak Plant Protein Density (25g/100g)", "Zero Saturated Fat & Zero Cholesterol", "High Glutamine for Muscle Tissue"],
    "tags": ["High Protein", "Vegan", "Zero Cholesterol"]
  },
  {
    "id": "nutritional-yeast",
    "name": "Nutritional Yeast",
    "category": "Proteins",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 380,
    "macros": { "fat": 4.0, "carbs": 36.0, "protein": 50.0 },
    "micros": { "potassium": "2000 mg", "magnesium": "130 mg", "fiber": "24.0 g" },
    "benefits": ["50% Complete Protein by Net Weight", "Phenomenal Potassium Bomb (2,000mg/100g)", "Full Methylation B-Vitamin Complex"],
    "tags": ["50% Protein", "B12 Fortified", "Superfood"]
  },

  // --- DAIRY, PLANT MILKS & FERMENTED (5) ---
  {
    "id": "whole-milk",
    "name": "Whole Milk (3.25%)",
    "category": "Dairy & Alternatives",
    "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 61,
    "macros": { "fat": 3.3, "carbs": 4.8, "protein": 3.2 },
    "micros": { "potassium": "132 mg", "magnesium": "10 mg", "fiber": "0 g" },
    "benefits": ["Synergistic Whey & Casein Protein Split", "High Bioavailability Calcium & Phosphorus", "Natural Fat-Soluble Vitamin Vehicle"],
    "tags": ["Calcium", "Whey & Casein", "Daily Dairy"]
  },
  {
    "id": "soy-milk",
    "name": "Unsweetened Soy Milk",
    "category": "Dairy & Alternatives",
    "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 45,
    "macros": { "fat": 1.8, "carbs": 3.5, "protein": 3.3 },
    "micros": { "potassium": "142 mg", "magnesium": "25 mg", "fiber": "1.2 g" },
    "benefits": ["Only Plant Milk Matching Dairy Protein", "Isoflavone Cardio-Vascular Shield", "Zero Lactose & Zero Cholesterol"],
    "tags": ["Plant Milk", "Lactose Free", "Heart Health"]
  },
  {
    "id": "kefir",
    "name": "Low-Fat Plain Kefir",
    "category": "Dairy & Alternatives",
    "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 43,
    "macros": { "fat": 1.0, "carbs": 5.3, "protein": 3.8 },
    "micros": { "potassium": "164 mg", "magnesium": "13 mg", "fiber": "0 g" },
    "benefits": ["60+ Cultured Probiotic Bacteria & Yeasts", "Lactase Pre-Fermentation for Easy Digestion", "Kefiran Polysaccharide Anti-Microbial Action"],
    "tags": ["Probiotic", "Fermented", "Gut Microbiome"]
  },
  {
    "id": "coconut-water",
    "name": "Pure Coconut Water",
    "category": "Dairy & Alternatives",
    "image": "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 19,
    "macros": { "fat": 0.2, "carbs": 3.7, "protein": 0.7 },
    "micros": { "potassium": "250 mg", "magnesium": "25 mg", "fiber": "1.1 g" },
    "benefits": ["Isotonic Bio-Electrolyte Osmolarity", "Rapid Cellular Intracellular Rehydration", "Natural Blood Pressure Balance"],
    "tags": ["Electrolytes", "Post-Workout", "Hydration"]
  },
  {
    "id": "cheddar-cheese",
    "name": "Sharp Cheddar Cheese",
    "category": "Dairy & Alternatives",
    "image": "https://images.unsplash.com/photo-1618060932014-4deda4932554?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 403,
    "macros": { "fat": 33.1, "carbs": 1.3, "protein": 24.9 },
    "micros": { "potassium": "98 mg", "magnesium": "28 mg", "fiber": "0 g" },
    "benefits": ["High-Concentration Calcium Matrix", "Vitamin K2 (MK-4) Calcium Shuttling to Bones", "Zero Sugar Keto Energy Density"],
    "tags": ["Keto Friendly", "Vitamin K2", "Calcium Rich"]
  },

  // --- NUTS, SEEDS & HEALTHY FATS (5) ---
  {
    "id": "brazil-nuts",
    "name": "Brazil Nuts",
    "category": "Nuts & Seeds",
    "image": "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 659,
    "macros": { "fat": 67.1, "carbs": 12.3, "protein": 14.3 },
    "micros": { "potassium": "659 mg", "magnesium": "376 mg", "fiber": "7.5 g" },
    "benefits": ["World's Densest Selenium Source (Thyroid T3)", "Extreme Magnesium Density (376mg)", "Cardiovascular Lipid Balancing Monounsaturates"],
    "tags": ["Selenium King", "Thyroid Health", "Healthy Fats"]
  },
  {
    "id": "hemp-seeds",
    "name": "Hemp Hearts (Hulled)",
    "category": "Nuts & Seeds",
    "image": "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 553,
    "macros": { "fat": 48.8, "carbs": 8.7, "protein": 31.6 },
    "micros": { "potassium": "1200 mg", "magnesium": "700 mg", "fiber": "4.0 g" },
    "benefits": ["Golden 3:1 Omega-6 to Omega-3 Ratio", "Gamma-Linolenic Acid (GLA) Anti-Inflammatory", "31.6% Complete Digestible Edestin Protein"],
    "tags": ["Omega 3 & 6", "Magnesium Bomb", "Plant Protein"]
  },
  {
    "id": "tahini",
    "name": "Sesame Tahini",
    "category": "Nuts & Seeds",
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 595,
    "macros": { "fat": 53.8, "carbs": 21.2, "protein": 17.0 },
    "micros": { "potassium": "414 mg", "magnesium": "95 mg", "fiber": "9.3 g" },
    "benefits": ["Sesamin & Sesamolin Protective Lignans", "Bioavailable Non-Dairy Bone Calcium", "Hepatic Fatty Acid Beta-Oxidation Support"],
    "tags": ["Lignans", "Calcium", "Healthy Fats"]
  },
  {
    "id": "ghee",
    "name": "Clarified Butter (Ghee)",
    "category": "Healthy Fats",
    "image": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 900,
    "macros": { "fat": 99.5, "carbs": 0.0, "protein": 0.3 },
    "micros": { "potassium": "5 mg", "magnesium": "1 mg", "fiber": "0 g" },
    "benefits": ["Ultra-High Smoke Point (485°F / 250°C)", "100% Lactose & Casein Free Lipid Fuel", "Concentrated Butyric Acid Gut Fuel"],
    "tags": ["Keto Fuel", "Lactose Free", "High Heat Cooking"]
  },
  {
    "id": "peanut-butter",
    "name": "Natural Peanut Butter",
    "category": "Nuts & Seeds",
    "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
    "servingBaseGrams": 100,
    "calories": 588,
    "macros": { "fat": 50.4, "carbs": 20.0, "protein": 25.1 },
    "micros": { "potassium": "649 mg", "magnesium": "154 mg", "fiber": "6.0 g" },
    "benefits": ["High Satiety Protein-Lipid Dynamic", "Resveratrol & Biotin Synergism", "Electrolyte Balance Potassium Richness (649mg)"],
    "tags": ["High Protein", "Potassium Rich", "Energy Dense"]
  }
];

// Deduplication and validation checks
const existingIds = new Set(currentFoods.map(f => f.id));
const existingNames = new Set(currentFoods.map(f => f.name.toLowerCase()));

console.log(`Checking proposed ${new50Foods.length} foods against existing items...`);

for (const food of new50Foods) {
  if (existingIds.has(food.id)) {
    throw new Error(`Duplicate ID detected: ${food.id}`);
  }
  if (existingNames.has(food.name.toLowerCase())) {
    throw new Error(`Duplicate Name detected: ${food.name}`);
  }
  if (!food.id || !food.name || !food.category || !food.image || !food.calories || !food.macros || !food.micros) {
    throw new Error(`Missing required fields in: ${food.name}`);
  }
  if (typeof food.macros.fat !== 'number' || typeof food.macros.carbs !== 'number' || typeof food.macros.protein !== 'number') {
    throw new Error(`Invalid macro numeric value in: ${food.name}`);
  }
  if (!food.micros.potassium || !food.micros.magnesium || !food.micros.fiber) {
    throw new Error(`Missing micro fields in: ${food.name}`);
  }
  if (!Array.isArray(food.benefits) || food.benefits.length !== 3) {
    throw new Error(`Benefits must have exactly 3 items in: ${food.name}`);
  }
  if (!Array.isArray(food.tags) || food.tags.length !== 3) {
    throw new Error(`Tags must have exactly 3 items in: ${food.name}`);
  }
}

console.log(`All ${new50Foods.length} items passed validation with 0 errors!`);

const mergedFoods = [...currentFoods, ...new50Foods];
fs.writeFileSync(foodsFilePath, JSON.stringify(mergedFoods, null, 2) + '\n', 'utf8');

console.log(`Successfully appended 50 foods! Total foods in database: ${mergedFoods.length}`);
