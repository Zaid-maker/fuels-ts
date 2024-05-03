import type { IType } from '../../types/interfaces/IType';

import { ArrayType } from './ArrayType';

export class VectorType extends ArrayType {
  public static swayType = 'struct Vec';

  public name = 'vector';

  static MATCH_REGEX: RegExp = /^struct (std::vec::)?Vec/m;
  static IGNORE_REGEX: RegExp = /^struct (std::vec::)?RawVec$/m;

  static isSuitableFor(params: { type: string }) {
    const isAMatch = VectorType.MATCH_REGEX.test(params.type);
    const shouldBeIgnored = VectorType.IGNORE_REGEX.test(params.type);
    console.log(params.type, isAMatch, shouldBeIgnored);
    return isAMatch && !shouldBeIgnored;
  }

  public parseComponentsAttributes(_params: { types: IType[] }) {
    this.attributes = {
      inputLabel: `Vec`,
      outputLabel: `Vec`,
    };
    return this.attributes;
  }
}
