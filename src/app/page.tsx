import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import ValueProps from "./components/ValueProps";
import Collections from "./components/Collections";
import Materials from "./components/Materials";
import Testimonials from "./components/Testimonials";
import QuizCTA from "./components/QuizCTA";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <ValueProps />
        <Collections />
        <Materials />
        <Testimonials />
        <QuizCTA />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
