import { breakLines } from "./text";

type Parser = {
    lines: string[];
    hasMoreLines: () => boolean;
};

export const createParser = (text: string): Parser => {
    const lines = breakLines(text);

    return {
        lines,
        hasMoreLines: () => lines.length > 0
    };
};