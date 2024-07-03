/** @param {Map<string,string>} scriptsMap*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addScripts = (scriptsMap) => {
  const propertyOrder = [
    "name",
    "version",
    "description",
    "author",
    "license",
    "keywords",
    "main",
    "scripts",
    "dependencies",
    "devDependencies",
  ];

  const packageJsonPath = "./package.json";

  // @ts-expect-error Will not be run
  // eslint-disable-next-line no-undef
  const packageJson = JSON.parse(readFile(packageJsonPath));

  scriptsMap.forEach((v, k) => {
    packageJson.scripts[k] = v;
  });

  const orderedPackageJson = {};

  propertyOrder.forEach((property) => {
    // eslint-disable-next-line no-prototype-builtins
    if (packageJson.hasOwnProperty(property)) {
      orderedPackageJson[property] = packageJson[property];
    }
  });

  // @ts-expect-error Will not be run
  // Write the modified package.json back to file
  // eslint-disable-next-line no-undef
  writeFile(packageJsonPath, JSON.stringify(orderedPackageJson, null, 2));
};
