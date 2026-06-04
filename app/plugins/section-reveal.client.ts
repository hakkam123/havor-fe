import type { DirectiveBinding } from 'vue'

const revealClass = 'section-reveal'
const visibleClass = 'section-reveal-visible'

const getDelay = (binding?: DirectiveBinding) => {
  const value = binding?.value

  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'delay' in value) {
    const delay = Number(value.delay)
    return Number.isFinite(delay) ? delay : 0
  }

  return 0
}

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        entry.target.classList.add(visibleClass)
        observer.unobserve(entry.target)
      })
    },
    {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12
    }
  )

  const prepare = (el: Element, delay = 0) => {
    const target = el as HTMLElement

    if (!target.classList.contains(revealClass)) {
      target.style.setProperty('--reveal-delay', `${delay}ms`)
      target.classList.add(revealClass)
    }

    const rect = target.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      target.classList.add(visibleClass)
      return
    }

    observer.observe(target)
  }

  nuxtApp.vueApp.directive('motion-fade-up', {
    mounted(el, binding) {
      prepare(el, getDelay(binding))
    },
    beforeUnmount(el) {
      observer.unobserve(el)
    }
  })

  const preparePublicSections = () => {
    const sections = document.querySelectorAll<HTMLElement>(
      '.marketing-shell .brand-section, .marketing-shell .marketing-section, .marketing-shell footer'
    )

    sections.forEach((section, index) => {
      prepare(section, Math.min(index * 45, 180))
    })
  }

  nuxtApp.hook('page:finish', () => {
    window.requestAnimationFrame(preparePublicSections)
  })
})
