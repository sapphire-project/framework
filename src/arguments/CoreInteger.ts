import type { PieceContext } from '@sapphire/pieces';
import { Identifiers } from '../lib/errors/Identifiers';
import { resolveInteger } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<number> {
	public constructor(context: PieceContext) {
		super(context, { name: 'integer' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<number> {
		const resolved = resolveInteger(parameter, { minimum: context?.minimum, maximum: context?.maximum });
		if (resolved.success) return this.ok(resolved.value);

		if (resolved.error === Identifiers.ArgumentIntegerTooSmall) {
			return this.error({
				parameter,
				identifier: Identifiers.ArgumentIntegerTooSmall,
				message: `The argument must be greater than ${context.minimum}.`,
				context
			});
		}

		if (resolved.error === Identifiers.ArgumentIntegerTooBig) {
			return this.error({
				parameter,
				identifier: Identifiers.ArgumentIntegerTooBig,
				message: `The argument must be less than ${context.maximum}.`,
				context
			});
		}

		return this.error({
			parameter,
			message: resolved.error,
			context
		});
	}
}
