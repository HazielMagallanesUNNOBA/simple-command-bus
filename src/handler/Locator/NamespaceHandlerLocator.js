import { isString, isFunction, isDirectory, walkSync } from '../../utils.js';
import HandlerLocator from './HandlerLocator.js';
import MissingHandlerException from '../../exceptions/MissingHandlerException.js';
import InvalidCommandException from '../../exceptions/InvalidCommandException.js';

export default class NamespaceHandlerLocator extends HandlerLocator {
	constructor(handlersPath) {
		super();

		if (!handlersPath || !isDirectory(handlersPath)) {
			throw new Error('Invalid commands path.');
		}

		this.handlers = walkSync(handlersPath);
	}

	getHandlerForCommand(commandName) {
		if (isString(commandName) === false) {
			throw new InvalidCommandException();
		}

		const handlerName = `${commandName.replace('Command', 'Handler')}.js`;
		const foundHandler = this.handlers.find(handler => handler.endsWith(handlerName));

		if (!foundHandler) {
			MissingHandlerException.forCommand(commandName);
		}

		const Handler = require(foundHandler);

		if (isFunction(Handler) === false) {
			MissingHandlerException.forCommand(commandName);
		}

		return new Handler();
	}
}
