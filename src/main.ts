import { readFile } from "node:fs/promises";
import {
    advanceParser,
    comp,
    createParser,
    dest,
    hasMoreLines,
    instructionType,
    symbol
} from "./lib/parser";

const main = async (): Promise<void> => {
    const fileName: string = process.argv[2];

    if (!fileName) {
        console.error('No files provided.');
        process.exit(1);
    }

    const content = await readFile(fileName, 'utf8');
    console.log(`Content of ${fileName}:\n${content}`);

    let parser = createParser(content);

    while (hasMoreLines(parser)) {

        parser = advanceParser(parser);

        console.log(`Current instruction: ${parser.instruction}`);
        const type = instructionType(parser.instruction);
        console.log(`Instruction type: ${type}`);

        if (type === 'A_INSTRUCTION' || type === 'L_INSTRUCTION') {
            const sym = symbol(parser.instruction, type);
            console.log(`Symbol: ${sym}`);

            continue;
        }

        if (type === 'C_INSTRUCTION') {
            const destPart = dest(parser.instruction);
            const compPart = comp(parser.instruction);
            console.log(`Dest: ${destPart}, Comp: ${compPart}`);

            continue;
        }
    }
};

main().catch(error => console.error('Error occurred:', error));