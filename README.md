# @srvem/app
Srvem (pronounced "serve 'em") is a super-fast and minimalist middleware-oriented and Promise-based asynchronous TypeScript server for Node.js.  
This is the core package of the framework.
  
## Installation
> `npm install --save @srvem/app`
  
## Usage
```typescript
import { Srvem } from '@srvem/app'

const app = new Srvem()

// app.use( middleware1 )
// app.use( middleware2, middleware3 ) // ...
// app.handle( handlerFuncion4 )
// app.handle( handler5, handler6, handler7 ) // ...

app.ready().listen(80)

```
    
## Public API
```typescript
class Srvem {

  // SrvMiddlewareBlueprint is an abstract super class inherited by srvem middlewares
  use(...middleware: SrvMiddlewareBlueprint[]): void

  // handlers are functions that can modify the context on request (just like middlewares)
  handle(...handlers: ((ctx: SrvContext) => Promise<SrvContext>)[]): void

  // returns a Server from the built-in Node.js 'http' module
  // the `.listen()` method can be called on this Server
  ready(): Server

  // the return value of this.ready() is stored on this field (for an easier access)
  // returns null if ready() hasn't been called yet
  server: Server

}

```
  
## See Also
- [@srvem/static](https://github.com/srvem/static) to serve static files from a specified directory.
- [@srvem/router](https://github.com/srvem/router) to develop routers and server APIs with asynchronous request handlers.
  
## Credits
Kaleab S. Melkie _<<kaleabmelkie@gmail.com>>_
  
## License
MIT License  
Copyright &copy; 2017 srvem
  
Made with &#10084; in Addis Ababa.
