import { RoleMentionRegex, SnowflakeRegex } from '@sapphire/discord-utilities';
import type { Guild, Role } from 'discord.js';
import { err, ok, Result } from '../parsers/Result';

export async function resolveRole(parameter: string, guild: Guild): Promise<Result<Role, string>> {
	const role = (await resolveByID(parameter, guild)) ?? resolveByQuery(parameter, guild);
	if (role) return ok(role);
	return err('The argument did not resolve to a role.');
}

async function resolveByID(argument: string, guild: Guild): Promise<Role | null> {
	const roleID = RoleMentionRegex.exec(argument) ?? SnowflakeRegex.exec(argument);
	return roleID ? guild.roles.fetch(roleID[1]) : null;
}

function resolveByQuery(argument: string, guild: Guild): Role | null {
	const lowerCaseArgument = argument.toLowerCase();
	return guild.roles.cache.find((role) => role.name.toLowerCase() === lowerCaseArgument) ?? null;
}
