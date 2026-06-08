import fs from "fs";



async function getRecursivePath(path) {
    const dir = await fs.readdirSync(path);
    const paths = [];

    for (const d of dir) {
        const nPath = `${path}/${d}`;
        const stat = await fs.statSync(nPath);
        if (stat.isDirectory()) {
            paths.push(...(await getRecursivePath(nPath)));
        } else {
            paths.push(nPath);
        }
    }
    return paths;
}

console.log(await getRecursivePath('./assets/img'));