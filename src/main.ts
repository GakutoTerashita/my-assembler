import { readFile, writeFile } from "node:fs/promises";
import { assemble } from "./lib/assembler";

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

    const asm = await readFile(fileName, 'utf8');

    const bins = assemble(asm);

    await writeFile(
        fileName.replace('.asm', '.hack'),
        bins.join('\n')
    );
};

main().catch(error => console.error('Error occurred:', error));