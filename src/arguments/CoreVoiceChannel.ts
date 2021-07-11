import type { PieceContext } from '@sapphire/pieces';
import type { VoiceChannel } from 'discord.js';
import { resolveVoiceChannel } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<VoiceChannel> {
	public constructor(context: PieceContext) {
		super(context, { name: 'voiceChannel' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<VoiceChannel> {
		const resolved = resolveVoiceChannel(parameter);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			message: resolved.error,
			context: { ...context, channel: resolved.value }
		});
	}
}
