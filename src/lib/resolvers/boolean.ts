import { err, ok, Result } from '../parsers/Result';

const truths = ['1', 'true', '+', 't', 'yes', 'y'];
const falses = ['0', 'false', '-', 'f', 'no', 'n'];

export function resolveBoolean(parameter: string): Result<boolean, string> {
	const boolean = parameter.toLowerCase();
	if (truths.includes(boolean)) return ok(true);
	if (falses.includes(boolean)) return ok(false);
	return err('The argument did not resolve to a boolean.');
}
