import type { TimelineItem } from "../components/Timeline";
import type { Project } from "../pages/Projects";
import telemetryStl from "./telemetryStl.stl?url";

const now = new Date();
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

export const timeline: TimelineItem[] = [
    {
        start: "2018-01",
        end: "2019-01",
        title: "Member",
        organization: "AeroJampa UFPB",
        type: "project",
    },
    {
        start: "2018-01",
        end: "2024-01",
        title: "Mechanical Engineering",
        organization: "Universidade Federal da Paraíba - UFPB",
        type: "education",
    },
    {
        start: "2020-01",
        end: "2020-12",
        title: "Member",
        organization: "Motorius UFPB",
        type: "project",
    },
    {
        start: "2020-12",
        end: "2022-01",
        title: "Subsystem Leader",
        organization: "Motorius UFPB",
        type: "project",
    },
    {
        start: "2022-01",
        end: "2023-01",
        title: "Consultant",
        organization: "Motorius UFPB",
        type: "project",
    },
    {
        start: "2022-01",
        end: "2022-10",
        title: "Full-Stack Web Development",
        organization: "Driven Education",
        type: "education",
    },
    {
        start: "2023-01",
        end: "2025-01",
        title: "Internet Systems",
        organization: "Unipê",
        type: "education",
    },
    {
        start: "2024-06",
        end: "2025-06",
        title: "Frontend Developer",
        organization: "Compass UOL",
        type: "work",
    },
    {
        start: "2026-02",
        end: currentMonth,
        title: "DRE",
        organization: "Stellantis",
        type: "work",
    },
];

export const projects: Project[] = [
    {
        number: "01",
        title: "CAD Viewer",
        subtitle: "Engineering × Software",
        description:
            "A local-first CAD visualization software focused on inspecting and visualizing STEP assemblies on low spec computers.",
        technologies: [
            "Rust",
            "Tauri",
            "React",
            "STEP",
            "CAD",
        ],
        videoUrl: "src/assets/scrub.webm"
    },
    {
        number: "02",
        title: "Engineering PM",
        subtitle: "Engineering × Software",
        description:
            `A lightweight cross-platform Gantt scheduling application for engineering teams featuring Work Breakdown Structure (WBS), 
            milestones, task dependencies, critical path analysis, flexible time scales, project document attachments, 
            project data management and multi-format export support.`,
        technologies: [
            "Rust",
            "Tauri",
            "React",
            "TypeScript",
        ],
        image: "src/assets/Gantt.png",
        href: "https://github.com/Danilosrr/Gantt"
    },
    {
        number: "03",
        title: "Simulation & Optimization",
        subtitle: "Engineering × Simulation × Python",
        description:
            `Research focused on engineering design optimization through the automated generation and analysis of 1,648 airfoil geometries. 
            A Python-based computational pipeline was developed to automate data extraction, geometry generation and analysis, producing 25,000+ aerodynamic data entries.`,
        technologies: [
            "Computational Simulation",
            "Data Analysis",
            "Python",
            "Design Optimization",
        ],
        image: "src/assets/Wingtip.png",
    },
    {
        number: "04",
        title: "Telemetry System",
        subtitle: "Hardware × Software × Engineering",
        description:
            `Implementation of a complete telemetry system combining a custom PCB design, embedded software and a 3D-printable housing. 
            Intended to be a multi-purpose motorcycle telemetry system using various sensors, CAN and LoRa communication for real-time data acquisition and processing.`,
        technologies: [
            "PCB Design",
            "Embedded",
            "Telemetry",
            "3D CAD",
            "3D Printing",
        ],
        modelUrl: telemetryStl,
        href: "https://github.com/Danilosrr/Telemetry",
    },
];