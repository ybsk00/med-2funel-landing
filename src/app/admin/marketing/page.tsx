'use client';

import { useState, useEffect } from 'react';
import {
    Title,
    Text,
    Group,
    Stack,
    Paper,
    Card,
    SimpleGrid,
    Tabs,
    Button,
    TextInput,
    Select,
    Table,
    Badge,
    ThemeIcon,
    Divider,
    Box,
    CopyButton,
    ActionIcon,
    Tooltip,
    Loader,
    SegmentedControl
} from '@mantine/core';
import {
    TrendingUp,
    Users,
    Calendar,
    Target,
    LineChart,
    List,
    Link as LinkIcon,
    Copy,
    Check,
    ExternalLink,
    ArrowRight
} from 'lucide-react';

// Types
interface SummaryData {
    period: { from: string; to: string };
    metrics: {
        uniqueVisitors: number;
        f1Views: number;
        f2Enters: number;
        reservations: number;
        directLogins: number;
        chatLogins: number;
    };
    rates: {
        f1ToF2: number;
        f2ToReservation: number;
        f1ToReservation: number;
        directLoginRate: number;
        chatLoginRate: number;
    };
    avgConversionTimeSeconds: number | null;
    topSources: { name: string; count: number }[];
    topCampaigns: { name: string; count: number }[];
}

interface DailyData {
    date: string;
    f1_view: number;
    f2_enter: number;
    reservation_created: number;
    f1ToF2Rate: number;
    f2ToReservationRate: number;
}

interface ConversionData {
    id: string;
    created_at: string;
    reservation_id: string;
    last_touch: Record<string, string | null>;
    first_touch: Record<string, string | null> | null;
    path_summary: string;
    conversion_time_formatted: string | null;
}

export default function MarketingDashboard() {
    const [activeTab, setActiveTab] = useState<string | null>('kpi');
    const [dateRange, setDateRange] = useState('7d');
    const [loading, setLoading] = useState(true);

    // Data states
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [dailyData, setDailyData] = useState<DailyData[]>([]);
    const [conversions, setConversions] = useState<ConversionData[]>([]);

    // UTM Generator state
    const [utmChannel, setUtmChannel] = useState<string | null>('meta');
    const [utmLandingUrl, setUtmLandingUrl] = useState('https://');
    const [utmCampaign, setUtmCampaign] = useState('');
    const [utmContent, setUtmContent] = useState('');
    const [utmSub1, setUtmSub1] = useState('');
    const [utmSub2, setUtmSub2] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState('');

    // Calculate date range
    const getDateRange = () => {
        const to = new Date();
        const from = new Date();

        switch (dateRange) {
            case 'today':
                break;
            case '7d':
                from.setDate(from.getDate() - 7);
                break;
            case '30d':
                from.setDate(from.getDate() - 30);
                break;
            default:
                from.setDate(from.getDate() - 7);
        }

        return {
            from: from.toISOString().split('T')[0],
            to: to.toISOString().split('T')[0]
        };
    };

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { from, to } = getDateRange();

            try {
                // KPI Summary
                const summaryRes = await fetch(`/api/admin/marketing/summary?from=${from}&to=${to}`);
                if (summaryRes.ok) {
                    setSummaryData(await summaryRes.json());
                }

                // Daily data
                const dailyRes = await fetch(`/api/admin/marketing/daily?from=${from}&to=${to}`);
                if (dailyRes.ok) {
                    const daily = await dailyRes.json();
                    setDailyData(daily.data || []);
                }

                // Conversions
                const convRes = await fetch('/api/admin/marketing/conversions?limit=20');
                if (convRes.ok) {
                    const conv = await convRes.json();
                    setConversions(conv.data || []);
                }
            } catch (error) {
                console.error('Error fetching marketing data:', error);
            }

            setLoading(false);
        };

        fetchData();
    }, [dateRange]);

    // Generate UTM URL
    const generateUtmUrl = async () => {
        if (!utmLandingUrl || !utmCampaign) return;

        try {
            const res = await fetch('/api/admin/marketing/utm-links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channel: utmChannel,
                    landing_url: utmLandingUrl,
                    campaign_name: utmCampaign,
                    content: utmContent,
                    sub1: utmSub1,
                    sub2: utmSub2
                })
            });

            if (res.ok) {
                const data = await res.json();
                setGeneratedUrl(data.final_url);
            }
        } catch (error) {
            console.error('Error generating UTM:', error);
        }
    };

    // Format duration
    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '-';
        if (seconds < 60) return `${seconds}초`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}분`;
        return `${Math.floor(seconds / 3600)}시간 ${Math.floor((seconds % 3600) / 60)}분`;
    };

    return (
        <Stack gap="lg">
            {/* Header */}
            <Group justify="space-between" align="flex-end">
                <div>
                    <Title order={2} c="white" ff="heading">마케팅 트래킹</Title>
                    <Text c="dimmed" size="sm">퍼널 분석 및 UTM 관리</Text>
                </div>
                <SegmentedControl
                    value={dateRange}
                    onChange={setDateRange}
                    data={[
                        { label: '오늘', value: 'today' },
                        { label: '7일', value: '7d' },
                        { label: '30일', value: '30d' }
                    ]}
                    color="orange"
                />
            </Group>

            {/* Tabs */}
            <Tabs value={activeTab} onChange={setActiveTab} color="orange">
                <Tabs.List>
                    <Tabs.Tab value="kpi" leftSection={<Target size={16} />}>KPI 요약</Tabs.Tab>
                    <Tabs.Tab value="daily" leftSection={<LineChart size={16} />}>일간 추이</Tabs.Tab>
                    <Tabs.Tab value="conversions" leftSection={<List size={16} />}>전환 상세</Tabs.Tab>
                    <Tabs.Tab value="utm" leftSection={<LinkIcon size={16} />}>UTM 생성기</Tabs.Tab>
                </Tabs.List>

                {/* KPI Summary Tab */}
                <Tabs.Panel value="kpi" pt="md">
                    {loading ? (
                        <Group justify="center" py="xl"><Loader /></Group>
                    ) : summaryData && (
                        <Stack gap="lg">
                            {/* Metric Cards */}
                            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                                <Card radius="lg" p="lg" bg="dark.7" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)' }}>
                                    <Group justify="space-between">
                                        <div>
                                            <Text size="xs" c="dimmed" tt="uppercase">방문자</Text>
                                            <Title order={2} c="white">{summaryData.metrics.uniqueVisitors}</Title>
                                        </div>
                                        <ThemeIcon size={40} radius="md" variant="light" color="blue">
                                            <Users size={20} />
                                        </ThemeIcon>
                                    </Group>
                                </Card>
                                <Card radius="lg" p="lg" bg="dark.7" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)' }}>
                                    <Group justify="space-between">
                                        <div>
                                            <Text size="xs" c="dimmed" tt="uppercase">F2 진입</Text>
                                            <Title order={2} c="white">{summaryData.metrics.f2Enters}</Title>
                                        </div>
                                        <ThemeIcon size={40} radius="md" variant="light" color="teal">
                                            <ArrowRight size={20} />
                                        </ThemeIcon>
                                    </Group>
                                </Card>
                                <Card radius="lg" p="lg" bg="dark.7" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)' }}>
                                    <Group justify="space-between">
                                        <div>
                                            <Text size="xs" c="dimmed" tt="uppercase">예약</Text>
                                            <Title order={2} c="white">{summaryData.metrics.reservations}</Title>
                                        </div>
                                        <ThemeIcon size={40} radius="md" variant="light" color="orange">
                                            <Calendar size={20} />
                                        </ThemeIcon>
                                    </Group>
                                </Card>
                                <Card radius="lg" p="lg" bg="dark.7" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)' }}>
                                    <Group justify="space-between">
                                        <div>
                                            <Text size="xs" c="dimmed" tt="uppercase">평균 전환시간</Text>
                                            <Title order={3} c="white">{formatDuration(summaryData.avgConversionTimeSeconds)}</Title>
                                        </div>
                                        <ThemeIcon size={40} radius="md" variant="light" color="grape">
                                            <TrendingUp size={20} />
                                        </ThemeIcon>
                                    </Group>
                                </Card>
                            </SimpleGrid>

                            {/* Conversion Rates */}
                            <Paper p="lg" radius="lg" bg="dark.7" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)' }}>
                                <Text fw={600} c="white" mb="md">전환율</Text>
                                <SimpleGrid cols={{ base: 2, sm: 5 }} spacing="md">
                                    <div>
                                        <Text size="xs" c="dimmed">F1 → F2</Text>
                                        <Text size="xl" fw={700} c="blue">{summaryData.rates.f1ToF2}%</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" c="dimmed">F2 → 예약</Text>
                                        <Text size="xl" fw={700} c="teal">{summaryData.rates.f2ToReservation}%</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" c="dimmed">F1 → 예약</Text>
                                        <Text size="xl" fw={700} c="orange">{summaryData.rates.f1ToReservation}%</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" c="dimmed">직접 로그인</Text>
                                        <Text size="xl" fw={700} c="pink">{summaryData.rates.directLoginRate}%</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" c="dimmed">챗 경유 로그인</Text>
                                        <Text size="xl" fw={700} c="violet">{summaryData.rates.chatLoginRate}%</Text>
                                    </div>
                                </SimpleGrid>
                            </Paper>

                            {/* Top Sources */}
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                <Paper p="lg" radius="lg" bg="dark.7" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)' }}>
                                    <Text fw={600} c="white" mb="md">Top 소스</Text>
                                    {summaryData.topSources.length > 0 ? (
                                        <Stack gap="xs">
                                            {summaryData.topSources.map((s, i) => (
                                                <Group key={i} justify="space-between">
                                                    <Text c="gray.4">{s.name}</Text>
                                                    <Badge color="blue" variant="light">{s.count}</Badge>
                                                </Group>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Text c="dimmed" size="sm">데이터 없음</Text>
                                    )}
                                </Paper>
                                <Paper p="lg" radius="lg" bg="dark.7" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)' }}>
                                    <Text fw={600} c="white" mb="md">Top 캠페인</Text>
                                    {summaryData.topCampaigns.length > 0 ? (
                                        <Stack gap="xs">
                                            {summaryData.topCampaigns.map((c, i) => (
                                                <Group key={i} justify="space-between">
                                                    <Text c="gray.4" style={{ maxWidth: 180 }} lineClamp={1}>{c.name}</Text>
                                                    <Badge color="teal" variant="light">{c.count}</Badge>
                                                </Group>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Text c="dimmed" size="sm">데이터 없음</Text>
                                    )}
                                </Paper>
                            </SimpleGrid>
                        </Stack>
                    )}
                </Tabs.Panel>

                {/* Daily Tab */}
                <Tabs.Panel value="daily" pt="md">
                    <Paper radius="lg" bg="dark.7" withBorder style={{ overflow: 'hidden', borderColor: 'var(--mantine-color-dark-5)' }}>
                        <Table verticalSpacing="sm" highlightOnHover highlightOnHoverColor="dark.6">
                            <Table.Thead bg="dark.8">
                                <Table.Tr>
                                    <Table.Th c="dimmed">날짜</Table.Th>
                                    <Table.Th c="dimmed">F1 방문</Table.Th>
                                    <Table.Th c="dimmed">F2 진입</Table.Th>
                                    <Table.Th c="dimmed">예약</Table.Th>
                                    <Table.Th c="dimmed">F1→F2</Table.Th>
                                    <Table.Th c="dimmed">F2→예약</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {dailyData.length > 0 ? dailyData.map((day) => (
                                    <Table.Tr key={day.date}>
                                        <Table.Td><Text c="white" fw={500}>{day.date}</Text></Table.Td>
                                        <Table.Td><Text c="gray.4">{day.f1_view}</Text></Table.Td>
                                        <Table.Td><Text c="gray.4">{day.f2_enter}</Text></Table.Td>
                                        <Table.Td><Text c="gray.4">{day.reservation_created}</Text></Table.Td>
                                        <Table.Td><Badge color="blue" variant="light">{day.f1ToF2Rate}%</Badge></Table.Td>
                                        <Table.Td><Badge color="teal" variant="light">{day.f2ToReservationRate}%</Badge></Table.Td>
                                    </Table.Tr>
                                )) : (
                                    <Table.Tr>
                                        <Table.Td colSpan={6}>
                                            <Text c="dimmed" ta="center" py="xl">데이터가 없습니다</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Paper>
                </Tabs.Panel>

                {/* Conversions Tab */}
                <Tabs.Panel value="conversions" pt="md">
                    <Paper radius="lg" bg="dark.7" withBorder style={{ overflow: 'hidden', borderColor: 'var(--mantine-color-dark-5)' }}>
                        <Table verticalSpacing="sm" highlightOnHover highlightOnHoverColor="dark.6">
                            <Table.Thead bg="dark.8">
                                <Table.Tr>
                                    <Table.Th c="dimmed">시간</Table.Th>
                                    <Table.Th c="dimmed">예약 ID</Table.Th>
                                    <Table.Th c="dimmed">Last Touch</Table.Th>
                                    <Table.Th c="dimmed">경로</Table.Th>
                                    <Table.Th c="dimmed">전환시간</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {conversions.length > 0 ? conversions.map((conv) => (
                                    <Table.Tr key={conv.id}>
                                        <Table.Td>
                                            <Text c="gray.4" size="sm">
                                                {new Date(conv.created_at).toLocaleString('ko-KR')}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text c="white" ff="monospace" size="sm">{conv.reservation_id.slice(0, 8)}...</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Stack gap={2}>
                                                {conv.last_touch?.utm_source && (
                                                    <Badge size="xs" color="blue" variant="light">{conv.last_touch.utm_source}</Badge>
                                                )}
                                                {conv.last_touch?.utm_campaign && (
                                                    <Text c="dimmed" size="xs" lineClamp={1}>{conv.last_touch.utm_campaign}</Text>
                                                )}
                                            </Stack>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text c="gray.4" size="xs" lineClamp={1}>{conv.path_summary || '-'}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text c="gray.4" size="sm">{conv.conversion_time_formatted || '-'}</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )) : (
                                    <Table.Tr>
                                        <Table.Td colSpan={5}>
                                            <Text c="dimmed" ta="center" py="xl">전환 데이터가 없습니다</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Paper>
                </Tabs.Panel>

                {/* UTM Generator Tab */}
                <Tabs.Panel value="utm" pt="md">
                    <Paper p="lg" radius="lg" bg="dark.7" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)' }}>
                        <Text fw={600} c="white" mb="lg">UTM 링크 생성기</Text>

                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <Select
                                label="채널"
                                value={utmChannel}
                                onChange={setUtmChannel}
                                data={[
                                    { value: 'meta', label: 'Meta (Facebook/Instagram)' },
                                    { value: 'google', label: 'Google Ads' },
                                    { value: 'naver', label: 'Naver 광고' },
                                    { value: 'blog', label: '블로그/콘텐츠' },
                                    { value: 'other', label: '기타' }
                                ]}
                                styles={{ input: { backgroundColor: 'var(--mantine-color-dark-6)', color: 'white' } }}
                            />
                            <TextInput
                                label="랜딩 URL"
                                value={utmLandingUrl}
                                onChange={(e) => setUtmLandingUrl(e.currentTarget.value)}
                                placeholder="https://example.com"
                                styles={{ input: { backgroundColor: 'var(--mantine-color-dark-6)', color: 'white' } }}
                            />
                            <TextInput
                                label="캠페인명 (필수)"
                                value={utmCampaign}
                                onChange={(e) => setUtmCampaign(e.currentTarget.value)}
                                placeholder="campaign_name"
                                styles={{ input: { backgroundColor: 'var(--mantine-color-dark-6)', color: 'white' } }}
                            />
                            <TextInput
                                label="Content (선택)"
                                value={utmContent}
                                onChange={(e) => setUtmContent(e.currentTarget.value)}
                                placeholder="auto 생성가능"
                                styles={{ input: { backgroundColor: 'var(--mantine-color-dark-6)', color: 'white' } }}
                            />
                            <TextInput
                                label="Sub1 (기타1)"
                                value={utmSub1}
                                onChange={(e) => setUtmSub1(e.currentTarget.value)}
                                placeholder="선택"
                                styles={{ input: { backgroundColor: 'var(--mantine-color-dark-6)', color: 'white' } }}
                            />
                            <TextInput
                                label="Sub2 (기타2)"
                                value={utmSub2}
                                onChange={(e) => setUtmSub2(e.currentTarget.value)}
                                placeholder="선택"
                                styles={{ input: { backgroundColor: 'var(--mantine-color-dark-6)', color: 'white' } }}
                            />
                        </SimpleGrid>

                        <Group mt="lg">
                            <Button
                                color="orange"
                                onClick={generateUtmUrl}
                                disabled={!utmLandingUrl || !utmCampaign}
                            >
                                URL 생성
                            </Button>
                        </Group>

                        {generatedUrl && (
                            <Paper p="md" mt="lg" radius="md" bg="dark.8" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)' }}>
                                <Group justify="space-between" align="flex-start">
                                    <Text c="gray.4" size="sm" style={{ wordBreak: 'break-all', flex: 1 }}>
                                        {generatedUrl}
                                    </Text>
                                    <CopyButton value={generatedUrl}>
                                        {({ copied, copy }) => (
                                            <Tooltip label={copied ? '복사됨!' : '복사'}>
                                                <ActionIcon color={copied ? 'teal' : 'gray'} variant="light" onClick={copy}>
                                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </CopyButton>
                                </Group>
                            </Paper>
                        )}
                    </Paper>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}
