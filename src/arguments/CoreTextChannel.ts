import type { PieceContext } from '@sapphire/pieces';
import type { TextChannel } from 'discord.js';
import { resolveTextChannel } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<TextChannel> {
	public constructor(context: PieceContext) {
		super(context, { name: 'textChannel' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<TextChannel> {
		const resolved = resolveTextChannel(parameter);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			message: resolved.error,
			context: { ...context, channel: resolved.value }
		});
	}
}
