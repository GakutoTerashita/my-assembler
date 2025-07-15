import { advanceParser, comp, createParser, dest, hasMoreLines, instructionType, jump, Parser, symbol } from "./parser";

describe('Parser', () => {

    describe('createParser', () => {

        it('createParser initializes with lines from content', () => {
            const content = "Line 1\nLine 2";
            const parser = createParser(content);
            expect(parser.lines).toEqual(["Line 1", "Line 2"]);
        });

        it('createParser initializes with currentIndex 0', () => {
            const content = "Line 1\nLine 2";
            const parser = createParser(content);
            expect(parser.index).toBe(0);
        });

    });

    describe('hasMoreLines', () => {

        it('returns true when there are more lines', () => {
            const parser: Parser = {
                lines: ["Line 1", "Line 2"],
                index: 0,
                instruction: "## START OF THE FILE ##",
            }
            expect(hasMoreLines(parser)).toBe(true);
        });

        it('returns false when no more lines', () => {
            const parser: Parser = {
                lines: ["Line 1", "Line 2"],
                index: 2,
                instruction: "## START OF THE FILE ##",
            }
            expect(hasMoreLines(parser)).toBe(false);
        });

    });

    describe('advanceParser', () => {

        it('increments the index and sets the instruction', () => {
            const initialParser: Parser = {
                lines: ["Line 1", "Line 2"],
                index: 0,
                instruction: "## START OF THE FILE ##"
            };
            const nextParser = advanceParser(initialParser);
            expect(nextParser.index).toBe(1);
            expect(nextParser.instruction).toBe("Line 1");
        });

        it('throws an error if there are no more lines', () => {
            const parser = {
                lines: ["Line 1"],
                index: 1,
                instruction: "Line 1"
            };
            expect(() => advanceParser(parser)).toThrow("No more lines to advance.");
        });

    });

    describe('instructionType', () => {

        it('returns A_INSTRUCTION for A instructions', () => {
            expect(instructionType('@123')).toBe('A_INSTRUCTION');
        });

        it('returns L_INSTRUCTION for L instructions', () => {
            expect(instructionType('(LOOP)')).toBe('L_INSTRUCTION');
        });

        it('returns C_INSTRUCTION for C instructions', () => {
            expect(instructionType('D=M')).toBe('C_INSTRUCTION');
            expect(instructionType('D;JGT')).toBe('C_INSTRUCTION');
            expect(instructionType('0')).toBe('C_INSTRUCTION');
        });

    });

    describe('symbol', () => {

        it('extracts symbol from A instruction', () => {
            expect(symbol('@123', 'A_INSTRUCTION')).toBe('123');
        });

        it('extracts symbol from L instruction', () => {
            expect(symbol('(LOOP)', 'L_INSTRUCTION')).toBe('LOOP');
        });

        it('throws an error for C instruction', () => {
            expect(() => symbol('D=M', 'C_INSTRUCTION')).toThrow("Symbol cannot be extracted from C instruction: D=M");
        });

    });

    describe('dest', () => {

        it('extracts dest from C instruction', () => {
            expect(dest('D=M')).toBe('D');
        });

        it('returns null if no dest is present', () => {
            expect(dest('=M')).toBe(null);
        });

        it('no equal sign means no dest (returns null)', () => {
            expect(dest('M')).toBe(null);
        })
    });

    describe('comp', () => {
        it('extracts comp from C instruction', () => {
            expect(comp('D=M')).toBe('M');
        });

        it('extracts comp from C instruction without dest', () => {
            expect(comp('M')).toBe('M');
        });

        it('extracts comp from C instruction without jump', () => {
            expect(comp('D;JGT')).toBe('D');
        });

        it('comp part is necessary', () => {
            expect(() => comp(''))
                .toThrow("Comp part not found in instruction: ");
            expect(() => comp('A='))
                .toThrow("Comp part not found in instruction: A=");
            expect(() => comp(';JGT'))
                .toThrow("Comp part not found in instruction: ;JGT");
        });
    });

    describe('jump', () => {
        it('extracts jump from C instruction', () => {
            expect(jump('D;JGT')).toBe('JGT');
        });

        it('returns null if no jump is present', () => {
            expect(jump('D=M')).toBe(null);
        });

        it('no semicolon means no jump (returns null)', () => {
            expect(jump('M')).toBe(null);
        });
    });

});