import type { PieceContext } from '@sapphire/pieces';
import { resolveBoolean } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<boolean> {
	public constructor(context: PieceContext) {
		super(context, { name: 'boolean' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<boolean> {
		const resolved = resolveBoolean(parameter);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({ parameter, message: resolved.error, context });
	}
}
