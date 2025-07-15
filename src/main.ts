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
    const bins: string[] = [];

    let parser = createParser(content);

    while (hasMoreLines(parser)) {
        parser = advanceParser(parser);

        const bin = processLine(parser.instruction);

        console.log(`${bin} : ${parser.instruction}`);
        bins.push(bin);
    }

    await writeFile(
        fileName.replace('.asm', '.hack'),
        bins.join('\n')
    );
};

main().catch(error => console.error('Error occurred:', error));