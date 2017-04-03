# express-dirview-middleware

## View

![](https://ooo.0o0.ooo/2017/04/04/58e29153cc5e8.jpg)


## Usage

```bash
npm install --save express-dirview-middleware
```

```js
const express = require('express');
const app = express();
const dirMiddleware = require('express-dirview-middleware');

app.listen(8080);
app.use("/", dirMiddleware({root: "."}));
```
