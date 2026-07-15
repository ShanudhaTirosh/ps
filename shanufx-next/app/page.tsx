import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import SkillsSection from '@/components/home/SkillsSection';
import Experience from '@/components/home/Experience';
import Services from '@/components/home/Services';
import Testimonials from '@/components/home/Testimonials';
import Innovations from '@/components/home/Innovations';
import CTABanner from '@/components/home/CTABanner';
import ContactForm from '@/components/home/ContactForm';
import CommunityCTA from '@/components/home/CommunityCTA';

export default function HomePage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <Hero />
        <About />
        <SkillsSection />
        <Experience />
        <Services />
        <Testimonials />
        <Innovations />
        <CTABanner />
        <CommunityCTA />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
