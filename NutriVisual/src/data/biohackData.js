/**
 * Scientifically Vetted Biohack Scores & Evidence-Based Nutrition Explanations
 * Maps 5 key health & biohacking dimensions (0 - 100) for ALL 67 foods in NutriVisual:
 * 1. Brain & Focus (Cognitive, Neurogenesis, Neurotransmitters, BDNF)
 * 2. Lean Muscle & Recovery (Protein Bioavailability, Amino Acid Spectrum, Leucine, Creatine)
 * 3. Gut Microbiome (Prebiotic Fiber, Microbiome Diversity, Gut Barrier Integrity, SCFAs)
 * 4. Heart & Circulation (Nitric Oxide, Potassium/Sodium, Endothelial Health, Omega-3s)
 * 5. Metabolic Flexibility (Glycemic Response, Insulin Sensitivity, Satiety Ratio, Thermogenesis)
 */

export const biohackDatabase = {
  // --- PROTEINS & MEATS ---
  'atlantic-salmon': {
    scores: { brain: 96, muscle: 90, gut: 45, heart: 98, metabolism: 85 },
    reasons: {
      brain: 'Concentrated EPA/DHA omega-3s cross the blood-brain barrier to optimize neural cell membrane fluidity.',
      muscle: 'Delivers 22g bioavailable protein rich in essential amino acids to fuel muscle protein synthesis.',
      gut: 'Zero dietary fiber, but marine omega-3s help reduce intestinal mucosal inflammation.',
      heart: 'Clinical trials show EPA/DHA reduces triglycerides, lowers resting blood pressure, and improves arterial elasticity.',
      metabolism: 'Zero net carbs prevent postprandial glycemic spikes, maintaining baseline insulin stability.'
    }
  },
  'wild-salmon': {
    scores: { brain: 98, muscle: 92, gut: 48, heart: 99, metabolism: 88 },
    reasons: {
      brain: 'Exceptional DHA concentration & Astaxanthin antioxidant protect brain cells from lipid peroxidation.',
      muscle: 'High leucine density supports rapid post-workout muscle repair and nitrogen balance.',
      gut: 'Zero fiber, but potent anti-inflammatory carotenoids protect gut barrier lining integrity.',
      heart: 'Optimal 4:1 Omega-3 to Omega-6 ratio dramatically lowers cardiovascular risk markers.',
      metabolism: 'Keeps fasting insulin baseline low while promoting mitochondrial fatty acid oxidation.'
    }
  },
  'farmed-salmon': {
    scores: { brain: 92, muscle: 90, gut: 42, heart: 94, metabolism: 84 },
    reasons: {
      brain: 'Provides substantial EPA and DHA fatty acids to support cerebral circulation and cognitive speed.',
      muscle: 'Delivers 20g bioavailable protein with high amino acid scores for tissue repair.',
      gut: 'Zero fiber; marine lipids help soothe low-grade intestinal mucosal inflammation.',
      heart: 'High omega-3 content protects vascular endothelial function and cardiac rhythm.',
      metabolism: 'High protein and healthy fats maintain low post-meal glycemic response.'
    }
  },
  'chicken-breast': {
    scores: { brain: 70, muscle: 98, gut: 30, heart: 75, metabolism: 90 },
    reasons: {
      brain: 'Provides Vitamin B6 and Niacin required for serotonin and NAD+ cellular energy pathways.',
      muscle: 'Ultra-pure protein source (31g/100g) with peak branched-chain amino acid (BCAA) density.',
      gut: 'Zero fiber; highly digestible with minimal fermentable residue in the lower intestine.',
      heart: 'Very low saturated fat content helps maintain healthy ApoB and LDL cholesterol profiles.',
      metabolism: 'High thermic effect of protein (TEP) burns up to 25% of its calories during digestion.'
    }
  },
  'beef': {
    scores: { brain: 85, muscle: 96, gut: 35, heart: 68, metabolism: 84 },
    reasons: {
      brain: 'Rich in bioavailable Heme Iron, Zinc, and Vitamin B12 for myelin sheath integrity and dopamine production.',
      muscle: 'Packed with natural Creatine, Carnosine, and complete protein for maximal strength adaptation.',
      gut: 'Zero dietary fiber; slow gastric emptying provides sustained satiety without fiber fermentation.',
      heart: 'Contains Stearic acid (neutral fat), though total saturated fat requires balanced daily intake.',
      metabolism: 'Low glycemic load and high protein density support stable blood glucose regulation.'
    }
  },
  'ribeye': {
    scores: { brain: 82, muscle: 94, gut: 35, heart: 60, metabolism: 80 },
    reasons: {
      brain: 'High B12, Heme Iron, and Zinc support neurotransmitter synthesis and oxygen transport to the brain.',
      muscle: 'Delivers complete protein alongside natural creatine and bioavailable micronutrients.',
      gut: 'Zero fiber; rich in saturated and monounsaturated fats that slow digestion.',
      heart: 'Higher saturated fat profile; best consumed as part of a whole-food Mediterranean or low-carb lifestyle.',
      metabolism: 'Zero carbohydrates ensure minimal post-meal glucose and insulin spikes.'
    }
  },
  'sirloin': {
    scores: { brain: 84, muscle: 96, gut: 35, heart: 72, metabolism: 86 },
    reasons: {
      brain: 'Abundant in B-vitamins and Iron essential for cognitive focus and mitochondrial respiration.',
      muscle: 'Lean red meat option providing high leucine and creatine for optimal hypertrophy.',
      gut: 'Zero fiber, highly digestible animal protein with minimal intestinal bloating.',
      heart: 'Leaner cut with lower saturated fat than Ribeye, supporting balanced lipid biomarkers.',
      metabolism: 'High thermic effect of protein helps elevate metabolic rate post-meal.'
    }
  },
  'turkey-breast': {
    scores: { brain: 76, muscle: 97, gut: 30, heart: 80, metabolism: 92 },
    reasons: {
      brain: 'Rich in L-Tryptophan, the direct amino acid precursor to serotonin and melatonin sleep cycles.',
      muscle: 'Exceptionally lean complete protein (29g/100g) ideal for body re-composition.',
      gut: 'Zero dietary fiber; easily broken down by gastric enzymes.',
      heart: 'Minimal saturated fat and low calorie density protect vascular health.',
      metabolism: 'High protein-to-calorie ratio maximizes satiety and caloric expenditure during digestion.'
    }
  },
  'cod-fillet': {
    scores: { brain: 80, muscle: 92, gut: 30, heart: 90, metabolism: 94 },
    reasons: {
      brain: 'Rich in Iodine and B12 necessary for thyroid hormone synthesis and cognitive clarity.',
      muscle: 'Ultra-lean white fish providing 18g highly bioavailable protein in just 82 kcal.',
      gut: 'Zero fiber; rapidly digested with zero gastrointestinal strain.',
      heart: 'Extremely low calorie and fat content supports vascular elasticity and weight control.',
      metabolism: 'Peak protein-to-calorie ratio stimulates maximum metabolic rate.'
    }
  },
  'tuna': {
    scores: { brain: 90, muscle: 95, gut: 30, heart: 90, metabolism: 90 },
    reasons: {
      brain: 'Rich in Niacin, B12, and Omega-3s supporting cognitive speed and cerebrovascular flow.',
      muscle: 'Ultra-lean, dense protein source (28g/100g) packed with selenium.',
      gut: 'Zero dietary fiber; rapidly digested in the stomach.',
      heart: 'Omega-3 fatty acids and high potassium protect cardiovascular performance.',
      metabolism: 'Zero carbs and high protein thermogenesis support metabolic efficiency.'
    }
  },
  'tofu': {
    scores: { brain: 75, muscle: 82, gut: 65, heart: 88, metabolism: 84 },
    reasons: {
      brain: 'Contains Isoflavones and Iron supporting cerebral blood flow and neuronal signaling.',
      muscle: 'Complete plant protein providing all 9 essential amino acids for tissue repair.',
      gut: 'Provides gentle dietary fiber and soy oligosaccharides for intestinal motility.',
      heart: 'Soy isoflavones and low saturated fat actively help reduce ApoB and LDL cholesterol.',
      metabolism: 'Low glycemic index supports steady postprandial glucose disposal.'
    }
  },
  'tempeh': {
    scores: { brain: 80, muscle: 88, gut: 92, heart: 88, metabolism: 86 },
    reasons: {
      brain: 'Fermentation increases bioavailable Manganese, Niacin, and Copper for neural health.',
      muscle: 'Dense fermented plant protein (19g/100g) rich in bio-available amino acids.',
      gut: 'Rhizopus fungal fermentation generates prebiotics and improves gut microbiome diversity.',
      heart: 'Isoflavones and prebiotic fiber support healthy blood lipids and vascular integrity.',
      metabolism: 'High fiber and protein combination delays gastric emptying for smooth insulin control.'
    }
  },
  'eggs': {
    scores: { brain: 95, muscle: 90, gut: 40, heart: 82, metabolism: 88 },
    reasons: {
      brain: 'Top source of Choline (147mg/egg) and Lutein, critical for memory, brain structure, and acetylcholine synthesis.',
      muscle: 'Sets the biological reference standard (100 BV) for human amino acid absorption.',
      gut: 'Zero fiber; highly bioavailable nutrients absorbed in the upper small intestine.',
      heart: 'Contains healthy Lecithin and HDL-supporting fats that maintain healthy LDL particle size.',
      metabolism: 'Extremely high satiety index per calorie prevents overeating throughout the day.'
    }
  },
  'shrimp': {
    scores: { brain: 85, muscle: 92, gut: 35, heart: 88, metabolism: 94 },
    reasons: {
      brain: 'Contains Astaxanthin antioxidant and Iodine needed for brain thyroid signaling.',
      muscle: 'High protein-to-calorie ratio (24g protein in 100 kcal) ideal for rapid recovery.',
      gut: 'Zero fiber; easy digestivity with zero gut fermentability.',
      heart: 'Low saturated fat and rich in Selenium which combats oxidative cardiovascular stress.',
      metabolism: 'Very low calorie density makes it one of the most volume-friendly protein sources.'
    }
  },
  'cottage-cheese': {
    scores: { brain: 70, muscle: 88, gut: 65, heart: 75, metabolism: 82 },
    reasons: {
      brain: 'Provides B12, Calcium, and Tyrosine for steady neurotransmitter production.',
      muscle: 'Rich in Casein protein, providing slow, sustained amino acid release over 6-8 hours.',
      gut: 'Cultured varieties supply live probiotics and lactic acid for gut flora diversity.',
      heart: 'Good source of Potassium and Calcium which help regulate blood pressure.',
      metabolism: 'Slow-digesting casein promotes prolonged satiety and prevents glycemic dips.'
    }
  },
  'beef-liver': {
    scores: { brain: 98, muscle: 95, gut: 50, heart: 85, metabolism: 94 },
    reasons: {
      brain: 'Nature’s multivitamin: unmatched Vitamin B12 (1200% DV), Vitamin A, Choline, and Copper for neural energy.',
      muscle: 'Extremely dense micronutrient matrix accelerates cellular recovery and red blood cell formation.',
      gut: 'Delivers Vitamin A and Zinc required for maintaining tight junction integrity in gut mucosa.',
      heart: 'Provides CoQ10 and Bioavailable Copper for cardiac mitochondrial energy production.',
      metabolism: 'Potent micronutrient density optimizes thyroid hormone conversion (T4 to active T3).'
    }
  },
  'pork-tenderloin': {
    scores: { brain: 86, muscle: 94, gut: 30, heart: 78, metabolism: 90 },
    reasons: {
      brain: 'Highest Thiamine (Vitamin B1) density of all meats, essential for neuronal glucose metabolism.',
      muscle: 'Lean complete protein cut offering high leucine for protein synthesis.',
      gut: 'Zero dietary fiber; easily digested in the stomach.',
      heart: 'Lean profile comparable to chicken breast in saturated fat content.',
      metabolism: 'High protein thermogenesis promotes metabolic output post-meal.'
    }
  },
  'sardines': {
    scores: { brain: 96, muscle: 88, gut: 50, heart: 98, metabolism: 88 },
    reasons: {
      brain: 'Abundant in DHA/EPA, Vitamin D, and Calcium for cognitive longevity.',
      muscle: 'Small wild fish providing complete protein along with bioavailable bio-minerals.',
      gut: 'Omega-3s soothe intestinal lining inflammation.',
      heart: 'Unbeatable Omega-3 density protects vascular endothelium and regulates blood pressure.',
      metabolism: 'Healthy fats and protein stabilize fasting blood glucose levels.'
    }
  },

  // --- LEGUMES & GRAINS ---
  'lentils': {
    scores: { brain: 82, muscle: 78, gut: 98, heart: 94, metabolism: 88 },
    reasons: {
      brain: 'Rich in Folate (45% DV) and Iron essential for neurotransmitter synthesis and oxygenation.',
      muscle: 'Delivers 9g plant protein per 100g cooked along with slow-burning complex carbs.',
      gut: 'Outstanding 7.9g dietary fiber per 100g generates short-chain fatty acids (butyrate) in colon.',
      heart: 'High soluble fiber and Folate reduce homocysteine and clear excess circulating cholesterol.',
      metabolism: 'Very low glycemic index (GI 32) stabilizes postprandial blood sugar for hours.'
    }
  },
  'edamame': {
    scores: { brain: 82, muscle: 85, gut: 92, heart: 90, metabolism: 86 },
    reasons: {
      brain: 'Abundant in Folate, Isoflavones, and Choline for cognitive membrane protection.',
      muscle: 'Whole plant protein delivering 11g complete amino acids per 100g portion.',
      gut: 'Provides 5.2g prebiotic fiber nourishing gut microbial diversity.',
      heart: 'Plant sterols and low saturated fat support healthy arterial compliance.',
      metabolism: 'Balanced carbohydrate and protein matrix ensures steady glycemic control.'
    }
  },
  'quinoa': {
    scores: { brain: 80, muscle: 75, gut: 90, heart: 88, metabolism: 82 },
    reasons: {
      brain: 'Rich in Quercetin & Kaempferol polyphenols that protect brain cells from neuroinflammation.',
      muscle: 'Rare plant seed containing all 9 essential amino acids for tissue repair.',
      gut: 'Contains prebiotic fiber supporting beneficial gut microbial strains.',
      heart: 'High Magnesium and Potassium help relax arterial walls and lower blood pressure.',
      metabolism: 'Low glycemic load seed providing sustained energy release.'
    }
  },
  'white-rice': {
    scores: { brain: 60, muscle: 70, gut: 40, heart: 60, metabolism: 65 },
    reasons: {
      brain: 'Provides fast glucose energy for brain astrocytes during intense cognitive or physical demand.',
      muscle: 'Ideal post-workout carbohydrate source for rapid muscle glycogen resynthesis.',
      gut: 'Extremely low fiber; easy to digest for sensitive gastrointestinal tracts.',
      heart: 'Fat-free and low sodium, though lacking protective fiber and polyphenols.',
      metabolism: 'High glycemic index causes rapid glucose absorption; best paired with protein.'
    }
  },
  'cauliflower-rice': {
    scores: { brain: 82, muscle: 45, gut: 90, heart: 88, metabolism: 95 },
    reasons: {
      brain: 'Contains Choline and Vitamin C to support brain cell antioxidant defense.',
      muscle: 'Low protein content, but supplies potassium for muscle electrolyte balance.',
      gut: 'Delivers prebiotic fiber and glucosinolates for gut barrier health.',
      heart: 'Very high volume and low sodium promote arterial blood pressure control.',
      metabolism: 'Only 25 kcal/100g — the ultimate low-carb volume replacement for white rice.'
    }
  },

  // --- HEALTHY FATS & NUTS ---
  'avocado': {
    scores: { brain: 90, muscle: 55, gut: 95, heart: 96, metabolism: 88 },
    reasons: {
      brain: 'Monounsaturated fats (Oleic acid) and Lutein enhance cerebral blood flow and cognitive processing.',
      muscle: 'Provides Potassium (485mg) essential for muscle contraction and electrolyte balance.',
      gut: 'Packed with 6.7g soluble & insoluble dietary fiber per 100g, nourishing gut microbiota.',
      heart: 'Lowers LDL cholesterol and improves potassium-to-sodium ratio for arterial blood pressure control.',
      metabolism: 'High fiber and monounsaturated fats flatten post-meal glucose and insulin curves.'
    }
  },
  'almonds': {
    scores: { brain: 85, muscle: 68, gut: 88, heart: 92, metabolism: 80 },
    reasons: {
      brain: 'Top source of Vitamin E (Alpha-tocopherol) protecting brain cell membranes against oxidative damage.',
      muscle: 'Delivers 21g plant protein and Magnesium to prevent muscle cramping.',
      gut: 'Provides 12.5g prebiotic fiber and flavonoid skins that enhance gut bacteria composition.',
      heart: 'Reduces LDL oxidation and improves vascular endothelial reactivity.',
      metabolism: 'Magnesium improves insulin receptor sensitivity and glucose disposal.'
    }
  },
  'walnuts': {
    scores: { brain: 98, muscle: 60, gut: 90, heart: 96, metabolism: 82 },
    reasons: {
      brain: 'The top plant source of ALA Omega-3s & Polyphenols — clinically proven to improve memory and cognitive flexibility.',
      muscle: 'Contains Magnesium and Anti-inflammatory polyphenols for post-exercise recovery.',
      gut: 'Prebiotic polyphenols promote beneficial probiotic species like butyrate-producing Roseburia.',
      heart: 'Improves vascular reactivity, reduces inflammation markers, and lowers blood pressure.',
      metabolism: 'Healthy fat and fiber matrix slows stomach emptying and suppresses ghrelin hunger hormone.'
    }
  },
  'pecans': {
    scores: { brain: 88, muscle: 48, gut: 82, heart: 94, metabolism: 80 },
    reasons: {
      brain: 'Highest antioxidant concentration of all tree nuts (Gamma-tocopherol) protecting brain lipids.',
      muscle: 'Provides Manganese and Copper for mitochondrial SOD antioxidant enzymes.',
      gut: 'Contains 9.6g dietary fiber supporting intestinal peristalsis and mucosal health.',
      heart: 'Monounsaturated oleic acid lowers total and LDL blood cholesterol levels.',
      metabolism: 'Low carb density prevents postprandial blood glucose fluctuations.'
    }
  },
  'pistachios': {
    scores: { brain: 90, muscle: 65, gut: 88, heart: 92, metabolism: 84 },
    reasons: {
      brain: 'Highest Lutein & Zeaxanthin concentration among nuts for neural and visual processing.',
      muscle: 'Provides 20g protein with a high ratio of branched-chain amino acids.',
      gut: 'Prebiotic fiber and polyphenols enhance beneficial gut microbiota production.',
      heart: 'High Potassium (1025mg/100g) and Phytosterols support vascular relaxation.',
      metabolism: 'Low calorie density per nut with high satiety index.'
    }
  },
  'cashews': {
    scores: { brain: 86, muscle: 62, gut: 75, heart: 85, metabolism: 80 },
    reasons: {
      brain: 'Rich in Copper, Iron, and Magnesium vital for neurotransmitter synthesis and energy production.',
      muscle: 'Provides plant protein and Magnesium to assist post-exercise muscle relaxation.',
      gut: 'Contains dietary fiber and anacardic acids supporting gut microbial balance.',
      heart: 'Monounsaturated fats optimize circulating blood lipid profiles.',
      metabolism: 'Magnesium and Zinc enhance cellular insulin signaling pathways.'
    }
  },
  'pumpkin-seeds': {
    scores: { brain: 94, muscle: 78, gut: 85, heart: 92, metabolism: 86 },
    reasons: {
      brain: 'Unmatched Zinc & Magnesium density plus Tryptophan for serotonin and deep sleep synthesis.',
      muscle: 'Packed with 30g plant protein per 100g and high phosphorus for ATP energy generation.',
      gut: 'Provides dietary fiber and anti-inflammatory phytosterols.',
      heart: 'High Magnesium (592mg/100g) relaxes blood vessels and regulates heart rhythm.',
      metabolism: 'Low glycemic load and high protein/fat ratio promote steady blood sugar.'
    }
  },
  'sunflower-seeds': {
    scores: { brain: 90, muscle: 62, gut: 80, heart: 90, metabolism: 82 },
    reasons: {
      brain: 'World-class Vitamin E (26mg/100g) protecting neural membranes from lipid peroxidation.',
      muscle: 'Supplies plant protein, Selenium, and B-complex vitamins for muscle cell repair.',
      gut: 'Contains 8.6g dietary fiber supporting healthy gut transit.',
      heart: 'Phytosterols and unsaturated fatty acids assist endothelial health and cholesterol balance.',
      metabolism: 'Magnesium and healthy fats support steady insulin sensitivity.'
    }
  },
  'chia-seeds': {
    scores: { brain: 88, muscle: 65, gut: 98, heart: 92, metabolism: 90 },
    reasons: {
      brain: 'Rich in plant ALA Omega-3s and Magnesium supporting neural signal transmission.',
      muscle: 'Contains all 9 essential amino acids along with calcium and iron.',
      gut: 'Incredible 34g fiber per 100g forms a prebiotic mucilage gel that heals the intestinal barrier.',
      heart: 'Soluble mucilage fiber binds excess dietary cholesterol and lowers blood pressure.',
      metabolism: 'Gel-forming fiber slows carbohydrate absorption to near zero glycemic impact.'
    }
  },
  'flaxseed': {
    scores: { brain: 88, muscle: 62, gut: 96, heart: 95, metabolism: 88 },
    reasons: {
      brain: 'Highest concentrated source of ALA Omega-3s and lignan antioxidants for brain longevity.',
      muscle: 'Supplies plant protein, magnesium, and anti-inflammatory lignans.',
      gut: 'Mucilage soluble fiber regulates bowel transit time and feeds beneficial gut flora.',
      heart: 'Lignans and ALA lower systolic blood pressure and arterial stiffness.',
      metabolism: 'Suppresses postprandial glucose surges and improves insulin sensitivity.'
    }
  },
  'olive-oil': {
    scores: { brain: 92, muscle: 40, gut: 70, heart: 99, metabolism: 85 },
    reasons: {
      brain: 'Oleocanthal and Oleic acid protect against neurodegenerative tau protein aggregation.',
      muscle: 'Provides zero protein, but anti-inflammatory polyphenols assist cellular recovery.',
      gut: 'Stimulates bile acid secretion and supports healthy gut mucosal lining.',
      heart: 'The cornerstone of the Mediterranean diet — dramatically reduces LDL oxidation and stroke risk.',
      metabolism: 'Monounsaturated fats enhance GLUT-4 glucose transporter expression.'
    }
  },
  'avocado-oil': {
    scores: { brain: 88, muscle: 35, gut: 65, heart: 96, metabolism: 84 },
    reasons: {
      brain: 'High Oleic acid and Lutein support cerebrovascular blood flow and lipid membrane stability.',
      muscle: 'Zero protein; high smoke point makes it ideal for healthy cooking without toxic oxidation.',
      gut: 'Gently stimulates digestive bile secretion without gut irritation.',
      heart: 'Rich in monounsaturated fats that lower LDL cholesterol and maintain vascular compliance.',
      metabolism: 'Zero carbs keep blood glucose and fasting insulin baseline steady.'
    }
  },
  'macadamia-nuts': {
    scores: { brain: 82, muscle: 50, gut: 75, heart: 88, metabolism: 85 },
    reasons: {
      brain: 'High in Palmitoleic acid (Omega-7) which supports brain myelin sheath lipid structure.',
      muscle: 'Provides Magnesium and Thiamine for muscular cellular energy output.',
      gut: 'Contains soluble fiber and healthy fats that support digestive motility.',
      heart: 'Rich in monounsaturated fats that optimize blood lipid parameters.',
      metabolism: 'Very low carbohydrate content makes it ideal for keto and metabolic flexibility.'
    }
  },
  'grass-fed-butter': {
    scores: { brain: 82, muscle: 35, gut: 70, heart: 75, metabolism: 78 },
    reasons: {
      brain: 'Provides Vitamin K2 (MK-4), Omega-3s, and Butyrate supporting brain vascular health.',
      muscle: 'Contains CLA (Conjugated Linoleic Acid) assisting metabolic fat-to-muscle ratio.',
      gut: 'Rich in Butyric acid, the primary short-chain fatty acid fuel for colonocytes.',
      heart: 'Vitamin K2 prevents arterial calcification by directing calcium into bones.',
      metabolism: 'Zero net carbs maintain baseline glycemic control.'
    }
  },
  'regular-butter': {
    scores: { brain: 75, muscle: 35, gut: 68, heart: 60, metabolism: 70 },
    reasons: {
      brain: 'Contains Vitamin A and saturated fats needed for hormone and neural structure.',
      muscle: 'Zero protein; provides energy-dense lipids.',
      gut: 'Provides natural Butyric acid supporting intestinal epithelial cells.',
      heart: 'High saturated fat profile; best consumed in moderate whole-food portions.',
      metabolism: 'Zero carbohydrate impact on post-meal blood sugar levels.'
    }
  },
  'coconut-oil': {
    scores: { brain: 92, muscle: 35, gut: 65, heart: 68, metabolism: 90 },
    reasons: {
      brain: 'Medium-Chain Triglycerides (MCTs: Lauric & Caprylic acid) convert into Ketones for instant brain energy.',
      muscle: 'MCT fats bypass normal digestion for rapid cellular ATP energy.',
      gut: 'Lauric acid exerts natural antimicrobial actions against pathogenic gut yeasts.',
      heart: 'Raises HDL cholesterol, though saturated fat requires dietary balance.',
      metabolism: 'MCTs increase 24-hour energy expenditure and fat oxidation.'
    }
  },

  // --- SUPERFOODS & BERRIES ---
  'blueberries': {
    scores: { brain: 98, muscle: 40, gut: 92, heart: 94, metabolism: 82 },
    reasons: {
      brain: 'Unmatched Anthocyanin concentration crosses the blood-brain barrier to stimulate BDNF and memory formation.',
      muscle: 'Potent polyphenols neutralize exercise-induced reactive oxygen species (ROS).',
      gut: 'Soluble pectin fiber and polyphenols selectively increase beneficial Bifidobacteria strains.',
      heart: 'Clinical trials demonstrate significant improvements in endothelial nitric oxide dilation.',
      metabolism: 'Low glycemic index fruit that modulates carbohydrate digestion enzymes.'
    }
  },
  'acai-berry': {
    scores: { brain: 96, muscle: 40, gut: 88, heart: 94, metabolism: 85 },
    reasons: {
      brain: 'Extremely high ORAC antioxidant rating & Anthocyanins protect neural tissues from oxidative decay.',
      muscle: 'Contains healthy Omega-9 fats and plant sterols assisting recovery.',
      gut: 'Dietary fiber and polyphenols nourish gut mucosal microbiome.',
      heart: 'Plant sterols and polyphenols support healthy blood lipid ratios.',
      metabolism: 'Unusually low sugar content for a berry ensures minimal glycemic response.'
    }
  },
  'goji-berries': {
    scores: { brain: 90, muscle: 50, gut: 90, heart: 88, metabolism: 80 },
    reasons: {
      brain: 'Rich in Zeaxanthin, Betaine, and Lycium Barbarum Polysaccharides (LBP) for neuroprotection.',
      muscle: 'Contains 18 amino acids including 8 essential amino acids.',
      gut: 'LBP polysaccharides act as powerful prebiotics for gut immunity.',
      heart: 'Antioxidants protect cardiac tissues from oxidative micro-damage.',
      metabolism: 'Low-GI dried super-berry supporting steady blood glucose levels.'
    }
  },
  'dark-chocolate': {
    scores: { brain: 94, muscle: 55, gut: 90, heart: 96, metabolism: 78 },
    reasons: {
      brain: 'Flavanols and Caffeine/Theobromine increase cerebral blood flow and acute mental alertness.',
      muscle: 'High Magnesium (228mg/100g) aids muscle relaxation and ATP energy generation.',
      gut: 'Cocoa polyphenols act as prebiotics, increasing Lactobacillus and Bifidobacterium counts.',
      heart: 'Flavanols stimulate endothelial Nitric Oxide production, reducing blood pressure.',
      metabolism: 'Epicatechins enhance mitochondrial biogenesis and insulin sensitivity.'
    }
  },
  'cacao-nibs': {
    scores: { brain: 96, muscle: 55, gut: 92, heart: 96, metabolism: 85 },
    reasons: {
      brain: 'Pure unrefined cacao rich in Theobromine and Flavanols boosting cognitive processing speed.',
      muscle: 'Abundant Magnesium (270mg/100g) prevents muscle cramps and aids recovery.',
      gut: 'Loaded with 11g insoluble dietary fiber per 100g feeding beneficial gut microbes.',
      heart: 'Polyphenols dilate blood vessels and enhance Nitric Oxide synthesis.',
      metabolism: 'Zero added sugar content keeps insulin response exceptionally flat.'
    }
  },
  'matcha': {
    scores: { brain: 98, muscle: 45, gut: 85, heart: 92, metabolism: 92 },
    reasons: {
      brain: 'L-Theanine + Caffeine synergy induces calm focus (alpha brainwaves) without jittery energy crashes.',
      muscle: 'EGCG catechins reduce post-exercise muscular oxidative stress.',
      gut: 'Tea polyphenols inhibit pathogenic gut bacteria while preserving commensal species.',
      heart: 'Potent catechins improve arterial elasticity and lower vascular oxidation.',
      metabolism: 'EGCG boosts fat oxidation and metabolic rate during exercise.'
    }
  },
  'turmeric': {
    scores: { brain: 95, muscle: 60, gut: 94, heart: 92, metabolism: 88 },
    reasons: {
      brain: 'Curcumin crosses blood-brain barrier to clear beta-amyloid plaques and boost BDNF growth factor.',
      muscle: 'Potent natural NF-kB inhibitor, suppressing post-workout systemic inflammatory soreness.',
      gut: 'Helps restore intestinal barrier integrity and reduces gut permeability (leaky gut).',
      heart: 'Endothelial function improvement comparable to aerobic exercise training.',
      metabolism: 'Down-regulates inflammatory signaling pathways linked to insulin resistance.'
    }
  },
  'ginger-root': {
    scores: { brain: 88, muscle: 55, gut: 98, heart: 92, metabolism: 90 },
    reasons: {
      brain: 'Gingerol antioxidants protect against neuro-inflammatory cognitive decline.',
      muscle: 'Clinical studies show 2g daily ginger reduces delayed onset muscle soreness (DOMS).',
      gut: 'Potent prokinetic agent — accelerates gastric emptying and alleviates nausea and bloating.',
      heart: 'Helps lower blood pressure and inhibits blood platelet aggregation.',
      metabolism: 'Enhances thermogenesis and improves fasting insulin sensitivity.'
    }
  },
  'pomegranate': {
    scores: { brain: 94, muscle: 50, gut: 92, heart: 98, metabolism: 85 },
    reasons: {
      brain: 'Punicalagins convert into Urolithin A in gut, triggering neuronal mitophagy and renewal.',
      muscle: 'Polyphenols enhance post-exercise muscle recovery and isometric strength.',
      gut: 'Ellagitannins feed gut bacteria to generate anti-aging Urolithin metabolites.',
      heart: 'Proven to reduce carotid artery intima-media thickness and boost Nitric Oxide.',
      metabolism: 'Polyphenols modulate alpha-glucosidase enzyme to smooth blood sugar response.'
    }
  },
  'spirulina': {
    scores: { brain: 90, muscle: 85, gut: 85, heart: 90, metabolism: 90 },
    reasons: {
      brain: 'Phycocyanin antioxidant protects brain tissue against neuro-inflammatory stress.',
      muscle: '60% complete protein by weight with high bio-available iron and chlorophyll.',
      gut: 'Acts as a prebiotic promoting beneficial gut microflora growth.',
      heart: 'Significantly reduces total cholesterol, LDL, and lipid peroxidation markers.',
      metabolism: 'Enhances insulin sensitivity and cellular metabolic efficiency.'
    }
  },
  'kimchi': {
    scores: { brain: 85, muscle: 45, gut: 100, heart: 85, metabolism: 88 },
    reasons: {
      brain: 'Gut-brain axis signaling via GABA and short-chain fatty acids produced by fermentation.',
      muscle: 'Provides bioavailable B-vitamins and minerals created by lactic fermentation.',
      gut: 'The ultimate gut superfood: billions of live Lactobacillus probiotics + prebiotic cabbage fiber.',
      heart: 'Fermented garlic and red pepper active compounds reduce blood pressure and lipid oxidation.',
      metabolism: 'Probiotics regulate gut hormone signaling (GLP-1) for improved glucose control.'
    }
  },
  'greek-yogurt': {
    scores: { brain: 78, muscle: 90, gut: 95, heart: 80, metabolism: 85 },
    reasons: {
      brain: 'Provides B12, Iodine, and Tyrosine for brain neurotransmitter synthesis.',
      muscle: 'Strained dairy yielding 10g protein per 100g with fast (whey) and slow (casein) proteins.',
      gut: 'Live active cultures (L. bulgaricus, S. thermophilus) fortify gut microbiome diversity.',
      heart: 'Calcium and Potassium support blood pressure regulation.',
      metabolism: 'High protein content promotes thermogenesis and long-lasting satiety.'
    }
  },
  'chia-pudding': {
    scores: { brain: 86, muscle: 60, gut: 96, heart: 90, metabolism: 88 },
    reasons: {
      brain: 'Provides ALA Omega-3s, Magnesium, and Calcium for nerve signal transmission.',
      muscle: 'Contains complete amino acids and minerals supporting cellular hydration.',
      gut: 'Mucilage soluble fiber creates a soothing intestinal gel that feeds gut microbes.',
      heart: 'Soluble fiber binds excess bile acids to optimize cholesterol balance.',
      metabolism: 'Gel matrix slows digestive glucose release for smooth energy.'
    }
  },
  'bone-broth': {
    scores: { brain: 85, muscle: 85, gut: 98, heart: 80, metabolism: 82 },
    reasons: {
      brain: 'Glycine amino acid acts as an inhibitory neurotransmitter promoting deep REM sleep and brain repair.',
      muscle: 'Rich in Collagen, Proline, and Hydroxyproline for tendon, joint, and connective tissue recovery.',
      gut: 'Glutamine directly seals and repairs the intestinal epithelial mucosal lining.',
      heart: 'Glycine regulates nitric oxide synthesis and vascular function.',
      metabolism: 'High protein satiety with zero carbohydrate impact.'
    }
  },

  // --- VEGETABLES ---
  'broccoli': {
    scores: { brain: 88, muscle: 60, gut: 96, heart: 90, metabolism: 88 },
    reasons: {
      brain: 'Sulforaphane crosses into brain tissue to upregulate Nrf2 antioxidant defense pathways.',
      muscle: 'Provides Calcium, Potassium, and Vitamin C needed for collagen and muscle function.',
      gut: 'Prebiotic fiber and glucosinolates feed beneficial gut bacteria and fortify mucus layers.',
      heart: 'Sulforaphane protects arterial walls from oxidative inflammatory plaque build-up.',
      metabolism: 'Low calorie density and high fiber suppress postprandial glucose spikes.'
    }
  },
  'spinach': {
    scores: { brain: 92, muscle: 70, gut: 92, heart: 96, metabolism: 86 },
    reasons: {
      brain: 'Loaded with Lutein, Folate, and Magnesium — key nutrients linked to slower cognitive decline.',
      muscle: 'Dietary Nitrates improve mitochondrial energy efficiency during muscular exertion.',
      gut: 'Sulfoquinovose sugar feeds beneficial gut bacteria like Eubacterium rectale.',
      heart: 'High inorganic Nitrates dilate blood vessels, significantly lowering blood pressure.',
      metabolism: 'Magnesium and fiber assist cellular insulin receptor binding.'
    }
  },
  'kale': {
    scores: { brain: 94, muscle: 65, gut: 95, heart: 94, metabolism: 88 },
    reasons: {
      brain: 'Abundant in Vitamin K1, Lutein, and Beta-carotene supporting neural structure integrity.',
      muscle: 'Provides Plant Calcium, Potassium, and Anti-inflammatory flavonoids for recovery.',
      gut: 'High insoluble fiber content supports intestinal peristalsis and microbiome balance.',
      heart: 'Binds bile acids in the digestive tract to lower circulating blood cholesterol.',
      metabolism: 'Extremely low glycemic load with high nutrient-to-calorie ratio.'
    }
  },
  'asparagus': {
    scores: { brain: 88, muscle: 55, gut: 96, heart: 92, metabolism: 90 },
    reasons: {
      brain: 'High Folate (52% DV) & Glutathione — the brain’s master cellular antioxidant defender.',
      muscle: 'Supplies Potassium and Asparagine assisting fluid balance and muscle recovery.',
      gut: 'Top natural source of Inulin prebiotic fiber feeding beneficial Bifidobacteria.',
      heart: 'Rutine flavonoid strengthens capillary walls and improves blood circulation.',
      metabolism: 'Natural diuretic properties support fluid balance and metabolic cleanup.'
    }
  },
  'cauliflower': {
    scores: { brain: 86, muscle: 50, gut: 92, heart: 88, metabolism: 90 },
    reasons: {
      brain: 'Rich in Choline (45mg/100g) essential for brain development and neurotransmitter production.',
      muscle: 'Provides Vitamin C and Potassium needed for soft tissue maintenance.',
      gut: 'Glucosinolates and dietary fiber nourish gut lining and beneficial microbes.',
      heart: 'Sulforaphane aids endothelial health and arterial compliance.',
      metabolism: 'Ultra-low calorie density (25 kcal/100g) ideal for metabolic weight management.'
    }
  },
  'garlic': {
    scores: { brain: 88, muscle: 50, gut: 94, heart: 98, metabolism: 90 },
    reasons: {
      brain: 'S-allylcysteine antioxidants protect brain cells against oxidative degradation.',
      muscle: 'Increases tissue nitric oxide levels for enhanced nutrient delivery.',
      gut: 'Inulin prebiotic fiber feeds beneficial gut microbes while organosulfurs inhibit pathogens.',
      heart: 'Allicin compound reduces blood pressure and arterial stiffness as effectively as medications in trials.',
      metabolism: 'Improves fasting insulin sensitivity and lipid metabolism.'
    }
  },
  'shiitake-mushroom': {
    scores: { brain: 90, muscle: 55, gut: 96, heart: 92, metabolism: 88 },
    reasons: {
      brain: 'Contains Ergothioneine — a unique longevity antioxidant that concentrates in brain mitochondria.',
      muscle: 'Provides Copper and Selenium essential for muscular cellular energy production.',
      gut: 'Lentinan beta-glucan polysaccharides stimulate gut mucosal immunity and gut barrier flora.',
      heart: 'Eritadenine compound actively lowers circulating blood cholesterol levels.',
      metabolism: 'Beta-glucans slow glucose absorption for smooth postprandial energy.'
    }
  },
  'sweet-potato': {
    scores: { brain: 82, muscle: 75, gut: 92, heart: 88, metabolism: 75 },
    reasons: {
      brain: 'Beta-carotene antioxidant converts to Vitamin A needed for neurodevelopment.',
      muscle: 'Provides clean complex carbs to replenish muscle glycogen along with 337mg Potassium.',
      gut: 'Rich in soluble fiber and resistant starch that feeds gut microbial species.',
      heart: 'High Potassium balances Sodium to maintain healthy blood pressure levels.',
      metabolism: 'Moderate glycemic index carbohydrate with high satiety index.'
    }
  },
  'brussels-sprouts': {
    scores: { brain: 88, muscle: 55, gut: 95, heart: 92, metabolism: 88 },
    reasons: {
      brain: 'High Vitamin K (177% DV) & ALA Omega-3s essential for brain sphingolipid cell membranes.',
      muscle: 'Provides 3.4g plant protein and Vitamin C for collagen synthesis.',
      gut: 'Glucosinolates and 3.8g fiber nourish gut mucosa and beneficial flora.',
      heart: 'Kaempferol antioxidant lowers vascular inflammation and protects blood vessels.',
      metabolism: 'Low calorie density and high fiber promote long-lasting satiety.'
    }
  },
  'red-beets': {
    scores: { brain: 92, muscle: 75, gut: 88, heart: 99, metabolism: 85 },
    reasons: {
      brain: 'Inorganic Nitrates increase blood flow specifically to the brain’s frontal lobe for decision speed.',
      muscle: 'Nitrates boost muscular mitochondrial efficiency, enhancing athletic endurance.',
      gut: 'Betalain pigments and fiber protect intestinal mucosal integrity.',
      heart: 'Clinically proven to lower blood pressure within 3 hours via Nitric Oxide vasodilation.',
      metabolism: 'Improves exercise oxygen uptake and metabolic energy efficiency.'
    }
  },
  'carrots': {
    scores: { brain: 85, muscle: 40, gut: 88, heart: 88, metabolism: 82 },
    reasons: {
      brain: 'Lutein and Beta-carotene antioxidants reduce oxidative stress in neural tissues.',
      muscle: 'Provides Potassium and Vitamin C for cellular maintenance.',
      gut: 'Pectin soluble fiber binds gut toxins and feeds beneficial short-chain fatty acid bacteria.',
      heart: 'Soluble fiber actively lowers dietary cholesterol reabsorption.',
      metabolism: 'Low glycemic load root vegetable with high dietary volume.'
    }
  },
  'zucchini': {
    scores: { brain: 78, muscle: 40, gut: 88, heart: 88, metabolism: 90 },
    reasons: {
      brain: 'Contains Lutein & Zeaxanthin supporting brain signal speed and ocular health.',
      muscle: 'Provides Potassium (261mg) for muscle hydration and contraction.',
      gut: 'High water content (95%) and soluble fiber ensure smooth gastrointestinal transit.',
      heart: 'Potassium and low sodium help maintain healthy vascular fluid balance.',
      metabolism: 'Only 17 kcal/100g — an ideal low-carb volume food.'
    }
  },
  'red-bell-pepper': {
    scores: { brain: 88, muscle: 45, gut: 85, heart: 92, metabolism: 88 },
    reasons: {
      brain: 'Massive Vitamin C content (213% DV) protects cerebral tissues against oxidative stress.',
      muscle: 'Vitamin C is essential for collagen synthesis in tendons and cartilage.',
      gut: 'Dietary fiber and capsanthin carotenoids support digestive gut flora.',
      heart: 'Capsanthin antioxidant and Potassium improve cardiovascular endothelial health.',
      metabolism: 'Low calorie density with zero glycemic impact.'
    }
  },
  'artichoke': {
    scores: { brain: 88, muscle: 48, gut: 100, heart: 95, metabolism: 90 },
    reasons: {
      brain: 'Highest antioxidant capacity of all fresh vegetables, protecting brain cells from free radicals.',
      muscle: 'Provides Potassium (370mg) and Magnesium for muscular signaling.',
      gut: 'Unmatched 8.6g dietary fiber per 100g, packed with prebiotic Inulin for peak gut health.',
      heart: 'Cynarin active compound stimulates bile flow and actively lowers LDL cholesterol.',
      metabolism: 'Inulin fiber prevents postprandial blood sugar spikes.'
    }
  }
};

/**
 * Generates dynamic, realistic fallback Biohack scores for any food item not in the explicit database
 */
export function getBiohackData(food) {
  if (!food) {
    return {
      scores: { brain: 50, muscle: 50, gut: 50, heart: 50, metabolism: 50 },
      reasons: {
        brain: 'Provides essential dietary nutrients for metabolic function.',
        muscle: 'Contains dietary macronutrients supporting tissue maintenance.',
        gut: 'Supports basic digestive passage and gastrointestinal function.',
        heart: 'Contributes to daily electrolyte and circulatory balance.',
        metabolism: 'Provides caloric energy for cellular metabolic processes.'
      }
    };
  }

  // Check explicit database first
  if (biohackDatabase[food.id]) {
    return biohackDatabase[food.id];
  }

  // Helper numeric parser
  const parseNum = (str) => (str ? parseFloat(str.match(/[\d.]+/)?.[0] || '0') : 0);

  const protein = food.macros?.protein || 0;
  const fat = food.macros?.fat || 0;
  const carbs = food.macros?.carbs || 0;
  const calories = food.calories || 100;
  const potassium = parseNum(food.micros?.potassium);
  const magnesium = parseNum(food.micros?.magnesium);
  const fiber = parseNum(food.micros?.fiber);

  // Dynamic scientific calculation fallback
  const brainScore = Math.min(95, Math.max(25, Math.round(30 + (magnesium / 45) * 35 + (fat > 8 ? 20 : 5) + (protein > 15 ? 10 : 0))));
  const muscleScore = Math.min(98, Math.max(15, Math.round(15 + (protein / 28) * 75 + (potassium > 250 ? 8 : 0))));
  const gutScore = Math.min(98, Math.max(20, Math.round(20 + (fiber / 5) * 65 + (food.category === 'Vegetables' ? 12 : 0))));
  const heartScore = Math.min(96, Math.max(25, Math.round(30 + (potassium / 350) * 45 + (fiber > 2 ? 15 : 0) + (fat < 15 ? 10 : 0))));
  const metabolismScore = Math.min(95, Math.max(20, Math.round(30 + (1 - Math.min(1, carbs / 60)) * 40 + (protein > 12 ? 20 : 5))));

  return {
    scores: {
      brain: brainScore,
      muscle: muscleScore,
      gut: gutScore,
      heart: heartScore,
      metabolism: metabolismScore
    },
    reasons: {
      brain: `Delivers ${magnesium ? `${magnesium}mg Magnesium & ` : ''}${fat > 5 ? 'healthy fats' : 'micronutrients'} supporting neural signaling.`,
      muscle: `Provides ${protein}g protein per 100g serving to assist muscle tissue recovery and amino acid balance.`,
      gut: `Contains ${fiber}g dietary fiber helping support healthy gastrointestinal motility.`,
      heart: `Supplies ${potassium}mg Potassium to assist circulatory balance and blood pressure regulation.`,
      metabolism: `Balanced macronutrient profile with ${calories} kcal/100g energy density.`
    }
  };
}
