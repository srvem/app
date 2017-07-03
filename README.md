# @srvem/app
Srvem (pronounced "serve 'em") is a super-fast and minimalist middleware-oriented TypeScript server for Node.js. This is the core package of the framework.
  
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

app.start().listen(80)

```
    
## Public API
```typescript
class Srvem {

  // SrvMiddleware is from the '@srvem/middleware' module
  // it is a blueprint (super and abstract class) for all other srvem middlewares
  use(...middleware: SrvMiddleware[]): void

  // handlers are middleware functions called when a request is recieved
  handle(...handlers: ((request: SrvRequest, response: SrvResponse) => void)[]): void

  // returns a Server from the built-in Node.js 'http' module
  // the listen method can be called on Server
  start(): Server

  // Server from Node.js' 'http' module
  // returns null if start() hasn't been called yet
  server: Server

}

```
  
## See Also
- [@srvem/static](https://github.com/srvem/static) to serve static files from a specified directory.
- [@srvem/router](https://github.com/srvem/router) to develop routers and server APIs with asynchronous request handlers.
- [@srvem/middleware](https://github.com/srvem/static) to create your own custom middleware for Srvem apps.
  
## Credits
Kaleab S. Melkie (<kaleabmelkie@gmail.com>)
  
## License
MIT License  
Copyright &copy; 2017 srvem
  
Made with &#10084; in Addis Ababa.
