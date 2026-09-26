import { useMemo } from "react";

export type TimelineItem = {
    start: string; // YYYY-MM
    end: string;   // YYYY-MM
    title: string;
    organization: string;
    type: "education" | "work" | "project";
    description?: string;
};

type TimelineProps = {
    timeline: TimelineItem[];
};

type TimelineLane = "education" | "experience";

const TYPE_LABELS: Record<TimelineLane, string> = {
    education: "Education",
    experience: "Project • Work",
};

const LANES: TimelineLane[] = [
    "education",
    "experience",
];

function Timeline({ timeline }: TimelineProps) {
    const { startDate, totalMonths } = useMemo(() => {
        if (timeline.length === 0) {
            const now = new Date();

            return {
                startDate: now,
                totalMonths: 1,
            };
        }

        const dates = timeline.flatMap((item) => [
            new Date(`${item.start}-01`),
            new Date(`${item.end}-01`),
        ]);

        const min = new Date(
            Math.min(...dates.map((date) => date.getTime()))
        );

        const max = new Date(
            Math.max(...dates.map((date) => date.getTime()))
        );

        // Add breathing room on both sides.
        min.setMonth(min.getMonth() - 2);
        max.setMonth(max.getMonth() + 2);

        const months =
            (max.getFullYear() - min.getFullYear()) * 12 +
            (max.getMonth() - min.getMonth());

        return {
            startDate: min,
            totalMonths: Math.max(months, 1),
        };
    }, [timeline]);

    /**
     * Convert a YYYY-MM date into a number of months
     * relative to the beginning of the timeline.
     */
    const getOffset = (date: string) => {
        const current = new Date(`${date}-01`);

        return (
            (current.getFullYear() - startDate.getFullYear()) * 12 +
            (current.getMonth() - startDate.getMonth())
        );
    };

    /**
     * Calculate event duration in months.
     */
    const getWidth = (item: TimelineItem) => {
        const start = getOffset(item.start);
        const end = getOffset(item.end);

        return Math.max(end - start, 1);
    };

    /**
     * Generate the years shown on the temporal axis.
     */
    const years = useMemo(() => {
        const result: number[] = [];

        const firstYear = startDate.getFullYear();
        const lastYear =
            startDate.getFullYear() +
            Math.ceil(totalMonths / 12);

        for (let year = firstYear; year <= lastYear; year++) {
            result.push(year);
        }

        return result;
    }, [startDate, totalMonths]);

    /**
     * Format YYYY-MM as MM/YYYY.
     */
    const formatPeriod = (item: TimelineItem) => {
        const format = (date: string) => {
            const [year, month] = date.split("-");

            return `${month}/${year}`;
        };

        return `${format(item.start)} — ${format(item.end)}`;
    };

    /**
     * Education occupies one lane.
     * Work + projects share the second lane.
     */
    const getLaneItems = (lane: TimelineLane) => {
        if (lane === "education") {
            return timeline.filter(
                (item) => item.type === "education"
            );
        }

        return timeline.filter(
            (item) =>
                item.type === "work" ||
                item.type === "project"
        );
    };

    if (timeline.length === 0) {
        return null;
    }

    return (
        <div className="mt-8 w-full max-w-7xl">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[#999993]">
                <span className="h-px w-8 bg-[#D9D9D4]" />

                <span>
                    Education × Experience
                </span>
            </div>

            <div className="timeline-wrapper">
                <div
                    className="timeline"
                    style={
                        {
                            "--timeline-months": totalMonths,
                        } as React.CSSProperties
                    }
                >
                    {/* =====================================================
                        YEAR AXIS
                    ====================================================== */}
                    <div className="timeline-years">
                        {years.map((year) => {
                            const offset =
                                (year - startDate.getFullYear()) * 12;

                            const position =
                                (offset / totalMonths) * 100;

                            return (
                                <div
                                    key={year}
                                    className="timeline-year"
                                    style={{
                                        left: `${position}%`,
                                    }}
                                >
                                    <span>{year}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* =====================================================
                        LANES
                    ====================================================== */}
                    {LANES.map((lane) => {
                        const items = getLaneItems(lane);

                        return (
                            <div
                                key={lane}
                                className="timeline-lane"
                            >
                                {/* Lane label */}
                                <div className="timeline-lane-label">
                                    <span
                                        className={`timeline-lane-marker timeline-lane-marker--${lane}`}
                                    />

                                    <span>
                                        {TYPE_LABELS[lane]}
                                    </span>
                                </div>

                                {/* Timeline track */}
                                <div className="timeline-track">
                                    {items.map((item) => {
                                        const offset =
                                            getOffset(item.start);

                                        const width =
                                            getWidth(item);

                                        const left =
                                            (offset / totalMonths) * 100;

                                        const eventWidth =
                                            (width / totalMonths) * 100;

                                        return (
                                            <div
                                                key={`${item.organization}-${item.start}-${item.title}`}
                                                className={`timeline-event timeline-event--${item.type}`}
                                                style={{
                                                    left: `${left}%`,
                                                    width: `${eventWidth}%`,
                                                }}
                                            >
                                                {/* Event marker */}
                                                <span className="timeline-event-marker" />

                                                {/* =================================================
                                                    HOVER TOOLTIP
                                                ================================================== */}
                                                <div className="timeline-tooltip">
                                                    <span className="timeline-tooltip-period">
                                                        {formatPeriod(item)}
                                                    </span>

                                                    <strong>
                                                        {item.title}
                                                    </strong>

                                                    <span>
                                                        {item.organization}
                                                    </span>

                                                    {item.description && (
                                                        <p>
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Timeline;