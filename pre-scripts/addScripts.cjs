/** @param {Map<string,string>} scriptsMap*/
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
  const packageJson = JSON.parse(readFile(packageJsonPath));

  scriptsMap.forEach((v, k) => {
    packageJson.scripts[k] = v;
  });

  const orderedPackageJson = {};

  propertyOrder.forEach((property) => {
    if (packageJson.hasOwnProperty(property)) {
      orderedPackageJson[property] = packageJson[property];
    }
  });

  // @ts-expect-error Will not be run
  // Write the modified package.json back to file
  writeFile(packageJsonPath, JSON.stringify(orderedPackageJson, null, 2));
};
