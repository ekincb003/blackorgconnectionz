import { User, Organization, ChatMessage, Notification, GroupChat, ClaimRequest } from '../types';

// ONLY Elijah Kincade - No test accounts!
export const INITIAL_USERS: User[] = [
  {
    id: 'user-elijah',
    name: 'Elijah Kincade',
    email: 'ekinc002@ucr.edu',
    password: 'password123',
    userType: 'student',
    campus: 'UCR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&auto=format&fit=crop&q=80',
    bio: 'Super Admin & Platform Director | President of Phi Beta Sigma Fraternity, Inc. (Gamma Rho Nu Chapter). Dedicated to Black collegiate leadership and campus empowerment.',
    major: 'Computer Science',
    gradYear: '2026',
    phone: '(951) 555-1234',
    instagram: '@ucrsigmas',
    joinedOrgIds: ['org-pbs', 'org-bsu', 'org-blaack', 'org-csu', 'org-easa', 'org-nsa', 'org-sasi'],
    role: 'super_admin',
    friends: [],
    friendRequestsIncoming: [],
    friendRequestsOutgoing: [],
    createdAt: '2025-08-01T00:00:00.000Z'
  }
];

export const INITIAL_GROUP_CHATS: GroupChat[] = [
  {
    id: 'group-global',
    name: '🌐 Campus Black Student Network (Global)',
    isGlobal: true,
    description: 'The official campus-wide discussion channel for all Black scholars, Divine Nine members, and allies.',
    avatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
    createdBy: 'user-elijah',
    memberIds: ['user-elijah'],
    createdAt: '2025-08-01T00:00:00.000Z'
  },
  {
    id: 'group-org-pbs',
    name: 'Phi Beta Sigma (Gamma Rho Nu Chapter) Chat',
    isOrgChat: true,
    orgId: 'org-pbs',
    description: 'Official chapter discussion channel.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    createdBy: 'user-elijah',
    memberIds: ['user-elijah'],
    createdAt: '2025-08-01T00:00:00.000Z'
  }
];

export const INITIAL_CLAIM_REQUESTS: ClaimRequest[] = [];

export const INITIAL_ORGS: Organization[] = [
  // ==========================================
  // FRATERNITIES & SORORITIES (NPHC) - 8 ORGS
  // ==========================================

  // 1. Alpha Kappa Alpha
  {
    id: 'org-aka',
    name: 'Alpha Kappa Alpha Sorority, Inc. (ΑΚΑ - Kappa Theta Chapter)',
    shortName: 'Alpha Kappa Alpha',
    tagline: 'By Culture and By Merit',
    category: 'Fraternities & Sororities (NPHC)',
    isClaimed: false,
    logo: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#F7C6D0',
    secondaryColor: '#008053',
    description: 'Founded Jan. 15, 1908 at Howard University by 16 collegiate women. Built on five basic tenets unchanged since its inception: cultivate high scholastic and ethical standards, promote unity and friendship among college women, study and alleviate problems concerning girls and women, maintain a progressive interest in college life, and be of "service to all mankind."',
    contactEmail: 'aka.kappatheta@campus.edu',
    instagramHandle: '@aka_kappatheta',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: 'January 15, 1908',
      foundingLocation: 'Howard University, Minor Hall, Washington, D.C.',
      motto: 'By Culture and By Merit',
      principles: ['Scholastic and Ethical Standards', 'Unity and Friendship', 'Service to All Mankind'],
      colors: ['Salmon Pink', 'Apple Green'],
      foundingStory: 'Alpha Kappa Alpha Sorority, Inc. is the first intercollegiate historically African American Greek-lettered sorority, founded on January 15, 1908 at Howard University.',
      campusChapterStory: 'Kappa Theta Chapter. Unclaimed on our campus directory. Join to claim leadership.',
      historicalSignificance: 'Empowering collegiate women for over a century with high scholastic and ethical standards.',
      founders: [{ name: 'Ethel Hedgeman Lyle', title: 'Guiding Light', bio: 'Visionary and primary founder of Alpha Kappa Alpha.' }],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 2. Kappa Alpha Psi (1911)
  {
    id: 'org-kapsi',
    name: 'Kappa Alpha Psi Fraternity, Inc. (ΚΑΨ - Eta Zeta Chapter)',
    shortName: 'Kappa Alpha Psi',
    tagline: 'Achievement in Every Field of Human Endeavor',
    category: 'Fraternities & Sororities (NPHC)',
    isClaimed: false,
    logo: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#9B111E',
    secondaryColor: '#F5F5DC',
    description: 'Founded January 5, 1911 at Indiana University by 10 African-American college men. Five objectives: unite college men of culture, patriotism and honor in a bond of fraternity; encourage honorable achievement in every field; promote members\' spiritual, social, intellectual and moral welfare; assist the aims of colleges and universities; and inspire service in the public interest.',
    contactEmail: 'kapsi.etazeta@campus.edu',
    instagramHandle: '@kapsi_etazeta',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: 'January 5, 1911',
      foundingLocation: 'Indiana University, Bloomington, Indiana',
      motto: 'Achievement in Every Field of Human Endeavor',
      principles: ['Achievement', 'Brotherhood', 'Leadership', 'Honor'],
      colors: ['Crimson', 'Cream'],
      foundingStory: 'Founded on January 5, 1911 by Elder Watson Diggs and nine other revered founders on the campus of Indiana University.',
      campusChapterStory: 'Eta Zeta Chapter. Unclaimed on our campus directory. Join to claim leadership.',
      historicalSignificance: 'Dedicated to training young men for leadership and public service.',
      founders: [{ name: 'Elder Watson Diggs', title: 'Revered Founder', bio: 'Educator and Grand Polemarch Emeritus.' }],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 3. Omega Psi Phi (1911)
  {
    id: 'org-opp',
    name: 'Omega Psi Phi Fraternity, Inc. (ΩΨΦ - Sigma Eta Chapter)',
    shortName: 'Omega Psi Phi',
    tagline: 'Friendship is Essential to the Soul',
    category: 'Fraternities & Sororities (NPHC)',
    isClaimed: false,
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#4B0082',
    secondaryColor: '#DAA520',
    description: 'Founded November 17, 1911 at Howard University by three undergraduates and one faculty advisor — the first African-American fraternity founded at an HBCU. Its purpose: attract and build a strong, effective force of men dedicated to its cardinal principles of manhood, scholarship, perseverance and uplift.',
    contactEmail: 'ques.sigmaeta@campus.edu',
    instagramHandle: '@ques_sigmaeta',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: 'November 17, 1911',
      foundingLocation: 'Howard University, Thirkield Hall, Washington, D.C.',
      motto: 'Friendship is Essential to the Soul',
      principles: ['Manhood', 'Scholarship', 'Perseverance', 'Uplift'],
      colors: ['Royal Purple', 'Old Gold'],
      foundingStory: 'Omega Psi Phi Fraternity, Inc. was founded on November 17, 1911 by three undergraduates: Edgar Amos Love, Oscar James Cooper, and Frank Coleman, with faculty advisor Dr. Ernest Everett Just.',
      campusChapterStory: 'Sigma Eta Chapter. Unclaimed on our campus directory. Join to claim leadership.',
      historicalSignificance: 'The first African-American fraternity founded at an HBCU.',
      founders: [{ name: 'Dr. Ernest Everett Just', title: 'Faculty Advisor', bio: 'World-renowned biologist and professor.' }],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 4. Delta Sigma Theta (1913)
  {
    id: 'org-dst',
    name: 'Delta Sigma Theta Sorority, Inc. (ΔΣΘ - Mu Chi Chapter)',
    shortName: 'Delta Sigma Theta',
    tagline: 'Intelligence is the Torch of Wisdom',
    category: 'Fraternities & Sororities (NPHC)',
    isClaimed: false,
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#9B111E',
    secondaryColor: '#FFFFFF',
    description: 'Founded January 13, 1913 by 22 collegiate women at Howard University. An organization of college-educated women committed to constructive member development and public service focused on the Black community, guided by its Five Point Programmatic Thrust: economic development, educational development, physical and mental health, political awareness/involvement, and international awareness/involvement.',
    contactEmail: 'dst.muchi@campus.edu',
    instagramHandle: '@dst_muchi',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: 'January 13, 1913',
      foundingLocation: 'Howard University, Washington, D.C.',
      motto: 'Intelligence is the Torch of Wisdom',
      principles: ['Sisterhood', 'Scholarship', 'Service', 'Social Action'],
      colors: ['Crimson', 'Cream'],
      foundingStory: 'Founded on January 13, 1913 by 22 visionary collegiate women at Howard University. Their first public act was participating in the historic Women\'s Suffrage March in Washington, D.C. in March 1913.',
      campusChapterStory: 'Mu Chi Chapter. Unclaimed on our campus directory. Join to claim leadership.',
      historicalSignificance: 'Guided by its Five Point Programmatic Thrust across education, healthcare, and economic development.',
      founders: [{ name: 'Osceola Macarthy Adams', title: 'Founder', bio: 'Directress of Harlem School of the Arts.' }],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 5. Phi Beta Sigma (FULL PROFILE - Claimed by Elijah Kincade)
  {
    id: 'org-pbs',
    name: 'Phi Beta Sigma Fraternity, Inc. (ΦΒΣ - Gamma Rho Nu Chapter)',
    shortName: 'Phi Beta Sigma',
    tagline: 'Culture For Service and Service For Humanity',
    category: 'Fraternities & Sororities (NPHC)',
    isClaimed: true,
    claimedByUserId: 'user-elijah',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#002B7F',
    secondaryColor: '#FFFFFF',
    description: 'Founded at Howard University Jan. 9, 1914 by three students — A. Langston Taylor, Leonard F. Morse, and Charles I. Brown — to exemplify brotherhood, scholarship and service. Now an international organization; instrumental in the Phi Beta Sigma National Foundation, Federal Credit Union, and Sigma Beta Club Foundation. Zeta Phi Beta (1920) is its sister organization.',
    contactEmail: 'contact@pbs.org',
    contactPhone: '(951) 555-1234',
    instagramHandle: '@ucrsigmas',
    website: 'https://phibetasigma1914.org',
    members: [
      {
        userId: 'user-elijah',
        userName: 'Elijah Kincade',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        userMajor: 'Computer Science',
        userGradYear: '2026',
        position: 'President',
        isPrimaryAdmin: true,
        isOfficer: true,
        joinedAt: '2025-08-01T00:00:00.000Z'
      }
    ],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [
      {
        id: 'note-pbs-1',
        orgId: 'org-pbs',
        title: 'Fall 2026 Executive Strategy & Chapter Goals',
        content: '1. Coordinate with Inland Empire Food Bank for MLK Day of Service.\n2. Organize regional leadership retreat.\n3. Establish study table hours in the Science Library for all brothers.\n4. Plan joint programming with Zeta Phi Beta (Epsilon Sigma chapter).',
        createdBy: 'user-elijah',
        createdByName: 'Elijah Kincade',
        createdAt: '2026-08-20T10:00:00.000Z',
        updatedAt: '2026-08-20T10:00:00.000Z',
        accessGrantedUserIds: ['user-elijah']
      }
    ],
    plannerAccessRequests: [],
    announcements: [
      {
        id: 'anc-pbs-1',
        orgId: 'org-pbs',
        orgName: 'Phi Beta Sigma',
        authorId: 'user-elijah',
        authorName: 'Elijah Kincade',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        authorPosition: 'President',
        title: '🌟 Welcome to Phi Beta Sigma - Gamma Rho Nu Chapter!',
        content: 'Welcome to the official chapter hub of Phi Beta Sigma Fraternity, Inc. (Gamma Rho Nu Chapter)! We are committed to brotherhood, academic scholarship, and genuine community service on campus and throughout the Inland Empire.',
        pinned: true,
        isGlobal: true,
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop&q=80',
        createdAt: '2026-08-20T10:00:00.000Z',
        likes: ['user-elijah'],
        comments: []
      }
    ],
    events: [
      {
        id: 'evt-pbs-1',
        orgId: 'org-pbs',
        orgName: 'Phi Beta Sigma',
        title: 'Sigma Step & Stroll Exhibition',
        description: 'Come witness the brothers of Phi Beta Sigma showcase step precision, high energy strolls, and chapter history on the main campus plaza.',
        date: '2026-09-15',
        time: '5:00 PM - 7:00 PM',
        location: 'Campus Central Bell Tower Plaza',
        locationAddress: 'Campus Central Plaza, 900 University Ave',
        category: 'Greek Stroll/Step',
        flyerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        rsvpsGoing: ['user-elijah'],
        rsvpsInterested: [],
        createdAt: '2026-08-21T09:00:00.000Z'
      },
      {
        id: 'evt-collab-1',
        orgId: 'org-pbs',
        orgName: 'Phi Beta Sigma',
        title: 'Joint Black Greek Yard Show & Welcome Cookout',
        description: 'Annual campus-wide yard show and cookout featuring chapter performances, strolls, music, free BBQ, and community networking across all NPHC organizations.',
        date: '2026-09-26',
        time: '3:00 PM - 8:00 PM',
        location: 'Student Union Upper Lawn',
        locationAddress: 'Student Union Lawn, 900 University Ave',
        category: 'Social',
        flyerUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80',
        isCollaboration: true,
        collaboratingOrgIds: ['org-aka', 'org-dst', 'org-kapsi', 'org-opp'],
        collaboratingOrgNames: ['Alpha Kappa Alpha', 'Delta Sigma Theta', 'Kappa Alpha Psi', 'Omega Psi Phi'],
        rsvpsGoing: ['user-elijah'],
        rsvpsInterested: [],
        createdAt: '2026-08-22T10:00:00.000Z'
      }
    ],
    feed: [
      {
        id: 'feed-pbs-1',
        orgId: 'org-pbs',
        orgName: 'Phi Beta Sigma',
        authorId: 'user-elijah',
        authorName: 'Elijah Kincade',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        type: 'general',
        title: 'Chapter Welcome',
        content: 'Welcome back to campus everybody! The Gamma Rho Nu chapter of Phi Beta Sigma is fired up for an incredible academic year of leadership and service. Stop by our table at the Org Fair to connect!',
        createdAt: '2026-08-22T09:00:00.000Z',
        likes: ['user-elijah'],
        comments: []
      },
      {
        id: 'feed-pbs-2',
        orgId: 'org-pbs',
        orgName: 'Phi Beta Sigma',
        authorId: 'user-elijah',
        authorName: 'Elijah Kincade',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        type: 'community_service',
        title: 'MLK Day Food Drive Service',
        content: 'Food Drive - MLK Day of Service: The brothers successfully distributed over 350 boxes of fresh produce and non-perishables to local families in need! Culture for Service and Service for Humanity in action.',
        serviceHours: 40,
        serviceDate: '2026-08-22',
        location: 'Inland Food Bank & Community Center',
        imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&auto=format&fit=crop&q=80',
        createdAt: '2026-08-22T16:00:00.000Z',
        likes: ['user-elijah'],
        comments: [
          {
            id: 'fc-pbs-1',
            authorId: 'user-elijah',
            authorName: 'Elijah Kincade',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
            content: 'GOMAB! Proud of the brothers who came out to serve our community.',
            createdAt: '2026-08-22T17:15:00.000Z'
          }
        ]
      }
    ],
    photos: [
      {
        id: 'photo-pbs-1',
        orgId: 'org-pbs',
        title: 'Gamma Rho Nu Chapter Yard Presentation',
        caption: 'The brothers of Phi Beta Sigma celebrating brotherhood at the annual campus yard show.',
        url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1000&auto=format&fit=crop&q=80',
        uploadedBy: 'Elijah Kincade',
        uploadedById: 'user-elijah',
        uploadedAt: '2026-08-15T12:00:00.000Z'
      }
    ],
    videos: [
      {
        id: 'vid-pbs-1',
        orgId: 'org-pbs',
        title: 'Phi Beta Sigma Stroll & Step Showcase',
        description: 'Highlights from the Homecoming yard performance and brotherhood showcase.',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        provider: 'youtube',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        uploadedBy: 'Elijah Kincade',
        uploadedById: 'user-elijah',
        uploadedAt: '2026-08-18T14:00:00.000Z'
      }
    ],
    history: {
      foundingDate: 'January 9, 1914',
      foundingLocation: 'Howard University, Washington, D.C.',
      charterDateOnCampus: 'Gamma Rho Nu Chapter',
      motto: 'Culture For Service and Service For Humanity',
      principles: ['Brotherhood', 'Scholarship', 'Service'],
      colors: ['Royal Blue', 'Pure White'],
      flower: 'White Carnation',
      symbol: 'Dove',
      foundingStory: 'Our Founding Story: Founded at Howard University on January 9, 1914 by three visionary students — A. Langston Taylor, Leonard F. Morse, and Charles I. Brown — who wanted to organize a Greek-letter fraternity that would exemplify the ideals of brotherhood, scholarship, and service.',
      campusChapterStory: 'Gamma Rho Nu Chapter stands as a beacon of leadership, academic distinction, and active community uplift on our campus.',
      historicalSignificance: 'Instrumental in establishing the Phi Beta Sigma National Foundation, Federal Credit Union, and Sigma Beta Club Foundation. Zeta Phi Beta (1920) is its constitutional sister organization.',
      historyPosts: [
        {
          id: 'hp-pbs-1',
          title: 'Our Founding Story: 1914 to Present',
          content: 'Phi Beta Sigma Fraternity was founded at Howard University in Washington, D.C., by three African American students: A. Langston Taylor, Leonard F. Morse, and Charles I. Brown. The founders conceived Phi Beta Sigma as a mechanism to deliver services to the general community rather than gaining benefits exclusively for its members.\n\nFrom its inception, the founders also envisioned creating a sister sorority, resulting in the establishment of Zeta Phi Beta Sorority on January 16, 1920.',
          imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
          imageCaption: 'The historic grounds of Howard University where Phi Beta Sigma was born in 1914.',
          createdAt: '2026-08-19T10:00:00.000Z'
        }
      ],
      founders: [
        { name: 'A. Langston Taylor', title: 'Revered Founder', bio: 'Visionary and national president of Phi Beta Sigma.' },
        { name: 'Leonard F. Morse', title: 'Revered Founder', bio: 'Educator, scholar, and church leader.' },
        { name: 'Charles I. Brown', title: 'Revered Founder', bio: 'Co-founder and community educator.' }
      ],
      historicPhotos: [
        {
          url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
          caption: 'Historical archives of Phi Beta Sigma founding.'
        }
      ]
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 6. Zeta Phi Beta (1920)
  {
    id: 'org-zpb',
    name: 'Zeta Phi Beta Sorority, Inc. (ΖΦΒ - Epsilon Sigma Chapter)',
    shortName: 'Zeta Phi Beta',
    tagline: 'A Community-Conscious, Action-Oriented Organization',
    category: 'Fraternities & Sororities (NPHC)',
    isClaimed: false,
    logo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#002B7F',
    secondaryColor: '#FFFFFF',
    description: 'Founded January 16, 1920 at Howard University. Programs include its National Educational Foundation and community outreach; chapters give volunteer hours to educate the public, assist youth, provide scholarships, support charities, and promote legislation for social and civic change.',
    contactEmail: 'zetas.epsilonsigma@campus.edu',
    instagramHandle: '@zetas_epsilonsigma',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: 'January 16, 1920',
      foundingLocation: 'Howard University, Washington, D.C.',
      motto: 'A Community-Conscious, Action-Oriented Organization',
      principles: ['Scholarship', 'Service', 'Sisterhood', 'Finer Womanhood'],
      colors: ['Royal Blue', 'Pure White'],
      foundingStory: 'Founded on January 16, 1920 by five collegiate women known as the Five Pearls at Howard University.',
      campusChapterStory: 'Epsilon Sigma Chapter. Unclaimed on our campus directory. Join to claim leadership.',
      historicalSignificance: 'Constitutional sister organization to Phi Beta Sigma Fraternity, Inc.',
      founders: [{ name: 'Arizona Cleaver Stemons', title: 'Pearl', bio: 'First Grand Basileus.' }],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 7. Sigma Gamma Rho (1922)
  {
    id: 'org-sgrho',
    name: 'Sigma Gamma Rho Sorority, Inc. (ΣΓΡ - Xi Rho Chapter)',
    shortName: 'Sigma Gamma Rho',
    tagline: 'Greater Service, Greater Progress',
    category: 'Fraternities & Sororities (NPHC)',
    isClaimed: false,
    logo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#002B7F',
    secondaryColor: '#FFD700',
    description: 'Founded Nov. 12, 1922 at Butler University by seven young educators. A non-profit aiming to enhance community quality of life; hallmarks are public service, leadership development, and youth education. The only NPHC sorority founded at a predominantly white institution (PWI).',
    contactEmail: 'sgrho.xirho@campus.edu',
    instagramHandle: '@sgrho_xirho',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: 'November 12, 1922',
      foundingLocation: 'Butler University, Indianapolis, Indiana',
      motto: 'Greater Service, Greater Progress',
      principles: ['Sisterhood', 'Scholarship', 'Service'],
      colors: ['Royal Blue', 'Gold'],
      foundingStory: 'Founded on November 12, 1922 at Butler University in Indianapolis, Indiana by seven young educators.',
      campusChapterStory: 'Xi Rho Chapter. Unclaimed on our campus directory. Join to claim leadership.',
      historicalSignificance: 'The only NPHC sorority founded at a predominantly white institution (PWI).',
      founders: [{ name: 'Mary Lou Allison Gardner Little', title: 'Founder', bio: 'Educator and author.' }],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 8. National Pan-Hellenic Council
  {
    id: 'org-nphc',
    name: 'National Pan-Hellenic Council (NPHC)',
    shortName: 'NPHC Council',
    tagline: 'Unity, Leadership, and Excellence Among the Divine Nine',
    category: 'Fraternities & Sororities (NPHC)',
    isClaimed: false,
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#800020',
    secondaryColor: '#D4AF37',
    description: 'Dedicated to advancing the well-being of its affiliated fraternities and sororities through leadership and professional development opportunities for its members.',
    contactEmail: 'nphc.council@campus.edu',
    instagramHandle: '@campus_nphc',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: 'May 10, 1930',
      foundingLocation: 'Howard University, Washington, D.C.',
      motto: 'Unanimity of thought and action',
      principles: ['Unity', 'Leadership', 'Scholarship', 'Community Uplift'],
      colors: ['Black', 'Gold'],
      foundingStory: 'Established on May 10, 1930 at Howard University as the coordinating body for historically African American Greek-lettered fraternities and sororities.',
      campusChapterStory: 'Unclaimed on our campus directory. Join to claim council leadership.',
      historicalSignificance: 'Coordinating council representing the historic Divine Nine Greek letter organizations.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // ==========================================
  // ACADEMIC / PROFESSIONAL - 6 ORGS
  // ==========================================

  // 9. AAUS
  {
    id: 'org-aaus',
    name: 'African Americans United in Science (AAUS)',
    shortName: 'AAUS',
    tagline: 'Empowering Black Scholars Across STEM & Scientific Research',
    category: 'Academic / Professional',
    isClaimed: true,
    claimedByUserId: undefined,
    logo: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#005A9C',
    secondaryColor: '#00A86B',
    description: 'Aims to increase educational and professional opportunities for African American science students and to disseminate valuable information to these students.',
    contactEmail: 'aaus@campus.edu',
    instagramHandle: '@campus_aaus',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '1998',
      foundingLocation: 'College of Natural & Agricultural Sciences',
      motto: 'Excellence in Scientific Inquiry',
      principles: ['Academic Rigor', 'Research Mentorship', 'Healthcare Equity'],
      colors: ['Science Blue', 'Emerald Green'],
      foundingStory: 'Formed to provide pre-med, biology, chemistry, and research students with MCAT prep, lab placements, and peer tutoring.',
      campusChapterStory: 'Active chapter supporting undergraduate science majors.',
      historicalSignificance: 'Produced dozens of physicians, researchers, and biotech leaders.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 10. BGSA
  {
    id: 'org-bgsa',
    name: 'Black Graduate Student Association (BGSA)',
    shortName: 'BGSA',
    tagline: 'Fostering a Legacy of Excellence in Graduate Education',
    category: 'Academic / Professional',
    isClaimed: true,
    claimedByUserId: undefined,
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#4A154B',
    secondaryColor: '#D4AF37',
    description: 'Fosters a vibrant, inclusive space promoting the academic, professional, social, and cultural well-being of Black graduate students — honoring intersectional identities, addressing systemic inequities, empowering members to lead, and mentoring future generations for a legacy of excellence in graduate education.',
    contactEmail: 'bgsa@campus.edu',
    instagramHandle: '@campus_bgsa',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '2004',
      foundingLocation: 'Graduate Division',
      motto: 'Excellence in Advanced Scholarship',
      principles: ['Intersectional Advocacy', 'Graduate Mentorship', 'Academic Leadership'],
      colors: ['Deep Purple', 'Gold'],
      foundingStory: 'Established to address the unique needs and retention of Master\'s and Ph.D. Black scholars.',
      campusChapterStory: 'Hosts annual graduate symposiums and undergraduate mentorship pipelines.',
      historicalSignificance: 'Championing graduate research equity.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 11. B'Psych
  {
    id: 'org-bpsych',
    name: "Black Psych Society (B'Psych)",
    shortName: "B'Psych",
    tagline: 'Uniting and Welcoming Black Scholars to Psychology',
    category: 'Academic / Professional',
    isClaimed: true,
    claimedByUserId: undefined,
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#2B6CB0',
    secondaryColor: '#ECC94B',
    description: "Connects students with similar backgrounds and creates accessible opportunities to advance careers through mentorship, networking, and more — uniting and welcoming Black scholars to the broad field of psychology.",
    contactEmail: 'bpsych@campus.edu',
    instagramHandle: '@campus_bpsych',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '2016',
      foundingLocation: 'Department of Psychology',
      motto: 'Mental Wellness & Scholarly Insight',
      principles: ['Mental Health Advocacy', 'Clinical Mentorship', 'Behavioral Research'],
      colors: ['Psychology Blue', 'Warm Gold'],
      foundingStory: 'Created to bridge the gap for Black students pursuing clinical psychology, neuroscience, and mental health careers.',
      campusChapterStory: 'Hosts annual mental wellness workshops across campus.',
      historicalSignificance: 'Expanding mental health awareness and Black clinical representation.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 12. BSIB
  {
    id: 'org-bsib',
    name: 'Black Scholars in Business (BSIB)',
    shortName: 'BSIB',
    tagline: 'Driving Transformative Action in Business & Global Commerce',
    category: 'Academic / Professional',
    isClaimed: true,
    claimedByUserId: undefined,
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#1A365D',
    secondaryColor: '#D69E2E',
    description: 'Provides a community that drives academic, professional, and personal success through transformative actions in business, socioeconomic, and global education.',
    contactEmail: 'bsib@campus.edu',
    instagramHandle: '@campus_bsib',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '2012',
      foundingLocation: 'School of Business',
      motto: 'Leadership, Venture, Transformation',
      principles: ['Financial Literacy', 'Corporate Prep', 'Entrepreneurship'],
      colors: ['Navy Blue', 'Gold'],
      foundingStory: 'Formed by ambitious students to prepare Black undergraduate leaders for finance, tech consulting, and corporate management.',
      campusChapterStory: 'Hosts annual networking treks to Fortune 500 headquarters.',
      historicalSignificance: 'Paving pathways into investment banking and tech startups.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 13. NBLSA
  {
    id: 'org-nblsa',
    name: 'National Black Law Student Association (NBLSA)',
    shortName: 'NBLSA',
    tagline: 'Advocacy, Justice, and Legal Excellence',
    category: 'Academic / Professional',
    isClaimed: true,
    claimedByUserId: undefined,
    logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#002855',
    secondaryColor: '#B38F4D',
    description: 'Unites students who share an interest in the legal field, provides a better understanding of legal careers, and offers mentorship with current law practitioners.',
    contactEmail: 'nblsa@campus.edu',
    instagramHandle: '@campus_nblsa',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '1968',
      foundingLocation: 'New York University School of Law',
      motto: 'Power to the Law, Justice for All',
      principles: ['Legal Ethics', 'Civil Rights Advocacy', 'Judicial Equality'],
      colors: ['Justice Navy', 'Gold'],
      foundingStory: 'Founded nationally in 1968 to articulate and promote the needs and goals of Black law students.',
      campusChapterStory: 'Provides LSAT prep workshops and law school admissions mentoring.',
      historicalSignificance: 'The largest student-run legal organization in the United States.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 14. NSBE
  {
    id: 'org-nsbe',
    name: 'National Society of Black Engineers (NSBE)',
    shortName: 'NSBE',
    tagline: 'To Increase the Number of Culturally Responsible Black Engineers',
    category: 'Academic / Professional',
    isClaimed: true,
    claimedByUserId: undefined,
    logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#005A9C',
    secondaryColor: '#FFD700',
    description: 'Mission: increase the number of culturally responsible Black engineers who excel academically, succeed professionally, and positively impact the community.',
    contactEmail: 'nsbe@campus.edu',
    instagramHandle: '@campus_nsbe',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '1975',
      foundingLocation: 'Purdue University, West Lafayette, Indiana',
      motto: 'Excel Academically, Succeed Professionally, Positively Impact the Community',
      principles: ['Academic Excellence', 'Professional Success', 'Community Impact'],
      colors: ['NSBE Blue', 'Gold', 'Black'],
      foundingStory: 'Founded in 1975 by six undergraduate students (the "Chicago Six") at Purdue University.',
      campusChapterStory: 'Chartered in 1986, producing top software, mechanical, and biomedical engineers.',
      historicalSignificance: 'One of the largest student-governed engineering societies globally.',
      founders: [{ name: 'Edward A. Coleman', title: 'Chicago Six', bio: 'Co-founder of NSBE.' }],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // ==========================================
  // CULTURAL - 7 ORGS (Admin: Elijah Kincade where specified)
  // ==========================================

  // 15. BSU (Admin: Elijah Kincade)
  {
    id: 'org-bsu',
    name: 'Black Student Union (BSU)',
    shortName: 'BSU',
    tagline: 'Uniting, Empowering, and Advocating for Black Students',
    category: 'Cultural',
    isClaimed: true,
    claimedByUserId: 'user-elijah',
    logo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#800020',
    secondaryColor: '#D4AF37',
    description: 'Provides a space for all students to gain knowledge about African/African American/Black populations to help break down cultural barriers and stereotypes that have plagued the community for centuries.',
    contactEmail: 'bsu@campus.edu',
    instagramHandle: '@campus_bsu',
    members: [
      {
        userId: 'user-elijah',
        userName: 'Elijah Kincade',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        userMajor: 'Computer Science',
        userGradYear: '2026',
        position: 'President',
        isPrimaryAdmin: true,
        isOfficer: true,
        joinedAt: '2025-08-01T00:00:00.000Z'
      }
    ],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '1968',
      foundingLocation: 'Campus Quad',
      motto: 'Strength in Unity, Power in Community',
      principles: ['Advocacy', 'Community', 'Cultural Pride', 'Leadership'],
      colors: ['Burgundy', 'Gold', 'Black'],
      foundingStory: 'Founded during the civil rights movements to ensure Black students had a collective voice and institutional support.',
      campusChapterStory: 'Pioneered the establishment of the African American Studies department and the Multicultural Center.',
      historicalSignificance: 'The premier political and cultural voice for Black students.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 16. BLAACK (Admin: Elijah Kincade)
  {
    id: 'org-blaack',
    name: 'Brothers Leading African-Americans through Consciousness and Knowledge (BLAACK)',
    shortName: 'BLAACK',
    tagline: 'Developing Leaders, Fostering Brotherhood and Unity',
    category: 'Cultural',
    isClaimed: true,
    claimedByUserId: 'user-elijah',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    description: 'Established to develop leaders and foster brotherhood and unity.',
    contactEmail: 'blaack@campus.edu',
    instagramHandle: '@campus_blaack',
    members: [
      {
        userId: 'user-elijah',
        userName: 'Elijah Kincade',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        userMajor: 'Computer Science',
        userGradYear: '2026',
        position: 'President',
        isPrimaryAdmin: true,
        isOfficer: true,
        joinedAt: '2025-08-01T00:00:00.000Z'
      }
    ],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '2010',
      foundingLocation: 'Campus African Student Programs',
      motto: 'Knowledge, Consciousness, Brotherhood',
      principles: ['Leadership Development', 'Male Retention', 'Civic Empowerment'],
      colors: ['Black', 'Gold'],
      foundingStory: 'Created to cultivate Black male leadership, academic excellence, and positive mentorship on campus.',
      campusChapterStory: 'Hosts the annual Black Male Leadership Summit.',
      historicalSignificance: 'Increasing retention and graduation rates of collegiate men of color.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 17. CSU (Admin: Elijah Kincade)
  {
    id: 'org-csu',
    name: 'Caribbean Student Union (CSU)',
    shortName: 'CSU',
    tagline: 'Celebrating Island Heritage, Fostering Unity and Inclusion',
    category: 'Cultural',
    isClaimed: true,
    claimedByUserId: 'user-elijah',
    logo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#008080',
    secondaryColor: '#FFD700',
    description: 'Celebrates and shares Caribbean culture by fostering unity, inclusion, and education — supporting students of Caribbean descent and allies and promoting cultural awareness.',
    contactEmail: 'csu@campus.edu',
    instagramHandle: '@campus_csu',
    members: [
      {
        userId: 'user-elijah',
        userName: 'Elijah Kincade',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        userMajor: 'Computer Science',
        userGradYear: '2026',
        position: 'President',
        isPrimaryAdmin: true,
        isOfficer: true,
        joinedAt: '2025-08-01T00:00:00.000Z'
      }
    ],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '2014',
      foundingLocation: 'Multicultural Center',
      motto: 'One People, One Caribbean',
      principles: ['Cultural Celebration', 'Inclusion', 'Diaspora Education'],
      colors: ['Teal', 'Sun Gold', 'Coral'],
      foundingStory: 'Formed by Caribbean students representing Jamaica, Trinidad & Tobago, Haiti, Barbados, Bahamas, and Belize.',
      campusChapterStory: 'Hosts the annual campus Carnival and Caribbean Taste of the Islands.',
      historicalSignificance: 'Uniting diaspora students and educating campus on Caribbean heritage.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 18. EASA (Admin: Elijah Kincade)
  {
    id: 'org-easa',
    name: 'East African Student Association (EASA)',
    shortName: 'EASA',
    tagline: 'Unity as our Passion, Connecting All East Africans',
    category: 'Cultural',
    isClaimed: true,
    claimedByUserId: 'user-elijah',
    logo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#006400',
    secondaryColor: '#D4AF37',
    description: 'Established to provide, teach, and share the culture of East African countries with students and faculty; with unity as its passion, it strives to bring all East Africans together.',
    contactEmail: 'easa@campus.edu',
    instagramHandle: '@campus_easa',
    members: [
      {
        userId: 'user-elijah',
        userName: 'Elijah Kincade',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        userMajor: 'Computer Science',
        userGradYear: '2026',
        position: 'President',
        isPrimaryAdmin: true,
        isOfficer: true,
        joinedAt: '2025-08-01T00:00:00.000Z'
      }
    ],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '2015',
      foundingLocation: 'Campus International Center',
      motto: 'Pamoja Twaweza (Together We Can)',
      principles: ['Cultural Heritage', 'Unity', 'Educational Exchange'],
      colors: ['Forest Green', 'Gold', 'Red'],
      foundingStory: 'Formed to celebrate cultures across Ethiopia, Eritrea, Kenya, Somalia, Tanzania, Uganda, and Rwanda.',
      campusChapterStory: 'Hosts the annual East African Cultural Night featuring traditional coffee ceremonies and cuisine.',
      historicalSignificance: 'Fostering pan-African solidarity and international connection.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 19. NSA (Admin: Elijah Kincade)
  {
    id: 'org-nsa',
    name: 'Nigerian Student Association (NSA)',
    shortName: 'NSA',
    tagline: 'Spreading Culture, Fostering Unity and Network',
    category: 'Cultural',
    isClaimed: true,
    claimedByUserId: 'user-elijah',
    logo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#008751',
    secondaryColor: '#FFFFFF',
    description: 'Spreads and shares Nigerian culture, provides a network for students, and increases awareness of Nigerian students\' presence.',
    contactEmail: 'nsa@campus.edu',
    instagramHandle: '@campus_nsa',
    members: [
      {
        userId: 'user-elijah',
        userName: 'Elijah Kincade',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        userMajor: 'Computer Science',
        userGradYear: '2026',
        position: 'President',
        isPrimaryAdmin: true,
        isOfficer: true,
        joinedAt: '2025-08-01T00:00:00.000Z'
      }
    ],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '2011',
      foundingLocation: 'Student Union',
      motto: 'Peace, Unity, and Strength',
      principles: ['Cultural Heritage', 'Academic Excellence', 'Community Solidarity'],
      colors: ['Nigerian Green', 'Pure White'],
      foundingStory: 'Created to showcase the rich traditions, languages, music, and cuisine of Nigeria while mentoring first-generation scholars.',
      campusChapterStory: 'Hosts the annual Nigerian Independence Day Gala and cultural dance performances.',
      historicalSignificance: 'A cornerstone organization of African student leadership.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 20. S.A.S.I. (Admin: Elijah Kincade)
  {
    id: 'org-sasi',
    name: 'Sisters Affirming our Social-Cultural Identities (S.A.S.I.)',
    shortName: 'S.A.S.I.',
    tagline: 'Safe Spaces, Protection, and Sisterhood for Black Women',
    category: 'Cultural',
    isClaimed: true,
    claimedByUserId: 'user-elijah',
    logo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#9B111E',
    secondaryColor: '#F7C6D0',
    description: 'Provides a safe space for Black women through programming, outreach, meetings, events, and any other means to ensure the protection of Black women on campus.',
    contactEmail: 'sasi@campus.edu',
    instagramHandle: '@campus_sasi',
    members: [
      {
        userId: 'user-elijah',
        userName: 'Elijah Kincade',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        userMajor: 'Computer Science',
        userGradYear: '2026',
        position: 'President',
        isPrimaryAdmin: true,
        isOfficer: true,
        joinedAt: '2025-08-01T00:00:00.000Z'
      }
    ],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '2008',
      foundingLocation: 'Women\'s Resource Center',
      motto: 'Affirmed, Protected, Empowered',
      principles: ['Sisterhood', 'Safe Spaces', 'Social-Cultural Affirmation'],
      colors: ['Ruby Red', 'Soft Pink', 'Gold'],
      foundingStory: 'Founded to ensure Black collegiate women had a sanctuary for mental wellness, empowerment, and unapologetic sisterhood.',
      campusChapterStory: 'Hosts annual empowerment retreats and mentorship programs for incoming freshman women.',
      historicalSignificance: 'Leading advocacy for the safety, protection, and advancement of Black women on campus.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 21. blaqOUT
  {
    id: 'org-blaqout',
    name: 'blaqOUT',
    shortName: 'blaqOUT',
    tagline: 'Community, Retention & Involvement for Black Queer Students',
    category: 'Cultural',
    isClaimed: false,
    logo: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#6B46C1',
    secondaryColor: '#D53F8C',
    description: 'A social club providing community and opportunities while fostering retention and involvement for Black Queer (LGBTQIA+) students.',
    contactEmail: 'blaqout@campus.edu',
    instagramHandle: '@campus_blaqout',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '2017',
      foundingLocation: 'LGBT Resource Center',
      motto: 'Intersectional, Unapologetic, United',
      principles: ['Queer Affirmation', 'Community Retention', 'Intersectionality'],
      colors: ['Purple', 'Magenta', 'Black'],
      foundingStory: 'Created to ensure Black LGBTQIA+ students have a vibrant, safe, and supportive social network on campus.',
      campusChapterStory: 'Unclaimed on our campus directory. Join to claim leadership.',
      historicalSignificance: 'Providing vital retention, mental health, and social support for Black queer scholars.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // ==========================================
  // ARTS AND EXPRESSION - 2 ORGS
  // ==========================================

  // 22. Neo-Noir Creatives
  {
    id: 'org-neonoir',
    name: 'Neo-Noir Creatives',
    shortName: 'Neo-Noir',
    tagline: 'Structured Collaboration for Black Scholars in the Arts',
    category: 'Arts and Expression',
    isClaimed: true,
    claimedByUserId: undefined,
    logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#1A202C',
    secondaryColor: '#D69E2E',
    description: 'A space structured for students to collaborate and produce their own work for academic and professional development of Black scholars interested in the arts (Theater, Film, Dance, Music, Writing, Spoken Word, etc.).',
    contactEmail: 'neonoir@campus.edu',
    instagramHandle: '@campus_neonoir',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '2019',
      foundingLocation: 'Arts Building & Studio Theatre',
      motto: 'Create, Express, Elevate',
      principles: ['Artistic Expression', 'Multidisciplinary Collaboration', 'Creative Freedom'],
      colors: ['Noir Black', 'Amber Gold'],
      foundingStory: 'Formed to provide Black student filmmakers, actors, musicians, poets, and visual artists with equipment, production teams, and showcase venues.',
      campusChapterStory: 'Hosts annual film screenings, open mic nights, and gallery exhibitions.',
      historicalSignificance: 'Empowering the next generation of Black storytellers and cultural creators.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // 23. Swan Social
  {
    id: 'org-swansocial',
    name: 'Swan Social',
    shortName: 'Swan Social',
    tagline: 'Celebrating Black Excellence, Culture, and Community',
    category: 'Arts and Expression',
    isClaimed: true,
    claimedByUserId: undefined,
    logo: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#4A154B',
    secondaryColor: '#E2E8F0',
    description: 'A social organization celebrating Black excellence, culture, and community through events, networking, and empowerment.',
    contactEmail: 'swansocial@campus.edu',
    instagramHandle: '@campus_swansocial',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [],
    events: [],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '2021',
      foundingLocation: 'Campus Hub Plaza',
      motto: 'Grace, Elegance, Excellence',
      principles: ['Black Excellence', 'Social Empowerment', 'Community Connection'],
      colors: ['Plum Purple', 'Swan White'],
      foundingStory: 'Established to bring collegiate students together for upscale social mixers, cultural formals, and professional networking.',
      campusChapterStory: 'Known for producing premier campus galas and networking mixers.',
      historicalSignificance: 'Elevating social community building and Black excellence.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  },

  // ==========================================
  // CAMPUS DEPARTMENT / AFFILIATED - 1 ORG
  // ==========================================

  // 24. BSEWG (has 1 announcement)
  {
    id: 'org-bsewg',
    name: 'Black Student Experience Working Group (BSEWG)',
    shortName: 'BSEWG',
    tagline: 'Advocacy, Research, and Policy Recommendations for Black Student Success',
    category: 'Campus Department / Affiliated',
    isClaimed: false,
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&auto=format&fit=crop&q=80',
    primaryColor: '#002B7F',
    secondaryColor: '#D4AF37',
    description: 'A collaborative working group focused on improving the Black student experience through advocacy, research, and policy recommendations.',
    contactEmail: 'bsewg@campus.edu',
    instagramHandle: '@campus_bsewg',
    members: [],
    bannedMembers: [],
    joinRequests: [],
    positionRequests: [],
    plannerNotes: [],
    plannerAccessRequests: [],
    announcements: [
      {
        id: 'anc-bsewg-1',
        orgId: 'org-bsewg',
        orgName: 'Black Student Experience Working Group',
        authorId: 'user-elijah',
        authorName: 'Elijah Kincade',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        authorPosition: 'Super Admin / Convener',
        title: '📋 Fall Campus Climate Town Hall & Policy Recommendations',
        content: 'The Black Student Experience Working Group invites all undergraduate and graduate student leaders, faculty, and campus administrators to our Fall Campus Climate Town Hall. We will present our latest research findings and institutional policy recommendations on student retention, funding, and mental health resources.',
        pinned: true,
        isGlobal: true,
        imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=900&auto=format&fit=crop&q=80',
        createdAt: '2026-08-21T14:00:00.000Z',
        likes: ['user-elijah'],
        comments: []
      }
    ],
    events: [
      {
        id: 'evt-bsewg-1',
        orgId: 'org-bsewg',
        orgName: 'Black Student Experience Working Group',
        title: 'Fall Black Student Experience Town Hall',
        description: 'Open discussion with Vice Chancellor of Student Affairs and academic deans.',
        date: '2026-09-22',
        time: '4:00 PM - 6:00 PM',
        location: 'Alumni Center Main Auditorium',
        locationAddress: 'Alumni Center, 100 University Plaza',
        category: 'Educational',
        flyerUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&auto=format&fit=crop&q=80',
        rsvpsGoing: ['user-elijah'],
        rsvpsInterested: [],
        createdAt: '2026-08-21T12:00:00.000Z'
      }
    ],
    feed: [],
    photos: [],
    videos: [],
    history: {
      foundingDate: '2020',
      foundingLocation: 'Campus Academic Senate',
      motto: 'Research, Policy, Action',
      principles: ['Data-Driven Advocacy', 'Student Retention', 'Institutional Accountability'],
      colors: ['Navy Blue', 'Gold'],
      foundingStory: 'Formed as an institutional initiative to evaluate and elevate every dimension of Black student life and graduation success.',
      campusChapterStory: 'Unclaimed student leadership seat on our campus directory. Join to claim leadership.',
      historicalSignificance: 'Driving campus-wide policy reform and resource allocation.',
      founders: [],
      historicPhotos: []
    },
    createdAt: '2025-08-01T00:00:00.000Z'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-group-global-1',
    senderId: 'user-elijah',
    senderName: 'Elijah Kincade',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    recipientId: 'group:group-global',
    content: 'Welcome to the BlackOrgConnectionz campus-wide network! Connect, discover student organizations, attend upcoming step shows and galas, and build lifelong community.',
    createdAt: '2026-08-22T10:00:00.000Z',
    read: true
  },
  {
    id: 'msg-group-pbs-1',
    senderId: 'user-elijah',
    senderName: 'Elijah Kincade',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    recipientId: 'group:group-org-pbs',
    content: 'Brothers of Phi Beta Sigma, welcome to our chapter channel! Let’s make this semester extraordinary.',
    createdAt: '2026-08-22T20:00:00.000Z',
    read: true
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-elijah',
    title: '🛡️ Super Admin Access Active',
    message: 'Welcome Elijah Kincade! You have full platform governance and admin authority over all organizations.',
    type: 'claim',
    link: '/superadmin',
    read: false,
    createdAt: '2026-08-23T12:00:00.000Z'
  }
];

// NPHC Founding Order Mapping (Founding Year / Date)
// 1. AKA: Jan 15, 1908
// 2. Kappa Alpha Psi: Jan 5, 1911
// 3. Omega Psi Phi: Nov 17, 1911
// 4. Delta Sigma Theta: Jan 13, 1913
// 5. Phi Beta Sigma: Jan 9, 1914
// 6. Zeta Phi Beta: Jan 16, 1920
// 7. Sigma Gamma Rho: Nov 12, 1922
// 8. NPHC Council: May 10, 1930
export const NPHC_FOUNDING_ORDER: { [orgId: string]: number } = {
  'org-aka': 19080115,    // Alpha Kappa Alpha (1908)
  'org-kapsi': 19110105,  // Kappa Alpha Psi (1911 - Jan)
  'org-opp': 19111117,    // Omega Psi Phi (1911 - Nov)
  'org-dst': 19130113,    // Delta Sigma Theta (1913)
  'org-pbs': 19140109,    // Phi Beta Sigma (1914)
  'org-zpb': 19200116,    // Zeta Phi Beta (1920)
  'org-sgrho': 19221112,  // Sigma Gamma Rho (1922)
  'org-nphc': 19300510    // National Pan-Hellenic Council (1930)
};

export function sortOrganizationsByFounding(orgs: Organization[]): Organization[] {
  return [...orgs].sort((a, b) => {
    const isANphc = a.category === 'Fraternities & Sororities (NPHC)' || NPHC_FOUNDING_ORDER[a.id] !== undefined;
    const isBNphc = b.category === 'Fraternities & Sororities (NPHC)' || NPHC_FOUNDING_ORDER[b.id] !== undefined;

    if (isANphc && isBNphc) {
      const orderA = NPHC_FOUNDING_ORDER[a.id] ?? 99999999;
      const orderB = NPHC_FOUNDING_ORDER[b.id] ?? 99999999;
      return orderA - orderB;
    }

    if (isANphc) return -1;
    if (isBNphc) return 1;

    return 0;
  });
}

