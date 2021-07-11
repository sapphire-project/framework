import { isDMChannel } from '@sapphire/discord.js-utilities';
import type { DMChannel } from 'discord.js';
import { err, ok, Result } from '../parsers/Result';
import { resolveChannel } from './channel';

export function resolveDMChannel(parameter: string): Result<DMChannel, string> {
	const channel = resolveChannel(parameter);
	if (channel.success && isDMChannel(channel.value)) return ok(channel.value);
	return err('The argument did not resolve to a DM channel.');
}
