import type { PieceContext } from '@sapphire/pieces';
import type { GuildMember } from 'discord.js';
import { Identifiers } from '../lib/errors/Identifiers';
import { resolveMember } from '../lib/resolvers';
import { Argument, ArgumentContext, AsyncArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<GuildMember> {
	public constructor(context: PieceContext) {
		super(context, { name: 'member' });
	}

	public async run(parameter: string, context: ArgumentContext): AsyncArgumentResult<GuildMember> {
		const { guild } = context.message;
		if (!guild) {
			return this.error({
				parameter,
				identifier: Identifiers.ArgumentMemberMissingGuild,
				message: 'The argument must be run on a guild.',
				context: { ...context, guild }
			});
		}

		const resolved = await resolveMember(parameter, guild);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			message: resolved.error,
			context: { ...context, guild }
		});
	}
}
