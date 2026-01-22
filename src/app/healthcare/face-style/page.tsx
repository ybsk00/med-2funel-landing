"use client";

import { useRouter } from "next/navigation";
import FaceSimulationModal from "@/components/face-style/FaceSimulationModal";

export default function FaceStylePage() {
    const router = useRouter();

    return (
        <FaceSimulationModal
            isOpen={true}
            onClose={() => router.back()}
            isMobile={true}
        />
    );
}
