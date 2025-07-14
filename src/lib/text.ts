export const breakLines = (text: string): string[] => {
    return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
};
