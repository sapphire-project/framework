import type { PieceContext } from '@sapphire/pieces';
import { Identifiers } from '../lib/errors/Identifiers';
import { resolveDate } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<Date> {
	public constructor(context: PieceContext) {
		super(context, { name: 'date' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<Date> {
		const resolved = resolveDate(parameter, { minimum: context?.minimum, maximum: context?.maximum });
		if (resolved.success) return this.ok(resolved.value);

		if (resolved.error === Identifiers.ArgumentDateTooSmall)
			return this.error({ parameter, identifier: Identifiers.ArgumentDateTooSmall, message: 'The argument is too small.', context });

		if (resolved.error === Identifiers.ArgumentDateTooBig)
			return this.error({ parameter, identifier: Identifiers.ArgumentDateTooBig, message: 'The argument is too big.', context });

		return this.error({
			parameter,
			message: resolved.error,
			context
		});
	}
}
