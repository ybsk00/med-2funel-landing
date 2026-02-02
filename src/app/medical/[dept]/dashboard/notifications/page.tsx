"use client";

import { Bell } from "lucide-react";

export default function NotificationsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center space-y-6">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center">
                <Bell className="text-teal-600" size={48} />
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">알림 및 리마인드</h1>
                <p className="text-gray-500 max-w-md mx-auto">
                    앱 푸시 및 카카오톡 전송 기능은 추후 업데이트될 예정입니다.<br />
                    이벤트 및 할인 행사 안내 시 활용됩니다.
                </p>
            </div>
        </div>
    );
}
