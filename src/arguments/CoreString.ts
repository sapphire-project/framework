import type { PieceContext } from '@sapphire/pieces';
import { Identifiers } from '../lib/errors/Identifiers';
import { resolveString } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<string> {
	public constructor(context: PieceContext) {
		super(context, { name: 'string' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<string> {
		const resolved = resolveString(parameter, { minimum: context?.minimum, maximum: context?.maximum });
		if (resolved.success) return this.ok(resolved.value);

		switch (resolved.error) {
			case Identifiers.ArgumentStringTooShort:
				return this.error({
					parameter,
					identifier: Identifiers.ArgumentStringTooShort,
					message: `The argument must be longer than ${context.minimum} characters.`,
					context
				});
			case Identifiers.ArgumentStringTooLong:
				return this.error({
					parameter,
					identifier: Identifiers.ArgumentStringTooLong,
					message: `The argument must be shorter than ${context.maximum} characters.`,
					context
				});
		}
	}
}
