import { GenericDrug, BrandMedicine, PrescriptionRecord } from './types';

export const INITIAL_GENERIC_DRUGS: GenericDrug[] = [
  {
    id: 'gen-paracetamol',
    genericName: 'Paracetamol',
    category: 'Analgesic & Antipyretic',
    description: 'Relieves mild to moderate pain and reduces fever.',
  },
  {
    id: 'gen-paracetamol-caffeine',
    genericName: 'Paracetamol + Caffeine',
    category: 'Analgesic & Antipyretic',
    description: 'Fast-acting combination for headaches, migraines, and toothache.',
  },
  {
    id: 'gen-omeprazole',
    genericName: 'Omeprazole',
    category: 'Proton Pump Inhibitor (PPI)',
    description: 'Reduces stomach acid, treats GERD, gastric ulcers, and acid reflux.',
  },
  {
    id: 'gen-esomeprazole',
    genericName: 'Esomeprazole',
    category: 'Proton Pump Inhibitor (PPI)',
    description: 'Potent S-isomer of omeprazole for severe acid reflux and peptic ulcers.',
  },
  {
    id: 'gen-pantoprazole',
    genericName: 'Pantoprazole',
    category: 'Proton Pump Inhibitor (PPI)',
    description: 'Treats erosive esophagitis, gastroesophageal reflux disease, and Zollinger-Ellison syndrome.',
  },
  {
    id: 'gen-montelukast',
    genericName: 'Montelukast Sodium',
    category: 'Leukotriene Receptor Antagonist',
    description: 'Prevents asthma attacks and manages seasonal allergic rhinitis.',
  },
  {
    id: 'gen-fexofenadine',
    genericName: 'Fexofenadine Hydrochloride',
    category: 'Non-sedating Antihistamine',
    description: 'Relieves allergy symptoms, sneezing, runny nose, and hives without drowsiness.',
  },
  {
    id: 'gen-bilastine',
    genericName: 'Bilastine',
    category: 'Non-sedating Antihistamine',
    description: 'Rapid-acting second-generation antihistamine for allergic rhinoconjunctivitis and urticaria.',
  },
  {
    id: 'gen-azithromycin',
    genericName: 'Azithromycin',
    category: 'Macrolide Antibiotic',
    description: 'Broad-spectrum antibiotic for respiratory, ENT, skin, and genital infections.',
  },
  {
    id: 'gen-cefixime',
    genericName: 'Cefixime',
    category: 'Cephalosporin Antibiotic',
    description: 'Third-generation cephalosporin for typhoid, urinary tract, and respiratory tract infections.',
  },
  {
    id: 'gen-amox-clav',
    genericName: 'Amoxicillin + Clavulanic Acid',
    category: 'Penicillin Antibiotic + Beta-lactamase Inhibitor',
    description: 'Powerful combination for resistant bacterial infections and chest infections.',
  },
  {
    id: 'gen-amlodipine',
    genericName: 'Amlodipine',
    category: 'Calcium Channel Blocker (Antihypertensive)',
    description: 'Lowers blood pressure and prevents angina chest pain.',
  },
  {
    id: 'gen-amlo-olmesartan',
    genericName: 'Amlodipine + Olmesartan Medoxomil',
    category: 'Dual Combination Antihypertensive',
    description: 'Synergistic combination for stage 2 hypertension.',
  },
  {
    id: 'gen-losartan',
    genericName: 'Losartan Potassium',
    category: 'Angiotensin II Receptor Blocker (ARB)',
    description: 'Controls high blood pressure and protects kidney function in diabetes.',
  },
  {
    id: 'gen-metformin',
    genericName: 'Metformin Hydrochloride',
    category: 'Biguanide (Antidiabetic)',
    description: 'First-line medication for type 2 diabetes; improves insulin sensitivity.',
  },
  {
    id: 'gen-sitagliptin',
    genericName: 'Sitagliptin',
    category: 'DPP-4 Inhibitor (Antidiabetic)',
    description: 'Enhances incretin hormones to stimulate insulin release in type 2 diabetes.',
  },
  {
    id: 'gen-rosuvastatin',
    genericName: 'Rosuvastatin',
    category: 'Statin (Lipid Lowering)',
    description: 'Significantly reduces LDL cholesterol and triglycerides; protects against heart attacks.',
  },
  {
    id: 'gen-atorvastatin',
    genericName: 'Atorvastatin',
    category: 'Statin (Lipid Lowering)',
    description: 'Lowers cholesterol and prevents cardiovascular disease and stroke.',
  },
  {
    id: 'gen-calcium-d3',
    genericName: 'Calcium Carbonate (Coral) + Vitamin D3',
    category: 'Mineral & Vitamin Supplement',
    description: 'Essential for bone density, osteoporosis prevention, and calcium deficiency.',
  },
  {
    id: 'gen-levothyroxine',
    genericName: 'Levothyroxine Sodium',
    category: 'Thyroid Hormone',
    description: 'Synthetic T4 replacement for hypothyroidism.',
  },
];

export const INITIAL_BRAND_MEDICINES: BrandMedicine[] = [
  // Paracetamol 500mg
  { id: 'b-napa-500', brandName: 'Napa 500', strength: '500mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 1.20, genericId: 'gen-paracetamol' },
  { id: 'b-ace-500', brandName: 'Ace 500', strength: '500mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 1.20, genericId: 'gen-paracetamol' },
  { id: 'b-fast-500', brandName: 'Fast 500', strength: '500mg', form: 'Tablet', manufacturer: 'The Acme Laboratories Ltd.', unitPrice: 1.00, genericId: 'gen-paracetamol' },
  { id: 'b-renova-500', brandName: 'Renova 500', strength: '500mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 1.15, genericId: 'gen-paracetamol' },
  { id: 'b-xcel-500', brandName: 'Xcel 500', strength: '500mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 1.00, genericId: 'gen-paracetamol' },
  { id: 'b-pyrex-500', brandName: 'Pyrex 500', strength: '500mg', form: 'Tablet', manufacturer: 'Drug International Ltd.', unitPrice: 0.85, genericId: 'gen-paracetamol' },
  { id: 'b-fevapid-500', brandName: 'Fevapid 500', strength: '500mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 1.00, genericId: 'gen-paracetamol' },

  // Paracetamol + Caffeine
  { id: 'b-napa-extra', brandName: 'Napa Extra', strength: '500mg+65mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 2.50, genericId: 'gen-paracetamol-caffeine' },
  { id: 'b-ace-plus', brandName: 'Ace Plus', strength: '500mg+65mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 2.50, genericId: 'gen-paracetamol-caffeine' },
  { id: 'b-fast-plus', brandName: 'Fast Plus', strength: '500mg+65mg', form: 'Tablet', manufacturer: 'The Acme Laboratories Ltd.', unitPrice: 2.20, genericId: 'gen-paracetamol-caffeine' },
  { id: 'b-renova-plus', brandName: 'Renova Plus', strength: '500mg+65mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 2.30, genericId: 'gen-paracetamol-caffeine' },
  { id: 'b-xcel-plus', brandName: 'Xcel Plus', strength: '500mg+65mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 2.20, genericId: 'gen-paracetamol-caffeine' },
  { id: 'b-feva-plus', brandName: 'Feva Plus', strength: '500mg+65mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 2.10, genericId: 'gen-paracetamol-caffeine' },

  // Omeprazole 20mg
  { id: 'b-seclo-20', brandName: 'Seclo 20', strength: '20mg', form: 'Capsule', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 6.00, genericId: 'gen-omeprazole' },
  { id: 'b-losectil-20', brandName: 'Losectil 20', strength: '20mg', form: 'Capsule', manufacturer: 'Eskayef Pharmaceuticals Ltd. (SK-F)', unitPrice: 6.00, genericId: 'gen-omeprazole' },
  { id: 'b-proceptin-20', brandName: 'Proceptin 20', strength: '20mg', form: 'Capsule', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 5.50, genericId: 'gen-omeprazole' },
  { id: 'b-omep-20', brandName: 'Ome 20', strength: '20mg', form: 'Capsule', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 5.00, genericId: 'gen-omeprazole' },
  { id: 'b-esole-20', brandName: 'Esole 20', strength: '20mg', form: 'Capsule', manufacturer: 'Renata Limited', unitPrice: 5.00, genericId: 'gen-omeprazole' },
  { id: 'b-ocid-20', brandName: 'Ocid 20', strength: '20mg', form: 'Capsule', manufacturer: 'Aristopharma Ltd.', unitPrice: 4.50, genericId: 'gen-omeprazole' },
  { id: 'b-xeldrin-20', brandName: 'Xeldrin 20', strength: '20mg', form: 'Capsule', manufacturer: 'ACI Limited', unitPrice: 4.50, genericId: 'gen-omeprazole' },

  // Esomeprazole 20mg
  { id: 'b-sergel-20', brandName: 'Sergel 20', strength: '20mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-esomeprazole' },
  { id: 'b-nexum-20', brandName: 'Nexum 20', strength: '20mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-esomeprazole' },
  { id: 'b-maxpro-20', brandName: 'Maxpro 20', strength: '20mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 8.00, genericId: 'gen-esomeprazole' },
  { id: 'b-opton-20', brandName: 'Opton 20', strength: '20mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 7.00, genericId: 'gen-esomeprazole' },
  { id: 'b-esonix-20', brandName: 'Esonix 20', strength: '20mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 7.00, genericId: 'gen-esomeprazole' },
  { id: 'b-esotac-20', brandName: 'Esotac 20', strength: '20mg', form: 'Tablet', manufacturer: 'Opsonin Pharma Ltd.', unitPrice: 6.00, genericId: 'gen-esomeprazole' },

  // Pantoprazole 20mg
  { id: 'b-pantonix-20', brandName: 'Pantonix 20', strength: '20mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 7.00, genericId: 'gen-pantoprazole' },
  { id: 'b-pantobex-20', brandName: 'Pantobex 20', strength: '20mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 7.00, genericId: 'gen-pantoprazole' },
  { id: 'b-trupan-20', brandName: 'Trupan 20', strength: '20mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 7.00, genericId: 'gen-pantoprazole' },
  { id: 'b-nupenta-20', brandName: 'Nupenta 20', strength: '20mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 6.50, genericId: 'gen-pantoprazole' },
  { id: 'b-pantodac-20', brandName: 'Pantodac 20', strength: '20mg', form: 'Tablet', manufacturer: 'Aristopharma Ltd.', unitPrice: 6.00, genericId: 'gen-pantoprazole' },

  // Montelukast 10mg
  { id: 'b-monas-10', brandName: 'Monas 10', strength: '10mg', form: 'Tablet', manufacturer: 'The Acme Laboratories Ltd.', unitPrice: 16.00, genericId: 'gen-montelukast' },
  { id: 'b-montene-10', brandName: 'Montene 10', strength: '10mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 16.00, genericId: 'gen-montelukast' },
  { id: 'b-odmon-10', brandName: 'Odmon 10', strength: '10mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 15.00, genericId: 'gen-montelukast' },
  { id: 'b-provair-10', brandName: 'Provair 10', strength: '10mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 14.00, genericId: 'gen-montelukast' },
  { id: 'b-lumona-10', brandName: 'Lumona 10', strength: '10mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 14.00, genericId: 'gen-montelukast' },
  { id: 'b-romilast-10', brandName: 'Romilast 10', strength: '10mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 13.00, genericId: 'gen-montelukast' },
  { id: 'b-montelo-10', brandName: 'Montelo 10', strength: '10mg', form: 'Tablet', manufacturer: 'Opsonin Pharma Ltd.', unitPrice: 12.00, genericId: 'gen-montelukast' },

  // Fexofenadine 120mg
  { id: 'b-fexo-120', brandName: 'Fexo 120', strength: '120mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 9.00, genericId: 'gen-fexofenadine' },
  { id: 'b-fexoral-120', brandName: 'Fexoral 120', strength: '120mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 9.00, genericId: 'gen-fexofenadine' },
  { id: 'b-fastel-120', brandName: 'Fastel 120', strength: '120mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-fexofenadine' },
  { id: 'b-telfast-120', brandName: 'Telfast 120', strength: '120mg', form: 'Tablet', manufacturer: 'Radiant Pharmaceuticals (Sanofi)', unitPrice: 12.00, genericId: 'gen-fexofenadine' },
  { id: 'b-fexit-120', brandName: 'Fexit 120', strength: '120mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 7.50, genericId: 'gen-fexofenadine' },
  { id: 'b-rexofen-120', brandName: 'Rexofen 120', strength: '120mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 7.50, genericId: 'gen-fexofenadine' },

  // Bilastine 20mg
  { id: 'b-bilatin-20', brandName: 'Bilatin 20', strength: '20mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 18.00, genericId: 'gen-bilastine' },
  { id: 'b-bilasten-20', brandName: 'Bilasten 20', strength: '20mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 17.00, genericId: 'gen-bilastine' },
  { id: 'b-bila-20', brandName: 'Bila 20', strength: '20mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 15.00, genericId: 'gen-bilastine' },
  { id: 'b-alastin-20', brandName: 'Alastin 20', strength: '20mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 15.00, genericId: 'gen-bilastine' },

  // Azithromycin 500mg
  { id: 'b-zithrin-500', brandName: 'Zithrin 500', strength: '500mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 35.00, genericId: 'gen-azithromycin' },
  { id: 'b-azithrocin-500', brandName: 'Azithrocin 500', strength: '500mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 35.00, genericId: 'gen-azithromycin' },
  { id: 'b-tridosil-500', brandName: 'Tridosil 500', strength: '500mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 32.00, genericId: 'gen-azithromycin' },
  { id: 'b-azal-500', brandName: 'Azal 500', strength: '500mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 30.00, genericId: 'gen-azithromycin' },
  { id: 'b-odaz-500', brandName: 'Odaz 500', strength: '500mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 30.00, genericId: 'gen-azithromycin' },
  { id: 'b-azi-500', brandName: 'Azi 500', strength: '500mg', form: 'Tablet', manufacturer: 'Opsonin Pharma Ltd.', unitPrice: 28.00, genericId: 'gen-azithromycin' },

  // Cefixime 200mg
  { id: 'b-cef3-200', brandName: 'Cef-3 200', strength: '200mg', form: 'Capsule', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 40.00, genericId: 'gen-cefixime' },
  { id: 'b-triocim-200', brandName: 'Triocim 200', strength: '200mg', form: 'Capsule', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 40.00, genericId: 'gen-cefixime' },
  { id: 'b-denvar-200', brandName: 'Denvar 200', strength: '200mg', form: 'Capsule', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 38.00, genericId: 'gen-cefixime' },
  { id: 'b-cefim-200', brandName: 'Cefim 200', strength: '200mg', form: 'Capsule', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 35.00, genericId: 'gen-cefixime' },
  { id: 'b-orfix-200', brandName: 'Orfix 200', strength: '200mg', form: 'Capsule', manufacturer: 'Renata Limited', unitPrice: 35.00, genericId: 'gen-cefixime' },

  // Amoxicillin + Clavulanic Acid 625mg
  { id: 'b-moxaclav-625', brandName: 'Moxaclav 625', strength: '625mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 45.00, genericId: 'gen-amox-clav' },
  { id: 'b-filoclav-625', brandName: 'Filoclav 625', strength: '625mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 45.00, genericId: 'gen-amox-clav' },
  { id: 'b-clavroc-625', brandName: 'Clavroc 625', strength: '625mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 40.00, genericId: 'gen-amox-clav' },
  { id: 'b-renaclav-625', brandName: 'Renaclav 625', strength: '625mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 40.00, genericId: 'gen-amox-clav' },
  { id: 'b-augmentin-625', brandName: 'Augmentin 625', strength: '625mg', form: 'Tablet', manufacturer: 'Radiant Pharmaceuticals (GSK)', unitPrice: 55.00, genericId: 'gen-amox-clav' },

  // Amlodipine 5mg
  { id: 'b-camlod-5', brandName: 'Camlod 5', strength: '5mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 4.00, genericId: 'gen-amlodipine' },
  { id: 'b-amlopin-5', brandName: 'Amlopin 5', strength: '5mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 4.00, genericId: 'gen-amlodipine' },
  { id: 'b-amlodac-5', brandName: 'Amlodac 5', strength: '5mg', form: 'Tablet', manufacturer: 'Aristopharma Ltd.', unitPrice: 3.50, genericId: 'gen-amlodipine' },
  { id: 'b-lodipin-5', brandName: 'Lodipin 5', strength: '5mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 3.50, genericId: 'gen-amlodipine' },
  { id: 'b-amlovas-5', brandName: 'Amlovas 5', strength: '5mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 3.20, genericId: 'gen-amlodipine' },

  // Amlodipine + Olmesartan 5/20mg
  { id: 'b-bizoran-5-20', brandName: 'Bizoran 5/20', strength: '5mg/20mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 15.00, genericId: 'gen-amlo-olmesartan' },
  { id: 'b-olmesar-a-5-20', brandName: 'Olmesar-A 5/20', strength: '5mg/20mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 14.00, genericId: 'gen-amlo-olmesartan' },
  { id: 'b-olmetec-plus-5-20', brandName: 'Olmetec Plus 5/20', strength: '5mg/20mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 14.00, genericId: 'gen-amlo-olmesartan' },
  { id: 'b-duopress-5-20', brandName: 'Duopress 5/20', strength: '5mg/20mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 12.00, genericId: 'gen-amlo-olmesartan' },
  { id: 'b-amlomax-o-5-20', brandName: 'Amlomax-O 5/20', strength: '5mg/20mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 12.50, genericId: 'gen-amlo-olmesartan' },

  // Losartan Potassium 50mg
  { id: 'b-angilock-50', brandName: 'Angilock 50', strength: '50mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-losartan' },
  { id: 'b-osartil-50', brandName: 'Osartil 50', strength: '50mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-losartan' },
  { id: 'b-losan-50', brandName: 'Losan 50', strength: '50mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 7.00, genericId: 'gen-losartan' },
  { id: 'b-prosan-50', brandName: 'Prosan 50', strength: '50mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 7.00, genericId: 'gen-losartan' },
  { id: 'b-losacar-50', brandName: 'Losacar 50', strength: '50mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 7.00, genericId: 'gen-losartan' },

  // Metformin 500mg
  { id: 'b-comet-500', brandName: 'Comet 500', strength: '500mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 4.00, genericId: 'gen-metformin' },
  { id: 'b-daomet-500', brandName: 'Daomet 500', strength: '500mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 4.00, genericId: 'gen-metformin' },
  { id: 'b-metfo-500', brandName: 'Metfo 500', strength: '500mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 3.50, genericId: 'gen-metformin' },
  { id: 'b-glucomet-500', brandName: 'Glucomet 500', strength: '500mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 3.50, genericId: 'gen-metformin' },
  { id: 'b-informet-500', brandName: 'Informet 500', strength: '500mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 3.50, genericId: 'gen-metformin' },

  // Sitagliptin 50mg
  { id: 'b-sitaglip-50', brandName: 'Sitaglip 50', strength: '50mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 25.00, genericId: 'gen-sitagliptin' },
  { id: 'b-gliptin-50', brandName: 'Gliptin 50', strength: '50mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 25.00, genericId: 'gen-sitagliptin' },
  { id: 'b-sitamet-50', brandName: 'Sitamet 50', strength: '50mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 20.00, genericId: 'gen-sitagliptin' },
  { id: 'b-sitara-50', brandName: 'Sitara 50', strength: '50mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 20.00, genericId: 'gen-sitagliptin' },

  // Rosuvastatin 10mg
  { id: 'b-rostar-10', brandName: 'Rostar 10', strength: '10mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 22.00, genericId: 'gen-rosuvastatin' },
  { id: 'b-rosuva-10', brandName: 'Rosuva 10', strength: '10mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 22.00, genericId: 'gen-rosuvastatin' },
  { id: 'b-rosutin-10', brandName: 'Rosutin 10', strength: '10mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 18.00, genericId: 'gen-rosuvastatin' },
  { id: 'b-rosugen-10', brandName: 'Rosugen 10', strength: '10mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 18.00, genericId: 'gen-rosuvastatin' },
  { id: 'b-zyrova-10', brandName: 'Zyrova 10', strength: '10mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 17.00, genericId: 'gen-rosuvastatin' },

  // Atorvastatin 10mg
  { id: 'b-atova-10', brandName: 'Atova 10', strength: '10mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 14.00, genericId: 'gen-atorvastatin' },
  { id: 'b-lipicon-10', brandName: 'Lipicon 10', strength: '10mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 14.00, genericId: 'gen-atorvastatin' },
  { id: 'b-atova-r-10', brandName: 'Atova-R 10', strength: '10mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 12.00, genericId: 'gen-atorvastatin' },
  { id: 'b-torvan-10', brandName: 'Torvan 10', strength: '10mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 12.00, genericId: 'gen-atorvastatin' },
  { id: 'b-anzitor-10', brandName: 'Anzitor 10', strength: '10mg', form: 'Tablet', manufacturer: 'Healthcare Pharmaceuticals Ltd.', unitPrice: 11.00, genericId: 'gen-atorvastatin' },

  // Coral Calcium + D3
  { id: 'b-coral-d', brandName: 'Coral-D', strength: '500mg+200IU', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-calcium-d3' },
  { id: 'b-calbo-d', brandName: 'Calbo-D', strength: '500mg+200IU', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-calcium-d3' },
  { id: 'b-ostocal-d', brandName: 'Ostocal-D', strength: '500mg+200IU', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 7.50, genericId: 'gen-calcium-d3' },
  { id: 'b-aristocal-d', brandName: 'Aristocal-D', strength: '500mg+200IU', form: 'Tablet', manufacturer: 'Aristopharma Ltd.', unitPrice: 6.50, genericId: 'gen-calcium-d3' },
  { id: 'b-d-cal', brandName: 'D-Cal', strength: '500mg+200IU', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 6.00, genericId: 'gen-calcium-d3' },

  // Levothyroxine 50mcg
  { id: 'b-thyrox-50', brandName: 'Thyrox 50', strength: '50mcg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 3.00, genericId: 'gen-levothyroxine' },
  { id: 'b-thyronor-50', brandName: 'Thyronor 50', strength: '50mcg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 3.00, genericId: 'gen-levothyroxine' },
  { id: 'b-levotac-50', brandName: 'Levotac 50', strength: '50mcg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 2.50, genericId: 'gen-levothyroxine' },
  { id: 'b-euthyrox-50', brandName: 'Euthyrox 50', strength: '50mcg', form: 'Tablet', manufacturer: 'Radiant Pharmaceuticals (Merck)', unitPrice: 4.50, genericId: 'gen-levothyroxine' },
];

export interface SamplePreset {
  id: string;
  titleEn: string;
  titleBn: string;
  doctorName: string;
  clinic: string;
  date: string;
  imageUrl: string;
  imageThumbnail: string;
  medicines: {
    rawOcr: string;
    brand: string;
    strength: string;
    form: string;
    schedule: string;
    duration: string;
    instructions: string;
    confidence: number;
    box: { x: number; y: number; width: number; height: number };
  }[];
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'preset-dmch-handwritten',
    titleEn: 'Handwritten Rx - Dhaka Medical College Hospital',
    titleBn: 'ঢাকা মেডিকেল কলেজ হাসপাতালের হাতের লেখা প্রেসক্রিপশন',
    doctorName: 'Prof. Dr. M. A. Rahman, FCPS (Medicine)',
    clinic: 'Dhaka Medical College & Hospital (DMCH)',
    date: '2026-08-10',
    imageUrl: '/samples/prescription_dmch.svg',
    imageThumbnail: '/samples/prescription_dmch.svg',
    medicines: [
      {
        rawOcr: 'Tab Napa Extra (500/65mg) 1+0+1 7 days pc',
        brand: 'Napa Extra',
        strength: '500mg+65mg',
        form: 'Tablet',
        schedule: '1-0-1',
        duration: '7 days',
        instructions: 'After meal',
        confidence: 0.96,
        box: { x: 8, y: 32, width: 84, height: 11 },
      },
      {
        rawOcr: 'Cap Sec1o 20mg 1-0-1 (ac) 14 days',
        brand: 'Seclo 20',
        strength: '20mg',
        form: 'Capsule',
        schedule: '1-0-1',
        duration: '14 days',
        instructions: 'Before meal (ac)',
        confidence: 0.88,
        box: { x: 8, y: 45, width: 84, height: 11 },
      },
      {
        rawOcr: 'Tab Moxac1av 625 1+0+1 5 days',
        brand: 'Moxaclav 625',
        strength: '625mg',
        form: 'Tablet',
        schedule: '1-0-1',
        duration: '5 days',
        instructions: 'After meal',
        confidence: 0.82,
        box: { x: 8, y: 58, width: 84, height: 11 },
      },
      {
        rawOcr: 'Tab Monas 10mg 0-0-1 1 month',
        brand: 'Monas 10',
        strength: '10mg',
        form: 'Tablet',
        schedule: '0-0-1',
        duration: '30 days',
        instructions: 'At bedtime',
        confidence: 0.94,
        box: { x: 8, y: 71, width: 84, height: 11 },
      },
    ],
  },
  {
    id: 'preset-square-printed',
    titleEn: 'Outpatient Printed Rx - Square Hospitals Ltd.',
    titleBn: 'স্কয়ার হাসপাতালের প্রিন্ট করা আউটপেশেন্ট প্রেসক্রিপশন',
    doctorName: 'Dr. Nusrat Jahan, MD (Cardiology)',
    clinic: 'Square Hospitals Ltd., Panthapath, Dhaka',
    date: '2026-08-14',
    imageUrl: '/samples/prescription_square.svg',
    imageThumbnail: '/samples/prescription_square.svg',
    medicines: [
      {
        rawOcr: 'Tab. Bizoran 5/20 mg - 1+0+0 - Continue 3 Months',
        brand: 'Bizoran 5/20',
        strength: '5mg/20mg',
        form: 'Tablet',
        schedule: '1-0-0',
        duration: '90 days',
        instructions: 'Morning after breakfast',
        confidence: 0.98,
        box: { x: 8, y: 34, width: 84, height: 11 },
      },
      {
        rawOcr: 'Tab. Rostar 10 mg - 0+0+1 - 90 Days',
        brand: 'Rostar 10',
        strength: '10mg',
        form: 'Tablet',
        schedule: '0-0-1',
        duration: '90 days',
        instructions: 'At night after meal',
        confidence: 0.95,
        box: { x: 8, y: 47, width: 84, height: 11 },
      },
      {
        rawOcr: 'Tab. Sergel 20 mg - 1+0+1 - 30 Days (Before Meal)',
        brand: 'Sergel 20',
        strength: '20mg',
        form: 'Tablet',
        schedule: '1-0-1',
        duration: '30 days',
        instructions: '30 min before meal',
        confidence: 0.94,
        box: { x: 8, y: 60, width: 84, height: 11 },
      },
      {
        rawOcr: 'Tab. Coral-D - 0+1+0 - 30 Days',
        brand: 'Coral-D',
        strength: '500mg+200IU',
        form: 'Tablet',
        schedule: '0-1-0',
        duration: '30 days',
        instructions: 'After lunch',
        confidence: 0.91,
        box: { x: 8, y: 73, width: 84, height: 11 },
      },
    ],
  },
  {
    id: 'preset-diabetic-gastro',
    titleEn: 'Diabetic & Gastro Care Prescription',
    titleBn: 'ডায়াবেটিস ও গ্যাস্ট্রিকের প্রেসক্রিপশন',
    doctorName: 'Dr. Tariqul Islam, MRCP, FACP',
    clinic: 'BIRDEM General Hospital, Shahbagh',
    date: '2026-08-15',
    imageUrl: '/samples/prescription_birdem.svg',
    imageThumbnail: '/samples/prescription_birdem.svg',
    medicines: [
      {
        rawOcr: 'Tab Comet 500mg 1+0+1 with meals 30 days',
        brand: 'Comet 500',
        strength: '500mg',
        form: 'Tablet',
        schedule: '1-0-1',
        duration: '30 days',
        instructions: 'With meals',
        confidence: 0.93,
        box: { x: 8, y: 35, width: 84, height: 11 },
      },
      {
        rawOcr: 'Tab Sitaglip 50mg 1+0+0 30 days',
        brand: 'Sitaglip 50',
        strength: '50mg',
        form: 'Tablet',
        schedule: '1-0-0',
        duration: '30 days',
        instructions: 'Morning',
        confidence: 0.89,
        box: { x: 8, y: 48, width: 84, height: 11 },
      },
      {
        rawOcr: 'Cap Pantonix 20mg 1-0-0 before breakfast 14 days',
        brand: 'Pantonix 20',
        strength: '20mg',
        form: 'Tablet',
        schedule: '1-0-0',
        duration: '14 days',
        instructions: 'Empty stomach',
        confidence: 0.91,
        box: { x: 8, y: 61, width: 84, height: 11 },
      },
    ],
  },
];

export const INITIAL_PRESCRIPTIONS: PrescriptionRecord[] = [
  {
    id: 'rx-demo-1',
    userId: 'user-patient-1',
    patientName: 'Kazi Farhan Ahmed',
    doctorName: 'Prof. Dr. M. A. Rahman',
    clinicHospital: 'Dhaka Medical College & Hospital',
    date: '2026-08-10',
    imageUrl: '/samples/prescription_dmch.svg',
    status: 'COMPLETED',
    totalOriginalCost: 980.00,
    totalGenericCost: 615.00,
    estimatedSavings: 365.00,
    savingsPercentage: 37.2,
    createdAt: '2026-08-10T11:20:00Z',
    parsedItems: [
      {
        id: 'item-1',
        rawOcrText: 'Tab Napa Extra (500/65mg) 1+0+1 7 days',
        matchedBrand: 'Napa Extra',
        matchedGeneric: 'Paracetamol + Caffeine',
        strength: '500mg+65mg',
        form: 'Tablet',
        dosageSchedule: '1-0-1',
        duration: '7 days',
        instructions: 'After meal',
        confidence: 0.96,
        isUserVerified: true,
        boundingBox: { x: 8, y: 32, width: 84, height: 11 },
      },
      {
        id: 'item-2',
        rawOcrText: 'Cap Sec1o 20mg 1-0-1 14 days',
        matchedBrand: 'Seclo 20',
        matchedGeneric: 'Omeprazole',
        strength: '20mg',
        form: 'Capsule',
        dosageSchedule: '1-0-1',
        duration: '14 days',
        instructions: 'Before meal',
        confidence: 0.88,
        isUserVerified: true,
        boundingBox: { x: 8, y: 45, width: 84, height: 11 },
      },
      {
        id: 'item-3',
        rawOcrText: 'Tab Moxac1av 625 1+0+1 5 days',
        matchedBrand: 'Moxaclav 625',
        matchedGeneric: 'Amoxicillin + Clavulanic Acid',
        strength: '625mg',
        form: 'Tablet',
        dosageSchedule: '1-0-1',
        duration: '5 days',
        instructions: 'After meal',
        confidence: 0.82,
        isUserVerified: true,
        boundingBox: { x: 8, y: 58, width: 84, height: 11 },
      },
      {
        id: 'item-4',
        rawOcrText: 'Tab Monas 10mg 0-0-1 1 month',
        matchedBrand: 'Monas 10',
        matchedGeneric: 'Montelukast Sodium',
        strength: '10mg',
        form: 'Tablet',
        dosageSchedule: '0-0-1',
        duration: '30 days',
        instructions: 'Night',
        confidence: 0.94,
        isUserVerified: true,
        boundingBox: { x: 8, y: 71, width: 84, height: 11 },
      },
    ],
  },
  {
    id: 'rx-demo-2',
    userId: 'user-patient-1',
    patientName: 'Kazi Farhan Ahmed',
    doctorName: 'Dr. Nusrat Jahan, MD',
    clinicHospital: 'Square Hospitals Ltd.',
    date: '2026-08-14',
    imageUrl: '/samples/prescription_square.svg',
    status: 'REVIEWED',
    totalOriginalCost: 3870.00,
    totalGenericCost: 2640.00,
    estimatedSavings: 1230.00,
    savingsPercentage: 31.8,
    createdAt: '2026-08-14T09:45:00Z',
    parsedItems: [
      {
        id: 'item-2-1',
        rawOcrText: 'Tab. Bizoran 5/20 mg - 1+0+0 - 90 Days',
        matchedBrand: 'Bizoran 5/20',
        matchedGeneric: 'Amlodipine + Olmesartan Medoxomil',
        strength: '5mg/20mg',
        form: 'Tablet',
        dosageSchedule: '1-0-0',
        duration: '90 days',
        instructions: 'Morning',
        confidence: 0.98,
        isUserVerified: true,
        boundingBox: { x: 8, y: 34, width: 84, height: 11 },
      },
      {
        id: 'item-2-2',
        rawOcrText: 'Tab. Rostar 10 mg - 0+0+1 - 90 Days',
        matchedBrand: 'Rostar 10',
        matchedGeneric: 'Rosuvastatin',
        strength: '10mg',
        form: 'Tablet',
        dosageSchedule: '0-0-1',
        duration: '90 days',
        instructions: 'Night',
        confidence: 0.95,
        isUserVerified: true,
        boundingBox: { x: 8, y: 47, width: 84, height: 11 },
      },
      {
        id: 'item-2-3',
        rawOcrText: 'Tab. Sergel 20 mg - 1+0+1 - 30 Days',
        matchedBrand: 'Sergel 20',
        matchedGeneric: 'Esomeprazole',
        strength: '20mg',
        form: 'Tablet',
        dosageSchedule: '1-0-1',
        duration: '30 days',
        instructions: 'Before meal',
        confidence: 0.94,
        isUserVerified: true,
        boundingBox: { x: 8, y: 60, width: 84, height: 11 },
      },
    ],
  },
];
