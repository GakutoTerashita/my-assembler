import { readFile, writeFile } from "node:fs/promises";
import {
    advanceParser,
    createParser,
    hasMoreLines,
} from "./lib/parser";
import { processLine } from "./lib/assembler";

const main = async (): Promise<void> => {
    const fileName: string = process.argv[2];

    if (!fileName) {
        console.error('No files provided.');
        process.exit(1);
    }

    if (!fileName.endsWith('.asm')) {
        console.error('File must have .asm extension.');
        process.exit(1);
    }

    const content = await readFile(fileName, 'utf8');

    const collectBins = (
        parser: ReturnType<typeof createParser>,
        bins: string[] = []
    ): string[] => {

        if (!hasMoreLines(parser)) return bins;
        const nextParser = advanceParser(parser);
        const bin = processLine(nextParser.instruction);
        console.log(`${bin} : ${nextParser.instruction}`);
        return collectBins(nextParser, [...bins, bin]);
    };

    const parser0 = createParser(content);
    const bins = collectBins(parser0);

    await writeFile(
        fileName.replace('.asm', '.hack'),
        bins.join('\n')
    );
};

main().catch(error => console.error('Error occurred:', error));