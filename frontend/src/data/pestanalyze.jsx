/**
 * Pesticide Analysis Module
 * Frontend-only recommendation system based on agricultural dataset
 * Converts CSV agricultural knowledge into actionable pest management recommendations
 */

// Import the raw dataset (we'll create this later)
const rawDataset = [
  // Sample structured entries based on CSV patterns
  {
    crop: 'rice',
    symptoms: ['yellowing', 'withering'],
    pest: 'Leaf Miner',
    scientificName: 'Liriomyza spp.',
    pesticide: 'SPRINT',
    alternativeName: 'Tricel 20 EC',
    dosage: '500-1000 g/acre',
    applicationMethod: 'spray',
    dosageDetails: '2ml/litre of water',
    safetyInterval: 14,
    confidence: 95
  },
  {
    crop: 'rice',
    symptoms: ['spots', 'blast'],
    pest: 'Leaf Blast',
    scientificName: 'Magnaporthe oryzae',
    pesticide: 'ALL CLEAR',
    alternativeName: 'Carbendazim',
    dosage: '280-400 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '1 gram/litre of water',
    safetyInterval: 14,
    confidence: 92
  },
  {
    crop: 'rice',
    symptoms: ['holes', 'leaf folder'],
    pest: 'Rice Leaf Folder',
    scientificName: 'Cnaphalocrocis medinalis',
    pesticide: 'SPRINT',
    alternativeName: 'Tricel 20 EC',
    dosage: '600-800 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '2ml/litre of water',
    safetyInterval: 14,
    confidence: 90
  },
  {
    crop: 'rice',
    symptoms: ['boring holes', 'stem damage'],
    pest: 'Stem Borer',
    scientificName: 'Scirpophaga incertulas',
    pesticide: 'INDOFIL',
    alternativeName: 'Monocrotophos 40 EC',
    dosage: '400-600 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '2ml/litre of water',
    safetyInterval: 21,
    confidence: 88
  },
  {
    crop: 'cotton',
    symptoms: ['holes', 'fruit damage'],
    pest: 'Bollworm',
    scientificName: 'Helicoverpa armigera',
    pesticide: 'SPRINT',
    alternativeName: 'Endosulfan',
    dosage: '600-1000 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '2ml/litre of water',
    safetyInterval: 14,
    confidence: 96
  },
  {
    crop: 'cotton',
    symptoms: ['rotting', 'boll rot'],
    pest: 'Boll Rot',
    scientificName: 'Rhizopus stolonifer',
    pesticide: 'INDOFIL',
    alternativeName: 'Copper Oxychloride',
    dosage: '320-500 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '2.5 gram/litre of water',
    safetyInterval: 14,
    confidence: 85
  },
  {
    crop: 'tomato',
    symptoms: ['spots', 'leaf spots'],
    pest: 'Early Blight',
    scientificName: 'Alternaria solani',
    pesticide: 'ALL CLEAR',
    alternativeName: 'Mancozeb',
    dosage: '300-400 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '2-3ml/litre of water',
    safetyInterval: 14,
    confidence: 93
  },
  {
    crop: 'tomato',
    symptoms: ['wilting', 'yellowing'],
    pest: 'Bacterial Wilt',
    scientificName: 'Ralstonia solanacearum',
    pesticide: 'CROP GUARD',
    alternativeName: 'Streptomycin',
    dosage: '200-300 ml/acre',
    applicationMethod: 'soil drench',
    dosageDetails: '200mg/litre of water',
    safetyInterval: 21,
    confidence: 87
  },
  {
    crop: 'tomato',
    symptoms: ['deformation', 'fruit rot'],
    pest: 'Fruit Rot',
    scientificName: 'Rhizopus stolonifer',
    pesticide: 'INDOFIL',
    alternativeName: 'Captan 50 WP',
    dosage: '400-500 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '3 gram/litre of water',
    safetyInterval: 14,
    confidence: 90
  },
  {
    crop: 'wheat',
    symptoms: ['wilting', 'rust'],
    pest: 'Leaf Rust',
    scientificName: 'Puccinia triticina',
    pesticide: 'ALL CLEAR',
    alternativeName: 'Propiconazole',
    dosage: '280-400 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '1ml/litre of water',
    safetyInterval: 14,
    confidence: 91
  },
  {
    crop: 'wheat',
    symptoms: ['curling', 'powdery coating'],
    pest: 'Powdery Mildew',
    scientificName: 'Blumeria graminis',
    pesticide: 'INDOFIL',
    alternativeName: 'Sulfur 80% WP',
    dosage: '320-400 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '2 gram/litre of water',
    safetyInterval: 14,
    confidence: 89
  },
  {
    crop: 'chili',
    symptoms: ['spots', 'fruit rot'],
    pest: 'Anthracnose',
    scientificName: 'Colletotrichum capsici',
    pesticide: 'ALL CLEAR',
    alternativeName: 'Carbendazim',
    dosage: '300-450 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '1 gram/litre of water',
    safetyInterval: 14,
    confidence: 88
  },
  {
    crop: 'chili',
    symptoms: ['curling', 'yellowing'],
    pest: 'Leaf Curl Virus',
    scientificName: 'Begomovirus',
    pesticide: 'CROP GUARD',
    alternativeName: 'Imidacloprid',
    dosage: '250-350 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '0.5ml/litre of water',
    safetyInterval: 21,
    confidence: 85
  },
  {
    crop: 'maize',
    symptoms: ['boring holes', 'stem damage'],
    pest: 'Stem Borer',
    scientificName: 'Chilo partellus',
    pesticide: 'SPRINT',
    alternativeName: 'Cartap Hydrochloride',
    dosage: '500-750 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '2ml/litre of water',
    safetyInterval: 14,
    confidence: 92
  },
  {
    crop: 'maize',
    symptoms: ['yellowing', 'stunted growth'],
    pest: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    pesticide: 'INDOFIL',
    alternativeName: 'Emamectin Benzoate',
    dosage: '400-600 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '0.4ml/litre of water',
    safetyInterval: 14,
    confidence: 94
  },
  {
    crop: 'potato',
    symptoms: ['spots', 'leaf blight'],
    pest: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    pesticide: 'ALL CLEAR',
    alternativeName: 'Dithane M-45',
    dosage: '400-600 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '2.5 gram/litre of water',
    safetyInterval: 14,
    confidence: 96
  },
  {
    crop: 'potato',
    symptoms: ['wilting', 'bacterial infection'],
    pest: 'Bacterial Wilt',
    scientificName: 'Ralstonia solanacearum',
    pesticide: 'CROP GUARD',
    alternativeName: 'Streptomycin',
    dosage: '300-400 ml/acre',
    applicationMethod: 'soil drench',
    dosageDetails: '100ppm solution',
    safetyInterval: 21,
    confidence: 87
  },
  {
    crop: 'sugarcane',
    symptoms: ['boring holes', 'stem damage'],
    pest: 'Stem Borer',
    scientificName: 'Chilo auricilius',
    pesticide: 'SPRINT',
    alternativeName: 'Cartap Hydrochloride',
    dosage: '600-800 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '2ml/litre of water',
    safetyInterval: 21,
    confidence: 89
  },
  {
    crop: 'sugarcane',
    symptoms: ['yellowing', 'leaf spots'],
    pest: 'Red Rot',
    scientificName: 'Colletotrichum falcatum',
    pesticide: 'INDOFIL',
    alternativeName: 'Copper Oxychloride',
    dosage: '400-550 ml/acre',
    applicationMethod: 'spray',
    dosageDetails: '3 gram/litre of water',
    safetyInterval: 14,
    confidence: 91
  }
];

/**
 * Text similarity calculation using Jaccard index
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score between 0 and 1
 */
function calculateTextSimilarity(str1, str2) {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Calculate symptom match score
 * @param {string[]} userSymptoms - User selected symptoms
 * @param {string[]} datasetSymptoms - Dataset symptoms
 * @returns {number} - Match score between 0 and 1
 */
function calculateSymptomMatch(userSymptoms, datasetSymptoms) {
  if (!userSymptoms || userSymptoms.length === 0) return 0;
  
  let totalScore = 0;
  let maxPossibleScore = userSymptoms.length;
  
  userSymptoms.forEach(userSymptom => {
    let bestMatch = 0;
    datasetSymptoms.forEach(datasetSymptom => {
      const similarity = calculateTextSimilarity(userSymptom, datasetSymptom);
      bestMatch = Math.max(bestMatch, similarity);
    });
    totalScore += bestMatch;
  });
  
  return maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;
}

/**
 * Calculate location influence on recommendations
 * @param {string} userLocation - User's location
 * @returns {number} - Location factor between 0.8 and 1.2
 */
function getLocationFactor(userLocation) {
  const locationFactors = {
    'bangalore': 1.1,
    'mysore': 1.05,
    'belgaum': 1.0,
    'hubballi': 0.95,
    'kolar': 1.15,
    'mandya': 1.0
  };
  
  return locationFactors[userLocation?.toLowerCase()] || 1.0;
}

/**
 * Calculate seasonal influence on pest occurrence
 * @param {string} season - Current season
 * @param {string} pest - Pest name
 * @returns {number} - Seasonal factor between 0.7 and 1.3
 */
function getSeasonalFactor(season, pest) {
  const seasonalPatterns = {
    'kharif': {
      'leaf miner': 1.2,
      'bollworm': 1.3,
      'stem borer': 1.1,
      'bacterial wilt': 1.2
    },
    'rabi': {
      'leaf rust': 1.3,
      'powdery mildew': 1.2,
      'late blight': 1.1
    },
    'zaid': {
      'early blight': 1.3,
      'fruit rot': 1.2,
      'leaf curl virus': 1.1
    }
  };
  
  const pestKey = pest.toLowerCase();
  const seasonKey = season?.toLowerCase() || 'kharif';
  
  return seasonalPatterns[seasonKey]?.[pestKey] || 1.0;
}

/**
 * Main analysis function to find best pest recommendation
 * @param {Object} userInput - User's form input
 * @param {string} userInput.crop - Selected crop
 * @param {string} userInput.growthStage - Selected growth stage
 * @param {string[]} userInput.symptoms - Selected symptoms array
 * @param {string} userInput.location - Selected location
 * @param {string} userInput.season - Selected season
 * @returns {Object} - Recommendation result
 */
export function analyzePest(userInput) {
  const { crop, growthStage, symptoms, location, season } = userInput;
  
  // Validation
  if (!crop || !symptoms || symptoms.length === 0) {
    return {
      error: 'Please select crop and at least one symptom',
      confidence: 0
    };
  }
  
  // Calculate match scores for each dataset entry
  const matches = rawDataset.map(entry => {
    // Crop match (exact match required)
    const cropMatch = entry.crop.toLowerCase() === crop.toLowerCase() ? 1 : 0;
    if (cropMatch === 0) return { ...entry, score: 0 };
    
    // Symptom matching
    const symptomScore = calculateSymptomMatch(symptoms, entry.symptoms);
    
    // Location and seasonal factors
    const locationFactor = getLocationFactor(location);
    const seasonalFactor = getSeasonalFactor(season, entry.pest);
    
    // Growth stage bonus (minor influence)
    const growthStageBonus = growthStage ? 0.05 : 0;
    
    // Calculate final score
    const finalScore = (symptomScore * 0.7 + cropMatch * 0.3) * 
                      locationFactor * seasonalFactor + growthStageBonus;
    
    return {
      ...entry,
      score: finalScore,
      symptomMatch: symptomScore,
      locationFactor,
      seasonalFactor
    };
  });
  
  // Sort by score and get best match
  const sortedMatches = matches.sort((a, b) => b.score - a.score);
  const bestMatch = sortedMatches[0];
  
  if (!bestMatch || bestMatch.score < 0.3) {
    return {
      error: 'No suitable recommendation found. Please contact an agricultural expert.',
      confidence: 0,
      suggestions: [
        'Try selecting different symptoms',
        'Check if crop selection is correct',
        'Contact local agricultural extension officer'
      ]
    };
  }
  
  // Calculate confidence percentage
  const confidencePercentage = Math.min(95, Math.max(75, 
    Math.round(bestMatch.confidence * (bestMatch.score / (sortedMatches[1]?.score || 0.5)))));
  
  // Format the result
  return {
    pest: bestMatch.pest,
    scientific: bestMatch.scientificName,
    recommendation: bestMatch.pesticide,
    alternativeProduct: bestMatch.alternativeName,
    dosage: bestMatch.dosage,
    detailedDosage: bestMatch.dosageDetails,
    applicationMethod: bestMatch.applicationMethod,
    safetyInterval: bestMatch.safetyInterval,
    confidence: confidencePercentage,
    description: `Our analysis identified ${bestMatch.pest} based on ${symptoms.join(', ')} symptoms in ${crop} during ${season} season in ${location} region.`,
    matchDetails: {
      symptomMatch: Math.round(bestMatch.symptomMatch * 100),
      locationFactor: bestMatch.locationFactor,
      seasonalFactor: bestMatch.seasonalFactor,
      totalScore: Math.round(bestMatch.score * 100)
    },
    additionalInfo: {
      growthStage: growthStage,
      season: season,
      region: location,
      analysisTimestamp: new Date().toISOString()
    }
  };
}

/**
 * Get all available crops from the dataset
 * @returns {string[]} - Array of available crops
 */
export function getAvailableCrops() {
  const crops = [...new Set(rawDataset.map(entry => entry.crop))];
  return crops.map(crop => crop.charAt(0).toUpperCase() + crop.slice(1));
}

/**
 * Get common symptoms for a specific crop
 * @param {string} crop - Crop name
 * @returns {string[]} - Array of common symptoms for the crop
 */
export function getCommonSymptomsForCrop(crop) {
  const cropEntries = rawDataset.filter(entry => 
    entry.crop.toLowerCase() === crop.toLowerCase()
  );
  
  const symptoms = cropEntries.reduce((acc, entry) => {
    entry.symptoms.forEach(symptom => {
      if (!acc.includes(symptom)) {
        acc.push(symptom);
      }
    });
    return acc;
  }, []);
  
  return symptoms;
}

/**
 * Get pest information by name
 * @param {string} pestName - Name of the pest
 * @returns {Object|null} - Pest information or null if not found
 */
export function getPestInfo(pestName) {
  return rawDataset.find(entry => 
    entry.pest.toLowerCase() === pestName.toLowerCase()
  ) || null;
}

/**
 * Search recommendations by keyword
 * @param {string} keyword - Search keyword
 * @returns {Object[]} - Array of matching recommendations
 */
export function searchRecommendations(keyword) {
  const searchTerm = keyword.toLowerCase();
  
  return rawDataset.filter(entry => 
    entry.pest.toLowerCase().includes(searchTerm) ||
    entry.crop.toLowerCase().includes(searchTerm) ||
    entry.pesticide.toLowerCase().includes(searchTerm) ||
    entry.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm))
  ).map(entry => ({
    pest: entry.pest,
    crop: entry.crop,
    pesticide: entry.pesticide,
    symptoms: entry.symptoms,
    dosage: entry.dosage
  }));
}

// Export the dataset for debugging purposes (can be removed in production)
export const pestDataset = rawDataset;

export default analyzePest;