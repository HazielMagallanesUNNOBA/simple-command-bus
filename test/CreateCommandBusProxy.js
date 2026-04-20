/* global it, describe */
import { expect } from 'chai';
import sinon from 'sinon';
import mock from 'mock-require';
import * as utils from '../src/utils.js';
import CommandBus from '../src/CommandBus.js';
import CreateCommandBusProxy from '../src/CreateCommandBusProxy.js';
import Command from '../src/Command.js';
import CommandHandlerMiddleware from '../src/handler/CommandHandlerMiddleware.js';
import ClassNameExtractor from '../src/handler/CommandNameExtractor/ClassNameExtractor.js';
import HandleInflector from '../src/handler/MethodNameInflector/HandleInflector.js';
import InMemoryLocator from '../src/handler/Locator/InMemoryLocator.js';


describe('Testing CommandBus with proxy', function() {
	it('Handling a command with handler', function() {

		sinon.stub(utils, 'walkSync').returns([ 'FooCommand.js' ])
		sinon.stub(utils, 'isDirectory').returns(true);

		class FooCommand extends Command {}
		class FooHandler { handle() { return 1 } }

		mock('FooCommand.js', FooCommand);

		const bus = new CommandBus([
			new CommandHandlerMiddleware(
			new ClassNameExtractor(),
			new InMemoryLocator({ FooHandler }),
			new HandleInflector()
		)]);

		const busProxy = CreateCommandBusProxy(bus, '/path/to/commands');

		const result = busProxy.foo();

		expect(result).to.be.equal(1);
	});
});
