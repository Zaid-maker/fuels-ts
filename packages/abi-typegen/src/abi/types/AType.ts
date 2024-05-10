import type { IRawAbiTypeRoot } from '../../types/interfaces/IRawAbiType';
import type { ITypeAttributes } from '../../types/interfaces/IType';

export class AType {
  public rawAbiType: IRawAbiTypeRoot;
  public attributes: ITypeAttributes;
  public requiredFuelsMembersImports: string[];

  constructor(params: { rawAbiType: IRawAbiTypeRoot }) {
    this.rawAbiType = params.rawAbiType;
    this.attributes = {
      inputLabel: 'unknown',
      outputLabel: 'unknown',
    };
    this.requiredFuelsMembersImports = [];
  }
}
