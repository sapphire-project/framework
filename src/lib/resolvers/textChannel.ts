import { isTextChannel } from '@sapphire/discord.js-utilities';
import type { TextChannel } from 'discord.js';
import { err, ok, Result } from '../parsers/Result';
import { resolveChannel } from './channel';

export function resolveTextChannel(parameter: string): Result<TextChannel, string> {
	const channel = resolveChannel(parameter);
	if (channel.success && isTextChannel(channel.value)) return ok(channel.value);
	return err('The argument did not resolve to a text channel.');
}
