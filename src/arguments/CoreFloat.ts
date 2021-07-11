import type { PieceContext } from '@sapphire/pieces';
import { Identifiers } from '../lib/errors/Identifiers';
import { resolveFloat } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<number> {
	public constructor(context: PieceContext) {
		super(context, { name: 'float' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<number> {
		const resolved = resolveFloat(parameter, { minimum: context?.minimum, maximum: context?.maximum });
		if (resolved.success) return this.ok(resolved.value);

		if (resolved.error === Identifiers.ArgumentFloatTooSmall) {
			return this.error({
				parameter,
				identifier: Identifiers.ArgumentFloatTooSmall,
				message: `The argument must be greater than ${context.minimum}.`,
				context
			});
		}

		if (resolved.error === Identifiers.ArgumentFloatTooBig) {
			return this.error({
				parameter,
				identifier: Identifiers.ArgumentFloatTooBig,
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
