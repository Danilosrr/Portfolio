import { useEffect, useRef, useState } from "react";
import { projects } from "../data/data";
import "../style/Projects.css";
import { STLViewer } from "../components/STLViewer";
import { WebMView } from "../components/WebMView";

export type Project = {
    number: string;
    title: string;
    subtitle: string;
    description: string;
    technologies: string[];
    image?: string;
    modelUrl?: string;
    videoUrl?: string;
    href?: string;
};

const AUTO_SCROLL_DELAY = 6000;

function Projects() {
    const containerRef = useRef<HTMLDivElement>(null);
    const projectRefs = useRef<(HTMLElement | null)[]>([]);

    const [activeProject, setActiveProject] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    );

    /*
     * Scroll to a specific project.
     */
    const scrollToProject = (index: number) => {
        const project = projectRefs.current[index];

        if (!project) {
            return;
        }

        project.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

        setActiveProject(index);
    };

    /*
     * Move to the next project.
     */
    const goToNextProject = () => {
        const nextIndex =
            activeProject < projects.length - 1
                ? activeProject + 1
                : 0;

        scrollToProject(nextIndex);
    };

    /*
     * Automatically advance after a period of inactivity.
     *
     * The timer is recreated whenever:
     * - active project changes
     * - mouse enters/leaves
     * - user manually scrolls
     */
    useEffect(() => {
        if (isPaused) {
            return;
        }

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            goToNextProject();
        }, AUTO_SCROLL_DELAY);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [activeProject, isPaused]);

    /*
     * Detect which project is currently visible.
     *
     * This keeps the navigation indicator synchronized
     * with manual scrolling.
     */
    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio -
                            a.intersectionRatio
                    )[0];

                if (!visibleEntry) {
                    return;
                }

                const index = Number(
                    (visibleEntry.target as HTMLElement)
                        .dataset.projectIndex
                );

                if (!Number.isNaN(index)) {
                    setActiveProject(index);
                }
            },
            {
                root: container,
                threshold: [0.5, 0.75, 1],
            }
        );

        projectRefs.current.forEach((project) => {
            if (project) {
                observer.observe(project);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    /*
     * Reset the automatic timer when the user manually
     * interacts with the scroll area.
     */
    const handleInteraction = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (!isPaused) {
            timerRef.current = setTimeout(() => {
                goToNextProject();
            }, AUTO_SCROLL_DELAY);
        }
    };

    return (
        <section
            id="projects"
            className="relative z-10 flex h-[100svh] min-h-[100svh] items-start px-6 pt-[calc(1.5rem+env(safe-area-inset-top,0px))] pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:px-10 sm:py-20 lg:px-20 overflow-hidden"
        >
            <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
                {/* =====================================================
                    SECTION HEADER
                ====================================================== */}

                <div className="shrink-0">
                    <p className="mb-6 text-xl font-medium tracking-tight text-[#2563EB] sm:text-2xl">
                        Projects
                    </p>
                </div>

                {/* =====================================================
                    PROJECT VIEWER
                ====================================================== */}

                <div
                    ref={containerRef}
                    className="projects-scroll-area"
                    onScroll={handleInteraction}
                >
                    {projects.map((project, index) => (
                        <article
                            key={project.number}
                            ref={(element) => {
                                projectRefs.current[index] =
                                    element;
                            }}
                            data-project-index={index}
                            className="project-card"
                            onMouseEnter={() =>
                                setIsPaused(true)
                            }
                            onMouseLeave={() =>
                                setIsPaused(false)
                            }
                        >
                            {/* Project number */}
                            <div className="project-card-number">
                                {project.number}
                            </div>

                            {/* Main content */}
                            <div className="project-card-content">
                                <div className="project-card-info">
                                    <p className="project-card-subtitle">
                                        {project.subtitle}
                                    </p>

                                    <h2 className="project-card-title">
                                        {project.title}
                                    </h2>

                                    <p className="project-card-description">
                                        {project.description}
                                    </p>

                                    <div className="project-card-technologies">
                                        {project.technologies.map(
                                            (technology) => (
                                                <span
                                                    key={
                                                        technology
                                                    }
                                                >
                                                    {technology}
                                                </span>
                                            )
                                        )}
                                    </div>

                                    {project.href && (
                                        <a
                                            href={
                                                project.href
                                            }
                                            className="project-card-link"
                                        >
                                            View project
                                            <span>
                                                →
                                            </span>
                                        </a>
                                    )}
                                </div>

                                {/* Project visual */}
                                <div className="project-card-visual">
                                    {project.videoUrl ? (
                                        <WebMView
                                            src={project.videoUrl}
                                            alt={`${project.title} exploded view`}
                                        />
                                    ) : project.modelUrl ? (
                                        <STLViewer url={project.modelUrl} />
                                    ) : project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                        />
                                    ) : (
                                        <div className="project-card-placeholder">
                                            <span>
                                                PROJECT
                                            </span>

                                            <span>
                                                {project.number}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* =====================================================
                    PROJECT NAVIGATION
                ====================================================== */}

                <div className="projects-navigation">
                    <div className="projects-progress">
                        <span
                            style={{
                                width: `${((activeProject + 1) /
                                    projects.length) *
                                    100
                                    }%`,
                            }}
                        />
                    </div>

                    <div className="projects-navigation-info">
                        <span>
                            {String(
                                activeProject + 1
                            ).padStart(2, "0")}
                        </span>

                        <span className="text-[#D9D9D4]">
                            /
                        </span>

                        <span>
                            {String(
                                projects.length
                            ).padStart(2, "0")}
                        </span>

                        <span className="ml-3 text-[#999993]">
                            {isPaused
                                ? "PAUSED"
                                : "AUTO"}
                        </span>
                    </div>

                    <div className="projects-navigation-buttons">
                        <button
                            type="button"
                            onClick={() => {
                                const previous =
                                    activeProject > 0
                                        ? activeProject -
                                        1
                                        : projects.length -
                                        1;

                                scrollToProject(
                                    previous
                                );
                            }}
                            aria-label="Previous project"
                        >
                            ←
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                goToNextProject()
                            }
                            aria-label="Next project"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Projects;