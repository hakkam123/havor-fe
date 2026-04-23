export const useCorporateContent = () => {
  const company = {
    name: 'PT Havor SMART Digital',
    shortName: 'Havor SMART Digital',
    email: 'hello@havorsmartdigital.com',
    phone: '+62 21 3972 1808',
    office: 'Jakarta, Indonesia',
    tagline: 'Structured digital delivery for businesses, institutions, and growing organizations.'
  }

  const serviceItems = [
    {
      title: 'Web Development',
      summary: 'Corporate websites, service portals, and internal web platforms designed for reliability, clarity, and long-term scale.',
      deliverables: ['Corporate websites', 'Customer portals', 'Internal dashboards']
    },
    {
      title: 'Mobile App Development',
      summary: 'Cross-platform and native mobile products built for operational efficiency, customer engagement, and field mobility.',
      deliverables: ['iOS and Android apps', 'Cross-platform delivery', 'Performance optimization']
    },
    {
      title: 'Custom Software Development',
      summary: 'Tailored software systems that fit specific operational workflows, approvals, governance, and reporting requirements.',
      deliverables: ['Workflow platforms', 'Business systems', 'Custom integrations']
    },
    {
      title: 'System Integration',
      summary: 'Structured integration work that connects legacy applications, cloud tools, internal services, and third-party platforms.',
      deliverables: ['API orchestration', 'Middleware design', 'Data synchronization']
    },
    {
      title: 'UI/UX Design',
      summary: 'Research-led user experience and interface systems that improve usability while preserving enterprise credibility.',
      deliverables: ['User journeys', 'Interface systems', 'Design QA']
    },
    {
      title: 'IT Consulting',
      summary: 'Technology direction, architecture planning, and modernization guidance shaped around business objectives and constraints.',
      deliverables: ['Discovery workshops', 'Roadmaps', 'Architecture review']
    },
    {
      title: 'Maintenance & Support',
      summary: 'Continuous support for updates, monitoring, optimization, and operational continuity after launch.',
      deliverables: ['Release support', 'Preventive maintenance', 'Improvement backlog']
    }
  ]

  const projectItems = [
    {
      title: 'Nusa Finance Service Portal',
      category: 'Business Platform',
      industry: 'Financial Services',
      summary: 'A service portal that consolidated customer requests, internal approvals, and reporting workflows into one governed platform.',
      challenge: 'Disconnected manual processes slowed approvals across multiple teams and branches.',
      solution: 'Havor designed a centralized portal with role-based access, automated workflow routing, and reporting views for management.',
      impact: 'Faster processing, stronger internal visibility, and a more consistent service experience.',
      metric: 'Workflow consolidation across 12 operational functions',
      technologies: ['Nuxt', 'Node API', 'Role-based access', 'Analytics'],
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Astra Logistics Mobile Operations',
      category: 'Mobile App',
      industry: 'Logistics',
      summary: 'A mobile operations suite for dispatch coordination, route visibility, and real-time field reporting.',
      challenge: 'Operational teams needed mobile access to schedules, delivery status, and incident reporting.',
      solution: 'We delivered a cross-platform mobile application connected to central planning and operational dashboards.',
      impact: 'Improved field coordination and stronger visibility from headquarters to daily operations.',
      metric: 'Real-time reporting for distributed teams',
      technologies: ['Flutter', 'Realtime APIs', 'Offline sync', 'Notifications'],
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Mandala Institution Digital Services',
      category: 'Digital Transformation',
      industry: 'Public Institution',
      summary: 'A modernization program spanning public-facing services, internal administration, and integration across legacy systems.',
      challenge: 'The institution needed to improve service access without disrupting existing operations.',
      solution: 'Havor phased the delivery through service design, integration planning, and modular rollout across priority functions.',
      impact: 'Better service accessibility, clearer governance, and a practical path for long-term modernization.',
      metric: 'Phased rollout designed for low operational disruption',
      technologies: ['Service design', 'Integration layer', 'CMS', 'Security review'],
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80'
    }
  ]

  const newsItems = [
    {
      category: 'Company Update',
      title: 'PT Havor SMART Digital expands its enterprise delivery model for business modernization programs',
      summary: 'A closer look at how the team structures discovery, implementation, and support for organizations navigating digital change.',
      date: 'April 18, 2026',
      tags: ['Transformation', 'Delivery Model'],
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80'
    },
    {
      category: 'Insight',
      title: 'What makes a digital transformation program sustainable after the initial launch',
      summary: 'Governance, integration discipline, and operational ownership are often what separate momentum from short-term activity.',
      date: 'April 11, 2026',
      tags: ['Consulting', 'Governance'],
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80'
    },
    {
      category: 'Engineering',
      title: 'Designing enterprise web platforms that remain clear as operational needs grow',
      summary: 'How modular architecture, structured content, and scalable UI systems support long-term delivery.',
      date: 'April 4, 2026',
      tags: ['Web Development', 'Architecture'],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80'
    },
    {
      category: 'UI/UX',
      title: 'Why serious institutions still need strong visual hierarchy in digital products',
      summary: 'Readability, trust, and process clarity are design decisions that affect adoption just as much as aesthetics.',
      date: 'March 28, 2026',
      tags: ['Design System', 'Enterprise UX'],
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80'
    },
    {
      category: 'Partnership',
      title: 'Supporting clients beyond launch with structured maintenance and improvement cycles',
      summary: 'Post-launch support works best when enhancement planning, system monitoring, and governance stay connected.',
      date: 'March 20, 2026',
      tags: ['Support', 'Operations'],
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80'
    }
  ]

  return {
    company,
    homePage: {
      hero: {
        title: 'Enterprise digital solutions built with structure, clarity, and long-term confidence.',
        subtitle:
          'PT Havor Smarta Digital helps businesses and institutions plan, design, build, integrate, and support digital systems that are dependable in execution and credible in presentation.',
        chips: ['Web Development', 'Mobile Apps', 'System Integration', 'UI/UX', 'IT Consulting', 'Custom Software'],
        slides: [
          {
            title: 'Structured engineering environments for modern delivery',
            description: 'Development settings designed around product quality, governance, and delivery discipline.',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80'
          },
          {
            title: 'Cross-functional teams aligned around business objectives',
            description: 'Design, development, and consulting working together from discovery through launch support.',
            image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80'
          },
          {
            title: 'Transformation programs shaped for operational reality',
            description: 'Systems modernization, business workflow design, and integration planning for growing organizations.',
            image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80'
          },
          {

            title: 'Interfaces and systems designed to feel clear and enterprise-ready',
            description: 'Premium UI composition built for readability, control, and service confidence.',
            image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80'
          },
          {
           title: 'Professional digital experiences with institutional strength',
            description: 'A polished visual and delivery language for organizations that need trust, not noise.',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80'
          }
        ],
        stats: [
          { label: 'Service Domains', value: '7' },
          { label: 'Delivery Stages', value: '4' },
          { label: 'Support Mindset', value: 'Long-Term' }
        ]
      },
      approach: {
        title: 'Our Approach',
        intro:
          'We work through a clear delivery structure so stakeholders know what is being solved, how decisions are made, and how implementation progresses.',
        pillars: [
          {
            step: '01',
            title: 'Discover',
            description: 'We align business objectives, users, systems, and constraints before defining the right solution path.'
          },
          {
            step: '02',
            title: 'Design',
            description: 'We shape service flows, interface systems, architecture direction, and implementation priorities with clarity.'
          },
          {
            step: '03',
            title: 'Build',
            description: 'We execute with engineering discipline, structured communication, and steady iteration across teams.'
          },
          {
            step: '04',
            title: 'Support',
            description: 'We stay involved through launch, stabilization, optimization, and longer-term growth planning.'
          }
        ]
      },
      trustedBy: {
        title: 'Trusted By',
        subtitle: 'Trusted by businesses, institutions, and growing organizations.',
        logos: [
          { name: 'Mandala Group', note: 'Corporate Services' },
          { name: 'Nusa Finance', note: 'Financial Services' },
          { name: 'Astra Logistics', note: 'Operations Technology' },
          { name: 'Sagara Health', note: 'Healthcare Systems' },
          { name: 'Arunika Institute', note: 'Institutional Programs' },
          { name: 'Lintas Retail', note: 'Commerce Operations' }
        ]
      },
      whyHavor: {
        title: 'Why Havor',
        intro: 'Clients choose Havor when they need digital work that is tailored, structured, and dependable from planning through support.',
        points: [
          {
            title: 'Tailored solution architecture',
            description: 'Every engagement is shaped around actual workflows, governance needs, and service objectives.'
          },
          {
            title: 'Experienced multidisciplinary team',
            description: 'Strategy, design, engineering, and support are connected so delivery does not fragment across handoffs.'
          },
          {
            title: 'Modern but practical technology',
            description: 'Technology choices are selected for maintainability, scalability, and fit with operational reality.'
          },
          {
            title: 'Scalable system thinking',
            description: 'We build with future growth in mind, from information structure to integration and support planning.'
          },
          {
            title: 'Client-focused collaboration',
            description: 'Communication stays clear, formal, and collaborative so decisions move with confidence.'
          },
          {
            title: 'Long-term partnership support',
            description: 'Our role does not end at deployment. We stay involved where systems need refinement and continuity.'
          }
        ]
      },
      services: {
        title: 'Our Services',
        intro: 'Core service areas designed to help organizations modernize systems, improve delivery, and strengthen digital operations.',
        items: serviceItems
      },
      projects: {
        title: 'Latest Projects / Selected Work',
        intro: 'A curated view of selected implementation work across web platforms, mobile applications, and digital transformation programs.',
        items: projectItems
      },
      insights: {
        title: 'Insights & News',
        intro: 'Articles, updates, and perspectives that show how Havor thinks about delivery, design, and technology change.',
        items: newsItems.slice(0, 3)
      },
      cta: {
        title: 'Ready to shape a digital solution that feels clear, capable, and enterprise-ready?',
        copy:
          'Whether you need a new platform, an integration initiative, a service redesign, or long-term support, Havor can help structure the next step with confidence.'
      }
    },
    aboutPage: {
      hero: {
        title: 'About Us',
        subtitle:
          'PT Havor SMART Digital is built around the belief that technology delivery should be strategic, disciplined, and genuinely useful for the organizations it serves.',
        image: 'https://images.unsplash.com/photo-1573167243872-43c6433b9d40?auto=format&fit=crop&w=1600&q=80'
      },
      journey: {
        title: 'Our Journey',
        intro:
          'Havor grew from a practical delivery mindset: understand the organization, design what matters, and build systems that can be trusted over time.',
        narrative:
          'The company began by helping clients establish stronger digital foundations through web platforms and business applications. As client needs became broader and more complex, Havor expanded into mobile development, custom software, system integration, design systems, and consulting support. Today, the company operates as a structured digital partner for organizations that need both strong execution and clear strategic guidance.',
        milestones: [
          {
            phase: 'Foundation',
            title: 'Early delivery focus',
            description: 'Initial projects centered on corporate websites, internal portals, and dependable web implementation.'
          },
          {
            phase: 'Expansion',
            title: 'Broader technical capability',
            description: 'Service lines expanded into mobile products, custom software, UI/UX design, and integration work.'
          },
          {
            phase: 'Maturity',
            title: 'Structured enterprise collaboration',
            description: 'The team refined its delivery model to support more formal organizations, governance needs, and phased transformation programs.'
          },
          {
            phase: 'Today',
            title: 'Long-term digital partner',
            description: 'Havor now supports clients across planning, delivery, maintenance, and continuous improvement.'
          }
        ]
      },
      visionMission: {
        title: 'Vision & Mission',
        vision:
          'To be a trusted technology partner for businesses and institutions seeking modern digital systems that are clear in design, strong in execution, and sustainable in operation.',
        missions: [
          {
            title: 'Deliver purposeful digital solutions',
            description: 'Create systems and experiences that solve real organizational needs instead of adding unnecessary complexity.'
          },
          {
            title: 'Build with structure and professionalism',
            description: 'Maintain disciplined processes, transparent collaboration, and dependable implementation standards.'
          },
          {
            title: 'Support long-term transformation',
            description: 'Help clients move beyond one-time delivery into stronger operational capability and digital maturity.'
          },
          {
            title: 'Strengthen trust through design and technology',
            description: 'Ensure that every product, platform, and service experience communicates clarity, quality, and credibility.'
          }
        ],
        supportNote:
          'Our work combines strategy, design, engineering, and maintenance so clients gain continuity instead of fragmented project handoffs.'
      }
    },
    servicesPage: {
      hero: {
        title: 'Services',
        subtitle:
          'From planning to implementation and post-launch support, Havor provides digital capabilities that help organizations move with clarity and confidence.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80'
      },
      overview: {
        title: 'Service Overview',
        intro:
          'Havor helps clients solve business and operational challenges through technology that is intentionally designed, carefully implemented, and maintainable over time.',
        points: [
          'Aligns digital work with business objectives and stakeholder requirements.',
          'Combines consulting, design, engineering, and support into one connected delivery model.',
          'Balances modern implementation with governance, scale, and operational readiness.'
        ]
      },
      coreServices: serviceItems,
      capabilities: {
        title: 'Capabilities / Detailed Expertise',
        groups: [
          {
            title: 'Scalable platforms',
            description: 'Corporate websites, service portals, and business platforms with strong structure, governance, and performance planning.',
            tags: ['Information architecture', 'Responsive systems', 'Performance planning']
          },
          {
            title: 'Business automation',
            description: 'Custom applications that reduce manual work, strengthen approvals, and support operational consistency.',
            tags: ['Workflow logic', 'Role permissions', 'Reporting layers']
          },
          {
            title: 'Cross-platform solutions',
            description: 'Digital products that connect desktop, mobile, internal tools, and customer-facing touchpoints.',
            tags: ['Mobile delivery', 'Cross-device experience', 'Connected services']
          },
          {
            title: 'User-centered design',
            description: 'Research-driven interface systems with clear navigation, readable content, and credible enterprise presentation.',
            tags: ['User flows', 'Design systems', 'Usability refinement']
          },
          {
            title: 'Integration support',
            description: 'Practical integration planning between new applications, existing systems, and external services.',
            tags: ['API design', 'Legacy connection', 'Data flow planning']
          },
          {
            title: 'Long-term maintenance',
            description: 'Ongoing support for enhancements, optimization, release management, and platform continuity.',
            tags: ['Monitoring', 'Backlog support', 'Continuous improvement']
          }
        ]
      },
      cta: {
        title: 'Let’s discuss the right service scope for your organization.',
        copy: 'We can help define the right delivery model, capability mix, and implementation priorities.',
        button: 'Consult With Havor'
      }
    },
    projectsPage: {
      hero: {
        title: 'Projects',
        subtitle:
          'Selected work that reflects Havor’s delivery quality, implementation discipline, and focus on meaningful digital outcomes.',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80'
      },
      featured: projectItems,
      caseStudyHighlights: {
        title: 'Case Study Highlights',
        intro: 'A closer look at how project objectives, solutions, and outcomes are structured across different engagements.',
        items: projectItems.map((item) => ({
          title: item.title,
          objective: item.challenge,
          solution: item.solution,
          impact: item.impact,
          technologies: item.technologies
        }))
      },
      categories: {
        title: 'Project Categories',
        items: [
          {
            title: 'Corporate websites',
            description: 'Institutional websites and service-led corporate platforms with strong hierarchy and trust-building presentation.'
          },
          {
            title: 'Business systems',
            description: 'Operational tools, workflow applications, and internal service platforms for structured day-to-day execution.'
          },
          {
            title: 'Mobile apps',
            description: 'Apps designed for customer interaction, field operations, and service accessibility across devices.'
          },
          {
            title: 'Internal platforms',
            description: 'Dashboards, intranets, and role-based tools that support teams, reporting, and operational visibility.'
          },
          {
            title: 'Digital transformation projects',
            description: 'Phased modernization programs spanning service design, system renewal, and long-term implementation support.'
          }
        ]
      },
      cta: {
        title: 'Have a project idea, modernization target, or platform requirement to discuss?',
        copy: 'We can help frame the challenge, define a delivery approach, and shape the next stage of implementation.'
      }
    },
    careersPage: {
      hero: {
        title: 'Careers',
        subtitle:
          'Join a team that builds meaningful digital solutions, works collaboratively, and grows through disciplined delivery.',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80'
      },
      culture: {
        title: 'Company Culture',
        narrative:
          'At Havor, we value clear thinking, respectful collaboration, and a steady commitment to quality. Our culture is built for people who enjoy solving real client problems and improving how digital work gets done.',
        values: [
          {
            title: 'Collaboration',
            description: 'We work across roles with transparency, shared context, and practical decision-making.'
          },
          {
            title: 'Learning',
            description: 'We keep growing through project experience, evolving tools, and thoughtful review.'
          },
          {
            title: 'Innovation',
            description: 'We explore better ways of solving problems without losing discipline or clarity.'
          },
          {
            title: 'Ownership',
            description: 'We take responsibility for quality, communication, and the impact of what we deliver.'
          },
          {
            title: 'Impact',
            description: 'We focus on work that improves systems, services, and outcomes for real organizations.'
          }
        ]
      },
      whyWorkHere: {
        title: 'Why Work With Us',
        items: [
          {
            title: 'Growth opportunities',
            description: 'Develop your craft through varied projects, meaningful responsibility, and a culture of steady improvement.'
          },
          {
            title: 'Meaningful projects',
            description: 'Contribute to work that supports businesses, institutions, and service delivery in practical ways.'
          },
          {
            title: 'Supportive environment',
            description: 'Work with teammates who value respect, structure, and constructive collaboration.'
          },
          {
            title: 'Innovation-driven team',
            description: 'Be part of a company that embraces better tools, smarter workflows, and modern implementation approaches.'
          }
        ]
      },
      roles: [
        {
          title: 'Frontend Engineer',
          team: 'Engineering',
          type: 'Full Time',
          location: 'Jakarta / Hybrid',
          summary: 'Build polished, responsive digital interfaces for corporate platforms and business systems.'
        },
        {
          title: 'Mobile App Developer',
          team: 'Engineering',
          type: 'Full Time',
          location: 'Jakarta / Hybrid',
          summary: 'Develop mobile experiences that support both customer-facing products and internal operational workflows.'
        },
        {
          title: 'UI/UX Designer',
          team: 'Design',
          type: 'Full Time',
          location: 'Jakarta / On-site',
          summary: 'Shape service flows, interface systems, and design quality across enterprise-focused digital products.'
        },
        {
          title: 'IT Business Analyst',
          team: 'Consulting',
          type: 'Full Time',
          location: 'Jakarta / Hybrid',
          summary: 'Bridge stakeholder requirements, system logic, and implementation planning for structured digital initiatives.'
        }
      ],
      cta: {
        title: 'Interested in building serious digital work with a collaborative team?',
        copy: 'Send your profile, portfolio, or a short introduction and let’s start the conversation.'
      }
    },
    mediaPage: {
      hero: {
        title: 'Media & News',
        subtitle:
          'Company updates, industry perspectives, and thought leadership from PT Havor SMART Digital.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80'
      },
      featuredArticle: newsItems[0],
      latestArticles: newsItems,
      insightCards: [
        {
          title: 'Enterprise design needs readability, not visual noise',
          summary: 'A perspective on why strong hierarchy and calm composition help institutional users move with confidence.',
          image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80'
        },
        {
          title: 'Integration projects succeed when operational realities are mapped early',
          summary: 'The hidden work in integration planning often determines whether systems stay usable after launch.',
          image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80'
        },
        {
          title: 'Support strategy is part of good product delivery',
          summary: 'Post-launch clarity gives clients confidence in how platforms will evolve, stabilize, and improve.',
          image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80'
        }
      ],
      cta: {
        title: 'Stay connected with Havor’s latest updates and perspectives.',
        copy: 'Follow our company news, reach out for media inquiries, or start a conversation about a digital initiative.'
      }
    }
  }
}
