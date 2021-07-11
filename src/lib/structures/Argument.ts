import { AliasPiece, AliasPieceOptions } from '@sapphire/pieces';
import type { Awaited } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import type { ArgumentError } from '../errors/ArgumentError';
import type { UserError } from '../errors/UserError';
import { Args } from '../parsers/Args';
import type { Result } from '../parsers/Result';
import type { Command, CommandContext } from './Command';

/**
 * Defines a synchronous result of an {@link Argument}, check {@link AsyncArgumentResult} for the asynchronous version.
 */
export type ArgumentResult<T> = Awaited<Result<T, UserError>>;

/**
 * Defines an asynchronous result of an {@link Argument}, check {@link ArgumentResult} for the synchronous version.
 */
export type AsyncArgumentResult<T> = Promise<Result<T, UserError>>;

export interface IArgument<T> {
	/**
	 * The name of the argument, this is used to make the identification of an argument easier.
	 */
	readonly name: string;

	/**
	 * The method which is called when invoking the argument.
	 * @param parameter The string parameter to parse.
	 * @param context The context for the method call, contains the message, command, and other options.
	 */
	run(parameter: string, context: ArgumentContext<T>): ArgumentResult<T>;
}

/**
 * The base argument class. This class is abstract and is to be extended by subclasses implementing the methods. In
 * Sapphire's workflow, arguments are called when using {@link Args}'s methods (usually used inside {@link Command}s by default).
 *
 * @example
 * ```typescript
 * // TypeScript:
 * import { Argument, ArgumentResult, err, ok, PieceContext, Result } from '@sapphire/framework';
 * import { URL } from 'url';
 *
 * function resolveHyperlink(parameter: string): Result<URL, string> {
 *   try {
 *     return ok(new URL(parameter));
 *   } catch {
 *     return err('The argument did not resolve to a valid URL.');
 *   }
 * }
 *
 * // Define a class extending `Argument`, then export it.
 * // NOTE: You can use `export default` or `export =` too.
 * export class CoreArgument extends Argument<URL> {
 *   public constructor(context: PieceContext) {
 *     super(context, { name: 'hyperlink', aliases: ['url'] });
 *   }
 *
 *   public run(parameter: string): ArgumentResult<URL> {
 *     const resolved = resolveHyperlink(parameter);
 *     if (resolved.success) return this.ok(resolved.value);
 *     return this.error({ parameter, message: resolved.error, context });
 *   }
 * }
 *
 * // Augment the ArgType structure so `args.pick('url')`, `args.repeat('url')`
 * // and others have a return type of `URL`.
 * declare module '@sapphire/framework/dist/lib/utils/Args' {
 *   export interface ArgType {
 *     url: URL;
 *   }
 * }
 * ```
 *
 * @example
 * ```javascript
 * // JavaScript:
 * const { Argument, err, ok } = require('@sapphire/framework');
 *
 * function resolveHyperlink(parameter) {
 *   try {
 *     return ok(new URL(parameter));
 *   } catch {
 *     return err('The argument did not resolve to a valid URL.');
 *   }
 * }
 *
 * // Define a class extending `Argument`, then export it.
 * module.exports = class CoreArgument extends Argument {
 *   constructor(context) {
 *     super(context, { name: 'hyperlink', aliases: ['url'] });
 *   }
 *
 *   run(parameter) {
 *     const resolved = resolveHyperlink(parameter);
 *     if (resolved.success) return this.ok(resolved.value);
 *     return this.error(parameter, 'ArgumentHyperlinkInvalidURL', resolved.error);
 *   }
 * }
 * ```
 */
export abstract class Argument<T = unknown> extends AliasPiece implements IArgument<T> {
	public abstract run(parameter: string, context: ArgumentContext<T>): ArgumentResult<T>;

	/**
	 * Wraps a value into a successful value.
	 * @param value The value to wrap.
	 */
	public ok(value: T): ArgumentResult<T> {
		return Args.ok(value);
	}

	/**
	 * Constructs an {@link ArgumentError} with a custom type.
	 * @param parameter The parameter that triggered the argument.
	 * @param type The identifier for the error.
	 * @param message The description message for the rejection.
	 */
	public error(options: Omit<ArgumentError.Options<T>, 'argument'>): ArgumentResult<T> {
		return Args.error({ argument: this, identifier: this.name, ...options });
	}
}

export interface ArgumentOptions extends AliasPieceOptions {}

export interface ArgumentContext<T = unknown> extends Record<PropertyKey, unknown> {
	argument: IArgument<T>;
	args: Args;
	message: Message;
	command: Command;
	commandContext: CommandContext;
	minimum?: number;
	maximum?: number;
	inclusive?: boolean;
}
