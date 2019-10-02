# This is Core module of project Lambdulus

## Documentation of some features (will be growing with time)

### SLI - Single Letter Identifiers

Lambdulus allows shorthand syntax for quicker typing. It looks for example like this:
`(λ x y z . y z x)`

this is known as MultiLambda. This convention is purely syntactic sugar. It is simplification for:
`(λ x . (λ y . (λ z . (y z x) )))`

Hovewer this example can be written even shortly. With SLI enabled we can write it like:
`(λxyz.yzx)`
It means the same thing - this whitespace-omitting practice originated from white-board writing.
On the white-board there is no simple way to properly write whitespaces - so we used to omit them altogether.

### SLI - Rules:

- identifier in SLI mode can be :
  - single alphabetic character like: `a` or `b` in following expression: `+ a b`
  - it can also be single character followed be single numeric literal like `c2`
  - it can be sequence of alphabetic characters - like `abc` then it is understood like `a b c`
  - it can also be sequence of alphanumeric characters -
  there each numeric character must be preceeded by at least one alphabetic character
  and there must not be more than one numeric character standing immediately next to another numeric character
  like this expression: `A1BB2C3DDD` - it is understood as: `A1 B B2 C3 D D D`
  
  Hovewer, Lambdulus also implements Macros - known abstractions. They are typically named with all upper-case letters.
  Like: `ZERO` or `PREV` and so on. These are also available in SLI mode.
  
  To succesfully use multi-char Macros in SLI mode they must be followed by whitespace. For example: `ZERO 0` is valid SLI expression
  utilising Macro `ZERO`.
  
  On the other hand expression `ZEROZERO 0` is not understood as `ZERO ZERO 0` but as `Z E R O Z E R O`.
  
  Same goes for expressions as `ZERO1ZERO2 0`. It is understood as `Z E R O1 Z E R O2 0`.
  
  Finally expressions as `ZERO12ZERO 0` would be understood as `Z E R O12 Z E R O 0` - which is syntacticaly incorrect - because of two numeric characters following letter O.
  This will result in syntax error.
