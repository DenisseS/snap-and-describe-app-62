export interface Author {
  id: string;
  name: string;
  title: string;
  credentials: string[];
  bio: string;
  avatar: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  specialties: string[];
  publications?: string[];
  experience: string;
  education: string[];
}

export const authors: Record<string, Author> = {
  'sarah-mitchell': {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    title: 'Certified Nutritionist & Digital Privacy Advocate',
    credentials: [
      'BS in Nutrition Science, University of California, Davis',
      'Registered Dietitian Nutritionist (RDN)',
      'Certified Nutrition Specialist (CNS)',
      'Digital Health Privacy Certificate, Stanford Online'
    ],
    bio: 'Sarah Mitchell is a certified nutritionist with 8 years of experience in nutrition counseling and digital health privacy. She specializes in helping people navigate nutrition apps safely while maintaining their data privacy. Sarah has been featured in nutrition podcasts and writes extensively about the intersection of technology and personal health.',
    avatar: '/authors/sarah-mitchell.jpg',
    socialLinks: {
      email: 'sarah.mitchell@nutritionprivacy.com',
      linkedin: 'https://linkedin.com/in/sarah-mitchell-nutrition',
      twitter: 'https://twitter.com/SarahNutrition'
    },
    specialties: [
      'Digital Health Privacy',
      'Nutrition App Security',
      'Evidence-Based Nutrition',
      'Data Protection in Health',
      'Personalized Nutrition'
    ],
    publications: [
      'Contributing author to "Digital Health Privacy Guide" (2024)',
      'Regular contributor to Nutrition Today magazine',
      'Featured expert on "The Healthy Tech Podcast" (2023-2024)'
    ],
    experience: '8 years of experience as a nutrition counselor, with specialization in digital health privacy advocacy. Former nutrition app consultant helping developers implement privacy-first approaches.',
    education: [
      'BS in Nutrition Science, University of California, Davis (2016)',
      'Registered Dietitian Internship, UC Davis Medical Center (2017)',
      'Digital Health Privacy Certificate, Stanford Online (2022)'
    ]
  },
  'elena-rodriguez': {
    id: 'elena-rodriguez',
    name: 'Elena Rodriguez',
    title: 'Ph.D. Nutritional Sciences & Digestive Health Specialist',
    credentials: [
      'Ph.D. in Nutritional Sciences, Cornell University',
      'Registered Dietitian Nutritionist (RDN)',
      'Board Certified Specialist in Sports Dietetics (CSSD)',
      'Digestive Health Certificate, International Foundation for Gastrointestinal Disorders'
    ],
    bio: 'Dr. Elena Rodriguez is a registered dietitian nutritionist with a Ph.D. in Nutritional Sciences and specialized training in digestive health and microbiome research. With over 12 years of clinical and research experience, she has published extensively on gut health, affordable nutrition strategies, and evidence-based digestive wellness approaches.',
    avatar: '/authors/elena-rodriguez.jpg',
    socialLinks: {
      email: 'elena.rodriguez@guthealth.edu',
      linkedin: 'https://linkedin.com/in/dr-elena-rodriguez-nutrition'
    },
    specialties: [
      'Gut Health & Microbiome Research',
      'Digestive Wellness',
      'Affordable Nutrition Strategies',
      'Clinical Nutrition',
      'Evidence-Based Practice',
      'Meal Planning & Preparation'
    ],
    publications: [
      'Lead author: "Small Changes, Big Impact: Microbiome Health Through Daily Habits" in Journal of Digestive Health (2024)',
      'Co-author: "Cost-Effective Nutrition: Evidence from Large-Scale Studies" in American Journal of Preventive Medicine (2024)',
      'Contributing researcher: "Gut-Brain Axis and Affordable Nutrition" in Nature Reviews Gastroenterology (2023)'
    ],
    experience: '12 years of combined clinical practice and research experience, specializing in digestive health, microbiome research, and developing affordable nutrition interventions for diverse populations.',
    education: [
      'Ph.D. in Nutritional Sciences, Cornell University (2012)',
      'MS in Clinical Nutrition, Case Western Reserve University (2009)',
      'BS in Dietetics, University of California, Los Angeles (2007)',
      'Registered Dietitian Internship, UCLA Medical Center (2008)'
    ]
  }
};

export const getAuthor = (authorId: string): Author | undefined => {
  return authors[authorId];
};