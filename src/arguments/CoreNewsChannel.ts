import type { PieceContext } from '@sapphire/pieces';
import type { NewsChannel } from 'discord.js';
import { resolveNewsChannel } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<NewsChannel> {
	public constructor(context: PieceContext) {
		super(context, { name: 'newsChannel' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<NewsChannel> {
		const resolved = resolveNewsChannel(parameter);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			message: resolved.error,
			context: { ...context, channel: resolved.value }
		});
	}
}
