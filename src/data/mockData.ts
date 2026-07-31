import { Novel, TimelineItem, SyncStats } from '../types';

export const INITIAL_NOVELS: Novel[] = [
  {
    id: 'shadow-of-the-void',
    title: 'Shadow of the Void',
    author: 'Aris Thorne',
    artist: 'Kaelen Thorne',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARtcjG0Jhla_j1krti4Gz7ZyhY8U-Z8ekciM3kF5qha7_Ju3Fqun-8Jk0mSiEIuGHuj4ux79Qy9eTn-hrhRszKyEQsrB6CRso2rpRyQyK2HtesjJFeR8EEiJUFVi4vaD7axUakASpkpMLVOFTYr9bcja3XI3lJfggxRVy4FOj711GE5uoRhfSzmUaAeg8FoQnXGSnHEJ4P3iXXApmBRxsklirmPLw_bR2ukId8tGo34AMglg0BEAW7',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUqNJFHKf5QrHrIFNeKaxrNIi1yb3APE3YQ1vCoPEYd_x6vygw17tzbKEJusardGE5XGX1qBM-cRwuvtQKadUO4qeYRmX1wWwkWOt3Gedi0acTn5XI5IIPLKYTKgQeSRUtlhJHgYxtlWJB3BMf75WdZ4hgQq-OnzypLGwecIdbFz55FR4zxd0BUcsA6zSnJ9CyB1jCufxncx5x2RjgZdeR4hTkPwoC1VVrgdwShr2JtvJKKG39025T',
    rating: 4.9,
    ratingsCount: '12.4k',
    status: 'Ongoing',
    totalChapters: 243,
    genres: ['Fantasy', 'Seinen', 'Mystery', 'Psychological', 'Action'],
    synopsis: "In a world where the sun has been eclipsed for a century, Kaelen survives in the neon-lit gutters of the Lower Spire. He was born with a mark of the 'Void Walker'—a curse that allows him to slip into the spaces between reality. When the Citadel's elite forces begin hunting those with the mark, Kaelen is forced into a cosmic game of survival that spans multiple dimensions. As the shadows grow longer, he discovers that the void isn't just an empty space; it's a hungry entity waiting for the right key to unleash its ancient terror.",
    translationGroup: {
      name: 'Aetheric Scans',
      quality: 'Primary Translation Group • High Quality',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk2fVlvylvFOj_o4N8tIpCbqXj0eLieTWRaHqDn771qC_n_2JUgYj3_fMFcUq2-KkBONFNH-C2xhNLsGOI5RFr4h55OqOi7-wgkkFeFBX_dH3k0Un311h24OWjZY47cuKhhSt1QYEmjCzH_WdthAFSSROPYSnHWsV1cmSfRgz1wqmHYX82mdRzSCA9tfHO8KQTQk4Q39-2j5_GHH13rIICK3n6ThOWYwHlrj07QOjC2yn4rbiFC-qN',
      siteUrl: 'https://aetheric-scans.example.com',
      isFollowed: true,
    },
    releaseFrequency: '3 Chapters / Week',
    totalViews: '2.8M Readers',
    recommendationsCount: '+8k',
    recommendationsAvatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTgHA74MkaaqfNkI3nHJ6KzkNjpcyzXoirOAj9p2LcaykgGPydMsEIZUrQwFjz9faDOO1D6o5JQXPgmwXxaVap5vqD1nX3DhPGI2pbNTt9s6OOrvfOywzQaPL9PU1tjcf1UCFKK3NNgfHtOozDNbKPHrj2vrUFoa6R8wJLVSpaUuTOn8U6w2MIA1QqIgG3nisx0r8P3cnBcCjRFYYkMeETpwjaTswhi5pi0jAQcq3F9Cf9LEFUt_Aj',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVh9t67BOFmtbJ0iESu6G4MaWtaBIf0fa-KTUfvpxcdlfIEJGSi6I-1IutuyVJUY3oQIZmGBtv_kJKcC9n59WhMj3ySIfjnmEiJ8ghtcijU68c02_xviYfzpZx1UTKbG1Mr6Imw97RCjfZyRC_RwKJfLl1pJA7ndwJ__l0OKMJDFLO7uZNjnWrM2Rh84croDEVXJ6D6uEmdhBmrMGFA-VJ8VDnXykWOcY6jili3INMczz5Mkj6__R6',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBpcVopRSiBmLs5T5f_1EIWXDiS3VdkQ7HPoBtOekNzRrXhuThJb2RV0anKDbDqx12NTt_num9B6PiswZSo4AqswKF7DfOfA7tdrdlMKY8KS1UMuaI7L-VpDaAsbexY-QTICumfjJOmey9IY4L_Yi8FCzGuAEcC8gyTDVPhmEMqXRvS02_ZC6SEzKIcpQtHh1foHbFD9iTwvyCIceOYhjUIkAQZx9Ik_UlDLxktSSJYoRri3x8T9BAz',
    ],
    lastReadChapterId: 'ch-02',
    lastReadProgress: 100,
    isBookmarked: true,
    chapters: [
      { id: 'ch-01', number: 1, title: 'The Eclipse of Hope', date: 'Oct 12, 2023', isRead: true },
      { id: 'ch-02', number: 2, title: 'Whispers from the Void', date: 'Oct 14, 2023', isRead: true },
      { id: 'ch-03', number: 3, title: 'The Mark Awakening', date: 'Oct 15, 2023', isRead: false },
      { id: 'ch-04', number: 4, title: 'Citadel of Glass', date: 'Oct 18, 2023', isRead: false },
      { id: 'ch-05', number: 5, title: 'Echoes in the Lower Spire', date: 'Oct 22, 2023', isRead: false },
      { id: 'ch-06', number: 6, title: 'Boundaries of Reality', date: 'Oct 26, 2023', isRead: false },
      { id: 'ch-42', number: 42, title: 'The Awakening', date: 'Nov 10, 2023', isRead: false },
    ],
  },
  {
    id: 'eternal-archive',
    title: 'The Eternal Archive: Chronicles of the Void-Born',
    author: 'Elara Vance',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbXsp_u-Xqg_BEBrpd1aekcFhe9qFTq2jgWKmsaudsspXAOqWkMSXwIMTwawUzas2Uajp--uvVJsRDXdHeaUvrCWGzCnQWnuzpeeoJyQRE3iXw_INvxY4gc_5fT4naYjpkzOgb401OMk9z712KS81_b4cH7X08vDMzksMDeVVySzcvw6GOPE6q0rOHzOgIwkHT8Pbr67ulxL1X5yhhmsIvbPcFUc09mqywQIU-o3zPlrPAhBRQuV0w',
    rating: 4.95,
    ratingsCount: '28.1k',
    status: 'Ongoing',
    totalChapters: 120,
    genres: ['Fantasy', 'Mystery', 'Magic'],
    synopsis: 'Deep within the Ivory Tower of Aethelgard, Elara uncovers a manuscript written in bioluminescent violet ink. As she turns the pages, history itself begins to rewrite around her, drawing her into an ancient interstellar war.',
    translationGroup: {
      name: 'Sky Novels',
      quality: 'Official Scanlation',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk2fVlvylvFOj_o4N8tIpCbqXj0eLieTWRaHqDn771qC_n_2JUgYj3_fMFcUq2-KkBONFNH-C2xhNLsGOI5RFr4h55OqOi7-wgkkFeFBX_dH3k0Un311h24OWjZY47cuKhhSt1QYEmjCzH_WdthAFSSROPYSnHWsV1cmSfRgz1wqmHYX82mdRzSCA9tfHO8KQTQk4Q39-2j5_GHH13rIICK3n6ThOWYwHlrj07QOjC2yn4rbiFC-qN',
      siteUrl: 'https://skynovels.example.com',
    },
    releaseFrequency: '5 Chapters / Week',
    totalViews: '4.1M Readers',
    recommendationsCount: '+12k',
    recommendationsAvatars: [],
    lastReadChapterId: 'ch-42',
    lastReadProgress: 45,
    isBookmarked: true,
    chapters: [
      {
        id: 'ch-42',
        number: 42,
        title: 'The Awakening',
        date: 'Jul 28, 2024',
        isRead: false,
        illustrationUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwsAwroU-K5qvy82J_SbjXVzivnWs9_mzrLwiBHnlTK8p_V6SWkdM4nwa0yimHRxU4fOvAdasuMPtr982e7cPj8PM2AjuDVNmp1jumWsLDjLvgsbAQUz8f4iyZY8oiqyjEcqS1u8GbuDCbHwKCnSXuIHPOsbxddWWi25l67-VWuCbko4Up8jBP9AIu_iEyaQ78EKTc2J6y-26MJGJmZ45eNVsNMcKAfkWddynpHEPU_4RXOzUImQs0',
        content: [
          "The dawn did not break with a roar, but with a whisper of violet light that bled through the heavy velvet curtains of the archives. Elara watched the dust motes dance in the first rays, each speck a tiny universe revolving around the silence of the room. For three days, the silence had been her only companion, save for the rhythmic turning of brittle parchment pages.",
          "The manuscript lay open before her, its ink shimmering with a faint, bioluminescent glow that hadn't been there when the sun was down. The letters seemed to shift, rearranging themselves not into words, but into memories. She reached out, her fingertips hovering just millimeters above the surface. She could feel the hum of the magic—a low, vibrating frequency that resonated in her very marrow.",
          '"So it begins," she whispered, her voice sounding foreign in the stillness. The awakening wasn\'t just in the text; it was a physical sensation, like a long-dormant engine finally catching fire. The archives felt smaller now, the walls less like a sanctuary and more like a shell that she was rapidly outgrowing.',
          "Outside, the city of Aethelgard was still asleep, unaware that the foundation of its history had just been rewritten in a quiet room at the top of the Ivory Tower. Elara closed her eyes, letting the violet light seep through her eyelids. The history of the world was no longer a collection of dates and names. It was a living, breathing thing, and she was its new heartbeat.",
          "She turned the page. The paper felt warm now, pulsing with the rhythm of her own heart. The next chapter wasn't written in ink, but in light. And for the first time in centuries, the light was beckoning someone to follow."
        ]
      }
    ]
  },
  {
    id: 'neon-moonlight-whispers',
    title: 'Neon Moonlight Whispers',
    author: 'Kaelen Thorne',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFHE3xrQ2m8F519q_QsLbKIoPxO_n7PV2NWebt3yOZ2945J3PkMXx2Ye2gBFhhATPjnnKRgAE0ekBs2zBm0CNyTaegI5QoGbbjE6qOT7UVXDnbKEbh9JhtN73PRZd1hz12iPa4J-CwvLLacim4JR1tp7KCf8trhCL4Xi8F-uXBPzNhf1XsLixfP12rlCioUnYNsQBmkaKKLhaFphJ4eOgCdo7kOekVkxfhu4E5QHm7-mfy8Up5FWkw',
    rating: 4.8,
    ratingsCount: '15.2k',
    status: 'Ongoing',
    totalChapters: 85,
    genres: ['Fantasy', 'Cyberpunk', 'Gothic'],
    synopsis: 'In a gothic cathedral overlooking a neon-drenched metropolis, a silver-haired mage conducts secret rituals through stained-glass data arrays.',
    translationGroup: { name: 'Abyss Scans', quality: 'HD Scans', avatarUrl: '', siteUrl: '' },
    releaseFrequency: '2 Chapters / Week',
    totalViews: '1.9M Readers',
    recommendationsCount: '+5k',
    recommendationsAvatars: [],
    lastReadChapterId: 'ch-24',
    lastReadProgress: 75,
    isBookmarked: true,
    chapters: [
      { id: 'ch-24', number: 24, title: 'The Silent City', date: 'Jul 25, 2024', isRead: true }
    ]
  },
  {
    id: 'sands-of-the-triple-moon',
    title: 'Sands of the Triple Moon',
    author: 'Reid Kadowaki',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClN3b_tgveQUJZyV4FepVYt22U2W5CH_r8GeyCyZxWDALD650Fb6Stt8IDe4du7L5TmneBCsCM8JhCuYeANH_6s-FmRzXsnbG48C06ob7Ygfs6Bc1UyYSveHNRGQXpZaUifDee63WUeGLIwCpLXY7UfP-XZ_J4hV_CY2Xn4g_0250d4dlkuXCg05OxDFVJw3Bv37MwuLfA5FjJy2v-M_meB7H5DJkiyWWOBRgq3oxwAd-MW_UXpMno',
    rating: 4.7,
    ratingsCount: '9.8k',
    status: 'Ongoing',
    totalChapters: 60,
    genres: ['Adventure', 'Sci-Fi', 'Fantasy'],
    synopsis: 'Traversing a desert of bioluminescent azure sand under three celestial moons, a lone wanderer seeks the Lost Reliquary.',
    translationGroup: { name: 'Desert Scans', quality: 'Standard', avatarUrl: '', siteUrl: '' },
    releaseFrequency: '1 Chapter / Week',
    totalViews: '980k Readers',
    recommendationsCount: '+2k',
    recommendationsAvatars: [],
    lastReadChapterId: 'ch-02',
    lastReadProgress: 12,
    isBookmarked: true,
    chapters: [
      { id: 'ch-02', number: 2, title: 'Arid Awakening', date: 'Jul 20, 2024', isRead: false }
    ]
  },
  {
    id: 'glitch-protocol-zenith',
    title: 'Glitch Protocol: Zenith',
    author: 'Hikari Tanaka',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg_NjgWsJqU4VroplgwxH3uk3Q6hujle56u5yorOk6u76qW3JmFxia8-iESiLAvqGwujqqwYYVTTCAduSP6D_9NSeb5lbqnWwqYWny2whJOl2jRQuCgyqKKA6bHFAxo96l12uqoOq-SYzJKvp6xK-B01g2IArd5lPC0cv047S4opn4aqC-SPJ474vNdHRI_g7aBlvZOrb2hv3yDaw3uqE9pooerF8ByZlcBhU79VLAvTWs1LuMsfcA',
    rating: 4.9,
    ratingsCount: '21.0k',
    status: 'Ongoing',
    totalChapters: 90,
    genres: ['Cyberpunk', 'Action', 'Thriller'],
    synopsis: 'A high-octane cyberpunk thrill ride following an rogue netrunner attempting the ultimate data heist in futuristic Neo-Tokyo.',
    translationGroup: { name: 'CyberScans', quality: 'Premium', avatarUrl: '', siteUrl: '' },
    releaseFrequency: '4 Chapters / Week',
    totalViews: '3.5M Readers',
    recommendationsCount: '+9k',
    recommendationsAvatars: [],
    lastReadChapterId: 'ch-88',
    lastReadProgress: 90,
    isBookmarked: true,
    chapters: [
      { id: 'ch-88', number: 88, title: 'Final Upload', date: 'Jul 26, 2024', isRead: true }
    ]
  },
  {
    id: 'shadow-protocol-rebirth',
    title: 'Shadow Protocol: Rebirth',
    author: 'Sora Vance',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzPVABn9wkHcHKrS3xb1rhLZ9T4hGG8O2npN3oUb-ypCYzboWxpcckCHQ7HSLtLYvrL11c10EdRtKSJlD2xu-Vr-Y8ivbFdWWAsEELP1exnwsXuxkz283Igs-Ds9ra_oiX4Tv9CP2bH6lNsGcGs4xRJf0EhT8JN47wpYpRv3rfJu2ex8l3mCQxArsKp9mYkveSTq6B5zmfQmKG7hquj5dgzH62oPr_POhq71tAF1ZyAtQPt1slTJFw',
    rating: 4.8,
    ratingsCount: '4.8k',
    status: 'Ongoing',
    totalChapters: 110,
    genres: ['Action', 'Sci-Fi'],
    synopsis: 'A deadly cyber-sorceress wielding glowing data-shards fights to reclaim her memories in a drenched neon metropolis.',
    translationGroup: { name: 'Aetheric Scans', quality: 'Primary', avatarUrl: '', siteUrl: '' },
    releaseFrequency: '3 Chapters / Week',
    totalViews: '1.2M Readers',
    recommendationsCount: '+3k',
    recommendationsAvatars: [],
    chapters: [
      { id: 'ch-01', number: 1, title: 'Data Awakening', date: 'Jul 01, 2024', isRead: false }
    ]
  },
  {
    id: 'echoes-of-the-digital-petals',
    title: 'Echoes of the Digital Petals',
    author: 'Hikari Tanaka',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiiI4V8KfTZekqZbVMVjleFhSFPnQi9uwoCYOsQTHOvWfoqkIG1wkRtwyrpjcka2zDt9qgHCo30IvXJebWhh7GJPDg9nkZserWBDlDrZSDnuB2zDm-pJMtumn3_iXWPcDqWbme0JoyKswlLiFhJAbyUyEJ2e8gYbzfs9JjE09KTfg8Z9-WYQIK6CbdVmMzscoui-uGDuRCXkpOxAdq3KbE1fXsfMrkW7xkgA2aMicZFaY36A8ov4P6',
    rating: 4.9,
    ratingsCount: '12.2k',
    status: 'Ongoing',
    totalChapters: 45,
    genres: ['Slice of Life', 'Romance', 'Sci-Fi'],
    synopsis: 'Holographic cherry blossoms gently float across a serene traditional garden in a utopian floating biosphere.',
    translationGroup: { name: 'Sky Novels', quality: 'High Quality', avatarUrl: '', siteUrl: '' },
    releaseFrequency: '2 Chapters / Week',
    totalViews: '2.1M Readers',
    recommendationsCount: '+6k',
    recommendationsAvatars: [],
    chapters: [
      { id: 'ch-01', number: 1, title: 'Spring in Orbit', date: 'Jul 05, 2024', isRead: false }
    ]
  },
  {
    id: 'celestial-scale-sovereign',
    title: 'Celestial Scale Sovereign',
    author: 'Aris Thorne',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApUPZhvULlPFoCdVs-RUUQS3DSCbmJHtJKMuL5SaCU-UmUvxdbm6syLcWuoPCONuS-Mxn0JiljSW3i9BKN-uRZ73cLvpPR83zU4Ori_yyUi92nNWt7dnkUhXoB-qUY7iFndcwAeXFA6p0LbKOOHPWjkl0k35_KLiEZ3JvufNZz9eJTHyhKMupz9vSXgwhcnGN2vTwtAl26tHTLLZpIgs8S0r-abqnFqSwU3mm08TtjxuHd04aeNbuq',
    rating: 4.6,
    ratingsCount: '3.1k',
    status: 'Ongoing',
    totalChapters: 180,
    genres: ['Fantasy', 'Xianxia', 'Adventure'],
    synopsis: 'A dragon forged from living stellar constellations descends upon the mortal realms to restore cosmological balance.',
    translationGroup: { name: 'Aetheric Scans', quality: 'High Quality', avatarUrl: '', siteUrl: '' },
    releaseFrequency: '3 Chapters / Week',
    totalViews: '1.4M Readers',
    recommendationsCount: '+4k',
    recommendationsAvatars: [],
    chapters: [
      { id: 'ch-01', number: 1, title: 'Starfall', date: 'Jun 12, 2024', isRead: false }
    ]
  },
  {
    id: 'echoes-of-neon',
    title: 'Echoes of Neon',
    author: 'Reid Kadowaki',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZw6cS_dM1QxD_jEonmvl7--_fbcm7-etChjznKlGK4q4kCMnLFnVM9K5Bnb-pWeGZOb0G1Fq9NTHk9GwVx8rtvybL2zlHBJHvSs0oi9Gh7Hus59fiMBafOE4pDAnNSHJZDSQX8SWKyc-XaZY6bG5_3NefSpz-HF-vwktoEWnnNTaisxfB4f8BU9t0X_sl-JQ0KNJOzy-7l0ZbJihJeUNFH6GryQx-6ylUrgnNaMoO2-9mCuztJVMw',
    rating: 4.7,
    ratingsCount: '7.4k',
    status: 'Ongoing',
    totalChapters: 72,
    genres: ['Cyberpunk', 'Thriller'],
    synopsis: 'Beneath the neon glow of Spire 9, an underground investigator traces a conspiracy that threatens the digital grid.',
    translationGroup: { name: 'Abyss Scans', quality: 'HD Scans', avatarUrl: '', siteUrl: '' },
    releaseFrequency: '2 Chapters / Week',
    totalViews: '1.1M Readers',
    recommendationsCount: '+3k',
    recommendationsAvatars: [],
    chapters: []
  },
  {
    id: 'lunar-despair',
    title: 'Lunar Despair',
    author: 'Kaelen Thorne',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk8LwDH5aQLgiujiKZk59UeNzz-Gn-IeAMnzJskO8LSqGFFzsCOcM3nGYyetYWhO6LgdwWy7UwBbNt13UV0oZtSsl-mzNAPEJAypn_17Wtj5DEer_mHrNpeARfb2LcZPJ8AVMUce0Muua2hcA_KSiwO64UqidUvIHgiSJsHYT2DhFkMwIcmVZvjUqMhMOSss5YyDYSSWCUC1ngIJnV3Wku12Kq01wNk7PC6o5ab0Cwx9don3AVSpqu',
    rating: 4.5,
    ratingsCount: '5.2k',
    status: 'Ongoing',
    totalChapters: 54,
    genres: ['Fantasy', 'Dark'],
    synopsis: 'Under a blood-red moon, ancient dragons awaken from slumber to challenge the knights of the Order of Cinders.',
    translationGroup: { name: 'Gearhead', quality: 'Standard', avatarUrl: '', siteUrl: '' },
    releaseFrequency: '1 Chapter / Week',
    totalViews: '850k Readers',
    recommendationsCount: '+2k',
    recommendationsAvatars: [],
    chapters: []
  }
];

export const MOCK_TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: 'tl-1',
    novelId: 'neon-chronicles',
    novelTitle: 'Neon Chronicles',
    novelCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSWj4G7XB02i4OInSndnSiINCBZmUVdpI4Q1fNA1fy23v8_2FSSl88z4nzg5JZ_awJhd4cL3IVR3GAObKP1jXSTFx-RXS0ZHgbxmwN40l3V7XIsn1dGZPxRsxC3G-eCLH63_fWHplKR0lik9WaaEsuYnrpux7UUWAeMoym74BEQxVUzaAPb8Hqr7X-RTaVZe6nc2NHzBjaBTMWN4YChv5iqVK65w75BQQFF_B6bLilHuD86eQQAaLz',
    translator: 'Translation by Abyss Scans',
    chaptersAddedCount: 5,
    timeAgo: '2h ago',
    month: 'August',
    year: '2024'
  },
  {
    id: 'tl-2',
    novelId: 'emerald-whispers',
    novelTitle: 'Emerald Whispers',
    novelCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiWj51JnE9s1cdKZllTY_w1JPfUIfTyblpM8sEANVBY1DV4tuwvljsGbcVL4NaEo0I0-TkEdkiUa2kfvKL6Bq7OneHLm6LeTlWZAYoQGsO-7xpJeUR0uttHi3ObEVrgV_PgTllCFd_fz97JqF8-jRyM4XBtv4cW8TJn0t2sMO_gPJfaA3z2_v_OHeUl8ifb3Ta_w576s460u8yhSxn9I-INrqhDbYx9oicd7ghKmXFo7gfucQx_5yt',
    translator: 'Translation by Sky Novels',
    chaptersAddedCount: 5,
    timeAgo: 'Yesterday',
    month: 'August',
    year: '2024'
  },
  {
    id: 'tl-3',
    novelId: 'gear-and-ghost',
    novelTitle: 'Gear & Ghost',
    novelCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-dIMDsBV0f6RKBUTttj06fi6XIMJZdOukbNxOc_lFPH6f65iXEe9TeqggVC2SEyr_mMHTztGv8CXDpBlAR130lFg89TfV2jsqPCl9bsvj_W-tvL6r6qVnIUgdBhzEs9ZZ5JZ0zbUQMr6rnp2RBYetyZiKuGOR0oWR3I8wsp7zuAqTlluaj9DkhYjArxufSsNNjpg3V7ml-dnRX9z6xH2LnLt6OxPm6_mwXkjEq5ucgWMd7ErPY-Vl',
    translator: 'Translation by Gearhead',
    chaptersAddedCount: 5,
    timeAgo: '3d ago',
    month: 'August',
    year: '2024'
  }
];

export const MOCK_SYNC_STATS: SyncStats = {
  totalChapters: '2.4k',
  chaptersThisMonth: '+142 discovered this month',
  newSeriesCount: 12,
  newGroupsCount: 3,
  nextSyncCountdown: '4m 12s',
  nextSyncPercentage: 74,
};

export const USER_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFviHQy1uKitQf7K4ugO91tfqbM87_ufFHFDHFYc_J8qb51npDgRXTc2oEF53vePVVuwKyni5Q3nOHx-ogiom8ndVlnQsl2hk08n6aRnG9uKvADNxWjXmVJP4Zst9fgwNitKdvvbvxlUmnybsIICP6ry1v_usDjVB1_jTA8HBXgrq-QEFAOhhrDkCIiOpv3VpQ8uWBeVhf7X1ZLYRf9tR-NaFTmUeNBwwyE4fac1JR3LZp1g71ZANL';
