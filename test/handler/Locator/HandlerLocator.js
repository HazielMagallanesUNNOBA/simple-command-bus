/* global it, describe */
import { expect } from 'chai';
import HandlerLocator from '../../../src/handler/Locator/HandlerLocator.js';

describe('Testing Abstract HandlerLocator', () => {
	it('Abstract instance thrown an error', () => {
		const locator = new HandlerLocator();
		expect(locator.getHandlerForCommand).to.throw();
	});
});
