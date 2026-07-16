import { useState } from 'react';
import HeroSection from '../components/landing/HeroSection';
import CertificationPortfolio from '../components/programmes/CertificationPortfolio';
import FacultySection from '../components/marketing/FacultySection';
import WhySection from '../components/marketing/WhySection';
import EnrollmentOptions from '../components/enrollment/EnrollmentOptions';
import LearningPathway from '../components/marketing/LearningPathway';
import AudienceSection from '../components/marketing/AudienceSection';
import FAQSection from '../components/support/FAQSection';
import CallToAction from '../components/enrollment/CallToAction';
import EnrollmentModal from '../components/enrollment/EnrollmentModal';

const HomePage = ({ logoSrc, onEnrollClick, enrollModalOpen, onCloseModal }) => {
  const [preselCodes, setPreselCodes] = useState([]);
  const [initialCohort, setInitialCohort] = useState('individual');

  const handleEnroll = (cohort = 'individual') => {
    setPreselCodes([]);
    setInitialCohort(cohort);
    onEnrollClick();
  };

  const handleEnrollWithCodes = (codes = [], cohort = 'individual') => {
    setPreselCodes(codes);
    setInitialCohort(cohort);
    onEnrollClick();
  };

  return (
    <main id="main-content">
      <HeroSection onEnrollClick={() => handleEnroll('individual')}/>
      <CertificationPortfolio onEnrollClick={handleEnrollWithCodes}/>
      <FacultySection/>
      <WhySection/>
      <EnrollmentOptions onEnrollClick={handleEnroll}/>
      <LearningPathway/>
      <AudienceSection/>
      <FAQSection/>
      <CallToAction onEnrollClick={handleEnroll}/>
      <EnrollmentModal
        isOpen={enrollModalOpen}
        onClose={onCloseModal}
        preselectedCodes={preselCodes}
        initialCohort={initialCohort}
      />
    </main>
  );
};

export default HomePage;
