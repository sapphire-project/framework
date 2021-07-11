export {
	AliasPiece,
	AliasPieceOptions,
	AliasStore,
	container,
	LoaderError,
	MissingExportsError,
	Piece,
	PieceContext,
	PieceOptions,
	Store,
	StoreOptions
} from '@sapphire/pieces';
export type { Awaited } from '@sapphire/utilities';
export * from './arguments';
export * from './lib/errors/ArgumentError';
export * from './lib/errors/Identifiers';
export * from './lib/errors/PreconditionError';
export * from './lib/errors/UserError';
export * from './lib/parsers/Args';
export * from './lib/parsers/Maybe';
export * from './lib/parsers/Result';
export * from './lib/plugins/Plugin';
export * from './lib/plugins/PluginManager';
export * from './lib/plugins/symbols';
export * from './lib/resolvers';
export * from './lib/SapphireClient';
export * from './lib/structures/Argument';
export * from './lib/structures/ArgumentStore';
export * from './lib/structures/Command';
export * from './lib/structures/CommandStore';
export * from './lib/structures/Listener';
export * from './lib/structures/ListenerStore';
export * from './lib/structures/ExtendedArgument';
export * from './lib/structures/Precondition';
export * from './lib/structures/PreconditionStore';
export * from './lib/structures/StoreRegistry';
export * from './lib/types/Enums';
export * from './lib/types/Events';
export * from './lib/utils/logger/ILogger';
export * from './lib/utils/logger/Logger';
export * from './lib/utils/preconditions/conditions/IPreconditionCondition';
export * from './lib/utils/preconditions/conditions/PreconditionConditionAnd';
export * from './lib/utils/preconditions/conditions/PreconditionConditionOr';
export * from './lib/utils/preconditions/containers/PermissionsPrecondition';
export * from './lib/utils/preconditions/IPreconditionContainer';
export * from './lib/utils/preconditions/PreconditionContainerArray';
export * from './lib/utils/preconditions/PreconditionContainerSingle';

export const version = '[VI]{version}[/VI]';
