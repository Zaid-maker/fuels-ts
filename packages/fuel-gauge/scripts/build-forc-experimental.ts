import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const FORC = '~/.fuelup/bin/forc'; // node doesn't find it in PATH and fails, thus we need to provide the full path

const rootDir = join(__dirname, '../../..');
const internalDir = join(rootDir, 'internal');

const versionFilePath = join(internalDir, 'forc', 'VERSION_EXPERIMENTAL');
const EXPECTED_FORC_VERSION = readFileSync(versionFilePath).toString();

const installedForcVersion = execSync(`${FORC} --version | sed "s/forc//"`, {
  env: process.env,
})
  .toString()
  .trim();

if (installedForcVersion !== EXPECTED_FORC_VERSION) {
  // eslint-disable-next-line no-console
  console.log(
    `Please install the correct version of forc. Installed version: ${installedForcVersion}, expected version: ${EXPECTED_FORC_VERSION}`
  );
  process.exit(1);
}

execSync(
  `${FORC} build -p test/fixtures/forc-projects-experimental --experimental-new-encoding --release`,
  { stdio: 'inherit' }
);
