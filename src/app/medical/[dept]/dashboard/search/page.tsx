"use client";

import { useState } from "react";
import { Search, User, MessageSquare, Calendar, X, ChevronRight } from "lucide-react";

type Patient = {
    id: number;
    name: string;
    phone: string;
    lastVisit: string;
    totalVisits: number;
    condition: string;
};

// Mock Database for Search (since we don't have real data yet)
const MOCK_DB: Patient[] = [
    { id: 1, name: "김철수", phone: "010-1234-5678", lastVisit: "2025.12.01", totalVisits: 5, condition: "만성 피로" },
    { id: 2, name: "이영희", phone: "010-9876-5432", lastVisit: "2025.11.28", totalVisits: 3, condition: "소화 불량" },
    { id: 3, name: "박민수", phone: "010-5555-4444", lastVisit: "2025.12.05", totalVisits: 12, condition: "허리 통증" },
    { id: 4, name: "최지은", phone: "010-1111-2222", lastVisit: "2025.10.15", totalVisits: 1, condition: "불면증" },
    { id: 5, name: "정우성", phone: "010-3333-7777", lastVisit: "2025.12.08", totalVisits: 8, condition: "두통" },
];

export default function PatientSearchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const results = MOCK_DB.filter(p =>
            p.name.includes(searchTerm) || p.phone.includes(searchTerm)
        );
        setSearchResults(results);
    };

    const handlePatientClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setShowDetailModal(true);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">환자 검색</h1>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500" size={20} />
                <input
                    type="text"
                    placeholder="이름 또는 전화번호 뒷자리 검색"
                    className="w-full pl-12 pr-24 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-6 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-colors"
                >
                    검색
                </button>
            </form>

            {/* Search Results */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
                {searchResults.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">이름</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">전화번호</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">최근 방문일</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">총 내원 횟수</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">주요 증상</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {searchResults.map((patient) => (
                                <tr
                                    key={patient.id}
                                    onClick={() => handlePatientClick(patient)}
                                    className="hover:bg-teal-50 cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-4 font-bold text-gray-900">{patient.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                                    <td className="px-6 py-4 text-gray-600">{patient.lastVisit}</td>
                                    <td className="px-6 py-4 text-gray-600">{patient.totalVisits}회</td>
                                    <td className="px-6 py-4 text-teal-600 font-medium">{patient.condition}</td>
                                    <td className="px-6 py-4 text-right">
                                        <ChevronRight className="text-gray-300 group-hover:text-teal-500 inline-block" size={20} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                        <User size={48} className="mb-4 opacity-20" />
                        <p>검색 결과가 없습니다.</p>
                        <p className="text-sm mt-2">이름이나 전화번호로 검색해 보세요.</p>
                    </div>
                )}
            </div>

            {/* Patient Detail Modal */}
            {showDetailModal && selectedPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-teal-50/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-xl">
                                    {selectedPatient.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        {selectedPatient.name}
                                        <span className="text-sm font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                                            {selectedPatient.phone}
                                        </span>
                                    </h2>
                                    <p className="text-sm text-gray-500">최근 방문: {selectedPatient.lastVisit}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Content - Two Columns */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Left: Chat History */}
                            <div className="flex-1 border-r border-gray-100 flex flex-col bg-gray-50">
                                <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-2">
                                    <MessageSquare size={18} className="text-teal-600" />
                                    <h3 className="font-bold text-gray-800">채팅 상담 내역</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-teal-700">AI</div>
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-gray-700 text-sm">
                                            안녕하세요, {selectedPatient.name}님. 오늘은 어떤 점이 불편하신가요?
                                        </div>
                                    </div>
                                    <div className="flex gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-600">나</div>
                                        <div className="bg-teal-600 p-3 rounded-2xl rounded-tr-none shadow-sm text-white text-sm">
                                            {selectedPatient.condition} 때문에 너무 힘들어요. 잠도 잘 안 오고요.
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-teal-700">AI</div>
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-gray-700 text-sm">
                                            저런, 많이 힘드셨겠어요. 증상이 언제부터 시작되었나요?
                                        </div>
                                    </div>
                                    <div className="text-center text-xs text-gray-400 my-4">- 2025년 12월 01일 상담 -</div>
                                </div>
                            </div>

                            {/* Right: Appointment History */}
                            <div className="flex-1 flex flex-col bg-white">
                                <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                                    <Calendar size={18} className="text-teal-600" />
                                    <h3 className="font-bold text-gray-800">진료 예약 내역</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50/30 transition-colors">
                                                <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-gray-100 rounded-lg text-gray-600">
                                                    <span className="text-xs font-bold">12월</span>
                                                    <span className="text-xl font-bold">{8 - i * 7}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-gray-900">정기 진료</span>
                                                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">완료</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">담당의: 김원장 | 진료실 1</p>
                                                    <p className="text-sm text-gray-500 mt-1">처방: 침치료, 보험한약</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
