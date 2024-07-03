import path from "path";

const processCwd = process.cwd();
const absPath = path.resolve("./");
const absPath2 = path.join(process.cwd(), "pre-scripts");

console.log({ __dirname, __filename, absPath, processCwd, absPath2 });

export const ROUTE = processCwd + "/src/routes/script-gen";
export const PRE_SCRIPTS = path.join(process.cwd(), "pre-scripts");
