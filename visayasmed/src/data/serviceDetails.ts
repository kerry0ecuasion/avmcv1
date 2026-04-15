export interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceDetail {
  slug: string;
  title: string;
  icon: string;
  tagline: string;
  heroDescription: string;
  overview: string;
  features: ServiceFeature[];
  specialties: string[];
  whyChooseUs: string[];
  colorAccent: string;
  colorBg: string;
  colorIcon: string;
  colorText: string;
  doctorSpecialtyMatch: string[];
}

const serviceDetails: ServiceDetail[] = [
  {
    slug: "family-medicine",
    title: "Family Medicine",
    icon: "👨‍👩‍👧‍👦",
    tagline: "Comprehensive Care for the Whole Family",
    heroDescription:
      "Our Family Medicine department provides holistic, patient-centered primary care for individuals of all ages — from newborns to the elderly. We focus on disease prevention, health maintenance, and the treatment of acute and chronic illnesses.",
    overview:
      "Family Medicine at VisayasMed is your first point of contact for comprehensive healthcare. Our board-certified family physicians are trained to manage a wide spectrum of medical conditions and are committed to building lasting relationships with patients and their families. We emphasize preventive care, early detection, and continuous health management tailored to each patient's unique needs.",
    features: [
      { icon: "🩺", title: "Primary Care Consultations", description: "Complete medical assessments and ongoing management of your health concerns." },
      { icon: "💉", title: "Vaccinations & Immunizations", description: "Comprehensive immunization programs for children, adults, and travelers." },
      { icon: "📋", title: "Preventive Health Screenings", description: "Age-appropriate screenings including blood pressure, cholesterol, glucose, and cancer markers." },
      { icon: "🫀", title: "Chronic Disease Management", description: "Long-term care for diabetes, hypertension, asthma, and other chronic conditions." },
      { icon: "🏥", title: "Annual Physical Exams", description: "Thorough yearly check-ups to assess overall health and catch issues early." },
      { icon: "📄", title: "Medical Certificates & Clearances", description: "Pre-employment, school, and travel medical certificates issued by licensed physicians." },
    ],
    specialties: [
      "General Health Consultations",
      "Chronic Disease Management",
      "Preventive Medicine",
      "Health Education & Counseling",
      "Minor Surgical Procedures",
      "Geriatric Care",
    ],
    whyChooseUs: [
      "Patient-centered approach with personalized treatment plans",
      "Experienced, board-certified family medicine physicians",
      "Convenient scheduling and walk-in availability",
      "Continuity of care from childhood to senior years",
      "Coordinated referrals to specialists when needed",
    ],
    colorAccent: "from-blue-500 to-blue-600",
    colorBg: "bg-blue-50 dark:bg-blue-950/30",
    colorIcon: "text-blue-600 dark:text-blue-400",
    colorText: "text-blue-600 dark:text-blue-400",
    doctorSpecialtyMatch: ["Family Medicine", "General Practice", "Primary Care"],
  },
  {
    slug: "pediatrics",
    title: "Pediatrics",
    icon: "👶",
    tagline: "Nurturing Young Lives with Expert Care",
    heroDescription:
      "Our Pediatrics department specializes in the medical care of infants, children, and adolescents. From well-baby check-ups to managing childhood illnesses, our pediatricians ensure your child receives the best possible care during every stage of development.",
    overview:
      "The Pediatrics department at VisayasMed is dedicated to the health and well-being of children from birth through adolescence. Our compassionate pediatricians provide comprehensive care, including routine check-ups, immunizations, developmental assessments, and treatment of childhood illnesses. We create a warm, child-friendly environment where young patients feel safe and comfortable.",
    features: [
      { icon: "👶", title: "Well-Baby & Well-Child Visits", description: "Regular developmental check-ups to track your child's growth milestones." },
      { icon: "💉", title: "Childhood Immunizations", description: "Complete vaccination schedules following national and WHO guidelines." },
      { icon: "🌡️", title: "Acute Illness Treatment", description: "Expert care for fever, infections, respiratory illnesses, and other childhood conditions." },
      { icon: "📊", title: "Growth & Development Monitoring", description: "Tracking height, weight, and developmental milestones at every visit." },
      { icon: "🧠", title: "Developmental Screening", description: "Assessment of speech, motor skills, and cognitive development." },
      { icon: "🍎", title: "Nutritional Counseling", description: "Guidance on proper nutrition, breastfeeding support, and dietary management." },
    ],
    specialties: [
      "Neonatal Care",
      "Childhood Immunizations",
      "Developmental Pediatrics",
      "Pediatric Infectious Disease",
      "Adolescent Medicine",
      "Pediatric Nutrition",
    ],
    whyChooseUs: [
      "Child-friendly environment designed to reduce anxiety",
      "Board-certified pediatricians with years of experience",
      "Comprehensive developmental screening programs",
      "Same-day appointments for urgent concerns",
      "Partnership with parents in every step of their child's health",
    ],
    colorAccent: "from-violet-500 to-purple-600",
    colorBg: "bg-violet-50 dark:bg-violet-950/30",
    colorIcon: "text-violet-600 dark:text-violet-400",
    colorText: "text-violet-600 dark:text-violet-400",
    doctorSpecialtyMatch: ["Pediatrics", "Pediatric", "Neonatal"],
  },
  {
    slug: "internal-medicine",
    title: "Internal Medicine",
    icon: "🩺",
    tagline: "Expert Adult Healthcare & Complex Disease Management",
    heroDescription:
      "Our Internal Medicine department offers specialized diagnostic and therapeutic care for adult patients. Our internists are experts in managing complex, multi-system diseases and providing evidence-based treatment for a wide range of medical conditions.",
    overview:
      "The Internal Medicine department at VisayasMed is staffed by highly skilled internists who specialize in the prevention, diagnosis, and treatment of adult diseases. From common ailments to complex medical conditions involving multiple organ systems, our team delivers precise and compassionate care. We utilize advanced diagnostic tools and the latest medical guidelines to ensure optimal patient outcomes.",
    features: [
      { icon: "🫀", title: "Cardiovascular Assessment", description: "Comprehensive heart health evaluation including ECG, stress tests, and risk stratification." },
      { icon: "🩸", title: "Diabetes Management", description: "Complete diabetes care including glucose monitoring, medication management, and lifestyle counseling." },
      { icon: "🫁", title: "Pulmonary Care", description: "Diagnosis and treatment of respiratory conditions including asthma, COPD, and pneumonia." },
      { icon: "🧪", title: "Advanced Diagnostics", description: "Access to state-of-the-art laboratory and imaging services for accurate diagnosis." },
      { icon: "💊", title: "Medication Management", description: "Expert management of complex medication regimens for patients with multiple conditions." },
      { icon: "📊", title: "Health Risk Assessment", description: "Comprehensive evaluation of lifestyle factors and disease risk markers." },
    ],
    specialties: [
      "Cardiology Referrals",
      "Endocrinology & Diabetes",
      "Pulmonology",
      "Gastroenterology",
      "Infectious Disease",
      "Nephrology",
    ],
    whyChooseUs: [
      "Experienced internists with subspecialty training",
      "Evidence-based approach to complex medical conditions",
      "Access to advanced diagnostic equipment",
      "Coordinated care with specialists across departments",
      "Comprehensive adult health management programs",
    ],
    colorAccent: "from-rose-500 to-pink-600",
    colorBg: "bg-rose-50 dark:bg-rose-950/30",
    colorIcon: "text-rose-600 dark:text-rose-400",
    colorText: "text-rose-600 dark:text-rose-400",
    doctorSpecialtyMatch: ["Internal Medicine", "Internist", "Cardiology", "Endocrinology", "Pulmonology"],
  },
  {
    slug: "surgery",
    title: "Surgery",
    icon: "🔪",
    tagline: "Precision Surgical Care When You Need It Most",
    heroDescription:
      "Our Surgery department is equipped with modern surgical facilities and staffed by skilled surgeons experienced in a wide range of general and specialized surgical procedures. We prioritize patient safety and outcomes above all.",
    overview:
      "The Surgery department at VisayasMed provides comprehensive surgical services ranging from minor outpatient procedures to major general surgery operations. Our surgeons are trained in both traditional and minimally invasive techniques, ensuring faster recovery times and reduced post-operative complications. Every surgical case is thoroughly evaluated, and patients receive personalized pre-operative and post-operative care.",
    features: [
      { icon: "🏥", title: "General Surgery", description: "Expert surgical management of abdominal, soft tissue, and other general surgical conditions." },
      { icon: "🔬", title: "Minimally Invasive Surgery", description: "Laparoscopic and endoscopic procedures for faster recovery and smaller incisions." },
      { icon: "🚑", title: "Emergency Surgery", description: "24/7 emergency surgical services for trauma, appendicitis, and other acute conditions." },
      { icon: "🩹", title: "Wound Care & Management", description: "Specialized wound debridement, closure, and post-operative wound management." },
      { icon: "📋", title: "Pre-Surgical Evaluation", description: "Comprehensive pre-operative assessments to ensure patient readiness and safety." },
      { icon: "💉", title: "Post-Operative Care", description: "Dedicated post-surgical monitoring and rehabilitation planning." },
    ],
    specialties: [
      "General Surgery",
      "Appendectomy",
      "Hernia Repair",
      "Cholecystectomy",
      "Wound Debridement",
      "Minor Surgical Procedures",
    ],
    whyChooseUs: [
      "Experienced surgeons with thousands of successful procedures",
      "Modern, well-equipped operating rooms",
      "24/7 emergency surgical capability",
      "Minimally invasive techniques for reduced recovery time",
      "Comprehensive pre- and post-operative care programs",
    ],
    colorAccent: "from-amber-500 to-orange-600",
    colorBg: "bg-amber-50 dark:bg-amber-950/30",
    colorIcon: "text-amber-600 dark:text-amber-400",
    colorText: "text-amber-600 dark:text-amber-400",
    doctorSpecialtyMatch: ["Surgery", "Surgeon", "General Surgery", "Surgical"],
  },
  {
    slug: "ob-gyne",
    title: "OB & GYNE",
    icon: "🤰",
    tagline: "Compassionate Women's Health & Maternity Care",
    heroDescription:
      "Our Obstetrics & Gynecology department provides comprehensive women's health services from adolescence through menopause. We specialize in prenatal care, safe deliveries, gynecological treatments, and reproductive health management.",
    overview:
      "The OB-GYNE department at VisayasMed is committed to providing compassionate, evidence-based care for women at every stage of life. Our team of obstetricians and gynecologists offers a full range of services including prenatal and postnatal care, high-risk pregnancy management, gynecological exams, family planning, and reproductive health counseling. We combine clinical expertise with a warm, supportive environment to ensure every woman receives personalized, respectful care.",
    features: [
      { icon: "🤰", title: "Prenatal Care", description: "Complete pregnancy monitoring including ultrasound, blood work, and birth planning." },
      { icon: "👶", title: "Labor & Delivery", description: "Safe, modern delivery facilities with 24/7 obstetric care and emergency capabilities." },
      { icon: "🩺", title: "Gynecological Exams", description: "Routine Pap smears, pelvic exams, and breast examinations for early detection." },
      { icon: "💊", title: "Family Planning", description: "Contraceptive counseling and services tailored to each patient's needs." },
      { icon: "🌸", title: "Menopause Management", description: "Hormonal therapy and lifestyle guidance for managing menopausal symptoms." },
      { icon: "🔬", title: "Reproductive Health", description: "Fertility assessments, infertility management, and reproductive health counseling." },
    ],
    specialties: [
      "Obstetric Care",
      "Gynecological Surgery",
      "Family Planning",
      "High-Risk Pregnancy",
      "Reproductive Endocrinology",
      "Adolescent Gynecology",
    ],
    whyChooseUs: [
      "Experienced OB-GYN specialists with compassionate approach",
      "Modern birthing suites with 24/7 care",
      "Comprehensive prenatal and postnatal programs",
      "Advanced screening and diagnostic capabilities",
      "Supportive, women-centered care environment",
    ],
    colorAccent: "from-emerald-500 to-green-600",
    colorBg: "bg-emerald-50 dark:bg-emerald-950/30",
    colorIcon: "text-emerald-600 dark:text-emerald-400",
    colorText: "text-emerald-600 dark:text-emerald-400",
    doctorSpecialtyMatch: ["OB", "GYNE", "Obstetrics", "Gynecology", "OB-GYNE", "OB & GYNE", "OB-GYN"],
  },
];

export const getServiceBySlug = (slug: string): ServiceDetail | undefined => {
  return serviceDetails.find((s) => s.slug === slug);
};

export const getAllServiceSlugs = (): string[] => {
  return serviceDetails.map((s) => s.slug);
};

export default serviceDetails;
