import { isNewsChannel } from '@sapphire/discord.js-utilities';
import type { NewsChannel } from 'discord.js';
import { err, ok, Result } from '../parsers/Result';
import { resolveChannel } from './channel';

export function resolveNewsChannel(parameter: string): Result<NewsChannel, string> {
	const channel = resolveChannel(parameter);
	if (channel.success && isNewsChannel(channel.value)) return ok(channel.value);
	return err('The argument did not resolve to a news channel.');
}
