"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientHeader() {
    const [userName, setUserName] = useState("환자님");
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.full_name) {
                setUserName(user.user_metadata.full_name);
            } else if (user?.email) {
                setUserName(user.email.split("@")[0]);
            }
        };
        getUser();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-600 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">L</span>
                </div>
                <span className="text-lg font-bold text-gray-900">죽전한의원 AI</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                    <span className="text-sm font-bold text-green-700">{userName}님</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-900"
                >
                    로그아웃
                </button>
                <div className="w-8 h-8 rounded-full bg-orange-200 overflow-hidden border border-orange-300">
                    {/* Profile Image Placeholder */}
                    <User className="w-full h-full p-1 text-orange-500" />
                </div>
            </div>
        </header>
    );
}
