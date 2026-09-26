import { useState } from "react";
import Underline from "../components/Underline";
import NextPage from "../components/NextPage";
import "../style/Contact.css";

const EMAIL_ADDRESS = "danilo_srr@hotmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/danilosrr";
const GITHUB_URL = "https://github.com/Danilosrr";

type ContactProps = {
    onNext?: () => void;
};

function Contact({ onNext }: ContactProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(EMAIL_ADDRESS);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
    };

    return (
        <section
            id="contact"
            className="relative z-10 flex h-[100svh] min-h-[100svh] items-start px-6 pt-[calc(1.5rem+env(safe-area-inset-top,0px))] pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:px-10 sm:py-20 lg:px-20 overflow-hidden"
        >
            <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-between">
                <div>
                    {/* Header - Identical to About page */}
                    <div className="max-w-5xl">
                        <p className="mb-6 text-xl font-medium tracking-tight text-[#2563EB] sm:text-2xl">
                            Contact
                        </p>
                    </div>

                    {/* Headline and Intro - Spacing identical to About page */}
                    <div className="max-w-3xl">
                        <p className="text-sm leading-relaxed text-[#666666] sm:text-sm lg:text-md">
                            Whether you have an engineering challenge, a software project, or want to explore new ideas across hardware and technology,
                            feel free to <Underline delay={300}>connect</Underline>.
                        </p>
                    </div>

                    {/* Contact Action Cards Grid */}
                    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                        {/* LinkedIn Button Card */}
                        <a
                            href={LINKEDIN_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="contact-card group"
                        >
                            <span className="contact-card-corner contact-card-corner--tl" />
                            <span className="contact-card-corner contact-card-corner--tr" />
                            <span className="contact-card-corner contact-card-corner--bl" />
                            <span className="contact-card-corner contact-card-corner--br" />

                            <div className="flex sm:flex-col justify-between items-center sm:items-stretch w-full gap-3 sm:gap-0">
                                <div className="flex items-center sm:block gap-3 flex-1 min-w-0">
                                    <div className="flex items-center justify-between sm:w-full">
                                        <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-lg border border-[#D9D9D4] bg-white text-[#171717] group-hover:border-[#2563EB] group-hover:text-[#2563EB] transition-colors shrink-0">
                                            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                                            </svg>
                                        </div>
                                        <span className="hidden sm:inline font-mono text-[10px] tracking-widest text-[#999993] group-hover:text-[#2563EB] transition-colors">
                                            [01 / SOCIAL]
                                        </span>
                                    </div>

                                    <div className="sm:mt-6 min-w-0 flex-1">
                                        <h2 className="text-sm sm:text-xl font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors truncate">
                                            LinkedIn
                                        </h2>
                                        <p className="hidden sm:block mt-1 text-xs text-[#666666]">
                                            &nbsp;
                                        </p>
                                        <p className="sm:hidden text-[10px] font-mono text-[#999993] truncate">
                                            linkedin.com/in/danilosrr
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end sm:justify-between sm:border-t sm:border-[#D9D9D4] sm:pt-4 group-hover:border-[#2563EB]/30 transition-colors shrink-0">
                                    <span className="hidden sm:inline font-mono text-xs text-[#999993] group-hover:text-[#171717] truncate">
                                        linkedin.com/in/danilosrr
                                    </span>
                                    <span className="flex items-center gap-1 font-mono text-xs font-medium text-[#2563EB]">
                                        Connect
                                        <svg
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </a>

                        {/* GitHub Button Card */}
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="contact-card group"
                        >
                            <span className="contact-card-corner contact-card-corner--tl" />
                            <span className="contact-card-corner contact-card-corner--tr" />
                            <span className="contact-card-corner contact-card-corner--bl" />
                            <span className="contact-card-corner contact-card-corner--br" />

                            <div className="flex sm:flex-col justify-between items-center sm:items-stretch w-full gap-3 sm:gap-0">
                                <div className="flex items-center sm:block gap-3 flex-1 min-w-0">
                                    <div className="flex items-center justify-between sm:w-full">
                                        <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-lg border border-[#D9D9D4] bg-white text-[#171717] group-hover:border-[#2563EB] group-hover:text-[#2563EB] transition-colors shrink-0">
                                            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="hidden sm:inline font-mono text-[10px] tracking-widest text-[#999993] group-hover:text-[#2563EB] transition-colors">
                                            [02 / REPOSITORIES]
                                        </span>
                                    </div>

                                    <div className="sm:mt-6 min-w-0 flex-1">
                                        <h2 className="text-sm sm:text-xl font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors truncate">
                                            GitHub
                                        </h2>
                                        <p className="hidden sm:block mt-1 text-xs text-[#666666]">
                                            &nbsp;
                                        </p>
                                        <p className="sm:hidden text-[10px] font-mono text-[#999993] truncate">
                                            github.com/Danilosrr
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end sm:justify-between sm:border-t sm:border-[#D9D9D4] sm:pt-4 group-hover:border-[#2563EB]/30 transition-colors shrink-0">
                                    <span className="hidden sm:inline font-mono text-xs text-[#999993] group-hover:text-[#171717] truncate">
                                        github.com/Danilosrr
                                    </span>
                                    <span className="flex items-center gap-1 font-mono text-xs font-medium text-[#2563EB]">
                                        Explore
                                        <svg
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </a>

                        {/* Email Action Card */}
                        <a
                            href={`mailto:${EMAIL_ADDRESS}`}
                            className="contact-card group"
                        >
                            <span className="contact-card-corner contact-card-corner--tl" />
                            <span className="contact-card-corner contact-card-corner--tr" />
                            <span className="contact-card-corner contact-card-corner--bl" />
                            <span className="contact-card-corner contact-card-corner--br" />

                            <div className="flex sm:flex-col justify-between items-center sm:items-stretch w-full gap-3 sm:gap-0">
                                <div className="flex items-center sm:block gap-3 flex-1 min-w-0">
                                    <div className="flex items-center justify-between sm:w-full">
                                        <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-lg border border-[#D9D9D4] bg-white text-[#171717] group-hover:border-[#2563EB] group-hover:text-[#2563EB] transition-colors shrink-0">
                                            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.75}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="hidden sm:inline font-mono text-[10px] tracking-widest text-[#999993] group-hover:text-[#2563EB] transition-colors">
                                            [03 / DIRECT MAIL]
                                        </span>
                                    </div>

                                    <div className="sm:mt-6 min-w-0 flex-1">
                                        <h2 className="text-sm sm:text-xl font-bold text-[#171717] group-hover:text-[#2563EB] transition-colors truncate">
                                            Email
                                        </h2>
                                        <p className="hidden sm:block mt-1 text-xs text-[#666666]">
                                            &nbsp;
                                        </p>
                                        <div className="sm:hidden flex items-center gap-1.5 text-[10px] font-mono text-[#999993] truncate">
                                            <span className="truncate">{EMAIL_ADDRESS}</span>
                                            <button
                                                type="button"
                                                onClick={handleCopyEmail}
                                                className="font-mono text-xs text-[#999993] hover:text-[#2563EB] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                                                title="Copy email address"
                                            >
                                                {copied ? (
                                                    <span className="text-[#2563EB] font-medium flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end sm:justify-between sm:border-t sm:border-[#D9D9D4] sm:pt-4 group-hover:border-[#2563EB]/30 transition-colors shrink-0">
                                    <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#999993] group-hover:text-[#171717] truncate">
                                        <span className="truncate">{EMAIL_ADDRESS}</span>
                                        <button
                                            type="button"
                                            onClick={handleCopyEmail}
                                            className="font-mono text-xs text-[#999993] hover:text-[#2563EB] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                                            title="Copy email address"
                                        >
                                            {copied ? (
                                                <span className="text-[#2563EB] font-medium flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </span>
                                            )}
                                        </button>
                                    </div>

                                    <span className="flex items-center gap-1 font-mono text-xs font-medium text-[#2563EB]">
                                        Send
                                        <svg
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Desktop RETURN button */}
                    {onNext && (
                        <div className="hidden md:block">
                            <NextPage onClick={onNext} label="RETURN" />
                        </div>
                    )}
                </div>

                {/* Footer specs / Metadata pinned at bottom */}
                <footer className="shrink-0 border-t border-[#D9D9D4] pt-4 pb-14 sm:pb-0 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between font-mono text-[10px] sm:text-[11px] text-[#999993]">
                    <div className="flex items-center gap-4">
                        <span>LOCATION: BRAZIL</span>
                    </div>
                    <div>
                        <span>© {new Date().getFullYear()} DANILO — ALL RIGHTS RESERVED</span>
                    </div>
                </footer>
            </div>
        </section>
    );
}

export default Contact;