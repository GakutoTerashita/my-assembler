import { advanceParser, comp, createParser, dest, hasMoreLines, instructionType, jump, Parser, symbol } from "./parser";

describe('Parser', () => {

    describe('createParser', () => {

        it('createParser initializes with lines from content', () => {
            const content = "Line 1\nLine 2";
            const parser = createParser(content);
            expect(parser.lines).toEqual(["Line 1", "Line 2"]);
        });

    });

    describe('hasMoreLines', () => {

        it('returns true when there are more lines', () => {
            const parser: Parser = {
                lines: ["Line 1", "Line 2"],
                instruction: "## START OF THE FILE ##",
            }
            expect(hasMoreLines(parser)).toBe(true);
        });

        it('returns false when no more lines', () => {
            const parser: Parser = {
                lines: [],
                instruction: "## START OF THE FILE ##",
            }
            expect(hasMoreLines(parser)).toBe(false);
        });

    });

    describe('advanceParser', () => {

        it('consumes the line and sets the instruction', () => {
            const initialParser: Parser = {
                lines: ["Line 1", "Line 2"],
                instruction: "## START OF THE FILE ##"
            };
            const nextParser = advanceParser(initialParser);
            expect(nextParser.instruction).toBe("Line 1");
            expect(nextParser.lines).toEqual(["Line 2"]);
        });

        it('ignores comments and empty lines', () => {
            const initialParser: Parser = {
                lines: [
                    "",
                    `// Comment`,
                    "Line 1",
                    "Line 2"
                ],
                instruction: "## START OF THE FILE ##"
            };
            const nextParser = advanceParser(initialParser);
            expect(nextParser.instruction).toBe("Line 1");
            expect(nextParser.lines).toEqual(["Line 2"]);
        });

        it('throws an error if final line is empty line', () => {
            const parser: Parser = {
                lines: [
                    ""
                ],
                instruction: "Line 1"
            };
            expect(() => advanceParser(parser))
                .toThrow("Final line cannot be an empty line.");
        });

        it('throws an error if final line is a comment', () => {
            const parser: Parser = {
                lines: [
                    "// Comment"
                ],
                instruction: "Line 1"
            };
            expect(() => advanceParser(parser))
                .toThrow("Final line cannot be a comment.");
        });

        it('throws an error if there are no more lines', () => {
            const parser: Parser = {
                lines: [],
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

        it('returns empty string if no dest is present', () => {
            expect(dest('=M')).toBe('');
        });

        it('no equal sign means no dest (returns empty string)', () => {
            expect(dest('M')).toBe('');
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

        it('returns empty string if no jump is present', () => {
            expect(jump('D=M')).toBe('');
        });

        it('no semicolon means no jump (returns empty string)', () => {
            expect(jump('M')).toBe('');
        });
    });

});