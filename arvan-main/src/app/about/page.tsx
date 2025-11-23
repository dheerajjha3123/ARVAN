import Footer from "@/components/Footer";
import Navigation from "@/components/navigation";
import WhoWeAre from "@/components/Sections/WhoWeAre";
import React from "react";

const About = () => {
  return (
    <>
      <Navigation />
        <div className="pb-10">
        <WhoWeAre />
        </div>
      <Footer />
    </>
  );
};

export default About;
