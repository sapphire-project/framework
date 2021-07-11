import type { PieceContext } from '@sapphire/pieces';
import type { DMChannel, Message, NewsChannel, TextChannel } from 'discord.js';
import { resolveMessage } from '../lib/resolvers/message';
import { Argument, ArgumentContext, AsyncArgumentResult } from '../lib/structures/Argument';

export interface MessageArgumentContext extends ArgumentContext {
	channel?: DMChannel | NewsChannel | TextChannel;
}

export class CoreArgument extends Argument<Message> {
	public constructor(context: PieceContext) {
		super(context, { name: 'message' });
	}

	public async run(parameter: string, context: MessageArgumentContext): AsyncArgumentResult<Message> {
		const channel = context.channel ?? context.message.channel;

		const resolved = await resolveMessage(parameter, { channel: context.channel, message: context.message });
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			message: resolved.error,
			context: { ...context, channel }
		});
	}
}
