(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Elucidator = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
;(function (globalScope) {
  'use strict';


  /*!
   *  decimal.js v10.4.2
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   */


  // -----------------------------------  EDITABLE DEFAULTS  ------------------------------------ //


    // The maximum exponent magnitude.
    // The limit on the value of `toExpNeg`, `toExpPos`, `minE` and `maxE`.
  var EXP_LIMIT = 9e15,                      // 0 to 9e15

    // The limit on the value of `precision`, and on the value of the first argument to
    // `toDecimalPlaces`, `toExponential`, `toFixed`, `toPrecision` and `toSignificantDigits`.
    MAX_DIGITS = 1e9,                        // 0 to 1e9

    // Base conversion alphabet.
    NUMERALS = '0123456789abcdef',

    // The natural logarithm of 10 (1025 digits).
    LN10 = '2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058',

    // Pi (1025 digits).
    PI = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789',


    // The initial configuration properties of the Decimal constructor.
    DEFAULTS = {

      // These values must be integers within the stated ranges (inclusive).
      // Most of these values can be changed at run-time using the `Decimal.config` method.

      // The maximum number of significant digits of the result of a calculation or base conversion.
      // E.g. `Decimal.config({ precision: 20 });`
      precision: 20,                         // 1 to MAX_DIGITS

      // The rounding mode used when rounding to `precision`.
      //
      // ROUND_UP         0 Away from zero.
      // ROUND_DOWN       1 Towards zero.
      // ROUND_CEIL       2 Towards +Infinity.
      // ROUND_FLOOR      3 Towards -Infinity.
      // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
      // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
      // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
      // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
      // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
      //
      // E.g.
      // `Decimal.rounding = 4;`
      // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
      rounding: 4,                           // 0 to 8

      // The modulo mode used when calculating the modulus: a mod n.
      // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
      // The remainder (r) is calculated as: r = a - n * q.
      //
      // UP         0 The remainder is positive if the dividend is negative, else is negative.
      // DOWN       1 The remainder has the same sign as the dividend (JavaScript %).
      // FLOOR      3 The remainder has the same sign as the divisor (Python %).
      // HALF_EVEN  6 The IEEE 754 remainder function.
      // EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)). Always positive.
      //
      // Truncated division (1), floored division (3), the IEEE 754 remainder (6), and Euclidian
      // division (9) are commonly used for the modulus operation. The other rounding modes can also
      // be used, but they may not give useful results.
      modulo: 1,                             // 0 to 9

      // The exponent value at and beneath which `toString` returns exponential notation.
      // JavaScript numbers: -7
      toExpNeg: -7,                          // 0 to -EXP_LIMIT

      // The exponent value at and above which `toString` returns exponential notation.
      // JavaScript numbers: 21
      toExpPos:  21,                         // 0 to EXP_LIMIT

      // The minimum exponent value, beneath which underflow to zero occurs.
      // JavaScript numbers: -324  (5e-324)
      minE: -EXP_LIMIT,                      // -1 to -EXP_LIMIT

      // The maximum exponent value, above which overflow to Infinity occurs.
      // JavaScript numbers: 308  (1.7976931348623157e+308)
      maxE: EXP_LIMIT,                       // 1 to EXP_LIMIT

      // Whether to use cryptographically-secure random number generation, if available.
      crypto: false                          // true/false
    },


  // ----------------------------------- END OF EDITABLE DEFAULTS ------------------------------- //


    Decimal, inexact, noConflict, quadrant,
    external = true,

    decimalError = '[DecimalError] ',
    invalidArgument = decimalError + 'Invalid argument: ',
    precisionLimitExceeded = decimalError + 'Precision limit exceeded',
    cryptoUnavailable = decimalError + 'crypto unavailable',
    tag = '[object Decimal]',

    mathfloor = Math.floor,
    mathpow = Math.pow,

    isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,
    isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,
    isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,
    isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,

    BASE = 1e7,
    LOG_BASE = 7,
    MAX_SAFE_INTEGER = 9007199254740991,

    LN10_PRECISION = LN10.length - 1,
    PI_PRECISION = PI.length - 1,

    // Decimal.prototype object
    P = { toStringTag: tag };


  // Decimal prototype methods


  /*
   *  absoluteValue             abs
   *  ceil
   *  clampedTo                 clamp
   *  comparedTo                cmp
   *  cosine                    cos
   *  cubeRoot                  cbrt
   *  decimalPlaces             dp
   *  dividedBy                 div
   *  dividedToIntegerBy        divToInt
   *  equals                    eq
   *  floor
   *  greaterThan               gt
   *  greaterThanOrEqualTo      gte
   *  hyperbolicCosine          cosh
   *  hyperbolicSine            sinh
   *  hyperbolicTangent         tanh
   *  inverseCosine             acos
   *  inverseHyperbolicCosine   acosh
   *  inverseHyperbolicSine     asinh
   *  inverseHyperbolicTangent  atanh
   *  inverseSine               asin
   *  inverseTangent            atan
   *  isFinite
   *  isInteger                 isInt
   *  isNaN
   *  isNegative                isNeg
   *  isPositive                isPos
   *  isZero
   *  lessThan                  lt
   *  lessThanOrEqualTo         lte
   *  logarithm                 log
   *  [maximum]                 [max]
   *  [minimum]                 [min]
   *  minus                     sub
   *  modulo                    mod
   *  naturalExponential        exp
   *  naturalLogarithm          ln
   *  negated                   neg
   *  plus                      add
   *  precision                 sd
   *  round
   *  sine                      sin
   *  squareRoot                sqrt
   *  tangent                   tan
   *  times                     mul
   *  toBinary
   *  toDecimalPlaces           toDP
   *  toExponential
   *  toFixed
   *  toFraction
   *  toHexadecimal             toHex
   *  toNearest
   *  toNumber
   *  toOctal
   *  toPower                   pow
   *  toPrecision
   *  toSignificantDigits       toSD
   *  toString
   *  truncated                 trunc
   *  valueOf                   toJSON
   */


  /*
   * Return a new Decimal whose value is the absolute value of this Decimal.
   *
   */
  P.absoluteValue = P.abs = function () {
    var x = new this.constructor(this);
    if (x.s < 0) x.s = 1;
    return finalise(x);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in the
   * direction of positive Infinity.
   *
   */
  P.ceil = function () {
    return finalise(new this.constructor(this), this.e + 1, 2);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal clamped to the range
   * delineated by `min` and `max`.
   *
   * min {number|string|Decimal}
   * max {number|string|Decimal}
   *
   */
  P.clampedTo = P.clamp = function (min, max) {
    var k,
      x = this,
      Ctor = x.constructor;
    min = new Ctor(min);
    max = new Ctor(max);
    if (!min.s || !max.s) return new Ctor(NaN);
    if (min.gt(max)) throw Error(invalidArgument + max);
    k = x.cmp(min);
    return k < 0 ? min : x.cmp(max) > 0 ? max : new Ctor(x);
  };


  /*
   * Return
   *   1    if the value of this Decimal is greater than the value of `y`,
   *  -1    if the value of this Decimal is less than the value of `y`,
   *   0    if they have the same value,
   *   NaN  if the value of either Decimal is NaN.
   *
   */
  P.comparedTo = P.cmp = function (y) {
    var i, j, xdL, ydL,
      x = this,
      xd = x.d,
      yd = (y = new x.constructor(y)).d,
      xs = x.s,
      ys = y.s;

    // Either NaN or ±Infinity?
    if (!xd || !yd) {
      return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
    }

    // Either zero?
    if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0;

    // Signs differ?
    if (xs !== ys) return xs;

    // Compare exponents.
    if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;

    xdL = xd.length;
    ydL = yd.length;

    // Compare digit by digit.
    for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
      if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
    }

    // Compare lengths.
    return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
  };


  /*
   * Return a new Decimal whose value is the cosine of the value in radians of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-1, 1]
   *
   * cos(0)         = 1
   * cos(-0)        = 1
   * cos(Infinity)  = NaN
   * cos(-Infinity) = NaN
   * cos(NaN)       = NaN
   *
   */
  P.cosine = P.cos = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.d) return new Ctor(NaN);

    // cos(0) = cos(-0) = 1
    if (!x.d[0]) return new Ctor(1);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
    Ctor.rounding = 1;

    x = cosine(Ctor, toLessThanHalfPi(Ctor, x));

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
  };


  /*
   *
   * Return a new Decimal whose value is the cube root of the value of this Decimal, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   *  cbrt(0)  =  0
   *  cbrt(-0) = -0
   *  cbrt(1)  =  1
   *  cbrt(-1) = -1
   *  cbrt(N)  =  N
   *  cbrt(-I) = -I
   *  cbrt(I)  =  I
   *
   * Math.cbrt(x) = (x < 0 ? -Math.pow(-x, 1/3) : Math.pow(x, 1/3))
   *
   */
  P.cubeRoot = P.cbrt = function () {
    var e, m, n, r, rep, s, sd, t, t3, t3plusx,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite() || x.isZero()) return new Ctor(x);
    external = false;

    // Initial estimate.
    s = x.s * mathpow(x.s * x, 1 / 3);

     // Math.cbrt underflow/overflow?
     // Pass x to Math.pow as integer, then adjust the exponent of the result.
    if (!s || Math.abs(s) == 1 / 0) {
      n = digitsToString(x.d);
      e = x.e;

      // Adjust n exponent so it is a multiple of 3 away from x exponent.
      if (s = (e - n.length + 1) % 3) n += (s == 1 || s == -2 ? '0' : '00');
      s = mathpow(n, 1 / 3);

      // Rarely, e may be one less than the result exponent value.
      e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));

      if (s == 1 / 0) {
        n = '5e' + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf('e') + 1) + e;
      }

      r = new Ctor(n);
      r.s = x.s;
    } else {
      r = new Ctor(s.toString());
    }

    sd = (e = Ctor.precision) + 3;

    // Halley's method.
    // TODO? Compare Newton's method.
    for (;;) {
      t = r;
      t3 = t.times(t).times(t);
      t3plusx = t3.plus(x);
      r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);

      // TODO? Replace with for-loop and checkRoundingDigits.
      if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
        n = n.slice(sd - 3, sd + 1);

        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or 4999
        // , i.e. approaching a rounding boundary, continue the iteration.
        if (n == '9999' || !rep && n == '4999') {

          // On the first iteration only, check to see if rounding up gives the exact result as the
          // nines may infinitely repeat.
          if (!rep) {
            finalise(t, e + 1, 0);

            if (t.times(t).times(t).eq(x)) {
              r = t;
              break;
            }
          }

          sd += 4;
          rep = 1;
        } else {

          // If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
          // If not, then there are further digits and m will be truthy.
          if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

            // Truncate to the first rounding digit.
            finalise(r, e + 1, 1);
            m = !r.times(r).times(r).eq(x);
          }

          break;
        }
      }
    }

    external = true;

    return finalise(r, e, Ctor.rounding, m);
  };


  /*
   * Return the number of decimal places of the value of this Decimal.
   *
   */
  P.decimalPlaces = P.dp = function () {
    var w,
      d = this.d,
      n = NaN;

    if (d) {
      w = d.length - 1;
      n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;

      // Subtract the number of trailing zeros of the last word.
      w = d[w];
      if (w) for (; w % 10 == 0; w /= 10) n--;
      if (n < 0) n = 0;
    }

    return n;
  };


  /*
   *  n / 0 = I
   *  n / N = N
   *  n / I = 0
   *  0 / n = 0
   *  0 / 0 = N
   *  0 / N = N
   *  0 / I = 0
   *  N / n = N
   *  N / 0 = N
   *  N / N = N
   *  N / I = N
   *  I / n = I
   *  I / 0 = I
   *  I / N = N
   *  I / I = N
   *
   * Return a new Decimal whose value is the value of this Decimal divided by `y`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   */
  P.dividedBy = P.div = function (y) {
    return divide(this, new this.constructor(y));
  };


  /*
   * Return a new Decimal whose value is the integer part of dividing the value of this Decimal
   * by the value of `y`, rounded to `precision` significant digits using rounding mode `rounding`.
   *
   */
  P.dividedToIntegerBy = P.divToInt = function (y) {
    var x = this,
      Ctor = x.constructor;
    return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
  };


  /*
   * Return true if the value of this Decimal is equal to the value of `y`, otherwise return false.
   *
   */
  P.equals = P.eq = function (y) {
    return this.cmp(y) === 0;
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in the
   * direction of negative Infinity.
   *
   */
  P.floor = function () {
    return finalise(new this.constructor(this), this.e + 1, 3);
  };


  /*
   * Return true if the value of this Decimal is greater than the value of `y`, otherwise return
   * false.
   *
   */
  P.greaterThan = P.gt = function (y) {
    return this.cmp(y) > 0;
  };


  /*
   * Return true if the value of this Decimal is greater than or equal to the value of `y`,
   * otherwise return false.
   *
   */
  P.greaterThanOrEqualTo = P.gte = function (y) {
    var k = this.cmp(y);
    return k == 1 || k === 0;
  };


  /*
   * Return a new Decimal whose value is the hyperbolic cosine of the value in radians of this
   * Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [1, Infinity]
   *
   * cosh(x) = 1 + x^2/2! + x^4/4! + x^6/6! + ...
   *
   * cosh(0)         = 1
   * cosh(-0)        = 1
   * cosh(Infinity)  = Infinity
   * cosh(-Infinity) = Infinity
   * cosh(NaN)       = NaN
   *
   *  x        time taken (ms)   result
   * 1000      9                 9.8503555700852349694e+433
   * 10000     25                4.4034091128314607936e+4342
   * 100000    171               1.4033316802130615897e+43429
   * 1000000   3817              1.5166076984010437725e+434294
   * 10000000  abandoned after 2 minute wait
   *
   * TODO? Compare performance of cosh(x) = 0.5 * (exp(x) + exp(-x))
   *
   */
  P.hyperbolicCosine = P.cosh = function () {
    var k, n, pr, rm, len,
      x = this,
      Ctor = x.constructor,
      one = new Ctor(1);

    if (!x.isFinite()) return new Ctor(x.s ? 1 / 0 : NaN);
    if (x.isZero()) return one;

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;

    // Argument reduction: cos(4x) = 1 - 8cos^2(x) + 8cos^4(x) + 1
    // i.e. cos(x) = 1 - cos^2(x/4)(8 - 8cos^2(x/4))

    // Estimate the optimum number of times to use the argument reduction.
    // TODO? Estimation reused from cosine() and may not be optimal here.
    if (len < 32) {
      k = Math.ceil(len / 3);
      n = (1 / tinyPow(4, k)).toString();
    } else {
      k = 16;
      n = '2.3283064365386962890625e-10';
    }

    x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);

    // Reverse argument reduction
    var cosh2_x,
      i = k,
      d8 = new Ctor(8);
    for (; i--;) {
      cosh2_x = x.times(x);
      x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
    }

    return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
  };


  /*
   * Return a new Decimal whose value is the hyperbolic sine of the value in radians of this
   * Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-Infinity, Infinity]
   *
   * sinh(x) = x + x^3/3! + x^5/5! + x^7/7! + ...
   *
   * sinh(0)         = 0
   * sinh(-0)        = -0
   * sinh(Infinity)  = Infinity
   * sinh(-Infinity) = -Infinity
   * sinh(NaN)       = NaN
   *
   * x        time taken (ms)
   * 10       2 ms
   * 100      5 ms
   * 1000     14 ms
   * 10000    82 ms
   * 100000   886 ms            1.4033316802130615897e+43429
   * 200000   2613 ms
   * 300000   5407 ms
   * 400000   8824 ms
   * 500000   13026 ms          8.7080643612718084129e+217146
   * 1000000  48543 ms
   *
   * TODO? Compare performance of sinh(x) = 0.5 * (exp(x) - exp(-x))
   *
   */
  P.hyperbolicSine = P.sinh = function () {
    var k, pr, rm, len,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite() || x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;

    if (len < 3) {
      x = taylorSeries(Ctor, 2, x, x, true);
    } else {

      // Alternative argument reduction: sinh(3x) = sinh(x)(3 + 4sinh^2(x))
      // i.e. sinh(x) = sinh(x/3)(3 + 4sinh^2(x/3))
      // 3 multiplications and 1 addition

      // Argument reduction: sinh(5x) = sinh(x)(5 + sinh^2(x)(20 + 16sinh^2(x)))
      // i.e. sinh(x) = sinh(x/5)(5 + sinh^2(x/5)(20 + 16sinh^2(x/5)))
      // 4 multiplications and 2 additions

      // Estimate the optimum number of times to use the argument reduction.
      k = 1.4 * Math.sqrt(len);
      k = k > 16 ? 16 : k | 0;

      x = x.times(1 / tinyPow(5, k));
      x = taylorSeries(Ctor, 2, x, x, true);

      // Reverse argument reduction
      var sinh2_x,
        d5 = new Ctor(5),
        d16 = new Ctor(16),
        d20 = new Ctor(20);
      for (; k--;) {
        sinh2_x = x.times(x);
        x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
      }
    }

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return finalise(x, pr, rm, true);
  };


  /*
   * Return a new Decimal whose value is the hyperbolic tangent of the value in radians of this
   * Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-1, 1]
   *
   * tanh(x) = sinh(x) / cosh(x)
   *
   * tanh(0)         = 0
   * tanh(-0)        = -0
   * tanh(Infinity)  = 1
   * tanh(-Infinity) = -1
   * tanh(NaN)       = NaN
   *
   */
  P.hyperbolicTangent = P.tanh = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite()) return new Ctor(x.s);
    if (x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 7;
    Ctor.rounding = 1;

    return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
  };


  /*
   * Return a new Decimal whose value is the arccosine (inverse cosine) in radians of the value of
   * this Decimal.
   *
   * Domain: [-1, 1]
   * Range: [0, pi]
   *
   * acos(x) = pi/2 - asin(x)
   *
   * acos(0)       = pi/2
   * acos(-0)      = pi/2
   * acos(1)       = 0
   * acos(-1)      = pi
   * acos(1/2)     = pi/3
   * acos(-1/2)    = 2*pi/3
   * acos(|x| > 1) = NaN
   * acos(NaN)     = NaN
   *
   */
  P.inverseCosine = P.acos = function () {
    var halfPi,
      x = this,
      Ctor = x.constructor,
      k = x.abs().cmp(1),
      pr = Ctor.precision,
      rm = Ctor.rounding;

    if (k !== -1) {
      return k === 0
        // |x| is 1
        ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0)
        // |x| > 1 or x is NaN
        : new Ctor(NaN);
    }

    if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(0.5);

    // TODO? Special case acos(0.5) = pi/3 and acos(-0.5) = 2*pi/3

    Ctor.precision = pr + 6;
    Ctor.rounding = 1;

    x = x.asin();
    halfPi = getPi(Ctor, pr + 4, rm).times(0.5);

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return halfPi.minus(x);
  };


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic cosine in radians of the
   * value of this Decimal.
   *
   * Domain: [1, Infinity]
   * Range: [0, Infinity]
   *
   * acosh(x) = ln(x + sqrt(x^2 - 1))
   *
   * acosh(x < 1)     = NaN
   * acosh(NaN)       = NaN
   * acosh(Infinity)  = Infinity
   * acosh(-Infinity) = NaN
   * acosh(0)         = NaN
   * acosh(-0)        = NaN
   * acosh(1)         = 0
   * acosh(-1)        = NaN
   *
   */
  P.inverseHyperbolicCosine = P.acosh = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (x.lte(1)) return new Ctor(x.eq(1) ? 0 : NaN);
    if (!x.isFinite()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
    Ctor.rounding = 1;
    external = false;

    x = x.times(x).minus(1).sqrt().plus(x);

    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;

    return x.ln();
  };


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic sine in radians of the value
   * of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-Infinity, Infinity]
   *
   * asinh(x) = ln(x + sqrt(x^2 + 1))
   *
   * asinh(NaN)       = NaN
   * asinh(Infinity)  = Infinity
   * asinh(-Infinity) = -Infinity
   * asinh(0)         = 0
   * asinh(-0)        = -0
   *
   */
  P.inverseHyperbolicSine = P.asinh = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite() || x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
    Ctor.rounding = 1;
    external = false;

    x = x.times(x).plus(1).sqrt().plus(x);

    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;

    return x.ln();
  };


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic tangent in radians of the
   * value of this Decimal.
   *
   * Domain: [-1, 1]
   * Range: [-Infinity, Infinity]
   *
   * atanh(x) = 0.5 * ln((1 + x) / (1 - x))
   *
   * atanh(|x| > 1)   = NaN
   * atanh(NaN)       = NaN
   * atanh(Infinity)  = NaN
   * atanh(-Infinity) = NaN
   * atanh(0)         = 0
   * atanh(-0)        = -0
   * atanh(1)         = Infinity
   * atanh(-1)        = -Infinity
   *
   */
  P.inverseHyperbolicTangent = P.atanh = function () {
    var pr, rm, wpr, xsd,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite()) return new Ctor(NaN);
    if (x.e >= 0) return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    xsd = x.sd();

    if (Math.max(xsd, pr) < 2 * -x.e - 1) return finalise(new Ctor(x), pr, rm, true);

    Ctor.precision = wpr = xsd - x.e;

    x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);

    Ctor.precision = pr + 4;
    Ctor.rounding = 1;

    x = x.ln();

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return x.times(0.5);
  };


  /*
   * Return a new Decimal whose value is the arcsine (inverse sine) in radians of the value of this
   * Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-pi/2, pi/2]
   *
   * asin(x) = 2*atan(x/(1 + sqrt(1 - x^2)))
   *
   * asin(0)       = 0
   * asin(-0)      = -0
   * asin(1/2)     = pi/6
   * asin(-1/2)    = -pi/6
   * asin(1)       = pi/2
   * asin(-1)      = -pi/2
   * asin(|x| > 1) = NaN
   * asin(NaN)     = NaN
   *
   * TODO? Compare performance of Taylor series.
   *
   */
  P.inverseSine = P.asin = function () {
    var halfPi, k,
      pr, rm,
      x = this,
      Ctor = x.constructor;

    if (x.isZero()) return new Ctor(x);

    k = x.abs().cmp(1);
    pr = Ctor.precision;
    rm = Ctor.rounding;

    if (k !== -1) {

      // |x| is 1
      if (k === 0) {
        halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
        halfPi.s = x.s;
        return halfPi;
      }

      // |x| > 1 or x is NaN
      return new Ctor(NaN);
    }

    // TODO? Special case asin(1/2) = pi/6 and asin(-1/2) = -pi/6

    Ctor.precision = pr + 6;
    Ctor.rounding = 1;

    x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return x.times(2);
  };


  /*
   * Return a new Decimal whose value is the arctangent (inverse tangent) in radians of the value
   * of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-pi/2, pi/2]
   *
   * atan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...
   *
   * atan(0)         = 0
   * atan(-0)        = -0
   * atan(1)         = pi/4
   * atan(-1)        = -pi/4
   * atan(Infinity)  = pi/2
   * atan(-Infinity) = -pi/2
   * atan(NaN)       = NaN
   *
   */
  P.inverseTangent = P.atan = function () {
    var i, j, k, n, px, t, r, wpr, x2,
      x = this,
      Ctor = x.constructor,
      pr = Ctor.precision,
      rm = Ctor.rounding;

    if (!x.isFinite()) {
      if (!x.s) return new Ctor(NaN);
      if (pr + 4 <= PI_PRECISION) {
        r = getPi(Ctor, pr + 4, rm).times(0.5);
        r.s = x.s;
        return r;
      }
    } else if (x.isZero()) {
      return new Ctor(x);
    } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.25);
      r.s = x.s;
      return r;
    }

    Ctor.precision = wpr = pr + 10;
    Ctor.rounding = 1;

    // TODO? if (x >= 1 && pr <= PI_PRECISION) atan(x) = halfPi * x.s - atan(1 / x);

    // Argument reduction
    // Ensure |x| < 0.42
    // atan(x) = 2 * atan(x / (1 + sqrt(1 + x^2)))

    k = Math.min(28, wpr / LOG_BASE + 2 | 0);

    for (i = k; i; --i) x = x.div(x.times(x).plus(1).sqrt().plus(1));

    external = false;

    j = Math.ceil(wpr / LOG_BASE);
    n = 1;
    x2 = x.times(x);
    r = new Ctor(x);
    px = x;

    // atan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...
    for (; i !== -1;) {
      px = px.times(x2);
      t = r.minus(px.div(n += 2));

      px = px.times(x2);
      r = t.plus(px.div(n += 2));

      if (r.d[j] !== void 0) for (i = j; r.d[i] === t.d[i] && i--;);
    }

    if (k) r = r.times(2 << (k - 1));

    external = true;

    return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
  };


  /*
   * Return true if the value of this Decimal is a finite number, otherwise return false.
   *
   */
  P.isFinite = function () {
    return !!this.d;
  };


  /*
   * Return true if the value of this Decimal is an integer, otherwise return false.
   *
   */
  P.isInteger = P.isInt = function () {
    return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
  };


  /*
   * Return true if the value of this Decimal is NaN, otherwise return false.
   *
   */
  P.isNaN = function () {
    return !this.s;
  };


  /*
   * Return true if the value of this Decimal is negative, otherwise return false.
   *
   */
  P.isNegative = P.isNeg = function () {
    return this.s < 0;
  };


  /*
   * Return true if the value of this Decimal is positive, otherwise return false.
   *
   */
  P.isPositive = P.isPos = function () {
    return this.s > 0;
  };


  /*
   * Return true if the value of this Decimal is 0 or -0, otherwise return false.
   *
   */
  P.isZero = function () {
    return !!this.d && this.d[0] === 0;
  };


  /*
   * Return true if the value of this Decimal is less than `y`, otherwise return false.
   *
   */
  P.lessThan = P.lt = function (y) {
    return this.cmp(y) < 0;
  };


  /*
   * Return true if the value of this Decimal is less than or equal to `y`, otherwise return false.
   *
   */
  P.lessThanOrEqualTo = P.lte = function (y) {
    return this.cmp(y) < 1;
  };


  /*
   * Return the logarithm of the value of this Decimal to the specified base, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * If no base is specified, return log[10](arg).
   *
   * log[base](arg) = ln(arg) / ln(base)
   *
   * The result will always be correctly rounded if the base of the log is 10, and 'almost always'
   * otherwise:
   *
   * Depending on the rounding mode, the result may be incorrectly rounded if the first fifteen
   * rounding digits are [49]99999999999999 or [50]00000000000000. In that case, the maximum error
   * between the result and the correctly rounded result will be one ulp (unit in the last place).
   *
   * log[-b](a)       = NaN
   * log[0](a)        = NaN
   * log[1](a)        = NaN
   * log[NaN](a)      = NaN
   * log[Infinity](a) = NaN
   * log[b](0)        = -Infinity
   * log[b](-0)       = -Infinity
   * log[b](-a)       = NaN
   * log[b](1)        = 0
   * log[b](Infinity) = Infinity
   * log[b](NaN)      = NaN
   *
   * [base] {number|string|Decimal} The base of the logarithm.
   *
   */
  P.logarithm = P.log = function (base) {
    var isBase10, d, denominator, k, inf, num, sd, r,
      arg = this,
      Ctor = arg.constructor,
      pr = Ctor.precision,
      rm = Ctor.rounding,
      guard = 5;

    // Default base is 10.
    if (base == null) {
      base = new Ctor(10);
      isBase10 = true;
    } else {
      base = new Ctor(base);
      d = base.d;

      // Return NaN if base is negative, or non-finite, or is 0 or 1.
      if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);

      isBase10 = base.eq(10);
    }

    d = arg.d;

    // Is arg negative, non-finite, 0 or 1?
    if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
      return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
    }

    // The result will have a non-terminating decimal expansion if base is 10 and arg is not an
    // integer power of 10.
    if (isBase10) {
      if (d.length > 1) {
        inf = true;
      } else {
        for (k = d[0]; k % 10 === 0;) k /= 10;
        inf = k !== 1;
      }
    }

    external = false;
    sd = pr + guard;
    num = naturalLogarithm(arg, sd);
    denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);

    // The result will have 5 rounding digits.
    r = divide(num, denominator, sd, 1);

    // If at a rounding boundary, i.e. the result's rounding digits are [49]9999 or [50]0000,
    // calculate 10 further digits.
    //
    // If the result is known to have an infinite decimal expansion, repeat this until it is clear
    // that the result is above or below the boundary. Otherwise, if after calculating the 10
    // further digits, the last 14 are nines, round up and assume the result is exact.
    // Also assume the result is exact if the last 14 are zero.
    //
    // Example of a result that will be incorrectly rounded:
    // log[1048576](4503599627370502) = 2.60000000000000009610279511444746...
    // The above result correctly rounded using ROUND_CEIL to 1 decimal place should be 2.7, but it
    // will be given as 2.6 as there are 15 zeros immediately after the requested decimal place, so
    // the exact result would be assumed to be 2.6, which rounded using ROUND_CEIL to 1 decimal
    // place is still 2.6.
    if (checkRoundingDigits(r.d, k = pr, rm)) {

      do {
        sd += 10;
        num = naturalLogarithm(arg, sd);
        denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
        r = divide(num, denominator, sd, 1);

        if (!inf) {

          // Check for 14 nines from the 2nd rounding digit, as the first may be 4.
          if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
            r = finalise(r, pr + 1, 0);
          }

          break;
        }
      } while (checkRoundingDigits(r.d, k += 10, rm));
    }

    external = true;

    return finalise(r, pr, rm);
  };


  /*
   * Return a new Decimal whose value is the maximum of the arguments and the value of this Decimal.
   *
   * arguments {number|string|Decimal}
   *
  P.max = function () {
    Array.prototype.push.call(arguments, this);
    return maxOrMin(this.constructor, arguments, 'lt');
  };
   */


  /*
   * Return a new Decimal whose value is the minimum of the arguments and the value of this Decimal.
   *
   * arguments {number|string|Decimal}
   *
  P.min = function () {
    Array.prototype.push.call(arguments, this);
    return maxOrMin(this.constructor, arguments, 'gt');
  };
   */


  /*
   *  n - 0 = n
   *  n - N = N
   *  n - I = -I
   *  0 - n = -n
   *  0 - 0 = 0
   *  0 - N = N
   *  0 - I = -I
   *  N - n = N
   *  N - 0 = N
   *  N - N = N
   *  N - I = N
   *  I - n = I
   *  I - 0 = I
   *  I - N = N
   *  I - I = N
   *
   * Return a new Decimal whose value is the value of this Decimal minus `y`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   */
  P.minus = P.sub = function (y) {
    var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd,
      x = this,
      Ctor = x.constructor;

    y = new Ctor(y);

    // If either is not finite...
    if (!x.d || !y.d) {

      // Return NaN if either is NaN.
      if (!x.s || !y.s) y = new Ctor(NaN);

      // Return y negated if x is finite and y is ±Infinity.
      else if (x.d) y.s = -y.s;

      // Return x if y is finite and x is ±Infinity.
      // Return x if both are ±Infinity with different signs.
      // Return NaN if both are ±Infinity with the same sign.
      else y = new Ctor(y.d || x.s !== y.s ? x : NaN);

      return y;
    }

    // If signs differ...
    if (x.s != y.s) {
      y.s = -y.s;
      return x.plus(y);
    }

    xd = x.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;

    // If either is zero...
    if (!xd[0] || !yd[0]) {

      // Return y negated if x is zero and y is non-zero.
      if (yd[0]) y.s = -y.s;

      // Return x if y is zero and x is non-zero.
      else if (xd[0]) y = new Ctor(x);

      // Return zero if both are zero.
      // From IEEE 754 (2008) 6.3: 0 - 0 = -0 - -0 = -0 when rounding to -Infinity.
      else return new Ctor(rm === 3 ? -0 : 0);

      return external ? finalise(y, pr, rm) : y;
    }

    // x and y are finite, non-zero numbers with the same sign.

    // Calculate base 1e7 exponents.
    e = mathfloor(y.e / LOG_BASE);
    xe = mathfloor(x.e / LOG_BASE);

    xd = xd.slice();
    k = xe - e;

    // If base 1e7 exponents differ...
    if (k) {
      xLTy = k < 0;

      if (xLTy) {
        d = xd;
        k = -k;
        len = yd.length;
      } else {
        d = yd;
        e = xe;
        len = xd.length;
      }

      // Numbers with massively different exponents would result in a very high number of
      // zeros needing to be prepended, but this can be avoided while still ensuring correct
      // rounding by limiting the number of zeros to `Math.ceil(pr / LOG_BASE) + 2`.
      i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;

      if (k > i) {
        k = i;
        d.length = 1;
      }

      // Prepend zeros to equalise exponents.
      d.reverse();
      for (i = k; i--;) d.push(0);
      d.reverse();

    // Base 1e7 exponents equal.
    } else {

      // Check digits to determine which is the bigger number.

      i = xd.length;
      len = yd.length;
      xLTy = i < len;
      if (xLTy) len = i;

      for (i = 0; i < len; i++) {
        if (xd[i] != yd[i]) {
          xLTy = xd[i] < yd[i];
          break;
        }
      }

      k = 0;
    }

    if (xLTy) {
      d = xd;
      xd = yd;
      yd = d;
      y.s = -y.s;
    }

    len = xd.length;

    // Append zeros to `xd` if shorter.
    // Don't add zeros to `yd` if shorter as subtraction only needs to start at `yd` length.
    for (i = yd.length - len; i > 0; --i) xd[len++] = 0;

    // Subtract yd from xd.
    for (i = yd.length; i > k;) {

      if (xd[--i] < yd[i]) {
        for (j = i; j && xd[--j] === 0;) xd[j] = BASE - 1;
        --xd[j];
        xd[i] += BASE;
      }

      xd[i] -= yd[i];
    }

    // Remove trailing zeros.
    for (; xd[--len] === 0;) xd.pop();

    // Remove leading zeros and adjust exponent accordingly.
    for (; xd[0] === 0; xd.shift()) --e;

    // Zero?
    if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);

    y.d = xd;
    y.e = getBase10Exponent(xd, e);

    return external ? finalise(y, pr, rm) : y;
  };


  /*
   *   n % 0 =  N
   *   n % N =  N
   *   n % I =  n
   *   0 % n =  0
   *  -0 % n = -0
   *   0 % 0 =  N
   *   0 % N =  N
   *   0 % I =  0
   *   N % n =  N
   *   N % 0 =  N
   *   N % N =  N
   *   N % I =  N
   *   I % n =  N
   *   I % 0 =  N
   *   I % N =  N
   *   I % I =  N
   *
   * Return a new Decimal whose value is the value of this Decimal modulo `y`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   * The result depends on the modulo mode.
   *
   */
  P.modulo = P.mod = function (y) {
    var q,
      x = this,
      Ctor = x.constructor;

    y = new Ctor(y);

    // Return NaN if x is ±Infinity or NaN, or y is NaN or ±0.
    if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN);

    // Return x if y is ±Infinity or x is ±0.
    if (!y.d || x.d && !x.d[0]) {
      return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
    }

    // Prevent rounding of intermediate calculations.
    external = false;

    if (Ctor.modulo == 9) {

      // Euclidian division: q = sign(y) * floor(x / abs(y))
      // result = x - q * y    where  0 <= result < abs(y)
      q = divide(x, y.abs(), 0, 3, 1);
      q.s *= y.s;
    } else {
      q = divide(x, y, 0, Ctor.modulo, 1);
    }

    q = q.times(y);

    external = true;

    return x.minus(q);
  };


  /*
   * Return a new Decimal whose value is the natural exponential of the value of this Decimal,
   * i.e. the base e raised to the power the value of this Decimal, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   */
  P.naturalExponential = P.exp = function () {
    return naturalExponential(this);
  };


  /*
   * Return a new Decimal whose value is the natural logarithm of the value of this Decimal,
   * rounded to `precision` significant digits using rounding mode `rounding`.
   *
   */
  P.naturalLogarithm = P.ln = function () {
    return naturalLogarithm(this);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal negated, i.e. as if multiplied by
   * -1.
   *
   */
  P.negated = P.neg = function () {
    var x = new this.constructor(this);
    x.s = -x.s;
    return finalise(x);
  };


  /*
   *  n + 0 = n
   *  n + N = N
   *  n + I = I
   *  0 + n = n
   *  0 + 0 = 0
   *  0 + N = N
   *  0 + I = I
   *  N + n = N
   *  N + 0 = N
   *  N + N = N
   *  N + I = N
   *  I + n = I
   *  I + 0 = I
   *  I + N = N
   *  I + I = I
   *
   * Return a new Decimal whose value is the value of this Decimal plus `y`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   */
  P.plus = P.add = function (y) {
    var carry, d, e, i, k, len, pr, rm, xd, yd,
      x = this,
      Ctor = x.constructor;

    y = new Ctor(y);

    // If either is not finite...
    if (!x.d || !y.d) {

      // Return NaN if either is NaN.
      if (!x.s || !y.s) y = new Ctor(NaN);

      // Return x if y is finite and x is ±Infinity.
      // Return x if both are ±Infinity with the same sign.
      // Return NaN if both are ±Infinity with different signs.
      // Return y if x is finite and y is ±Infinity.
      else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);

      return y;
    }

     // If signs differ...
    if (x.s != y.s) {
      y.s = -y.s;
      return x.minus(y);
    }

    xd = x.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;

    // If either is zero...
    if (!xd[0] || !yd[0]) {

      // Return x if y is zero.
      // Return y if y is non-zero.
      if (!yd[0]) y = new Ctor(x);

      return external ? finalise(y, pr, rm) : y;
    }

    // x and y are finite, non-zero numbers with the same sign.

    // Calculate base 1e7 exponents.
    k = mathfloor(x.e / LOG_BASE);
    e = mathfloor(y.e / LOG_BASE);

    xd = xd.slice();
    i = k - e;

    // If base 1e7 exponents differ...
    if (i) {

      if (i < 0) {
        d = xd;
        i = -i;
        len = yd.length;
      } else {
        d = yd;
        e = k;
        len = xd.length;
      }

      // Limit number of zeros prepended to max(ceil(pr / LOG_BASE), len) + 1.
      k = Math.ceil(pr / LOG_BASE);
      len = k > len ? k + 1 : len + 1;

      if (i > len) {
        i = len;
        d.length = 1;
      }

      // Prepend zeros to equalise exponents. Note: Faster to use reverse then do unshifts.
      d.reverse();
      for (; i--;) d.push(0);
      d.reverse();
    }

    len = xd.length;
    i = yd.length;

    // If yd is longer than xd, swap xd and yd so xd points to the longer array.
    if (len - i < 0) {
      i = len;
      d = yd;
      yd = xd;
      xd = d;
    }

    // Only start adding at yd.length - 1 as the further digits of xd can be left as they are.
    for (carry = 0; i;) {
      carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
      xd[i] %= BASE;
    }

    if (carry) {
      xd.unshift(carry);
      ++e;
    }

    // Remove trailing zeros.
    // No need to check for zero, as +x + +y != 0 && -x + -y != 0
    for (len = xd.length; xd[--len] == 0;) xd.pop();

    y.d = xd;
    y.e = getBase10Exponent(xd, e);

    return external ? finalise(y, pr, rm) : y;
  };


  /*
   * Return the number of significant digits of the value of this Decimal.
   *
   * [z] {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
   *
   */
  P.precision = P.sd = function (z) {
    var k,
      x = this;

    if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);

    if (x.d) {
      k = getPrecision(x.d);
      if (z && x.e + 1 > k) k = x.e + 1;
    } else {
      k = NaN;
    }

    return k;
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a whole number using
   * rounding mode `rounding`.
   *
   */
  P.round = function () {
    var x = this,
      Ctor = x.constructor;

    return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
  };


  /*
   * Return a new Decimal whose value is the sine of the value in radians of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-1, 1]
   *
   * sin(x) = x - x^3/3! + x^5/5! - ...
   *
   * sin(0)         = 0
   * sin(-0)        = -0
   * sin(Infinity)  = NaN
   * sin(-Infinity) = NaN
   * sin(NaN)       = NaN
   *
   */
  P.sine = P.sin = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite()) return new Ctor(NaN);
    if (x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
    Ctor.rounding = 1;

    x = sine(Ctor, toLessThanHalfPi(Ctor, x));

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
  };


  /*
   * Return a new Decimal whose value is the square root of this Decimal, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   *  sqrt(-n) =  N
   *  sqrt(N)  =  N
   *  sqrt(-I) =  N
   *  sqrt(I)  =  I
   *  sqrt(0)  =  0
   *  sqrt(-0) = -0
   *
   */
  P.squareRoot = P.sqrt = function () {
    var m, n, sd, r, rep, t,
      x = this,
      d = x.d,
      e = x.e,
      s = x.s,
      Ctor = x.constructor;

    // Negative/NaN/Infinity/zero?
    if (s !== 1 || !d || !d[0]) {
      return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
    }

    external = false;

    // Initial estimate.
    s = Math.sqrt(+x);

    // Math.sqrt underflow/overflow?
    // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
    if (s == 0 || s == 1 / 0) {
      n = digitsToString(d);

      if ((n.length + e) % 2 == 0) n += '0';
      s = Math.sqrt(n);
      e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);

      if (s == 1 / 0) {
        n = '5e' + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf('e') + 1) + e;
      }

      r = new Ctor(n);
    } else {
      r = new Ctor(s.toString());
    }

    sd = (e = Ctor.precision) + 3;

    // Newton-Raphson iteration.
    for (;;) {
      t = r;
      r = t.plus(divide(x, t, sd + 2, 1)).times(0.5);

      // TODO? Replace with for-loop and checkRoundingDigits.
      if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
        n = n.slice(sd - 3, sd + 1);

        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or
        // 4999, i.e. approaching a rounding boundary, continue the iteration.
        if (n == '9999' || !rep && n == '4999') {

          // On the first iteration only, check to see if rounding up gives the exact result as the
          // nines may infinitely repeat.
          if (!rep) {
            finalise(t, e + 1, 0);

            if (t.times(t).eq(x)) {
              r = t;
              break;
            }
          }

          sd += 4;
          rep = 1;
        } else {

          // If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
          // If not, then there are further digits and m will be truthy.
          if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

            // Truncate to the first rounding digit.
            finalise(r, e + 1, 1);
            m = !r.times(r).eq(x);
          }

          break;
        }
      }
    }

    external = true;

    return finalise(r, e, Ctor.rounding, m);
  };


  /*
   * Return a new Decimal whose value is the tangent of the value in radians of this Decimal.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-Infinity, Infinity]
   *
   * tan(0)         = 0
   * tan(-0)        = -0
   * tan(Infinity)  = NaN
   * tan(-Infinity) = NaN
   * tan(NaN)       = NaN
   *
   */
  P.tangent = P.tan = function () {
    var pr, rm,
      x = this,
      Ctor = x.constructor;

    if (!x.isFinite()) return new Ctor(NaN);
    if (x.isZero()) return new Ctor(x);

    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 10;
    Ctor.rounding = 1;

    x = x.sin();
    x.s = 1;
    x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);

    Ctor.precision = pr;
    Ctor.rounding = rm;

    return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
  };


  /*
   *  n * 0 = 0
   *  n * N = N
   *  n * I = I
   *  0 * n = 0
   *  0 * 0 = 0
   *  0 * N = N
   *  0 * I = N
   *  N * n = N
   *  N * 0 = N
   *  N * N = N
   *  N * I = N
   *  I * n = I
   *  I * 0 = N
   *  I * N = N
   *  I * I = I
   *
   * Return a new Decimal whose value is this Decimal times `y`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   */
  P.times = P.mul = function (y) {
    var carry, e, i, k, r, rL, t, xdL, ydL,
      x = this,
      Ctor = x.constructor,
      xd = x.d,
      yd = (y = new Ctor(y)).d;

    y.s *= x.s;

     // If either is NaN, ±Infinity or ±0...
    if (!xd || !xd[0] || !yd || !yd[0]) {

      return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd

        // Return NaN if either is NaN.
        // Return NaN if x is ±0 and y is ±Infinity, or y is ±0 and x is ±Infinity.
        ? NaN

        // Return ±Infinity if either is ±Infinity.
        // Return ±0 if either is ±0.
        : !xd || !yd ? y.s / 0 : y.s * 0);
    }

    e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
    xdL = xd.length;
    ydL = yd.length;

    // Ensure xd points to the longer array.
    if (xdL < ydL) {
      r = xd;
      xd = yd;
      yd = r;
      rL = xdL;
      xdL = ydL;
      ydL = rL;
    }

    // Initialise the result array with zeros.
    r = [];
    rL = xdL + ydL;
    for (i = rL; i--;) r.push(0);

    // Multiply!
    for (i = ydL; --i >= 0;) {
      carry = 0;
      for (k = xdL + i; k > i;) {
        t = r[k] + yd[i] * xd[k - i - 1] + carry;
        r[k--] = t % BASE | 0;
        carry = t / BASE | 0;
      }

      r[k] = (r[k] + carry) % BASE | 0;
    }

    // Remove trailing zeros.
    for (; !r[--rL];) r.pop();

    if (carry) ++e;
    else r.shift();

    y.d = r;
    y.e = getBase10Exponent(r, e);

    return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
  };


  /*
   * Return a string representing the value of this Decimal in base 2, round to `sd` significant
   * digits using rounding mode `rm`.
   *
   * If the optional `sd` argument is present then return binary exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toBinary = function (sd, rm) {
    return toStringBinary(this, 2, sd, rm);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `dp`
   * decimal places using rounding mode `rm` or `rounding` if `rm` is omitted.
   *
   * If `dp` is omitted, return a new Decimal whose value is the value of this Decimal.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toDecimalPlaces = P.toDP = function (dp, rm) {
    var x = this,
      Ctor = x.constructor;

    x = new Ctor(x);
    if (dp === void 0) return x;

    checkInt32(dp, 0, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);

    return finalise(x, dp + x.e + 1, rm);
  };


  /*
   * Return a string representing the value of this Decimal in exponential notation rounded to
   * `dp` fixed decimal places using rounding mode `rounding`.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toExponential = function (dp, rm) {
    var str,
      x = this,
      Ctor = x.constructor;

    if (dp === void 0) {
      str = finiteToString(x, true);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);

      x = finalise(new Ctor(x), dp + 1, rm);
      str = finiteToString(x, true, dp + 1);
    }

    return x.isNeg() && !x.isZero() ? '-' + str : str;
  };


  /*
   * Return a string representing the value of this Decimal in normal (fixed-point) notation to
   * `dp` fixed decimal places and rounded using rounding mode `rm` or `rounding` if `rm` is
   * omitted.
   *
   * As with JavaScript numbers, (-0).toFixed(0) is '0', but e.g. (-0.00001).toFixed(0) is '-0'.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
   * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
   * (-0).toFixed(3) is '0.000'.
   * (-0.5).toFixed(0) is '-0'.
   *
   */
  P.toFixed = function (dp, rm) {
    var str, y,
      x = this,
      Ctor = x.constructor;

    if (dp === void 0) {
      str = finiteToString(x);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);

      y = finalise(new Ctor(x), dp + x.e + 1, rm);
      str = finiteToString(y, false, dp + y.e + 1);
    }

    // To determine whether to add the minus sign look at the value before it was rounded,
    // i.e. look at `x` rather than `y`.
    return x.isNeg() && !x.isZero() ? '-' + str : str;
  };


  /*
   * Return an array representing the value of this Decimal as a simple fraction with an integer
   * numerator and an integer denominator.
   *
   * The denominator will be a positive non-zero value less than or equal to the specified maximum
   * denominator. If a maximum denominator is not specified, the denominator will be the lowest
   * value necessary to represent the number exactly.
   *
   * [maxD] {number|string|Decimal} Maximum denominator. Integer >= 1 and < Infinity.
   *
   */
  P.toFraction = function (maxD) {
    var d, d0, d1, d2, e, k, n, n0, n1, pr, q, r,
      x = this,
      xd = x.d,
      Ctor = x.constructor;

    if (!xd) return new Ctor(x);

    n1 = d0 = new Ctor(1);
    d1 = n0 = new Ctor(0);

    d = new Ctor(d1);
    e = d.e = getPrecision(xd) - x.e - 1;
    k = e % LOG_BASE;
    d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);

    if (maxD == null) {

      // d is 10**e, the minimum max-denominator needed.
      maxD = e > 0 ? d : n1;
    } else {
      n = new Ctor(maxD);
      if (!n.isInt() || n.lt(n1)) throw Error(invalidArgument + n);
      maxD = n.gt(d) ? (e > 0 ? d : n1) : n;
    }

    external = false;
    n = new Ctor(digitsToString(xd));
    pr = Ctor.precision;
    Ctor.precision = e = xd.length * LOG_BASE * 2;

    for (;;)  {
      q = divide(n, d, 0, 1, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.cmp(maxD) == 1) break;
      d0 = d1;
      d1 = d2;
      d2 = n1;
      n1 = n0.plus(q.times(d2));
      n0 = d2;
      d2 = d;
      d = n.minus(q.times(d2));
      n = d2;
    }

    d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x.s;

    // Determine which fraction is closer to x, n0/d0 or n1/d1?
    r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1
        ? [n1, d1] : [n0, d0];

    Ctor.precision = pr;
    external = true;

    return r;
  };


  /*
   * Return a string representing the value of this Decimal in base 16, round to `sd` significant
   * digits using rounding mode `rm`.
   *
   * If the optional `sd` argument is present then return binary exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toHexadecimal = P.toHex = function (sd, rm) {
    return toStringBinary(this, 16, sd, rm);
  };


  /*
   * Returns a new Decimal whose value is the nearest multiple of `y` in the direction of rounding
   * mode `rm`, or `Decimal.rounding` if `rm` is omitted, to the value of this Decimal.
   *
   * The return value will always have the same sign as this Decimal, unless either this Decimal
   * or `y` is NaN, in which case the return value will be also be NaN.
   *
   * The return value is not affected by the value of `precision`.
   *
   * y {number|string|Decimal} The magnitude to round to a multiple of.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * 'toNearest() rounding mode not an integer: {rm}'
   * 'toNearest() rounding mode out of range: {rm}'
   *
   */
  P.toNearest = function (y, rm) {
    var x = this,
      Ctor = x.constructor;

    x = new Ctor(x);

    if (y == null) {

      // If x is not finite, return x.
      if (!x.d) return x;

      y = new Ctor(1);
      rm = Ctor.rounding;
    } else {
      y = new Ctor(y);
      if (rm === void 0) {
        rm = Ctor.rounding;
      } else {
        checkInt32(rm, 0, 8);
      }

      // If x is not finite, return x if y is not NaN, else NaN.
      if (!x.d) return y.s ? x : y;

      // If y is not finite, return Infinity with the sign of x if y is Infinity, else NaN.
      if (!y.d) {
        if (y.s) y.s = x.s;
        return y;
      }
    }

    // If y is not zero, calculate the nearest multiple of y to x.
    if (y.d[0]) {
      external = false;
      x = divide(x, y, 0, rm, 1).times(y);
      external = true;
      finalise(x);

    // If y is zero, return zero with the sign of x.
    } else {
      y.s = x.s;
      x = y;
    }

    return x;
  };


  /*
   * Return the value of this Decimal converted to a number primitive.
   * Zero keeps its sign.
   *
   */
  P.toNumber = function () {
    return +this;
  };


  /*
   * Return a string representing the value of this Decimal in base 8, round to `sd` significant
   * digits using rounding mode `rm`.
   *
   * If the optional `sd` argument is present then return binary exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toOctal = function (sd, rm) {
    return toStringBinary(this, 8, sd, rm);
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal raised to the power `y`, rounded
   * to `precision` significant digits using rounding mode `rounding`.
   *
   * ECMAScript compliant.
   *
   *   pow(x, NaN)                           = NaN
   *   pow(x, ±0)                            = 1

   *   pow(NaN, non-zero)                    = NaN
   *   pow(abs(x) > 1, +Infinity)            = +Infinity
   *   pow(abs(x) > 1, -Infinity)            = +0
   *   pow(abs(x) == 1, ±Infinity)           = NaN
   *   pow(abs(x) < 1, +Infinity)            = +0
   *   pow(abs(x) < 1, -Infinity)            = +Infinity
   *   pow(+Infinity, y > 0)                 = +Infinity
   *   pow(+Infinity, y < 0)                 = +0
   *   pow(-Infinity, odd integer > 0)       = -Infinity
   *   pow(-Infinity, even integer > 0)      = +Infinity
   *   pow(-Infinity, odd integer < 0)       = -0
   *   pow(-Infinity, even integer < 0)      = +0
   *   pow(+0, y > 0)                        = +0
   *   pow(+0, y < 0)                        = +Infinity
   *   pow(-0, odd integer > 0)              = -0
   *   pow(-0, even integer > 0)             = +0
   *   pow(-0, odd integer < 0)              = -Infinity
   *   pow(-0, even integer < 0)             = +Infinity
   *   pow(finite x < 0, finite non-integer) = NaN
   *
   * For non-integer or very large exponents pow(x, y) is calculated using
   *
   *   x^y = exp(y*ln(x))
   *
   * Assuming the first 15 rounding digits are each equally likely to be any digit 0-9, the
   * probability of an incorrectly rounded result
   * P([49]9{14} | [50]0{14}) = 2 * 0.2 * 10^-14 = 4e-15 = 1/2.5e+14
   * i.e. 1 in 250,000,000,000,000
   *
   * If a result is incorrectly rounded the maximum error will be 1 ulp (unit in last place).
   *
   * y {number|string|Decimal} The power to which to raise this Decimal.
   *
   */
  P.toPower = P.pow = function (y) {
    var e, k, pr, r, rm, s,
      x = this,
      Ctor = x.constructor,
      yn = +(y = new Ctor(y));

    // Either ±Infinity, NaN or ±0?
    if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));

    x = new Ctor(x);

    if (x.eq(1)) return x;

    pr = Ctor.precision;
    rm = Ctor.rounding;

    if (y.eq(1)) return finalise(x, pr, rm);

    // y exponent
    e = mathfloor(y.e / LOG_BASE);

    // If y is a small integer use the 'exponentiation by squaring' algorithm.
    if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
      r = intPow(Ctor, x, k, pr);
      return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
    }

    s = x.s;

    // if x is negative
    if (s < 0) {

      // if y is not an integer
      if (e < y.d.length - 1) return new Ctor(NaN);

      // Result is positive if x is negative and the last digit of integer y is even.
      if ((y.d[e] & 1) == 0) s = 1;

      // if x.eq(-1)
      if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
        x.s = s;
        return x;
      }
    }

    // Estimate result exponent.
    // x^y = 10^e,  where e = y * log10(x)
    // log10(x) = log10(x_significand) + x_exponent
    // log10(x_significand) = ln(x_significand) / ln(10)
    k = mathpow(+x, yn);
    e = k == 0 || !isFinite(k)
      ? mathfloor(yn * (Math.log('0.' + digitsToString(x.d)) / Math.LN10 + x.e + 1))
      : new Ctor(k + '').e;

    // Exponent estimate may be incorrect e.g. x: 0.999999999999999999, y: 2.29, e: 0, r.e: -1.

    // Overflow/underflow?
    if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);

    external = false;
    Ctor.rounding = x.s = 1;

    // Estimate the extra guard digits needed to ensure five correct rounding digits from
    // naturalLogarithm(x). Example of failure without these extra digits (precision: 10):
    // new Decimal(2.32456).pow('2087987436534566.46411')
    // should be 1.162377823e+764914905173815, but is 1.162355823e+764914905173815
    k = Math.min(12, (e + '').length);

    // r = x^y = exp(y*ln(x))
    r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);

    // r may be Infinity, e.g. (0.9999999999999999).pow(-1e+40)
    if (r.d) {

      // Truncate to the required precision plus five rounding digits.
      r = finalise(r, pr + 5, 1);

      // If the rounding digits are [49]9999 or [50]0000 increase the precision by 10 and recalculate
      // the result.
      if (checkRoundingDigits(r.d, pr, rm)) {
        e = pr + 10;

        // Truncate to the increased precision plus five rounding digits.
        r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);

        // Check for 14 nines from the 2nd rounding digit (the first rounding digit may be 4 or 9).
        if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
          r = finalise(r, pr + 1, 0);
        }
      }
    }

    r.s = s;
    external = true;
    Ctor.rounding = rm;

    return finalise(r, pr, rm);
  };


  /*
   * Return a string representing the value of this Decimal rounded to `sd` significant digits
   * using rounding mode `rounding`.
   *
   * Return exponential notation if `sd` is less than the number of digits necessary to represent
   * the integer part of the value in normal notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toPrecision = function (sd, rm) {
    var str,
      x = this,
      Ctor = x.constructor;

    if (sd === void 0) {
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    } else {
      checkInt32(sd, 1, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);

      x = finalise(new Ctor(x), sd, rm);
      str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
    }

    return x.isNeg() && !x.isZero() ? '-' + str : str;
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `sd`
   * significant digits using rounding mode `rm`, or to `precision` and `rounding` respectively if
   * omitted.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * 'toSD() digits out of range: {sd}'
   * 'toSD() digits not an integer: {sd}'
   * 'toSD() rounding mode not an integer: {rm}'
   * 'toSD() rounding mode out of range: {rm}'
   *
   */
  P.toSignificantDigits = P.toSD = function (sd, rm) {
    var x = this,
      Ctor = x.constructor;

    if (sd === void 0) {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    } else {
      checkInt32(sd, 1, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);
    }

    return finalise(new Ctor(x), sd, rm);
  };


  /*
   * Return a string representing the value of this Decimal.
   *
   * Return exponential notation if this Decimal has a positive exponent equal to or greater than
   * `toExpPos`, or a negative exponent equal to or less than `toExpNeg`.
   *
   */
  P.toString = function () {
    var x = this,
      Ctor = x.constructor,
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);

    return x.isNeg() && !x.isZero() ? '-' + str : str;
  };


  /*
   * Return a new Decimal whose value is the value of this Decimal truncated to a whole number.
   *
   */
  P.truncated = P.trunc = function () {
    return finalise(new this.constructor(this), this.e + 1, 1);
  };


  /*
   * Return a string representing the value of this Decimal.
   * Unlike `toString`, negative zero will include the minus sign.
   *
   */
  P.valueOf = P.toJSON = function () {
    var x = this,
      Ctor = x.constructor,
      str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);

    return x.isNeg() ? '-' + str : str;
  };


  // Helper functions for Decimal.prototype (P) and/or Decimal methods, and their callers.


  /*
   *  digitsToString           P.cubeRoot, P.logarithm, P.squareRoot, P.toFraction, P.toPower,
   *                           finiteToString, naturalExponential, naturalLogarithm
   *  checkInt32               P.toDecimalPlaces, P.toExponential, P.toFixed, P.toNearest,
   *                           P.toPrecision, P.toSignificantDigits, toStringBinary, random
   *  checkRoundingDigits      P.logarithm, P.toPower, naturalExponential, naturalLogarithm
   *  convertBase              toStringBinary, parseOther
   *  cos                      P.cos
   *  divide                   P.atanh, P.cubeRoot, P.dividedBy, P.dividedToIntegerBy,
   *                           P.logarithm, P.modulo, P.squareRoot, P.tan, P.tanh, P.toFraction,
   *                           P.toNearest, toStringBinary, naturalExponential, naturalLogarithm,
   *                           taylorSeries, atan2, parseOther
   *  finalise                 P.absoluteValue, P.atan, P.atanh, P.ceil, P.cos, P.cosh,
   *                           P.cubeRoot, P.dividedToIntegerBy, P.floor, P.logarithm, P.minus,
   *                           P.modulo, P.negated, P.plus, P.round, P.sin, P.sinh, P.squareRoot,
   *                           P.tan, P.times, P.toDecimalPlaces, P.toExponential, P.toFixed,
   *                           P.toNearest, P.toPower, P.toPrecision, P.toSignificantDigits,
   *                           P.truncated, divide, getLn10, getPi, naturalExponential,
   *                           naturalLogarithm, ceil, floor, round, trunc
   *  finiteToString           P.toExponential, P.toFixed, P.toPrecision, P.toString, P.valueOf,
   *                           toStringBinary
   *  getBase10Exponent        P.minus, P.plus, P.times, parseOther
   *  getLn10                  P.logarithm, naturalLogarithm
   *  getPi                    P.acos, P.asin, P.atan, toLessThanHalfPi, atan2
   *  getPrecision             P.precision, P.toFraction
   *  getZeroString            digitsToString, finiteToString
   *  intPow                   P.toPower, parseOther
   *  isOdd                    toLessThanHalfPi
   *  maxOrMin                 max, min
   *  naturalExponential       P.naturalExponential, P.toPower
   *  naturalLogarithm         P.acosh, P.asinh, P.atanh, P.logarithm, P.naturalLogarithm,
   *                           P.toPower, naturalExponential
   *  nonFiniteToString        finiteToString, toStringBinary
   *  parseDecimal             Decimal
   *  parseOther               Decimal
   *  sin                      P.sin
   *  taylorSeries             P.cosh, P.sinh, cos, sin
   *  toLessThanHalfPi         P.cos, P.sin
   *  toStringBinary           P.toBinary, P.toHexadecimal, P.toOctal
   *  truncate                 intPow
   *
   *  Throws:                  P.logarithm, P.precision, P.toFraction, checkInt32, getLn10, getPi,
   *                           naturalLogarithm, config, parseOther, random, Decimal
   */


  function digitsToString(d) {
    var i, k, ws,
      indexOfLastWord = d.length - 1,
      str = '',
      w = d[0];

    if (indexOfLastWord > 0) {
      str += w;
      for (i = 1; i < indexOfLastWord; i++) {
        ws = d[i] + '';
        k = LOG_BASE - ws.length;
        if (k) str += getZeroString(k);
        str += ws;
      }

      w = d[i];
      ws = w + '';
      k = LOG_BASE - ws.length;
      if (k) str += getZeroString(k);
    } else if (w === 0) {
      return '0';
    }

    // Remove trailing zeros of last w.
    for (; w % 10 === 0;) w /= 10;

    return str + w;
  }


  function checkInt32(i, min, max) {
    if (i !== ~~i || i < min || i > max) {
      throw Error(invalidArgument + i);
    }
  }


  /*
   * Check 5 rounding digits if `repeating` is null, 4 otherwise.
   * `repeating == null` if caller is `log` or `pow`,
   * `repeating != null` if caller is `naturalLogarithm` or `naturalExponential`.
   */
  function checkRoundingDigits(d, i, rm, repeating) {
    var di, k, r, rd;

    // Get the length of the first word of the array d.
    for (k = d[0]; k >= 10; k /= 10) --i;

    // Is the rounding digit in the first word of d?
    if (--i < 0) {
      i += LOG_BASE;
      di = 0;
    } else {
      di = Math.ceil((i + 1) / LOG_BASE);
      i %= LOG_BASE;
    }

    // i is the index (0 - 6) of the rounding digit.
    // E.g. if within the word 3487563 the first rounding digit is 5,
    // then i = 4, k = 1000, rd = 3487563 % 1000 = 563
    k = mathpow(10, LOG_BASE - i);
    rd = d[di] % k | 0;

    if (repeating == null) {
      if (i < 3) {
        if (i == 0) rd = rd / 100 | 0;
        else if (i == 1) rd = rd / 10 | 0;
        r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 50000 || rd == 0;
      } else {
        r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) &&
          (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 ||
            (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
      }
    } else {
      if (i < 4) {
        if (i == 0) rd = rd / 1000 | 0;
        else if (i == 1) rd = rd / 100 | 0;
        else if (i == 2) rd = rd / 10 | 0;
        r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
      } else {
        r = ((repeating || rm < 4) && rd + 1 == k ||
        (!repeating && rm > 3) && rd + 1 == k / 2) &&
          (d[di + 1] / k / 1000 | 0) == mathpow(10, i - 3) - 1;
      }
    }

    return r;
  }


  // Convert string of `baseIn` to an array of numbers of `baseOut`.
  // Eg. convertBase('255', 10, 16) returns [15, 15].
  // Eg. convertBase('ff', 16, 10) returns [2, 5, 5].
  function convertBase(str, baseIn, baseOut) {
    var j,
      arr = [0],
      arrL,
      i = 0,
      strL = str.length;

    for (; i < strL;) {
      for (arrL = arr.length; arrL--;) arr[arrL] *= baseIn;
      arr[0] += NUMERALS.indexOf(str.charAt(i++));
      for (j = 0; j < arr.length; j++) {
        if (arr[j] > baseOut - 1) {
          if (arr[j + 1] === void 0) arr[j + 1] = 0;
          arr[j + 1] += arr[j] / baseOut | 0;
          arr[j] %= baseOut;
        }
      }
    }

    return arr.reverse();
  }


  /*
   * cos(x) = 1 - x^2/2! + x^4/4! - ...
   * |x| < pi/2
   *
   */
  function cosine(Ctor, x) {
    var k, len, y;

    if (x.isZero()) return x;

    // Argument reduction: cos(4x) = 8*(cos^4(x) - cos^2(x)) + 1
    // i.e. cos(x) = 8*(cos^4(x/4) - cos^2(x/4)) + 1

    // Estimate the optimum number of times to use the argument reduction.
    len = x.d.length;
    if (len < 32) {
      k = Math.ceil(len / 3);
      y = (1 / tinyPow(4, k)).toString();
    } else {
      k = 16;
      y = '2.3283064365386962890625e-10';
    }

    Ctor.precision += k;

    x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));

    // Reverse argument reduction
    for (var i = k; i--;) {
      var cos2x = x.times(x);
      x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
    }

    Ctor.precision -= k;

    return x;
  }


  /*
   * Perform division in the specified base.
   */
  var divide = (function () {

    // Assumes non-zero x and k, and hence non-zero result.
    function multiplyInteger(x, k, base) {
      var temp,
        carry = 0,
        i = x.length;

      for (x = x.slice(); i--;) {
        temp = x[i] * k + carry;
        x[i] = temp % base | 0;
        carry = temp / base | 0;
      }

      if (carry) x.unshift(carry);

      return x;
    }

    function compare(a, b, aL, bL) {
      var i, r;

      if (aL != bL) {
        r = aL > bL ? 1 : -1;
      } else {
        for (i = r = 0; i < aL; i++) {
          if (a[i] != b[i]) {
            r = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }

      return r;
    }

    function subtract(a, b, aL, base) {
      var i = 0;

      // Subtract b from a.
      for (; aL--;) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base + a[aL] - b[aL];
      }

      // Remove leading zeros.
      for (; !a[0] && a.length > 1;) a.shift();
    }

    return function (x, y, pr, rm, dp, base) {
      var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0,
        yL, yz,
        Ctor = x.constructor,
        sign = x.s == y.s ? 1 : -1,
        xd = x.d,
        yd = y.d;

      // Either NaN, Infinity or 0?
      if (!xd || !xd[0] || !yd || !yd[0]) {

        return new Ctor(// Return NaN if either NaN, or both Infinity or 0.
          !x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN :

          // Return ±0 if x is 0 or y is ±Infinity, or return ±Infinity as y is 0.
          xd && xd[0] == 0 || !yd ? sign * 0 : sign / 0);
      }

      if (base) {
        logBase = 1;
        e = x.e - y.e;
      } else {
        base = BASE;
        logBase = LOG_BASE;
        e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
      }

      yL = yd.length;
      xL = xd.length;
      q = new Ctor(sign);
      qd = q.d = [];

      // Result exponent may be one less than e.
      // The digit array of a Decimal from toStringBinary may have trailing zeros.
      for (i = 0; yd[i] == (xd[i] || 0); i++);

      if (yd[i] > (xd[i] || 0)) e--;

      if (pr == null) {
        sd = pr = Ctor.precision;
        rm = Ctor.rounding;
      } else if (dp) {
        sd = pr + (x.e - y.e) + 1;
      } else {
        sd = pr;
      }

      if (sd < 0) {
        qd.push(1);
        more = true;
      } else {

        // Convert precision in number of base 10 digits to base 1e7 digits.
        sd = sd / logBase + 2 | 0;
        i = 0;

        // divisor < 1e7
        if (yL == 1) {
          k = 0;
          yd = yd[0];
          sd++;

          // k is the carry.
          for (; (i < xL || k) && sd--; i++) {
            t = k * base + (xd[i] || 0);
            qd[i] = t / yd | 0;
            k = t % yd | 0;
          }

          more = k || i < xL;

        // divisor >= 1e7
        } else {

          // Normalise xd and yd so highest order digit of yd is >= base/2
          k = base / (yd[0] + 1) | 0;

          if (k > 1) {
            yd = multiplyInteger(yd, k, base);
            xd = multiplyInteger(xd, k, base);
            yL = yd.length;
            xL = xd.length;
          }

          xi = yL;
          rem = xd.slice(0, yL);
          remL = rem.length;

          // Add zeros to make remainder as long as divisor.
          for (; remL < yL;) rem[remL++] = 0;

          yz = yd.slice();
          yz.unshift(0);
          yd0 = yd[0];

          if (yd[1] >= base / 2) ++yd0;

          do {
            k = 0;

            // Compare divisor and remainder.
            cmp = compare(yd, rem, yL, remL);

            // If divisor < remainder.
            if (cmp < 0) {

              // Calculate trial digit, k.
              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

              // k will be how many times the divisor goes into the current remainder.
              k = rem0 / yd0 | 0;

              //  Algorithm:
              //  1. product = divisor * trial digit (k)
              //  2. if product > remainder: product -= divisor, k--
              //  3. remainder -= product
              //  4. if product was < remainder at 2:
              //    5. compare new remainder and divisor
              //    6. If remainder > divisor: remainder -= divisor, k++

              if (k > 1) {
                if (k >= base) k = base - 1;

                // product = divisor * trial digit.
                prod = multiplyInteger(yd, k, base);
                prodL = prod.length;
                remL = rem.length;

                // Compare product and remainder.
                cmp = compare(prod, rem, prodL, remL);

                // product > remainder.
                if (cmp == 1) {
                  k--;

                  // Subtract divisor from product.
                  subtract(prod, yL < prodL ? yz : yd, prodL, base);
                }
              } else {

                // cmp is -1.
                // If k is 0, there is no need to compare yd and rem again below, so change cmp to 1
                // to avoid it. If k is 1 there is a need to compare yd and rem again below.
                if (k == 0) cmp = k = 1;
                prod = yd.slice();
              }

              prodL = prod.length;
              if (prodL < remL) prod.unshift(0);

              // Subtract product from remainder.
              subtract(rem, prod, remL, base);

              // If product was < previous remainder.
              if (cmp == -1) {
                remL = rem.length;

                // Compare divisor and new remainder.
                cmp = compare(yd, rem, yL, remL);

                // If divisor < new remainder, subtract divisor from remainder.
                if (cmp < 1) {
                  k++;

                  // Subtract divisor from remainder.
                  subtract(rem, yL < remL ? yz : yd, remL, base);
                }
              }

              remL = rem.length;
            } else if (cmp === 0) {
              k++;
              rem = [0];
            }    // if cmp === 1, k will be 0

            // Add the next digit, k, to the result array.
            qd[i++] = k;

            // Update the remainder.
            if (cmp && rem[0]) {
              rem[remL++] = xd[xi] || 0;
            } else {
              rem = [xd[xi]];
              remL = 1;
            }

          } while ((xi++ < xL || rem[0] !== void 0) && sd--);

          more = rem[0] !== void 0;
        }

        // Leading zero?
        if (!qd[0]) qd.shift();
      }

      // logBase is 1 when divide is being used for base conversion.
      if (logBase == 1) {
        q.e = e;
        inexact = more;
      } else {

        // To calculate q.e, first get the number of digits of qd[0].
        for (i = 1, k = qd[0]; k >= 10; k /= 10) i++;
        q.e = i + e * logBase - 1;

        finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
      }

      return q;
    };
  })();


  /*
   * Round `x` to `sd` significant digits using rounding mode `rm`.
   * Check for over/under-flow.
   */
   function finalise(x, sd, rm, isTruncated) {
    var digits, i, j, k, rd, roundUp, w, xd, xdi,
      Ctor = x.constructor;

    // Don't round if sd is null or undefined.
    out: if (sd != null) {
      xd = x.d;

      // Infinity/NaN.
      if (!xd) return x;

      // rd: the rounding digit, i.e. the digit after the digit that may be rounded up.
      // w: the word of xd containing rd, a base 1e7 number.
      // xdi: the index of w within xd.
      // digits: the number of digits of w.
      // i: what would be the index of rd within w if all the numbers were 7 digits long (i.e. if
      // they had leading zeros)
      // j: if > 0, the actual index of rd within w (if < 0, rd is a leading zero).

      // Get the length of the first word of the digits array xd.
      for (digits = 1, k = xd[0]; k >= 10; k /= 10) digits++;
      i = sd - digits;

      // Is the rounding digit in the first word of xd?
      if (i < 0) {
        i += LOG_BASE;
        j = sd;
        w = xd[xdi = 0];

        // Get the rounding digit at index j of w.
        rd = w / mathpow(10, digits - j - 1) % 10 | 0;
      } else {
        xdi = Math.ceil((i + 1) / LOG_BASE);
        k = xd.length;
        if (xdi >= k) {
          if (isTruncated) {

            // Needed by `naturalExponential`, `naturalLogarithm` and `squareRoot`.
            for (; k++ <= xdi;) xd.push(0);
            w = rd = 0;
            digits = 1;
            i %= LOG_BASE;
            j = i - LOG_BASE + 1;
          } else {
            break out;
          }
        } else {
          w = k = xd[xdi];

          // Get the number of digits of w.
          for (digits = 1; k >= 10; k /= 10) digits++;

          // Get the index of rd within w.
          i %= LOG_BASE;

          // Get the index of rd within w, adjusted for leading zeros.
          // The number of leading zeros of w is given by LOG_BASE - digits.
          j = i - LOG_BASE + digits;

          // Get the rounding digit at index j of w.
          rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
        }
      }

      // Are there any non-zero digits after the rounding digit?
      isTruncated = isTruncated || sd < 0 ||
        xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));

      // The expression `w % mathpow(10, digits - j - 1)` returns all the digits of w to the right
      // of the digit at (left-to-right) index j, e.g. if w is 908714 and j is 2, the expression
      // will give 714.

      roundUp = rm < 4
        ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
        : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 &&

          // Check whether the digit to the left of the rounding digit is odd.
          ((i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10) & 1 ||
            rm == (x.s < 0 ? 8 : 7));

      if (sd < 1 || !xd[0]) {
        xd.length = 0;
        if (roundUp) {

          // Convert sd to decimal places.
          sd -= x.e + 1;

          // 1, 0.1, 0.01, 0.001, 0.0001 etc.
          xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
          x.e = -sd || 0;
        } else {

          // Zero.
          xd[0] = x.e = 0;
        }

        return x;
      }

      // Remove excess digits.
      if (i == 0) {
        xd.length = xdi;
        k = 1;
        xdi--;
      } else {
        xd.length = xdi + 1;
        k = mathpow(10, LOG_BASE - i);

        // E.g. 56700 becomes 56000 if 7 is the rounding digit.
        // j > 0 means i > number of leading zeros of w.
        xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
      }

      if (roundUp) {
        for (;;) {

          // Is the digit to be rounded up in the first word of xd?
          if (xdi == 0) {

            // i will be the length of xd[0] before k is added.
            for (i = 1, j = xd[0]; j >= 10; j /= 10) i++;
            j = xd[0] += k;
            for (k = 1; j >= 10; j /= 10) k++;

            // if i != k the length has increased.
            if (i != k) {
              x.e++;
              if (xd[0] == BASE) xd[0] = 1;
            }

            break;
          } else {
            xd[xdi] += k;
            if (xd[xdi] != BASE) break;
            xd[xdi--] = 0;
            k = 1;
          }
        }
      }

      // Remove trailing zeros.
      for (i = xd.length; xd[--i] === 0;) xd.pop();
    }

    if (external) {

      // Overflow?
      if (x.e > Ctor.maxE) {

        // Infinity.
        x.d = null;
        x.e = NaN;

      // Underflow?
      } else if (x.e < Ctor.minE) {

        // Zero.
        x.e = 0;
        x.d = [0];
        // Ctor.underflow = true;
      } // else Ctor.underflow = false;
    }

    return x;
  }


  function finiteToString(x, isExp, sd) {
    if (!x.isFinite()) return nonFiniteToString(x);
    var k,
      e = x.e,
      str = digitsToString(x.d),
      len = str.length;

    if (isExp) {
      if (sd && (k = sd - len) > 0) {
        str = str.charAt(0) + '.' + str.slice(1) + getZeroString(k);
      } else if (len > 1) {
        str = str.charAt(0) + '.' + str.slice(1);
      }

      str = str + (x.e < 0 ? 'e' : 'e+') + x.e;
    } else if (e < 0) {
      str = '0.' + getZeroString(-e - 1) + str;
      if (sd && (k = sd - len) > 0) str += getZeroString(k);
    } else if (e >= len) {
      str += getZeroString(e + 1 - len);
      if (sd && (k = sd - e - 1) > 0) str = str + '.' + getZeroString(k);
    } else {
      if ((k = e + 1) < len) str = str.slice(0, k) + '.' + str.slice(k);
      if (sd && (k = sd - len) > 0) {
        if (e + 1 === len) str += '.';
        str += getZeroString(k);
      }
    }

    return str;
  }


  // Calculate the base 10 exponent from the base 1e7 exponent.
  function getBase10Exponent(digits, e) {
    var w = digits[0];

    // Add the number of digits of the first word of the digits array.
    for ( e *= LOG_BASE; w >= 10; w /= 10) e++;
    return e;
  }


  function getLn10(Ctor, sd, pr) {
    if (sd > LN10_PRECISION) {

      // Reset global state in case the exception is caught.
      external = true;
      if (pr) Ctor.precision = pr;
      throw Error(precisionLimitExceeded);
    }
    return finalise(new Ctor(LN10), sd, 1, true);
  }


  function getPi(Ctor, sd, rm) {
    if (sd > PI_PRECISION) throw Error(precisionLimitExceeded);
    return finalise(new Ctor(PI), sd, rm, true);
  }


  function getPrecision(digits) {
    var w = digits.length - 1,
      len = w * LOG_BASE + 1;

    w = digits[w];

    // If non-zero...
    if (w) {

      // Subtract the number of trailing zeros of the last word.
      for (; w % 10 == 0; w /= 10) len--;

      // Add the number of digits of the first word.
      for (w = digits[0]; w >= 10; w /= 10) len++;
    }

    return len;
  }


  function getZeroString(k) {
    var zs = '';
    for (; k--;) zs += '0';
    return zs;
  }


  /*
   * Return a new Decimal whose value is the value of Decimal `x` to the power `n`, where `n` is an
   * integer of type number.
   *
   * Implements 'exponentiation by squaring'. Called by `pow` and `parseOther`.
   *
   */
  function intPow(Ctor, x, n, pr) {
    var isTruncated,
      r = new Ctor(1),

      // Max n of 9007199254740991 takes 53 loop iterations.
      // Maximum digits array length; leaves [28, 34] guard digits.
      k = Math.ceil(pr / LOG_BASE + 4);

    external = false;

    for (;;) {
      if (n % 2) {
        r = r.times(x);
        if (truncate(r.d, k)) isTruncated = true;
      }

      n = mathfloor(n / 2);
      if (n === 0) {

        // To ensure correct rounding when r.d is truncated, increment the last word if it is zero.
        n = r.d.length - 1;
        if (isTruncated && r.d[n] === 0) ++r.d[n];
        break;
      }

      x = x.times(x);
      truncate(x.d, k);
    }

    external = true;

    return r;
  }


  function isOdd(n) {
    return n.d[n.d.length - 1] & 1;
  }


  /*
   * Handle `max` and `min`. `ltgt` is 'lt' or 'gt'.
   */
  function maxOrMin(Ctor, args, ltgt) {
    var y,
      x = new Ctor(args[0]),
      i = 0;

    for (; ++i < args.length;) {
      y = new Ctor(args[i]);
      if (!y.s) {
        x = y;
        break;
      } else if (x[ltgt](y)) {
        x = y;
      }
    }

    return x;
  }


  /*
   * Return a new Decimal whose value is the natural exponential of `x` rounded to `sd` significant
   * digits.
   *
   * Taylor/Maclaurin series.
   *
   * exp(x) = x^0/0! + x^1/1! + x^2/2! + x^3/3! + ...
   *
   * Argument reduction:
   *   Repeat x = x / 32, k += 5, until |x| < 0.1
   *   exp(x) = exp(x / 2^k)^(2^k)
   *
   * Previously, the argument was initially reduced by
   * exp(x) = exp(r) * 10^k  where r = x - k * ln10, k = floor(x / ln10)
   * to first put r in the range [0, ln10], before dividing by 32 until |x| < 0.1, but this was
   * found to be slower than just dividing repeatedly by 32 as above.
   *
   * Max integer argument: exp('20723265836946413') = 6.3e+9000000000000000
   * Min integer argument: exp('-20723265836946411') = 1.2e-9000000000000000
   * (Math object integer min/max: Math.exp(709) = 8.2e+307, Math.exp(-745) = 5e-324)
   *
   *  exp(Infinity)  = Infinity
   *  exp(-Infinity) = 0
   *  exp(NaN)       = NaN
   *  exp(±0)        = 1
   *
   *  exp(x) is non-terminating for any finite, non-zero x.
   *
   *  The result will always be correctly rounded.
   *
   */
  function naturalExponential(x, sd) {
    var denominator, guard, j, pow, sum, t, wpr,
      rep = 0,
      i = 0,
      k = 0,
      Ctor = x.constructor,
      rm = Ctor.rounding,
      pr = Ctor.precision;

    // 0/NaN/Infinity?
    if (!x.d || !x.d[0] || x.e > 17) {

      return new Ctor(x.d
        ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0
        : x.s ? x.s < 0 ? 0 : x : 0 / 0);
    }

    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }

    t = new Ctor(0.03125);

    // while abs(x) >= 0.1
    while (x.e > -2) {

      // x = x / 2^5
      x = x.times(t);
      k += 5;
    }

    // Use 2 * log10(2^k) + 5 (empirically derived) to estimate the increase in precision
    // necessary to ensure the first 4 rounding digits are correct.
    guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
    wpr += guard;
    denominator = pow = sum = new Ctor(1);
    Ctor.precision = wpr;

    for (;;) {
      pow = finalise(pow.times(x), wpr, 1);
      denominator = denominator.times(++i);
      t = sum.plus(divide(pow, denominator, wpr, 1));

      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
        j = k;
        while (j--) sum = finalise(sum.times(sum), wpr, 1);

        // Check to see if the first 4 rounding digits are [49]999.
        // If so, repeat the summation with a higher precision, otherwise
        // e.g. with precision: 18, rounding: 1
        // exp(18.404272462595034083567793919843761) = 98372560.1229999999 (should be 98372560.123)
        // `wpr - guard` is the index of first rounding digit.
        if (sd == null) {

          if (rep < 3 && checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
            Ctor.precision = wpr += 10;
            denominator = pow = t = new Ctor(1);
            i = 0;
            rep++;
          } else {
            return finalise(sum, Ctor.precision = pr, rm, external = true);
          }
        } else {
          Ctor.precision = pr;
          return sum;
        }
      }

      sum = t;
    }
  }


  /*
   * Return a new Decimal whose value is the natural logarithm of `x` rounded to `sd` significant
   * digits.
   *
   *  ln(-n)        = NaN
   *  ln(0)         = -Infinity
   *  ln(-0)        = -Infinity
   *  ln(1)         = 0
   *  ln(Infinity)  = Infinity
   *  ln(-Infinity) = NaN
   *  ln(NaN)       = NaN
   *
   *  ln(n) (n != 1) is non-terminating.
   *
   */
  function naturalLogarithm(y, sd) {
    var c, c0, denominator, e, numerator, rep, sum, t, wpr, x1, x2,
      n = 1,
      guard = 10,
      x = y,
      xd = x.d,
      Ctor = x.constructor,
      rm = Ctor.rounding,
      pr = Ctor.precision;

    // Is x negative or Infinity, NaN, 0 or 1?
    if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
      return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
    }

    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }

    Ctor.precision = wpr += guard;
    c = digitsToString(xd);
    c0 = c.charAt(0);

    if (Math.abs(e = x.e) < 1.5e15) {

      // Argument reduction.
      // The series converges faster the closer the argument is to 1, so using
      // ln(a^b) = b * ln(a),   ln(a) = ln(a^b) / b
      // multiply the argument by itself until the leading digits of the significand are 7, 8, 9,
      // 10, 11, 12 or 13, recording the number of multiplications so the sum of the series can
      // later be divided by this number, then separate out the power of 10 using
      // ln(a*10^b) = ln(a) + b*ln(10).

      // max n is 21 (gives 0.9, 1.0 or 1.1) (9e15 / 21 = 4.2e14).
      //while (c0 < 9 && c0 != 1 || c0 == 1 && c.charAt(1) > 1) {
      // max n is 6 (gives 0.7 - 1.3)
      while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
        x = x.times(y);
        c = digitsToString(x.d);
        c0 = c.charAt(0);
        n++;
      }

      e = x.e;

      if (c0 > 1) {
        x = new Ctor('0.' + c);
        e++;
      } else {
        x = new Ctor(c0 + '.' + c.slice(1));
      }
    } else {

      // The argument reduction method above may result in overflow if the argument y is a massive
      // number with exponent >= 1500000000000000 (9e15 / 6 = 1.5e15), so instead recall this
      // function using ln(x*10^e) = ln(x) + e*ln(10).
      t = getLn10(Ctor, wpr + 2, pr).times(e + '');
      x = naturalLogarithm(new Ctor(c0 + '.' + c.slice(1)), wpr - guard).plus(t);
      Ctor.precision = pr;

      return sd == null ? finalise(x, pr, rm, external = true) : x;
    }

    // x1 is x reduced to a value near 1.
    x1 = x;

    // Taylor series.
    // ln(y) = ln((1 + x)/(1 - x)) = 2(x + x^3/3 + x^5/5 + x^7/7 + ...)
    // where x = (y - 1)/(y + 1)    (|x| < 1)
    sum = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
    x2 = finalise(x.times(x), wpr, 1);
    denominator = 3;

    for (;;) {
      numerator = finalise(numerator.times(x2), wpr, 1);
      t = sum.plus(divide(numerator, new Ctor(denominator), wpr, 1));

      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
        sum = sum.times(2);

        // Reverse the argument reduction. Check that e is not 0 because, besides preventing an
        // unnecessary calculation, -0 + 0 = +0 and to ensure correct rounding -0 needs to stay -0.
        if (e !== 0) sum = sum.plus(getLn10(Ctor, wpr + 2, pr).times(e + ''));
        sum = divide(sum, new Ctor(n), wpr, 1);

        // Is rm > 3 and the first 4 rounding digits 4999, or rm < 4 (or the summation has
        // been repeated previously) and the first 4 rounding digits 9999?
        // If so, restart the summation with a higher precision, otherwise
        // e.g. with precision: 12, rounding: 1
        // ln(135520028.6126091714265381533) = 18.7246299999 when it should be 18.72463.
        // `wpr - guard` is the index of first rounding digit.
        if (sd == null) {
          if (checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
            Ctor.precision = wpr += guard;
            t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
            x2 = finalise(x.times(x), wpr, 1);
            denominator = rep = 1;
          } else {
            return finalise(sum, Ctor.precision = pr, rm, external = true);
          }
        } else {
          Ctor.precision = pr;
          return sum;
        }
      }

      sum = t;
      denominator += 2;
    }
  }


  // ±Infinity, NaN.
  function nonFiniteToString(x) {
    // Unsigned.
    return String(x.s * x.s / 0);
  }


  /*
   * Parse the value of a new Decimal `x` from string `str`.
   */
  function parseDecimal(x, str) {
    var e, i, len;

    // Decimal point?
    if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

    // Exponential form?
    if ((i = str.search(/e/i)) > 0) {

      // Determine exponent.
      if (e < 0) e = i;
      e += +str.slice(i + 1);
      str = str.substring(0, i);
    } else if (e < 0) {

      // Integer.
      e = str.length;
    }

    // Determine leading zeros.
    for (i = 0; str.charCodeAt(i) === 48; i++);

    // Determine trailing zeros.
    for (len = str.length; str.charCodeAt(len - 1) === 48; --len);
    str = str.slice(i, len);

    if (str) {
      len -= i;
      x.e = e = e - i - 1;
      x.d = [];

      // Transform base

      // e is the base 10 exponent.
      // i is where to slice str to get the first word of the digits array.
      i = (e + 1) % LOG_BASE;
      if (e < 0) i += LOG_BASE;

      if (i < len) {
        if (i) x.d.push(+str.slice(0, i));
        for (len -= LOG_BASE; i < len;) x.d.push(+str.slice(i, i += LOG_BASE));
        str = str.slice(i);
        i = LOG_BASE - str.length;
      } else {
        i -= len;
      }

      for (; i--;) str += '0';
      x.d.push(+str);

      if (external) {

        // Overflow?
        if (x.e > x.constructor.maxE) {

          // Infinity.
          x.d = null;
          x.e = NaN;

        // Underflow?
        } else if (x.e < x.constructor.minE) {

          // Zero.
          x.e = 0;
          x.d = [0];
          // x.constructor.underflow = true;
        } // else x.constructor.underflow = false;
      }
    } else {

      // Zero.
      x.e = 0;
      x.d = [0];
    }

    return x;
  }


  /*
   * Parse the value of a new Decimal `x` from a string `str`, which is not a decimal value.
   */
  function parseOther(x, str) {
    var base, Ctor, divisor, i, isFloat, len, p, xd, xe;

    if (str.indexOf('_') > -1) {
      str = str.replace(/(\d)_(?=\d)/g, '$1');
      if (isDecimal.test(str)) return parseDecimal(x, str);
    } else if (str === 'Infinity' || str === 'NaN') {
      if (!+str) x.s = NaN;
      x.e = NaN;
      x.d = null;
      return x;
    }

    if (isHex.test(str))  {
      base = 16;
      str = str.toLowerCase();
    } else if (isBinary.test(str))  {
      base = 2;
    } else if (isOctal.test(str))  {
      base = 8;
    } else {
      throw Error(invalidArgument + str);
    }

    // Is there a binary exponent part?
    i = str.search(/p/i);

    if (i > 0) {
      p = +str.slice(i + 1);
      str = str.substring(2, i);
    } else {
      str = str.slice(2);
    }

    // Convert `str` as an integer then divide the result by `base` raised to a power such that the
    // fraction part will be restored.
    i = str.indexOf('.');
    isFloat = i >= 0;
    Ctor = x.constructor;

    if (isFloat) {
      str = str.replace('.', '');
      len = str.length;
      i = len - i;

      // log[10](16) = 1.2041... , log[10](88) = 1.9444....
      divisor = intPow(Ctor, new Ctor(base), i, i * 2);
    }

    xd = convertBase(str, base, BASE);
    xe = xd.length - 1;

    // Remove trailing zeros.
    for (i = xe; xd[i] === 0; --i) xd.pop();
    if (i < 0) return new Ctor(x.s * 0);
    x.e = getBase10Exponent(xd, xe);
    x.d = xd;
    external = false;

    // At what precision to perform the division to ensure exact conversion?
    // maxDecimalIntegerPartDigitCount = ceil(log[10](b) * otherBaseIntegerPartDigitCount)
    // log[10](2) = 0.30103, log[10](8) = 0.90309, log[10](16) = 1.20412
    // E.g. ceil(1.2 * 3) = 4, so up to 4 decimal digits are needed to represent 3 hex int digits.
    // maxDecimalFractionPartDigitCount = {Hex:4|Oct:3|Bin:1} * otherBaseFractionPartDigitCount
    // Therefore using 4 * the number of digits of str will always be enough.
    if (isFloat) x = divide(x, divisor, len * 4);

    // Multiply by the binary exponent part if present.
    if (p) x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
    external = true;

    return x;
  }


  /*
   * sin(x) = x - x^3/3! + x^5/5! - ...
   * |x| < pi/2
   *
   */
  function sine(Ctor, x) {
    var k,
      len = x.d.length;

    if (len < 3) {
      return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
    }

    // Argument reduction: sin(5x) = 16*sin^5(x) - 20*sin^3(x) + 5*sin(x)
    // i.e. sin(x) = 16*sin^5(x/5) - 20*sin^3(x/5) + 5*sin(x/5)
    // and  sin(x) = sin(x/5)(5 + sin^2(x/5)(16sin^2(x/5) - 20))

    // Estimate the optimum number of times to use the argument reduction.
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;

    x = x.times(1 / tinyPow(5, k));
    x = taylorSeries(Ctor, 2, x, x);

    // Reverse argument reduction
    var sin2_x,
      d5 = new Ctor(5),
      d16 = new Ctor(16),
      d20 = new Ctor(20);
    for (; k--;) {
      sin2_x = x.times(x);
      x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
    }

    return x;
  }


  // Calculate Taylor series for `cos`, `cosh`, `sin` and `sinh`.
  function taylorSeries(Ctor, n, x, y, isHyperbolic) {
    var j, t, u, x2,
      i = 1,
      pr = Ctor.precision,
      k = Math.ceil(pr / LOG_BASE);

    external = false;
    x2 = x.times(x);
    u = new Ctor(y);

    for (;;) {
      t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
      u = isHyperbolic ? y.plus(t) : y.minus(t);
      y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
      t = u.plus(y);

      if (t.d[k] !== void 0) {
        for (j = k; t.d[j] === u.d[j] && j--;);
        if (j == -1) break;
      }

      j = u;
      u = y;
      y = t;
      t = j;
      i++;
    }

    external = true;
    t.d.length = k + 1;

    return t;
  }


  // Exponent e must be positive and non-zero.
  function tinyPow(b, e) {
    var n = b;
    while (--e) n *= b;
    return n;
  }


  // Return the absolute value of `x` reduced to less than or equal to half pi.
  function toLessThanHalfPi(Ctor, x) {
    var t,
      isNeg = x.s < 0,
      pi = getPi(Ctor, Ctor.precision, 1),
      halfPi = pi.times(0.5);

    x = x.abs();

    if (x.lte(halfPi)) {
      quadrant = isNeg ? 4 : 1;
      return x;
    }

    t = x.divToInt(pi);

    if (t.isZero()) {
      quadrant = isNeg ? 3 : 2;
    } else {
      x = x.minus(t.times(pi));

      // 0 <= x < pi
      if (x.lte(halfPi)) {
        quadrant = isOdd(t) ? (isNeg ? 2 : 3) : (isNeg ? 4 : 1);
        return x;
      }

      quadrant = isOdd(t) ? (isNeg ? 1 : 4) : (isNeg ? 3 : 2);
    }

    return x.minus(pi).abs();
  }


  /*
   * Return the value of Decimal `x` as a string in base `baseOut`.
   *
   * If the optional `sd` argument is present include a binary exponent suffix.
   */
  function toStringBinary(x, baseOut, sd, rm) {
    var base, e, i, k, len, roundUp, str, xd, y,
      Ctor = x.constructor,
      isExp = sd !== void 0;

    if (isExp) {
      checkInt32(sd, 1, MAX_DIGITS);
      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);
    } else {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    }

    if (!x.isFinite()) {
      str = nonFiniteToString(x);
    } else {
      str = finiteToString(x);
      i = str.indexOf('.');

      // Use exponential notation according to `toExpPos` and `toExpNeg`? No, but if required:
      // maxBinaryExponent = floor((decimalExponent + 1) * log[2](10))
      // minBinaryExponent = floor(decimalExponent * log[2](10))
      // log[2](10) = 3.321928094887362347870319429489390175864

      if (isExp) {
        base = 2;
        if (baseOut == 16) {
          sd = sd * 4 - 3;
        } else if (baseOut == 8) {
          sd = sd * 3 - 2;
        }
      } else {
        base = baseOut;
      }

      // Convert the number as an integer then divide the result by its base raised to a power such
      // that the fraction part will be restored.

      // Non-integer.
      if (i >= 0) {
        str = str.replace('.', '');
        y = new Ctor(1);
        y.e = str.length - i;
        y.d = convertBase(finiteToString(y), 10, base);
        y.e = y.d.length;
      }

      xd = convertBase(str, 10, base);
      e = len = xd.length;

      // Remove trailing zeros.
      for (; xd[--len] == 0;) xd.pop();

      if (!xd[0]) {
        str = isExp ? '0p+0' : '0';
      } else {
        if (i < 0) {
          e--;
        } else {
          x = new Ctor(x);
          x.d = xd;
          x.e = e;
          x = divide(x, y, sd, rm, 0, base);
          xd = x.d;
          e = x.e;
          roundUp = inexact;
        }

        // The rounding digit, i.e. the digit after the digit that may be rounded up.
        i = xd[sd];
        k = base / 2;
        roundUp = roundUp || xd[sd + 1] !== void 0;

        roundUp = rm < 4
          ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2))
          : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 ||
            rm === (x.s < 0 ? 8 : 7));

        xd.length = sd;

        if (roundUp) {

          // Rounding up may mean the previous digit has to be rounded up and so on.
          for (; ++xd[--sd] > base - 1;) {
            xd[sd] = 0;
            if (!sd) {
              ++e;
              xd.unshift(1);
            }
          }
        }

        // Determine trailing zeros.
        for (len = xd.length; !xd[len - 1]; --len);

        // E.g. [4, 11, 15] becomes 4bf.
        for (i = 0, str = ''; i < len; i++) str += NUMERALS.charAt(xd[i]);

        // Add binary exponent suffix?
        if (isExp) {
          if (len > 1) {
            if (baseOut == 16 || baseOut == 8) {
              i = baseOut == 16 ? 4 : 3;
              for (--len; len % i; len++) str += '0';
              xd = convertBase(str, base, baseOut);
              for (len = xd.length; !xd[len - 1]; --len);

              // xd[0] will always be be 1
              for (i = 1, str = '1.'; i < len; i++) str += NUMERALS.charAt(xd[i]);
            } else {
              str = str.charAt(0) + '.' + str.slice(1);
            }
          }

          str =  str + (e < 0 ? 'p' : 'p+') + e;
        } else if (e < 0) {
          for (; ++e;) str = '0' + str;
          str = '0.' + str;
        } else {
          if (++e > len) for (e -= len; e-- ;) str += '0';
          else if (e < len) str = str.slice(0, e) + '.' + str.slice(e);
        }
      }

      str = (baseOut == 16 ? '0x' : baseOut == 2 ? '0b' : baseOut == 8 ? '0o' : '') + str;
    }

    return x.s < 0 ? '-' + str : str;
  }


  // Does not strip trailing zeros.
  function truncate(arr, len) {
    if (arr.length > len) {
      arr.length = len;
      return true;
    }
  }


  // Decimal methods


  /*
   *  abs
   *  acos
   *  acosh
   *  add
   *  asin
   *  asinh
   *  atan
   *  atanh
   *  atan2
   *  cbrt
   *  ceil
   *  clamp
   *  clone
   *  config
   *  cos
   *  cosh
   *  div
   *  exp
   *  floor
   *  hypot
   *  ln
   *  log
   *  log2
   *  log10
   *  max
   *  min
   *  mod
   *  mul
   *  pow
   *  random
   *  round
   *  set
   *  sign
   *  sin
   *  sinh
   *  sqrt
   *  sub
   *  sum
   *  tan
   *  tanh
   *  trunc
   */


  /*
   * Return a new Decimal whose value is the absolute value of `x`.
   *
   * x {number|string|Decimal}
   *
   */
  function abs(x) {
    return new this(x).abs();
  }


  /*
   * Return a new Decimal whose value is the arccosine in radians of `x`.
   *
   * x {number|string|Decimal}
   *
   */
  function acos(x) {
    return new this(x).acos();
  }


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic cosine of `x`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function acosh(x) {
    return new this(x).acosh();
  }


  /*
   * Return a new Decimal whose value is the sum of `x` and `y`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function add(x, y) {
    return new this(x).plus(y);
  }


  /*
   * Return a new Decimal whose value is the arcsine in radians of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function asin(x) {
    return new this(x).asin();
  }


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic sine of `x`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function asinh(x) {
    return new this(x).asinh();
  }


  /*
   * Return a new Decimal whose value is the arctangent in radians of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function atan(x) {
    return new this(x).atan();
  }


  /*
   * Return a new Decimal whose value is the inverse of the hyperbolic tangent of `x`, rounded to
   * `precision` significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function atanh(x) {
    return new this(x).atanh();
  }


  /*
   * Return a new Decimal whose value is the arctangent in radians of `y/x` in the range -pi to pi
   * (inclusive), rounded to `precision` significant digits using rounding mode `rounding`.
   *
   * Domain: [-Infinity, Infinity]
   * Range: [-pi, pi]
   *
   * y {number|string|Decimal} The y-coordinate.
   * x {number|string|Decimal} The x-coordinate.
   *
   * atan2(±0, -0)               = ±pi
   * atan2(±0, +0)               = ±0
   * atan2(±0, -x)               = ±pi for x > 0
   * atan2(±0, x)                = ±0 for x > 0
   * atan2(-y, ±0)               = -pi/2 for y > 0
   * atan2(y, ±0)                = pi/2 for y > 0
   * atan2(±y, -Infinity)        = ±pi for finite y > 0
   * atan2(±y, +Infinity)        = ±0 for finite y > 0
   * atan2(±Infinity, x)         = ±pi/2 for finite x
   * atan2(±Infinity, -Infinity) = ±3*pi/4
   * atan2(±Infinity, +Infinity) = ±pi/4
   * atan2(NaN, x) = NaN
   * atan2(y, NaN) = NaN
   *
   */
  function atan2(y, x) {
    y = new this(y);
    x = new this(x);
    var r,
      pr = this.precision,
      rm = this.rounding,
      wpr = pr + 4;

    // Either NaN
    if (!y.s || !x.s) {
      r = new this(NaN);

    // Both ±Infinity
    } else if (!y.d && !x.d) {
      r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
      r.s = y.s;

    // x is ±Infinity or y is ±0
    } else if (!x.d || y.isZero()) {
      r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
      r.s = y.s;

    // y is ±Infinity or x is ±0
    } else if (!y.d || x.isZero()) {
      r = getPi(this, wpr, 1).times(0.5);
      r.s = y.s;

    // Both non-zero and finite
    } else if (x.s < 0) {
      this.precision = wpr;
      this.rounding = 1;
      r = this.atan(divide(y, x, wpr, 1));
      x = getPi(this, wpr, 1);
      this.precision = pr;
      this.rounding = rm;
      r = y.s < 0 ? r.minus(x) : r.plus(x);
    } else {
      r = this.atan(divide(y, x, wpr, 1));
    }

    return r;
  }


  /*
   * Return a new Decimal whose value is the cube root of `x`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function cbrt(x) {
    return new this(x).cbrt();
  }


  /*
   * Return a new Decimal whose value is `x` rounded to an integer using `ROUND_CEIL`.
   *
   * x {number|string|Decimal}
   *
   */
  function ceil(x) {
    return finalise(x = new this(x), x.e + 1, 2);
  }


  /*
   * Return a new Decimal whose value is `x` clamped to the range delineated by `min` and `max`.
   *
   * x {number|string|Decimal}
   * min {number|string|Decimal}
   * max {number|string|Decimal}
   *
   */
  function clamp(x, min, max) {
    return new this(x).clamp(min, max);
  }


  /*
   * Configure global settings for a Decimal constructor.
   *
   * `obj` is an object with one or more of the following properties,
   *
   *   precision  {number}
   *   rounding   {number}
   *   toExpNeg   {number}
   *   toExpPos   {number}
   *   maxE       {number}
   *   minE       {number}
   *   modulo     {number}
   *   crypto     {boolean|number}
   *   defaults   {true}
   *
   * E.g. Decimal.config({ precision: 20, rounding: 4 })
   *
   */
  function config(obj) {
    if (!obj || typeof obj !== 'object') throw Error(decimalError + 'Object expected');
    var i, p, v,
      useDefaults = obj.defaults === true,
      ps = [
        'precision', 1, MAX_DIGITS,
        'rounding', 0, 8,
        'toExpNeg', -EXP_LIMIT, 0,
        'toExpPos', 0, EXP_LIMIT,
        'maxE', 0, EXP_LIMIT,
        'minE', -EXP_LIMIT, 0,
        'modulo', 0, 9
      ];

    for (i = 0; i < ps.length; i += 3) {
      if (p = ps[i], useDefaults) this[p] = DEFAULTS[p];
      if ((v = obj[p]) !== void 0) {
        if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
        else throw Error(invalidArgument + p + ': ' + v);
      }
    }

    if (p = 'crypto', useDefaults) this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
      if (v === true || v === false || v === 0 || v === 1) {
        if (v) {
          if (typeof crypto != 'undefined' && crypto &&
            (crypto.getRandomValues || crypto.randomBytes)) {
            this[p] = true;
          } else {
            throw Error(cryptoUnavailable);
          }
        } else {
          this[p] = false;
        }
      } else {
        throw Error(invalidArgument + p + ': ' + v);
      }
    }

    return this;
  }


  /*
   * Return a new Decimal whose value is the cosine of `x`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function cos(x) {
    return new this(x).cos();
  }


  /*
   * Return a new Decimal whose value is the hyperbolic cosine of `x`, rounded to precision
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function cosh(x) {
    return new this(x).cosh();
  }


  /*
   * Create and return a Decimal constructor with the same configuration properties as this Decimal
   * constructor.
   *
   */
  function clone(obj) {
    var i, p, ps;

    /*
     * The Decimal constructor and exported function.
     * Return a new Decimal instance.
     *
     * v {number|string|Decimal} A numeric value.
     *
     */
    function Decimal(v) {
      var e, i, t,
        x = this;

      // Decimal called without new.
      if (!(x instanceof Decimal)) return new Decimal(v);

      // Retain a reference to this Decimal constructor, and shadow Decimal.prototype.constructor
      // which points to Object.
      x.constructor = Decimal;

      // Duplicate.
      if (isDecimalInstance(v)) {
        x.s = v.s;

        if (external) {
          if (!v.d || v.e > Decimal.maxE) {

            // Infinity.
            x.e = NaN;
            x.d = null;
          } else if (v.e < Decimal.minE) {

            // Zero.
            x.e = 0;
            x.d = [0];
          } else {
            x.e = v.e;
            x.d = v.d.slice();
          }
        } else {
          x.e = v.e;
          x.d = v.d ? v.d.slice() : v.d;
        }

        return;
      }

      t = typeof v;

      if (t === 'number') {
        if (v === 0) {
          x.s = 1 / v < 0 ? -1 : 1;
          x.e = 0;
          x.d = [0];
          return;
        }

        if (v < 0) {
          v = -v;
          x.s = -1;
        } else {
          x.s = 1;
        }

        // Fast path for small integers.
        if (v === ~~v && v < 1e7) {
          for (e = 0, i = v; i >= 10; i /= 10) e++;

          if (external) {
            if (e > Decimal.maxE) {
              x.e = NaN;
              x.d = null;
            } else if (e < Decimal.minE) {
              x.e = 0;
              x.d = [0];
            } else {
              x.e = e;
              x.d = [v];
            }
          } else {
            x.e = e;
            x.d = [v];
          }

          return;

        // Infinity, NaN.
        } else if (v * 0 !== 0) {
          if (!v) x.s = NaN;
          x.e = NaN;
          x.d = null;
          return;
        }

        return parseDecimal(x, v.toString());

      } else if (t !== 'string') {
        throw Error(invalidArgument + v);
      }

      // Minus sign?
      if ((i = v.charCodeAt(0)) === 45) {
        v = v.slice(1);
        x.s = -1;
      } else {
        // Plus sign?
        if (i === 43) v = v.slice(1);
        x.s = 1;
      }

      return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
    }

    Decimal.prototype = P;

    Decimal.ROUND_UP = 0;
    Decimal.ROUND_DOWN = 1;
    Decimal.ROUND_CEIL = 2;
    Decimal.ROUND_FLOOR = 3;
    Decimal.ROUND_HALF_UP = 4;
    Decimal.ROUND_HALF_DOWN = 5;
    Decimal.ROUND_HALF_EVEN = 6;
    Decimal.ROUND_HALF_CEIL = 7;
    Decimal.ROUND_HALF_FLOOR = 8;
    Decimal.EUCLID = 9;

    Decimal.config = Decimal.set = config;
    Decimal.clone = clone;
    Decimal.isDecimal = isDecimalInstance;

    Decimal.abs = abs;
    Decimal.acos = acos;
    Decimal.acosh = acosh;        // ES6
    Decimal.add = add;
    Decimal.asin = asin;
    Decimal.asinh = asinh;        // ES6
    Decimal.atan = atan;
    Decimal.atanh = atanh;        // ES6
    Decimal.atan2 = atan2;
    Decimal.cbrt = cbrt;          // ES6
    Decimal.ceil = ceil;
    Decimal.clamp = clamp;
    Decimal.cos = cos;
    Decimal.cosh = cosh;          // ES6
    Decimal.div = div;
    Decimal.exp = exp;
    Decimal.floor = floor;
    Decimal.hypot = hypot;        // ES6
    Decimal.ln = ln;
    Decimal.log = log;
    Decimal.log10 = log10;        // ES6
    Decimal.log2 = log2;          // ES6
    Decimal.max = max;
    Decimal.min = min;
    Decimal.mod = mod;
    Decimal.mul = mul;
    Decimal.pow = pow;
    Decimal.random = random;
    Decimal.round = round;
    Decimal.sign = sign;          // ES6
    Decimal.sin = sin;
    Decimal.sinh = sinh;          // ES6
    Decimal.sqrt = sqrt;
    Decimal.sub = sub;
    Decimal.sum = sum;
    Decimal.tan = tan;
    Decimal.tanh = tanh;          // ES6
    Decimal.trunc = trunc;        // ES6

    if (obj === void 0) obj = {};
    if (obj) {
      if (obj.defaults !== true) {
        ps = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'maxE', 'minE', 'modulo', 'crypto'];
        for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
      }
    }

    Decimal.config(obj);

    return Decimal;
  }


  /*
   * Return a new Decimal whose value is `x` divided by `y`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function div(x, y) {
    return new this(x).div(y);
  }


  /*
   * Return a new Decimal whose value is the natural exponential of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} The power to which to raise the base of the natural log.
   *
   */
  function exp(x) {
    return new this(x).exp();
  }


  /*
   * Return a new Decimal whose value is `x` round to an integer using `ROUND_FLOOR`.
   *
   * x {number|string|Decimal}
   *
   */
  function floor(x) {
    return finalise(x = new this(x), x.e + 1, 3);
  }


  /*
   * Return a new Decimal whose value is the square root of the sum of the squares of the arguments,
   * rounded to `precision` significant digits using rounding mode `rounding`.
   *
   * hypot(a, b, ...) = sqrt(a^2 + b^2 + ...)
   *
   * arguments {number|string|Decimal}
   *
   */
  function hypot() {
    var i, n,
      t = new this(0);

    external = false;

    for (i = 0; i < arguments.length;) {
      n = new this(arguments[i++]);
      if (!n.d) {
        if (n.s) {
          external = true;
          return new this(1 / 0);
        }
        t = n;
      } else if (t.d) {
        t = t.plus(n.times(n));
      }
    }

    external = true;

    return t.sqrt();
  }


  /*
   * Return true if object is a Decimal instance (where Decimal is any Decimal constructor),
   * otherwise return false.
   *
   */
  function isDecimalInstance(obj) {
    return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
  }


  /*
   * Return a new Decimal whose value is the natural logarithm of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function ln(x) {
    return new this(x).ln();
  }


  /*
   * Return a new Decimal whose value is the log of `x` to the base `y`, or to base 10 if no base
   * is specified, rounded to `precision` significant digits using rounding mode `rounding`.
   *
   * log[y](x)
   *
   * x {number|string|Decimal} The argument of the logarithm.
   * y {number|string|Decimal} The base of the logarithm.
   *
   */
  function log(x, y) {
    return new this(x).log(y);
  }


  /*
   * Return a new Decimal whose value is the base 2 logarithm of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function log2(x) {
    return new this(x).log(2);
  }


  /*
   * Return a new Decimal whose value is the base 10 logarithm of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function log10(x) {
    return new this(x).log(10);
  }


  /*
   * Return a new Decimal whose value is the maximum of the arguments.
   *
   * arguments {number|string|Decimal}
   *
   */
  function max() {
    return maxOrMin(this, arguments, 'lt');
  }


  /*
   * Return a new Decimal whose value is the minimum of the arguments.
   *
   * arguments {number|string|Decimal}
   *
   */
  function min() {
    return maxOrMin(this, arguments, 'gt');
  }


  /*
   * Return a new Decimal whose value is `x` modulo `y`, rounded to `precision` significant digits
   * using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function mod(x, y) {
    return new this(x).mod(y);
  }


  /*
   * Return a new Decimal whose value is `x` multiplied by `y`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function mul(x, y) {
    return new this(x).mul(y);
  }


  /*
   * Return a new Decimal whose value is `x` raised to the power `y`, rounded to precision
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} The base.
   * y {number|string|Decimal} The exponent.
   *
   */
  function pow(x, y) {
    return new this(x).pow(y);
  }


  /*
   * Returns a new Decimal with a random value equal to or greater than 0 and less than 1, and with
   * `sd`, or `Decimal.precision` if `sd` is omitted, significant digits (or less if trailing zeros
   * are produced).
   *
   * [sd] {number} Significant digits. Integer, 0 to MAX_DIGITS inclusive.
   *
   */
  function random(sd) {
    var d, e, k, n,
      i = 0,
      r = new this(1),
      rd = [];

    if (sd === void 0) sd = this.precision;
    else checkInt32(sd, 1, MAX_DIGITS);

    k = Math.ceil(sd / LOG_BASE);

    if (!this.crypto) {
      for (; i < k;) rd[i++] = Math.random() * 1e7 | 0;

    // Browsers supporting crypto.getRandomValues.
    } else if (crypto.getRandomValues) {
      d = crypto.getRandomValues(new Uint32Array(k));

      for (; i < k;) {
        n = d[i];

        // 0 <= n < 4294967296
        // Probability n >= 4.29e9, is 4967296 / 4294967296 = 0.00116 (1 in 865).
        if (n >= 4.29e9) {
          d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
        } else {

          // 0 <= n <= 4289999999
          // 0 <= (n % 1e7) <= 9999999
          rd[i++] = n % 1e7;
        }
      }

    // Node.js supporting crypto.randomBytes.
    } else if (crypto.randomBytes) {

      // buffer
      d = crypto.randomBytes(k *= 4);

      for (; i < k;) {

        // 0 <= n < 2147483648
        n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 0x7f) << 24);

        // Probability n >= 2.14e9, is 7483648 / 2147483648 = 0.0035 (1 in 286).
        if (n >= 2.14e9) {
          crypto.randomBytes(4).copy(d, i);
        } else {

          // 0 <= n <= 2139999999
          // 0 <= (n % 1e7) <= 9999999
          rd.push(n % 1e7);
          i += 4;
        }
      }

      i = k / 4;
    } else {
      throw Error(cryptoUnavailable);
    }

    k = rd[--i];
    sd %= LOG_BASE;

    // Convert trailing digits to zeros according to sd.
    if (k && sd) {
      n = mathpow(10, LOG_BASE - sd);
      rd[i] = (k / n | 0) * n;
    }

    // Remove trailing words which are zero.
    for (; rd[i] === 0; i--) rd.pop();

    // Zero?
    if (i < 0) {
      e = 0;
      rd = [0];
    } else {
      e = -1;

      // Remove leading words which are zero and adjust exponent accordingly.
      for (; rd[0] === 0; e -= LOG_BASE) rd.shift();

      // Count the digits of the first word of rd to determine leading zeros.
      for (k = 1, n = rd[0]; n >= 10; n /= 10) k++;

      // Adjust the exponent for leading zeros of the first word of rd.
      if (k < LOG_BASE) e -= LOG_BASE - k;
    }

    r.e = e;
    r.d = rd;

    return r;
  }


  /*
   * Return a new Decimal whose value is `x` rounded to an integer using rounding mode `rounding`.
   *
   * To emulate `Math.round`, set rounding to 7 (ROUND_HALF_CEIL).
   *
   * x {number|string|Decimal}
   *
   */
  function round(x) {
    return finalise(x = new this(x), x.e + 1, this.rounding);
  }


  /*
   * Return
   *   1    if x > 0,
   *  -1    if x < 0,
   *   0    if x is 0,
   *  -0    if x is -0,
   *   NaN  otherwise
   *
   * x {number|string|Decimal}
   *
   */
  function sign(x) {
    x = new this(x);
    return x.d ? (x.d[0] ? x.s : 0 * x.s) : x.s || NaN;
  }


  /*
   * Return a new Decimal whose value is the sine of `x`, rounded to `precision` significant digits
   * using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function sin(x) {
    return new this(x).sin();
  }


  /*
   * Return a new Decimal whose value is the hyperbolic sine of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function sinh(x) {
    return new this(x).sinh();
  }


  /*
   * Return a new Decimal whose value is the square root of `x`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   *
   */
  function sqrt(x) {
    return new this(x).sqrt();
  }


  /*
   * Return a new Decimal whose value is `x` minus `y`, rounded to `precision` significant digits
   * using rounding mode `rounding`.
   *
   * x {number|string|Decimal}
   * y {number|string|Decimal}
   *
   */
  function sub(x, y) {
    return new this(x).sub(y);
  }


  /*
   * Return a new Decimal whose value is the sum of the arguments, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * Only the result is rounded, not the intermediate calculations.
   *
   * arguments {number|string|Decimal}
   *
   */
  function sum() {
    var i = 0,
      args = arguments,
      x = new this(args[i]);

    external = false;
    for (; x.s && ++i < args.length;) x = x.plus(args[i]);
    external = true;

    return finalise(x, this.precision, this.rounding);
  }


  /*
   * Return a new Decimal whose value is the tangent of `x`, rounded to `precision` significant
   * digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function tan(x) {
    return new this(x).tan();
  }


  /*
   * Return a new Decimal whose value is the hyperbolic tangent of `x`, rounded to `precision`
   * significant digits using rounding mode `rounding`.
   *
   * x {number|string|Decimal} A value in radians.
   *
   */
  function tanh(x) {
    return new this(x).tanh();
  }


  /*
   * Return a new Decimal whose value is `x` truncated to an integer.
   *
   * x {number|string|Decimal}
   *
   */
  function trunc(x) {
    return finalise(x = new this(x), x.e + 1, 1);
  }


  // Create and configure initial Decimal constructor.
  Decimal = clone(DEFAULTS);
  Decimal.prototype.constructor = Decimal;
  Decimal['default'] = Decimal.Decimal = Decimal;

  // Create the internal constants from their string values.
  LN10 = new Decimal(LN10);
  PI = new Decimal(PI);


  // Export.


  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () {
      return Decimal;
    });

  // Node and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    if (typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol') {
      P[Symbol['for']('nodejs.util.inspect.custom')] = P.toString;
      P[Symbol.toStringTag] = 'Decimal';
    }

    module.exports = Decimal;

  // Browser.
  } else {
    if (!globalScope) {
      globalScope = typeof self != 'undefined' && self && self.self == self ? self : window;
    }

    noConflict = globalScope.Decimal;
    Decimal.noConflict = function () {
      globalScope.Decimal = noConflict;
      return Decimal;
    };

    globalScope.Decimal = Decimal;
  }
})(this);

},{}],2:[function(require,module,exports){
/**
* @license MIT
* @author <steven@velozo.com>
*/
let libSimpleLog = require('./Manyfest-LogToConsole.js');

/**
* Hash Translation
*
* This is a very simple translation table for hashes, which allows the same schema to resolve 
* differently based on a loaded translation table.
*
* This is to prevent the requirement for mutating schemas over and over again when we want to
* reuse the structure but look up data elements by different addresses.
*
* One side-effect of this is that a translation table can "override" the built-in hashes, since
* this is always used to resolve hashes before any of the functionCallByHash(pHash, ...) perform
* their lookups by hash.
*
* @class ManyfestHashTranslation
*/
class ManyfestHashTranslation
{
	constructor(pInfoLog, pErrorLog)
	{
		// Wire in logging
		this.logInfo = (typeof(pInfoLog) === 'function') ? pInfoLog : libSimpleLog;
		this.logError = (typeof(pErrorLog) === 'function') ? pErrorLog : libSimpleLog;

        this.translationTable = {};
	}

    translationCount()
    {
        return Object.keys(this.translationTable).length;
    }

    addTranslation(pTranslation)
    {
        // This adds a translation in the form of:
        // { "SourceHash": "DestinationHash", "SecondSourceHash":"SecondDestinationHash" }
        if (typeof(pTranslation) != 'object')
        {
            this.logError(`Hash translation addTranslation expected a translation be type object but was passed in ${typeof(pTranslation)}`);
            return false;
        }

        let tmpTranslationSources = Object.keys(pTranslation)

        tmpTranslationSources.forEach(
            (pTranslationSource) =>
            {
                if (typeof(pTranslation[pTranslationSource]) != 'string')
                {
                    this.logError(`Hash translation addTranslation expected a translation destination hash for [${pTranslationSource}] to be a string but the referrant was a ${typeof(pTranslation[pTranslationSource])}`);
                }
                else
                {
                    this.translationTable[pTranslationSource] = pTranslation[pTranslationSource];
                }
            });
    }

    removeTranslationHash(pTranslationHash)
    {
        if (this.translationTable.hasOwnProperty(pTranslationHash))
        {
            delete this.translationTable[pTranslationHash];
        }
    }

    // This removes translations.
    // If passed a string, just removes the single one.
    // If passed an object, it does all the source keys.
    removeTranslation(pTranslation)
    {
        if (typeof(pTranslation) == 'string')
        {
            this.removeTranslationHash(pTranslation);
            return true;
        }
        else if (typeof(pTranslation) == 'object')
        {
            let tmpTranslationSources = Object.keys(pTranslation)

            tmpTranslationSources.forEach(
                (pTranslationSource) =>
                {
                    this.removeTranslation(pTranslationSource);
                });
            return true;
        }
        else
        {
            this.logError(`Hash translation removeTranslation expected either a string or an object but the passed-in translation was type ${typeof(pTranslation)}`);
            return false;
        }
    }

    clearTranslations()
    {
        this.translationTable = {};
    }

    translate(pTranslation)
    {
        if (this.translationTable.hasOwnProperty(pTranslation))
        {
            return this.translationTable[pTranslation];
        }
        else
        {
            return pTranslation;
        }
    }
}

module.exports = ManyfestHashTranslation;
},{"./Manyfest-LogToConsole.js":3}],3:[function(require,module,exports){
/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Manyfest simple logging shim (for browser and dependency-free running)
*/

const logToConsole = (pLogLine, pLogObject) =>
{
    let tmpLogLine = (typeof(pLogLine) === 'string') ? pLogLine : '';

    console.log(`[Manyfest] ${tmpLogLine}`);

    if (pLogObject) console.log(JSON.stringify(pLogObject));
};

module.exports = logToConsole;
},{}],4:[function(require,module,exports){
/**
* @license MIT
* @author <steven@velozo.com>
*/
let libSimpleLog = require('./Manyfest-LogToConsole.js');

/**
* Object Address Resolver
* 
* IMPORTANT NOTE: This code is intentionally more verbose than necessary, to
*                 be extremely clear what is going on in the recursion for
*                 each of the three address resolution functions.
* 
*                 Although there is some opportunity to repeat ourselves a
*                 bit less in this codebase (e.g. with detection of arrays
*                 versus objects versus direct properties), it can make
*                 debugging.. challenging.  The minified version of the code
*                 optimizes out almost anything repeated in here.  So please
*                 be kind and rewind... meaning please keep the codebase less
*                 terse and more verbose so humans can comprehend it.
*                 
*
* @class ManyfestObjectAddressResolver
*/
class ManyfestObjectAddressResolver
{
	constructor(pInfoLog, pErrorLog)
	{
		// Wire in logging
		this.logInfo = (typeof(pInfoLog) == 'function') ? pInfoLog : libSimpleLog;
		this.logError = (typeof(pErrorLog) == 'function') ? pErrorLog : libSimpleLog;
	}

	// When a boxed property is passed in, it should have quotes of some
	// kind around it.
	//
	// For instance:
	// 		MyValues['Name']
	// 		MyValues["Age"]
	// 		MyValues[`Cost`]
	//
	// This function removes the wrapping quotes.
	//
	// Please note it *DOES NOT PARSE* template literals, so backticks just
	// end up doing the same thing as other quote types.
	//
	// TODO: Should template literals be processed?  If so what state do they have access to?
	cleanWrapCharacters (pCharacter, pString)
	{
		if (pString.startsWith(pCharacter) && pString.endsWith(pCharacter))
		{
			return pString.substring(1, pString.length - 1);
		}
		else
		{
			return pString;
		}
	}

	// Check if an address exists.
	//
	// This is necessary because the getValueAtAddress function is ambiguous on 
	// whether the element/property is actually there or not (it returns 
	// undefined whether the property exists or not).  This function checks for
	// existance and returns true or false dependent.
	checkAddressExists (pObject, pAddress)
	{
		// TODO: Should these throw an error?
		// Make sure pObject is an object
		if (typeof(pObject) != 'object') return false;
		// Make sure pAddress is a string
		if (typeof(pAddress) != 'string') return false;

		// TODO: Make this work for things like SomeRootObject.Metadata["Some.People.Use.Bad.Object.Property.Names"]
		let tmpSeparatorIndex = pAddress.indexOf('.');

		// This is the terminal address string (no more dots so the RECUSION ENDS IN HERE somehow)
		if (tmpSeparatorIndex == -1)
		{
			// Check if the address refers to a boxed property
			let tmpBracketStartIndex = pAddress.indexOf('[');
			let tmpBracketStopIndex = pAddress.indexOf(']');
			// Boxed elements look like this:
			// 		MyValues[10]
			// 		MyValues['Name']
			// 		MyValues["Age"]
			// 		MyValues[`Cost`]
			//
			// When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
			// The requirements to detect a boxed element are:
			//    1) The start bracket is after character 0
			if ((tmpBracketStartIndex > 0) 
			//    2) The end bracket has something between them
				&& (tmpBracketStopIndex > tmpBracketStartIndex) 
			//    3) There is data 
				&& (tmpBracketStopIndex - tmpBracketStartIndex > 0))
			{
				// The "Name" of the Object contained too the left of the bracket
				let tmpBoxedPropertyName = pAddress.substring(0, tmpBracketStartIndex).trim();

				// If the subproperty doesn't test as a proper Object, none of the rest of this is possible.
				// This is a rare case where Arrays testing as Objects is useful
				if (typeof(pObject[tmpBoxedPropertyName]) !== 'object')
				{
					return false;
				}

				// The "Reference" to the property within it, either an array element or object property
				let tmpBoxedPropertyReference = pAddress.substring(tmpBracketStartIndex+1, tmpBracketStopIndex).trim();
				// Attempt to parse the reference as a number, which will be used as an array element
				let tmpBoxedPropertyNumber = parseInt(tmpBoxedPropertyReference, 10);

				// Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
				//        This seems confusing to me at first read, so explaination:
				//        Is the Boxed Object an Array?  TRUE
				//        And is the Reference inside the boxed Object not a number? TRUE
				//        -->  So when these are in agreement, it's an impossible access state
				if (Array.isArray(pObject[tmpBoxedPropertyName]) == isNaN(tmpBoxedPropertyNumber))
				{
					return false;
				}

				//    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
				//       otherwise we will try to treat it as a dynamic object property.
				if (isNaN(tmpBoxedPropertyNumber))
				{
					// This isn't a number ... let's treat it as a dynamic object property.
					// We would expect the property to be wrapped in some kind of quotes so strip them
					tmpBoxedPropertyReference = this.cleanWrapCharacters('"', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters('`', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters("'", tmpBoxedPropertyReference);

					// Check if the property exists.
					return pObject[tmpBoxedPropertyName].hasOwnProperty(tmpBoxedPropertyReference);
				}
				else
				{
					// Use the new in operator to see if the element is in the array
					return (tmpBoxedPropertyNumber in pObject[tmpBoxedPropertyName]);
				}
			}
			else
			{
				// Check if the property exists
				return pObject.hasOwnProperty(pAddress);
			}
		}
		else
		{
			let tmpSubObjectName = pAddress.substring(0, tmpSeparatorIndex);
			let tmpNewAddress = pAddress.substring(tmpSeparatorIndex+1);

			// Test if the tmpNewAddress is an array or object
			// Check if it's a boxed property
			let tmpBracketStartIndex = tmpSubObjectName.indexOf('[');
			let tmpBracketStopIndex = tmpSubObjectName.indexOf(']');
			// Boxed elements look like this:
			// 		MyValues[42]
			// 		MyValues['Color']
			// 		MyValues["Weight"]
			// 		MyValues[`Diameter`]
			//
			// When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
			// The requirements to detect a boxed element are:
			//    1) The start bracket is after character 0
			if ((tmpBracketStartIndex > 0) 
			//    2) The end bracket has something between them
				&& (tmpBracketStopIndex > tmpBracketStartIndex) 
			//    3) There is data 
				&& (tmpBracketStopIndex - tmpBracketStartIndex > 0))
			{
				let tmpBoxedPropertyName = tmpSubObjectName.substring(0, tmpBracketStartIndex).trim();

				let tmpBoxedPropertyReference = tmpSubObjectName.substring(tmpBracketStartIndex+1, tmpBracketStopIndex).trim();

				let tmpBoxedPropertyNumber = parseInt(tmpBoxedPropertyReference, 10);

				// Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
				//        This seems confusing to me at first read, so explaination:
				//        Is the Boxed Object an Array?  TRUE
				//        And is the Reference inside the boxed Object not a number? TRUE
				//        -->  So when these are in agreement, it's an impossible access state
				// This could be a failure in the recursion chain because they passed something like this in:
				//    StudentData.Sections.Algebra.Students[1].Tardy
				//       BUT
				//         StudentData.Sections.Algebra.Students is an object, so the [1].Tardy is not possible to access
				// This could be a failure in the recursion chain because they passed something like this in:
				//    StudentData.Sections.Algebra.Students["JaneDoe"].Grade
				//       BUT
				//         StudentData.Sections.Algebra.Students is an array, so the ["JaneDoe"].Grade is not possible to access
				// TODO: Should this be an error or something?  Should we keep a log of failures like this?
				if (Array.isArray(pObject[tmpBoxedPropertyName]) == isNaN(tmpBoxedPropertyNumber))
				{
					// Because this is an impossible address, the property doesn't exist
					// TODO: Should we throw an error in this condition?
					return false;
				}

				//This is a bracketed value
				//    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
				//       otherwise we will try to reat it as a dynamic object property.
				if (isNaN(tmpBoxedPropertyNumber))
				{
					// This isn't a number ... let's treat it as a dynanmic object property.
					tmpBoxedPropertyReference = this.cleanWrapCharacters('"', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters('`', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters("'", tmpBoxedPropertyReference);

					// Recurse directly into the subobject
					return this.checkAddressExists(pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference], tmpNewAddress);
				}
				else
				{
					// We parsed a valid number out of the boxed property name, so recurse into the array
					return this.checkAddressExists(pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber], tmpNewAddress);
				}
			}

			// If there is an object property already named for the sub object, but it isn't an object
			// then the system can't set the value in there.  Error and abort!
			if (pObject.hasOwnProperty(tmpSubObjectName) && typeof(pObject[tmpSubObjectName]) !== 'object')
			{
				return false;
			}
			else if (pObject.hasOwnProperty(tmpSubObjectName))
			{
				// If there is already a subobject pass that to the recursive thingy
				return this.checkAddressExists(pObject[tmpSubObjectName], tmpNewAddress);
			}
			else
			{
				// Create a subobject and then pass that
				pObject[tmpSubObjectName] = {};
				return this.checkAddressExists(pObject[tmpSubObjectName], tmpNewAddress);
			}
		}
	}

	// Get the value of an element at an address
	getValueAtAddress (pObject, pAddress)
	{
		// Make sure pObject is an object
		if (typeof(pObject) != 'object') return undefined;
		// Make sure pAddress is a string
		if (typeof(pAddress) != 'string') return undefined;

		// TODO: Make this work for things like SomeRootObject.Metadata["Some.People.Use.Bad.Object.Property.Names"]
		let tmpSeparatorIndex = pAddress.indexOf('.');

		// This is the terminal address string (no more dots so the RECUSION ENDS IN HERE somehow)
		if (tmpSeparatorIndex == -1)
		{
			// Check if the address refers to a boxed property
			let tmpBracketStartIndex = pAddress.indexOf('[');
			let tmpBracketStopIndex = pAddress.indexOf(']');
			// Boxed elements look like this:
			// 		MyValues[10]
			// 		MyValues['Name']
			// 		MyValues["Age"]
			// 		MyValues[`Cost`]
			//
			// When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
			// The requirements to detect a boxed element are:
			//    1) The start bracket is after character 0
			if ((tmpBracketStartIndex > 0) 
			//    2) The end bracket has something between them
				&& (tmpBracketStopIndex > tmpBracketStartIndex) 
			//    3) There is data 
				&& (tmpBracketStopIndex - tmpBracketStartIndex > 0))
			{
				// The "Name" of the Object contained too the left of the bracket
				let tmpBoxedPropertyName = pAddress.substring(0, tmpBracketStartIndex).trim();

				// If the subproperty doesn't test as a proper Object, none of the rest of this is possible.
				// This is a rare case where Arrays testing as Objects is useful
				if (typeof(pObject[tmpBoxedPropertyName]) !== 'object')
				{
					return undefined;
				}

				// The "Reference" to the property within it, either an array element or object property
				let tmpBoxedPropertyReference = pAddress.substring(tmpBracketStartIndex+1, tmpBracketStopIndex).trim();
				// Attempt to parse the reference as a number, which will be used as an array element
				let tmpBoxedPropertyNumber = parseInt(tmpBoxedPropertyReference, 10);

				// Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
				//        This seems confusing to me at first read, so explaination:
				//        Is the Boxed Object an Array?  TRUE
				//        And is the Reference inside the boxed Object not a number? TRUE
				//        -->  So when these are in agreement, it's an impossible access state
				if (Array.isArray(pObject[tmpBoxedPropertyName]) == isNaN(tmpBoxedPropertyNumber))
				{
					return undefined;
				}

				//    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
				//       otherwise we will try to treat it as a dynamic object property.
				if (isNaN(tmpBoxedPropertyNumber))
				{
					// This isn't a number ... let's treat it as a dynamic object property.
					// We would expect the property to be wrapped in some kind of quotes so strip them
					tmpBoxedPropertyReference = this.cleanWrapCharacters('"', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters('`', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters("'", tmpBoxedPropertyReference);

					// Return the value in the property
					return pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference];
				}
				else
				{
					return pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber];
				}
			}
			else
			{
				// Now is the point in recursion to return the value in the address
				return pObject[pAddress];
			}
		}
		else
		{
			let tmpSubObjectName = pAddress.substring(0, tmpSeparatorIndex);
			let tmpNewAddress = pAddress.substring(tmpSeparatorIndex+1);

			// Test if the tmpNewAddress is an array or object
			// Check if it's a boxed property
			let tmpBracketStartIndex = tmpSubObjectName.indexOf('[');
			let tmpBracketStopIndex = tmpSubObjectName.indexOf(']');
			// Boxed elements look like this:
			// 		MyValues[42]
			// 		MyValues['Color']
			// 		MyValues["Weight"]
			// 		MyValues[`Diameter`]
			//
			// When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
			// The requirements to detect a boxed element are:
			//    1) The start bracket is after character 0
			if ((tmpBracketStartIndex > 0) 
			//    2) The end bracket has something between them
				&& (tmpBracketStopIndex > tmpBracketStartIndex) 
			//    3) There is data 
				&& (tmpBracketStopIndex - tmpBracketStartIndex > 0))
			{
				let tmpBoxedPropertyName = tmpSubObjectName.substring(0, tmpBracketStartIndex).trim();

				let tmpBoxedPropertyReference = tmpSubObjectName.substring(tmpBracketStartIndex+1, tmpBracketStopIndex).trim();

				let tmpBoxedPropertyNumber = parseInt(tmpBoxedPropertyReference, 10);

				// Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
				//        This seems confusing to me at first read, so explaination:
				//        Is the Boxed Object an Array?  TRUE
				//        And is the Reference inside the boxed Object not a number? TRUE
				//        -->  So when these are in agreement, it's an impossible access state
				// This could be a failure in the recursion chain because they passed something like this in:
				//    StudentData.Sections.Algebra.Students[1].Tardy
				//       BUT
				//         StudentData.Sections.Algebra.Students is an object, so the [1].Tardy is not possible to access
				// This could be a failure in the recursion chain because they passed something like this in:
				//    StudentData.Sections.Algebra.Students["JaneDoe"].Grade
				//       BUT
				//         StudentData.Sections.Algebra.Students is an array, so the ["JaneDoe"].Grade is not possible to access
				// TODO: Should this be an error or something?  Should we keep a log of failures like this?
				if (Array.isArray(pObject[tmpBoxedPropertyName]) == isNaN(tmpBoxedPropertyNumber))
				{
					return undefined;
				}

				//This is a bracketed value
				//    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
				//       otherwise we will try to reat it as a dynamic object property.
				if (isNaN(tmpBoxedPropertyNumber))
				{
					// This isn't a number ... let's treat it as a dynanmic object property.
					tmpBoxedPropertyReference = this.cleanWrapCharacters('"', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters('`', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters("'", tmpBoxedPropertyReference);

					// Recurse directly into the subobject
					return this.getValueAtAddress(pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference], tmpNewAddress);
				}
				else
				{
					// We parsed a valid number out of the boxed property name, so recurse into the array
					return this.getValueAtAddress(pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber], tmpNewAddress);
				}
			}

			// If there is an object property already named for the sub object, but it isn't an object
			// then the system can't set the value in there.  Error and abort!
			if (pObject.hasOwnProperty(tmpSubObjectName) && typeof(pObject[tmpSubObjectName]) !== 'object')
			{
				return undefined;
			}
			else if (pObject.hasOwnProperty(tmpSubObjectName))
			{
				// If there is already a subobject pass that to the recursive thingy
				return this.getValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress);
			}
			else
			{
				// Create a subobject and then pass that
				pObject[tmpSubObjectName] = {};
				return this.getValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress);
			}
		}
	}

	// Set the value of an element at an address
	setValueAtAddress (pObject, pAddress, pValue)
	{
		// Make sure pObject is an object
		if (typeof(pObject) != 'object') return false;
		// Make sure pAddress is a string
		if (typeof(pAddress) != 'string') return false;

		let tmpSeparatorIndex = pAddress.indexOf('.');

		if (tmpSeparatorIndex == -1)
		{
			// Check if it's a boxed property
			let tmpBracketStartIndex = pAddress.indexOf('[');
			let tmpBracketStopIndex = pAddress.indexOf(']');
			// Boxed elements look like this:
			// 		MyValues[10]
			// 		MyValues['Name']
			// 		MyValues["Age"]
			// 		MyValues[`Cost`]
			//
			// When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
			// The requirements to detect a boxed element are:
			//    1) The start bracket is after character 0
			if ((tmpBracketStartIndex > 0) 
			//    2) The end bracket has something between them
				&& (tmpBracketStopIndex > tmpBracketStartIndex) 
			//    3) There is data 
				&& (tmpBracketStopIndex - tmpBracketStartIndex > 0))
			{
				// The "Name" of the Object contained too the left of the bracket
				let tmpBoxedPropertyName = pAddress.substring(0, tmpBracketStartIndex).trim();

				// If the subproperty doesn't test as a proper Object, none of the rest of this is possible.
				// This is a rare case where Arrays testing as Objects is useful
				if (typeof(pObject[tmpBoxedPropertyName]) !== 'object')
				{
					return false;
				}

				// The "Reference" to the property within it, either an array element or object property
				let tmpBoxedPropertyReference = pAddress.substring(tmpBracketStartIndex+1, tmpBracketStopIndex).trim();
				// Attempt to parse the reference as a number, which will be used as an array element
				let tmpBoxedPropertyNumber = parseInt(tmpBoxedPropertyReference, 10);

				// Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
				//        This seems confusing to me at first read, so explaination:
				//        Is the Boxed Object an Array?  TRUE
				//        And is the Reference inside the boxed Object not a number? TRUE
				//        -->  So when these are in agreement, it's an impossible access state
				if (Array.isArray(pObject[tmpBoxedPropertyName]) == isNaN(tmpBoxedPropertyNumber))
				{
					return false;
				}

				//    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
				//       otherwise we will try to treat it as a dynamic object property.
				if (isNaN(tmpBoxedPropertyNumber))
				{
					// This isn't a number ... let's treat it as a dynamic object property.
					// We would expect the property to be wrapped in some kind of quotes so strip them
					tmpBoxedPropertyReference = this.cleanWrapCharacters('"', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters('`', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters("'", tmpBoxedPropertyReference);

					// Return the value in the property
					pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference] = pValue;
					return true;
				}
				else
				{
					pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber] = pValue;
					return true;
				}
			}
			else
			{
				// Now is the time in recursion to set the value in the object
				pObject[pAddress] = pValue;
				return true;
			}
		}
		else
		{
			let tmpSubObjectName = pAddress.substring(0, tmpSeparatorIndex);
			let tmpNewAddress = pAddress.substring(tmpSeparatorIndex+1);

			// Test if the tmpNewAddress is an array or object
			// Check if it's a boxed property
			let tmpBracketStartIndex = tmpSubObjectName.indexOf('[');
			let tmpBracketStopIndex = tmpSubObjectName.indexOf(']');
			// Boxed elements look like this:
			// 		MyValues[42]
			// 		MyValues['Color']
			// 		MyValues["Weight"]
			// 		MyValues[`Diameter`]
			//
			// When we are passed SomeObject["Name"] this code below recurses as if it were SomeObject.Name
			// The requirements to detect a boxed element are:
			//    1) The start bracket is after character 0
			if ((tmpBracketStartIndex > 0) 
			//    2) The end bracket has something between them
				&& (tmpBracketStopIndex > tmpBracketStartIndex) 
			//    3) There is data 
				&& (tmpBracketStopIndex - tmpBracketStartIndex > 0))
			{
				let tmpBoxedPropertyName = tmpSubObjectName.substring(0, tmpBracketStartIndex).trim();

				let tmpBoxedPropertyReference = tmpSubObjectName.substring(tmpBracketStartIndex+1, tmpBracketStopIndex).trim();

				let tmpBoxedPropertyNumber = parseInt(tmpBoxedPropertyReference, 10);

				// Guard: If the referrant is a number and the boxed property is not an array, or vice versa, return undefined.
				//        This seems confusing to me at first read, so explaination:
				//        Is the Boxed Object an Array?  TRUE
				//        And is the Reference inside the boxed Object not a number? TRUE
				//        -->  So when these are in agreement, it's an impossible access state
				// This could be a failure in the recursion chain because they passed something like this in:
				//    StudentData.Sections.Algebra.Students[1].Tardy
				//       BUT
				//         StudentData.Sections.Algebra.Students is an object, so the [1].Tardy is not possible to access
				// This could be a failure in the recursion chain because they passed something like this in:
				//    StudentData.Sections.Algebra.Students["JaneDoe"].Grade
				//       BUT
				//         StudentData.Sections.Algebra.Students is an array, so the ["JaneDoe"].Grade is not possible to access
				// TODO: Should this be an error or something?  Should we keep a log of failures like this?
				if (Array.isArray(pObject[tmpBoxedPropertyName]) == isNaN(tmpBoxedPropertyNumber))
				{
					return false;
				}

				//This is a bracketed value
				//    4) If the middle part is *only* a number (no single, double or backtick quotes) it is an array element,
				//       otherwise we will try to reat it as a dynamic object property.
				if (isNaN(tmpBoxedPropertyNumber))
				{
					// This isn't a number ... let's treat it as a dynanmic object property.
					tmpBoxedPropertyReference = this.cleanWrapCharacters('"', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters('`', tmpBoxedPropertyReference);
					tmpBoxedPropertyReference = this.cleanWrapCharacters("'", tmpBoxedPropertyReference);

					// Recurse directly into the subobject
					return this.setValueAtAddress(pObject[tmpBoxedPropertyName][tmpBoxedPropertyReference], tmpNewAddress, pValue);
				}
				else
				{
					// We parsed a valid number out of the boxed property name, so recurse into the array
					return this.setValueAtAddress(pObject[tmpBoxedPropertyName][tmpBoxedPropertyNumber], tmpNewAddress, pValue);
				}
			}

			// If there is an object property already named for the sub object, but it isn't an object
			// then the system can't set the value in there.  Error and abort!
			if (pObject.hasOwnProperty(tmpSubObjectName) && typeof(pObject[tmpSubObjectName]) !== 'object')
			{
				if (!pObject.hasOwnProperty('__ERROR'))
					pObject['__ERROR'] = {};
				// Put it in an error object so data isn't lost
				pObject['__ERROR'][pAddress] = pValue;
				return false;
			}
			else if (pObject.hasOwnProperty(tmpSubObjectName))
			{
				// If there is already a subobject pass that to the recursive thingy
				return this.setValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress, pValue);
			}
			else
			{
				// Create a subobject and then pass that
				pObject[tmpSubObjectName] = {};
				return this.setValueAtAddress(pObject[tmpSubObjectName], tmpNewAddress, pValue);
			}
		}
	}
};

module.exports = ManyfestObjectAddressResolver;
},{"./Manyfest-LogToConsole.js":3}],5:[function(require,module,exports){
/**
* @license MIT
* @author <steven@velozo.com>
*/
let libSimpleLog = require('./Manyfest-LogToConsole.js');

/**
* Schema Manipulation Functions
*
* @class ManyfestSchemaManipulation
*/
class ManyfestSchemaManipulation
{
	constructor(pInfoLog, pErrorLog)
	{
		// Wire in logging
		this.logInfo = (typeof(pInfoLog) === 'function') ? pInfoLog : libSimpleLog;
		this.logError = (typeof(pErrorLog) === 'function') ? pErrorLog : libSimpleLog;
	}

    // This translates the default address mappings to something different.
    //
    // For instance you can pass in manyfest schema descriptor object:
    // 	{
	//	  "Address.Of.a": { "Hash": "a", "Type": "Number" },
	//	  "Address.Of.b": { "Hash": "b", "Type": "Number" }
	//  }
    //
    //
    // And then an address mapping (basically a Hash->Address map)
    //  {
    //    "a": "New.Address.Of.a",
    //    "b": "New.Address.Of.b"  
    //  }
    //
    // NOTE: This mutates the schema object permanently, altering the base hash.
    //       If there is a collision with an existing address, it can lead to overwrites.
    // TODO: Discuss what should happen on collisions.
	resolveAddressMappings(pManyfestSchemaDescriptors, pAddressMapping)
	{
		if (typeof(pManyfestSchemaDescriptors) != 'object')
		{
			this.logError(`Attempted to resolve address mapping but the descriptor was not an object.`);
			return false;
		}

		if (typeof(pAddressMapping) != 'object')
		{
			// No mappings were passed in
			return true;
		}

		// Get the arrays of both the schema definition and the hash mapping
		let tmpManyfestAddresses = Object.keys(pManyfestSchemaDescriptors);
		let tmpHashMapping = {};
		tmpManyfestAddresses.forEach(
			(pAddress) =>
			{
				if (pManyfestSchemaDescriptors[pAddress].hasOwnProperty('Hash'))
				{
					tmpHashMapping[pManyfestSchemaDescriptors[pAddress].Hash] = pAddress;
				}
			});

		let tmpAddressMappingSet = Object.keys(pAddressMapping);

		tmpAddressMappingSet.forEach(
			(pInputAddress) =>
			{
				let tmpNewDescriptorAddress = pAddressMapping[pInputAddress];
				let tmpOldDescriptorAddress = false;
				let tmpDescriptor = false;

				// See if there is a matching descriptor either by Address directly or Hash
				if (pManyfestSchemaDescriptors.hasOwnProperty(pInputAddress))
				{
					tmpOldDescriptorAddress = pInputAddress;
				}
				else if (tmpHashMapping.hasOwnProperty(pInputAddress))
				{
					tmpOldDescriptorAddress = tmpHashMapping[pInputAddress];
				}

				// If there was a matching descriptor in the manifest, store it in the temporary descriptor
				if (tmpOldDescriptorAddress)
				{
					tmpDescriptor = pManyfestSchemaDescriptors[tmpOldDescriptorAddress];
					delete pManyfestSchemaDescriptors[tmpOldDescriptorAddress];
				}
				else
				{
					// Create a new descriptor!  Map it to the input address.
					tmpDescriptor = { Hash:pInputAddress };
				}

				// Now re-add the descriptor to the manyfest schema
				pManyfestSchemaDescriptors[tmpNewDescriptorAddress] = tmpDescriptor;
			});

		return true;
	}

	safeResolveAddressMappings(pManyfestSchemaDescriptors, pAddressMapping)
	{
		// This returns the descriptors as a new object, safely remapping without mutating the original schema Descriptors
		let tmpManyfestSchemaDescriptors = JSON.parse(JSON.stringify(pManyfestSchemaDescriptors));
		this.resolveAddressMappings(tmpManyfestSchemaDescriptors, pAddressMapping);
		return tmpManyfestSchemaDescriptors;
	}
}

module.exports = ManyfestSchemaManipulation;
},{"./Manyfest-LogToConsole.js":3}],6:[function(require,module,exports){
/**
* @license MIT
* @author <steven@velozo.com>
*/
let libSimpleLog = require('./Manyfest-LogToConsole.js');
let libObjectAddressResolver = require('./Manyfest-ObjectAddressResolver.js');
let libHashTranslation = require('./Manyfest-HashTranslation.js');
let libSchemaManipulation = require('./Manyfest-SchemaManipulation.js');

/**
* Manyfest object address-based descriptions and manipulations.
*
* @class Manyfest
*/
class Manyfest
{
	constructor(pManifest, pInfoLog, pErrorLog, pOptions)
	{
		// Wire in logging
		this.logInfo = (typeof(pInfoLog) === 'function') ? pInfoLog : libSimpleLog;
		this.logError = (typeof(pErrorLog) === 'function') ? pErrorLog : libSimpleLog;

		// Create an object address resolver and map in the functions
		this.objectAddressResolver = new libObjectAddressResolver(this.logInfo, this.logError);

		this.options = (
			{
				strict: false,
				defaultValues: 
					{
						"String": "",
						"Number": 0,
						"Float": 0.0,
						"Integer": 0,
						"Boolean": false,
						"Binary": 0,
						"DateTime": 0,
						"Array": [],
						"Object": {},
						"Null": null
					}
			});

		this.scope = undefined;
		this.elementAddresses = undefined;
		this.elementHashes = undefined;
		this.elementDescriptors = undefined;

		this.reset();

		if (typeof(pManifest) === 'object')
		{
			this.loadManifest(pManifest);
		}

		this.schemaManipulations = new libSchemaManipulation(this.logInfo, this.logError);

		this.hashTranslations = new libHashTranslation(this.logInfo, this.logError);
	}

	/*************************************************************************
	 * Schema Manifest Loading, Reading, Manipulation and Serialization Functions
	 */

	// Reset critical manifest properties
	reset()
	{
		this.scope = 'DEFAULT';
		this.elementAddresses = [];
		this.elementHashes = {};
		this.elementDescriptors = {};
	}

	// Deserialize a Manifest from a string
	deserialize(pManifestString)
	{
		// TODO: Add guards for bad manifest string
		return this.loadManifest(JSON.parse(pManifestString));
	}

	// Load a manifest from an object
	loadManifest(pManifest)
	{
		if (typeof(pManifest) !== 'object')
		{
			this.logError(`(${this.scope}) Error loading manifest; expecting an object but parameter was type ${typeof(pManifest)}.`);
			return false;
		}

		if (pManifest.hasOwnProperty('Scope'))
		{
			if (typeof(pManifest.Scope) === 'string')
			{
				this.scope = pManifest.Scope;
			}
			else
			{
				this.logError(`(${this.scope}) Error loading scope from manifest; expecting a string but property was type ${typeof(pManifest.Scope)}.`, pManifest);
			}
		}
		else
		{
			this.logError(`(${this.scope}) Error loading scope from manifest object.  Property "Scope" does not exist in the root of the object.`, pManifest);
		}

		if (pManifest.hasOwnProperty('Descriptors'))
		{
			if (typeof(pManifest.Descriptors) === 'object')
			{
				let tmpDescriptionAddresses = Object.keys(pManifest.Descriptors);
				for (let i = 0; i < tmpDescriptionAddresses.length; i++)
				{
					this.addDescriptor(tmpDescriptionAddresses[i], pManifest.Descriptors[tmpDescriptionAddresses[i]]);
				}
			}
			else
			{
				this.logError(`(${this.scope}) Error loading description object from manifest object.  Expecting an object in 'Manifest.Descriptors' but the property was type ${typeof(pManifest.Descriptors)}.`, pManifest);
			}
		}
		else
		{
			this.logError(`(${this.scope}) Error loading object description from manifest object.  Property "Descriptors" does not exist in the root of the Manifest object.`, pManifest);
		}
	}

	// Serialize the Manifest to a string
	serialize()
	{
		return JSON.stringify(this.getManifest());
	}

	getManifest()
	{
		let tmpManifest = (
			{
				Scope: this.scope,
				Descriptors: JSON.parse(JSON.stringify(this.elementDescriptors))
			});
	}

	// Add a descriptor to the manifest
	addDescriptor(pAddress, pDescriptor)
	{
		if (typeof(pDescriptor) === 'object')
		{
			// Add the Address into the Descriptor if it doesn't exist:
			if (!pDescriptor.hasOwnProperty('Address'))
			{
				pDescriptor.Address = pAddress;
			}

			if (!this.elementDescriptors.hasOwnProperty(pAddress))
			{
				this.elementAddresses.push(pAddress);
			}

			// Add the element descriptor to the schema
			this.elementDescriptors[pAddress] = pDescriptor;

			// Always add the address as a hash
			this.elementHashes[pAddress] = pAddress;

			if (pDescriptor.hasOwnProperty('Hash'))
			{
				// TODO: Check if this is a good idea or not..
				//       Collisions are bound to happen with both representations of the address/hash in here and developers being able to create their own hashes.
				this.elementHashes[pDescriptor.Hash] = pAddress;
			}
			else
			{
				pDescriptor.Hash = pAddress;
			}

			return true;
		}
		else
		{
			this.logError(`(${this.scope}) Error loading object descriptor for address '${pAddress}' from manifest object.  Expecting an object but property was type ${typeof(pDescriptor)}.`);
			return false;
		}	
	}

	getDescriptorByHash(pHash)
	{
		return this.getDescriptor(this.resolveHashAddress(pHash));
	}

	getDescriptor(pAddress)
	{
		return this.elementDescriptors[pAddress];
	}

	/*************************************************************************
	 * Beginning of Object Manipulation (read & write) Functions
	 */
	// Check if an element exists by its hash
	checkAddressExistsByHash (pObject, pHash)
	{
		return this.checkAddressExists(pObject,this.resolveHashAddress(pHash));
	}

	// Check if an element exists at an address
	checkAddressExists (pObject, pAddress)
	{
		return this.objectAddressResolver.checkAddressExists(pObject, pAddress);
	}

	// Turn a hash into an address, factoring in the translation table.
	resolveHashAddress(pHash)
	{
		let tmpAddress = undefined;

		let tmpInElementHashTable = this.elementHashes.hasOwnProperty(pHash);
		let tmpInTranslationTable = this.hashTranslations.translationTable.hasOwnProperty(pHash);

		// The most straightforward: the hash exists, no translations.
		if (tmpInElementHashTable && !tmpInTranslationTable)
		{
			tmpAddress = this.elementHashes[pHash];
		}
		// There is a translation from one hash to another, and, the elementHashes contains the pointer end
		else if (tmpInTranslationTable && this.elementHashes.hasOwnProperty(this.hashTranslations.translate(pHash)))
		{
			tmpAddress = this.elementHashes[this.hashTranslations.translate(pHash)];
		}
		// Use the level of indirection only in the Translation Table 
		else if (tmpInTranslationTable)
		{
			tmpAddress = this.hashTranslations.translate(pHash);
		}
		// Just treat the hash as an address.
		// TODO: Discuss this ... it is magic but controversial
		else
		{
			tmpAddress = pHash;
		}

		return tmpAddress;
	}

	// Get the value of an element by its hash
	getValueByHash (pObject, pHash)
	{
		return this.getValueAtAddress(pObject, this.resolveHashAddress(pHash));
	}

	// Get the value of an element at an address
	getValueAtAddress (pObject, pAddress)
	{
		return this.objectAddressResolver.getValueAtAddress(pObject, pAddress);
	}

	// Set the value of an element by its hash
	setValueByHash(pObject, pHash, pValue)
	{
		return this.setValueAtAddress(pObject, this.resolveHashAddress(pHash), pValue);
	}


	// Set the value of an element at an address
	setValueAtAddress (pObject, pAddress, pValue)
	{
		return this.objectAddressResolver.setValueAtAddress(pObject, pAddress, pValue);
	}

	// Validate the consistency of an object against the schema
	validate(pObject)
	{
		let tmpValidationData =
		{
			Error: null,
			Errors: [],
			MissingElements:[]
		};

		if (typeof(pObject) !== 'object')
		{
			tmpValidationData.Error = true;
			tmpValidationData.Errors.push(`Expected passed in object to be type object but was passed in ${typeof(pObject)}`);
		}

		let addValidationError = (pAddress, pErrorMessage) =>
		{
			tmpValidationData.Error = true;
			tmpValidationData.Errors.push(`Element at address "${pAddress}" ${pErrorMessage}.`);
		};

		// Now enumerate through the values and check for anomalies based on the schema
		for (let i = 0; i < this.elementAddresses.length; i++)
		{
			let tmpDescriptor = this.getDescriptor(this.elementAddresses[i]);
			let tmpValue = this.getValueAtAddress(pObject, tmpDescriptor.Address);

			if (typeof(tmpValue) == 'undefined')
			{
				// This will technically mean that `Object.Some.Value = undefined` will end up showing as "missing"
				// TODO: Do we want to do a different message based on if the property exists but is undefined?
				tmpValidationData.MissingElements.push(tmpDescriptor.Address);
				if (tmpDescriptor.Required || this.options.strict)
				{
					addValidationError(tmpDescriptor.Address, 'is flagged REQUIRED but is not set in the object');
				}
			}

			// Now see if there is a data type specified for this element
			if (tmpDescriptor.DataType)
			{
				let tmpElementType = typeof(tmpValue);
				switch(tmpDescriptor.DataType.toString().trim().toLowerCase())
				{
					case 'string':
						if (tmpElementType != 'string')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but is of the type ${tmpElementType}`);
						}
						break;

					case 'number':
						if (tmpElementType != 'number')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but is of the type ${tmpElementType}`);
						}
						break;

					case 'integer':
						if (tmpElementType != 'number')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but is of the type ${tmpElementType}`);
						}
						else
						{
							let tmpValueString = tmpValue.toString();
							if (tmpValueString.indexOf('.') > -1)
							{
								// TODO: Is this an error?
								addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but has a decimal point in the number.`);
							}
						}
						break;

					case 'float':
						if (tmpElementType != 'number')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but is of the type ${tmpElementType}`);
						}
						break;

					case 'DateTime':
						let tmpValueDate = new Date(tmpValue);
						if (tmpValueDate.toString() == 'Invalid Date')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} but is not parsable as a Date by Javascript`);
						}
	
					default:
						// Check if this is a string, in the default case
						// Note this is only when a DataType is specified and it is an unrecognized data type.
						if (tmpElementType != 'string')
						{
							addValidationError(tmpDescriptor.Address, `has a DataType ${tmpDescriptor.DataType} (which auto-converted to String because it was unrecognized) but is of the type ${tmpElementType}`);
						}
						break;
				}
			}
		}

		return tmpValidationData;
	}

	// Returns a default value, or, the default value for the data type (which is overridable with configuration)
	getDefaultValue(pDescriptor)
	{
		if (pDescriptor.hasOwnProperty('Default'))
		{
			return pDescriptor.Default;
		}
		else
		{
			// Default to a null if it doesn't have a type specified.
			// This will ensure a placeholder is created but isn't misinterpreted.
			let tmpDataType = (pDescriptor.hasOwnProperty('DataType')) ? pDescriptor.DataType : 'String';
			if (this.options.defaultValues.hasOwnProperty(tmpDataType))
			{
				return this.options.defaultValues[tmpDataType];
			}
			else
			{
				// give up and return null
				return null;
			}
		}
	}

	// Enumerate through the schema and populate default values if they don't exist.
	populateDefaults(pObject, pOverwriteProperties)
	{
		return this.populateObject(pObject, pOverwriteProperties,
			// This just sets up a simple filter to see if there is a default set.
			(pDescriptor) =>
			{
				return pDescriptor.hasOwnProperty('Default');
			});
	}

	// Forcefully populate all values even if they don't have defaults.
	// Based on type, this can do unexpected things.
	populateObject(pObject, pOverwriteProperties, fFilter)
	{
		// Automatically create an object if one isn't passed in.
		let tmpObject = (typeof(pObject) === 'object') ? pObject : {};
		// Default to *NOT OVERWRITING* properties
		let tmpOverwriteProperties = (typeof(pOverwriteProperties) == 'undefined') ? false : pOverwriteProperties;
		// This is a filter function, which is passed the schema and allows complex filtering of population
		// The default filter function just returns true, populating everything.
		let tmpFilterFunction = (typeof(fFilter) == 'function') ? fFilter : (pDescriptor) => { return true; };

		this.elementAddresses.forEach(
			(pAddress) =>
			{
				let tmpDescriptor = this.getDescriptor(pAddress);
				// Check the filter function to see if this is an address we want to set the value for.
				if (tmpFilterFunction(tmpDescriptor))
				{
					// If we are overwriting properties OR the property does not exist
					if (tmpOverwriteProperties || !this.checkAddressExists(tmpObject, pAddress))
					{
						this.setValueAtAddress(tmpObject, pAddress, this.getDefaultValue(tmpDescriptor));
					}
				}
			});

		return tmpObject;
	}
};

module.exports = Manyfest;
},{"./Manyfest-HashTranslation.js":2,"./Manyfest-LogToConsole.js":3,"./Manyfest-ObjectAddressResolver.js":4,"./Manyfest-SchemaManipulation.js":5}],7:[function(require,module,exports){
/**
* Precedent Meta-Templating
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*
* @description Process text streams, parsing out meta-template expressions.
*/
var libWordTree = require(`./WordTree.js`);
var libStringParser = require(`./StringParser.js`);

class Precedent
{
	/**
	 * Precedent Constructor
	 */
	constructor()
	{
		this.WordTree = new libWordTree();
		
		this.StringParser = new libStringParser();

		this.ParseTree = this.WordTree.ParseTree;
	}
	
	/**
	 * Add a Pattern to the Parse Tree
	 * @method addPattern
	 * @param {Object} pTree - A node on the parse tree to push the characters into
	 * @param {string} pPattern - The string to add to the tree
	 * @param {number} pIndex - callback function
	 * @return {bool} True if adding the pattern was successful
	 */
	addPattern(pPatternStart, pPatternEnd, pParser)
	{
		return this.WordTree.addPattern(pPatternStart, pPatternEnd, pParser);
	}
	
	/**
	 * Parse a string with the existing parse tree
	 * @method parseString
	 * @param {string} pString - The string to parse
	 * @return {string} The result from the parser
	 */
	parseString(pString)
	{
		return this.StringParser.parseString(pString, this.ParseTree);
	}
}

module.exports = Precedent;

},{"./StringParser.js":8,"./WordTree.js":9}],8:[function(require,module,exports){
/**
* String Parser
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*
* @description Parse a string, properly processing each matched token in the word tree.
*/

class StringParser
{
	/**
	 * StringParser Constructor
	 */
	constructor()
	{
	}
	
	/**
	 * Create a fresh parsing state object to work with.
	 * @method newParserState
	 * @param {Object} pParseTree - A node on the parse tree to begin parsing from (usually root)
	 * @return {Object} A new parser state object for running a character parser on
	 * @private
	 */
	newParserState (pParseTree)
	{
		return (
		{
		    ParseTree: pParseTree,

			Output: '',
			OutputBuffer: '',

			Pattern: false,

			PatternMatch: false,
			PatternMatchOutputBuffer: ''
		});
	}
		
	/**
	 * Assign a node of the parser tree to be the next potential match.
	 * If the node has a PatternEnd property, it is a valid match and supercedes the last valid match (or becomes the initial match).
	 * @method assignNode
	 * @param {Object} pNode - A node on the parse tree to assign
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */
	assignNode (pNode, pParserState)
	{
		pParserState.PatternMatch = pNode;

		// If the pattern has a END we can assume it has a parse function...
		if (pParserState.PatternMatch.hasOwnProperty('PatternEnd'))
		{
			// ... this is the legitimate start of a pattern.
			pParserState.Pattern = pParserState.PatternMatch;
		}
	}
	
	/**
	 * Append a character to the output buffer in the parser state.
	 * This output buffer is used when a potential match is being explored, or a match is being explored.
	 * @method appendOutputBuffer
	 * @param {string} pCharacter - The character to append
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */
	appendOutputBuffer (pCharacter, pParserState)
	{
		pParserState.OutputBuffer += pCharacter;
	}
	
	/**
	 * Flush the output buffer to the output and clear it.
	 * @method flushOutputBuffer
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */
	flushOutputBuffer (pParserState)
	{
		pParserState.Output += pParserState.OutputBuffer;
		pParserState.OutputBuffer = '';
	}

	
	/**
	 * Check if the pattern has ended.  If it has, properly flush the buffer and start looking for new patterns.
	 * @method checkPatternEnd
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */
	checkPatternEnd (pParserState)
	{
		if ((pParserState.OutputBuffer.length >= pParserState.Pattern.PatternEnd.length+pParserState.Pattern.PatternStart.length) && 
			(pParserState.OutputBuffer.substr(-pParserState.Pattern.PatternEnd.length) === pParserState.Pattern.PatternEnd))
		{
			// ... this is the end of a pattern, cut off the end tag and parse it.
			// Trim the start and end tags off the output buffer now
			pParserState.OutputBuffer = pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStart.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStart.length+pParserState.Pattern.PatternEnd.length)));
			// Flush the output buffer.
			this.flushOutputBuffer(pParserState);
			// End pattern mode
			pParserState.Pattern = false;
			pParserState.PatternMatch = false;
		}
	}
	
	/**
	 * Parse a character in the buffer.
	 * @method parseCharacter
	 * @param {string} pCharacter - The character to append
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */
	parseCharacter (pCharacter, pParserState)
	{
		// (1) If we aren't in a pattern match, and we aren't potentially matching, and this may be the start of a new pattern....
		if (!pParserState.PatternMatch && pParserState.ParseTree.hasOwnProperty(pCharacter))
		{
			// ... assign the node as the matched node.
			this.assignNode(pParserState.ParseTree[pCharacter], pParserState);
			this.appendOutputBuffer(pCharacter, pParserState);
		}
		// (2) If we are in a pattern match (actively seeing if this is part of a new pattern token)
		else if (pParserState.PatternMatch)
		{
			// If the pattern has a subpattern with this key
			if (pParserState.PatternMatch.hasOwnProperty(pCharacter))
			{
				// Continue matching patterns.
				this.assignNode(pParserState.PatternMatch[pCharacter], pParserState);
			}
			this.appendOutputBuffer(pCharacter, pParserState);
			if (pParserState.Pattern)
			{
				// ... Check if this is the end of the pattern (if we are matching a valid pattern)...
				this.checkPatternEnd(pParserState);
			}
		}
		// (3) If we aren't in a pattern match or pattern, and this isn't the start of a new pattern (RAW mode)....
		else
		{
			pParserState.Output += pCharacter;
		}
	}
	
	/**
	 * Parse a string for matches, and process any template segments that occur.
	 * @method parseString
	 * @param {string} pString - The string to parse.
	 * @param {Object} pParseTree - The parse tree to begin parsing from (usually root)
	 */
	parseString (pString, pParseTree)
	{
		let tmpParserState = this.newParserState(pParseTree);

		for (var i = 0; i < pString.length; i++)
		{
			// TODO: This is not fast.
			this.parseCharacter(pString[i], tmpParserState);
		}
		
		this.flushOutputBuffer(tmpParserState);
		
		return tmpParserState.Output;
	}
}

module.exports = StringParser;

},{}],9:[function(require,module,exports){
/**
* Word Tree
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*
* @description Create a tree (directed graph) of Javascript objects, one character per object.
*/

class WordTree
{
	/**
	 * WordTree Constructor
	 */
	constructor()
	{
		this.ParseTree = {};
	}
	
	/** 
	 * Add a child character to a Parse Tree node
	 * @method addChild
	 * @param {Object} pTree - A parse tree to push the characters into
	 * @param {string} pPattern - The string to add to the tree
	 * @param {number} pIndex - callback function
	 * @returns {Object} The resulting leaf node that was added (or found)
	 * @private
	 */
	addChild (pTree, pPattern, pIndex)
	{
		if (pIndex > pPattern.length)
			return pTree;
		
		if (!pTree.hasOwnProperty(pPattern[pIndex]))
			pTree[pPattern[pIndex]] = {};
		
		return pTree[pPattern[pIndex]];
	}
	
	/** Add a Pattern to the Parse Tree
	 * @method addPattern
	 * @param {Object} pTree - A node on the parse tree to push the characters into
	 * @param {string} pPattern - The string to add to the tree
	 * @param {number} pIndex - callback function
	 * @return {bool} True if adding the pattern was successful
	 */
	addPattern (pPatternStart, pPatternEnd, pParser)
	{
		if (pPatternStart.length < 1)
			return false;

		let tmpLeaf = this.ParseTree;

		// Add the tree of leaves iteratively
		for (var i = 0; i < pPatternStart.length; i++)
			tmpLeaf = this.addChild(tmpLeaf, pPatternStart, i);

		tmpLeaf.PatternStart = pPatternStart;
		tmpLeaf.PatternEnd = ((typeof(pPatternEnd) === 'string') && (pPatternEnd.length > 0)) ? pPatternEnd : pPatternStart;
		tmpLeaf.Parse = (typeof(pParser) === 'function') ? pParser : 
						(typeof(pParser) === 'string') ? () => { return pParser; } :
						(pData) => { return pData; };

		return true;
	}
}

module.exports = WordTree;

},{}],10:[function(require,module,exports){
/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Elucidator browser shim loader
*/

// Load the manyfest module into the browser global automatically.
var libElucidator = require('./Elucidator.js');

if (typeof(window) === 'object') window.Elucidator = libElucidator;

module.exports = libElucidator;
},{"./Elucidator.js":13}],11:[function(require,module,exports){
/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Instruction Set Bace Class.
*
* @class ElucidatorInstructionSet
*/
class ElucidatorInstructionSet
{
    constructor(pElucidator)
    {
        this.elucidator = pElucidator;

        this.namespace = 'default';
    }

    // Create an empty namespace for instructions and operations if either one doesn't exist
    initializeNamespace()
    {
        if (!this.elucidator.instructionSets.hasOwnProperty(this.namespace))
        {
            this.elucidator.instructionSets[this.namespace.toLowerCase()] = {};
        }
        if (!this.elucidator.operationSets.hasOwnProperty(this.namespace))
        {
            this.elucidator.operationSets[this.namespace.toLowerCase()] = {};
        }
    }

    // Add an instruction to the set
    addInstruction(pInstructionHash, fInstructionFunction)
    {
        if (typeof(pInstructionHash) != 'string')
        {
            this.elucidator.logError(`Attempted to add an instruction with an invalid hash; expected a string but the instruction hash type was ${typeof(pInstructionHash)}`);
            return false;
        }
        if (typeof(fInstructionFunction) != 'function')
        {
            this.elucidator.logError(`Attempted to add an instruction with an invalid function; expected a function but type was ${typeof(fInstructionFunction)}`);
            return false;
        }

        this.elucidator.instructionSets[this.namespace.toLowerCase()][pInstructionHash] = fInstructionFunction;
        return true;
    }

    initializeInstructions()
    {
        // This is where we map in the instructions.
        // If the extending class calls super it will inject a harmless noop into the scope.
        // It isn't recommended to do these inline as lambdas, but this code is generally not expected to be called.
        // Unless the developer wants a noop in their instruction set...........
        this.addInstruction('noop', 
            (pOperation) =>
            {
                pOperation.logInfo('Executing a no-operation operation.');
                return true;
            });

        return true;
    }

    // Add an operation to the set
    addOperation(pOperationHash, pOperation)
    {
        if (typeof(pOperationHash) != 'string')
        {
            this.elucidator.logError(`Attempted to add an operation with an invalid hash; expected a string but the operation hash type was ${typeof(pOperationHash)}`, pOperation);
            return false;
        }
        if (typeof(pOperation) != 'object')
        {
            this.elucidator.logError(`Attempted to add an invalid operation; expected an object data type but the type was ${typeof(pOperation)}`, pOperation);
            return false;
        }
        // Validate the Description subobject, which is key to functioning.
        if (!pOperation.hasOwnProperty("Description"))
        {
            this.elucidator.logError(`Attempted to add an operation with an invalid description; no Description subobject set.`, pOperation);
            return false;
        }
        if (typeof(pOperation.Description) != 'object')
        {
            this.elucidator.logError(`Attempted to add an operation with an invalid description; Description subobject was not an object.  The type was ${typeof(pOperation.Description)}.`, pOperation);
            return false;
        }
        if (typeof(pOperation.Description.Hash) != 'string')
        {
            if (typeof(pOperation.Description.Operation) == 'string')
            {
                // Use the "Operation" as the "Hash"
                pOperation.Description.Hash = pOperation.Description.Operation;
            }
            else
            {
                this.elucidator.logError(`Attempted to add an operation with an invalid description; Description subobject did not contain a valid Hash which is required to call the operation.`, pOperation);
                return false;
            }
        }

        // Now auto create data if it is missing or wrong in the Description
        if ((typeof(pOperation.Description.Namespace) != 'string') || (pOperation.Description.Namespace != this.namespace))
        {
            pOperation.Description.Namespace = this.namespace;
        }
        if (typeof(pOperation.Description.Summary) != 'string')
        {
            pOperation.Description.Summary = `[${pOperation.Description.Namespace}] [${pOperation.Description.Hash}] operation.`;
        }

        // If there are no inputs, or outputs, or steps, add them.
        if (!pOperation.hasOwnProperty('Inputs'))
        {
            pOperation.Inputs = {};
        }
        if (!pOperation.hasOwnProperty('Outputs'))
        {
            pOperation.Outputs = {};
        }
        if (!pOperation.hasOwnProperty('Steps'))
        {
            pOperation.Steps = [];
        }

        // If there are no inputs, or outputs, or steps, add them.
        // TODO: Add a step where we try to load this into Manyfest and see that it's valid.
        if (typeof(pOperation.Inputs) !== 'object')
        {
            this.elucidator.logError(`Attempted to add an operation with an invalid Inputs object.`, pOperation);
            return false;
        }
        // If there are no inputs, or outputs, or steps, add them.
        // TODO: Add a step where we try to load this into Manyfest and see that it's valid.
        if (typeof(pOperation.Outputs) !== 'object')
        {
            this.elucidator.logError(`Attempted to add an operation with an invalid Outputs object.`, pOperation);
            return false;
        }
        if (!Array.isArray(pOperation.Steps))
        {
            this.elucidator.logError(`Attempted to add an operation with an invalid Steps array.`, pOperation);
            return false;
        }


        this.elucidator.operationSets[this.namespace.toLowerCase()][pOperationHash] = pOperation;
        return true;
    }

    initializeOperations()
    {
        this.addOperation('noop', 
            {
                "Description":
                {
                    "Operation": "noop",
                    "Description": "No operation - no affect on any data."
                }
            });

        return true;
    }
};

module.exports = ElucidatorInstructionSet;
},{}],12:[function(require,module,exports){
/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Elucidator simple logging shim (for browser and dependency-free running)
*/

const logToConsole = (pLogLine, pLogObject, pLogLevel) =>
{
    let tmpLogLine = (typeof(pLogLine) === 'string') ? pLogLine : '';
    let tmpLogLevel = (typeof(pLogLevel) === 'string') ? pLogLevel : 'INFO';

    console.log(`[Elucidator:${tmpLogLevel}] ${tmpLogLine}`);

    if (pLogObject) console.log(JSON.stringify(pLogObject,null,4)+"\n");
};

const logInfo = (pLogLine, pLogObject) =>
{
    logToConsole(pLogLine, pLogObject, 'Info');
};


const logWarning = (pLogLine, pLogObject) =>
{
    logToConsole(pLogLine, pLogObject, 'Warning');
};


const logError = (pLogLine, pLogObject) =>
{
    logToConsole(pLogLine, pLogObject, 'Error');
};

module.exports = (
{
    logToConsole: logToConsole,
    info: logInfo,
    warning: logWarning,
    error: logError
});
},{}],13:[function(require,module,exports){
/**
* @license MIT
* @author <steven@velozo.com>
*/
const libSimpleLog = require('./Elucidator-LogToConsole.js');
const libManyfest = require('manyfest');
const libPrecedent = require('precedent');

/**
* Elucidator object address-based descriptions and manipulations.
*
* @class Elucidator
*/
class Elucidator
{
    constructor(pOperations, fInfoLog, fErrorLog)
    {
        // Wire in logging
        this.logInfo = (typeof(fInfoLog) === 'function') ? fInfoLog : libSimpleLog.info;
        this.logWarning = (typeof(fWarningLog) === 'function') ? fWarningLog : libSimpleLog.warning;
        this.logError = (typeof(fErrorLog) === 'function') ? fErrorLog : libSimpleLog.error;

		// Instructions are the basic building blocks for operations
		this.instructionSets = {};

		// Operations are the solvers that can be called (instructions can't be called directly)
		// These can be added at run-time as well
		this.operationSets = {};

		// Decide later how to make this truly unique.
		this.UUID = 0;

		this.loadDefaultInstructionSets();
    }

	// Load an instruction set
	loadInstructionSet(cInstructionSet)
	{
		let tmpInstructionSet = new cInstructionSet(this);
		// Setup the namespace
		tmpInstructionSet.initializeNamespace();
		tmpInstructionSet.initializeInstructions();
		tmpInstructionSet.initializeOperations();
	}

	loadDefaultInstructionSets()
	{
		// The javascript math instructions and operations
		// These provide the "Math" namespace
		this.loadInstructionSet(require(`./InstructionSets/Math-Javascript.js`));

		// A precision javascript library that is consistent across browsers, stable and without mantissa issues
		// These provide the "PreciseMath" namespace
		this.loadInstructionSet(require(`./InstructionSets/PreciseMath-Decimal.js`));

		// The abstract geometry instructions and operations
		// These provide the "Geometry" namespace
		this.loadInstructionSet(require(`./InstructionSets/Geometry.js`));
	}

	//
	solveInternalOperation(pNamespace, pOperationHash, pInputObject, pOutputObject, pDescriptionManyfest, pInputAddressMapping, pOutputAddressMapping, pSolutionContext)
	{
		let tmpOperation = this.operationSets[pNamespace.toLowerCase()][pOperationHash.toLowerCase()];
		return this.solveOperation(tmpOperation, pInputObject, pOutputObject, pDescriptionManyfest, pInputAddressMapping, pOutputAddressMapping, pSolutionContext);
	}

	solveOperation(pOperationObject, pInputObject, pOutputObject, pDescriptionManyfest, pInputAddressMapping, pOutputAddressMapping, pSolutionContext)
	{
		let tmpOperation = JSON.parse(JSON.stringify(pOperationObject));

		// Now that the operation object has been created uniquely, apply any passed-in address-hash remappings
		if (pInputAddressMapping)
		{
			tmpDescriptionManyfest.schemaManipulations.resolveAddressMappings(tmpOperation.Inputs, pInputAddressMapping);
		}
		if (pOutputAddressMapping)
		{
			tmpDescriptionManyfest.schemaManipulations.resolveAddressMappings(tmpOperation.Inputs, pOutputAddressMapping);
		}

		if (typeof(pInputObject) != 'object')
		{
            this.logError(`Attempted to run a solve but the passed in Input was not an object.  The type was ${typeof(pInputObject)}.`);
			return false;
		}
		let tmpInputObject = pInputObject;

		// Default to reusing the input object as the output object.
		let tmpOutputObject = tmpInputObject;

		// This is how recursive solutions bind their context together.
		let tmpSolutionContext = pSolutionContext;
		if (typeof(tmpSolutionContext) === 'undefined')
		{
			tmpSolutionContext = (
				{
					"SolutionGUID": `Solution-${this.UUID++}`, 
					"SolutionBaseNamespace": pOperationObject.Description.Namespace,
					"SolutionBaseOperation": pOperationObject.Description.Operation,
					"SolutionLog": []
				});
			
			// This is the root operation, see if there are Inputs and Outputs created ... if not, create them.
			if (!tmpOperation.hasOwnProperty('Inputs'))
			{
				tmpOperation.Inputs = {};
			}
			if (!tmpOperation.hasOwnProperty('Outputs'))
			{
				tmpOperation.Outputs = {};
			}

			// This is the root Operation, see if there is a hash translation available for either side (input or output)
			if (tmpOperation.hasOwnProperty('InputHashTranslationTable'))
			{
				tmpSolutionContext.InputHashMapping = JSON.parse(JSON.stringify(tmpOperation.InputHashTranslationTable));
			}
			else
			{
				tmpSolutionContext.InputHashMapping = {};
			}

			if (tmpOperation.hasOwnProperty('OutputHashTranslationTable'))
			{
				tmpSolutionContext.OutputHashMapping = JSON.parse(JSON.stringify(tmpOperation.OutputHashTranslationTable));
			}

			if ((typeof(pOutputObject) != 'object')
				&& (typeof(tmpOutputHashMapping) == 'undefined') 
				&& (typeof(tmpInputHashMapping) != 'undefined'))
			{
				// Reuse the input hash mapping if:
				//   1) we auto-mapped the input hash mapping to the output because only an input object was supplied
				//   2) there *was not* an output hash mapping supplied
				//   3) there *was* an input hash mapping supplied
				//
				// This seems simple at first but exposes some really interesting behaviors in terms of
				// reusing the same object and schema for input and output, but having different hash
				// mappings for each of them.
				tmpSolutionContext.OutputHashMapping = tmpSolutionContext.InputHashMapping;
			}
		}

		if (typeof(pOutputObject) == 'object')
		{
			// If the call defined an explicit, different output object from the input object use that instead.
			tmpOutputObject = pOutputObject;
		}

		let tmpDescriptionManyfest = false;
		if (typeof(pDescriptionManyfest) === 'undefined')
		{
			// We are going to use this for some clever schema manipulations, then recreate the object
			tmpDescriptionManyfest = new libManyfest();
			// Synthesize a manyfest from the Input and Output properties
			let tmpManyfestSchema = (
				{
					Scope: 'Solver Data Part Descriptions',
					Descriptors: tmpDescriptionManyfest.schemaManipulations.mergeAddressMappings(tmpOperation.Inputs, tmpOperation.Outputs)
				});
			}
		else
		{
			// Clone the passed-in manyfest, so mutations do not alter the upstream version
			tmpDescriptionManyfest = pDescriptionManyfest.clone();
		}
		if (tmpSolutionContext.InputHashMapping)
		{
			tmpDescriptionManyfest.hashTranslations.addTranslation(tmpSolutionContext.InputHashMapping);
		}
		if (tmpSolutionContext.OutputHashMapping)
		{
			tmpDescriptionManyfest.hashTranslations.addTranslation(tmpSolutionContext.OutputHashMapping);			
		}


		// Set some kind of unique identifier for the operation
		tmpOperation.UUID = this.UUID++;
		tmpOperation.SolutionContext = tmpSolutionContext;

		if (tmpOperation.Description.Synopsys)
		{
			tmpSolutionContext.SolutionLog.push(`[${tmpOperation.UUID}]: Solver running operation ${tmpOperation.Description.Synopsys}`);
		}

		let tmpPrecedent = new libPrecedent();
		tmpPrecedent.addPattern('{{Name:', '}}',
			(pHash)=>
			{
				let tmpHash = pHash.trim();
				let tmpDescriptor = tmpDescriptionManyfest.getDescriptorByHash(tmpHash)

				// Return a human readable value
				if ((typeof(tmpDescriptor) == 'object')  && tmpDescriptor.hasOwnProperty('Name'))
				{
					return tmpDescriptor.Name;
				}
				else
				{
					return tmpHash;
				}
			});
		tmpPrecedent.addPattern('{{InputValue:', '}}',
			(pHash)=>
			{
				let tmpHash = pHash.trim();
				return tmpDescriptionManyfest.getValueByHash(tmpInputObject,tmpHash);
			});
		tmpPrecedent.addPattern('{{OutputValue:', '}}',
			(pHash)=>
			{
				let tmpHash = pHash.trim();
				return tmpDescriptionManyfest.getValueByHash(tmpOutputObject,tmpHash);
			});

		if (tmpOperation.hasOwnProperty('Log') && tmpOperation.Log.hasOwnProperty('PreOperation'))
		{
			if (typeof(tmpOperation.Log.PreOperation) == 'string')
			{
				tmpOperation.SolutionContext.SolutionLog.push(tmpPrecedent.parseString(tmpOperation.Log.PreOperation));
			}
			else if (Array.isArray(tmpOperation.Log.PreOperation))
			{
				for (let i = 0; i < tmpOperation.Log.PreOperation.length; i++)
				{
					if ((typeof(tmpOperation.Log.PreOperation[i]) == 'string'))
					{
						tmpOperation.SolutionContext.SolutionLog.push(tmpPrecedent.parseString(tmpOperation.Log.PreOperation[i]));
					}
				}
			}
		}

		// Now step through each operation and solve
		for (let i = 0; i < tmpOperation.Steps.length; i++)
		{
			let tmpStep = tmpOperation.Steps[i];

			// Instructions are always endpoints -- they *do not* recurse.
			if (tmpStep.hasOwnProperty('Instruction'))
			{
				let tmpInputSchema = (
					{
						"Scope": "InputObject",
						"Descriptors": JSON.parse(JSON.stringify(tmpOperation.Inputs))
					});
				// Perform step-specific address mappings.
				tmpDescriptionManyfest.schemaManipulations.resolveAddressMappings(tmpInputSchema.Descriptors, tmpStep.InputHashAddressMap);
				let tmpInputManyfest = new libManyfest(tmpInputSchema);
				tmpInputManyfest.hashTranslations.addTranslation(tmpSolutionContext.InputHashMapping);

				let tmpOutputSchema = (
					{
						"Scope": "OutputObject",
						"Descriptors": JSON.parse(JSON.stringify(tmpOperation.Outputs))
					});
					tmpDescriptionManyfest.schemaManipulations.resolveAddressMappings(tmpOutputSchema.Descriptors, tmpStep.OutputHashAddressMap);
				let tmpOutputManyfest = new libManyfest(tmpOutputSchema);
				tmpOutputManyfest.hashTranslations.addTranslation(tmpSolutionContext.OutputHashMapping);
	
				// Construct the instruction state object
				let tmpInstructionState = (
				{
					Elucidator: this,

					Namespace: tmpStep.Namespace.toLowerCase(),
					Instruction: tmpStep.Instruction.toLowerCase(),

					Operation: tmpOperation,

					InputObject: tmpInputObject,
					InputManyfest: tmpInputManyfest,

					OutputObject: tmpOutputObject,
					OutputManyfest: tmpOutputManyfest
				});

				if (this.instructionSets[tmpInstructionState.Namespace].hasOwnProperty(tmpInstructionState.Instruction))
				{
					let fInstruction = this.instructionSets[tmpInstructionState.Namespace][tmpInstructionState.Instruction];
					fInstruction(tmpInstructionState);
				}
			}

			// Operations recurse.
			if (tmpStep.hasOwnProperty('Operation'))
			{
				if (typeof(tmpStep.Operation) == 'string')
				{
					this.solveInternalOperation(tmpStep.Namespace, tmpStep.Operation, tmpInputObject, tmpOutputObject, tmpDescriptionManyfest, tmpStep.InputHashAddressMap, tmpStep.OutputHashAddressMap, tmpSolutionContext);
				}
				else if (typeof(tmpStep.Operation) == 'object')
				{
					// You can even define an inline object operation!  This gets crazy fast
					this.solveOperation(tmpStep.Operation, tmpInputObject, tmpOutputObject, tmpDescriptionManyfest, tmpStep.InputHashAddressMap, tmpStep.OutputHashAddressMap, tmpSolutionContext);
				}
			}
		}

		if (tmpOperation.hasOwnProperty('Log') && tmpOperation.Log.hasOwnProperty('PostOperation'))
		{
			if (typeof(tmpOperation.Log.PostOperation) == 'string')
			{
				tmpOperation.SolutionContext.SolutionLog.push(tmpPrecedent.parseString(tmpOperation.Log.PostOperation));
			}
			else if (Array.isArray(tmpOperation.Log.PreOperation))
			{
				for (let i = 0; i < tmpOperation.Log.PostOperation.length; i++)
				{
					if ((typeof(tmpOperation.Log.PostOperation[i]) == 'string'))
					{
						tmpOperation.SolutionContext.SolutionLog.push(tmpPrecedent.parseString(tmpOperation.Log.PostOperation[i]));
					}
				}
			}
		}

		return tmpSolutionContext;
	}
};

module.exports = Elucidator;
},{"./Elucidator-LogToConsole.js":12,"./InstructionSets/Geometry.js":14,"./InstructionSets/Math-Javascript.js":15,"./InstructionSets/PreciseMath-Decimal.js":25,"manyfest":6,"precedent":7}],14:[function(require,module,exports){
// Solution providers are meant to be stateless, and not classes.
// These solution providers are akin to drivers, connecting code libraries or 
// other types of behavior to mapping operations.

let libElucidatorInstructionSet = require('../Elucidator-InstructionSet.js');

class Geometry extends libElucidatorInstructionSet
{
    constructor(pElucidator)
    {
        super(pElucidator);
        this.namespace = 'Geometry';
    }

    // Geometry provides no instructions
    initializeInstructions()
    {
        return true;
    }

    initializeOperations()
    {
        this.addOperation('rectanglearea', require(`./Operations/Geometry-RectangleArea.json`));

        return true;
    }
}

module.exports = Geometry;
},{"../Elucidator-InstructionSet.js":11,"./Operations/Geometry-RectangleArea.json":16}],15:[function(require,module,exports){
// Solution providers are meant to be stateless, and not classes.
// These solution providers are akin to drivers, connecting code libraries or 
// other types of behavior to mapping operations.

let libElucidatorInstructionSet = require('../Elucidator-InstructionSet.js');

let add = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a');
    let tmpB = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b');
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA + tmpB);
    return true;
};

let subtract = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a');
    let tmpB = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b');
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA - tmpB);
    return true;
};

let multiply = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a');
    let tmpB = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b');
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA * tmpB);
    return true;
};

let divide = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a');
    let tmpB = pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b');
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA / tmpB);
    return true;
};

class MathJavascript extends libElucidatorInstructionSet
{
    constructor(pElucidator)
    {
        super(pElucidator);
        this.namespace = 'Math';
    }

    initializeInstructions()
    {
        this.addInstruction('add', add);

        this.addInstruction('subtract', subtract);
        this.addInstruction('sub', subtract);

        this.addInstruction('multiply', multiply);
        this.addInstruction('mul', multiply);

        this.addInstruction('divide', divide);
        this.addInstruction('div', divide);

        return true;
    }

    initializeOperations()
    {
        this.addOperation('add', require(`./Operations/Math-Add.json`));
        this.addOperation('subtract', require(`./Operations/Math-Subtract.json`));
        this.addOperation('multiply', require(`./Operations/Math-Multiply.json`));
        this.addOperation('divide', require(`./Operations/Math-Divide.json`));

        return true;
    }
}

module.exports = MathJavascript;
},{"../Elucidator-InstructionSet.js":11,"./Operations/Math-Add.json":17,"./Operations/Math-Divide.json":18,"./Operations/Math-Multiply.json":19,"./Operations/Math-Subtract.json":20}],16:[function(require,module,exports){
module.exports={
	"Description":
	{
		"Namespace": "Geometry",
		"Operation": "RectangleArea",
		"Synopsis": "Solve for the area of a rectangle:  Area = Width * Height"
	},

	"Inputs": 
	{
		"Width": { "Hash":"Width", "Type":"Number" },
		"Height": { "Hash":"Height", "Type":"Number" }
	},

	"Outputs":
	{
		"Area": { "Hash":"Area", "Name": "Area of the Rectangle"},
		"Ratio": { "Hash":"Ratio", "Name": "The Ratio between the Width and the Height" }
	},
	
	"Log":
	{
		"PreOperation": "Solve for [ {{Name:Area}} ] based on [ {{Name:Width}} ] and [ {{Name:Height}} ].",
		"PostOperation": "Operation complete; [ {{Name:Area}} ] = {{InputValue:Width}} * {{InputValue:Height}} = {{OutputValue:Area}}"
	},

	"Steps":
	[
		{
			"Namespace": "Math",
			"Instruction": "multiply",
			"InputHashAddressMap": 
				{
					"a": "Width",
					"b": "Height"
				},
			"OutputHashAddressMap":
				{
					"x": "Area"
				}
		},
		{
			"Namespace": "Math",
			"Instruction": "divide",
			"InputHashAddressMap": 
				{
					"a": "Width",
					"b": "Height"
				},
			"OutputHashAddressMap":
				{
					"x": "Ratio"
				}
		}
	]
}
},{}],17:[function(require,module,exports){
module.exports={
	"Description":
	{
		"Namespace": "Math",
		"Operation": "Add",
		"Synopsis": "Add two numbers:  x = a + b"
	},

	"Inputs": 
	{
		"a": { "Hash": "a", "Type": "Number" },
		"b": { "Hash": "b", "Type": "Number" }
	},

	"Outputs":
	{
		"x": { "Hash": "x", "Type": "Number" }
	},
	
	"Log":
	{
		"PreOperation": "Add {{Name:a}} and {{Name:b}}, storing the value in {{Name:x}}.",
		"PostOperation": "Operation complete: {{Name:x}} = {{InputValue:a}} + {{InputValue:b}} = {{OutputValue:x}}"		
	},

	"Steps":
	[
		{
			"Namespace": "Math",
			"Instruction": "add"
		}
	]
}
},{}],18:[function(require,module,exports){
module.exports={
	"Description":
	{
		"Namespace": "Math",
		"Operation": "Divide",
		"Synopsis": "Divide two numbers:  x = a / b"
	},

	"Inputs": 
	{
		"a": { "Hash": "a", "Type": "Number" },
		"b": { "Hash": "b", "Type": "Number" }
	},

	"Outputs":
	{
		"x": { "Hash": "x", "Type": "Number" }
	},
	
	"Log":
	{
		"PreOperation": "Divide {{Name:a}} over {{Name:b}}, storing the value in {{Name:x}}.",
		"PostOperation": "Operation complete: {{Name:x}} = {{InputValue:a}} / {{InputValue:b}} = {{OutputValue:x}}"		
	},

	"Steps":
	[
		{
			"Namespace": "Math",
			"Instruction": "divide"
		}
	]
}
},{}],19:[function(require,module,exports){
module.exports={
	"Description":
	{
		"Namespace": "Math",
		"Operation": "Multiply",
		"Synopsis": "Multiply two numbers:  x = a * b"
	},

	"Inputs": 
	{
		"a": { "Hash": "a", "Type": "Number" },
		"b": { "Hash": "b", "Type": "Number" }
	},

	"Outputs":
	{
		"x": { "Hash": "x", "Type": "Number" }
	},
	
	"Log":
	{
		"PreOperation": "Multiply {{Name:a}} and {{Name:b}}, storing the value in {{Name:x}}.",
		"PostOperation": "Operation complete: {{Name:x}} = {{InputValue:a}} * {{InputValue:b}} = {{OutputValue:x}}"		
	},

	"Steps":
	[
		{
			"Namespace": "Math",
			"Instruction": "multiply"
		}
	]
}
},{}],20:[function(require,module,exports){
module.exports={
	"Description":
	{
		"Namespace": "Math",
		"Operation": "Subtract",
		"Synopsis": "Subtract two numbers:  x = a - b"
	},

	"Inputs": 
	{
		"a": { "Hash": "a", "Type": "Number" },
		"b": { "Hash": "b", "Type": "Number" }
	},

	"Outputs":
	{
		"x": { "Hash": "x", "Type": "Number" }
	},
	
	"Log":
	{
		"PreOperation": "Subtract {{Name:a}} and {{Name:b}}, storing the value in {{Name:x}}.",
		"PostOperation": "Operation complete: {{Name:x}} = {{InputValue:a}} - {{InputValue:b}} = {{OutputValue:x}}"		
	},

	"Steps":
	[
		{
			"Namespace": "Math",
			"Instruction": "subtract"
		}
	]
}
},{}],21:[function(require,module,exports){
module.exports={
	"Description":
	{
		"Namespace": "PreciseMath",
		"Operation": "Add",
		"Synopsis": "Precisely add two numbers:  x = a + b"
	},

	"Inputs": 
	{
		"a": { "Hash": "a", "Type": "Number" },
		"b": { "Hash": "b", "Type": "Number" }
	},

	"Outputs":
	{
		"x": { "Hash": "x", "Type": "Number" }
	},
	
	"Log":
	{
		"PreOperation": "Add {{Name:a}} and {{Name:b}}, storing the value in {{Name:x}}.",
		"PostOperation": "Operation complete: {{Name:x}} = {{InputValue:a}} + {{InputValue:b}} = {{OutputValue:x}}"		
	},

	"Steps":
	[
		{
			"Namespace": "PreciseMath",
			"Instruction": "add"
		}
	]
}
},{}],22:[function(require,module,exports){
module.exports={
	"Description":
	{
		"Namespace": "PreciseMath",
		"Operation": "Divide",
		"Synopsis": "Precisely divide two numbers:  x = a / b"
	},

	"Inputs": 
	{
		"a": { "Hash": "a", "Type": "Number" },
		"b": { "Hash": "b", "Type": "Number" }
	},

	"Outputs":
	{
		"x": { "Hash": "x", "Type": "Number" }
	},
	
	"Log":
	{
		"PreOperation": "Divide {{Name:a}} over {{Name:b}}, storing the value in {{Name:x}}.",
		"PostOperation": "Operation complete: {{Name:x}} = {{InputValue:a}} / {{InputValue:b}} = {{OutputValue:x}}"		
	},

	"Steps":
	[
		{
			"Namespace": "PreciseMath",
			"Instruction": "divide"
		}
	]
}
},{}],23:[function(require,module,exports){
module.exports={
	"Description":
	{
		"Namespace": "PreciseMath",
		"Operation": "Multiply",
		"Synopsis": "Precisely multiply two numbers:  x = a * b"
	},

	"Inputs": 
	{
		"a": { "Hash": "a", "Type": "Number" },
		"b": { "Hash": "b", "Type": "Number" }
	},

	"Outputs":
	{
		"x": { "Hash": "x", "Type": "Number" }
	},
	
	"Log":
	{
		"PreOperation": "Multiply {{Name:a}} and {{Name:b}}, storing the value in {{Name:x}}.",
		"PostOperation": "Operation complete: {{Name:x}} = {{InputValue:a}} * {{InputValue:b}} = {{OutputValue:x}}"		
	},

	"Steps":
	[
		{
			"Namespace": "PreciseMath",
			"Instruction": "multiply"
		}
	]
}
},{}],24:[function(require,module,exports){
module.exports={
	"Description":
	{
		"Namespace": "PreciseMath",
		"Operation": "Subtract",
		"Synopsis": "Precisely subtract two numbers:  x = a - b"
	},

	"Inputs": 
	{
		"a": { "Hash": "a", "Type": "Number" },
		"b": { "Hash": "b", "Type": "Number" }
	},

	"Outputs":
	{
		"x": { "Hash": "x", "Type": "Number" }
	},
	
	"Log":
	{
		"PreOperation": "Subtract {{Name:a}} and {{Name:b}}, storing the value in {{Name:x}}.",
		"PostOperation": "Operation complete: {{Name:x}} = {{InputValue:a}} - {{InputValue:b}} = {{OutputValue:x}}"		
	},

	"Steps":
	[
		{
			"Namespace": "PreciseMath",
			"Instruction": "subtract"
		}
	]
}
},{}],25:[function(require,module,exports){
let libElucidatorInstructionSet = require('../Elucidator-InstructionSet.js');

const libDecimal = require('decimal.js');

let add = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
    let tmpB = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b'));
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.plus(tmpB)).toString();
    return true;
};

let subtract = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
    let tmpB = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b'));
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.sub(tmpB)).toString();
    return true;
};

let multiply = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
    let tmpB = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b'));
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.mul(tmpB)).toString();
    return true;
};

let divide = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
    let tmpB = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b'));
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.div(tmpB)).toString();
    return true;
};

let toFraction = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.toFraction().toString());
    return true;
};


class PreciseMath extends libElucidatorInstructionSet
{
    constructor(pElucidator)
    {
        super(pElucidator);
        this.namespace = 'PreciseMath';
    }

    initializeInstructions()
    {
        this.addInstruction('add', add);

        this.addInstruction('subtract', subtract);
        this.addInstruction('sub', subtract);

        this.addInstruction('multiply', multiply);
        this.addInstruction('mul', multiply);

        this.addInstruction('divide', divide);
        this.addInstruction('div', divide);

		this.addInstruction('tofraction', toFraction);

        return true;
    }

    initializeOperations()
    {
        this.addOperation('add', require(`./Operations/PreciseMath-Add.json`));
        this.addOperation('subtract', require(`./Operations/PreciseMath-Subtract.json`));
        this.addOperation('multiply', require(`./Operations/PreciseMath-Multiply.json`));
        this.addOperation('divide', require(`./Operations/PreciseMath-Divide.json`));

        return true;
    }
}

module.exports = PreciseMath;
},{"../Elucidator-InstructionSet.js":11,"./Operations/PreciseMath-Add.json":21,"./Operations/PreciseMath-Divide.json":22,"./Operations/PreciseMath-Multiply.json":23,"./Operations/PreciseMath-Subtract.json":24,"decimal.js":1}]},{},[10])(10)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVjaW1hbC5qcy9kZWNpbWFsLmpzIiwibm9kZV9tb2R1bGVzL21hbnlmZXN0L3NvdXJjZS9NYW55ZmVzdC1IYXNoVHJhbnNsYXRpb24uanMiLCJub2RlX21vZHVsZXMvbWFueWZlc3Qvc291cmNlL01hbnlmZXN0LUxvZ1RvQ29uc29sZS5qcyIsIm5vZGVfbW9kdWxlcy9tYW55ZmVzdC9zb3VyY2UvTWFueWZlc3QtT2JqZWN0QWRkcmVzc1Jlc29sdmVyLmpzIiwibm9kZV9tb2R1bGVzL21hbnlmZXN0L3NvdXJjZS9NYW55ZmVzdC1TY2hlbWFNYW5pcHVsYXRpb24uanMiLCJub2RlX21vZHVsZXMvbWFueWZlc3Qvc291cmNlL01hbnlmZXN0LmpzIiwibm9kZV9tb2R1bGVzL3ByZWNlZGVudC9zb3VyY2UvUHJlY2VkZW50LmpzIiwibm9kZV9tb2R1bGVzL3ByZWNlZGVudC9zb3VyY2UvU3RyaW5nUGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL3ByZWNlZGVudC9zb3VyY2UvV29yZFRyZWUuanMiLCJzb3VyY2UvRWx1Y2lkYXRvci1Ccm93c2VyLVNoaW0uanMiLCJzb3VyY2UvRWx1Y2lkYXRvci1JbnN0cnVjdGlvblNldC5qcyIsInNvdXJjZS9FbHVjaWRhdG9yLUxvZ1RvQ29uc29sZS5qcyIsInNvdXJjZS9FbHVjaWRhdG9yLmpzIiwic291cmNlL0luc3RydWN0aW9uU2V0cy9HZW9tZXRyeS5qcyIsInNvdXJjZS9JbnN0cnVjdGlvblNldHMvTWF0aC1KYXZhc2NyaXB0LmpzIiwic291cmNlL0luc3RydWN0aW9uU2V0cy9PcGVyYXRpb25zL0dlb21ldHJ5LVJlY3RhbmdsZUFyZWEuanNvbiIsInNvdXJjZS9JbnN0cnVjdGlvblNldHMvT3BlcmF0aW9ucy9NYXRoLUFkZC5qc29uIiwic291cmNlL0luc3RydWN0aW9uU2V0cy9PcGVyYXRpb25zL01hdGgtRGl2aWRlLmpzb24iLCJzb3VyY2UvSW5zdHJ1Y3Rpb25TZXRzL09wZXJhdGlvbnMvTWF0aC1NdWx0aXBseS5qc29uIiwic291cmNlL0luc3RydWN0aW9uU2V0cy9PcGVyYXRpb25zL01hdGgtU3VidHJhY3QuanNvbiIsInNvdXJjZS9JbnN0cnVjdGlvblNldHMvT3BlcmF0aW9ucy9QcmVjaXNlTWF0aC1BZGQuanNvbiIsInNvdXJjZS9JbnN0cnVjdGlvblNldHMvT3BlcmF0aW9ucy9QcmVjaXNlTWF0aC1EaXZpZGUuanNvbiIsInNvdXJjZS9JbnN0cnVjdGlvblNldHMvT3BlcmF0aW9ucy9QcmVjaXNlTWF0aC1NdWx0aXBseS5qc29uIiwic291cmNlL0luc3RydWN0aW9uU2V0cy9PcGVyYXRpb25zL1ByZWNpc2VNYXRoLVN1YnRyYWN0Lmpzb24iLCJzb3VyY2UvSW5zdHJ1Y3Rpb25TZXRzL1ByZWNpc2VNYXRoLURlY2ltYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdDBKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4a0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiOyhmdW5jdGlvbiAoZ2xvYmFsU2NvcGUpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG5cclxuICAvKiFcclxuICAgKiAgZGVjaW1hbC5qcyB2MTAuNC4yXHJcbiAgICogIEFuIGFyYml0cmFyeS1wcmVjaXNpb24gRGVjaW1hbCB0eXBlIGZvciBKYXZhU2NyaXB0LlxyXG4gICAqICBodHRwczovL2dpdGh1Yi5jb20vTWlrZU1jbC9kZWNpbWFsLmpzXHJcbiAgICogIENvcHlyaWdodCAoYykgMjAyMiBNaWNoYWVsIE1jbGF1Z2hsaW4gPE04Y2g4OGxAZ21haWwuY29tPlxyXG4gICAqICBNSVQgTGljZW5jZVxyXG4gICAqL1xyXG5cclxuXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gIEVESVRBQkxFIERFRkFVTFRTICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcblxyXG4gICAgLy8gVGhlIG1heGltdW0gZXhwb25lbnQgbWFnbml0dWRlLlxyXG4gICAgLy8gVGhlIGxpbWl0IG9uIHRoZSB2YWx1ZSBvZiBgdG9FeHBOZWdgLCBgdG9FeHBQb3NgLCBgbWluRWAgYW5kIGBtYXhFYC5cclxuICB2YXIgRVhQX0xJTUlUID0gOWUxNSwgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA5ZTE1XHJcblxyXG4gICAgLy8gVGhlIGxpbWl0IG9uIHRoZSB2YWx1ZSBvZiBgcHJlY2lzaW9uYCwgYW5kIG9uIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgYXJndW1lbnQgdG9cclxuICAgIC8vIGB0b0RlY2ltYWxQbGFjZXNgLCBgdG9FeHBvbmVudGlhbGAsIGB0b0ZpeGVkYCwgYHRvUHJlY2lzaW9uYCBhbmQgYHRvU2lnbmlmaWNhbnREaWdpdHNgLlxyXG4gICAgTUFYX0RJR0lUUyA9IDFlOSwgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDFlOVxyXG5cclxuICAgIC8vIEJhc2UgY29udmVyc2lvbiBhbHBoYWJldC5cclxuICAgIE5VTUVSQUxTID0gJzAxMjM0NTY3ODlhYmNkZWYnLFxyXG5cclxuICAgIC8vIFRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiAxMCAoMTAyNSBkaWdpdHMpLlxyXG4gICAgTE4xMCA9ICcyLjMwMjU4NTA5Mjk5NDA0NTY4NDAxNzk5MTQ1NDY4NDM2NDIwNzYwMTEwMTQ4ODYyODc3Mjk3NjAzMzMyNzkwMDk2NzU3MjYwOTY3NzM1MjQ4MDIzNTk5NzIwNTA4OTU5ODI5ODM0MTk2Nzc4NDA0MjI4NjI0ODYzMzQwOTUyNTQ2NTA4MjgwNjc1NjY2NjI4NzM2OTA5ODc4MTY4OTQ4MjkwNzIwODMyNTU1NDY4MDg0Mzc5OTg5NDgyNjIzMzE5ODUyODM5MzUwNTMwODk2NTM3NzczMjYyODg0NjE2MzM2NjIyMjI4NzY5ODIxOTg4Njc0NjU0MzY2NzQ3NDQwNDI0MzI3NDM2NTE1NTA0ODkzNDMxNDkzOTM5MTQ3OTYxOTQwNDQwMDIyMjEwNTEwMTcxNDE3NDgwMDM2ODgwODQwMTI2NDcwODA2ODU1Njc3NDMyMTYyMjgzNTUyMjAxMTQ4MDQ2NjM3MTU2NTkxMjEzNzM0NTA3NDc4NTY5NDc2ODM0NjM2MTY3OTIxMDE4MDY0NDUwNzA2NDgwMDAyNzc1MDI2ODQ5MTY3NDY1NTA1ODY4NTY5MzU2NzM0MjA2NzA1ODExMzY0MjkyMjQ1NTQ0MDU3NTg5MjU3MjQyMDgyNDEzMTQ2OTU2ODkwMTY3NTg5NDAyNTY3NzYzMTEzNTY5MTkyOTIwMzMzNzY1ODcxNDE2NjAyMzAxMDU3MDMwODk2MzQ1NzIwNzU0NDAzNzA4NDc0Njk5NDAxNjgyNjkyODI4MDg0ODExODQyODkzMTQ4NDg1MjQ5NDg2NDQ4NzE5Mjc4MDk2NzYyNzEyNzU3NzUzOTcwMjc2Njg2MDU5NTI0OTY3MTY2NzQxODM0ODU3MDQ0MjI1MDcxOTc5NjUwMDQ3MTQ5NTEwNTA0OTIyMTQ3NzY1Njc2MzY5Mzg2NjI5NzY5Nzk1MjIxMTA3MTgyNjQ1NDk3MzQ3NzI2NjI0MjU3MDk0MjkzMjI1ODI3OTg1MDI1ODU1MDk3ODUyNjUzODMyMDc2MDY3MjYzMTcxNjQzMDk1MDU5OTUwODc4MDc1MjM3MTAzMzMxMDExOTc4NTc1NDczMzE1NDE0MjE4MDg0Mjc1NDM4NjM1OTE3NzgxMTcwNTQzMDk4Mjc0ODIzODUwNDU2NDgwMTkwOTU2MTAyOTkyOTE4MjQzMTgyMzc1MjUzNTc3MDk3NTA1Mzk1NjUxODc2OTc1MTAzNzQ5NzA4ODg2OTIxODAyMDUxODkzMzk1MDcyMzg1MzkyMDUxNDQ2MzQxOTcyNjUyODcyODY5NjUxMTA4NjI1NzE0OTIxOTg4NDk5Nzg3NDg4NzM3NzEzNDU2ODYyMDkxNjcwNTgnLFxyXG5cclxuICAgIC8vIFBpICgxMDI1IGRpZ2l0cykuXHJcbiAgICBQSSA9ICczLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0MzM4MzI3OTUwMjg4NDE5NzE2OTM5OTM3NTEwNTgyMDk3NDk0NDU5MjMwNzgxNjQwNjI4NjIwODk5ODYyODAzNDgyNTM0MjExNzA2Nzk4MjE0ODA4NjUxMzI4MjMwNjY0NzA5Mzg0NDYwOTU1MDU4MjIzMTcyNTM1OTQwODEyODQ4MTExNzQ1MDI4NDEwMjcwMTkzODUyMTEwNTU1OTY0NDYyMjk0ODk1NDkzMDM4MTk2NDQyODgxMDk3NTY2NTkzMzQ0NjEyODQ3NTY0ODIzMzc4Njc4MzE2NTI3MTIwMTkwOTE0NTY0ODU2NjkyMzQ2MDM0ODYxMDQ1NDMyNjY0ODIxMzM5MzYwNzI2MDI0OTE0MTI3MzcyNDU4NzAwNjYwNjMxNTU4ODE3NDg4MTUyMDkyMDk2MjgyOTI1NDA5MTcxNTM2NDM2Nzg5MjU5MDM2MDAxMTMzMDUzMDU0ODgyMDQ2NjUyMTM4NDE0Njk1MTk0MTUxMTYwOTQzMzA1NzI3MDM2NTc1OTU5MTk1MzA5MjE4NjExNzM4MTkzMjYxMTc5MzEwNTExODU0ODA3NDQ2MjM3OTk2Mjc0OTU2NzM1MTg4NTc1MjcyNDg5MTIyNzkzODE4MzAxMTk0OTEyOTgzMzY3MzM2MjQ0MDY1NjY0MzA4NjAyMTM5NDk0NjM5NTIyNDczNzE5MDcwMjE3OTg2MDk0MzcwMjc3MDUzOTIxNzE3NjI5MzE3Njc1MjM4NDY3NDgxODQ2NzY2OTQwNTEzMjAwMDU2ODEyNzE0NTI2MzU2MDgyNzc4NTc3MTM0Mjc1Nzc4OTYwOTE3MzYzNzE3ODcyMTQ2ODQ0MDkwMTIyNDk1MzQzMDE0NjU0OTU4NTM3MTA1MDc5MjI3OTY4OTI1ODkyMzU0MjAxOTk1NjExMjEyOTAyMTk2MDg2NDAzNDQxODE1OTgxMzYyOTc3NDc3MTMwOTk2MDUxODcwNzIxMTM0OTk5OTk5ODM3Mjk3ODA0OTk1MTA1OTczMTczMjgxNjA5NjMxODU5NTAyNDQ1OTQ1NTM0NjkwODMwMjY0MjUyMjMwODI1MzM0NDY4NTAzNTI2MTkzMTE4ODE3MTAxMDAwMzEzNzgzODc1Mjg4NjU4NzUzMzIwODM4MTQyMDYxNzE3NzY2OTE0NzMwMzU5ODI1MzQ5MDQyODc1NTQ2ODczMTE1OTU2Mjg2Mzg4MjM1Mzc4NzU5Mzc1MTk1Nzc4MTg1Nzc4MDUzMjE3MTIyNjgwNjYxMzAwMTkyNzg3NjYxMTE5NTkwOTIxNjQyMDE5ODkzODA5NTI1NzIwMTA2NTQ4NTg2MzI3ODknLFxyXG5cclxuXHJcbiAgICAvLyBUaGUgaW5pdGlhbCBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgb2YgdGhlIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbiAgICBERUZBVUxUUyA9IHtcclxuXHJcbiAgICAgIC8vIFRoZXNlIHZhbHVlcyBtdXN0IGJlIGludGVnZXJzIHdpdGhpbiB0aGUgc3RhdGVkIHJhbmdlcyAoaW5jbHVzaXZlKS5cclxuICAgICAgLy8gTW9zdCBvZiB0aGVzZSB2YWx1ZXMgY2FuIGJlIGNoYW5nZWQgYXQgcnVuLXRpbWUgdXNpbmcgdGhlIGBEZWNpbWFsLmNvbmZpZ2AgbWV0aG9kLlxyXG5cclxuICAgICAgLy8gVGhlIG1heGltdW0gbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyBvZiB0aGUgcmVzdWx0IG9mIGEgY2FsY3VsYXRpb24gb3IgYmFzZSBjb252ZXJzaW9uLlxyXG4gICAgICAvLyBFLmcuIGBEZWNpbWFsLmNvbmZpZyh7IHByZWNpc2lvbjogMjAgfSk7YFxyXG4gICAgICBwcmVjaXNpb246IDIwLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAxIHRvIE1BWF9ESUdJVFNcclxuXHJcbiAgICAgIC8vIFRoZSByb3VuZGluZyBtb2RlIHVzZWQgd2hlbiByb3VuZGluZyB0byBgcHJlY2lzaW9uYC5cclxuICAgICAgLy9cclxuICAgICAgLy8gUk9VTkRfVVAgICAgICAgICAwIEF3YXkgZnJvbSB6ZXJvLlxyXG4gICAgICAvLyBST1VORF9ET1dOICAgICAgIDEgVG93YXJkcyB6ZXJvLlxyXG4gICAgICAvLyBST1VORF9DRUlMICAgICAgIDIgVG93YXJkcyArSW5maW5pdHkuXHJcbiAgICAgIC8vIFJPVU5EX0ZMT09SICAgICAgMyBUb3dhcmRzIC1JbmZpbml0eS5cclxuICAgICAgLy8gUk9VTkRfSEFMRl9VUCAgICA0IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB1cC5cclxuICAgICAgLy8gUk9VTkRfSEFMRl9ET1dOICA1IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCBkb3duLlxyXG4gICAgICAvLyBST1VORF9IQUxGX0VWRU4gIDYgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgZXZlbiBuZWlnaGJvdXIuXHJcbiAgICAgIC8vIFJPVU5EX0hBTEZfQ0VJTCAgNyBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdG93YXJkcyArSW5maW5pdHkuXHJcbiAgICAgIC8vIFJPVU5EX0hBTEZfRkxPT1IgOCBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdG93YXJkcyAtSW5maW5pdHkuXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIEUuZy5cclxuICAgICAgLy8gYERlY2ltYWwucm91bmRpbmcgPSA0O2BcclxuICAgICAgLy8gYERlY2ltYWwucm91bmRpbmcgPSBEZWNpbWFsLlJPVU5EX0hBTEZfVVA7YFxyXG4gICAgICByb3VuZGluZzogNCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDhcclxuXHJcbiAgICAgIC8vIFRoZSBtb2R1bG8gbW9kZSB1c2VkIHdoZW4gY2FsY3VsYXRpbmcgdGhlIG1vZHVsdXM6IGEgbW9kIG4uXHJcbiAgICAgIC8vIFRoZSBxdW90aWVudCAocSA9IGEgLyBuKSBpcyBjYWxjdWxhdGVkIGFjY29yZGluZyB0byB0aGUgY29ycmVzcG9uZGluZyByb3VuZGluZyBtb2RlLlxyXG4gICAgICAvLyBUaGUgcmVtYWluZGVyIChyKSBpcyBjYWxjdWxhdGVkIGFzOiByID0gYSAtIG4gKiBxLlxyXG4gICAgICAvL1xyXG4gICAgICAvLyBVUCAgICAgICAgIDAgVGhlIHJlbWFpbmRlciBpcyBwb3NpdGl2ZSBpZiB0aGUgZGl2aWRlbmQgaXMgbmVnYXRpdmUsIGVsc2UgaXMgbmVnYXRpdmUuXHJcbiAgICAgIC8vIERPV04gICAgICAgMSBUaGUgcmVtYWluZGVyIGhhcyB0aGUgc2FtZSBzaWduIGFzIHRoZSBkaXZpZGVuZCAoSmF2YVNjcmlwdCAlKS5cclxuICAgICAgLy8gRkxPT1IgICAgICAzIFRoZSByZW1haW5kZXIgaGFzIHRoZSBzYW1lIHNpZ24gYXMgdGhlIGRpdmlzb3IgKFB5dGhvbiAlKS5cclxuICAgICAgLy8gSEFMRl9FVkVOICA2IFRoZSBJRUVFIDc1NCByZW1haW5kZXIgZnVuY3Rpb24uXHJcbiAgICAgIC8vIEVVQ0xJRCAgICAgOSBFdWNsaWRpYW4gZGl2aXNpb24uIHEgPSBzaWduKG4pICogZmxvb3IoYSAvIGFicyhuKSkuIEFsd2F5cyBwb3NpdGl2ZS5cclxuICAgICAgLy9cclxuICAgICAgLy8gVHJ1bmNhdGVkIGRpdmlzaW9uICgxKSwgZmxvb3JlZCBkaXZpc2lvbiAoMyksIHRoZSBJRUVFIDc1NCByZW1haW5kZXIgKDYpLCBhbmQgRXVjbGlkaWFuXHJcbiAgICAgIC8vIGRpdmlzaW9uICg5KSBhcmUgY29tbW9ubHkgdXNlZCBmb3IgdGhlIG1vZHVsdXMgb3BlcmF0aW9uLiBUaGUgb3RoZXIgcm91bmRpbmcgbW9kZXMgY2FuIGFsc29cclxuICAgICAgLy8gYmUgdXNlZCwgYnV0IHRoZXkgbWF5IG5vdCBnaXZlIHVzZWZ1bCByZXN1bHRzLlxyXG4gICAgICBtb2R1bG86IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDlcclxuXHJcbiAgICAgIC8vIFRoZSBleHBvbmVudCB2YWx1ZSBhdCBhbmQgYmVuZWF0aCB3aGljaCBgdG9TdHJpbmdgIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAgIC8vIEphdmFTY3JpcHQgbnVtYmVyczogLTdcclxuICAgICAgdG9FeHBOZWc6IC03LCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byAtRVhQX0xJTUlUXHJcblxyXG4gICAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGFib3ZlIHdoaWNoIGB0b1N0cmluZ2AgcmV0dXJucyBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAyMVxyXG4gICAgICB0b0V4cFBvczogIDIxLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIEVYUF9MSU1JVFxyXG5cclxuICAgICAgLy8gVGhlIG1pbmltdW0gZXhwb25lbnQgdmFsdWUsIGJlbmVhdGggd2hpY2ggdW5kZXJmbG93IHRvIHplcm8gb2NjdXJzLlxyXG4gICAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IC0zMjQgICg1ZS0zMjQpXHJcbiAgICAgIG1pbkU6IC1FWFBfTElNSVQsICAgICAgICAgICAgICAgICAgICAgIC8vIC0xIHRvIC1FWFBfTElNSVRcclxuXHJcbiAgICAgIC8vIFRoZSBtYXhpbXVtIGV4cG9uZW50IHZhbHVlLCBhYm92ZSB3aGljaCBvdmVyZmxvdyB0byBJbmZpbml0eSBvY2N1cnMuXHJcbiAgICAgIC8vIEphdmFTY3JpcHQgbnVtYmVyczogMzA4ICAoMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDgpXHJcbiAgICAgIG1heEU6IEVYUF9MSU1JVCwgICAgICAgICAgICAgICAgICAgICAgIC8vIDEgdG8gRVhQX0xJTUlUXHJcblxyXG4gICAgICAvLyBXaGV0aGVyIHRvIHVzZSBjcnlwdG9ncmFwaGljYWxseS1zZWN1cmUgcmFuZG9tIG51bWJlciBnZW5lcmF0aW9uLCBpZiBhdmFpbGFibGUuXHJcbiAgICAgIGNyeXB0bzogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRydWUvZmFsc2VcclxuICAgIH0sXHJcblxyXG5cclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBFTkQgT0YgRURJVEFCTEUgREVGQVVMVFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xyXG5cclxuXHJcbiAgICBEZWNpbWFsLCBpbmV4YWN0LCBub0NvbmZsaWN0LCBxdWFkcmFudCxcclxuICAgIGV4dGVybmFsID0gdHJ1ZSxcclxuXHJcbiAgICBkZWNpbWFsRXJyb3IgPSAnW0RlY2ltYWxFcnJvcl0gJyxcclxuICAgIGludmFsaWRBcmd1bWVudCA9IGRlY2ltYWxFcnJvciArICdJbnZhbGlkIGFyZ3VtZW50OiAnLFxyXG4gICAgcHJlY2lzaW9uTGltaXRFeGNlZWRlZCA9IGRlY2ltYWxFcnJvciArICdQcmVjaXNpb24gbGltaXQgZXhjZWVkZWQnLFxyXG4gICAgY3J5cHRvVW5hdmFpbGFibGUgPSBkZWNpbWFsRXJyb3IgKyAnY3J5cHRvIHVuYXZhaWxhYmxlJyxcclxuICAgIHRhZyA9ICdbb2JqZWN0IERlY2ltYWxdJyxcclxuXHJcbiAgICBtYXRoZmxvb3IgPSBNYXRoLmZsb29yLFxyXG4gICAgbWF0aHBvdyA9IE1hdGgucG93LFxyXG5cclxuICAgIGlzQmluYXJ5ID0gL14wYihbMDFdKyhcXC5bMDFdKik/fFxcLlswMV0rKShwWystXT9cXGQrKT8kL2ksXHJcbiAgICBpc0hleCA9IC9eMHgoWzAtOWEtZl0rKFxcLlswLTlhLWZdKik/fFxcLlswLTlhLWZdKykocFsrLV0/XFxkKyk/JC9pLFxyXG4gICAgaXNPY3RhbCA9IC9eMG8oWzAtN10rKFxcLlswLTddKik/fFxcLlswLTddKykocFsrLV0/XFxkKyk/JC9pLFxyXG4gICAgaXNEZWNpbWFsID0gL14oXFxkKyhcXC5cXGQqKT98XFwuXFxkKykoZVsrLV0/XFxkKyk/JC9pLFxyXG5cclxuICAgIEJBU0UgPSAxZTcsXHJcbiAgICBMT0dfQkFTRSA9IDcsXHJcbiAgICBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MSxcclxuXHJcbiAgICBMTjEwX1BSRUNJU0lPTiA9IExOMTAubGVuZ3RoIC0gMSxcclxuICAgIFBJX1BSRUNJU0lPTiA9IFBJLmxlbmd0aCAtIDEsXHJcblxyXG4gICAgLy8gRGVjaW1hbC5wcm90b3R5cGUgb2JqZWN0XHJcbiAgICBQID0geyB0b1N0cmluZ1RhZzogdGFnIH07XHJcblxyXG5cclxuICAvLyBEZWNpbWFsIHByb3RvdHlwZSBtZXRob2RzXHJcblxyXG5cclxuICAvKlxyXG4gICAqICBhYnNvbHV0ZVZhbHVlICAgICAgICAgICAgIGFic1xyXG4gICAqICBjZWlsXHJcbiAgICogIGNsYW1wZWRUbyAgICAgICAgICAgICAgICAgY2xhbXBcclxuICAgKiAgY29tcGFyZWRUbyAgICAgICAgICAgICAgICBjbXBcclxuICAgKiAgY29zaW5lICAgICAgICAgICAgICAgICAgICBjb3NcclxuICAgKiAgY3ViZVJvb3QgICAgICAgICAgICAgICAgICBjYnJ0XHJcbiAgICogIGRlY2ltYWxQbGFjZXMgICAgICAgICAgICAgZHBcclxuICAgKiAgZGl2aWRlZEJ5ICAgICAgICAgICAgICAgICBkaXZcclxuICAgKiAgZGl2aWRlZFRvSW50ZWdlckJ5ICAgICAgICBkaXZUb0ludFxyXG4gICAqICBlcXVhbHMgICAgICAgICAgICAgICAgICAgIGVxXHJcbiAgICogIGZsb29yXHJcbiAgICogIGdyZWF0ZXJUaGFuICAgICAgICAgICAgICAgZ3RcclxuICAgKiAgZ3JlYXRlclRoYW5PckVxdWFsVG8gICAgICBndGVcclxuICAgKiAgaHlwZXJib2xpY0Nvc2luZSAgICAgICAgICBjb3NoXHJcbiAgICogIGh5cGVyYm9saWNTaW5lICAgICAgICAgICAgc2luaFxyXG4gICAqICBoeXBlcmJvbGljVGFuZ2VudCAgICAgICAgIHRhbmhcclxuICAgKiAgaW52ZXJzZUNvc2luZSAgICAgICAgICAgICBhY29zXHJcbiAgICogIGludmVyc2VIeXBlcmJvbGljQ29zaW5lICAgYWNvc2hcclxuICAgKiAgaW52ZXJzZUh5cGVyYm9saWNTaW5lICAgICBhc2luaFxyXG4gICAqICBpbnZlcnNlSHlwZXJib2xpY1RhbmdlbnQgIGF0YW5oXHJcbiAgICogIGludmVyc2VTaW5lICAgICAgICAgICAgICAgYXNpblxyXG4gICAqICBpbnZlcnNlVGFuZ2VudCAgICAgICAgICAgIGF0YW5cclxuICAgKiAgaXNGaW5pdGVcclxuICAgKiAgaXNJbnRlZ2VyICAgICAgICAgICAgICAgICBpc0ludFxyXG4gICAqICBpc05hTlxyXG4gICAqICBpc05lZ2F0aXZlICAgICAgICAgICAgICAgIGlzTmVnXHJcbiAgICogIGlzUG9zaXRpdmUgICAgICAgICAgICAgICAgaXNQb3NcclxuICAgKiAgaXNaZXJvXHJcbiAgICogIGxlc3NUaGFuICAgICAgICAgICAgICAgICAgbHRcclxuICAgKiAgbGVzc1RoYW5PckVxdWFsVG8gICAgICAgICBsdGVcclxuICAgKiAgbG9nYXJpdGhtICAgICAgICAgICAgICAgICBsb2dcclxuICAgKiAgW21heGltdW1dICAgICAgICAgICAgICAgICBbbWF4XVxyXG4gICAqICBbbWluaW11bV0gICAgICAgICAgICAgICAgIFttaW5dXHJcbiAgICogIG1pbnVzICAgICAgICAgICAgICAgICAgICAgc3ViXHJcbiAgICogIG1vZHVsbyAgICAgICAgICAgICAgICAgICAgbW9kXHJcbiAgICogIG5hdHVyYWxFeHBvbmVudGlhbCAgICAgICAgZXhwXHJcbiAgICogIG5hdHVyYWxMb2dhcml0aG0gICAgICAgICAgbG5cclxuICAgKiAgbmVnYXRlZCAgICAgICAgICAgICAgICAgICBuZWdcclxuICAgKiAgcGx1cyAgICAgICAgICAgICAgICAgICAgICBhZGRcclxuICAgKiAgcHJlY2lzaW9uICAgICAgICAgICAgICAgICBzZFxyXG4gICAqICByb3VuZFxyXG4gICAqICBzaW5lICAgICAgICAgICAgICAgICAgICAgIHNpblxyXG4gICAqICBzcXVhcmVSb290ICAgICAgICAgICAgICAgIHNxcnRcclxuICAgKiAgdGFuZ2VudCAgICAgICAgICAgICAgICAgICB0YW5cclxuICAgKiAgdGltZXMgICAgICAgICAgICAgICAgICAgICBtdWxcclxuICAgKiAgdG9CaW5hcnlcclxuICAgKiAgdG9EZWNpbWFsUGxhY2VzICAgICAgICAgICB0b0RQXHJcbiAgICogIHRvRXhwb25lbnRpYWxcclxuICAgKiAgdG9GaXhlZFxyXG4gICAqICB0b0ZyYWN0aW9uXHJcbiAgICogIHRvSGV4YWRlY2ltYWwgICAgICAgICAgICAgdG9IZXhcclxuICAgKiAgdG9OZWFyZXN0XHJcbiAgICogIHRvTnVtYmVyXHJcbiAgICogIHRvT2N0YWxcclxuICAgKiAgdG9Qb3dlciAgICAgICAgICAgICAgICAgICBwb3dcclxuICAgKiAgdG9QcmVjaXNpb25cclxuICAgKiAgdG9TaWduaWZpY2FudERpZ2l0cyAgICAgICB0b1NEXHJcbiAgICogIHRvU3RyaW5nXHJcbiAgICogIHRydW5jYXRlZCAgICAgICAgICAgICAgICAgdHJ1bmNcclxuICAgKiAgdmFsdWVPZiAgICAgICAgICAgICAgICAgICB0b0pTT05cclxuICAgKi9cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFic29sdXRlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuYWJzb2x1dGVWYWx1ZSA9IFAuYWJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICAgIGlmICh4LnMgPCAwKSB4LnMgPSAxO1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHgpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIHdob2xlIG51bWJlciBpbiB0aGVcclxuICAgKiBkaXJlY3Rpb24gb2YgcG9zaXRpdmUgSW5maW5pdHkuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmNlaWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIHRoaXMuZSArIDEsIDIpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgY2xhbXBlZCB0byB0aGUgcmFuZ2VcclxuICAgKiBkZWxpbmVhdGVkIGJ5IGBtaW5gIGFuZCBgbWF4YC5cclxuICAgKlxyXG4gICAqIG1pbiB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqIG1heCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5jbGFtcGVkVG8gPSBQLmNsYW1wID0gZnVuY3Rpb24gKG1pbiwgbWF4KSB7XHJcbiAgICB2YXIgayxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG4gICAgbWluID0gbmV3IEN0b3IobWluKTtcclxuICAgIG1heCA9IG5ldyBDdG9yKG1heCk7XHJcbiAgICBpZiAoIW1pbi5zIHx8ICFtYXgucykgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgICBpZiAobWluLmd0KG1heCkpIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIG1heCk7XHJcbiAgICBrID0geC5jbXAobWluKTtcclxuICAgIHJldHVybiBrIDwgMCA/IG1pbiA6IHguY21wKG1heCkgPiAwID8gbWF4IDogbmV3IEN0b3IoeCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuXHJcbiAgICogICAxICAgIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsXHJcbiAgICogIC0xICAgIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIHRoZSB2YWx1ZSBvZiBgeWAsXHJcbiAgICogICAwICAgIGlmIHRoZXkgaGF2ZSB0aGUgc2FtZSB2YWx1ZSxcclxuICAgKiAgIE5hTiAgaWYgdGhlIHZhbHVlIG9mIGVpdGhlciBEZWNpbWFsIGlzIE5hTi5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuY29tcGFyZWRUbyA9IFAuY21wID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHZhciBpLCBqLCB4ZEwsIHlkTCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIHhkID0geC5kLFxyXG4gICAgICB5ZCA9ICh5ID0gbmV3IHguY29uc3RydWN0b3IoeSkpLmQsXHJcbiAgICAgIHhzID0geC5zLFxyXG4gICAgICB5cyA9IHkucztcclxuXHJcbiAgICAvLyBFaXRoZXIgTmFOIG9yIMKxSW5maW5pdHk/XHJcbiAgICBpZiAoIXhkIHx8ICF5ZCkge1xyXG4gICAgICByZXR1cm4gIXhzIHx8ICF5cyA/IE5hTiA6IHhzICE9PSB5cyA/IHhzIDogeGQgPT09IHlkID8gMCA6ICF4ZCBeIHhzIDwgMCA/IDEgOiAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBFaXRoZXIgemVybz9cclxuICAgIGlmICgheGRbMF0gfHwgIXlkWzBdKSByZXR1cm4geGRbMF0gPyB4cyA6IHlkWzBdID8gLXlzIDogMDtcclxuXHJcbiAgICAvLyBTaWducyBkaWZmZXI/XHJcbiAgICBpZiAoeHMgIT09IHlzKSByZXR1cm4geHM7XHJcblxyXG4gICAgLy8gQ29tcGFyZSBleHBvbmVudHMuXHJcbiAgICBpZiAoeC5lICE9PSB5LmUpIHJldHVybiB4LmUgPiB5LmUgXiB4cyA8IDAgPyAxIDogLTE7XHJcblxyXG4gICAgeGRMID0geGQubGVuZ3RoO1xyXG4gICAgeWRMID0geWQubGVuZ3RoO1xyXG5cclxuICAgIC8vIENvbXBhcmUgZGlnaXQgYnkgZGlnaXQuXHJcbiAgICBmb3IgKGkgPSAwLCBqID0geGRMIDwgeWRMID8geGRMIDogeWRMOyBpIDwgajsgKytpKSB7XHJcbiAgICAgIGlmICh4ZFtpXSAhPT0geWRbaV0pIHJldHVybiB4ZFtpXSA+IHlkW2ldIF4geHMgPCAwID8gMSA6IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbXBhcmUgbGVuZ3Rocy5cclxuICAgIHJldHVybiB4ZEwgPT09IHlkTCA/IDAgOiB4ZEwgPiB5ZEwgXiB4cyA8IDAgPyAxIDogLTE7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGNvc2luZSBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbLTEsIDFdXHJcbiAgICpcclxuICAgKiBjb3MoMCkgICAgICAgICA9IDFcclxuICAgKiBjb3MoLTApICAgICAgICA9IDFcclxuICAgKiBjb3MoSW5maW5pdHkpICA9IE5hTlxyXG4gICAqIGNvcygtSW5maW5pdHkpID0gTmFOXHJcbiAgICogY29zKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuY29zaW5lID0gUC5jb3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHIsIHJtLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKCF4LmQpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgIC8vIGNvcygwKSA9IGNvcygtMCkgPSAxXHJcbiAgICBpZiAoIXguZFswXSkgcmV0dXJuIG5ldyBDdG9yKDEpO1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgTE9HX0JBU0U7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICB4ID0gY29zaW5lKEN0b3IsIHRvTGVzc1RoYW5IYWxmUGkoQ3RvciwgeCkpO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gMyA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGN1YmUgcm9vdCBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLCByb3VuZGVkIHRvXHJcbiAgICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqICBjYnJ0KDApICA9ICAwXHJcbiAgICogIGNicnQoLTApID0gLTBcclxuICAgKiAgY2JydCgxKSAgPSAgMVxyXG4gICAqICBjYnJ0KC0xKSA9IC0xXHJcbiAgICogIGNicnQoTikgID0gIE5cclxuICAgKiAgY2JydCgtSSkgPSAtSVxyXG4gICAqICBjYnJ0KEkpICA9ICBJXHJcbiAgICpcclxuICAgKiBNYXRoLmNicnQoeCkgPSAoeCA8IDAgPyAtTWF0aC5wb3coLXgsIDEvMykgOiBNYXRoLnBvdyh4LCAxLzMpKVxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5jdWJlUm9vdCA9IFAuY2JydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBlLCBtLCBuLCByLCByZXAsIHMsIHNkLCB0LCB0MywgdDNwbHVzeCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICAgIHMgPSB4LnMgKiBtYXRocG93KHgucyAqIHgsIDEgLyAzKTtcclxuXHJcbiAgICAgLy8gTWF0aC5jYnJ0IHVuZGVyZmxvdy9vdmVyZmxvdz9cclxuICAgICAvLyBQYXNzIHggdG8gTWF0aC5wb3cgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIGV4cG9uZW50IG9mIHRoZSByZXN1bHQuXHJcbiAgICBpZiAoIXMgfHwgTWF0aC5hYnMocykgPT0gMSAvIDApIHtcclxuICAgICAgbiA9IGRpZ2l0c1RvU3RyaW5nKHguZCk7XHJcbiAgICAgIGUgPSB4LmU7XHJcblxyXG4gICAgICAvLyBBZGp1c3QgbiBleHBvbmVudCBzbyBpdCBpcyBhIG11bHRpcGxlIG9mIDMgYXdheSBmcm9tIHggZXhwb25lbnQuXHJcbiAgICAgIGlmIChzID0gKGUgLSBuLmxlbmd0aCArIDEpICUgMykgbiArPSAocyA9PSAxIHx8IHMgPT0gLTIgPyAnMCcgOiAnMDAnKTtcclxuICAgICAgcyA9IG1hdGhwb3cobiwgMSAvIDMpO1xyXG5cclxuICAgICAgLy8gUmFyZWx5LCBlIG1heSBiZSBvbmUgbGVzcyB0aGFuIHRoZSByZXN1bHQgZXhwb25lbnQgdmFsdWUuXHJcbiAgICAgIGUgPSBtYXRoZmxvb3IoKGUgKyAxKSAvIDMpIC0gKGUgJSAzID09IChlIDwgMCA/IC0xIDogMikpO1xyXG5cclxuICAgICAgaWYgKHMgPT0gMSAvIDApIHtcclxuICAgICAgICBuID0gJzVlJyArIGU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbiA9IHMudG9FeHBvbmVudGlhbCgpO1xyXG4gICAgICAgIG4gPSBuLnNsaWNlKDAsIG4uaW5kZXhPZignZScpICsgMSkgKyBlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByID0gbmV3IEN0b3Iobik7XHJcbiAgICAgIHIucyA9IHgucztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHIgPSBuZXcgQ3RvcihzLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNkID0gKGUgPSBDdG9yLnByZWNpc2lvbikgKyAzO1xyXG5cclxuICAgIC8vIEhhbGxleSdzIG1ldGhvZC5cclxuICAgIC8vIFRPRE8/IENvbXBhcmUgTmV3dG9uJ3MgbWV0aG9kLlxyXG4gICAgZm9yICg7Oykge1xyXG4gICAgICB0ID0gcjtcclxuICAgICAgdDMgPSB0LnRpbWVzKHQpLnRpbWVzKHQpO1xyXG4gICAgICB0M3BsdXN4ID0gdDMucGx1cyh4KTtcclxuICAgICAgciA9IGRpdmlkZSh0M3BsdXN4LnBsdXMoeCkudGltZXModCksIHQzcGx1c3gucGx1cyh0MyksIHNkICsgMiwgMSk7XHJcblxyXG4gICAgICAvLyBUT0RPPyBSZXBsYWNlIHdpdGggZm9yLWxvb3AgYW5kIGNoZWNrUm91bmRpbmdEaWdpdHMuXHJcbiAgICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHNkKSA9PT0gKG4gPSBkaWdpdHNUb1N0cmluZyhyLmQpKS5zbGljZSgwLCBzZCkpIHtcclxuICAgICAgICBuID0gbi5zbGljZShzZCAtIDMsIHNkICsgMSk7XHJcblxyXG4gICAgICAgIC8vIFRoZSA0dGggcm91bmRpbmcgZGlnaXQgbWF5IGJlIGluIGVycm9yIGJ5IC0xIHNvIGlmIHRoZSA0IHJvdW5kaW5nIGRpZ2l0cyBhcmUgOTk5OSBvciA0OTk5XHJcbiAgICAgICAgLy8gLCBpLmUuIGFwcHJvYWNoaW5nIGEgcm91bmRpbmcgYm91bmRhcnksIGNvbnRpbnVlIHRoZSBpdGVyYXRpb24uXHJcbiAgICAgICAgaWYgKG4gPT0gJzk5OTknIHx8ICFyZXAgJiYgbiA9PSAnNDk5OScpIHtcclxuXHJcbiAgICAgICAgICAvLyBPbiB0aGUgZmlyc3QgaXRlcmF0aW9uIG9ubHksIGNoZWNrIHRvIHNlZSBpZiByb3VuZGluZyB1cCBnaXZlcyB0aGUgZXhhY3QgcmVzdWx0IGFzIHRoZVxyXG4gICAgICAgICAgLy8gbmluZXMgbWF5IGluZmluaXRlbHkgcmVwZWF0LlxyXG4gICAgICAgICAgaWYgKCFyZXApIHtcclxuICAgICAgICAgICAgZmluYWxpc2UodCwgZSArIDEsIDApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHQudGltZXModCkudGltZXModCkuZXEoeCkpIHtcclxuICAgICAgICAgICAgICByID0gdDtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNkICs9IDQ7XHJcbiAgICAgICAgICByZXAgPSAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgLy8gSWYgdGhlIHJvdW5kaW5nIGRpZ2l0cyBhcmUgbnVsbCwgMHswLDR9IG9yIDUwezAsM30sIGNoZWNrIGZvciBhbiBleGFjdCByZXN1bHQuXHJcbiAgICAgICAgICAvLyBJZiBub3QsIHRoZW4gdGhlcmUgYXJlIGZ1cnRoZXIgZGlnaXRzIGFuZCBtIHdpbGwgYmUgdHJ1dGh5LlxyXG4gICAgICAgICAgaWYgKCErbiB8fCAhK24uc2xpY2UoMSkgJiYgbi5jaGFyQXQoMCkgPT0gJzUnKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUcnVuY2F0ZSB0byB0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgICAgIGZpbmFsaXNlKHIsIGUgKyAxLCAxKTtcclxuICAgICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLnRpbWVzKHIpLmVxKHgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UociwgZSwgQ3Rvci5yb3VuZGluZywgbSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuZGVjaW1hbFBsYWNlcyA9IFAuZHAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgdyxcclxuICAgICAgZCA9IHRoaXMuZCxcclxuICAgICAgbiA9IE5hTjtcclxuXHJcbiAgICBpZiAoZCkge1xyXG4gICAgICB3ID0gZC5sZW5ndGggLSAxO1xyXG4gICAgICBuID0gKHcgLSBtYXRoZmxvb3IodGhpcy5lIC8gTE9HX0JBU0UpKSAqIExPR19CQVNFO1xyXG5cclxuICAgICAgLy8gU3VidHJhY3QgdGhlIG51bWJlciBvZiB0cmFpbGluZyB6ZXJvcyBvZiB0aGUgbGFzdCB3b3JkLlxyXG4gICAgICB3ID0gZFt3XTtcclxuICAgICAgaWYgKHcpIGZvciAoOyB3ICUgMTAgPT0gMDsgdyAvPSAxMCkgbi0tO1xyXG4gICAgICBpZiAobiA8IDApIG4gPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqICBuIC8gMCA9IElcclxuICAgKiAgbiAvIE4gPSBOXHJcbiAgICogIG4gLyBJID0gMFxyXG4gICAqICAwIC8gbiA9IDBcclxuICAgKiAgMCAvIDAgPSBOXHJcbiAgICogIDAgLyBOID0gTlxyXG4gICAqICAwIC8gSSA9IDBcclxuICAgKiAgTiAvIG4gPSBOXHJcbiAgICogIE4gLyAwID0gTlxyXG4gICAqICBOIC8gTiA9IE5cclxuICAgKiAgTiAvIEkgPSBOXHJcbiAgICogIEkgLyBuID0gSVxyXG4gICAqICBJIC8gMCA9IElcclxuICAgKiAgSSAvIE4gPSBOXHJcbiAgICogIEkgLyBJID0gTlxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBkaXZpZGVkIGJ5IGB5YCwgcm91bmRlZCB0b1xyXG4gICAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmRpdmlkZWRCeSA9IFAuZGl2ID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHJldHVybiBkaXZpZGUodGhpcywgbmV3IHRoaXMuY29uc3RydWN0b3IoeSkpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnRlZ2VyIHBhcnQgb2YgZGl2aWRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbFxyXG4gICAqIGJ5IHRoZSB2YWx1ZSBvZiBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuZGl2aWRlZFRvSW50ZWdlckJ5ID0gUC5kaXZUb0ludCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICB2YXIgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKGRpdmlkZSh4LCBuZXcgQ3Rvcih5KSwgMCwgMSwgMSksIEN0b3IucHJlY2lzaW9uLCBDdG9yLnJvdW5kaW5nKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBgeWAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmVxdWFscyA9IFAuZXEgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY21wKHkpID09PSAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIHdob2xlIG51bWJlciBpbiB0aGVcclxuICAgKiBkaXJlY3Rpb24gb2YgbmVnYXRpdmUgSW5maW5pdHkuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmZsb29yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAzKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdmFsdWUgb2YgYHlgLCBvdGhlcndpc2UgcmV0dXJuXHJcbiAgICogZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmdyZWF0ZXJUaGFuID0gUC5ndCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbXAoeSkgPiAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBgeWAsXHJcbiAgICogb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuZ3JlYXRlclRoYW5PckVxdWFsVG8gPSBQLmd0ZSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICB2YXIgayA9IHRoaXMuY21wKHkpO1xyXG4gICAgcmV0dXJuIGsgPT0gMSB8fCBrID09PSAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIGNvc2luZSBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzXHJcbiAgICogRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFsxLCBJbmZpbml0eV1cclxuICAgKlxyXG4gICAqIGNvc2goeCkgPSAxICsgeF4yLzIhICsgeF40LzQhICsgeF42LzYhICsgLi4uXHJcbiAgICpcclxuICAgKiBjb3NoKDApICAgICAgICAgPSAxXHJcbiAgICogY29zaCgtMCkgICAgICAgID0gMVxyXG4gICAqIGNvc2goSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAgICogY29zaCgtSW5maW5pdHkpID0gSW5maW5pdHlcclxuICAgKiBjb3NoKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqICB4ICAgICAgICB0aW1lIHRha2VuIChtcykgICByZXN1bHRcclxuICAgKiAxMDAwICAgICAgOSAgICAgICAgICAgICAgICAgOS44NTAzNTU1NzAwODUyMzQ5Njk0ZSs0MzNcclxuICAgKiAxMDAwMCAgICAgMjUgICAgICAgICAgICAgICAgNC40MDM0MDkxMTI4MzE0NjA3OTM2ZSs0MzQyXHJcbiAgICogMTAwMDAwICAgIDE3MSAgICAgICAgICAgICAgIDEuNDAzMzMxNjgwMjEzMDYxNTg5N2UrNDM0MjlcclxuICAgKiAxMDAwMDAwICAgMzgxNyAgICAgICAgICAgICAgMS41MTY2MDc2OTg0MDEwNDM3NzI1ZSs0MzQyOTRcclxuICAgKiAxMDAwMDAwMCAgYWJhbmRvbmVkIGFmdGVyIDIgbWludXRlIHdhaXRcclxuICAgKlxyXG4gICAqIFRPRE8/IENvbXBhcmUgcGVyZm9ybWFuY2Ugb2YgY29zaCh4KSA9IDAuNSAqIChleHAoeCkgKyBleHAoLXgpKVxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5oeXBlcmJvbGljQ29zaW5lID0gUC5jb3NoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGssIG4sIHByLCBybSwgbGVuLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIG9uZSA9IG5ldyBDdG9yKDEpO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeC5zID8gMSAvIDAgOiBOYU4pO1xyXG4gICAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBvbmU7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyA0O1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcbiAgICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvbjogY29zKDR4KSA9IDEgLSA4Y29zXjIoeCkgKyA4Y29zXjQoeCkgKyAxXHJcbiAgICAvLyBpLmUuIGNvcyh4KSA9IDEgLSBjb3NeMih4LzQpKDggLSA4Y29zXjIoeC80KSlcclxuXHJcbiAgICAvLyBFc3RpbWF0ZSB0aGUgb3B0aW11bSBudW1iZXIgb2YgdGltZXMgdG8gdXNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgICAvLyBUT0RPPyBFc3RpbWF0aW9uIHJldXNlZCBmcm9tIGNvc2luZSgpIGFuZCBtYXkgbm90IGJlIG9wdGltYWwgaGVyZS5cclxuICAgIGlmIChsZW4gPCAzMikge1xyXG4gICAgICBrID0gTWF0aC5jZWlsKGxlbiAvIDMpO1xyXG4gICAgICBuID0gKDEgLyB0aW55UG93KDQsIGspKS50b1N0cmluZygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgayA9IDE2O1xyXG4gICAgICBuID0gJzIuMzI4MzA2NDM2NTM4Njk2Mjg5MDYyNWUtMTAnO1xyXG4gICAgfVxyXG5cclxuICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMSwgeC50aW1lcyhuKSwgbmV3IEN0b3IoMSksIHRydWUpO1xyXG5cclxuICAgIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgICB2YXIgY29zaDJfeCxcclxuICAgICAgaSA9IGssXHJcbiAgICAgIGQ4ID0gbmV3IEN0b3IoOCk7XHJcbiAgICBmb3IgKDsgaS0tOykge1xyXG4gICAgICBjb3NoMl94ID0geC50aW1lcyh4KTtcclxuICAgICAgeCA9IG9uZS5taW51cyhjb3NoMl94LnRpbWVzKGQ4Lm1pbnVzKGNvc2gyX3gudGltZXMoZDgpKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZSh4LCBDdG9yLnByZWNpc2lvbiA9IHByLCBDdG9yLnJvdW5kaW5nID0gcm0sIHRydWUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHNpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gICAqIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKlxyXG4gICAqIHNpbmgoeCkgPSB4ICsgeF4zLzMhICsgeF41LzUhICsgeF43LzchICsgLi4uXHJcbiAgICpcclxuICAgKiBzaW5oKDApICAgICAgICAgPSAwXHJcbiAgICogc2luaCgtMCkgICAgICAgID0gLTBcclxuICAgKiBzaW5oKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gICAqIHNpbmgoLUluZmluaXR5KSA9IC1JbmZpbml0eVxyXG4gICAqIHNpbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICogeCAgICAgICAgdGltZSB0YWtlbiAobXMpXHJcbiAgICogMTAgICAgICAgMiBtc1xyXG4gICAqIDEwMCAgICAgIDUgbXNcclxuICAgKiAxMDAwICAgICAxNCBtc1xyXG4gICAqIDEwMDAwICAgIDgyIG1zXHJcbiAgICogMTAwMDAwICAgODg2IG1zICAgICAgICAgICAgMS40MDMzMzE2ODAyMTMwNjE1ODk3ZSs0MzQyOVxyXG4gICAqIDIwMDAwMCAgIDI2MTMgbXNcclxuICAgKiAzMDAwMDAgICA1NDA3IG1zXHJcbiAgICogNDAwMDAwICAgODgyNCBtc1xyXG4gICAqIDUwMDAwMCAgIDEzMDI2IG1zICAgICAgICAgIDguNzA4MDY0MzYxMjcxODA4NDEyOWUrMjE3MTQ2XHJcbiAgICogMTAwMDAwMCAgNDg1NDMgbXNcclxuICAgKlxyXG4gICAqIFRPRE8/IENvbXBhcmUgcGVyZm9ybWFuY2Ugb2Ygc2luaCh4KSA9IDAuNSAqIChleHAoeCkgLSBleHAoLXgpKVxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5oeXBlcmJvbGljU2luZSA9IFAuc2luaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBrLCBwciwgcm0sIGxlbixcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpIHx8IHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIDQ7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICAgIGxlbiA9IHguZC5sZW5ndGg7XHJcblxyXG4gICAgaWYgKGxlbiA8IDMpIHtcclxuICAgICAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4LCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAvLyBBbHRlcm5hdGl2ZSBhcmd1bWVudCByZWR1Y3Rpb246IHNpbmgoM3gpID0gc2luaCh4KSgzICsgNHNpbmheMih4KSlcclxuICAgICAgLy8gaS5lLiBzaW5oKHgpID0gc2luaCh4LzMpKDMgKyA0c2luaF4yKHgvMykpXHJcbiAgICAgIC8vIDMgbXVsdGlwbGljYXRpb25zIGFuZCAxIGFkZGl0aW9uXHJcblxyXG4gICAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IHNpbmgoNXgpID0gc2luaCh4KSg1ICsgc2luaF4yKHgpKDIwICsgMTZzaW5oXjIoeCkpKVxyXG4gICAgICAvLyBpLmUuIHNpbmgoeCkgPSBzaW5oKHgvNSkoNSArIHNpbmheMih4LzUpKDIwICsgMTZzaW5oXjIoeC81KSkpXHJcbiAgICAgIC8vIDQgbXVsdGlwbGljYXRpb25zIGFuZCAyIGFkZGl0aW9uc1xyXG5cclxuICAgICAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgICBrID0gMS40ICogTWF0aC5zcXJ0KGxlbik7XHJcbiAgICAgIGsgPSBrID4gMTYgPyAxNiA6IGsgfCAwO1xyXG5cclxuICAgICAgeCA9IHgudGltZXMoMSAvIHRpbnlQb3coNSwgaykpO1xyXG4gICAgICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgsIHRydWUpO1xyXG5cclxuICAgICAgLy8gUmV2ZXJzZSBhcmd1bWVudCByZWR1Y3Rpb25cclxuICAgICAgdmFyIHNpbmgyX3gsXHJcbiAgICAgICAgZDUgPSBuZXcgQ3Rvcig1KSxcclxuICAgICAgICBkMTYgPSBuZXcgQ3RvcigxNiksXHJcbiAgICAgICAgZDIwID0gbmV3IEN0b3IoMjApO1xyXG4gICAgICBmb3IgKDsgay0tOykge1xyXG4gICAgICAgIHNpbmgyX3ggPSB4LnRpbWVzKHgpO1xyXG4gICAgICAgIHggPSB4LnRpbWVzKGQ1LnBsdXMoc2luaDJfeC50aW1lcyhkMTYudGltZXMoc2luaDJfeCkucGx1cyhkMjApKSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCwgcHIsIHJtLCB0cnVlKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyB0YW5nZW50IG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXNcclxuICAgKiBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy0xLCAxXVxyXG4gICAqXHJcbiAgICogdGFuaCh4KSA9IHNpbmgoeCkgLyBjb3NoKHgpXHJcbiAgICpcclxuICAgKiB0YW5oKDApICAgICAgICAgPSAwXHJcbiAgICogdGFuaCgtMCkgICAgICAgID0gLTBcclxuICAgKiB0YW5oKEluZmluaXR5KSAgPSAxXHJcbiAgICogdGFuaCgtSW5maW5pdHkpID0gLTFcclxuICAgKiB0YW5oKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaHlwZXJib2xpY1RhbmdlbnQgPSBQLnRhbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHIsIHJtLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3Rvcih4LnMpO1xyXG4gICAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDc7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICByZXR1cm4gZGl2aWRlKHguc2luaCgpLCB4LmNvc2goKSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjY29zaW5lIChpbnZlcnNlIGNvc2luZSkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWUgb2ZcclxuICAgKiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstMSwgMV1cclxuICAgKiBSYW5nZTogWzAsIHBpXVxyXG4gICAqXHJcbiAgICogYWNvcyh4KSA9IHBpLzIgLSBhc2luKHgpXHJcbiAgICpcclxuICAgKiBhY29zKDApICAgICAgID0gcGkvMlxyXG4gICAqIGFjb3MoLTApICAgICAgPSBwaS8yXHJcbiAgICogYWNvcygxKSAgICAgICA9IDBcclxuICAgKiBhY29zKC0xKSAgICAgID0gcGlcclxuICAgKiBhY29zKDEvMikgICAgID0gcGkvM1xyXG4gICAqIGFjb3MoLTEvMikgICAgPSAyKnBpLzNcclxuICAgKiBhY29zKHx4fCA+IDEpID0gTmFOXHJcbiAgICogYWNvcyhOYU4pICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pbnZlcnNlQ29zaW5lID0gUC5hY29zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGhhbGZQaSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBrID0geC5hYnMoKS5jbXAoMSksXHJcbiAgICAgIHByID0gQ3Rvci5wcmVjaXNpb24sXHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgICBpZiAoayAhPT0gLTEpIHtcclxuICAgICAgcmV0dXJuIGsgPT09IDBcclxuICAgICAgICAvLyB8eHwgaXMgMVxyXG4gICAgICAgID8geC5pc05lZygpID8gZ2V0UGkoQ3RvciwgcHIsIHJtKSA6IG5ldyBDdG9yKDApXHJcbiAgICAgICAgLy8gfHh8ID4gMSBvciB4IGlzIE5hTlxyXG4gICAgICAgIDogbmV3IEN0b3IoTmFOKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XHJcblxyXG4gICAgLy8gVE9ETz8gU3BlY2lhbCBjYXNlIGFjb3MoMC41KSA9IHBpLzMgYW5kIGFjb3MoLTAuNSkgPSAyKnBpLzNcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgNjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICAgIHggPSB4LmFzaW4oKTtcclxuICAgIGhhbGZQaSA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4gaGFsZlBpLm1pbnVzKHgpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIGNvc2luZSBpbiByYWRpYW5zIG9mIHRoZVxyXG4gICAqIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWzEsIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbMCwgSW5maW5pdHldXHJcbiAgICpcclxuICAgKiBhY29zaCh4KSA9IGxuKHggKyBzcXJ0KHheMiAtIDEpKVxyXG4gICAqXHJcbiAgICogYWNvc2goeCA8IDEpICAgICA9IE5hTlxyXG4gICAqIGFjb3NoKE5hTikgICAgICAgPSBOYU5cclxuICAgKiBhY29zaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICAgKiBhY29zaCgtSW5maW5pdHkpID0gTmFOXHJcbiAgICogYWNvc2goMCkgICAgICAgICA9IE5hTlxyXG4gICAqIGFjb3NoKC0wKSAgICAgICAgPSBOYU5cclxuICAgKiBhY29zaCgxKSAgICAgICAgID0gMFxyXG4gICAqIGFjb3NoKC0xKSAgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaW52ZXJzZUh5cGVyYm9saWNDb3NpbmUgPSBQLmFjb3NoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByLCBybSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICh4Lmx0ZSgxKSkgcmV0dXJuIG5ldyBDdG9yKHguZXEoMSkgPyAwIDogTmFOKTtcclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heChNYXRoLmFicyh4LmUpLCB4LnNkKCkpICsgNDtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgICB4ID0geC50aW1lcyh4KS5taW51cygxKS5zcXJ0KCkucGx1cyh4KTtcclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICAgIHJldHVybiB4LmxuKCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgc2luZSBpbiByYWRpYW5zIG9mIHRoZSB2YWx1ZVxyXG4gICAqIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqXHJcbiAgICogYXNpbmgoeCkgPSBsbih4ICsgc3FydCh4XjIgKyAxKSlcclxuICAgKlxyXG4gICAqIGFzaW5oKE5hTikgICAgICAgPSBOYU5cclxuICAgKiBhc2luaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICAgKiBhc2luaCgtSW5maW5pdHkpID0gLUluZmluaXR5XHJcbiAgICogYXNpbmgoMCkgICAgICAgICA9IDBcclxuICAgKiBhc2luaCgtMCkgICAgICAgID0gLTBcclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaW52ZXJzZUh5cGVyYm9saWNTaW5lID0gUC5hc2luaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwciwgcm0sXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSB8fCB4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyAyICogTWF0aC5tYXgoTWF0aC5hYnMoeC5lKSwgeC5zZCgpKSArIDY7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgeCA9IHgudGltZXMoeCkucGx1cygxKS5zcXJ0KCkucGx1cyh4KTtcclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICAgIHJldHVybiB4LmxuKCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBpbiByYWRpYW5zIG9mIHRoZVxyXG4gICAqIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy0xLCAxXVxyXG4gICAqIFJhbmdlOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKlxyXG4gICAqIGF0YW5oKHgpID0gMC41ICogbG4oKDEgKyB4KSAvICgxIC0geCkpXHJcbiAgICpcclxuICAgKiBhdGFuaCh8eHwgPiAxKSAgID0gTmFOXHJcbiAgICogYXRhbmgoTmFOKSAgICAgICA9IE5hTlxyXG4gICAqIGF0YW5oKEluZmluaXR5KSAgPSBOYU5cclxuICAgKiBhdGFuaCgtSW5maW5pdHkpID0gTmFOXHJcbiAgICogYXRhbmgoMCkgICAgICAgICA9IDBcclxuICAgKiBhdGFuaCgtMCkgICAgICAgID0gLTBcclxuICAgKiBhdGFuaCgxKSAgICAgICAgID0gSW5maW5pdHlcclxuICAgKiBhdGFuaCgtMSkgICAgICAgID0gLUluZmluaXR5XHJcbiAgICpcclxuICAgKi9cclxuICBQLmludmVyc2VIeXBlcmJvbGljVGFuZ2VudCA9IFAuYXRhbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHIsIHJtLCB3cHIsIHhzZCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICAgIGlmICh4LmUgPj0gMCkgcmV0dXJuIG5ldyBDdG9yKHguYWJzKCkuZXEoMSkgPyB4LnMgLyAwIDogeC5pc1plcm8oKSA/IHggOiBOYU4pO1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICB4c2QgPSB4LnNkKCk7XHJcblxyXG4gICAgaWYgKE1hdGgubWF4KHhzZCwgcHIpIDwgMiAqIC14LmUgLSAxKSByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHByLCBybSwgdHJ1ZSk7XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgPSB4c2QgLSB4LmU7XHJcblxyXG4gICAgeCA9IGRpdmlkZSh4LnBsdXMoMSksIG5ldyBDdG9yKDEpLm1pbnVzKHgpLCB3cHIgKyBwciwgMSk7XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDQ7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICB4ID0geC5sbigpO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIHgudGltZXMoMC41KTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjc2luZSAoaW52ZXJzZSBzaW5lKSBpbiByYWRpYW5zIG9mIHRoZSB2YWx1ZSBvZiB0aGlzXHJcbiAgICogRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFstcGkvMiwgcGkvMl1cclxuICAgKlxyXG4gICAqIGFzaW4oeCkgPSAyKmF0YW4oeC8oMSArIHNxcnQoMSAtIHheMikpKVxyXG4gICAqXHJcbiAgICogYXNpbigwKSAgICAgICA9IDBcclxuICAgKiBhc2luKC0wKSAgICAgID0gLTBcclxuICAgKiBhc2luKDEvMikgICAgID0gcGkvNlxyXG4gICAqIGFzaW4oLTEvMikgICAgPSAtcGkvNlxyXG4gICAqIGFzaW4oMSkgICAgICAgPSBwaS8yXHJcbiAgICogYXNpbigtMSkgICAgICA9IC1waS8yXHJcbiAgICogYXNpbih8eHwgPiAxKSA9IE5hTlxyXG4gICAqIGFzaW4oTmFOKSAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqIFRPRE8/IENvbXBhcmUgcGVyZm9ybWFuY2Ugb2YgVGF5bG9yIHNlcmllcy5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaW52ZXJzZVNpbmUgPSBQLmFzaW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaGFsZlBpLCBrLFxyXG4gICAgICBwciwgcm0sXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIGsgPSB4LmFicygpLmNtcCgxKTtcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gICAgaWYgKGsgIT09IC0xKSB7XHJcblxyXG4gICAgICAvLyB8eHwgaXMgMVxyXG4gICAgICBpZiAoayA9PT0gMCkge1xyXG4gICAgICAgIGhhbGZQaSA9IGdldFBpKEN0b3IsIHByICsgNCwgcm0pLnRpbWVzKDAuNSk7XHJcbiAgICAgICAgaGFsZlBpLnMgPSB4LnM7XHJcbiAgICAgICAgcmV0dXJuIGhhbGZQaTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gfHh8ID4gMSBvciB4IGlzIE5hTlxyXG4gICAgICByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPPyBTcGVjaWFsIGNhc2UgYXNpbigxLzIpID0gcGkvNiBhbmQgYXNpbigtMS8yKSA9IC1waS82XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDY7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICB4ID0geC5kaXYobmV3IEN0b3IoMSkubWludXMoeC50aW1lcyh4KSkuc3FydCgpLnBsdXMoMSkpLmF0YW4oKTtcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICAgIHJldHVybiB4LnRpbWVzKDIpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IChpbnZlcnNlIHRhbmdlbnQpIGluIHJhZGlhbnMgb2YgdGhlIHZhbHVlXHJcbiAgICogb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy1waS8yLCBwaS8yXVxyXG4gICAqXHJcbiAgICogYXRhbih4KSA9IHggLSB4XjMvMyArIHheNS81IC0geF43LzcgKyAuLi5cclxuICAgKlxyXG4gICAqIGF0YW4oMCkgICAgICAgICA9IDBcclxuICAgKiBhdGFuKC0wKSAgICAgICAgPSAtMFxyXG4gICAqIGF0YW4oMSkgICAgICAgICA9IHBpLzRcclxuICAgKiBhdGFuKC0xKSAgICAgICAgPSAtcGkvNFxyXG4gICAqIGF0YW4oSW5maW5pdHkpICA9IHBpLzJcclxuICAgKiBhdGFuKC1JbmZpbml0eSkgPSAtcGkvMlxyXG4gICAqIGF0YW4oTmFOKSAgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pbnZlcnNlVGFuZ2VudCA9IFAuYXRhbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBpLCBqLCBrLCBuLCBweCwgdCwgciwgd3ByLCB4MixcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBwciA9IEN0b3IucHJlY2lzaW9uLFxyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkpIHtcclxuICAgICAgaWYgKCF4LnMpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gICAgICBpZiAocHIgKyA0IDw9IFBJX1BSRUNJU0lPTikge1xyXG4gICAgICAgIHIgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG4gICAgICAgIHIucyA9IHgucztcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh4LmlzWmVybygpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuICAgIH0gZWxzZSBpZiAoeC5hYnMoKS5lcSgxKSAmJiBwciArIDQgPD0gUElfUFJFQ0lTSU9OKSB7XHJcbiAgICAgIHIgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjI1KTtcclxuICAgICAgci5zID0geC5zO1xyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHdwciA9IHByICsgMTA7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICAvLyBUT0RPPyBpZiAoeCA+PSAxICYmIHByIDw9IFBJX1BSRUNJU0lPTikgYXRhbih4KSA9IGhhbGZQaSAqIHgucyAtIGF0YW4oMSAvIHgpO1xyXG5cclxuICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvblxyXG4gICAgLy8gRW5zdXJlIHx4fCA8IDAuNDJcclxuICAgIC8vIGF0YW4oeCkgPSAyICogYXRhbih4IC8gKDEgKyBzcXJ0KDEgKyB4XjIpKSlcclxuXHJcbiAgICBrID0gTWF0aC5taW4oMjgsIHdwciAvIExPR19CQVNFICsgMiB8IDApO1xyXG5cclxuICAgIGZvciAoaSA9IGs7IGk7IC0taSkgeCA9IHguZGl2KHgudGltZXMoeCkucGx1cygxKS5zcXJ0KCkucGx1cygxKSk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgICBqID0gTWF0aC5jZWlsKHdwciAvIExPR19CQVNFKTtcclxuICAgIG4gPSAxO1xyXG4gICAgeDIgPSB4LnRpbWVzKHgpO1xyXG4gICAgciA9IG5ldyBDdG9yKHgpO1xyXG4gICAgcHggPSB4O1xyXG5cclxuICAgIC8vIGF0YW4oeCkgPSB4IC0geF4zLzMgKyB4XjUvNSAtIHheNy83ICsgLi4uXHJcbiAgICBmb3IgKDsgaSAhPT0gLTE7KSB7XHJcbiAgICAgIHB4ID0gcHgudGltZXMoeDIpO1xyXG4gICAgICB0ID0gci5taW51cyhweC5kaXYobiArPSAyKSk7XHJcblxyXG4gICAgICBweCA9IHB4LnRpbWVzKHgyKTtcclxuICAgICAgciA9IHQucGx1cyhweC5kaXYobiArPSAyKSk7XHJcblxyXG4gICAgICBpZiAoci5kW2pdICE9PSB2b2lkIDApIGZvciAoaSA9IGo7IHIuZFtpXSA9PT0gdC5kW2ldICYmIGktLTspO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChrKSByID0gci50aW1lcygyIDw8IChrIC0gMSkpO1xyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UociwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtLCB0cnVlKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGEgZmluaXRlIG51bWJlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaXNGaW5pdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gISF0aGlzLmQ7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBhbiBpbnRlZ2VyLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pc0ludGVnZXIgPSBQLmlzSW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICEhdGhpcy5kICYmIG1hdGhmbG9vcih0aGlzLmUgLyBMT0dfQkFTRSkgPiB0aGlzLmQubGVuZ3RoIC0gMjtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIE5hTiwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaXNOYU4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gIXRoaXMucztcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIG5lZ2F0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pc05lZ2F0aXZlID0gUC5pc05lZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLnMgPCAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgcG9zaXRpdmUsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmlzUG9zaXRpdmUgPSBQLmlzUG9zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucyA+IDA7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyAwIG9yIC0wLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pc1plcm8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gISF0aGlzLmQgJiYgdGhpcy5kWzBdID09PSAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAubGVzc1RoYW4gPSBQLmx0ID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHJldHVybiB0aGlzLmNtcCh5KSA8IDA7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYHlgLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5sZXNzVGhhbk9yRXF1YWxUbyA9IFAubHRlID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHJldHVybiB0aGlzLmNtcCh5KSA8IDE7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRoZSBsb2dhcml0aG0gb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCB0byB0aGUgc3BlY2lmaWVkIGJhc2UsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogSWYgbm8gYmFzZSBpcyBzcGVjaWZpZWQsIHJldHVybiBsb2dbMTBdKGFyZykuXHJcbiAgICpcclxuICAgKiBsb2dbYmFzZV0oYXJnKSA9IGxuKGFyZykgLyBsbihiYXNlKVxyXG4gICAqXHJcbiAgICogVGhlIHJlc3VsdCB3aWxsIGFsd2F5cyBiZSBjb3JyZWN0bHkgcm91bmRlZCBpZiB0aGUgYmFzZSBvZiB0aGUgbG9nIGlzIDEwLCBhbmQgJ2FsbW9zdCBhbHdheXMnXHJcbiAgICogb3RoZXJ3aXNlOlxyXG4gICAqXHJcbiAgICogRGVwZW5kaW5nIG9uIHRoZSByb3VuZGluZyBtb2RlLCB0aGUgcmVzdWx0IG1heSBiZSBpbmNvcnJlY3RseSByb3VuZGVkIGlmIHRoZSBmaXJzdCBmaWZ0ZWVuXHJcbiAgICogcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5OTk5OTk5OTk5OTkgb3IgWzUwXTAwMDAwMDAwMDAwMDAwLiBJbiB0aGF0IGNhc2UsIHRoZSBtYXhpbXVtIGVycm9yXHJcbiAgICogYmV0d2VlbiB0aGUgcmVzdWx0IGFuZCB0aGUgY29ycmVjdGx5IHJvdW5kZWQgcmVzdWx0IHdpbGwgYmUgb25lIHVscCAodW5pdCBpbiB0aGUgbGFzdCBwbGFjZSkuXHJcbiAgICpcclxuICAgKiBsb2dbLWJdKGEpICAgICAgID0gTmFOXHJcbiAgICogbG9nWzBdKGEpICAgICAgICA9IE5hTlxyXG4gICAqIGxvZ1sxXShhKSAgICAgICAgPSBOYU5cclxuICAgKiBsb2dbTmFOXShhKSAgICAgID0gTmFOXHJcbiAgICogbG9nW0luZmluaXR5XShhKSA9IE5hTlxyXG4gICAqIGxvZ1tiXSgwKSAgICAgICAgPSAtSW5maW5pdHlcclxuICAgKiBsb2dbYl0oLTApICAgICAgID0gLUluZmluaXR5XHJcbiAgICogbG9nW2JdKC1hKSAgICAgICA9IE5hTlxyXG4gICAqIGxvZ1tiXSgxKSAgICAgICAgPSAwXHJcbiAgICogbG9nW2JdKEluZmluaXR5KSA9IEluZmluaXR5XHJcbiAgICogbG9nW2JdKE5hTikgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICogW2Jhc2VdIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBiYXNlIG9mIHRoZSBsb2dhcml0aG0uXHJcbiAgICpcclxuICAgKi9cclxuICBQLmxvZ2FyaXRobSA9IFAubG9nID0gZnVuY3Rpb24gKGJhc2UpIHtcclxuICAgIHZhciBpc0Jhc2UxMCwgZCwgZGVub21pbmF0b3IsIGssIGluZiwgbnVtLCBzZCwgcixcclxuICAgICAgYXJnID0gdGhpcyxcclxuICAgICAgQ3RvciA9IGFyZy5jb25zdHJ1Y3RvcixcclxuICAgICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgICBndWFyZCA9IDU7XHJcblxyXG4gICAgLy8gRGVmYXVsdCBiYXNlIGlzIDEwLlxyXG4gICAgaWYgKGJhc2UgPT0gbnVsbCkge1xyXG4gICAgICBiYXNlID0gbmV3IEN0b3IoMTApO1xyXG4gICAgICBpc0Jhc2UxMCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBiYXNlID0gbmV3IEN0b3IoYmFzZSk7XHJcbiAgICAgIGQgPSBiYXNlLmQ7XHJcblxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIGJhc2UgaXMgbmVnYXRpdmUsIG9yIG5vbi1maW5pdGUsIG9yIGlzIDAgb3IgMS5cclxuICAgICAgaWYgKGJhc2UucyA8IDAgfHwgIWQgfHwgIWRbMF0gfHwgYmFzZS5lcSgxKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgICBpc0Jhc2UxMCA9IGJhc2UuZXEoMTApO1xyXG4gICAgfVxyXG5cclxuICAgIGQgPSBhcmcuZDtcclxuXHJcbiAgICAvLyBJcyBhcmcgbmVnYXRpdmUsIG5vbi1maW5pdGUsIDAgb3IgMT9cclxuICAgIGlmIChhcmcucyA8IDAgfHwgIWQgfHwgIWRbMF0gfHwgYXJnLmVxKDEpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQ3RvcihkICYmICFkWzBdID8gLTEgLyAwIDogYXJnLnMgIT0gMSA/IE5hTiA6IGQgPyAwIDogMSAvIDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRoZSByZXN1bHQgd2lsbCBoYXZlIGEgbm9uLXRlcm1pbmF0aW5nIGRlY2ltYWwgZXhwYW5zaW9uIGlmIGJhc2UgaXMgMTAgYW5kIGFyZyBpcyBub3QgYW5cclxuICAgIC8vIGludGVnZXIgcG93ZXIgb2YgMTAuXHJcbiAgICBpZiAoaXNCYXNlMTApIHtcclxuICAgICAgaWYgKGQubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGluZiA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZm9yIChrID0gZFswXTsgayAlIDEwID09PSAwOykgayAvPSAxMDtcclxuICAgICAgICBpbmYgPSBrICE9PSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgIHNkID0gcHIgKyBndWFyZDtcclxuICAgIG51bSA9IG5hdHVyYWxMb2dhcml0aG0oYXJnLCBzZCk7XHJcbiAgICBkZW5vbWluYXRvciA9IGlzQmFzZTEwID8gZ2V0TG4xMChDdG9yLCBzZCArIDEwKSA6IG5hdHVyYWxMb2dhcml0aG0oYmFzZSwgc2QpO1xyXG5cclxuICAgIC8vIFRoZSByZXN1bHQgd2lsbCBoYXZlIDUgcm91bmRpbmcgZGlnaXRzLlxyXG4gICAgciA9IGRpdmlkZShudW0sIGRlbm9taW5hdG9yLCBzZCwgMSk7XHJcblxyXG4gICAgLy8gSWYgYXQgYSByb3VuZGluZyBib3VuZGFyeSwgaS5lLiB0aGUgcmVzdWx0J3Mgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5OSBvciBbNTBdMDAwMCxcclxuICAgIC8vIGNhbGN1bGF0ZSAxMCBmdXJ0aGVyIGRpZ2l0cy5cclxuICAgIC8vXHJcbiAgICAvLyBJZiB0aGUgcmVzdWx0IGlzIGtub3duIHRvIGhhdmUgYW4gaW5maW5pdGUgZGVjaW1hbCBleHBhbnNpb24sIHJlcGVhdCB0aGlzIHVudGlsIGl0IGlzIGNsZWFyXHJcbiAgICAvLyB0aGF0IHRoZSByZXN1bHQgaXMgYWJvdmUgb3IgYmVsb3cgdGhlIGJvdW5kYXJ5LiBPdGhlcndpc2UsIGlmIGFmdGVyIGNhbGN1bGF0aW5nIHRoZSAxMFxyXG4gICAgLy8gZnVydGhlciBkaWdpdHMsIHRoZSBsYXN0IDE0IGFyZSBuaW5lcywgcm91bmQgdXAgYW5kIGFzc3VtZSB0aGUgcmVzdWx0IGlzIGV4YWN0LlxyXG4gICAgLy8gQWxzbyBhc3N1bWUgdGhlIHJlc3VsdCBpcyBleGFjdCBpZiB0aGUgbGFzdCAxNCBhcmUgemVyby5cclxuICAgIC8vXHJcbiAgICAvLyBFeGFtcGxlIG9mIGEgcmVzdWx0IHRoYXQgd2lsbCBiZSBpbmNvcnJlY3RseSByb3VuZGVkOlxyXG4gICAgLy8gbG9nWzEwNDg1NzZdKDQ1MDM1OTk2MjczNzA1MDIpID0gMi42MDAwMDAwMDAwMDAwMDAwOTYxMDI3OTUxMTQ0NDc0Ni4uLlxyXG4gICAgLy8gVGhlIGFib3ZlIHJlc3VsdCBjb3JyZWN0bHkgcm91bmRlZCB1c2luZyBST1VORF9DRUlMIHRvIDEgZGVjaW1hbCBwbGFjZSBzaG91bGQgYmUgMi43LCBidXQgaXRcclxuICAgIC8vIHdpbGwgYmUgZ2l2ZW4gYXMgMi42IGFzIHRoZXJlIGFyZSAxNSB6ZXJvcyBpbW1lZGlhdGVseSBhZnRlciB0aGUgcmVxdWVzdGVkIGRlY2ltYWwgcGxhY2UsIHNvXHJcbiAgICAvLyB0aGUgZXhhY3QgcmVzdWx0IHdvdWxkIGJlIGFzc3VtZWQgdG8gYmUgMi42LCB3aGljaCByb3VuZGVkIHVzaW5nIFJPVU5EX0NFSUwgdG8gMSBkZWNpbWFsXHJcbiAgICAvLyBwbGFjZSBpcyBzdGlsbCAyLjYuXHJcbiAgICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhyLmQsIGsgPSBwciwgcm0pKSB7XHJcblxyXG4gICAgICBkbyB7XHJcbiAgICAgICAgc2QgKz0gMTA7XHJcbiAgICAgICAgbnVtID0gbmF0dXJhbExvZ2FyaXRobShhcmcsIHNkKTtcclxuICAgICAgICBkZW5vbWluYXRvciA9IGlzQmFzZTEwID8gZ2V0TG4xMChDdG9yLCBzZCArIDEwKSA6IG5hdHVyYWxMb2dhcml0aG0oYmFzZSwgc2QpO1xyXG4gICAgICAgIHIgPSBkaXZpZGUobnVtLCBkZW5vbWluYXRvciwgc2QsIDEpO1xyXG5cclxuICAgICAgICBpZiAoIWluZikge1xyXG5cclxuICAgICAgICAgIC8vIENoZWNrIGZvciAxNCBuaW5lcyBmcm9tIHRoZSAybmQgcm91bmRpbmcgZGlnaXQsIGFzIHRoZSBmaXJzdCBtYXkgYmUgNC5cclxuICAgICAgICAgIGlmICgrZGlnaXRzVG9TdHJpbmcoci5kKS5zbGljZShrICsgMSwgayArIDE1KSArIDEgPT0gMWUxNCkge1xyXG4gICAgICAgICAgICByID0gZmluYWxpc2UociwgcHIgKyAxLCAwKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH0gd2hpbGUgKGNoZWNrUm91bmRpbmdEaWdpdHMoci5kLCBrICs9IDEwLCBybSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UociwgcHIsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbWF4aW11bSBvZiB0aGUgYXJndW1lbnRzIGFuZCB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICBQLm1heCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwoYXJndW1lbnRzLCB0aGlzKTtcclxuICAgIHJldHVybiBtYXhPck1pbih0aGlzLmNvbnN0cnVjdG9yLCBhcmd1bWVudHMsICdsdCcpO1xyXG4gIH07XHJcbiAgICovXHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtaW5pbXVtIG9mIHRoZSBhcmd1bWVudHMgYW5kIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gIFAubWluID0gZnVuY3Rpb24gKCkge1xyXG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbChhcmd1bWVudHMsIHRoaXMpO1xyXG4gICAgcmV0dXJuIG1heE9yTWluKHRoaXMuY29uc3RydWN0b3IsIGFyZ3VtZW50cywgJ2d0Jyk7XHJcbiAgfTtcclxuICAgKi9cclxuXHJcblxyXG4gIC8qXHJcbiAgICogIG4gLSAwID0gblxyXG4gICAqICBuIC0gTiA9IE5cclxuICAgKiAgbiAtIEkgPSAtSVxyXG4gICAqICAwIC0gbiA9IC1uXHJcbiAgICogIDAgLSAwID0gMFxyXG4gICAqICAwIC0gTiA9IE5cclxuICAgKiAgMCAtIEkgPSAtSVxyXG4gICAqICBOIC0gbiA9IE5cclxuICAgKiAgTiAtIDAgPSBOXHJcbiAgICogIE4gLSBOID0gTlxyXG4gICAqICBOIC0gSSA9IE5cclxuICAgKiAgSSAtIG4gPSBJXHJcbiAgICogIEkgLSAwID0gSVxyXG4gICAqICBJIC0gTiA9IE5cclxuICAgKiAgSSAtIEkgPSBOXHJcbiAgICpcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIG1pbnVzIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLm1pbnVzID0gUC5zdWIgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIGQsIGUsIGksIGosIGssIGxlbiwgcHIsIHJtLCB4ZCwgeGUsIHhMVHksIHlkLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAgIC8vIElmIGVpdGhlciBpcyBub3QgZmluaXRlLi4uXHJcbiAgICBpZiAoIXguZCB8fCAheS5kKSB7XHJcblxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICAgIGlmICgheC5zIHx8ICF5LnMpIHkgPSBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgICAgLy8gUmV0dXJuIHkgbmVnYXRlZCBpZiB4IGlzIGZpbml0ZSBhbmQgeSBpcyDCsUluZmluaXR5LlxyXG4gICAgICBlbHNlIGlmICh4LmQpIHkucyA9IC15LnM7XHJcblxyXG4gICAgICAvLyBSZXR1cm4geCBpZiB5IGlzIGZpbml0ZSBhbmQgeCBpcyDCsUluZmluaXR5LlxyXG4gICAgICAvLyBSZXR1cm4geCBpZiBib3RoIGFyZSDCsUluZmluaXR5IHdpdGggZGlmZmVyZW50IHNpZ25zLlxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIGJvdGggYXJlIMKxSW5maW5pdHkgd2l0aCB0aGUgc2FtZSBzaWduLlxyXG4gICAgICBlbHNlIHkgPSBuZXcgQ3Rvcih5LmQgfHwgeC5zICE9PSB5LnMgPyB4IDogTmFOKTtcclxuXHJcbiAgICAgIHJldHVybiB5O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIHNpZ25zIGRpZmZlci4uLlxyXG4gICAgaWYgKHgucyAhPSB5LnMpIHtcclxuICAgICAgeS5zID0gLXkucztcclxuICAgICAgcmV0dXJuIHgucGx1cyh5KTtcclxuICAgIH1cclxuXHJcbiAgICB4ZCA9IHguZDtcclxuICAgIHlkID0geS5kO1xyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgICAvLyBJZiBlaXRoZXIgaXMgemVyby4uLlxyXG4gICAgaWYgKCF4ZFswXSB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAgIC8vIFJldHVybiB5IG5lZ2F0ZWQgaWYgeCBpcyB6ZXJvIGFuZCB5IGlzIG5vbi16ZXJvLlxyXG4gICAgICBpZiAoeWRbMF0pIHkucyA9IC15LnM7XHJcblxyXG4gICAgICAvLyBSZXR1cm4geCBpZiB5IGlzIHplcm8gYW5kIHggaXMgbm9uLXplcm8uXHJcbiAgICAgIGVsc2UgaWYgKHhkWzBdKSB5ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgICAvLyBSZXR1cm4gemVybyBpZiBib3RoIGFyZSB6ZXJvLlxyXG4gICAgICAvLyBGcm9tIElFRUUgNzU0ICgyMDA4KSA2LjM6IDAgLSAwID0gLTAgLSAtMCA9IC0wIHdoZW4gcm91bmRpbmcgdG8gLUluZmluaXR5LlxyXG4gICAgICBlbHNlIHJldHVybiBuZXcgQ3RvcihybSA9PT0gMyA/IC0wIDogMCk7XHJcblxyXG4gICAgICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB4IGFuZCB5IGFyZSBmaW5pdGUsIG5vbi16ZXJvIG51bWJlcnMgd2l0aCB0aGUgc2FtZSBzaWduLlxyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBiYXNlIDFlNyBleHBvbmVudHMuXHJcbiAgICBlID0gbWF0aGZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICAgIHhlID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKTtcclxuXHJcbiAgICB4ZCA9IHhkLnNsaWNlKCk7XHJcbiAgICBrID0geGUgLSBlO1xyXG5cclxuICAgIC8vIElmIGJhc2UgMWU3IGV4cG9uZW50cyBkaWZmZXIuLi5cclxuICAgIGlmIChrKSB7XHJcbiAgICAgIHhMVHkgPSBrIDwgMDtcclxuXHJcbiAgICAgIGlmICh4TFR5KSB7XHJcbiAgICAgICAgZCA9IHhkO1xyXG4gICAgICAgIGsgPSAtaztcclxuICAgICAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZCA9IHlkO1xyXG4gICAgICAgIGUgPSB4ZTtcclxuICAgICAgICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE51bWJlcnMgd2l0aCBtYXNzaXZlbHkgZGlmZmVyZW50IGV4cG9uZW50cyB3b3VsZCByZXN1bHQgaW4gYSB2ZXJ5IGhpZ2ggbnVtYmVyIG9mXHJcbiAgICAgIC8vIHplcm9zIG5lZWRpbmcgdG8gYmUgcHJlcGVuZGVkLCBidXQgdGhpcyBjYW4gYmUgYXZvaWRlZCB3aGlsZSBzdGlsbCBlbnN1cmluZyBjb3JyZWN0XHJcbiAgICAgIC8vIHJvdW5kaW5nIGJ5IGxpbWl0aW5nIHRoZSBudW1iZXIgb2YgemVyb3MgdG8gYE1hdGguY2VpbChwciAvIExPR19CQVNFKSArIDJgLlxyXG4gICAgICBpID0gTWF0aC5tYXgoTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UpLCBsZW4pICsgMjtcclxuXHJcbiAgICAgIGlmIChrID4gaSkge1xyXG4gICAgICAgIGsgPSBpO1xyXG4gICAgICAgIGQubGVuZ3RoID0gMTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuXHJcbiAgICAgIGQucmV2ZXJzZSgpO1xyXG4gICAgICBmb3IgKGkgPSBrOyBpLS07KSBkLnB1c2goMCk7XHJcbiAgICAgIGQucmV2ZXJzZSgpO1xyXG5cclxuICAgIC8vIEJhc2UgMWU3IGV4cG9uZW50cyBlcXVhbC5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAvLyBDaGVjayBkaWdpdHMgdG8gZGV0ZXJtaW5lIHdoaWNoIGlzIHRoZSBiaWdnZXIgbnVtYmVyLlxyXG5cclxuICAgICAgaSA9IHhkLmxlbmd0aDtcclxuICAgICAgbGVuID0geWQubGVuZ3RoO1xyXG4gICAgICB4TFR5ID0gaSA8IGxlbjtcclxuICAgICAgaWYgKHhMVHkpIGxlbiA9IGk7XHJcblxyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAoeGRbaV0gIT0geWRbaV0pIHtcclxuICAgICAgICAgIHhMVHkgPSB4ZFtpXSA8IHlkW2ldO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBrID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoeExUeSkge1xyXG4gICAgICBkID0geGQ7XHJcbiAgICAgIHhkID0geWQ7XHJcbiAgICAgIHlkID0gZDtcclxuICAgICAgeS5zID0gLXkucztcclxuICAgIH1cclxuXHJcbiAgICBsZW4gPSB4ZC5sZW5ndGg7XHJcblxyXG4gICAgLy8gQXBwZW5kIHplcm9zIHRvIGB4ZGAgaWYgc2hvcnRlci5cclxuICAgIC8vIERvbid0IGFkZCB6ZXJvcyB0byBgeWRgIGlmIHNob3J0ZXIgYXMgc3VidHJhY3Rpb24gb25seSBuZWVkcyB0byBzdGFydCBhdCBgeWRgIGxlbmd0aC5cclxuICAgIGZvciAoaSA9IHlkLmxlbmd0aCAtIGxlbjsgaSA+IDA7IC0taSkgeGRbbGVuKytdID0gMDtcclxuXHJcbiAgICAvLyBTdWJ0cmFjdCB5ZCBmcm9tIHhkLlxyXG4gICAgZm9yIChpID0geWQubGVuZ3RoOyBpID4gazspIHtcclxuXHJcbiAgICAgIGlmICh4ZFstLWldIDwgeWRbaV0pIHtcclxuICAgICAgICBmb3IgKGogPSBpOyBqICYmIHhkWy0tal0gPT09IDA7KSB4ZFtqXSA9IEJBU0UgLSAxO1xyXG4gICAgICAgIC0teGRbal07XHJcbiAgICAgICAgeGRbaV0gKz0gQkFTRTtcclxuICAgICAgfVxyXG5cclxuICAgICAgeGRbaV0gLT0geWRbaV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgZm9yICg7IHhkWy0tbGVuXSA9PT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICAgIC8vIFJlbW92ZSBsZWFkaW5nIHplcm9zIGFuZCBhZGp1c3QgZXhwb25lbnQgYWNjb3JkaW5nbHkuXHJcbiAgICBmb3IgKDsgeGRbMF0gPT09IDA7IHhkLnNoaWZ0KCkpIC0tZTtcclxuXHJcbiAgICAvLyBaZXJvP1xyXG4gICAgaWYgKCF4ZFswXSkgcmV0dXJuIG5ldyBDdG9yKHJtID09PSAzID8gLTAgOiAwKTtcclxuXHJcbiAgICB5LmQgPSB4ZDtcclxuICAgIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHhkLCBlKTtcclxuXHJcbiAgICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgIG4gJSAwID0gIE5cclxuICAgKiAgIG4gJSBOID0gIE5cclxuICAgKiAgIG4gJSBJID0gIG5cclxuICAgKiAgIDAgJSBuID0gIDBcclxuICAgKiAgLTAgJSBuID0gLTBcclxuICAgKiAgIDAgJSAwID0gIE5cclxuICAgKiAgIDAgJSBOID0gIE5cclxuICAgKiAgIDAgJSBJID0gIDBcclxuICAgKiAgIE4gJSBuID0gIE5cclxuICAgKiAgIE4gJSAwID0gIE5cclxuICAgKiAgIE4gJSBOID0gIE5cclxuICAgKiAgIE4gJSBJID0gIE5cclxuICAgKiAgIEkgJSBuID0gIE5cclxuICAgKiAgIEkgJSAwID0gIE5cclxuICAgKiAgIEkgJSBOID0gIE5cclxuICAgKiAgIEkgJSBJID0gIE5cclxuICAgKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgbW9kdWxvIGB5YCwgcm91bmRlZCB0b1xyXG4gICAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBUaGUgcmVzdWx0IGRlcGVuZHMgb24gdGhlIG1vZHVsbyBtb2RlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5tb2R1bG8gPSBQLm1vZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICB2YXIgcSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIHkgPSBuZXcgQ3Rvcih5KTtcclxuXHJcbiAgICAvLyBSZXR1cm4gTmFOIGlmIHggaXMgwrFJbmZpbml0eSBvciBOYU4sIG9yIHkgaXMgTmFOIG9yIMKxMC5cclxuICAgIGlmICgheC5kIHx8ICF5LnMgfHwgeS5kICYmICF5LmRbMF0pIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgIC8vIFJldHVybiB4IGlmIHkgaXMgwrFJbmZpbml0eSBvciB4IGlzIMKxMC5cclxuICAgIGlmICgheS5kIHx8IHguZCAmJiAheC5kWzBdKSB7XHJcbiAgICAgIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgQ3Rvci5wcmVjaXNpb24sIEN0b3Iucm91bmRpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFByZXZlbnQgcm91bmRpbmcgb2YgaW50ZXJtZWRpYXRlIGNhbGN1bGF0aW9ucy5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKEN0b3IubW9kdWxvID09IDkpIHtcclxuXHJcbiAgICAgIC8vIEV1Y2xpZGlhbiBkaXZpc2lvbjogcSA9IHNpZ24oeSkgKiBmbG9vcih4IC8gYWJzKHkpKVxyXG4gICAgICAvLyByZXN1bHQgPSB4IC0gcSAqIHkgICAgd2hlcmUgIDAgPD0gcmVzdWx0IDwgYWJzKHkpXHJcbiAgICAgIHEgPSBkaXZpZGUoeCwgeS5hYnMoKSwgMCwgMywgMSk7XHJcbiAgICAgIHEucyAqPSB5LnM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBxID0gZGl2aWRlKHgsIHksIDAsIEN0b3IubW9kdWxvLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBxID0gcS50aW1lcyh5KTtcclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIHgubWludXMocSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgZXhwb25lbnRpYWwgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCxcclxuICAgKiBpLmUuIHRoZSBiYXNlIGUgcmFpc2VkIHRvIHRoZSBwb3dlciB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAubmF0dXJhbEV4cG9uZW50aWFsID0gUC5leHAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gbmF0dXJhbEV4cG9uZW50aWFsKHRoaXMpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLFxyXG4gICAqIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAubmF0dXJhbExvZ2FyaXRobSA9IFAubG4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gbmF0dXJhbExvZ2FyaXRobSh0aGlzKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIG5lZ2F0ZWQsIGkuZS4gYXMgaWYgbXVsdGlwbGllZCBieVxyXG4gICAqIC0xLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5uZWdhdGVkID0gUC5uZWcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgeCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xyXG4gICAgeC5zID0gLXgucztcclxuICAgIHJldHVybiBmaW5hbGlzZSh4KTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgbiArIDAgPSBuXHJcbiAgICogIG4gKyBOID0gTlxyXG4gICAqICBuICsgSSA9IElcclxuICAgKiAgMCArIG4gPSBuXHJcbiAgICogIDAgKyAwID0gMFxyXG4gICAqICAwICsgTiA9IE5cclxuICAgKiAgMCArIEkgPSBJXHJcbiAgICogIE4gKyBuID0gTlxyXG4gICAqICBOICsgMCA9IE5cclxuICAgKiAgTiArIE4gPSBOXHJcbiAgICogIE4gKyBJID0gTlxyXG4gICAqICBJICsgbiA9IElcclxuICAgKiAgSSArIDAgPSBJXHJcbiAgICogIEkgKyBOID0gTlxyXG4gICAqICBJICsgSSA9IElcclxuICAgKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcGx1cyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5wbHVzID0gUC5hZGQgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIGNhcnJ5LCBkLCBlLCBpLCBrLCBsZW4sIHByLCBybSwgeGQsIHlkLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgeSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAgIC8vIElmIGVpdGhlciBpcyBub3QgZmluaXRlLi4uXHJcbiAgICBpZiAoIXguZCB8fCAheS5kKSB7XHJcblxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICAgIGlmICgheC5zIHx8ICF5LnMpIHkgPSBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgICAgLy8gUmV0dXJuIHggaWYgeSBpcyBmaW5pdGUgYW5kIHggaXMgwrFJbmZpbml0eS5cclxuICAgICAgLy8gUmV0dXJuIHggaWYgYm90aCBhcmUgwrFJbmZpbml0eSB3aXRoIHRoZSBzYW1lIHNpZ24uXHJcbiAgICAgIC8vIFJldHVybiBOYU4gaWYgYm90aCBhcmUgwrFJbmZpbml0eSB3aXRoIGRpZmZlcmVudCBzaWducy5cclxuICAgICAgLy8gUmV0dXJuIHkgaWYgeCBpcyBmaW5pdGUgYW5kIHkgaXMgwrFJbmZpbml0eS5cclxuICAgICAgZWxzZSBpZiAoIXguZCkgeSA9IG5ldyBDdG9yKHkuZCB8fCB4LnMgPT09IHkucyA/IHggOiBOYU4pO1xyXG5cclxuICAgICAgcmV0dXJuIHk7XHJcbiAgICB9XHJcblxyXG4gICAgIC8vIElmIHNpZ25zIGRpZmZlci4uLlxyXG4gICAgaWYgKHgucyAhPSB5LnMpIHtcclxuICAgICAgeS5zID0gLXkucztcclxuICAgICAgcmV0dXJuIHgubWludXMoeSk7XHJcbiAgICB9XHJcblxyXG4gICAgeGQgPSB4LmQ7XHJcbiAgICB5ZCA9IHkuZDtcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gICAgLy8gSWYgZWl0aGVyIGlzIHplcm8uLi5cclxuICAgIGlmICgheGRbMF0gfHwgIXlkWzBdKSB7XHJcblxyXG4gICAgICAvLyBSZXR1cm4geCBpZiB5IGlzIHplcm8uXHJcbiAgICAgIC8vIFJldHVybiB5IGlmIHkgaXMgbm9uLXplcm8uXHJcbiAgICAgIGlmICgheWRbMF0pIHkgPSBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHggYW5kIHkgYXJlIGZpbml0ZSwgbm9uLXplcm8gbnVtYmVycyB3aXRoIHRoZSBzYW1lIHNpZ24uXHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGJhc2UgMWU3IGV4cG9uZW50cy5cclxuICAgIGsgPSBtYXRoZmxvb3IoeC5lIC8gTE9HX0JBU0UpO1xyXG4gICAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gICAgeGQgPSB4ZC5zbGljZSgpO1xyXG4gICAgaSA9IGsgLSBlO1xyXG5cclxuICAgIC8vIElmIGJhc2UgMWU3IGV4cG9uZW50cyBkaWZmZXIuLi5cclxuICAgIGlmIChpKSB7XHJcblxyXG4gICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICBkID0geGQ7XHJcbiAgICAgICAgaSA9IC1pO1xyXG4gICAgICAgIGxlbiA9IHlkLmxlbmd0aDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkID0geWQ7XHJcbiAgICAgICAgZSA9IGs7XHJcbiAgICAgICAgbGVuID0geGQubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBMaW1pdCBudW1iZXIgb2YgemVyb3MgcHJlcGVuZGVkIHRvIG1heChjZWlsKHByIC8gTE9HX0JBU0UpLCBsZW4pICsgMS5cclxuICAgICAgayA9IE1hdGguY2VpbChwciAvIExPR19CQVNFKTtcclxuICAgICAgbGVuID0gayA+IGxlbiA/IGsgKyAxIDogbGVuICsgMTtcclxuXHJcbiAgICAgIGlmIChpID4gbGVuKSB7XHJcbiAgICAgICAgaSA9IGxlbjtcclxuICAgICAgICBkLmxlbmd0aCA9IDE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXBlbmQgemVyb3MgdG8gZXF1YWxpc2UgZXhwb25lbnRzLiBOb3RlOiBGYXN0ZXIgdG8gdXNlIHJldmVyc2UgdGhlbiBkbyB1bnNoaWZ0cy5cclxuICAgICAgZC5yZXZlcnNlKCk7XHJcbiAgICAgIGZvciAoOyBpLS07KSBkLnB1c2goMCk7XHJcbiAgICAgIGQucmV2ZXJzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxlbiA9IHhkLmxlbmd0aDtcclxuICAgIGkgPSB5ZC5sZW5ndGg7XHJcblxyXG4gICAgLy8gSWYgeWQgaXMgbG9uZ2VyIHRoYW4geGQsIHN3YXAgeGQgYW5kIHlkIHNvIHhkIHBvaW50cyB0byB0aGUgbG9uZ2VyIGFycmF5LlxyXG4gICAgaWYgKGxlbiAtIGkgPCAwKSB7XHJcbiAgICAgIGkgPSBsZW47XHJcbiAgICAgIGQgPSB5ZDtcclxuICAgICAgeWQgPSB4ZDtcclxuICAgICAgeGQgPSBkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9ubHkgc3RhcnQgYWRkaW5nIGF0IHlkLmxlbmd0aCAtIDEgYXMgdGhlIGZ1cnRoZXIgZGlnaXRzIG9mIHhkIGNhbiBiZSBsZWZ0IGFzIHRoZXkgYXJlLlxyXG4gICAgZm9yIChjYXJyeSA9IDA7IGk7KSB7XHJcbiAgICAgIGNhcnJ5ID0gKHhkWy0taV0gPSB4ZFtpXSArIHlkW2ldICsgY2FycnkpIC8gQkFTRSB8IDA7XHJcbiAgICAgIHhkW2ldICU9IEJBU0U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNhcnJ5KSB7XHJcbiAgICAgIHhkLnVuc2hpZnQoY2FycnkpO1xyXG4gICAgICArK2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgLy8gTm8gbmVlZCB0byBjaGVjayBmb3IgemVybywgYXMgK3ggKyAreSAhPSAwICYmIC14ICsgLXkgIT0gMFxyXG4gICAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7IHhkWy0tbGVuXSA9PSAwOykgeGQucG9wKCk7XHJcblxyXG4gICAgeS5kID0geGQ7XHJcbiAgICB5LmUgPSBnZXRCYXNlMTBFeHBvbmVudCh4ZCwgZSk7XHJcblxyXG4gICAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBbel0ge2Jvb2xlYW58bnVtYmVyfSBXaGV0aGVyIHRvIGNvdW50IGludGVnZXItcGFydCB0cmFpbGluZyB6ZXJvczogdHJ1ZSwgZmFsc2UsIDEgb3IgMC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAucHJlY2lzaW9uID0gUC5zZCA9IGZ1bmN0aW9uICh6KSB7XHJcbiAgICB2YXIgayxcclxuICAgICAgeCA9IHRoaXM7XHJcblxyXG4gICAgaWYgKHogIT09IHZvaWQgMCAmJiB6ICE9PSAhIXogJiYgeiAhPT0gMSAmJiB6ICE9PSAwKSB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyB6KTtcclxuXHJcbiAgICBpZiAoeC5kKSB7XHJcbiAgICAgIGsgPSBnZXRQcmVjaXNpb24oeC5kKTtcclxuICAgICAgaWYgKHogJiYgeC5lICsgMSA+IGspIGsgPSB4LmUgKyAxO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgayA9IE5hTjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaztcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSB3aG9sZSBudW1iZXIgdXNpbmdcclxuICAgKiByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnJvdW5kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHguZSArIDEsIEN0b3Iucm91bmRpbmcpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzaW5lIG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFstMSwgMV1cclxuICAgKlxyXG4gICAqIHNpbih4KSA9IHggLSB4XjMvMyEgKyB4XjUvNSEgLSAuLi5cclxuICAgKlxyXG4gICAqIHNpbigwKSAgICAgICAgID0gMFxyXG4gICAqIHNpbigtMCkgICAgICAgID0gLTBcclxuICAgKiBzaW4oSW5maW5pdHkpICA9IE5hTlxyXG4gICAqIHNpbigtSW5maW5pdHkpID0gTmFOXHJcbiAgICogc2luKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuc2luZSA9IFAuc2luID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByLCBybSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICAgIGlmICh4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyBMT0dfQkFTRTtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICAgIHggPSBzaW5lKEN0b3IsIHRvTGVzc1RoYW5IYWxmUGkoQ3RvciwgeCkpO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID4gMiA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGlzIERlY2ltYWwsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogIHNxcnQoLW4pID0gIE5cclxuICAgKiAgc3FydChOKSAgPSAgTlxyXG4gICAqICBzcXJ0KC1JKSA9ICBOXHJcbiAgICogIHNxcnQoSSkgID0gIElcclxuICAgKiAgc3FydCgwKSAgPSAgMFxyXG4gICAqICBzcXJ0KC0wKSA9IC0wXHJcbiAgICpcclxuICAgKi9cclxuICBQLnNxdWFyZVJvb3QgPSBQLnNxcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgbSwgbiwgc2QsIHIsIHJlcCwgdCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIGQgPSB4LmQsXHJcbiAgICAgIGUgPSB4LmUsXHJcbiAgICAgIHMgPSB4LnMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIC8vIE5lZ2F0aXZlL05hTi9JbmZpbml0eS96ZXJvP1xyXG4gICAgaWYgKHMgIT09IDEgfHwgIWQgfHwgIWRbMF0pIHtcclxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCFzIHx8IHMgPCAwICYmICghZCB8fCBkWzBdKSA/IE5hTiA6IGQgPyB4IDogMSAvIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICAgIHMgPSBNYXRoLnNxcnQoK3gpO1xyXG5cclxuICAgIC8vIE1hdGguc3FydCB1bmRlcmZsb3cvb3ZlcmZsb3c/XHJcbiAgICAvLyBQYXNzIHggdG8gTWF0aC5zcXJ0IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSBleHBvbmVudCBvZiB0aGUgcmVzdWx0LlxyXG4gICAgaWYgKHMgPT0gMCB8fCBzID09IDEgLyAwKSB7XHJcbiAgICAgIG4gPSBkaWdpdHNUb1N0cmluZyhkKTtcclxuXHJcbiAgICAgIGlmICgobi5sZW5ndGggKyBlKSAlIDIgPT0gMCkgbiArPSAnMCc7XHJcbiAgICAgIHMgPSBNYXRoLnNxcnQobik7XHJcbiAgICAgIGUgPSBtYXRoZmxvb3IoKGUgKyAxKSAvIDIpIC0gKGUgPCAwIHx8IGUgJSAyKTtcclxuXHJcbiAgICAgIGlmIChzID09IDEgLyAwKSB7XHJcbiAgICAgICAgbiA9ICc1ZScgKyBlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcclxuICAgICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgciA9IG5ldyBDdG9yKG4pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgciA9IG5ldyBDdG9yKHMudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2QgPSAoZSA9IEN0b3IucHJlY2lzaW9uKSArIDM7XHJcblxyXG4gICAgLy8gTmV3dG9uLVJhcGhzb24gaXRlcmF0aW9uLlxyXG4gICAgZm9yICg7Oykge1xyXG4gICAgICB0ID0gcjtcclxuICAgICAgciA9IHQucGx1cyhkaXZpZGUoeCwgdCwgc2QgKyAyLCAxKSkudGltZXMoMC41KTtcclxuXHJcbiAgICAgIC8vIFRPRE8/IFJlcGxhY2Ugd2l0aCBmb3ItbG9vcCBhbmQgY2hlY2tSb3VuZGluZ0RpZ2l0cy5cclxuICAgICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgc2QpID09PSAobiA9IGRpZ2l0c1RvU3RyaW5nKHIuZCkpLnNsaWNlKDAsIHNkKSkge1xyXG4gICAgICAgIG4gPSBuLnNsaWNlKHNkIC0gMywgc2QgKyAxKTtcclxuXHJcbiAgICAgICAgLy8gVGhlIDR0aCByb3VuZGluZyBkaWdpdCBtYXkgYmUgaW4gZXJyb3IgYnkgLTEgc28gaWYgdGhlIDQgcm91bmRpbmcgZGlnaXRzIGFyZSA5OTk5IG9yXHJcbiAgICAgICAgLy8gNDk5OSwgaS5lLiBhcHByb2FjaGluZyBhIHJvdW5kaW5nIGJvdW5kYXJ5LCBjb250aW51ZSB0aGUgaXRlcmF0aW9uLlxyXG4gICAgICAgIGlmIChuID09ICc5OTk5JyB8fCAhcmVwICYmIG4gPT0gJzQ5OTknKSB7XHJcblxyXG4gICAgICAgICAgLy8gT24gdGhlIGZpcnN0IGl0ZXJhdGlvbiBvbmx5LCBjaGVjayB0byBzZWUgaWYgcm91bmRpbmcgdXAgZ2l2ZXMgdGhlIGV4YWN0IHJlc3VsdCBhcyB0aGVcclxuICAgICAgICAgIC8vIG5pbmVzIG1heSBpbmZpbml0ZWx5IHJlcGVhdC5cclxuICAgICAgICAgIGlmICghcmVwKSB7XHJcbiAgICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0LnRpbWVzKHQpLmVxKHgpKSB7XHJcbiAgICAgICAgICAgICAgciA9IHQ7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzZCArPSA0O1xyXG4gICAgICAgICAgcmVwID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgYW4gZXhhY3QgcmVzdWx0LlxyXG4gICAgICAgICAgLy8gSWYgbm90LCB0aGVuIHRoZXJlIGFyZSBmdXJ0aGVyIGRpZ2l0cyBhbmQgbSB3aWxsIGJlIHRydXRoeS5cclxuICAgICAgICAgIGlmICghK24gfHwgIStuLnNsaWNlKDEpICYmIG4uY2hhckF0KDApID09ICc1Jykge1xyXG5cclxuICAgICAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgICBmaW5hbGlzZShyLCBlICsgMSwgMSk7XHJcbiAgICAgICAgICAgIG0gPSAhci50aW1lcyhyKS5lcSh4KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB0YW5nZW50IG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqXHJcbiAgICogdGFuKDApICAgICAgICAgPSAwXHJcbiAgICogdGFuKC0wKSAgICAgICAgPSAtMFxyXG4gICAqIHRhbihJbmZpbml0eSkgID0gTmFOXHJcbiAgICogdGFuKC1JbmZpbml0eSkgPSBOYU5cclxuICAgKiB0YW4oTmFOKSAgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50YW5nZW50ID0gUC50YW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHIsIHJtLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gICAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDEwO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gICAgeCA9IHguc2luKCk7XHJcbiAgICB4LnMgPSAxO1xyXG4gICAgeCA9IGRpdmlkZSh4LCBuZXcgQ3RvcigxKS5taW51cyh4LnRpbWVzKHgpKS5zcXJ0KCksIHByICsgMTAsIDApO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHF1YWRyYW50ID09IDIgfHwgcXVhZHJhbnQgPT0gNCA/IHgubmVnKCkgOiB4LCBwciwgcm0sIHRydWUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqICBuICogMCA9IDBcclxuICAgKiAgbiAqIE4gPSBOXHJcbiAgICogIG4gKiBJID0gSVxyXG4gICAqICAwICogbiA9IDBcclxuICAgKiAgMCAqIDAgPSAwXHJcbiAgICogIDAgKiBOID0gTlxyXG4gICAqICAwICogSSA9IE5cclxuICAgKiAgTiAqIG4gPSBOXHJcbiAgICogIE4gKiAwID0gTlxyXG4gICAqICBOICogTiA9IE5cclxuICAgKiAgTiAqIEkgPSBOXHJcbiAgICogIEkgKiBuID0gSVxyXG4gICAqICBJICogMCA9IE5cclxuICAgKiAgSSAqIE4gPSBOXHJcbiAgICogIEkgKiBJID0gSVxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhpcyBEZWNpbWFsIHRpbWVzIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRpbWVzID0gUC5tdWwgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIGNhcnJ5LCBlLCBpLCBrLCByLCByTCwgdCwgeGRMLCB5ZEwsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgeGQgPSB4LmQsXHJcbiAgICAgIHlkID0gKHkgPSBuZXcgQ3Rvcih5KSkuZDtcclxuXHJcbiAgICB5LnMgKj0geC5zO1xyXG5cclxuICAgICAvLyBJZiBlaXRoZXIgaXMgTmFOLCDCsUluZmluaXR5IG9yIMKxMC4uLlxyXG4gICAgaWYgKCF4ZCB8fCAheGRbMF0gfHwgIXlkIHx8ICF5ZFswXSkge1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCF5LnMgfHwgeGQgJiYgIXhkWzBdICYmICF5ZCB8fCB5ZCAmJiAheWRbMF0gJiYgIXhkXHJcblxyXG4gICAgICAgIC8vIFJldHVybiBOYU4gaWYgZWl0aGVyIGlzIE5hTi5cclxuICAgICAgICAvLyBSZXR1cm4gTmFOIGlmIHggaXMgwrEwIGFuZCB5IGlzIMKxSW5maW5pdHksIG9yIHkgaXMgwrEwIGFuZCB4IGlzIMKxSW5maW5pdHkuXHJcbiAgICAgICAgPyBOYU5cclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIMKxSW5maW5pdHkgaWYgZWl0aGVyIGlzIMKxSW5maW5pdHkuXHJcbiAgICAgICAgLy8gUmV0dXJuIMKxMCBpZiBlaXRoZXIgaXMgwrEwLlxyXG4gICAgICAgIDogIXhkIHx8ICF5ZCA/IHkucyAvIDAgOiB5LnMgKiAwKTtcclxuICAgIH1cclxuXHJcbiAgICBlID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKSArIG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcbiAgICB4ZEwgPSB4ZC5sZW5ndGg7XHJcbiAgICB5ZEwgPSB5ZC5sZW5ndGg7XHJcblxyXG4gICAgLy8gRW5zdXJlIHhkIHBvaW50cyB0byB0aGUgbG9uZ2VyIGFycmF5LlxyXG4gICAgaWYgKHhkTCA8IHlkTCkge1xyXG4gICAgICByID0geGQ7XHJcbiAgICAgIHhkID0geWQ7XHJcbiAgICAgIHlkID0gcjtcclxuICAgICAgckwgPSB4ZEw7XHJcbiAgICAgIHhkTCA9IHlkTDtcclxuICAgICAgeWRMID0gckw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW5pdGlhbGlzZSB0aGUgcmVzdWx0IGFycmF5IHdpdGggemVyb3MuXHJcbiAgICByID0gW107XHJcbiAgICByTCA9IHhkTCArIHlkTDtcclxuICAgIGZvciAoaSA9IHJMOyBpLS07KSByLnB1c2goMCk7XHJcblxyXG4gICAgLy8gTXVsdGlwbHkhXHJcbiAgICBmb3IgKGkgPSB5ZEw7IC0taSA+PSAwOykge1xyXG4gICAgICBjYXJyeSA9IDA7XHJcbiAgICAgIGZvciAoayA9IHhkTCArIGk7IGsgPiBpOykge1xyXG4gICAgICAgIHQgPSByW2tdICsgeWRbaV0gKiB4ZFtrIC0gaSAtIDFdICsgY2Fycnk7XHJcbiAgICAgICAgcltrLS1dID0gdCAlIEJBU0UgfCAwO1xyXG4gICAgICAgIGNhcnJ5ID0gdCAvIEJBU0UgfCAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByW2tdID0gKHJba10gKyBjYXJyeSkgJSBCQVNFIHwgMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKDsgIXJbLS1yTF07KSByLnBvcCgpO1xyXG5cclxuICAgIGlmIChjYXJyeSkgKytlO1xyXG4gICAgZWxzZSByLnNoaWZ0KCk7XHJcblxyXG4gICAgeS5kID0gcjtcclxuICAgIHkuZSA9IGdldEJhc2UxMEV4cG9uZW50KHIsIGUpO1xyXG5cclxuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIEN0b3IucHJlY2lzaW9uLCBDdG9yLnJvdW5kaW5nKSA6IHk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGJhc2UgMiwgcm91bmQgdG8gYHNkYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAuXHJcbiAgICpcclxuICAgKiBJZiB0aGUgb3B0aW9uYWwgYHNkYCBhcmd1bWVudCBpcyBwcmVzZW50IHRoZW4gcmV0dXJuIGJpbmFyeSBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgKlxyXG4gICAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9CaW5hcnkgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmdCaW5hcnkodGhpcywgMiwgc2QsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSBtYXhpbXVtIG9mIGBkcGBcclxuICAgKiBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAgb3IgYHJvdW5kaW5nYCBpZiBgcm1gIGlzIG9taXR0ZWQuXHJcbiAgICpcclxuICAgKiBJZiBgZHBgIGlzIG9taXR0ZWQsIHJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9EZWNpbWFsUGxhY2VzID0gUC50b0RQID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICB4ID0gbmV3IEN0b3IoeCk7XHJcbiAgICBpZiAoZHAgPT09IHZvaWQgMCkgcmV0dXJuIHg7XHJcblxyXG4gICAgY2hlY2tJbnQzMihkcCwgMCwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHgsIGRwICsgeC5lICsgMSwgcm0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBleHBvbmVudGlhbCBub3RhdGlvbiByb3VuZGVkIHRvXHJcbiAgICogYGRwYCBmaXhlZCBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9FeHBvbmVudGlhbCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICAgIHZhciBzdHIsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoZHAgPT09IHZvaWQgMCkge1xyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuXHJcbiAgICAgIHggPSBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgZHAgKyAxLCBybSk7XHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHRydWUsIGRwICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHguaXNOZWcoKSAmJiAheC5pc1plcm8oKSA/ICctJyArIHN0ciA6IHN0cjtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gbm9ybWFsIChmaXhlZC1wb2ludCkgbm90YXRpb24gdG9cclxuICAgKiBgZHBgIGZpeGVkIGRlY2ltYWwgcGxhY2VzIGFuZCByb3VuZGVkIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYCBvciBgcm91bmRpbmdgIGlmIGBybWAgaXNcclxuICAgKiBvbWl0dGVkLlxyXG4gICAqXHJcbiAgICogQXMgd2l0aCBKYXZhU2NyaXB0IG51bWJlcnMsICgtMCkudG9GaXhlZCgwKSBpcyAnMCcsIGJ1dCBlLmcuICgtMC4wMDAwMSkudG9GaXhlZCgwKSBpcyAnLTAnLlxyXG4gICAqXHJcbiAgICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKiAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgKC0wLjEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICAgKiAoLTApLnRvRml4ZWQoMSkgaXMgJzAuMCcsIGJ1dCAoLTAuMDEpLnRvRml4ZWQoMSkgaXMgJy0wLjAnLlxyXG4gICAqICgtMCkudG9GaXhlZCgzKSBpcyAnMC4wMDAnLlxyXG4gICAqICgtMC41KS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvRml4ZWQgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgICB2YXIgc3RyLCB5LFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKGRwID09PSB2b2lkIDApIHtcclxuICAgICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGVja0ludDMyKGRwLCAwLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgICB5ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIGRwICsgeC5lICsgMSwgcm0pO1xyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh5LCBmYWxzZSwgZHAgKyB5LmUgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUbyBkZXRlcm1pbmUgd2hldGhlciB0byBhZGQgdGhlIG1pbnVzIHNpZ24gbG9vayBhdCB0aGUgdmFsdWUgYmVmb3JlIGl0IHdhcyByb3VuZGVkLFxyXG4gICAgLy8gaS5lLiBsb29rIGF0IGB4YCByYXRoZXIgdGhhbiBgeWAuXHJcbiAgICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhbiBhcnJheSByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBhcyBhIHNpbXBsZSBmcmFjdGlvbiB3aXRoIGFuIGludGVnZXJcclxuICAgKiBudW1lcmF0b3IgYW5kIGFuIGludGVnZXIgZGVub21pbmF0b3IuXHJcbiAgICpcclxuICAgKiBUaGUgZGVub21pbmF0b3Igd2lsbCBiZSBhIHBvc2l0aXZlIG5vbi16ZXJvIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgc3BlY2lmaWVkIG1heGltdW1cclxuICAgKiBkZW5vbWluYXRvci4gSWYgYSBtYXhpbXVtIGRlbm9taW5hdG9yIGlzIG5vdCBzcGVjaWZpZWQsIHRoZSBkZW5vbWluYXRvciB3aWxsIGJlIHRoZSBsb3dlc3RcclxuICAgKiB2YWx1ZSBuZWNlc3NhcnkgdG8gcmVwcmVzZW50IHRoZSBudW1iZXIgZXhhY3RseS5cclxuICAgKlxyXG4gICAqIFttYXhEXSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBNYXhpbXVtIGRlbm9taW5hdG9yLiBJbnRlZ2VyID49IDEgYW5kIDwgSW5maW5pdHkuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvRnJhY3Rpb24gPSBmdW5jdGlvbiAobWF4RCkge1xyXG4gICAgdmFyIGQsIGQwLCBkMSwgZDIsIGUsIGssIG4sIG4wLCBuMSwgcHIsIHEsIHIsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICB4ZCA9IHguZCxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKCF4ZCkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIG4xID0gZDAgPSBuZXcgQ3RvcigxKTtcclxuICAgIGQxID0gbjAgPSBuZXcgQ3RvcigwKTtcclxuXHJcbiAgICBkID0gbmV3IEN0b3IoZDEpO1xyXG4gICAgZSA9IGQuZSA9IGdldFByZWNpc2lvbih4ZCkgLSB4LmUgLSAxO1xyXG4gICAgayA9IGUgJSBMT0dfQkFTRTtcclxuICAgIGQuZFswXSA9IG1hdGhwb3coMTAsIGsgPCAwID8gTE9HX0JBU0UgKyBrIDogayk7XHJcblxyXG4gICAgaWYgKG1heEQgPT0gbnVsbCkge1xyXG5cclxuICAgICAgLy8gZCBpcyAxMCoqZSwgdGhlIG1pbmltdW0gbWF4LWRlbm9taW5hdG9yIG5lZWRlZC5cclxuICAgICAgbWF4RCA9IGUgPiAwID8gZCA6IG4xO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbiA9IG5ldyBDdG9yKG1heEQpO1xyXG4gICAgICBpZiAoIW4uaXNJbnQoKSB8fCBuLmx0KG4xKSkgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgbik7XHJcbiAgICAgIG1heEQgPSBuLmd0KGQpID8gKGUgPiAwID8gZCA6IG4xKSA6IG47XHJcbiAgICB9XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgIG4gPSBuZXcgQ3RvcihkaWdpdHNUb1N0cmluZyh4ZCkpO1xyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIEN0b3IucHJlY2lzaW9uID0gZSA9IHhkLmxlbmd0aCAqIExPR19CQVNFICogMjtcclxuXHJcbiAgICBmb3IgKDs7KSAge1xyXG4gICAgICBxID0gZGl2aWRlKG4sIGQsIDAsIDEsIDEpO1xyXG4gICAgICBkMiA9IGQwLnBsdXMocS50aW1lcyhkMSkpO1xyXG4gICAgICBpZiAoZDIuY21wKG1heEQpID09IDEpIGJyZWFrO1xyXG4gICAgICBkMCA9IGQxO1xyXG4gICAgICBkMSA9IGQyO1xyXG4gICAgICBkMiA9IG4xO1xyXG4gICAgICBuMSA9IG4wLnBsdXMocS50aW1lcyhkMikpO1xyXG4gICAgICBuMCA9IGQyO1xyXG4gICAgICBkMiA9IGQ7XHJcbiAgICAgIGQgPSBuLm1pbnVzKHEudGltZXMoZDIpKTtcclxuICAgICAgbiA9IGQyO1xyXG4gICAgfVxyXG5cclxuICAgIGQyID0gZGl2aWRlKG1heEQubWludXMoZDApLCBkMSwgMCwgMSwgMSk7XHJcbiAgICBuMCA9IG4wLnBsdXMoZDIudGltZXMobjEpKTtcclxuICAgIGQwID0gZDAucGx1cyhkMi50aW1lcyhkMSkpO1xyXG4gICAgbjAucyA9IG4xLnMgPSB4LnM7XHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lIHdoaWNoIGZyYWN0aW9uIGlzIGNsb3NlciB0byB4LCBuMC9kMCBvciBuMS9kMT9cclxuICAgIHIgPSBkaXZpZGUobjEsIGQxLCBlLCAxKS5taW51cyh4KS5hYnMoKS5jbXAoZGl2aWRlKG4wLCBkMCwgZSwgMSkubWludXMoeCkuYWJzKCkpIDwgMVxyXG4gICAgICAgID8gW24xLCBkMV0gOiBbbjAsIGQwXTtcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiByO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDE2LCByb3VuZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICAgKlxyXG4gICAqIElmIHRoZSBvcHRpb25hbCBgc2RgIGFyZ3VtZW50IGlzIHByZXNlbnQgdGhlbiByZXR1cm4gYmluYXJ5IGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAqXHJcbiAgICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDEgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b0hleGFkZWNpbWFsID0gUC50b0hleCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCAxNiwgc2QsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm5zIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5lYXJlc3QgbXVsdGlwbGUgb2YgYHlgIGluIHRoZSBkaXJlY3Rpb24gb2Ygcm91bmRpbmdcclxuICAgKiBtb2RlIGBybWAsIG9yIGBEZWNpbWFsLnJvdW5kaW5nYCBpZiBgcm1gIGlzIG9taXR0ZWQsIHRvIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBUaGUgcmV0dXJuIHZhbHVlIHdpbGwgYWx3YXlzIGhhdmUgdGhlIHNhbWUgc2lnbiBhcyB0aGlzIERlY2ltYWwsIHVubGVzcyBlaXRoZXIgdGhpcyBEZWNpbWFsXHJcbiAgICogb3IgYHlgIGlzIE5hTiwgaW4gd2hpY2ggY2FzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgYWxzbyBiZSBOYU4uXHJcbiAgICpcclxuICAgKiBUaGUgcmV0dXJuIHZhbHVlIGlzIG5vdCBhZmZlY3RlZCBieSB0aGUgdmFsdWUgb2YgYHByZWNpc2lvbmAuXHJcbiAgICpcclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBtYWduaXR1ZGUgdG8gcm91bmQgdG8gYSBtdWx0aXBsZSBvZi5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKiAndG9OZWFyZXN0KCkgcm91bmRpbmcgbW9kZSBub3QgYW4gaW50ZWdlcjoge3JtfSdcclxuICAgKiAndG9OZWFyZXN0KCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvTmVhcmVzdCA9IGZ1bmN0aW9uICh5LCBybSkge1xyXG4gICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICB4ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgaWYgKHkgPT0gbnVsbCkge1xyXG5cclxuICAgICAgLy8gSWYgeCBpcyBub3QgZmluaXRlLCByZXR1cm4geC5cclxuICAgICAgaWYgKCF4LmQpIHJldHVybiB4O1xyXG5cclxuICAgICAgeSA9IG5ldyBDdG9yKDEpO1xyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB5ID0gbmV3IEN0b3IoeSk7XHJcbiAgICAgIGlmIChybSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJZiB4IGlzIG5vdCBmaW5pdGUsIHJldHVybiB4IGlmIHkgaXMgbm90IE5hTiwgZWxzZSBOYU4uXHJcbiAgICAgIGlmICgheC5kKSByZXR1cm4geS5zID8geCA6IHk7XHJcblxyXG4gICAgICAvLyBJZiB5IGlzIG5vdCBmaW5pdGUsIHJldHVybiBJbmZpbml0eSB3aXRoIHRoZSBzaWduIG9mIHggaWYgeSBpcyBJbmZpbml0eSwgZWxzZSBOYU4uXHJcbiAgICAgIGlmICgheS5kKSB7XHJcbiAgICAgICAgaWYgKHkucykgeS5zID0geC5zO1xyXG4gICAgICAgIHJldHVybiB5O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgeSBpcyBub3QgemVybywgY2FsY3VsYXRlIHRoZSBuZWFyZXN0IG11bHRpcGxlIG9mIHkgdG8geC5cclxuICAgIGlmICh5LmRbMF0pIHtcclxuICAgICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgICAgeCA9IGRpdmlkZSh4LCB5LCAwLCBybSwgMSkudGltZXMoeSk7XHJcbiAgICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgICAgZmluYWxpc2UoeCk7XHJcblxyXG4gICAgLy8gSWYgeSBpcyB6ZXJvLCByZXR1cm4gemVybyB3aXRoIHRoZSBzaWduIG9mIHguXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB5LnMgPSB4LnM7XHJcbiAgICAgIHggPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGNvbnZlcnRlZCB0byBhIG51bWJlciBwcmltaXRpdmUuXHJcbiAgICogWmVybyBrZWVwcyBpdHMgc2lnbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9OdW1iZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gK3RoaXM7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIGJhc2UgOCwgcm91bmQgdG8gYHNkYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAuXHJcbiAgICpcclxuICAgKiBJZiB0aGUgb3B0aW9uYWwgYHNkYCBhcmd1bWVudCBpcyBwcmVzZW50IHRoZW4gcmV0dXJuIGJpbmFyeSBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgKlxyXG4gICAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9PY3RhbCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgIHJldHVybiB0b1N0cmluZ0JpbmFyeSh0aGlzLCA4LCBzZCwgcm0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcmFpc2VkIHRvIHRoZSBwb3dlciBgeWAsIHJvdW5kZWRcclxuICAgKiB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogRUNNQVNjcmlwdCBjb21wbGlhbnQuXHJcbiAgICpcclxuICAgKiAgIHBvdyh4LCBOYU4pICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBOYU5cclxuICAgKiAgIHBvdyh4LCDCsTApICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gMVxyXG5cclxuICAgKiAgIHBvdyhOYU4sIG5vbi16ZXJvKSAgICAgICAgICAgICAgICAgICAgPSBOYU5cclxuICAgKiAgIHBvdyhhYnMoeCkgPiAxLCArSW5maW5pdHkpICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICAgKiAgIHBvdyhhYnMoeCkgPiAxLCAtSW5maW5pdHkpICAgICAgICAgICAgPSArMFxyXG4gICAqICAgcG93KGFicyh4KSA9PSAxLCDCsUluZmluaXR5KSAgICAgICAgICAgPSBOYU5cclxuICAgKiAgIHBvdyhhYnMoeCkgPCAxLCArSW5maW5pdHkpICAgICAgICAgICAgPSArMFxyXG4gICAqICAgcG93KGFicyh4KSA8IDEsIC1JbmZpbml0eSkgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gICAqICAgcG93KCtJbmZpbml0eSwgeSA+IDApICAgICAgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gICAqICAgcG93KCtJbmZpbml0eSwgeSA8IDApICAgICAgICAgICAgICAgICA9ICswXHJcbiAgICogICBwb3coLUluZmluaXR5LCBvZGQgaW50ZWdlciA+IDApICAgICAgID0gLUluZmluaXR5XHJcbiAgICogICBwb3coLUluZmluaXR5LCBldmVuIGludGVnZXIgPiAwKSAgICAgID0gK0luZmluaXR5XHJcbiAgICogICBwb3coLUluZmluaXR5LCBvZGQgaW50ZWdlciA8IDApICAgICAgID0gLTBcclxuICAgKiAgIHBvdygtSW5maW5pdHksIGV2ZW4gaW50ZWdlciA8IDApICAgICAgPSArMFxyXG4gICAqICAgcG93KCswLCB5ID4gMCkgICAgICAgICAgICAgICAgICAgICAgICA9ICswXHJcbiAgICogICBwb3coKzAsIHkgPCAwKSAgICAgICAgICAgICAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAgICogICBwb3coLTAsIG9kZCBpbnRlZ2VyID4gMCkgICAgICAgICAgICAgID0gLTBcclxuICAgKiAgIHBvdygtMCwgZXZlbiBpbnRlZ2VyID4gMCkgICAgICAgICAgICAgPSArMFxyXG4gICAqICAgcG93KC0wLCBvZGQgaW50ZWdlciA8IDApICAgICAgICAgICAgICA9IC1JbmZpbml0eVxyXG4gICAqICAgcG93KC0wLCBldmVuIGludGVnZXIgPCAwKSAgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gICAqICAgcG93KGZpbml0ZSB4IDwgMCwgZmluaXRlIG5vbi1pbnRlZ2VyKSA9IE5hTlxyXG4gICAqXHJcbiAgICogRm9yIG5vbi1pbnRlZ2VyIG9yIHZlcnkgbGFyZ2UgZXhwb25lbnRzIHBvdyh4LCB5KSBpcyBjYWxjdWxhdGVkIHVzaW5nXHJcbiAgICpcclxuICAgKiAgIHheeSA9IGV4cCh5KmxuKHgpKVxyXG4gICAqXHJcbiAgICogQXNzdW1pbmcgdGhlIGZpcnN0IDE1IHJvdW5kaW5nIGRpZ2l0cyBhcmUgZWFjaCBlcXVhbGx5IGxpa2VseSB0byBiZSBhbnkgZGlnaXQgMC05LCB0aGVcclxuICAgKiBwcm9iYWJpbGl0eSBvZiBhbiBpbmNvcnJlY3RseSByb3VuZGVkIHJlc3VsdFxyXG4gICAqIFAoWzQ5XTl7MTR9IHwgWzUwXTB7MTR9KSA9IDIgKiAwLjIgKiAxMF4tMTQgPSA0ZS0xNSA9IDEvMi41ZSsxNFxyXG4gICAqIGkuZS4gMSBpbiAyNTAsMDAwLDAwMCwwMDAsMDAwXHJcbiAgICpcclxuICAgKiBJZiBhIHJlc3VsdCBpcyBpbmNvcnJlY3RseSByb3VuZGVkIHRoZSBtYXhpbXVtIGVycm9yIHdpbGwgYmUgMSB1bHAgKHVuaXQgaW4gbGFzdCBwbGFjZSkuXHJcbiAgICpcclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBwb3dlciB0byB3aGljaCB0byByYWlzZSB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvUG93ZXIgPSBQLnBvdyA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICB2YXIgZSwgaywgcHIsIHIsIHJtLCBzLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHluID0gKyh5ID0gbmV3IEN0b3IoeSkpO1xyXG5cclxuICAgIC8vIEVpdGhlciDCsUluZmluaXR5LCBOYU4gb3IgwrEwP1xyXG4gICAgaWYgKCF4LmQgfHwgIXkuZCB8fCAheC5kWzBdIHx8ICF5LmRbMF0pIHJldHVybiBuZXcgQ3RvcihtYXRocG93KCt4LCB5bikpO1xyXG5cclxuICAgIHggPSBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBpZiAoeC5lcSgxKSkgcmV0dXJuIHg7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuXHJcbiAgICBpZiAoeS5lcSgxKSkgcmV0dXJuIGZpbmFsaXNlKHgsIHByLCBybSk7XHJcblxyXG4gICAgLy8geSBleHBvbmVudFxyXG4gICAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gICAgLy8gSWYgeSBpcyBhIHNtYWxsIGludGVnZXIgdXNlIHRoZSAnZXhwb25lbnRpYXRpb24gYnkgc3F1YXJpbmcnIGFsZ29yaXRobS5cclxuICAgIGlmIChlID49IHkuZC5sZW5ndGggLSAxICYmIChrID0geW4gPCAwID8gLXluIDogeW4pIDw9IE1BWF9TQUZFX0lOVEVHRVIpIHtcclxuICAgICAgciA9IGludFBvdyhDdG9yLCB4LCBrLCBwcik7XHJcbiAgICAgIHJldHVybiB5LnMgPCAwID8gbmV3IEN0b3IoMSkuZGl2KHIpIDogZmluYWxpc2UociwgcHIsIHJtKTtcclxuICAgIH1cclxuXHJcbiAgICBzID0geC5zO1xyXG5cclxuICAgIC8vIGlmIHggaXMgbmVnYXRpdmVcclxuICAgIGlmIChzIDwgMCkge1xyXG5cclxuICAgICAgLy8gaWYgeSBpcyBub3QgYW4gaW50ZWdlclxyXG4gICAgICBpZiAoZSA8IHkuZC5sZW5ndGggLSAxKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAgIC8vIFJlc3VsdCBpcyBwb3NpdGl2ZSBpZiB4IGlzIG5lZ2F0aXZlIGFuZCB0aGUgbGFzdCBkaWdpdCBvZiBpbnRlZ2VyIHkgaXMgZXZlbi5cclxuICAgICAgaWYgKCh5LmRbZV0gJiAxKSA9PSAwKSBzID0gMTtcclxuXHJcbiAgICAgIC8vIGlmIHguZXEoLTEpXHJcbiAgICAgIGlmICh4LmUgPT0gMCAmJiB4LmRbMF0gPT0gMSAmJiB4LmQubGVuZ3RoID09IDEpIHtcclxuICAgICAgICB4LnMgPSBzO1xyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRXN0aW1hdGUgcmVzdWx0IGV4cG9uZW50LlxyXG4gICAgLy8geF55ID0gMTBeZSwgIHdoZXJlIGUgPSB5ICogbG9nMTAoeClcclxuICAgIC8vIGxvZzEwKHgpID0gbG9nMTAoeF9zaWduaWZpY2FuZCkgKyB4X2V4cG9uZW50XHJcbiAgICAvLyBsb2cxMCh4X3NpZ25pZmljYW5kKSA9IGxuKHhfc2lnbmlmaWNhbmQpIC8gbG4oMTApXHJcbiAgICBrID0gbWF0aHBvdygreCwgeW4pO1xyXG4gICAgZSA9IGsgPT0gMCB8fCAhaXNGaW5pdGUoaylcclxuICAgICAgPyBtYXRoZmxvb3IoeW4gKiAoTWF0aC5sb2coJzAuJyArIGRpZ2l0c1RvU3RyaW5nKHguZCkpIC8gTWF0aC5MTjEwICsgeC5lICsgMSkpXHJcbiAgICAgIDogbmV3IEN0b3IoayArICcnKS5lO1xyXG5cclxuICAgIC8vIEV4cG9uZW50IGVzdGltYXRlIG1heSBiZSBpbmNvcnJlY3QgZS5nLiB4OiAwLjk5OTk5OTk5OTk5OTk5OTk5OSwgeTogMi4yOSwgZTogMCwgci5lOiAtMS5cclxuXHJcbiAgICAvLyBPdmVyZmxvdy91bmRlcmZsb3c/XHJcbiAgICBpZiAoZSA+IEN0b3IubWF4RSArIDEgfHwgZSA8IEN0b3IubWluRSAtIDEpIHJldHVybiBuZXcgQ3RvcihlID4gMCA/IHMgLyAwIDogMCk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgIEN0b3Iucm91bmRpbmcgPSB4LnMgPSAxO1xyXG5cclxuICAgIC8vIEVzdGltYXRlIHRoZSBleHRyYSBndWFyZCBkaWdpdHMgbmVlZGVkIHRvIGVuc3VyZSBmaXZlIGNvcnJlY3Qgcm91bmRpbmcgZGlnaXRzIGZyb21cclxuICAgIC8vIG5hdHVyYWxMb2dhcml0aG0oeCkuIEV4YW1wbGUgb2YgZmFpbHVyZSB3aXRob3V0IHRoZXNlIGV4dHJhIGRpZ2l0cyAocHJlY2lzaW9uOiAxMCk6XHJcbiAgICAvLyBuZXcgRGVjaW1hbCgyLjMyNDU2KS5wb3coJzIwODc5ODc0MzY1MzQ1NjYuNDY0MTEnKVxyXG4gICAgLy8gc2hvdWxkIGJlIDEuMTYyMzc3ODIzZSs3NjQ5MTQ5MDUxNzM4MTUsIGJ1dCBpcyAxLjE2MjM1NTgyM2UrNzY0OTE0OTA1MTczODE1XHJcbiAgICBrID0gTWF0aC5taW4oMTIsIChlICsgJycpLmxlbmd0aCk7XHJcblxyXG4gICAgLy8gciA9IHheeSA9IGV4cCh5KmxuKHgpKVxyXG4gICAgciA9IG5hdHVyYWxFeHBvbmVudGlhbCh5LnRpbWVzKG5hdHVyYWxMb2dhcml0aG0oeCwgcHIgKyBrKSksIHByKTtcclxuXHJcbiAgICAvLyByIG1heSBiZSBJbmZpbml0eSwgZS5nLiAoMC45OTk5OTk5OTk5OTk5OTk5KS5wb3coLTFlKzQwKVxyXG4gICAgaWYgKHIuZCkge1xyXG5cclxuICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIHJlcXVpcmVkIHByZWNpc2lvbiBwbHVzIGZpdmUgcm91bmRpbmcgZGlnaXRzLlxyXG4gICAgICByID0gZmluYWxpc2UociwgcHIgKyA1LCAxKTtcclxuXHJcbiAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIFs0OV05OTk5IG9yIFs1MF0wMDAwIGluY3JlYXNlIHRoZSBwcmVjaXNpb24gYnkgMTAgYW5kIHJlY2FsY3VsYXRlXHJcbiAgICAgIC8vIHRoZSByZXN1bHQuXHJcbiAgICAgIGlmIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgcHIsIHJtKSkge1xyXG4gICAgICAgIGUgPSBwciArIDEwO1xyXG5cclxuICAgICAgICAvLyBUcnVuY2F0ZSB0byB0aGUgaW5jcmVhc2VkIHByZWNpc2lvbiBwbHVzIGZpdmUgcm91bmRpbmcgZGlnaXRzLlxyXG4gICAgICAgIHIgPSBmaW5hbGlzZShuYXR1cmFsRXhwb25lbnRpYWwoeS50aW1lcyhuYXR1cmFsTG9nYXJpdGhtKHgsIGUgKyBrKSksIGUpLCBlICsgNSwgMSk7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZvciAxNCBuaW5lcyBmcm9tIHRoZSAybmQgcm91bmRpbmcgZGlnaXQgKHRoZSBmaXJzdCByb3VuZGluZyBkaWdpdCBtYXkgYmUgNCBvciA5KS5cclxuICAgICAgICBpZiAoK2RpZ2l0c1RvU3RyaW5nKHIuZCkuc2xpY2UocHIgKyAxLCBwciArIDE1KSArIDEgPT0gMWUxNCkge1xyXG4gICAgICAgICAgciA9IGZpbmFsaXNlKHIsIHByICsgMSwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgci5zID0gcztcclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UociwgcHIsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBgc2RgIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gICAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIFJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbiBpZiBgc2RgIGlzIGxlc3MgdGhhbiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBuZWNlc3NhcnkgdG8gcmVwcmVzZW50XHJcbiAgICogdGhlIGludGVnZXIgcGFydCBvZiB0aGUgdmFsdWUgaW4gbm9ybWFsIG5vdGF0aW9uLlxyXG4gICAqXHJcbiAgICogW3NkXSB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHMuIEludGVnZXIsIDEgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b1ByZWNpc2lvbiA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgIHZhciBzdHIsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoc2QgPT09IHZvaWQgMCkge1xyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB4LmUgPD0gQ3Rvci50b0V4cE5lZyB8fCB4LmUgPj0gQ3Rvci50b0V4cFBvcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgICB4ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIHNkLCBybSk7XHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHNkIDw9IHguZSB8fCB4LmUgPD0gQ3Rvci50b0V4cE5lZywgc2QpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgbWF4aW11bSBvZiBgc2RgXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYCwgb3IgdG8gYHByZWNpc2lvbmAgYW5kIGByb3VuZGluZ2AgcmVzcGVjdGl2ZWx5IGlmXHJcbiAgICogb21pdHRlZC5cclxuICAgKlxyXG4gICAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICd0b1NEKCkgZGlnaXRzIG91dCBvZiByYW5nZToge3NkfSdcclxuICAgKiAndG9TRCgpIGRpZ2l0cyBub3QgYW4gaW50ZWdlcjoge3NkfSdcclxuICAgKiAndG9TRCgpIHJvdW5kaW5nIG1vZGUgbm90IGFuIGludGVnZXI6IHtybX0nXHJcbiAgICogJ3RvU0QoKSByb3VuZGluZyBtb2RlIG91dCBvZiByYW5nZToge3JtfSdcclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9TaWduaWZpY2FudERpZ2l0cyA9IFAudG9TRCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKHNkID09PSB2b2lkIDApIHtcclxuICAgICAgc2QgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZShuZXcgQ3Rvcih4KSwgc2QsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBSZXR1cm4gZXhwb25lbnRpYWwgbm90YXRpb24gaWYgdGhpcyBEZWNpbWFsIGhhcyBhIHBvc2l0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhblxyXG4gICAqIGB0b0V4cFBvc2AsIG9yIGEgbmVnYXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgbGVzcyB0aGFuIGB0b0V4cE5lZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG5cclxuICAgIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCB0cnVuY2F0ZWQgdG8gYSB3aG9sZSBudW1iZXIuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRydW5jYXRlZCA9IFAudHJ1bmMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIHRoaXMuZSArIDEsIDEpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKiBVbmxpa2UgYHRvU3RyaW5nYCwgbmVnYXRpdmUgemVybyB3aWxsIGluY2x1ZGUgdGhlIG1pbnVzIHNpZ24uXHJcbiAgICpcclxuICAgKi9cclxuICBQLnZhbHVlT2YgPSBQLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHguZSA8PSBDdG9yLnRvRXhwTmVnIHx8IHguZSA+PSBDdG9yLnRvRXhwUG9zKTtcclxuXHJcbiAgICByZXR1cm4geC5pc05lZygpID8gJy0nICsgc3RyIDogc3RyO1xyXG4gIH07XHJcblxyXG5cclxuICAvLyBIZWxwZXIgZnVuY3Rpb25zIGZvciBEZWNpbWFsLnByb3RvdHlwZSAoUCkgYW5kL29yIERlY2ltYWwgbWV0aG9kcywgYW5kIHRoZWlyIGNhbGxlcnMuXHJcblxyXG5cclxuICAvKlxyXG4gICAqICBkaWdpdHNUb1N0cmluZyAgICAgICAgICAgUC5jdWJlUm9vdCwgUC5sb2dhcml0aG0sIFAuc3F1YXJlUm9vdCwgUC50b0ZyYWN0aW9uLCBQLnRvUG93ZXIsXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pdGVUb1N0cmluZywgbmF0dXJhbEV4cG9uZW50aWFsLCBuYXR1cmFsTG9nYXJpdGhtXHJcbiAgICogIGNoZWNrSW50MzIgICAgICAgICAgICAgICBQLnRvRGVjaW1hbFBsYWNlcywgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsIFAudG9OZWFyZXN0LFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b1ByZWNpc2lvbiwgUC50b1NpZ25pZmljYW50RGlnaXRzLCB0b1N0cmluZ0JpbmFyeSwgcmFuZG9tXHJcbiAgICogIGNoZWNrUm91bmRpbmdEaWdpdHMgICAgICBQLmxvZ2FyaXRobSwgUC50b1Bvd2VyLCBuYXR1cmFsRXhwb25lbnRpYWwsIG5hdHVyYWxMb2dhcml0aG1cclxuICAgKiAgY29udmVydEJhc2UgICAgICAgICAgICAgIHRvU3RyaW5nQmluYXJ5LCBwYXJzZU90aGVyXHJcbiAgICogIGNvcyAgICAgICAgICAgICAgICAgICAgICBQLmNvc1xyXG4gICAqICBkaXZpZGUgICAgICAgICAgICAgICAgICAgUC5hdGFuaCwgUC5jdWJlUm9vdCwgUC5kaXZpZGVkQnksIFAuZGl2aWRlZFRvSW50ZWdlckJ5LFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC5sb2dhcml0aG0sIFAubW9kdWxvLCBQLnNxdWFyZVJvb3QsIFAudGFuLCBQLnRhbmgsIFAudG9GcmFjdGlvbixcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9OZWFyZXN0LCB0b1N0cmluZ0JpbmFyeSwgbmF0dXJhbEV4cG9uZW50aWFsLCBuYXR1cmFsTG9nYXJpdGhtLFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdGF5bG9yU2VyaWVzLCBhdGFuMiwgcGFyc2VPdGhlclxyXG4gICAqICBmaW5hbGlzZSAgICAgICAgICAgICAgICAgUC5hYnNvbHV0ZVZhbHVlLCBQLmF0YW4sIFAuYXRhbmgsIFAuY2VpbCwgUC5jb3MsIFAuY29zaCxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAuY3ViZVJvb3QsIFAuZGl2aWRlZFRvSW50ZWdlckJ5LCBQLmZsb29yLCBQLmxvZ2FyaXRobSwgUC5taW51cyxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAubW9kdWxvLCBQLm5lZ2F0ZWQsIFAucGx1cywgUC5yb3VuZCwgUC5zaW4sIFAuc2luaCwgUC5zcXVhcmVSb290LFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50YW4sIFAudGltZXMsIFAudG9EZWNpbWFsUGxhY2VzLCBQLnRvRXhwb25lbnRpYWwsIFAudG9GaXhlZCxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9OZWFyZXN0LCBQLnRvUG93ZXIsIFAudG9QcmVjaXNpb24sIFAudG9TaWduaWZpY2FudERpZ2l0cyxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudHJ1bmNhdGVkLCBkaXZpZGUsIGdldExuMTAsIGdldFBpLCBuYXR1cmFsRXhwb25lbnRpYWwsXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBuYXR1cmFsTG9nYXJpdGhtLCBjZWlsLCBmbG9vciwgcm91bmQsIHRydW5jXHJcbiAgICogIGZpbml0ZVRvU3RyaW5nICAgICAgICAgICBQLnRvRXhwb25lbnRpYWwsIFAudG9GaXhlZCwgUC50b1ByZWNpc2lvbiwgUC50b1N0cmluZywgUC52YWx1ZU9mLFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9TdHJpbmdCaW5hcnlcclxuICAgKiAgZ2V0QmFzZTEwRXhwb25lbnQgICAgICAgIFAubWludXMsIFAucGx1cywgUC50aW1lcywgcGFyc2VPdGhlclxyXG4gICAqICBnZXRMbjEwICAgICAgICAgICAgICAgICAgUC5sb2dhcml0aG0sIG5hdHVyYWxMb2dhcml0aG1cclxuICAgKiAgZ2V0UGkgICAgICAgICAgICAgICAgICAgIFAuYWNvcywgUC5hc2luLCBQLmF0YW4sIHRvTGVzc1RoYW5IYWxmUGksIGF0YW4yXHJcbiAgICogIGdldFByZWNpc2lvbiAgICAgICAgICAgICBQLnByZWNpc2lvbiwgUC50b0ZyYWN0aW9uXHJcbiAgICogIGdldFplcm9TdHJpbmcgICAgICAgICAgICBkaWdpdHNUb1N0cmluZywgZmluaXRlVG9TdHJpbmdcclxuICAgKiAgaW50UG93ICAgICAgICAgICAgICAgICAgIFAudG9Qb3dlciwgcGFyc2VPdGhlclxyXG4gICAqICBpc09kZCAgICAgICAgICAgICAgICAgICAgdG9MZXNzVGhhbkhhbGZQaVxyXG4gICAqICBtYXhPck1pbiAgICAgICAgICAgICAgICAgbWF4LCBtaW5cclxuICAgKiAgbmF0dXJhbEV4cG9uZW50aWFsICAgICAgIFAubmF0dXJhbEV4cG9uZW50aWFsLCBQLnRvUG93ZXJcclxuICAgKiAgbmF0dXJhbExvZ2FyaXRobSAgICAgICAgIFAuYWNvc2gsIFAuYXNpbmgsIFAuYXRhbmgsIFAubG9nYXJpdGhtLCBQLm5hdHVyYWxMb2dhcml0aG0sXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvUG93ZXIsIG5hdHVyYWxFeHBvbmVudGlhbFxyXG4gICAqICBub25GaW5pdGVUb1N0cmluZyAgICAgICAgZmluaXRlVG9TdHJpbmcsIHRvU3RyaW5nQmluYXJ5XHJcbiAgICogIHBhcnNlRGVjaW1hbCAgICAgICAgICAgICBEZWNpbWFsXHJcbiAgICogIHBhcnNlT3RoZXIgICAgICAgICAgICAgICBEZWNpbWFsXHJcbiAgICogIHNpbiAgICAgICAgICAgICAgICAgICAgICBQLnNpblxyXG4gICAqICB0YXlsb3JTZXJpZXMgICAgICAgICAgICAgUC5jb3NoLCBQLnNpbmgsIGNvcywgc2luXHJcbiAgICogIHRvTGVzc1RoYW5IYWxmUGkgICAgICAgICBQLmNvcywgUC5zaW5cclxuICAgKiAgdG9TdHJpbmdCaW5hcnkgICAgICAgICAgIFAudG9CaW5hcnksIFAudG9IZXhhZGVjaW1hbCwgUC50b09jdGFsXHJcbiAgICogIHRydW5jYXRlICAgICAgICAgICAgICAgICBpbnRQb3dcclxuICAgKlxyXG4gICAqICBUaHJvd3M6ICAgICAgICAgICAgICAgICAgUC5sb2dhcml0aG0sIFAucHJlY2lzaW9uLCBQLnRvRnJhY3Rpb24sIGNoZWNrSW50MzIsIGdldExuMTAsIGdldFBpLFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0dXJhbExvZ2FyaXRobSwgY29uZmlnLCBwYXJzZU90aGVyLCByYW5kb20sIERlY2ltYWxcclxuICAgKi9cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGRpZ2l0c1RvU3RyaW5nKGQpIHtcclxuICAgIHZhciBpLCBrLCB3cyxcclxuICAgICAgaW5kZXhPZkxhc3RXb3JkID0gZC5sZW5ndGggLSAxLFxyXG4gICAgICBzdHIgPSAnJyxcclxuICAgICAgdyA9IGRbMF07XHJcblxyXG4gICAgaWYgKGluZGV4T2ZMYXN0V29yZCA+IDApIHtcclxuICAgICAgc3RyICs9IHc7XHJcbiAgICAgIGZvciAoaSA9IDE7IGkgPCBpbmRleE9mTGFzdFdvcmQ7IGkrKykge1xyXG4gICAgICAgIHdzID0gZFtpXSArICcnO1xyXG4gICAgICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcclxuICAgICAgICBpZiAoaykgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XHJcbiAgICAgICAgc3RyICs9IHdzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3ID0gZFtpXTtcclxuICAgICAgd3MgPSB3ICsgJyc7XHJcbiAgICAgIGsgPSBMT0dfQkFTRSAtIHdzLmxlbmd0aDtcclxuICAgICAgaWYgKGspIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgfSBlbHNlIGlmICh3ID09PSAwKSB7XHJcbiAgICAgIHJldHVybiAnMCc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zIG9mIGxhc3Qgdy5cclxuICAgIGZvciAoOyB3ICUgMTAgPT09IDA7KSB3IC89IDEwO1xyXG5cclxuICAgIHJldHVybiBzdHIgKyB3O1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGNoZWNrSW50MzIoaSwgbWluLCBtYXgpIHtcclxuICAgIGlmIChpICE9PSB+fmkgfHwgaSA8IG1pbiB8fCBpID4gbWF4KSB7XHJcbiAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIGkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogQ2hlY2sgNSByb3VuZGluZyBkaWdpdHMgaWYgYHJlcGVhdGluZ2AgaXMgbnVsbCwgNCBvdGhlcndpc2UuXHJcbiAgICogYHJlcGVhdGluZyA9PSBudWxsYCBpZiBjYWxsZXIgaXMgYGxvZ2Agb3IgYHBvd2AsXHJcbiAgICogYHJlcGVhdGluZyAhPSBudWxsYCBpZiBjYWxsZXIgaXMgYG5hdHVyYWxMb2dhcml0aG1gIG9yIGBuYXR1cmFsRXhwb25lbnRpYWxgLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNoZWNrUm91bmRpbmdEaWdpdHMoZCwgaSwgcm0sIHJlcGVhdGluZykge1xyXG4gICAgdmFyIGRpLCBrLCByLCByZDtcclxuXHJcbiAgICAvLyBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgYXJyYXkgZC5cclxuICAgIGZvciAoayA9IGRbMF07IGsgPj0gMTA7IGsgLz0gMTApIC0taTtcclxuXHJcbiAgICAvLyBJcyB0aGUgcm91bmRpbmcgZGlnaXQgaW4gdGhlIGZpcnN0IHdvcmQgb2YgZD9cclxuICAgIGlmICgtLWkgPCAwKSB7XHJcbiAgICAgIGkgKz0gTE9HX0JBU0U7XHJcbiAgICAgIGRpID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRpID0gTWF0aC5jZWlsKChpICsgMSkgLyBMT0dfQkFTRSk7XHJcbiAgICAgIGkgJT0gTE9HX0JBU0U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaSBpcyB0aGUgaW5kZXggKDAgLSA2KSBvZiB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAvLyBFLmcuIGlmIHdpdGhpbiB0aGUgd29yZCAzNDg3NTYzIHRoZSBmaXJzdCByb3VuZGluZyBkaWdpdCBpcyA1LFxyXG4gICAgLy8gdGhlbiBpID0gNCwgayA9IDEwMDAsIHJkID0gMzQ4NzU2MyAlIDEwMDAgPSA1NjNcclxuICAgIGsgPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIGkpO1xyXG4gICAgcmQgPSBkW2RpXSAlIGsgfCAwO1xyXG5cclxuICAgIGlmIChyZXBlYXRpbmcgPT0gbnVsbCkge1xyXG4gICAgICBpZiAoaSA8IDMpIHtcclxuICAgICAgICBpZiAoaSA9PSAwKSByZCA9IHJkIC8gMTAwIHwgMDtcclxuICAgICAgICBlbHNlIGlmIChpID09IDEpIHJkID0gcmQgLyAxMCB8IDA7XHJcbiAgICAgICAgciA9IHJtIDwgNCAmJiByZCA9PSA5OTk5OSB8fCBybSA+IDMgJiYgcmQgPT0gNDk5OTkgfHwgcmQgPT0gNTAwMDAgfHwgcmQgPT0gMDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByID0gKHJtIDwgNCAmJiByZCArIDEgPT0gayB8fCBybSA+IDMgJiYgcmQgKyAxID09IGsgLyAyKSAmJlxyXG4gICAgICAgICAgKGRbZGkgKyAxXSAvIGsgLyAxMDAgfCAwKSA9PSBtYXRocG93KDEwLCBpIC0gMikgLSAxIHx8XHJcbiAgICAgICAgICAgIChyZCA9PSBrIC8gMiB8fCByZCA9PSAwKSAmJiAoZFtkaSArIDFdIC8gayAvIDEwMCB8IDApID09IDA7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChpIDwgNCkge1xyXG4gICAgICAgIGlmIChpID09IDApIHJkID0gcmQgLyAxMDAwIHwgMDtcclxuICAgICAgICBlbHNlIGlmIChpID09IDEpIHJkID0gcmQgLyAxMDAgfCAwO1xyXG4gICAgICAgIGVsc2UgaWYgKGkgPT0gMikgcmQgPSByZCAvIDEwIHwgMDtcclxuICAgICAgICByID0gKHJlcGVhdGluZyB8fCBybSA8IDQpICYmIHJkID09IDk5OTkgfHwgIXJlcGVhdGluZyAmJiBybSA+IDMgJiYgcmQgPT0gNDk5OTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByID0gKChyZXBlYXRpbmcgfHwgcm0gPCA0KSAmJiByZCArIDEgPT0gayB8fFxyXG4gICAgICAgICghcmVwZWF0aW5nICYmIHJtID4gMykgJiYgcmQgKyAxID09IGsgLyAyKSAmJlxyXG4gICAgICAgICAgKGRbZGkgKyAxXSAvIGsgLyAxMDAwIHwgMCkgPT0gbWF0aHBvdygxMCwgaSAtIDMpIC0gMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIENvbnZlcnQgc3RyaW5nIG9mIGBiYXNlSW5gIHRvIGFuIGFycmF5IG9mIG51bWJlcnMgb2YgYGJhc2VPdXRgLlxyXG4gIC8vIEVnLiBjb252ZXJ0QmFzZSgnMjU1JywgMTAsIDE2KSByZXR1cm5zIFsxNSwgMTVdLlxyXG4gIC8vIEVnLiBjb252ZXJ0QmFzZSgnZmYnLCAxNiwgMTApIHJldHVybnMgWzIsIDUsIDVdLlxyXG4gIGZ1bmN0aW9uIGNvbnZlcnRCYXNlKHN0ciwgYmFzZUluLCBiYXNlT3V0KSB7XHJcbiAgICB2YXIgaixcclxuICAgICAgYXJyID0gWzBdLFxyXG4gICAgICBhcnJMLFxyXG4gICAgICBpID0gMCxcclxuICAgICAgc3RyTCA9IHN0ci5sZW5ndGg7XHJcblxyXG4gICAgZm9yICg7IGkgPCBzdHJMOykge1xyXG4gICAgICBmb3IgKGFyckwgPSBhcnIubGVuZ3RoOyBhcnJMLS07KSBhcnJbYXJyTF0gKj0gYmFzZUluO1xyXG4gICAgICBhcnJbMF0gKz0gTlVNRVJBTFMuaW5kZXhPZihzdHIuY2hhckF0KGkrKykpO1xyXG4gICAgICBmb3IgKGogPSAwOyBqIDwgYXJyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgaWYgKGFycltqXSA+IGJhc2VPdXQgLSAxKSB7XHJcbiAgICAgICAgICBpZiAoYXJyW2ogKyAxXSA9PT0gdm9pZCAwKSBhcnJbaiArIDFdID0gMDtcclxuICAgICAgICAgIGFycltqICsgMV0gKz0gYXJyW2pdIC8gYmFzZU91dCB8IDA7XHJcbiAgICAgICAgICBhcnJbal0gJT0gYmFzZU91dDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXJyLnJldmVyc2UoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIGNvcyh4KSA9IDEgLSB4XjIvMiEgKyB4XjQvNCEgLSAuLi5cclxuICAgKiB8eHwgPCBwaS8yXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBjb3NpbmUoQ3RvciwgeCkge1xyXG4gICAgdmFyIGssIGxlbiwgeTtcclxuXHJcbiAgICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIHg7XHJcblxyXG4gICAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBjb3MoNHgpID0gOCooY29zXjQoeCkgLSBjb3NeMih4KSkgKyAxXHJcbiAgICAvLyBpLmUuIGNvcyh4KSA9IDgqKGNvc140KHgvNCkgLSBjb3NeMih4LzQpKSArIDFcclxuXHJcbiAgICAvLyBFc3RpbWF0ZSB0aGUgb3B0aW11bSBudW1iZXIgb2YgdGltZXMgdG8gdXNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgICBsZW4gPSB4LmQubGVuZ3RoO1xyXG4gICAgaWYgKGxlbiA8IDMyKSB7XHJcbiAgICAgIGsgPSBNYXRoLmNlaWwobGVuIC8gMyk7XHJcbiAgICAgIHkgPSAoMSAvIHRpbnlQb3coNCwgaykpLnRvU3RyaW5nKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBrID0gMTY7XHJcbiAgICAgIHkgPSAnMi4zMjgzMDY0MzY1Mzg2OTYyODkwNjI1ZS0xMCc7XHJcbiAgICB9XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gKz0gaztcclxuXHJcbiAgICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDEsIHgudGltZXMoeSksIG5ldyBDdG9yKDEpKTtcclxuXHJcbiAgICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gICAgZm9yICh2YXIgaSA9IGs7IGktLTspIHtcclxuICAgICAgdmFyIGNvczJ4ID0geC50aW1lcyh4KTtcclxuICAgICAgeCA9IGNvczJ4LnRpbWVzKGNvczJ4KS5taW51cyhjb3MyeCkudGltZXMoOCkucGx1cygxKTtcclxuICAgIH1cclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiAtPSBrO1xyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUGVyZm9ybSBkaXZpc2lvbiBpbiB0aGUgc3BlY2lmaWVkIGJhc2UuXHJcbiAgICovXHJcbiAgdmFyIGRpdmlkZSA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLy8gQXNzdW1lcyBub24temVybyB4IGFuZCBrLCBhbmQgaGVuY2Ugbm9uLXplcm8gcmVzdWx0LlxyXG4gICAgZnVuY3Rpb24gbXVsdGlwbHlJbnRlZ2VyKHgsIGssIGJhc2UpIHtcclxuICAgICAgdmFyIHRlbXAsXHJcbiAgICAgICAgY2FycnkgPSAwLFxyXG4gICAgICAgIGkgPSB4Lmxlbmd0aDtcclxuXHJcbiAgICAgIGZvciAoeCA9IHguc2xpY2UoKTsgaS0tOykge1xyXG4gICAgICAgIHRlbXAgPSB4W2ldICogayArIGNhcnJ5O1xyXG4gICAgICAgIHhbaV0gPSB0ZW1wICUgYmFzZSB8IDA7XHJcbiAgICAgICAgY2FycnkgPSB0ZW1wIC8gYmFzZSB8IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjYXJyeSkgeC51bnNoaWZ0KGNhcnJ5KTtcclxuXHJcbiAgICAgIHJldHVybiB4O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBhcmUoYSwgYiwgYUwsIGJMKSB7XHJcbiAgICAgIHZhciBpLCByO1xyXG5cclxuICAgICAgaWYgKGFMICE9IGJMKSB7XHJcbiAgICAgICAgciA9IGFMID4gYkwgPyAxIDogLTE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZm9yIChpID0gciA9IDA7IGkgPCBhTDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoYVtpXSAhPSBiW2ldKSB7XHJcbiAgICAgICAgICAgIHIgPSBhW2ldID4gYltpXSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzdWJ0cmFjdChhLCBiLCBhTCwgYmFzZSkge1xyXG4gICAgICB2YXIgaSA9IDA7XHJcblxyXG4gICAgICAvLyBTdWJ0cmFjdCBiIGZyb20gYS5cclxuICAgICAgZm9yICg7IGFMLS07KSB7XHJcbiAgICAgICAgYVthTF0gLT0gaTtcclxuICAgICAgICBpID0gYVthTF0gPCBiW2FMXSA/IDEgOiAwO1xyXG4gICAgICAgIGFbYUxdID0gaSAqIGJhc2UgKyBhW2FMXSAtIGJbYUxdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcy5cclxuICAgICAgZm9yICg7ICFhWzBdICYmIGEubGVuZ3RoID4gMTspIGEuc2hpZnQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHgsIHksIHByLCBybSwgZHAsIGJhc2UpIHtcclxuICAgICAgdmFyIGNtcCwgZSwgaSwgaywgbG9nQmFzZSwgbW9yZSwgcHJvZCwgcHJvZEwsIHEsIHFkLCByZW0sIHJlbUwsIHJlbTAsIHNkLCB0LCB4aSwgeEwsIHlkMCxcclxuICAgICAgICB5TCwgeXosXHJcbiAgICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgICAgc2lnbiA9IHgucyA9PSB5LnMgPyAxIDogLTEsXHJcbiAgICAgICAgeGQgPSB4LmQsXHJcbiAgICAgICAgeWQgPSB5LmQ7XHJcblxyXG4gICAgICAvLyBFaXRoZXIgTmFOLCBJbmZpbml0eSBvciAwP1xyXG4gICAgICBpZiAoIXhkIHx8ICF4ZFswXSB8fCAheWQgfHwgIXlkWzBdKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQ3RvcigvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBOYU4sIG9yIGJvdGggSW5maW5pdHkgb3IgMC5cclxuICAgICAgICAgICF4LnMgfHwgIXkucyB8fCAoeGQgPyB5ZCAmJiB4ZFswXSA9PSB5ZFswXSA6ICF5ZCkgPyBOYU4gOlxyXG5cclxuICAgICAgICAgIC8vIFJldHVybiDCsTAgaWYgeCBpcyAwIG9yIHkgaXMgwrFJbmZpbml0eSwgb3IgcmV0dXJuIMKxSW5maW5pdHkgYXMgeSBpcyAwLlxyXG4gICAgICAgICAgeGQgJiYgeGRbMF0gPT0gMCB8fCAheWQgPyBzaWduICogMCA6IHNpZ24gLyAwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGJhc2UpIHtcclxuICAgICAgICBsb2dCYXNlID0gMTtcclxuICAgICAgICBlID0geC5lIC0geS5lO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJhc2UgPSBCQVNFO1xyXG4gICAgICAgIGxvZ0Jhc2UgPSBMT0dfQkFTRTtcclxuICAgICAgICBlID0gbWF0aGZsb29yKHguZSAvIGxvZ0Jhc2UpIC0gbWF0aGZsb29yKHkuZSAvIGxvZ0Jhc2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB5TCA9IHlkLmxlbmd0aDtcclxuICAgICAgeEwgPSB4ZC5sZW5ndGg7XHJcbiAgICAgIHEgPSBuZXcgQ3RvcihzaWduKTtcclxuICAgICAgcWQgPSBxLmQgPSBbXTtcclxuXHJcbiAgICAgIC8vIFJlc3VsdCBleHBvbmVudCBtYXkgYmUgb25lIGxlc3MgdGhhbiBlLlxyXG4gICAgICAvLyBUaGUgZGlnaXQgYXJyYXkgb2YgYSBEZWNpbWFsIGZyb20gdG9TdHJpbmdCaW5hcnkgbWF5IGhhdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgIGZvciAoaSA9IDA7IHlkW2ldID09ICh4ZFtpXSB8fCAwKTsgaSsrKTtcclxuXHJcbiAgICAgIGlmICh5ZFtpXSA+ICh4ZFtpXSB8fCAwKSkgZS0tO1xyXG5cclxuICAgICAgaWYgKHByID09IG51bGwpIHtcclxuICAgICAgICBzZCA9IHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgICB9IGVsc2UgaWYgKGRwKSB7XHJcbiAgICAgICAgc2QgPSBwciArICh4LmUgLSB5LmUpICsgMTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZCA9IHByO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2QgPCAwKSB7XHJcbiAgICAgICAgcWQucHVzaCgxKTtcclxuICAgICAgICBtb3JlID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gQ29udmVydCBwcmVjaXNpb24gaW4gbnVtYmVyIG9mIGJhc2UgMTAgZGlnaXRzIHRvIGJhc2UgMWU3IGRpZ2l0cy5cclxuICAgICAgICBzZCA9IHNkIC8gbG9nQmFzZSArIDIgfCAwO1xyXG4gICAgICAgIGkgPSAwO1xyXG5cclxuICAgICAgICAvLyBkaXZpc29yIDwgMWU3XHJcbiAgICAgICAgaWYgKHlMID09IDEpIHtcclxuICAgICAgICAgIGsgPSAwO1xyXG4gICAgICAgICAgeWQgPSB5ZFswXTtcclxuICAgICAgICAgIHNkKys7XHJcblxyXG4gICAgICAgICAgLy8gayBpcyB0aGUgY2FycnkuXHJcbiAgICAgICAgICBmb3IgKDsgKGkgPCB4TCB8fCBrKSAmJiBzZC0tOyBpKyspIHtcclxuICAgICAgICAgICAgdCA9IGsgKiBiYXNlICsgKHhkW2ldIHx8IDApO1xyXG4gICAgICAgICAgICBxZFtpXSA9IHQgLyB5ZCB8IDA7XHJcbiAgICAgICAgICAgIGsgPSB0ICUgeWQgfCAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIG1vcmUgPSBrIHx8IGkgPCB4TDtcclxuXHJcbiAgICAgICAgLy8gZGl2aXNvciA+PSAxZTdcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIE5vcm1hbGlzZSB4ZCBhbmQgeWQgc28gaGlnaGVzdCBvcmRlciBkaWdpdCBvZiB5ZCBpcyA+PSBiYXNlLzJcclxuICAgICAgICAgIGsgPSBiYXNlIC8gKHlkWzBdICsgMSkgfCAwO1xyXG5cclxuICAgICAgICAgIGlmIChrID4gMSkge1xyXG4gICAgICAgICAgICB5ZCA9IG11bHRpcGx5SW50ZWdlcih5ZCwgaywgYmFzZSk7XHJcbiAgICAgICAgICAgIHhkID0gbXVsdGlwbHlJbnRlZ2VyKHhkLCBrLCBiYXNlKTtcclxuICAgICAgICAgICAgeUwgPSB5ZC5sZW5ndGg7XHJcbiAgICAgICAgICAgIHhMID0geGQubGVuZ3RoO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHhpID0geUw7XHJcbiAgICAgICAgICByZW0gPSB4ZC5zbGljZSgwLCB5TCk7XHJcbiAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAvLyBBZGQgemVyb3MgdG8gbWFrZSByZW1haW5kZXIgYXMgbG9uZyBhcyBkaXZpc29yLlxyXG4gICAgICAgICAgZm9yICg7IHJlbUwgPCB5TDspIHJlbVtyZW1MKytdID0gMDtcclxuXHJcbiAgICAgICAgICB5eiA9IHlkLnNsaWNlKCk7XHJcbiAgICAgICAgICB5ei51bnNoaWZ0KDApO1xyXG4gICAgICAgICAgeWQwID0geWRbMF07XHJcblxyXG4gICAgICAgICAgaWYgKHlkWzFdID49IGJhc2UgLyAyKSArK3lkMDtcclxuXHJcbiAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGsgPSAwO1xyXG5cclxuICAgICAgICAgICAgLy8gQ29tcGFyZSBkaXZpc29yIGFuZCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIGNtcCA9IGNvbXBhcmUoeWQsIHJlbSwgeUwsIHJlbUwpO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgZGl2aXNvciA8IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgaWYgKGNtcCA8IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHRyaWFsIGRpZ2l0LCBrLlxyXG4gICAgICAgICAgICAgIHJlbTAgPSByZW1bMF07XHJcbiAgICAgICAgICAgICAgaWYgKHlMICE9IHJlbUwpIHJlbTAgPSByZW0wICogYmFzZSArIChyZW1bMV0gfHwgMCk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIGsgd2lsbCBiZSBob3cgbWFueSB0aW1lcyB0aGUgZGl2aXNvciBnb2VzIGludG8gdGhlIGN1cnJlbnQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIGsgPSByZW0wIC8geWQwIHwgMDtcclxuXHJcbiAgICAgICAgICAgICAgLy8gIEFsZ29yaXRobTpcclxuICAgICAgICAgICAgICAvLyAgMS4gcHJvZHVjdCA9IGRpdmlzb3IgKiB0cmlhbCBkaWdpdCAoaylcclxuICAgICAgICAgICAgICAvLyAgMi4gaWYgcHJvZHVjdCA+IHJlbWFpbmRlcjogcHJvZHVjdCAtPSBkaXZpc29yLCBrLS1cclxuICAgICAgICAgICAgICAvLyAgMy4gcmVtYWluZGVyIC09IHByb2R1Y3RcclxuICAgICAgICAgICAgICAvLyAgNC4gaWYgcHJvZHVjdCB3YXMgPCByZW1haW5kZXIgYXQgMjpcclxuICAgICAgICAgICAgICAvLyAgICA1LiBjb21wYXJlIG5ldyByZW1haW5kZXIgYW5kIGRpdmlzb3JcclxuICAgICAgICAgICAgICAvLyAgICA2LiBJZiByZW1haW5kZXIgPiBkaXZpc29yOiByZW1haW5kZXIgLT0gZGl2aXNvciwgaysrXHJcblxyXG4gICAgICAgICAgICAgIGlmIChrID4gMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGsgPj0gYmFzZSkgayA9IGJhc2UgLSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQuXHJcbiAgICAgICAgICAgICAgICBwcm9kID0gbXVsdGlwbHlJbnRlZ2VyKHlkLCBrLCBiYXNlKTtcclxuICAgICAgICAgICAgICAgIHByb2RMID0gcHJvZC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDb21wYXJlIHByb2R1Y3QgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgIGNtcCA9IGNvbXBhcmUocHJvZCwgcmVtLCBwcm9kTCwgcmVtTCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gcHJvZHVjdCA+IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgIGlmIChjbXAgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICBrLS07XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBkaXZpc29yIGZyb20gcHJvZHVjdC5cclxuICAgICAgICAgICAgICAgICAgc3VidHJhY3QocHJvZCwgeUwgPCBwcm9kTCA/IHl6IDogeWQsIHByb2RMLCBiYXNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNtcCBpcyAtMS5cclxuICAgICAgICAgICAgICAgIC8vIElmIGsgaXMgMCwgdGhlcmUgaXMgbm8gbmVlZCB0byBjb21wYXJlIHlkIGFuZCByZW0gYWdhaW4gYmVsb3csIHNvIGNoYW5nZSBjbXAgdG8gMVxyXG4gICAgICAgICAgICAgICAgLy8gdG8gYXZvaWQgaXQuIElmIGsgaXMgMSB0aGVyZSBpcyBhIG5lZWQgdG8gY29tcGFyZSB5ZCBhbmQgcmVtIGFnYWluIGJlbG93LlxyXG4gICAgICAgICAgICAgICAgaWYgKGsgPT0gMCkgY21wID0gayA9IDE7XHJcbiAgICAgICAgICAgICAgICBwcm9kID0geWQuc2xpY2UoKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHByb2RMID0gcHJvZC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgaWYgKHByb2RMIDwgcmVtTCkgcHJvZC51bnNoaWZ0KDApO1xyXG5cclxuICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBwcm9kdWN0IGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIHN1YnRyYWN0KHJlbSwgcHJvZCwgcmVtTCwgYmFzZSk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIElmIHByb2R1Y3Qgd2FzIDwgcHJldmlvdXMgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIGlmIChjbXAgPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENvbXBhcmUgZGl2aXNvciBhbmQgbmV3IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgIGNtcCA9IGNvbXBhcmUoeWQsIHJlbSwgeUwsIHJlbUwpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIGRpdmlzb3IgPCBuZXcgcmVtYWluZGVyLCBzdWJ0cmFjdCBkaXZpc29yIGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgICAgaWYgKGNtcCA8IDEpIHtcclxuICAgICAgICAgICAgICAgICAgaysrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgICAgc3VidHJhY3QocmVtLCB5TCA8IHJlbUwgPyB5eiA6IHlkLCByZW1MLCBiYXNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNtcCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgIGsrKztcclxuICAgICAgICAgICAgICByZW0gPSBbMF07XHJcbiAgICAgICAgICAgIH0gICAgLy8gaWYgY21wID09PSAxLCBrIHdpbGwgYmUgMFxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHRoZSBuZXh0IGRpZ2l0LCBrLCB0byB0aGUgcmVzdWx0IGFycmF5LlxyXG4gICAgICAgICAgICBxZFtpKytdID0gaztcclxuXHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBpZiAoY21wICYmIHJlbVswXSkge1xyXG4gICAgICAgICAgICAgIHJlbVtyZW1MKytdID0geGRbeGldIHx8IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVtID0gW3hkW3hpXV07XHJcbiAgICAgICAgICAgICAgcmVtTCA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9IHdoaWxlICgoeGkrKyA8IHhMIHx8IHJlbVswXSAhPT0gdm9pZCAwKSAmJiBzZC0tKTtcclxuXHJcbiAgICAgICAgICBtb3JlID0gcmVtWzBdICE9PSB2b2lkIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBMZWFkaW5nIHplcm8/XHJcbiAgICAgICAgaWYgKCFxZFswXSkgcWQuc2hpZnQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gbG9nQmFzZSBpcyAxIHdoZW4gZGl2aWRlIGlzIGJlaW5nIHVzZWQgZm9yIGJhc2UgY29udmVyc2lvbi5cclxuICAgICAgaWYgKGxvZ0Jhc2UgPT0gMSkge1xyXG4gICAgICAgIHEuZSA9IGU7XHJcbiAgICAgICAgaW5leGFjdCA9IG1vcmU7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIFRvIGNhbGN1bGF0ZSBxLmUsIGZpcnN0IGdldCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBxZFswXS5cclxuICAgICAgICBmb3IgKGkgPSAxLCBrID0gcWRbMF07IGsgPj0gMTA7IGsgLz0gMTApIGkrKztcclxuICAgICAgICBxLmUgPSBpICsgZSAqIGxvZ0Jhc2UgLSAxO1xyXG5cclxuICAgICAgICBmaW5hbGlzZShxLCBkcCA/IHByICsgcS5lICsgMSA6IHByLCBybSwgbW9yZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBxO1xyXG4gICAgfTtcclxuICB9KSgpO1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSb3VuZCBgeGAgdG8gYHNkYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLlxyXG4gICAqIENoZWNrIGZvciBvdmVyL3VuZGVyLWZsb3cuXHJcbiAgICovXHJcbiAgIGZ1bmN0aW9uIGZpbmFsaXNlKHgsIHNkLCBybSwgaXNUcnVuY2F0ZWQpIHtcclxuICAgIHZhciBkaWdpdHMsIGksIGosIGssIHJkLCByb3VuZFVwLCB3LCB4ZCwgeGRpLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICAvLyBEb24ndCByb3VuZCBpZiBzZCBpcyBudWxsIG9yIHVuZGVmaW5lZC5cclxuICAgIG91dDogaWYgKHNkICE9IG51bGwpIHtcclxuICAgICAgeGQgPSB4LmQ7XHJcblxyXG4gICAgICAvLyBJbmZpbml0eS9OYU4uXHJcbiAgICAgIGlmICgheGQpIHJldHVybiB4O1xyXG5cclxuICAgICAgLy8gcmQ6IHRoZSByb3VuZGluZyBkaWdpdCwgaS5lLiB0aGUgZGlnaXQgYWZ0ZXIgdGhlIGRpZ2l0IHRoYXQgbWF5IGJlIHJvdW5kZWQgdXAuXHJcbiAgICAgIC8vIHc6IHRoZSB3b3JkIG9mIHhkIGNvbnRhaW5pbmcgcmQsIGEgYmFzZSAxZTcgbnVtYmVyLlxyXG4gICAgICAvLyB4ZGk6IHRoZSBpbmRleCBvZiB3IHdpdGhpbiB4ZC5cclxuICAgICAgLy8gZGlnaXRzOiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB3LlxyXG4gICAgICAvLyBpOiB3aGF0IHdvdWxkIGJlIHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdyBpZiBhbGwgdGhlIG51bWJlcnMgd2VyZSA3IGRpZ2l0cyBsb25nIChpLmUuIGlmXHJcbiAgICAgIC8vIHRoZXkgaGFkIGxlYWRpbmcgemVyb3MpXHJcbiAgICAgIC8vIGo6IGlmID4gMCwgdGhlIGFjdHVhbCBpbmRleCBvZiByZCB3aXRoaW4gdyAoaWYgPCAwLCByZCBpcyBhIGxlYWRpbmcgemVybykuXHJcblxyXG4gICAgICAvLyBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5IHhkLlxyXG4gICAgICBmb3IgKGRpZ2l0cyA9IDEsIGsgPSB4ZFswXTsgayA+PSAxMDsgayAvPSAxMCkgZGlnaXRzKys7XHJcbiAgICAgIGkgPSBzZCAtIGRpZ2l0cztcclxuXHJcbiAgICAgIC8vIElzIHRoZSByb3VuZGluZyBkaWdpdCBpbiB0aGUgZmlyc3Qgd29yZCBvZiB4ZD9cclxuICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgaSArPSBMT0dfQkFTRTtcclxuICAgICAgICBqID0gc2Q7XHJcbiAgICAgICAgdyA9IHhkW3hkaSA9IDBdO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIHJvdW5kaW5nIGRpZ2l0IGF0IGluZGV4IGogb2Ygdy5cclxuICAgICAgICByZCA9IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeGRpID0gTWF0aC5jZWlsKChpICsgMSkgLyBMT0dfQkFTRSk7XHJcbiAgICAgICAgayA9IHhkLmxlbmd0aDtcclxuICAgICAgICBpZiAoeGRpID49IGspIHtcclxuICAgICAgICAgIGlmIChpc1RydW5jYXRlZCkge1xyXG5cclxuICAgICAgICAgICAgLy8gTmVlZGVkIGJ5IGBuYXR1cmFsRXhwb25lbnRpYWxgLCBgbmF0dXJhbExvZ2FyaXRobWAgYW5kIGBzcXVhcmVSb290YC5cclxuICAgICAgICAgICAgZm9yICg7IGsrKyA8PSB4ZGk7KSB4ZC5wdXNoKDApO1xyXG4gICAgICAgICAgICB3ID0gcmQgPSAwO1xyXG4gICAgICAgICAgICBkaWdpdHMgPSAxO1xyXG4gICAgICAgICAgICBpICU9IExPR19CQVNFO1xyXG4gICAgICAgICAgICBqID0gaSAtIExPR19CQVNFICsgMTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJyZWFrIG91dDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdyA9IGsgPSB4ZFt4ZGldO1xyXG5cclxuICAgICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB3LlxyXG4gICAgICAgICAgZm9yIChkaWdpdHMgPSAxOyBrID49IDEwOyBrIC89IDEwKSBkaWdpdHMrKztcclxuXHJcbiAgICAgICAgICAvLyBHZXQgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiB3LlxyXG4gICAgICAgICAgaSAlPSBMT0dfQkFTRTtcclxuXHJcbiAgICAgICAgICAvLyBHZXQgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiB3LCBhZGp1c3RlZCBmb3IgbGVhZGluZyB6ZXJvcy5cclxuICAgICAgICAgIC8vIFRoZSBudW1iZXIgb2YgbGVhZGluZyB6ZXJvcyBvZiB3IGlzIGdpdmVuIGJ5IExPR19CQVNFIC0gZGlnaXRzLlxyXG4gICAgICAgICAgaiA9IGkgLSBMT0dfQkFTRSArIGRpZ2l0cztcclxuXHJcbiAgICAgICAgICAvLyBHZXQgdGhlIHJvdW5kaW5nIGRpZ2l0IGF0IGluZGV4IGogb2Ygdy5cclxuICAgICAgICAgIHJkID0gaiA8IDAgPyAwIDogdyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKSAlIDEwIHwgMDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFyZSB0aGVyZSBhbnkgbm9uLXplcm8gZGlnaXRzIGFmdGVyIHRoZSByb3VuZGluZyBkaWdpdD9cclxuICAgICAgaXNUcnVuY2F0ZWQgPSBpc1RydW5jYXRlZCB8fCBzZCA8IDAgfHxcclxuICAgICAgICB4ZFt4ZGkgKyAxXSAhPT0gdm9pZCAwIHx8IChqIDwgMCA/IHcgOiB3ICUgbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpKTtcclxuXHJcbiAgICAgIC8vIFRoZSBleHByZXNzaW9uIGB3ICUgbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpYCByZXR1cm5zIGFsbCB0aGUgZGlnaXRzIG9mIHcgdG8gdGhlIHJpZ2h0XHJcbiAgICAgIC8vIG9mIHRoZSBkaWdpdCBhdCAobGVmdC10by1yaWdodCkgaW5kZXggaiwgZS5nLiBpZiB3IGlzIDkwODcxNCBhbmQgaiBpcyAyLCB0aGUgZXhwcmVzc2lvblxyXG4gICAgICAvLyB3aWxsIGdpdmUgNzE0LlxyXG5cclxuICAgICAgcm91bmRVcCA9IHJtIDwgNFxyXG4gICAgICAgID8gKHJkIHx8IGlzVHJ1bmNhdGVkKSAmJiAocm0gPT0gMCB8fCBybSA9PSAoeC5zIDwgMCA/IDMgOiAyKSlcclxuICAgICAgICA6IHJkID4gNSB8fCByZCA9PSA1ICYmIChybSA9PSA0IHx8IGlzVHJ1bmNhdGVkIHx8IHJtID09IDYgJiZcclxuXHJcbiAgICAgICAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBkaWdpdCB0byB0aGUgbGVmdCBvZiB0aGUgcm91bmRpbmcgZGlnaXQgaXMgb2RkLlxyXG4gICAgICAgICAgKChpID4gMCA/IGogPiAwID8gdyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGopIDogMCA6IHhkW3hkaSAtIDFdKSAlIDEwKSAmIDEgfHxcclxuICAgICAgICAgICAgcm0gPT0gKHgucyA8IDAgPyA4IDogNykpO1xyXG5cclxuICAgICAgaWYgKHNkIDwgMSB8fCAheGRbMF0pIHtcclxuICAgICAgICB4ZC5sZW5ndGggPSAwO1xyXG4gICAgICAgIGlmIChyb3VuZFVwKSB7XHJcblxyXG4gICAgICAgICAgLy8gQ29udmVydCBzZCB0byBkZWNpbWFsIHBsYWNlcy5cclxuICAgICAgICAgIHNkIC09IHguZSArIDE7XHJcblxyXG4gICAgICAgICAgLy8gMSwgMC4xLCAwLjAxLCAwLjAwMSwgMC4wMDAxIGV0Yy5cclxuICAgICAgICAgIHhkWzBdID0gbWF0aHBvdygxMCwgKExPR19CQVNFIC0gc2QgJSBMT0dfQkFTRSkgJSBMT0dfQkFTRSk7XHJcbiAgICAgICAgICB4LmUgPSAtc2QgfHwgMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgICB4ZFswXSA9IHguZSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4geDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUmVtb3ZlIGV4Y2VzcyBkaWdpdHMuXHJcbiAgICAgIGlmIChpID09IDApIHtcclxuICAgICAgICB4ZC5sZW5ndGggPSB4ZGk7XHJcbiAgICAgICAgayA9IDE7XHJcbiAgICAgICAgeGRpLS07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeGQubGVuZ3RoID0geGRpICsgMTtcclxuICAgICAgICBrID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBpKTtcclxuXHJcbiAgICAgICAgLy8gRS5nLiA1NjcwMCBiZWNvbWVzIDU2MDAwIGlmIDcgaXMgdGhlIHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgIC8vIGogPiAwIG1lYW5zIGkgPiBudW1iZXIgb2YgbGVhZGluZyB6ZXJvcyBvZiB3LlxyXG4gICAgICAgIHhkW3hkaV0gPSBqID4gMCA/ICh3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaikgJSBtYXRocG93KDEwLCBqKSB8IDApICogayA6IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyb3VuZFVwKSB7XHJcbiAgICAgICAgZm9yICg7Oykge1xyXG5cclxuICAgICAgICAgIC8vIElzIHRoZSBkaWdpdCB0byBiZSByb3VuZGVkIHVwIGluIHRoZSBmaXJzdCB3b3JkIG9mIHhkP1xyXG4gICAgICAgICAgaWYgKHhkaSA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBpIHdpbGwgYmUgdGhlIGxlbmd0aCBvZiB4ZFswXSBiZWZvcmUgayBpcyBhZGRlZC5cclxuICAgICAgICAgICAgZm9yIChpID0gMSwgaiA9IHhkWzBdOyBqID49IDEwOyBqIC89IDEwKSBpKys7XHJcbiAgICAgICAgICAgIGogPSB4ZFswXSArPSBrO1xyXG4gICAgICAgICAgICBmb3IgKGsgPSAxOyBqID49IDEwOyBqIC89IDEwKSBrKys7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiBpICE9IGsgdGhlIGxlbmd0aCBoYXMgaW5jcmVhc2VkLlxyXG4gICAgICAgICAgICBpZiAoaSAhPSBrKSB7XHJcbiAgICAgICAgICAgICAgeC5lKys7XHJcbiAgICAgICAgICAgICAgaWYgKHhkWzBdID09IEJBU0UpIHhkWzBdID0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4ZFt4ZGldICs9IGs7XHJcbiAgICAgICAgICAgIGlmICh4ZFt4ZGldICE9IEJBU0UpIGJyZWFrO1xyXG4gICAgICAgICAgICB4ZFt4ZGktLV0gPSAwO1xyXG4gICAgICAgICAgICBrID0gMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgZm9yIChpID0geGQubGVuZ3RoOyB4ZFstLWldID09PSAwOykgeGQucG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGV4dGVybmFsKSB7XHJcblxyXG4gICAgICAvLyBPdmVyZmxvdz9cclxuICAgICAgaWYgKHguZSA+IEN0b3IubWF4RSkge1xyXG5cclxuICAgICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgIHguZSA9IE5hTjtcclxuXHJcbiAgICAgIC8vIFVuZGVyZmxvdz9cclxuICAgICAgfSBlbHNlIGlmICh4LmUgPCBDdG9yLm1pbkUpIHtcclxuXHJcbiAgICAgICAgLy8gWmVyby5cclxuICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICAvLyBDdG9yLnVuZGVyZmxvdyA9IHRydWU7XHJcbiAgICAgIH0gLy8gZWxzZSBDdG9yLnVuZGVyZmxvdyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGZpbml0ZVRvU3RyaW5nKHgsIGlzRXhwLCBzZCkge1xyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkpIHJldHVybiBub25GaW5pdGVUb1N0cmluZyh4KTtcclxuICAgIHZhciBrLFxyXG4gICAgICBlID0geC5lLFxyXG4gICAgICBzdHIgPSBkaWdpdHNUb1N0cmluZyh4LmQpLFxyXG4gICAgICBsZW4gPSBzdHIubGVuZ3RoO1xyXG5cclxuICAgIGlmIChpc0V4cCkge1xyXG4gICAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGxlbikgPiAwKSB7XHJcbiAgICAgICAgc3RyID0gc3RyLmNoYXJBdCgwKSArICcuJyArIHN0ci5zbGljZSgxKSArIGdldFplcm9TdHJpbmcoayk7XHJcbiAgICAgIH0gZWxzZSBpZiAobGVuID4gMSkge1xyXG4gICAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN0ciA9IHN0ciArICh4LmUgPCAwID8gJ2UnIDogJ2UrJykgKyB4LmU7XHJcbiAgICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcbiAgICAgIHN0ciA9ICcwLicgKyBnZXRaZXJvU3RyaW5nKC1lIC0gMSkgKyBzdHI7XHJcbiAgICAgIGlmIChzZCAmJiAoayA9IHNkIC0gbGVuKSA+IDApIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgfSBlbHNlIGlmIChlID49IGxlbikge1xyXG4gICAgICBzdHIgKz0gZ2V0WmVyb1N0cmluZyhlICsgMSAtIGxlbik7XHJcbiAgICAgIGlmIChzZCAmJiAoayA9IHNkIC0gZSAtIDEpID4gMCkgc3RyID0gc3RyICsgJy4nICsgZ2V0WmVyb1N0cmluZyhrKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICgoayA9IGUgKyAxKSA8IGxlbikgc3RyID0gc3RyLnNsaWNlKDAsIGspICsgJy4nICsgc3RyLnNsaWNlKGspO1xyXG4gICAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGxlbikgPiAwKSB7XHJcbiAgICAgICAgaWYgKGUgKyAxID09PSBsZW4pIHN0ciArPSAnLic7XHJcbiAgICAgICAgc3RyICs9IGdldFplcm9TdHJpbmcoayk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3RyO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIENhbGN1bGF0ZSB0aGUgYmFzZSAxMCBleHBvbmVudCBmcm9tIHRoZSBiYXNlIDFlNyBleHBvbmVudC5cclxuICBmdW5jdGlvbiBnZXRCYXNlMTBFeHBvbmVudChkaWdpdHMsIGUpIHtcclxuICAgIHZhciB3ID0gZGlnaXRzWzBdO1xyXG5cclxuICAgIC8vIEFkZCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5LlxyXG4gICAgZm9yICggZSAqPSBMT0dfQkFTRTsgdyA+PSAxMDsgdyAvPSAxMCkgZSsrO1xyXG4gICAgcmV0dXJuIGU7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TG4xMChDdG9yLCBzZCwgcHIpIHtcclxuICAgIGlmIChzZCA+IExOMTBfUFJFQ0lTSU9OKSB7XHJcblxyXG4gICAgICAvLyBSZXNldCBnbG9iYWwgc3RhdGUgaW4gY2FzZSB0aGUgZXhjZXB0aW9uIGlzIGNhdWdodC5cclxuICAgICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gICAgICBpZiAocHIpIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICAgIHRocm93IEVycm9yKHByZWNpc2lvbkxpbWl0RXhjZWVkZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKExOMTApLCBzZCwgMSwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZ2V0UGkoQ3Rvciwgc2QsIHJtKSB7XHJcbiAgICBpZiAoc2QgPiBQSV9QUkVDSVNJT04pIHRocm93IEVycm9yKHByZWNpc2lvbkxpbWl0RXhjZWVkZWQpO1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKFBJKSwgc2QsIHJtLCB0cnVlKTtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBnZXRQcmVjaXNpb24oZGlnaXRzKSB7XHJcbiAgICB2YXIgdyA9IGRpZ2l0cy5sZW5ndGggLSAxLFxyXG4gICAgICBsZW4gPSB3ICogTE9HX0JBU0UgKyAxO1xyXG5cclxuICAgIHcgPSBkaWdpdHNbd107XHJcblxyXG4gICAgLy8gSWYgbm9uLXplcm8uLi5cclxuICAgIGlmICh3KSB7XHJcblxyXG4gICAgICAvLyBTdWJ0cmFjdCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm9zIG9mIHRoZSBsYXN0IHdvcmQuXHJcbiAgICAgIGZvciAoOyB3ICUgMTAgPT0gMDsgdyAvPSAxMCkgbGVuLS07XHJcblxyXG4gICAgICAvLyBBZGQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgdGhlIGZpcnN0IHdvcmQuXHJcbiAgICAgIGZvciAodyA9IGRpZ2l0c1swXTsgdyA+PSAxMDsgdyAvPSAxMCkgbGVuKys7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxlbjtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBnZXRaZXJvU3RyaW5nKGspIHtcclxuICAgIHZhciB6cyA9ICcnO1xyXG4gICAgZm9yICg7IGstLTspIHpzICs9ICcwJztcclxuICAgIHJldHVybiB6cztcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiBEZWNpbWFsIGB4YCB0byB0aGUgcG93ZXIgYG5gLCB3aGVyZSBgbmAgaXMgYW5cclxuICAgKiBpbnRlZ2VyIG9mIHR5cGUgbnVtYmVyLlxyXG4gICAqXHJcbiAgICogSW1wbGVtZW50cyAnZXhwb25lbnRpYXRpb24gYnkgc3F1YXJpbmcnLiBDYWxsZWQgYnkgYHBvd2AgYW5kIGBwYXJzZU90aGVyYC5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGludFBvdyhDdG9yLCB4LCBuLCBwcikge1xyXG4gICAgdmFyIGlzVHJ1bmNhdGVkLFxyXG4gICAgICByID0gbmV3IEN0b3IoMSksXHJcblxyXG4gICAgICAvLyBNYXggbiBvZiA5MDA3MTk5MjU0NzQwOTkxIHRha2VzIDUzIGxvb3AgaXRlcmF0aW9ucy5cclxuICAgICAgLy8gTWF4aW11bSBkaWdpdHMgYXJyYXkgbGVuZ3RoOyBsZWF2ZXMgWzI4LCAzNF0gZ3VhcmQgZGlnaXRzLlxyXG4gICAgICBrID0gTWF0aC5jZWlsKHByIC8gTE9HX0JBU0UgKyA0KTtcclxuXHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAgIGZvciAoOzspIHtcclxuICAgICAgaWYgKG4gJSAyKSB7XHJcbiAgICAgICAgciA9IHIudGltZXMoeCk7XHJcbiAgICAgICAgaWYgKHRydW5jYXRlKHIuZCwgaykpIGlzVHJ1bmNhdGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbiA9IG1hdGhmbG9vcihuIC8gMik7XHJcbiAgICAgIGlmIChuID09PSAwKSB7XHJcblxyXG4gICAgICAgIC8vIFRvIGVuc3VyZSBjb3JyZWN0IHJvdW5kaW5nIHdoZW4gci5kIGlzIHRydW5jYXRlZCwgaW5jcmVtZW50IHRoZSBsYXN0IHdvcmQgaWYgaXQgaXMgemVyby5cclxuICAgICAgICBuID0gci5kLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgaWYgKGlzVHJ1bmNhdGVkICYmIHIuZFtuXSA9PT0gMCkgKytyLmRbbl07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHggPSB4LnRpbWVzKHgpO1xyXG4gICAgICB0cnVuY2F0ZSh4LmQsIGspO1xyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gcjtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBpc09kZChuKSB7XHJcbiAgICByZXR1cm4gbi5kW24uZC5sZW5ndGggLSAxXSAmIDE7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBIYW5kbGUgYG1heGAgYW5kIGBtaW5gLiBgbHRndGAgaXMgJ2x0JyBvciAnZ3QnLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG1heE9yTWluKEN0b3IsIGFyZ3MsIGx0Z3QpIHtcclxuICAgIHZhciB5LFxyXG4gICAgICB4ID0gbmV3IEN0b3IoYXJnc1swXSksXHJcbiAgICAgIGkgPSAwO1xyXG5cclxuICAgIGZvciAoOyArK2kgPCBhcmdzLmxlbmd0aDspIHtcclxuICAgICAgeSA9IG5ldyBDdG9yKGFyZ3NbaV0pO1xyXG4gICAgICBpZiAoIXkucykge1xyXG4gICAgICAgIHggPSB5O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9IGVsc2UgaWYgKHhbbHRndF0oeSkpIHtcclxuICAgICAgICB4ID0geTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgZXhwb25lbnRpYWwgb2YgYHhgIHJvdW5kZWQgdG8gYHNkYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cy5cclxuICAgKlxyXG4gICAqIFRheWxvci9NYWNsYXVyaW4gc2VyaWVzLlxyXG4gICAqXHJcbiAgICogZXhwKHgpID0geF4wLzAhICsgeF4xLzEhICsgeF4yLzIhICsgeF4zLzMhICsgLi4uXHJcbiAgICpcclxuICAgKiBBcmd1bWVudCByZWR1Y3Rpb246XHJcbiAgICogICBSZXBlYXQgeCA9IHggLyAzMiwgayArPSA1LCB1bnRpbCB8eHwgPCAwLjFcclxuICAgKiAgIGV4cCh4KSA9IGV4cCh4IC8gMl5rKV4oMl5rKVxyXG4gICAqXHJcbiAgICogUHJldmlvdXNseSwgdGhlIGFyZ3VtZW50IHdhcyBpbml0aWFsbHkgcmVkdWNlZCBieVxyXG4gICAqIGV4cCh4KSA9IGV4cChyKSAqIDEwXmsgIHdoZXJlIHIgPSB4IC0gayAqIGxuMTAsIGsgPSBmbG9vcih4IC8gbG4xMClcclxuICAgKiB0byBmaXJzdCBwdXQgciBpbiB0aGUgcmFuZ2UgWzAsIGxuMTBdLCBiZWZvcmUgZGl2aWRpbmcgYnkgMzIgdW50aWwgfHh8IDwgMC4xLCBidXQgdGhpcyB3YXNcclxuICAgKiBmb3VuZCB0byBiZSBzbG93ZXIgdGhhbiBqdXN0IGRpdmlkaW5nIHJlcGVhdGVkbHkgYnkgMzIgYXMgYWJvdmUuXHJcbiAgICpcclxuICAgKiBNYXggaW50ZWdlciBhcmd1bWVudDogZXhwKCcyMDcyMzI2NTgzNjk0NjQxMycpID0gNi4zZSs5MDAwMDAwMDAwMDAwMDAwXHJcbiAgICogTWluIGludGVnZXIgYXJndW1lbnQ6IGV4cCgnLTIwNzIzMjY1ODM2OTQ2NDExJykgPSAxLjJlLTkwMDAwMDAwMDAwMDAwMDBcclxuICAgKiAoTWF0aCBvYmplY3QgaW50ZWdlciBtaW4vbWF4OiBNYXRoLmV4cCg3MDkpID0gOC4yZSszMDcsIE1hdGguZXhwKC03NDUpID0gNWUtMzI0KVxyXG4gICAqXHJcbiAgICogIGV4cChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICAgKiAgZXhwKC1JbmZpbml0eSkgPSAwXHJcbiAgICogIGV4cChOYU4pICAgICAgID0gTmFOXHJcbiAgICogIGV4cCjCsTApICAgICAgICA9IDFcclxuICAgKlxyXG4gICAqICBleHAoeCkgaXMgbm9uLXRlcm1pbmF0aW5nIGZvciBhbnkgZmluaXRlLCBub24temVybyB4LlxyXG4gICAqXHJcbiAgICogIFRoZSByZXN1bHQgd2lsbCBhbHdheXMgYmUgY29ycmVjdGx5IHJvdW5kZWQuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBuYXR1cmFsRXhwb25lbnRpYWwoeCwgc2QpIHtcclxuICAgIHZhciBkZW5vbWluYXRvciwgZ3VhcmQsIGosIHBvdywgc3VtLCB0LCB3cHIsXHJcbiAgICAgIHJlcCA9IDAsXHJcbiAgICAgIGkgPSAwLFxyXG4gICAgICBrID0gMCxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZyxcclxuICAgICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuXHJcbiAgICAvLyAwL05hTi9JbmZpbml0eT9cclxuICAgIGlmICgheC5kIHx8ICF4LmRbMF0gfHwgeC5lID4gMTcpIHtcclxuXHJcbiAgICAgIHJldHVybiBuZXcgQ3Rvcih4LmRcclxuICAgICAgICA/ICF4LmRbMF0gPyAxIDogeC5zIDwgMCA/IDAgOiAxIC8gMFxyXG4gICAgICAgIDogeC5zID8geC5zIDwgMCA/IDAgOiB4IDogMCAvIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZCA9PSBudWxsKSB7XHJcbiAgICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICAgIHdwciA9IHByO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3ByID0gc2Q7XHJcbiAgICB9XHJcblxyXG4gICAgdCA9IG5ldyBDdG9yKDAuMDMxMjUpO1xyXG5cclxuICAgIC8vIHdoaWxlIGFicyh4KSA+PSAwLjFcclxuICAgIHdoaWxlICh4LmUgPiAtMikge1xyXG5cclxuICAgICAgLy8geCA9IHggLyAyXjVcclxuICAgICAgeCA9IHgudGltZXModCk7XHJcbiAgICAgIGsgKz0gNTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBVc2UgMiAqIGxvZzEwKDJeaykgKyA1IChlbXBpcmljYWxseSBkZXJpdmVkKSB0byBlc3RpbWF0ZSB0aGUgaW5jcmVhc2UgaW4gcHJlY2lzaW9uXHJcbiAgICAvLyBuZWNlc3NhcnkgdG8gZW5zdXJlIHRoZSBmaXJzdCA0IHJvdW5kaW5nIGRpZ2l0cyBhcmUgY29ycmVjdC5cclxuICAgIGd1YXJkID0gTWF0aC5sb2cobWF0aHBvdygyLCBrKSkgLyBNYXRoLkxOMTAgKiAyICsgNSB8IDA7XHJcbiAgICB3cHIgKz0gZ3VhcmQ7XHJcbiAgICBkZW5vbWluYXRvciA9IHBvdyA9IHN1bSA9IG5ldyBDdG9yKDEpO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSB3cHI7XHJcblxyXG4gICAgZm9yICg7Oykge1xyXG4gICAgICBwb3cgPSBmaW5hbGlzZShwb3cudGltZXMoeCksIHdwciwgMSk7XHJcbiAgICAgIGRlbm9taW5hdG9yID0gZGVub21pbmF0b3IudGltZXMoKytpKTtcclxuICAgICAgdCA9IHN1bS5wbHVzKGRpdmlkZShwb3csIGRlbm9taW5hdG9yLCB3cHIsIDEpKTtcclxuXHJcbiAgICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHdwcikgPT09IGRpZ2l0c1RvU3RyaW5nKHN1bS5kKS5zbGljZSgwLCB3cHIpKSB7XHJcbiAgICAgICAgaiA9IGs7XHJcbiAgICAgICAgd2hpbGUgKGotLSkgc3VtID0gZmluYWxpc2Uoc3VtLnRpbWVzKHN1bSksIHdwciwgMSk7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgYXJlIFs0OV05OTkuXHJcbiAgICAgICAgLy8gSWYgc28sIHJlcGVhdCB0aGUgc3VtbWF0aW9uIHdpdGggYSBoaWdoZXIgcHJlY2lzaW9uLCBvdGhlcndpc2VcclxuICAgICAgICAvLyBlLmcuIHdpdGggcHJlY2lzaW9uOiAxOCwgcm91bmRpbmc6IDFcclxuICAgICAgICAvLyBleHAoMTguNDA0MjcyNDYyNTk1MDM0MDgzNTY3NzkzOTE5ODQzNzYxKSA9IDk4MzcyNTYwLjEyMjk5OTk5OTkgKHNob3VsZCBiZSA5ODM3MjU2MC4xMjMpXHJcbiAgICAgICAgLy8gYHdwciAtIGd1YXJkYCBpcyB0aGUgaW5kZXggb2YgZmlyc3Qgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgaWYgKHNkID09IG51bGwpIHtcclxuXHJcbiAgICAgICAgICBpZiAocmVwIDwgMyAmJiBjaGVja1JvdW5kaW5nRGlnaXRzKHN1bS5kLCB3cHIgLSBndWFyZCwgcm0sIHJlcCkpIHtcclxuICAgICAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgKz0gMTA7XHJcbiAgICAgICAgICAgIGRlbm9taW5hdG9yID0gcG93ID0gdCA9IG5ldyBDdG9yKDEpO1xyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgICAgcmVwKys7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmluYWxpc2Uoc3VtLCBDdG9yLnByZWNpc2lvbiA9IHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgICAgICAgIHJldHVybiBzdW07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBzdW0gPSB0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIGB4YCByb3VuZGVkIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICAgKiBkaWdpdHMuXHJcbiAgICpcclxuICAgKiAgbG4oLW4pICAgICAgICA9IE5hTlxyXG4gICAqICBsbigwKSAgICAgICAgID0gLUluZmluaXR5XHJcbiAgICogIGxuKC0wKSAgICAgICAgPSAtSW5maW5pdHlcclxuICAgKiAgbG4oMSkgICAgICAgICA9IDBcclxuICAgKiAgbG4oSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAgICogIGxuKC1JbmZpbml0eSkgPSBOYU5cclxuICAgKiAgbG4oTmFOKSAgICAgICA9IE5hTlxyXG4gICAqXHJcbiAgICogIGxuKG4pIChuICE9IDEpIGlzIG5vbi10ZXJtaW5hdGluZy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG5hdHVyYWxMb2dhcml0aG0oeSwgc2QpIHtcclxuICAgIHZhciBjLCBjMCwgZGVub21pbmF0b3IsIGUsIG51bWVyYXRvciwgcmVwLCBzdW0sIHQsIHdwciwgeDEsIHgyLFxyXG4gICAgICBuID0gMSxcclxuICAgICAgZ3VhcmQgPSAxMCxcclxuICAgICAgeCA9IHksXHJcbiAgICAgIHhkID0geC5kLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nLFxyXG4gICAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG5cclxuICAgIC8vIElzIHggbmVnYXRpdmUgb3IgSW5maW5pdHksIE5hTiwgMCBvciAxP1xyXG4gICAgaWYgKHgucyA8IDAgfHwgIXhkIHx8ICF4ZFswXSB8fCAheC5lICYmIHhkWzBdID09IDEgJiYgeGQubGVuZ3RoID09IDEpIHtcclxuICAgICAgcmV0dXJuIG5ldyBDdG9yKHhkICYmICF4ZFswXSA/IC0xIC8gMCA6IHgucyAhPSAxID8gTmFOIDogeGQgPyAwIDogeCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNkID09IG51bGwpIHtcclxuICAgICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgICAgd3ByID0gcHI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3cHIgPSBzZDtcclxuICAgIH1cclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSBndWFyZDtcclxuICAgIGMgPSBkaWdpdHNUb1N0cmluZyh4ZCk7XHJcbiAgICBjMCA9IGMuY2hhckF0KDApO1xyXG5cclxuICAgIGlmIChNYXRoLmFicyhlID0geC5lKSA8IDEuNWUxNSkge1xyXG5cclxuICAgICAgLy8gQXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgICAvLyBUaGUgc2VyaWVzIGNvbnZlcmdlcyBmYXN0ZXIgdGhlIGNsb3NlciB0aGUgYXJndW1lbnQgaXMgdG8gMSwgc28gdXNpbmdcclxuICAgICAgLy8gbG4oYV5iKSA9IGIgKiBsbihhKSwgICBsbihhKSA9IGxuKGFeYikgLyBiXHJcbiAgICAgIC8vIG11bHRpcGx5IHRoZSBhcmd1bWVudCBieSBpdHNlbGYgdW50aWwgdGhlIGxlYWRpbmcgZGlnaXRzIG9mIHRoZSBzaWduaWZpY2FuZCBhcmUgNywgOCwgOSxcclxuICAgICAgLy8gMTAsIDExLCAxMiBvciAxMywgcmVjb3JkaW5nIHRoZSBudW1iZXIgb2YgbXVsdGlwbGljYXRpb25zIHNvIHRoZSBzdW0gb2YgdGhlIHNlcmllcyBjYW5cclxuICAgICAgLy8gbGF0ZXIgYmUgZGl2aWRlZCBieSB0aGlzIG51bWJlciwgdGhlbiBzZXBhcmF0ZSBvdXQgdGhlIHBvd2VyIG9mIDEwIHVzaW5nXHJcbiAgICAgIC8vIGxuKGEqMTBeYikgPSBsbihhKSArIGIqbG4oMTApLlxyXG5cclxuICAgICAgLy8gbWF4IG4gaXMgMjEgKGdpdmVzIDAuOSwgMS4wIG9yIDEuMSkgKDllMTUgLyAyMSA9IDQuMmUxNCkuXHJcbiAgICAgIC8vd2hpbGUgKGMwIDwgOSAmJiBjMCAhPSAxIHx8IGMwID09IDEgJiYgYy5jaGFyQXQoMSkgPiAxKSB7XHJcbiAgICAgIC8vIG1heCBuIGlzIDYgKGdpdmVzIDAuNyAtIDEuMylcclxuICAgICAgd2hpbGUgKGMwIDwgNyAmJiBjMCAhPSAxIHx8IGMwID09IDEgJiYgYy5jaGFyQXQoMSkgPiAzKSB7XHJcbiAgICAgICAgeCA9IHgudGltZXMoeSk7XHJcbiAgICAgICAgYyA9IGRpZ2l0c1RvU3RyaW5nKHguZCk7XHJcbiAgICAgICAgYzAgPSBjLmNoYXJBdCgwKTtcclxuICAgICAgICBuKys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGUgPSB4LmU7XHJcblxyXG4gICAgICBpZiAoYzAgPiAxKSB7XHJcbiAgICAgICAgeCA9IG5ldyBDdG9yKCcwLicgKyBjKTtcclxuICAgICAgICBlKys7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeCA9IG5ldyBDdG9yKGMwICsgJy4nICsgYy5zbGljZSgxKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAvLyBUaGUgYXJndW1lbnQgcmVkdWN0aW9uIG1ldGhvZCBhYm92ZSBtYXkgcmVzdWx0IGluIG92ZXJmbG93IGlmIHRoZSBhcmd1bWVudCB5IGlzIGEgbWFzc2l2ZVxyXG4gICAgICAvLyBudW1iZXIgd2l0aCBleHBvbmVudCA+PSAxNTAwMDAwMDAwMDAwMDAwICg5ZTE1IC8gNiA9IDEuNWUxNSksIHNvIGluc3RlYWQgcmVjYWxsIHRoaXNcclxuICAgICAgLy8gZnVuY3Rpb24gdXNpbmcgbG4oeCoxMF5lKSA9IGxuKHgpICsgZSpsbigxMCkuXHJcbiAgICAgIHQgPSBnZXRMbjEwKEN0b3IsIHdwciArIDIsIHByKS50aW1lcyhlICsgJycpO1xyXG4gICAgICB4ID0gbmF0dXJhbExvZ2FyaXRobShuZXcgQ3RvcihjMCArICcuJyArIGMuc2xpY2UoMSkpLCB3cHIgLSBndWFyZCkucGx1cyh0KTtcclxuICAgICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuXHJcbiAgICAgIHJldHVybiBzZCA9PSBudWxsID8gZmluYWxpc2UoeCwgcHIsIHJtLCBleHRlcm5hbCA9IHRydWUpIDogeDtcclxuICAgIH1cclxuXHJcbiAgICAvLyB4MSBpcyB4IHJlZHVjZWQgdG8gYSB2YWx1ZSBuZWFyIDEuXHJcbiAgICB4MSA9IHg7XHJcblxyXG4gICAgLy8gVGF5bG9yIHNlcmllcy5cclxuICAgIC8vIGxuKHkpID0gbG4oKDEgKyB4KS8oMSAtIHgpKSA9IDIoeCArIHheMy8zICsgeF41LzUgKyB4XjcvNyArIC4uLilcclxuICAgIC8vIHdoZXJlIHggPSAoeSAtIDEpLyh5ICsgMSkgICAgKHx4fCA8IDEpXHJcbiAgICBzdW0gPSBudW1lcmF0b3IgPSB4ID0gZGl2aWRlKHgubWludXMoMSksIHgucGx1cygxKSwgd3ByLCAxKTtcclxuICAgIHgyID0gZmluYWxpc2UoeC50aW1lcyh4KSwgd3ByLCAxKTtcclxuICAgIGRlbm9taW5hdG9yID0gMztcclxuXHJcbiAgICBmb3IgKDs7KSB7XHJcbiAgICAgIG51bWVyYXRvciA9IGZpbmFsaXNlKG51bWVyYXRvci50aW1lcyh4MiksIHdwciwgMSk7XHJcbiAgICAgIHQgPSBzdW0ucGx1cyhkaXZpZGUobnVtZXJhdG9yLCBuZXcgQ3RvcihkZW5vbWluYXRvciksIHdwciwgMSkpO1xyXG5cclxuICAgICAgaWYgKGRpZ2l0c1RvU3RyaW5nKHQuZCkuc2xpY2UoMCwgd3ByKSA9PT0gZGlnaXRzVG9TdHJpbmcoc3VtLmQpLnNsaWNlKDAsIHdwcikpIHtcclxuICAgICAgICBzdW0gPSBzdW0udGltZXMoMik7XHJcblxyXG4gICAgICAgIC8vIFJldmVyc2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi4gQ2hlY2sgdGhhdCBlIGlzIG5vdCAwIGJlY2F1c2UsIGJlc2lkZXMgcHJldmVudGluZyBhblxyXG4gICAgICAgIC8vIHVubmVjZXNzYXJ5IGNhbGN1bGF0aW9uLCAtMCArIDAgPSArMCBhbmQgdG8gZW5zdXJlIGNvcnJlY3Qgcm91bmRpbmcgLTAgbmVlZHMgdG8gc3RheSAtMC5cclxuICAgICAgICBpZiAoZSAhPT0gMCkgc3VtID0gc3VtLnBsdXMoZ2V0TG4xMChDdG9yLCB3cHIgKyAyLCBwcikudGltZXMoZSArICcnKSk7XHJcbiAgICAgICAgc3VtID0gZGl2aWRlKHN1bSwgbmV3IEN0b3IobiksIHdwciwgMSk7XHJcblxyXG4gICAgICAgIC8vIElzIHJtID4gMyBhbmQgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIDQ5OTksIG9yIHJtIDwgNCAob3IgdGhlIHN1bW1hdGlvbiBoYXNcclxuICAgICAgICAvLyBiZWVuIHJlcGVhdGVkIHByZXZpb3VzbHkpIGFuZCB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgOTk5OT9cclxuICAgICAgICAvLyBJZiBzbywgcmVzdGFydCB0aGUgc3VtbWF0aW9uIHdpdGggYSBoaWdoZXIgcHJlY2lzaW9uLCBvdGhlcndpc2VcclxuICAgICAgICAvLyBlLmcuIHdpdGggcHJlY2lzaW9uOiAxMiwgcm91bmRpbmc6IDFcclxuICAgICAgICAvLyBsbigxMzU1MjAwMjguNjEyNjA5MTcxNDI2NTM4MTUzMykgPSAxOC43MjQ2Mjk5OTk5IHdoZW4gaXQgc2hvdWxkIGJlIDE4LjcyNDYzLlxyXG4gICAgICAgIC8vIGB3cHIgLSBndWFyZGAgaXMgdGhlIGluZGV4IG9mIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgIGlmIChzZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhzdW0uZCwgd3ByIC0gZ3VhcmQsIHJtLCByZXApKSB7XHJcbiAgICAgICAgICAgIEN0b3IucHJlY2lzaW9uID0gd3ByICs9IGd1YXJkO1xyXG4gICAgICAgICAgICB0ID0gbnVtZXJhdG9yID0geCA9IGRpdmlkZSh4MS5taW51cygxKSwgeDEucGx1cygxKSwgd3ByLCAxKTtcclxuICAgICAgICAgICAgeDIgPSBmaW5hbGlzZSh4LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gICAgICAgICAgICBkZW5vbWluYXRvciA9IHJlcCA9IDE7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmluYWxpc2Uoc3VtLCBDdG9yLnByZWNpc2lvbiA9IHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgICAgICAgIHJldHVybiBzdW07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBzdW0gPSB0O1xyXG4gICAgICBkZW5vbWluYXRvciArPSAyO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8vIMKxSW5maW5pdHksIE5hTi5cclxuICBmdW5jdGlvbiBub25GaW5pdGVUb1N0cmluZyh4KSB7XHJcbiAgICAvLyBVbnNpZ25lZC5cclxuICAgIHJldHVybiBTdHJpbmcoeC5zICogeC5zIC8gMCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBQYXJzZSB0aGUgdmFsdWUgb2YgYSBuZXcgRGVjaW1hbCBgeGAgZnJvbSBzdHJpbmcgYHN0cmAuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcGFyc2VEZWNpbWFsKHgsIHN0cikge1xyXG4gICAgdmFyIGUsIGksIGxlbjtcclxuXHJcbiAgICAvLyBEZWNpbWFsIHBvaW50P1xyXG4gICAgaWYgKChlID0gc3RyLmluZGV4T2YoJy4nKSkgPiAtMSkgc3RyID0gc3RyLnJlcGxhY2UoJy4nLCAnJyk7XHJcblxyXG4gICAgLy8gRXhwb25lbnRpYWwgZm9ybT9cclxuICAgIGlmICgoaSA9IHN0ci5zZWFyY2goL2UvaSkpID4gMCkge1xyXG5cclxuICAgICAgLy8gRGV0ZXJtaW5lIGV4cG9uZW50LlxyXG4gICAgICBpZiAoZSA8IDApIGUgPSBpO1xyXG4gICAgICBlICs9ICtzdHIuc2xpY2UoaSArIDEpO1xyXG4gICAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDAsIGkpO1xyXG4gICAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG5cclxuICAgICAgLy8gSW50ZWdlci5cclxuICAgICAgZSA9IHN0ci5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MuXHJcbiAgICBmb3IgKGkgPSAwOyBzdHIuY2hhckNvZGVBdChpKSA9PT0gNDg7IGkrKyk7XHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgZm9yIChsZW4gPSBzdHIubGVuZ3RoOyBzdHIuY2hhckNvZGVBdChsZW4gLSAxKSA9PT0gNDg7IC0tbGVuKTtcclxuICAgIHN0ciA9IHN0ci5zbGljZShpLCBsZW4pO1xyXG5cclxuICAgIGlmIChzdHIpIHtcclxuICAgICAgbGVuIC09IGk7XHJcbiAgICAgIHguZSA9IGUgPSBlIC0gaSAtIDE7XHJcbiAgICAgIHguZCA9IFtdO1xyXG5cclxuICAgICAgLy8gVHJhbnNmb3JtIGJhc2VcclxuXHJcbiAgICAgIC8vIGUgaXMgdGhlIGJhc2UgMTAgZXhwb25lbnQuXHJcbiAgICAgIC8vIGkgaXMgd2hlcmUgdG8gc2xpY2Ugc3RyIHRvIGdldCB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgZGlnaXRzIGFycmF5LlxyXG4gICAgICBpID0gKGUgKyAxKSAlIExPR19CQVNFO1xyXG4gICAgICBpZiAoZSA8IDApIGkgKz0gTE9HX0JBU0U7XHJcblxyXG4gICAgICBpZiAoaSA8IGxlbikge1xyXG4gICAgICAgIGlmIChpKSB4LmQucHVzaCgrc3RyLnNsaWNlKDAsIGkpKTtcclxuICAgICAgICBmb3IgKGxlbiAtPSBMT0dfQkFTRTsgaSA8IGxlbjspIHguZC5wdXNoKCtzdHIuc2xpY2UoaSwgaSArPSBMT0dfQkFTRSkpO1xyXG4gICAgICAgIHN0ciA9IHN0ci5zbGljZShpKTtcclxuICAgICAgICBpID0gTE9HX0JBU0UgLSBzdHIubGVuZ3RoO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGkgLT0gbGVuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKDsgaS0tOykgc3RyICs9ICcwJztcclxuICAgICAgeC5kLnB1c2goK3N0cik7XHJcblxyXG4gICAgICBpZiAoZXh0ZXJuYWwpIHtcclxuXHJcbiAgICAgICAgLy8gT3ZlcmZsb3c/XHJcbiAgICAgICAgaWYgKHguZSA+IHguY29uc3RydWN0b3IubWF4RSkge1xyXG5cclxuICAgICAgICAgIC8vIEluZmluaXR5LlxyXG4gICAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICAgIHguZSA9IE5hTjtcclxuXHJcbiAgICAgICAgLy8gVW5kZXJmbG93P1xyXG4gICAgICAgIH0gZWxzZSBpZiAoeC5lIDwgeC5jb25zdHJ1Y3Rvci5taW5FKSB7XHJcblxyXG4gICAgICAgICAgLy8gWmVyby5cclxuICAgICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgICAvLyB4LmNvbnN0cnVjdG9yLnVuZGVyZmxvdyA9IHRydWU7XHJcbiAgICAgICAgfSAvLyBlbHNlIHguY29uc3RydWN0b3IudW5kZXJmbG93ID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAvLyBaZXJvLlxyXG4gICAgICB4LmUgPSAwO1xyXG4gICAgICB4LmQgPSBbMF07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBQYXJzZSB0aGUgdmFsdWUgb2YgYSBuZXcgRGVjaW1hbCBgeGAgZnJvbSBhIHN0cmluZyBgc3RyYCwgd2hpY2ggaXMgbm90IGEgZGVjaW1hbCB2YWx1ZS5cclxuICAgKi9cclxuICBmdW5jdGlvbiBwYXJzZU90aGVyKHgsIHN0cikge1xyXG4gICAgdmFyIGJhc2UsIEN0b3IsIGRpdmlzb3IsIGksIGlzRmxvYXQsIGxlbiwgcCwgeGQsIHhlO1xyXG5cclxuICAgIGlmIChzdHIuaW5kZXhPZignXycpID4gLTEpIHtcclxuICAgICAgc3RyID0gc3RyLnJlcGxhY2UoLyhcXGQpXyg/PVxcZCkvZywgJyQxJyk7XHJcbiAgICAgIGlmIChpc0RlY2ltYWwudGVzdChzdHIpKSByZXR1cm4gcGFyc2VEZWNpbWFsKHgsIHN0cik7XHJcbiAgICB9IGVsc2UgaWYgKHN0ciA9PT0gJ0luZmluaXR5JyB8fCBzdHIgPT09ICdOYU4nKSB7XHJcbiAgICAgIGlmICghK3N0cikgeC5zID0gTmFOO1xyXG4gICAgICB4LmUgPSBOYU47XHJcbiAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgIHJldHVybiB4O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc0hleC50ZXN0KHN0cikpICB7XHJcbiAgICAgIGJhc2UgPSAxNjtcclxuICAgICAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9IGVsc2UgaWYgKGlzQmluYXJ5LnRlc3Qoc3RyKSkgIHtcclxuICAgICAgYmFzZSA9IDI7XHJcbiAgICB9IGVsc2UgaWYgKGlzT2N0YWwudGVzdChzdHIpKSAge1xyXG4gICAgICBiYXNlID0gODtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHN0cik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSXMgdGhlcmUgYSBiaW5hcnkgZXhwb25lbnQgcGFydD9cclxuICAgIGkgPSBzdHIuc2VhcmNoKC9wL2kpO1xyXG5cclxuICAgIGlmIChpID4gMCkge1xyXG4gICAgICBwID0gK3N0ci5zbGljZShpICsgMSk7XHJcbiAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMiwgaSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdHIgPSBzdHIuc2xpY2UoMik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29udmVydCBgc3RyYCBhcyBhbiBpbnRlZ2VyIHRoZW4gZGl2aWRlIHRoZSByZXN1bHQgYnkgYGJhc2VgIHJhaXNlZCB0byBhIHBvd2VyIHN1Y2ggdGhhdCB0aGVcclxuICAgIC8vIGZyYWN0aW9uIHBhcnQgd2lsbCBiZSByZXN0b3JlZC5cclxuICAgIGkgPSBzdHIuaW5kZXhPZignLicpO1xyXG4gICAgaXNGbG9hdCA9IGkgPj0gMDtcclxuICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmIChpc0Zsb2F0KSB7XHJcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgICBsZW4gPSBzdHIubGVuZ3RoO1xyXG4gICAgICBpID0gbGVuIC0gaTtcclxuXHJcbiAgICAgIC8vIGxvZ1sxMF0oMTYpID0gMS4yMDQxLi4uICwgbG9nWzEwXSg4OCkgPSAxLjk0NDQuLi4uXHJcbiAgICAgIGRpdmlzb3IgPSBpbnRQb3coQ3RvciwgbmV3IEN0b3IoYmFzZSksIGksIGkgKiAyKTtcclxuICAgIH1cclxuXHJcbiAgICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgYmFzZSwgQkFTRSk7XHJcbiAgICB4ZSA9IHhkLmxlbmd0aCAtIDE7XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgZm9yIChpID0geGU7IHhkW2ldID09PSAwOyAtLWkpIHhkLnBvcCgpO1xyXG4gICAgaWYgKGkgPCAwKSByZXR1cm4gbmV3IEN0b3IoeC5zICogMCk7XHJcbiAgICB4LmUgPSBnZXRCYXNlMTBFeHBvbmVudCh4ZCwgeGUpO1xyXG4gICAgeC5kID0geGQ7XHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAgIC8vIEF0IHdoYXQgcHJlY2lzaW9uIHRvIHBlcmZvcm0gdGhlIGRpdmlzaW9uIHRvIGVuc3VyZSBleGFjdCBjb252ZXJzaW9uP1xyXG4gICAgLy8gbWF4RGVjaW1hbEludGVnZXJQYXJ0RGlnaXRDb3VudCA9IGNlaWwobG9nWzEwXShiKSAqIG90aGVyQmFzZUludGVnZXJQYXJ0RGlnaXRDb3VudClcclxuICAgIC8vIGxvZ1sxMF0oMikgPSAwLjMwMTAzLCBsb2dbMTBdKDgpID0gMC45MDMwOSwgbG9nWzEwXSgxNikgPSAxLjIwNDEyXHJcbiAgICAvLyBFLmcuIGNlaWwoMS4yICogMykgPSA0LCBzbyB1cCB0byA0IGRlY2ltYWwgZGlnaXRzIGFyZSBuZWVkZWQgdG8gcmVwcmVzZW50IDMgaGV4IGludCBkaWdpdHMuXHJcbiAgICAvLyBtYXhEZWNpbWFsRnJhY3Rpb25QYXJ0RGlnaXRDb3VudCA9IHtIZXg6NHxPY3Q6M3xCaW46MX0gKiBvdGhlckJhc2VGcmFjdGlvblBhcnREaWdpdENvdW50XHJcbiAgICAvLyBUaGVyZWZvcmUgdXNpbmcgNCAqIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHN0ciB3aWxsIGFsd2F5cyBiZSBlbm91Z2guXHJcbiAgICBpZiAoaXNGbG9hdCkgeCA9IGRpdmlkZSh4LCBkaXZpc29yLCBsZW4gKiA0KTtcclxuXHJcbiAgICAvLyBNdWx0aXBseSBieSB0aGUgYmluYXJ5IGV4cG9uZW50IHBhcnQgaWYgcHJlc2VudC5cclxuICAgIGlmIChwKSB4ID0geC50aW1lcyhNYXRoLmFicyhwKSA8IDU0ID8gbWF0aHBvdygyLCBwKSA6IERlY2ltYWwucG93KDIsIHApKTtcclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIHNpbih4KSA9IHggLSB4XjMvMyEgKyB4XjUvNSEgLSAuLi5cclxuICAgKiB8eHwgPCBwaS8yXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBzaW5lKEN0b3IsIHgpIHtcclxuICAgIHZhciBrLFxyXG4gICAgICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICAgIGlmIChsZW4gPCAzKSB7XHJcbiAgICAgIHJldHVybiB4LmlzWmVybygpID8geCA6IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IHNpbig1eCkgPSAxNipzaW5eNSh4KSAtIDIwKnNpbl4zKHgpICsgNSpzaW4oeClcclxuICAgIC8vIGkuZS4gc2luKHgpID0gMTYqc2luXjUoeC81KSAtIDIwKnNpbl4zKHgvNSkgKyA1KnNpbih4LzUpXHJcbiAgICAvLyBhbmQgIHNpbih4KSA9IHNpbih4LzUpKDUgKyBzaW5eMih4LzUpKDE2c2luXjIoeC81KSAtIDIwKSlcclxuXHJcbiAgICAvLyBFc3RpbWF0ZSB0aGUgb3B0aW11bSBudW1iZXIgb2YgdGltZXMgdG8gdXNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uXHJcbiAgICBrID0gMS40ICogTWF0aC5zcXJ0KGxlbik7XHJcbiAgICBrID0gayA+IDE2ID8gMTYgOiBrIHwgMDtcclxuXHJcbiAgICB4ID0geC50aW1lcygxIC8gdGlueVBvdyg1LCBrKSk7XHJcbiAgICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDIsIHgsIHgpO1xyXG5cclxuICAgIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgICB2YXIgc2luMl94LFxyXG4gICAgICBkNSA9IG5ldyBDdG9yKDUpLFxyXG4gICAgICBkMTYgPSBuZXcgQ3RvcigxNiksXHJcbiAgICAgIGQyMCA9IG5ldyBDdG9yKDIwKTtcclxuICAgIGZvciAoOyBrLS07KSB7XHJcbiAgICAgIHNpbjJfeCA9IHgudGltZXMoeCk7XHJcbiAgICAgIHggPSB4LnRpbWVzKGQ1LnBsdXMoc2luMl94LnRpbWVzKGQxNi50aW1lcyhzaW4yX3gpLm1pbnVzKGQyMCkpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIFRheWxvciBzZXJpZXMgZm9yIGBjb3NgLCBgY29zaGAsIGBzaW5gIGFuZCBgc2luaGAuXHJcbiAgZnVuY3Rpb24gdGF5bG9yU2VyaWVzKEN0b3IsIG4sIHgsIHksIGlzSHlwZXJib2xpYykge1xyXG4gICAgdmFyIGosIHQsIHUsIHgyLFxyXG4gICAgICBpID0gMSxcclxuICAgICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgICAgayA9IE1hdGguY2VpbChwciAvIExPR19CQVNFKTtcclxuXHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgeDIgPSB4LnRpbWVzKHgpO1xyXG4gICAgdSA9IG5ldyBDdG9yKHkpO1xyXG5cclxuICAgIGZvciAoOzspIHtcclxuICAgICAgdCA9IGRpdmlkZSh1LnRpbWVzKHgyKSwgbmV3IEN0b3IobisrICogbisrKSwgcHIsIDEpO1xyXG4gICAgICB1ID0gaXNIeXBlcmJvbGljID8geS5wbHVzKHQpIDogeS5taW51cyh0KTtcclxuICAgICAgeSA9IGRpdmlkZSh0LnRpbWVzKHgyKSwgbmV3IEN0b3IobisrICogbisrKSwgcHIsIDEpO1xyXG4gICAgICB0ID0gdS5wbHVzKHkpO1xyXG5cclxuICAgICAgaWYgKHQuZFtrXSAhPT0gdm9pZCAwKSB7XHJcbiAgICAgICAgZm9yIChqID0gazsgdC5kW2pdID09PSB1LmRbal0gJiYgai0tOyk7XHJcbiAgICAgICAgaWYgKGogPT0gLTEpIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBqID0gdTtcclxuICAgICAgdSA9IHk7XHJcbiAgICAgIHkgPSB0O1xyXG4gICAgICB0ID0gajtcclxuICAgICAgaSsrO1xyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgIHQuZC5sZW5ndGggPSBrICsgMTtcclxuXHJcbiAgICByZXR1cm4gdDtcclxuICB9XHJcblxyXG5cclxuICAvLyBFeHBvbmVudCBlIG11c3QgYmUgcG9zaXRpdmUgYW5kIG5vbi16ZXJvLlxyXG4gIGZ1bmN0aW9uIHRpbnlQb3coYiwgZSkge1xyXG4gICAgdmFyIG4gPSBiO1xyXG4gICAgd2hpbGUgKC0tZSkgbiAqPSBiO1xyXG4gICAgcmV0dXJuIG47XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gUmV0dXJuIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiBgeGAgcmVkdWNlZCB0byBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gaGFsZiBwaS5cclxuICBmdW5jdGlvbiB0b0xlc3NUaGFuSGFsZlBpKEN0b3IsIHgpIHtcclxuICAgIHZhciB0LFxyXG4gICAgICBpc05lZyA9IHgucyA8IDAsXHJcbiAgICAgIHBpID0gZ2V0UGkoQ3RvciwgQ3Rvci5wcmVjaXNpb24sIDEpLFxyXG4gICAgICBoYWxmUGkgPSBwaS50aW1lcygwLjUpO1xyXG5cclxuICAgIHggPSB4LmFicygpO1xyXG5cclxuICAgIGlmICh4Lmx0ZShoYWxmUGkpKSB7XHJcbiAgICAgIHF1YWRyYW50ID0gaXNOZWcgPyA0IDogMTtcclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgdCA9IHguZGl2VG9JbnQocGkpO1xyXG5cclxuICAgIGlmICh0LmlzWmVybygpKSB7XHJcbiAgICAgIHF1YWRyYW50ID0gaXNOZWcgPyAzIDogMjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHggPSB4Lm1pbnVzKHQudGltZXMocGkpKTtcclxuXHJcbiAgICAgIC8vIDAgPD0geCA8IHBpXHJcbiAgICAgIGlmICh4Lmx0ZShoYWxmUGkpKSB7XHJcbiAgICAgICAgcXVhZHJhbnQgPSBpc09kZCh0KSA/IChpc05lZyA/IDIgOiAzKSA6IChpc05lZyA/IDQgOiAxKTtcclxuICAgICAgICByZXR1cm4geDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcXVhZHJhbnQgPSBpc09kZCh0KSA/IChpc05lZyA/IDEgOiA0KSA6IChpc05lZyA/IDMgOiAyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geC5taW51cyhwaSkuYWJzKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIERlY2ltYWwgYHhgIGFzIGEgc3RyaW5nIGluIGJhc2UgYGJhc2VPdXRgLlxyXG4gICAqXHJcbiAgICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCBpbmNsdWRlIGEgYmluYXJ5IGV4cG9uZW50IHN1ZmZpeC5cclxuICAgKi9cclxuICBmdW5jdGlvbiB0b1N0cmluZ0JpbmFyeSh4LCBiYXNlT3V0LCBzZCwgcm0pIHtcclxuICAgIHZhciBiYXNlLCBlLCBpLCBrLCBsZW4sIHJvdW5kVXAsIHN0ciwgeGQsIHksXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBpc0V4cCA9IHNkICE9PSB2b2lkIDA7XHJcblxyXG4gICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgIGNoZWNrSW50MzIoc2QsIDEsIE1BWF9ESUdJVFMpO1xyXG4gICAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2QgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSB7XHJcbiAgICAgIHN0ciA9IG5vbkZpbml0ZVRvU3RyaW5nKHgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgICAgIGkgPSBzdHIuaW5kZXhPZignLicpO1xyXG5cclxuICAgICAgLy8gVXNlIGV4cG9uZW50aWFsIG5vdGF0aW9uIGFjY29yZGluZyB0byBgdG9FeHBQb3NgIGFuZCBgdG9FeHBOZWdgPyBObywgYnV0IGlmIHJlcXVpcmVkOlxyXG4gICAgICAvLyBtYXhCaW5hcnlFeHBvbmVudCA9IGZsb29yKChkZWNpbWFsRXhwb25lbnQgKyAxKSAqIGxvZ1syXSgxMCkpXHJcbiAgICAgIC8vIG1pbkJpbmFyeUV4cG9uZW50ID0gZmxvb3IoZGVjaW1hbEV4cG9uZW50ICogbG9nWzJdKDEwKSlcclxuICAgICAgLy8gbG9nWzJdKDEwKSA9IDMuMzIxOTI4MDk0ODg3MzYyMzQ3ODcwMzE5NDI5NDg5MzkwMTc1ODY0XHJcblxyXG4gICAgICBpZiAoaXNFeHApIHtcclxuICAgICAgICBiYXNlID0gMjtcclxuICAgICAgICBpZiAoYmFzZU91dCA9PSAxNikge1xyXG4gICAgICAgICAgc2QgPSBzZCAqIDQgLSAzO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYmFzZU91dCA9PSA4KSB7XHJcbiAgICAgICAgICBzZCA9IHNkICogMyAtIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJhc2UgPSBiYXNlT3V0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDb252ZXJ0IHRoZSBudW1iZXIgYXMgYW4gaW50ZWdlciB0aGVuIGRpdmlkZSB0aGUgcmVzdWx0IGJ5IGl0cyBiYXNlIHJhaXNlZCB0byBhIHBvd2VyIHN1Y2hcclxuICAgICAgLy8gdGhhdCB0aGUgZnJhY3Rpb24gcGFydCB3aWxsIGJlIHJlc3RvcmVkLlxyXG5cclxuICAgICAgLy8gTm9uLWludGVnZXIuXHJcbiAgICAgIGlmIChpID49IDApIHtcclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuICAgICAgICB5ID0gbmV3IEN0b3IoMSk7XHJcbiAgICAgICAgeS5lID0gc3RyLmxlbmd0aCAtIGk7XHJcbiAgICAgICAgeS5kID0gY29udmVydEJhc2UoZmluaXRlVG9TdHJpbmcoeSksIDEwLCBiYXNlKTtcclxuICAgICAgICB5LmUgPSB5LmQubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgMTAsIGJhc2UpO1xyXG4gICAgICBlID0gbGVuID0geGQubGVuZ3RoO1xyXG5cclxuICAgICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKDsgeGRbLS1sZW5dID09IDA7KSB4ZC5wb3AoKTtcclxuXHJcbiAgICAgIGlmICgheGRbMF0pIHtcclxuICAgICAgICBzdHIgPSBpc0V4cCA/ICcwcCswJyA6ICcwJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgIGUtLTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeCA9IG5ldyBDdG9yKHgpO1xyXG4gICAgICAgICAgeC5kID0geGQ7XHJcbiAgICAgICAgICB4LmUgPSBlO1xyXG4gICAgICAgICAgeCA9IGRpdmlkZSh4LCB5LCBzZCwgcm0sIDAsIGJhc2UpO1xyXG4gICAgICAgICAgeGQgPSB4LmQ7XHJcbiAgICAgICAgICBlID0geC5lO1xyXG4gICAgICAgICAgcm91bmRVcCA9IGluZXhhY3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUaGUgcm91bmRpbmcgZGlnaXQsIGkuZS4gdGhlIGRpZ2l0IGFmdGVyIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwLlxyXG4gICAgICAgIGkgPSB4ZFtzZF07XHJcbiAgICAgICAgayA9IGJhc2UgLyAyO1xyXG4gICAgICAgIHJvdW5kVXAgPSByb3VuZFVwIHx8IHhkW3NkICsgMV0gIT09IHZvaWQgMDtcclxuXHJcbiAgICAgICAgcm91bmRVcCA9IHJtIDwgNFxyXG4gICAgICAgICAgPyAoaSAhPT0gdm9pZCAwIHx8IHJvdW5kVXApICYmIChybSA9PT0gMCB8fCBybSA9PT0gKHgucyA8IDAgPyAzIDogMikpXHJcbiAgICAgICAgICA6IGkgPiBrIHx8IGkgPT09IGsgJiYgKHJtID09PSA0IHx8IHJvdW5kVXAgfHwgcm0gPT09IDYgJiYgeGRbc2QgLSAxXSAmIDEgfHxcclxuICAgICAgICAgICAgcm0gPT09ICh4LnMgPCAwID8gOCA6IDcpKTtcclxuXHJcbiAgICAgICAgeGQubGVuZ3RoID0gc2Q7XHJcblxyXG4gICAgICAgIGlmIChyb3VuZFVwKSB7XHJcblxyXG4gICAgICAgICAgLy8gUm91bmRpbmcgdXAgbWF5IG1lYW4gdGhlIHByZXZpb3VzIGRpZ2l0IGhhcyB0byBiZSByb3VuZGVkIHVwIGFuZCBzbyBvbi5cclxuICAgICAgICAgIGZvciAoOyArK3hkWy0tc2RdID4gYmFzZSAtIDE7KSB7XHJcbiAgICAgICAgICAgIHhkW3NkXSA9IDA7XHJcbiAgICAgICAgICAgIGlmICghc2QpIHtcclxuICAgICAgICAgICAgICArK2U7XHJcbiAgICAgICAgICAgICAgeGQudW5zaGlmdCgxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICAgIGZvciAobGVuID0geGQubGVuZ3RoOyAheGRbbGVuIC0gMV07IC0tbGVuKTtcclxuXHJcbiAgICAgICAgLy8gRS5nLiBbNCwgMTEsIDE1XSBiZWNvbWVzIDRiZi5cclxuICAgICAgICBmb3IgKGkgPSAwLCBzdHIgPSAnJzsgaSA8IGxlbjsgaSsrKSBzdHIgKz0gTlVNRVJBTFMuY2hhckF0KHhkW2ldKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGJpbmFyeSBleHBvbmVudCBzdWZmaXg/XHJcbiAgICAgICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgICAgICBpZiAobGVuID4gMSkge1xyXG4gICAgICAgICAgICBpZiAoYmFzZU91dCA9PSAxNiB8fCBiYXNlT3V0ID09IDgpIHtcclxuICAgICAgICAgICAgICBpID0gYmFzZU91dCA9PSAxNiA/IDQgOiAzO1xyXG4gICAgICAgICAgICAgIGZvciAoLS1sZW47IGxlbiAlIGk7IGxlbisrKSBzdHIgKz0gJzAnO1xyXG4gICAgICAgICAgICAgIHhkID0gY29udmVydEJhc2Uoc3RyLCBiYXNlLCBiYXNlT3V0KTtcclxuICAgICAgICAgICAgICBmb3IgKGxlbiA9IHhkLmxlbmd0aDsgIXhkW2xlbiAtIDFdOyAtLWxlbik7XHJcblxyXG4gICAgICAgICAgICAgIC8vIHhkWzBdIHdpbGwgYWx3YXlzIGJlIGJlIDFcclxuICAgICAgICAgICAgICBmb3IgKGkgPSAxLCBzdHIgPSAnMS4nOyBpIDwgbGVuOyBpKyspIHN0ciArPSBOVU1FUkFMUy5jaGFyQXQoeGRbaV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzdHIgPSAgc3RyICsgKGUgPCAwID8gJ3AnIDogJ3ArJykgKyBlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZSA8IDApIHtcclxuICAgICAgICAgIGZvciAoOyArK2U7KSBzdHIgPSAnMCcgKyBzdHI7XHJcbiAgICAgICAgICBzdHIgPSAnMC4nICsgc3RyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKytlID4gbGVuKSBmb3IgKGUgLT0gbGVuOyBlLS0gOykgc3RyICs9ICcwJztcclxuICAgICAgICAgIGVsc2UgaWYgKGUgPCBsZW4pIHN0ciA9IHN0ci5zbGljZSgwLCBlKSArICcuJyArIHN0ci5zbGljZShlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN0ciA9IChiYXNlT3V0ID09IDE2ID8gJzB4JyA6IGJhc2VPdXQgPT0gMiA/ICcwYicgOiBiYXNlT3V0ID09IDggPyAnMG8nIDogJycpICsgc3RyO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4LnMgPCAwID8gJy0nICsgc3RyIDogc3RyO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIERvZXMgbm90IHN0cmlwIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZ1bmN0aW9uIHRydW5jYXRlKGFyciwgbGVuKSB7XHJcbiAgICBpZiAoYXJyLmxlbmd0aCA+IGxlbikge1xyXG4gICAgICBhcnIubGVuZ3RoID0gbGVuO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLyBEZWNpbWFsIG1ldGhvZHNcclxuXHJcblxyXG4gIC8qXHJcbiAgICogIGFic1xyXG4gICAqICBhY29zXHJcbiAgICogIGFjb3NoXHJcbiAgICogIGFkZFxyXG4gICAqICBhc2luXHJcbiAgICogIGFzaW5oXHJcbiAgICogIGF0YW5cclxuICAgKiAgYXRhbmhcclxuICAgKiAgYXRhbjJcclxuICAgKiAgY2JydFxyXG4gICAqICBjZWlsXHJcbiAgICogIGNsYW1wXHJcbiAgICogIGNsb25lXHJcbiAgICogIGNvbmZpZ1xyXG4gICAqICBjb3NcclxuICAgKiAgY29zaFxyXG4gICAqICBkaXZcclxuICAgKiAgZXhwXHJcbiAgICogIGZsb29yXHJcbiAgICogIGh5cG90XHJcbiAgICogIGxuXHJcbiAgICogIGxvZ1xyXG4gICAqICBsb2cyXHJcbiAgICogIGxvZzEwXHJcbiAgICogIG1heFxyXG4gICAqICBtaW5cclxuICAgKiAgbW9kXHJcbiAgICogIG11bFxyXG4gICAqICBwb3dcclxuICAgKiAgcmFuZG9tXHJcbiAgICogIHJvdW5kXHJcbiAgICogIHNldFxyXG4gICAqICBzaWduXHJcbiAgICogIHNpblxyXG4gICAqICBzaW5oXHJcbiAgICogIHNxcnRcclxuICAgKiAgc3ViXHJcbiAgICogIHN1bVxyXG4gICAqICB0YW5cclxuICAgKiAgdGFuaFxyXG4gICAqICB0cnVuY1xyXG4gICAqL1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgYHhgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYWJzKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5hYnMoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmNjb3NpbmUgaW4gcmFkaWFucyBvZiBgeGAuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBhY29zKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5hY29zKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgYHhgLCByb3VuZGVkIHRvXHJcbiAgICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYWNvc2goeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmFjb3NoKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3VtIG9mIGB4YCBhbmQgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBhZGQoeCwgeSkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLnBsdXMoeSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjc2luZSBpbiByYWRpYW5zIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBhc2luKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5hc2luKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gICAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGFzaW5oKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5hc2luaCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3RhbmdlbnQgaW4gcmFkaWFucyBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYXRhbih4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuYXRhbigpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBvZiBgeGAsIHJvdW5kZWQgdG9cclxuICAgKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBhdGFuaCh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuYXRhbmgoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IGluIHJhZGlhbnMgb2YgYHkveGAgaW4gdGhlIHJhbmdlIC1waSB0byBwaVxyXG4gICAqIChpbmNsdXNpdmUpLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbLXBpLCBwaV1cclxuICAgKlxyXG4gICAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIHktY29vcmRpbmF0ZS5cclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSB4LWNvb3JkaW5hdGUuXHJcbiAgICpcclxuICAgKiBhdGFuMijCsTAsIC0wKSAgICAgICAgICAgICAgID0gwrFwaVxyXG4gICAqIGF0YW4yKMKxMCwgKzApICAgICAgICAgICAgICAgPSDCsTBcclxuICAgKiBhdGFuMijCsTAsIC14KSAgICAgICAgICAgICAgID0gwrFwaSBmb3IgeCA+IDBcclxuICAgKiBhdGFuMijCsTAsIHgpICAgICAgICAgICAgICAgID0gwrEwIGZvciB4ID4gMFxyXG4gICAqIGF0YW4yKC15LCDCsTApICAgICAgICAgICAgICAgPSAtcGkvMiBmb3IgeSA+IDBcclxuICAgKiBhdGFuMih5LCDCsTApICAgICAgICAgICAgICAgID0gcGkvMiBmb3IgeSA+IDBcclxuICAgKiBhdGFuMijCsXksIC1JbmZpbml0eSkgICAgICAgID0gwrFwaSBmb3IgZmluaXRlIHkgPiAwXHJcbiAgICogYXRhbjIowrF5LCArSW5maW5pdHkpICAgICAgICA9IMKxMCBmb3IgZmluaXRlIHkgPiAwXHJcbiAgICogYXRhbjIowrFJbmZpbml0eSwgeCkgICAgICAgICA9IMKxcGkvMiBmb3IgZmluaXRlIHhcclxuICAgKiBhdGFuMijCsUluZmluaXR5LCAtSW5maW5pdHkpID0gwrEzKnBpLzRcclxuICAgKiBhdGFuMijCsUluZmluaXR5LCArSW5maW5pdHkpID0gwrFwaS80XHJcbiAgICogYXRhbjIoTmFOLCB4KSA9IE5hTlxyXG4gICAqIGF0YW4yKHksIE5hTikgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGF0YW4yKHksIHgpIHtcclxuICAgIHkgPSBuZXcgdGhpcyh5KTtcclxuICAgIHggPSBuZXcgdGhpcyh4KTtcclxuICAgIHZhciByLFxyXG4gICAgICBwciA9IHRoaXMucHJlY2lzaW9uLFxyXG4gICAgICBybSA9IHRoaXMucm91bmRpbmcsXHJcbiAgICAgIHdwciA9IHByICsgNDtcclxuXHJcbiAgICAvLyBFaXRoZXIgTmFOXHJcbiAgICBpZiAoIXkucyB8fCAheC5zKSB7XHJcbiAgICAgIHIgPSBuZXcgdGhpcyhOYU4pO1xyXG5cclxuICAgIC8vIEJvdGggwrFJbmZpbml0eVxyXG4gICAgfSBlbHNlIGlmICgheS5kICYmICF4LmQpIHtcclxuICAgICAgciA9IGdldFBpKHRoaXMsIHdwciwgMSkudGltZXMoeC5zID4gMCA/IDAuMjUgOiAwLjc1KTtcclxuICAgICAgci5zID0geS5zO1xyXG5cclxuICAgIC8vIHggaXMgwrFJbmZpbml0eSBvciB5IGlzIMKxMFxyXG4gICAgfSBlbHNlIGlmICgheC5kIHx8IHkuaXNaZXJvKCkpIHtcclxuICAgICAgciA9IHgucyA8IDAgPyBnZXRQaSh0aGlzLCBwciwgcm0pIDogbmV3IHRoaXMoMCk7XHJcbiAgICAgIHIucyA9IHkucztcclxuXHJcbiAgICAvLyB5IGlzIMKxSW5maW5pdHkgb3IgeCBpcyDCsTBcclxuICAgIH0gZWxzZSBpZiAoIXkuZCB8fCB4LmlzWmVybygpKSB7XHJcbiAgICAgIHIgPSBnZXRQaSh0aGlzLCB3cHIsIDEpLnRpbWVzKDAuNSk7XHJcbiAgICAgIHIucyA9IHkucztcclxuXHJcbiAgICAvLyBCb3RoIG5vbi16ZXJvIGFuZCBmaW5pdGVcclxuICAgIH0gZWxzZSBpZiAoeC5zIDwgMCkge1xyXG4gICAgICB0aGlzLnByZWNpc2lvbiA9IHdwcjtcclxuICAgICAgdGhpcy5yb3VuZGluZyA9IDE7XHJcbiAgICAgIHIgPSB0aGlzLmF0YW4oZGl2aWRlKHksIHgsIHdwciwgMSkpO1xyXG4gICAgICB4ID0gZ2V0UGkodGhpcywgd3ByLCAxKTtcclxuICAgICAgdGhpcy5wcmVjaXNpb24gPSBwcjtcclxuICAgICAgdGhpcy5yb3VuZGluZyA9IHJtO1xyXG4gICAgICByID0geS5zIDwgMCA/IHIubWludXMoeCkgOiByLnBsdXMoeCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByID0gdGhpcy5hdGFuKGRpdmlkZSh5LCB4LCB3cHIsIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcjtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjdWJlIHJvb3Qgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNicnQoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmNicnQoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZGVkIHRvIGFuIGludGVnZXIgdXNpbmcgYFJPVU5EX0NFSUxgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY2VpbCh4KSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAyKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBjbGFtcGVkIHRvIHRoZSByYW5nZSBkZWxpbmVhdGVkIGJ5IGBtaW5gIGFuZCBgbWF4YC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKiBtaW4ge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKiBtYXgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNsYW1wKHgsIG1pbiwgbWF4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuY2xhbXAobWluLCBtYXgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogQ29uZmlndXJlIGdsb2JhbCBzZXR0aW5ncyBmb3IgYSBEZWNpbWFsIGNvbnN0cnVjdG9yLlxyXG4gICAqXHJcbiAgICogYG9iamAgaXMgYW4gb2JqZWN0IHdpdGggb25lIG9yIG1vcmUgb2YgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzLFxyXG4gICAqXHJcbiAgICogICBwcmVjaXNpb24gIHtudW1iZXJ9XHJcbiAgICogICByb3VuZGluZyAgIHtudW1iZXJ9XHJcbiAgICogICB0b0V4cE5lZyAgIHtudW1iZXJ9XHJcbiAgICogICB0b0V4cFBvcyAgIHtudW1iZXJ9XHJcbiAgICogICBtYXhFICAgICAgIHtudW1iZXJ9XHJcbiAgICogICBtaW5FICAgICAgIHtudW1iZXJ9XHJcbiAgICogICBtb2R1bG8gICAgIHtudW1iZXJ9XHJcbiAgICogICBjcnlwdG8gICAgIHtib29sZWFufG51bWJlcn1cclxuICAgKiAgIGRlZmF1bHRzICAge3RydWV9XHJcbiAgICpcclxuICAgKiBFLmcuIERlY2ltYWwuY29uZmlnKHsgcHJlY2lzaW9uOiAyMCwgcm91bmRpbmc6IDQgfSlcclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNvbmZpZyhvYmopIHtcclxuICAgIGlmICghb2JqIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB0aHJvdyBFcnJvcihkZWNpbWFsRXJyb3IgKyAnT2JqZWN0IGV4cGVjdGVkJyk7XHJcbiAgICB2YXIgaSwgcCwgdixcclxuICAgICAgdXNlRGVmYXVsdHMgPSBvYmouZGVmYXVsdHMgPT09IHRydWUsXHJcbiAgICAgIHBzID0gW1xyXG4gICAgICAgICdwcmVjaXNpb24nLCAxLCBNQVhfRElHSVRTLFxyXG4gICAgICAgICdyb3VuZGluZycsIDAsIDgsXHJcbiAgICAgICAgJ3RvRXhwTmVnJywgLUVYUF9MSU1JVCwgMCxcclxuICAgICAgICAndG9FeHBQb3MnLCAwLCBFWFBfTElNSVQsXHJcbiAgICAgICAgJ21heEUnLCAwLCBFWFBfTElNSVQsXHJcbiAgICAgICAgJ21pbkUnLCAtRVhQX0xJTUlULCAwLFxyXG4gICAgICAgICdtb2R1bG8nLCAwLCA5XHJcbiAgICAgIF07XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHBzLmxlbmd0aDsgaSArPSAzKSB7XHJcbiAgICAgIGlmIChwID0gcHNbaV0sIHVzZURlZmF1bHRzKSB0aGlzW3BdID0gREVGQVVMVFNbcF07XHJcbiAgICAgIGlmICgodiA9IG9ialtwXSkgIT09IHZvaWQgMCkge1xyXG4gICAgICAgIGlmIChtYXRoZmxvb3IodikgPT09IHYgJiYgdiA+PSBwc1tpICsgMV0gJiYgdiA8PSBwc1tpICsgMl0pIHRoaXNbcF0gPSB2O1xyXG4gICAgICAgIGVsc2UgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgcCArICc6ICcgKyB2KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChwID0gJ2NyeXB0bycsIHVzZURlZmF1bHRzKSB0aGlzW3BdID0gREVGQVVMVFNbcF07XHJcbiAgICBpZiAoKHYgPSBvYmpbcF0pICE9PSB2b2lkIDApIHtcclxuICAgICAgaWYgKHYgPT09IHRydWUgfHwgdiA9PT0gZmFsc2UgfHwgdiA9PT0gMCB8fCB2ID09PSAxKSB7XHJcbiAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgY3J5cHRvICE9ICd1bmRlZmluZWQnICYmIGNyeXB0byAmJlxyXG4gICAgICAgICAgICAoY3J5cHRvLmdldFJhbmRvbVZhbHVlcyB8fCBjcnlwdG8ucmFuZG9tQnl0ZXMpKSB7XHJcbiAgICAgICAgICAgIHRoaXNbcF0gPSB0cnVlO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoY3J5cHRvVW5hdmFpbGFibGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzW3BdID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHAgKyAnOiAnICsgdik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjb3NpbmUgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY29zKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5jb3MoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIGNvc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gcHJlY2lzaW9uXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY29zaCh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuY29zaCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogQ3JlYXRlIGFuZCByZXR1cm4gYSBEZWNpbWFsIGNvbnN0cnVjdG9yIHdpdGggdGhlIHNhbWUgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFzIHRoaXMgRGVjaW1hbFxyXG4gICAqIGNvbnN0cnVjdG9yLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY2xvbmUob2JqKSB7XHJcbiAgICB2YXIgaSwgcCwgcHM7XHJcblxyXG4gICAgLypcclxuICAgICAqIFRoZSBEZWNpbWFsIGNvbnN0cnVjdG9yIGFuZCBleHBvcnRlZCBmdW5jdGlvbi5cclxuICAgICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIGluc3RhbmNlLlxyXG4gICAgICpcclxuICAgICAqIHYge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSBudW1lcmljIHZhbHVlLlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRGVjaW1hbCh2KSB7XHJcbiAgICAgIHZhciBlLCBpLCB0LFxyXG4gICAgICAgIHggPSB0aGlzO1xyXG5cclxuICAgICAgLy8gRGVjaW1hbCBjYWxsZWQgd2l0aG91dCBuZXcuXHJcbiAgICAgIGlmICghKHggaW5zdGFuY2VvZiBEZWNpbWFsKSkgcmV0dXJuIG5ldyBEZWNpbWFsKHYpO1xyXG5cclxuICAgICAgLy8gUmV0YWluIGEgcmVmZXJlbmNlIHRvIHRoaXMgRGVjaW1hbCBjb25zdHJ1Y3RvciwgYW5kIHNoYWRvdyBEZWNpbWFsLnByb3RvdHlwZS5jb25zdHJ1Y3RvclxyXG4gICAgICAvLyB3aGljaCBwb2ludHMgdG8gT2JqZWN0LlxyXG4gICAgICB4LmNvbnN0cnVjdG9yID0gRGVjaW1hbDtcclxuXHJcbiAgICAgIC8vIER1cGxpY2F0ZS5cclxuICAgICAgaWYgKGlzRGVjaW1hbEluc3RhbmNlKHYpKSB7XHJcbiAgICAgICAgeC5zID0gdi5zO1xyXG5cclxuICAgICAgICBpZiAoZXh0ZXJuYWwpIHtcclxuICAgICAgICAgIGlmICghdi5kIHx8IHYuZSA+IERlY2ltYWwubWF4RSkge1xyXG5cclxuICAgICAgICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgICAgICAgIHguZSA9IE5hTjtcclxuICAgICAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSBpZiAodi5lIDwgRGVjaW1hbC5taW5FKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4LmUgPSB2LmU7XHJcbiAgICAgICAgICAgIHguZCA9IHYuZC5zbGljZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4LmUgPSB2LmU7XHJcbiAgICAgICAgICB4LmQgPSB2LmQgPyB2LmQuc2xpY2UoKSA6IHYuZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdCA9IHR5cGVvZiB2O1xyXG5cclxuICAgICAgaWYgKHQgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgaWYgKHYgPT09IDApIHtcclxuICAgICAgICAgIHgucyA9IDEgLyB2IDwgMCA/IC0xIDogMTtcclxuICAgICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodiA8IDApIHtcclxuICAgICAgICAgIHYgPSAtdjtcclxuICAgICAgICAgIHgucyA9IC0xO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4LnMgPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBzbWFsbCBpbnRlZ2Vycy5cclxuICAgICAgICBpZiAodiA9PT0gfn52ICYmIHYgPCAxZTcpIHtcclxuICAgICAgICAgIGZvciAoZSA9IDAsIGkgPSB2OyBpID49IDEwOyBpIC89IDEwKSBlKys7XHJcblxyXG4gICAgICAgICAgaWYgKGV4dGVybmFsKSB7XHJcbiAgICAgICAgICAgIGlmIChlID4gRGVjaW1hbC5tYXhFKSB7XHJcbiAgICAgICAgICAgICAgeC5lID0gTmFOO1xyXG4gICAgICAgICAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZSA8IERlY2ltYWwubWluRSkge1xyXG4gICAgICAgICAgICAgIHguZSA9IDA7XHJcbiAgICAgICAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHguZSA9IGU7XHJcbiAgICAgICAgICAgICAgeC5kID0gW3ZdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB4LmUgPSBlO1xyXG4gICAgICAgICAgICB4LmQgPSBbdl07XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBJbmZpbml0eSwgTmFOLlxyXG4gICAgICAgIH0gZWxzZSBpZiAodiAqIDAgIT09IDApIHtcclxuICAgICAgICAgIGlmICghdikgeC5zID0gTmFOO1xyXG4gICAgICAgICAgeC5lID0gTmFOO1xyXG4gICAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZURlY2ltYWwoeCwgdi50b1N0cmluZygpKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAodCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyB2KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gTWludXMgc2lnbj9cclxuICAgICAgaWYgKChpID0gdi5jaGFyQ29kZUF0KDApKSA9PT0gNDUpIHtcclxuICAgICAgICB2ID0gdi5zbGljZSgxKTtcclxuICAgICAgICB4LnMgPSAtMTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBQbHVzIHNpZ24/XHJcbiAgICAgICAgaWYgKGkgPT09IDQzKSB2ID0gdi5zbGljZSgxKTtcclxuICAgICAgICB4LnMgPSAxO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaXNEZWNpbWFsLnRlc3QodikgPyBwYXJzZURlY2ltYWwoeCwgdikgOiBwYXJzZU90aGVyKHgsIHYpO1xyXG4gICAgfVxyXG5cclxuICAgIERlY2ltYWwucHJvdG90eXBlID0gUDtcclxuXHJcbiAgICBEZWNpbWFsLlJPVU5EX1VQID0gMDtcclxuICAgIERlY2ltYWwuUk9VTkRfRE9XTiA9IDE7XHJcbiAgICBEZWNpbWFsLlJPVU5EX0NFSUwgPSAyO1xyXG4gICAgRGVjaW1hbC5ST1VORF9GTE9PUiA9IDM7XHJcbiAgICBEZWNpbWFsLlJPVU5EX0hBTEZfVVAgPSA0O1xyXG4gICAgRGVjaW1hbC5ST1VORF9IQUxGX0RPV04gPSA1O1xyXG4gICAgRGVjaW1hbC5ST1VORF9IQUxGX0VWRU4gPSA2O1xyXG4gICAgRGVjaW1hbC5ST1VORF9IQUxGX0NFSUwgPSA3O1xyXG4gICAgRGVjaW1hbC5ST1VORF9IQUxGX0ZMT09SID0gODtcclxuICAgIERlY2ltYWwuRVVDTElEID0gOTtcclxuXHJcbiAgICBEZWNpbWFsLmNvbmZpZyA9IERlY2ltYWwuc2V0ID0gY29uZmlnO1xyXG4gICAgRGVjaW1hbC5jbG9uZSA9IGNsb25lO1xyXG4gICAgRGVjaW1hbC5pc0RlY2ltYWwgPSBpc0RlY2ltYWxJbnN0YW5jZTtcclxuXHJcbiAgICBEZWNpbWFsLmFicyA9IGFicztcclxuICAgIERlY2ltYWwuYWNvcyA9IGFjb3M7XHJcbiAgICBEZWNpbWFsLmFjb3NoID0gYWNvc2g7ICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwuYWRkID0gYWRkO1xyXG4gICAgRGVjaW1hbC5hc2luID0gYXNpbjtcclxuICAgIERlY2ltYWwuYXNpbmggPSBhc2luaDsgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC5hdGFuID0gYXRhbjtcclxuICAgIERlY2ltYWwuYXRhbmggPSBhdGFuaDsgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC5hdGFuMiA9IGF0YW4yO1xyXG4gICAgRGVjaW1hbC5jYnJ0ID0gY2JydDsgICAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLmNlaWwgPSBjZWlsO1xyXG4gICAgRGVjaW1hbC5jbGFtcCA9IGNsYW1wO1xyXG4gICAgRGVjaW1hbC5jb3MgPSBjb3M7XHJcbiAgICBEZWNpbWFsLmNvc2ggPSBjb3NoOyAgICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwuZGl2ID0gZGl2O1xyXG4gICAgRGVjaW1hbC5leHAgPSBleHA7XHJcbiAgICBEZWNpbWFsLmZsb29yID0gZmxvb3I7XHJcbiAgICBEZWNpbWFsLmh5cG90ID0gaHlwb3Q7ICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwubG4gPSBsbjtcclxuICAgIERlY2ltYWwubG9nID0gbG9nO1xyXG4gICAgRGVjaW1hbC5sb2cxMCA9IGxvZzEwOyAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLmxvZzIgPSBsb2cyOyAgICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwubWF4ID0gbWF4O1xyXG4gICAgRGVjaW1hbC5taW4gPSBtaW47XHJcbiAgICBEZWNpbWFsLm1vZCA9IG1vZDtcclxuICAgIERlY2ltYWwubXVsID0gbXVsO1xyXG4gICAgRGVjaW1hbC5wb3cgPSBwb3c7XHJcbiAgICBEZWNpbWFsLnJhbmRvbSA9IHJhbmRvbTtcclxuICAgIERlY2ltYWwucm91bmQgPSByb3VuZDtcclxuICAgIERlY2ltYWwuc2lnbiA9IHNpZ247ICAgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC5zaW4gPSBzaW47XHJcbiAgICBEZWNpbWFsLnNpbmggPSBzaW5oOyAgICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwuc3FydCA9IHNxcnQ7XHJcbiAgICBEZWNpbWFsLnN1YiA9IHN1YjtcclxuICAgIERlY2ltYWwuc3VtID0gc3VtO1xyXG4gICAgRGVjaW1hbC50YW4gPSB0YW47XHJcbiAgICBEZWNpbWFsLnRhbmggPSB0YW5oOyAgICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwudHJ1bmMgPSB0cnVuYzsgICAgICAgIC8vIEVTNlxyXG5cclxuICAgIGlmIChvYmogPT09IHZvaWQgMCkgb2JqID0ge307XHJcbiAgICBpZiAob2JqKSB7XHJcbiAgICAgIGlmIChvYmouZGVmYXVsdHMgIT09IHRydWUpIHtcclxuICAgICAgICBwcyA9IFsncHJlY2lzaW9uJywgJ3JvdW5kaW5nJywgJ3RvRXhwTmVnJywgJ3RvRXhwUG9zJywgJ21heEUnLCAnbWluRScsICdtb2R1bG8nLCAnY3J5cHRvJ107XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHBzLmxlbmd0aDspIGlmICghb2JqLmhhc093blByb3BlcnR5KHAgPSBwc1tpKytdKSkgb2JqW3BdID0gdGhpc1twXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIERlY2ltYWwuY29uZmlnKG9iaik7XHJcblxyXG4gICAgcmV0dXJuIERlY2ltYWw7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgZGl2aWRlZCBieSBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICAgKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGRpdih4LCB5KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuZGl2KHkpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgZXhwb25lbnRpYWwgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIHBvd2VyIHRvIHdoaWNoIHRvIHJhaXNlIHRoZSBiYXNlIG9mIHRoZSBuYXR1cmFsIGxvZy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGV4cCh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuZXhwKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgcm91bmQgdG8gYW4gaW50ZWdlciB1c2luZyBgUk9VTkRfRkxPT1JgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZmxvb3IoeCkge1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgMyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHN1bSBvZiB0aGUgc3F1YXJlcyBvZiB0aGUgYXJndW1lbnRzLFxyXG4gICAqIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIGh5cG90KGEsIGIsIC4uLikgPSBzcXJ0KGFeMiArIGJeMiArIC4uLilcclxuICAgKlxyXG4gICAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gaHlwb3QoKSB7XHJcbiAgICB2YXIgaSwgbixcclxuICAgICAgdCA9IG5ldyB0aGlzKDApO1xyXG5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7KSB7XHJcbiAgICAgIG4gPSBuZXcgdGhpcyhhcmd1bWVudHNbaSsrXSk7XHJcbiAgICAgIGlmICghbi5kKSB7XHJcbiAgICAgICAgaWYgKG4ucykge1xyXG4gICAgICAgICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKDEgLyAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdCA9IG47XHJcbiAgICAgIH0gZWxzZSBpZiAodC5kKSB7XHJcbiAgICAgICAgdCA9IHQucGx1cyhuLnRpbWVzKG4pKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gdC5zcXJ0KCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiBvYmplY3QgaXMgYSBEZWNpbWFsIGluc3RhbmNlICh3aGVyZSBEZWNpbWFsIGlzIGFueSBEZWNpbWFsIGNvbnN0cnVjdG9yKSxcclxuICAgKiBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gaXNEZWNpbWFsSW5zdGFuY2Uob2JqKSB7XHJcbiAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRGVjaW1hbCB8fCBvYmogJiYgb2JqLnRvU3RyaW5nVGFnID09PSB0YWcgfHwgZmFsc2U7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGxuKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5sbigpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGxvZyBvZiBgeGAgdG8gdGhlIGJhc2UgYHlgLCBvciB0byBiYXNlIDEwIGlmIG5vIGJhc2VcclxuICAgKiBpcyBzcGVjaWZpZWQsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIGxvZ1t5XSh4KVxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYXJndW1lbnQgb2YgdGhlIGxvZ2FyaXRobS5cclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBiYXNlIG9mIHRoZSBsb2dhcml0aG0uXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBsb2coeCwgeSkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmxvZyh5KTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBiYXNlIDIgbG9nYXJpdGhtIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBsb2cyKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5sb2coMik7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYmFzZSAxMCBsb2dhcml0aG0gb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGxvZzEwKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5sb2coMTApO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1heGltdW0gb2YgdGhlIGFyZ3VtZW50cy5cclxuICAgKlxyXG4gICAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbWF4KCkge1xyXG4gICAgcmV0dXJuIG1heE9yTWluKHRoaXMsIGFyZ3VtZW50cywgJ2x0Jyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbWluaW11bSBvZiB0aGUgYXJndW1lbnRzLlxyXG4gICAqXHJcbiAgICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBtaW4oKSB7XHJcbiAgICByZXR1cm4gbWF4T3JNaW4odGhpcywgYXJndW1lbnRzLCAnZ3QnKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBtb2R1bG8gYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gICAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBtb2QoeCwgeSkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLm1vZCh5KTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBtdWx0aXBsaWVkIGJ5IGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbXVsKHgsIHkpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5tdWwoeSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgcmFpc2VkIHRvIHRoZSBwb3dlciBgeWAsIHJvdW5kZWQgdG8gcHJlY2lzaW9uXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIGJhc2UuXHJcbiAgICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgZXhwb25lbnQuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBwb3coeCwgeSkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLnBvdyh5KTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybnMgYSBuZXcgRGVjaW1hbCB3aXRoIGEgcmFuZG9tIHZhbHVlIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiAwIGFuZCBsZXNzIHRoYW4gMSwgYW5kIHdpdGhcclxuICAgKiBgc2RgLCBvciBgRGVjaW1hbC5wcmVjaXNpb25gIGlmIGBzZGAgaXMgb21pdHRlZCwgc2lnbmlmaWNhbnQgZGlnaXRzIChvciBsZXNzIGlmIHRyYWlsaW5nIHplcm9zXHJcbiAgICogYXJlIHByb2R1Y2VkKS5cclxuICAgKlxyXG4gICAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAwIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcmFuZG9tKHNkKSB7XHJcbiAgICB2YXIgZCwgZSwgaywgbixcclxuICAgICAgaSA9IDAsXHJcbiAgICAgIHIgPSBuZXcgdGhpcygxKSxcclxuICAgICAgcmQgPSBbXTtcclxuXHJcbiAgICBpZiAoc2QgPT09IHZvaWQgMCkgc2QgPSB0aGlzLnByZWNpc2lvbjtcclxuICAgIGVsc2UgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgayA9IE1hdGguY2VpbChzZCAvIExPR19CQVNFKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuY3J5cHRvKSB7XHJcbiAgICAgIGZvciAoOyBpIDwgazspIHJkW2krK10gPSBNYXRoLnJhbmRvbSgpICogMWU3IHwgMDtcclxuXHJcbiAgICAvLyBCcm93c2VycyBzdXBwb3J0aW5nIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuXHJcbiAgICB9IGVsc2UgaWYgKGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcclxuICAgICAgZCA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQzMkFycmF5KGspKTtcclxuXHJcbiAgICAgIGZvciAoOyBpIDwgazspIHtcclxuICAgICAgICBuID0gZFtpXTtcclxuXHJcbiAgICAgICAgLy8gMCA8PSBuIDwgNDI5NDk2NzI5NlxyXG4gICAgICAgIC8vIFByb2JhYmlsaXR5IG4gPj0gNC4yOWU5LCBpcyA0OTY3Mjk2IC8gNDI5NDk2NzI5NiA9IDAuMDAxMTYgKDEgaW4gODY1KS5cclxuICAgICAgICBpZiAobiA+PSA0LjI5ZTkpIHtcclxuICAgICAgICAgIGRbaV0gPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheSgxKSlbMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAvLyAwIDw9IG4gPD0gNDI4OTk5OTk5OVxyXG4gICAgICAgICAgLy8gMCA8PSAobiAlIDFlNykgPD0gOTk5OTk5OVxyXG4gICAgICAgICAgcmRbaSsrXSA9IG4gJSAxZTc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgLy8gTm9kZS5qcyBzdXBwb3J0aW5nIGNyeXB0by5yYW5kb21CeXRlcy5cclxuICAgIH0gZWxzZSBpZiAoY3J5cHRvLnJhbmRvbUJ5dGVzKSB7XHJcblxyXG4gICAgICAvLyBidWZmZXJcclxuICAgICAgZCA9IGNyeXB0by5yYW5kb21CeXRlcyhrICo9IDQpO1xyXG5cclxuICAgICAgZm9yICg7IGkgPCBrOykge1xyXG5cclxuICAgICAgICAvLyAwIDw9IG4gPCAyMTQ3NDgzNjQ4XHJcbiAgICAgICAgbiA9IGRbaV0gKyAoZFtpICsgMV0gPDwgOCkgKyAoZFtpICsgMl0gPDwgMTYpICsgKChkW2kgKyAzXSAmIDB4N2YpIDw8IDI0KTtcclxuXHJcbiAgICAgICAgLy8gUHJvYmFiaWxpdHkgbiA+PSAyLjE0ZTksIGlzIDc0ODM2NDggLyAyMTQ3NDgzNjQ4ID0gMC4wMDM1ICgxIGluIDI4NikuXHJcbiAgICAgICAgaWYgKG4gPj0gMi4xNGU5KSB7XHJcbiAgICAgICAgICBjcnlwdG8ucmFuZG9tQnl0ZXMoNCkuY29weShkLCBpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIDAgPD0gbiA8PSAyMTM5OTk5OTk5XHJcbiAgICAgICAgICAvLyAwIDw9IChuICUgMWU3KSA8PSA5OTk5OTk5XHJcbiAgICAgICAgICByZC5wdXNoKG4gJSAxZTcpO1xyXG4gICAgICAgICAgaSArPSA0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaSA9IGsgLyA0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgRXJyb3IoY3J5cHRvVW5hdmFpbGFibGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGsgPSByZFstLWldO1xyXG4gICAgc2QgJT0gTE9HX0JBU0U7XHJcblxyXG4gICAgLy8gQ29udmVydCB0cmFpbGluZyBkaWdpdHMgdG8gemVyb3MgYWNjb3JkaW5nIHRvIHNkLlxyXG4gICAgaWYgKGsgJiYgc2QpIHtcclxuICAgICAgbiA9IG1hdGhwb3coMTAsIExPR19CQVNFIC0gc2QpO1xyXG4gICAgICByZFtpXSA9IChrIC8gbiB8IDApICogbjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgdHJhaWxpbmcgd29yZHMgd2hpY2ggYXJlIHplcm8uXHJcbiAgICBmb3IgKDsgcmRbaV0gPT09IDA7IGktLSkgcmQucG9wKCk7XHJcblxyXG4gICAgLy8gWmVybz9cclxuICAgIGlmIChpIDwgMCkge1xyXG4gICAgICBlID0gMDtcclxuICAgICAgcmQgPSBbMF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlID0gLTE7XHJcblxyXG4gICAgICAvLyBSZW1vdmUgbGVhZGluZyB3b3JkcyB3aGljaCBhcmUgemVybyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gICAgICBmb3IgKDsgcmRbMF0gPT09IDA7IGUgLT0gTE9HX0JBU0UpIHJkLnNoaWZ0KCk7XHJcblxyXG4gICAgICAvLyBDb3VudCB0aGUgZGlnaXRzIG9mIHRoZSBmaXJzdCB3b3JkIG9mIHJkIHRvIGRldGVybWluZSBsZWFkaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKGsgPSAxLCBuID0gcmRbMF07IG4gPj0gMTA7IG4gLz0gMTApIGsrKztcclxuXHJcbiAgICAgIC8vIEFkanVzdCB0aGUgZXhwb25lbnQgZm9yIGxlYWRpbmcgemVyb3Mgb2YgdGhlIGZpcnN0IHdvcmQgb2YgcmQuXHJcbiAgICAgIGlmIChrIDwgTE9HX0JBU0UpIGUgLT0gTE9HX0JBU0UgLSBrO1xyXG4gICAgfVxyXG5cclxuICAgIHIuZSA9IGU7XHJcbiAgICByLmQgPSByZDtcclxuXHJcbiAgICByZXR1cm4gcjtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCByb3VuZGVkIHRvIGFuIGludGVnZXIgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogVG8gZW11bGF0ZSBgTWF0aC5yb3VuZGAsIHNldCByb3VuZGluZyB0byA3IChST1VORF9IQUxGX0NFSUwpLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcm91bmQoeCkge1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgdGhpcy5yb3VuZGluZyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm5cclxuICAgKiAgIDEgICAgaWYgeCA+IDAsXHJcbiAgICogIC0xICAgIGlmIHggPCAwLFxyXG4gICAqICAgMCAgICBpZiB4IGlzIDAsXHJcbiAgICogIC0wICAgIGlmIHggaXMgLTAsXHJcbiAgICogICBOYU4gIG90aGVyd2lzZVxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc2lnbih4KSB7XHJcbiAgICB4ID0gbmV3IHRoaXMoeCk7XHJcbiAgICByZXR1cm4geC5kID8gKHguZFswXSA/IHgucyA6IDAgKiB4LnMpIDogeC5zIHx8IE5hTjtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzaW5lIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICAgKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHNpbih4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuc2luKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHNpbmgoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLnNpbmgoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICAgKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc3FydCh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuc3FydCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIG1pbnVzIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICAgKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc3ViKHgsIHkpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5zdWIoeSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3VtIG9mIHRoZSBhcmd1bWVudHMsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogT25seSB0aGUgcmVzdWx0IGlzIHJvdW5kZWQsIG5vdCB0aGUgaW50ZXJtZWRpYXRlIGNhbGN1bGF0aW9ucy5cclxuICAgKlxyXG4gICAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc3VtKCkge1xyXG4gICAgdmFyIGkgPSAwLFxyXG4gICAgICBhcmdzID0gYXJndW1lbnRzLFxyXG4gICAgICB4ID0gbmV3IHRoaXMoYXJnc1tpXSk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgIGZvciAoOyB4LnMgJiYgKytpIDwgYXJncy5sZW5ndGg7KSB4ID0geC5wbHVzKGFyZ3NbaV0pO1xyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZSh4LCB0aGlzLnByZWNpc2lvbiwgdGhpcy5yb3VuZGluZyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdGFuZ2VudCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICAgKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiB0YW4oeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLnRhbigpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiB0YW5oKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS50YW5oKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgdHJ1bmNhdGVkIHRvIGFuIGludGVnZXIuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiB0cnVuYyh4KSB7XHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCA9IG5ldyB0aGlzKHgpLCB4LmUgKyAxLCAxKTtcclxuICB9XHJcblxyXG5cclxuICAvLyBDcmVhdGUgYW5kIGNvbmZpZ3VyZSBpbml0aWFsIERlY2ltYWwgY29uc3RydWN0b3IuXHJcbiAgRGVjaW1hbCA9IGNsb25lKERFRkFVTFRTKTtcclxuICBEZWNpbWFsLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IERlY2ltYWw7XHJcbiAgRGVjaW1hbFsnZGVmYXVsdCddID0gRGVjaW1hbC5EZWNpbWFsID0gRGVjaW1hbDtcclxuXHJcbiAgLy8gQ3JlYXRlIHRoZSBpbnRlcm5hbCBjb25zdGFudHMgZnJvbSB0aGVpciBzdHJpbmcgdmFsdWVzLlxyXG4gIExOMTAgPSBuZXcgRGVjaW1hbChMTjEwKTtcclxuICBQSSA9IG5ldyBEZWNpbWFsKFBJKTtcclxuXHJcblxyXG4gIC8vIEV4cG9ydC5cclxuXHJcblxyXG4gIC8vIEFNRC5cclxuICBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBEZWNpbWFsO1xyXG4gICAgfSk7XHJcblxyXG4gIC8vIE5vZGUgYW5kIG90aGVyIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMuXHJcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT0gJ3N5bWJvbCcpIHtcclxuICAgICAgUFtTeW1ib2xbJ2ZvciddKCdub2RlanMudXRpbC5pbnNwZWN0LmN1c3RvbScpXSA9IFAudG9TdHJpbmc7XHJcbiAgICAgIFBbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdEZWNpbWFsJztcclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IERlY2ltYWw7XHJcblxyXG4gIC8vIEJyb3dzZXIuXHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICghZ2xvYmFsU2NvcGUpIHtcclxuICAgICAgZ2xvYmFsU2NvcGUgPSB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmICYmIHNlbGYuc2VsZiA9PSBzZWxmID8gc2VsZiA6IHdpbmRvdztcclxuICAgIH1cclxuXHJcbiAgICBub0NvbmZsaWN0ID0gZ2xvYmFsU2NvcGUuRGVjaW1hbDtcclxuICAgIERlY2ltYWwubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgZ2xvYmFsU2NvcGUuRGVjaW1hbCA9IG5vQ29uZmxpY3Q7XHJcbiAgICAgIHJldHVybiBEZWNpbWFsO1xyXG4gICAgfTtcclxuXHJcbiAgICBnbG9iYWxTY29wZS5EZWNpbWFsID0gRGVjaW1hbDtcclxuICB9XHJcbn0pKHRoaXMpO1xyXG4iLCIvKipcbiogQGxpY2Vuc2UgTUlUXG4qIEBhdXRob3IgPHN0ZXZlbkB2ZWxvem8uY29tPlxuKi9cbmxldCBsaWJTaW1wbGVMb2cgPSByZXF1aXJlKCcuL01hbnlmZXN0LUxvZ1RvQ29uc29sZS5qcycpO1xuXG4vKipcbiogSGFzaCBUcmFuc2xhdGlvblxuKlxuKiBUaGlzIGlzIGEgdmVyeSBzaW1wbGUgdHJhbnNsYXRpb24gdGFibGUgZm9yIGhhc2hlcywgd2hpY2ggYWxsb3dzIHRoZSBzYW1lIHNjaGVtYSB0byByZXNvbHZlIFxuKiBkaWZmZXJlbnRseSBiYXNlZCBvbiBhIGxvYWRlZCB0cmFuc2xhdGlvbiB0YWJsZS5cbipcbiogVGhpcyBpcyB0byBwcmV2ZW50IHRoZSByZXF1aXJlbWVudCBmb3IgbXV0YXRpbmcgc2NoZW1hcyBvdmVyIGFuZCBvdmVyIGFnYWluIHdoZW4gd2Ugd2FudCB0b1xuKiByZXVzZSB0aGUgc3RydWN0dXJlIGJ1dCBsb29rIHVwIGRhdGEgZWxlbWVudHMgYnkgZGlmZmVyZW50IGFkZHJlc3Nlcy5cbipcbiogT25lIHNpZGUtZWZmZWN0IG9mIHRoaXMgaXMgdGhhdCBhIHRyYW5zbGF0aW9uIHRhYmxlIGNhbiBcIm92ZXJyaWRlXCIgdGhlIGJ1aWx0LWluIGhhc2hlcywgc2luY2VcbiogdGhpcyBpcyBhbHdheXMgdXNlZCB0byByZXNvbHZlIGhhc2hlcyBiZWZvcmUgYW55IG9mIHRoZSBmdW5jdGlvbkNhbGxCeUhhc2gocEhhc2gsIC4uLikgcGVyZm9ybVxuKiB0aGVpciBsb29rdXBzIGJ5IGhhc2guXG4qXG4qIEBjbGFzcyBNYW55ZmVzdEhhc2hUcmFuc2xhdGlvblxuKi9cbmNsYXNzIE1hbnlmZXN0SGFzaFRyYW5zbGF0aW9uXG57XG5cdGNvbnN0cnVjdG9yKHBJbmZvTG9nLCBwRXJyb3JMb2cpXG5cdHtcblx0XHQvLyBXaXJlIGluIGxvZ2dpbmdcblx0XHR0aGlzLmxvZ0luZm8gPSAodHlwZW9mKHBJbmZvTG9nKSA9PT0gJ2Z1bmN0aW9uJykgPyBwSW5mb0xvZyA6IGxpYlNpbXBsZUxvZztcblx0XHR0aGlzLmxvZ0Vycm9yID0gKHR5cGVvZihwRXJyb3JMb2cpID09PSAnZnVuY3Rpb24nKSA/IHBFcnJvckxvZyA6IGxpYlNpbXBsZUxvZztcblxuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uVGFibGUgPSB7fTtcblx0fVxuXG4gICAgdHJhbnNsYXRpb25Db3VudCgpXG4gICAge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy50cmFuc2xhdGlvblRhYmxlKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgYWRkVHJhbnNsYXRpb24ocFRyYW5zbGF0aW9uKVxuICAgIHtcbiAgICAgICAgLy8gVGhpcyBhZGRzIGEgdHJhbnNsYXRpb24gaW4gdGhlIGZvcm0gb2Y6XG4gICAgICAgIC8vIHsgXCJTb3VyY2VIYXNoXCI6IFwiRGVzdGluYXRpb25IYXNoXCIsIFwiU2Vjb25kU291cmNlSGFzaFwiOlwiU2Vjb25kRGVzdGluYXRpb25IYXNoXCIgfVxuICAgICAgICBpZiAodHlwZW9mKHBUcmFuc2xhdGlvbikgIT0gJ29iamVjdCcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubG9nRXJyb3IoYEhhc2ggdHJhbnNsYXRpb24gYWRkVHJhbnNsYXRpb24gZXhwZWN0ZWQgYSB0cmFuc2xhdGlvbiBiZSB0eXBlIG9iamVjdCBidXQgd2FzIHBhc3NlZCBpbiAke3R5cGVvZihwVHJhbnNsYXRpb24pfWApO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRtcFRyYW5zbGF0aW9uU291cmNlcyA9IE9iamVjdC5rZXlzKHBUcmFuc2xhdGlvbilcblxuICAgICAgICB0bXBUcmFuc2xhdGlvblNvdXJjZXMuZm9yRWFjaChcbiAgICAgICAgICAgIChwVHJhbnNsYXRpb25Tb3VyY2UpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihwVHJhbnNsYXRpb25bcFRyYW5zbGF0aW9uU291cmNlXSkgIT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ0Vycm9yKGBIYXNoIHRyYW5zbGF0aW9uIGFkZFRyYW5zbGF0aW9uIGV4cGVjdGVkIGEgdHJhbnNsYXRpb24gZGVzdGluYXRpb24gaGFzaCBmb3IgWyR7cFRyYW5zbGF0aW9uU291cmNlfV0gdG8gYmUgYSBzdHJpbmcgYnV0IHRoZSByZWZlcnJhbnQgd2FzIGEgJHt0eXBlb2YocFRyYW5zbGF0aW9uW3BUcmFuc2xhdGlvblNvdXJjZV0pfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbGF0aW9uVGFibGVbcFRyYW5zbGF0aW9uU291cmNlXSA9IHBUcmFuc2xhdGlvbltwVHJhbnNsYXRpb25Tb3VyY2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbW92ZVRyYW5zbGF0aW9uSGFzaChwVHJhbnNsYXRpb25IYXNoKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNsYXRpb25UYWJsZS5oYXNPd25Qcm9wZXJ0eShwVHJhbnNsYXRpb25IYXNoKSlcbiAgICAgICAge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMudHJhbnNsYXRpb25UYWJsZVtwVHJhbnNsYXRpb25IYXNoXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgcmVtb3ZlcyB0cmFuc2xhdGlvbnMuXG4gICAgLy8gSWYgcGFzc2VkIGEgc3RyaW5nLCBqdXN0IHJlbW92ZXMgdGhlIHNpbmdsZSBvbmUuXG4gICAgLy8gSWYgcGFzc2VkIGFuIG9iamVjdCwgaXQgZG9lcyBhbGwgdGhlIHNvdXJjZSBrZXlzLlxuICAgIHJlbW92ZVRyYW5zbGF0aW9uKHBUcmFuc2xhdGlvbilcbiAgICB7XG4gICAgICAgIGlmICh0eXBlb2YocFRyYW5zbGF0aW9uKSA9PSAnc3RyaW5nJylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVUcmFuc2xhdGlvbkhhc2gocFRyYW5zbGF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZihwVHJhbnNsYXRpb24pID09ICdvYmplY3QnKVxuICAgICAgICB7XG4gICAgICAgICAgICBsZXQgdG1wVHJhbnNsYXRpb25Tb3VyY2VzID0gT2JqZWN0LmtleXMocFRyYW5zbGF0aW9uKVxuXG4gICAgICAgICAgICB0bXBUcmFuc2xhdGlvblNvdXJjZXMuZm9yRWFjaChcbiAgICAgICAgICAgICAgICAocFRyYW5zbGF0aW9uU291cmNlKSA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVUcmFuc2xhdGlvbihwVHJhbnNsYXRpb25Tb3VyY2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmxvZ0Vycm9yKGBIYXNoIHRyYW5zbGF0aW9uIHJlbW92ZVRyYW5zbGF0aW9uIGV4cGVjdGVkIGVpdGhlciBhIHN0cmluZyBvciBhbiBvYmplY3QgYnV0IHRoZSBwYXNzZWQtaW4gdHJhbnNsYXRpb24gd2FzIHR5cGUgJHt0eXBlb2YocFRyYW5zbGF0aW9uKX1gKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyVHJhbnNsYXRpb25zKClcbiAgICB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25UYWJsZSA9IHt9O1xuICAgIH1cblxuICAgIHRyYW5zbGF0ZShwVHJhbnNsYXRpb24pXG4gICAge1xuICAgICAgICBpZiAodGhpcy50cmFuc2xhdGlvblRhYmxlLmhhc093blByb3BlcnR5KHBUcmFuc2xhdGlvbikpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0aW9uVGFibGVbcFRyYW5zbGF0aW9uXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBwVHJhbnNsYXRpb247XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWFueWZlc3RIYXNoVHJhbnNsYXRpb247IiwiLyoqXG4qIEBsaWNlbnNlIE1JVFxuKiBAYXV0aG9yIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5cbi8qKlxuKiBNYW55ZmVzdCBzaW1wbGUgbG9nZ2luZyBzaGltIChmb3IgYnJvd3NlciBhbmQgZGVwZW5kZW5jeS1mcmVlIHJ1bm5pbmcpXG4qL1xuXG5jb25zdCBsb2dUb0NvbnNvbGUgPSAocExvZ0xpbmUsIHBMb2dPYmplY3QpID0+XG57XG4gICAgbGV0IHRtcExvZ0xpbmUgPSAodHlwZW9mKHBMb2dMaW5lKSA9PT0gJ3N0cmluZycpID8gcExvZ0xpbmUgOiAnJztcblxuICAgIGNvbnNvbGUubG9nKGBbTWFueWZlc3RdICR7dG1wTG9nTGluZX1gKTtcblxuICAgIGlmIChwTG9nT2JqZWN0KSBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShwTG9nT2JqZWN0KSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxvZ1RvQ29uc29sZTsiLCIvKipcbiogQGxpY2Vuc2UgTUlUXG4qIEBhdXRob3IgPHN0ZXZlbkB2ZWxvem8uY29tPlxuKi9cbmxldCBsaWJTaW1wbGVMb2cgPSByZXF1aXJlKCcuL01hbnlmZXN0LUxvZ1RvQ29uc29sZS5qcycpO1xuXG4vKipcbiogT2JqZWN0IEFkZHJlc3MgUmVzb2x2ZXJcbiogXG4qIElNUE9SVEFOVCBOT1RFOiBUaGlzIGNvZGUgaXMgaW50ZW50aW9uYWxseSBtb3JlIHZlcmJvc2UgdGhhbiBuZWNlc3NhcnksIHRvXG4qICAgICAgICAgICAgICAgICBiZSBleHRyZW1lbHkgY2xlYXIgd2hhdCBpcyBnb2luZyBvbiBpbiB0aGUgcmVjdXJzaW9uIGZvclxuKiAgICAgICAgICAgICAgICAgZWFjaCBvZiB0aGUgdGhyZWUgYWRkcmVzcyByZXNvbHV0aW9uIGZ1bmN0aW9ucy5cbiogXG4qICAgICAgICAgICAgICAgICBBbHRob3VnaCB0aGVyZSBpcyBzb21lIG9wcG9ydHVuaXR5IHRvIHJlcGVhdCBvdXJzZWx2ZXMgYVxuKiAgICAgICAgICAgICAgICAgYml0IGxlc3MgaW4gdGhpcyBjb2RlYmFzZSAoZS5nLiB3aXRoIGRldGVjdGlvbiBvZiBhcnJheXNcbiogICAgICAgICAgICAgICAgIHZlcnN1cyBvYmplY3RzIHZlcnN1cyBkaXJlY3QgcHJvcGVydGllcyksIGl0IGNhbiBtYWtlXG4qICAgICAgICAgICAgICAgICBkZWJ1Z2dpbmcuLiBjaGFsbGVuZ2luZy4gIFRoZSBtaW5pZmllZCB2ZXJzaW9uIG9mIHRoZSBjb2RlXG4qICAgICAgICAgICAgICAgICBvcHRpbWl6ZXMgb3V0IGFsbW9zdCBhbnl0aGluZyByZXBlYXRlZCBpbiBoZXJlLiAgU28gcGxlYXNlXG4qICAgICAgICAgICAgICAgICBiZSBraW5kIGFuZCByZXdpbmQuLi4gbWVhbmluZyBwbGVhc2Uga2VlcCB0aGUgY29kZWJhc2UgbGVzc1xuKiAgICAgICAgICAgICAgICAgdGVyc2UgYW5kIG1vcmUgdmVyYm9zZSBzbyBodW1hbnMgY2FuIGNvbXByZWhlbmQgaXQuXG4qICAgICAgICAgICAgICAgICBcbipcbiogQGNsYXNzIE1hbnlmZXN0T2JqZWN0QWRkcmVzc1Jlc29sdmVyXG4qL1xuY2xhc3MgTWFueWZlc3RPYmplY3RBZGRyZXNzUmVzb2x2ZXJcbntcblx0Y29uc3RydWN0b3IocEluZm9Mb2csIHBFcnJvckxvZylcblx0e1xuXHRcdC8vIFdpcmUgaW4gbG9nZ2luZ1xuXHRcdHRoaXMubG9nSW5mbyA9ICh0eXBlb2YocEluZm9Mb2cpID09ICdmdW5jdGlvbicpID8gcEluZm9Mb2cgOiBsaWJTaW1wbGVMb2c7XG5cdFx0dGhpcy5sb2dFcnJvciA9ICh0eXBlb2YocEVycm9yTG9nKSA9PSAnZnVuY3Rpb24nKSA/IHBFcnJvckxvZyA6IGxpYlNpbXBsZUxvZztcblx0fVxuXG5cdC8vIFdoZW4gYSBib3hlZCBwcm9wZXJ0eSBpcyBwYXNzZWQgaW4sIGl0IHNob3VsZCBoYXZlIHF1b3RlcyBvZiBzb21lXG5cdC8vIGtpbmQgYXJvdW5kIGl0LlxuXHQvL1xuXHQvLyBGb3IgaW5zdGFuY2U6XG5cdC8vIFx0XHRNeVZhbHVlc1snTmFtZSddXG5cdC8vIFx0XHRNeVZhbHVlc1tcIkFnZVwiXVxuXHQvLyBcdFx0TXlWYWx1ZXNbYENvc3RgXVxuXHQvL1xuXHQvLyBUaGlzIGZ1bmN0aW9uIHJlbW92ZXMgdGhlIHdyYXBwaW5nIHF1b3Rlcy5cblx0Ly9cblx0Ly8gUGxlYXNlIG5vdGUgaXQgKkRPRVMgTk9UIFBBUlNFKiB0ZW1wbGF0ZSBsaXRlcmFscywgc28gYmFja3RpY2tzIGp1c3Rcblx0Ly8gZW5kIHVwIGRvaW5nIHRoZSBzYW1lIHRoaW5nIGFzIG90aGVyIHF1b3RlIHR5cGVzLlxuXHQvL1xuXHQvLyBUT0RPOiBTaG91bGQgdGVtcGxhdGUgbGl0ZXJhbHMgYmUgcHJvY2Vzc2VkPyAgSWYgc28gd2hhdCBzdGF0ZSBkbyB0aGV5IGhhdmUgYWNjZXNzIHRvP1xuXHRjbGVhbldyYXBDaGFyYWN0ZXJzIChwQ2hhcmFjdGVyLCBwU3RyaW5nKVxuXHR7XG5cdFx0aWYgKHBTdHJpbmcuc3RhcnRzV2l0aChwQ2hhcmFjdGVyKSAmJiBwU3RyaW5nLmVuZHNXaXRoKHBDaGFyYWN0ZXIpKVxuXHRcdHtcblx0XHRcdHJldHVybiBwU3RyaW5nLnN1YnN0cmluZygxLCBwU3RyaW5nLmxlbmd0aCAtIDEpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHBTdHJpbmc7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgYW4gYWRkcmVzcyBleGlzdHMuXG5cdC8vXG5cdC8vIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgdGhlIGdldFZhbHVlQXRBZGRyZXNzIGZ1bmN0aW9uIGlzIGFtYmlndW91cyBvbiBcblx0Ly8gd2hldGhlciB0aGUgZWxlbWVudC9wcm9wZXJ0eSBpcyBhY3R1YWxseSB0aGVyZSBvciBub3QgKGl0IHJldHVybnMgXG5cdC8vIHVuZGVmaW5lZCB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBleGlzdHMgb3Igbm90KS4gIFRoaXMgZnVuY3Rpb24gY2hlY2tzIGZvclxuXHQvLyBleGlzdGFuY2UgYW5kIHJldHVybnMgdHJ1ZSBvciBmYWxzZSBkZXBlbmRlbnQuXG5cdGNoZWNrQWRkcmVzc0V4aXN0cyAocE9iamVjdCwgcEFkZHJlc3MpXG5cdHtcblx0XHQvLyBUT0RPOiBTaG91bGQgdGhlc2UgdGhyb3cgYW4gZXJyb3I/XG5cdFx0Ly8gTWFrZSBzdXJlIHBPYmplY3QgaXMgYW4gb2JqZWN0XG5cdFx0aWYgKHR5cGVvZihwT2JqZWN0KSAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXHRcdC8vIE1ha2Ugc3VyZSBwQWRkcmVzcyBpcyBhIHN0cmluZ1xuXHRcdGlmICh0eXBlb2YocEFkZHJlc3MpICE9ICdzdHJpbmcnKSByZXR1cm4gZmFsc2U7XG5cblx0XHQvLyBUT0RPOiBNYWtlIHRoaXMgd29yayBmb3IgdGhpbmdzIGxpa2UgU29tZVJvb3RPYmplY3QuTWV0YWRhdGFbXCJTb21lLlBlb3BsZS5Vc2UuQmFkLk9iamVjdC5Qcm9wZXJ0eS5OYW1lc1wiXVxuXHRcdGxldCB0bXBTZXBhcmF0b3JJbmRleCA9IHBBZGRyZXNzLmluZGV4T2YoJy4nKTtcblxuXHRcdC8vIFRoaXMgaXMgdGhlIHRlcm1pbmFsIGFkZHJlc3Mgc3RyaW5nIChubyBtb3JlIGRvdHMgc28gdGhlIFJFQ1VTSU9OIEVORFMgSU4gSEVSRSBzb21laG93KVxuXHRcdGlmICh0bXBTZXBhcmF0b3JJbmRleCA9PSAtMSlcblx0XHR7XG5cdFx0XHQvLyBDaGVjayBpZiB0aGUgYWRkcmVzcyByZWZlcnMgdG8gYSBib3hlZCBwcm9wZXJ0eVxuXHRcdFx0bGV0IHRtcEJyYWNrZXRTdGFydEluZGV4ID0gcEFkZHJlc3MuaW5kZXhPZignWycpO1xuXHRcdFx0bGV0IHRtcEJyYWNrZXRTdG9wSW5kZXggPSBwQWRkcmVzcy5pbmRleE9mKCddJyk7XG5cdFx0XHQvLyBCb3hlZCBlbGVtZW50cyBsb29rIGxpa2UgdGhpczpcblx0XHRcdC8vIFx0XHRNeVZhbHVlc1sxMF1cblx0XHRcdC8vIFx0XHRNeVZhbHVlc1snTmFtZSddXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbXCJBZ2VcIl1cblx0XHRcdC8vIFx0XHRNeVZhbHVlc1tgQ29zdGBdXG5cdFx0XHQvL1xuXHRcdFx0Ly8gV2hlbiB3ZSBhcmUgcGFzc2VkIFNvbWVPYmplY3RbXCJOYW1lXCJdIHRoaXMgY29kZSBiZWxvdyByZWN1cnNlcyBhcyBpZiBpdCB3ZXJlIFNvbWVPYmplY3QuTmFtZVxuXHRcdFx0Ly8gVGhlIHJlcXVpcmVtZW50cyB0byBkZXRlY3QgYSBib3hlZCBlbGVtZW50IGFyZTpcblx0XHRcdC8vICAgIDEpIFRoZSBzdGFydCBicmFja2V0IGlzIGFmdGVyIGNoYXJhY3RlciAwXG5cdFx0XHRpZiAoKHRtcEJyYWNrZXRTdGFydEluZGV4ID4gMCkgXG5cdFx0XHQvLyAgICAyKSBUaGUgZW5kIGJyYWNrZXQgaGFzIHNvbWV0aGluZyBiZXR3ZWVuIHRoZW1cblx0XHRcdFx0JiYgKHRtcEJyYWNrZXRTdG9wSW5kZXggPiB0bXBCcmFja2V0U3RhcnRJbmRleCkgXG5cdFx0XHQvLyAgICAzKSBUaGVyZSBpcyBkYXRhIFxuXHRcdFx0XHQmJiAodG1wQnJhY2tldFN0b3BJbmRleCAtIHRtcEJyYWNrZXRTdGFydEluZGV4ID4gMCkpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIFRoZSBcIk5hbWVcIiBvZiB0aGUgT2JqZWN0IGNvbnRhaW5lZCB0b28gdGhlIGxlZnQgb2YgdGhlIGJyYWNrZXRcblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlOYW1lID0gcEFkZHJlc3Muc3Vic3RyaW5nKDAsIHRtcEJyYWNrZXRTdGFydEluZGV4KS50cmltKCk7XG5cblx0XHRcdFx0Ly8gSWYgdGhlIHN1YnByb3BlcnR5IGRvZXNuJ3QgdGVzdCBhcyBhIHByb3BlciBPYmplY3QsIG5vbmUgb2YgdGhlIHJlc3Qgb2YgdGhpcyBpcyBwb3NzaWJsZS5cblx0XHRcdFx0Ly8gVGhpcyBpcyBhIHJhcmUgY2FzZSB3aGVyZSBBcnJheXMgdGVzdGluZyBhcyBPYmplY3RzIGlzIHVzZWZ1bFxuXHRcdFx0XHRpZiAodHlwZW9mKHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdKSAhPT0gJ29iamVjdCcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUaGUgXCJSZWZlcmVuY2VcIiB0byB0aGUgcHJvcGVydHkgd2l0aGluIGl0LCBlaXRoZXIgYW4gYXJyYXkgZWxlbWVudCBvciBvYmplY3QgcHJvcGVydHlcblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSBwQWRkcmVzcy5zdWJzdHJpbmcodG1wQnJhY2tldFN0YXJ0SW5kZXgrMSwgdG1wQnJhY2tldFN0b3BJbmRleCkudHJpbSgpO1xuXHRcdFx0XHQvLyBBdHRlbXB0IHRvIHBhcnNlIHRoZSByZWZlcmVuY2UgYXMgYSBudW1iZXIsIHdoaWNoIHdpbGwgYmUgdXNlZCBhcyBhbiBhcnJheSBlbGVtZW50XG5cdFx0XHRcdGxldCB0bXBCb3hlZFByb3BlcnR5TnVtYmVyID0gcGFyc2VJbnQodG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSwgMTApO1xuXG5cdFx0XHRcdC8vIEd1YXJkOiBJZiB0aGUgcmVmZXJyYW50IGlzIGEgbnVtYmVyIGFuZCB0aGUgYm94ZWQgcHJvcGVydHkgaXMgbm90IGFuIGFycmF5LCBvciB2aWNlIHZlcnNhLCByZXR1cm4gdW5kZWZpbmVkLlxuXHRcdFx0XHQvLyAgICAgICAgVGhpcyBzZWVtcyBjb25mdXNpbmcgdG8gbWUgYXQgZmlyc3QgcmVhZCwgc28gZXhwbGFpbmF0aW9uOlxuXHRcdFx0XHQvLyAgICAgICAgSXMgdGhlIEJveGVkIE9iamVjdCBhbiBBcnJheT8gIFRSVUVcblx0XHRcdFx0Ly8gICAgICAgIEFuZCBpcyB0aGUgUmVmZXJlbmNlIGluc2lkZSB0aGUgYm94ZWQgT2JqZWN0IG5vdCBhIG51bWJlcj8gVFJVRVxuXHRcdFx0XHQvLyAgICAgICAgLS0+ICBTbyB3aGVuIHRoZXNlIGFyZSBpbiBhZ3JlZW1lbnQsIGl0J3MgYW4gaW1wb3NzaWJsZSBhY2Nlc3Mgc3RhdGVcblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocE9iamVjdFt0bXBCb3hlZFByb3BlcnR5TmFtZV0pID09IGlzTmFOKHRtcEJveGVkUHJvcGVydHlOdW1iZXIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gICAgNCkgSWYgdGhlIG1pZGRsZSBwYXJ0IGlzICpvbmx5KiBhIG51bWJlciAobm8gc2luZ2xlLCBkb3VibGUgb3IgYmFja3RpY2sgcXVvdGVzKSBpdCBpcyBhbiBhcnJheSBlbGVtZW50LFxuXHRcdFx0XHQvLyAgICAgICBvdGhlcndpc2Ugd2Ugd2lsbCB0cnkgdG8gdHJlYXQgaXQgYXMgYSBkeW5hbWljIG9iamVjdCBwcm9wZXJ0eS5cblx0XHRcdFx0aWYgKGlzTmFOKHRtcEJveGVkUHJvcGVydHlOdW1iZXIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gVGhpcyBpc24ndCBhIG51bWJlciAuLi4gbGV0J3MgdHJlYXQgaXQgYXMgYSBkeW5hbWljIG9iamVjdCBwcm9wZXJ0eS5cblx0XHRcdFx0XHQvLyBXZSB3b3VsZCBleHBlY3QgdGhlIHByb3BlcnR5IHRvIGJlIHdyYXBwZWQgaW4gc29tZSBraW5kIG9mIHF1b3RlcyBzbyBzdHJpcCB0aGVtXG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycygnXCInLCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblx0XHRcdFx0XHR0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gdGhpcy5jbGVhbldyYXBDaGFyYWN0ZXJzKCdgJywgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycyhcIidcIiwgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cblx0XHRcdFx0XHQvLyBDaGVjayBpZiB0aGUgcHJvcGVydHkgZXhpc3RzLlxuXHRcdFx0XHRcdHJldHVybiBwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXS5oYXNPd25Qcm9wZXJ0eSh0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvLyBVc2UgdGhlIG5ldyBpbiBvcGVyYXRvciB0byBzZWUgaWYgdGhlIGVsZW1lbnQgaXMgaW4gdGhlIGFycmF5XG5cdFx0XHRcdFx0cmV0dXJuICh0bXBCb3hlZFByb3BlcnR5TnVtYmVyIGluIHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBDaGVjayBpZiB0aGUgcHJvcGVydHkgZXhpc3RzXG5cdFx0XHRcdHJldHVybiBwT2JqZWN0Lmhhc093blByb3BlcnR5KHBBZGRyZXNzKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGxldCB0bXBTdWJPYmplY3ROYW1lID0gcEFkZHJlc3Muc3Vic3RyaW5nKDAsIHRtcFNlcGFyYXRvckluZGV4KTtcblx0XHRcdGxldCB0bXBOZXdBZGRyZXNzID0gcEFkZHJlc3Muc3Vic3RyaW5nKHRtcFNlcGFyYXRvckluZGV4KzEpO1xuXG5cdFx0XHQvLyBUZXN0IGlmIHRoZSB0bXBOZXdBZGRyZXNzIGlzIGFuIGFycmF5IG9yIG9iamVjdFxuXHRcdFx0Ly8gQ2hlY2sgaWYgaXQncyBhIGJveGVkIHByb3BlcnR5XG5cdFx0XHRsZXQgdG1wQnJhY2tldFN0YXJ0SW5kZXggPSB0bXBTdWJPYmplY3ROYW1lLmluZGV4T2YoJ1snKTtcblx0XHRcdGxldCB0bXBCcmFja2V0U3RvcEluZGV4ID0gdG1wU3ViT2JqZWN0TmFtZS5pbmRleE9mKCddJyk7XG5cdFx0XHQvLyBCb3hlZCBlbGVtZW50cyBsb29rIGxpa2UgdGhpczpcblx0XHRcdC8vIFx0XHRNeVZhbHVlc1s0Ml1cblx0XHRcdC8vIFx0XHRNeVZhbHVlc1snQ29sb3InXVxuXHRcdFx0Ly8gXHRcdE15VmFsdWVzW1wiV2VpZ2h0XCJdXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbYERpYW1ldGVyYF1cblx0XHRcdC8vXG5cdFx0XHQvLyBXaGVuIHdlIGFyZSBwYXNzZWQgU29tZU9iamVjdFtcIk5hbWVcIl0gdGhpcyBjb2RlIGJlbG93IHJlY3Vyc2VzIGFzIGlmIGl0IHdlcmUgU29tZU9iamVjdC5OYW1lXG5cdFx0XHQvLyBUaGUgcmVxdWlyZW1lbnRzIHRvIGRldGVjdCBhIGJveGVkIGVsZW1lbnQgYXJlOlxuXHRcdFx0Ly8gICAgMSkgVGhlIHN0YXJ0IGJyYWNrZXQgaXMgYWZ0ZXIgY2hhcmFjdGVyIDBcblx0XHRcdGlmICgodG1wQnJhY2tldFN0YXJ0SW5kZXggPiAwKSBcblx0XHRcdC8vICAgIDIpIFRoZSBlbmQgYnJhY2tldCBoYXMgc29tZXRoaW5nIGJldHdlZW4gdGhlbVxuXHRcdFx0XHQmJiAodG1wQnJhY2tldFN0b3BJbmRleCA+IHRtcEJyYWNrZXRTdGFydEluZGV4KSBcblx0XHRcdC8vICAgIDMpIFRoZXJlIGlzIGRhdGEgXG5cdFx0XHRcdCYmICh0bXBCcmFja2V0U3RvcEluZGV4IC0gdG1wQnJhY2tldFN0YXJ0SW5kZXggPiAwKSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlOYW1lID0gdG1wU3ViT2JqZWN0TmFtZS5zdWJzdHJpbmcoMCwgdG1wQnJhY2tldFN0YXJ0SW5kZXgpLnRyaW0oKTtcblxuXHRcdFx0XHRsZXQgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRtcFN1Yk9iamVjdE5hbWUuc3Vic3RyaW5nKHRtcEJyYWNrZXRTdGFydEluZGV4KzEsIHRtcEJyYWNrZXRTdG9wSW5kZXgpLnRyaW0oKTtcblxuXHRcdFx0XHRsZXQgdG1wQm94ZWRQcm9wZXJ0eU51bWJlciA9IHBhcnNlSW50KHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UsIDEwKTtcblxuXHRcdFx0XHQvLyBHdWFyZDogSWYgdGhlIHJlZmVycmFudCBpcyBhIG51bWJlciBhbmQgdGhlIGJveGVkIHByb3BlcnR5IGlzIG5vdCBhbiBhcnJheSwgb3IgdmljZSB2ZXJzYSwgcmV0dXJuIHVuZGVmaW5lZC5cblx0XHRcdFx0Ly8gICAgICAgIFRoaXMgc2VlbXMgY29uZnVzaW5nIHRvIG1lIGF0IGZpcnN0IHJlYWQsIHNvIGV4cGxhaW5hdGlvbjpcblx0XHRcdFx0Ly8gICAgICAgIElzIHRoZSBCb3hlZCBPYmplY3QgYW4gQXJyYXk/ICBUUlVFXG5cdFx0XHRcdC8vICAgICAgICBBbmQgaXMgdGhlIFJlZmVyZW5jZSBpbnNpZGUgdGhlIGJveGVkIE9iamVjdCBub3QgYSBudW1iZXI/IFRSVUVcblx0XHRcdFx0Ly8gICAgICAgIC0tPiAgU28gd2hlbiB0aGVzZSBhcmUgaW4gYWdyZWVtZW50LCBpdCdzIGFuIGltcG9zc2libGUgYWNjZXNzIHN0YXRlXG5cdFx0XHRcdC8vIFRoaXMgY291bGQgYmUgYSBmYWlsdXJlIGluIHRoZSByZWN1cnNpb24gY2hhaW4gYmVjYXVzZSB0aGV5IHBhc3NlZCBzb21ldGhpbmcgbGlrZSB0aGlzIGluOlxuXHRcdFx0XHQvLyAgICBTdHVkZW50RGF0YS5TZWN0aW9ucy5BbGdlYnJhLlN0dWRlbnRzWzFdLlRhcmR5XG5cdFx0XHRcdC8vICAgICAgIEJVVFxuXHRcdFx0XHQvLyAgICAgICAgIFN0dWRlbnREYXRhLlNlY3Rpb25zLkFsZ2VicmEuU3R1ZGVudHMgaXMgYW4gb2JqZWN0LCBzbyB0aGUgWzFdLlRhcmR5IGlzIG5vdCBwb3NzaWJsZSB0byBhY2Nlc3Ncblx0XHRcdFx0Ly8gVGhpcyBjb3VsZCBiZSBhIGZhaWx1cmUgaW4gdGhlIHJlY3Vyc2lvbiBjaGFpbiBiZWNhdXNlIHRoZXkgcGFzc2VkIHNvbWV0aGluZyBsaWtlIHRoaXMgaW46XG5cdFx0XHRcdC8vICAgIFN0dWRlbnREYXRhLlNlY3Rpb25zLkFsZ2VicmEuU3R1ZGVudHNbXCJKYW5lRG9lXCJdLkdyYWRlXG5cdFx0XHRcdC8vICAgICAgIEJVVFxuXHRcdFx0XHQvLyAgICAgICAgIFN0dWRlbnREYXRhLlNlY3Rpb25zLkFsZ2VicmEuU3R1ZGVudHMgaXMgYW4gYXJyYXksIHNvIHRoZSBbXCJKYW5lRG9lXCJdLkdyYWRlIGlzIG5vdCBwb3NzaWJsZSB0byBhY2Nlc3Ncblx0XHRcdFx0Ly8gVE9ETzogU2hvdWxkIHRoaXMgYmUgYW4gZXJyb3Igb3Igc29tZXRoaW5nPyAgU2hvdWxkIHdlIGtlZXAgYSBsb2cgb2YgZmFpbHVyZXMgbGlrZSB0aGlzP1xuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXSkgPT0gaXNOYU4odG1wQm94ZWRQcm9wZXJ0eU51bWJlcikpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvLyBCZWNhdXNlIHRoaXMgaXMgYW4gaW1wb3NzaWJsZSBhZGRyZXNzLCB0aGUgcHJvcGVydHkgZG9lc24ndCBleGlzdFxuXHRcdFx0XHRcdC8vIFRPRE86IFNob3VsZCB3ZSB0aHJvdyBhbiBlcnJvciBpbiB0aGlzIGNvbmRpdGlvbj9cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL1RoaXMgaXMgYSBicmFja2V0ZWQgdmFsdWVcblx0XHRcdFx0Ly8gICAgNCkgSWYgdGhlIG1pZGRsZSBwYXJ0IGlzICpvbmx5KiBhIG51bWJlciAobm8gc2luZ2xlLCBkb3VibGUgb3IgYmFja3RpY2sgcXVvdGVzKSBpdCBpcyBhbiBhcnJheSBlbGVtZW50LFxuXHRcdFx0XHQvLyAgICAgICBvdGhlcndpc2Ugd2Ugd2lsbCB0cnkgdG8gcmVhdCBpdCBhcyBhIGR5bmFtaWMgb2JqZWN0IHByb3BlcnR5LlxuXHRcdFx0XHRpZiAoaXNOYU4odG1wQm94ZWRQcm9wZXJ0eU51bWJlcikpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvLyBUaGlzIGlzbid0IGEgbnVtYmVyIC4uLiBsZXQncyB0cmVhdCBpdCBhcyBhIGR5bmFubWljIG9iamVjdCBwcm9wZXJ0eS5cblx0XHRcdFx0XHR0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gdGhpcy5jbGVhbldyYXBDaGFyYWN0ZXJzKCdcIicsIHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UpO1xuXHRcdFx0XHRcdHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSB0aGlzLmNsZWFuV3JhcENoYXJhY3RlcnMoJ2AnLCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblx0XHRcdFx0XHR0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gdGhpcy5jbGVhbldyYXBDaGFyYWN0ZXJzKFwiJ1wiLCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblxuXHRcdFx0XHRcdC8vIFJlY3Vyc2UgZGlyZWN0bHkgaW50byB0aGUgc3Vib2JqZWN0XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY2hlY2tBZGRyZXNzRXhpc3RzKHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdW3RtcEJveGVkUHJvcGVydHlSZWZlcmVuY2VdLCB0bXBOZXdBZGRyZXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvLyBXZSBwYXJzZWQgYSB2YWxpZCBudW1iZXIgb3V0IG9mIHRoZSBib3hlZCBwcm9wZXJ0eSBuYW1lLCBzbyByZWN1cnNlIGludG8gdGhlIGFycmF5XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuY2hlY2tBZGRyZXNzRXhpc3RzKHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdW3RtcEJveGVkUHJvcGVydHlOdW1iZXJdLCB0bXBOZXdBZGRyZXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiB0aGVyZSBpcyBhbiBvYmplY3QgcHJvcGVydHkgYWxyZWFkeSBuYW1lZCBmb3IgdGhlIHN1YiBvYmplY3QsIGJ1dCBpdCBpc24ndCBhbiBvYmplY3Rcblx0XHRcdC8vIHRoZW4gdGhlIHN5c3RlbSBjYW4ndCBzZXQgdGhlIHZhbHVlIGluIHRoZXJlLiAgRXJyb3IgYW5kIGFib3J0IVxuXHRcdFx0aWYgKHBPYmplY3QuaGFzT3duUHJvcGVydHkodG1wU3ViT2JqZWN0TmFtZSkgJiYgdHlwZW9mKHBPYmplY3RbdG1wU3ViT2JqZWN0TmFtZV0pICE9PSAnb2JqZWN0Jylcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocE9iamVjdC5oYXNPd25Qcm9wZXJ0eSh0bXBTdWJPYmplY3ROYW1lKSlcblx0XHRcdHtcblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgYWxyZWFkeSBhIHN1Ym9iamVjdCBwYXNzIHRoYXQgdG8gdGhlIHJlY3Vyc2l2ZSB0aGluZ3lcblx0XHRcdFx0cmV0dXJuIHRoaXMuY2hlY2tBZGRyZXNzRXhpc3RzKHBPYmplY3RbdG1wU3ViT2JqZWN0TmFtZV0sIHRtcE5ld0FkZHJlc3MpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBDcmVhdGUgYSBzdWJvYmplY3QgYW5kIHRoZW4gcGFzcyB0aGF0XG5cdFx0XHRcdHBPYmplY3RbdG1wU3ViT2JqZWN0TmFtZV0gPSB7fTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY2hlY2tBZGRyZXNzRXhpc3RzKHBPYmplY3RbdG1wU3ViT2JqZWN0TmFtZV0sIHRtcE5ld0FkZHJlc3MpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIEdldCB0aGUgdmFsdWUgb2YgYW4gZWxlbWVudCBhdCBhbiBhZGRyZXNzXG5cdGdldFZhbHVlQXRBZGRyZXNzIChwT2JqZWN0LCBwQWRkcmVzcylcblx0e1xuXHRcdC8vIE1ha2Ugc3VyZSBwT2JqZWN0IGlzIGFuIG9iamVjdFxuXHRcdGlmICh0eXBlb2YocE9iamVjdCkgIT0gJ29iamVjdCcpIHJldHVybiB1bmRlZmluZWQ7XG5cdFx0Ly8gTWFrZSBzdXJlIHBBZGRyZXNzIGlzIGEgc3RyaW5nXG5cdFx0aWYgKHR5cGVvZihwQWRkcmVzcykgIT0gJ3N0cmluZycpIHJldHVybiB1bmRlZmluZWQ7XG5cblx0XHQvLyBUT0RPOiBNYWtlIHRoaXMgd29yayBmb3IgdGhpbmdzIGxpa2UgU29tZVJvb3RPYmplY3QuTWV0YWRhdGFbXCJTb21lLlBlb3BsZS5Vc2UuQmFkLk9iamVjdC5Qcm9wZXJ0eS5OYW1lc1wiXVxuXHRcdGxldCB0bXBTZXBhcmF0b3JJbmRleCA9IHBBZGRyZXNzLmluZGV4T2YoJy4nKTtcblxuXHRcdC8vIFRoaXMgaXMgdGhlIHRlcm1pbmFsIGFkZHJlc3Mgc3RyaW5nIChubyBtb3JlIGRvdHMgc28gdGhlIFJFQ1VTSU9OIEVORFMgSU4gSEVSRSBzb21laG93KVxuXHRcdGlmICh0bXBTZXBhcmF0b3JJbmRleCA9PSAtMSlcblx0XHR7XG5cdFx0XHQvLyBDaGVjayBpZiB0aGUgYWRkcmVzcyByZWZlcnMgdG8gYSBib3hlZCBwcm9wZXJ0eVxuXHRcdFx0bGV0IHRtcEJyYWNrZXRTdGFydEluZGV4ID0gcEFkZHJlc3MuaW5kZXhPZignWycpO1xuXHRcdFx0bGV0IHRtcEJyYWNrZXRTdG9wSW5kZXggPSBwQWRkcmVzcy5pbmRleE9mKCddJyk7XG5cdFx0XHQvLyBCb3hlZCBlbGVtZW50cyBsb29rIGxpa2UgdGhpczpcblx0XHRcdC8vIFx0XHRNeVZhbHVlc1sxMF1cblx0XHRcdC8vIFx0XHRNeVZhbHVlc1snTmFtZSddXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbXCJBZ2VcIl1cblx0XHRcdC8vIFx0XHRNeVZhbHVlc1tgQ29zdGBdXG5cdFx0XHQvL1xuXHRcdFx0Ly8gV2hlbiB3ZSBhcmUgcGFzc2VkIFNvbWVPYmplY3RbXCJOYW1lXCJdIHRoaXMgY29kZSBiZWxvdyByZWN1cnNlcyBhcyBpZiBpdCB3ZXJlIFNvbWVPYmplY3QuTmFtZVxuXHRcdFx0Ly8gVGhlIHJlcXVpcmVtZW50cyB0byBkZXRlY3QgYSBib3hlZCBlbGVtZW50IGFyZTpcblx0XHRcdC8vICAgIDEpIFRoZSBzdGFydCBicmFja2V0IGlzIGFmdGVyIGNoYXJhY3RlciAwXG5cdFx0XHRpZiAoKHRtcEJyYWNrZXRTdGFydEluZGV4ID4gMCkgXG5cdFx0XHQvLyAgICAyKSBUaGUgZW5kIGJyYWNrZXQgaGFzIHNvbWV0aGluZyBiZXR3ZWVuIHRoZW1cblx0XHRcdFx0JiYgKHRtcEJyYWNrZXRTdG9wSW5kZXggPiB0bXBCcmFja2V0U3RhcnRJbmRleCkgXG5cdFx0XHQvLyAgICAzKSBUaGVyZSBpcyBkYXRhIFxuXHRcdFx0XHQmJiAodG1wQnJhY2tldFN0b3BJbmRleCAtIHRtcEJyYWNrZXRTdGFydEluZGV4ID4gMCkpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIFRoZSBcIk5hbWVcIiBvZiB0aGUgT2JqZWN0IGNvbnRhaW5lZCB0b28gdGhlIGxlZnQgb2YgdGhlIGJyYWNrZXRcblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlOYW1lID0gcEFkZHJlc3Muc3Vic3RyaW5nKDAsIHRtcEJyYWNrZXRTdGFydEluZGV4KS50cmltKCk7XG5cblx0XHRcdFx0Ly8gSWYgdGhlIHN1YnByb3BlcnR5IGRvZXNuJ3QgdGVzdCBhcyBhIHByb3BlciBPYmplY3QsIG5vbmUgb2YgdGhlIHJlc3Qgb2YgdGhpcyBpcyBwb3NzaWJsZS5cblx0XHRcdFx0Ly8gVGhpcyBpcyBhIHJhcmUgY2FzZSB3aGVyZSBBcnJheXMgdGVzdGluZyBhcyBPYmplY3RzIGlzIHVzZWZ1bFxuXHRcdFx0XHRpZiAodHlwZW9mKHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdKSAhPT0gJ29iamVjdCcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVGhlIFwiUmVmZXJlbmNlXCIgdG8gdGhlIHByb3BlcnR5IHdpdGhpbiBpdCwgZWl0aGVyIGFuIGFycmF5IGVsZW1lbnQgb3Igb2JqZWN0IHByb3BlcnR5XG5cdFx0XHRcdGxldCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gcEFkZHJlc3Muc3Vic3RyaW5nKHRtcEJyYWNrZXRTdGFydEluZGV4KzEsIHRtcEJyYWNrZXRTdG9wSW5kZXgpLnRyaW0oKTtcblx0XHRcdFx0Ly8gQXR0ZW1wdCB0byBwYXJzZSB0aGUgcmVmZXJlbmNlIGFzIGEgbnVtYmVyLCB3aGljaCB3aWxsIGJlIHVzZWQgYXMgYW4gYXJyYXkgZWxlbWVudFxuXHRcdFx0XHRsZXQgdG1wQm94ZWRQcm9wZXJ0eU51bWJlciA9IHBhcnNlSW50KHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UsIDEwKTtcblxuXHRcdFx0XHQvLyBHdWFyZDogSWYgdGhlIHJlZmVycmFudCBpcyBhIG51bWJlciBhbmQgdGhlIGJveGVkIHByb3BlcnR5IGlzIG5vdCBhbiBhcnJheSwgb3IgdmljZSB2ZXJzYSwgcmV0dXJuIHVuZGVmaW5lZC5cblx0XHRcdFx0Ly8gICAgICAgIFRoaXMgc2VlbXMgY29uZnVzaW5nIHRvIG1lIGF0IGZpcnN0IHJlYWQsIHNvIGV4cGxhaW5hdGlvbjpcblx0XHRcdFx0Ly8gICAgICAgIElzIHRoZSBCb3hlZCBPYmplY3QgYW4gQXJyYXk/ICBUUlVFXG5cdFx0XHRcdC8vICAgICAgICBBbmQgaXMgdGhlIFJlZmVyZW5jZSBpbnNpZGUgdGhlIGJveGVkIE9iamVjdCBub3QgYSBudW1iZXI/IFRSVUVcblx0XHRcdFx0Ly8gICAgICAgIC0tPiAgU28gd2hlbiB0aGVzZSBhcmUgaW4gYWdyZWVtZW50LCBpdCdzIGFuIGltcG9zc2libGUgYWNjZXNzIHN0YXRlXG5cdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdKSA9PSBpc05hTih0bXBCb3hlZFByb3BlcnR5TnVtYmVyKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyAgICA0KSBJZiB0aGUgbWlkZGxlIHBhcnQgaXMgKm9ubHkqIGEgbnVtYmVyIChubyBzaW5nbGUsIGRvdWJsZSBvciBiYWNrdGljayBxdW90ZXMpIGl0IGlzIGFuIGFycmF5IGVsZW1lbnQsXG5cdFx0XHRcdC8vICAgICAgIG90aGVyd2lzZSB3ZSB3aWxsIHRyeSB0byB0cmVhdCBpdCBhcyBhIGR5bmFtaWMgb2JqZWN0IHByb3BlcnR5LlxuXHRcdFx0XHRpZiAoaXNOYU4odG1wQm94ZWRQcm9wZXJ0eU51bWJlcikpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvLyBUaGlzIGlzbid0IGEgbnVtYmVyIC4uLiBsZXQncyB0cmVhdCBpdCBhcyBhIGR5bmFtaWMgb2JqZWN0IHByb3BlcnR5LlxuXHRcdFx0XHRcdC8vIFdlIHdvdWxkIGV4cGVjdCB0aGUgcHJvcGVydHkgdG8gYmUgd3JhcHBlZCBpbiBzb21lIGtpbmQgb2YgcXVvdGVzIHNvIHN0cmlwIHRoZW1cblx0XHRcdFx0XHR0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gdGhpcy5jbGVhbldyYXBDaGFyYWN0ZXJzKCdcIicsIHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UpO1xuXHRcdFx0XHRcdHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSB0aGlzLmNsZWFuV3JhcENoYXJhY3RlcnMoJ2AnLCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblx0XHRcdFx0XHR0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gdGhpcy5jbGVhbldyYXBDaGFyYWN0ZXJzKFwiJ1wiLCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblxuXHRcdFx0XHRcdC8vIFJldHVybiB0aGUgdmFsdWUgaW4gdGhlIHByb3BlcnR5XG5cdFx0XHRcdFx0cmV0dXJuIHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdW3RtcEJveGVkUHJvcGVydHlSZWZlcmVuY2VdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXVt0bXBCb3hlZFByb3BlcnR5TnVtYmVyXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBOb3cgaXMgdGhlIHBvaW50IGluIHJlY3Vyc2lvbiB0byByZXR1cm4gdGhlIHZhbHVlIGluIHRoZSBhZGRyZXNzXG5cdFx0XHRcdHJldHVybiBwT2JqZWN0W3BBZGRyZXNzXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGxldCB0bXBTdWJPYmplY3ROYW1lID0gcEFkZHJlc3Muc3Vic3RyaW5nKDAsIHRtcFNlcGFyYXRvckluZGV4KTtcblx0XHRcdGxldCB0bXBOZXdBZGRyZXNzID0gcEFkZHJlc3Muc3Vic3RyaW5nKHRtcFNlcGFyYXRvckluZGV4KzEpO1xuXG5cdFx0XHQvLyBUZXN0IGlmIHRoZSB0bXBOZXdBZGRyZXNzIGlzIGFuIGFycmF5IG9yIG9iamVjdFxuXHRcdFx0Ly8gQ2hlY2sgaWYgaXQncyBhIGJveGVkIHByb3BlcnR5XG5cdFx0XHRsZXQgdG1wQnJhY2tldFN0YXJ0SW5kZXggPSB0bXBTdWJPYmplY3ROYW1lLmluZGV4T2YoJ1snKTtcblx0XHRcdGxldCB0bXBCcmFja2V0U3RvcEluZGV4ID0gdG1wU3ViT2JqZWN0TmFtZS5pbmRleE9mKCddJyk7XG5cdFx0XHQvLyBCb3hlZCBlbGVtZW50cyBsb29rIGxpa2UgdGhpczpcblx0XHRcdC8vIFx0XHRNeVZhbHVlc1s0Ml1cblx0XHRcdC8vIFx0XHRNeVZhbHVlc1snQ29sb3InXVxuXHRcdFx0Ly8gXHRcdE15VmFsdWVzW1wiV2VpZ2h0XCJdXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbYERpYW1ldGVyYF1cblx0XHRcdC8vXG5cdFx0XHQvLyBXaGVuIHdlIGFyZSBwYXNzZWQgU29tZU9iamVjdFtcIk5hbWVcIl0gdGhpcyBjb2RlIGJlbG93IHJlY3Vyc2VzIGFzIGlmIGl0IHdlcmUgU29tZU9iamVjdC5OYW1lXG5cdFx0XHQvLyBUaGUgcmVxdWlyZW1lbnRzIHRvIGRldGVjdCBhIGJveGVkIGVsZW1lbnQgYXJlOlxuXHRcdFx0Ly8gICAgMSkgVGhlIHN0YXJ0IGJyYWNrZXQgaXMgYWZ0ZXIgY2hhcmFjdGVyIDBcblx0XHRcdGlmICgodG1wQnJhY2tldFN0YXJ0SW5kZXggPiAwKSBcblx0XHRcdC8vICAgIDIpIFRoZSBlbmQgYnJhY2tldCBoYXMgc29tZXRoaW5nIGJldHdlZW4gdGhlbVxuXHRcdFx0XHQmJiAodG1wQnJhY2tldFN0b3BJbmRleCA+IHRtcEJyYWNrZXRTdGFydEluZGV4KSBcblx0XHRcdC8vICAgIDMpIFRoZXJlIGlzIGRhdGEgXG5cdFx0XHRcdCYmICh0bXBCcmFja2V0U3RvcEluZGV4IC0gdG1wQnJhY2tldFN0YXJ0SW5kZXggPiAwKSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlOYW1lID0gdG1wU3ViT2JqZWN0TmFtZS5zdWJzdHJpbmcoMCwgdG1wQnJhY2tldFN0YXJ0SW5kZXgpLnRyaW0oKTtcblxuXHRcdFx0XHRsZXQgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRtcFN1Yk9iamVjdE5hbWUuc3Vic3RyaW5nKHRtcEJyYWNrZXRTdGFydEluZGV4KzEsIHRtcEJyYWNrZXRTdG9wSW5kZXgpLnRyaW0oKTtcblxuXHRcdFx0XHRsZXQgdG1wQm94ZWRQcm9wZXJ0eU51bWJlciA9IHBhcnNlSW50KHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UsIDEwKTtcblxuXHRcdFx0XHQvLyBHdWFyZDogSWYgdGhlIHJlZmVycmFudCBpcyBhIG51bWJlciBhbmQgdGhlIGJveGVkIHByb3BlcnR5IGlzIG5vdCBhbiBhcnJheSwgb3IgdmljZSB2ZXJzYSwgcmV0dXJuIHVuZGVmaW5lZC5cblx0XHRcdFx0Ly8gICAgICAgIFRoaXMgc2VlbXMgY29uZnVzaW5nIHRvIG1lIGF0IGZpcnN0IHJlYWQsIHNvIGV4cGxhaW5hdGlvbjpcblx0XHRcdFx0Ly8gICAgICAgIElzIHRoZSBCb3hlZCBPYmplY3QgYW4gQXJyYXk/ICBUUlVFXG5cdFx0XHRcdC8vICAgICAgICBBbmQgaXMgdGhlIFJlZmVyZW5jZSBpbnNpZGUgdGhlIGJveGVkIE9iamVjdCBub3QgYSBudW1iZXI/IFRSVUVcblx0XHRcdFx0Ly8gICAgICAgIC0tPiAgU28gd2hlbiB0aGVzZSBhcmUgaW4gYWdyZWVtZW50LCBpdCdzIGFuIGltcG9zc2libGUgYWNjZXNzIHN0YXRlXG5cdFx0XHRcdC8vIFRoaXMgY291bGQgYmUgYSBmYWlsdXJlIGluIHRoZSByZWN1cnNpb24gY2hhaW4gYmVjYXVzZSB0aGV5IHBhc3NlZCBzb21ldGhpbmcgbGlrZSB0aGlzIGluOlxuXHRcdFx0XHQvLyAgICBTdHVkZW50RGF0YS5TZWN0aW9ucy5BbGdlYnJhLlN0dWRlbnRzWzFdLlRhcmR5XG5cdFx0XHRcdC8vICAgICAgIEJVVFxuXHRcdFx0XHQvLyAgICAgICAgIFN0dWRlbnREYXRhLlNlY3Rpb25zLkFsZ2VicmEuU3R1ZGVudHMgaXMgYW4gb2JqZWN0LCBzbyB0aGUgWzFdLlRhcmR5IGlzIG5vdCBwb3NzaWJsZSB0byBhY2Nlc3Ncblx0XHRcdFx0Ly8gVGhpcyBjb3VsZCBiZSBhIGZhaWx1cmUgaW4gdGhlIHJlY3Vyc2lvbiBjaGFpbiBiZWNhdXNlIHRoZXkgcGFzc2VkIHNvbWV0aGluZyBsaWtlIHRoaXMgaW46XG5cdFx0XHRcdC8vICAgIFN0dWRlbnREYXRhLlNlY3Rpb25zLkFsZ2VicmEuU3R1ZGVudHNbXCJKYW5lRG9lXCJdLkdyYWRlXG5cdFx0XHRcdC8vICAgICAgIEJVVFxuXHRcdFx0XHQvLyAgICAgICAgIFN0dWRlbnREYXRhLlNlY3Rpb25zLkFsZ2VicmEuU3R1ZGVudHMgaXMgYW4gYXJyYXksIHNvIHRoZSBbXCJKYW5lRG9lXCJdLkdyYWRlIGlzIG5vdCBwb3NzaWJsZSB0byBhY2Nlc3Ncblx0XHRcdFx0Ly8gVE9ETzogU2hvdWxkIHRoaXMgYmUgYW4gZXJyb3Igb3Igc29tZXRoaW5nPyAgU2hvdWxkIHdlIGtlZXAgYSBsb2cgb2YgZmFpbHVyZXMgbGlrZSB0aGlzP1xuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXSkgPT0gaXNOYU4odG1wQm94ZWRQcm9wZXJ0eU51bWJlcikpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9UaGlzIGlzIGEgYnJhY2tldGVkIHZhbHVlXG5cdFx0XHRcdC8vICAgIDQpIElmIHRoZSBtaWRkbGUgcGFydCBpcyAqb25seSogYSBudW1iZXIgKG5vIHNpbmdsZSwgZG91YmxlIG9yIGJhY2t0aWNrIHF1b3RlcykgaXQgaXMgYW4gYXJyYXkgZWxlbWVudCxcblx0XHRcdFx0Ly8gICAgICAgb3RoZXJ3aXNlIHdlIHdpbGwgdHJ5IHRvIHJlYXQgaXQgYXMgYSBkeW5hbWljIG9iamVjdCBwcm9wZXJ0eS5cblx0XHRcdFx0aWYgKGlzTmFOKHRtcEJveGVkUHJvcGVydHlOdW1iZXIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gVGhpcyBpc24ndCBhIG51bWJlciAuLi4gbGV0J3MgdHJlYXQgaXQgYXMgYSBkeW5hbm1pYyBvYmplY3QgcHJvcGVydHkuXG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycygnXCInLCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblx0XHRcdFx0XHR0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gdGhpcy5jbGVhbldyYXBDaGFyYWN0ZXJzKCdgJywgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycyhcIidcIiwgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cblx0XHRcdFx0XHQvLyBSZWN1cnNlIGRpcmVjdGx5IGludG8gdGhlIHN1Ym9iamVjdFxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldFZhbHVlQXRBZGRyZXNzKHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdW3RtcEJveGVkUHJvcGVydHlSZWZlcmVuY2VdLCB0bXBOZXdBZGRyZXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvLyBXZSBwYXJzZWQgYSB2YWxpZCBudW1iZXIgb3V0IG9mIHRoZSBib3hlZCBwcm9wZXJ0eSBuYW1lLCBzbyByZWN1cnNlIGludG8gdGhlIGFycmF5XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VmFsdWVBdEFkZHJlc3MocE9iamVjdFt0bXBCb3hlZFByb3BlcnR5TmFtZV1bdG1wQm94ZWRQcm9wZXJ0eU51bWJlcl0sIHRtcE5ld0FkZHJlc3MpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHRoZXJlIGlzIGFuIG9iamVjdCBwcm9wZXJ0eSBhbHJlYWR5IG5hbWVkIGZvciB0aGUgc3ViIG9iamVjdCwgYnV0IGl0IGlzbid0IGFuIG9iamVjdFxuXHRcdFx0Ly8gdGhlbiB0aGUgc3lzdGVtIGNhbid0IHNldCB0aGUgdmFsdWUgaW4gdGhlcmUuICBFcnJvciBhbmQgYWJvcnQhXG5cdFx0XHRpZiAocE9iamVjdC5oYXNPd25Qcm9wZXJ0eSh0bXBTdWJPYmplY3ROYW1lKSAmJiB0eXBlb2YocE9iamVjdFt0bXBTdWJPYmplY3ROYW1lXSkgIT09ICdvYmplY3QnKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocE9iamVjdC5oYXNPd25Qcm9wZXJ0eSh0bXBTdWJPYmplY3ROYW1lKSlcblx0XHRcdHtcblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgYWxyZWFkeSBhIHN1Ym9iamVjdCBwYXNzIHRoYXQgdG8gdGhlIHJlY3Vyc2l2ZSB0aGluZ3lcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VmFsdWVBdEFkZHJlc3MocE9iamVjdFt0bXBTdWJPYmplY3ROYW1lXSwgdG1wTmV3QWRkcmVzcyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdC8vIENyZWF0ZSBhIHN1Ym9iamVjdCBhbmQgdGhlbiBwYXNzIHRoYXRcblx0XHRcdFx0cE9iamVjdFt0bXBTdWJPYmplY3ROYW1lXSA9IHt9O1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRWYWx1ZUF0QWRkcmVzcyhwT2JqZWN0W3RtcFN1Yk9iamVjdE5hbWVdLCB0bXBOZXdBZGRyZXNzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBTZXQgdGhlIHZhbHVlIG9mIGFuIGVsZW1lbnQgYXQgYW4gYWRkcmVzc1xuXHRzZXRWYWx1ZUF0QWRkcmVzcyAocE9iamVjdCwgcEFkZHJlc3MsIHBWYWx1ZSlcblx0e1xuXHRcdC8vIE1ha2Ugc3VyZSBwT2JqZWN0IGlzIGFuIG9iamVjdFxuXHRcdGlmICh0eXBlb2YocE9iamVjdCkgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblx0XHQvLyBNYWtlIHN1cmUgcEFkZHJlc3MgaXMgYSBzdHJpbmdcblx0XHRpZiAodHlwZW9mKHBBZGRyZXNzKSAhPSAnc3RyaW5nJykgcmV0dXJuIGZhbHNlO1xuXG5cdFx0bGV0IHRtcFNlcGFyYXRvckluZGV4ID0gcEFkZHJlc3MuaW5kZXhPZignLicpO1xuXG5cdFx0aWYgKHRtcFNlcGFyYXRvckluZGV4ID09IC0xKVxuXHRcdHtcblx0XHRcdC8vIENoZWNrIGlmIGl0J3MgYSBib3hlZCBwcm9wZXJ0eVxuXHRcdFx0bGV0IHRtcEJyYWNrZXRTdGFydEluZGV4ID0gcEFkZHJlc3MuaW5kZXhPZignWycpO1xuXHRcdFx0bGV0IHRtcEJyYWNrZXRTdG9wSW5kZXggPSBwQWRkcmVzcy5pbmRleE9mKCddJyk7XG5cdFx0XHQvLyBCb3hlZCBlbGVtZW50cyBsb29rIGxpa2UgdGhpczpcblx0XHRcdC8vIFx0XHRNeVZhbHVlc1sxMF1cblx0XHRcdC8vIFx0XHRNeVZhbHVlc1snTmFtZSddXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbXCJBZ2VcIl1cblx0XHRcdC8vIFx0XHRNeVZhbHVlc1tgQ29zdGBdXG5cdFx0XHQvL1xuXHRcdFx0Ly8gV2hlbiB3ZSBhcmUgcGFzc2VkIFNvbWVPYmplY3RbXCJOYW1lXCJdIHRoaXMgY29kZSBiZWxvdyByZWN1cnNlcyBhcyBpZiBpdCB3ZXJlIFNvbWVPYmplY3QuTmFtZVxuXHRcdFx0Ly8gVGhlIHJlcXVpcmVtZW50cyB0byBkZXRlY3QgYSBib3hlZCBlbGVtZW50IGFyZTpcblx0XHRcdC8vICAgIDEpIFRoZSBzdGFydCBicmFja2V0IGlzIGFmdGVyIGNoYXJhY3RlciAwXG5cdFx0XHRpZiAoKHRtcEJyYWNrZXRTdGFydEluZGV4ID4gMCkgXG5cdFx0XHQvLyAgICAyKSBUaGUgZW5kIGJyYWNrZXQgaGFzIHNvbWV0aGluZyBiZXR3ZWVuIHRoZW1cblx0XHRcdFx0JiYgKHRtcEJyYWNrZXRTdG9wSW5kZXggPiB0bXBCcmFja2V0U3RhcnRJbmRleCkgXG5cdFx0XHQvLyAgICAzKSBUaGVyZSBpcyBkYXRhIFxuXHRcdFx0XHQmJiAodG1wQnJhY2tldFN0b3BJbmRleCAtIHRtcEJyYWNrZXRTdGFydEluZGV4ID4gMCkpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIFRoZSBcIk5hbWVcIiBvZiB0aGUgT2JqZWN0IGNvbnRhaW5lZCB0b28gdGhlIGxlZnQgb2YgdGhlIGJyYWNrZXRcblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlOYW1lID0gcEFkZHJlc3Muc3Vic3RyaW5nKDAsIHRtcEJyYWNrZXRTdGFydEluZGV4KS50cmltKCk7XG5cblx0XHRcdFx0Ly8gSWYgdGhlIHN1YnByb3BlcnR5IGRvZXNuJ3QgdGVzdCBhcyBhIHByb3BlciBPYmplY3QsIG5vbmUgb2YgdGhlIHJlc3Qgb2YgdGhpcyBpcyBwb3NzaWJsZS5cblx0XHRcdFx0Ly8gVGhpcyBpcyBhIHJhcmUgY2FzZSB3aGVyZSBBcnJheXMgdGVzdGluZyBhcyBPYmplY3RzIGlzIHVzZWZ1bFxuXHRcdFx0XHRpZiAodHlwZW9mKHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdKSAhPT0gJ29iamVjdCcpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUaGUgXCJSZWZlcmVuY2VcIiB0byB0aGUgcHJvcGVydHkgd2l0aGluIGl0LCBlaXRoZXIgYW4gYXJyYXkgZWxlbWVudCBvciBvYmplY3QgcHJvcGVydHlcblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSBwQWRkcmVzcy5zdWJzdHJpbmcodG1wQnJhY2tldFN0YXJ0SW5kZXgrMSwgdG1wQnJhY2tldFN0b3BJbmRleCkudHJpbSgpO1xuXHRcdFx0XHQvLyBBdHRlbXB0IHRvIHBhcnNlIHRoZSByZWZlcmVuY2UgYXMgYSBudW1iZXIsIHdoaWNoIHdpbGwgYmUgdXNlZCBhcyBhbiBhcnJheSBlbGVtZW50XG5cdFx0XHRcdGxldCB0bXBCb3hlZFByb3BlcnR5TnVtYmVyID0gcGFyc2VJbnQodG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSwgMTApO1xuXG5cdFx0XHRcdC8vIEd1YXJkOiBJZiB0aGUgcmVmZXJyYW50IGlzIGEgbnVtYmVyIGFuZCB0aGUgYm94ZWQgcHJvcGVydHkgaXMgbm90IGFuIGFycmF5LCBvciB2aWNlIHZlcnNhLCByZXR1cm4gdW5kZWZpbmVkLlxuXHRcdFx0XHQvLyAgICAgICAgVGhpcyBzZWVtcyBjb25mdXNpbmcgdG8gbWUgYXQgZmlyc3QgcmVhZCwgc28gZXhwbGFpbmF0aW9uOlxuXHRcdFx0XHQvLyAgICAgICAgSXMgdGhlIEJveGVkIE9iamVjdCBhbiBBcnJheT8gIFRSVUVcblx0XHRcdFx0Ly8gICAgICAgIEFuZCBpcyB0aGUgUmVmZXJlbmNlIGluc2lkZSB0aGUgYm94ZWQgT2JqZWN0IG5vdCBhIG51bWJlcj8gVFJVRVxuXHRcdFx0XHQvLyAgICAgICAgLS0+ICBTbyB3aGVuIHRoZXNlIGFyZSBpbiBhZ3JlZW1lbnQsIGl0J3MgYW4gaW1wb3NzaWJsZSBhY2Nlc3Mgc3RhdGVcblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocE9iamVjdFt0bXBCb3hlZFByb3BlcnR5TmFtZV0pID09IGlzTmFOKHRtcEJveGVkUHJvcGVydHlOdW1iZXIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gICAgNCkgSWYgdGhlIG1pZGRsZSBwYXJ0IGlzICpvbmx5KiBhIG51bWJlciAobm8gc2luZ2xlLCBkb3VibGUgb3IgYmFja3RpY2sgcXVvdGVzKSBpdCBpcyBhbiBhcnJheSBlbGVtZW50LFxuXHRcdFx0XHQvLyAgICAgICBvdGhlcndpc2Ugd2Ugd2lsbCB0cnkgdG8gdHJlYXQgaXQgYXMgYSBkeW5hbWljIG9iamVjdCBwcm9wZXJ0eS5cblx0XHRcdFx0aWYgKGlzTmFOKHRtcEJveGVkUHJvcGVydHlOdW1iZXIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gVGhpcyBpc24ndCBhIG51bWJlciAuLi4gbGV0J3MgdHJlYXQgaXQgYXMgYSBkeW5hbWljIG9iamVjdCBwcm9wZXJ0eS5cblx0XHRcdFx0XHQvLyBXZSB3b3VsZCBleHBlY3QgdGhlIHByb3BlcnR5IHRvIGJlIHdyYXBwZWQgaW4gc29tZSBraW5kIG9mIHF1b3RlcyBzbyBzdHJpcCB0aGVtXG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycygnXCInLCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblx0XHRcdFx0XHR0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gdGhpcy5jbGVhbldyYXBDaGFyYWN0ZXJzKCdgJywgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycyhcIidcIiwgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cblx0XHRcdFx0XHQvLyBSZXR1cm4gdGhlIHZhbHVlIGluIHRoZSBwcm9wZXJ0eVxuXHRcdFx0XHRcdHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdW3RtcEJveGVkUHJvcGVydHlSZWZlcmVuY2VdID0gcFZhbHVlO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdW3RtcEJveGVkUHJvcGVydHlOdW1iZXJdID0gcFZhbHVlO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdC8vIE5vdyBpcyB0aGUgdGltZSBpbiByZWN1cnNpb24gdG8gc2V0IHRoZSB2YWx1ZSBpbiB0aGUgb2JqZWN0XG5cdFx0XHRcdHBPYmplY3RbcEFkZHJlc3NdID0gcFZhbHVlO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGxldCB0bXBTdWJPYmplY3ROYW1lID0gcEFkZHJlc3Muc3Vic3RyaW5nKDAsIHRtcFNlcGFyYXRvckluZGV4KTtcblx0XHRcdGxldCB0bXBOZXdBZGRyZXNzID0gcEFkZHJlc3Muc3Vic3RyaW5nKHRtcFNlcGFyYXRvckluZGV4KzEpO1xuXG5cdFx0XHQvLyBUZXN0IGlmIHRoZSB0bXBOZXdBZGRyZXNzIGlzIGFuIGFycmF5IG9yIG9iamVjdFxuXHRcdFx0Ly8gQ2hlY2sgaWYgaXQncyBhIGJveGVkIHByb3BlcnR5XG5cdFx0XHRsZXQgdG1wQnJhY2tldFN0YXJ0SW5kZXggPSB0bXBTdWJPYmplY3ROYW1lLmluZGV4T2YoJ1snKTtcblx0XHRcdGxldCB0bXBCcmFja2V0U3RvcEluZGV4ID0gdG1wU3ViT2JqZWN0TmFtZS5pbmRleE9mKCddJyk7XG5cdFx0XHQvLyBCb3hlZCBlbGVtZW50cyBsb29rIGxpa2UgdGhpczpcblx0XHRcdC8vIFx0XHRNeVZhbHVlc1s0Ml1cblx0XHRcdC8vIFx0XHRNeVZhbHVlc1snQ29sb3InXVxuXHRcdFx0Ly8gXHRcdE15VmFsdWVzW1wiV2VpZ2h0XCJdXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbYERpYW1ldGVyYF1cblx0XHRcdC8vXG5cdFx0XHQvLyBXaGVuIHdlIGFyZSBwYXNzZWQgU29tZU9iamVjdFtcIk5hbWVcIl0gdGhpcyBjb2RlIGJlbG93IHJlY3Vyc2VzIGFzIGlmIGl0IHdlcmUgU29tZU9iamVjdC5OYW1lXG5cdFx0XHQvLyBUaGUgcmVxdWlyZW1lbnRzIHRvIGRldGVjdCBhIGJveGVkIGVsZW1lbnQgYXJlOlxuXHRcdFx0Ly8gICAgMSkgVGhlIHN0YXJ0IGJyYWNrZXQgaXMgYWZ0ZXIgY2hhcmFjdGVyIDBcblx0XHRcdGlmICgodG1wQnJhY2tldFN0YXJ0SW5kZXggPiAwKSBcblx0XHRcdC8vICAgIDIpIFRoZSBlbmQgYnJhY2tldCBoYXMgc29tZXRoaW5nIGJldHdlZW4gdGhlbVxuXHRcdFx0XHQmJiAodG1wQnJhY2tldFN0b3BJbmRleCA+IHRtcEJyYWNrZXRTdGFydEluZGV4KSBcblx0XHRcdC8vICAgIDMpIFRoZXJlIGlzIGRhdGEgXG5cdFx0XHRcdCYmICh0bXBCcmFja2V0U3RvcEluZGV4IC0gdG1wQnJhY2tldFN0YXJ0SW5kZXggPiAwKSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlOYW1lID0gdG1wU3ViT2JqZWN0TmFtZS5zdWJzdHJpbmcoMCwgdG1wQnJhY2tldFN0YXJ0SW5kZXgpLnRyaW0oKTtcblxuXHRcdFx0XHRsZXQgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRtcFN1Yk9iamVjdE5hbWUuc3Vic3RyaW5nKHRtcEJyYWNrZXRTdGFydEluZGV4KzEsIHRtcEJyYWNrZXRTdG9wSW5kZXgpLnRyaW0oKTtcblxuXHRcdFx0XHRsZXQgdG1wQm94ZWRQcm9wZXJ0eU51bWJlciA9IHBhcnNlSW50KHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UsIDEwKTtcblxuXHRcdFx0XHQvLyBHdWFyZDogSWYgdGhlIHJlZmVycmFudCBpcyBhIG51bWJlciBhbmQgdGhlIGJveGVkIHByb3BlcnR5IGlzIG5vdCBhbiBhcnJheSwgb3IgdmljZSB2ZXJzYSwgcmV0dXJuIHVuZGVmaW5lZC5cblx0XHRcdFx0Ly8gICAgICAgIFRoaXMgc2VlbXMgY29uZnVzaW5nIHRvIG1lIGF0IGZpcnN0IHJlYWQsIHNvIGV4cGxhaW5hdGlvbjpcblx0XHRcdFx0Ly8gICAgICAgIElzIHRoZSBCb3hlZCBPYmplY3QgYW4gQXJyYXk/ICBUUlVFXG5cdFx0XHRcdC8vICAgICAgICBBbmQgaXMgdGhlIFJlZmVyZW5jZSBpbnNpZGUgdGhlIGJveGVkIE9iamVjdCBub3QgYSBudW1iZXI/IFRSVUVcblx0XHRcdFx0Ly8gICAgICAgIC0tPiAgU28gd2hlbiB0aGVzZSBhcmUgaW4gYWdyZWVtZW50LCBpdCdzIGFuIGltcG9zc2libGUgYWNjZXNzIHN0YXRlXG5cdFx0XHRcdC8vIFRoaXMgY291bGQgYmUgYSBmYWlsdXJlIGluIHRoZSByZWN1cnNpb24gY2hhaW4gYmVjYXVzZSB0aGV5IHBhc3NlZCBzb21ldGhpbmcgbGlrZSB0aGlzIGluOlxuXHRcdFx0XHQvLyAgICBTdHVkZW50RGF0YS5TZWN0aW9ucy5BbGdlYnJhLlN0dWRlbnRzWzFdLlRhcmR5XG5cdFx0XHRcdC8vICAgICAgIEJVVFxuXHRcdFx0XHQvLyAgICAgICAgIFN0dWRlbnREYXRhLlNlY3Rpb25zLkFsZ2VicmEuU3R1ZGVudHMgaXMgYW4gb2JqZWN0LCBzbyB0aGUgWzFdLlRhcmR5IGlzIG5vdCBwb3NzaWJsZSB0byBhY2Nlc3Ncblx0XHRcdFx0Ly8gVGhpcyBjb3VsZCBiZSBhIGZhaWx1cmUgaW4gdGhlIHJlY3Vyc2lvbiBjaGFpbiBiZWNhdXNlIHRoZXkgcGFzc2VkIHNvbWV0aGluZyBsaWtlIHRoaXMgaW46XG5cdFx0XHRcdC8vICAgIFN0dWRlbnREYXRhLlNlY3Rpb25zLkFsZ2VicmEuU3R1ZGVudHNbXCJKYW5lRG9lXCJdLkdyYWRlXG5cdFx0XHRcdC8vICAgICAgIEJVVFxuXHRcdFx0XHQvLyAgICAgICAgIFN0dWRlbnREYXRhLlNlY3Rpb25zLkFsZ2VicmEuU3R1ZGVudHMgaXMgYW4gYXJyYXksIHNvIHRoZSBbXCJKYW5lRG9lXCJdLkdyYWRlIGlzIG5vdCBwb3NzaWJsZSB0byBhY2Nlc3Ncblx0XHRcdFx0Ly8gVE9ETzogU2hvdWxkIHRoaXMgYmUgYW4gZXJyb3Igb3Igc29tZXRoaW5nPyAgU2hvdWxkIHdlIGtlZXAgYSBsb2cgb2YgZmFpbHVyZXMgbGlrZSB0aGlzP1xuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXSkgPT0gaXNOYU4odG1wQm94ZWRQcm9wZXJ0eU51bWJlcikpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL1RoaXMgaXMgYSBicmFja2V0ZWQgdmFsdWVcblx0XHRcdFx0Ly8gICAgNCkgSWYgdGhlIG1pZGRsZSBwYXJ0IGlzICpvbmx5KiBhIG51bWJlciAobm8gc2luZ2xlLCBkb3VibGUgb3IgYmFja3RpY2sgcXVvdGVzKSBpdCBpcyBhbiBhcnJheSBlbGVtZW50LFxuXHRcdFx0XHQvLyAgICAgICBvdGhlcndpc2Ugd2Ugd2lsbCB0cnkgdG8gcmVhdCBpdCBhcyBhIGR5bmFtaWMgb2JqZWN0IHByb3BlcnR5LlxuXHRcdFx0XHRpZiAoaXNOYU4odG1wQm94ZWRQcm9wZXJ0eU51bWJlcikpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvLyBUaGlzIGlzbid0IGEgbnVtYmVyIC4uLiBsZXQncyB0cmVhdCBpdCBhcyBhIGR5bmFubWljIG9iamVjdCBwcm9wZXJ0eS5cblx0XHRcdFx0XHR0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gdGhpcy5jbGVhbldyYXBDaGFyYWN0ZXJzKCdcIicsIHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UpO1xuXHRcdFx0XHRcdHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSB0aGlzLmNsZWFuV3JhcENoYXJhY3RlcnMoJ2AnLCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblx0XHRcdFx0XHR0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gdGhpcy5jbGVhbldyYXBDaGFyYWN0ZXJzKFwiJ1wiLCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblxuXHRcdFx0XHRcdC8vIFJlY3Vyc2UgZGlyZWN0bHkgaW50byB0aGUgc3Vib2JqZWN0XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0VmFsdWVBdEFkZHJlc3MocE9iamVjdFt0bXBCb3hlZFByb3BlcnR5TmFtZV1bdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZV0sIHRtcE5ld0FkZHJlc3MsIHBWYWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gV2UgcGFyc2VkIGEgdmFsaWQgbnVtYmVyIG91dCBvZiB0aGUgYm94ZWQgcHJvcGVydHkgbmFtZSwgc28gcmVjdXJzZSBpbnRvIHRoZSBhcnJheVxuXHRcdFx0XHRcdHJldHVybiB0aGlzLnNldFZhbHVlQXRBZGRyZXNzKHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdW3RtcEJveGVkUHJvcGVydHlOdW1iZXJdLCB0bXBOZXdBZGRyZXNzLCBwVmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHRoZXJlIGlzIGFuIG9iamVjdCBwcm9wZXJ0eSBhbHJlYWR5IG5hbWVkIGZvciB0aGUgc3ViIG9iamVjdCwgYnV0IGl0IGlzbid0IGFuIG9iamVjdFxuXHRcdFx0Ly8gdGhlbiB0aGUgc3lzdGVtIGNhbid0IHNldCB0aGUgdmFsdWUgaW4gdGhlcmUuICBFcnJvciBhbmQgYWJvcnQhXG5cdFx0XHRpZiAocE9iamVjdC5oYXNPd25Qcm9wZXJ0eSh0bXBTdWJPYmplY3ROYW1lKSAmJiB0eXBlb2YocE9iamVjdFt0bXBTdWJPYmplY3ROYW1lXSkgIT09ICdvYmplY3QnKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoIXBPYmplY3QuaGFzT3duUHJvcGVydHkoJ19fRVJST1InKSlcblx0XHRcdFx0XHRwT2JqZWN0WydfX0VSUk9SJ10gPSB7fTtcblx0XHRcdFx0Ly8gUHV0IGl0IGluIGFuIGVycm9yIG9iamVjdCBzbyBkYXRhIGlzbid0IGxvc3Rcblx0XHRcdFx0cE9iamVjdFsnX19FUlJPUiddW3BBZGRyZXNzXSA9IHBWYWx1ZTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocE9iamVjdC5oYXNPd25Qcm9wZXJ0eSh0bXBTdWJPYmplY3ROYW1lKSlcblx0XHRcdHtcblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgYWxyZWFkeSBhIHN1Ym9iamVjdCBwYXNzIHRoYXQgdG8gdGhlIHJlY3Vyc2l2ZSB0aGluZ3lcblx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0VmFsdWVBdEFkZHJlc3MocE9iamVjdFt0bXBTdWJPYmplY3ROYW1lXSwgdG1wTmV3QWRkcmVzcywgcFZhbHVlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Ly8gQ3JlYXRlIGEgc3Vib2JqZWN0IGFuZCB0aGVuIHBhc3MgdGhhdFxuXHRcdFx0XHRwT2JqZWN0W3RtcFN1Yk9iamVjdE5hbWVdID0ge307XG5cdFx0XHRcdHJldHVybiB0aGlzLnNldFZhbHVlQXRBZGRyZXNzKHBPYmplY3RbdG1wU3ViT2JqZWN0TmFtZV0sIHRtcE5ld0FkZHJlc3MsIHBWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hbnlmZXN0T2JqZWN0QWRkcmVzc1Jlc29sdmVyOyIsIi8qKlxuKiBAbGljZW5zZSBNSVRcbiogQGF1dGhvciA8c3RldmVuQHZlbG96by5jb20+XG4qL1xubGV0IGxpYlNpbXBsZUxvZyA9IHJlcXVpcmUoJy4vTWFueWZlc3QtTG9nVG9Db25zb2xlLmpzJyk7XG5cbi8qKlxuKiBTY2hlbWEgTWFuaXB1bGF0aW9uIEZ1bmN0aW9uc1xuKlxuKiBAY2xhc3MgTWFueWZlc3RTY2hlbWFNYW5pcHVsYXRpb25cbiovXG5jbGFzcyBNYW55ZmVzdFNjaGVtYU1hbmlwdWxhdGlvblxue1xuXHRjb25zdHJ1Y3RvcihwSW5mb0xvZywgcEVycm9yTG9nKVxuXHR7XG5cdFx0Ly8gV2lyZSBpbiBsb2dnaW5nXG5cdFx0dGhpcy5sb2dJbmZvID0gKHR5cGVvZihwSW5mb0xvZykgPT09ICdmdW5jdGlvbicpID8gcEluZm9Mb2cgOiBsaWJTaW1wbGVMb2c7XG5cdFx0dGhpcy5sb2dFcnJvciA9ICh0eXBlb2YocEVycm9yTG9nKSA9PT0gJ2Z1bmN0aW9uJykgPyBwRXJyb3JMb2cgOiBsaWJTaW1wbGVMb2c7XG5cdH1cblxuICAgIC8vIFRoaXMgdHJhbnNsYXRlcyB0aGUgZGVmYXVsdCBhZGRyZXNzIG1hcHBpbmdzIHRvIHNvbWV0aGluZyBkaWZmZXJlbnQuXG4gICAgLy9cbiAgICAvLyBGb3IgaW5zdGFuY2UgeW91IGNhbiBwYXNzIGluIG1hbnlmZXN0IHNjaGVtYSBkZXNjcmlwdG9yIG9iamVjdDpcbiAgICAvLyBcdHtcblx0Ly9cdCAgXCJBZGRyZXNzLk9mLmFcIjogeyBcIkhhc2hcIjogXCJhXCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH0sXG5cdC8vXHQgIFwiQWRkcmVzcy5PZi5iXCI6IHsgXCJIYXNoXCI6IFwiYlwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9XG5cdC8vICB9XG4gICAgLy9cbiAgICAvL1xuICAgIC8vIEFuZCB0aGVuIGFuIGFkZHJlc3MgbWFwcGluZyAoYmFzaWNhbGx5IGEgSGFzaC0+QWRkcmVzcyBtYXApXG4gICAgLy8gIHtcbiAgICAvLyAgICBcImFcIjogXCJOZXcuQWRkcmVzcy5PZi5hXCIsXG4gICAgLy8gICAgXCJiXCI6IFwiTmV3LkFkZHJlc3MuT2YuYlwiICBcbiAgICAvLyAgfVxuICAgIC8vXG4gICAgLy8gTk9URTogVGhpcyBtdXRhdGVzIHRoZSBzY2hlbWEgb2JqZWN0IHBlcm1hbmVudGx5LCBhbHRlcmluZyB0aGUgYmFzZSBoYXNoLlxuICAgIC8vICAgICAgIElmIHRoZXJlIGlzIGEgY29sbGlzaW9uIHdpdGggYW4gZXhpc3RpbmcgYWRkcmVzcywgaXQgY2FuIGxlYWQgdG8gb3ZlcndyaXRlcy5cbiAgICAvLyBUT0RPOiBEaXNjdXNzIHdoYXQgc2hvdWxkIGhhcHBlbiBvbiBjb2xsaXNpb25zLlxuXHRyZXNvbHZlQWRkcmVzc01hcHBpbmdzKHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzLCBwQWRkcmVzc01hcHBpbmcpXG5cdHtcblx0XHRpZiAodHlwZW9mKHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzKSAhPSAnb2JqZWN0Jylcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ0Vycm9yKGBBdHRlbXB0ZWQgdG8gcmVzb2x2ZSBhZGRyZXNzIG1hcHBpbmcgYnV0IHRoZSBkZXNjcmlwdG9yIHdhcyBub3QgYW4gb2JqZWN0LmApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YocEFkZHJlc3NNYXBwaW5nKSAhPSAnb2JqZWN0Jylcblx0XHR7XG5cdFx0XHQvLyBObyBtYXBwaW5ncyB3ZXJlIHBhc3NlZCBpblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IHRoZSBhcnJheXMgb2YgYm90aCB0aGUgc2NoZW1hIGRlZmluaXRpb24gYW5kIHRoZSBoYXNoIG1hcHBpbmdcblx0XHRsZXQgdG1wTWFueWZlc3RBZGRyZXNzZXMgPSBPYmplY3Qua2V5cyhwTWFueWZlc3RTY2hlbWFEZXNjcmlwdG9ycyk7XG5cdFx0bGV0IHRtcEhhc2hNYXBwaW5nID0ge307XG5cdFx0dG1wTWFueWZlc3RBZGRyZXNzZXMuZm9yRWFjaChcblx0XHRcdChwQWRkcmVzcykgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzW3BBZGRyZXNzXS5oYXNPd25Qcm9wZXJ0eSgnSGFzaCcpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dG1wSGFzaE1hcHBpbmdbcE1hbnlmZXN0U2NoZW1hRGVzY3JpcHRvcnNbcEFkZHJlc3NdLkhhc2hdID0gcEFkZHJlc3M7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0bGV0IHRtcEFkZHJlc3NNYXBwaW5nU2V0ID0gT2JqZWN0LmtleXMocEFkZHJlc3NNYXBwaW5nKTtcblxuXHRcdHRtcEFkZHJlc3NNYXBwaW5nU2V0LmZvckVhY2goXG5cdFx0XHQocElucHV0QWRkcmVzcykgPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IHRtcE5ld0Rlc2NyaXB0b3JBZGRyZXNzID0gcEFkZHJlc3NNYXBwaW5nW3BJbnB1dEFkZHJlc3NdO1xuXHRcdFx0XHRsZXQgdG1wT2xkRGVzY3JpcHRvckFkZHJlc3MgPSBmYWxzZTtcblx0XHRcdFx0bGV0IHRtcERlc2NyaXB0b3IgPSBmYWxzZTtcblxuXHRcdFx0XHQvLyBTZWUgaWYgdGhlcmUgaXMgYSBtYXRjaGluZyBkZXNjcmlwdG9yIGVpdGhlciBieSBBZGRyZXNzIGRpcmVjdGx5IG9yIEhhc2hcblx0XHRcdFx0aWYgKHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzLmhhc093blByb3BlcnR5KHBJbnB1dEFkZHJlc3MpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dG1wT2xkRGVzY3JpcHRvckFkZHJlc3MgPSBwSW5wdXRBZGRyZXNzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHRtcEhhc2hNYXBwaW5nLmhhc093blByb3BlcnR5KHBJbnB1dEFkZHJlc3MpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dG1wT2xkRGVzY3JpcHRvckFkZHJlc3MgPSB0bXBIYXNoTWFwcGluZ1twSW5wdXRBZGRyZXNzXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIHRoZXJlIHdhcyBhIG1hdGNoaW5nIGRlc2NyaXB0b3IgaW4gdGhlIG1hbmlmZXN0LCBzdG9yZSBpdCBpbiB0aGUgdGVtcG9yYXJ5IGRlc2NyaXB0b3Jcblx0XHRcdFx0aWYgKHRtcE9sZERlc2NyaXB0b3JBZGRyZXNzKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dG1wRGVzY3JpcHRvciA9IHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzW3RtcE9sZERlc2NyaXB0b3JBZGRyZXNzXTtcblx0XHRcdFx0XHRkZWxldGUgcE1hbnlmZXN0U2NoZW1hRGVzY3JpcHRvcnNbdG1wT2xkRGVzY3JpcHRvckFkZHJlc3NdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIENyZWF0ZSBhIG5ldyBkZXNjcmlwdG9yISAgTWFwIGl0IHRvIHRoZSBpbnB1dCBhZGRyZXNzLlxuXHRcdFx0XHRcdHRtcERlc2NyaXB0b3IgPSB7IEhhc2g6cElucHV0QWRkcmVzcyB9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gTm93IHJlLWFkZCB0aGUgZGVzY3JpcHRvciB0byB0aGUgbWFueWZlc3Qgc2NoZW1hXG5cdFx0XHRcdHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzW3RtcE5ld0Rlc2NyaXB0b3JBZGRyZXNzXSA9IHRtcERlc2NyaXB0b3I7XG5cdFx0XHR9KTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0c2FmZVJlc29sdmVBZGRyZXNzTWFwcGluZ3MocE1hbnlmZXN0U2NoZW1hRGVzY3JpcHRvcnMsIHBBZGRyZXNzTWFwcGluZylcblx0e1xuXHRcdC8vIFRoaXMgcmV0dXJucyB0aGUgZGVzY3JpcHRvcnMgYXMgYSBuZXcgb2JqZWN0LCBzYWZlbHkgcmVtYXBwaW5nIHdpdGhvdXQgbXV0YXRpbmcgdGhlIG9yaWdpbmFsIHNjaGVtYSBEZXNjcmlwdG9yc1xuXHRcdGxldCB0bXBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShwTWFueWZlc3RTY2hlbWFEZXNjcmlwdG9ycykpO1xuXHRcdHRoaXMucmVzb2x2ZUFkZHJlc3NNYXBwaW5ncyh0bXBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzLCBwQWRkcmVzc01hcHBpbmcpO1xuXHRcdHJldHVybiB0bXBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWFueWZlc3RTY2hlbWFNYW5pcHVsYXRpb247IiwiLyoqXG4qIEBsaWNlbnNlIE1JVFxuKiBAYXV0aG9yIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5sZXQgbGliU2ltcGxlTG9nID0gcmVxdWlyZSgnLi9NYW55ZmVzdC1Mb2dUb0NvbnNvbGUuanMnKTtcbmxldCBsaWJPYmplY3RBZGRyZXNzUmVzb2x2ZXIgPSByZXF1aXJlKCcuL01hbnlmZXN0LU9iamVjdEFkZHJlc3NSZXNvbHZlci5qcycpO1xubGV0IGxpYkhhc2hUcmFuc2xhdGlvbiA9IHJlcXVpcmUoJy4vTWFueWZlc3QtSGFzaFRyYW5zbGF0aW9uLmpzJyk7XG5sZXQgbGliU2NoZW1hTWFuaXB1bGF0aW9uID0gcmVxdWlyZSgnLi9NYW55ZmVzdC1TY2hlbWFNYW5pcHVsYXRpb24uanMnKTtcblxuLyoqXG4qIE1hbnlmZXN0IG9iamVjdCBhZGRyZXNzLWJhc2VkIGRlc2NyaXB0aW9ucyBhbmQgbWFuaXB1bGF0aW9ucy5cbipcbiogQGNsYXNzIE1hbnlmZXN0XG4qL1xuY2xhc3MgTWFueWZlc3Rcbntcblx0Y29uc3RydWN0b3IocE1hbmlmZXN0LCBwSW5mb0xvZywgcEVycm9yTG9nLCBwT3B0aW9ucylcblx0e1xuXHRcdC8vIFdpcmUgaW4gbG9nZ2luZ1xuXHRcdHRoaXMubG9nSW5mbyA9ICh0eXBlb2YocEluZm9Mb2cpID09PSAnZnVuY3Rpb24nKSA/IHBJbmZvTG9nIDogbGliU2ltcGxlTG9nO1xuXHRcdHRoaXMubG9nRXJyb3IgPSAodHlwZW9mKHBFcnJvckxvZykgPT09ICdmdW5jdGlvbicpID8gcEVycm9yTG9nIDogbGliU2ltcGxlTG9nO1xuXG5cdFx0Ly8gQ3JlYXRlIGFuIG9iamVjdCBhZGRyZXNzIHJlc29sdmVyIGFuZCBtYXAgaW4gdGhlIGZ1bmN0aW9uc1xuXHRcdHRoaXMub2JqZWN0QWRkcmVzc1Jlc29sdmVyID0gbmV3IGxpYk9iamVjdEFkZHJlc3NSZXNvbHZlcih0aGlzLmxvZ0luZm8sIHRoaXMubG9nRXJyb3IpO1xuXG5cdFx0dGhpcy5vcHRpb25zID0gKFxuXHRcdFx0e1xuXHRcdFx0XHRzdHJpY3Q6IGZhbHNlLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWVzOiBcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcIlN0cmluZ1wiOiBcIlwiLFxuXHRcdFx0XHRcdFx0XCJOdW1iZXJcIjogMCxcblx0XHRcdFx0XHRcdFwiRmxvYXRcIjogMC4wLFxuXHRcdFx0XHRcdFx0XCJJbnRlZ2VyXCI6IDAsXG5cdFx0XHRcdFx0XHRcIkJvb2xlYW5cIjogZmFsc2UsXG5cdFx0XHRcdFx0XHRcIkJpbmFyeVwiOiAwLFxuXHRcdFx0XHRcdFx0XCJEYXRlVGltZVwiOiAwLFxuXHRcdFx0XHRcdFx0XCJBcnJheVwiOiBbXSxcblx0XHRcdFx0XHRcdFwiT2JqZWN0XCI6IHt9LFxuXHRcdFx0XHRcdFx0XCJOdWxsXCI6IG51bGxcblx0XHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdHRoaXMuc2NvcGUgPSB1bmRlZmluZWQ7XG5cdFx0dGhpcy5lbGVtZW50QWRkcmVzc2VzID0gdW5kZWZpbmVkO1xuXHRcdHRoaXMuZWxlbWVudEhhc2hlcyA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLmVsZW1lbnREZXNjcmlwdG9ycyA9IHVuZGVmaW5lZDtcblxuXHRcdHRoaXMucmVzZXQoKTtcblxuXHRcdGlmICh0eXBlb2YocE1hbmlmZXN0KSA9PT0gJ29iamVjdCcpXG5cdFx0e1xuXHRcdFx0dGhpcy5sb2FkTWFuaWZlc3QocE1hbmlmZXN0KTtcblx0XHR9XG5cblx0XHR0aGlzLnNjaGVtYU1hbmlwdWxhdGlvbnMgPSBuZXcgbGliU2NoZW1hTWFuaXB1bGF0aW9uKHRoaXMubG9nSW5mbywgdGhpcy5sb2dFcnJvcik7XG5cblx0XHR0aGlzLmhhc2hUcmFuc2xhdGlvbnMgPSBuZXcgbGliSGFzaFRyYW5zbGF0aW9uKHRoaXMubG9nSW5mbywgdGhpcy5sb2dFcnJvcik7XG5cdH1cblxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKiBTY2hlbWEgTWFuaWZlc3QgTG9hZGluZywgUmVhZGluZywgTWFuaXB1bGF0aW9uIGFuZCBTZXJpYWxpemF0aW9uIEZ1bmN0aW9uc1xuXHQgKi9cblxuXHQvLyBSZXNldCBjcml0aWNhbCBtYW5pZmVzdCBwcm9wZXJ0aWVzXG5cdHJlc2V0KClcblx0e1xuXHRcdHRoaXMuc2NvcGUgPSAnREVGQVVMVCc7XG5cdFx0dGhpcy5lbGVtZW50QWRkcmVzc2VzID0gW107XG5cdFx0dGhpcy5lbGVtZW50SGFzaGVzID0ge307XG5cdFx0dGhpcy5lbGVtZW50RGVzY3JpcHRvcnMgPSB7fTtcblx0fVxuXG5cdC8vIERlc2VyaWFsaXplIGEgTWFuaWZlc3QgZnJvbSBhIHN0cmluZ1xuXHRkZXNlcmlhbGl6ZShwTWFuaWZlc3RTdHJpbmcpXG5cdHtcblx0XHQvLyBUT0RPOiBBZGQgZ3VhcmRzIGZvciBiYWQgbWFuaWZlc3Qgc3RyaW5nXG5cdFx0cmV0dXJuIHRoaXMubG9hZE1hbmlmZXN0KEpTT04ucGFyc2UocE1hbmlmZXN0U3RyaW5nKSk7XG5cdH1cblxuXHQvLyBMb2FkIGEgbWFuaWZlc3QgZnJvbSBhbiBvYmplY3Rcblx0bG9hZE1hbmlmZXN0KHBNYW5pZmVzdClcblx0e1xuXHRcdGlmICh0eXBlb2YocE1hbmlmZXN0KSAhPT0gJ29iamVjdCcpXG5cdFx0e1xuXHRcdFx0dGhpcy5sb2dFcnJvcihgKCR7dGhpcy5zY29wZX0pIEVycm9yIGxvYWRpbmcgbWFuaWZlc3Q7IGV4cGVjdGluZyBhbiBvYmplY3QgYnV0IHBhcmFtZXRlciB3YXMgdHlwZSAke3R5cGVvZihwTWFuaWZlc3QpfS5gKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAocE1hbmlmZXN0Lmhhc093blByb3BlcnR5KCdTY29wZScpKVxuXHRcdHtcblx0XHRcdGlmICh0eXBlb2YocE1hbmlmZXN0LlNjb3BlKSA9PT0gJ3N0cmluZycpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuc2NvcGUgPSBwTWFuaWZlc3QuU2NvcGU7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMubG9nRXJyb3IoYCgke3RoaXMuc2NvcGV9KSBFcnJvciBsb2FkaW5nIHNjb3BlIGZyb20gbWFuaWZlc3Q7IGV4cGVjdGluZyBhIHN0cmluZyBidXQgcHJvcGVydHkgd2FzIHR5cGUgJHt0eXBlb2YocE1hbmlmZXN0LlNjb3BlKX0uYCwgcE1hbmlmZXN0KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMubG9nRXJyb3IoYCgke3RoaXMuc2NvcGV9KSBFcnJvciBsb2FkaW5nIHNjb3BlIGZyb20gbWFuaWZlc3Qgb2JqZWN0LiAgUHJvcGVydHkgXCJTY29wZVwiIGRvZXMgbm90IGV4aXN0IGluIHRoZSByb290IG9mIHRoZSBvYmplY3QuYCwgcE1hbmlmZXN0KTtcblx0XHR9XG5cblx0XHRpZiAocE1hbmlmZXN0Lmhhc093blByb3BlcnR5KCdEZXNjcmlwdG9ycycpKVxuXHRcdHtcblx0XHRcdGlmICh0eXBlb2YocE1hbmlmZXN0LkRlc2NyaXB0b3JzKSA9PT0gJ29iamVjdCcpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB0bXBEZXNjcmlwdGlvbkFkZHJlc3NlcyA9IE9iamVjdC5rZXlzKHBNYW5pZmVzdC5EZXNjcmlwdG9ycyk7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdG1wRGVzY3JpcHRpb25BZGRyZXNzZXMubGVuZ3RoOyBpKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLmFkZERlc2NyaXB0b3IodG1wRGVzY3JpcHRpb25BZGRyZXNzZXNbaV0sIHBNYW5pZmVzdC5EZXNjcmlwdG9yc1t0bXBEZXNjcmlwdGlvbkFkZHJlc3Nlc1tpXV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMubG9nRXJyb3IoYCgke3RoaXMuc2NvcGV9KSBFcnJvciBsb2FkaW5nIGRlc2NyaXB0aW9uIG9iamVjdCBmcm9tIG1hbmlmZXN0IG9iamVjdC4gIEV4cGVjdGluZyBhbiBvYmplY3QgaW4gJ01hbmlmZXN0LkRlc2NyaXB0b3JzJyBidXQgdGhlIHByb3BlcnR5IHdhcyB0eXBlICR7dHlwZW9mKHBNYW5pZmVzdC5EZXNjcmlwdG9ycyl9LmAsIHBNYW5pZmVzdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ0Vycm9yKGAoJHt0aGlzLnNjb3BlfSkgRXJyb3IgbG9hZGluZyBvYmplY3QgZGVzY3JpcHRpb24gZnJvbSBtYW5pZmVzdCBvYmplY3QuICBQcm9wZXJ0eSBcIkRlc2NyaXB0b3JzXCIgZG9lcyBub3QgZXhpc3QgaW4gdGhlIHJvb3Qgb2YgdGhlIE1hbmlmZXN0IG9iamVjdC5gLCBwTWFuaWZlc3QpO1xuXHRcdH1cblx0fVxuXG5cdC8vIFNlcmlhbGl6ZSB0aGUgTWFuaWZlc3QgdG8gYSBzdHJpbmdcblx0c2VyaWFsaXplKClcblx0e1xuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmdldE1hbmlmZXN0KCkpO1xuXHR9XG5cblx0Z2V0TWFuaWZlc3QoKVxuXHR7XG5cdFx0bGV0IHRtcE1hbmlmZXN0ID0gKFxuXHRcdFx0e1xuXHRcdFx0XHRTY29wZTogdGhpcy5zY29wZSxcblx0XHRcdFx0RGVzY3JpcHRvcnM6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5lbGVtZW50RGVzY3JpcHRvcnMpKVxuXHRcdFx0fSk7XG5cdH1cblxuXHQvLyBBZGQgYSBkZXNjcmlwdG9yIHRvIHRoZSBtYW5pZmVzdFxuXHRhZGREZXNjcmlwdG9yKHBBZGRyZXNzLCBwRGVzY3JpcHRvcilcblx0e1xuXHRcdGlmICh0eXBlb2YocERlc2NyaXB0b3IpID09PSAnb2JqZWN0Jylcblx0XHR7XG5cdFx0XHQvLyBBZGQgdGhlIEFkZHJlc3MgaW50byB0aGUgRGVzY3JpcHRvciBpZiBpdCBkb2Vzbid0IGV4aXN0OlxuXHRcdFx0aWYgKCFwRGVzY3JpcHRvci5oYXNPd25Qcm9wZXJ0eSgnQWRkcmVzcycpKVxuXHRcdFx0e1xuXHRcdFx0XHRwRGVzY3JpcHRvci5BZGRyZXNzID0gcEFkZHJlc3M7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghdGhpcy5lbGVtZW50RGVzY3JpcHRvcnMuaGFzT3duUHJvcGVydHkocEFkZHJlc3MpKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRBZGRyZXNzZXMucHVzaChwQWRkcmVzcyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFkZCB0aGUgZWxlbWVudCBkZXNjcmlwdG9yIHRvIHRoZSBzY2hlbWFcblx0XHRcdHRoaXMuZWxlbWVudERlc2NyaXB0b3JzW3BBZGRyZXNzXSA9IHBEZXNjcmlwdG9yO1xuXG5cdFx0XHQvLyBBbHdheXMgYWRkIHRoZSBhZGRyZXNzIGFzIGEgaGFzaFxuXHRcdFx0dGhpcy5lbGVtZW50SGFzaGVzW3BBZGRyZXNzXSA9IHBBZGRyZXNzO1xuXG5cdFx0XHRpZiAocERlc2NyaXB0b3IuaGFzT3duUHJvcGVydHkoJ0hhc2gnKSlcblx0XHRcdHtcblx0XHRcdFx0Ly8gVE9ETzogQ2hlY2sgaWYgdGhpcyBpcyBhIGdvb2QgaWRlYSBvciBub3QuLlxuXHRcdFx0XHQvLyAgICAgICBDb2xsaXNpb25zIGFyZSBib3VuZCB0byBoYXBwZW4gd2l0aCBib3RoIHJlcHJlc2VudGF0aW9ucyBvZiB0aGUgYWRkcmVzcy9oYXNoIGluIGhlcmUgYW5kIGRldmVsb3BlcnMgYmVpbmcgYWJsZSB0byBjcmVhdGUgdGhlaXIgb3duIGhhc2hlcy5cblx0XHRcdFx0dGhpcy5lbGVtZW50SGFzaGVzW3BEZXNjcmlwdG9yLkhhc2hdID0gcEFkZHJlc3M7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHBEZXNjcmlwdG9yLkhhc2ggPSBwQWRkcmVzcztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ0Vycm9yKGAoJHt0aGlzLnNjb3BlfSkgRXJyb3IgbG9hZGluZyBvYmplY3QgZGVzY3JpcHRvciBmb3IgYWRkcmVzcyAnJHtwQWRkcmVzc30nIGZyb20gbWFuaWZlc3Qgb2JqZWN0LiAgRXhwZWN0aW5nIGFuIG9iamVjdCBidXQgcHJvcGVydHkgd2FzIHR5cGUgJHt0eXBlb2YocERlc2NyaXB0b3IpfS5gKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XHRcblx0fVxuXG5cdGdldERlc2NyaXB0b3JCeUhhc2gocEhhc2gpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5nZXREZXNjcmlwdG9yKHRoaXMucmVzb2x2ZUhhc2hBZGRyZXNzKHBIYXNoKSk7XG5cdH1cblxuXHRnZXREZXNjcmlwdG9yKHBBZGRyZXNzKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudERlc2NyaXB0b3JzW3BBZGRyZXNzXTtcblx0fVxuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqIEJlZ2lubmluZyBvZiBPYmplY3QgTWFuaXB1bGF0aW9uIChyZWFkICYgd3JpdGUpIEZ1bmN0aW9uc1xuXHQgKi9cblx0Ly8gQ2hlY2sgaWYgYW4gZWxlbWVudCBleGlzdHMgYnkgaXRzIGhhc2hcblx0Y2hlY2tBZGRyZXNzRXhpc3RzQnlIYXNoIChwT2JqZWN0LCBwSGFzaClcblx0e1xuXHRcdHJldHVybiB0aGlzLmNoZWNrQWRkcmVzc0V4aXN0cyhwT2JqZWN0LHRoaXMucmVzb2x2ZUhhc2hBZGRyZXNzKHBIYXNoKSk7XG5cdH1cblxuXHQvLyBDaGVjayBpZiBhbiBlbGVtZW50IGV4aXN0cyBhdCBhbiBhZGRyZXNzXG5cdGNoZWNrQWRkcmVzc0V4aXN0cyAocE9iamVjdCwgcEFkZHJlc3MpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5vYmplY3RBZGRyZXNzUmVzb2x2ZXIuY2hlY2tBZGRyZXNzRXhpc3RzKHBPYmplY3QsIHBBZGRyZXNzKTtcblx0fVxuXG5cdC8vIFR1cm4gYSBoYXNoIGludG8gYW4gYWRkcmVzcywgZmFjdG9yaW5nIGluIHRoZSB0cmFuc2xhdGlvbiB0YWJsZS5cblx0cmVzb2x2ZUhhc2hBZGRyZXNzKHBIYXNoKVxuXHR7XG5cdFx0bGV0IHRtcEFkZHJlc3MgPSB1bmRlZmluZWQ7XG5cblx0XHRsZXQgdG1wSW5FbGVtZW50SGFzaFRhYmxlID0gdGhpcy5lbGVtZW50SGFzaGVzLmhhc093blByb3BlcnR5KHBIYXNoKTtcblx0XHRsZXQgdG1wSW5UcmFuc2xhdGlvblRhYmxlID0gdGhpcy5oYXNoVHJhbnNsYXRpb25zLnRyYW5zbGF0aW9uVGFibGUuaGFzT3duUHJvcGVydHkocEhhc2gpO1xuXG5cdFx0Ly8gVGhlIG1vc3Qgc3RyYWlnaHRmb3J3YXJkOiB0aGUgaGFzaCBleGlzdHMsIG5vIHRyYW5zbGF0aW9ucy5cblx0XHRpZiAodG1wSW5FbGVtZW50SGFzaFRhYmxlICYmICF0bXBJblRyYW5zbGF0aW9uVGFibGUpXG5cdFx0e1xuXHRcdFx0dG1wQWRkcmVzcyA9IHRoaXMuZWxlbWVudEhhc2hlc1twSGFzaF07XG5cdFx0fVxuXHRcdC8vIFRoZXJlIGlzIGEgdHJhbnNsYXRpb24gZnJvbSBvbmUgaGFzaCB0byBhbm90aGVyLCBhbmQsIHRoZSBlbGVtZW50SGFzaGVzIGNvbnRhaW5zIHRoZSBwb2ludGVyIGVuZFxuXHRcdGVsc2UgaWYgKHRtcEluVHJhbnNsYXRpb25UYWJsZSAmJiB0aGlzLmVsZW1lbnRIYXNoZXMuaGFzT3duUHJvcGVydHkodGhpcy5oYXNoVHJhbnNsYXRpb25zLnRyYW5zbGF0ZShwSGFzaCkpKVxuXHRcdHtcblx0XHRcdHRtcEFkZHJlc3MgPSB0aGlzLmVsZW1lbnRIYXNoZXNbdGhpcy5oYXNoVHJhbnNsYXRpb25zLnRyYW5zbGF0ZShwSGFzaCldO1xuXHRcdH1cblx0XHQvLyBVc2UgdGhlIGxldmVsIG9mIGluZGlyZWN0aW9uIG9ubHkgaW4gdGhlIFRyYW5zbGF0aW9uIFRhYmxlIFxuXHRcdGVsc2UgaWYgKHRtcEluVHJhbnNsYXRpb25UYWJsZSlcblx0XHR7XG5cdFx0XHR0bXBBZGRyZXNzID0gdGhpcy5oYXNoVHJhbnNsYXRpb25zLnRyYW5zbGF0ZShwSGFzaCk7XG5cdFx0fVxuXHRcdC8vIEp1c3QgdHJlYXQgdGhlIGhhc2ggYXMgYW4gYWRkcmVzcy5cblx0XHQvLyBUT0RPOiBEaXNjdXNzIHRoaXMgLi4uIGl0IGlzIG1hZ2ljIGJ1dCBjb250cm92ZXJzaWFsXG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRtcEFkZHJlc3MgPSBwSGFzaDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdG1wQWRkcmVzcztcblx0fVxuXG5cdC8vIEdldCB0aGUgdmFsdWUgb2YgYW4gZWxlbWVudCBieSBpdHMgaGFzaFxuXHRnZXRWYWx1ZUJ5SGFzaCAocE9iamVjdCwgcEhhc2gpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5nZXRWYWx1ZUF0QWRkcmVzcyhwT2JqZWN0LCB0aGlzLnJlc29sdmVIYXNoQWRkcmVzcyhwSGFzaCkpO1xuXHR9XG5cblx0Ly8gR2V0IHRoZSB2YWx1ZSBvZiBhbiBlbGVtZW50IGF0IGFuIGFkZHJlc3Ncblx0Z2V0VmFsdWVBdEFkZHJlc3MgKHBPYmplY3QsIHBBZGRyZXNzKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMub2JqZWN0QWRkcmVzc1Jlc29sdmVyLmdldFZhbHVlQXRBZGRyZXNzKHBPYmplY3QsIHBBZGRyZXNzKTtcblx0fVxuXG5cdC8vIFNldCB0aGUgdmFsdWUgb2YgYW4gZWxlbWVudCBieSBpdHMgaGFzaFxuXHRzZXRWYWx1ZUJ5SGFzaChwT2JqZWN0LCBwSGFzaCwgcFZhbHVlKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuc2V0VmFsdWVBdEFkZHJlc3MocE9iamVjdCwgdGhpcy5yZXNvbHZlSGFzaEFkZHJlc3MocEhhc2gpLCBwVmFsdWUpO1xuXHR9XG5cblxuXHQvLyBTZXQgdGhlIHZhbHVlIG9mIGFuIGVsZW1lbnQgYXQgYW4gYWRkcmVzc1xuXHRzZXRWYWx1ZUF0QWRkcmVzcyAocE9iamVjdCwgcEFkZHJlc3MsIHBWYWx1ZSlcblx0e1xuXHRcdHJldHVybiB0aGlzLm9iamVjdEFkZHJlc3NSZXNvbHZlci5zZXRWYWx1ZUF0QWRkcmVzcyhwT2JqZWN0LCBwQWRkcmVzcywgcFZhbHVlKTtcblx0fVxuXG5cdC8vIFZhbGlkYXRlIHRoZSBjb25zaXN0ZW5jeSBvZiBhbiBvYmplY3QgYWdhaW5zdCB0aGUgc2NoZW1hXG5cdHZhbGlkYXRlKHBPYmplY3QpXG5cdHtcblx0XHRsZXQgdG1wVmFsaWRhdGlvbkRhdGEgPVxuXHRcdHtcblx0XHRcdEVycm9yOiBudWxsLFxuXHRcdFx0RXJyb3JzOiBbXSxcblx0XHRcdE1pc3NpbmdFbGVtZW50czpbXVxuXHRcdH07XG5cblx0XHRpZiAodHlwZW9mKHBPYmplY3QpICE9PSAnb2JqZWN0Jylcblx0XHR7XG5cdFx0XHR0bXBWYWxpZGF0aW9uRGF0YS5FcnJvciA9IHRydWU7XG5cdFx0XHR0bXBWYWxpZGF0aW9uRGF0YS5FcnJvcnMucHVzaChgRXhwZWN0ZWQgcGFzc2VkIGluIG9iamVjdCB0byBiZSB0eXBlIG9iamVjdCBidXQgd2FzIHBhc3NlZCBpbiAke3R5cGVvZihwT2JqZWN0KX1gKTtcblx0XHR9XG5cblx0XHRsZXQgYWRkVmFsaWRhdGlvbkVycm9yID0gKHBBZGRyZXNzLCBwRXJyb3JNZXNzYWdlKSA9PlxuXHRcdHtcblx0XHRcdHRtcFZhbGlkYXRpb25EYXRhLkVycm9yID0gdHJ1ZTtcblx0XHRcdHRtcFZhbGlkYXRpb25EYXRhLkVycm9ycy5wdXNoKGBFbGVtZW50IGF0IGFkZHJlc3MgXCIke3BBZGRyZXNzfVwiICR7cEVycm9yTWVzc2FnZX0uYCk7XG5cdFx0fTtcblxuXHRcdC8vIE5vdyBlbnVtZXJhdGUgdGhyb3VnaCB0aGUgdmFsdWVzIGFuZCBjaGVjayBmb3IgYW5vbWFsaWVzIGJhc2VkIG9uIHRoZSBzY2hlbWFcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZWxlbWVudEFkZHJlc3Nlcy5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHRsZXQgdG1wRGVzY3JpcHRvciA9IHRoaXMuZ2V0RGVzY3JpcHRvcih0aGlzLmVsZW1lbnRBZGRyZXNzZXNbaV0pO1xuXHRcdFx0bGV0IHRtcFZhbHVlID0gdGhpcy5nZXRWYWx1ZUF0QWRkcmVzcyhwT2JqZWN0LCB0bXBEZXNjcmlwdG9yLkFkZHJlc3MpO1xuXG5cdFx0XHRpZiAodHlwZW9mKHRtcFZhbHVlKSA9PSAndW5kZWZpbmVkJylcblx0XHRcdHtcblx0XHRcdFx0Ly8gVGhpcyB3aWxsIHRlY2huaWNhbGx5IG1lYW4gdGhhdCBgT2JqZWN0LlNvbWUuVmFsdWUgPSB1bmRlZmluZWRgIHdpbGwgZW5kIHVwIHNob3dpbmcgYXMgXCJtaXNzaW5nXCJcblx0XHRcdFx0Ly8gVE9ETzogRG8gd2Ugd2FudCB0byBkbyBhIGRpZmZlcmVudCBtZXNzYWdlIGJhc2VkIG9uIGlmIHRoZSBwcm9wZXJ0eSBleGlzdHMgYnV0IGlzIHVuZGVmaW5lZD9cblx0XHRcdFx0dG1wVmFsaWRhdGlvbkRhdGEuTWlzc2luZ0VsZW1lbnRzLnB1c2godG1wRGVzY3JpcHRvci5BZGRyZXNzKTtcblx0XHRcdFx0aWYgKHRtcERlc2NyaXB0b3IuUmVxdWlyZWQgfHwgdGhpcy5vcHRpb25zLnN0cmljdClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFkZFZhbGlkYXRpb25FcnJvcih0bXBEZXNjcmlwdG9yLkFkZHJlc3MsICdpcyBmbGFnZ2VkIFJFUVVJUkVEIGJ1dCBpcyBub3Qgc2V0IGluIHRoZSBvYmplY3QnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBOb3cgc2VlIGlmIHRoZXJlIGlzIGEgZGF0YSB0eXBlIHNwZWNpZmllZCBmb3IgdGhpcyBlbGVtZW50XG5cdFx0XHRpZiAodG1wRGVzY3JpcHRvci5EYXRhVHlwZSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IHRtcEVsZW1lbnRUeXBlID0gdHlwZW9mKHRtcFZhbHVlKTtcblx0XHRcdFx0c3dpdGNoKHRtcERlc2NyaXB0b3IuRGF0YVR5cGUudG9TdHJpbmcoKS50cmltKCkudG9Mb3dlckNhc2UoKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNhc2UgJ3N0cmluZyc6XG5cdFx0XHRcdFx0XHRpZiAodG1wRWxlbWVudFR5cGUgIT0gJ3N0cmluZycpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGFkZFZhbGlkYXRpb25FcnJvcih0bXBEZXNjcmlwdG9yLkFkZHJlc3MsIGBoYXMgYSBEYXRhVHlwZSAke3RtcERlc2NyaXB0b3IuRGF0YVR5cGV9IGJ1dCBpcyBvZiB0aGUgdHlwZSAke3RtcEVsZW1lbnRUeXBlfWApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdudW1iZXInOlxuXHRcdFx0XHRcdFx0aWYgKHRtcEVsZW1lbnRUeXBlICE9ICdudW1iZXInKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRhZGRWYWxpZGF0aW9uRXJyb3IodG1wRGVzY3JpcHRvci5BZGRyZXNzLCBgaGFzIGEgRGF0YVR5cGUgJHt0bXBEZXNjcmlwdG9yLkRhdGFUeXBlfSBidXQgaXMgb2YgdGhlIHR5cGUgJHt0bXBFbGVtZW50VHlwZX1gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnaW50ZWdlcic6XG5cdFx0XHRcdFx0XHRpZiAodG1wRWxlbWVudFR5cGUgIT0gJ251bWJlcicpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGFkZFZhbGlkYXRpb25FcnJvcih0bXBEZXNjcmlwdG9yLkFkZHJlc3MsIGBoYXMgYSBEYXRhVHlwZSAke3RtcERlc2NyaXB0b3IuRGF0YVR5cGV9IGJ1dCBpcyBvZiB0aGUgdHlwZSAke3RtcEVsZW1lbnRUeXBlfWApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsZXQgdG1wVmFsdWVTdHJpbmcgPSB0bXBWYWx1ZS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0XHRpZiAodG1wVmFsdWVTdHJpbmcuaW5kZXhPZignLicpID4gLTEpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBJcyB0aGlzIGFuIGVycm9yP1xuXHRcdFx0XHRcdFx0XHRcdGFkZFZhbGlkYXRpb25FcnJvcih0bXBEZXNjcmlwdG9yLkFkZHJlc3MsIGBoYXMgYSBEYXRhVHlwZSAke3RtcERlc2NyaXB0b3IuRGF0YVR5cGV9IGJ1dCBoYXMgYSBkZWNpbWFsIHBvaW50IGluIHRoZSBudW1iZXIuYCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnZmxvYXQnOlxuXHRcdFx0XHRcdFx0aWYgKHRtcEVsZW1lbnRUeXBlICE9ICdudW1iZXInKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRhZGRWYWxpZGF0aW9uRXJyb3IodG1wRGVzY3JpcHRvci5BZGRyZXNzLCBgaGFzIGEgRGF0YVR5cGUgJHt0bXBEZXNjcmlwdG9yLkRhdGFUeXBlfSBidXQgaXMgb2YgdGhlIHR5cGUgJHt0bXBFbGVtZW50VHlwZX1gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnRGF0ZVRpbWUnOlxuXHRcdFx0XHRcdFx0bGV0IHRtcFZhbHVlRGF0ZSA9IG5ldyBEYXRlKHRtcFZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICh0bXBWYWx1ZURhdGUudG9TdHJpbmcoKSA9PSAnSW52YWxpZCBEYXRlJylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0YWRkVmFsaWRhdGlvbkVycm9yKHRtcERlc2NyaXB0b3IuQWRkcmVzcywgYGhhcyBhIERhdGFUeXBlICR7dG1wRGVzY3JpcHRvci5EYXRhVHlwZX0gYnV0IGlzIG5vdCBwYXJzYWJsZSBhcyBhIERhdGUgYnkgSmF2YXNjcmlwdGApO1xuXHRcdFx0XHRcdFx0fVxuXHRcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGhpcyBpcyBhIHN0cmluZywgaW4gdGhlIGRlZmF1bHQgY2FzZVxuXHRcdFx0XHRcdFx0Ly8gTm90ZSB0aGlzIGlzIG9ubHkgd2hlbiBhIERhdGFUeXBlIGlzIHNwZWNpZmllZCBhbmQgaXQgaXMgYW4gdW5yZWNvZ25pemVkIGRhdGEgdHlwZS5cblx0XHRcdFx0XHRcdGlmICh0bXBFbGVtZW50VHlwZSAhPSAnc3RyaW5nJylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0YWRkVmFsaWRhdGlvbkVycm9yKHRtcERlc2NyaXB0b3IuQWRkcmVzcywgYGhhcyBhIERhdGFUeXBlICR7dG1wRGVzY3JpcHRvci5EYXRhVHlwZX0gKHdoaWNoIGF1dG8tY29udmVydGVkIHRvIFN0cmluZyBiZWNhdXNlIGl0IHdhcyB1bnJlY29nbml6ZWQpIGJ1dCBpcyBvZiB0aGUgdHlwZSAke3RtcEVsZW1lbnRUeXBlfWApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdG1wVmFsaWRhdGlvbkRhdGE7XG5cdH1cblxuXHQvLyBSZXR1cm5zIGEgZGVmYXVsdCB2YWx1ZSwgb3IsIHRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGUgZGF0YSB0eXBlICh3aGljaCBpcyBvdmVycmlkYWJsZSB3aXRoIGNvbmZpZ3VyYXRpb24pXG5cdGdldERlZmF1bHRWYWx1ZShwRGVzY3JpcHRvcilcblx0e1xuXHRcdGlmIChwRGVzY3JpcHRvci5oYXNPd25Qcm9wZXJ0eSgnRGVmYXVsdCcpKVxuXHRcdHtcblx0XHRcdHJldHVybiBwRGVzY3JpcHRvci5EZWZhdWx0O1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0Ly8gRGVmYXVsdCB0byBhIG51bGwgaWYgaXQgZG9lc24ndCBoYXZlIGEgdHlwZSBzcGVjaWZpZWQuXG5cdFx0XHQvLyBUaGlzIHdpbGwgZW5zdXJlIGEgcGxhY2Vob2xkZXIgaXMgY3JlYXRlZCBidXQgaXNuJ3QgbWlzaW50ZXJwcmV0ZWQuXG5cdFx0XHRsZXQgdG1wRGF0YVR5cGUgPSAocERlc2NyaXB0b3IuaGFzT3duUHJvcGVydHkoJ0RhdGFUeXBlJykpID8gcERlc2NyaXB0b3IuRGF0YVR5cGUgOiAnU3RyaW5nJztcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZGVmYXVsdFZhbHVlcy5oYXNPd25Qcm9wZXJ0eSh0bXBEYXRhVHlwZSkpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnMuZGVmYXVsdFZhbHVlc1t0bXBEYXRhVHlwZV07XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdC8vIGdpdmUgdXAgYW5kIHJldHVybiBudWxsXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIEVudW1lcmF0ZSB0aHJvdWdoIHRoZSBzY2hlbWEgYW5kIHBvcHVsYXRlIGRlZmF1bHQgdmFsdWVzIGlmIHRoZXkgZG9uJ3QgZXhpc3QuXG5cdHBvcHVsYXRlRGVmYXVsdHMocE9iamVjdCwgcE92ZXJ3cml0ZVByb3BlcnRpZXMpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5wb3B1bGF0ZU9iamVjdChwT2JqZWN0LCBwT3ZlcndyaXRlUHJvcGVydGllcyxcblx0XHRcdC8vIFRoaXMganVzdCBzZXRzIHVwIGEgc2ltcGxlIGZpbHRlciB0byBzZWUgaWYgdGhlcmUgaXMgYSBkZWZhdWx0IHNldC5cblx0XHRcdChwRGVzY3JpcHRvcikgPT5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHBEZXNjcmlwdG9yLmhhc093blByb3BlcnR5KCdEZWZhdWx0Jyk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8vIEZvcmNlZnVsbHkgcG9wdWxhdGUgYWxsIHZhbHVlcyBldmVuIGlmIHRoZXkgZG9uJ3QgaGF2ZSBkZWZhdWx0cy5cblx0Ly8gQmFzZWQgb24gdHlwZSwgdGhpcyBjYW4gZG8gdW5leHBlY3RlZCB0aGluZ3MuXG5cdHBvcHVsYXRlT2JqZWN0KHBPYmplY3QsIHBPdmVyd3JpdGVQcm9wZXJ0aWVzLCBmRmlsdGVyKVxuXHR7XG5cdFx0Ly8gQXV0b21hdGljYWxseSBjcmVhdGUgYW4gb2JqZWN0IGlmIG9uZSBpc24ndCBwYXNzZWQgaW4uXG5cdFx0bGV0IHRtcE9iamVjdCA9ICh0eXBlb2YocE9iamVjdCkgPT09ICdvYmplY3QnKSA/IHBPYmplY3QgOiB7fTtcblx0XHQvLyBEZWZhdWx0IHRvICpOT1QgT1ZFUldSSVRJTkcqIHByb3BlcnRpZXNcblx0XHRsZXQgdG1wT3ZlcndyaXRlUHJvcGVydGllcyA9ICh0eXBlb2YocE92ZXJ3cml0ZVByb3BlcnRpZXMpID09ICd1bmRlZmluZWQnKSA/IGZhbHNlIDogcE92ZXJ3cml0ZVByb3BlcnRpZXM7XG5cdFx0Ly8gVGhpcyBpcyBhIGZpbHRlciBmdW5jdGlvbiwgd2hpY2ggaXMgcGFzc2VkIHRoZSBzY2hlbWEgYW5kIGFsbG93cyBjb21wbGV4IGZpbHRlcmluZyBvZiBwb3B1bGF0aW9uXG5cdFx0Ly8gVGhlIGRlZmF1bHQgZmlsdGVyIGZ1bmN0aW9uIGp1c3QgcmV0dXJucyB0cnVlLCBwb3B1bGF0aW5nIGV2ZXJ5dGhpbmcuXG5cdFx0bGV0IHRtcEZpbHRlckZ1bmN0aW9uID0gKHR5cGVvZihmRmlsdGVyKSA9PSAnZnVuY3Rpb24nKSA/IGZGaWx0ZXIgOiAocERlc2NyaXB0b3IpID0+IHsgcmV0dXJuIHRydWU7IH07XG5cblx0XHR0aGlzLmVsZW1lbnRBZGRyZXNzZXMuZm9yRWFjaChcblx0XHRcdChwQWRkcmVzcykgPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IHRtcERlc2NyaXB0b3IgPSB0aGlzLmdldERlc2NyaXB0b3IocEFkZHJlc3MpO1xuXHRcdFx0XHQvLyBDaGVjayB0aGUgZmlsdGVyIGZ1bmN0aW9uIHRvIHNlZSBpZiB0aGlzIGlzIGFuIGFkZHJlc3Mgd2Ugd2FudCB0byBzZXQgdGhlIHZhbHVlIGZvci5cblx0XHRcdFx0aWYgKHRtcEZpbHRlckZ1bmN0aW9uKHRtcERlc2NyaXB0b3IpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gSWYgd2UgYXJlIG92ZXJ3cml0aW5nIHByb3BlcnRpZXMgT1IgdGhlIHByb3BlcnR5IGRvZXMgbm90IGV4aXN0XG5cdFx0XHRcdFx0aWYgKHRtcE92ZXJ3cml0ZVByb3BlcnRpZXMgfHwgIXRoaXMuY2hlY2tBZGRyZXNzRXhpc3RzKHRtcE9iamVjdCwgcEFkZHJlc3MpKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0VmFsdWVBdEFkZHJlc3ModG1wT2JqZWN0LCBwQWRkcmVzcywgdGhpcy5nZXREZWZhdWx0VmFsdWUodG1wRGVzY3JpcHRvcikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRyZXR1cm4gdG1wT2JqZWN0O1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hbnlmZXN0OyIsIi8qKlxuKiBQcmVjZWRlbnQgTWV0YS1UZW1wbGF0aW5nXG4qXG4qIEBsaWNlbnNlICAgICBNSVRcbipcbiogQGF1dGhvciAgICAgIFN0ZXZlbiBWZWxvem8gPHN0ZXZlbkB2ZWxvem8uY29tPlxuKlxuKiBAZGVzY3JpcHRpb24gUHJvY2VzcyB0ZXh0IHN0cmVhbXMsIHBhcnNpbmcgb3V0IG1ldGEtdGVtcGxhdGUgZXhwcmVzc2lvbnMuXG4qL1xudmFyIGxpYldvcmRUcmVlID0gcmVxdWlyZShgLi9Xb3JkVHJlZS5qc2ApO1xudmFyIGxpYlN0cmluZ1BhcnNlciA9IHJlcXVpcmUoYC4vU3RyaW5nUGFyc2VyLmpzYCk7XG5cbmNsYXNzIFByZWNlZGVudFxue1xuXHQvKipcblx0ICogUHJlY2VkZW50IENvbnN0cnVjdG9yXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHR0aGlzLldvcmRUcmVlID0gbmV3IGxpYldvcmRUcmVlKCk7XG5cdFx0XG5cdFx0dGhpcy5TdHJpbmdQYXJzZXIgPSBuZXcgbGliU3RyaW5nUGFyc2VyKCk7XG5cblx0XHR0aGlzLlBhcnNlVHJlZSA9IHRoaXMuV29yZFRyZWUuUGFyc2VUcmVlO1xuXHR9XG5cdFxuXHQvKipcblx0ICogQWRkIGEgUGF0dGVybiB0byB0aGUgUGFyc2UgVHJlZVxuXHQgKiBAbWV0aG9kIGFkZFBhdHRlcm5cblx0ICogQHBhcmFtIHtPYmplY3R9IHBUcmVlIC0gQSBub2RlIG9uIHRoZSBwYXJzZSB0cmVlIHRvIHB1c2ggdGhlIGNoYXJhY3RlcnMgaW50b1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gcFBhdHRlcm4gLSBUaGUgc3RyaW5nIHRvIGFkZCB0byB0aGUgdHJlZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gcEluZGV4IC0gY2FsbGJhY2sgZnVuY3Rpb25cblx0ICogQHJldHVybiB7Ym9vbH0gVHJ1ZSBpZiBhZGRpbmcgdGhlIHBhdHRlcm4gd2FzIHN1Y2Nlc3NmdWxcblx0ICovXG5cdGFkZFBhdHRlcm4ocFBhdHRlcm5TdGFydCwgcFBhdHRlcm5FbmQsIHBQYXJzZXIpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5Xb3JkVHJlZS5hZGRQYXR0ZXJuKHBQYXR0ZXJuU3RhcnQsIHBQYXR0ZXJuRW5kLCBwUGFyc2VyKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIFBhcnNlIGEgc3RyaW5nIHdpdGggdGhlIGV4aXN0aW5nIHBhcnNlIHRyZWVcblx0ICogQG1ldGhvZCBwYXJzZVN0cmluZ1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gcFN0cmluZyAtIFRoZSBzdHJpbmcgdG8gcGFyc2Vcblx0ICogQHJldHVybiB7c3RyaW5nfSBUaGUgcmVzdWx0IGZyb20gdGhlIHBhcnNlclxuXHQgKi9cblx0cGFyc2VTdHJpbmcocFN0cmluZylcblx0e1xuXHRcdHJldHVybiB0aGlzLlN0cmluZ1BhcnNlci5wYXJzZVN0cmluZyhwU3RyaW5nLCB0aGlzLlBhcnNlVHJlZSk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcmVjZWRlbnQ7XG4iLCIvKipcbiogU3RyaW5nIFBhcnNlclxuKlxuKiBAbGljZW5zZSAgICAgTUlUXG4qXG4qIEBhdXRob3IgICAgICBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbipcbiogQGRlc2NyaXB0aW9uIFBhcnNlIGEgc3RyaW5nLCBwcm9wZXJseSBwcm9jZXNzaW5nIGVhY2ggbWF0Y2hlZCB0b2tlbiBpbiB0aGUgd29yZCB0cmVlLlxuKi9cblxuY2xhc3MgU3RyaW5nUGFyc2VyXG57XG5cdC8qKlxuXHQgKiBTdHJpbmdQYXJzZXIgQ29uc3RydWN0b3Jcblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHR9XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlIGEgZnJlc2ggcGFyc2luZyBzdGF0ZSBvYmplY3QgdG8gd29yayB3aXRoLlxuXHQgKiBAbWV0aG9kIG5ld1BhcnNlclN0YXRlXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwUGFyc2VUcmVlIC0gQSBub2RlIG9uIHRoZSBwYXJzZSB0cmVlIHRvIGJlZ2luIHBhcnNpbmcgZnJvbSAodXN1YWxseSByb290KVxuXHQgKiBAcmV0dXJuIHtPYmplY3R9IEEgbmV3IHBhcnNlciBzdGF0ZSBvYmplY3QgZm9yIHJ1bm5pbmcgYSBjaGFyYWN0ZXIgcGFyc2VyIG9uXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRuZXdQYXJzZXJTdGF0ZSAocFBhcnNlVHJlZSlcblx0e1xuXHRcdHJldHVybiAoXG5cdFx0e1xuXHRcdCAgICBQYXJzZVRyZWU6IHBQYXJzZVRyZWUsXG5cblx0XHRcdE91dHB1dDogJycsXG5cdFx0XHRPdXRwdXRCdWZmZXI6ICcnLFxuXG5cdFx0XHRQYXR0ZXJuOiBmYWxzZSxcblxuXHRcdFx0UGF0dGVybk1hdGNoOiBmYWxzZSxcblx0XHRcdFBhdHRlcm5NYXRjaE91dHB1dEJ1ZmZlcjogJydcblx0XHR9KTtcblx0fVxuXHRcdFxuXHQvKipcblx0ICogQXNzaWduIGEgbm9kZSBvZiB0aGUgcGFyc2VyIHRyZWUgdG8gYmUgdGhlIG5leHQgcG90ZW50aWFsIG1hdGNoLlxuXHQgKiBJZiB0aGUgbm9kZSBoYXMgYSBQYXR0ZXJuRW5kIHByb3BlcnR5LCBpdCBpcyBhIHZhbGlkIG1hdGNoIGFuZCBzdXBlcmNlZGVzIHRoZSBsYXN0IHZhbGlkIG1hdGNoIChvciBiZWNvbWVzIHRoZSBpbml0aWFsIG1hdGNoKS5cblx0ICogQG1ldGhvZCBhc3NpZ25Ob2RlXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwTm9kZSAtIEEgbm9kZSBvbiB0aGUgcGFyc2UgdHJlZSB0byBhc3NpZ25cblx0ICogQHBhcmFtIHtPYmplY3R9IHBQYXJzZXJTdGF0ZSAtIFRoZSBzdGF0ZSBvYmplY3QgZm9yIHRoZSBjdXJyZW50IHBhcnNpbmcgdGFza1xuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0YXNzaWduTm9kZSAocE5vZGUsIHBQYXJzZXJTdGF0ZSlcblx0e1xuXHRcdHBQYXJzZXJTdGF0ZS5QYXR0ZXJuTWF0Y2ggPSBwTm9kZTtcblxuXHRcdC8vIElmIHRoZSBwYXR0ZXJuIGhhcyBhIEVORCB3ZSBjYW4gYXNzdW1lIGl0IGhhcyBhIHBhcnNlIGZ1bmN0aW9uLi4uXG5cdFx0aWYgKHBQYXJzZXJTdGF0ZS5QYXR0ZXJuTWF0Y2guaGFzT3duUHJvcGVydHkoJ1BhdHRlcm5FbmQnKSlcblx0XHR7XG5cdFx0XHQvLyAuLi4gdGhpcyBpcyB0aGUgbGVnaXRpbWF0ZSBzdGFydCBvZiBhIHBhdHRlcm4uXG5cdFx0XHRwUGFyc2VyU3RhdGUuUGF0dGVybiA9IHBQYXJzZXJTdGF0ZS5QYXR0ZXJuTWF0Y2g7XG5cdFx0fVxuXHR9XG5cdFxuXHQvKipcblx0ICogQXBwZW5kIGEgY2hhcmFjdGVyIHRvIHRoZSBvdXRwdXQgYnVmZmVyIGluIHRoZSBwYXJzZXIgc3RhdGUuXG5cdCAqIFRoaXMgb3V0cHV0IGJ1ZmZlciBpcyB1c2VkIHdoZW4gYSBwb3RlbnRpYWwgbWF0Y2ggaXMgYmVpbmcgZXhwbG9yZWQsIG9yIGEgbWF0Y2ggaXMgYmVpbmcgZXhwbG9yZWQuXG5cdCAqIEBtZXRob2QgYXBwZW5kT3V0cHV0QnVmZmVyXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwQ2hhcmFjdGVyIC0gVGhlIGNoYXJhY3RlciB0byBhcHBlbmRcblx0ICogQHBhcmFtIHtPYmplY3R9IHBQYXJzZXJTdGF0ZSAtIFRoZSBzdGF0ZSBvYmplY3QgZm9yIHRoZSBjdXJyZW50IHBhcnNpbmcgdGFza1xuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0YXBwZW5kT3V0cHV0QnVmZmVyIChwQ2hhcmFjdGVyLCBwUGFyc2VyU3RhdGUpXG5cdHtcblx0XHRwUGFyc2VyU3RhdGUuT3V0cHV0QnVmZmVyICs9IHBDaGFyYWN0ZXI7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBGbHVzaCB0aGUgb3V0cHV0IGJ1ZmZlciB0byB0aGUgb3V0cHV0IGFuZCBjbGVhciBpdC5cblx0ICogQG1ldGhvZCBmbHVzaE91dHB1dEJ1ZmZlclxuXHQgKiBAcGFyYW0ge09iamVjdH0gcFBhcnNlclN0YXRlIC0gVGhlIHN0YXRlIG9iamVjdCBmb3IgdGhlIGN1cnJlbnQgcGFyc2luZyB0YXNrXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmbHVzaE91dHB1dEJ1ZmZlciAocFBhcnNlclN0YXRlKVxuXHR7XG5cdFx0cFBhcnNlclN0YXRlLk91dHB1dCArPSBwUGFyc2VyU3RhdGUuT3V0cHV0QnVmZmVyO1xuXHRcdHBQYXJzZXJTdGF0ZS5PdXRwdXRCdWZmZXIgPSAnJztcblx0fVxuXG5cdFxuXHQvKipcblx0ICogQ2hlY2sgaWYgdGhlIHBhdHRlcm4gaGFzIGVuZGVkLiAgSWYgaXQgaGFzLCBwcm9wZXJseSBmbHVzaCB0aGUgYnVmZmVyIGFuZCBzdGFydCBsb29raW5nIGZvciBuZXcgcGF0dGVybnMuXG5cdCAqIEBtZXRob2QgY2hlY2tQYXR0ZXJuRW5kXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwUGFyc2VyU3RhdGUgLSBUaGUgc3RhdGUgb2JqZWN0IGZvciB0aGUgY3VycmVudCBwYXJzaW5nIHRhc2tcblx0ICogQHByaXZhdGVcblx0ICovXG5cdGNoZWNrUGF0dGVybkVuZCAocFBhcnNlclN0YXRlKVxuXHR7XG5cdFx0aWYgKChwUGFyc2VyU3RhdGUuT3V0cHV0QnVmZmVyLmxlbmd0aCA+PSBwUGFyc2VyU3RhdGUuUGF0dGVybi5QYXR0ZXJuRW5kLmxlbmd0aCtwUGFyc2VyU3RhdGUuUGF0dGVybi5QYXR0ZXJuU3RhcnQubGVuZ3RoKSAmJiBcblx0XHRcdChwUGFyc2VyU3RhdGUuT3V0cHV0QnVmZmVyLnN1YnN0cigtcFBhcnNlclN0YXRlLlBhdHRlcm4uUGF0dGVybkVuZC5sZW5ndGgpID09PSBwUGFyc2VyU3RhdGUuUGF0dGVybi5QYXR0ZXJuRW5kKSlcblx0XHR7XG5cdFx0XHQvLyAuLi4gdGhpcyBpcyB0aGUgZW5kIG9mIGEgcGF0dGVybiwgY3V0IG9mZiB0aGUgZW5kIHRhZyBhbmQgcGFyc2UgaXQuXG5cdFx0XHQvLyBUcmltIHRoZSBzdGFydCBhbmQgZW5kIHRhZ3Mgb2ZmIHRoZSBvdXRwdXQgYnVmZmVyIG5vd1xuXHRcdFx0cFBhcnNlclN0YXRlLk91dHB1dEJ1ZmZlciA9IHBQYXJzZXJTdGF0ZS5QYXR0ZXJuLlBhcnNlKHBQYXJzZXJTdGF0ZS5PdXRwdXRCdWZmZXIuc3Vic3RyKHBQYXJzZXJTdGF0ZS5QYXR0ZXJuLlBhdHRlcm5TdGFydC5sZW5ndGgsIHBQYXJzZXJTdGF0ZS5PdXRwdXRCdWZmZXIubGVuZ3RoIC0gKHBQYXJzZXJTdGF0ZS5QYXR0ZXJuLlBhdHRlcm5TdGFydC5sZW5ndGgrcFBhcnNlclN0YXRlLlBhdHRlcm4uUGF0dGVybkVuZC5sZW5ndGgpKSk7XG5cdFx0XHQvLyBGbHVzaCB0aGUgb3V0cHV0IGJ1ZmZlci5cblx0XHRcdHRoaXMuZmx1c2hPdXRwdXRCdWZmZXIocFBhcnNlclN0YXRlKTtcblx0XHRcdC8vIEVuZCBwYXR0ZXJuIG1vZGVcblx0XHRcdHBQYXJzZXJTdGF0ZS5QYXR0ZXJuID0gZmFsc2U7XG5cdFx0XHRwUGFyc2VyU3RhdGUuUGF0dGVybk1hdGNoID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cdFxuXHQvKipcblx0ICogUGFyc2UgYSBjaGFyYWN0ZXIgaW4gdGhlIGJ1ZmZlci5cblx0ICogQG1ldGhvZCBwYXJzZUNoYXJhY3RlclxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcENoYXJhY3RlciAtIFRoZSBjaGFyYWN0ZXIgdG8gYXBwZW5kXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwUGFyc2VyU3RhdGUgLSBUaGUgc3RhdGUgb2JqZWN0IGZvciB0aGUgY3VycmVudCBwYXJzaW5nIHRhc2tcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHBhcnNlQ2hhcmFjdGVyIChwQ2hhcmFjdGVyLCBwUGFyc2VyU3RhdGUpXG5cdHtcblx0XHQvLyAoMSkgSWYgd2UgYXJlbid0IGluIGEgcGF0dGVybiBtYXRjaCwgYW5kIHdlIGFyZW4ndCBwb3RlbnRpYWxseSBtYXRjaGluZywgYW5kIHRoaXMgbWF5IGJlIHRoZSBzdGFydCBvZiBhIG5ldyBwYXR0ZXJuLi4uLlxuXHRcdGlmICghcFBhcnNlclN0YXRlLlBhdHRlcm5NYXRjaCAmJiBwUGFyc2VyU3RhdGUuUGFyc2VUcmVlLmhhc093blByb3BlcnR5KHBDaGFyYWN0ZXIpKVxuXHRcdHtcblx0XHRcdC8vIC4uLiBhc3NpZ24gdGhlIG5vZGUgYXMgdGhlIG1hdGNoZWQgbm9kZS5cblx0XHRcdHRoaXMuYXNzaWduTm9kZShwUGFyc2VyU3RhdGUuUGFyc2VUcmVlW3BDaGFyYWN0ZXJdLCBwUGFyc2VyU3RhdGUpO1xuXHRcdFx0dGhpcy5hcHBlbmRPdXRwdXRCdWZmZXIocENoYXJhY3RlciwgcFBhcnNlclN0YXRlKTtcblx0XHR9XG5cdFx0Ly8gKDIpIElmIHdlIGFyZSBpbiBhIHBhdHRlcm4gbWF0Y2ggKGFjdGl2ZWx5IHNlZWluZyBpZiB0aGlzIGlzIHBhcnQgb2YgYSBuZXcgcGF0dGVybiB0b2tlbilcblx0XHRlbHNlIGlmIChwUGFyc2VyU3RhdGUuUGF0dGVybk1hdGNoKVxuXHRcdHtcblx0XHRcdC8vIElmIHRoZSBwYXR0ZXJuIGhhcyBhIHN1YnBhdHRlcm4gd2l0aCB0aGlzIGtleVxuXHRcdFx0aWYgKHBQYXJzZXJTdGF0ZS5QYXR0ZXJuTWF0Y2guaGFzT3duUHJvcGVydHkocENoYXJhY3RlcikpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIENvbnRpbnVlIG1hdGNoaW5nIHBhdHRlcm5zLlxuXHRcdFx0XHR0aGlzLmFzc2lnbk5vZGUocFBhcnNlclN0YXRlLlBhdHRlcm5NYXRjaFtwQ2hhcmFjdGVyXSwgcFBhcnNlclN0YXRlKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuYXBwZW5kT3V0cHV0QnVmZmVyKHBDaGFyYWN0ZXIsIHBQYXJzZXJTdGF0ZSk7XG5cdFx0XHRpZiAocFBhcnNlclN0YXRlLlBhdHRlcm4pXG5cdFx0XHR7XG5cdFx0XHRcdC8vIC4uLiBDaGVjayBpZiB0aGlzIGlzIHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4gKGlmIHdlIGFyZSBtYXRjaGluZyBhIHZhbGlkIHBhdHRlcm4pLi4uXG5cdFx0XHRcdHRoaXMuY2hlY2tQYXR0ZXJuRW5kKHBQYXJzZXJTdGF0ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vICgzKSBJZiB3ZSBhcmVuJ3QgaW4gYSBwYXR0ZXJuIG1hdGNoIG9yIHBhdHRlcm4sIGFuZCB0aGlzIGlzbid0IHRoZSBzdGFydCBvZiBhIG5ldyBwYXR0ZXJuIChSQVcgbW9kZSkuLi4uXG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHBQYXJzZXJTdGF0ZS5PdXRwdXQgKz0gcENoYXJhY3Rlcjtcblx0XHR9XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBQYXJzZSBhIHN0cmluZyBmb3IgbWF0Y2hlcywgYW5kIHByb2Nlc3MgYW55IHRlbXBsYXRlIHNlZ21lbnRzIHRoYXQgb2NjdXIuXG5cdCAqIEBtZXRob2QgcGFyc2VTdHJpbmdcblx0ICogQHBhcmFtIHtzdHJpbmd9IHBTdHJpbmcgLSBUaGUgc3RyaW5nIHRvIHBhcnNlLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcFBhcnNlVHJlZSAtIFRoZSBwYXJzZSB0cmVlIHRvIGJlZ2luIHBhcnNpbmcgZnJvbSAodXN1YWxseSByb290KVxuXHQgKi9cblx0cGFyc2VTdHJpbmcgKHBTdHJpbmcsIHBQYXJzZVRyZWUpXG5cdHtcblx0XHRsZXQgdG1wUGFyc2VyU3RhdGUgPSB0aGlzLm5ld1BhcnNlclN0YXRlKHBQYXJzZVRyZWUpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwU3RyaW5nLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdC8vIFRPRE86IFRoaXMgaXMgbm90IGZhc3QuXG5cdFx0XHR0aGlzLnBhcnNlQ2hhcmFjdGVyKHBTdHJpbmdbaV0sIHRtcFBhcnNlclN0YXRlKTtcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5mbHVzaE91dHB1dEJ1ZmZlcih0bXBQYXJzZXJTdGF0ZSk7XG5cdFx0XG5cdFx0cmV0dXJuIHRtcFBhcnNlclN0YXRlLk91dHB1dDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cmluZ1BhcnNlcjtcbiIsIi8qKlxuKiBXb3JkIFRyZWVcbipcbiogQGxpY2Vuc2UgICAgIE1JVFxuKlxuKiBAYXV0aG9yICAgICAgU3RldmVuIFZlbG96byA8c3RldmVuQHZlbG96by5jb20+XG4qXG4qIEBkZXNjcmlwdGlvbiBDcmVhdGUgYSB0cmVlIChkaXJlY3RlZCBncmFwaCkgb2YgSmF2YXNjcmlwdCBvYmplY3RzLCBvbmUgY2hhcmFjdGVyIHBlciBvYmplY3QuXG4qL1xuXG5jbGFzcyBXb3JkVHJlZVxue1xuXHQvKipcblx0ICogV29yZFRyZWUgQ29uc3RydWN0b3Jcblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHRoaXMuUGFyc2VUcmVlID0ge307XG5cdH1cblx0XG5cdC8qKiBcblx0ICogQWRkIGEgY2hpbGQgY2hhcmFjdGVyIHRvIGEgUGFyc2UgVHJlZSBub2RlXG5cdCAqIEBtZXRob2QgYWRkQ2hpbGRcblx0ICogQHBhcmFtIHtPYmplY3R9IHBUcmVlIC0gQSBwYXJzZSB0cmVlIHRvIHB1c2ggdGhlIGNoYXJhY3RlcnMgaW50b1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gcFBhdHRlcm4gLSBUaGUgc3RyaW5nIHRvIGFkZCB0byB0aGUgdHJlZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gcEluZGV4IC0gY2FsbGJhY2sgZnVuY3Rpb25cblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIHJlc3VsdGluZyBsZWFmIG5vZGUgdGhhdCB3YXMgYWRkZWQgKG9yIGZvdW5kKVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0YWRkQ2hpbGQgKHBUcmVlLCBwUGF0dGVybiwgcEluZGV4KVxuXHR7XG5cdFx0aWYgKHBJbmRleCA+IHBQYXR0ZXJuLmxlbmd0aClcblx0XHRcdHJldHVybiBwVHJlZTtcblx0XHRcblx0XHRpZiAoIXBUcmVlLmhhc093blByb3BlcnR5KHBQYXR0ZXJuW3BJbmRleF0pKVxuXHRcdFx0cFRyZWVbcFBhdHRlcm5bcEluZGV4XV0gPSB7fTtcblx0XHRcblx0XHRyZXR1cm4gcFRyZWVbcFBhdHRlcm5bcEluZGV4XV07XG5cdH1cblx0XG5cdC8qKiBBZGQgYSBQYXR0ZXJuIHRvIHRoZSBQYXJzZSBUcmVlXG5cdCAqIEBtZXRob2QgYWRkUGF0dGVyblxuXHQgKiBAcGFyYW0ge09iamVjdH0gcFRyZWUgLSBBIG5vZGUgb24gdGhlIHBhcnNlIHRyZWUgdG8gcHVzaCB0aGUgY2hhcmFjdGVycyBpbnRvXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwUGF0dGVybiAtIFRoZSBzdHJpbmcgdG8gYWRkIHRvIHRoZSB0cmVlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBwSW5kZXggLSBjYWxsYmFjayBmdW5jdGlvblxuXHQgKiBAcmV0dXJuIHtib29sfSBUcnVlIGlmIGFkZGluZyB0aGUgcGF0dGVybiB3YXMgc3VjY2Vzc2Z1bFxuXHQgKi9cblx0YWRkUGF0dGVybiAocFBhdHRlcm5TdGFydCwgcFBhdHRlcm5FbmQsIHBQYXJzZXIpXG5cdHtcblx0XHRpZiAocFBhdHRlcm5TdGFydC5sZW5ndGggPCAxKVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0bGV0IHRtcExlYWYgPSB0aGlzLlBhcnNlVHJlZTtcblxuXHRcdC8vIEFkZCB0aGUgdHJlZSBvZiBsZWF2ZXMgaXRlcmF0aXZlbHlcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBQYXR0ZXJuU3RhcnQubGVuZ3RoOyBpKyspXG5cdFx0XHR0bXBMZWFmID0gdGhpcy5hZGRDaGlsZCh0bXBMZWFmLCBwUGF0dGVyblN0YXJ0LCBpKTtcblxuXHRcdHRtcExlYWYuUGF0dGVyblN0YXJ0ID0gcFBhdHRlcm5TdGFydDtcblx0XHR0bXBMZWFmLlBhdHRlcm5FbmQgPSAoKHR5cGVvZihwUGF0dGVybkVuZCkgPT09ICdzdHJpbmcnKSAmJiAocFBhdHRlcm5FbmQubGVuZ3RoID4gMCkpID8gcFBhdHRlcm5FbmQgOiBwUGF0dGVyblN0YXJ0O1xuXHRcdHRtcExlYWYuUGFyc2UgPSAodHlwZW9mKHBQYXJzZXIpID09PSAnZnVuY3Rpb24nKSA/IHBQYXJzZXIgOiBcblx0XHRcdFx0XHRcdCh0eXBlb2YocFBhcnNlcikgPT09ICdzdHJpbmcnKSA/ICgpID0+IHsgcmV0dXJuIHBQYXJzZXI7IH0gOlxuXHRcdFx0XHRcdFx0KHBEYXRhKSA9PiB7IHJldHVybiBwRGF0YTsgfTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV29yZFRyZWU7XG4iLCIvKipcbiogQGxpY2Vuc2UgTUlUXG4qIEBhdXRob3IgPHN0ZXZlbkB2ZWxvem8uY29tPlxuKi9cblxuLyoqXG4qIEVsdWNpZGF0b3IgYnJvd3NlciBzaGltIGxvYWRlclxuKi9cblxuLy8gTG9hZCB0aGUgbWFueWZlc3QgbW9kdWxlIGludG8gdGhlIGJyb3dzZXIgZ2xvYmFsIGF1dG9tYXRpY2FsbHkuXG52YXIgbGliRWx1Y2lkYXRvciA9IHJlcXVpcmUoJy4vRWx1Y2lkYXRvci5qcycpO1xuXG5pZiAodHlwZW9mKHdpbmRvdykgPT09ICdvYmplY3QnKSB3aW5kb3cuRWx1Y2lkYXRvciA9IGxpYkVsdWNpZGF0b3I7XG5cbm1vZHVsZS5leHBvcnRzID0gbGliRWx1Y2lkYXRvcjsiLCIvKipcbiogQGxpY2Vuc2UgTUlUXG4qIEBhdXRob3IgPHN0ZXZlbkB2ZWxvem8uY29tPlxuKi9cblxuLyoqXG4qIEluc3RydWN0aW9uIFNldCBCYWNlIENsYXNzLlxuKlxuKiBAY2xhc3MgRWx1Y2lkYXRvckluc3RydWN0aW9uU2V0XG4qL1xuY2xhc3MgRWx1Y2lkYXRvckluc3RydWN0aW9uU2V0XG57XG4gICAgY29uc3RydWN0b3IocEVsdWNpZGF0b3IpXG4gICAge1xuICAgICAgICB0aGlzLmVsdWNpZGF0b3IgPSBwRWx1Y2lkYXRvcjtcblxuICAgICAgICB0aGlzLm5hbWVzcGFjZSA9ICdkZWZhdWx0JztcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYW4gZW1wdHkgbmFtZXNwYWNlIGZvciBpbnN0cnVjdGlvbnMgYW5kIG9wZXJhdGlvbnMgaWYgZWl0aGVyIG9uZSBkb2Vzbid0IGV4aXN0XG4gICAgaW5pdGlhbGl6ZU5hbWVzcGFjZSgpXG4gICAge1xuICAgICAgICBpZiAoIXRoaXMuZWx1Y2lkYXRvci5pbnN0cnVjdGlvblNldHMuaGFzT3duUHJvcGVydHkodGhpcy5uYW1lc3BhY2UpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmVsdWNpZGF0b3IuaW5zdHJ1Y3Rpb25TZXRzW3RoaXMubmFtZXNwYWNlLnRvTG93ZXJDYXNlKCldID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmVsdWNpZGF0b3Iub3BlcmF0aW9uU2V0cy5oYXNPd25Qcm9wZXJ0eSh0aGlzLm5hbWVzcGFjZSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZWx1Y2lkYXRvci5vcGVyYXRpb25TZXRzW3RoaXMubmFtZXNwYWNlLnRvTG93ZXJDYXNlKCldID0ge307XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgYW4gaW5zdHJ1Y3Rpb24gdG8gdGhlIHNldFxuICAgIGFkZEluc3RydWN0aW9uKHBJbnN0cnVjdGlvbkhhc2gsIGZJbnN0cnVjdGlvbkZ1bmN0aW9uKVxuICAgIHtcbiAgICAgICAgaWYgKHR5cGVvZihwSW5zdHJ1Y3Rpb25IYXNoKSAhPSAnc3RyaW5nJylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5lbHVjaWRhdG9yLmxvZ0Vycm9yKGBBdHRlbXB0ZWQgdG8gYWRkIGFuIGluc3RydWN0aW9uIHdpdGggYW4gaW52YWxpZCBoYXNoOyBleHBlY3RlZCBhIHN0cmluZyBidXQgdGhlIGluc3RydWN0aW9uIGhhc2ggdHlwZSB3YXMgJHt0eXBlb2YocEluc3RydWN0aW9uSGFzaCl9YCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZihmSW5zdHJ1Y3Rpb25GdW5jdGlvbikgIT0gJ2Z1bmN0aW9uJylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5lbHVjaWRhdG9yLmxvZ0Vycm9yKGBBdHRlbXB0ZWQgdG8gYWRkIGFuIGluc3RydWN0aW9uIHdpdGggYW4gaW52YWxpZCBmdW5jdGlvbjsgZXhwZWN0ZWQgYSBmdW5jdGlvbiBidXQgdHlwZSB3YXMgJHt0eXBlb2YoZkluc3RydWN0aW9uRnVuY3Rpb24pfWApO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbHVjaWRhdG9yLmluc3RydWN0aW9uU2V0c1t0aGlzLm5hbWVzcGFjZS50b0xvd2VyQ2FzZSgpXVtwSW5zdHJ1Y3Rpb25IYXNoXSA9IGZJbnN0cnVjdGlvbkZ1bmN0aW9uO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplSW5zdHJ1Y3Rpb25zKClcbiAgICB7XG4gICAgICAgIC8vIFRoaXMgaXMgd2hlcmUgd2UgbWFwIGluIHRoZSBpbnN0cnVjdGlvbnMuXG4gICAgICAgIC8vIElmIHRoZSBleHRlbmRpbmcgY2xhc3MgY2FsbHMgc3VwZXIgaXQgd2lsbCBpbmplY3QgYSBoYXJtbGVzcyBub29wIGludG8gdGhlIHNjb3BlLlxuICAgICAgICAvLyBJdCBpc24ndCByZWNvbW1lbmRlZCB0byBkbyB0aGVzZSBpbmxpbmUgYXMgbGFtYmRhcywgYnV0IHRoaXMgY29kZSBpcyBnZW5lcmFsbHkgbm90IGV4cGVjdGVkIHRvIGJlIGNhbGxlZC5cbiAgICAgICAgLy8gVW5sZXNzIHRoZSBkZXZlbG9wZXIgd2FudHMgYSBub29wIGluIHRoZWlyIGluc3RydWN0aW9uIHNldC4uLi4uLi4uLi4uXG4gICAgICAgIHRoaXMuYWRkSW5zdHJ1Y3Rpb24oJ25vb3AnLCBcbiAgICAgICAgICAgIChwT3BlcmF0aW9uKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBPcGVyYXRpb24ubG9nSW5mbygnRXhlY3V0aW5nIGEgbm8tb3BlcmF0aW9uIG9wZXJhdGlvbi4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCBhbiBvcGVyYXRpb24gdG8gdGhlIHNldFxuICAgIGFkZE9wZXJhdGlvbihwT3BlcmF0aW9uSGFzaCwgcE9wZXJhdGlvbilcbiAgICB7XG4gICAgICAgIGlmICh0eXBlb2YocE9wZXJhdGlvbkhhc2gpICE9ICdzdHJpbmcnKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmVsdWNpZGF0b3IubG9nRXJyb3IoYEF0dGVtcHRlZCB0byBhZGQgYW4gb3BlcmF0aW9uIHdpdGggYW4gaW52YWxpZCBoYXNoOyBleHBlY3RlZCBhIHN0cmluZyBidXQgdGhlIG9wZXJhdGlvbiBoYXNoIHR5cGUgd2FzICR7dHlwZW9mKHBPcGVyYXRpb25IYXNoKX1gLCBwT3BlcmF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mKHBPcGVyYXRpb24pICE9ICdvYmplY3QnKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmVsdWNpZGF0b3IubG9nRXJyb3IoYEF0dGVtcHRlZCB0byBhZGQgYW4gaW52YWxpZCBvcGVyYXRpb247IGV4cGVjdGVkIGFuIG9iamVjdCBkYXRhIHR5cGUgYnV0IHRoZSB0eXBlIHdhcyAke3R5cGVvZihwT3BlcmF0aW9uKX1gLCBwT3BlcmF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBWYWxpZGF0ZSB0aGUgRGVzY3JpcHRpb24gc3Vib2JqZWN0LCB3aGljaCBpcyBrZXkgdG8gZnVuY3Rpb25pbmcuXG4gICAgICAgIGlmICghcE9wZXJhdGlvbi5oYXNPd25Qcm9wZXJ0eShcIkRlc2NyaXB0aW9uXCIpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmVsdWNpZGF0b3IubG9nRXJyb3IoYEF0dGVtcHRlZCB0byBhZGQgYW4gb3BlcmF0aW9uIHdpdGggYW4gaW52YWxpZCBkZXNjcmlwdGlvbjsgbm8gRGVzY3JpcHRpb24gc3Vib2JqZWN0IHNldC5gLCBwT3BlcmF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mKHBPcGVyYXRpb24uRGVzY3JpcHRpb24pICE9ICdvYmplY3QnKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmVsdWNpZGF0b3IubG9nRXJyb3IoYEF0dGVtcHRlZCB0byBhZGQgYW4gb3BlcmF0aW9uIHdpdGggYW4gaW52YWxpZCBkZXNjcmlwdGlvbjsgRGVzY3JpcHRpb24gc3Vib2JqZWN0IHdhcyBub3QgYW4gb2JqZWN0LiAgVGhlIHR5cGUgd2FzICR7dHlwZW9mKHBPcGVyYXRpb24uRGVzY3JpcHRpb24pfS5gLCBwT3BlcmF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mKHBPcGVyYXRpb24uRGVzY3JpcHRpb24uSGFzaCkgIT0gJ3N0cmluZycpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YocE9wZXJhdGlvbi5EZXNjcmlwdGlvbi5PcGVyYXRpb24pID09ICdzdHJpbmcnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIFVzZSB0aGUgXCJPcGVyYXRpb25cIiBhcyB0aGUgXCJIYXNoXCJcbiAgICAgICAgICAgICAgICBwT3BlcmF0aW9uLkRlc2NyaXB0aW9uLkhhc2ggPSBwT3BlcmF0aW9uLkRlc2NyaXB0aW9uLk9wZXJhdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsdWNpZGF0b3IubG9nRXJyb3IoYEF0dGVtcHRlZCB0byBhZGQgYW4gb3BlcmF0aW9uIHdpdGggYW4gaW52YWxpZCBkZXNjcmlwdGlvbjsgRGVzY3JpcHRpb24gc3Vib2JqZWN0IGRpZCBub3QgY29udGFpbiBhIHZhbGlkIEhhc2ggd2hpY2ggaXMgcmVxdWlyZWQgdG8gY2FsbCB0aGUgb3BlcmF0aW9uLmAsIHBPcGVyYXRpb24pO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdyBhdXRvIGNyZWF0ZSBkYXRhIGlmIGl0IGlzIG1pc3Npbmcgb3Igd3JvbmcgaW4gdGhlIERlc2NyaXB0aW9uXG4gICAgICAgIGlmICgodHlwZW9mKHBPcGVyYXRpb24uRGVzY3JpcHRpb24uTmFtZXNwYWNlKSAhPSAnc3RyaW5nJykgfHwgKHBPcGVyYXRpb24uRGVzY3JpcHRpb24uTmFtZXNwYWNlICE9IHRoaXMubmFtZXNwYWNlKSlcbiAgICAgICAge1xuICAgICAgICAgICAgcE9wZXJhdGlvbi5EZXNjcmlwdGlvbi5OYW1lc3BhY2UgPSB0aGlzLm5hbWVzcGFjZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mKHBPcGVyYXRpb24uRGVzY3JpcHRpb24uU3VtbWFyeSkgIT0gJ3N0cmluZycpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBPcGVyYXRpb24uRGVzY3JpcHRpb24uU3VtbWFyeSA9IGBbJHtwT3BlcmF0aW9uLkRlc2NyaXB0aW9uLk5hbWVzcGFjZX1dIFske3BPcGVyYXRpb24uRGVzY3JpcHRpb24uSGFzaH1dIG9wZXJhdGlvbi5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIGlucHV0cywgb3Igb3V0cHV0cywgb3Igc3RlcHMsIGFkZCB0aGVtLlxuICAgICAgICBpZiAoIXBPcGVyYXRpb24uaGFzT3duUHJvcGVydHkoJ0lucHV0cycpKVxuICAgICAgICB7XG4gICAgICAgICAgICBwT3BlcmF0aW9uLklucHV0cyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmICghcE9wZXJhdGlvbi5oYXNPd25Qcm9wZXJ0eSgnT3V0cHV0cycpKVxuICAgICAgICB7XG4gICAgICAgICAgICBwT3BlcmF0aW9uLk91dHB1dHMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXBPcGVyYXRpb24uaGFzT3duUHJvcGVydHkoJ1N0ZXBzJykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBPcGVyYXRpb24uU3RlcHMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBpbnB1dHMsIG9yIG91dHB1dHMsIG9yIHN0ZXBzLCBhZGQgdGhlbS5cbiAgICAgICAgLy8gVE9ETzogQWRkIGEgc3RlcCB3aGVyZSB3ZSB0cnkgdG8gbG9hZCB0aGlzIGludG8gTWFueWZlc3QgYW5kIHNlZSB0aGF0IGl0J3MgdmFsaWQuXG4gICAgICAgIGlmICh0eXBlb2YocE9wZXJhdGlvbi5JbnB1dHMpICE9PSAnb2JqZWN0JylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5lbHVjaWRhdG9yLmxvZ0Vycm9yKGBBdHRlbXB0ZWQgdG8gYWRkIGFuIG9wZXJhdGlvbiB3aXRoIGFuIGludmFsaWQgSW5wdXRzIG9iamVjdC5gLCBwT3BlcmF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gaW5wdXRzLCBvciBvdXRwdXRzLCBvciBzdGVwcywgYWRkIHRoZW0uXG4gICAgICAgIC8vIFRPRE86IEFkZCBhIHN0ZXAgd2hlcmUgd2UgdHJ5IHRvIGxvYWQgdGhpcyBpbnRvIE1hbnlmZXN0IGFuZCBzZWUgdGhhdCBpdCdzIHZhbGlkLlxuICAgICAgICBpZiAodHlwZW9mKHBPcGVyYXRpb24uT3V0cHV0cykgIT09ICdvYmplY3QnKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmVsdWNpZGF0b3IubG9nRXJyb3IoYEF0dGVtcHRlZCB0byBhZGQgYW4gb3BlcmF0aW9uIHdpdGggYW4gaW52YWxpZCBPdXRwdXRzIG9iamVjdC5gLCBwT3BlcmF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocE9wZXJhdGlvbi5TdGVwcykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZWx1Y2lkYXRvci5sb2dFcnJvcihgQXR0ZW1wdGVkIHRvIGFkZCBhbiBvcGVyYXRpb24gd2l0aCBhbiBpbnZhbGlkIFN0ZXBzIGFycmF5LmAsIHBPcGVyYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cblxuICAgICAgICB0aGlzLmVsdWNpZGF0b3Iub3BlcmF0aW9uU2V0c1t0aGlzLm5hbWVzcGFjZS50b0xvd2VyQ2FzZSgpXVtwT3BlcmF0aW9uSGFzaF0gPSBwT3BlcmF0aW9uO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplT3BlcmF0aW9ucygpXG4gICAge1xuICAgICAgICB0aGlzLmFkZE9wZXJhdGlvbignbm9vcCcsIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiRGVzY3JpcHRpb25cIjpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiT3BlcmF0aW9uXCI6IFwibm9vcFwiLFxuICAgICAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6IFwiTm8gb3BlcmF0aW9uIC0gbm8gYWZmZWN0IG9uIGFueSBkYXRhLlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbHVjaWRhdG9ySW5zdHJ1Y3Rpb25TZXQ7IiwiLyoqXG4qIEBsaWNlbnNlIE1JVFxuKiBAYXV0aG9yIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5cbi8qKlxuKiBFbHVjaWRhdG9yIHNpbXBsZSBsb2dnaW5nIHNoaW0gKGZvciBicm93c2VyIGFuZCBkZXBlbmRlbmN5LWZyZWUgcnVubmluZylcbiovXG5cbmNvbnN0IGxvZ1RvQ29uc29sZSA9IChwTG9nTGluZSwgcExvZ09iamVjdCwgcExvZ0xldmVsKSA9Plxue1xuICAgIGxldCB0bXBMb2dMaW5lID0gKHR5cGVvZihwTG9nTGluZSkgPT09ICdzdHJpbmcnKSA/IHBMb2dMaW5lIDogJyc7XG4gICAgbGV0IHRtcExvZ0xldmVsID0gKHR5cGVvZihwTG9nTGV2ZWwpID09PSAnc3RyaW5nJykgPyBwTG9nTGV2ZWwgOiAnSU5GTyc7XG5cbiAgICBjb25zb2xlLmxvZyhgW0VsdWNpZGF0b3I6JHt0bXBMb2dMZXZlbH1dICR7dG1wTG9nTGluZX1gKTtcblxuICAgIGlmIChwTG9nT2JqZWN0KSBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShwTG9nT2JqZWN0LG51bGwsNCkrXCJcXG5cIik7XG59O1xuXG5jb25zdCBsb2dJbmZvID0gKHBMb2dMaW5lLCBwTG9nT2JqZWN0KSA9Plxue1xuICAgIGxvZ1RvQ29uc29sZShwTG9nTGluZSwgcExvZ09iamVjdCwgJ0luZm8nKTtcbn07XG5cblxuY29uc3QgbG9nV2FybmluZyA9IChwTG9nTGluZSwgcExvZ09iamVjdCkgPT5cbntcbiAgICBsb2dUb0NvbnNvbGUocExvZ0xpbmUsIHBMb2dPYmplY3QsICdXYXJuaW5nJyk7XG59O1xuXG5cbmNvbnN0IGxvZ0Vycm9yID0gKHBMb2dMaW5lLCBwTG9nT2JqZWN0KSA9Plxue1xuICAgIGxvZ1RvQ29uc29sZShwTG9nTGluZSwgcExvZ09iamVjdCwgJ0Vycm9yJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbntcbiAgICBsb2dUb0NvbnNvbGU6IGxvZ1RvQ29uc29sZSxcbiAgICBpbmZvOiBsb2dJbmZvLFxuICAgIHdhcm5pbmc6IGxvZ1dhcm5pbmcsXG4gICAgZXJyb3I6IGxvZ0Vycm9yXG59KTsiLCIvKipcbiogQGxpY2Vuc2UgTUlUXG4qIEBhdXRob3IgPHN0ZXZlbkB2ZWxvem8uY29tPlxuKi9cbmNvbnN0IGxpYlNpbXBsZUxvZyA9IHJlcXVpcmUoJy4vRWx1Y2lkYXRvci1Mb2dUb0NvbnNvbGUuanMnKTtcbmNvbnN0IGxpYk1hbnlmZXN0ID0gcmVxdWlyZSgnbWFueWZlc3QnKTtcbmNvbnN0IGxpYlByZWNlZGVudCA9IHJlcXVpcmUoJ3ByZWNlZGVudCcpO1xuXG4vKipcbiogRWx1Y2lkYXRvciBvYmplY3QgYWRkcmVzcy1iYXNlZCBkZXNjcmlwdGlvbnMgYW5kIG1hbmlwdWxhdGlvbnMuXG4qXG4qIEBjbGFzcyBFbHVjaWRhdG9yXG4qL1xuY2xhc3MgRWx1Y2lkYXRvclxue1xuICAgIGNvbnN0cnVjdG9yKHBPcGVyYXRpb25zLCBmSW5mb0xvZywgZkVycm9yTG9nKVxuICAgIHtcbiAgICAgICAgLy8gV2lyZSBpbiBsb2dnaW5nXG4gICAgICAgIHRoaXMubG9nSW5mbyA9ICh0eXBlb2YoZkluZm9Mb2cpID09PSAnZnVuY3Rpb24nKSA/IGZJbmZvTG9nIDogbGliU2ltcGxlTG9nLmluZm87XG4gICAgICAgIHRoaXMubG9nV2FybmluZyA9ICh0eXBlb2YoZldhcm5pbmdMb2cpID09PSAnZnVuY3Rpb24nKSA/IGZXYXJuaW5nTG9nIDogbGliU2ltcGxlTG9nLndhcm5pbmc7XG4gICAgICAgIHRoaXMubG9nRXJyb3IgPSAodHlwZW9mKGZFcnJvckxvZykgPT09ICdmdW5jdGlvbicpID8gZkVycm9yTG9nIDogbGliU2ltcGxlTG9nLmVycm9yO1xuXG5cdFx0Ly8gSW5zdHJ1Y3Rpb25zIGFyZSB0aGUgYmFzaWMgYnVpbGRpbmcgYmxvY2tzIGZvciBvcGVyYXRpb25zXG5cdFx0dGhpcy5pbnN0cnVjdGlvblNldHMgPSB7fTtcblxuXHRcdC8vIE9wZXJhdGlvbnMgYXJlIHRoZSBzb2x2ZXJzIHRoYXQgY2FuIGJlIGNhbGxlZCAoaW5zdHJ1Y3Rpb25zIGNhbid0IGJlIGNhbGxlZCBkaXJlY3RseSlcblx0XHQvLyBUaGVzZSBjYW4gYmUgYWRkZWQgYXQgcnVuLXRpbWUgYXMgd2VsbFxuXHRcdHRoaXMub3BlcmF0aW9uU2V0cyA9IHt9O1xuXG5cdFx0Ly8gRGVjaWRlIGxhdGVyIGhvdyB0byBtYWtlIHRoaXMgdHJ1bHkgdW5pcXVlLlxuXHRcdHRoaXMuVVVJRCA9IDA7XG5cblx0XHR0aGlzLmxvYWREZWZhdWx0SW5zdHJ1Y3Rpb25TZXRzKCk7XG4gICAgfVxuXG5cdC8vIExvYWQgYW4gaW5zdHJ1Y3Rpb24gc2V0XG5cdGxvYWRJbnN0cnVjdGlvblNldChjSW5zdHJ1Y3Rpb25TZXQpXG5cdHtcblx0XHRsZXQgdG1wSW5zdHJ1Y3Rpb25TZXQgPSBuZXcgY0luc3RydWN0aW9uU2V0KHRoaXMpO1xuXHRcdC8vIFNldHVwIHRoZSBuYW1lc3BhY2Vcblx0XHR0bXBJbnN0cnVjdGlvblNldC5pbml0aWFsaXplTmFtZXNwYWNlKCk7XG5cdFx0dG1wSW5zdHJ1Y3Rpb25TZXQuaW5pdGlhbGl6ZUluc3RydWN0aW9ucygpO1xuXHRcdHRtcEluc3RydWN0aW9uU2V0LmluaXRpYWxpemVPcGVyYXRpb25zKCk7XG5cdH1cblxuXHRsb2FkRGVmYXVsdEluc3RydWN0aW9uU2V0cygpXG5cdHtcblx0XHQvLyBUaGUgamF2YXNjcmlwdCBtYXRoIGluc3RydWN0aW9ucyBhbmQgb3BlcmF0aW9uc1xuXHRcdC8vIFRoZXNlIHByb3ZpZGUgdGhlIFwiTWF0aFwiIG5hbWVzcGFjZVxuXHRcdHRoaXMubG9hZEluc3RydWN0aW9uU2V0KHJlcXVpcmUoYC4vSW5zdHJ1Y3Rpb25TZXRzL01hdGgtSmF2YXNjcmlwdC5qc2ApKTtcblxuXHRcdC8vIEEgcHJlY2lzaW9uIGphdmFzY3JpcHQgbGlicmFyeSB0aGF0IGlzIGNvbnNpc3RlbnQgYWNyb3NzIGJyb3dzZXJzLCBzdGFibGUgYW5kIHdpdGhvdXQgbWFudGlzc2EgaXNzdWVzXG5cdFx0Ly8gVGhlc2UgcHJvdmlkZSB0aGUgXCJQcmVjaXNlTWF0aFwiIG5hbWVzcGFjZVxuXHRcdHRoaXMubG9hZEluc3RydWN0aW9uU2V0KHJlcXVpcmUoYC4vSW5zdHJ1Y3Rpb25TZXRzL1ByZWNpc2VNYXRoLURlY2ltYWwuanNgKSk7XG5cblx0XHQvLyBUaGUgYWJzdHJhY3QgZ2VvbWV0cnkgaW5zdHJ1Y3Rpb25zIGFuZCBvcGVyYXRpb25zXG5cdFx0Ly8gVGhlc2UgcHJvdmlkZSB0aGUgXCJHZW9tZXRyeVwiIG5hbWVzcGFjZVxuXHRcdHRoaXMubG9hZEluc3RydWN0aW9uU2V0KHJlcXVpcmUoYC4vSW5zdHJ1Y3Rpb25TZXRzL0dlb21ldHJ5LmpzYCkpO1xuXHR9XG5cblx0Ly9cblx0c29sdmVJbnRlcm5hbE9wZXJhdGlvbihwTmFtZXNwYWNlLCBwT3BlcmF0aW9uSGFzaCwgcElucHV0T2JqZWN0LCBwT3V0cHV0T2JqZWN0LCBwRGVzY3JpcHRpb25NYW55ZmVzdCwgcElucHV0QWRkcmVzc01hcHBpbmcsIHBPdXRwdXRBZGRyZXNzTWFwcGluZywgcFNvbHV0aW9uQ29udGV4dClcblx0e1xuXHRcdGxldCB0bXBPcGVyYXRpb24gPSB0aGlzLm9wZXJhdGlvblNldHNbcE5hbWVzcGFjZS50b0xvd2VyQ2FzZSgpXVtwT3BlcmF0aW9uSGFzaC50b0xvd2VyQ2FzZSgpXTtcblx0XHRyZXR1cm4gdGhpcy5zb2x2ZU9wZXJhdGlvbih0bXBPcGVyYXRpb24sIHBJbnB1dE9iamVjdCwgcE91dHB1dE9iamVjdCwgcERlc2NyaXB0aW9uTWFueWZlc3QsIHBJbnB1dEFkZHJlc3NNYXBwaW5nLCBwT3V0cHV0QWRkcmVzc01hcHBpbmcsIHBTb2x1dGlvbkNvbnRleHQpO1xuXHR9XG5cblx0c29sdmVPcGVyYXRpb24ocE9wZXJhdGlvbk9iamVjdCwgcElucHV0T2JqZWN0LCBwT3V0cHV0T2JqZWN0LCBwRGVzY3JpcHRpb25NYW55ZmVzdCwgcElucHV0QWRkcmVzc01hcHBpbmcsIHBPdXRwdXRBZGRyZXNzTWFwcGluZywgcFNvbHV0aW9uQ29udGV4dClcblx0e1xuXHRcdGxldCB0bXBPcGVyYXRpb24gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHBPcGVyYXRpb25PYmplY3QpKTtcblxuXHRcdC8vIE5vdyB0aGF0IHRoZSBvcGVyYXRpb24gb2JqZWN0IGhhcyBiZWVuIGNyZWF0ZWQgdW5pcXVlbHksIGFwcGx5IGFueSBwYXNzZWQtaW4gYWRkcmVzcy1oYXNoIHJlbWFwcGluZ3Ncblx0XHRpZiAocElucHV0QWRkcmVzc01hcHBpbmcpXG5cdFx0e1xuXHRcdFx0dG1wRGVzY3JpcHRpb25NYW55ZmVzdC5zY2hlbWFNYW5pcHVsYXRpb25zLnJlc29sdmVBZGRyZXNzTWFwcGluZ3ModG1wT3BlcmF0aW9uLklucHV0cywgcElucHV0QWRkcmVzc01hcHBpbmcpO1xuXHRcdH1cblx0XHRpZiAocE91dHB1dEFkZHJlc3NNYXBwaW5nKVxuXHRcdHtcblx0XHRcdHRtcERlc2NyaXB0aW9uTWFueWZlc3Quc2NoZW1hTWFuaXB1bGF0aW9ucy5yZXNvbHZlQWRkcmVzc01hcHBpbmdzKHRtcE9wZXJhdGlvbi5JbnB1dHMsIHBPdXRwdXRBZGRyZXNzTWFwcGluZyk7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZihwSW5wdXRPYmplY3QpICE9ICdvYmplY3QnKVxuXHRcdHtcbiAgICAgICAgICAgIHRoaXMubG9nRXJyb3IoYEF0dGVtcHRlZCB0byBydW4gYSBzb2x2ZSBidXQgdGhlIHBhc3NlZCBpbiBJbnB1dCB3YXMgbm90IGFuIG9iamVjdC4gIFRoZSB0eXBlIHdhcyAke3R5cGVvZihwSW5wdXRPYmplY3QpfS5gKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0bGV0IHRtcElucHV0T2JqZWN0ID0gcElucHV0T2JqZWN0O1xuXG5cdFx0Ly8gRGVmYXVsdCB0byByZXVzaW5nIHRoZSBpbnB1dCBvYmplY3QgYXMgdGhlIG91dHB1dCBvYmplY3QuXG5cdFx0bGV0IHRtcE91dHB1dE9iamVjdCA9IHRtcElucHV0T2JqZWN0O1xuXG5cdFx0Ly8gVGhpcyBpcyBob3cgcmVjdXJzaXZlIHNvbHV0aW9ucyBiaW5kIHRoZWlyIGNvbnRleHQgdG9nZXRoZXIuXG5cdFx0bGV0IHRtcFNvbHV0aW9uQ29udGV4dCA9IHBTb2x1dGlvbkNvbnRleHQ7XG5cdFx0aWYgKHR5cGVvZih0bXBTb2x1dGlvbkNvbnRleHQpID09PSAndW5kZWZpbmVkJylcblx0XHR7XG5cdFx0XHR0bXBTb2x1dGlvbkNvbnRleHQgPSAoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIlNvbHV0aW9uR1VJRFwiOiBgU29sdXRpb24tJHt0aGlzLlVVSUQrK31gLCBcblx0XHRcdFx0XHRcIlNvbHV0aW9uQmFzZU5hbWVzcGFjZVwiOiBwT3BlcmF0aW9uT2JqZWN0LkRlc2NyaXB0aW9uLk5hbWVzcGFjZSxcblx0XHRcdFx0XHRcIlNvbHV0aW9uQmFzZU9wZXJhdGlvblwiOiBwT3BlcmF0aW9uT2JqZWN0LkRlc2NyaXB0aW9uLk9wZXJhdGlvbixcblx0XHRcdFx0XHRcIlNvbHV0aW9uTG9nXCI6IFtdXG5cdFx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHQvLyBUaGlzIGlzIHRoZSByb290IG9wZXJhdGlvbiwgc2VlIGlmIHRoZXJlIGFyZSBJbnB1dHMgYW5kIE91dHB1dHMgY3JlYXRlZCAuLi4gaWYgbm90LCBjcmVhdGUgdGhlbS5cblx0XHRcdGlmICghdG1wT3BlcmF0aW9uLmhhc093blByb3BlcnR5KCdJbnB1dHMnKSlcblx0XHRcdHtcblx0XHRcdFx0dG1wT3BlcmF0aW9uLklucHV0cyA9IHt9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0bXBPcGVyYXRpb24uaGFzT3duUHJvcGVydHkoJ091dHB1dHMnKSlcblx0XHRcdHtcblx0XHRcdFx0dG1wT3BlcmF0aW9uLk91dHB1dHMgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVGhpcyBpcyB0aGUgcm9vdCBPcGVyYXRpb24sIHNlZSBpZiB0aGVyZSBpcyBhIGhhc2ggdHJhbnNsYXRpb24gYXZhaWxhYmxlIGZvciBlaXRoZXIgc2lkZSAoaW5wdXQgb3Igb3V0cHV0KVxuXHRcdFx0aWYgKHRtcE9wZXJhdGlvbi5oYXNPd25Qcm9wZXJ0eSgnSW5wdXRIYXNoVHJhbnNsYXRpb25UYWJsZScpKVxuXHRcdFx0e1xuXHRcdFx0XHR0bXBTb2x1dGlvbkNvbnRleHQuSW5wdXRIYXNoTWFwcGluZyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodG1wT3BlcmF0aW9uLklucHV0SGFzaFRyYW5zbGF0aW9uVGFibGUpKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0dG1wU29sdXRpb25Db250ZXh0LklucHV0SGFzaE1hcHBpbmcgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRtcE9wZXJhdGlvbi5oYXNPd25Qcm9wZXJ0eSgnT3V0cHV0SGFzaFRyYW5zbGF0aW9uVGFibGUnKSlcblx0XHRcdHtcblx0XHRcdFx0dG1wU29sdXRpb25Db250ZXh0Lk91dHB1dEhhc2hNYXBwaW5nID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0bXBPcGVyYXRpb24uT3V0cHV0SGFzaFRyYW5zbGF0aW9uVGFibGUpKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCh0eXBlb2YocE91dHB1dE9iamVjdCkgIT0gJ29iamVjdCcpXG5cdFx0XHRcdCYmICh0eXBlb2YodG1wT3V0cHV0SGFzaE1hcHBpbmcpID09ICd1bmRlZmluZWQnKSBcblx0XHRcdFx0JiYgKHR5cGVvZih0bXBJbnB1dEhhc2hNYXBwaW5nKSAhPSAndW5kZWZpbmVkJykpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIFJldXNlIHRoZSBpbnB1dCBoYXNoIG1hcHBpbmcgaWY6XG5cdFx0XHRcdC8vICAgMSkgd2UgYXV0by1tYXBwZWQgdGhlIGlucHV0IGhhc2ggbWFwcGluZyB0byB0aGUgb3V0cHV0IGJlY2F1c2Ugb25seSBhbiBpbnB1dCBvYmplY3Qgd2FzIHN1cHBsaWVkXG5cdFx0XHRcdC8vICAgMikgdGhlcmUgKndhcyBub3QqIGFuIG91dHB1dCBoYXNoIG1hcHBpbmcgc3VwcGxpZWRcblx0XHRcdFx0Ly8gICAzKSB0aGVyZSAqd2FzKiBhbiBpbnB1dCBoYXNoIG1hcHBpbmcgc3VwcGxpZWRcblx0XHRcdFx0Ly9cblx0XHRcdFx0Ly8gVGhpcyBzZWVtcyBzaW1wbGUgYXQgZmlyc3QgYnV0IGV4cG9zZXMgc29tZSByZWFsbHkgaW50ZXJlc3RpbmcgYmVoYXZpb3JzIGluIHRlcm1zIG9mXG5cdFx0XHRcdC8vIHJldXNpbmcgdGhlIHNhbWUgb2JqZWN0IGFuZCBzY2hlbWEgZm9yIGlucHV0IGFuZCBvdXRwdXQsIGJ1dCBoYXZpbmcgZGlmZmVyZW50IGhhc2hcblx0XHRcdFx0Ly8gbWFwcGluZ3MgZm9yIGVhY2ggb2YgdGhlbS5cblx0XHRcdFx0dG1wU29sdXRpb25Db250ZXh0Lk91dHB1dEhhc2hNYXBwaW5nID0gdG1wU29sdXRpb25Db250ZXh0LklucHV0SGFzaE1hcHBpbmc7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZihwT3V0cHV0T2JqZWN0KSA9PSAnb2JqZWN0Jylcblx0XHR7XG5cdFx0XHQvLyBJZiB0aGUgY2FsbCBkZWZpbmVkIGFuIGV4cGxpY2l0LCBkaWZmZXJlbnQgb3V0cHV0IG9iamVjdCBmcm9tIHRoZSBpbnB1dCBvYmplY3QgdXNlIHRoYXQgaW5zdGVhZC5cblx0XHRcdHRtcE91dHB1dE9iamVjdCA9IHBPdXRwdXRPYmplY3Q7XG5cdFx0fVxuXG5cdFx0bGV0IHRtcERlc2NyaXB0aW9uTWFueWZlc3QgPSBmYWxzZTtcblx0XHRpZiAodHlwZW9mKHBEZXNjcmlwdGlvbk1hbnlmZXN0KSA9PT0gJ3VuZGVmaW5lZCcpXG5cdFx0e1xuXHRcdFx0Ly8gV2UgYXJlIGdvaW5nIHRvIHVzZSB0aGlzIGZvciBzb21lIGNsZXZlciBzY2hlbWEgbWFuaXB1bGF0aW9ucywgdGhlbiByZWNyZWF0ZSB0aGUgb2JqZWN0XG5cdFx0XHR0bXBEZXNjcmlwdGlvbk1hbnlmZXN0ID0gbmV3IGxpYk1hbnlmZXN0KCk7XG5cdFx0XHQvLyBTeW50aGVzaXplIGEgbWFueWZlc3QgZnJvbSB0aGUgSW5wdXQgYW5kIE91dHB1dCBwcm9wZXJ0aWVzXG5cdFx0XHRsZXQgdG1wTWFueWZlc3RTY2hlbWEgPSAoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRTY29wZTogJ1NvbHZlciBEYXRhIFBhcnQgRGVzY3JpcHRpb25zJyxcblx0XHRcdFx0XHREZXNjcmlwdG9yczogdG1wRGVzY3JpcHRpb25NYW55ZmVzdC5zY2hlbWFNYW5pcHVsYXRpb25zLm1lcmdlQWRkcmVzc01hcHBpbmdzKHRtcE9wZXJhdGlvbi5JbnB1dHMsIHRtcE9wZXJhdGlvbi5PdXRwdXRzKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0Ly8gQ2xvbmUgdGhlIHBhc3NlZC1pbiBtYW55ZmVzdCwgc28gbXV0YXRpb25zIGRvIG5vdCBhbHRlciB0aGUgdXBzdHJlYW0gdmVyc2lvblxuXHRcdFx0dG1wRGVzY3JpcHRpb25NYW55ZmVzdCA9IHBEZXNjcmlwdGlvbk1hbnlmZXN0LmNsb25lKCk7XG5cdFx0fVxuXHRcdGlmICh0bXBTb2x1dGlvbkNvbnRleHQuSW5wdXRIYXNoTWFwcGluZylcblx0XHR7XG5cdFx0XHR0bXBEZXNjcmlwdGlvbk1hbnlmZXN0Lmhhc2hUcmFuc2xhdGlvbnMuYWRkVHJhbnNsYXRpb24odG1wU29sdXRpb25Db250ZXh0LklucHV0SGFzaE1hcHBpbmcpO1xuXHRcdH1cblx0XHRpZiAodG1wU29sdXRpb25Db250ZXh0Lk91dHB1dEhhc2hNYXBwaW5nKVxuXHRcdHtcblx0XHRcdHRtcERlc2NyaXB0aW9uTWFueWZlc3QuaGFzaFRyYW5zbGF0aW9ucy5hZGRUcmFuc2xhdGlvbih0bXBTb2x1dGlvbkNvbnRleHQuT3V0cHV0SGFzaE1hcHBpbmcpO1x0XHRcdFxuXHRcdH1cblxuXG5cdFx0Ly8gU2V0IHNvbWUga2luZCBvZiB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIG9wZXJhdGlvblxuXHRcdHRtcE9wZXJhdGlvbi5VVUlEID0gdGhpcy5VVUlEKys7XG5cdFx0dG1wT3BlcmF0aW9uLlNvbHV0aW9uQ29udGV4dCA9IHRtcFNvbHV0aW9uQ29udGV4dDtcblxuXHRcdGlmICh0bXBPcGVyYXRpb24uRGVzY3JpcHRpb24uU3lub3BzeXMpXG5cdFx0e1xuXHRcdFx0dG1wU29sdXRpb25Db250ZXh0LlNvbHV0aW9uTG9nLnB1c2goYFske3RtcE9wZXJhdGlvbi5VVUlEfV06IFNvbHZlciBydW5uaW5nIG9wZXJhdGlvbiAke3RtcE9wZXJhdGlvbi5EZXNjcmlwdGlvbi5TeW5vcHN5c31gKTtcblx0XHR9XG5cblx0XHRsZXQgdG1wUHJlY2VkZW50ID0gbmV3IGxpYlByZWNlZGVudCgpO1xuXHRcdHRtcFByZWNlZGVudC5hZGRQYXR0ZXJuKCd7e05hbWU6JywgJ319Jyxcblx0XHRcdChwSGFzaCk9PlxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgdG1wSGFzaCA9IHBIYXNoLnRyaW0oKTtcblx0XHRcdFx0bGV0IHRtcERlc2NyaXB0b3IgPSB0bXBEZXNjcmlwdGlvbk1hbnlmZXN0LmdldERlc2NyaXB0b3JCeUhhc2godG1wSGFzaClcblxuXHRcdFx0XHQvLyBSZXR1cm4gYSBodW1hbiByZWFkYWJsZSB2YWx1ZVxuXHRcdFx0XHRpZiAoKHR5cGVvZih0bXBEZXNjcmlwdG9yKSA9PSAnb2JqZWN0JykgICYmIHRtcERlc2NyaXB0b3IuaGFzT3duUHJvcGVydHkoJ05hbWUnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiB0bXBEZXNjcmlwdG9yLk5hbWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHRtcEhhc2g7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdHRtcFByZWNlZGVudC5hZGRQYXR0ZXJuKCd7e0lucHV0VmFsdWU6JywgJ319Jyxcblx0XHRcdChwSGFzaCk9PlxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgdG1wSGFzaCA9IHBIYXNoLnRyaW0oKTtcblx0XHRcdFx0cmV0dXJuIHRtcERlc2NyaXB0aW9uTWFueWZlc3QuZ2V0VmFsdWVCeUhhc2godG1wSW5wdXRPYmplY3QsdG1wSGFzaCk7XG5cdFx0XHR9KTtcblx0XHR0bXBQcmVjZWRlbnQuYWRkUGF0dGVybigne3tPdXRwdXRWYWx1ZTonLCAnfX0nLFxuXHRcdFx0KHBIYXNoKT0+XG5cdFx0XHR7XG5cdFx0XHRcdGxldCB0bXBIYXNoID0gcEhhc2gudHJpbSgpO1xuXHRcdFx0XHRyZXR1cm4gdG1wRGVzY3JpcHRpb25NYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaCh0bXBPdXRwdXRPYmplY3QsdG1wSGFzaCk7XG5cdFx0XHR9KTtcblxuXHRcdGlmICh0bXBPcGVyYXRpb24uaGFzT3duUHJvcGVydHkoJ0xvZycpICYmIHRtcE9wZXJhdGlvbi5Mb2cuaGFzT3duUHJvcGVydHkoJ1ByZU9wZXJhdGlvbicpKVxuXHRcdHtcblx0XHRcdGlmICh0eXBlb2YodG1wT3BlcmF0aW9uLkxvZy5QcmVPcGVyYXRpb24pID09ICdzdHJpbmcnKVxuXHRcdFx0e1xuXHRcdFx0XHR0bXBPcGVyYXRpb24uU29sdXRpb25Db250ZXh0LlNvbHV0aW9uTG9nLnB1c2godG1wUHJlY2VkZW50LnBhcnNlU3RyaW5nKHRtcE9wZXJhdGlvbi5Mb2cuUHJlT3BlcmF0aW9uKSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChBcnJheS5pc0FycmF5KHRtcE9wZXJhdGlvbi5Mb2cuUHJlT3BlcmF0aW9uKSlcblx0XHRcdHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0bXBPcGVyYXRpb24uTG9nLlByZU9wZXJhdGlvbi5sZW5ndGg7IGkrKylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICgodHlwZW9mKHRtcE9wZXJhdGlvbi5Mb2cuUHJlT3BlcmF0aW9uW2ldKSA9PSAnc3RyaW5nJykpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dG1wT3BlcmF0aW9uLlNvbHV0aW9uQ29udGV4dC5Tb2x1dGlvbkxvZy5wdXNoKHRtcFByZWNlZGVudC5wYXJzZVN0cmluZyh0bXBPcGVyYXRpb24uTG9nLlByZU9wZXJhdGlvbltpXSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIE5vdyBzdGVwIHRocm91Z2ggZWFjaCBvcGVyYXRpb24gYW5kIHNvbHZlXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0bXBPcGVyYXRpb24uU3RlcHMubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0bGV0IHRtcFN0ZXAgPSB0bXBPcGVyYXRpb24uU3RlcHNbaV07XG5cblx0XHRcdC8vIEluc3RydWN0aW9ucyBhcmUgYWx3YXlzIGVuZHBvaW50cyAtLSB0aGV5ICpkbyBub3QqIHJlY3Vyc2UuXG5cdFx0XHRpZiAodG1wU3RlcC5oYXNPd25Qcm9wZXJ0eSgnSW5zdHJ1Y3Rpb24nKSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IHRtcElucHV0U2NoZW1hID0gKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFwiU2NvcGVcIjogXCJJbnB1dE9iamVjdFwiLFxuXHRcdFx0XHRcdFx0XCJEZXNjcmlwdG9yc1wiOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRtcE9wZXJhdGlvbi5JbnB1dHMpKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHQvLyBQZXJmb3JtIHN0ZXAtc3BlY2lmaWMgYWRkcmVzcyBtYXBwaW5ncy5cblx0XHRcdFx0dG1wRGVzY3JpcHRpb25NYW55ZmVzdC5zY2hlbWFNYW5pcHVsYXRpb25zLnJlc29sdmVBZGRyZXNzTWFwcGluZ3ModG1wSW5wdXRTY2hlbWEuRGVzY3JpcHRvcnMsIHRtcFN0ZXAuSW5wdXRIYXNoQWRkcmVzc01hcCk7XG5cdFx0XHRcdGxldCB0bXBJbnB1dE1hbnlmZXN0ID0gbmV3IGxpYk1hbnlmZXN0KHRtcElucHV0U2NoZW1hKTtcblx0XHRcdFx0dG1wSW5wdXRNYW55ZmVzdC5oYXNoVHJhbnNsYXRpb25zLmFkZFRyYW5zbGF0aW9uKHRtcFNvbHV0aW9uQ29udGV4dC5JbnB1dEhhc2hNYXBwaW5nKTtcblxuXHRcdFx0XHRsZXQgdG1wT3V0cHV0U2NoZW1hID0gKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFwiU2NvcGVcIjogXCJPdXRwdXRPYmplY3RcIixcblx0XHRcdFx0XHRcdFwiRGVzY3JpcHRvcnNcIjogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0bXBPcGVyYXRpb24uT3V0cHV0cykpXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dG1wRGVzY3JpcHRpb25NYW55ZmVzdC5zY2hlbWFNYW5pcHVsYXRpb25zLnJlc29sdmVBZGRyZXNzTWFwcGluZ3ModG1wT3V0cHV0U2NoZW1hLkRlc2NyaXB0b3JzLCB0bXBTdGVwLk91dHB1dEhhc2hBZGRyZXNzTWFwKTtcblx0XHRcdFx0bGV0IHRtcE91dHB1dE1hbnlmZXN0ID0gbmV3IGxpYk1hbnlmZXN0KHRtcE91dHB1dFNjaGVtYSk7XG5cdFx0XHRcdHRtcE91dHB1dE1hbnlmZXN0Lmhhc2hUcmFuc2xhdGlvbnMuYWRkVHJhbnNsYXRpb24odG1wU29sdXRpb25Db250ZXh0Lk91dHB1dEhhc2hNYXBwaW5nKTtcblx0XG5cdFx0XHRcdC8vIENvbnN0cnVjdCB0aGUgaW5zdHJ1Y3Rpb24gc3RhdGUgb2JqZWN0XG5cdFx0XHRcdGxldCB0bXBJbnN0cnVjdGlvblN0YXRlID0gKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0RWx1Y2lkYXRvcjogdGhpcyxcblxuXHRcdFx0XHRcdE5hbWVzcGFjZTogdG1wU3RlcC5OYW1lc3BhY2UudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRJbnN0cnVjdGlvbjogdG1wU3RlcC5JbnN0cnVjdGlvbi50b0xvd2VyQ2FzZSgpLFxuXG5cdFx0XHRcdFx0T3BlcmF0aW9uOiB0bXBPcGVyYXRpb24sXG5cblx0XHRcdFx0XHRJbnB1dE9iamVjdDogdG1wSW5wdXRPYmplY3QsXG5cdFx0XHRcdFx0SW5wdXRNYW55ZmVzdDogdG1wSW5wdXRNYW55ZmVzdCxcblxuXHRcdFx0XHRcdE91dHB1dE9iamVjdDogdG1wT3V0cHV0T2JqZWN0LFxuXHRcdFx0XHRcdE91dHB1dE1hbnlmZXN0OiB0bXBPdXRwdXRNYW55ZmVzdFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZiAodGhpcy5pbnN0cnVjdGlvblNldHNbdG1wSW5zdHJ1Y3Rpb25TdGF0ZS5OYW1lc3BhY2VdLmhhc093blByb3BlcnR5KHRtcEluc3RydWN0aW9uU3RhdGUuSW5zdHJ1Y3Rpb24pKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bGV0IGZJbnN0cnVjdGlvbiA9IHRoaXMuaW5zdHJ1Y3Rpb25TZXRzW3RtcEluc3RydWN0aW9uU3RhdGUuTmFtZXNwYWNlXVt0bXBJbnN0cnVjdGlvblN0YXRlLkluc3RydWN0aW9uXTtcblx0XHRcdFx0XHRmSW5zdHJ1Y3Rpb24odG1wSW5zdHJ1Y3Rpb25TdGF0ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gT3BlcmF0aW9ucyByZWN1cnNlLlxuXHRcdFx0aWYgKHRtcFN0ZXAuaGFzT3duUHJvcGVydHkoJ09wZXJhdGlvbicpKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAodHlwZW9mKHRtcFN0ZXAuT3BlcmF0aW9uKSA9PSAnc3RyaW5nJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRoaXMuc29sdmVJbnRlcm5hbE9wZXJhdGlvbih0bXBTdGVwLk5hbWVzcGFjZSwgdG1wU3RlcC5PcGVyYXRpb24sIHRtcElucHV0T2JqZWN0LCB0bXBPdXRwdXRPYmplY3QsIHRtcERlc2NyaXB0aW9uTWFueWZlc3QsIHRtcFN0ZXAuSW5wdXRIYXNoQWRkcmVzc01hcCwgdG1wU3RlcC5PdXRwdXRIYXNoQWRkcmVzc01hcCwgdG1wU29sdXRpb25Db250ZXh0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YodG1wU3RlcC5PcGVyYXRpb24pID09ICdvYmplY3QnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gWW91IGNhbiBldmVuIGRlZmluZSBhbiBpbmxpbmUgb2JqZWN0IG9wZXJhdGlvbiEgIFRoaXMgZ2V0cyBjcmF6eSBmYXN0XG5cdFx0XHRcdFx0dGhpcy5zb2x2ZU9wZXJhdGlvbih0bXBTdGVwLk9wZXJhdGlvbiwgdG1wSW5wdXRPYmplY3QsIHRtcE91dHB1dE9iamVjdCwgdG1wRGVzY3JpcHRpb25NYW55ZmVzdCwgdG1wU3RlcC5JbnB1dEhhc2hBZGRyZXNzTWFwLCB0bXBTdGVwLk91dHB1dEhhc2hBZGRyZXNzTWFwLCB0bXBTb2x1dGlvbkNvbnRleHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRtcE9wZXJhdGlvbi5oYXNPd25Qcm9wZXJ0eSgnTG9nJykgJiYgdG1wT3BlcmF0aW9uLkxvZy5oYXNPd25Qcm9wZXJ0eSgnUG9zdE9wZXJhdGlvbicpKVxuXHRcdHtcblx0XHRcdGlmICh0eXBlb2YodG1wT3BlcmF0aW9uLkxvZy5Qb3N0T3BlcmF0aW9uKSA9PSAnc3RyaW5nJylcblx0XHRcdHtcblx0XHRcdFx0dG1wT3BlcmF0aW9uLlNvbHV0aW9uQ29udGV4dC5Tb2x1dGlvbkxvZy5wdXNoKHRtcFByZWNlZGVudC5wYXJzZVN0cmluZyh0bXBPcGVyYXRpb24uTG9nLlBvc3RPcGVyYXRpb24pKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodG1wT3BlcmF0aW9uLkxvZy5QcmVPcGVyYXRpb24pKVxuXHRcdFx0e1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRtcE9wZXJhdGlvbi5Mb2cuUG9zdE9wZXJhdGlvbi5sZW5ndGg7IGkrKylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICgodHlwZW9mKHRtcE9wZXJhdGlvbi5Mb2cuUG9zdE9wZXJhdGlvbltpXSkgPT0gJ3N0cmluZycpKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRtcE9wZXJhdGlvbi5Tb2x1dGlvbkNvbnRleHQuU29sdXRpb25Mb2cucHVzaCh0bXBQcmVjZWRlbnQucGFyc2VTdHJpbmcodG1wT3BlcmF0aW9uLkxvZy5Qb3N0T3BlcmF0aW9uW2ldKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRtcFNvbHV0aW9uQ29udGV4dDtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbHVjaWRhdG9yOyIsIi8vIFNvbHV0aW9uIHByb3ZpZGVycyBhcmUgbWVhbnQgdG8gYmUgc3RhdGVsZXNzLCBhbmQgbm90IGNsYXNzZXMuXG4vLyBUaGVzZSBzb2x1dGlvbiBwcm92aWRlcnMgYXJlIGFraW4gdG8gZHJpdmVycywgY29ubmVjdGluZyBjb2RlIGxpYnJhcmllcyBvciBcbi8vIG90aGVyIHR5cGVzIG9mIGJlaGF2aW9yIHRvIG1hcHBpbmcgb3BlcmF0aW9ucy5cblxubGV0IGxpYkVsdWNpZGF0b3JJbnN0cnVjdGlvblNldCA9IHJlcXVpcmUoJy4uL0VsdWNpZGF0b3ItSW5zdHJ1Y3Rpb25TZXQuanMnKTtcblxuY2xhc3MgR2VvbWV0cnkgZXh0ZW5kcyBsaWJFbHVjaWRhdG9ySW5zdHJ1Y3Rpb25TZXRcbntcbiAgICBjb25zdHJ1Y3RvcihwRWx1Y2lkYXRvcilcbiAgICB7XG4gICAgICAgIHN1cGVyKHBFbHVjaWRhdG9yKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2UgPSAnR2VvbWV0cnknO1xuICAgIH1cblxuICAgIC8vIEdlb21ldHJ5IHByb3ZpZGVzIG5vIGluc3RydWN0aW9uc1xuICAgIGluaXRpYWxpemVJbnN0cnVjdGlvbnMoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZU9wZXJhdGlvbnMoKVxuICAgIHtcbiAgICAgICAgdGhpcy5hZGRPcGVyYXRpb24oJ3JlY3RhbmdsZWFyZWEnLCByZXF1aXJlKGAuL09wZXJhdGlvbnMvR2VvbWV0cnktUmVjdGFuZ2xlQXJlYS5qc29uYCkpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeTsiLCIvLyBTb2x1dGlvbiBwcm92aWRlcnMgYXJlIG1lYW50IHRvIGJlIHN0YXRlbGVzcywgYW5kIG5vdCBjbGFzc2VzLlxuLy8gVGhlc2Ugc29sdXRpb24gcHJvdmlkZXJzIGFyZSBha2luIHRvIGRyaXZlcnMsIGNvbm5lY3RpbmcgY29kZSBsaWJyYXJpZXMgb3IgXG4vLyBvdGhlciB0eXBlcyBvZiBiZWhhdmlvciB0byBtYXBwaW5nIG9wZXJhdGlvbnMuXG5cbmxldCBsaWJFbHVjaWRhdG9ySW5zdHJ1Y3Rpb25TZXQgPSByZXF1aXJlKCcuLi9FbHVjaWRhdG9yLUluc3RydWN0aW9uU2V0LmpzJyk7XG5cbmxldCBhZGQgPSAocE9wZXJhdGlvbikgPT5cbntcbiAgICAvLyBUaGlzIGNvdWxkIGJlIGRvbmUgaW4gb25lIGxpbmUsIGJ1dCwgd291bGQgYmUgbW9yZSBkaWZmaWN1bHQgdG8gY29tcHJlaGVuZC5cbiAgICBsZXQgdG1wQSA9IHBPcGVyYXRpb24uSW5wdXRNYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLklucHV0T2JqZWN0LCAnYScpO1xuICAgIGxldCB0bXBCID0gcE9wZXJhdGlvbi5JbnB1dE1hbnlmZXN0LmdldFZhbHVlQnlIYXNoKHBPcGVyYXRpb24uSW5wdXRPYmplY3QsICdiJyk7XG4gICAgcE9wZXJhdGlvbi5PdXRwdXRNYW55ZmVzdC5zZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLk91dHB1dE9iamVjdCwgJ3gnLCB0bXBBICsgdG1wQik7XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5sZXQgc3VidHJhY3QgPSAocE9wZXJhdGlvbikgPT5cbntcbiAgICAvLyBUaGlzIGNvdWxkIGJlIGRvbmUgaW4gb25lIGxpbmUsIGJ1dCwgd291bGQgYmUgbW9yZSBkaWZmaWN1bHQgdG8gY29tcHJlaGVuZC5cbiAgICBsZXQgdG1wQSA9IHBPcGVyYXRpb24uSW5wdXRNYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLklucHV0T2JqZWN0LCAnYScpO1xuICAgIGxldCB0bXBCID0gcE9wZXJhdGlvbi5JbnB1dE1hbnlmZXN0LmdldFZhbHVlQnlIYXNoKHBPcGVyYXRpb24uSW5wdXRPYmplY3QsICdiJyk7XG4gICAgcE9wZXJhdGlvbi5PdXRwdXRNYW55ZmVzdC5zZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLk91dHB1dE9iamVjdCwgJ3gnLCB0bXBBIC0gdG1wQik7XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5sZXQgbXVsdGlwbHkgPSAocE9wZXJhdGlvbikgPT5cbntcbiAgICAvLyBUaGlzIGNvdWxkIGJlIGRvbmUgaW4gb25lIGxpbmUsIGJ1dCwgd291bGQgYmUgbW9yZSBkaWZmaWN1bHQgdG8gY29tcHJlaGVuZC5cbiAgICBsZXQgdG1wQSA9IHBPcGVyYXRpb24uSW5wdXRNYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLklucHV0T2JqZWN0LCAnYScpO1xuICAgIGxldCB0bXBCID0gcE9wZXJhdGlvbi5JbnB1dE1hbnlmZXN0LmdldFZhbHVlQnlIYXNoKHBPcGVyYXRpb24uSW5wdXRPYmplY3QsICdiJyk7XG4gICAgcE9wZXJhdGlvbi5PdXRwdXRNYW55ZmVzdC5zZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLk91dHB1dE9iamVjdCwgJ3gnLCB0bXBBICogdG1wQik7XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5sZXQgZGl2aWRlID0gKHBPcGVyYXRpb24pID0+XG57XG4gICAgLy8gVGhpcyBjb3VsZCBiZSBkb25lIGluIG9uZSBsaW5lLCBidXQsIHdvdWxkIGJlIG1vcmUgZGlmZmljdWx0IHRvIGNvbXByZWhlbmQuXG4gICAgbGV0IHRtcEEgPSBwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2EnKTtcbiAgICBsZXQgdG1wQiA9IHBPcGVyYXRpb24uSW5wdXRNYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLklucHV0T2JqZWN0LCAnYicpO1xuICAgIHBPcGVyYXRpb24uT3V0cHV0TWFueWZlc3Quc2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5PdXRwdXRPYmplY3QsICd4JywgdG1wQSAvIHRtcEIpO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxuY2xhc3MgTWF0aEphdmFzY3JpcHQgZXh0ZW5kcyBsaWJFbHVjaWRhdG9ySW5zdHJ1Y3Rpb25TZXRcbntcbiAgICBjb25zdHJ1Y3RvcihwRWx1Y2lkYXRvcilcbiAgICB7XG4gICAgICAgIHN1cGVyKHBFbHVjaWRhdG9yKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2UgPSAnTWF0aCc7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZUluc3RydWN0aW9ucygpXG4gICAge1xuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9uKCdhZGQnLCBhZGQpO1xuXG4gICAgICAgIHRoaXMuYWRkSW5zdHJ1Y3Rpb24oJ3N1YnRyYWN0Jywgc3VidHJhY3QpO1xuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9uKCdzdWInLCBzdWJ0cmFjdCk7XG5cbiAgICAgICAgdGhpcy5hZGRJbnN0cnVjdGlvbignbXVsdGlwbHknLCBtdWx0aXBseSk7XG4gICAgICAgIHRoaXMuYWRkSW5zdHJ1Y3Rpb24oJ211bCcsIG11bHRpcGx5KTtcblxuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9uKCdkaXZpZGUnLCBkaXZpZGUpO1xuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9uKCdkaXYnLCBkaXZpZGUpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVPcGVyYXRpb25zKClcbiAgICB7XG4gICAgICAgIHRoaXMuYWRkT3BlcmF0aW9uKCdhZGQnLCByZXF1aXJlKGAuL09wZXJhdGlvbnMvTWF0aC1BZGQuanNvbmApKTtcbiAgICAgICAgdGhpcy5hZGRPcGVyYXRpb24oJ3N1YnRyYWN0JywgcmVxdWlyZShgLi9PcGVyYXRpb25zL01hdGgtU3VidHJhY3QuanNvbmApKTtcbiAgICAgICAgdGhpcy5hZGRPcGVyYXRpb24oJ211bHRpcGx5JywgcmVxdWlyZShgLi9PcGVyYXRpb25zL01hdGgtTXVsdGlwbHkuanNvbmApKTtcbiAgICAgICAgdGhpcy5hZGRPcGVyYXRpb24oJ2RpdmlkZScsIHJlcXVpcmUoYC4vT3BlcmF0aW9ucy9NYXRoLURpdmlkZS5qc29uYCkpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXRoSmF2YXNjcmlwdDsiLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwiRGVzY3JpcHRpb25cIjpcblx0e1xuXHRcdFwiTmFtZXNwYWNlXCI6IFwiR2VvbWV0cnlcIixcblx0XHRcIk9wZXJhdGlvblwiOiBcIlJlY3RhbmdsZUFyZWFcIixcblx0XHRcIlN5bm9wc2lzXCI6IFwiU29sdmUgZm9yIHRoZSBhcmVhIG9mIGEgcmVjdGFuZ2xlOiAgQXJlYSA9IFdpZHRoICogSGVpZ2h0XCJcblx0fSxcblxuXHRcIklucHV0c1wiOiBcblx0e1xuXHRcdFwiV2lkdGhcIjogeyBcIkhhc2hcIjpcIldpZHRoXCIsIFwiVHlwZVwiOlwiTnVtYmVyXCIgfSxcblx0XHRcIkhlaWdodFwiOiB7IFwiSGFzaFwiOlwiSGVpZ2h0XCIsIFwiVHlwZVwiOlwiTnVtYmVyXCIgfVxuXHR9LFxuXG5cdFwiT3V0cHV0c1wiOlxuXHR7XG5cdFx0XCJBcmVhXCI6IHsgXCJIYXNoXCI6XCJBcmVhXCIsIFwiTmFtZVwiOiBcIkFyZWEgb2YgdGhlIFJlY3RhbmdsZVwifSxcblx0XHRcIlJhdGlvXCI6IHsgXCJIYXNoXCI6XCJSYXRpb1wiLCBcIk5hbWVcIjogXCJUaGUgUmF0aW8gYmV0d2VlbiB0aGUgV2lkdGggYW5kIHRoZSBIZWlnaHRcIiB9XG5cdH0sXG5cdFxuXHRcIkxvZ1wiOlxuXHR7XG5cdFx0XCJQcmVPcGVyYXRpb25cIjogXCJTb2x2ZSBmb3IgWyB7e05hbWU6QXJlYX19IF0gYmFzZWQgb24gWyB7e05hbWU6V2lkdGh9fSBdIGFuZCBbIHt7TmFtZTpIZWlnaHR9fSBdLlwiLFxuXHRcdFwiUG9zdE9wZXJhdGlvblwiOiBcIk9wZXJhdGlvbiBjb21wbGV0ZTsgWyB7e05hbWU6QXJlYX19IF0gPSB7e0lucHV0VmFsdWU6V2lkdGh9fSAqIHt7SW5wdXRWYWx1ZTpIZWlnaHR9fSA9IHt7T3V0cHV0VmFsdWU6QXJlYX19XCJcblx0fSxcblxuXHRcIlN0ZXBzXCI6XG5cdFtcblx0XHR7XG5cdFx0XHRcIk5hbWVzcGFjZVwiOiBcIk1hdGhcIixcblx0XHRcdFwiSW5zdHJ1Y3Rpb25cIjogXCJtdWx0aXBseVwiLFxuXHRcdFx0XCJJbnB1dEhhc2hBZGRyZXNzTWFwXCI6IFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJhXCI6IFwiV2lkdGhcIixcblx0XHRcdFx0XHRcImJcIjogXCJIZWlnaHRcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XCJPdXRwdXRIYXNoQWRkcmVzc01hcFwiOlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ4XCI6IFwiQXJlYVwiXG5cdFx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdFwiTmFtZXNwYWNlXCI6IFwiTWF0aFwiLFxuXHRcdFx0XCJJbnN0cnVjdGlvblwiOiBcImRpdmlkZVwiLFxuXHRcdFx0XCJJbnB1dEhhc2hBZGRyZXNzTWFwXCI6IFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJhXCI6IFwiV2lkdGhcIixcblx0XHRcdFx0XHRcImJcIjogXCJIZWlnaHRcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XCJPdXRwdXRIYXNoQWRkcmVzc01hcFwiOlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ4XCI6IFwiUmF0aW9cIlxuXHRcdFx0XHR9XG5cdFx0fVxuXHRdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcIkRlc2NyaXB0aW9uXCI6XG5cdHtcblx0XHRcIk5hbWVzcGFjZVwiOiBcIk1hdGhcIixcblx0XHRcIk9wZXJhdGlvblwiOiBcIkFkZFwiLFxuXHRcdFwiU3lub3BzaXNcIjogXCJBZGQgdHdvIG51bWJlcnM6ICB4ID0gYSArIGJcIlxuXHR9LFxuXG5cdFwiSW5wdXRzXCI6IFxuXHR7XG5cdFx0XCJhXCI6IHsgXCJIYXNoXCI6IFwiYVwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9LFxuXHRcdFwiYlwiOiB7IFwiSGFzaFwiOiBcImJcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHR9LFxuXG5cdFwiT3V0cHV0c1wiOlxuXHR7XG5cdFx0XCJ4XCI6IHsgXCJIYXNoXCI6IFwieFwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9XG5cdH0sXG5cdFxuXHRcIkxvZ1wiOlxuXHR7XG5cdFx0XCJQcmVPcGVyYXRpb25cIjogXCJBZGQge3tOYW1lOmF9fSBhbmQge3tOYW1lOmJ9fSwgc3RvcmluZyB0aGUgdmFsdWUgaW4ge3tOYW1lOnh9fS5cIixcblx0XHRcIlBvc3RPcGVyYXRpb25cIjogXCJPcGVyYXRpb24gY29tcGxldGU6IHt7TmFtZTp4fX0gPSB7e0lucHV0VmFsdWU6YX19ICsge3tJbnB1dFZhbHVlOmJ9fSA9IHt7T3V0cHV0VmFsdWU6eH19XCJcdFx0XG5cdH0sXG5cblx0XCJTdGVwc1wiOlxuXHRbXG5cdFx0e1xuXHRcdFx0XCJOYW1lc3BhY2VcIjogXCJNYXRoXCIsXG5cdFx0XHRcIkluc3RydWN0aW9uXCI6IFwiYWRkXCJcblx0XHR9XG5cdF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwiRGVzY3JpcHRpb25cIjpcblx0e1xuXHRcdFwiTmFtZXNwYWNlXCI6IFwiTWF0aFwiLFxuXHRcdFwiT3BlcmF0aW9uXCI6IFwiRGl2aWRlXCIsXG5cdFx0XCJTeW5vcHNpc1wiOiBcIkRpdmlkZSB0d28gbnVtYmVyczogIHggPSBhIC8gYlwiXG5cdH0sXG5cblx0XCJJbnB1dHNcIjogXG5cdHtcblx0XHRcImFcIjogeyBcIkhhc2hcIjogXCJhXCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH0sXG5cdFx0XCJiXCI6IHsgXCJIYXNoXCI6IFwiYlwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9XG5cdH0sXG5cblx0XCJPdXRwdXRzXCI6XG5cdHtcblx0XHRcInhcIjogeyBcIkhhc2hcIjogXCJ4XCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH1cblx0fSxcblx0XG5cdFwiTG9nXCI6XG5cdHtcblx0XHRcIlByZU9wZXJhdGlvblwiOiBcIkRpdmlkZSB7e05hbWU6YX19IG92ZXIge3tOYW1lOmJ9fSwgc3RvcmluZyB0aGUgdmFsdWUgaW4ge3tOYW1lOnh9fS5cIixcblx0XHRcIlBvc3RPcGVyYXRpb25cIjogXCJPcGVyYXRpb24gY29tcGxldGU6IHt7TmFtZTp4fX0gPSB7e0lucHV0VmFsdWU6YX19IC8ge3tJbnB1dFZhbHVlOmJ9fSA9IHt7T3V0cHV0VmFsdWU6eH19XCJcdFx0XG5cdH0sXG5cblx0XCJTdGVwc1wiOlxuXHRbXG5cdFx0e1xuXHRcdFx0XCJOYW1lc3BhY2VcIjogXCJNYXRoXCIsXG5cdFx0XHRcIkluc3RydWN0aW9uXCI6IFwiZGl2aWRlXCJcblx0XHR9XG5cdF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwiRGVzY3JpcHRpb25cIjpcblx0e1xuXHRcdFwiTmFtZXNwYWNlXCI6IFwiTWF0aFwiLFxuXHRcdFwiT3BlcmF0aW9uXCI6IFwiTXVsdGlwbHlcIixcblx0XHRcIlN5bm9wc2lzXCI6IFwiTXVsdGlwbHkgdHdvIG51bWJlcnM6ICB4ID0gYSAqIGJcIlxuXHR9LFxuXG5cdFwiSW5wdXRzXCI6IFxuXHR7XG5cdFx0XCJhXCI6IHsgXCJIYXNoXCI6IFwiYVwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9LFxuXHRcdFwiYlwiOiB7IFwiSGFzaFwiOiBcImJcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHR9LFxuXG5cdFwiT3V0cHV0c1wiOlxuXHR7XG5cdFx0XCJ4XCI6IHsgXCJIYXNoXCI6IFwieFwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9XG5cdH0sXG5cdFxuXHRcIkxvZ1wiOlxuXHR7XG5cdFx0XCJQcmVPcGVyYXRpb25cIjogXCJNdWx0aXBseSB7e05hbWU6YX19IGFuZCB7e05hbWU6Yn19LCBzdG9yaW5nIHRoZSB2YWx1ZSBpbiB7e05hbWU6eH19LlwiLFxuXHRcdFwiUG9zdE9wZXJhdGlvblwiOiBcIk9wZXJhdGlvbiBjb21wbGV0ZToge3tOYW1lOnh9fSA9IHt7SW5wdXRWYWx1ZTphfX0gKiB7e0lucHV0VmFsdWU6Yn19ID0ge3tPdXRwdXRWYWx1ZTp4fX1cIlx0XHRcblx0fSxcblxuXHRcIlN0ZXBzXCI6XG5cdFtcblx0XHR7XG5cdFx0XHRcIk5hbWVzcGFjZVwiOiBcIk1hdGhcIixcblx0XHRcdFwiSW5zdHJ1Y3Rpb25cIjogXCJtdWx0aXBseVwiXG5cdFx0fVxuXHRdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcIkRlc2NyaXB0aW9uXCI6XG5cdHtcblx0XHRcIk5hbWVzcGFjZVwiOiBcIk1hdGhcIixcblx0XHRcIk9wZXJhdGlvblwiOiBcIlN1YnRyYWN0XCIsXG5cdFx0XCJTeW5vcHNpc1wiOiBcIlN1YnRyYWN0IHR3byBudW1iZXJzOiAgeCA9IGEgLSBiXCJcblx0fSxcblxuXHRcIklucHV0c1wiOiBcblx0e1xuXHRcdFwiYVwiOiB7IFwiSGFzaFwiOiBcImFcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfSxcblx0XHRcImJcIjogeyBcIkhhc2hcIjogXCJiXCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH1cblx0fSxcblxuXHRcIk91dHB1dHNcIjpcblx0e1xuXHRcdFwieFwiOiB7IFwiSGFzaFwiOiBcInhcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHR9LFxuXHRcblx0XCJMb2dcIjpcblx0e1xuXHRcdFwiUHJlT3BlcmF0aW9uXCI6IFwiU3VidHJhY3Qge3tOYW1lOmF9fSBhbmQge3tOYW1lOmJ9fSwgc3RvcmluZyB0aGUgdmFsdWUgaW4ge3tOYW1lOnh9fS5cIixcblx0XHRcIlBvc3RPcGVyYXRpb25cIjogXCJPcGVyYXRpb24gY29tcGxldGU6IHt7TmFtZTp4fX0gPSB7e0lucHV0VmFsdWU6YX19IC0ge3tJbnB1dFZhbHVlOmJ9fSA9IHt7T3V0cHV0VmFsdWU6eH19XCJcdFx0XG5cdH0sXG5cblx0XCJTdGVwc1wiOlxuXHRbXG5cdFx0e1xuXHRcdFx0XCJOYW1lc3BhY2VcIjogXCJNYXRoXCIsXG5cdFx0XHRcIkluc3RydWN0aW9uXCI6IFwic3VidHJhY3RcIlxuXHRcdH1cblx0XVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJEZXNjcmlwdGlvblwiOlxuXHR7XG5cdFx0XCJOYW1lc3BhY2VcIjogXCJQcmVjaXNlTWF0aFwiLFxuXHRcdFwiT3BlcmF0aW9uXCI6IFwiQWRkXCIsXG5cdFx0XCJTeW5vcHNpc1wiOiBcIlByZWNpc2VseSBhZGQgdHdvIG51bWJlcnM6ICB4ID0gYSArIGJcIlxuXHR9LFxuXG5cdFwiSW5wdXRzXCI6IFxuXHR7XG5cdFx0XCJhXCI6IHsgXCJIYXNoXCI6IFwiYVwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9LFxuXHRcdFwiYlwiOiB7IFwiSGFzaFwiOiBcImJcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHR9LFxuXG5cdFwiT3V0cHV0c1wiOlxuXHR7XG5cdFx0XCJ4XCI6IHsgXCJIYXNoXCI6IFwieFwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9XG5cdH0sXG5cdFxuXHRcIkxvZ1wiOlxuXHR7XG5cdFx0XCJQcmVPcGVyYXRpb25cIjogXCJBZGQge3tOYW1lOmF9fSBhbmQge3tOYW1lOmJ9fSwgc3RvcmluZyB0aGUgdmFsdWUgaW4ge3tOYW1lOnh9fS5cIixcblx0XHRcIlBvc3RPcGVyYXRpb25cIjogXCJPcGVyYXRpb24gY29tcGxldGU6IHt7TmFtZTp4fX0gPSB7e0lucHV0VmFsdWU6YX19ICsge3tJbnB1dFZhbHVlOmJ9fSA9IHt7T3V0cHV0VmFsdWU6eH19XCJcdFx0XG5cdH0sXG5cblx0XCJTdGVwc1wiOlxuXHRbXG5cdFx0e1xuXHRcdFx0XCJOYW1lc3BhY2VcIjogXCJQcmVjaXNlTWF0aFwiLFxuXHRcdFx0XCJJbnN0cnVjdGlvblwiOiBcImFkZFwiXG5cdFx0fVxuXHRdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcIkRlc2NyaXB0aW9uXCI6XG5cdHtcblx0XHRcIk5hbWVzcGFjZVwiOiBcIlByZWNpc2VNYXRoXCIsXG5cdFx0XCJPcGVyYXRpb25cIjogXCJEaXZpZGVcIixcblx0XHRcIlN5bm9wc2lzXCI6IFwiUHJlY2lzZWx5IGRpdmlkZSB0d28gbnVtYmVyczogIHggPSBhIC8gYlwiXG5cdH0sXG5cblx0XCJJbnB1dHNcIjogXG5cdHtcblx0XHRcImFcIjogeyBcIkhhc2hcIjogXCJhXCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH0sXG5cdFx0XCJiXCI6IHsgXCJIYXNoXCI6IFwiYlwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9XG5cdH0sXG5cblx0XCJPdXRwdXRzXCI6XG5cdHtcblx0XHRcInhcIjogeyBcIkhhc2hcIjogXCJ4XCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH1cblx0fSxcblx0XG5cdFwiTG9nXCI6XG5cdHtcblx0XHRcIlByZU9wZXJhdGlvblwiOiBcIkRpdmlkZSB7e05hbWU6YX19IG92ZXIge3tOYW1lOmJ9fSwgc3RvcmluZyB0aGUgdmFsdWUgaW4ge3tOYW1lOnh9fS5cIixcblx0XHRcIlBvc3RPcGVyYXRpb25cIjogXCJPcGVyYXRpb24gY29tcGxldGU6IHt7TmFtZTp4fX0gPSB7e0lucHV0VmFsdWU6YX19IC8ge3tJbnB1dFZhbHVlOmJ9fSA9IHt7T3V0cHV0VmFsdWU6eH19XCJcdFx0XG5cdH0sXG5cblx0XCJTdGVwc1wiOlxuXHRbXG5cdFx0e1xuXHRcdFx0XCJOYW1lc3BhY2VcIjogXCJQcmVjaXNlTWF0aFwiLFxuXHRcdFx0XCJJbnN0cnVjdGlvblwiOiBcImRpdmlkZVwiXG5cdFx0fVxuXHRdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcIkRlc2NyaXB0aW9uXCI6XG5cdHtcblx0XHRcIk5hbWVzcGFjZVwiOiBcIlByZWNpc2VNYXRoXCIsXG5cdFx0XCJPcGVyYXRpb25cIjogXCJNdWx0aXBseVwiLFxuXHRcdFwiU3lub3BzaXNcIjogXCJQcmVjaXNlbHkgbXVsdGlwbHkgdHdvIG51bWJlcnM6ICB4ID0gYSAqIGJcIlxuXHR9LFxuXG5cdFwiSW5wdXRzXCI6IFxuXHR7XG5cdFx0XCJhXCI6IHsgXCJIYXNoXCI6IFwiYVwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9LFxuXHRcdFwiYlwiOiB7IFwiSGFzaFwiOiBcImJcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHR9LFxuXG5cdFwiT3V0cHV0c1wiOlxuXHR7XG5cdFx0XCJ4XCI6IHsgXCJIYXNoXCI6IFwieFwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9XG5cdH0sXG5cdFxuXHRcIkxvZ1wiOlxuXHR7XG5cdFx0XCJQcmVPcGVyYXRpb25cIjogXCJNdWx0aXBseSB7e05hbWU6YX19IGFuZCB7e05hbWU6Yn19LCBzdG9yaW5nIHRoZSB2YWx1ZSBpbiB7e05hbWU6eH19LlwiLFxuXHRcdFwiUG9zdE9wZXJhdGlvblwiOiBcIk9wZXJhdGlvbiBjb21wbGV0ZToge3tOYW1lOnh9fSA9IHt7SW5wdXRWYWx1ZTphfX0gKiB7e0lucHV0VmFsdWU6Yn19ID0ge3tPdXRwdXRWYWx1ZTp4fX1cIlx0XHRcblx0fSxcblxuXHRcIlN0ZXBzXCI6XG5cdFtcblx0XHR7XG5cdFx0XHRcIk5hbWVzcGFjZVwiOiBcIlByZWNpc2VNYXRoXCIsXG5cdFx0XHRcIkluc3RydWN0aW9uXCI6IFwibXVsdGlwbHlcIlxuXHRcdH1cblx0XVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJEZXNjcmlwdGlvblwiOlxuXHR7XG5cdFx0XCJOYW1lc3BhY2VcIjogXCJQcmVjaXNlTWF0aFwiLFxuXHRcdFwiT3BlcmF0aW9uXCI6IFwiU3VidHJhY3RcIixcblx0XHRcIlN5bm9wc2lzXCI6IFwiUHJlY2lzZWx5IHN1YnRyYWN0IHR3byBudW1iZXJzOiAgeCA9IGEgLSBiXCJcblx0fSxcblxuXHRcIklucHV0c1wiOiBcblx0e1xuXHRcdFwiYVwiOiB7IFwiSGFzaFwiOiBcImFcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfSxcblx0XHRcImJcIjogeyBcIkhhc2hcIjogXCJiXCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH1cblx0fSxcblxuXHRcIk91dHB1dHNcIjpcblx0e1xuXHRcdFwieFwiOiB7IFwiSGFzaFwiOiBcInhcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHR9LFxuXHRcblx0XCJMb2dcIjpcblx0e1xuXHRcdFwiUHJlT3BlcmF0aW9uXCI6IFwiU3VidHJhY3Qge3tOYW1lOmF9fSBhbmQge3tOYW1lOmJ9fSwgc3RvcmluZyB0aGUgdmFsdWUgaW4ge3tOYW1lOnh9fS5cIixcblx0XHRcIlBvc3RPcGVyYXRpb25cIjogXCJPcGVyYXRpb24gY29tcGxldGU6IHt7TmFtZTp4fX0gPSB7e0lucHV0VmFsdWU6YX19IC0ge3tJbnB1dFZhbHVlOmJ9fSA9IHt7T3V0cHV0VmFsdWU6eH19XCJcdFx0XG5cdH0sXG5cblx0XCJTdGVwc1wiOlxuXHRbXG5cdFx0e1xuXHRcdFx0XCJOYW1lc3BhY2VcIjogXCJQcmVjaXNlTWF0aFwiLFxuXHRcdFx0XCJJbnN0cnVjdGlvblwiOiBcInN1YnRyYWN0XCJcblx0XHR9XG5cdF1cbn0iLCJsZXQgbGliRWx1Y2lkYXRvckluc3RydWN0aW9uU2V0ID0gcmVxdWlyZSgnLi4vRWx1Y2lkYXRvci1JbnN0cnVjdGlvblNldC5qcycpO1xuXG5jb25zdCBsaWJEZWNpbWFsID0gcmVxdWlyZSgnZGVjaW1hbC5qcycpO1xuXG5sZXQgYWRkID0gKHBPcGVyYXRpb24pID0+XG57XG4gICAgLy8gVGhpcyBjb3VsZCBiZSBkb25lIGluIG9uZSBsaW5lLCBidXQsIHdvdWxkIGJlIG1vcmUgZGlmZmljdWx0IHRvIGNvbXByZWhlbmQuXG4gICAgbGV0IHRtcEEgPSBuZXcgbGliRGVjaW1hbChwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2EnKSk7XG4gICAgbGV0IHRtcEIgPSBuZXcgbGliRGVjaW1hbChwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2InKSk7XG4gICAgcE9wZXJhdGlvbi5PdXRwdXRNYW55ZmVzdC5zZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLk91dHB1dE9iamVjdCwgJ3gnLCB0bXBBLnBsdXModG1wQikpLnRvU3RyaW5nKCk7XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5sZXQgc3VidHJhY3QgPSAocE9wZXJhdGlvbikgPT5cbntcbiAgICAvLyBUaGlzIGNvdWxkIGJlIGRvbmUgaW4gb25lIGxpbmUsIGJ1dCwgd291bGQgYmUgbW9yZSBkaWZmaWN1bHQgdG8gY29tcHJlaGVuZC5cbiAgICBsZXQgdG1wQSA9IG5ldyBsaWJEZWNpbWFsKHBPcGVyYXRpb24uSW5wdXRNYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLklucHV0T2JqZWN0LCAnYScpKTtcbiAgICBsZXQgdG1wQiA9IG5ldyBsaWJEZWNpbWFsKHBPcGVyYXRpb24uSW5wdXRNYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLklucHV0T2JqZWN0LCAnYicpKTtcbiAgICBwT3BlcmF0aW9uLk91dHB1dE1hbnlmZXN0LnNldFZhbHVlQnlIYXNoKHBPcGVyYXRpb24uT3V0cHV0T2JqZWN0LCAneCcsIHRtcEEuc3ViKHRtcEIpKS50b1N0cmluZygpO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxubGV0IG11bHRpcGx5ID0gKHBPcGVyYXRpb24pID0+XG57XG4gICAgLy8gVGhpcyBjb3VsZCBiZSBkb25lIGluIG9uZSBsaW5lLCBidXQsIHdvdWxkIGJlIG1vcmUgZGlmZmljdWx0IHRvIGNvbXByZWhlbmQuXG4gICAgbGV0IHRtcEEgPSBuZXcgbGliRGVjaW1hbChwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2EnKSk7XG4gICAgbGV0IHRtcEIgPSBuZXcgbGliRGVjaW1hbChwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2InKSk7XG4gICAgcE9wZXJhdGlvbi5PdXRwdXRNYW55ZmVzdC5zZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLk91dHB1dE9iamVjdCwgJ3gnLCB0bXBBLm11bCh0bXBCKSkudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmxldCBkaXZpZGUgPSAocE9wZXJhdGlvbikgPT5cbntcbiAgICAvLyBUaGlzIGNvdWxkIGJlIGRvbmUgaW4gb25lIGxpbmUsIGJ1dCwgd291bGQgYmUgbW9yZSBkaWZmaWN1bHQgdG8gY29tcHJlaGVuZC5cbiAgICBsZXQgdG1wQSA9IG5ldyBsaWJEZWNpbWFsKHBPcGVyYXRpb24uSW5wdXRNYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLklucHV0T2JqZWN0LCAnYScpKTtcbiAgICBsZXQgdG1wQiA9IG5ldyBsaWJEZWNpbWFsKHBPcGVyYXRpb24uSW5wdXRNYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLklucHV0T2JqZWN0LCAnYicpKTtcbiAgICBwT3BlcmF0aW9uLk91dHB1dE1hbnlmZXN0LnNldFZhbHVlQnlIYXNoKHBPcGVyYXRpb24uT3V0cHV0T2JqZWN0LCAneCcsIHRtcEEuZGl2KHRtcEIpKS50b1N0cmluZygpO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxubGV0IHRvRnJhY3Rpb24gPSAocE9wZXJhdGlvbikgPT5cbntcbiAgICAvLyBUaGlzIGNvdWxkIGJlIGRvbmUgaW4gb25lIGxpbmUsIGJ1dCwgd291bGQgYmUgbW9yZSBkaWZmaWN1bHQgdG8gY29tcHJlaGVuZC5cbiAgICBsZXQgdG1wQSA9IG5ldyBsaWJEZWNpbWFsKHBPcGVyYXRpb24uSW5wdXRNYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLklucHV0T2JqZWN0LCAnYScpKTtcbiAgICBwT3BlcmF0aW9uLk91dHB1dE1hbnlmZXN0LnNldFZhbHVlQnlIYXNoKHBPcGVyYXRpb24uT3V0cHV0T2JqZWN0LCAneCcsIHRtcEEudG9GcmFjdGlvbigpLnRvU3RyaW5nKCkpO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxuXG5jbGFzcyBQcmVjaXNlTWF0aCBleHRlbmRzIGxpYkVsdWNpZGF0b3JJbnN0cnVjdGlvblNldFxue1xuICAgIGNvbnN0cnVjdG9yKHBFbHVjaWRhdG9yKVxuICAgIHtcbiAgICAgICAgc3VwZXIocEVsdWNpZGF0b3IpO1xuICAgICAgICB0aGlzLm5hbWVzcGFjZSA9ICdQcmVjaXNlTWF0aCc7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZUluc3RydWN0aW9ucygpXG4gICAge1xuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9uKCdhZGQnLCBhZGQpO1xuXG4gICAgICAgIHRoaXMuYWRkSW5zdHJ1Y3Rpb24oJ3N1YnRyYWN0Jywgc3VidHJhY3QpO1xuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9uKCdzdWInLCBzdWJ0cmFjdCk7XG5cbiAgICAgICAgdGhpcy5hZGRJbnN0cnVjdGlvbignbXVsdGlwbHknLCBtdWx0aXBseSk7XG4gICAgICAgIHRoaXMuYWRkSW5zdHJ1Y3Rpb24oJ211bCcsIG11bHRpcGx5KTtcblxuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9uKCdkaXZpZGUnLCBkaXZpZGUpO1xuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9uKCdkaXYnLCBkaXZpZGUpO1xuXG5cdFx0dGhpcy5hZGRJbnN0cnVjdGlvbigndG9mcmFjdGlvbicsIHRvRnJhY3Rpb24pO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVPcGVyYXRpb25zKClcbiAgICB7XG4gICAgICAgIHRoaXMuYWRkT3BlcmF0aW9uKCdhZGQnLCByZXF1aXJlKGAuL09wZXJhdGlvbnMvUHJlY2lzZU1hdGgtQWRkLmpzb25gKSk7XG4gICAgICAgIHRoaXMuYWRkT3BlcmF0aW9uKCdzdWJ0cmFjdCcsIHJlcXVpcmUoYC4vT3BlcmF0aW9ucy9QcmVjaXNlTWF0aC1TdWJ0cmFjdC5qc29uYCkpO1xuICAgICAgICB0aGlzLmFkZE9wZXJhdGlvbignbXVsdGlwbHknLCByZXF1aXJlKGAuL09wZXJhdGlvbnMvUHJlY2lzZU1hdGgtTXVsdGlwbHkuanNvbmApKTtcbiAgICAgICAgdGhpcy5hZGRPcGVyYXRpb24oJ2RpdmlkZScsIHJlcXVpcmUoYC4vT3BlcmF0aW9ucy9QcmVjaXNlTWF0aC1EaXZpZGUuanNvbmApKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJlY2lzZU1hdGg7Il19
