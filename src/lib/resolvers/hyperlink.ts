import { URL } from 'url';
import { err, ok, Result } from '../parsers/Result';

export function resolveHyperlink(parameter: string): Result<URL, string> {
	try {
		return ok(new URL(parameter));
	} catch {
		return err('The argument did not resolve to a valid URL.');
	}
}
