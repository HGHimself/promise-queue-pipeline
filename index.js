const Chainable = ( agent ) => {

  // using await on the chain resolves to the last promise
  const then = ( agent ) => ( callback ) => {
    callback(agent._queue);
  }

  // builds a chain of promises
  // looks like: Promise.resolve().then(c1 => c1.then(c2 => c2.then))
  const chain = ( agent ) => ( callback ) => {
    agent._queue = agent._queue.then( callback );
    //return agent._queue;
  }

  const result = ( agent ) => () => {
    agent.chain(() => agent.context);
    return agent;
  }

  const convertFuncToChain = (agent, funcName) => {
    const funcHold = agent[funcName];
    agent[funcName] = outer => {
      agent.chain( inner => {
        if ( inner && inner.halt ) { return inner; }
        return funcHold.bind(agent)({inner, outer});
      });
      return agent;
    }
  }

  const getClassMethods = ( agent ) => Object.getOwnPropertyNames(Object.getPrototypeOf(agent));

  agent.then = then(agent);
  agent.chain = chain(agent);
  agent.result = result(agent);

  agent._queue = Promise.resolve();
  agent.context = {counter: 0};

  getClassMethods(agent)
    .filter(func => func != 'constructor')
    .forEach(func => convertFuncToChain(agent, func));

  return agent;
}

class Agent {
  constructor() { this.var = 1; }

  receiveParams( context ) {
    if ( context.outer.gamma ) { context.halt = 1; }
    console.log("executing", context);
    return context;
  }

  useContext( context ) {
    this.context.counter++;
    console.log(this.context, context);
  }

  // this is similar to usings some db call or something
  async asyncWait() {
    this.context.counter++;
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("waiting done!");
  }
}

(async () => {
  {
    const chainableAgent = Chainable(new Agent())
    const res = await chainableAgent
      .receiveParams({alpha: 1})
      .receiveParams({beta: 2})
      .receiveParams({gamma: 3})
      .receiveParams({delta: 4});
    console.log('\nDONE!', res);
  }

  {
    // const chainableAgent = Chainable(new Agent())
    // const res = await chainableAgent
    //   .useContext()
    //   .useContext()
    //   .useContext()
    //   .useContext()
    //   .useContext()
    //   .useContext()
    //   .result();
    // console.log('\nDONE!', res);
  }

  {
    // const chainableAgent = Chainable(new Agent())
    // const res = await chainableAgent
    //   .asyncWait()
    //   .asyncWait()
    //   .asyncWait()
    //   .result();
    // console.log('\nDONE!', res);
  }
})();
