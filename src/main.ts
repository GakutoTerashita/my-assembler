import { readFile } from "node:fs/promises";

const main = async (): Promise<void> => {
    const fileName: string = process.argv[2];

    if (!fileName) {
        console.error('No files provided.');
        process.exit(1);
    }

    const content = await readFile(fileName, 'utf8');
    console.log(`Content of ${fileName}:\n${content}`);
};

main().catch(error => console.error('Error occurred:', error));