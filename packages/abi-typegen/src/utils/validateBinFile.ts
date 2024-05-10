import { ErrorCode, FuelError } from "@fuel-ts/errors";

import { ProgramTypeEnum } from "../types/enums/ProgramTypeEnum";

const upperFirst = (s: string): string => s[0].toUpperCase() + s.slice(1);

export function validateBinFile(params: {
	abiFilepath: string;
	binFilepath: string;
	binExists: boolean;
	programType: ProgramTypeEnum;
}) {
	const { abiFilepath, binFilepath, binExists, programType } = params;

	const isScript = programType === ProgramTypeEnum.SCRIPT;

	if (!binExists && isScript) {
		throw new FuelError(
			ErrorCode.BIN_FILE_NOT_FOUND,
			[
				`Could not find BIN file for counterpart ${upperFirst(
					programType,
				)} ABI.`,
				`  - ABI: ${abiFilepath}`,
				`  - BIN: ${binFilepath}`,
				programType,
			].join("\n"),
		);
	}
}
