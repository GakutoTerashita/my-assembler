import fs from 'fs';

const main = async (): Promise<void> => {
    const fileNames: string[] = process.argv.slice(2);

    if (fileNames.length === 0) {
        console.error('No files provided.');
        process.exit(1);
    }

    for (const fileName of fileNames) {
        try {
            const content = await fs.promises.readFile(fileName, 'utf-8');
            console.log(`Content of ${fileName}:\n${content}`);
        } catch (error) {
            console.error(`Error reading file ${fileName}:`, error);
        }
    }
};

main().catch(error => console.error('An unexpected error occurred:', error));