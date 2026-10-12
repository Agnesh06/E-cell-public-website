import { describe, expect, it } from 'vitest'
import {
  projects,
  getProjectBySlug,
  getAllProjects,
  getAdjacentProjects,
} from './projects'

describe('Projects Data Integrity', () => {
  it('contains at least 8 structured projects', () => {
    expect(projects.length).toBeGreaterThanOrEqual(8)
  })

  it('each project has unique and valid slug', () => {
    const slugs = projects.map((p) => p.slug)
    const uniqueSlugs = new Set(slugs)
    expect(slugs.length).toBe(uniqueSlugs.size)

    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('each project satisfies the 7 required information sections in structure', () => {
    for (const p of projects) {
      // 1. Image handling (optional url, fallback placeholder supported)
      expect(typeof p.title).toBe('string')
      expect(p.order).toBeGreaterThan(0)

      // 2. Description (engaging, 3-4 lines)
      expect(typeof p.description).toBe('string')
      expect(p.description.length).toBeGreaterThan(120)

      // 3. Feasibility (technical, resources, timeline, constraints, summary)
      expect(p.feasibility).toBeDefined()
      if (typeof p.feasibility === 'object') {
        expect(typeof p.feasibility.status).toBe('string')
        expect(typeof p.feasibility.summaryAssessment).toBe('string')
        expect(typeof p.feasibility.technicalRequirements).toBe('string')
        expect(typeof p.feasibility.resourceRequirements).toBe('string')
        expect(typeof p.feasibility.timeline).toBe('string')
        expect(typeof p.feasibility.potentialConstraints).toBe('string')
      } else {
        expect(typeof p.feasibility).toBe('string')
      }

      // 4. Change and Impact
      expect(p.impact).toBeDefined()
      if (p.impact) {
        expect(typeof p.impact.changeStatement).toBe('string')
        expect(['expected', 'verified']).toContain(p.impact.impactType)
        expect(Array.isArray(p.impact.outcomes)).toBe(true)
        expect(p.impact.outcomes.length).toBeGreaterThanOrEqual(2)
      }

      // 5. Technology Stack / Approach
      expect(p.techOrApproach).toBeDefined()
      if (p.techOrApproach) {
        expect(['tech-stack', 'approach']).toContain(p.techOrApproach.type)
        expect(typeof p.techOrApproach.title).toBe('string')
        expect(typeof p.techOrApproach.summary).toBe('string')
        expect(p.techOrApproach.items.length).toBeGreaterThanOrEqual(3)
      }
    }
  })

  it('correctly categorizes technical vs non-technical projects', () => {
    const campusInnovation = getProjectBySlug('placeholder-project-one')
    expect(campusInnovation?.techOrApproach?.type).toBe('tech-stack')

    const alumniNetwork = getProjectBySlug('placeholder-project-two')
    expect(alumniNetwork?.techOrApproach?.type).toBe('approach')

    const hackathon = getProjectBySlug('placeholder-project-three')
    expect(hackathon?.techOrApproach?.type).toBe('approach')

    const greenLoop = getProjectBySlug('greenloop')
    expect(greenLoop?.techOrApproach?.type).toBe('approach')

    const agriSense = getProjectBySlug('agrisense')
    expect(agriSense?.techOrApproach?.type).toBe('tech-stack')
  })

  it('helper functions return expected adjacent projects', () => {
    const all = getAllProjects()
    expect(all[0].order).toBeLessThan(all[1].order)

    const first = getAdjacentProjects(all[0].slug)
    expect(first.prev).toBeUndefined()
    expect(first.next?.slug).toBe(all[1].slug)

    const second = getAdjacentProjects(all[1].slug)
    expect(second.prev?.slug).toBe(all[0].slug)
    expect(second.next?.slug).toBe(all[2].slug)

    const unknown = getAdjacentProjects('non-existent-project')
    expect(unknown.prev).toBeUndefined()
    expect(unknown.next).toBeUndefined()
  })
})

