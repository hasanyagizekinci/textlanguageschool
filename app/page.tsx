import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { HomeAbout } from "@/components/home-about"
import { HomeFeatures } from "@/components/home-features"
import { InteractiveExercise } from "@/components/interactive-exercise"
import { LearningTools } from "@/components/learning-tools"
import { ChallengeBanner } from "@/components/challenge-banner"
import { AccentBanner } from "@/components/accent-banner"
import { HomeLeaderboard } from "@/components/home-leaderboard"
import { BlogPreview } from "@/components/blog-preview"
import { InstagramFeed } from "@/components/instagram-feed"
import { HomeCTA } from "@/components/home-cta"
import { HomeFAQ } from "@/components/home-faq"
import { Footer } from "@/components/footer"
import { SnowflakeBg } from "@/components/snowflake-bg"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Site-wide snowflake layer */}
      <SnowflakeBg />

      <Navigation />
      <main className="relative min-h-screen pt-20">
        <Hero />
        <HomeAbout />
        <HomeFeatures />
        <InteractiveExercise />
        <AccentBanner />
        <LearningTools />
        <ChallengeBanner />
        <HomeLeaderboard />
        <BlogPreview />
        <InstagramFeed />
        <HomeFAQ />
        <HomeCTA />
      </main>
      <Footer />
    </div>
  )
}
