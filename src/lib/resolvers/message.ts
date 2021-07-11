import { MessageLinkRegex, SnowflakeRegex } from '@sapphire/discord-utilities';
import { isNewsChannel, isTextChannel } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/pieces';
import { DMChannel, Message, NewsChannel, Permissions, TextChannel } from 'discord.js';
import { err, ok, Result } from '../parsers/Result';

interface MessageResolverOptions {
	channel?: DMChannel | NewsChannel | TextChannel;
	message: Message;
}

export async function resolveMessage(parameter: string, options: MessageResolverOptions): Promise<Result<Message, string>> {
	const channel = options.channel ?? options.message.channel;
	const message = (await resolveByID(parameter, channel)) ?? (await resolveByLink(parameter, options.message));
	if (message) return ok(message);
	return err('The argument did not resolve to a message.');
}

async function resolveByID(parameter: string, channel: DMChannel | NewsChannel | TextChannel): Promise<Message | null> {
	return SnowflakeRegex.test(parameter) ? channel.messages.fetch(parameter) : null;
}

async function resolveByLink(parameter: string, message: Message): Promise<Message | null> {
	if (!message.guild) return null;

	const matches = MessageLinkRegex.exec(parameter);
	if (!matches) return null;
	const [, guildID, channelID, messageID] = matches;

	const guild = container.client.guilds.cache.get(guildID);
	if (guild !== message.guild) return null;

	const channel = guild.channels.cache.get(channelID);
	if (!channel) return null;
	if (!(isNewsChannel(channel) || isTextChannel(channel))) return null;
	if (!channel.viewable) return null;
	if (!channel.permissionsFor(message.author)?.has(Permissions.FLAGS.VIEW_CHANNEL)) return null;

	return channel.messages.fetch(messageID);
}
