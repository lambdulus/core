const Z = (f) => ((xx) => f ( (v) => (xx (xx))(v))) ((f) => ((xx) => f ( (v) => (xx (xx))(v))))

const ID = a => a
const PRED = x => s => z => ((x ( f => g => g (f (s)) ))((g) => z))(ID)

const ONE = s => z => s (z)
const TWO = s => z => s (s (z))
const NOT = p => a => b => p (b (a))
const MINUS = m => n => (n (PRED))(m)

const fn = f => n => ((NOT (n))(ONE)) (f( (MINUS (n))(ONE)  ))

const result = (Z ( fn)) (TWO)
console.log(result)
console.log(result.toString())
