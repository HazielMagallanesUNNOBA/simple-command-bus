import MethodNameInflector from './MethodNameInflector.js';

export default class HandleClassNameInflector extends MethodNameInflector {

    inflect(commandName, handler) {
        return 'handle' + commandName;
    }
    
};