type LocaleCode = 'en' | 'id'

const STORAGE_KEY = 'havor-public-locale'

const messages = {
  en: {
    nav: {
      about: 'About Us',
      services: 'Services',
      works: 'Works',
      careers: 'Careers',
      media: 'Media & News',
      contact: 'Contact',
      discuss: 'Discuss Your Project'
    },
    home: {
      hero: {
        title: 'Your Digital IT Partner Solution',
        subtitle: 'Integrated technology solutions, custom applications, websites, mobile apps, and intelligent systems to support business growth and digital transformation.',
        primaryCta: 'Discuss Your Project',
        secondaryCta: 'Explore Services',
        trustLabel: 'Trusted digital partner for enterprise systems, web platforms, mobile apps, and intelligent solutions.',
        visualLabel: 'Digital solution ecosystem',
        visualTitle: 'Enterprise-ready delivery stack',
        visualCopy: 'Strategy, application development, data visibility, and long-term support connected in one practical delivery flow.',
        metricOne: 'Application development',
        metricTwo: 'Enterprise IT solution',
        metricThree: 'AI & intelligent solution'
      },
      featured: {
        label: 'Featured Solution',
        title: 'Integrated Digital Solutions for Scalable Business Growth',
        description: 'Havor Smarta Digital helps businesses design, build, and scale digital platforms across web, mobile, enterprise systems, dashboards, and intelligent solutions.',
        caption: 'Web platforms, enterprise systems, dashboards, mobile apps, and intelligent workflows.',
        button: 'Learn More'
      },
      about: {
        kicker: 'About Havor',
        title: 'About Havor Smarta Digital',
        intro: 'Havor Smarta Digital is an Information Technology company specializing in digital solutions and application development. Since its early project journey in 2010 and official establishment as an IT startup in 2019, Havor has delivered scalable technology solutions for businesses across various industries.',
        pointOne: 'Started through project experience in 2010',
        pointTwo: 'Officially evolved as an IT startup in 2019',
        pointThree: 'Focused on practical digital transformation for business clients',
        servicesCta: 'Explore Services',
        projectsCta: 'View Projects'
      },
      highlights: {
        title: 'Company Highlights',
        intro: 'A concise view of Havor milestones, service focus, and project coverage based on the company profile.',
        items: [
          {
            value: '2010',
            label: 'Early Project Journey',
            description: 'Started from practical digital project delivery.'
          },
          {
            value: '2019',
            label: 'Official IT Startup',
            description: 'Established as an Information Technology startup.'
          },
          {
            value: '4',
            label: 'Core Services',
            description: 'Enterprise, website, mobile, and intelligent solutions.'
          },
          {
            value: 'Cross-industry',
            label: 'Projects',
            description: 'E-commerce, LMS, dashboards, corporate websites, and apps.'
          }
        ]
      },
      approach: {
        kicker: 'Delivery Approach',
        title: 'Clear steps from business need to reliable system.',
        intro: 'We keep delivery structured so stakeholders understand the problem, the implementation path, and the support model after launch.'
      },
      trustedBy: {
        title: 'Project Experience',
        subtitle: 'Selected client and project names from Havor Smarta Digital company profile.'
      },
      whyHavor: {
        kicker: 'Why Havor',
        title: 'Why Work With Havor?',
        intro: 'Havor combines application development, enterprise solution thinking, and long-term collaboration so digital initiatives stay practical and maintainable.',
        highlightLabel: 'Digital IT Partner',
        highlight: 'Professional communication, structured implementation, and dependable support for business-critical digital systems.',
        points: [
          {
            title: 'Integrated digital solution approach',
            description: 'Strategy, design, development, and support stay connected from discovery to launch.'
          },
          {
            title: 'Enterprise, web, mobile, and e-commerce experience',
            description: 'Project exposure across corporate websites, business platforms, mobile apps, and commerce systems.'
          },
          {
            title: 'Business-oriented application development',
            description: 'Applications are shaped around real workflows, stakeholder needs, and operational clarity.'
          },
          {
            title: 'Scalable systems for long-term transformation',
            description: 'Technical decisions consider maintainability, integration, and future digital growth.'
          }
        ]
      },
      services: {
        kicker: 'Services',
        title: 'Core Services',
        intro: 'Havor supports organizations through enterprise systems, websites, mobile applications, and intelligent digital solutions.',
        all: 'View All Services',
        empty: 'Service content is being updated. Havor focuses on enterprise IT solutions, website development, mobile apps, and AI-powered digital solutions.',
        explore: 'Explore Service'
      },
      serviceFocus: [
        {
          title: 'Enterprise IT Solution',
          description: 'Custom enterprise applications for ERP, HR, finance, sales force automation, office automation, and intranet platforms.'
        },
        {
          title: 'Website Development',
          description: 'Corporate websites, e-commerce platforms, and marketing microsites to strengthen digital presence and business growth.'
        },
        {
          title: 'Mobile Apps Development',
          description: 'iOS and Android applications tailored for business operations, customer access, and connected digital services.'
        },
        {
          title: 'AI & Intelligent Solution',
          description: 'AI-powered systems for automation, data analysis, intelligent workflows, and digital transformation initiatives.'
        }
      ],
      projects: {
        kicker: 'Portfolio',
        title: 'Project Experience',
        intro: 'Our project experience reflects our capability in delivering digital business platforms, e-commerce systems, enterprise applications, dashboards, mobile apps, and web platforms.',
        all: 'See More Projects',
        empty: 'The project showcase is being updated. Havor project experience includes e-commerce applications, websites, mobile apps, enterprise systems, and dashboard platforms.',
        detail: 'View Project Detail',
        examples: [
          { name: 'Toko Tiga Roda', category: 'E-commerce Application' },
          { name: 'Bigstore Bisnis', category: 'E-commerce Application' },
          { name: 'Intiland', category: 'Website Development' },
          { name: 'Aqua.co.id', category: 'Website Development' },
          { name: 'Shop & Drive', category: 'Website Development' },
          { name: 'BUBU LMS', category: 'Web Application Development' },
          { name: 'REDY Job Portal', category: 'Web & Mobile Application' },
          { name: 'CKB EXIM Dashboard', category: 'Dashboard & Data Platform' }
        ]
      },
      insights: {
        kicker: 'Insights',
        title: 'Information Media',
        intro: 'News, articles, and perspectives from Havor about digital delivery, design, and technology change.',
        all: 'Read More Insights',
        empty: 'Stay tuned for the latest industry insights and company updates.'
      },
      cta: {
        title: 'Ready to Build Your Digital Solution?',
        copy: 'Let\'s discuss how Havor Smarta Digital can support your next website, mobile app, enterprise system, or intelligent digital solution.',
        button: 'Contact Us',
        secondary: 'Explore Services',
        summary: 'Contact Summary',
        website: 'Website',
        phone: 'Phone',
        email: 'Email',
        office: 'Office'
      }
    },
    footer: {
      description: 'Havor Smarta Digital provides integrated technology solutions across enterprise IT, websites, mobile apps, AI-powered systems, and long-term digital transformation support.',
      company: 'Company',
      capabilities: 'Capabilities',
      contact: 'Contact',
      start: 'Start a Conversation',
      copyright: '(c) 2026 PT Havor Smarta Digital. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      capabilityItems: ['Enterprise IT Solution', 'Website Development', 'Mobile Apps Development', 'AI & Intelligent Solution']
    }
  },
  id: {
    nav: {
      about: 'Tentang Kami',
      services: 'Layanan',
      works: 'Project',
      careers: 'Karier',
      media: 'Media & Berita',
      contact: 'Kontak',
      discuss: 'Konsultasikan Project'
    },
    home: {
      hero: {
        title: 'Mitra Solusi IT Digital untuk Bisnis Anda',
        subtitle: 'Solusi teknologi terintegrasi, aplikasi custom, website, mobile app, dan sistem cerdas untuk mendukung pertumbuhan bisnis serta transformasi digital.',
        primaryCta: 'Konsultasikan Project',
        secondaryCta: 'Lihat Layanan',
        trustLabel: 'Partner digital untuk enterprise system, web platform, mobile app, dan intelligent solution.',
        visualLabel: 'Ekosistem solusi digital',
        visualTitle: 'Delivery stack siap untuk bisnis',
        visualCopy: 'Strategi, pengembangan aplikasi, visibilitas data, dan dukungan jangka panjang dalam satu alur delivery yang praktis.',
        metricOne: 'Pengembangan aplikasi',
        metricTwo: 'Solusi IT enterprise',
        metricThree: 'Solusi AI cerdas'
      },
      featured: {
        label: 'Solusi Unggulan',
        title: 'Solusi Digital Terintegrasi untuk Pertumbuhan Bisnis',
        description: 'Havor Smarta Digital membantu bisnis merancang, membangun, dan mengembangkan platform digital melalui web, mobile, enterprise system, dashboard, dan solusi cerdas.',
        caption: 'Web platform, enterprise system, dashboard, mobile app, dan intelligent workflow.',
        button: 'Pelajari Lebih Lanjut'
      },
      about: {
        kicker: 'Tentang Havor',
        title: 'Tentang Havor Smarta Digital',
        intro: 'Havor Smarta Digital adalah perusahaan Information Technology yang berfokus pada solusi digital dan pengembangan aplikasi. Sejak memulai perjalanan project pada 2010 dan resmi berkembang sebagai IT startup pada 2019, Havor menghadirkan solusi teknologi yang scalable untuk berbagai kebutuhan bisnis.',
        pointOne: 'Memulai perjalanan project sejak 2010',
        pointTwo: 'Resmi berkembang sebagai IT startup pada 2019',
        pointThree: 'Fokus pada transformasi digital yang praktis untuk bisnis',
        servicesCta: 'Lihat Layanan',
        projectsCta: 'Lihat Project'
      },
      highlights: {
        title: 'Highlight Perusahaan',
        intro: 'Ringkasan milestone, fokus layanan, dan cakupan project Havor berdasarkan company profile.',
        items: [
          {
            value: '2010',
            label: 'Awal Perjalanan Project',
            description: 'Memulai delivery project digital secara praktis.'
          },
          {
            value: '2019',
            label: 'Resmi Menjadi IT Startup',
            description: 'Berkembang resmi sebagai startup Information Technology.'
          },
          {
            value: '4',
            label: 'Layanan Utama',
            description: 'Enterprise, website, mobile, dan intelligent solution.'
          },
          {
            value: 'Lintas industri',
            label: 'Project',
            description: 'E-commerce, LMS, dashboard, corporate website, dan aplikasi.'
          }
        ]
      },
      approach: {
        kicker: 'Alur Delivery',
        title: 'Langkah kerja yang jelas dari kebutuhan bisnis ke sistem yang reliable.',
        intro: 'Kami menjaga delivery tetap terstruktur agar stakeholder memahami masalah, arah implementasi, dan model support setelah sistem berjalan.'
      },
      trustedBy: {
        title: 'Pengalaman Project',
        subtitle: 'Beberapa nama client dan project dari company profile Havor Smarta Digital.'
      },
      whyHavor: {
        kicker: 'Why Havor',
        title: 'Mengapa Memilih Havor?',
        intro: 'Havor menggabungkan pengembangan aplikasi, pemikiran enterprise solution, dan kolaborasi jangka panjang agar inisiatif digital tetap praktis dan maintainable.',
        highlightLabel: 'Digital IT Partner',
        highlight: 'Komunikasi profesional, implementasi terstruktur, dan dukungan yang dependable untuk sistem digital bisnis.',
        points: [
          {
            title: 'Pendekatan solusi digital yang terintegrasi',
            description: 'Strategi, desain, development, dan support tetap terhubung dari discovery hingga launch.'
          },
          {
            title: 'Pengalaman enterprise, web, mobile, dan e-commerce',
            description: 'Pengalaman project pada corporate website, business platform, mobile app, dan commerce system.'
          },
          {
            title: 'Pengembangan aplikasi berorientasi bisnis',
            description: 'Aplikasi dirancang berdasarkan workflow nyata, kebutuhan stakeholder, dan kejelasan operasional.'
          },
          {
            title: 'Sistem scalable untuk transformasi jangka panjang',
            description: 'Keputusan teknis mempertimbangkan maintainability, integrasi, dan pertumbuhan digital.'
          }
        ]
      },
      services: {
        kicker: 'Layanan',
        title: 'Layanan Utama',
        intro: 'Havor mendukung organisasi melalui enterprise system, website, mobile application, dan intelligent digital solution.',
        all: 'Lihat Semua Layanan',
        empty: 'Konten layanan sedang diperbarui. Havor berfokus pada enterprise IT solution, website development, mobile apps, dan AI-powered digital solution.',
        explore: 'Lihat Layanan'
      },
      serviceFocus: [
        {
          title: 'Enterprise IT Solution',
          description: 'Aplikasi enterprise custom untuk ERP, HR, finance, sales force automation, office automation, dan intranet platform.'
        },
        {
          title: 'Website Development',
          description: 'Corporate website, e-commerce platform, dan marketing microsite untuk memperkuat digital presence dan pertumbuhan bisnis.'
        },
        {
          title: 'Mobile Apps Development',
          description: 'Aplikasi iOS dan Android yang disesuaikan untuk operasional bisnis, akses pelanggan, dan layanan digital terhubung.'
        },
        {
          title: 'AI & Intelligent Solution',
          description: 'Sistem berbasis AI untuk automation, data analysis, intelligent workflow, dan inisiatif transformasi digital.'
        }
      ],
      projects: {
        kicker: 'Portfolio',
        title: 'Pengalaman Project',
        intro: 'Pengalaman project kami mencerminkan kemampuan dalam membangun platform digital business, e-commerce system, enterprise application, dashboard, mobile app, dan web platform.',
        all: 'Lihat Project Lain',
        empty: 'Showcase project sedang diperbarui. Pengalaman Havor mencakup e-commerce application, website, mobile app, enterprise system, dan dashboard platform.',
        detail: 'Lihat Detail Project',
        examples: [
          { name: 'Toko Tiga Roda', category: 'E-commerce Application' },
          { name: 'Bigstore Bisnis', category: 'E-commerce Application' },
          { name: 'Intiland', category: 'Website Development' },
          { name: 'Aqua.co.id', category: 'Website Development' },
          { name: 'Shop & Drive', category: 'Website Development' },
          { name: 'BUBU LMS', category: 'Web Application Development' },
          { name: 'REDY Job Portal', category: 'Web & Mobile Application' },
          { name: 'CKB EXIM Dashboard', category: 'Dashboard & Data Platform' }
        ]
      },
      insights: {
        kicker: 'Insight',
        title: 'Information Media',
        intro: 'Berita, artikel, dan perspektif Havor tentang digital delivery, design, dan perubahan teknologi.',
        all: 'Baca Insight Lain',
        empty: 'Nantikan insight industri dan update terbaru dari Havor.'
      },
      cta: {
        title: 'Siap Membangun Solusi Digital Anda?',
        copy: 'Diskusikan bagaimana Havor Smarta Digital dapat mendukung pengembangan website, mobile app, enterprise system, atau solusi digital cerdas untuk bisnis Anda.',
        button: 'Hubungi Kami',
        secondary: 'Lihat Layanan',
        summary: 'Ringkasan Kontak',
        website: 'Website',
        phone: 'Telepon',
        email: 'Email',
        office: 'Kantor'
      }
    },
    footer: {
      description: 'Havor Smarta Digital menyediakan solusi teknologi terintegrasi untuk enterprise IT, website, mobile app, sistem berbasis AI, dan dukungan transformasi digital jangka panjang.',
      company: 'Perusahaan',
      capabilities: 'Kapabilitas',
      contact: 'Kontak',
      start: 'Mulai Diskusi',
      copyright: '(c) 2026 PT Havor Smarta Digital. Seluruh hak cipta dilindungi.',
      privacy: 'Kebijakan Privasi',
      terms: 'Syarat Layanan',
      capabilityItems: ['Enterprise IT Solution', 'Website Development', 'Mobile Apps Development', 'AI & Intelligent Solution']
    }
  }
} as const

const getNestedValue = (source: unknown, key: string) =>
  key.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as Record<string, unknown>)[segment]
  }, source)

export const usePublicI18n = () => {
  const locale = useState<LocaleCode>('public-locale', () => 'en')

  const setLocale = (value: LocaleCode) => {
    locale.value = value
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, value)
  }

  const toggleLocale = () => setLocale(locale.value === 'en' ? 'id' : 'en')

  const t = (key: string) => {
    const value = getNestedValue(messages[locale.value], key)
    return typeof value === 'string' ? value : key
  }

  const tm = <T = unknown>(key: string): T => getNestedValue(messages[locale.value], key) as T

  onMounted(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY)
    if (savedLocale === 'en' || savedLocale === 'id') locale.value = savedLocale
  })

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
    tm
  }
}
