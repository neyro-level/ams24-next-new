export type RedirectRule = {
  source: string
  destination: string
  permanent: true
}

export const redirects: RedirectRule[] = [
  {
    source: '/identifikatsiya-posetiteley-sayta/',
    destination: '/pixel/',
    permanent: true,
  },
  {
    source: '/zashchita-ot-perekhvata-lidov/',
    destination: '/zashchita/',
    permanent: true,
  },
]
