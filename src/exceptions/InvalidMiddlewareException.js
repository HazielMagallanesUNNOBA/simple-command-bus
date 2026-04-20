import createException from './createException.js';
import lod from 'lodash';

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

export default InvalidMiddlewareException;
