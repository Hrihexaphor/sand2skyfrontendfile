import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Propertys from "../components/header/Propertys";
import ProjectGallery from "../components/homepage/ProjectGallery";
import FeatureProject from "../components/homepage/FeatureProject";
import NewFeature from "../components/homepage/NewFeature";
import ListingWf from "../components/homepage/ListingWf";
import DetailsDemo from "../components/homepage/DetailsDemo";
import ReadyToMove from "../components/homepage/ReadyMove";
import Footer from "../components/footer/Footer";
import PropertListingWf from "../components/homepage/PropertListingWf";
import NewProject from "../components/homepage/NewProject";
import ToolsAdvice from "../components/homepage/ToolsAdvice";
import Faq from "../components/aboutpage/Faq";

const Home = () => {
  return (
    <div>
      <Propertys />
      <FeatureProject />
      <NewProject />
      <ProjectGallery />
      <ReadyToMove />
      <NewFeature />
      <ListingWf />
      <PropertListingWf />
      <DetailsDemo />
      <Faq />
      <ToolsAdvice />
      <Footer />
    </div>
  );
};

export default Home;
