import { Identifiers } from '../errors/Identifiers';
import { err, ok, Result } from '../parsers/Result';

export function resolveDate(parameter: string, options?: { minimum?: number; maximum?: number }): Result<Date, string> {
	const parsed = new Date(parameter);

	const time = parsed.getTime();
	if (Number.isNaN(time)) return err('The argument did not resolve to a valid date.');

	if (typeof options?.minimum === 'number' && time < options.minimum) return err(Identifiers.ArgumentDateTooSmall);
	if (typeof options?.maximum === 'number' && time > options.maximum) return err(Identifiers.ArgumentDateTooBig);

	return ok(parsed);
}
