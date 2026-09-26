import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import { forceCollide, forceX, forceY, forceZ } from "d3-force-3d";

import { skills, skillLinks } from "../data/skills";

type SkillDomain =
    | "mechanical"
    | "simulation"
    | "cad"
    | "software"
    | "embedded"
    | "automotive";

type SkillType = "domain" | "skill";

type SkillNode = {
    id: string;
    label: string;
    domain: SkillDomain;
    type: SkillType;
    level: "familiar" | "intermediate" | "advanced" | "expert";
    proficiency: number;
    __highlighted?: boolean;
    __threeObj?: THREE.Object3D;

    x?: number;
    y?: number;
    z?: number;
    vx?: number;
    vy?: number;
    vz?: number;
    fx?: number | null;
    fy?: number | null;
    fz?: number | null;
};

type SkillLink = {
    source: string | SkillNode;
    target: string | SkillNode;
    strength?: number;
    __highlighted?: boolean;
};

const DOMAIN_COLORS: Record<SkillDomain, string> = {
    mechanical: "#f97316",
    simulation: "#a855f7",
    cad: "#06b6d4",
    software: "#3b82f6",
    embedded: "#22c55e",
    automotive: "#ef4444",
};

const DOMAIN_LABELS: Record<SkillDomain, string> = {
    mechanical: "Mechanical",
    simulation: "Simulation",
    cad: "CAD",
    software: "Software",
    embedded: "Embedded",
    automotive: "Automotive",
};

/*
 * The renderer stays transparent so the graph sits on top of the
 * portfolio background (light/dark) instead of adding its own.
 */
const GRAPH_BACKGROUND = "rgba(0,0,0,0)";

/* Link colours carry their own alpha (3d-force-graph multiplies
 * linkOpacity by the colour's alpha). linkOpacity is therefore 1. */
const LINK_COLOR = "rgba(115,115,115,0.28)";
const LINK_COLOR_ACTIVE = "rgba(37,99,235,0.9)";
const LINK_COLOR_DIM = "rgba(115,115,115,0.06)";

const DIM_FACTOR = 0.15;

/* Loosely typed: the library's accessor generics fight custom node types. */
type ForceGraphInstance = any;

/*
 * Node sizes. Domains are clearly larger than skills.
 */
function getNodeRadius(node: SkillNode, isMobile: boolean) {
    if (node.type === "domain") {
        return isMobile ? 9 : 12;
    }

    const min = isMobile ? 1.6 : 2.2;
    const max = isMobile ? 4.5 : 6;

    return min + (node.proficiency / 100) * (max - min);
}

/*
 * Remember each material's base opacity so highlighting can dim and
 * restore it without guessing the original value.
 */
function tagMaterial<T extends THREE.Material>(material: T): T {
    material.userData.baseOpacity = material.opacity;
    return material;
}

function createNodeObject(
    node: SkillNode,
    isMobile: boolean,
    labelColor: string,
) {
    const group = new THREE.Group();
    const radius = getNodeRadius(node, isMobile);
    const color = new THREE.Color(DOMAIN_COLORS[node.domain]);
    const isDomain = node.type === "domain";

    /* Outer glow. */
    const glow = new THREE.Mesh(
        new THREE.SphereGeometry(radius * (isDomain ? 1.55 : 1.35), 16, 16),
        tagMaterial(
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: isDomain ? 0.08 : 0.045,
                depthWrite: false,
            }),
        ),
    );
    group.add(glow);

    /* Main sphere. */
    const segments = isDomain ? 24 : 18;

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        tagMaterial(
            new THREE.MeshStandardMaterial({
                color,
                roughness: 0.5,
                metalness: isDomain ? 0.15 : 0.05,
                transparent: true,
                opacity: isDomain ? 0.98 : 0.9,
            }),
        ),
    );
    group.add(sphere);

    /* White centre on domain nodes. */
    if (isDomain) {
        const center = new THREE.Mesh(
            new THREE.SphereGeometry(radius * 0.36, 16, 16),
            tagMaterial(
                new THREE.MeshBasicMaterial({
                    color: "#ffffff",
                    transparent: true,
                    opacity: 0.92,
                }),
            ),
        );
        group.add(center);
    }

    /* Label. */
    const showLabel = isDomain || !isMobile || node.proficiency >= 80;

    if (showLabel) {
        const label = createTextSprite(
            node.label,
            isDomain ? 12 : 9,
            labelColor,
        );

        /* Place the label to the right of the node, using its real width. */
        const labelWidth = label.scale.x;
        label.position.set(radius + labelWidth / 2 + 2, 0, 0);

        group.add(label);
    }

    return group;
}

/*
 * Canvas-backed sprite label.
 *
 * `worldHeight` is the text height in scene units, so labels stay
 * legible at the camera distances used below.
 */
function createTextSprite(
    text: string,
    worldHeight: number,
    color: string,
) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        return new THREE.Sprite();
    }

    const pxFont = 48;
    const padding = 8;
    const font = `600 ${pxFont}px Inter, Arial, sans-serif`;

    context.font = font;
    const textWidth = context.measureText(text).width;

    canvas.width = Math.ceil(textWidth + padding * 2);
    canvas.height = Math.ceil(pxFont * 1.5);

    /* Resizing a canvas resets its state. */
    context.font = font;
    context.fillStyle = color;
    context.textBaseline = "middle";
    context.fillText(text, padding, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const sprite = new THREE.Sprite(
        tagMaterial(
            new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                depthWrite: false,
                depthTest: false,
            }),
        ),
    );

    const k = worldHeight / pxFont;

    sprite.scale.set(canvas.width * k, canvas.height * k, 1);
    sprite.renderOrder = 10;

    /* Labels must not steal hover/click from nodes behind them. */
    sprite.raycast = () => { };

    return sprite;
}

function getNodeId(node: SkillNode | string) {
    return typeof node === "string" ? node : node.id;
}

/*
 * Dispose every geometry / material / texture in a scene, then the
 * renderer, so WebGL contexts are actually released.
 */
function disposeGraph(forceGraph: ForceGraphInstance) {
    try {
        forceGraph.pauseAnimation();
    } catch {
        /* already paused */
    }

    try {
        forceGraph.scene().traverse((object: THREE.Object3D) => {
            const mesh = object as THREE.Mesh;

            mesh.geometry?.dispose?.();

            const materials = Array.isArray(mesh.material)
                ? mesh.material
                : mesh.material
                    ? [mesh.material]
                    : [];

            materials.forEach((material: any) => {
                material.map?.dispose?.();
                material.dispose?.();
            });
        });
    } catch {
        /* ignore */
    }

    try {
        forceGraph._destructor?.();
    } catch {
        /* ignore */
    }

    try {
        const renderer = forceGraph.renderer();
        renderer.dispose();
        renderer.forceContextLoss();
    } catch {
        /* ignore */
    }
}

function Skills() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<ForceGraphInstance>(null);

    const [size, setSize] = useState<{
        width: number;
        height: number;
    } | null>(null);

    /* Latest size, readable inside the create effect without re-running it. */
    const sizeRef = useRef(size);
    sizeRef.current = size;

    const [themeVersion, setThemeVersion] = useState(0);

    const [activeSkill, setActiveSkill] = useState<string | null>(null);
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    const hasSize = size !== null;
    const isMobile = size ? size.width < 640 : false;

    /*
     * The force engine mutates node/link objects, so keep our own copies.
     * Positions survive graph rebuilds because the same objects are reused.
     */
    const graph = useMemo(() => {
        const nodes: SkillNode[] = skills.map((skill) => ({ ...skill }));
        const links: SkillLink[] = skillLinks.map((link) => ({ ...link }));

        return { nodes, links };
    }, []);

    /*
     * Measure the container. No graph is created until we have a real size.
     */
    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;

            if (width === 0) {
                return;
            }

            setSize({
                width: Math.round(width),
                height: Math.round(Math.max(height, 500)),
            });
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    /*
     * Follow the portfolio theme (class or data-theme on <html>).
     */
    useEffect(() => {
        const observer = new MutationObserver(() =>
            setThemeVersion((version) => version + 1),
        );

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "data-theme", "style"],
        });

        return () => observer.disconnect();
    }, []);

    /*
     * Create / destroy the WebGL graph.
     *
     * Only re-runs when the graph is first sized or when the
     * mobile/desktop breakpoint flips. Ordinary resizes are handled below.
     */
    useEffect(() => {
        const container = containerRef.current;
        const initialSize = sizeRef.current;

        if (!container || !initialSize) {
            return;
        }

        const graphElement = document.createElement("div");
        graphElement.className = "skills-force-graph absolute inset-0";
        container.appendChild(graphElement);

        const nodeById = new Map<string, SkillNode>(
            graph.nodes.map((node) => [node.id, node]),
        );

        const resolve = (value: SkillNode | string) =>
            typeof value === "string"
                ? nodeById.get(value)
                : (value as SkillNode);

        const getLabelColor = () => getComputedStyle(container).color;

        const nodeFactory = (node: SkillNode) =>
            createNodeObject(node, isMobile, getLabelColor());

        /* Orbit controls are an init option, not a method. */
        const forceGraph: ForceGraphInstance = new (ForceGraph3D as any)(
            graphElement,
            { controlType: "orbit" },
        );

        graphRef.current = forceGraph;

        forceGraph
            .graphData({ nodes: graph.nodes, links: graph.links })
            .backgroundColor(GRAPH_BACKGROUND)
            .width(initialSize.width)
            .height(initialSize.height)
            .numDimensions(3)

            /* Custom node objects replace the default spheres. */
            .nodeThreeObject(nodeFactory)
            .nodeThreeObjectExtend(false)
            .nodeLabel(() => "")

            /* Links: alpha lives in the colour, so highlighting works. */
            .linkOpacity(1)
            .linkResolution(4)
            .linkColor((link: SkillLink) =>
                focus.active
                    ? link.__highlighted
                        ? LINK_COLOR_ACTIVE
                        : LINK_COLOR_DIM
                    : LINK_COLOR,
            )
            .linkWidth((link: SkillLink) => {
                const base =
                    (link.strength ?? 1) === 3
                        ? 1.8
                        : (link.strength ?? 1) === 2
                            ? 1.2
                            : 0.7;

                return focus.active && link.__highlighted ? base + 0.8 : base;
            })

            .onNodeHover((node: SkillNode | null) => {
                setHoveredSkill(node?.id ?? null);
            })
            .onNodeClick((node: SkillNode) => {
                setActiveSkill((current) =>
                    current === node.id ? null : node.id,
                );
            })
            .onBackgroundClick(() => setActiveSkill(null));

        /* Shared flag read by the link accessors above. */
        const focus = { active: false };
        (forceGraph as any).__focus = focus;

        /* ---------------- Forces ---------------- */

        forceGraph.d3Force("charge")
            ?.strength((node: SkillNode) =>
                node.type === "domain"
                    ? isMobile
                        ? -300
                        : -650
                    : isMobile
                        ? -110
                        : -190,
            )
            .distanceMax(isMobile ? 450 : 750);

        /* Link distance was never set: the default (30) is too short for these node sizes. */
        forceGraph.d3Force("link")
            ?.distance((link: SkillLink) => {
                const source = resolve(link.source);
                const target = resolve(link.target);

                const touchesDomain =
                    source?.type === "domain" || target?.type === "domain";

                const base = touchesDomain ? 60 : 45;
                const strength = link.strength ?? 1;

                return base * (strength === 3 ? 0.8 : strength === 2 ? 1 : 1.25);
            })
            .strength((link: SkillLink) => 0.15 + (link.strength ?? 1) * 0.08);

        /* "collide" does not exist by default, so it has to be added. */
        forceGraph.d3Force(
            "collide",
            forceCollide(
                (node: SkillNode) =>
                    getNodeRadius(node, isMobile) +
                    (node.type === "domain" ? 12 : 6),
            ).strength(0.85),
        );

        /* Weak gravity keeps disconnected clusters from drifting away. */
        const gravity = isMobile ? 0.035 : 0.022;
        forceGraph.d3Force("x", forceX(0).strength(gravity));
        forceGraph.d3Force("y", forceY(0).strength(gravity));
        forceGraph.d3Force("z", forceZ(0).strength(gravity));

        /* ---------------- Simulation ---------------- */

        forceGraph
            .warmupTicks(isMobile ? 60 : 100)
            .cooldownTicks(160)
            .cooldownTime(12000);

        /* Camera: start somewhere sensible, then fit once the layout settles. */
        forceGraph.cameraPosition(
            { x: 0, y: 0, z: isMobile ? 420 : 560 },
            { x: 0, y: 0, z: 0 },
            0,
        );

        let fitted = false;
        forceGraph.onEngineStop(() => { if (fitted) { return; } fitted = true; forceGraph.zoomToFit(800, isMobile ? 20 : 60); });

        /* Orbit controls: smoother and no scene rolling. */
        const controls = forceGraph.controls();

        if (controls) {
            controls.enableDamping = true;
            controls.dampingFactor = 0.04;
            controls.minDistance = 120;
            controls.maxDistance = 1400;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.2;
        }

        /*
         * 3d-force-graph already provides ambient + directional lights,
         * pixel ratio and a transparent clear colour: adding more
         * lights here only over-exposes the spheres.
         */
        forceGraph.scene().background = null;

        /* Rebuild labels once the web font is ready. */
        document.fonts?.ready.then(() => {
            if (graphRef.current === forceGraph) {
                forceGraph.nodeThreeObject(nodeFactory);
            }
        });

        /* Pause rendering while the section is off-screen. */
        const visibility = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                forceGraph.resumeAnimation();
            } else {
                forceGraph.pauseAnimation();
            }
        });

        visibility.observe(container);

        return () => {
            visibility.disconnect();

            if (graphRef.current === forceGraph) {
                graphRef.current = null;
            }

            disposeGraph(forceGraph);
            graphElement.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasSize, isMobile, graph]);

    /*
     * Plain resize: just resize the canvas, do not rebuild the graph.
     */
    useEffect(() => {
        if (!size || !graphRef.current) {
            return;
        }

        graphRef.current.width(size.width).height(size.height);
    }, [size]);

    /*
     * Theme change: regenerate node objects so labels use the new text colour.
     */
    useEffect(() => {
        const forceGraph = graphRef.current;
        const container = containerRef.current;

        if (!forceGraph || !container || themeVersion === 0) {
            return;
        }

        const color = getComputedStyle(container).color;

        forceGraph.nodeThreeObject((node: SkillNode) =>
            createNodeObject(node, isMobile, color),
        );
    }, [themeVersion, isMobile]);

    /*
     * Highlight: hover wins, otherwise the selected skill stays highlighted
     * (this is what makes taps work on mobile).
     */
    useEffect(() => {
        applyHighlight(graphRef.current, hoveredSkill ?? activeSkill);
    }, [hoveredSkill, activeSkill, hasSize, isMobile]);

    const selectedSkill = skills.find((skill) => skill.id === activeSkill);
    const hovered = skills.find((skill) => skill.id === hoveredSkill);

    return (
        <section
            ref={sectionRef}
            id="skills"
            className="
                relative z-10
                flex h-[100svh] min-h-[100svh]
                items-start
                px-6 pt-[calc(1.5rem+env(safe-area-inset-top,0px))] pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]
                sm:px-10 sm:py-20
                lg:px-20
                overflow-hidden
            "
        >
            <div
                className="
                    mx-auto
                    flex h-full w-full
                    max-w-[1600px]
                    flex-col
                "
            >
                {/* Header */}
                <div
                    className="
                        z-20
                        max-w-2xl
                        px-6 py-5
                    "
                >
                    <p
                        className="
                            mb-6
                            text-xl font-medium
                            tracking-tight
                            text-[#2563EB]
                            sm:text-2xl
                            w-fit
                            bg-[#F5F5F2]
                            rounded-full
                            shadow-[0px_0px_30px_30px_#F5F5F2]
                        "
                    >
                        Skills
                    </p>
                </div>

                {/* Graph */}
                <div
                    ref={containerRef}
                    className="absolute inset-0 z-0 overflow-hidden"
                >
                    {/* Selected skill */}
                    {selectedSkill && (
                        <div
                            className="
                                absolute
                                bottom-20
                                left-1/2
                                z-30
                                w-[calc(100%-2rem)]
                                max-w-sm
                                -translate-x-1/2
                                rounded-xl
                                border
                                border-[#d9d9d4]
                                bg-background/60
                                p-4
                                shadow-xl
                                backdrop-blur-xl
                        
                                sm:left-auto
                                sm:right-4
                                sm:translate-x-0
                            "
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5"
                                            style={{
                                                backgroundColor:
                                                    DOMAIN_COLORS[
                                                    selectedSkill.domain
                                                    ],
                                            }}
                                        />

                                        <span
                                            className="
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wider
                                                text-muted-foreground
                                            "
                                        >
                                            {DOMAIN_LABELS[selectedSkill.domain]}
                                        </span>
                                    </div>

                                    <h3 className="mt-1 text-lg font-semibold">
                                        {selectedSkill.label}
                                    </h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setActiveSkill(null)}
                                    className="
                                        rounded-lg
                                        p-1
                                        text-muted-foreground
                                        transition
                                        hover:bg-muted
                                        hover:text-foreground
                                    "
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="mt-4">
                                <div
                                    className="
                                        mb-1.5
                                        flex
                                        items-center
                                        justify-between
                                        text-xs
                                    "
                                >
                                    <span className="capitalize text-muted-foreground">
                                        {selectedSkill.level}
                                    </span>

                                    <span className="font-medium">
                                        {selectedSkill.proficiency}
                                    </span>
                                </div>

                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${selectedSkill.proficiency}%`,
                                            backgroundColor:
                                                DOMAIN_COLORS[
                                                selectedSkill.domain
                                                ],
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hover tooltip */}
                    {hovered && !selectedSkill && (
                        <div
                            className="
                                pointer-events-none
                                absolute
                                right-4
                                top-4
                                z-20
                                hidden
                                rounded-lg
                                border
                                border-border/50
                                bg-white/60
                                px-3 py-2
                                text-xs
                                shadow-lg
                                backdrop-blur-md
                                sm:block
                            "
                        >
                            <span className="font-medium">{hovered.label}</span>

                            <span className="ml-2 text-muted-foreground">
                                {hovered.level}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

/*
 * Highlight a node and its first-degree neighbours.
 *
 * - Nodes use custom Three.js objects, so nodeOpacity() has no effect.
 *   Instead we scale each material's stored base opacity directly.
 * - Links are styled through linkColor/linkWidth accessors (which read
 *   `link.__highlighted`); re-setting them makes the library rebuild links.
 */
function applyHighlight(graph: ForceGraphInstance, nodeId: string | null) {
    if (!graph) {
        return;
    }

    const data = graph.graphData();
    const nodes = data.nodes as SkillNode[];
    const links = data.links as SkillLink[];
    const focus = graph.__focus as { active: boolean } | undefined;

    const related = new Set<string>();

    if (nodeId) {
        related.add(nodeId);

        links.forEach((link) => {
            const source = getNodeId(link.source);
            const target = getNodeId(link.target);

            if (source === nodeId) {
                related.add(target);
            }

            if (target === nodeId) {
                related.add(source);
            }
        });
    }

    if (focus) {
        focus.active = nodeId !== null;
    }

    nodes.forEach((node) => {
        node.__highlighted = nodeId ? related.has(node.id) : false;

        const object = node.__threeObj;

        if (!object) {
            return;
        }

        const factor = !nodeId || node.__highlighted ? 1 : DIM_FACTOR;

        object.traverse((child) => {
            const material = (child as THREE.Mesh).material as
                | THREE.Material
                | undefined;

            if (material && material.userData.baseOpacity !== undefined) {
                material.opacity = material.userData.baseOpacity * factor;
            }
        });
    });

    links.forEach((link) => {
        link.__highlighted =
            !!nodeId &&
            (getNodeId(link.source) === nodeId ||
                getNodeId(link.target) === nodeId);
    });

    /* Re-setting the accessors makes the library refresh the links. */
    graph.linkColor(graph.linkColor()).linkWidth(graph.linkWidth());
}

export default Skills;