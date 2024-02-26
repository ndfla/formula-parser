## Functions
| Name | Arguments | Syntax | Meaning |
| ---- | ---- | ---- | :----: | 
| `sin` | 1 | `sin(x)`  | $\sin(x)$ |
| `cos` | 1 | `cos(x)`  | $\cos(x)$ |
| `tan` | 1 | `tan(x)` | $\tan(x)$ |
| `asin` | 1 | `asin(x)` | $\arcsin(x)$ |
| `acos` | 1 | `acos(x)` | $\arccos(x)$ |
| `atan` | 1 | `atan(x)`| $\arctan(x)$ |
| `sinh` | 1 | `sinh(x)`| $\sinh(x)$ |
| `cosh` | 1 | `cosh(x)` | $\cosh(x)$ |
| `tanh` | 1 | `tanh(x)` | $\tanh(x)$ |
| `sinc` | 1 | `sinc(x)` | $\dfrac{\sin(x)}{x}$ |
| `exp` | 1 | `exp(x)` | $\exp(x)$ |
| `log2` | 1 | `log2(x)` | $\log_2(x)$ |
| `log` | 1 | `log(x)` | $\log(x)$ |
| `abs` | 1 | `abs(x)` | $\|x\|$ |
| `sign` | 1 | `sign(x)` | $` \begin{cases} 1 & (x > 0) \\ -1 & (x < 0) \\ 0 & (x = 0)   \end{cases} `$ |
| `sum` | 4 | `sum(f(k), k, n, m)` | $$\sum_{k=n}^{m} f(k) $$ |
| `avg` | n | `avg(x_1, x_2, ..., x_n)` | $\dfrac{1}{n}(x_1 + x_2 + \dots + x_n)$|
| `case` | 3 | `case(bool, f_1, f_2 )` | $` \begin{cases} f_1 & (bool = 1) \\ f_2 & (bool = 0)  \end{cases} `$|

## Operations 

| Operater | Syntax | Meaning | Priority |
| :----: |  :----: | :---- | ---- |
| `+` | `a + b` | addition | 2 |
| `-` | `a - b` | subtraction | 2|
| `-` | `-a` | negation | 2 |
| `*` | `a * b` | multiplication | 3|
| `/` | `a / b` | division | 3 |
| `^` |`a ^ b` | exponential | 4 |
| `<` | `a < b` | less than | 1 |
| `>` | `a > b` | more than | 1|

## Constants and Variables

| Name | Explanation | 
| ---- | ---- |
| `pi` | $\pi = 3.1415926535\dots$ |
| `e` | $e = 2.7182818284\dots$ |
| `x` | current time-value getting plotted, from 0.0 to 1.0 |
| `y` | current table number, from 0.0 to 1.0 |
| `w` | current table number, from 1 to number of waves |
| `rand` | random numbers from -0.5 to 0.5 |
