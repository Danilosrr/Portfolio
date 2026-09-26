import { useState } from "react";

import Background from "./components/Background";
import Rule from "./components/Rule";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] =
    useState(false);

  const sections = [
    {
      label: "About",
      index: 1,
    },
    {
      label: "Projects",
      index: 2,
    },
    {
      label: "Skills",
      index: 3,
    },
    {
      label: "Contact",
      index: 4,
    }
  ];

  const changePage = (nextPage: number) => {
    if (
      nextPage === currentPage ||
      isTransitioning ||
      nextPage < 0 ||
      nextPage > 4
    ) {
      return;
    }

    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentPage(nextPage);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const pages = [
    <Landing
      onNext={() => changePage(1)}
    />,
    <About />,
    <Projects />,
    <Skills />,
    <Contact
      onNext={() => changePage(0)}
    />
  ];

  return (
    <main className="relative h-[100svh] min-h-[100svh] overflow-hidden bg-[#F5F5F2] text-[#171717]">
      <Background />

      <div
        className={`page-transition ${isTransitioning
          ? "page-transition-out"
          : "page-transition-in"
          }`}
      >
        {pages[currentPage]}
      </div>

      {currentPage > 0 && (
        <Rule
          currentPage={currentPage}
          sections={sections}
          onNavigate={changePage}
        />
      )}
    </main>
  );
}

export default App;