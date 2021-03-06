import { Piece, PieceContext, PieceOptions } from '@sapphire/pieces';
import type { Client, ClientEvents } from 'discord.js';
import type { EventEmitter } from 'events';
import { Events } from '../types/Events';

/**
 * The base event class. This class is abstract and is to be extended by subclasses, which should implement the methods. In
 * Sapphire's workflow, listeners are called when the emitter they listen on emits a new message with the same event name.
 *
 * @example
 * ```typescript
 * // TypeScript:
 * import { Events, Listener, PieceContext } from '@sapphire/framework';
 *
 * // Define a class extending `Listener`, then export it.
 * // NOTE: You can use `export default` or `export =` too.
 * export class CoreListener extends Listener<typeof Events.Ready> {
 *   public constructor(context: PieceContext) {
 *     super(context, { event: Events.Ready, once: true });
 *   }
 *
 *   public run() {
 *     this.container.client.id ??= this.container.client.user?.id ?? null;
 *   }
 * }
 * ```
 *
 * @example
 * ```javascript
 * // JavaScript:
 * const { Events, Listener } = require('@sapphire/framework');
 *
 * // Define a class extending `Listener`, then export it.
 * module.exports = class CoreListener extends Listener {
 *   constructor(context) {
 *     super(context, { event: Events.Ready, once: true });
 *   }
 *
 *   run() {
 *     this.container.client.id ??= this.container.client.user?.id ?? null;
 *   }
 * }
 * ```
 */
export abstract class Listener<E extends keyof ClientEvents | symbol = ''> extends Piece {
	public readonly emitter: EventEmitter | null;
	public readonly event: string;
	public readonly once: boolean;

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	#listener: ((...args: any[]) => void) | null;

	public constructor(context: PieceContext, options: EventOptions = {}) {
		super(context, options);

		this.emitter =
			typeof options.emitter === 'undefined'
				? this.container.client
				: (typeof options.emitter === 'string' ? (Reflect.get(this.container.client, options.emitter) as EventEmitter) : options.emitter) ??
				  null;
		this.event = options.event ?? this.name;
		this.once = options.once ?? false;

		this.#listener = this.emitter && this.event ? (this.once ? this._runOnce.bind(this) : this._run.bind(this)) : null;
	}

	public abstract run(...args: E extends keyof ClientEvents ? ClientEvents[E] : unknown[]): unknown;

	public onLoad() {
		if (this.#listener) this.emitter![this.once ? 'once' : 'on'](this.event, this.#listener);
	}

	public onUnload() {
		if (!this.once && this.#listener) this.emitter!.off(this.event, this.#listener);
	}

	public toJSON(): Record<PropertyKey, unknown> {
		return {
			...super.toJSON(),
			event: this.event
		};
	}

	private async _run(...args: unknown[]) {
		try {
			await this.run(...args);
		} catch (error) {
			this.container.client.emit(Events.ListenerError, error, { piece: this });
		}
	}

	private async _runOnce(...args: unknown[]) {
		await this._run(...args);
		await this.store.unload(this);
	}
}

export interface EventOptions extends PieceOptions {
	readonly emitter?: keyof Client | EventEmitter;
	readonly event?: string;
	readonly once?: boolean;
}
