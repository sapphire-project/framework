import { container } from '@sapphire/pieces';
import type { Channel } from 'discord.js';
import { err, ok, Result } from '../parsers/Result';

export function resolveChannel(parameter: string): Result<Channel, string> {
	const channel = container.client.channels.cache.get(parameter);
	if (channel) return ok(channel);
	return err('The argument did not resolve to a channel.');
}
