import Section2 from "@/components/Sections/Section2";
import ShopNowAt from "@/components/Sections/ShopNowAt";
import WhoWeAre from "@/components/Sections/WhoWeAre";
import Navbar from "@/components/Navbar";
import LandingPage from "@/components/Sections/LandingPage";
import Landing_overlay from "@/components/Sections/landing_overlay";
import NewArrivals from "@/components/Sections/NewArrivals";
import BestSellers from "@/components/Sections/bestSellers";
import dynamic from "next/dynamic";

const ContactForm = dynamic(() => import("@/components/Sections/ContactUs"));
const Testimonials = dynamic(
  () => import("@/components/Sections/Testimonials")
);
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <div className={`overflow-x-hidden `}>
      <Navbar></Navbar>
      <Landing_overlay></Landing_overlay>
      <div className="px-1 pt-1 md:px-2 md:pt-2">
        <LandingPage></LandingPage>
      </div>
      <Section2></Section2>
      <NewArrivals />
      <BestSellers />
      <section className="mt-10 md:mt-20">
        <WhoWeAre></WhoWeAre>
      </section>
      <ShopNowAt></ShopNowAt>
      <Testimonials></Testimonials>
      <ContactForm></ContactForm>
      <Footer></Footer>
    </div>
  );
}
