/**
 * 테마 관련 유틸리티 함수
 * 색상 밝기 판단 등 공통 테마 유틸
 */

/**
 * 주어진 hex 색상이 어두운지 판단
 * @param hex - '#RRGGBB' 또는 '#RGB' 형태의 hex 색상
 * @returns true이면 어두운 색상
 */
export function isColorDark(hex?: string): boolean {
    if (!hex) return false;
    let h = hex.replace('#', '');
    if (h.length === 3) {
        h = h.split('').map(c => c + c).join('');
    }
    if (h.length !== 6) return false;
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
}
