/*
import { ErrorCode, FuelError } from '@fuel-ts/errors';
import type { AbstractAddress } from '@fuel-ts/interfaces';

import type { WalletUnlocked } from '../wallet';

export type WalletManagerAccount = {
  address: AbstractAddress;
  publicKey: string;
  vaultId?: number;
};

export type WalletManagerOptions = {
  storage: StorageAbstract;
};

export type VaultConfig = {
  type: string;
  title?: string;
  secret?: string;
};

export type VaultsState = Array<{
  type: string;
  title?: string;
  data?: VaultConfig;
  vault: Vault;
}>;

export interface WalletManagerState {
  vaults: VaultsState;
}

export abstract class Vault<TOptions = { secret?: string }> {
  static readonly type: string;

  constructor(_options: TOptions) {
    throw new FuelError(ErrorCode.NOT_IMPLEMENTED, 'Not implemented.');
  }

  serialize(): TOptions {
    throw new FuelError(ErrorCode.NOT_IMPLEMENTED, 'Not implemented.');
  }

  getAccounts(): WalletManagerAccount[] {
    throw new FuelError(ErrorCode.NOT_IMPLEMENTED, 'Not implemented.');
  }

  addAccount(): WalletManagerAccount {
    throw new FuelError(ErrorCode.NOT_IMPLEMENTED, 'Not implemented.');
  }

  exportAccount(_address: AbstractAddress): string {
    throw new FuelError(ErrorCode.NOT_IMPLEMENTED, 'Not implemented.');
  }

  getWallet(_address: AbstractAddress): WalletUnlocked {
    throw new FuelError(ErrorCode.NOT_IMPLEMENTED, 'Not implemented.');
  }
}

export abstract class StorageAbstract {
  abstract setItem(key: string, value: string): Promise<void>;
  abstract getItem(key: string): Promise<string | null | undefined>;
  abstract removeItem(key: string): Promise<void>;
  abstract clear(): Promise<void>;
}
