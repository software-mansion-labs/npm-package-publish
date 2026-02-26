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

module.exports = {
  getPackageVersionByTag,
};
