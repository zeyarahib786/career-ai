import { useState } from 'react';
import HeroSection from '../components/landing/HeroSection';
import CertificationPortfolio from '../components/programmes/CertificationPortfolio';
import FacultySection from '../components/marketing/FacultySection';
import WhySection from '../components/marketing/WhySection';
import FAQSection from '../components/support/FAQSection';
import CallToAction from '../components/enrollment/CallToAction';
import EnrollmentModal from '../components/enrollment/EnrollmentModal';

const HomePage = ({ logoSrc, onEnrollClick, enrollModalOpen, onCloseModal }) => {
  const [preselCodes, setPreselCodes] = useState([]);

  const handleEnrollWithCodes = (codes = []) => {
    setPreselCodes(codes);
    onEnrollClick();
  };

  return (
    <main id="main-content">
      <HeroSection onEnrollClick={onEnrollClick}/>
      <CertificationPortfolio onEnrollClick={handleEnrollWithCodes}/>
      <FacultySection/>
      <WhySection/>
      <FAQSection/>
      <CallToAction onEnrollClick={onEnrollClick}/>
      <EnrollmentModal
        isOpen={enrollModalOpen}
        onClose={onCloseModal}
        preselectedCodes={preselCodes}
      />
    </main>
  );
};

export default HomePage;
