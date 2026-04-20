import lod from 'lodash';
import HandlerLocator from './HandlerLocator.js';
import MissingHandlerException from '../../exceptions/MissingHandlerException.js';
import InvalidCommandException from '../../exceptions/InvalidCommandException.js';

export default class InMemoryLocator extends HandlerLocator {
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
