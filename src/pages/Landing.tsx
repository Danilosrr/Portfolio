import { useEffect, useState } from "react";
import Portrait from "../components/Portrait";
import Underline from "../components/Underline";
import WordFlip from "../components/WordFlip";
import "../style/Landing.css";
import NextPage from "../components/NextPage";

type Combination = {
    discipline: string;
    role: string;
};

const combinations: Combination[] = [
    {
        discipline: "Mechanical",
        role: "Engineer",
    },
    {
        discipline: "Software",
        role: "Engineer",
    },
    {
        discipline: "Software",
        role: "Developer",
    },
    {
        discipline: "Mechanical",
        role: "Engineer",
    },
];

const DISPLAY_TIME = 4000;

function Landing({ onNext }: { onNext: () => void }) {
    const [combinationIndex, setCombinationIndex] = useState(0);
    const current = combinations[combinationIndex];

    useEffect(() => {
        const interval = window.setInterval(() => {
            setCombinationIndex(
                (current) => (current + 1) % combinations.length
            );
        }, DISPLAY_TIME);

        return () => window.clearInterval(interval);
    }, []);


    return (
        <section
            id="hero"
            className="relative z-10 flex min-h-screen items-center px-6 py-20 sm:px-10 lg:px-20 h-[100dvh]"
        >
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_auto] lg:gap-20">

                {/* Left — Content */}
                <div className="max-w-5xl">

                    {/* Greeting */}
                    <p className="mb-6 text-xl font-medium tracking-tight sm:text-2xl">
                        Hi! I'm Danilo,
                    </p>

                    {/* Animated title */}
                    <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.045em] sm:text-7xl md:text-8xl lg:text-[clamp(5rem,9vw,9rem)]">
                        <div>
                            <WordFlip
                                word={current.discipline}
                                color="blue"
                            />
                        </div>

                        <div className="mt-2">
                            <WordFlip
                                word={current.role}
                                color="blue"
                            />
                        </div>
                    </h1>

                    {/* Description */}
                    <p className="mt-10 max-w-2xl text-lg leading-relaxed text-[#666666] sm:text-xl lg:text-2xl">
                        I solve problems, build things, and move between{" "}
                        <Underline delay={500}>technology</Underline>{" "}
                        and{" "}
                        <Underline delay={1000}>engineering</Underline>{" "}
                        to make ideas work.
                    </p>

                    {/* Technical label */}
                    <div className="mt-12 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#999993]">
                        <span className="h-px w-8 bg-[#D9D9D4]" />
                        <span>Engineering × Technology</span>
                    </div>
                    <NextPage onClick={onNext} />
                </div>

                {/* Right — Portrait */}
                <Portrait />
            </div>
        </section>
    )
}

export default Landing