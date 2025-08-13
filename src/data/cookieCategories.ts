import { CookieCategory } from '@/types/cookies';

export const cookieCategories: CookieCategory[] = [
  {
    id: 'necessary',
    nameKey: 'cookies.necessary.name',
    descriptionKey: 'cookies.necessary.description',
    required: true,
    cookies: []
  },
  {
    id: 'functional',
    nameKey: 'cookies.functional.name',
    descriptionKey: 'cookies.functional.description',
    required: false,
    cookies: []
  },
  {
    id: 'analytics',
    nameKey: 'cookies.analytics.name',
    descriptionKey: 'cookies.analytics.description',
    required: false,
    cookies: [
      {
        nameKey: 'cookies.analytics.ga.name',
        domain: '.google.com',
        expiration: '2 years',
        path: '/',
        descriptionKey: 'cookies.analytics.ga.description'
      },
      {
        nameKey: 'cookies.analytics.ga_session.name',
        domain: '.google.com',
        expiration: '2 years',
        path: '/',
        descriptionKey: 'cookies.analytics.ga_session.description'
      }
    ]
  },
  {
    id: 'marketing',
    nameKey: 'cookies.marketing.name',
    descriptionKey: 'cookies.marketing.description',
    required: false,
    cookies: [
      {
        nameKey: 'cookies.marketing.gcl_au.name',
        domain: '.google.com',
        expiration: '90 days',
        path: '/',
        descriptionKey: 'cookies.marketing.gcl_au.description'
      },
      {
        nameKey: 'cookies.marketing.nid.name',
        domain: '.google.com',
        expiration: '6 months',
        path: '/',
        descriptionKey: 'cookies.marketing.nid.description'
      },
      {
        nameKey: 'cookies.marketing.gads.name',
        domain: '.google.com',
        expiration: '2 years',
        path: '/',
        descriptionKey: 'cookies.marketing.gads.description'
      },
      {
        nameKey: 'cookies.marketing.gpi.name',
        domain: '.google.com',
        expiration: '1 year',
        path: '/',
        descriptionKey: 'cookies.marketing.gpi.description'
      }
    ]
  }
];