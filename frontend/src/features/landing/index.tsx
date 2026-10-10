import { Hero } from './hero/Hero'
import { IdeaSteps } from './ideasteps/IdeaSteps'
import ProjectsPreview from '../projects/ProjectsPreview'
import LeadershipSection from './leadership/LeadershipSection'

function LandingPage() {
  return (
    <div className="landing-page">
      <Hero />
      <IdeaSteps />
      <ProjectsPreview />
      <LeadershipSection />
    </div>
  )
}

export default LandingPage
