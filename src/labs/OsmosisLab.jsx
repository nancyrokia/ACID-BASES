import { useState } from 'react';
import PreTest from '../components/PreTest';
import PostTest from '../components/PostTest';
import Overview from '../components/Overview';
import PotatoExperiment from '../components/PotatoExperiment';
import RealWorldApplications from '../components/RealWorldApplications';
import NavigationButtons from '../components/common/NavigationButtons';
import TopBar from '../components/common/navbar';

const sections = [
  {
    id: 'overview',
    name: 'Overview',
    component: Overview,
    subsections: ['Theory', 'Learning Outcomes', 'Apparatus'],
    icon: '📘',
  },
  {
    id: 'pretest',
    name: 'Pre-Test',
    component: PreTest,
    icon: '📝',
  },
  {
    id: 'experiment',
    name: 'Simulation',
    component: PotatoExperiment,
    icon: '🧪',
  },
  {
    id: 'posttest',
    name: 'Post-Test',
    component: PostTest,
    icon: '📝',
  },
  {
    id: 'applications',
    name: 'Applications',
    component: RealWorldApplications,
    icon: '✅',
  },
];

const labTitle = 'Osmosis Experiment';
const strand = 'Science';
const substrand = 'Physics';

export default function OsmosisLab() {
  // ── Navigation state ──
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);

  const markComplete = () => {
    setCompletedSections(prev =>
      prev.includes(currentSection) ? prev : [...prev, currentSection]
    );
  };

  const goToNext = () => {
    setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
  };

  const goToPrevious = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };

  // ── Test state ──
  const [preTestAnswers, setPreTestAnswers] = useState({});
  const [preTestScore, setPreTestScore] = useState(null);

  const [postTestAnswers, setPostTestAnswers] = useState({});
  const [postTestScore, setPostTestScore] = useState(null);

  // ── Renderer ──
  const renderComponent = () => {
    const commonProps = {
      markComplete,
      navigationButtons: (
        <NavigationButtons
          currentSection={currentSection}
          totalSections={sections.length}
          onNext={goToNext}
          onPrevious={goToPrevious}
        />
      ),
    };

    switch (sections[currentSection].id) {
      case 'pretest':
        return (
          <PreTest
            {...commonProps}
            answers={preTestAnswers}
            setAnswers={setPreTestAnswers}
            score={preTestScore}
            setScore={setPreTestScore}
          />
        );

      case 'posttest':
        return (
          <PostTest
            {...commonProps}
            answers={postTestAnswers}
            setAnswers={setPostTestAnswers}
            score={postTestScore}
            setScore={setPostTestScore}
          />
        );

      default: {
        const CurrentComponent = sections[currentSection].component;
        return <CurrentComponent {...commonProps} />;
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        background: '#f7fafc',
      }}
    >
      <TopBar
        sections={sections}
        currentSection={currentSection}
        completedSections={completedSections}
        onSectionChange={setCurrentSection}
        labTitle={labTitle}
        strand={strand}
        substrand={substrand}
      />

      <main style={{ flex: 1 }}>
        <div style={{ minHeight: '100%' }}>
          {renderComponent()}
        </div>
      </main>
    </div>
  );
}
