const Chainable = ( agent ) => {

  // using await on the chain resolves to the last promise
  const then = ( agent ) => ( callback ) => {
    callback(agent._queue);
  }

  // builds a chain of promises
  // looks like: Promise.resolve().then(c1 => c1.then(c2 => c2.then))
  const chain = ( agent ) => ( callback ) => {
    agent._queue = agent._queue.then( callback );
    return agent._queue;
  }

  const result = ( agent ) => () => {
    console.log("getting results");
    agent.chain(() => this.context);
    return this;
  }

  //
  const convertFuncToChain = (agent, funcName) => {
    const funcHold = agent[funcName];
    // reassign the function
    agent[funcName] = outer => { // from invokation in chain
      // add func to its promise chain
      agent.chain( inner => { // from previous chain link
        if ( inner && inner.halt ) { return inner; }
        return funcHold.bind(agent)({inner, outer});
      });
      // resolve to itself
      return agent;
    }
  }

  const getClassMethods = ( agent ) => Object.getOwnPropertyNames(Object.getPrototypeOf(agent));

  agent.then = then(agent);
  agent.chain = chain(agent);
  agent.result = result(agent);

  agent._queue = Promise.resolve();
  agent.context = {counter: 0};

  // turn every method on the prototype into a chain method
  getClassMethods(agent)
    .filter(func => func != 'constructor')
    .forEach(func => convertFuncToChain(agent, func));

  console.log("Done setting up the agent.\n", agent);
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
    return this.context;
  }

  async asyncWait() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("waiting done!");
  }
}

(async () => {
  {
    // let res = await Chainable(new Agent())
    //   .receiveParams({alpha: 1})
    //   .receiveParams({beta: 2})
    //   .receiveParams({gamma: 3})
    //   .receiveParams({deltta: 4});
    // console.log('\nDONE!', res);
  }

  {
    let res = await Chainable(new Agent())
      .useContext()
      .useContext()
      .useContext()
      .useContext()
      .useContext()
      .useContext()
      .result();

    console.log('\nDONE!', res);

  }
  // const res = await Chainable(new Agent())
  //   .asyncWait()
  //   .asyncWait()
  //   .result()

  // console.log('\n\nDONE!', res);
})();
/*
executing
{ inner: undefined, outer: { alpha: 0 } }

executing
{
  inner: { inner: undefined, outer: { alpha: 0 } },
  outer: { beta: 2, alpha: 0 }
}

executing
{
  inner: {
    inner: { inner: undefined, outer: [Object] },
    outer: { beta: 2, alpha: 0 }
  },
  outer: { gamma: 3, halt: 1, alpha: 0 },
  halt: 1
}
*/
