import type { PieceContext } from '@sapphire/pieces';
import type { DMChannel } from 'discord.js';
import { resolveDMChannel } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<DMChannel> {
	public constructor(context: PieceContext) {
		super(context, { name: 'dmChannel' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<DMChannel> {
		const resolved = resolveDMChannel(parameter);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			message: resolved.error,
			context: { ...context, channel: resolved.value }
		});
	}
}
