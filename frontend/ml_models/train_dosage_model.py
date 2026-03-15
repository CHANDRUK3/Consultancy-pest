import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import os

# 1. Define combinations of Crop, Disease, Age
data = []
ages = {
    "Young (< 1 month)": 0,
    "Mature (1-3 months)": 1,
    "Old (> 3 months)": 2
}

# Rice mapping
rice_diseases = {
    'Bacterialblight': {
        'pest_en': 'Copper Hydroxide', 'pest_ta': 'காப்பர் ஹைட்ராக்சைடு',
        'dosages': ['1 g/L', '2 g/L', '3 g/L'],
        'dosages_ta': ['1 கிராம்/லிட்டர்', '2 கிராம்/லிட்டர்', '3 கிராம்/லிட்டர்'],
        'quants': ['200 g/Acre', '400 g/Acre', '600 g/Acre'],
        'quants_ta': ['200 கிராம்/ஏக்கர்', '400 கிராம்/ஏக்கர்', '600 கிராம்/ஏக்கர்']
    },
    'Blast': {
        'pest_en': 'Tricyclazole', 'pest_ta': 'ட்ரைசைக்ளாசோல்',
        'dosages': ['0.5 g/L', '0.6 g/L', '1.0 g/L'],
        'dosages_ta': ['0.5 கிராம்/லிட்டர்', '0.6 கிராம்/லிட்டர்', '1.0 கிராம்/லிட்டர்'],
        'quants': ['150 g/Acre', '200 g/Acre', '300 g/Acre'],
        'quants_ta': ['150 கிராம்/ஏக்கர்', '200 கிராம்/ஏக்கர்', '300 கிராம்/ஏக்கர்']
    },
    'Brownspot': {
        'pest_en': 'Mancozeb', 'pest_ta': 'மாங்கோசெப்',
        'dosages': ['1.5 g/L', '2.0 g/L', '2.5 g/L'],
        'dosages_ta': ['1.5 கிராம்/லிட்டர்', '2.0 கிராம்/லிட்டர்', '2.5 கிராம்/லிட்டர்'],
        'quants': ['300 g/Acre', '400 g/Acre', '500 g/Acre'],
        'quants_ta': ['300 கிராம்/ஏக்கர்', '400 கிராம்/ஏக்கர்', '500 கிராம்/ஏக்கர்']
    },
    'Tungro': {
        'pest_en': 'Imidacloprid', 'pest_ta': 'இமிடாகுளோபிரிட்',
        'dosages': ['0.2 ml/L', '0.3 ml/L', '0.5 ml/L'],
        'dosages_ta': ['0.2 மி.லி/லிட்டர்', '0.3 மி.லி/லிட்டர்', '0.5 மி.லி/லிட்டர்'],
        'quants': ['100 ml/Acre', '150 ml/Acre', '200 ml/Acre'],
        'quants_ta': ['100 மி.லி/ஏக்கர்', '150 மி.லி/ஏக்கர்', '200 மி.லி/ஏக்கர்']
    }
}

# Tomato mapping
tomato_diseases = {
    'EarlyBlight': {
        'pest_en': 'Chlorothalonil', 'pest_ta': 'குளோரோதாலோனில்',
        'dosages': ['1.5 g/L', '2.0 g/L', '2.5 g/L'],
        'dosages_ta': ['1.5 கிராம்/லிட்டர்', '2.0 கிராம்/லிட்டர்', '2.5 கிராம்/லிட்டர்'],
        'quants': ['350 g/Acre', '500 g/Acre', '750 g/Acre'],
        'quants_ta': ['350 கிராம்/ஏக்கர்', '500 கிராம்/ஏக்கர்', '750 கிராம்/ஏக்கர்']
    },
    'LateBlight': {
        'pest_en': 'Mancozeb & Metalaxyl', 'pest_ta': 'மாங்கோசெப் & மெட்டாலாக்சில்',
        'dosages': ['2 g/L', '2.5 g/L', '3 g/L'],
        'dosages_ta': ['2 கிராம்/லிட்டர்', '2.5 கிராம்/லிட்டர்', '3 கிராம்/லிட்டர்'],
        'quants': ['400 g/Acre', '500 g/Acre', '600 g/Acre'],
        'quants_ta': ['400 கிராம்/ஏக்கர்', '500 கிராம்/ஏக்கர்', '600 கிராம்/ஏக்கர்']
    }
}

# Add variations so model has something to train on
for _ in range(50):
    for crop_name, diseases in [('Rice', rice_diseases), ('Tomato', tomato_diseases)]:
        for dis_name, info in diseases.items():
            for age_label, age_idx in ages.items():
                row = {
                    'Crop': crop_name,
                    'Disease': dis_name,
                    'PlantAge': age_label,
                    'Pesticide_en': info['pest_en'],
                    'Pesticide_ta': info['pest_ta'],
                    'Dosage_en': info['dosages'][age_idx],
                    'Dosage_ta': info['dosages_ta'][age_idx],
                    'Quantity_en': info['quants'][age_idx],
                    'Quantity_ta': info['quants_ta'][age_idx],
                }
                data.append(row)

df = pd.DataFrame(data)
csv_path = 'pesticide_dosage_dataset.csv'
df.to_csv(csv_path, index=False)
print(f"✅ Generated dataset {csv_path} with {len(df)} rows")

# 2. Train model
le_crop = LabelEncoder()
le_disease = LabelEncoder()
le_age = LabelEncoder()

X = pd.DataFrame()
X['Crop_Code'] = le_crop.fit_transform(df['Crop'])
X['Disease_Code'] = le_disease.fit_transform(df['Disease'])
X['Age_Code'] = le_age.fit_transform(df['PlantAge'])

df['Output_Class'] = df['Pesticide_en'] + "|" + df['Pesticide_ta'] + "|" + df['Dosage_en'] + "|" + df['Dosage_ta'] + "|" + df['Quantity_en'] + "|" + df['Quantity_ta']

le_out = LabelEncoder()
y = le_out.fit_transform(df['Output_Class'])

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X, y)

model_path = 'dosage_model.pkl'
joblib.dump({
    'le_crop': le_crop,
    'le_disease': le_disease,
    'le_age': le_age,
    'le_out': le_out,
    'model': clf
}, model_path)

print(f"✅ Trained and saved {model_path}")
