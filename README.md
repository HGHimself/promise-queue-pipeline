# 🥕Karat🔗
## The Golden Standard Promise Queue Pipeline

### Forethoughts
A pattern I have gotten very comfortable with is chaining methods. It comes naturally in javascript while working with arrays. I wanted to bring it into my own classes, so some research was done. The initial work is documented in an [article](https://medium.com/dev-genius/async-method-chaining-in-node-8c24c8c3a28d) I wrote in the spring of 2020. To summarize, we take a journey that connects regular chained method on arrays to custom build classes with asynchronous, chainable methods.

### What is a Promise Queue Pipeline?
##### A neat way to link methods on your classes!
Promises are neat in very many different ways. We can leverage promises in Javascript to utilize their power in asserting order of code execution. Passing some code that looks like `(param) => {}` to a promise through `.then` will allow us to run that code after the promise resolves. Even cooler, the resolved value will be handed to our code through the parameters! Using these two properties, it is possible to link promises and build a pipeline. Let's dive in.

Assume we have a variable that is called `queue`. At any given time in our code, this `queue` is a promise. This promise initially is a `Promise.resolve()`. Now assume that we have a method that will, given a handler, pass the code into `queue.then(handler)`. A new promise gets created by `.then` and we reassign our `queue`. We can call this method, called `chain`, many times to build out the `queue`. Here is a small example of how the `queue` can grow.

```javascript
queue = Promise.resolve()

queue = Promise.resolve.then( (o1) => {/* code */} )

queue = Promise.resolve.then( (o1) => {/* code */} ).then( (o2) => {/* code */} )
```
