type CareerItem = {
  id: number
  title: string
  slug: string
  team: string
  level: string
  location: string
  type: string
  summary: string
  description: string
  responsibilities: string[]
  requirements: string[]
  postedAt: string
}

export const useCareers = () => {
  const careers = ref<CareerItem[]>([
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      slug: 'senior-frontend-engineer',
      team: 'Engineering',
      level: 'Senior',
      location: 'Jakarta / Hybrid',
      type: 'Full-Time',
      summary: 'Lead modern frontend architecture and ship high-impact user experiences for enterprise products.',
      description: 'As a Senior Frontend Engineer, you will partner with design, backend, and product teams to build resilient interfaces with Vue and TypeScript. You will guide implementation quality, mentor teammates, and improve our delivery velocity with maintainable patterns.',
      responsibilities: [
        'Own architecture decisions for core frontend modules and shared UI systems.',
        'Collaborate with product and design to turn user needs into robust interfaces.',
        'Improve performance, accessibility, and reliability across web experiences.',
        'Coach mid-level engineers through reviews and technical pairing.'
      ],
      requirements: [
        '5+ years of frontend engineering experience in production environments.',
        'Strong command of Vue, TypeScript, state management, and API integration.',
        'Experience with design systems, testing strategy, and build tooling.',
        'Clear communication and strong product ownership mindset.'
      ],
      postedAt: '2026-04-10'
    },
    {
      id: 2,
      title: 'Backend Engineer (Node.js)',
      slug: 'backend-engineer-node-js',
      team: 'Platform',
      level: 'Mid-Senior',
      location: 'Remote (SEA)',
      type: 'Full-Time',
      summary: 'Design scalable APIs and services that power product and operations platforms.',
      description: 'You will build and maintain backend services with Node.js, focusing on API quality, observability, and reliability. The role includes close collaboration with frontend and DevOps to ensure secure and efficient delivery.',
      responsibilities: [
        'Design and maintain REST APIs for high-traffic product flows.',
        'Implement integration patterns for external systems and internal services.',
        'Build monitoring and alerting capabilities for critical endpoints.',
        'Contribute to CI/CD and secure deployment workflows.'
      ],
      requirements: [
        '3+ years of backend development with Node.js and relational databases.',
        'Good understanding of API security, rate limiting, and validation.',
        'Experience with SQL schema design and query optimization.',
        'Comfortable working in async, distributed engineering teams.'
      ],
      postedAt: '2026-04-08'
    },
    {
      id: 3,
      title: 'Product Designer',
      slug: 'product-designer',
      team: 'Design',
      level: 'Mid-Level',
      location: 'Jakarta',
      type: 'Full-Time',
      summary: 'Craft end-to-end product experiences with strong UX reasoning and visual consistency.',
      description: 'This role owns discovery-to-delivery design execution across dashboard, web, and workflow products. You will collaborate with PMs and engineers to define interaction models, design systems, and measurable usability improvements.',
      responsibilities: [
        'Translate product goals into wireframes, prototypes, and polished UI.',
        'Run design critiques and usability-driven iteration cycles.',
        'Maintain consistency with shared components and interaction standards.',
        'Support handoff with clear specs and implementation guidance.'
      ],
      requirements: [
        'Portfolio showing web/mobile product design in real shipped products.',
        'Solid Figma workflow and component-system experience.',
        'Strong communication with cross-functional technical teams.',
        'Ability to justify design decisions with user and business context.'
      ],
      postedAt: '2026-04-05'
    },
    {
      id: 4,
      title: 'QA Automation Engineer',
      slug: 'qa-automation-engineer',
      team: 'Quality',
      level: 'Mid-Level',
      location: 'Remote',
      type: 'Contract',
      summary: 'Raise product quality by expanding automated coverage and release confidence.',
      description: 'You will define test strategy across UI and API layers, build automated suites, and partner with engineering teams on quality gates. The focus is practical reliability and fast feedback loops.',
      responsibilities: [
        'Build and maintain E2E and API automation suites for release pipelines.',
        'Define regression strategy and triage production-critical issues.',
        'Collaborate with developers on testability and quality standards.',
        'Improve reporting and visibility into release readiness.'
      ],
      requirements: [
        'Hands-on experience with modern web automation frameworks.',
        'Strong debugging, bug reporting, and root-cause analysis skills.',
        'Comfort with CI pipelines and quality gate integration.',
        'Clear communication and disciplined execution under timelines.'
      ],
      postedAt: '2026-04-01'
    }
  ])

  const getCareerBySlug = (slug: string) => {
    return careers.value.find((item) => item.slug === slug) || null
  }

  return {
    careers,
    getCareerBySlug
  }
}
