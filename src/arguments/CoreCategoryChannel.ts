import type { PieceContext } from '@sapphire/pieces';
import type { CategoryChannel } from 'discord.js';
import { resolveCategoryChannel } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<CategoryChannel> {
	public constructor(context: PieceContext) {
		super(context, { name: 'categoryChannel' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<CategoryChannel> {
		const resolved = resolveCategoryChannel(parameter);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			message: resolved.error,
			context: { ...context, channel: resolved.value }
		});
	}
}
