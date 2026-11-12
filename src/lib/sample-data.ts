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
  {
    id: 'gen-cetirizine',
    genericName: 'Cetirizine Hydrochloride',
    category: 'Antihistamine (Anti-allergic)',
    description: 'Rapid-acting antihistamine for allergic rhinitis, urticaria, pruritus, and runny nose.',
  },
  {
    id: 'gen-levocetirizine',
    genericName: 'Levocetirizine Dihydrochloride',
    category: 'Antihistamine (Anti-allergic)',
    description: 'Active R-enantiomer of cetirizine with higher affinity and minimal sedation.',
  },
  {
    id: 'gen-glimepiride',
    genericName: 'Glimepiride',
    category: 'Sulfonylurea (Antidiabetic)',
    description: 'Second-generation sulfonylurea that stimulates insulin release from pancreatic beta cells.',
  },
  {
    id: 'gen-linagliptin',
    genericName: 'Linagliptin',
    category: 'DPP-4 Inhibitor (Antidiabetic)',
    description: 'Once-daily DPP-4 inhibitor without requirement for renal dose adjustments in diabetes.',
  },
  {
    id: 'gen-linagliptin-metformin',
    genericName: 'Linagliptin + Metformin Hydrochloride',
    category: 'Dual Combination Antidiabetic',
    description: 'Synergistic combination improving glycemic control in type 2 diabetes mellitus.',
  },
  {
    id: 'gen-naproxen',
    genericName: 'Naproxen Sodium',
    category: 'NSAID (Analgesic & Anti-inflammatory)',
    description: 'Long-acting nonsteroidal anti-inflammatory for arthritis, musculoskeletal pain, and backache.',
  },
  {
    id: 'gen-naproxen-esomeprazole',
    genericName: 'Naproxen + Esomeprazole',
    category: 'Gastro-protected NSAID',
    description: 'Combines anti-inflammatory naproxen with esomeprazole to protect stomach lining from ulcers.',
  },
  {
    id: 'gen-tizanidine',
    genericName: 'Tizanidine',
    category: 'Central Alpha-2 Agonist (Muscle Relaxant)',
    description: 'Reduces muscle spasticity, stiffness, low back pain, and painful muscular spasms.',
  },
  {
    id: 'gen-glucosamine-chondroitin',
    genericName: 'Glucosamine + Chondroitin',
    category: 'Joint & Cartilage Supplement',
    description: 'Stimulates cartilage synthesis and relieves osteoarthritis pain and joint stiffness.',
  },
  {
    id: 'gen-mirtazapine',
    genericName: 'Mirtazapine',
    category: 'Noradrenergic & Specific Serotonergic Antidepressant (NaSSA)',
    description: 'Treats major depression, insomnia, and loss of appetite.',
  },
  {
    id: 'gen-prednisolone',
    genericName: 'Prednisolone',
    category: 'Corticosteroid (Anti-inflammatory & Immunosuppressive)',
    description: 'Potent systemic corticosteroid for autoimmune disorders, severe inflammation, and asthma.',
  },
  {
    id: 'gen-testosterone',
    genericName: 'Testosterone Enanthate',
    category: 'Androgen Hormone Replacement',
    description: 'Depot intramuscular injection for primary and secondary hypogonadism.',
  },
  {
    id: 'gen-multivitamin-minerals',
    genericName: 'Multivitamin + Multimineral + Zinc / Antioxidant',
    category: 'Comprehensive Dietary Supplement',
    description: 'Provides essential vitamins, trace minerals, and antioxidants for convalescence and vitality.',
  },
  {
    id: 'gen-doxophylline',
    genericName: 'Doxophylline',
    category: 'Xanthine Derivative (Bronchodilator)',
    description: 'New-generation bronchodilator for bronchial asthma and chronic obstructive pulmonary disease (COPD).',
  },
  {
    id: 'gen-clonazepam',
    genericName: 'Clonazepam',
    category: 'Benzodiazepine (Anxiolytic & Anticonvulsant)',
    description: 'High-potency benzodiazepine for panic disorder, generalized anxiety, and seizure disorders.',
  },
  {
    id: 'gen-ketorolac',
    genericName: 'Ketorolac Tromethamine',
    category: 'NSAID (Acute Analgesic)',
    description: 'Short-term management of moderate to severe acute postoperative and orthopedic pain.',
  },
  {
    id: 'gen-aceclofenac',
    genericName: 'Aceclofenac',
    category: 'NSAID (Anti-inflammatory & Analgesic)',
    description: 'Preferential COX-2 inhibitor with superior gastric tolerance for osteoarthritis and rheumatoid arthritis.',
  },
  {
    id: 'gen-bisoprolol',
    genericName: 'Bisoprolol Hemifumarate',
    category: 'Selective Beta-1 Blocker (Cardiovascular)',
    description: 'Lowers blood pressure and heart rate; manages angina pectoris and chronic heart failure.',
  },
  {
    id: 'gen-telmisartan',
    genericName: 'Telmisartan',
    category: 'Angiotensin II Receptor Blocker (ARB)',
    description: '24-hour blood pressure control with organ-protective properties in cardiovascular risk patients.',
  },
  {
    id: 'gen-ciprofloxacin',
    genericName: 'Ciprofloxacin',
    category: 'Fluoroquinolone Antibiotic',
    description: 'Broad-spectrum bactericidal antibiotic for enteric fever, urinary tract, and bone infections.',
  },
  {
    id: 'gen-cefuroxime',
    genericName: 'Cefuroxime Axetil',
    category: 'Second-Generation Cephalosporin Antibiotic',
    description: 'Treats upper and lower respiratory tract infections, sinusitis, otitis media, and skin infections.',
  },
  {
    id: 'gen-domperidone',
    genericName: 'Domperidone',
    category: 'Peripheral Dopamine D2 Antagonist (Prokinetic)',
    description: 'Relieves nausea, vomiting, feeling of fullness, dyspepsia, and gastric reflux.',
  },
  {
    id: 'gen-vitamin-b-complex',
    genericName: 'Vitamin B-Complex + Zinc',
    category: 'Metabolic & Neuropathic Supplement',
    description: 'Treats peripheral neuropathy, glossitis, stomatitis, and generalized physical debility.',
  },
  {
    id: 'gen-iron-folic',
    genericName: 'Iron Polymaltose Complex + Folic Acid + Zinc',
    category: 'Hematinic (Anti-anemic)',
    description: 'Prevents and treats iron deficiency anemia in pregnancy and chronic illness without gastric irritation.',
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
  // Cetirizine 10mg
  { id: 'b-alatrol-10', brandName: 'Alatrol 10', strength: '10mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 3.50, genericId: 'gen-cetirizine' },
  { id: 'b-alatrol', brandName: 'Alatrol', strength: '10mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 3.50, genericId: 'gen-cetirizine' },
  { id: 'b-atrizin-10', brandName: 'Atrizin 10', strength: '10mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 3.00, genericId: 'gen-cetirizine' },
  { id: 'b-cetirin-10', brandName: 'Cetirin 10', strength: '10mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 3.20, genericId: 'gen-cetirizine' },
  { id: 'b-alarid-10', brandName: 'Alarid 10', strength: '10mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 3.00, genericId: 'gen-cetirizine' },

  // Glimepiride
  { id: 'b-amaryl-1', brandName: 'Amaryl 1', strength: '1mg', form: 'Tablet', manufacturer: 'Radiant Pharmaceuticals (Sanofi)', unitPrice: 10.00, genericId: 'gen-glimepiride' },
  { id: 'b-amaryl', brandName: 'Amaryl', strength: '1mg', form: 'Tablet', manufacturer: 'Radiant Pharmaceuticals (Sanofi)', unitPrice: 10.00, genericId: 'gen-glimepiride' },
  { id: 'b-diapride-1', brandName: 'Diapride 1', strength: '1mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 6.00, genericId: 'gen-glimepiride' },
  { id: 'b-secrin-1', brandName: 'Secrin 1', strength: '1mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 5.50, genericId: 'gen-glimepiride' },
  { id: 'b-glemep-1', brandName: 'Glemep 1', strength: '1mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 5.50, genericId: 'gen-glimepiride' },
  { id: 'b-amaryl-2', brandName: 'Amaryl 2', strength: '2mg', form: 'Tablet', manufacturer: 'Radiant Pharmaceuticals (Sanofi)', unitPrice: 16.00, genericId: 'gen-glimepiride' },
  { id: 'b-diapride-2', brandName: 'Diapride 2', strength: '2mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 10.00, genericId: 'gen-glimepiride' },
  { id: 'b-secrin-2', brandName: 'Secrin 2', strength: '2mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 9.00, genericId: 'gen-glimepiride' },

  // Linagliptin + Metformin
  { id: 'b-linaglip-m', brandName: 'Linaglip-M', strength: '2.5mg/500mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 18.00, genericId: 'gen-linagliptin-metformin' },
  { id: 'b-linaglip-m-25-500', brandName: 'Linaglip-M 2.5/500', strength: '2.5mg/500mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 18.00, genericId: 'gen-linagliptin-metformin' },
  { id: 'b-trulimax-m', brandName: 'Trulimax-M', strength: '2.5mg/500mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 18.00, genericId: 'gen-linagliptin-metformin' },
  { id: 'b-linapex-m', brandName: 'Linapex-M', strength: '2.5mg/500mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 16.00, genericId: 'gen-linagliptin-metformin' },
  { id: 'b-jentadueto', brandName: 'Jentadueto', strength: '2.5mg/500mg', form: 'Tablet', manufacturer: 'Boehringer Ingelheim', unitPrice: 35.00, genericId: 'gen-linagliptin-metformin' },

  // Linagliptin
  { id: 'b-linaglip-5', brandName: 'Linaglip 5', strength: '5mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 18.00, genericId: 'gen-linagliptin' },
  { id: 'b-trulimax-5', brandName: 'Trulimax 5', strength: '5mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 18.00, genericId: 'gen-linagliptin' },
  { id: 'b-linapex-5', brandName: 'Linapex 5', strength: '5mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 15.00, genericId: 'gen-linagliptin' },
  { id: 'b-trajenta-5', brandName: 'Trajenta 5', strength: '5mg', form: 'Tablet', manufacturer: 'Boehringer Ingelheim', unitPrice: 32.00, genericId: 'gen-linagliptin' },

  // Tizanidine (Muscle Relaxant)
  { id: 'b-relentus-2', brandName: 'Relentus 2', strength: '2mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-tizanidine' },
  { id: 'b-relentus', brandName: 'Relentus', strength: '2mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-tizanidine' },
  { id: 'b-tizan-2', brandName: 'Tizan 2', strength: '2mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 8.50, genericId: 'gen-tizanidine' },
  { id: 'b-sirdalud-2', brandName: 'Sirdalud 2', strength: '2mg', form: 'Tablet', manufacturer: 'Novartis Bangladesh', unitPrice: 14.00, genericId: 'gen-tizanidine' },

  // Naproxen + Esomeprazole
  { id: 'b-naprosyn-plus', brandName: 'Naprosyn Plus', strength: '500mg+20mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 15.00, genericId: 'gen-naproxen-esomeprazole' },
  { id: 'b-anaprox-plus', brandName: 'Anaprox Plus', strength: '500mg+20mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 15.00, genericId: 'gen-naproxen-esomeprazole' },
  { id: 'b-xenapro-plus', brandName: 'Xenapro Plus', strength: '500mg+20mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 13.50, genericId: 'gen-naproxen-esomeprazole' },
  { id: 'b-napro-a-plus', brandName: 'Napro-A Plus', strength: '500mg+20mg', form: 'Tablet', manufacturer: 'The Acme Laboratories Ltd.', unitPrice: 13.00, genericId: 'gen-naproxen-esomeprazole' },

  // Naproxen
  { id: 'b-naprosyn-500', brandName: 'Naprosyn 500', strength: '500mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 12.00, genericId: 'gen-naproxen' },
  { id: 'b-anaprox-500', brandName: 'Anaprox 500', strength: '500mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 12.00, genericId: 'gen-naproxen' },
  { id: 'b-xenapro-500', brandName: 'Xenapro 500', strength: '500mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 10.50, genericId: 'gen-naproxen' },

  // Glucosamine + Chondroitin
  { id: 'b-joinex-plus', brandName: 'Joinex Plus', strength: '250mg+200mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 16.00, genericId: 'gen-glucosamine-chondroitin' },
  { id: 'b-cartilax-plus', brandName: 'Cartilax Plus', strength: '250mg+200mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 16.00, genericId: 'gen-glucosamine-chondroitin' },
  { id: 'b-arth-a-plus', brandName: 'Arth-A Plus', strength: '250mg+200mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 14.00, genericId: 'gen-glucosamine-chondroitin' },

  // Losartan Additions
  { id: 'b-lopo-50', brandName: 'Lopo 50', strength: '50mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-losartan' },
  { id: 'b-lopo', brandName: 'Lopo', strength: '50mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-losartan' },

  // Levothyroxine Additions
  { id: 'b-thyrox-75', brandName: 'Thyrox 75', strength: '75mcg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 3.50, genericId: 'gen-levothyroxine' },
  { id: 'b-thyrox', brandName: 'Thyrox', strength: '50mcg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 3.00, genericId: 'gen-levothyroxine' },
  { id: 'b-thyronor-75', brandName: 'Thyronor 75', strength: '75mcg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 3.50, genericId: 'gen-levothyroxine' },
  { id: 'b-levotac-75', brandName: 'Levotac 75', strength: '75mcg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 3.00, genericId: 'gen-levothyroxine' },
  { id: 'b-thyrox-25', brandName: 'Thyrox 25', strength: '25mcg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 2.50, genericId: 'gen-levothyroxine' },
  { id: 'b-thyrox-100', brandName: 'Thyrox 100', strength: '100mcg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 4.00, genericId: 'gen-levothyroxine' },

  // Mirtazapine
  { id: 'b-mirtaz-15', brandName: 'Mirtaz 15', strength: '15mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 15.00, genericId: 'gen-mirtazapine' },
  { id: 'b-mirtaz', brandName: 'Mirtaz', strength: '15mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 15.00, genericId: 'gen-mirtazapine' },
  { id: 'b-mirzaz-15', brandName: 'Mirzaz 15', strength: '15mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 13.50, genericId: 'gen-mirtazapine' },
  { id: 'b-mirtazen-15', brandName: 'Mirtazen 15', strength: '15mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 14.00, genericId: 'gen-mirtazapine' },

  // Prednisolone
  { id: 'b-delta-5', brandName: 'Delta 5', strength: '5mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 2.50, genericId: 'gen-prednisolone' },
  { id: 'b-delta', brandName: 'Delta', strength: '5mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 2.50, genericId: 'gen-prednisolone' },
  { id: 'b-deltasone-5', brandName: 'Deltasone 5', strength: '5mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 2.50, genericId: 'gen-prednisolone' },
  { id: 'b-prednil-5', brandName: 'Prednil 5', strength: '5mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 2.00, genericId: 'gen-prednisolone' },
  { id: 'b-delta-20', brandName: 'Delta 20', strength: '20mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-prednisolone' },

  // Testosterone
  { id: 'b-testarem-250', brandName: 'Testarem 250', strength: '250mg', form: 'Injection', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 280.00, genericId: 'gen-testosterone' },
  { id: 'b-testarem', brandName: 'Testarem', strength: '250mg', form: 'Injection', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 280.00, genericId: 'gen-testosterone' },
  { id: 'b-teston-250', brandName: 'Teston 250', strength: '250mg', form: 'Injection', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 290.00, genericId: 'gen-testosterone' },
  { id: 'b-sustanon-250', brandName: 'Sustanon 250', strength: '250mg', form: 'Injection', manufacturer: 'Organon Bangladesh', unitPrice: 450.00, genericId: 'gen-testosterone' },

  // Multivitamin + Minerals / Antioxidants
  { id: 'b-povital', brandName: 'Povital', strength: 'Standard Formula', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-multivitamin-minerals' },
  { id: 'b-filwel-gold', brandName: 'Filwel Gold', strength: 'Standard Formula', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 8.50, genericId: 'gen-multivitamin-minerals' },
  { id: 'b-gevit', brandName: 'Gevit', strength: 'Standard Formula', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 7.50, genericId: 'gen-multivitamin-minerals' },
  { id: 'b-aristovit-m', brandName: 'Aristovit M', strength: 'Standard Formula', form: 'Tablet', manufacturer: 'Aristopharma Ltd.', unitPrice: 6.50, genericId: 'gen-multivitamin-minerals' },

  // Bisoprolol
  { id: 'b-bisocor-25', brandName: 'Bisocor 2.5', strength: '2.5mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 7.00, genericId: 'gen-bisoprolol' },
  { id: 'b-bisonorm-25', brandName: 'Bisonorm 2.5', strength: '2.5mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 6.50, genericId: 'gen-bisoprolol' },
  { id: 'b-cardicor-25', brandName: 'Cardicor 2.5', strength: '2.5mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 6.50, genericId: 'gen-bisoprolol' },
  { id: 'b-bisocor-5', brandName: 'Bisocor 5', strength: '5mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 12.00, genericId: 'gen-bisoprolol' },

  // Telmisartan
  { id: 'b-telma-40', brandName: 'Telma 40', strength: '40mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 10.00, genericId: 'gen-telmisartan' },
  { id: 'b-telsartan-40', brandName: 'Telsartan 40', strength: '40mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 9.00, genericId: 'gen-telmisartan' },
  { id: 'b-telmikast-40', brandName: 'Telmikast 40', strength: '40mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 9.50, genericId: 'gen-telmisartan' },

  // Ketorolac
  { id: 'b-torax-10', brandName: 'Torax 10', strength: '10mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 12.00, genericId: 'gen-ketorolac' },
  { id: 'b-rolac-10', brandName: 'Rolac 10', strength: '10mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 11.00, genericId: 'gen-ketorolac' },
  { id: 'b-ketonic-10', brandName: 'Ketonic 10', strength: '10mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 11.00, genericId: 'gen-ketorolac' },

  // Aceclofenac
  { id: 'b-flexi-100', brandName: 'Flexi 100', strength: '100mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 5.50, genericId: 'gen-aceclofenac' },
  { id: 'b-aceclo-100', brandName: 'Aceclo 100', strength: '100mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 5.00, genericId: 'gen-aceclofenac' },
  { id: 'b-mervan-100', brandName: 'Mervan 100', strength: '100mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 5.00, genericId: 'gen-aceclofenac' },

  // Ciprofloxacin
  { id: 'b-ciprocin-500', brandName: 'Ciprocin 500', strength: '500mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 15.00, genericId: 'gen-ciprofloxacin' },
  { id: 'b-neofloxin-500', brandName: 'Neofloxin 500', strength: '500mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 15.00, genericId: 'gen-ciprofloxacin' },
  { id: 'b-cipro-a-500', brandName: 'Cipro-A 500', strength: '500mg', form: 'Tablet', manufacturer: 'The Acme Laboratories Ltd.', unitPrice: 13.50, genericId: 'gen-ciprofloxacin' },
  { id: 'b-flontin-500', brandName: 'Flontin 500', strength: '500mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 13.00, genericId: 'gen-ciprofloxacin' },

  // Cefuroxime
  { id: 'b-kilbac-500', brandName: 'Kilbac 500', strength: '500mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 50.00, genericId: 'gen-cefuroxime' },
  { id: 'b-ceftin-500', brandName: 'Ceftin 500', strength: '500mg', form: 'Tablet', manufacturer: 'Radiant Pharmaceuticals (GSK)', unitPrice: 65.00, genericId: 'gen-cefuroxime' },
  { id: 'b-cerox-a-500', brandName: 'Cerox-A 500', strength: '500mg', form: 'Tablet', manufacturer: 'The Acme Laboratories Ltd.', unitPrice: 48.00, genericId: 'gen-cefuroxime' },
  { id: 'b-cefur-500', brandName: 'Cefur 500', strength: '500mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 50.00, genericId: 'gen-cefuroxime' },

  // Domperidone
  { id: 'b-motigut-10', brandName: 'Motigut 10', strength: '10mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 3.50, genericId: 'gen-domperidone' },
  { id: 'b-omidon-10', brandName: 'Omidon 10', strength: '10mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 3.00, genericId: 'gen-domperidone' },
  { id: 'b-deflux-10', brandName: 'Deflux 10', strength: '10mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 3.00, genericId: 'gen-domperidone' },
  { id: 'b-vomidon-10', brandName: 'Vomidon 10', strength: '10mg', form: 'Tablet', manufacturer: 'Renata Limited', unitPrice: 3.20, genericId: 'gen-domperidone' },

  // Clonazepam
  { id: 'b-disopan-05', brandName: 'Disopan 0.5', strength: '0.5mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 6.00, genericId: 'gen-clonazepam' },
  { id: 'b-rivotril-05', brandName: 'Rivotril 0.5', strength: '0.5mg', form: 'Tablet', manufacturer: 'Radiant Pharmaceuticals (Roche)', unitPrice: 9.00, genericId: 'gen-clonazepam' },
  { id: 'b-epitra-05', brandName: 'Epitra 0.5', strength: '0.5mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 5.50, genericId: 'gen-clonazepam' },
  { id: 'b-clanza-05', brandName: 'Clanza 0.5', strength: '0.5mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 5.50, genericId: 'gen-clonazepam' },

  // Doxophylline
  { id: 'b-dexpoten-400', brandName: 'Dexpoten 400', strength: '400mg', form: 'Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 10.00, genericId: 'gen-doxophylline' },
  { id: 'b-doxoma-400', brandName: 'Doxoma 400', strength: '400mg', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 9.00, genericId: 'gen-doxophylline' },
  { id: 'b-pulmofor-400', brandName: 'Pulmofor 400', strength: '400mg', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 9.50, genericId: 'gen-doxophylline' },

  // Vitamin B Complex + Zinc
  { id: 'b-bicozin', brandName: 'Bicozin', strength: 'Standard Formula', form: 'Syrup / Tablet', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 6.00, genericId: 'gen-vitamin-b-complex' },
  { id: 'b-becovon', brandName: 'Becovon', strength: 'Standard Formula', form: 'Tablet', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 5.50, genericId: 'gen-vitamin-b-complex' },
  { id: 'b-neobion', brandName: 'Neobion', strength: 'Standard Formula', form: 'Tablet', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 5.00, genericId: 'gen-vitamin-b-complex' },
  { id: 'b-aristovit-b', brandName: 'Aristovit B', strength: 'Standard Formula', form: 'Tablet', manufacturer: 'Aristopharma Ltd.', unitPrice: 4.50, genericId: 'gen-vitamin-b-complex' },

  // Iron + Folic Acid
  { id: 'b-ferimax', brandName: 'Ferimax', strength: 'Standard Formula', form: 'Capsule', manufacturer: 'Square Pharmaceuticals Ltd.', unitPrice: 9.00, genericId: 'gen-iron-folic' },
  { id: 'b-fefol-ci', brandName: 'Fefol-CI', strength: 'Standard Formula', form: 'Capsule', manufacturer: 'Beximco Pharmaceuticals Ltd.', unitPrice: 9.00, genericId: 'gen-iron-folic' },
  { id: 'b-ipec-plus', brandName: 'Ipec-Plus', strength: 'Standard Formula', form: 'Capsule', manufacturer: 'Incepta Pharmaceuticals Ltd.', unitPrice: 8.00, genericId: 'gen-iron-folic' },
  { id: 'b-aristofer', brandName: 'Aristofer', strength: 'Standard Formula', form: 'Capsule', manufacturer: 'Aristopharma Ltd.', unitPrice: 7.50, genericId: 'gen-iron-folic' },
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
