import type { PieceContext } from '@sapphire/pieces';
import type { URL } from 'url';
import { resolveHyperlink } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<URL> {
	public constructor(context: PieceContext) {
		super(context, { name: 'hyperlink', aliases: ['url'] });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<URL> {
		const resolved = resolveHyperlink(parameter);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({ parameter, message: resolved.error, context });
	}
}
