/**
 * Where every downloaded photograph on the public site came from. They are
 * stand-ins, from anywhere, until the real project photographs replace them.
 * All but the home hero are free under the Unsplash License
 * (https://unsplash.com/license): commercial use allowed, no attribution
 * required. The home hero was generated for TMPC in ElevenLabs, and its two
 * light masks (hero-home-lights-*.png) are cut from it. Kept so a credit can be
 * added, or a photo traced, later. Files keep the names the code already
 * uses; replace a file in place and update its row here.
 */

export interface PhotoCredit {
  file: string
  source: string
  photographer: string
  licence: string
}

export const PHOTO_CREDITS: PhotoCredit[] = [
  { file: '/images/hero-home.jpg', source: 'Generated for TMPC in ElevenLabs, 2026-10-16', photographer: 'TMPC (AI generated)', licence: 'TMPC own image' },
  { file: '/images/scenario-realestate.jpg', source: 'https://unsplash.com/photos/Kl94Gh1KmJc', photographer: 'Zoshua Colah', licence: 'Unsplash License' },
  { file: '/images/scenario-warehouse.jpg', source: 'https://unsplash.com/photos/5AmT_FPF5Jo', photographer: 'Feng Sun', licence: 'Unsplash License' },
  { file: '/images/hero-services.jpg', source: 'https://unsplash.com/photos/yWwob8kwOCk', photographer: 'Nastuh Abootalebi', licence: 'Unsplash License' },
  { file: '/images/scenario-commercial.jpg', source: 'https://unsplash.com/photos/QVVHV24DA_o', photographer: 'Aalo Lens', licence: 'Unsplash License' },
  { file: '/images/scenario-wellness.jpg', source: 'https://unsplash.com/photos/Koei_7yYtIo', photographer: 'Sara Dubler', licence: 'Unsplash License' },
  { file: '/images/scenario-office.jpg', source: 'https://unsplash.com/photos/KXWKoDJ2Hqc', photographer: 'Julia Taubitz', licence: 'Unsplash License' },
  { file: '/images/compare/home-before.jpg', source: 'https://unsplash.com/photos/Dqvb5xO0_Vg', photographer: 'Steffen Lemmerzahl', licence: 'Unsplash License' },
  { file: '/images/compare/home-after.jpg', source: 'https://unsplash.com/photos/vi59jclwSko', photographer: 'Trac Vu', licence: 'Unsplash License' },
  { file: '/images/compare/services-dm-before.jpg', source: 'https://unsplash.com/photos/6NrnN_L8Pvg', photographer: 'Karen Barrett', licence: 'Unsplash License' },
  { file: '/images/compare/services-dm-after.jpg', source: 'https://unsplash.com/photos/hk4zCmw2OCA', photographer: 'bahareh moradian', licence: 'Unsplash License' },
  { file: '/images/compare/services-eo-before.jpg', source: 'https://unsplash.com/photos/8Gg2Ne_uTcM', photographer: 'Danist Soh', licence: 'Unsplash License' },
  { file: '/images/compare/services-eo-after.jpg', source: 'https://unsplash.com/photos/gMes5dNykus', photographer: 'Patrick Tomasso', licence: 'Unsplash License' },
  { file: '/images/compare/about-scrub-before.jpg', source: 'https://unsplash.com/photos/uQGvhcQb5R8', photographer: 'Mohd Syahril Khalid', licence: 'Unsplash License' },
  { file: '/images/compare/about-scrub-after.jpg', source: 'https://unsplash.com/photos/QVVHV24DA_o', photographer: 'Aalo Lens', licence: 'Unsplash License' },
  { file: '/images/compare/about-lens-before.jpg', source: 'https://unsplash.com/photos/Y4SnivCDU30', photographer: 'Centar MURID', licence: 'Unsplash License' },
  { file: '/images/compare/about-lens-after.jpg', source: 'https://unsplash.com/photos/OM4VA8MdAwI', photographer: 'Antonio Araujo', licence: 'Unsplash License' },
  { file: '/images/compare/projects-commercial-before.jpg', source: 'https://unsplash.com/photos/KPwa9WbwKxM', photographer: 'Olek Buzunov', licence: 'Unsplash License' },
  { file: '/images/compare/projects-commercial-after.jpg', source: 'https://unsplash.com/photos/KR4u_ejqQGw', photographer: 'Haris Illahi', licence: 'Unsplash License' },
  { file: '/images/compare/projects-hospitality-before.jpg', source: 'https://unsplash.com/photos/TBzjhks3G48', photographer: 'Centar MURID', licence: 'Unsplash License' },
  { file: '/images/compare/projects-hospitality-after.jpg', source: 'https://unsplash.com/photos/mf78SXw4uME', photographer: 'Antonio Araujo', licence: 'Unsplash License' },
  { file: '/images/compare/projects-residential-before.jpg', source: 'https://unsplash.com/photos/hfI0pr6g4yw', photographer: 'Design Hills', licence: 'Unsplash License' },
  { file: '/images/compare/projects-residential-after.jpg', source: 'https://unsplash.com/photos/_tEBCVrEnyo', photographer: 'Tim Schmidbauer', licence: 'Unsplash License' },
  { file: '/images/compare/project-phase-rendering.jpg', source: 'https://unsplash.com/photos/e814dxh9pJg', photographer: 'Aalo Lens', licence: 'Unsplash License' },
  { file: '/images/compare/project-phase-in-progress.jpg', source: 'https://unsplash.com/photos/BIeC4YK2MTA', photographer: 'Ben Allan', licence: 'Unsplash License' },
  { file: '/images/compare/project-phase-completed.jpg', source: 'https://unsplash.com/photos/jujtr95R5Ts', photographer: 'Zoshua Colah', licence: 'Unsplash License' },
  { file: '/images/compare/cta-before.jpg', source: 'https://unsplash.com/photos/XbVFTehSdj0', photographer: 'Rubens Nguyen', licence: 'Unsplash License' },
  { file: '/images/compare/cta-after.jpg', source: 'https://unsplash.com/photos/zumZYsxYR7c', photographer: 'Warongkarit Ingkutanon', licence: 'Unsplash License' },
  { file: '/images/projects/mixed-use-bangkok.jpg', source: 'https://unsplash.com/photos/atYoXjIr8qY', photographer: 'Nopparuj Lamaikul', licence: 'Unsplash License' },
  { file: '/images/projects/factory.jpg', source: 'https://unsplash.com/photos/Af0Kzbi5DL0', photographer: 'Declan Sun', licence: 'Unsplash License' },
  { file: '/images/projects/warehouse.jpg', source: 'https://unsplash.com/photos/wHfvgx506PM', photographer: 'Rack Manufacturing Expert', licence: 'Unsplash License' },
  { file: '/images/projects/office-fitout.jpg', source: 'https://unsplash.com/photos/pYlBAu3de0w', photographer: 'Bernd Dittrich', licence: 'Unsplash License' },
  { file: '/images/projects/spa.jpg', source: 'https://unsplash.com/photos/lyicBM-7zFA', photographer: 'ikhbale', licence: 'Unsplash License' },
  { file: '/images/projects/villa.jpg', source: 'https://unsplash.com/photos/ksa5r_xt8cg', photographer: 'Sanju Pandita', licence: 'Unsplash License' },
  { file: '/images/projects/villa-works.jpg', source: 'https://unsplash.com/photos/xj8rjDCEYk4', photographer: 'Ben Koorengevel', licence: 'Unsplash License' },
  { file: '/images/process/process-brief.jpg', source: 'https://unsplash.com/photos/1eDXOXOixsg', photographer: 'Bernd Dittrich', licence: 'Unsplash License' },
  { file: '/images/process/process-team.jpg', source: 'https://unsplash.com/photos/ST-QAmN8BIk', photographer: 'Declan Sun', licence: 'Unsplash License' },
  { file: '/images/process/process-design.jpg', source: 'https://unsplash.com/photos/-FPFq_trr2Y', photographer: 'Daniel McCullough', licence: 'Unsplash License' },
  { file: '/images/process/process-construction.jpg', source: 'https://unsplash.com/photos/DWp5nUqTn6E', photographer: 'Glenov Brankovic', licence: 'Unsplash License' },
  { file: '/images/process/process-handover.jpg', source: 'https://unsplash.com/photos/hWWrF-XyQWk', photographer: 'Timofey Radkevich', licence: 'Unsplash License' },
]
