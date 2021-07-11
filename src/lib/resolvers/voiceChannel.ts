import { isVoiceChannel } from '@sapphire/discord.js-utilities';
import type { VoiceChannel } from 'discord.js';
import { err, ok, Result } from '../parsers/Result';
import { resolveChannel } from './channel';

export function resolveVoiceChannel(parameter: string): Result<VoiceChannel, string> {
	const channel = resolveChannel(parameter);
	if (channel.success && isVoiceChannel(channel.value)) return ok(channel.value);
	return err('The argument did not resolve to a voice channel.');
}
