import type { PieceContext } from '@sapphire/pieces';
import { Message, NewsChannel, Permissions, TextChannel } from 'discord.js';
import { Event } from '../../lib/structures/Event';
import { Events } from '../../lib/types/Events';

export class CoreEvent extends Event<Events.Message> {
	private readonly requiredPermissions = new Permissions(['VIEW_CHANNEL', 'SEND_MESSAGES']).freeze();
	public constructor(context: PieceContext) {
		super(context, { event: Events.Message });
	}

	public async run(message: Message) {
		// Stop bots and webhooks from running commands.
		if (message.author.bot || message.webhookID) return;

		// If the bot cannot run the command due to lack of permissions, return.
		const canRun = await this.canRunInChannel(message);
		if (!canRun) return;

		let prefix = null;
		const mentionPrefix = this.getMentionPrefix(message.content);
		const { regexPrefix } = this.context.client.options;
		if (mentionPrefix) {
			if (message.content.length === mentionPrefix.length) {
				message.client.emit(Events.MentionPrefixOnly, message);
				return;
			}

			prefix = mentionPrefix;
		} else if (regexPrefix) {
			prefix = regexPrefix;
		} else {
			const prefixes = await message.client.fetchPrefix(message);
			const parsed = this.getPrefix(message.content, prefixes);
			if (parsed !== null) prefix = parsed;
		}

		if (prefix !== null) message.client.emit(Events.PrefixedMessage, message, prefix);
	}

	private async canRunInChannel(message: Message): Promise<boolean> {
		if (message.channel.type === 'dm') return true;

		const me = message.guild!.me ?? (message.client.id ? await message.guild!.members.fetch(message.client.id) : null);
		if (!me) return false;

		const channel = message.channel as TextChannel | NewsChannel;
		return channel.permissionsFor(me)!.has(this.requiredPermissions, false);
	}

	private getMentionPrefix(content: string): string | null {
		const { id } = this.context.client;

		// If no client ID was specified, return null:
		if (!id) return null;

		// If the content is shorter than `<@{n}>` or doesn't start with `<@`, skip early:
		if (content.length < 20 || !content.startsWith('<@')) return null;

		// Retrieve whether the mention is a nickname mention (`<@!{n}>`) or not (`<@{n}>`).
		const nickname = content[2] === '!';
		const idOffset = (nickname ? 3 : 2) as number;
		const idLength = id.length;

		// If the mention doesn't end with `>`, skip early:
		if (content[idOffset + idLength] !== '>') return null;

		// Check whether or not the ID is the same as the client ID:
		const mentionID = content.substr(idOffset, idLength);
		if (mentionID === id) return content.substr(0, idOffset + idLength + 1);

		return null;
	}

	private getPrefix(content: string, prefixes: readonly string[] | string | null): string | null {
		if (prefixes === null) return null;
		if (typeof prefixes === 'string') return content.startsWith(prefixes) ? prefixes : null;
		return prefixes.find((prefix) => content.startsWith(prefix)) ?? null;
	}
}
