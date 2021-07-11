import { isCategoryChannel } from '@sapphire/discord.js-utilities';
import type { CategoryChannel } from 'discord.js';
import { err, ok, Result } from '../parsers/Result';
import { resolveChannel } from './channel';

export function resolveCategoryChannel(parameter: string): Result<CategoryChannel, string> {
	const channel = resolveChannel(parameter);
	if (channel.success && isCategoryChannel(channel.value)) return ok(channel.value);
	return err('The argument did not resolve to a category channel.');
}
