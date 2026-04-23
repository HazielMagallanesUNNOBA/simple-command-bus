import lod from 'lodash';
import fs from 'fs';
import path from 'path';
import camelCaseStr from 'lodash/camelCase';
import upperFirstStr from 'lodash/upperFirst';

/**
 * Abstract class for a middleware
 */
class Middleware {
	execute(command, next) {
		throw new Error('execute method must be implemented');
	}
}

/**
 * Abstract class for a command
 */
class Command {
}

function createException(name, options = {}) {
	class Exception extends Error {
		constructor(message, code) {
			super(options.message || message);

			if (Error.captureStackTrace) {
				Error.captureStackTrace(this, this.constructor);
			} else {
				this.stack = (new Error()).stack;
			}

			this.code = options.code || code;
		}
	}

	Exception.prototype.name = name;
	Exception.prototype.type = 'Exception';
	Exception.prototype.constructor = Exception;

	return Exception;
}

const InvalidMiddlewareException = createException('InvalidMiddlewareException', {
	message: 'Invalid Middleware'
});

InvalidMiddlewareException.forMiddleware = (middleware) => {
	let message = null;

	if (lod.isObject(middleware)) {
		message = `Middleware ${middleware.constructor.name} is invalid. It must extend from Middleware`;
	}

	throw new InvalidMiddlewareException(message);
};

const InvalidCommandException = createException('InvalidCommandException', {
	message: 'Invalid Command'
});

InvalidCommandException.forCommand = (command) => {
	let message = null;

	if (lod.isObject(command)) {
		message = `Command ${command.constructor.name} is invalid. It must extend from Command.`;
	}

	throw new InvalidCommandException(message);
};

// Intend to define private property
const stack = Symbol('stack');

/**
 * Bus that run and handle commands through middlewares
 */
class CommandBus {
	constructor(middlewares = []) {
		this[stack] = middlewares;
	}

	getMiddlewareStack() {
		return this[stack];
	}

	handle(command) {
		if (command instanceof Command === false) {
			InvalidCommandException.forCommand(command);
		}

		const runCommandInMiddlewareStack = this[stack].reduceRight(
			(next, middleware) => {
				if (middleware instanceof Middleware === false) {
					InvalidMiddlewareException.forMiddleware(middleware);
				}

				return middleware.execute.bind(middleware, command, next);
			},
			() => null
		);

		const result = runCommandInMiddlewareStack();

		return result;
	}
}

const isDirectory = dir => fs.lstatSync(dir).isDirectory();

// eslint-disable-next-line max-len
const walkSync = file => (isDirectory(file) ? fs.readdirSync(file).map(f => walkSync(path.join(file, f))) : file);

const camelCase = s => camelCaseStr(s);

const upperFirst = s => upperFirstStr(s);

const isString = s => typeof s === 'string';

const isFunction = f => typeof f === 'function';

const cachedCommands = {};

const CreateCommandBusProxy = function CreateCommandBusProxy(commandBus, commandsDir) {
	if (!commandsDir || !isDirectory(commandsDir)) {
		throw new Error('Invalid commands path.');
	}

	const availableCommands = walkSync(commandsDir);

	return new Proxy({}, {
		get(target, propKey) {
			const commandName = `${upperFirst(camelCase(propKey))}Command.js`;

			if (!cachedCommands[commandName]) {
				const foundCommand = availableCommands.find(command => command.endsWith(commandName));

				if (!foundCommand) {
					throw new Error(`Command "${commandName}" not found.`);
				}

				cachedCommands[commandName] = require(foundCommand); // eslint-disable-line
			}

			const Command = cachedCommands[commandName];

			if (isFunction(Command) === false) {
				throw new Error(`Command "${commandName}" is not callable.`);
			}

			return (...args) => commandBus.handle(new Command(...args));
		}
	});
};

const InvalidHandlerMethodException = createException('InvalidHandlerMethodException', {
	message: 'Invalid handler method.'
});

InvalidHandlerMethodException.forMethod = (method) => {
	throw new InvalidHandlerMethodException(`Invalid handler method ${method}.`);
};

const MissingHandlerException = createException('MissingHandlerException', {
	message: 'Invalid Command'
});

MissingHandlerException.forCommand = (commandName) => {
	let message = null;

	if (lod.isString(commandName)) {
		message = `There is no a handler for "${commandName}" Command.`;
	}

	throw new MissingHandlerException(message);
};

class LoggerMiddleware extends Middleware {
	constructor(logger) {
		super();
		this.logger = logger;
	}

	execute(command, next) {
		this.logger.log('Before command: ', command);
		const returnValue = next(command);
		this.logger.log('After command result: ', command, returnValue);
		return returnValue;
	}
}

class CommandNameExtractor {
	extractName(command) {
		throw new Error('extractName method must be implemented');
	}
}

class MethodNameInflector {
	inflect(command) {
		throw new Error('inflect method must be implemented');
	}
}

class HandlerLocator {
	getHandlerForCommand(command) {
		throw new Error('getHandlerForCommand method must be implemented');
	}
}

// Intend to define private property
const _commandNameExtractor = Symbol('commandNameExtractor');
const _handlerLocator = Symbol('handlerLocator');
const _methodNameInflector = Symbol('methodNameInflector');

class CommandHandlerMiddleware extends Middleware {
	constructor(commandNameExtractor, handlerLocator, methodNameInflector) {
		super();
		this[_commandNameExtractor] = commandNameExtractor;
		this[_handlerLocator] = handlerLocator;
		this[_methodNameInflector] = methodNameInflector;
	}

	set commandNameExtractor(commandNameExtractor) {
		this[_commandNameExtractor] = commandNameExtractor;
	}

	set handlerLocator(handlerLocator) {
		this[_handlerLocator] = handlerLocator;
	}

	set methodNameInflector(methodNameInflector) {
		this[_methodNameInflector] = methodNameInflector;
	}

	execute(command, next) {
		let commandName = null;
		let handler = null;
		let methodName = null;
		let result = null;

		if (this[_commandNameExtractor] instanceof CommandNameExtractor) {
			commandName = this[_commandNameExtractor].extractName(command);
		}

		if (commandName && this[_handlerLocator] instanceof HandlerLocator) {
			handler = this[_handlerLocator].getHandlerForCommand(commandName);
		}

		if (commandName && handler && this[_methodNameInflector] instanceof MethodNameInflector) {
			methodName = this[_methodNameInflector].inflect(commandName, handler);
		}

		if (handler && lod.isFunction(handler[methodName])) {
			// eslint-disable-next-line no-useless-call
			result = handler[methodName].call(handler, command);
		}

		return result || null;
	}
}

class ClassNameExtractor extends CommandNameExtractor {
	extractName(command) {
		if (lod.isObject(command) === false ||
			lod.isString(command.constructor.name) === false
		) {
			throw new InvalidCommandException('Invalid Command Name.');
		}

		return command.constructor.name;
	}
}

class HandleInflector extends MethodNameInflector {
	constructor(methodName) {
		super();
		this.methodName = methodName || 'handle';
	}

	inflect(commandName, handler) {
		if (lod.isFunction(handler[this.methodName]) === false) {
			InvalidHandlerMethodException.forMethod(this.methodName);
		}

		return this.methodName;
	}
}

class InMemoryLocator extends HandlerLocator {
	constructor(handlers = {}) {
		super();
		this.handlers = {};
		if (lod.isObject(handlers)) {
			this.handlers = lod.reduce(handlers, (carry, Handler, key) => {
				carry[key] = lod.isFunction(Handler) ? new Handler() : Handler; // eslint-disable-line
				return carry;
			}, {});
		}
	}

	getHandlerForCommand(commandName) {
		if (lod.isString(commandName) === false) {
			throw new InvalidCommandException();
		}

		const handlerName = commandName.replace('Command', 'Handler');

		if (lod.has(this.handlers, handlerName) === false) {
			MissingHandlerException.forCommand(commandName);
		}

		return this.handlers[handlerName];
	}
}

class NamespaceHandlerLocator extends HandlerLocator {
	constructor(handlersPath) {
		super();

		if (!handlersPath || !isDirectory(handlersPath)) throw new Error('Invalid commands path.');

		// O(1) lookup map for instant handler retrieval
		this.handlersMap = new Map();
		const handlerPaths = walkSync(handlersPath);

		// Pre-load handlers into memory once during initialization for maximum scalability
		handlerPaths.forEach((filePath) => {
			// eslint-disable-next-line max-len
			// Targeted disable since dynamic loading is the explicit architectural purpose of this boot sequence
			// eslint-disable-next-line import/no-dynamic-require, global-require
			const HandlerModule = require(filePath);
			const Handler = HandlerModule.default || HandlerModule;

			if (isFunction(Handler)) {
				// Extracts the exact handler class name (e.g. "CreateUserHandler") from the file path
				const match = filePath.match(/([^/]+)\.js$/);
				if (match) this.handlersMap.set(match[1], Handler);
			}
		});
	}

	getHandlerForCommand(commandName) {
		if (!isString(commandName)) throw new InvalidCommandException();

		const handlerName = commandName.replace('Command', 'Handler');
		const Handler = this.handlersMap.get(handlerName);

		// Ensure the exception actually throws to prevent continuing with an undefined Handler
		if (!Handler) throw MissingHandlerException.forCommand(commandName);

		return new Handler();
	}
}

export { ClassNameExtractor, Command, CommandBus, CommandHandlerMiddleware, CommandNameExtractor, CreateCommandBusProxy, HandleInflector, HandlerLocator, InMemoryLocator, InvalidCommandException, InvalidHandlerMethodException, InvalidMiddlewareException, LoggerMiddleware, MethodNameInflector, Middleware, MissingHandlerException, NamespaceHandlerLocator, CommandBus as default };
