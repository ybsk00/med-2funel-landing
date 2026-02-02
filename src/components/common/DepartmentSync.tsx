"use client";

import { useEffect } from "react";
import { DepartmentId } from "@/lib/config/departments";

export default function DepartmentSync({ deptId }: { deptId: DepartmentId }) {
    useEffect(() => {
        // Set cookie that lasts for 7 days
        document.cookie = `active_dept=${deptId}; path=/; max-age=${7 * 24 * 60 * 60}`;
    }, [deptId]);

    return null;
}
