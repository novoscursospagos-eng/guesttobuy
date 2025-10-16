import { Header } from '@/components/layout/header';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { HowItWorks } from '@/components/home/how-it-works';
import { Stats } from '@/components/home/stats';
import { Testimonials } from '@/components/home/testimonials';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProperties />
        <HowItWorks />
        <Stats />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}