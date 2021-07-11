import { SnowflakeRegex, UserOrMemberMentionRegex } from '@sapphire/discord-utilities';
import { container } from '@sapphire/pieces';
import type { User } from 'discord.js';
import { err, ok, Result } from '../parsers/Result';

export async function resolveUser(parameter: string): Promise<Result<User, string>> {
	const userID = UserOrMemberMentionRegex.exec(parameter) ?? SnowflakeRegex.exec(parameter);
	const user = userID ? await container.client.users.fetch(userID[1]) : null;
	if (user) return ok(user);
	return err('The argument did not resolve to a user.');
}
