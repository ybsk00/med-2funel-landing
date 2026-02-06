-- Seed 100 sample records for patients
-- Departments: dermatology, plastic-surgery, internal-medicine, orthopedics, dentistry, pediatrics, urology, obgyn, korean-medicine, oncology, neurosurgery

DO $$
DECLARE
    dept_list TEXT[] := ARRAY['dermatology', 'plastic-surgery', 'internal-medicine', 'orthopedics', 'dentistry', 'pediatrics', 'urology', 'obgyn', 'korean-medicine', 'oncology', 'neurosurgery'];
    names TEXT[] := ARRAY['김철수', '이영희', '박지성', '최민수', '정소민', '강하늘', '윤도현', '한지민', '송중기', '배수지', '유재석', '조세호', '이나영', '원빈', '현빈', '손예진', '박서준', '김고은', '공유', '이정재'];
    types TEXT[] := ARRAY['초진', '재진', '온라인'];
    complaints TEXT[] := ARRAY['여드름이 심해요', '눈매교정 상담 원함', '감기 기운이 있어요', '허리가 아파요', '치아 미백 문의', '우리 아이 성장이 걱정돼요', '전립선 건강 상담', '정기 여성 검진', '기력이 없어요', '수술 후 회복 상담', '두통이 심합니다'];
    i INTEGER;
    current_dept TEXT;
    current_name TEXT;
    current_type TEXT;
    current_complaint TEXT;
    random_days INTEGER;
    scheduled_date TIMESTAMP;
BEGIN
    FOR i IN 1..100 LOOP
        current_dept := dept_list[floor(random() * array_length(dept_list, 1) + 1)];
        current_name := names[floor(random() * array_length(names, 1) + 1)];
        current_type := types[floor(random() * array_length(types, 1) + 1)];
        current_complaint := complaints[floor(random() * array_length(complaints, 1) + 1)]; -- Simplified mapping
        
        -- Random date within next 30 days or past 30 days
        random_days := floor(random() * 60 - 30);
        scheduled_date := CURRENT_TIMESTAMP + (random_days * interval '1 day') + (floor(random() * 24) * interval '1 hour');

        -- Insert into patients
        INSERT INTO patients (name, type, complaint, status, department, time, created_at)
        VALUES (
            current_name,
            current_type,
            current_complaint,
            CASE WHEN random_days < 0 THEN 'completed' ELSE 'pending' END,
            current_dept,
            to_char(scheduled_date, 'YYYY-MM-DD HH24:MI'),
            CURRENT_TIMESTAMP
        );
    END LOOP;
END $$;
