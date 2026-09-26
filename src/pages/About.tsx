import Timeline from "../components/Timeline";
import Underline from "../components/Underline";
import { timeline } from "../data/data";
import "../style/About.css";

function About() {
    return (
        <section
            id="about"
            className="relative z-10 flex min-h-screen items-start px-6 py-20 sm:px-10 lg:px-20 h-[100dvh]">
            <div className="mx-auto w-full max-w-7xl">

                <div className="max-w-5xl">
                    <p className="mb-6 text-xl font-medium tracking-tight sm:text-2xl text-[#2563EB]">
                        About me
                    </p>
                </div>

                <div>
                    <p className="max-w-7xl text-sm leading-relaxed text-[#666666] sm:text-sm lg:text-md">
                        I started my education in Mechanical Engineering at{" "}
                        <a
                            href="https://www.ct.ufpb.br/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Underline delay={500}>UFPB</Underline>
                        </a>
                        , where I became involved in student competition
                        programs and gained hands-on experience solving
                        engineering problems.
                    </p>

                    <p className="mt-3 max-w-7xl text-sm leading-relaxed text-[#666666] sm:text-sm lg:text-md">
                        During the pandemic, I began studying Web Development
                        at{" "}
                        <a
                            href="https://driven.com.br/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Underline delay={1500}>
                                Driven Education
                            </Underline>
                        </a>
                        , which led me to pursue a degree in Internet Systems
                        at{" "}
                        <a
                            href="https://unipe.edu.br/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Underline delay={2500}>Unipê</Underline>
                        </a>
                        . While studying, I worked as a Frontend Developer,
                        building a strong foundation in software development.
                        After graduating, I moved back toward the automotive
                        industry, joining{" "}
                        <a
                            href="https://www.stellantis.com/en"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Underline delay={3000}>Stellantis</Underline>
                        </a>{" "}
                        as a DRE, where I now work at the intersection of
                        engineering and technology.
                    </p>
                </div>

                <Timeline timeline={timeline} />
            </div>
        </section>
    );
}

export default About;