import type { PieceContext } from '@sapphire/pieces';
import { Identifiers } from '../lib/errors/Identifiers';
import { resolveNumber } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<number> {
	public constructor(context: PieceContext) {
		super(context, { name: 'number' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<number> {
		const resolved = resolveNumber(parameter, { minimum: context?.minimum, maximum: context?.maximum });
		if (resolved.success) return this.ok(resolved.value);

		if (resolved.error === Identifiers.ArgumentNumberTooSmall) {
			return this.error({
				parameter,
				identifier: Identifiers.ArgumentNumberTooSmall,
				message: `The argument must be greater than ${context.minimum}.`,
				context
			});
		}

		if (resolved.error === Identifiers.ArgumentNumberTooBig) {
			return this.error({
				parameter,
				identifier: Identifiers.ArgumentNumberTooBig,
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
