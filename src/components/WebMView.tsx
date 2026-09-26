import { useEffect, useRef } from "react";

type WebMViewProps = {
    src: string;
    poster?: string;
    alt?: string;
};

export function WebMView({
    src,
    poster,
    alt = "Exploded component visualization",
}: WebMViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    const animationFrameRef =
        useRef<number | null>(null);

    const progressRef = useRef(0);

    const targetRef = useRef(0);

    const lastTimestampRef =
        useRef<number | null>(null);

    const readyRef = useRef(false);

    // Time required to go from assembled -> exploded.
    const ANIMATION_DURATION = 1000;

    const stopAnimation = () => {
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(
                animationFrameRef.current
            );

            animationFrameRef.current = null;
        }

        lastTimestampRef.current = null;
    };

    const animate = (timestamp: number) => {
        const video = videoRef.current;

        if (
            !video ||
            !readyRef.current ||
            !Number.isFinite(video.duration)
        ) {
            stopAnimation();
            return;
        }

        if (lastTimestampRef.current === null) {
            lastTimestampRef.current = timestamp;
        }

        const delta =
            timestamp -
            lastTimestampRef.current;

        lastTimestampRef.current = timestamp;

        const direction =
            targetRef.current >
                progressRef.current
                ? 1
                : -1;

        const progressDelta =
            delta / ANIMATION_DURATION;

        progressRef.current +=
            progressDelta * direction;

        // Clamp
        progressRef.current = Math.max(
            0,
            Math.min(1, progressRef.current)
        );

        video.currentTime =
            progressRef.current *
            video.duration;

        // Target reached
        if (
            (direction === 1 &&
                progressRef.current >=
                targetRef.current) ||
            (direction === -1 &&
                progressRef.current <=
                targetRef.current)
        ) {
            progressRef.current =
                targetRef.current;

            video.currentTime =
                progressRef.current *
                video.duration;

            stopAnimation();
            return;
        }

        animationFrameRef.current =
            requestAnimationFrame(animate);
    };

    const animateTo = (target: number) => {
        const video = videoRef.current;

        if (
            !video ||
            !readyRef.current ||
            !Number.isFinite(video.duration)
        ) {
            return;
        }

        targetRef.current = target;

        stopAnimation();

        lastTimestampRef.current = null;

        animationFrameRef.current =
            requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => {
        animateTo(1);
    };

    const handleMouseLeave = () => {
        animateTo(0);
    };

    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        const handleLoadedMetadata = () => {
            if (
                !Number.isFinite(
                    video.duration
                )
            ) {
                return;
            }

            readyRef.current = true;

            progressRef.current = 0;
            targetRef.current = 0;

            video.currentTime = 0;
        };

        video.addEventListener(
            "loadedmetadata",
            handleLoadedMetadata
        );

        return () => {
            video.removeEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );

            stopAnimation();
        };
    }, [src]);

    return (
        <video
            ref={videoRef}
            className="project-card-exploded-video"
            src={src}
            poster={poster}
            muted
            playsInline
            preload="auto"
            aria-label={alt}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        />
    );
}