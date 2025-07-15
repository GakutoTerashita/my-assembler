export const dest = (dest: string): string => {
    const c0 = dest.includes('A')
        ? '1'
        : '0';
    const c1 = dest.includes('D')
        ? '1'
        : '0';
    const c2 = dest.includes('M')
        ? '1'
        : '0';

    return `${c0}${c1}${c2}`;
}