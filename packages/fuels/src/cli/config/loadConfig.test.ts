import { safeExec } from '@fuel-ts/errors/test-utils';
import { readFileSync } from 'fs';

import {
  runInit,
  bootstrapProject,
  resetConfigAndMocks,
  resetDiskAndMocks,
} from '../../../test/utils/runCommands';
import type { FuelsConfig } from '../types';

import { loadConfig } from './loadConfig';

/**
 * @group node
 */
describe('loadConfig', () => {
  const paths = bootstrapProject(__filename);

  afterEach(() => {
    resetConfigAndMocks(paths.fuelsConfigPath);
  });

  afterAll(() => {
    resetDiskAndMocks(paths.root);
  });

  test('should throw if config path is not found', async () => {
    const cwd = '/non/existent/path';
    const errorMsg = `Config file not found!`;
    const { error, result } = await safeExec(() => loadConfig(cwd));
    expect(error?.message).toEqual(errorMsg);
    expect(result).not.toBeTruthy();
  });

  test(`should auto start fuel core explicitly`, async () => {
    await runInit({
      root: paths.root,
      workspace: paths.workspaceDir,
      output: paths.outputDir,
      forcPath: paths.forcPath,
      fuelCorePath: paths.fuelCorePath,
      autoStartFuelCore: true,
    });

    const fuelsContents = readFileSync(paths.fuelsConfigPath, 'utf-8');
    const config = await loadConfig(paths.root);

    expect(fuelsContents).toMatch(`  autoStartFuelCore: true,`); // not a comment
    expect(config.autoStartFuelCore).toEqual(true);
  });

  test(`should resolve individual paths when not using workspaces`, async () => {
    await runInit({
      root: paths.root,
      output: paths.outputDir,
      forcPath: paths.forcPath,
      fuelCorePath: paths.fuelCorePath,
      contracts: 'workspace/contracts/*',
      scripts: 'workspace/scripts/*',
      predicates: 'workspace/predicates/*',
    });

    const config = await loadConfig(paths.root);

    expect(config.contracts.length).toEqual(2);
    expect(config.scripts.length).toEqual(1);
    expect(config.predicates.length).toEqual(1);
  });

  test(`should resolve only contracts`, async () => {
    await runInit({
      root: paths.root,
      output: paths.outputDir,
      forcPath: paths.forcPath,
      fuelCorePath: paths.fuelCorePath,
      contracts: 'workspace/contracts/*',
    });

    const config = await loadConfig(paths.root);

    expect(config.contracts.length).toEqual(2);
    expect(config.scripts.length).toEqual(0);
    expect(config.predicates.length).toEqual(0);
  });

  test(`should resolve only scripts`, async () => {
    await runInit({
      root: paths.root,
      output: paths.outputDir,
      forcPath: paths.forcPath,
      fuelCorePath: paths.fuelCorePath,
      scripts: 'workspace/scripts/*',
    });

    const config = await loadConfig(paths.root);

    expect(config.contracts.length).toEqual(0);
    expect(config.scripts.length).toEqual(1);
    expect(config.predicates.length).toEqual(0);
  });

  test(`should resolve only predicates`, async () => {
    await runInit({
      root: paths.root,
      output: paths.outputDir,
      forcPath: paths.forcPath,
      fuelCorePath: paths.fuelCorePath,
      predicates: 'workspace/predicates/*',
    });

    const config = await loadConfig(paths.root);

    expect(config.contracts.length).toEqual(0);
    expect(config.scripts.length).toEqual(0);
    expect(config.predicates.length).toEqual(1);
  });

  test(`should warn about misconfigured workspace`, async () => {
    await runInit({
      root: paths.root,
      output: paths.outputDir,
      forcPath: paths.forcPath,
      fuelCorePath: paths.fuelCorePath,
      // passing contract path in workspace config option
      workspace: 'workspace/contracts/bar',
    });

    const { error, result } = await safeExec<Promise<FuelsConfig>>(() => loadConfig(paths.root));

    expect(result).not.toBeTruthy();
    expect(error?.message).toMatch(/forc workspace not detected/i);
    expect(error?.message).toMatch(/try using 'contracts'/i);
  });

  test(`should load custom binary paths`, async () => {
    await runInit({
      root: paths.root,
      workspace: paths.workspaceDir,
      output: paths.outputDir,
      forcPath: 'fuels-forc',
      fuelCorePath: 'fuels-core',
    });

    const config = await loadConfig(paths.root);

    expect(config.forcPath).toEqual('fuels-forc');
    expect(config.fuelCorePath).toEqual('fuels-core');
  });

  test('should throw if system binary paths are not found', async () => {
    await runInit({
      root: paths.root,
      workspace: paths.workspaceDir,
      output: paths.outputDir,
      forcPath: '/non/existent/forc',
      fuelCorePath: '/non/existent/fuel-core',
    });

    const { error, result } = await safeExec(() => loadConfig(paths.root));

    const expectedMessage = [
      `Binary for 'forc' not found at path '/non/existent/forc'`,
      `Binary for 'fuel-core' not found at path '/non/existent/fuel-core'`,
    ].join('\n');
    expect(result).toBeFalsy();
    expect(error?.message).toEqual(expectedMessage);
  });
});
