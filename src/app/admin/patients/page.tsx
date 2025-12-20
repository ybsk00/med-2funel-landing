'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Title,
    Paper,
    Table,
    Badge,
    Button,
    Group,
    Text,
    Loader,
    Center,
    Modal,
    TextInput,
    Select,
    Stack,
    Checkbox,
    Divider,
    Card,
    Alert,
    ThemeIcon,
    ActionIcon,
    Pagination,
} from '@mantine/core';
import { useDisclosure, useDebouncedValue } from '@mantine/hooks';
import { UserPlus, Calendar, Pill, Stethoscope, ClipboardCheck, CheckCircle, AlertCircle, Trash2, Search, Filter } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Message template types (inline for now, can be moved to shared lib later)
type MessageRuleType = 'appointment_reminder' | 'medication_refill' | 'follow_up_needed' | 'regular_checkup';

interface MessageRule {
    type: MessageRuleType;
    enabled: boolean;
}

interface MessageTemplate {
    type: MessageRuleType;
    name: string;
    description: string;
}

const MESSAGE_TEMPLATES: MessageTemplate[] = [
    { type: 'appointment_reminder', name: '예약 리마인더', description: '예약 1일 전 알림' },
    { type: 'medication_refill', name: '복약 리마인더', description: '복약 시간 알림' },
    { type: 'follow_up_needed', name: '재방문 알림', description: '재진 권유 알림' },
    { type: 'regular_checkup', name: '정기검진 알림', description: '정기 검진 안내' },
];

const DEFAULT_MESSAGE_RULES: MessageRule[] = [
    { type: 'appointment_reminder', enabled: true },
    { type: 'medication_refill', enabled: true },
    { type: 'follow_up_needed', enabled: false },
    { type: 'regular_checkup', enabled: false },
];

interface Patient {
    id: string;
    name: string;
    phone: string | null;
    birth_date: string | null;
    gender: string | null;
    lifecycle_stage: string;
    created_at: string;
}

// Badge 색상 매핑
const lifecycleColors: Record<string, string> = {
    lead: 'gray',
    new: 'blue',
    returning: 'green',
    vip: 'violet',
};

const lifecycleLabels: Record<string, string> = {
    lead: '리드',
    new: '신규',
    returning: '재방문',
    vip: 'VIP',
};

// 페이지당 항목 수
const ITEMS_PER_PAGE = 10;

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    // 검색 및 필터 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch] = useDebouncedValue(searchQuery, 300);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);

    // 환자 등록 모달
    const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
    const [addLoading, setAddLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 환자 상세보기 모달
    const [detailModalOpened, { open: openDetailModal, close: closeDetailModal }] = useDisclosure(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // 환자 등록 폼 데이터
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        birthDate: '',
        gender: null as string | null,
        lifecycleStage: 'new' as string | null,
    });

    // 메세지 규칙 설정
    const [messageRules, setMessageRules] = useState<MessageRule[]>(DEFAULT_MESSAGE_RULES);

    useEffect(() => {
        fetchPatients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 검색/필터 변경 시 첫 페이지로 이동
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter]);

    // 필터링된 환자 목록
    const filteredPatients = useMemo(() => {
        let result = patients;

        // 검색어 필터
        if (debouncedSearch.trim()) {
            const query = debouncedSearch.toLowerCase().trim();
            result = result.filter(patient =>
                patient.name.toLowerCase().includes(query) ||
                (patient.phone && patient.phone.includes(query))
            );
        }

        // 상태 필터
        if (statusFilter) {
            result = result.filter(patient => patient.lifecycle_stage === statusFilter);
        }

        return result;
    }, [patients, debouncedSearch, statusFilter]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
    const paginatedPatients = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPatients.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredPatients, currentPage]);

    async function fetchPatients() {
        const { data } = await supabase
            .from('patients')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setPatients(data);
        }
        setLoading(false);
    }

    // 메세지 규칙 아이콘
    function getRuleIcon(type: MessageRuleType) {
        switch (type) {
            case 'appointment_reminder':
                return <Calendar size={16} />;
            case 'medication_refill':
                return <Pill size={16} />;
            case 'follow_up_needed':
                return <Stethoscope size={16} />;
            case 'regular_checkup':
                return <ClipboardCheck size={16} />;
            default:
                return null;
        }
    }

    // 규칙 토글
    function toggleRule(type: MessageRuleType) {
        setMessageRules(prev => prev.map(rule =>
            rule.type === type
                ? { ...rule, enabled: !rule.enabled }
                : rule
        ));
    }

    // 폼 리셋
    function resetForm() {
        setFormData({
            name: '',
            phone: '',
            birthDate: '',
            gender: null,
            lifecycleStage: 'new',
        });
        setMessageRules(DEFAULT_MESSAGE_RULES);
        setError(null);
    }

    // 환자 등록 처리
    async function handleAddPatient() {
        if (!formData.name.trim()) {
            setError('이름은 필수 입력 항목입니다.');
            return;
        }

        setAddLoading(true);
        setError(null);

        try {
            // 전화번호 정규화
            const phoneNormalized = formData.phone ? formData.phone.replace(/-/g, '') : null;

            const { data, error: insertError } = await supabase
                .from('patients')
                .insert({
                    name: formData.name.trim(),
                    phone: formData.phone || null,
                    phone_normalized: phoneNormalized,
                    birth_date: formData.birthDate || null,
                    gender: formData.gender,
                    lifecycle_stage: formData.lifecycleStage || 'new',
                })
                .select()
                .single();

            if (insertError) {
                throw insertError;
            }

            // 메세지 규칙 저장 (추후 API 연동)
            console.log('등록된 환자 메세지 규칙:', {
                patientId: data.id,
                rules: messageRules.filter(r => r.enabled),
            });

            setSuccess(`${formData.name}님이 환자로 등록되었습니다.`);
            closeAddModal();
            resetForm();
            fetchPatients();
        } catch (err: unknown) {
            console.error('Patient registration error:', err);
            const errorMessage = err instanceof Error ? err.message : '환자 등록에 실패했습니다.';
            setError(errorMessage);
        } finally {
            setAddLoading(false);
        }
    }

    async function handleDeletePatient(id: string, name: string) {
        if (!confirm(`${name} 환자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('patients')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setSuccess(`${name} 환자가 삭제되었습니다.`);
            fetchPatients();
        } catch (err) {
            console.error('Error deleting patient:', err);
            setError('환자 삭제 중 오류가 발생했습니다.');
        }
    }

    if (loading) {
        return (
            <Center h={300}>
                <Loader color="blue" />
            </Center>
        );
    }

    return (
        <Container size="lg" py="lg">
            {success && (
                <Alert color="green" icon={<CheckCircle size={16} />} mb="md" withCloseButton onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            <Group justify="space-between" mb="lg">
                <Title order={2} c="white">환자 관리</Title>
                <Button leftSection={<UserPlus size={16} />} onClick={openAddModal}>
                    환자 등록
                </Button>
            </Group>

            {/* 검색 및 필터 영역 */}
            <Paper shadow="sm" radius="md" p="md" mb="md" bg="dark.7" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)' }}>
                <Group>
                    <TextInput
                        placeholder="이름 또는 연락처로 검색..."
                        leftSection={<Search size={16} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.currentTarget.value)}
                        style={{ flex: 1, maxWidth: 300 }}
                    />
                    <Select
                        placeholder="상태 필터"
                        leftSection={<Filter size={16} />}
                        clearable
                        data={[
                            { value: 'lead', label: '리드' },
                            { value: 'new', label: '신규' },
                            { value: 'returning', label: '재방문' },
                            { value: 'vip', label: 'VIP' },
                        ]}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: 150 }}
                    />
                    <Text size="sm" c="dimmed">
                        총 {filteredPatients.length}명
                    </Text>
                </Group>
            </Paper>

            <Paper shadow="sm" radius="md" bg="dark.7" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)', overflow: 'hidden' }}>
                <Table highlightOnHover highlightOnHoverColor="dark.6">
                    <Table.Thead bg="dark.8">
                        <Table.Tr>
                            <Table.Th c="dimmed">이름</Table.Th>
                            <Table.Th c="dimmed">연락처</Table.Th>
                            <Table.Th c="dimmed">상태</Table.Th>
                            <Table.Th c="dimmed">등록일</Table.Th>
                            <Table.Th c="dimmed">관리</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginatedPatients.map((patient) => (
                            <Table.Tr key={patient.id}>
                                <Table.Td>
                                    <Text size="sm" fw={500} c="white">{patient.name}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" c="gray.4">{patient.phone || '-'}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Badge color={lifecycleColors[patient.lifecycle_stage] || 'gray'}>
                                        {lifecycleLabels[patient.lifecycle_stage] || patient.lifecycle_stage}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" c="gray.5">
                                        {new Date(patient.created_at).toLocaleDateString('ko-KR')}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Button variant="light" size="xs" onClick={() => {
                                        setSelectedPatient(patient);
                                        openDetailModal();
                                    }}>
                                        상세보기
                                    </Button>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        size="sm"
                                        ml="xs"
                                        onClick={() => handleDeletePatient(patient.id, patient.name)}
                                    >
                                        <Trash2 size={16} />
                                    </ActionIcon>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                        {paginatedPatients.length === 0 && (
                            <Table.Tr>
                                <Table.Td colSpan={5}>
                                    <Text ta="center" c="dimmed" py="lg">
                                        {debouncedSearch || statusFilter ? '검색 결과가 없습니다.' : '등록된 환자가 없습니다.'}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <Group justify="center" py="md" bg="dark.8">
                        <Pagination
                            total={totalPages}
                            value={currentPage}
                            onChange={setCurrentPage}
                            size="sm"
                        />
                    </Group>
                )}
            </Paper>

            {/* 환자 등록 모달 */}
            <Modal
                opened={addModalOpened}
                onClose={() => {
                    closeAddModal();
                    resetForm();
                }}
                title="환자 등록"
                centered
                size="lg"
                styles={{
                    header: { backgroundColor: 'var(--mantine-color-dark-7)' },
                    content: { backgroundColor: 'var(--mantine-color-dark-7)' },
                    title: { color: 'white' }
                }}
            >
                <Stack gap="md">
                    {error && (
                        <Alert color="red" icon={<AlertCircle size={16} />} withCloseButton onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {/* 기본 정보 섹션 */}
                    <Text fw={500} c="white">기본 정보</Text>
                    <Group grow>
                        <TextInput
                            label="이름"
                            placeholder="환자 이름"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <TextInput
                            label="연락처"
                            placeholder="010-0000-0000"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                    </Group>
                    <Group grow>
                        <TextInput
                            label="생년월일"
                            placeholder="YYYY-MM-DD 또는 YYYYMMDD"
                            value={formData.birthDate}
                            onChange={(e) => {
                                let value = e.target.value.replace(/[^0-9-]/g, '');
                                // Auto-format: 19991111 -> 1999-11-11
                                if (value.length === 8 && !value.includes('-')) {
                                    value = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
                                }
                                setFormData(prev => ({ ...prev, birthDate: value }));
                            }}
                        />
                        <Select
                            label="성별"
                            placeholder="선택"
                            data={[
                                { value: 'male', label: '남성' },
                                { value: 'female', label: '여성' },
                            ]}
                            value={formData.gender}
                            onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                        />
                    </Group>
                    <Select
                        label="환자 상태"
                        data={[
                            { value: 'lead', label: '리드' },
                            { value: 'new', label: '신규' },
                            { value: 'returning', label: '재방문' },
                            { value: 'vip', label: 'VIP' },
                        ]}
                        value={formData.lifecycleStage}
                        onChange={(value) => setFormData(prev => ({ ...prev, lifecycleStage: value }))}
                    />

                    <Divider my="sm" />

                    {/* 메세지 규칙 섹션 */}
                    <Text fw={500} c="white">메세지 규칙 설정</Text>
                    <Text size="sm" c="gray.5">이 환자에게 적용할 자동 메세지 규칙을 선택하세요.</Text>

                    <Card withBorder radius="md" p="md" bg="dark.8" style={{ borderColor: 'var(--mantine-color-dark-5)' }}>
                        <Stack gap="sm">
                            {MESSAGE_TEMPLATES.map((template) => {
                                const rule = messageRules.find(r => r.type === template.type);
                                if (!rule) return null;

                                return (
                                    <Group key={template.type} justify="space-between">
                                        <Group gap="sm">
                                            <ThemeIcon
                                                size="sm"
                                                radius="sm"
                                                variant="light"
                                                color={rule.enabled ? 'blue' : 'gray'}
                                            >
                                                {getRuleIcon(template.type)}
                                            </ThemeIcon>
                                            <div>
                                                <Text size="sm" c="white">{template.name}</Text>
                                                <Text size="xs" c="gray.5">{template.description}</Text>
                                            </div>
                                        </Group>
                                        <Checkbox
                                            checked={rule.enabled}
                                            onChange={() => toggleRule(template.type)}
                                        />
                                    </Group>
                                );
                            })}
                        </Stack>
                    </Card>

                    <Alert color="blue" mt="sm">
                        <Text size="xs">
                            메세지 발송은 API 연동 후 활성화됩니다. 규칙 설정은 저장됩니다.
                        </Text>
                    </Alert>

                    <Group justify="flex-end" mt="md">
                        <Button variant="light" onClick={() => {
                            closeAddModal();
                            resetForm();
                        }}>
                            취소
                        </Button>
                        <Button onClick={handleAddPatient} loading={addLoading}>
                            환자 등록
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* 환자 상세보기 모달 */}
            <Modal
                opened={detailModalOpened}
                onClose={closeDetailModal}
                title={`${selectedPatient?.name || ''} 환자 정보`}
                centered
                size="md"
                styles={{
                    header: { backgroundColor: 'var(--mantine-color-dark-7)' },
                    content: { backgroundColor: 'var(--mantine-color-dark-7)' },
                    title: { color: 'white' }
                }}
            >
                {selectedPatient && (
                    <Stack gap="md">
                        <Paper p="md" bg="dark.8" radius="md">
                            <Stack gap="sm">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">이름</Text>
                                    <Text fw={500} c="white">{selectedPatient.name}</Text>
                                </Group>
                                <Divider />
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">연락처</Text>
                                    <Text c="white">{selectedPatient.phone || '-'}</Text>
                                </Group>
                                <Divider />
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">생년월일</Text>
                                    <Text c="white">{selectedPatient.birth_date || '-'}</Text>
                                </Group>
                                <Divider />
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">성별</Text>
                                    <Text c="white">
                                        {selectedPatient.gender === 'male' ? '남성' :
                                            selectedPatient.gender === 'female' ? '여성' : '-'}
                                    </Text>
                                </Group>
                                <Divider />
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">상태</Text>
                                    <Badge color={lifecycleColors[selectedPatient.lifecycle_stage] || 'gray'}>
                                        {lifecycleLabels[selectedPatient.lifecycle_stage] || selectedPatient.lifecycle_stage}
                                    </Badge>
                                </Group>
                                <Divider />
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">등록일</Text>
                                    <Text c="white">{new Date(selectedPatient.created_at).toLocaleDateString('ko-KR')}</Text>
                                </Group>
                            </Stack>
                        </Paper>
                        <Group justify="flex-end">
                            <Button variant="light" onClick={closeDetailModal}>닫기</Button>
                        </Group>
                    </Stack>
                )}
            </Modal>
        </Container >
    );
}

