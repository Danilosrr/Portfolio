import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three-stdlib";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type STLModelProps = {
    url: string;
};

function Model({ url }: STLModelProps) {
    const geometry = useLoader(STLLoader, url);

    return (
        <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#2563eb" roughness={0.4} metalness={0.2} />
        </mesh>
    );
}

export function STLViewer({ url }: { url: string }) {
    const controlsRef = useRef<OrbitControlsImpl>(null);

    const handleReset = () => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    };

    return (
        <div className="relative h-full w-full">
            <Canvas style={{ background: "#ffffff" }} camera={{ position: [0, 100, 200], fov: 85 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 10]} intensity={1} />
                <directionalLight position={[-10, 10, -10]} intensity={2} />
                <Suspense fallback={null}>
                    <Center>
                        <Model url={url} />
                    </Center>
                </Suspense>
                <OrbitControls
                    ref={controlsRef}
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={1}
                />
            </Canvas>

            {/* Bottom Right Re-center Button */}
            <button
                type="button"
                onClick={handleReset}
                className="absolute bottom-3 right-3 z-10 flex items-center justify-center rounded-md bg-white/90 p-2 text-xs font-medium text-gray-700 shadow-md transition-all hover:bg-[#2563eb] hover:text-white focus:outline-none"
                title="Re-center View"
                aria-label="Re-center model view"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M20.985 8.816a9.003 9.003 0 10-2.13 9.322l-1.5-1.5"
                    />
                </svg>
            </button>
        </div>
    );
}