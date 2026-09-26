import { useEffect, useState } from "react";

import NextPage from "./NextPage";

type RuleSection = {
    label: string;
    index: number;
};

type RuleProps = {
    currentPage: number;
    sections: RuleSection[];
    onNavigate: (index: number) => void;
};

function Rule({
    currentPage,
    sections,
    onNavigate,
}: RuleProps) {
    const [viewportHeight, setViewportHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            setViewportHeight(window.innerHeight);
        };

        updateHeight();

        window.addEventListener("resize", updateHeight);

        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, []);

    const rulerSections: RuleSection[] = [
        {
            label: "Home",
            index: 0,
        },
        ...sections.filter((section) => section.index !== 0),
    ];

    const majorMarkCount =
        viewportHeight > 0
            ? Math.ceil(viewportHeight / 40)
            : 0;

    return (
        <>
            {/* Mobile navigation */}
            <div className="md:hidden fixed bottom-0 left-1/2 w-full max-w-7xl -translate-x-1/2 px-6">
                <NextPage
                    onClick={() => {
                        const nextPage = currentPage + 1;

                        if (nextPage < rulerSections.length) {
                            onNavigate(nextPage);
                        } else {
                            onNavigate(0);
                        }
                    }}
                    label={currentPage === rulerSections.length - 1 ? "RETURN" : "EXPLORE"}
                />
            </div>

            {/* Desktop ruler */}
            <nav
                className="fixed inset-y-0 left-0 z-50 hidden md:block"
                aria-label="Portfolio sections"
            >
                <div className="flex h-full flex-col justify-start">
                    {Array.from({
                        length: majorMarkCount,
                    }).map((_, index) => {
                        const section = rulerSections[index];

                        const isActive =
                            section !== undefined &&
                            currentPage === section.index;

                        return (
                            <div
                                key={index}
                                className="flex flex-col"
                            >
                                {/* Four short marks */}
                                <div className="flex h-8 flex-col justify-between py-[3px]">
                                    <span className="block h-px w-3 bg-[#C7C7C2]" />
                                    <span className="block h-px w-3 bg-[#C7C7C2]" />
                                    <span className="block h-px w-3 bg-[#C7C7C2]" />
                                    <span className="block h-px w-3 bg-[#C7C7C2]" />
                                </div>

                                {/* Major mark */}
                                <button
                                    type="button"
                                    disabled={!section}
                                    onClick={() =>
                                        section &&
                                        onNavigate(section.index)
                                    }
                                    aria-label={
                                        section
                                            ? `Go to ${section.label}`
                                            : undefined
                                    }
                                    className={`
                                        group relative flex h-3 w-8
                                        items-center p-0
                                        ${section
                                            ? "cursor-pointer"
                                            : "cursor-default"
                                        }
                                    `}
                                >
                                    <span
                                        className={`
                                            block h-px
                                            transition-all duration-200
                                            ${isActive
                                                ? "w-8 bg-[#2563EB]"
                                                : section
                                                    ? "w-6 bg-[#2563EB]"
                                                    : "w-6 bg-[#C7C7C2]"
                                            }
                                            ${section
                                                ? "group-hover:w-8"
                                                : ""
                                            }
                                        `}
                                    />

                                    {/* Section label — hover only */}
                                    {section && !isActive && (
                                        <span
                                            className="
                                                pointer-events-none
                                                absolute left-11
                                                top-1/2
                                                -translate-y-1/2
                                                translate-x-[-4px]
                                                whitespace-nowrap
                                                font-mono text-[8px]
                                                uppercase
                                                tracking-[0.14em]
                                                text-[#171717]
                                                opacity-0
                                                transition-all
                                                duration-200
                                                group-hover:translate-x-0
                                                group-hover:opacity-100
                                            "
                                        >
                                            {section.label}
                                        </span>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

export default Rule;