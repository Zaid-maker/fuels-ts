import { FuelError } from '@fuel-ts/errors';
import { getSystemForc, getSystemFuelCore } from '@fuel-ts/versions/cli';

const defaultBinaryPaths = {
  forcPath: 'forc',
  fuelCorePath: 'fuel-core',
} as const;

/**
 * Tries to find the binaries in the system, otherwise throws an error.
 *
 * @param paths - paths to the binaries (optional)
 * @returns - paths to the resolved binaries
 */
export const tryFindBinaries = (paths: { forcPath?: string; fuelCorePath?: string } = {}) => {
  const { forcPath, fuelCorePath } = {
    forcPath: paths.forcPath ?? defaultBinaryPaths.forcPath,
    fuelCorePath: paths.fuelCorePath ?? defaultBinaryPaths.fuelCorePath,
  };

  // Ensure we can get the binary versions
  const { error: forcError } = getSystemForc(forcPath);
  const { error: fuelCoreError } = getSystemFuelCore(fuelCorePath);
  if (forcError || fuelCoreError) {
    const errors = [
      forcError ? `Binary for 'forc' not found at path '${forcPath}'` : undefined,
      fuelCoreError ? `Binary for 'fuel-core' not found at path '${fuelCorePath}'` : undefined,
    ];
    throw new FuelError(FuelError.CODES.BIN_FILE_NOT_FOUND, errors.filter(Boolean).join('\n'));
  }

  return {
    forcPath,
    fuelCorePath,
  };
};
