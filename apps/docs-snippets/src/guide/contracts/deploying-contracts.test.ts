import { readFileSync } from 'fs';
import { join } from 'path';
import { ContractFactory, FUEL_NETWORK_URL, Provider, Wallet } from 'fuels';

import { DocSnippetProjectsEnum } from '../../../test/fixtures/forc-projects';
import { getTestWallet } from '../../utils';

/**
 * @group node
 */
describe(__filename, () => {
  let privateKey: string;
  let projectsPath: string;
  let contractName: string;

  beforeAll(async () => {
    const wallet = await getTestWallet();
    privateKey = wallet.privateKey;
    projectsPath = join(__dirname, '../../../test/fixtures/forc-projects');

    contractName = DocSnippetProjectsEnum.ECHO_VALUES;
  });

  it('should successfully deploy and execute contract function', async () => {
    // #region contract-setup-1
    // #context const PRIVATE_KEY = "..."

    const provider = await Provider.create(FUEL_NETWORK_URL);

    const wallet = Wallet.fromPrivateKey(privateKey, provider);
    // #endregion contract-setup-1

    // #region contract-setup-2
    // #context const contractsDir = join(__dirname, '../path/to/contracts/dir')
    // #context const contractName = "contract-name"

    const byteCodePath = join(
      projectsPath,
      `${contractName}/out/release/${contractName}.bin`,
    );
    const byteCode = readFileSync(byteCodePath);

    const abiJsonPath = join(
      projectsPath,
      `${contractName}/out/release/${contractName}-abi.json`,
    );
    const abi = JSON.parse(readFileSync(abiJsonPath, 'utf8'));
    // #endregion contract-setup-2

    // #region contract-setup-3
    const factory = new ContractFactory(byteCode, abi, wallet);

    const contract = await factory.deployContract();
    // #endregion contract-setup-3

    // #region contract-setup-4
    const { value } = await contract.functions.echo_u8(15).simulate();

    expect(value).toBe(15);
    // #endregion contract-setup-4
  });
});
