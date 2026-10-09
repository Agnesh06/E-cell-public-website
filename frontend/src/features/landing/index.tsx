import { Hero } from './hero/Hero'
import { IdeaSteps } from './ideasteps/IdeaSteps'

function LandingPage() {
  return (
    <div className="landing-page">
      <Hero />
      <IdeaSteps />
    </div>
  )
}

export default LandingPage
