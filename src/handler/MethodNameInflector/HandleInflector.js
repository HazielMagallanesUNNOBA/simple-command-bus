import lod from 'lodash';
import MethodNameInflector from './MethodNameInflector.js';
import InvalidHandlerMethodException from '../../exceptions/InvalidHandlerMethodException.js';

export default class HandleInflector extends MethodNameInflector {
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
