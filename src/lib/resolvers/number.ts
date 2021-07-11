import { Identifiers } from '../errors/Identifiers';
import { err, ok, Result } from '../parsers/Result';

export function resolveNumber(parameter: string, options?: { minimum?: number; maximum?: number }): Result<number, string> {
	const parsed = Number(parameter);
	if (Number.isNaN(parsed)) return err('The argument did not resolve to a valid number.');

	if (typeof options?.minimum === 'number' && parsed < options.minimum) return err(Identifiers.ArgumentNumberTooSmall);
	if (typeof options?.maximum === 'number' && parsed > options.maximum) return err(Identifiers.ArgumentNumberTooBig);

	return ok(parsed);
}
