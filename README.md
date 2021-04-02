### Usage ###

```
const firebaseAuth = require('@approoted/firebase-auth')({ apiKey: 'xxx' })
```

### Methods ###

```
signUpWithEmailAndPassword({ email, password }) // Promise
signInWithEmailAndPassword{ email, password } // Promise
refreshIdToken(refreshToken) // Promise
```