import { SnowflakeRegex, UserOrMemberMentionRegex } from '@sapphire/discord-utilities';
import type { Guild, GuildMember } from 'discord.js';
import { err, ok, Result } from '../parsers/Result';

export async function resolveMember(parameter: string, guild: Guild): Promise<Result<GuildMember, string>> {
	const member = (await resolveByID(parameter, guild)) ?? (await resolveByQuery(parameter, guild));
	if (member) return ok(member);
	return err('The argument did not resolve to a member.');
}

async function resolveByID(argument: string, guild: Guild): Promise<GuildMember | null> {
	const memberID = UserOrMemberMentionRegex.exec(argument) ?? SnowflakeRegex.exec(argument);
	return memberID ? guild.members.fetch(memberID[1]) : null;
}

async function resolveByQuery(argument: string, guild: Guild): Promise<GuildMember | null> {
	const members = await guild.members.fetch({ query: argument, limit: 1 });
	return members?.first() ?? null;
}
