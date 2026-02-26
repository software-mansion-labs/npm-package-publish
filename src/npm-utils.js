const { execSync } = require('child_process');

function getPackageVersionByTag(packageName, tag) {
  const npmString =
    tag != null
      ? `npm view ${packageName}@${tag} version`
      : `npm view ${packageName} version`;

  try {
    const result = execSync(npmString, { stdio: ['ignore', 'pipe', 'pipe'], timeout: 60000 }).toString().trim();
    return result;
  } catch (error) {
    throw new Error(`Failed to get package version for ${packageName} by tag: ${tag}`, { cause: error });
  }
}

function getNextPatchVersion(packageName, major, minor) {
  const range = `${major}.${minor}.x`;

  let rawResult;
  try {
    rawResult = execSync(
      `npm view ${packageName}@"${range}" version --json`,
      { stdio: ['ignore', 'pipe', 'pipe'], timeout: 60000 }
    ).toString().trim();
  } catch {
    // No versions published yet for this major.minor range
    return 0;
  }

  const parsed = JSON.parse(rawResult);
  const versions = Array.isArray(parsed) ? parsed : [parsed];
  const patches = versions.map(v => {
    const patch = Number(v.split('.')[2]);
    if (Number.isNaN(patch)) {
      throw new Error(`Unexpected version format in npm output: ${v}`);
    }
    return patch;
  });
  return Math.max(...patches) + 1;
}

module.exports = {
  getPackageVersionByTag,
  getNextPatchVersion,
};
