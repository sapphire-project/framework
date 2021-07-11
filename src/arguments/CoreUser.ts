import type { PieceContext } from '@sapphire/pieces';
import type { User } from 'discord.js';
import { resolveUser } from '../lib/resolvers';
import { Argument, ArgumentContext, AsyncArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<User> {
	public constructor(context: PieceContext) {
		super(context, { name: 'user' });
	}

	public async run(parameter: string, context: ArgumentContext): AsyncArgumentResult<User> {
		const resolved = await resolveUser(parameter);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({ parameter, message: resolved.error, context });
	}
}
