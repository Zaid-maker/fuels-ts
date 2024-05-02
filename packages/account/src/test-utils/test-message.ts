import { Address } from '@fuel-ts/address';
import { randomBytes } from '@fuel-ts/crypto';
import type { AbstractAddress } from '@fuel-ts/interfaces';
import { bn, type BN } from '@fuel-ts/math';
import type { SnapshotConfigs } from '@fuel-ts/utils';
import { hexlify } from '@fuel-ts/utils';

interface TestMessageSpecs {
  sender: AbstractAddress;
  recipient: AbstractAddress;
  nonce: string;
  amount: number;
  data: string;
  da_height: number;
}

export class TestMessage {
  private sender: AbstractAddress;
  private recipient: AbstractAddress;
  private nonce: string;
  private amount: number | BN;
  private data: string;
  private da_height: number;

  /**
   * A helper class to create messages for testing purposes.
   *
   * Used in tandem with `WalletConfig`.
   * It can also be used standalone and passed into the initial state of a chain via the `.toChainMessage` method.
   */
  constructor({
    sender = Address.fromRandom(),
    recipient = Address.fromRandom(),
    nonce = hexlify(randomBytes(32)),
    amount = 1_000_000,
    data = '02',
    da_height = 0,
  }: Partial<TestMessageSpecs> = {}) {
    this.sender = sender;
    this.recipient = recipient;
    this.nonce = nonce;
    this.amount = amount;
    this.data = data;
    this.da_height = da_height;
  }

  toChainMessage(recipient?: AbstractAddress): SnapshotConfigs['stateConfigJson']['messages'][0] {
    return {
      sender: this.sender.toB256(),
      recipient: recipient?.toB256() ?? this.recipient.toB256(),
      nonce: this.nonce,
      amount: bn(this.amount).toNumber(),
      data: this.data,
      da_height: this.da_height,
    };
  }
}
