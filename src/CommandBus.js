import Middleware from './Middleware.js';
import Command from './Command.js';
import InvalidMiddlewareException from './exceptions/InvalidMiddlewareException.js';
import InvalidCommandException from './exceptions/InvalidCommandException.js';

// Intend to define private property
const stack = Symbol('stack');

/**
 * Bus that run and handle commands through middlewares
 */
export default class CommandBus {
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
