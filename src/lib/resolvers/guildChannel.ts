import { ChannelMentionRegex, SnowflakeRegex } from '@sapphire/discord-utilities';
import type { Guild, GuildChannel } from 'discord.js';
import { err, ok, Result } from '../parsers/Result';

export function resolveGuildChannel(parameter: string, guild: Guild): Result<GuildChannel, string> {
	const channel = resolveByID(parameter, guild) ?? resolveByQuery(parameter, guild);
	if (channel) return ok(channel);
	return err('The argument did not resolve to a guild channel.');
}

function resolveByID(argument: string, guild: Guild): GuildChannel | null {
	const channelID = ChannelMentionRegex.exec(argument) ?? SnowflakeRegex.exec(argument);
	return channelID ? guild.channels.cache.get(channelID[1]) ?? null : null;
}

function resolveByQuery(argument: string, guild: Guild): GuildChannel | null {
	const lowerCaseArgument = argument.toLowerCase();
	return guild.channels.cache.find((channel) => channel.name.toLowerCase() === lowerCaseArgument) ?? null;
}
