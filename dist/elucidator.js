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

	mergeAddressMappings(pManyfestSchemaDescriptorsDestination, pManyfestSchemaDescriptorsSource)
	{
		if ((typeof(pManyfestSchemaDescriptorsSource) != 'object') || (typeof(pManyfestSchemaDescriptorsDestination) != 'object'))
		{
			this.logError(`Attempted to merge two schema descriptors but both were not objects.`);
			return false;
		}

		let tmpSource = JSON.parse(JSON.stringify(pManyfestSchemaDescriptorsSource));
		let tmpNewManyfestSchemaDescriptors = JSON.parse(JSON.stringify(pManyfestSchemaDescriptorsDestination));

		// The first passed-in set of descriptors takes precedence.
		let tmpDescriptorAddresses = Object.keys(tmpSource);

		tmpDescriptorAddresses.forEach(
			(pDescriptorAddress) => 
			{
				if (!tmpNewManyfestSchemaDescriptors.hasOwnProperty(pDescriptorAddress))
				{
					tmpNewManyfestSchemaDescriptors[pDescriptorAddress] = tmpSource[pDescriptorAddress];
				}
			});
		
		return tmpNewManyfestSchemaDescriptors;
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

	clone()
	{
		// Make a copy of the options in-place
		let tmpNewOptions = JSON.parse(JSON.stringify(this.options));

		let tmpNewManyfest = new Manyfest(this.getManifest(), this.logInfo, this.logError, tmpNewOptions);

		// Import the hash translations
		tmpNewManyfest.hashTranslations.addTranslation(this.hashTranslations.translationTable);

		return tmpNewManyfest;
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
	// TODO: Should this also serialize the translation table?
	serialize()
	{
		return JSON.stringify(this.getManifest());
	}

	getManifest()
	{
		return (
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
    initializeNamespace(pNamespace)
    {
        if (typeof(pNamespace) == 'string')
        {
            this.namespace = pNamespace;
        }
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


        this.elucidator.operationSets[this.namespace.toLowerCase()][pOperationHash.toLowerCase()] = pOperation;
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

const libElucidatorInstructionSet = require('./Elucidator-InstructionSet.js');

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

	addOperation(pNamespace, pOperationHash, pOperation)
	{
        if (typeof(pNamespace) != 'string')
        {
            this.elucidator.logError(`Attempted to add an operation at runtime via Elucidator.addOperation with an invalid namespace; expected a string but the type was ${typeof(pNamespace)}`, pOperation);
            return false;
        }

		let tmpOperationInjector = new libElucidatorInstructionSet(this);
		tmpOperationInjector.initializeNamespace(pNamespace);

		return tmpOperationInjector.addOperation(pOperationHash, pOperation);
	}

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
},{"./Elucidator-InstructionSet.js":11,"./Elucidator-LogToConsole.js":12,"./InstructionSets/Geometry.js":14,"./InstructionSets/Math-Javascript.js":15,"./InstructionSets/PreciseMath-Decimal.js":25,"manyfest":6,"precedent":7}],14:[function(require,module,exports){
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
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.plus(tmpB).toString());
    return true;
};

let subtract = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
    let tmpB = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b'));
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.sub(tmpB).toString());
    return true;
};

let multiply = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
    let tmpB = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b'));
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.mul(tmpB).toString());
    return true;
};

let divide = (pOperation) =>
{
    // This could be done in one line, but, would be more difficult to comprehend.
    let tmpA = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'a'));
    let tmpB = new libDecimal(pOperation.InputManyfest.getValueByHash(pOperation.InputObject, 'b'));
    pOperation.OutputManyfest.setValueByHash(pOperation.OutputObject, 'x', tmpA.div(tmpB).toString());
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVjaW1hbC5qcy9kZWNpbWFsLmpzIiwibm9kZV9tb2R1bGVzL21hbnlmZXN0L3NvdXJjZS9NYW55ZmVzdC1IYXNoVHJhbnNsYXRpb24uanMiLCJub2RlX21vZHVsZXMvbWFueWZlc3Qvc291cmNlL01hbnlmZXN0LUxvZ1RvQ29uc29sZS5qcyIsIm5vZGVfbW9kdWxlcy9tYW55ZmVzdC9zb3VyY2UvTWFueWZlc3QtT2JqZWN0QWRkcmVzc1Jlc29sdmVyLmpzIiwibm9kZV9tb2R1bGVzL21hbnlmZXN0L3NvdXJjZS9NYW55ZmVzdC1TY2hlbWFNYW5pcHVsYXRpb24uanMiLCJub2RlX21vZHVsZXMvbWFueWZlc3Qvc291cmNlL01hbnlmZXN0LmpzIiwibm9kZV9tb2R1bGVzL3ByZWNlZGVudC9zb3VyY2UvUHJlY2VkZW50LmpzIiwibm9kZV9tb2R1bGVzL3ByZWNlZGVudC9zb3VyY2UvU3RyaW5nUGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL3ByZWNlZGVudC9zb3VyY2UvV29yZFRyZWUuanMiLCJzb3VyY2UvRWx1Y2lkYXRvci1Ccm93c2VyLVNoaW0uanMiLCJzb3VyY2UvRWx1Y2lkYXRvci1JbnN0cnVjdGlvblNldC5qcyIsInNvdXJjZS9FbHVjaWRhdG9yLUxvZ1RvQ29uc29sZS5qcyIsInNvdXJjZS9FbHVjaWRhdG9yLmpzIiwic291cmNlL0luc3RydWN0aW9uU2V0cy9HZW9tZXRyeS5qcyIsInNvdXJjZS9JbnN0cnVjdGlvblNldHMvTWF0aC1KYXZhc2NyaXB0LmpzIiwic291cmNlL0luc3RydWN0aW9uU2V0cy9PcGVyYXRpb25zL0dlb21ldHJ5LVJlY3RhbmdsZUFyZWEuanNvbiIsInNvdXJjZS9JbnN0cnVjdGlvblNldHMvT3BlcmF0aW9ucy9NYXRoLUFkZC5qc29uIiwic291cmNlL0luc3RydWN0aW9uU2V0cy9PcGVyYXRpb25zL01hdGgtRGl2aWRlLmpzb24iLCJzb3VyY2UvSW5zdHJ1Y3Rpb25TZXRzL09wZXJhdGlvbnMvTWF0aC1NdWx0aXBseS5qc29uIiwic291cmNlL0luc3RydWN0aW9uU2V0cy9PcGVyYXRpb25zL01hdGgtU3VidHJhY3QuanNvbiIsInNvdXJjZS9JbnN0cnVjdGlvblNldHMvT3BlcmF0aW9ucy9QcmVjaXNlTWF0aC1BZGQuanNvbiIsInNvdXJjZS9JbnN0cnVjdGlvblNldHMvT3BlcmF0aW9ucy9QcmVjaXNlTWF0aC1EaXZpZGUuanNvbiIsInNvdXJjZS9JbnN0cnVjdGlvblNldHMvT3BlcmF0aW9ucy9QcmVjaXNlTWF0aC1NdWx0aXBseS5qc29uIiwic291cmNlL0luc3RydWN0aW9uU2V0cy9PcGVyYXRpb25zL1ByZWNpc2VNYXRoLVN1YnRyYWN0Lmpzb24iLCJzb3VyY2UvSW5zdHJ1Y3Rpb25TZXRzL1ByZWNpc2VNYXRoLURlY2ltYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdDBKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4a0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIjsoZnVuY3Rpb24gKGdsb2JhbFNjb3BlKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbiAgLyohXHJcbiAgICogIGRlY2ltYWwuanMgdjEwLjQuMlxyXG4gICAqICBBbiBhcmJpdHJhcnktcHJlY2lzaW9uIERlY2ltYWwgdHlwZSBmb3IgSmF2YVNjcmlwdC5cclxuICAgKiAgaHR0cHM6Ly9naXRodWIuY29tL01pa2VNY2wvZGVjaW1hbC5qc1xyXG4gICAqICBDb3B5cmlnaHQgKGMpIDIwMjIgTWljaGFlbCBNY2xhdWdobGluIDxNOGNoODhsQGdtYWlsLmNvbT5cclxuICAgKiAgTUlUIExpY2VuY2VcclxuICAgKi9cclxuXHJcblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICBFRElUQUJMRSBERUZBVUxUUyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXHJcblxyXG5cclxuICAgIC8vIFRoZSBtYXhpbXVtIGV4cG9uZW50IG1hZ25pdHVkZS5cclxuICAgIC8vIFRoZSBsaW1pdCBvbiB0aGUgdmFsdWUgb2YgYHRvRXhwTmVnYCwgYHRvRXhwUG9zYCwgYG1pbkVgIGFuZCBgbWF4RWAuXHJcbiAgdmFyIEVYUF9MSU1JVCA9IDllMTUsICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gOWUxNVxyXG5cclxuICAgIC8vIFRoZSBsaW1pdCBvbiB0aGUgdmFsdWUgb2YgYHByZWNpc2lvbmAsIGFuZCBvbiB0aGUgdmFsdWUgb2YgdGhlIGZpcnN0IGFyZ3VtZW50IHRvXHJcbiAgICAvLyBgdG9EZWNpbWFsUGxhY2VzYCwgYHRvRXhwb25lbnRpYWxgLCBgdG9GaXhlZGAsIGB0b1ByZWNpc2lvbmAgYW5kIGB0b1NpZ25pZmljYW50RGlnaXRzYC5cclxuICAgIE1BWF9ESUdJVFMgPSAxZTksICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byAxZTlcclxuXHJcbiAgICAvLyBCYXNlIGNvbnZlcnNpb24gYWxwaGFiZXQuXHJcbiAgICBOVU1FUkFMUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJyxcclxuXHJcbiAgICAvLyBUaGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgMTAgKDEwMjUgZGlnaXRzKS5cclxuICAgIExOMTAgPSAnMi4zMDI1ODUwOTI5OTQwNDU2ODQwMTc5OTE0NTQ2ODQzNjQyMDc2MDExMDE0ODg2Mjg3NzI5NzYwMzMzMjc5MDA5Njc1NzI2MDk2NzczNTI0ODAyMzU5OTcyMDUwODk1OTgyOTgzNDE5Njc3ODQwNDIyODYyNDg2MzM0MDk1MjU0NjUwODI4MDY3NTY2NjYyODczNjkwOTg3ODE2ODk0ODI5MDcyMDgzMjU1NTQ2ODA4NDM3OTk4OTQ4MjYyMzMxOTg1MjgzOTM1MDUzMDg5NjUzNzc3MzI2Mjg4NDYxNjMzNjYyMjIyODc2OTgyMTk4ODY3NDY1NDM2Njc0NzQ0MDQyNDMyNzQzNjUxNTUwNDg5MzQzMTQ5MzkzOTE0Nzk2MTk0MDQ0MDAyMjIxMDUxMDE3MTQxNzQ4MDAzNjg4MDg0MDEyNjQ3MDgwNjg1NTY3NzQzMjE2MjI4MzU1MjIwMTE0ODA0NjYzNzE1NjU5MTIxMzczNDUwNzQ3ODU2OTQ3NjgzNDYzNjE2NzkyMTAxODA2NDQ1MDcwNjQ4MDAwMjc3NTAyNjg0OTE2NzQ2NTUwNTg2ODU2OTM1NjczNDIwNjcwNTgxMTM2NDI5MjI0NTU0NDA1NzU4OTI1NzI0MjA4MjQxMzE0Njk1Njg5MDE2NzU4OTQwMjU2Nzc2MzExMzU2OTE5MjkyMDMzMzc2NTg3MTQxNjYwMjMwMTA1NzAzMDg5NjM0NTcyMDc1NDQwMzcwODQ3NDY5OTQwMTY4MjY5MjgyODA4NDgxMTg0Mjg5MzE0ODQ4NTI0OTQ4NjQ0ODcxOTI3ODA5Njc2MjcxMjc1Nzc1Mzk3MDI3NjY4NjA1OTUyNDk2NzE2Njc0MTgzNDg1NzA0NDIyNTA3MTk3OTY1MDA0NzE0OTUxMDUwNDkyMjE0Nzc2NTY3NjM2OTM4NjYyOTc2OTc5NTIyMTEwNzE4MjY0NTQ5NzM0NzcyNjYyNDI1NzA5NDI5MzIyNTgyNzk4NTAyNTg1NTA5Nzg1MjY1MzgzMjA3NjA2NzI2MzE3MTY0MzA5NTA1OTk1MDg3ODA3NTIzNzEwMzMzMTAxMTk3ODU3NTQ3MzMxNTQxNDIxODA4NDI3NTQzODYzNTkxNzc4MTE3MDU0MzA5ODI3NDgyMzg1MDQ1NjQ4MDE5MDk1NjEwMjk5MjkxODI0MzE4MjM3NTI1MzU3NzA5NzUwNTM5NTY1MTg3Njk3NTEwMzc0OTcwODg4NjkyMTgwMjA1MTg5MzM5NTA3MjM4NTM5MjA1MTQ0NjM0MTk3MjY1Mjg3Mjg2OTY1MTEwODYyNTcxNDkyMTk4ODQ5OTc4NzQ4ODczNzcxMzQ1Njg2MjA5MTY3MDU4JyxcclxuXHJcbiAgICAvLyBQaSAoMTAyNSBkaWdpdHMpLlxyXG4gICAgUEkgPSAnMy4xNDE1OTI2NTM1ODk3OTMyMzg0NjI2NDMzODMyNzk1MDI4ODQxOTcxNjkzOTkzNzUxMDU4MjA5NzQ5NDQ1OTIzMDc4MTY0MDYyODYyMDg5OTg2MjgwMzQ4MjUzNDIxMTcwNjc5ODIxNDgwODY1MTMyODIzMDY2NDcwOTM4NDQ2MDk1NTA1ODIyMzE3MjUzNTk0MDgxMjg0ODExMTc0NTAyODQxMDI3MDE5Mzg1MjExMDU1NTk2NDQ2MjI5NDg5NTQ5MzAzODE5NjQ0Mjg4MTA5NzU2NjU5MzM0NDYxMjg0NzU2NDgyMzM3ODY3ODMxNjUyNzEyMDE5MDkxNDU2NDg1NjY5MjM0NjAzNDg2MTA0NTQzMjY2NDgyMTMzOTM2MDcyNjAyNDkxNDEyNzM3MjQ1ODcwMDY2MDYzMTU1ODgxNzQ4ODE1MjA5MjA5NjI4MjkyNTQwOTE3MTUzNjQzNjc4OTI1OTAzNjAwMTEzMzA1MzA1NDg4MjA0NjY1MjEzODQxNDY5NTE5NDE1MTE2MDk0MzMwNTcyNzAzNjU3NTk1OTE5NTMwOTIxODYxMTczODE5MzI2MTE3OTMxMDUxMTg1NDgwNzQ0NjIzNzk5NjI3NDk1NjczNTE4ODU3NTI3MjQ4OTEyMjc5MzgxODMwMTE5NDkxMjk4MzM2NzMzNjI0NDA2NTY2NDMwODYwMjEzOTQ5NDYzOTUyMjQ3MzcxOTA3MDIxNzk4NjA5NDM3MDI3NzA1MzkyMTcxNzYyOTMxNzY3NTIzODQ2NzQ4MTg0Njc2Njk0MDUxMzIwMDA1NjgxMjcxNDUyNjM1NjA4Mjc3ODU3NzEzNDI3NTc3ODk2MDkxNzM2MzcxNzg3MjE0Njg0NDA5MDEyMjQ5NTM0MzAxNDY1NDk1ODUzNzEwNTA3OTIyNzk2ODkyNTg5MjM1NDIwMTk5NTYxMTIxMjkwMjE5NjA4NjQwMzQ0MTgxNTk4MTM2Mjk3NzQ3NzEzMDk5NjA1MTg3MDcyMTEzNDk5OTk5OTgzNzI5NzgwNDk5NTEwNTk3MzE3MzI4MTYwOTYzMTg1OTUwMjQ0NTk0NTUzNDY5MDgzMDI2NDI1MjIzMDgyNTMzNDQ2ODUwMzUyNjE5MzExODgxNzEwMTAwMDMxMzc4Mzg3NTI4ODY1ODc1MzMyMDgzODE0MjA2MTcxNzc2NjkxNDczMDM1OTgyNTM0OTA0Mjg3NTU0Njg3MzExNTk1NjI4NjM4ODIzNTM3ODc1OTM3NTE5NTc3ODE4NTc3ODA1MzIxNzEyMjY4MDY2MTMwMDE5Mjc4NzY2MTExOTU5MDkyMTY0MjAxOTg5MzgwOTUyNTcyMDEwNjU0ODU4NjMyNzg5JyxcclxuXHJcblxyXG4gICAgLy8gVGhlIGluaXRpYWwgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIG9mIHRoZSBEZWNpbWFsIGNvbnN0cnVjdG9yLlxyXG4gICAgREVGQVVMVFMgPSB7XHJcblxyXG4gICAgICAvLyBUaGVzZSB2YWx1ZXMgbXVzdCBiZSBpbnRlZ2VycyB3aXRoaW4gdGhlIHN0YXRlZCByYW5nZXMgKGluY2x1c2l2ZSkuXHJcbiAgICAgIC8vIE1vc3Qgb2YgdGhlc2UgdmFsdWVzIGNhbiBiZSBjaGFuZ2VkIGF0IHJ1bi10aW1lIHVzaW5nIHRoZSBgRGVjaW1hbC5jb25maWdgIG1ldGhvZC5cclxuXHJcbiAgICAgIC8vIFRoZSBtYXhpbXVtIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgb2YgdGhlIHJlc3VsdCBvZiBhIGNhbGN1bGF0aW9uIG9yIGJhc2UgY29udmVyc2lvbi5cclxuICAgICAgLy8gRS5nLiBgRGVjaW1hbC5jb25maWcoeyBwcmVjaXNpb246IDIwIH0pO2BcclxuICAgICAgcHJlY2lzaW9uOiAyMCwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMSB0byBNQVhfRElHSVRTXHJcblxyXG4gICAgICAvLyBUaGUgcm91bmRpbmcgbW9kZSB1c2VkIHdoZW4gcm91bmRpbmcgdG8gYHByZWNpc2lvbmAuXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFJPVU5EX1VQICAgICAgICAgMCBBd2F5IGZyb20gemVyby5cclxuICAgICAgLy8gUk9VTkRfRE9XTiAgICAgICAxIFRvd2FyZHMgemVyby5cclxuICAgICAgLy8gUk9VTkRfQ0VJTCAgICAgICAyIFRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgICAvLyBST1VORF9GTE9PUiAgICAgIDMgVG93YXJkcyAtSW5maW5pdHkuXHJcbiAgICAgIC8vIFJPVU5EX0hBTEZfVVAgICAgNCBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdXAuXHJcbiAgICAgIC8vIFJPVU5EX0hBTEZfRE9XTiAgNSBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgZG93bi5cclxuICAgICAgLy8gUk9VTkRfSEFMRl9FVkVOICA2IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzIGV2ZW4gbmVpZ2hib3VyLlxyXG4gICAgICAvLyBST1VORF9IQUxGX0NFSUwgIDcgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgICAvLyBST1VORF9IQUxGX0ZMT09SIDggVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgLUluZmluaXR5LlxyXG4gICAgICAvL1xyXG4gICAgICAvLyBFLmcuXHJcbiAgICAgIC8vIGBEZWNpbWFsLnJvdW5kaW5nID0gNDtgXHJcbiAgICAgIC8vIGBEZWNpbWFsLnJvdW5kaW5nID0gRGVjaW1hbC5ST1VORF9IQUxGX1VQO2BcclxuICAgICAgcm91bmRpbmc6IDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA4XHJcblxyXG4gICAgICAvLyBUaGUgbW9kdWxvIG1vZGUgdXNlZCB3aGVuIGNhbGN1bGF0aW5nIHRoZSBtb2R1bHVzOiBhIG1vZCBuLlxyXG4gICAgICAvLyBUaGUgcXVvdGllbnQgKHEgPSBhIC8gbikgaXMgY2FsY3VsYXRlZCBhY2NvcmRpbmcgdG8gdGhlIGNvcnJlc3BvbmRpbmcgcm91bmRpbmcgbW9kZS5cclxuICAgICAgLy8gVGhlIHJlbWFpbmRlciAocikgaXMgY2FsY3VsYXRlZCBhczogciA9IGEgLSBuICogcS5cclxuICAgICAgLy9cclxuICAgICAgLy8gVVAgICAgICAgICAwIFRoZSByZW1haW5kZXIgaXMgcG9zaXRpdmUgaWYgdGhlIGRpdmlkZW5kIGlzIG5lZ2F0aXZlLCBlbHNlIGlzIG5lZ2F0aXZlLlxyXG4gICAgICAvLyBET1dOICAgICAgIDEgVGhlIHJlbWFpbmRlciBoYXMgdGhlIHNhbWUgc2lnbiBhcyB0aGUgZGl2aWRlbmQgKEphdmFTY3JpcHQgJSkuXHJcbiAgICAgIC8vIEZMT09SICAgICAgMyBUaGUgcmVtYWluZGVyIGhhcyB0aGUgc2FtZSBzaWduIGFzIHRoZSBkaXZpc29yIChQeXRob24gJSkuXHJcbiAgICAgIC8vIEhBTEZfRVZFTiAgNiBUaGUgSUVFRSA3NTQgcmVtYWluZGVyIGZ1bmN0aW9uLlxyXG4gICAgICAvLyBFVUNMSUQgICAgIDkgRXVjbGlkaWFuIGRpdmlzaW9uLiBxID0gc2lnbihuKSAqIGZsb29yKGEgLyBhYnMobikpLiBBbHdheXMgcG9zaXRpdmUuXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFRydW5jYXRlZCBkaXZpc2lvbiAoMSksIGZsb29yZWQgZGl2aXNpb24gKDMpLCB0aGUgSUVFRSA3NTQgcmVtYWluZGVyICg2KSwgYW5kIEV1Y2xpZGlhblxyXG4gICAgICAvLyBkaXZpc2lvbiAoOSkgYXJlIGNvbW1vbmx5IHVzZWQgZm9yIHRoZSBtb2R1bHVzIG9wZXJhdGlvbi4gVGhlIG90aGVyIHJvdW5kaW5nIG1vZGVzIGNhbiBhbHNvXHJcbiAgICAgIC8vIGJlIHVzZWQsIGJ1dCB0aGV5IG1heSBub3QgZ2l2ZSB1c2VmdWwgcmVzdWx0cy5cclxuICAgICAgbW9kdWxvOiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA5XHJcblxyXG4gICAgICAvLyBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGJlbmVhdGggd2hpY2ggYHRvU3RyaW5nYCByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IC03XHJcbiAgICAgIHRvRXhwTmVnOiAtNywgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gLUVYUF9MSU1JVFxyXG5cclxuICAgICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBhYm92ZSB3aGljaCBgdG9TdHJpbmdgIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAgIC8vIEphdmFTY3JpcHQgbnVtYmVyczogMjFcclxuICAgICAgdG9FeHBQb3M6ICAyMSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byBFWFBfTElNSVRcclxuXHJcbiAgICAgIC8vIFRoZSBtaW5pbXVtIGV4cG9uZW50IHZhbHVlLCBiZW5lYXRoIHdoaWNoIHVuZGVyZmxvdyB0byB6ZXJvIG9jY3Vycy5cclxuICAgICAgLy8gSmF2YVNjcmlwdCBudW1iZXJzOiAtMzI0ICAoNWUtMzI0KVxyXG4gICAgICBtaW5FOiAtRVhQX0xJTUlULCAgICAgICAgICAgICAgICAgICAgICAvLyAtMSB0byAtRVhQX0xJTUlUXHJcblxyXG4gICAgICAvLyBUaGUgbWF4aW11bSBleHBvbmVudCB2YWx1ZSwgYWJvdmUgd2hpY2ggb3ZlcmZsb3cgdG8gSW5maW5pdHkgb2NjdXJzLlxyXG4gICAgICAvLyBKYXZhU2NyaXB0IG51bWJlcnM6IDMwOCAgKDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG4gICAgICBtYXhFOiBFWFBfTElNSVQsICAgICAgICAgICAgICAgICAgICAgICAvLyAxIHRvIEVYUF9MSU1JVFxyXG5cclxuICAgICAgLy8gV2hldGhlciB0byB1c2UgY3J5cHRvZ3JhcGhpY2FsbHktc2VjdXJlIHJhbmRvbSBudW1iZXIgZ2VuZXJhdGlvbiwgaWYgYXZhaWxhYmxlLlxyXG4gICAgICBjcnlwdG86IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cnVlL2ZhbHNlXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRU5EIE9GIEVESVRBQkxFIERFRkFVTFRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cclxuXHJcblxyXG4gICAgRGVjaW1hbCwgaW5leGFjdCwgbm9Db25mbGljdCwgcXVhZHJhbnQsXHJcbiAgICBleHRlcm5hbCA9IHRydWUsXHJcblxyXG4gICAgZGVjaW1hbEVycm9yID0gJ1tEZWNpbWFsRXJyb3JdICcsXHJcbiAgICBpbnZhbGlkQXJndW1lbnQgPSBkZWNpbWFsRXJyb3IgKyAnSW52YWxpZCBhcmd1bWVudDogJyxcclxuICAgIHByZWNpc2lvbkxpbWl0RXhjZWVkZWQgPSBkZWNpbWFsRXJyb3IgKyAnUHJlY2lzaW9uIGxpbWl0IGV4Y2VlZGVkJyxcclxuICAgIGNyeXB0b1VuYXZhaWxhYmxlID0gZGVjaW1hbEVycm9yICsgJ2NyeXB0byB1bmF2YWlsYWJsZScsXHJcbiAgICB0YWcgPSAnW29iamVjdCBEZWNpbWFsXScsXHJcblxyXG4gICAgbWF0aGZsb29yID0gTWF0aC5mbG9vcixcclxuICAgIG1hdGhwb3cgPSBNYXRoLnBvdyxcclxuXHJcbiAgICBpc0JpbmFyeSA9IC9eMGIoWzAxXSsoXFwuWzAxXSopP3xcXC5bMDFdKykocFsrLV0/XFxkKyk/JC9pLFxyXG4gICAgaXNIZXggPSAvXjB4KFswLTlhLWZdKyhcXC5bMC05YS1mXSopP3xcXC5bMC05YS1mXSspKHBbKy1dP1xcZCspPyQvaSxcclxuICAgIGlzT2N0YWwgPSAvXjBvKFswLTddKyhcXC5bMC03XSopP3xcXC5bMC03XSspKHBbKy1dP1xcZCspPyQvaSxcclxuICAgIGlzRGVjaW1hbCA9IC9eKFxcZCsoXFwuXFxkKik/fFxcLlxcZCspKGVbKy1dP1xcZCspPyQvaSxcclxuXHJcbiAgICBCQVNFID0gMWU3LFxyXG4gICAgTE9HX0JBU0UgPSA3LFxyXG4gICAgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTEsXHJcblxyXG4gICAgTE4xMF9QUkVDSVNJT04gPSBMTjEwLmxlbmd0aCAtIDEsXHJcbiAgICBQSV9QUkVDSVNJT04gPSBQSS5sZW5ndGggLSAxLFxyXG5cclxuICAgIC8vIERlY2ltYWwucHJvdG90eXBlIG9iamVjdFxyXG4gICAgUCA9IHsgdG9TdHJpbmdUYWc6IHRhZyB9O1xyXG5cclxuXHJcbiAgLy8gRGVjaW1hbCBwcm90b3R5cGUgbWV0aG9kc1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgYWJzb2x1dGVWYWx1ZSAgICAgICAgICAgICBhYnNcclxuICAgKiAgY2VpbFxyXG4gICAqICBjbGFtcGVkVG8gICAgICAgICAgICAgICAgIGNsYW1wXHJcbiAgICogIGNvbXBhcmVkVG8gICAgICAgICAgICAgICAgY21wXHJcbiAgICogIGNvc2luZSAgICAgICAgICAgICAgICAgICAgY29zXHJcbiAgICogIGN1YmVSb290ICAgICAgICAgICAgICAgICAgY2JydFxyXG4gICAqICBkZWNpbWFsUGxhY2VzICAgICAgICAgICAgIGRwXHJcbiAgICogIGRpdmlkZWRCeSAgICAgICAgICAgICAgICAgZGl2XHJcbiAgICogIGRpdmlkZWRUb0ludGVnZXJCeSAgICAgICAgZGl2VG9JbnRcclxuICAgKiAgZXF1YWxzICAgICAgICAgICAgICAgICAgICBlcVxyXG4gICAqICBmbG9vclxyXG4gICAqICBncmVhdGVyVGhhbiAgICAgICAgICAgICAgIGd0XHJcbiAgICogIGdyZWF0ZXJUaGFuT3JFcXVhbFRvICAgICAgZ3RlXHJcbiAgICogIGh5cGVyYm9saWNDb3NpbmUgICAgICAgICAgY29zaFxyXG4gICAqICBoeXBlcmJvbGljU2luZSAgICAgICAgICAgIHNpbmhcclxuICAgKiAgaHlwZXJib2xpY1RhbmdlbnQgICAgICAgICB0YW5oXHJcbiAgICogIGludmVyc2VDb3NpbmUgICAgICAgICAgICAgYWNvc1xyXG4gICAqICBpbnZlcnNlSHlwZXJib2xpY0Nvc2luZSAgIGFjb3NoXHJcbiAgICogIGludmVyc2VIeXBlcmJvbGljU2luZSAgICAgYXNpbmhcclxuICAgKiAgaW52ZXJzZUh5cGVyYm9saWNUYW5nZW50ICBhdGFuaFxyXG4gICAqICBpbnZlcnNlU2luZSAgICAgICAgICAgICAgIGFzaW5cclxuICAgKiAgaW52ZXJzZVRhbmdlbnQgICAgICAgICAgICBhdGFuXHJcbiAgICogIGlzRmluaXRlXHJcbiAgICogIGlzSW50ZWdlciAgICAgICAgICAgICAgICAgaXNJbnRcclxuICAgKiAgaXNOYU5cclxuICAgKiAgaXNOZWdhdGl2ZSAgICAgICAgICAgICAgICBpc05lZ1xyXG4gICAqICBpc1Bvc2l0aXZlICAgICAgICAgICAgICAgIGlzUG9zXHJcbiAgICogIGlzWmVyb1xyXG4gICAqICBsZXNzVGhhbiAgICAgICAgICAgICAgICAgIGx0XHJcbiAgICogIGxlc3NUaGFuT3JFcXVhbFRvICAgICAgICAgbHRlXHJcbiAgICogIGxvZ2FyaXRobSAgICAgICAgICAgICAgICAgbG9nXHJcbiAgICogIFttYXhpbXVtXSAgICAgICAgICAgICAgICAgW21heF1cclxuICAgKiAgW21pbmltdW1dICAgICAgICAgICAgICAgICBbbWluXVxyXG4gICAqICBtaW51cyAgICAgICAgICAgICAgICAgICAgIHN1YlxyXG4gICAqICBtb2R1bG8gICAgICAgICAgICAgICAgICAgIG1vZFxyXG4gICAqICBuYXR1cmFsRXhwb25lbnRpYWwgICAgICAgIGV4cFxyXG4gICAqICBuYXR1cmFsTG9nYXJpdGhtICAgICAgICAgIGxuXHJcbiAgICogIG5lZ2F0ZWQgICAgICAgICAgICAgICAgICAgbmVnXHJcbiAgICogIHBsdXMgICAgICAgICAgICAgICAgICAgICAgYWRkXHJcbiAgICogIHByZWNpc2lvbiAgICAgICAgICAgICAgICAgc2RcclxuICAgKiAgcm91bmRcclxuICAgKiAgc2luZSAgICAgICAgICAgICAgICAgICAgICBzaW5cclxuICAgKiAgc3F1YXJlUm9vdCAgICAgICAgICAgICAgICBzcXJ0XHJcbiAgICogIHRhbmdlbnQgICAgICAgICAgICAgICAgICAgdGFuXHJcbiAgICogIHRpbWVzICAgICAgICAgICAgICAgICAgICAgbXVsXHJcbiAgICogIHRvQmluYXJ5XHJcbiAgICogIHRvRGVjaW1hbFBsYWNlcyAgICAgICAgICAgdG9EUFxyXG4gICAqICB0b0V4cG9uZW50aWFsXHJcbiAgICogIHRvRml4ZWRcclxuICAgKiAgdG9GcmFjdGlvblxyXG4gICAqICB0b0hleGFkZWNpbWFsICAgICAgICAgICAgIHRvSGV4XHJcbiAgICogIHRvTmVhcmVzdFxyXG4gICAqICB0b051bWJlclxyXG4gICAqICB0b09jdGFsXHJcbiAgICogIHRvUG93ZXIgICAgICAgICAgICAgICAgICAgcG93XHJcbiAgICogIHRvUHJlY2lzaW9uXHJcbiAgICogIHRvU2lnbmlmaWNhbnREaWdpdHMgICAgICAgdG9TRFxyXG4gICAqICB0b1N0cmluZ1xyXG4gICAqICB0cnVuY2F0ZWQgICAgICAgICAgICAgICAgIHRydW5jXHJcbiAgICogIHZhbHVlT2YgICAgICAgICAgICAgICAgICAgdG9KU09OXHJcbiAgICovXHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmFic29sdXRlVmFsdWUgPSBQLmFicyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB4ID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyk7XHJcbiAgICBpZiAoeC5zIDwgMCkgeC5zID0gMTtcclxuICAgIHJldHVybiBmaW5hbGlzZSh4KTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSB3aG9sZSBudW1iZXIgaW4gdGhlXHJcbiAgICogZGlyZWN0aW9uIG9mIHBvc2l0aXZlIEluZmluaXR5LlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5jZWlsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAyKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGNsYW1wZWQgdG8gdGhlIHJhbmdlXHJcbiAgICogZGVsaW5lYXRlZCBieSBgbWluYCBhbmQgYG1heGAuXHJcbiAgICpcclxuICAgKiBtaW4ge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKiBtYXgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuY2xhbXBlZFRvID0gUC5jbGFtcCA9IGZ1bmN0aW9uIChtaW4sIG1heCkge1xyXG4gICAgdmFyIGssXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuICAgIG1pbiA9IG5ldyBDdG9yKG1pbik7XHJcbiAgICBtYXggPSBuZXcgQ3RvcihtYXgpO1xyXG4gICAgaWYgKCFtaW4ucyB8fCAhbWF4LnMpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG4gICAgaWYgKG1pbi5ndChtYXgpKSB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBtYXgpO1xyXG4gICAgayA9IHguY21wKG1pbik7XHJcbiAgICByZXR1cm4gayA8IDAgPyBtaW4gOiB4LmNtcChtYXgpID4gMCA/IG1heCA6IG5ldyBDdG9yKHgpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVyblxyXG4gICAqICAgMSAgICBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gICAqICAtMSAgICBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGxlc3MgdGhhbiB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gICAqICAgMCAgICBpZiB0aGV5IGhhdmUgdGhlIHNhbWUgdmFsdWUsXHJcbiAgICogICBOYU4gIGlmIHRoZSB2YWx1ZSBvZiBlaXRoZXIgRGVjaW1hbCBpcyBOYU4uXHJcbiAgICpcclxuICAgKi9cclxuICBQLmNvbXBhcmVkVG8gPSBQLmNtcCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICB2YXIgaSwgaiwgeGRMLCB5ZEwsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICB4ZCA9IHguZCxcclxuICAgICAgeWQgPSAoeSA9IG5ldyB4LmNvbnN0cnVjdG9yKHkpKS5kLFxyXG4gICAgICB4cyA9IHgucyxcclxuICAgICAgeXMgPSB5LnM7XHJcblxyXG4gICAgLy8gRWl0aGVyIE5hTiBvciDCsUluZmluaXR5P1xyXG4gICAgaWYgKCF4ZCB8fCAheWQpIHtcclxuICAgICAgcmV0dXJuICF4cyB8fCAheXMgPyBOYU4gOiB4cyAhPT0geXMgPyB4cyA6IHhkID09PSB5ZCA/IDAgOiAheGQgXiB4cyA8IDAgPyAxIDogLTE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRWl0aGVyIHplcm8/XHJcbiAgICBpZiAoIXhkWzBdIHx8ICF5ZFswXSkgcmV0dXJuIHhkWzBdID8geHMgOiB5ZFswXSA/IC15cyA6IDA7XHJcblxyXG4gICAgLy8gU2lnbnMgZGlmZmVyP1xyXG4gICAgaWYgKHhzICE9PSB5cykgcmV0dXJuIHhzO1xyXG5cclxuICAgIC8vIENvbXBhcmUgZXhwb25lbnRzLlxyXG4gICAgaWYgKHguZSAhPT0geS5lKSByZXR1cm4geC5lID4geS5lIF4geHMgPCAwID8gMSA6IC0xO1xyXG5cclxuICAgIHhkTCA9IHhkLmxlbmd0aDtcclxuICAgIHlkTCA9IHlkLmxlbmd0aDtcclxuXHJcbiAgICAvLyBDb21wYXJlIGRpZ2l0IGJ5IGRpZ2l0LlxyXG4gICAgZm9yIChpID0gMCwgaiA9IHhkTCA8IHlkTCA/IHhkTCA6IHlkTDsgaSA8IGo7ICsraSkge1xyXG4gICAgICBpZiAoeGRbaV0gIT09IHlkW2ldKSByZXR1cm4geGRbaV0gPiB5ZFtpXSBeIHhzIDwgMCA/IDEgOiAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb21wYXJlIGxlbmd0aHMuXHJcbiAgICByZXR1cm4geGRMID09PSB5ZEwgPyAwIDogeGRMID4geWRMIF4geHMgPCAwID8gMSA6IC0xO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjb3NpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy0xLCAxXVxyXG4gICAqXHJcbiAgICogY29zKDApICAgICAgICAgPSAxXHJcbiAgICogY29zKC0wKSAgICAgICAgPSAxXHJcbiAgICogY29zKEluZmluaXR5KSAgPSBOYU5cclxuICAgKiBjb3MoLUluZmluaXR5KSA9IE5hTlxyXG4gICAqIGNvcyhOYU4pICAgICAgID0gTmFOXHJcbiAgICpcclxuICAgKi9cclxuICBQLmNvc2luZSA9IFAuY29zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByLCBybSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheC5kKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAvLyBjb3MoMCkgPSBjb3MoLTApID0gMVxyXG4gICAgaWYgKCF4LmRbMF0pIHJldHVybiBuZXcgQ3RvcigxKTtcclxuXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIE1hdGgubWF4KHguZSwgeC5zZCgpKSArIExPR19CQVNFO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gICAgeCA9IGNvc2luZShDdG9yLCB0b0xlc3NUaGFuSGFsZlBpKEN0b3IsIHgpKTtcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZShxdWFkcmFudCA9PSAyIHx8IHF1YWRyYW50ID09IDMgPyB4Lm5lZygpIDogeCwgcHIsIHJtLCB0cnVlKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBjdWJlIHJvb3Qgb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCwgcm91bmRlZCB0b1xyXG4gICAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiAgY2JydCgwKSAgPSAgMFxyXG4gICAqICBjYnJ0KC0wKSA9IC0wXHJcbiAgICogIGNicnQoMSkgID0gIDFcclxuICAgKiAgY2JydCgtMSkgPSAtMVxyXG4gICAqICBjYnJ0KE4pICA9ICBOXHJcbiAgICogIGNicnQoLUkpID0gLUlcclxuICAgKiAgY2JydChJKSAgPSAgSVxyXG4gICAqXHJcbiAgICogTWF0aC5jYnJ0KHgpID0gKHggPCAwID8gLU1hdGgucG93KC14LCAxLzMpIDogTWF0aC5wb3coeCwgMS8zKSlcclxuICAgKlxyXG4gICAqL1xyXG4gIFAuY3ViZVJvb3QgPSBQLmNicnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZSwgbSwgbiwgciwgcmVwLCBzLCBzZCwgdCwgdDMsIHQzcGx1c3gsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSB8fCB4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAgIC8vIEluaXRpYWwgZXN0aW1hdGUuXHJcbiAgICBzID0geC5zICogbWF0aHBvdyh4LnMgKiB4LCAxIC8gMyk7XHJcblxyXG4gICAgIC8vIE1hdGguY2JydCB1bmRlcmZsb3cvb3ZlcmZsb3c/XHJcbiAgICAgLy8gUGFzcyB4IHRvIE1hdGgucG93IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSBleHBvbmVudCBvZiB0aGUgcmVzdWx0LlxyXG4gICAgaWYgKCFzIHx8IE1hdGguYWJzKHMpID09IDEgLyAwKSB7XHJcbiAgICAgIG4gPSBkaWdpdHNUb1N0cmluZyh4LmQpO1xyXG4gICAgICBlID0geC5lO1xyXG5cclxuICAgICAgLy8gQWRqdXN0IG4gZXhwb25lbnQgc28gaXQgaXMgYSBtdWx0aXBsZSBvZiAzIGF3YXkgZnJvbSB4IGV4cG9uZW50LlxyXG4gICAgICBpZiAocyA9IChlIC0gbi5sZW5ndGggKyAxKSAlIDMpIG4gKz0gKHMgPT0gMSB8fCBzID09IC0yID8gJzAnIDogJzAwJyk7XHJcbiAgICAgIHMgPSBtYXRocG93KG4sIDEgLyAzKTtcclxuXHJcbiAgICAgIC8vIFJhcmVseSwgZSBtYXkgYmUgb25lIGxlc3MgdGhhbiB0aGUgcmVzdWx0IGV4cG9uZW50IHZhbHVlLlxyXG4gICAgICBlID0gbWF0aGZsb29yKChlICsgMSkgLyAzKSAtIChlICUgMyA9PSAoZSA8IDAgPyAtMSA6IDIpKTtcclxuXHJcbiAgICAgIGlmIChzID09IDEgLyAwKSB7XHJcbiAgICAgICAgbiA9ICc1ZScgKyBlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcclxuICAgICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgciA9IG5ldyBDdG9yKG4pO1xyXG4gICAgICByLnMgPSB4LnM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByID0gbmV3IEN0b3Iocy50b1N0cmluZygpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZCA9IChlID0gQ3Rvci5wcmVjaXNpb24pICsgMztcclxuXHJcbiAgICAvLyBIYWxsZXkncyBtZXRob2QuXHJcbiAgICAvLyBUT0RPPyBDb21wYXJlIE5ld3RvbidzIG1ldGhvZC5cclxuICAgIGZvciAoOzspIHtcclxuICAgICAgdCA9IHI7XHJcbiAgICAgIHQzID0gdC50aW1lcyh0KS50aW1lcyh0KTtcclxuICAgICAgdDNwbHVzeCA9IHQzLnBsdXMoeCk7XHJcbiAgICAgIHIgPSBkaXZpZGUodDNwbHVzeC5wbHVzKHgpLnRpbWVzKHQpLCB0M3BsdXN4LnBsdXModDMpLCBzZCArIDIsIDEpO1xyXG5cclxuICAgICAgLy8gVE9ETz8gUmVwbGFjZSB3aXRoIGZvci1sb29wIGFuZCBjaGVja1JvdW5kaW5nRGlnaXRzLlxyXG4gICAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCBzZCkgPT09IChuID0gZGlnaXRzVG9TdHJpbmcoci5kKSkuc2xpY2UoMCwgc2QpKSB7XHJcbiAgICAgICAgbiA9IG4uc2xpY2Uoc2QgLSAzLCBzZCArIDEpO1xyXG5cclxuICAgICAgICAvLyBUaGUgNHRoIHJvdW5kaW5nIGRpZ2l0IG1heSBiZSBpbiBlcnJvciBieSAtMSBzbyBpZiB0aGUgNCByb3VuZGluZyBkaWdpdHMgYXJlIDk5OTkgb3IgNDk5OVxyXG4gICAgICAgIC8vICwgaS5lLiBhcHByb2FjaGluZyBhIHJvdW5kaW5nIGJvdW5kYXJ5LCBjb250aW51ZSB0aGUgaXRlcmF0aW9uLlxyXG4gICAgICAgIGlmIChuID09ICc5OTk5JyB8fCAhcmVwICYmIG4gPT0gJzQ5OTknKSB7XHJcblxyXG4gICAgICAgICAgLy8gT24gdGhlIGZpcnN0IGl0ZXJhdGlvbiBvbmx5LCBjaGVjayB0byBzZWUgaWYgcm91bmRpbmcgdXAgZ2l2ZXMgdGhlIGV4YWN0IHJlc3VsdCBhcyB0aGVcclxuICAgICAgICAgIC8vIG5pbmVzIG1heSBpbmZpbml0ZWx5IHJlcGVhdC5cclxuICAgICAgICAgIGlmICghcmVwKSB7XHJcbiAgICAgICAgICAgIGZpbmFsaXNlKHQsIGUgKyAxLCAwKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0LnRpbWVzKHQpLnRpbWVzKHQpLmVxKHgpKSB7XHJcbiAgICAgICAgICAgICAgciA9IHQ7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzZCArPSA0O1xyXG4gICAgICAgICAgcmVwID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdHMgYXJlIG51bGwsIDB7MCw0fSBvciA1MHswLDN9LCBjaGVjayBmb3IgYW4gZXhhY3QgcmVzdWx0LlxyXG4gICAgICAgICAgLy8gSWYgbm90LCB0aGVuIHRoZXJlIGFyZSBmdXJ0aGVyIGRpZ2l0cyBhbmQgbSB3aWxsIGJlIHRydXRoeS5cclxuICAgICAgICAgIGlmICghK24gfHwgIStuLnNsaWNlKDEpICYmIG4uY2hhckF0KDApID09ICc1Jykge1xyXG5cclxuICAgICAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgICBmaW5hbGlzZShyLCBlICsgMSwgMSk7XHJcbiAgICAgICAgICAgIG0gPSAhci50aW1lcyhyKS50aW1lcyhyKS5lcSh4KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHIsIGUsIEN0b3Iucm91bmRpbmcsIG0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmRlY2ltYWxQbGFjZXMgPSBQLmRwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHcsXHJcbiAgICAgIGQgPSB0aGlzLmQsXHJcbiAgICAgIG4gPSBOYU47XHJcblxyXG4gICAgaWYgKGQpIHtcclxuICAgICAgdyA9IGQubGVuZ3RoIC0gMTtcclxuICAgICAgbiA9ICh3IC0gbWF0aGZsb29yKHRoaXMuZSAvIExPR19CQVNFKSkgKiBMT0dfQkFTRTtcclxuXHJcbiAgICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3Qgd29yZC5cclxuICAgICAgdyA9IGRbd107XHJcbiAgICAgIGlmICh3KSBmb3IgKDsgdyAlIDEwID09IDA7IHcgLz0gMTApIG4tLTtcclxuICAgICAgaWYgKG4gPCAwKSBuID0gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbjtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgbiAvIDAgPSBJXHJcbiAgICogIG4gLyBOID0gTlxyXG4gICAqICBuIC8gSSA9IDBcclxuICAgKiAgMCAvIG4gPSAwXHJcbiAgICogIDAgLyAwID0gTlxyXG4gICAqICAwIC8gTiA9IE5cclxuICAgKiAgMCAvIEkgPSAwXHJcbiAgICogIE4gLyBuID0gTlxyXG4gICAqICBOIC8gMCA9IE5cclxuICAgKiAgTiAvIE4gPSBOXHJcbiAgICogIE4gLyBJID0gTlxyXG4gICAqICBJIC8gbiA9IElcclxuICAgKiAgSSAvIDAgPSBJXHJcbiAgICogIEkgLyBOID0gTlxyXG4gICAqICBJIC8gSSA9IE5cclxuICAgKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgZGl2aWRlZCBieSBgeWAsIHJvdW5kZWQgdG9cclxuICAgKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5kaXZpZGVkQnkgPSBQLmRpdiA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICByZXR1cm4gZGl2aWRlKHRoaXMsIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHkpKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW50ZWdlciBwYXJ0IG9mIGRpdmlkaW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWxcclxuICAgKiBieSB0aGUgdmFsdWUgb2YgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmRpdmlkZWRUb0ludGVnZXJCeSA9IFAuZGl2VG9JbnQgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuICAgIHJldHVybiBmaW5hbGlzZShkaXZpZGUoeCwgbmV3IEN0b3IoeSksIDAsIDEsIDEpLCBDdG9yLnByZWNpc2lvbiwgQ3Rvci5yb3VuZGluZyk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBlcXVhbCB0byB0aGUgdmFsdWUgb2YgYHlgLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5lcXVhbHMgPSBQLmVxID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHJldHVybiB0aGlzLmNtcCh5KSA9PT0gMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYSB3aG9sZSBudW1iZXIgaW4gdGhlXHJcbiAgICogZGlyZWN0aW9uIG9mIG5lZ2F0aXZlIEluZmluaXR5LlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5mbG9vciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBmaW5hbGlzZShuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgdGhpcy5lICsgMSwgMyk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBncmVhdGVyIHRoYW4gdGhlIHZhbHVlIG9mIGB5YCwgb3RoZXJ3aXNlIHJldHVyblxyXG4gICAqIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5ncmVhdGVyVGhhbiA9IFAuZ3QgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY21wKHkpID4gMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUgb2YgYHlgLFxyXG4gICAqIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmdyZWF0ZXJUaGFuT3JFcXVhbFRvID0gUC5ndGUgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIGsgPSB0aGlzLmNtcCh5KTtcclxuICAgIHJldHVybiBrID09IDEgfHwgayA9PT0gMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgdGhlIHZhbHVlIGluIHJhZGlhbnMgb2YgdGhpc1xyXG4gICAqIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbMSwgSW5maW5pdHldXHJcbiAgICpcclxuICAgKiBjb3NoKHgpID0gMSArIHheMi8yISArIHheNC80ISArIHheNi82ISArIC4uLlxyXG4gICAqXHJcbiAgICogY29zaCgwKSAgICAgICAgID0gMVxyXG4gICAqIGNvc2goLTApICAgICAgICA9IDFcclxuICAgKiBjb3NoKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gICAqIGNvc2goLUluZmluaXR5KSA9IEluZmluaXR5XHJcbiAgICogY29zaChOYU4pICAgICAgID0gTmFOXHJcbiAgICpcclxuICAgKiAgeCAgICAgICAgdGltZSB0YWtlbiAobXMpICAgcmVzdWx0XHJcbiAgICogMTAwMCAgICAgIDkgICAgICAgICAgICAgICAgIDkuODUwMzU1NTcwMDg1MjM0OTY5NGUrNDMzXHJcbiAgICogMTAwMDAgICAgIDI1ICAgICAgICAgICAgICAgIDQuNDAzNDA5MTEyODMxNDYwNzkzNmUrNDM0MlxyXG4gICAqIDEwMDAwMCAgICAxNzEgICAgICAgICAgICAgICAxLjQwMzMzMTY4MDIxMzA2MTU4OTdlKzQzNDI5XHJcbiAgICogMTAwMDAwMCAgIDM4MTcgICAgICAgICAgICAgIDEuNTE2NjA3Njk4NDAxMDQzNzcyNWUrNDM0Mjk0XHJcbiAgICogMTAwMDAwMDAgIGFiYW5kb25lZCBhZnRlciAyIG1pbnV0ZSB3YWl0XHJcbiAgICpcclxuICAgKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIGNvc2goeCkgPSAwLjUgKiAoZXhwKHgpICsgZXhwKC14KSlcclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaHlwZXJib2xpY0Nvc2luZSA9IFAuY29zaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBrLCBuLCBwciwgcm0sIGxlbixcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBvbmUgPSBuZXcgQ3RvcigxKTtcclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKHgucyA/IDEgLyAwIDogTmFOKTtcclxuICAgIGlmICh4LmlzWmVybygpKSByZXR1cm4gb25lO1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgNDtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG4gICAgbGVuID0geC5kLmxlbmd0aDtcclxuXHJcbiAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb246IGNvcyg0eCkgPSAxIC0gOGNvc14yKHgpICsgOGNvc140KHgpICsgMVxyXG4gICAgLy8gaS5lLiBjb3MoeCkgPSAxIC0gY29zXjIoeC80KSg4IC0gOGNvc14yKHgvNCkpXHJcblxyXG4gICAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgLy8gVE9ETz8gRXN0aW1hdGlvbiByZXVzZWQgZnJvbSBjb3NpbmUoKSBhbmQgbWF5IG5vdCBiZSBvcHRpbWFsIGhlcmUuXHJcbiAgICBpZiAobGVuIDwgMzIpIHtcclxuICAgICAgayA9IE1hdGguY2VpbChsZW4gLyAzKTtcclxuICAgICAgbiA9ICgxIC8gdGlueVBvdyg0LCBrKSkudG9TdHJpbmcoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGsgPSAxNjtcclxuICAgICAgbiA9ICcyLjMyODMwNjQzNjUzODY5NjI4OTA2MjVlLTEwJztcclxuICAgIH1cclxuXHJcbiAgICB4ID0gdGF5bG9yU2VyaWVzKEN0b3IsIDEsIHgudGltZXMobiksIG5ldyBDdG9yKDEpLCB0cnVlKTtcclxuXHJcbiAgICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gICAgdmFyIGNvc2gyX3gsXHJcbiAgICAgIGkgPSBrLFxyXG4gICAgICBkOCA9IG5ldyBDdG9yKDgpO1xyXG4gICAgZm9yICg7IGktLTspIHtcclxuICAgICAgY29zaDJfeCA9IHgudGltZXMoeCk7XHJcbiAgICAgIHggPSBvbmUubWludXMoY29zaDJfeC50aW1lcyhkOC5taW51cyhjb3NoMl94LnRpbWVzKGQ4KSkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCwgQ3Rvci5wcmVjaXNpb24gPSBwciwgQ3Rvci5yb3VuZGluZyA9IHJtLCB0cnVlKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBzaW5lIG9mIHRoZSB2YWx1ZSBpbiByYWRpYW5zIG9mIHRoaXNcclxuICAgKiBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICpcclxuICAgKiBzaW5oKHgpID0geCArIHheMy8zISArIHheNS81ISArIHheNy83ISArIC4uLlxyXG4gICAqXHJcbiAgICogc2luaCgwKSAgICAgICAgID0gMFxyXG4gICAqIHNpbmgoLTApICAgICAgICA9IC0wXHJcbiAgICogc2luaChJbmZpbml0eSkgID0gSW5maW5pdHlcclxuICAgKiBzaW5oKC1JbmZpbml0eSkgPSAtSW5maW5pdHlcclxuICAgKiBzaW5oKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqIHggICAgICAgIHRpbWUgdGFrZW4gKG1zKVxyXG4gICAqIDEwICAgICAgIDIgbXNcclxuICAgKiAxMDAgICAgICA1IG1zXHJcbiAgICogMTAwMCAgICAgMTQgbXNcclxuICAgKiAxMDAwMCAgICA4MiBtc1xyXG4gICAqIDEwMDAwMCAgIDg4NiBtcyAgICAgICAgICAgIDEuNDAzMzMxNjgwMjEzMDYxNTg5N2UrNDM0MjlcclxuICAgKiAyMDAwMDAgICAyNjEzIG1zXHJcbiAgICogMzAwMDAwICAgNTQwNyBtc1xyXG4gICAqIDQwMDAwMCAgIDg4MjQgbXNcclxuICAgKiA1MDAwMDAgICAxMzAyNiBtcyAgICAgICAgICA4LjcwODA2NDM2MTI3MTgwODQxMjllKzIxNzE0NlxyXG4gICAqIDEwMDAwMDAgIDQ4NTQzIG1zXHJcbiAgICpcclxuICAgKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIHNpbmgoeCkgPSAwLjUgKiAoZXhwKHgpIC0gZXhwKC14KSlcclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaHlwZXJib2xpY1NpbmUgPSBQLnNpbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaywgcHIsIHJtLCBsZW4sXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSB8fCB4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyBNYXRoLm1heCh4LmUsIHguc2QoKSkgKyA0O1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcbiAgICBsZW4gPSB4LmQubGVuZ3RoO1xyXG5cclxuICAgIGlmIChsZW4gPCAzKSB7XHJcbiAgICAgIHggPSB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCwgdHJ1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gQWx0ZXJuYXRpdmUgYXJndW1lbnQgcmVkdWN0aW9uOiBzaW5oKDN4KSA9IHNpbmgoeCkoMyArIDRzaW5oXjIoeCkpXHJcbiAgICAgIC8vIGkuZS4gc2luaCh4KSA9IHNpbmgoeC8zKSgzICsgNHNpbmheMih4LzMpKVxyXG4gICAgICAvLyAzIG11bHRpcGxpY2F0aW9ucyBhbmQgMSBhZGRpdGlvblxyXG5cclxuICAgICAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBzaW5oKDV4KSA9IHNpbmgoeCkoNSArIHNpbmheMih4KSgyMCArIDE2c2luaF4yKHgpKSlcclxuICAgICAgLy8gaS5lLiBzaW5oKHgpID0gc2luaCh4LzUpKDUgKyBzaW5oXjIoeC81KSgyMCArIDE2c2luaF4yKHgvNSkpKVxyXG4gICAgICAvLyA0IG11bHRpcGxpY2F0aW9ucyBhbmQgMiBhZGRpdGlvbnNcclxuXHJcbiAgICAgIC8vIEVzdGltYXRlIHRoZSBvcHRpbXVtIG51bWJlciBvZiB0aW1lcyB0byB1c2UgdGhlIGFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICAgICAgayA9IDEuNCAqIE1hdGguc3FydChsZW4pO1xyXG4gICAgICBrID0gayA+IDE2ID8gMTYgOiBrIHwgMDtcclxuXHJcbiAgICAgIHggPSB4LnRpbWVzKDEgLyB0aW55UG93KDUsIGspKTtcclxuICAgICAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4LCB0cnVlKTtcclxuXHJcbiAgICAgIC8vIFJldmVyc2UgYXJndW1lbnQgcmVkdWN0aW9uXHJcbiAgICAgIHZhciBzaW5oMl94LFxyXG4gICAgICAgIGQ1ID0gbmV3IEN0b3IoNSksXHJcbiAgICAgICAgZDE2ID0gbmV3IEN0b3IoMTYpLFxyXG4gICAgICAgIGQyMCA9IG5ldyBDdG9yKDIwKTtcclxuICAgICAgZm9yICg7IGstLTspIHtcclxuICAgICAgICBzaW5oMl94ID0geC50aW1lcyh4KTtcclxuICAgICAgICB4ID0geC50aW1lcyhkNS5wbHVzKHNpbmgyX3gudGltZXMoZDE2LnRpbWVzKHNpbmgyX3gpLnBsdXMoZDIwKSkpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHgsIHByLCBybSwgdHJ1ZSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGh5cGVyYm9saWMgdGFuZ2VudCBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzXHJcbiAgICogRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFstMSwgMV1cclxuICAgKlxyXG4gICAqIHRhbmgoeCkgPSBzaW5oKHgpIC8gY29zaCh4KVxyXG4gICAqXHJcbiAgICogdGFuaCgwKSAgICAgICAgID0gMFxyXG4gICAqIHRhbmgoLTApICAgICAgICA9IC0wXHJcbiAgICogdGFuaChJbmZpbml0eSkgID0gMVxyXG4gICAqIHRhbmgoLUluZmluaXR5KSA9IC0xXHJcbiAgICogdGFuaChOYU4pICAgICAgID0gTmFOXHJcbiAgICpcclxuICAgKi9cclxuICBQLmh5cGVyYm9saWNUYW5nZW50ID0gUC50YW5oID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByLCBybSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoeC5zKTtcclxuICAgIGlmICh4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyA3O1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gICAgcmV0dXJuIGRpdmlkZSh4LnNpbmgoKSwgeC5jb3NoKCksIEN0b3IucHJlY2lzaW9uID0gcHIsIEN0b3Iucm91bmRpbmcgPSBybSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY2Nvc2luZSAoaW52ZXJzZSBjb3NpbmUpIGluIHJhZGlhbnMgb2YgdGhlIHZhbHVlIG9mXHJcbiAgICogdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLTEsIDFdXHJcbiAgICogUmFuZ2U6IFswLCBwaV1cclxuICAgKlxyXG4gICAqIGFjb3MoeCkgPSBwaS8yIC0gYXNpbih4KVxyXG4gICAqXHJcbiAgICogYWNvcygwKSAgICAgICA9IHBpLzJcclxuICAgKiBhY29zKC0wKSAgICAgID0gcGkvMlxyXG4gICAqIGFjb3MoMSkgICAgICAgPSAwXHJcbiAgICogYWNvcygtMSkgICAgICA9IHBpXHJcbiAgICogYWNvcygxLzIpICAgICA9IHBpLzNcclxuICAgKiBhY29zKC0xLzIpICAgID0gMipwaS8zXHJcbiAgICogYWNvcyh8eHwgPiAxKSA9IE5hTlxyXG4gICAqIGFjb3MoTmFOKSAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaW52ZXJzZUNvc2luZSA9IFAuYWNvcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBoYWxmUGksXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgayA9IHguYWJzKCkuY21wKDEpLFxyXG4gICAgICBwciA9IEN0b3IucHJlY2lzaW9uLFxyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gICAgaWYgKGsgIT09IC0xKSB7XHJcbiAgICAgIHJldHVybiBrID09PSAwXHJcbiAgICAgICAgLy8gfHh8IGlzIDFcclxuICAgICAgICA/IHguaXNOZWcoKSA/IGdldFBpKEN0b3IsIHByLCBybSkgOiBuZXcgQ3RvcigwKVxyXG4gICAgICAgIC8vIHx4fCA+IDEgb3IgeCBpcyBOYU5cclxuICAgICAgICA6IG5ldyBDdG9yKE5hTik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG5cclxuICAgIC8vIFRPRE8/IFNwZWNpYWwgY2FzZSBhY29zKDAuNSkgPSBwaS8zIGFuZCBhY29zKC0wLjUpID0gMipwaS8zXHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwciArIDY7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICB4ID0geC5hc2luKCk7XHJcbiAgICBoYWxmUGkgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIGhhbGZQaS5taW51cyh4KTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgaHlwZXJib2xpYyBjb3NpbmUgaW4gcmFkaWFucyBvZiB0aGVcclxuICAgKiB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFsxLCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWzAsIEluZmluaXR5XVxyXG4gICAqXHJcbiAgICogYWNvc2goeCkgPSBsbih4ICsgc3FydCh4XjIgLSAxKSlcclxuICAgKlxyXG4gICAqIGFjb3NoKHggPCAxKSAgICAgPSBOYU5cclxuICAgKiBhY29zaChOYU4pICAgICAgID0gTmFOXHJcbiAgICogYWNvc2goSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAgICogYWNvc2goLUluZmluaXR5KSA9IE5hTlxyXG4gICAqIGFjb3NoKDApICAgICAgICAgPSBOYU5cclxuICAgKiBhY29zaCgtMCkgICAgICAgID0gTmFOXHJcbiAgICogYWNvc2goMSkgICAgICAgICA9IDBcclxuICAgKiBhY29zaCgtMSkgICAgICAgID0gTmFOXHJcbiAgICpcclxuICAgKi9cclxuICBQLmludmVyc2VIeXBlcmJvbGljQ29zaW5lID0gUC5hY29zaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwciwgcm0sXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoeC5sdGUoMSkpIHJldHVybiBuZXcgQ3Rvcih4LmVxKDEpID8gMCA6IE5hTik7XHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoTWF0aC5hYnMoeC5lKSwgeC5zZCgpKSArIDQ7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgeCA9IHgudGltZXMoeCkubWludXMoMSkuc3FydCgpLnBsdXMoeCk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4geC5sbigpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIHNpbmUgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWVcclxuICAgKiBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKlxyXG4gICAqIGFzaW5oKHgpID0gbG4oeCArIHNxcnQoeF4yICsgMSkpXHJcbiAgICpcclxuICAgKiBhc2luaChOYU4pICAgICAgID0gTmFOXHJcbiAgICogYXNpbmgoSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAgICogYXNpbmgoLUluZmluaXR5KSA9IC1JbmZpbml0eVxyXG4gICAqIGFzaW5oKDApICAgICAgICAgPSAwXHJcbiAgICogYXNpbmgoLTApICAgICAgICA9IC0wXHJcbiAgICpcclxuICAgKi9cclxuICBQLmludmVyc2VIeXBlcmJvbGljU2luZSA9IFAuYXNpbmggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcHIsIHJtLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKCF4LmlzRmluaXRlKCkgfHwgeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgMiAqIE1hdGgubWF4KE1hdGguYWJzKHguZSksIHguc2QoKSkgKyA2O1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAgIHggPSB4LnRpbWVzKHgpLnBsdXMoMSkuc3FydCgpLnBsdXMoeCk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4geC5sbigpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgaW4gcmFkaWFucyBvZiB0aGVcclxuICAgKiB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstMSwgMV1cclxuICAgKiBSYW5nZTogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICpcclxuICAgKiBhdGFuaCh4KSA9IDAuNSAqIGxuKCgxICsgeCkgLyAoMSAtIHgpKVxyXG4gICAqXHJcbiAgICogYXRhbmgofHh8ID4gMSkgICA9IE5hTlxyXG4gICAqIGF0YW5oKE5hTikgICAgICAgPSBOYU5cclxuICAgKiBhdGFuaChJbmZpbml0eSkgID0gTmFOXHJcbiAgICogYXRhbmgoLUluZmluaXR5KSA9IE5hTlxyXG4gICAqIGF0YW5oKDApICAgICAgICAgPSAwXHJcbiAgICogYXRhbmgoLTApICAgICAgICA9IC0wXHJcbiAgICogYXRhbmgoMSkgICAgICAgICA9IEluZmluaXR5XHJcbiAgICogYXRhbmgoLTEpICAgICAgICA9IC1JbmZpbml0eVxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pbnZlcnNlSHlwZXJib2xpY1RhbmdlbnQgPSBQLmF0YW5oID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByLCBybSwgd3ByLCB4c2QsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgICBpZiAoeC5lID49IDApIHJldHVybiBuZXcgQ3Rvcih4LmFicygpLmVxKDEpID8geC5zIC8gMCA6IHguaXNaZXJvKCkgPyB4IDogTmFOKTtcclxuXHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgeHNkID0geC5zZCgpO1xyXG5cclxuICAgIGlmIChNYXRoLm1heCh4c2QsIHByKSA8IDIgKiAteC5lIC0gMSkgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBwciwgcm0sIHRydWUpO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gd3ByID0geHNkIC0geC5lO1xyXG5cclxuICAgIHggPSBkaXZpZGUoeC5wbHVzKDEpLCBuZXcgQ3RvcigxKS5taW51cyh4KSwgd3ByICsgcHIsIDEpO1xyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyA0O1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gICAgeCA9IHgubG4oKTtcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICAgIHJldHVybiB4LnRpbWVzKDAuNSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3NpbmUgKGludmVyc2Ugc2luZSkgaW4gcmFkaWFucyBvZiB0aGUgdmFsdWUgb2YgdGhpc1xyXG4gICAqIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbLXBpLzIsIHBpLzJdXHJcbiAgICpcclxuICAgKiBhc2luKHgpID0gMiphdGFuKHgvKDEgKyBzcXJ0KDEgLSB4XjIpKSlcclxuICAgKlxyXG4gICAqIGFzaW4oMCkgICAgICAgPSAwXHJcbiAgICogYXNpbigtMCkgICAgICA9IC0wXHJcbiAgICogYXNpbigxLzIpICAgICA9IHBpLzZcclxuICAgKiBhc2luKC0xLzIpICAgID0gLXBpLzZcclxuICAgKiBhc2luKDEpICAgICAgID0gcGkvMlxyXG4gICAqIGFzaW4oLTEpICAgICAgPSAtcGkvMlxyXG4gICAqIGFzaW4ofHh8ID4gMSkgPSBOYU5cclxuICAgKiBhc2luKE5hTikgICAgID0gTmFOXHJcbiAgICpcclxuICAgKiBUT0RPPyBDb21wYXJlIHBlcmZvcm1hbmNlIG9mIFRheWxvciBzZXJpZXMuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmludmVyc2VTaW5lID0gUC5hc2luID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGhhbGZQaSwgayxcclxuICAgICAgcHIsIHJtLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKHguaXNaZXJvKCkpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBrID0geC5hYnMoKS5jbXAoMSk7XHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG5cclxuICAgIGlmIChrICE9PSAtMSkge1xyXG5cclxuICAgICAgLy8gfHh8IGlzIDFcclxuICAgICAgaWYgKGsgPT09IDApIHtcclxuICAgICAgICBoYWxmUGkgPSBnZXRQaShDdG9yLCBwciArIDQsIHJtKS50aW1lcygwLjUpO1xyXG4gICAgICAgIGhhbGZQaS5zID0geC5zO1xyXG4gICAgICAgIHJldHVybiBoYWxmUGk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHx4fCA+IDEgb3IgeCBpcyBOYU5cclxuICAgICAgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVE9ETz8gU3BlY2lhbCBjYXNlIGFzaW4oMS8yKSA9IHBpLzYgYW5kIGFzaW4oLTEvMikgPSAtcGkvNlxyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyA2O1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gICAgeCA9IHguZGl2KG5ldyBDdG9yKDEpLm1pbnVzKHgudGltZXMoeCkpLnNxcnQoKS5wbHVzKDEpKS5hdGFuKCk7XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIEN0b3Iucm91bmRpbmcgPSBybTtcclxuXHJcbiAgICByZXR1cm4geC50aW1lcygyKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjdGFuZ2VudCAoaW52ZXJzZSB0YW5nZW50KSBpbiByYWRpYW5zIG9mIHRoZSB2YWx1ZVxyXG4gICAqIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIERvbWFpbjogWy1JbmZpbml0eSwgSW5maW5pdHldXHJcbiAgICogUmFuZ2U6IFstcGkvMiwgcGkvMl1cclxuICAgKlxyXG4gICAqIGF0YW4oeCkgPSB4IC0geF4zLzMgKyB4XjUvNSAtIHheNy83ICsgLi4uXHJcbiAgICpcclxuICAgKiBhdGFuKDApICAgICAgICAgPSAwXHJcbiAgICogYXRhbigtMCkgICAgICAgID0gLTBcclxuICAgKiBhdGFuKDEpICAgICAgICAgPSBwaS80XHJcbiAgICogYXRhbigtMSkgICAgICAgID0gLXBpLzRcclxuICAgKiBhdGFuKEluZmluaXR5KSAgPSBwaS8yXHJcbiAgICogYXRhbigtSW5maW5pdHkpID0gLXBpLzJcclxuICAgKiBhdGFuKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaW52ZXJzZVRhbmdlbnQgPSBQLmF0YW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaSwgaiwgaywgbiwgcHgsIHQsIHIsIHdwciwgeDIsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgcHIgPSBDdG9yLnByZWNpc2lvbixcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSB7XHJcbiAgICAgIGlmICgheC5zKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICAgICAgaWYgKHByICsgNCA8PSBQSV9QUkVDSVNJT04pIHtcclxuICAgICAgICByID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC41KTtcclxuICAgICAgICByLnMgPSB4LnM7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoeC5pc1plcm8oKSkge1xyXG4gICAgICByZXR1cm4gbmV3IEN0b3IoeCk7XHJcbiAgICB9IGVsc2UgaWYgKHguYWJzKCkuZXEoMSkgJiYgcHIgKyA0IDw9IFBJX1BSRUNJU0lPTikge1xyXG4gICAgICByID0gZ2V0UGkoQ3RvciwgcHIgKyA0LCBybSkudGltZXMoMC4yNSk7XHJcbiAgICAgIHIucyA9IHgucztcclxuICAgICAgcmV0dXJuIHI7XHJcbiAgICB9XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgPSBwciArIDEwO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IDE7XHJcblxyXG4gICAgLy8gVE9ETz8gaWYgKHggPj0gMSAmJiBwciA8PSBQSV9QUkVDSVNJT04pIGF0YW4oeCkgPSBoYWxmUGkgKiB4LnMgLSBhdGFuKDEgLyB4KTtcclxuXHJcbiAgICAvLyBBcmd1bWVudCByZWR1Y3Rpb25cclxuICAgIC8vIEVuc3VyZSB8eHwgPCAwLjQyXHJcbiAgICAvLyBhdGFuKHgpID0gMiAqIGF0YW4oeCAvICgxICsgc3FydCgxICsgeF4yKSkpXHJcblxyXG4gICAgayA9IE1hdGgubWluKDI4LCB3cHIgLyBMT0dfQkFTRSArIDIgfCAwKTtcclxuXHJcbiAgICBmb3IgKGkgPSBrOyBpOyAtLWkpIHggPSB4LmRpdih4LnRpbWVzKHgpLnBsdXMoMSkuc3FydCgpLnBsdXMoMSkpO1xyXG5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcblxyXG4gICAgaiA9IE1hdGguY2VpbCh3cHIgLyBMT0dfQkFTRSk7XHJcbiAgICBuID0gMTtcclxuICAgIHgyID0geC50aW1lcyh4KTtcclxuICAgIHIgPSBuZXcgQ3Rvcih4KTtcclxuICAgIHB4ID0geDtcclxuXHJcbiAgICAvLyBhdGFuKHgpID0geCAtIHheMy8zICsgeF41LzUgLSB4XjcvNyArIC4uLlxyXG4gICAgZm9yICg7IGkgIT09IC0xOykge1xyXG4gICAgICBweCA9IHB4LnRpbWVzKHgyKTtcclxuICAgICAgdCA9IHIubWludXMocHguZGl2KG4gKz0gMikpO1xyXG5cclxuICAgICAgcHggPSBweC50aW1lcyh4Mik7XHJcbiAgICAgIHIgPSB0LnBsdXMocHguZGl2KG4gKz0gMikpO1xyXG5cclxuICAgICAgaWYgKHIuZFtqXSAhPT0gdm9pZCAwKSBmb3IgKGkgPSBqOyByLmRbaV0gPT09IHQuZFtpXSAmJiBpLS07KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaykgciA9IHIudGltZXMoMiA8PCAoayAtIDEpKTtcclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHIsIEN0b3IucHJlY2lzaW9uID0gcHIsIEN0b3Iucm91bmRpbmcgPSBybSwgdHJ1ZSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBhIGZpbml0ZSBudW1iZXIsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmlzRmluaXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICEhdGhpcy5kO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgYW4gaW50ZWdlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaXNJbnRlZ2VyID0gUC5pc0ludCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAhIXRoaXMuZCAmJiBtYXRoZmxvb3IodGhpcy5lIC8gTE9HX0JBU0UpID4gdGhpcy5kLmxlbmd0aCAtIDI7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBOYU4sIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmlzTmFOID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICF0aGlzLnM7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpcyBuZWdhdGl2ZSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaXNOZWdhdGl2ZSA9IFAuaXNOZWcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zIDwgMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIHBvc2l0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5pc1Bvc2l0aXZlID0gUC5pc1BvcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLnMgPiAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgMCBvciAtMCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAuaXNaZXJvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICEhdGhpcy5kICYmIHRoaXMuZFswXSA9PT0gMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGlzIGxlc3MgdGhhbiBgeWAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICpcclxuICAgKi9cclxuICBQLmxlc3NUaGFuID0gUC5sdCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbXAoeSkgPCAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGB5YCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAubGVzc1RoYW5PckVxdWFsVG8gPSBQLmx0ZSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5jbXAoeSkgPCAxO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0aGUgbG9nYXJpdGhtIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgdG8gdGhlIHNwZWNpZmllZCBiYXNlLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIElmIG5vIGJhc2UgaXMgc3BlY2lmaWVkLCByZXR1cm4gbG9nWzEwXShhcmcpLlxyXG4gICAqXHJcbiAgICogbG9nW2Jhc2VdKGFyZykgPSBsbihhcmcpIC8gbG4oYmFzZSlcclxuICAgKlxyXG4gICAqIFRoZSByZXN1bHQgd2lsbCBhbHdheXMgYmUgY29ycmVjdGx5IHJvdW5kZWQgaWYgdGhlIGJhc2Ugb2YgdGhlIGxvZyBpcyAxMCwgYW5kICdhbG1vc3QgYWx3YXlzJ1xyXG4gICAqIG90aGVyd2lzZTpcclxuICAgKlxyXG4gICAqIERlcGVuZGluZyBvbiB0aGUgcm91bmRpbmcgbW9kZSwgdGhlIHJlc3VsdCBtYXkgYmUgaW5jb3JyZWN0bHkgcm91bmRlZCBpZiB0aGUgZmlyc3QgZmlmdGVlblxyXG4gICAqIHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OTk5OTk5OTk5OTk5IG9yIFs1MF0wMDAwMDAwMDAwMDAwMC4gSW4gdGhhdCBjYXNlLCB0aGUgbWF4aW11bSBlcnJvclxyXG4gICAqIGJldHdlZW4gdGhlIHJlc3VsdCBhbmQgdGhlIGNvcnJlY3RseSByb3VuZGVkIHJlc3VsdCB3aWxsIGJlIG9uZSB1bHAgKHVuaXQgaW4gdGhlIGxhc3QgcGxhY2UpLlxyXG4gICAqXHJcbiAgICogbG9nWy1iXShhKSAgICAgICA9IE5hTlxyXG4gICAqIGxvZ1swXShhKSAgICAgICAgPSBOYU5cclxuICAgKiBsb2dbMV0oYSkgICAgICAgID0gTmFOXHJcbiAgICogbG9nW05hTl0oYSkgICAgICA9IE5hTlxyXG4gICAqIGxvZ1tJbmZpbml0eV0oYSkgPSBOYU5cclxuICAgKiBsb2dbYl0oMCkgICAgICAgID0gLUluZmluaXR5XHJcbiAgICogbG9nW2JdKC0wKSAgICAgICA9IC1JbmZpbml0eVxyXG4gICAqIGxvZ1tiXSgtYSkgICAgICAgPSBOYU5cclxuICAgKiBsb2dbYl0oMSkgICAgICAgID0gMFxyXG4gICAqIGxvZ1tiXShJbmZpbml0eSkgPSBJbmZpbml0eVxyXG4gICAqIGxvZ1tiXShOYU4pICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqIFtiYXNlXSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZSBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5sb2dhcml0aG0gPSBQLmxvZyA9IGZ1bmN0aW9uIChiYXNlKSB7XHJcbiAgICB2YXIgaXNCYXNlMTAsIGQsIGRlbm9taW5hdG9yLCBrLCBpbmYsIG51bSwgc2QsIHIsXHJcbiAgICAgIGFyZyA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSBhcmcuY29uc3RydWN0b3IsXHJcbiAgICAgIHByID0gQ3Rvci5wcmVjaXNpb24sXHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZyxcclxuICAgICAgZ3VhcmQgPSA1O1xyXG5cclxuICAgIC8vIERlZmF1bHQgYmFzZSBpcyAxMC5cclxuICAgIGlmIChiYXNlID09IG51bGwpIHtcclxuICAgICAgYmFzZSA9IG5ldyBDdG9yKDEwKTtcclxuICAgICAgaXNCYXNlMTAgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYmFzZSA9IG5ldyBDdG9yKGJhc2UpO1xyXG4gICAgICBkID0gYmFzZS5kO1xyXG5cclxuICAgICAgLy8gUmV0dXJuIE5hTiBpZiBiYXNlIGlzIG5lZ2F0aXZlLCBvciBub24tZmluaXRlLCBvciBpcyAwIG9yIDEuXHJcbiAgICAgIGlmIChiYXNlLnMgPCAwIHx8ICFkIHx8ICFkWzBdIHx8IGJhc2UuZXEoMSkpIHJldHVybiBuZXcgQ3RvcihOYU4pO1xyXG5cclxuICAgICAgaXNCYXNlMTAgPSBiYXNlLmVxKDEwKTtcclxuICAgIH1cclxuXHJcbiAgICBkID0gYXJnLmQ7XHJcblxyXG4gICAgLy8gSXMgYXJnIG5lZ2F0aXZlLCBub24tZmluaXRlLCAwIG9yIDE/XHJcbiAgICBpZiAoYXJnLnMgPCAwIHx8ICFkIHx8ICFkWzBdIHx8IGFyZy5lcSgxKSkge1xyXG4gICAgICByZXR1cm4gbmV3IEN0b3IoZCAmJiAhZFswXSA/IC0xIC8gMCA6IGFyZy5zICE9IDEgPyBOYU4gOiBkID8gMCA6IDEgLyAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUaGUgcmVzdWx0IHdpbGwgaGF2ZSBhIG5vbi10ZXJtaW5hdGluZyBkZWNpbWFsIGV4cGFuc2lvbiBpZiBiYXNlIGlzIDEwIGFuZCBhcmcgaXMgbm90IGFuXHJcbiAgICAvLyBpbnRlZ2VyIHBvd2VyIG9mIDEwLlxyXG4gICAgaWYgKGlzQmFzZTEwKSB7XHJcbiAgICAgIGlmIChkLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICBpbmYgPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvciAoayA9IGRbMF07IGsgJSAxMCA9PT0gMDspIGsgLz0gMTA7XHJcbiAgICAgICAgaW5mID0gayAhPT0gMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICBzZCA9IHByICsgZ3VhcmQ7XHJcbiAgICBudW0gPSBuYXR1cmFsTG9nYXJpdGhtKGFyZywgc2QpO1xyXG4gICAgZGVub21pbmF0b3IgPSBpc0Jhc2UxMCA/IGdldExuMTAoQ3Rvciwgc2QgKyAxMCkgOiBuYXR1cmFsTG9nYXJpdGhtKGJhc2UsIHNkKTtcclxuXHJcbiAgICAvLyBUaGUgcmVzdWx0IHdpbGwgaGF2ZSA1IHJvdW5kaW5nIGRpZ2l0cy5cclxuICAgIHIgPSBkaXZpZGUobnVtLCBkZW5vbWluYXRvciwgc2QsIDEpO1xyXG5cclxuICAgIC8vIElmIGF0IGEgcm91bmRpbmcgYm91bmRhcnksIGkuZS4gdGhlIHJlc3VsdCdzIHJvdW5kaW5nIGRpZ2l0cyBhcmUgWzQ5XTk5OTkgb3IgWzUwXTAwMDAsXHJcbiAgICAvLyBjYWxjdWxhdGUgMTAgZnVydGhlciBkaWdpdHMuXHJcbiAgICAvL1xyXG4gICAgLy8gSWYgdGhlIHJlc3VsdCBpcyBrbm93biB0byBoYXZlIGFuIGluZmluaXRlIGRlY2ltYWwgZXhwYW5zaW9uLCByZXBlYXQgdGhpcyB1bnRpbCBpdCBpcyBjbGVhclxyXG4gICAgLy8gdGhhdCB0aGUgcmVzdWx0IGlzIGFib3ZlIG9yIGJlbG93IHRoZSBib3VuZGFyeS4gT3RoZXJ3aXNlLCBpZiBhZnRlciBjYWxjdWxhdGluZyB0aGUgMTBcclxuICAgIC8vIGZ1cnRoZXIgZGlnaXRzLCB0aGUgbGFzdCAxNCBhcmUgbmluZXMsIHJvdW5kIHVwIGFuZCBhc3N1bWUgdGhlIHJlc3VsdCBpcyBleGFjdC5cclxuICAgIC8vIEFsc28gYXNzdW1lIHRoZSByZXN1bHQgaXMgZXhhY3QgaWYgdGhlIGxhc3QgMTQgYXJlIHplcm8uXHJcbiAgICAvL1xyXG4gICAgLy8gRXhhbXBsZSBvZiBhIHJlc3VsdCB0aGF0IHdpbGwgYmUgaW5jb3JyZWN0bHkgcm91bmRlZDpcclxuICAgIC8vIGxvZ1sxMDQ4NTc2XSg0NTAzNTk5NjI3MzcwNTAyKSA9IDIuNjAwMDAwMDAwMDAwMDAwMDk2MTAyNzk1MTE0NDQ3NDYuLi5cclxuICAgIC8vIFRoZSBhYm92ZSByZXN1bHQgY29ycmVjdGx5IHJvdW5kZWQgdXNpbmcgUk9VTkRfQ0VJTCB0byAxIGRlY2ltYWwgcGxhY2Ugc2hvdWxkIGJlIDIuNywgYnV0IGl0XHJcbiAgICAvLyB3aWxsIGJlIGdpdmVuIGFzIDIuNiBhcyB0aGVyZSBhcmUgMTUgemVyb3MgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIHJlcXVlc3RlZCBkZWNpbWFsIHBsYWNlLCBzb1xyXG4gICAgLy8gdGhlIGV4YWN0IHJlc3VsdCB3b3VsZCBiZSBhc3N1bWVkIHRvIGJlIDIuNiwgd2hpY2ggcm91bmRlZCB1c2luZyBST1VORF9DRUlMIHRvIDEgZGVjaW1hbFxyXG4gICAgLy8gcGxhY2UgaXMgc3RpbGwgMi42LlxyXG4gICAgaWYgKGNoZWNrUm91bmRpbmdEaWdpdHMoci5kLCBrID0gcHIsIHJtKSkge1xyXG5cclxuICAgICAgZG8ge1xyXG4gICAgICAgIHNkICs9IDEwO1xyXG4gICAgICAgIG51bSA9IG5hdHVyYWxMb2dhcml0aG0oYXJnLCBzZCk7XHJcbiAgICAgICAgZGVub21pbmF0b3IgPSBpc0Jhc2UxMCA/IGdldExuMTAoQ3Rvciwgc2QgKyAxMCkgOiBuYXR1cmFsTG9nYXJpdGhtKGJhc2UsIHNkKTtcclxuICAgICAgICByID0gZGl2aWRlKG51bSwgZGVub21pbmF0b3IsIHNkLCAxKTtcclxuXHJcbiAgICAgICAgaWYgKCFpbmYpIHtcclxuXHJcbiAgICAgICAgICAvLyBDaGVjayBmb3IgMTQgbmluZXMgZnJvbSB0aGUgMm5kIHJvdW5kaW5nIGRpZ2l0LCBhcyB0aGUgZmlyc3QgbWF5IGJlIDQuXHJcbiAgICAgICAgICBpZiAoK2RpZ2l0c1RvU3RyaW5nKHIuZCkuc2xpY2UoayArIDEsIGsgKyAxNSkgKyAxID09IDFlMTQpIHtcclxuICAgICAgICAgICAgciA9IGZpbmFsaXNlKHIsIHByICsgMSwgMCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IHdoaWxlIChjaGVja1JvdW5kaW5nRGlnaXRzKHIuZCwgayArPSAxMCwgcm0pKTtcclxuICAgIH1cclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1heGltdW0gb2YgdGhlIGFyZ3VtZW50cyBhbmQgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbC5cclxuICAgKlxyXG4gICAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgUC5tYXggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKGFyZ3VtZW50cywgdGhpcyk7XHJcbiAgICByZXR1cm4gbWF4T3JNaW4odGhpcy5jb25zdHJ1Y3RvciwgYXJndW1lbnRzLCAnbHQnKTtcclxuICB9O1xyXG4gICAqL1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbWluaW11bSBvZiB0aGUgYXJndW1lbnRzIGFuZCB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICBQLm1pbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwoYXJndW1lbnRzLCB0aGlzKTtcclxuICAgIHJldHVybiBtYXhPck1pbih0aGlzLmNvbnN0cnVjdG9yLCBhcmd1bWVudHMsICdndCcpO1xyXG4gIH07XHJcbiAgICovXHJcblxyXG5cclxuICAvKlxyXG4gICAqICBuIC0gMCA9IG5cclxuICAgKiAgbiAtIE4gPSBOXHJcbiAgICogIG4gLSBJID0gLUlcclxuICAgKiAgMCAtIG4gPSAtblxyXG4gICAqICAwIC0gMCA9IDBcclxuICAgKiAgMCAtIE4gPSBOXHJcbiAgICogIDAgLSBJID0gLUlcclxuICAgKiAgTiAtIG4gPSBOXHJcbiAgICogIE4gLSAwID0gTlxyXG4gICAqICBOIC0gTiA9IE5cclxuICAgKiAgTiAtIEkgPSBOXHJcbiAgICogIEkgLSBuID0gSVxyXG4gICAqICBJIC0gMCA9IElcclxuICAgKiAgSSAtIE4gPSBOXHJcbiAgICogIEkgLSBJID0gTlxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBtaW51cyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5taW51cyA9IFAuc3ViID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHZhciBkLCBlLCBpLCBqLCBrLCBsZW4sIHByLCBybSwgeGQsIHhlLCB4TFR5LCB5ZCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIHkgPSBuZXcgQ3Rvcih5KTtcclxuXHJcbiAgICAvLyBJZiBlaXRoZXIgaXMgbm90IGZpbml0ZS4uLlxyXG4gICAgaWYgKCF4LmQgfHwgIXkuZCkge1xyXG5cclxuICAgICAgLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgaXMgTmFOLlxyXG4gICAgICBpZiAoIXgucyB8fCAheS5zKSB5ID0gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAgIC8vIFJldHVybiB5IG5lZ2F0ZWQgaWYgeCBpcyBmaW5pdGUgYW5kIHkgaXMgwrFJbmZpbml0eS5cclxuICAgICAgZWxzZSBpZiAoeC5kKSB5LnMgPSAteS5zO1xyXG5cclxuICAgICAgLy8gUmV0dXJuIHggaWYgeSBpcyBmaW5pdGUgYW5kIHggaXMgwrFJbmZpbml0eS5cclxuICAgICAgLy8gUmV0dXJuIHggaWYgYm90aCBhcmUgwrFJbmZpbml0eSB3aXRoIGRpZmZlcmVudCBzaWducy5cclxuICAgICAgLy8gUmV0dXJuIE5hTiBpZiBib3RoIGFyZSDCsUluZmluaXR5IHdpdGggdGhlIHNhbWUgc2lnbi5cclxuICAgICAgZWxzZSB5ID0gbmV3IEN0b3IoeS5kIHx8IHgucyAhPT0geS5zID8geCA6IE5hTik7XHJcblxyXG4gICAgICByZXR1cm4geTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiBzaWducyBkaWZmZXIuLi5cclxuICAgIGlmICh4LnMgIT0geS5zKSB7XHJcbiAgICAgIHkucyA9IC15LnM7XHJcbiAgICAgIHJldHVybiB4LnBsdXMoeSk7XHJcbiAgICB9XHJcblxyXG4gICAgeGQgPSB4LmQ7XHJcbiAgICB5ZCA9IHkuZDtcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gICAgLy8gSWYgZWl0aGVyIGlzIHplcm8uLi5cclxuICAgIGlmICgheGRbMF0gfHwgIXlkWzBdKSB7XHJcblxyXG4gICAgICAvLyBSZXR1cm4geSBuZWdhdGVkIGlmIHggaXMgemVybyBhbmQgeSBpcyBub24temVyby5cclxuICAgICAgaWYgKHlkWzBdKSB5LnMgPSAteS5zO1xyXG5cclxuICAgICAgLy8gUmV0dXJuIHggaWYgeSBpcyB6ZXJvIGFuZCB4IGlzIG5vbi16ZXJvLlxyXG4gICAgICBlbHNlIGlmICh4ZFswXSkgeSA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICAgICAgLy8gUmV0dXJuIHplcm8gaWYgYm90aCBhcmUgemVyby5cclxuICAgICAgLy8gRnJvbSBJRUVFIDc1NCAoMjAwOCkgNi4zOiAwIC0gMCA9IC0wIC0gLTAgPSAtMCB3aGVuIHJvdW5kaW5nIHRvIC1JbmZpbml0eS5cclxuICAgICAgZWxzZSByZXR1cm4gbmV3IEN0b3Iocm0gPT09IDMgPyAtMCA6IDApO1xyXG5cclxuICAgICAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8geCBhbmQgeSBhcmUgZmluaXRlLCBub24temVybyBudW1iZXJzIHdpdGggdGhlIHNhbWUgc2lnbi5cclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgYmFzZSAxZTcgZXhwb25lbnRzLlxyXG4gICAgZSA9IG1hdGhmbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcbiAgICB4ZSA9IG1hdGhmbG9vcih4LmUgLyBMT0dfQkFTRSk7XHJcblxyXG4gICAgeGQgPSB4ZC5zbGljZSgpO1xyXG4gICAgayA9IHhlIC0gZTtcclxuXHJcbiAgICAvLyBJZiBiYXNlIDFlNyBleHBvbmVudHMgZGlmZmVyLi4uXHJcbiAgICBpZiAoaykge1xyXG4gICAgICB4TFR5ID0gayA8IDA7XHJcblxyXG4gICAgICBpZiAoeExUeSkge1xyXG4gICAgICAgIGQgPSB4ZDtcclxuICAgICAgICBrID0gLWs7XHJcbiAgICAgICAgbGVuID0geWQubGVuZ3RoO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGQgPSB5ZDtcclxuICAgICAgICBlID0geGU7XHJcbiAgICAgICAgbGVuID0geGQubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBOdW1iZXJzIHdpdGggbWFzc2l2ZWx5IGRpZmZlcmVudCBleHBvbmVudHMgd291bGQgcmVzdWx0IGluIGEgdmVyeSBoaWdoIG51bWJlciBvZlxyXG4gICAgICAvLyB6ZXJvcyBuZWVkaW5nIHRvIGJlIHByZXBlbmRlZCwgYnV0IHRoaXMgY2FuIGJlIGF2b2lkZWQgd2hpbGUgc3RpbGwgZW5zdXJpbmcgY29ycmVjdFxyXG4gICAgICAvLyByb3VuZGluZyBieSBsaW1pdGluZyB0aGUgbnVtYmVyIG9mIHplcm9zIHRvIGBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSkgKyAyYC5cclxuICAgICAgaSA9IE1hdGgubWF4KE1hdGguY2VpbChwciAvIExPR19CQVNFKSwgbGVuKSArIDI7XHJcblxyXG4gICAgICBpZiAoayA+IGkpIHtcclxuICAgICAgICBrID0gaTtcclxuICAgICAgICBkLmxlbmd0aCA9IDE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFByZXBlbmQgemVyb3MgdG8gZXF1YWxpc2UgZXhwb25lbnRzLlxyXG4gICAgICBkLnJldmVyc2UoKTtcclxuICAgICAgZm9yIChpID0gazsgaS0tOykgZC5wdXNoKDApO1xyXG4gICAgICBkLnJldmVyc2UoKTtcclxuXHJcbiAgICAvLyBCYXNlIDFlNyBleHBvbmVudHMgZXF1YWwuXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gQ2hlY2sgZGlnaXRzIHRvIGRldGVybWluZSB3aGljaCBpcyB0aGUgYmlnZ2VyIG51bWJlci5cclxuXHJcbiAgICAgIGkgPSB4ZC5sZW5ndGg7XHJcbiAgICAgIGxlbiA9IHlkLmxlbmd0aDtcclxuICAgICAgeExUeSA9IGkgPCBsZW47XHJcbiAgICAgIGlmICh4TFR5KSBsZW4gPSBpO1xyXG5cclxuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHhkW2ldICE9IHlkW2ldKSB7XHJcbiAgICAgICAgICB4TFR5ID0geGRbaV0gPCB5ZFtpXTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgayA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHhMVHkpIHtcclxuICAgICAgZCA9IHhkO1xyXG4gICAgICB4ZCA9IHlkO1xyXG4gICAgICB5ZCA9IGQ7XHJcbiAgICAgIHkucyA9IC15LnM7XHJcbiAgICB9XHJcblxyXG4gICAgbGVuID0geGQubGVuZ3RoO1xyXG5cclxuICAgIC8vIEFwcGVuZCB6ZXJvcyB0byBgeGRgIGlmIHNob3J0ZXIuXHJcbiAgICAvLyBEb24ndCBhZGQgemVyb3MgdG8gYHlkYCBpZiBzaG9ydGVyIGFzIHN1YnRyYWN0aW9uIG9ubHkgbmVlZHMgdG8gc3RhcnQgYXQgYHlkYCBsZW5ndGguXHJcbiAgICBmb3IgKGkgPSB5ZC5sZW5ndGggLSBsZW47IGkgPiAwOyAtLWkpIHhkW2xlbisrXSA9IDA7XHJcblxyXG4gICAgLy8gU3VidHJhY3QgeWQgZnJvbSB4ZC5cclxuICAgIGZvciAoaSA9IHlkLmxlbmd0aDsgaSA+IGs7KSB7XHJcblxyXG4gICAgICBpZiAoeGRbLS1pXSA8IHlkW2ldKSB7XHJcbiAgICAgICAgZm9yIChqID0gaTsgaiAmJiB4ZFstLWpdID09PSAwOykgeGRbal0gPSBCQVNFIC0gMTtcclxuICAgICAgICAtLXhkW2pdO1xyXG4gICAgICAgIHhkW2ldICs9IEJBU0U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHhkW2ldIC09IHlkW2ldO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoOyB4ZFstLWxlbl0gPT09IDA7KSB4ZC5wb3AoKTtcclxuXHJcbiAgICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gICAgZm9yICg7IHhkWzBdID09PSAwOyB4ZC5zaGlmdCgpKSAtLWU7XHJcblxyXG4gICAgLy8gWmVybz9cclxuICAgIGlmICgheGRbMF0pIHJldHVybiBuZXcgQ3RvcihybSA9PT0gMyA/IC0wIDogMCk7XHJcblxyXG4gICAgeS5kID0geGQ7XHJcbiAgICB5LmUgPSBnZXRCYXNlMTBFeHBvbmVudCh4ZCwgZSk7XHJcblxyXG4gICAgcmV0dXJuIGV4dGVybmFsID8gZmluYWxpc2UoeSwgcHIsIHJtKSA6IHk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogICBuICUgMCA9ICBOXHJcbiAgICogICBuICUgTiA9ICBOXHJcbiAgICogICBuICUgSSA9ICBuXHJcbiAgICogICAwICUgbiA9ICAwXHJcbiAgICogIC0wICUgbiA9IC0wXHJcbiAgICogICAwICUgMCA9ICBOXHJcbiAgICogICAwICUgTiA9ICBOXHJcbiAgICogICAwICUgSSA9ICAwXHJcbiAgICogICBOICUgbiA9ICBOXHJcbiAgICogICBOICUgMCA9ICBOXHJcbiAgICogICBOICUgTiA9ICBOXHJcbiAgICogICBOICUgSSA9ICBOXHJcbiAgICogICBJICUgbiA9ICBOXHJcbiAgICogICBJICUgMCA9ICBOXHJcbiAgICogICBJICUgTiA9ICBOXHJcbiAgICogICBJICUgSSA9ICBOXHJcbiAgICpcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIG1vZHVsbyBgeWAsIHJvdW5kZWQgdG9cclxuICAgKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogVGhlIHJlc3VsdCBkZXBlbmRzIG9uIHRoZSBtb2R1bG8gbW9kZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAubW9kdWxvID0gUC5tb2QgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIHEsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICB5ID0gbmV3IEN0b3IoeSk7XHJcblxyXG4gICAgLy8gUmV0dXJuIE5hTiBpZiB4IGlzIMKxSW5maW5pdHkgb3IgTmFOLCBvciB5IGlzIE5hTiBvciDCsTAuXHJcbiAgICBpZiAoIXguZCB8fCAheS5zIHx8IHkuZCAmJiAheS5kWzBdKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIMKxSW5maW5pdHkgb3IgeCBpcyDCsTAuXHJcbiAgICBpZiAoIXkuZCB8fCB4LmQgJiYgIXguZFswXSkge1xyXG4gICAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIEN0b3IucHJlY2lzaW9uLCBDdG9yLnJvdW5kaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQcmV2ZW50IHJvdW5kaW5nIG9mIGludGVybWVkaWF0ZSBjYWxjdWxhdGlvbnMuXHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAgIGlmIChDdG9yLm1vZHVsbyA9PSA5KSB7XHJcblxyXG4gICAgICAvLyBFdWNsaWRpYW4gZGl2aXNpb246IHEgPSBzaWduKHkpICogZmxvb3IoeCAvIGFicyh5KSlcclxuICAgICAgLy8gcmVzdWx0ID0geCAtIHEgKiB5ICAgIHdoZXJlICAwIDw9IHJlc3VsdCA8IGFicyh5KVxyXG4gICAgICBxID0gZGl2aWRlKHgsIHkuYWJzKCksIDAsIDMsIDEpO1xyXG4gICAgICBxLnMgKj0geS5zO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcSA9IGRpdmlkZSh4LCB5LCAwLCBDdG9yLm1vZHVsbywgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcSA9IHEudGltZXMoeSk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiB4Lm1pbnVzKHEpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGV4cG9uZW50aWFsIG9mIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwsXHJcbiAgICogaS5lLiB0aGUgYmFzZSBlIHJhaXNlZCB0byB0aGUgcG93ZXIgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLm5hdHVyYWxFeHBvbmVudGlhbCA9IFAuZXhwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIG5hdHVyYWxFeHBvbmVudGlhbCh0aGlzKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgbmF0dXJhbCBsb2dhcml0aG0gb2YgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCxcclxuICAgKiByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBQLm5hdHVyYWxMb2dhcml0aG0gPSBQLmxuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIG5hdHVyYWxMb2dhcml0aG0odGhpcyk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBuZWdhdGVkLCBpLmUuIGFzIGlmIG11bHRpcGxpZWQgYnlcclxuICAgKiAtMS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAubmVnYXRlZCA9IFAubmVnID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICAgIHgucyA9IC14LnM7XHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogIG4gKyAwID0gblxyXG4gICAqICBuICsgTiA9IE5cclxuICAgKiAgbiArIEkgPSBJXHJcbiAgICogIDAgKyBuID0gblxyXG4gICAqICAwICsgMCA9IDBcclxuICAgKiAgMCArIE4gPSBOXHJcbiAgICogIDAgKyBJID0gSVxyXG4gICAqICBOICsgbiA9IE5cclxuICAgKiAgTiArIDAgPSBOXHJcbiAgICogIE4gKyBOID0gTlxyXG4gICAqICBOICsgSSA9IE5cclxuICAgKiAgSSArIG4gPSBJXHJcbiAgICogIEkgKyAwID0gSVxyXG4gICAqICBJICsgTiA9IE5cclxuICAgKiAgSSArIEkgPSBJXHJcbiAgICpcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHBsdXMgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAucGx1cyA9IFAuYWRkID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHZhciBjYXJyeSwgZCwgZSwgaSwgaywgbGVuLCBwciwgcm0sIHhkLCB5ZCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIHkgPSBuZXcgQ3Rvcih5KTtcclxuXHJcbiAgICAvLyBJZiBlaXRoZXIgaXMgbm90IGZpbml0ZS4uLlxyXG4gICAgaWYgKCF4LmQgfHwgIXkuZCkge1xyXG5cclxuICAgICAgLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgaXMgTmFOLlxyXG4gICAgICBpZiAoIXgucyB8fCAheS5zKSB5ID0gbmV3IEN0b3IoTmFOKTtcclxuXHJcbiAgICAgIC8vIFJldHVybiB4IGlmIHkgaXMgZmluaXRlIGFuZCB4IGlzIMKxSW5maW5pdHkuXHJcbiAgICAgIC8vIFJldHVybiB4IGlmIGJvdGggYXJlIMKxSW5maW5pdHkgd2l0aCB0aGUgc2FtZSBzaWduLlxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIGJvdGggYXJlIMKxSW5maW5pdHkgd2l0aCBkaWZmZXJlbnQgc2lnbnMuXHJcbiAgICAgIC8vIFJldHVybiB5IGlmIHggaXMgZmluaXRlIGFuZCB5IGlzIMKxSW5maW5pdHkuXHJcbiAgICAgIGVsc2UgaWYgKCF4LmQpIHkgPSBuZXcgQ3Rvcih5LmQgfHwgeC5zID09PSB5LnMgPyB4IDogTmFOKTtcclxuXHJcbiAgICAgIHJldHVybiB5O1xyXG4gICAgfVxyXG5cclxuICAgICAvLyBJZiBzaWducyBkaWZmZXIuLi5cclxuICAgIGlmICh4LnMgIT0geS5zKSB7XHJcbiAgICAgIHkucyA9IC15LnM7XHJcbiAgICAgIHJldHVybiB4Lm1pbnVzKHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHhkID0geC5kO1xyXG4gICAgeWQgPSB5LmQ7XHJcbiAgICBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG5cclxuICAgIC8vIElmIGVpdGhlciBpcyB6ZXJvLi4uXHJcbiAgICBpZiAoIXhkWzBdIHx8ICF5ZFswXSkge1xyXG5cclxuICAgICAgLy8gUmV0dXJuIHggaWYgeSBpcyB6ZXJvLlxyXG4gICAgICAvLyBSZXR1cm4geSBpZiB5IGlzIG5vbi16ZXJvLlxyXG4gICAgICBpZiAoIXlkWzBdKSB5ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBwciwgcm0pIDogeTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB4IGFuZCB5IGFyZSBmaW5pdGUsIG5vbi16ZXJvIG51bWJlcnMgd2l0aCB0aGUgc2FtZSBzaWduLlxyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBiYXNlIDFlNyBleHBvbmVudHMuXHJcbiAgICBrID0gbWF0aGZsb29yKHguZSAvIExPR19CQVNFKTtcclxuICAgIGUgPSBtYXRoZmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xyXG5cclxuICAgIHhkID0geGQuc2xpY2UoKTtcclxuICAgIGkgPSBrIC0gZTtcclxuXHJcbiAgICAvLyBJZiBiYXNlIDFlNyBleHBvbmVudHMgZGlmZmVyLi4uXHJcbiAgICBpZiAoaSkge1xyXG5cclxuICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgZCA9IHhkO1xyXG4gICAgICAgIGkgPSAtaTtcclxuICAgICAgICBsZW4gPSB5ZC5sZW5ndGg7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZCA9IHlkO1xyXG4gICAgICAgIGUgPSBrO1xyXG4gICAgICAgIGxlbiA9IHhkLmxlbmd0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gTGltaXQgbnVtYmVyIG9mIHplcm9zIHByZXBlbmRlZCB0byBtYXgoY2VpbChwciAvIExPR19CQVNFKSwgbGVuKSArIDEuXHJcbiAgICAgIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSk7XHJcbiAgICAgIGxlbiA9IGsgPiBsZW4gPyBrICsgMSA6IGxlbiArIDE7XHJcblxyXG4gICAgICBpZiAoaSA+IGxlbikge1xyXG4gICAgICAgIGkgPSBsZW47XHJcbiAgICAgICAgZC5sZW5ndGggPSAxO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQcmVwZW5kIHplcm9zIHRvIGVxdWFsaXNlIGV4cG9uZW50cy4gTm90ZTogRmFzdGVyIHRvIHVzZSByZXZlcnNlIHRoZW4gZG8gdW5zaGlmdHMuXHJcbiAgICAgIGQucmV2ZXJzZSgpO1xyXG4gICAgICBmb3IgKDsgaS0tOykgZC5wdXNoKDApO1xyXG4gICAgICBkLnJldmVyc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBsZW4gPSB4ZC5sZW5ndGg7XHJcbiAgICBpID0geWQubGVuZ3RoO1xyXG5cclxuICAgIC8vIElmIHlkIGlzIGxvbmdlciB0aGFuIHhkLCBzd2FwIHhkIGFuZCB5ZCBzbyB4ZCBwb2ludHMgdG8gdGhlIGxvbmdlciBhcnJheS5cclxuICAgIGlmIChsZW4gLSBpIDwgMCkge1xyXG4gICAgICBpID0gbGVuO1xyXG4gICAgICBkID0geWQ7XHJcbiAgICAgIHlkID0geGQ7XHJcbiAgICAgIHhkID0gZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBPbmx5IHN0YXJ0IGFkZGluZyBhdCB5ZC5sZW5ndGggLSAxIGFzIHRoZSBmdXJ0aGVyIGRpZ2l0cyBvZiB4ZCBjYW4gYmUgbGVmdCBhcyB0aGV5IGFyZS5cclxuICAgIGZvciAoY2FycnkgPSAwOyBpOykge1xyXG4gICAgICBjYXJyeSA9ICh4ZFstLWldID0geGRbaV0gKyB5ZFtpXSArIGNhcnJ5KSAvIEJBU0UgfCAwO1xyXG4gICAgICB4ZFtpXSAlPSBCQVNFO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjYXJyeSkge1xyXG4gICAgICB4ZC51bnNoaWZ0KGNhcnJ5KTtcclxuICAgICAgKytlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIC8vIE5vIG5lZWQgdG8gY2hlY2sgZm9yIHplcm8sIGFzICt4ICsgK3kgIT0gMCAmJiAteCArIC15ICE9IDBcclxuICAgIGZvciAobGVuID0geGQubGVuZ3RoOyB4ZFstLWxlbl0gPT0gMDspIHhkLnBvcCgpO1xyXG5cclxuICAgIHkuZCA9IHhkO1xyXG4gICAgeS5lID0gZ2V0QmFzZTEwRXhwb25lbnQoeGQsIGUpO1xyXG5cclxuICAgIHJldHVybiBleHRlcm5hbCA/IGZpbmFsaXNlKHksIHByLCBybSkgOiB5O1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0aGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyBvZiB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogW3pdIHtib29sZWFufG51bWJlcn0gV2hldGhlciB0byBjb3VudCBpbnRlZ2VyLXBhcnQgdHJhaWxpbmcgemVyb3M6IHRydWUsIGZhbHNlLCAxIG9yIDAuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnByZWNpc2lvbiA9IFAuc2QgPSBmdW5jdGlvbiAoeikge1xyXG4gICAgdmFyIGssXHJcbiAgICAgIHggPSB0aGlzO1xyXG5cclxuICAgIGlmICh6ICE9PSB2b2lkIDAgJiYgeiAhPT0gISF6ICYmIHogIT09IDEgJiYgeiAhPT0gMCkgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgeik7XHJcblxyXG4gICAgaWYgKHguZCkge1xyXG4gICAgICBrID0gZ2V0UHJlY2lzaW9uKHguZCk7XHJcbiAgICAgIGlmICh6ICYmIHguZSArIDEgPiBrKSBrID0geC5lICsgMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGsgPSBOYU47XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGs7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgd2hvbGUgbnVtYmVyIHVzaW5nXHJcbiAgICogcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5yb3VuZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKG5ldyBDdG9yKHgpLCB4LmUgKyAxLCBDdG9yLnJvdW5kaW5nKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc2luZSBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbLTEsIDFdXHJcbiAgICpcclxuICAgKiBzaW4oeCkgPSB4IC0geF4zLzMhICsgeF41LzUhIC0gLi4uXHJcbiAgICpcclxuICAgKiBzaW4oMCkgICAgICAgICA9IDBcclxuICAgKiBzaW4oLTApICAgICAgICA9IC0wXHJcbiAgICogc2luKEluZmluaXR5KSAgPSBOYU5cclxuICAgKiBzaW4oLUluZmluaXR5KSA9IE5hTlxyXG4gICAqIHNpbihOYU4pICAgICAgID0gTmFOXHJcbiAgICpcclxuICAgKi9cclxuICBQLnNpbmUgPSBQLnNpbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwciwgcm0sXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcbiAgICBpZiAoeC5pc1plcm8oKSkgcmV0dXJuIG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByICsgTWF0aC5tYXgoeC5lLCB4LnNkKCkpICsgTE9HX0JBU0U7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gMTtcclxuXHJcbiAgICB4ID0gc2luZShDdG9yLCB0b0xlc3NUaGFuSGFsZlBpKEN0b3IsIHgpKTtcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZShxdWFkcmFudCA+IDIgPyB4Lm5lZygpIDogeCwgcHIsIHJtLCB0cnVlKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhpcyBEZWNpbWFsLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqICBzcXJ0KC1uKSA9ICBOXHJcbiAgICogIHNxcnQoTikgID0gIE5cclxuICAgKiAgc3FydCgtSSkgPSAgTlxyXG4gICAqICBzcXJ0KEkpICA9ICBJXHJcbiAgICogIHNxcnQoMCkgID0gIDBcclxuICAgKiAgc3FydCgtMCkgPSAtMFxyXG4gICAqXHJcbiAgICovXHJcbiAgUC5zcXVhcmVSb290ID0gUC5zcXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIG0sIG4sIHNkLCByLCByZXAsIHQsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBkID0geC5kLFxyXG4gICAgICBlID0geC5lLFxyXG4gICAgICBzID0geC5zLFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICAvLyBOZWdhdGl2ZS9OYU4vSW5maW5pdHkvemVybz9cclxuICAgIGlmIChzICE9PSAxIHx8ICFkIHx8ICFkWzBdKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQ3RvcighcyB8fCBzIDwgMCAmJiAoIWQgfHwgZFswXSkgPyBOYU4gOiBkID8geCA6IDEgLyAwKTtcclxuICAgIH1cclxuXHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAgIC8vIEluaXRpYWwgZXN0aW1hdGUuXHJcbiAgICBzID0gTWF0aC5zcXJ0KCt4KTtcclxuXHJcbiAgICAvLyBNYXRoLnNxcnQgdW5kZXJmbG93L292ZXJmbG93P1xyXG4gICAgLy8gUGFzcyB4IHRvIE1hdGguc3FydCBhcyBpbnRlZ2VyLCB0aGVuIGFkanVzdCB0aGUgZXhwb25lbnQgb2YgdGhlIHJlc3VsdC5cclxuICAgIGlmIChzID09IDAgfHwgcyA9PSAxIC8gMCkge1xyXG4gICAgICBuID0gZGlnaXRzVG9TdHJpbmcoZCk7XHJcblxyXG4gICAgICBpZiAoKG4ubGVuZ3RoICsgZSkgJSAyID09IDApIG4gKz0gJzAnO1xyXG4gICAgICBzID0gTWF0aC5zcXJ0KG4pO1xyXG4gICAgICBlID0gbWF0aGZsb29yKChlICsgMSkgLyAyKSAtIChlIDwgMCB8fCBlICUgMik7XHJcblxyXG4gICAgICBpZiAocyA9PSAxIC8gMCkge1xyXG4gICAgICAgIG4gPSAnNWUnICsgZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuID0gcy50b0V4cG9uZW50aWFsKCk7XHJcbiAgICAgICAgbiA9IG4uc2xpY2UoMCwgbi5pbmRleE9mKCdlJykgKyAxKSArIGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHIgPSBuZXcgQ3RvcihuKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHIgPSBuZXcgQ3RvcihzLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNkID0gKGUgPSBDdG9yLnByZWNpc2lvbikgKyAzO1xyXG5cclxuICAgIC8vIE5ld3Rvbi1SYXBoc29uIGl0ZXJhdGlvbi5cclxuICAgIGZvciAoOzspIHtcclxuICAgICAgdCA9IHI7XHJcbiAgICAgIHIgPSB0LnBsdXMoZGl2aWRlKHgsIHQsIHNkICsgMiwgMSkpLnRpbWVzKDAuNSk7XHJcblxyXG4gICAgICAvLyBUT0RPPyBSZXBsYWNlIHdpdGggZm9yLWxvb3AgYW5kIGNoZWNrUm91bmRpbmdEaWdpdHMuXHJcbiAgICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHNkKSA9PT0gKG4gPSBkaWdpdHNUb1N0cmluZyhyLmQpKS5zbGljZSgwLCBzZCkpIHtcclxuICAgICAgICBuID0gbi5zbGljZShzZCAtIDMsIHNkICsgMSk7XHJcblxyXG4gICAgICAgIC8vIFRoZSA0dGggcm91bmRpbmcgZGlnaXQgbWF5IGJlIGluIGVycm9yIGJ5IC0xIHNvIGlmIHRoZSA0IHJvdW5kaW5nIGRpZ2l0cyBhcmUgOTk5OSBvclxyXG4gICAgICAgIC8vIDQ5OTksIGkuZS4gYXBwcm9hY2hpbmcgYSByb3VuZGluZyBib3VuZGFyeSwgY29udGludWUgdGhlIGl0ZXJhdGlvbi5cclxuICAgICAgICBpZiAobiA9PSAnOTk5OScgfHwgIXJlcCAmJiBuID09ICc0OTk5Jykge1xyXG5cclxuICAgICAgICAgIC8vIE9uIHRoZSBmaXJzdCBpdGVyYXRpb24gb25seSwgY2hlY2sgdG8gc2VlIGlmIHJvdW5kaW5nIHVwIGdpdmVzIHRoZSBleGFjdCByZXN1bHQgYXMgdGhlXHJcbiAgICAgICAgICAvLyBuaW5lcyBtYXkgaW5maW5pdGVseSByZXBlYXQuXHJcbiAgICAgICAgICBpZiAoIXJlcCkge1xyXG4gICAgICAgICAgICBmaW5hbGlzZSh0LCBlICsgMSwgMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodC50aW1lcyh0KS5lcSh4KSkge1xyXG4gICAgICAgICAgICAgIHIgPSB0O1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc2QgKz0gNDtcclxuICAgICAgICAgIHJlcCA9IDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAvLyBJZiB0aGUgcm91bmRpbmcgZGlnaXRzIGFyZSBudWxsLCAwezAsNH0gb3IgNTB7MCwzfSwgY2hlY2sgZm9yIGFuIGV4YWN0IHJlc3VsdC5cclxuICAgICAgICAgIC8vIElmIG5vdCwgdGhlbiB0aGVyZSBhcmUgZnVydGhlciBkaWdpdHMgYW5kIG0gd2lsbCBiZSB0cnV0aHkuXHJcbiAgICAgICAgICBpZiAoIStuIHx8ICErbi5zbGljZSgxKSAmJiBuLmNoYXJBdCgwKSA9PSAnNScpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFRydW5jYXRlIHRvIHRoZSBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgICAgICAgZmluYWxpc2UociwgZSArIDEsIDEpO1xyXG4gICAgICAgICAgICBtID0gIXIudGltZXMocikuZXEoeCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXh0ZXJuYWwgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZShyLCBlLCBDdG9yLnJvdW5kaW5nLCBtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdGFuZ2VudCBvZiB0aGUgdmFsdWUgaW4gcmFkaWFucyBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICpcclxuICAgKiBEb21haW46IFstSW5maW5pdHksIEluZmluaXR5XVxyXG4gICAqIFJhbmdlOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKlxyXG4gICAqIHRhbigwKSAgICAgICAgID0gMFxyXG4gICAqIHRhbigtMCkgICAgICAgID0gLTBcclxuICAgKiB0YW4oSW5maW5pdHkpICA9IE5hTlxyXG4gICAqIHRhbigtSW5maW5pdHkpID0gTmFOXHJcbiAgICogdGFuKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudGFuZ2VudCA9IFAudGFuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHByLCBybSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbmV3IEN0b3IoTmFOKTtcclxuICAgIGlmICh4LmlzWmVybygpKSByZXR1cm4gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIEN0b3IucHJlY2lzaW9uID0gcHIgKyAxMDtcclxuICAgIEN0b3Iucm91bmRpbmcgPSAxO1xyXG5cclxuICAgIHggPSB4LnNpbigpO1xyXG4gICAgeC5zID0gMTtcclxuICAgIHggPSBkaXZpZGUoeCwgbmV3IEN0b3IoMSkubWludXMoeC50aW1lcyh4KSkuc3FydCgpLCBwciArIDEwLCAwKTtcclxuXHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgQ3Rvci5yb3VuZGluZyA9IHJtO1xyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZShxdWFkcmFudCA9PSAyIHx8IHF1YWRyYW50ID09IDQgPyB4Lm5lZygpIDogeCwgcHIsIHJtLCB0cnVlKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgbiAqIDAgPSAwXHJcbiAgICogIG4gKiBOID0gTlxyXG4gICAqICBuICogSSA9IElcclxuICAgKiAgMCAqIG4gPSAwXHJcbiAgICogIDAgKiAwID0gMFxyXG4gICAqICAwICogTiA9IE5cclxuICAgKiAgMCAqIEkgPSBOXHJcbiAgICogIE4gKiBuID0gTlxyXG4gICAqICBOICogMCA9IE5cclxuICAgKiAgTiAqIE4gPSBOXHJcbiAgICogIE4gKiBJID0gTlxyXG4gICAqICBJICogbiA9IElcclxuICAgKiAgSSAqIDAgPSBOXHJcbiAgICogIEkgKiBOID0gTlxyXG4gICAqICBJICogSSA9IElcclxuICAgKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoaXMgRGVjaW1hbCB0aW1lcyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICAgKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50aW1lcyA9IFAubXVsID0gZnVuY3Rpb24gKHkpIHtcclxuICAgIHZhciBjYXJyeSwgZSwgaSwgaywgciwgckwsIHQsIHhkTCwgeWRMLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHhkID0geC5kLFxyXG4gICAgICB5ZCA9ICh5ID0gbmV3IEN0b3IoeSkpLmQ7XHJcblxyXG4gICAgeS5zICo9IHgucztcclxuXHJcbiAgICAgLy8gSWYgZWl0aGVyIGlzIE5hTiwgwrFJbmZpbml0eSBvciDCsTAuLi5cclxuICAgIGlmICgheGQgfHwgIXhkWzBdIHx8ICF5ZCB8fCAheWRbMF0pIHtcclxuXHJcbiAgICAgIHJldHVybiBuZXcgQ3RvcigheS5zIHx8IHhkICYmICF4ZFswXSAmJiAheWQgfHwgeWQgJiYgIXlkWzBdICYmICF4ZFxyXG5cclxuICAgICAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4uXHJcbiAgICAgICAgLy8gUmV0dXJuIE5hTiBpZiB4IGlzIMKxMCBhbmQgeSBpcyDCsUluZmluaXR5LCBvciB5IGlzIMKxMCBhbmQgeCBpcyDCsUluZmluaXR5LlxyXG4gICAgICAgID8gTmFOXHJcblxyXG4gICAgICAgIC8vIFJldHVybiDCsUluZmluaXR5IGlmIGVpdGhlciBpcyDCsUluZmluaXR5LlxyXG4gICAgICAgIC8vIFJldHVybiDCsTAgaWYgZWl0aGVyIGlzIMKxMC5cclxuICAgICAgICA6ICF4ZCB8fCAheWQgPyB5LnMgLyAwIDogeS5zICogMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZSA9IG1hdGhmbG9vcih4LmUgLyBMT0dfQkFTRSkgKyBtYXRoZmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xyXG4gICAgeGRMID0geGQubGVuZ3RoO1xyXG4gICAgeWRMID0geWQubGVuZ3RoO1xyXG5cclxuICAgIC8vIEVuc3VyZSB4ZCBwb2ludHMgdG8gdGhlIGxvbmdlciBhcnJheS5cclxuICAgIGlmICh4ZEwgPCB5ZEwpIHtcclxuICAgICAgciA9IHhkO1xyXG4gICAgICB4ZCA9IHlkO1xyXG4gICAgICB5ZCA9IHI7XHJcbiAgICAgIHJMID0geGRMO1xyXG4gICAgICB4ZEwgPSB5ZEw7XHJcbiAgICAgIHlkTCA9IHJMO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEluaXRpYWxpc2UgdGhlIHJlc3VsdCBhcnJheSB3aXRoIHplcm9zLlxyXG4gICAgciA9IFtdO1xyXG4gICAgckwgPSB4ZEwgKyB5ZEw7XHJcbiAgICBmb3IgKGkgPSByTDsgaS0tOykgci5wdXNoKDApO1xyXG5cclxuICAgIC8vIE11bHRpcGx5IVxyXG4gICAgZm9yIChpID0geWRMOyAtLWkgPj0gMDspIHtcclxuICAgICAgY2FycnkgPSAwO1xyXG4gICAgICBmb3IgKGsgPSB4ZEwgKyBpOyBrID4gaTspIHtcclxuICAgICAgICB0ID0gcltrXSArIHlkW2ldICogeGRbayAtIGkgLSAxXSArIGNhcnJ5O1xyXG4gICAgICAgIHJbay0tXSA9IHQgJSBCQVNFIHwgMDtcclxuICAgICAgICBjYXJyeSA9IHQgLyBCQVNFIHwgMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcltrXSA9IChyW2tdICsgY2FycnkpICUgQkFTRSB8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgZm9yICg7ICFyWy0tckxdOykgci5wb3AoKTtcclxuXHJcbiAgICBpZiAoY2FycnkpICsrZTtcclxuICAgIGVsc2Ugci5zaGlmdCgpO1xyXG5cclxuICAgIHkuZCA9IHI7XHJcbiAgICB5LmUgPSBnZXRCYXNlMTBFeHBvbmVudChyLCBlKTtcclxuXHJcbiAgICByZXR1cm4gZXh0ZXJuYWwgPyBmaW5hbGlzZSh5LCBDdG9yLnByZWNpc2lvbiwgQ3Rvci5yb3VuZGluZykgOiB5O1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDIsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICAgKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLlxyXG4gICAqXHJcbiAgICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICpcclxuICAgKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvQmluYXJ5ID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nQmluYXJ5KHRoaXMsIDIsIHNkLCBybSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCByb3VuZGVkIHRvIGEgbWF4aW11bSBvZiBgZHBgXHJcbiAgICogZGVjaW1hbCBwbGFjZXMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gIG9yIGByb3VuZGluZ2AgaWYgYHJtYCBpcyBvbWl0dGVkLlxyXG4gICAqXHJcbiAgICogSWYgYGRwYCBpcyBvbWl0dGVkLCByZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvRGVjaW1hbFBsYWNlcyA9IFAudG9EUCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgeCA9IG5ldyBDdG9yKHgpO1xyXG4gICAgaWYgKGRwID09PSB2b2lkIDApIHJldHVybiB4O1xyXG5cclxuICAgIGNoZWNrSW50MzIoZHAsIDAsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG5cclxuICAgIHJldHVybiBmaW5hbGlzZSh4LCBkcCArIHguZSArIDEsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gZXhwb25lbnRpYWwgbm90YXRpb24gcm91bmRlZCB0b1xyXG4gICAqIGBkcGAgZml4ZWQgZGVjaW1hbCBwbGFjZXMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvRXhwb25lbnRpYWwgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgICB2YXIgc3RyLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKGRwID09PSB2b2lkIDApIHtcclxuICAgICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgdHJ1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGVja0ludDMyKGRwLCAwLCBNQVhfRElHSVRTKTtcclxuXHJcbiAgICAgIGlmIChybSA9PT0gdm9pZCAwKSBybSA9IEN0b3Iucm91bmRpbmc7XHJcbiAgICAgIGVsc2UgY2hlY2tJbnQzMihybSwgMCwgOCk7XHJcblxyXG4gICAgICB4ID0gZmluYWxpc2UobmV3IEN0b3IoeCksIGRwICsgMSwgcm0pO1xyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB0cnVlLCBkcCArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4LmlzTmVnKCkgJiYgIXguaXNaZXJvKCkgPyAnLScgKyBzdHIgOiBzdHI7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIGluIG5vcm1hbCAoZml4ZWQtcG9pbnQpIG5vdGF0aW9uIHRvXHJcbiAgICogYGRwYCBmaXhlZCBkZWNpbWFsIHBsYWNlcyBhbmQgcm91bmRlZCB1c2luZyByb3VuZGluZyBtb2RlIGBybWAgb3IgYHJvdW5kaW5nYCBpZiBgcm1gIGlzXHJcbiAgICogb21pdHRlZC5cclxuICAgKlxyXG4gICAqIEFzIHdpdGggSmF2YVNjcmlwdCBudW1iZXJzLCAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgZS5nLiAoLTAuMDAwMDEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICAgKlxyXG4gICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYX0RJR0lUUyBpbmNsdXNpdmUuXHJcbiAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICogKC0wKS50b0ZpeGVkKDApIGlzICcwJywgYnV0ICgtMC4xKS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAgICogKC0wKS50b0ZpeGVkKDEpIGlzICcwLjAnLCBidXQgKC0wLjAxKS50b0ZpeGVkKDEpIGlzICctMC4wJy5cclxuICAgKiAoLTApLnRvRml4ZWQoMykgaXMgJzAuMDAwJy5cclxuICAgKiAoLTAuNSkudG9GaXhlZCgwKSBpcyAnLTAnLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b0ZpeGVkID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gICAgdmFyIHN0ciwgeSxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmIChkcCA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hlY2tJbnQzMihkcCwgMCwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG5cclxuICAgICAgeSA9IGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBkcCArIHguZSArIDEsIHJtKTtcclxuICAgICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeSwgZmFsc2UsIGRwICsgeS5lICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVG8gZGV0ZXJtaW5lIHdoZXRoZXIgdG8gYWRkIHRoZSBtaW51cyBzaWduIGxvb2sgYXQgdGhlIHZhbHVlIGJlZm9yZSBpdCB3YXMgcm91bmRlZCxcclxuICAgIC8vIGkuZS4gbG9vayBhdCBgeGAgcmF0aGVyIHRoYW4gYHlgLlxyXG4gICAgcmV0dXJuIHguaXNOZWcoKSAmJiAheC5pc1plcm8oKSA/ICctJyArIHN0ciA6IHN0cjtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYW4gYXJyYXkgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgYXMgYSBzaW1wbGUgZnJhY3Rpb24gd2l0aCBhbiBpbnRlZ2VyXHJcbiAgICogbnVtZXJhdG9yIGFuZCBhbiBpbnRlZ2VyIGRlbm9taW5hdG9yLlxyXG4gICAqXHJcbiAgICogVGhlIGRlbm9taW5hdG9yIHdpbGwgYmUgYSBwb3NpdGl2ZSBub24temVybyB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHNwZWNpZmllZCBtYXhpbXVtXHJcbiAgICogZGVub21pbmF0b3IuIElmIGEgbWF4aW11bSBkZW5vbWluYXRvciBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgZGVub21pbmF0b3Igd2lsbCBiZSB0aGUgbG93ZXN0XHJcbiAgICogdmFsdWUgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudCB0aGUgbnVtYmVyIGV4YWN0bHkuXHJcbiAgICpcclxuICAgKiBbbWF4RF0ge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gTWF4aW11bSBkZW5vbWluYXRvci4gSW50ZWdlciA+PSAxIGFuZCA8IEluZmluaXR5LlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b0ZyYWN0aW9uID0gZnVuY3Rpb24gKG1heEQpIHtcclxuICAgIHZhciBkLCBkMCwgZDEsIGQyLCBlLCBrLCBuLCBuMCwgbjEsIHByLCBxLCByLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgeGQgPSB4LmQsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmICgheGQpIHJldHVybiBuZXcgQ3Rvcih4KTtcclxuXHJcbiAgICBuMSA9IGQwID0gbmV3IEN0b3IoMSk7XHJcbiAgICBkMSA9IG4wID0gbmV3IEN0b3IoMCk7XHJcblxyXG4gICAgZCA9IG5ldyBDdG9yKGQxKTtcclxuICAgIGUgPSBkLmUgPSBnZXRQcmVjaXNpb24oeGQpIC0geC5lIC0gMTtcclxuICAgIGsgPSBlICUgTE9HX0JBU0U7XHJcbiAgICBkLmRbMF0gPSBtYXRocG93KDEwLCBrIDwgMCA/IExPR19CQVNFICsgayA6IGspO1xyXG5cclxuICAgIGlmIChtYXhEID09IG51bGwpIHtcclxuXHJcbiAgICAgIC8vIGQgaXMgMTAqKmUsIHRoZSBtaW5pbXVtIG1heC1kZW5vbWluYXRvciBuZWVkZWQuXHJcbiAgICAgIG1heEQgPSBlID4gMCA/IGQgOiBuMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG4gPSBuZXcgQ3RvcihtYXhEKTtcclxuICAgICAgaWYgKCFuLmlzSW50KCkgfHwgbi5sdChuMSkpIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIG4pO1xyXG4gICAgICBtYXhEID0gbi5ndChkKSA/IChlID4gMCA/IGQgOiBuMSkgOiBuO1xyXG4gICAgfVxyXG5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICBuID0gbmV3IEN0b3IoZGlnaXRzVG9TdHJpbmcoeGQpKTtcclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBDdG9yLnByZWNpc2lvbiA9IGUgPSB4ZC5sZW5ndGggKiBMT0dfQkFTRSAqIDI7XHJcblxyXG4gICAgZm9yICg7OykgIHtcclxuICAgICAgcSA9IGRpdmlkZShuLCBkLCAwLCAxLCAxKTtcclxuICAgICAgZDIgPSBkMC5wbHVzKHEudGltZXMoZDEpKTtcclxuICAgICAgaWYgKGQyLmNtcChtYXhEKSA9PSAxKSBicmVhaztcclxuICAgICAgZDAgPSBkMTtcclxuICAgICAgZDEgPSBkMjtcclxuICAgICAgZDIgPSBuMTtcclxuICAgICAgbjEgPSBuMC5wbHVzKHEudGltZXMoZDIpKTtcclxuICAgICAgbjAgPSBkMjtcclxuICAgICAgZDIgPSBkO1xyXG4gICAgICBkID0gbi5taW51cyhxLnRpbWVzKGQyKSk7XHJcbiAgICAgIG4gPSBkMjtcclxuICAgIH1cclxuXHJcbiAgICBkMiA9IGRpdmlkZShtYXhELm1pbnVzKGQwKSwgZDEsIDAsIDEsIDEpO1xyXG4gICAgbjAgPSBuMC5wbHVzKGQyLnRpbWVzKG4xKSk7XHJcbiAgICBkMCA9IGQwLnBsdXMoZDIudGltZXMoZDEpKTtcclxuICAgIG4wLnMgPSBuMS5zID0geC5zO1xyXG5cclxuICAgIC8vIERldGVybWluZSB3aGljaCBmcmFjdGlvbiBpcyBjbG9zZXIgdG8geCwgbjAvZDAgb3IgbjEvZDE/XHJcbiAgICByID0gZGl2aWRlKG4xLCBkMSwgZSwgMSkubWludXMoeCkuYWJzKCkuY21wKGRpdmlkZShuMCwgZDAsIGUsIDEpLm1pbnVzKHgpLmFicygpKSA8IDFcclxuICAgICAgICA/IFtuMSwgZDFdIDogW24wLCBkMF07XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSBwcjtcclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gcjtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgaW4gYmFzZSAxNiwgcm91bmQgdG8gYHNkYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAuXHJcbiAgICpcclxuICAgKiBJZiB0aGUgb3B0aW9uYWwgYHNkYCBhcmd1bWVudCBpcyBwcmVzZW50IHRoZW4gcmV0dXJuIGJpbmFyeSBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgKlxyXG4gICAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9IZXhhZGVjaW1hbCA9IFAudG9IZXggPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmdCaW5hcnkodGhpcywgMTYsIHNkLCBybSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJucyBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuZWFyZXN0IG11bHRpcGxlIG9mIGB5YCBpbiB0aGUgZGlyZWN0aW9uIG9mIHJvdW5kaW5nXHJcbiAgICogbW9kZSBgcm1gLCBvciBgRGVjaW1hbC5yb3VuZGluZ2AgaWYgYHJtYCBpcyBvbWl0dGVkLCB0byB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogVGhlIHJldHVybiB2YWx1ZSB3aWxsIGFsd2F5cyBoYXZlIHRoZSBzYW1lIHNpZ24gYXMgdGhpcyBEZWNpbWFsLCB1bmxlc3MgZWl0aGVyIHRoaXMgRGVjaW1hbFxyXG4gICAqIG9yIGB5YCBpcyBOYU4sIGluIHdoaWNoIGNhc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIGFsc28gYmUgTmFOLlxyXG4gICAqXHJcbiAgICogVGhlIHJldHVybiB2YWx1ZSBpcyBub3QgYWZmZWN0ZWQgYnkgdGhlIHZhbHVlIG9mIGBwcmVjaXNpb25gLlxyXG4gICAqXHJcbiAgICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgbWFnbml0dWRlIHRvIHJvdW5kIHRvIGEgbXVsdGlwbGUgb2YuXHJcbiAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICogJ3RvTmVhcmVzdCgpIHJvdW5kaW5nIG1vZGUgbm90IGFuIGludGVnZXI6IHtybX0nXHJcbiAgICogJ3RvTmVhcmVzdCgpIHJvdW5kaW5nIG1vZGUgb3V0IG9mIHJhbmdlOiB7cm19J1xyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b05lYXJlc3QgPSBmdW5jdGlvbiAoeSwgcm0pIHtcclxuICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgeCA9IG5ldyBDdG9yKHgpO1xyXG5cclxuICAgIGlmICh5ID09IG51bGwpIHtcclxuXHJcbiAgICAgIC8vIElmIHggaXMgbm90IGZpbml0ZSwgcmV0dXJuIHguXHJcbiAgICAgIGlmICgheC5kKSByZXR1cm4geDtcclxuXHJcbiAgICAgIHkgPSBuZXcgQ3RvcigxKTtcclxuICAgICAgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeSA9IG5ldyBDdG9yKHkpO1xyXG4gICAgICBpZiAocm0gPT09IHZvaWQgMCkge1xyXG4gICAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgeCBpcyBub3QgZmluaXRlLCByZXR1cm4geCBpZiB5IGlzIG5vdCBOYU4sIGVsc2UgTmFOLlxyXG4gICAgICBpZiAoIXguZCkgcmV0dXJuIHkucyA/IHggOiB5O1xyXG5cclxuICAgICAgLy8gSWYgeSBpcyBub3QgZmluaXRlLCByZXR1cm4gSW5maW5pdHkgd2l0aCB0aGUgc2lnbiBvZiB4IGlmIHkgaXMgSW5maW5pdHksIGVsc2UgTmFOLlxyXG4gICAgICBpZiAoIXkuZCkge1xyXG4gICAgICAgIGlmICh5LnMpIHkucyA9IHgucztcclxuICAgICAgICByZXR1cm4geTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIHkgaXMgbm90IHplcm8sIGNhbGN1bGF0ZSB0aGUgbmVhcmVzdCBtdWx0aXBsZSBvZiB5IHRvIHguXHJcbiAgICBpZiAoeS5kWzBdKSB7XHJcbiAgICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICAgIHggPSBkaXZpZGUoeCwgeSwgMCwgcm0sIDEpLnRpbWVzKHkpO1xyXG4gICAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICAgIGZpbmFsaXNlKHgpO1xyXG5cclxuICAgIC8vIElmIHkgaXMgemVybywgcmV0dXJuIHplcm8gd2l0aCB0aGUgc2lnbiBvZiB4LlxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeS5zID0geC5zO1xyXG4gICAgICB4ID0geTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBjb252ZXJ0ZWQgdG8gYSBudW1iZXIgcHJpbWl0aXZlLlxyXG4gICAqIFplcm8ga2VlcHMgaXRzIHNpZ24uXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvTnVtYmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICt0aGlzO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgRGVjaW1hbCBpbiBiYXNlIDgsIHJvdW5kIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICAgKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm1gLlxyXG4gICAqXHJcbiAgICogSWYgdGhlIG9wdGlvbmFsIGBzZGAgYXJndW1lbnQgaXMgcHJlc2VudCB0aGVuIHJldHVybiBiaW5hcnkgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICpcclxuICAgKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvT2N0YWwgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmdCaW5hcnkodGhpcywgOCwgc2QsIHJtKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJhaXNlZCB0byB0aGUgcG93ZXIgYHlgLCByb3VuZGVkXHJcbiAgICogdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIEVDTUFTY3JpcHQgY29tcGxpYW50LlxyXG4gICAqXHJcbiAgICogICBwb3coeCwgTmFOKSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gTmFOXHJcbiAgICogICBwb3coeCwgwrEwKSAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IDFcclxuXHJcbiAgICogICBwb3coTmFOLCBub24temVybykgICAgICAgICAgICAgICAgICAgID0gTmFOXHJcbiAgICogICBwb3coYWJzKHgpID4gMSwgK0luZmluaXR5KSAgICAgICAgICAgID0gK0luZmluaXR5XHJcbiAgICogICBwb3coYWJzKHgpID4gMSwgLUluZmluaXR5KSAgICAgICAgICAgID0gKzBcclxuICAgKiAgIHBvdyhhYnMoeCkgPT0gMSwgwrFJbmZpbml0eSkgICAgICAgICAgID0gTmFOXHJcbiAgICogICBwb3coYWJzKHgpIDwgMSwgK0luZmluaXR5KSAgICAgICAgICAgID0gKzBcclxuICAgKiAgIHBvdyhhYnMoeCkgPCAxLCAtSW5maW5pdHkpICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICAgKiAgIHBvdygrSW5maW5pdHksIHkgPiAwKSAgICAgICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICAgKiAgIHBvdygrSW5maW5pdHksIHkgPCAwKSAgICAgICAgICAgICAgICAgPSArMFxyXG4gICAqICAgcG93KC1JbmZpbml0eSwgb2RkIGludGVnZXIgPiAwKSAgICAgICA9IC1JbmZpbml0eVxyXG4gICAqICAgcG93KC1JbmZpbml0eSwgZXZlbiBpbnRlZ2VyID4gMCkgICAgICA9ICtJbmZpbml0eVxyXG4gICAqICAgcG93KC1JbmZpbml0eSwgb2RkIGludGVnZXIgPCAwKSAgICAgICA9IC0wXHJcbiAgICogICBwb3coLUluZmluaXR5LCBldmVuIGludGVnZXIgPCAwKSAgICAgID0gKzBcclxuICAgKiAgIHBvdygrMCwgeSA+IDApICAgICAgICAgICAgICAgICAgICAgICAgPSArMFxyXG4gICAqICAgcG93KCswLCB5IDwgMCkgICAgICAgICAgICAgICAgICAgICAgICA9ICtJbmZpbml0eVxyXG4gICAqICAgcG93KC0wLCBvZGQgaW50ZWdlciA+IDApICAgICAgICAgICAgICA9IC0wXHJcbiAgICogICBwb3coLTAsIGV2ZW4gaW50ZWdlciA+IDApICAgICAgICAgICAgID0gKzBcclxuICAgKiAgIHBvdygtMCwgb2RkIGludGVnZXIgPCAwKSAgICAgICAgICAgICAgPSAtSW5maW5pdHlcclxuICAgKiAgIHBvdygtMCwgZXZlbiBpbnRlZ2VyIDwgMCkgICAgICAgICAgICAgPSArSW5maW5pdHlcclxuICAgKiAgIHBvdyhmaW5pdGUgeCA8IDAsIGZpbml0ZSBub24taW50ZWdlcikgPSBOYU5cclxuICAgKlxyXG4gICAqIEZvciBub24taW50ZWdlciBvciB2ZXJ5IGxhcmdlIGV4cG9uZW50cyBwb3coeCwgeSkgaXMgY2FsY3VsYXRlZCB1c2luZ1xyXG4gICAqXHJcbiAgICogICB4XnkgPSBleHAoeSpsbih4KSlcclxuICAgKlxyXG4gICAqIEFzc3VtaW5nIHRoZSBmaXJzdCAxNSByb3VuZGluZyBkaWdpdHMgYXJlIGVhY2ggZXF1YWxseSBsaWtlbHkgdG8gYmUgYW55IGRpZ2l0IDAtOSwgdGhlXHJcbiAgICogcHJvYmFiaWxpdHkgb2YgYW4gaW5jb3JyZWN0bHkgcm91bmRlZCByZXN1bHRcclxuICAgKiBQKFs0OV05ezE0fSB8IFs1MF0wezE0fSkgPSAyICogMC4yICogMTBeLTE0ID0gNGUtMTUgPSAxLzIuNWUrMTRcclxuICAgKiBpLmUuIDEgaW4gMjUwLDAwMCwwMDAsMDAwLDAwMFxyXG4gICAqXHJcbiAgICogSWYgYSByZXN1bHQgaXMgaW5jb3JyZWN0bHkgcm91bmRlZCB0aGUgbWF4aW11bSBlcnJvciB3aWxsIGJlIDEgdWxwICh1bml0IGluIGxhc3QgcGxhY2UpLlxyXG4gICAqXHJcbiAgICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgcG93ZXIgdG8gd2hpY2ggdG8gcmFpc2UgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b1Bvd2VyID0gUC5wb3cgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgdmFyIGUsIGssIHByLCByLCBybSwgcyxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICB5biA9ICsoeSA9IG5ldyBDdG9yKHkpKTtcclxuXHJcbiAgICAvLyBFaXRoZXIgwrFJbmZpbml0eSwgTmFOIG9yIMKxMD9cclxuICAgIGlmICgheC5kIHx8ICF5LmQgfHwgIXguZFswXSB8fCAheS5kWzBdKSByZXR1cm4gbmV3IEN0b3IobWF0aHBvdygreCwgeW4pKTtcclxuXHJcbiAgICB4ID0gbmV3IEN0b3IoeCk7XHJcblxyXG4gICAgaWYgKHguZXEoMSkpIHJldHVybiB4O1xyXG5cclxuICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICBybSA9IEN0b3Iucm91bmRpbmc7XHJcblxyXG4gICAgaWYgKHkuZXEoMSkpIHJldHVybiBmaW5hbGlzZSh4LCBwciwgcm0pO1xyXG5cclxuICAgIC8vIHkgZXhwb25lbnRcclxuICAgIGUgPSBtYXRoZmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xyXG5cclxuICAgIC8vIElmIHkgaXMgYSBzbWFsbCBpbnRlZ2VyIHVzZSB0aGUgJ2V4cG9uZW50aWF0aW9uIGJ5IHNxdWFyaW5nJyBhbGdvcml0aG0uXHJcbiAgICBpZiAoZSA+PSB5LmQubGVuZ3RoIC0gMSAmJiAoayA9IHluIDwgMCA/IC15biA6IHluKSA8PSBNQVhfU0FGRV9JTlRFR0VSKSB7XHJcbiAgICAgIHIgPSBpbnRQb3coQ3RvciwgeCwgaywgcHIpO1xyXG4gICAgICByZXR1cm4geS5zIDwgMCA/IG5ldyBDdG9yKDEpLmRpdihyKSA6IGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbiAgICB9XHJcblxyXG4gICAgcyA9IHgucztcclxuXHJcbiAgICAvLyBpZiB4IGlzIG5lZ2F0aXZlXHJcbiAgICBpZiAocyA8IDApIHtcclxuXHJcbiAgICAgIC8vIGlmIHkgaXMgbm90IGFuIGludGVnZXJcclxuICAgICAgaWYgKGUgPCB5LmQubGVuZ3RoIC0gMSkgcmV0dXJuIG5ldyBDdG9yKE5hTik7XHJcblxyXG4gICAgICAvLyBSZXN1bHQgaXMgcG9zaXRpdmUgaWYgeCBpcyBuZWdhdGl2ZSBhbmQgdGhlIGxhc3QgZGlnaXQgb2YgaW50ZWdlciB5IGlzIGV2ZW4uXHJcbiAgICAgIGlmICgoeS5kW2VdICYgMSkgPT0gMCkgcyA9IDE7XHJcblxyXG4gICAgICAvLyBpZiB4LmVxKC0xKVxyXG4gICAgICBpZiAoeC5lID09IDAgJiYgeC5kWzBdID09IDEgJiYgeC5kLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgeC5zID0gcztcclxuICAgICAgICByZXR1cm4geDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEVzdGltYXRlIHJlc3VsdCBleHBvbmVudC5cclxuICAgIC8vIHheeSA9IDEwXmUsICB3aGVyZSBlID0geSAqIGxvZzEwKHgpXHJcbiAgICAvLyBsb2cxMCh4KSA9IGxvZzEwKHhfc2lnbmlmaWNhbmQpICsgeF9leHBvbmVudFxyXG4gICAgLy8gbG9nMTAoeF9zaWduaWZpY2FuZCkgPSBsbih4X3NpZ25pZmljYW5kKSAvIGxuKDEwKVxyXG4gICAgayA9IG1hdGhwb3coK3gsIHluKTtcclxuICAgIGUgPSBrID09IDAgfHwgIWlzRmluaXRlKGspXHJcbiAgICAgID8gbWF0aGZsb29yKHluICogKE1hdGgubG9nKCcwLicgKyBkaWdpdHNUb1N0cmluZyh4LmQpKSAvIE1hdGguTE4xMCArIHguZSArIDEpKVxyXG4gICAgICA6IG5ldyBDdG9yKGsgKyAnJykuZTtcclxuXHJcbiAgICAvLyBFeHBvbmVudCBlc3RpbWF0ZSBtYXkgYmUgaW5jb3JyZWN0IGUuZy4geDogMC45OTk5OTk5OTk5OTk5OTk5OTksIHk6IDIuMjksIGU6IDAsIHIuZTogLTEuXHJcblxyXG4gICAgLy8gT3ZlcmZsb3cvdW5kZXJmbG93P1xyXG4gICAgaWYgKGUgPiBDdG9yLm1heEUgKyAxIHx8IGUgPCBDdG9yLm1pbkUgLSAxKSByZXR1cm4gbmV3IEN0b3IoZSA+IDAgPyBzIC8gMCA6IDApO1xyXG5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0geC5zID0gMTtcclxuXHJcbiAgICAvLyBFc3RpbWF0ZSB0aGUgZXh0cmEgZ3VhcmQgZGlnaXRzIG5lZWRlZCB0byBlbnN1cmUgZml2ZSBjb3JyZWN0IHJvdW5kaW5nIGRpZ2l0cyBmcm9tXHJcbiAgICAvLyBuYXR1cmFsTG9nYXJpdGhtKHgpLiBFeGFtcGxlIG9mIGZhaWx1cmUgd2l0aG91dCB0aGVzZSBleHRyYSBkaWdpdHMgKHByZWNpc2lvbjogMTApOlxyXG4gICAgLy8gbmV3IERlY2ltYWwoMi4zMjQ1NikucG93KCcyMDg3OTg3NDM2NTM0NTY2LjQ2NDExJylcclxuICAgIC8vIHNob3VsZCBiZSAxLjE2MjM3NzgyM2UrNzY0OTE0OTA1MTczODE1LCBidXQgaXMgMS4xNjIzNTU4MjNlKzc2NDkxNDkwNTE3MzgxNVxyXG4gICAgayA9IE1hdGgubWluKDEyLCAoZSArICcnKS5sZW5ndGgpO1xyXG5cclxuICAgIC8vIHIgPSB4XnkgPSBleHAoeSpsbih4KSlcclxuICAgIHIgPSBuYXR1cmFsRXhwb25lbnRpYWwoeS50aW1lcyhuYXR1cmFsTG9nYXJpdGhtKHgsIHByICsgaykpLCBwcik7XHJcblxyXG4gICAgLy8gciBtYXkgYmUgSW5maW5pdHksIGUuZy4gKDAuOTk5OTk5OTk5OTk5OTk5OSkucG93KC0xZSs0MClcclxuICAgIGlmIChyLmQpIHtcclxuXHJcbiAgICAgIC8vIFRydW5jYXRlIHRvIHRoZSByZXF1aXJlZCBwcmVjaXNpb24gcGx1cyBmaXZlIHJvdW5kaW5nIGRpZ2l0cy5cclxuICAgICAgciA9IGZpbmFsaXNlKHIsIHByICsgNSwgMSk7XHJcblxyXG4gICAgICAvLyBJZiB0aGUgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5OSBvciBbNTBdMDAwMCBpbmNyZWFzZSB0aGUgcHJlY2lzaW9uIGJ5IDEwIGFuZCByZWNhbGN1bGF0ZVxyXG4gICAgICAvLyB0aGUgcmVzdWx0LlxyXG4gICAgICBpZiAoY2hlY2tSb3VuZGluZ0RpZ2l0cyhyLmQsIHByLCBybSkpIHtcclxuICAgICAgICBlID0gcHIgKyAxMDtcclxuXHJcbiAgICAgICAgLy8gVHJ1bmNhdGUgdG8gdGhlIGluY3JlYXNlZCBwcmVjaXNpb24gcGx1cyBmaXZlIHJvdW5kaW5nIGRpZ2l0cy5cclxuICAgICAgICByID0gZmluYWxpc2UobmF0dXJhbEV4cG9uZW50aWFsKHkudGltZXMobmF0dXJhbExvZ2FyaXRobSh4LCBlICsgaykpLCBlKSwgZSArIDUsIDEpO1xyXG5cclxuICAgICAgICAvLyBDaGVjayBmb3IgMTQgbmluZXMgZnJvbSB0aGUgMm5kIHJvdW5kaW5nIGRpZ2l0ICh0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQgbWF5IGJlIDQgb3IgOSkuXHJcbiAgICAgICAgaWYgKCtkaWdpdHNUb1N0cmluZyhyLmQpLnNsaWNlKHByICsgMSwgcHIgKyAxNSkgKyAxID09IDFlMTQpIHtcclxuICAgICAgICAgIHIgPSBmaW5hbGlzZShyLCBwciArIDEsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHIucyA9IHM7XHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICBDdG9yLnJvdW5kaW5nID0gcm07XHJcblxyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHIsIHByLCBybSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsIHJvdW5kZWQgdG8gYHNkYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICAgKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBSZXR1cm4gZXhwb25lbnRpYWwgbm90YXRpb24gaWYgYHNkYCBpcyBsZXNzIHRoYW4gdGhlIG51bWJlciBvZiBkaWdpdHMgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudFxyXG4gICAqIHRoZSBpbnRlZ2VyIHBhcnQgb2YgdGhlIHZhbHVlIGluIG5vcm1hbCBub3RhdGlvbi5cclxuICAgKlxyXG4gICAqIFtzZF0ge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzLiBJbnRlZ2VyLCAxIHRvIE1BWF9ESUdJVFMgaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIFAudG9QcmVjaXNpb24gPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgICB2YXIgc3RyLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgaWYgKHNkID09PSB2b2lkIDApIHtcclxuICAgICAgc3RyID0gZmluaXRlVG9TdHJpbmcoeCwgeC5lIDw9IEN0b3IudG9FeHBOZWcgfHwgeC5lID49IEN0b3IudG9FeHBQb3MpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hlY2tJbnQzMihzZCwgMSwgTUFYX0RJR0lUUyk7XHJcblxyXG4gICAgICBpZiAocm0gPT09IHZvaWQgMCkgcm0gPSBDdG9yLnJvdW5kaW5nO1xyXG4gICAgICBlbHNlIGNoZWNrSW50MzIocm0sIDAsIDgpO1xyXG5cclxuICAgICAgeCA9IGZpbmFsaXNlKG5ldyBDdG9yKHgpLCBzZCwgcm0pO1xyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCBzZCA8PSB4LmUgfHwgeC5lIDw9IEN0b3IudG9FeHBOZWcsIHNkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgcm91bmRlZCB0byBhIG1heGltdW0gb2YgYHNkYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGBybWAsIG9yIHRvIGBwcmVjaXNpb25gIGFuZCBgcm91bmRpbmdgIHJlc3BlY3RpdmVseSBpZlxyXG4gICAqIG9taXR0ZWQuXHJcbiAgICpcclxuICAgKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKiAndG9TRCgpIGRpZ2l0cyBvdXQgb2YgcmFuZ2U6IHtzZH0nXHJcbiAgICogJ3RvU0QoKSBkaWdpdHMgbm90IGFuIGludGVnZXI6IHtzZH0nXHJcbiAgICogJ3RvU0QoKSByb3VuZGluZyBtb2RlIG5vdCBhbiBpbnRlZ2VyOiB7cm19J1xyXG4gICAqICd0b1NEKCkgcm91bmRpbmcgbW9kZSBvdXQgb2YgcmFuZ2U6IHtybX0nXHJcbiAgICpcclxuICAgKi9cclxuICBQLnRvU2lnbmlmaWNhbnREaWdpdHMgPSBQLnRvU0QgPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgICB2YXIgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICAgIGlmIChzZCA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIHNkID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoZWNrSW50MzIoc2QsIDEsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UobmV3IEN0b3IoeCksIHNkLCBybSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBEZWNpbWFsLlxyXG4gICAqXHJcbiAgICogUmV0dXJuIGV4cG9uZW50aWFsIG5vdGF0aW9uIGlmIHRoaXMgRGVjaW1hbCBoYXMgYSBwb3NpdGl2ZSBleHBvbmVudCBlcXVhbCB0byBvciBncmVhdGVyIHRoYW5cclxuICAgKiBgdG9FeHBQb3NgLCBvciBhIG5lZ2F0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGxlc3MgdGhhbiBgdG9FeHBOZWdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgsIHguZSA8PSBDdG9yLnRvRXhwTmVnIHx8IHguZSA+PSBDdG9yLnRvRXhwUG9zKTtcclxuXHJcbiAgICByZXR1cm4geC5pc05lZygpICYmICF4LmlzWmVybygpID8gJy0nICsgc3RyIDogc3RyO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwgdHJ1bmNhdGVkIHRvIGEgd2hvbGUgbnVtYmVyLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC50cnVuY2F0ZWQgPSBQLnRydW5jID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCB0aGlzLmUgKyAxLCAxKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIERlY2ltYWwuXHJcbiAgICogVW5saWtlIGB0b1N0cmluZ2AsIG5lZ2F0aXZlIHplcm8gd2lsbCBpbmNsdWRlIHRoZSBtaW51cyBzaWduLlxyXG4gICAqXHJcbiAgICovXHJcbiAgUC52YWx1ZU9mID0gUC50b0pTT04gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgeCA9IHRoaXMsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBzdHIgPSBmaW5pdGVUb1N0cmluZyh4LCB4LmUgPD0gQ3Rvci50b0V4cE5lZyB8fCB4LmUgPj0gQ3Rvci50b0V4cFBvcyk7XHJcblxyXG4gICAgcmV0dXJuIHguaXNOZWcoKSA/ICctJyArIHN0ciA6IHN0cjtcclxuICB9O1xyXG5cclxuXHJcbiAgLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgRGVjaW1hbC5wcm90b3R5cGUgKFApIGFuZC9vciBEZWNpbWFsIG1ldGhvZHMsIGFuZCB0aGVpciBjYWxsZXJzLlxyXG5cclxuXHJcbiAgLypcclxuICAgKiAgZGlnaXRzVG9TdHJpbmcgICAgICAgICAgIFAuY3ViZVJvb3QsIFAubG9nYXJpdGhtLCBQLnNxdWFyZVJvb3QsIFAudG9GcmFjdGlvbiwgUC50b1Bvd2VyLFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluaXRlVG9TdHJpbmcsIG5hdHVyYWxFeHBvbmVudGlhbCwgbmF0dXJhbExvZ2FyaXRobVxyXG4gICAqICBjaGVja0ludDMyICAgICAgICAgICAgICAgUC50b0RlY2ltYWxQbGFjZXMsIFAudG9FeHBvbmVudGlhbCwgUC50b0ZpeGVkLCBQLnRvTmVhcmVzdCxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudG9QcmVjaXNpb24sIFAudG9TaWduaWZpY2FudERpZ2l0cywgdG9TdHJpbmdCaW5hcnksIHJhbmRvbVxyXG4gICAqICBjaGVja1JvdW5kaW5nRGlnaXRzICAgICAgUC5sb2dhcml0aG0sIFAudG9Qb3dlciwgbmF0dXJhbEV4cG9uZW50aWFsLCBuYXR1cmFsTG9nYXJpdGhtXHJcbiAgICogIGNvbnZlcnRCYXNlICAgICAgICAgICAgICB0b1N0cmluZ0JpbmFyeSwgcGFyc2VPdGhlclxyXG4gICAqICBjb3MgICAgICAgICAgICAgICAgICAgICAgUC5jb3NcclxuICAgKiAgZGl2aWRlICAgICAgICAgICAgICAgICAgIFAuYXRhbmgsIFAuY3ViZVJvb3QsIFAuZGl2aWRlZEJ5LCBQLmRpdmlkZWRUb0ludGVnZXJCeSxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAubG9nYXJpdGhtLCBQLm1vZHVsbywgUC5zcXVhcmVSb290LCBQLnRhbiwgUC50YW5oLCBQLnRvRnJhY3Rpb24sXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvTmVhcmVzdCwgdG9TdHJpbmdCaW5hcnksIG5hdHVyYWxFeHBvbmVudGlhbCwgbmF0dXJhbExvZ2FyaXRobSxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRheWxvclNlcmllcywgYXRhbjIsIHBhcnNlT3RoZXJcclxuICAgKiAgZmluYWxpc2UgICAgICAgICAgICAgICAgIFAuYWJzb2x1dGVWYWx1ZSwgUC5hdGFuLCBQLmF0YW5oLCBQLmNlaWwsIFAuY29zLCBQLmNvc2gsXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLmN1YmVSb290LCBQLmRpdmlkZWRUb0ludGVnZXJCeSwgUC5mbG9vciwgUC5sb2dhcml0aG0sIFAubWludXMsXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLm1vZHVsbywgUC5uZWdhdGVkLCBQLnBsdXMsIFAucm91bmQsIFAuc2luLCBQLnNpbmgsIFAuc3F1YXJlUm9vdCxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFAudGFuLCBQLnRpbWVzLCBQLnRvRGVjaW1hbFBsYWNlcywgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRvTmVhcmVzdCwgUC50b1Bvd2VyLCBQLnRvUHJlY2lzaW9uLCBQLnRvU2lnbmlmaWNhbnREaWdpdHMsXHJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBQLnRydW5jYXRlZCwgZGl2aWRlLCBnZXRMbjEwLCBnZXRQaSwgbmF0dXJhbEV4cG9uZW50aWFsLFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF0dXJhbExvZ2FyaXRobSwgY2VpbCwgZmxvb3IsIHJvdW5kLCB0cnVuY1xyXG4gICAqICBmaW5pdGVUb1N0cmluZyAgICAgICAgICAgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsIFAudG9QcmVjaXNpb24sIFAudG9TdHJpbmcsIFAudmFsdWVPZixcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvU3RyaW5nQmluYXJ5XHJcbiAgICogIGdldEJhc2UxMEV4cG9uZW50ICAgICAgICBQLm1pbnVzLCBQLnBsdXMsIFAudGltZXMsIHBhcnNlT3RoZXJcclxuICAgKiAgZ2V0TG4xMCAgICAgICAgICAgICAgICAgIFAubG9nYXJpdGhtLCBuYXR1cmFsTG9nYXJpdGhtXHJcbiAgICogIGdldFBpICAgICAgICAgICAgICAgICAgICBQLmFjb3MsIFAuYXNpbiwgUC5hdGFuLCB0b0xlc3NUaGFuSGFsZlBpLCBhdGFuMlxyXG4gICAqICBnZXRQcmVjaXNpb24gICAgICAgICAgICAgUC5wcmVjaXNpb24sIFAudG9GcmFjdGlvblxyXG4gICAqICBnZXRaZXJvU3RyaW5nICAgICAgICAgICAgZGlnaXRzVG9TdHJpbmcsIGZpbml0ZVRvU3RyaW5nXHJcbiAgICogIGludFBvdyAgICAgICAgICAgICAgICAgICBQLnRvUG93ZXIsIHBhcnNlT3RoZXJcclxuICAgKiAgaXNPZGQgICAgICAgICAgICAgICAgICAgIHRvTGVzc1RoYW5IYWxmUGlcclxuICAgKiAgbWF4T3JNaW4gICAgICAgICAgICAgICAgIG1heCwgbWluXHJcbiAgICogIG5hdHVyYWxFeHBvbmVudGlhbCAgICAgICBQLm5hdHVyYWxFeHBvbmVudGlhbCwgUC50b1Bvd2VyXHJcbiAgICogIG5hdHVyYWxMb2dhcml0aG0gICAgICAgICBQLmFjb3NoLCBQLmFzaW5oLCBQLmF0YW5oLCBQLmxvZ2FyaXRobSwgUC5uYXR1cmFsTG9nYXJpdGhtLFxyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUC50b1Bvd2VyLCBuYXR1cmFsRXhwb25lbnRpYWxcclxuICAgKiAgbm9uRmluaXRlVG9TdHJpbmcgICAgICAgIGZpbml0ZVRvU3RyaW5nLCB0b1N0cmluZ0JpbmFyeVxyXG4gICAqICBwYXJzZURlY2ltYWwgICAgICAgICAgICAgRGVjaW1hbFxyXG4gICAqICBwYXJzZU90aGVyICAgICAgICAgICAgICAgRGVjaW1hbFxyXG4gICAqICBzaW4gICAgICAgICAgICAgICAgICAgICAgUC5zaW5cclxuICAgKiAgdGF5bG9yU2VyaWVzICAgICAgICAgICAgIFAuY29zaCwgUC5zaW5oLCBjb3MsIHNpblxyXG4gICAqICB0b0xlc3NUaGFuSGFsZlBpICAgICAgICAgUC5jb3MsIFAuc2luXHJcbiAgICogIHRvU3RyaW5nQmluYXJ5ICAgICAgICAgICBQLnRvQmluYXJ5LCBQLnRvSGV4YWRlY2ltYWwsIFAudG9PY3RhbFxyXG4gICAqICB0cnVuY2F0ZSAgICAgICAgICAgICAgICAgaW50UG93XHJcbiAgICpcclxuICAgKiAgVGhyb3dzOiAgICAgICAgICAgICAgICAgIFAubG9nYXJpdGhtLCBQLnByZWNpc2lvbiwgUC50b0ZyYWN0aW9uLCBjaGVja0ludDMyLCBnZXRMbjEwLCBnZXRQaSxcclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdHVyYWxMb2dhcml0aG0sIGNvbmZpZywgcGFyc2VPdGhlciwgcmFuZG9tLCBEZWNpbWFsXHJcbiAgICovXHJcblxyXG5cclxuICBmdW5jdGlvbiBkaWdpdHNUb1N0cmluZyhkKSB7XHJcbiAgICB2YXIgaSwgaywgd3MsXHJcbiAgICAgIGluZGV4T2ZMYXN0V29yZCA9IGQubGVuZ3RoIC0gMSxcclxuICAgICAgc3RyID0gJycsXHJcbiAgICAgIHcgPSBkWzBdO1xyXG5cclxuICAgIGlmIChpbmRleE9mTGFzdFdvcmQgPiAwKSB7XHJcbiAgICAgIHN0ciArPSB3O1xyXG4gICAgICBmb3IgKGkgPSAxOyBpIDwgaW5kZXhPZkxhc3RXb3JkOyBpKyspIHtcclxuICAgICAgICB3cyA9IGRbaV0gKyAnJztcclxuICAgICAgICBrID0gTE9HX0JBU0UgLSB3cy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGspIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgICAgIHN0ciArPSB3cztcclxuICAgICAgfVxyXG5cclxuICAgICAgdyA9IGRbaV07XHJcbiAgICAgIHdzID0gdyArICcnO1xyXG4gICAgICBrID0gTE9HX0JBU0UgLSB3cy5sZW5ndGg7XHJcbiAgICAgIGlmIChrKSBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcclxuICAgIH0gZWxzZSBpZiAodyA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gJzAnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcyBvZiBsYXN0IHcuXHJcbiAgICBmb3IgKDsgdyAlIDEwID09PSAwOykgdyAvPSAxMDtcclxuXHJcbiAgICByZXR1cm4gc3RyICsgdztcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBjaGVja0ludDMyKGksIG1pbiwgbWF4KSB7XHJcbiAgICBpZiAoaSAhPT0gfn5pIHx8IGkgPCBtaW4gfHwgaSA+IG1heCkge1xyXG4gICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIENoZWNrIDUgcm91bmRpbmcgZGlnaXRzIGlmIGByZXBlYXRpbmdgIGlzIG51bGwsIDQgb3RoZXJ3aXNlLlxyXG4gICAqIGByZXBlYXRpbmcgPT0gbnVsbGAgaWYgY2FsbGVyIGlzIGBsb2dgIG9yIGBwb3dgLFxyXG4gICAqIGByZXBlYXRpbmcgIT0gbnVsbGAgaWYgY2FsbGVyIGlzIGBuYXR1cmFsTG9nYXJpdGhtYCBvciBgbmF0dXJhbEV4cG9uZW50aWFsYC5cclxuICAgKi9cclxuICBmdW5jdGlvbiBjaGVja1JvdW5kaW5nRGlnaXRzKGQsIGksIHJtLCByZXBlYXRpbmcpIHtcclxuICAgIHZhciBkaSwgaywgciwgcmQ7XHJcblxyXG4gICAgLy8gR2V0IHRoZSBsZW5ndGggb2YgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGFycmF5IGQuXHJcbiAgICBmb3IgKGsgPSBkWzBdOyBrID49IDEwOyBrIC89IDEwKSAtLWk7XHJcblxyXG4gICAgLy8gSXMgdGhlIHJvdW5kaW5nIGRpZ2l0IGluIHRoZSBmaXJzdCB3b3JkIG9mIGQ/XHJcbiAgICBpZiAoLS1pIDwgMCkge1xyXG4gICAgICBpICs9IExPR19CQVNFO1xyXG4gICAgICBkaSA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkaSA9IE1hdGguY2VpbCgoaSArIDEpIC8gTE9HX0JBU0UpO1xyXG4gICAgICBpICU9IExPR19CQVNFO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGkgaXMgdGhlIGluZGV4ICgwIC0gNikgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgLy8gRS5nLiBpZiB3aXRoaW4gdGhlIHdvcmQgMzQ4NzU2MyB0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQgaXMgNSxcclxuICAgIC8vIHRoZW4gaSA9IDQsIGsgPSAxMDAwLCByZCA9IDM0ODc1NjMgJSAxMDAwID0gNTYzXHJcbiAgICBrID0gbWF0aHBvdygxMCwgTE9HX0JBU0UgLSBpKTtcclxuICAgIHJkID0gZFtkaV0gJSBrIHwgMDtcclxuXHJcbiAgICBpZiAocmVwZWF0aW5nID09IG51bGwpIHtcclxuICAgICAgaWYgKGkgPCAzKSB7XHJcbiAgICAgICAgaWYgKGkgPT0gMCkgcmQgPSByZCAvIDEwMCB8IDA7XHJcbiAgICAgICAgZWxzZSBpZiAoaSA9PSAxKSByZCA9IHJkIC8gMTAgfCAwO1xyXG4gICAgICAgIHIgPSBybSA8IDQgJiYgcmQgPT0gOTk5OTkgfHwgcm0gPiAzICYmIHJkID09IDQ5OTk5IHx8IHJkID09IDUwMDAwIHx8IHJkID09IDA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgciA9IChybSA8IDQgJiYgcmQgKyAxID09IGsgfHwgcm0gPiAzICYmIHJkICsgMSA9PSBrIC8gMikgJiZcclxuICAgICAgICAgIChkW2RpICsgMV0gLyBrIC8gMTAwIHwgMCkgPT0gbWF0aHBvdygxMCwgaSAtIDIpIC0gMSB8fFxyXG4gICAgICAgICAgICAocmQgPT0gayAvIDIgfHwgcmQgPT0gMCkgJiYgKGRbZGkgKyAxXSAvIGsgLyAxMDAgfCAwKSA9PSAwO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaSA8IDQpIHtcclxuICAgICAgICBpZiAoaSA9PSAwKSByZCA9IHJkIC8gMTAwMCB8IDA7XHJcbiAgICAgICAgZWxzZSBpZiAoaSA9PSAxKSByZCA9IHJkIC8gMTAwIHwgMDtcclxuICAgICAgICBlbHNlIGlmIChpID09IDIpIHJkID0gcmQgLyAxMCB8IDA7XHJcbiAgICAgICAgciA9IChyZXBlYXRpbmcgfHwgcm0gPCA0KSAmJiByZCA9PSA5OTk5IHx8ICFyZXBlYXRpbmcgJiYgcm0gPiAzICYmIHJkID09IDQ5OTk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgciA9ICgocmVwZWF0aW5nIHx8IHJtIDwgNCkgJiYgcmQgKyAxID09IGsgfHxcclxuICAgICAgICAoIXJlcGVhdGluZyAmJiBybSA+IDMpICYmIHJkICsgMSA9PSBrIC8gMikgJiZcclxuICAgICAgICAgIChkW2RpICsgMV0gLyBrIC8gMTAwMCB8IDApID09IG1hdGhwb3coMTAsIGkgLSAzKSAtIDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcjtcclxuICB9XHJcblxyXG5cclxuICAvLyBDb252ZXJ0IHN0cmluZyBvZiBgYmFzZUluYCB0byBhbiBhcnJheSBvZiBudW1iZXJzIG9mIGBiYXNlT3V0YC5cclxuICAvLyBFZy4gY29udmVydEJhc2UoJzI1NScsIDEwLCAxNikgcmV0dXJucyBbMTUsIDE1XS5cclxuICAvLyBFZy4gY29udmVydEJhc2UoJ2ZmJywgMTYsIDEwKSByZXR1cm5zIFsyLCA1LCA1XS5cclxuICBmdW5jdGlvbiBjb252ZXJ0QmFzZShzdHIsIGJhc2VJbiwgYmFzZU91dCkge1xyXG4gICAgdmFyIGosXHJcbiAgICAgIGFyciA9IFswXSxcclxuICAgICAgYXJyTCxcclxuICAgICAgaSA9IDAsXHJcbiAgICAgIHN0ckwgPSBzdHIubGVuZ3RoO1xyXG5cclxuICAgIGZvciAoOyBpIDwgc3RyTDspIHtcclxuICAgICAgZm9yIChhcnJMID0gYXJyLmxlbmd0aDsgYXJyTC0tOykgYXJyW2FyckxdICo9IGJhc2VJbjtcclxuICAgICAgYXJyWzBdICs9IE5VTUVSQUxTLmluZGV4T2Yoc3RyLmNoYXJBdChpKyspKTtcclxuICAgICAgZm9yIChqID0gMDsgaiA8IGFyci5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGlmIChhcnJbal0gPiBiYXNlT3V0IC0gMSkge1xyXG4gICAgICAgICAgaWYgKGFycltqICsgMV0gPT09IHZvaWQgMCkgYXJyW2ogKyAxXSA9IDA7XHJcbiAgICAgICAgICBhcnJbaiArIDFdICs9IGFycltqXSAvIGJhc2VPdXQgfCAwO1xyXG4gICAgICAgICAgYXJyW2pdICU9IGJhc2VPdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFyci5yZXZlcnNlKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBjb3MoeCkgPSAxIC0geF4yLzIhICsgeF40LzQhIC0gLi4uXHJcbiAgICogfHh8IDwgcGkvMlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY29zaW5lKEN0b3IsIHgpIHtcclxuICAgIHZhciBrLCBsZW4sIHk7XHJcblxyXG4gICAgaWYgKHguaXNaZXJvKCkpIHJldHVybiB4O1xyXG5cclxuICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvbjogY29zKDR4KSA9IDgqKGNvc140KHgpIC0gY29zXjIoeCkpICsgMVxyXG4gICAgLy8gaS5lLiBjb3MoeCkgPSA4Kihjb3NeNCh4LzQpIC0gY29zXjIoeC80KSkgKyAxXHJcblxyXG4gICAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgbGVuID0geC5kLmxlbmd0aDtcclxuICAgIGlmIChsZW4gPCAzMikge1xyXG4gICAgICBrID0gTWF0aC5jZWlsKGxlbiAvIDMpO1xyXG4gICAgICB5ID0gKDEgLyB0aW55UG93KDQsIGspKS50b1N0cmluZygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgayA9IDE2O1xyXG4gICAgICB5ID0gJzIuMzI4MzA2NDM2NTM4Njk2Mjg5MDYyNWUtMTAnO1xyXG4gICAgfVxyXG5cclxuICAgIEN0b3IucHJlY2lzaW9uICs9IGs7XHJcblxyXG4gICAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAxLCB4LnRpbWVzKHkpLCBuZXcgQ3RvcigxKSk7XHJcblxyXG4gICAgLy8gUmV2ZXJzZSBhcmd1bWVudCByZWR1Y3Rpb25cclxuICAgIGZvciAodmFyIGkgPSBrOyBpLS07KSB7XHJcbiAgICAgIHZhciBjb3MyeCA9IHgudGltZXMoeCk7XHJcbiAgICAgIHggPSBjb3MyeC50aW1lcyhjb3MyeCkubWludXMoY29zMngpLnRpbWVzKDgpLnBsdXMoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gLT0gaztcclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFBlcmZvcm0gZGl2aXNpb24gaW4gdGhlIHNwZWNpZmllZCBiYXNlLlxyXG4gICAqL1xyXG4gIHZhciBkaXZpZGUgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIC8vIEFzc3VtZXMgbm9uLXplcm8geCBhbmQgaywgYW5kIGhlbmNlIG5vbi16ZXJvIHJlc3VsdC5cclxuICAgIGZ1bmN0aW9uIG11bHRpcGx5SW50ZWdlcih4LCBrLCBiYXNlKSB7XHJcbiAgICAgIHZhciB0ZW1wLFxyXG4gICAgICAgIGNhcnJ5ID0gMCxcclxuICAgICAgICBpID0geC5sZW5ndGg7XHJcblxyXG4gICAgICBmb3IgKHggPSB4LnNsaWNlKCk7IGktLTspIHtcclxuICAgICAgICB0ZW1wID0geFtpXSAqIGsgKyBjYXJyeTtcclxuICAgICAgICB4W2ldID0gdGVtcCAlIGJhc2UgfCAwO1xyXG4gICAgICAgIGNhcnJ5ID0gdGVtcCAvIGJhc2UgfCAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY2FycnkpIHgudW5zaGlmdChjYXJyeSk7XHJcblxyXG4gICAgICByZXR1cm4geDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb21wYXJlKGEsIGIsIGFMLCBiTCkge1xyXG4gICAgICB2YXIgaSwgcjtcclxuXHJcbiAgICAgIGlmIChhTCAhPSBiTCkge1xyXG4gICAgICAgIHIgPSBhTCA+IGJMID8gMSA6IC0xO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvciAoaSA9IHIgPSAwOyBpIDwgYUw7IGkrKykge1xyXG4gICAgICAgICAgaWYgKGFbaV0gIT0gYltpXSkge1xyXG4gICAgICAgICAgICByID0gYVtpXSA+IGJbaV0gPyAxIDogLTE7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3VidHJhY3QoYSwgYiwgYUwsIGJhc2UpIHtcclxuICAgICAgdmFyIGkgPSAwO1xyXG5cclxuICAgICAgLy8gU3VidHJhY3QgYiBmcm9tIGEuXHJcbiAgICAgIGZvciAoOyBhTC0tOykge1xyXG4gICAgICAgIGFbYUxdIC09IGk7XHJcbiAgICAgICAgaSA9IGFbYUxdIDwgYlthTF0gPyAxIDogMDtcclxuICAgICAgICBhW2FMXSA9IGkgKiBiYXNlICsgYVthTF0gLSBiW2FMXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgIGZvciAoOyAhYVswXSAmJiBhLmxlbmd0aCA+IDE7KSBhLnNoaWZ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh4LCB5LCBwciwgcm0sIGRwLCBiYXNlKSB7XHJcbiAgICAgIHZhciBjbXAsIGUsIGksIGssIGxvZ0Jhc2UsIG1vcmUsIHByb2QsIHByb2RMLCBxLCBxZCwgcmVtLCByZW1MLCByZW0wLCBzZCwgdCwgeGksIHhMLCB5ZDAsXHJcbiAgICAgICAgeUwsIHl6LFxyXG4gICAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICAgIHNpZ24gPSB4LnMgPT0geS5zID8gMSA6IC0xLFxyXG4gICAgICAgIHhkID0geC5kLFxyXG4gICAgICAgIHlkID0geS5kO1xyXG5cclxuICAgICAgLy8gRWl0aGVyIE5hTiwgSW5maW5pdHkgb3IgMD9cclxuICAgICAgaWYgKCF4ZCB8fCAheGRbMF0gfHwgIXlkIHx8ICF5ZFswXSkge1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEN0b3IoLy8gUmV0dXJuIE5hTiBpZiBlaXRoZXIgTmFOLCBvciBib3RoIEluZmluaXR5IG9yIDAuXHJcbiAgICAgICAgICAheC5zIHx8ICF5LnMgfHwgKHhkID8geWQgJiYgeGRbMF0gPT0geWRbMF0gOiAheWQpID8gTmFOIDpcclxuXHJcbiAgICAgICAgICAvLyBSZXR1cm4gwrEwIGlmIHggaXMgMCBvciB5IGlzIMKxSW5maW5pdHksIG9yIHJldHVybiDCsUluZmluaXR5IGFzIHkgaXMgMC5cclxuICAgICAgICAgIHhkICYmIHhkWzBdID09IDAgfHwgIXlkID8gc2lnbiAqIDAgOiBzaWduIC8gMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChiYXNlKSB7XHJcbiAgICAgICAgbG9nQmFzZSA9IDE7XHJcbiAgICAgICAgZSA9IHguZSAtIHkuZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBiYXNlID0gQkFTRTtcclxuICAgICAgICBsb2dCYXNlID0gTE9HX0JBU0U7XHJcbiAgICAgICAgZSA9IG1hdGhmbG9vcih4LmUgLyBsb2dCYXNlKSAtIG1hdGhmbG9vcih5LmUgLyBsb2dCYXNlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgeUwgPSB5ZC5sZW5ndGg7XHJcbiAgICAgIHhMID0geGQubGVuZ3RoO1xyXG4gICAgICBxID0gbmV3IEN0b3Ioc2lnbik7XHJcbiAgICAgIHFkID0gcS5kID0gW107XHJcblxyXG4gICAgICAvLyBSZXN1bHQgZXhwb25lbnQgbWF5IGJlIG9uZSBsZXNzIHRoYW4gZS5cclxuICAgICAgLy8gVGhlIGRpZ2l0IGFycmF5IG9mIGEgRGVjaW1hbCBmcm9tIHRvU3RyaW5nQmluYXJ5IG1heSBoYXZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKGkgPSAwOyB5ZFtpXSA9PSAoeGRbaV0gfHwgMCk7IGkrKyk7XHJcblxyXG4gICAgICBpZiAoeWRbaV0gPiAoeGRbaV0gfHwgMCkpIGUtLTtcclxuXHJcbiAgICAgIGlmIChwciA9PSBudWxsKSB7XHJcbiAgICAgICAgc2QgPSBwciA9IEN0b3IucHJlY2lzaW9uO1xyXG4gICAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgICAgfSBlbHNlIGlmIChkcCkge1xyXG4gICAgICAgIHNkID0gcHIgKyAoeC5lIC0geS5lKSArIDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2QgPSBwcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNkIDwgMCkge1xyXG4gICAgICAgIHFkLnB1c2goMSk7XHJcbiAgICAgICAgbW9yZSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIENvbnZlcnQgcHJlY2lzaW9uIGluIG51bWJlciBvZiBiYXNlIDEwIGRpZ2l0cyB0byBiYXNlIDFlNyBkaWdpdHMuXHJcbiAgICAgICAgc2QgPSBzZCAvIGxvZ0Jhc2UgKyAyIHwgMDtcclxuICAgICAgICBpID0gMDtcclxuXHJcbiAgICAgICAgLy8gZGl2aXNvciA8IDFlN1xyXG4gICAgICAgIGlmICh5TCA9PSAxKSB7XHJcbiAgICAgICAgICBrID0gMDtcclxuICAgICAgICAgIHlkID0geWRbMF07XHJcbiAgICAgICAgICBzZCsrO1xyXG5cclxuICAgICAgICAgIC8vIGsgaXMgdGhlIGNhcnJ5LlxyXG4gICAgICAgICAgZm9yICg7IChpIDwgeEwgfHwgaykgJiYgc2QtLTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHQgPSBrICogYmFzZSArICh4ZFtpXSB8fCAwKTtcclxuICAgICAgICAgICAgcWRbaV0gPSB0IC8geWQgfCAwO1xyXG4gICAgICAgICAgICBrID0gdCAlIHlkIHwgMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBtb3JlID0gayB8fCBpIDwgeEw7XHJcblxyXG4gICAgICAgIC8vIGRpdmlzb3IgPj0gMWU3XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAvLyBOb3JtYWxpc2UgeGQgYW5kIHlkIHNvIGhpZ2hlc3Qgb3JkZXIgZGlnaXQgb2YgeWQgaXMgPj0gYmFzZS8yXHJcbiAgICAgICAgICBrID0gYmFzZSAvICh5ZFswXSArIDEpIHwgMDtcclxuXHJcbiAgICAgICAgICBpZiAoayA+IDEpIHtcclxuICAgICAgICAgICAgeWQgPSBtdWx0aXBseUludGVnZXIoeWQsIGssIGJhc2UpO1xyXG4gICAgICAgICAgICB4ZCA9IG11bHRpcGx5SW50ZWdlcih4ZCwgaywgYmFzZSk7XHJcbiAgICAgICAgICAgIHlMID0geWQubGVuZ3RoO1xyXG4gICAgICAgICAgICB4TCA9IHhkLmxlbmd0aDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB4aSA9IHlMO1xyXG4gICAgICAgICAgcmVtID0geGQuc2xpY2UoMCwgeUwpO1xyXG4gICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgLy8gQWRkIHplcm9zIHRvIG1ha2UgcmVtYWluZGVyIGFzIGxvbmcgYXMgZGl2aXNvci5cclxuICAgICAgICAgIGZvciAoOyByZW1MIDwgeUw7KSByZW1bcmVtTCsrXSA9IDA7XHJcblxyXG4gICAgICAgICAgeXogPSB5ZC5zbGljZSgpO1xyXG4gICAgICAgICAgeXoudW5zaGlmdCgwKTtcclxuICAgICAgICAgIHlkMCA9IHlkWzBdO1xyXG5cclxuICAgICAgICAgIGlmICh5ZFsxXSA+PSBiYXNlIC8gMikgKyt5ZDA7XHJcblxyXG4gICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBrID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbXBhcmUgZGl2aXNvciBhbmQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBjbXAgPSBjb21wYXJlKHlkLCByZW0sIHlMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGRpdmlzb3IgPCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIGlmIChjbXAgPCAwKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0cmlhbCBkaWdpdCwgay5cclxuICAgICAgICAgICAgICByZW0wID0gcmVtWzBdO1xyXG4gICAgICAgICAgICAgIGlmICh5TCAhPSByZW1MKSByZW0wID0gcmVtMCAqIGJhc2UgKyAocmVtWzFdIHx8IDApO1xyXG5cclxuICAgICAgICAgICAgICAvLyBrIHdpbGwgYmUgaG93IG1hbnkgdGltZXMgdGhlIGRpdmlzb3IgZ29lcyBpbnRvIHRoZSBjdXJyZW50IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBrID0gcmVtMCAvIHlkMCB8IDA7XHJcblxyXG4gICAgICAgICAgICAgIC8vICBBbGdvcml0aG06XHJcbiAgICAgICAgICAgICAgLy8gIDEuIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQgKGspXHJcbiAgICAgICAgICAgICAgLy8gIDIuIGlmIHByb2R1Y3QgPiByZW1haW5kZXI6IHByb2R1Y3QgLT0gZGl2aXNvciwgay0tXHJcbiAgICAgICAgICAgICAgLy8gIDMuIHJlbWFpbmRlciAtPSBwcm9kdWN0XHJcbiAgICAgICAgICAgICAgLy8gIDQuIGlmIHByb2R1Y3Qgd2FzIDwgcmVtYWluZGVyIGF0IDI6XHJcbiAgICAgICAgICAgICAgLy8gICAgNS4gY29tcGFyZSBuZXcgcmVtYWluZGVyIGFuZCBkaXZpc29yXHJcbiAgICAgICAgICAgICAgLy8gICAgNi4gSWYgcmVtYWluZGVyID4gZGl2aXNvcjogcmVtYWluZGVyIC09IGRpdmlzb3IsIGsrK1xyXG5cclxuICAgICAgICAgICAgICBpZiAoayA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrID49IGJhc2UpIGsgPSBiYXNlIC0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9kdWN0ID0gZGl2aXNvciAqIHRyaWFsIGRpZ2l0LlxyXG4gICAgICAgICAgICAgICAgcHJvZCA9IG11bHRpcGx5SW50ZWdlcih5ZCwgaywgYmFzZSk7XHJcbiAgICAgICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ29tcGFyZSBwcm9kdWN0IGFuZCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICBjbXAgPSBjb21wYXJlKHByb2QsIHJlbSwgcHJvZEwsIHJlbUwpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHByb2R1Y3QgPiByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21wID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgay0tO1xyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgZGl2aXNvciBmcm9tIHByb2R1Y3QuXHJcbiAgICAgICAgICAgICAgICAgIHN1YnRyYWN0KHByb2QsIHlMIDwgcHJvZEwgPyB5eiA6IHlkLCBwcm9kTCwgYmFzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjbXAgaXMgLTEuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBrIGlzIDAsIHRoZXJlIGlzIG5vIG5lZWQgdG8gY29tcGFyZSB5ZCBhbmQgcmVtIGFnYWluIGJlbG93LCBzbyBjaGFuZ2UgY21wIHRvIDFcclxuICAgICAgICAgICAgICAgIC8vIHRvIGF2b2lkIGl0LiBJZiBrIGlzIDEgdGhlcmUgaXMgYSBuZWVkIHRvIGNvbXBhcmUgeWQgYW5kIHJlbSBhZ2FpbiBiZWxvdy5cclxuICAgICAgICAgICAgICAgIGlmIChrID09IDApIGNtcCA9IGsgPSAxO1xyXG4gICAgICAgICAgICAgICAgcHJvZCA9IHlkLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgIGlmIChwcm9kTCA8IHJlbUwpIHByb2QudW5zaGlmdCgwKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gU3VidHJhY3QgcHJvZHVjdCBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHByb2QsIHJlbUwsIGJhc2UpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBJZiBwcm9kdWN0IHdhcyA8IHByZXZpb3VzIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICBpZiAoY21wID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIG5ldyByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICBjbXAgPSBjb21wYXJlKHlkLCByZW0sIHlMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgbmV3IHJlbWFpbmRlciwgc3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgIGlmIChjbXAgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgIGsrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICAgIHN1YnRyYWN0KHJlbSwgeUwgPCByZW1MID8geXogOiB5ZCwgcmVtTCwgYmFzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjbXAgPT09IDApIHtcclxuICAgICAgICAgICAgICBrKys7XHJcbiAgICAgICAgICAgICAgcmVtID0gWzBdO1xyXG4gICAgICAgICAgICB9ICAgIC8vIGlmIGNtcCA9PT0gMSwgayB3aWxsIGJlIDBcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0aGUgbmV4dCBkaWdpdCwgaywgdG8gdGhlIHJlc3VsdCBhcnJheS5cclxuICAgICAgICAgICAgcWRbaSsrXSA9IGs7XHJcblxyXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgaWYgKGNtcCAmJiByZW1bMF0pIHtcclxuICAgICAgICAgICAgICByZW1bcmVtTCsrXSA9IHhkW3hpXSB8fCAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJlbSA9IFt4ZFt4aV1dO1xyXG4gICAgICAgICAgICAgIHJlbUwgPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSB3aGlsZSAoKHhpKysgPCB4TCB8fCByZW1bMF0gIT09IHZvaWQgMCkgJiYgc2QtLSk7XHJcblxyXG4gICAgICAgICAgbW9yZSA9IHJlbVswXSAhPT0gdm9pZCAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTGVhZGluZyB6ZXJvP1xyXG4gICAgICAgIGlmICghcWRbMF0pIHFkLnNoaWZ0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGxvZ0Jhc2UgaXMgMSB3aGVuIGRpdmlkZSBpcyBiZWluZyB1c2VkIGZvciBiYXNlIGNvbnZlcnNpb24uXHJcbiAgICAgIGlmIChsb2dCYXNlID09IDEpIHtcclxuICAgICAgICBxLmUgPSBlO1xyXG4gICAgICAgIGluZXhhY3QgPSBtb3JlO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBUbyBjYWxjdWxhdGUgcS5lLCBmaXJzdCBnZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgcWRbMF0uXHJcbiAgICAgICAgZm9yIChpID0gMSwgayA9IHFkWzBdOyBrID49IDEwOyBrIC89IDEwKSBpKys7XHJcbiAgICAgICAgcS5lID0gaSArIGUgKiBsb2dCYXNlIC0gMTtcclxuXHJcbiAgICAgICAgZmluYWxpc2UocSwgZHAgPyBwciArIHEuZSArIDEgOiBwciwgcm0sIG1vcmUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcTtcclxuICAgIH07XHJcbiAgfSkoKTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUm91bmQgYHhgIHRvIGBzZGAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJtYC5cclxuICAgKiBDaGVjayBmb3Igb3Zlci91bmRlci1mbG93LlxyXG4gICAqL1xyXG4gICBmdW5jdGlvbiBmaW5hbGlzZSh4LCBzZCwgcm0sIGlzVHJ1bmNhdGVkKSB7XHJcbiAgICB2YXIgZGlnaXRzLCBpLCBqLCBrLCByZCwgcm91bmRVcCwgdywgeGQsIHhkaSxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gICAgLy8gRG9uJ3Qgcm91bmQgaWYgc2QgaXMgbnVsbCBvciB1bmRlZmluZWQuXHJcbiAgICBvdXQ6IGlmIChzZCAhPSBudWxsKSB7XHJcbiAgICAgIHhkID0geC5kO1xyXG5cclxuICAgICAgLy8gSW5maW5pdHkvTmFOLlxyXG4gICAgICBpZiAoIXhkKSByZXR1cm4geDtcclxuXHJcbiAgICAgIC8vIHJkOiB0aGUgcm91bmRpbmcgZGlnaXQsIGkuZS4gdGhlIGRpZ2l0IGFmdGVyIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwLlxyXG4gICAgICAvLyB3OiB0aGUgd29yZCBvZiB4ZCBjb250YWluaW5nIHJkLCBhIGJhc2UgMWU3IG51bWJlci5cclxuICAgICAgLy8geGRpOiB0aGUgaW5kZXggb2YgdyB3aXRoaW4geGQuXHJcbiAgICAgIC8vIGRpZ2l0czogdGhlIG51bWJlciBvZiBkaWdpdHMgb2Ygdy5cclxuICAgICAgLy8gaTogd2hhdCB3b3VsZCBiZSB0aGUgaW5kZXggb2YgcmQgd2l0aGluIHcgaWYgYWxsIHRoZSBudW1iZXJzIHdlcmUgNyBkaWdpdHMgbG9uZyAoaS5lLiBpZlxyXG4gICAgICAvLyB0aGV5IGhhZCBsZWFkaW5nIHplcm9zKVxyXG4gICAgICAvLyBqOiBpZiA+IDAsIHRoZSBhY3R1YWwgaW5kZXggb2YgcmQgd2l0aGluIHcgKGlmIDwgMCwgcmQgaXMgYSBsZWFkaW5nIHplcm8pLlxyXG5cclxuICAgICAgLy8gR2V0IHRoZSBsZW5ndGggb2YgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGRpZ2l0cyBhcnJheSB4ZC5cclxuICAgICAgZm9yIChkaWdpdHMgPSAxLCBrID0geGRbMF07IGsgPj0gMTA7IGsgLz0gMTApIGRpZ2l0cysrO1xyXG4gICAgICBpID0gc2QgLSBkaWdpdHM7XHJcblxyXG4gICAgICAvLyBJcyB0aGUgcm91bmRpbmcgZGlnaXQgaW4gdGhlIGZpcnN0IHdvcmQgb2YgeGQ/XHJcbiAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgIGkgKz0gTE9HX0JBU0U7XHJcbiAgICAgICAgaiA9IHNkO1xyXG4gICAgICAgIHcgPSB4ZFt4ZGkgPSAwXTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSByb3VuZGluZyBkaWdpdCBhdCBpbmRleCBqIG9mIHcuXHJcbiAgICAgICAgcmQgPSB3IC8gbWF0aHBvdygxMCwgZGlnaXRzIC0gaiAtIDEpICUgMTAgfCAwO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHhkaSA9IE1hdGguY2VpbCgoaSArIDEpIC8gTE9HX0JBU0UpO1xyXG4gICAgICAgIGsgPSB4ZC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHhkaSA+PSBrKSB7XHJcbiAgICAgICAgICBpZiAoaXNUcnVuY2F0ZWQpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIE5lZWRlZCBieSBgbmF0dXJhbEV4cG9uZW50aWFsYCwgYG5hdHVyYWxMb2dhcml0aG1gIGFuZCBgc3F1YXJlUm9vdGAuXHJcbiAgICAgICAgICAgIGZvciAoOyBrKysgPD0geGRpOykgeGQucHVzaCgwKTtcclxuICAgICAgICAgICAgdyA9IHJkID0gMDtcclxuICAgICAgICAgICAgZGlnaXRzID0gMTtcclxuICAgICAgICAgICAgaSAlPSBMT0dfQkFTRTtcclxuICAgICAgICAgICAgaiA9IGkgLSBMT0dfQkFTRSArIDE7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBicmVhayBvdXQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHcgPSBrID0geGRbeGRpXTtcclxuXHJcbiAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2Ygdy5cclxuICAgICAgICAgIGZvciAoZGlnaXRzID0gMTsgayA+PSAxMDsgayAvPSAxMCkgZGlnaXRzKys7XHJcblxyXG4gICAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdy5cclxuICAgICAgICAgIGkgJT0gTE9HX0JBU0U7XHJcblxyXG4gICAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gdywgYWRqdXN0ZWQgZm9yIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxlYWRpbmcgemVyb3Mgb2YgdyBpcyBnaXZlbiBieSBMT0dfQkFTRSAtIGRpZ2l0cy5cclxuICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyBkaWdpdHM7XHJcblxyXG4gICAgICAgICAgLy8gR2V0IHRoZSByb3VuZGluZyBkaWdpdCBhdCBpbmRleCBqIG9mIHcuXHJcbiAgICAgICAgICByZCA9IGogPCAwID8gMCA6IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqIC0gMSkgJSAxMCB8IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBBcmUgdGhlcmUgYW55IG5vbi16ZXJvIGRpZ2l0cyBhZnRlciB0aGUgcm91bmRpbmcgZGlnaXQ/XHJcbiAgICAgIGlzVHJ1bmNhdGVkID0gaXNUcnVuY2F0ZWQgfHwgc2QgPCAwIHx8XHJcbiAgICAgICAgeGRbeGRpICsgMV0gIT09IHZvaWQgMCB8fCAoaiA8IDAgPyB3IDogdyAlIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKSk7XHJcblxyXG4gICAgICAvLyBUaGUgZXhwcmVzc2lvbiBgdyAlIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGogLSAxKWAgcmV0dXJucyBhbGwgdGhlIGRpZ2l0cyBvZiB3IHRvIHRoZSByaWdodFxyXG4gICAgICAvLyBvZiB0aGUgZGlnaXQgYXQgKGxlZnQtdG8tcmlnaHQpIGluZGV4IGosIGUuZy4gaWYgdyBpcyA5MDg3MTQgYW5kIGogaXMgMiwgdGhlIGV4cHJlc3Npb25cclxuICAgICAgLy8gd2lsbCBnaXZlIDcxNC5cclxuXHJcbiAgICAgIHJvdW5kVXAgPSBybSA8IDRcclxuICAgICAgICA/IChyZCB8fCBpc1RydW5jYXRlZCkgJiYgKHJtID09IDAgfHwgcm0gPT0gKHgucyA8IDAgPyAzIDogMikpXHJcbiAgICAgICAgOiByZCA+IDUgfHwgcmQgPT0gNSAmJiAocm0gPT0gNCB8fCBpc1RydW5jYXRlZCB8fCBybSA9PSA2ICYmXHJcblxyXG4gICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgZGlnaXQgdG8gdGhlIGxlZnQgb2YgdGhlIHJvdW5kaW5nIGRpZ2l0IGlzIG9kZC5cclxuICAgICAgICAgICgoaSA+IDAgPyBqID4gMCA/IHcgLyBtYXRocG93KDEwLCBkaWdpdHMgLSBqKSA6IDAgOiB4ZFt4ZGkgLSAxXSkgJSAxMCkgJiAxIHx8XHJcbiAgICAgICAgICAgIHJtID09ICh4LnMgPCAwID8gOCA6IDcpKTtcclxuXHJcbiAgICAgIGlmIChzZCA8IDEgfHwgIXhkWzBdKSB7XHJcbiAgICAgICAgeGQubGVuZ3RoID0gMDtcclxuICAgICAgICBpZiAocm91bmRVcCkge1xyXG5cclxuICAgICAgICAgIC8vIENvbnZlcnQgc2QgdG8gZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgICAgICBzZCAtPSB4LmUgKyAxO1xyXG5cclxuICAgICAgICAgIC8vIDEsIDAuMSwgMC4wMSwgMC4wMDEsIDAuMDAwMSBldGMuXHJcbiAgICAgICAgICB4ZFswXSA9IG1hdGhwb3coMTAsIChMT0dfQkFTRSAtIHNkICUgTE9HX0JBU0UpICUgTE9HX0JBU0UpO1xyXG4gICAgICAgICAgeC5lID0gLXNkIHx8IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgICAgeGRbMF0gPSB4LmUgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFJlbW92ZSBleGNlc3MgZGlnaXRzLlxyXG4gICAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgICAgeGQubGVuZ3RoID0geGRpO1xyXG4gICAgICAgIGsgPSAxO1xyXG4gICAgICAgIHhkaS0tO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHhkLmxlbmd0aCA9IHhkaSArIDE7XHJcbiAgICAgICAgayA9IG1hdGhwb3coMTAsIExPR19CQVNFIC0gaSk7XHJcblxyXG4gICAgICAgIC8vIEUuZy4gNTY3MDAgYmVjb21lcyA1NjAwMCBpZiA3IGlzIHRoZSByb3VuZGluZyBkaWdpdC5cclxuICAgICAgICAvLyBqID4gMCBtZWFucyBpID4gbnVtYmVyIG9mIGxlYWRpbmcgemVyb3Mgb2Ygdy5cclxuICAgICAgICB4ZFt4ZGldID0gaiA+IDAgPyAodyAvIG1hdGhwb3coMTAsIGRpZ2l0cyAtIGopICUgbWF0aHBvdygxMCwgaikgfCAwKSAqIGsgOiAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocm91bmRVcCkge1xyXG4gICAgICAgIGZvciAoOzspIHtcclxuXHJcbiAgICAgICAgICAvLyBJcyB0aGUgZGlnaXQgdG8gYmUgcm91bmRlZCB1cCBpbiB0aGUgZmlyc3Qgd29yZCBvZiB4ZD9cclxuICAgICAgICAgIGlmICh4ZGkgPT0gMCkge1xyXG5cclxuICAgICAgICAgICAgLy8gaSB3aWxsIGJlIHRoZSBsZW5ndGggb2YgeGRbMF0gYmVmb3JlIGsgaXMgYWRkZWQuXHJcbiAgICAgICAgICAgIGZvciAoaSA9IDEsIGogPSB4ZFswXTsgaiA+PSAxMDsgaiAvPSAxMCkgaSsrO1xyXG4gICAgICAgICAgICBqID0geGRbMF0gKz0gaztcclxuICAgICAgICAgICAgZm9yIChrID0gMTsgaiA+PSAxMDsgaiAvPSAxMCkgaysrO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgaSAhPSBrIHRoZSBsZW5ndGggaGFzIGluY3JlYXNlZC5cclxuICAgICAgICAgICAgaWYgKGkgIT0gaykge1xyXG4gICAgICAgICAgICAgIHguZSsrO1xyXG4gICAgICAgICAgICAgIGlmICh4ZFswXSA9PSBCQVNFKSB4ZFswXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeGRbeGRpXSArPSBrO1xyXG4gICAgICAgICAgICBpZiAoeGRbeGRpXSAhPSBCQVNFKSBicmVhaztcclxuICAgICAgICAgICAgeGRbeGRpLS1dID0gMDtcclxuICAgICAgICAgICAgayA9IDE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgIGZvciAoaSA9IHhkLmxlbmd0aDsgeGRbLS1pXSA9PT0gMDspIHhkLnBvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChleHRlcm5hbCkge1xyXG5cclxuICAgICAgLy8gT3ZlcmZsb3c/XHJcbiAgICAgIGlmICh4LmUgPiBDdG9yLm1heEUpIHtcclxuXHJcbiAgICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgICAgeC5kID0gbnVsbDtcclxuICAgICAgICB4LmUgPSBOYU47XHJcblxyXG4gICAgICAvLyBVbmRlcmZsb3c/XHJcbiAgICAgIH0gZWxzZSBpZiAoeC5lIDwgQ3Rvci5taW5FKSB7XHJcblxyXG4gICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgeC5lID0gMDtcclxuICAgICAgICB4LmQgPSBbMF07XHJcbiAgICAgICAgLy8gQ3Rvci51bmRlcmZsb3cgPSB0cnVlO1xyXG4gICAgICB9IC8vIGVsc2UgQ3Rvci51bmRlcmZsb3cgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBmaW5pdGVUb1N0cmluZyh4LCBpc0V4cCwgc2QpIHtcclxuICAgIGlmICgheC5pc0Zpbml0ZSgpKSByZXR1cm4gbm9uRmluaXRlVG9TdHJpbmcoeCk7XHJcbiAgICB2YXIgayxcclxuICAgICAgZSA9IHguZSxcclxuICAgICAgc3RyID0gZGlnaXRzVG9TdHJpbmcoeC5kKSxcclxuICAgICAgbGVuID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgICBpZiAoaXNFeHApIHtcclxuICAgICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkge1xyXG4gICAgICAgIHN0ciA9IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSkgKyBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgICB9IGVsc2UgaWYgKGxlbiA+IDEpIHtcclxuICAgICAgICBzdHIgPSBzdHIuY2hhckF0KDApICsgJy4nICsgc3RyLnNsaWNlKDEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzdHIgPSBzdHIgKyAoeC5lIDwgMCA/ICdlJyA6ICdlKycpICsgeC5lO1xyXG4gICAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG4gICAgICBzdHIgPSAnMC4nICsgZ2V0WmVyb1N0cmluZygtZSAtIDEpICsgc3RyO1xyXG4gICAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGxlbikgPiAwKSBzdHIgKz0gZ2V0WmVyb1N0cmluZyhrKTtcclxuICAgIH0gZWxzZSBpZiAoZSA+PSBsZW4pIHtcclxuICAgICAgc3RyICs9IGdldFplcm9TdHJpbmcoZSArIDEgLSBsZW4pO1xyXG4gICAgICBpZiAoc2QgJiYgKGsgPSBzZCAtIGUgLSAxKSA+IDApIHN0ciA9IHN0ciArICcuJyArIGdldFplcm9TdHJpbmcoayk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoKGsgPSBlICsgMSkgPCBsZW4pIHN0ciA9IHN0ci5zbGljZSgwLCBrKSArICcuJyArIHN0ci5zbGljZShrKTtcclxuICAgICAgaWYgKHNkICYmIChrID0gc2QgLSBsZW4pID4gMCkge1xyXG4gICAgICAgIGlmIChlICsgMSA9PT0gbGVuKSBzdHIgKz0gJy4nO1xyXG4gICAgICAgIHN0ciArPSBnZXRaZXJvU3RyaW5nKGspO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN0cjtcclxuICB9XHJcblxyXG5cclxuICAvLyBDYWxjdWxhdGUgdGhlIGJhc2UgMTAgZXhwb25lbnQgZnJvbSB0aGUgYmFzZSAxZTcgZXhwb25lbnQuXHJcbiAgZnVuY3Rpb24gZ2V0QmFzZTEwRXhwb25lbnQoZGlnaXRzLCBlKSB7XHJcbiAgICB2YXIgdyA9IGRpZ2l0c1swXTtcclxuXHJcbiAgICAvLyBBZGQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGRpZ2l0cyBhcnJheS5cclxuICAgIGZvciAoIGUgKj0gTE9HX0JBU0U7IHcgPj0gMTA7IHcgLz0gMTApIGUrKztcclxuICAgIHJldHVybiBlO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGdldExuMTAoQ3Rvciwgc2QsIHByKSB7XHJcbiAgICBpZiAoc2QgPiBMTjEwX1BSRUNJU0lPTikge1xyXG5cclxuICAgICAgLy8gUmVzZXQgZ2xvYmFsIHN0YXRlIGluIGNhc2UgdGhlIGV4Y2VwdGlvbiBpcyBjYXVnaHQuXHJcbiAgICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgICAgaWYgKHByKSBDdG9yLnByZWNpc2lvbiA9IHByO1xyXG4gICAgICB0aHJvdyBFcnJvcihwcmVjaXNpb25MaW1pdEV4Y2VlZGVkKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmaW5hbGlzZShuZXcgQ3RvcihMTjEwKSwgc2QsIDEsIHRydWUpO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGdldFBpKEN0b3IsIHNkLCBybSkge1xyXG4gICAgaWYgKHNkID4gUElfUFJFQ0lTSU9OKSB0aHJvdyBFcnJvcihwcmVjaXNpb25MaW1pdEV4Y2VlZGVkKTtcclxuICAgIHJldHVybiBmaW5hbGlzZShuZXcgQ3RvcihQSSksIHNkLCBybSwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZ2V0UHJlY2lzaW9uKGRpZ2l0cykge1xyXG4gICAgdmFyIHcgPSBkaWdpdHMubGVuZ3RoIC0gMSxcclxuICAgICAgbGVuID0gdyAqIExPR19CQVNFICsgMTtcclxuXHJcbiAgICB3ID0gZGlnaXRzW3ddO1xyXG5cclxuICAgIC8vIElmIG5vbi16ZXJvLi4uXHJcbiAgICBpZiAodykge1xyXG5cclxuICAgICAgLy8gU3VidHJhY3QgdGhlIG51bWJlciBvZiB0cmFpbGluZyB6ZXJvcyBvZiB0aGUgbGFzdCB3b3JkLlxyXG4gICAgICBmb3IgKDsgdyAlIDEwID09IDA7IHcgLz0gMTApIGxlbi0tO1xyXG5cclxuICAgICAgLy8gQWRkIHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHRoZSBmaXJzdCB3b3JkLlxyXG4gICAgICBmb3IgKHcgPSBkaWdpdHNbMF07IHcgPj0gMTA7IHcgLz0gMTApIGxlbisrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBsZW47XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZ2V0WmVyb1N0cmluZyhrKSB7XHJcbiAgICB2YXIgenMgPSAnJztcclxuICAgIGZvciAoOyBrLS07KSB6cyArPSAnMCc7XHJcbiAgICByZXR1cm4genM7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgRGVjaW1hbCBgeGAgdG8gdGhlIHBvd2VyIGBuYCwgd2hlcmUgYG5gIGlzIGFuXHJcbiAgICogaW50ZWdlciBvZiB0eXBlIG51bWJlci5cclxuICAgKlxyXG4gICAqIEltcGxlbWVudHMgJ2V4cG9uZW50aWF0aW9uIGJ5IHNxdWFyaW5nJy4gQ2FsbGVkIGJ5IGBwb3dgIGFuZCBgcGFyc2VPdGhlcmAuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBpbnRQb3coQ3RvciwgeCwgbiwgcHIpIHtcclxuICAgIHZhciBpc1RydW5jYXRlZCxcclxuICAgICAgciA9IG5ldyBDdG9yKDEpLFxyXG5cclxuICAgICAgLy8gTWF4IG4gb2YgOTAwNzE5OTI1NDc0MDk5MSB0YWtlcyA1MyBsb29wIGl0ZXJhdGlvbnMuXHJcbiAgICAgIC8vIE1heGltdW0gZGlnaXRzIGFycmF5IGxlbmd0aDsgbGVhdmVzIFsyOCwgMzRdIGd1YXJkIGRpZ2l0cy5cclxuICAgICAgayA9IE1hdGguY2VpbChwciAvIExPR19CQVNFICsgNCk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgICBmb3IgKDs7KSB7XHJcbiAgICAgIGlmIChuICUgMikge1xyXG4gICAgICAgIHIgPSByLnRpbWVzKHgpO1xyXG4gICAgICAgIGlmICh0cnVuY2F0ZShyLmQsIGspKSBpc1RydW5jYXRlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG4gPSBtYXRoZmxvb3IobiAvIDIpO1xyXG4gICAgICBpZiAobiA9PT0gMCkge1xyXG5cclxuICAgICAgICAvLyBUbyBlbnN1cmUgY29ycmVjdCByb3VuZGluZyB3aGVuIHIuZCBpcyB0cnVuY2F0ZWQsIGluY3JlbWVudCB0aGUgbGFzdCB3b3JkIGlmIGl0IGlzIHplcm8uXHJcbiAgICAgICAgbiA9IHIuZC5sZW5ndGggLSAxO1xyXG4gICAgICAgIGlmIChpc1RydW5jYXRlZCAmJiByLmRbbl0gPT09IDApICsrci5kW25dO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB4ID0geC50aW1lcyh4KTtcclxuICAgICAgdHJ1bmNhdGUoeC5kLCBrKTtcclxuICAgIH1cclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gaXNPZGQobikge1xyXG4gICAgcmV0dXJuIG4uZFtuLmQubGVuZ3RoIC0gMV0gJiAxO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogSGFuZGxlIGBtYXhgIGFuZCBgbWluYC4gYGx0Z3RgIGlzICdsdCcgb3IgJ2d0Jy5cclxuICAgKi9cclxuICBmdW5jdGlvbiBtYXhPck1pbihDdG9yLCBhcmdzLCBsdGd0KSB7XHJcbiAgICB2YXIgeSxcclxuICAgICAgeCA9IG5ldyBDdG9yKGFyZ3NbMF0pLFxyXG4gICAgICBpID0gMDtcclxuXHJcbiAgICBmb3IgKDsgKytpIDwgYXJncy5sZW5ndGg7KSB7XHJcbiAgICAgIHkgPSBuZXcgQ3RvcihhcmdzW2ldKTtcclxuICAgICAgaWYgKCF5LnMpIHtcclxuICAgICAgICB4ID0geTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfSBlbHNlIGlmICh4W2x0Z3RdKHkpKSB7XHJcbiAgICAgICAgeCA9IHk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGV4cG9uZW50aWFsIG9mIGB4YCByb3VuZGVkIHRvIGBzZGAgc2lnbmlmaWNhbnRcclxuICAgKiBkaWdpdHMuXHJcbiAgICpcclxuICAgKiBUYXlsb3IvTWFjbGF1cmluIHNlcmllcy5cclxuICAgKlxyXG4gICAqIGV4cCh4KSA9IHheMC8wISArIHheMS8xISArIHheMi8yISArIHheMy8zISArIC4uLlxyXG4gICAqXHJcbiAgICogQXJndW1lbnQgcmVkdWN0aW9uOlxyXG4gICAqICAgUmVwZWF0IHggPSB4IC8gMzIsIGsgKz0gNSwgdW50aWwgfHh8IDwgMC4xXHJcbiAgICogICBleHAoeCkgPSBleHAoeCAvIDJeayleKDJeaylcclxuICAgKlxyXG4gICAqIFByZXZpb3VzbHksIHRoZSBhcmd1bWVudCB3YXMgaW5pdGlhbGx5IHJlZHVjZWQgYnlcclxuICAgKiBleHAoeCkgPSBleHAocikgKiAxMF5rICB3aGVyZSByID0geCAtIGsgKiBsbjEwLCBrID0gZmxvb3IoeCAvIGxuMTApXHJcbiAgICogdG8gZmlyc3QgcHV0IHIgaW4gdGhlIHJhbmdlIFswLCBsbjEwXSwgYmVmb3JlIGRpdmlkaW5nIGJ5IDMyIHVudGlsIHx4fCA8IDAuMSwgYnV0IHRoaXMgd2FzXHJcbiAgICogZm91bmQgdG8gYmUgc2xvd2VyIHRoYW4ganVzdCBkaXZpZGluZyByZXBlYXRlZGx5IGJ5IDMyIGFzIGFib3ZlLlxyXG4gICAqXHJcbiAgICogTWF4IGludGVnZXIgYXJndW1lbnQ6IGV4cCgnMjA3MjMyNjU4MzY5NDY0MTMnKSA9IDYuM2UrOTAwMDAwMDAwMDAwMDAwMFxyXG4gICAqIE1pbiBpbnRlZ2VyIGFyZ3VtZW50OiBleHAoJy0yMDcyMzI2NTgzNjk0NjQxMScpID0gMS4yZS05MDAwMDAwMDAwMDAwMDAwXHJcbiAgICogKE1hdGggb2JqZWN0IGludGVnZXIgbWluL21heDogTWF0aC5leHAoNzA5KSA9IDguMmUrMzA3LCBNYXRoLmV4cCgtNzQ1KSA9IDVlLTMyNClcclxuICAgKlxyXG4gICAqICBleHAoSW5maW5pdHkpICA9IEluZmluaXR5XHJcbiAgICogIGV4cCgtSW5maW5pdHkpID0gMFxyXG4gICAqICBleHAoTmFOKSAgICAgICA9IE5hTlxyXG4gICAqICBleHAowrEwKSAgICAgICAgPSAxXHJcbiAgICpcclxuICAgKiAgZXhwKHgpIGlzIG5vbi10ZXJtaW5hdGluZyBmb3IgYW55IGZpbml0ZSwgbm9uLXplcm8geC5cclxuICAgKlxyXG4gICAqICBUaGUgcmVzdWx0IHdpbGwgYWx3YXlzIGJlIGNvcnJlY3RseSByb3VuZGVkLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbmF0dXJhbEV4cG9uZW50aWFsKHgsIHNkKSB7XHJcbiAgICB2YXIgZGVub21pbmF0b3IsIGd1YXJkLCBqLCBwb3csIHN1bSwgdCwgd3ByLFxyXG4gICAgICByZXAgPSAwLFxyXG4gICAgICBpID0gMCxcclxuICAgICAgayA9IDAsXHJcbiAgICAgIEN0b3IgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICBybSA9IEN0b3Iucm91bmRpbmcsXHJcbiAgICAgIHByID0gQ3Rvci5wcmVjaXNpb247XHJcblxyXG4gICAgLy8gMC9OYU4vSW5maW5pdHk/XHJcbiAgICBpZiAoIXguZCB8fCAheC5kWzBdIHx8IHguZSA+IDE3KSB7XHJcblxyXG4gICAgICByZXR1cm4gbmV3IEN0b3IoeC5kXHJcbiAgICAgICAgPyAheC5kWzBdID8gMSA6IHgucyA8IDAgPyAwIDogMSAvIDBcclxuICAgICAgICA6IHgucyA/IHgucyA8IDAgPyAwIDogeCA6IDAgLyAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2QgPT0gbnVsbCkge1xyXG4gICAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG4gICAgICB3cHIgPSBwcjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHdwciA9IHNkO1xyXG4gICAgfVxyXG5cclxuICAgIHQgPSBuZXcgQ3RvcigwLjAzMTI1KTtcclxuXHJcbiAgICAvLyB3aGlsZSBhYnMoeCkgPj0gMC4xXHJcbiAgICB3aGlsZSAoeC5lID4gLTIpIHtcclxuXHJcbiAgICAgIC8vIHggPSB4IC8gMl41XHJcbiAgICAgIHggPSB4LnRpbWVzKHQpO1xyXG4gICAgICBrICs9IDU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXNlIDIgKiBsb2cxMCgyXmspICsgNSAoZW1waXJpY2FsbHkgZGVyaXZlZCkgdG8gZXN0aW1hdGUgdGhlIGluY3JlYXNlIGluIHByZWNpc2lvblxyXG4gICAgLy8gbmVjZXNzYXJ5IHRvIGVuc3VyZSB0aGUgZmlyc3QgNCByb3VuZGluZyBkaWdpdHMgYXJlIGNvcnJlY3QuXHJcbiAgICBndWFyZCA9IE1hdGgubG9nKG1hdGhwb3coMiwgaykpIC8gTWF0aC5MTjEwICogMiArIDUgfCAwO1xyXG4gICAgd3ByICs9IGd1YXJkO1xyXG4gICAgZGVub21pbmF0b3IgPSBwb3cgPSBzdW0gPSBuZXcgQ3RvcigxKTtcclxuICAgIEN0b3IucHJlY2lzaW9uID0gd3ByO1xyXG5cclxuICAgIGZvciAoOzspIHtcclxuICAgICAgcG93ID0gZmluYWxpc2UocG93LnRpbWVzKHgpLCB3cHIsIDEpO1xyXG4gICAgICBkZW5vbWluYXRvciA9IGRlbm9taW5hdG9yLnRpbWVzKCsraSk7XHJcbiAgICAgIHQgPSBzdW0ucGx1cyhkaXZpZGUocG93LCBkZW5vbWluYXRvciwgd3ByLCAxKSk7XHJcblxyXG4gICAgICBpZiAoZGlnaXRzVG9TdHJpbmcodC5kKS5zbGljZSgwLCB3cHIpID09PSBkaWdpdHNUb1N0cmluZyhzdW0uZCkuc2xpY2UoMCwgd3ByKSkge1xyXG4gICAgICAgIGogPSBrO1xyXG4gICAgICAgIHdoaWxlIChqLS0pIHN1bSA9IGZpbmFsaXNlKHN1bS50aW1lcyhzdW0pLCB3cHIsIDEpO1xyXG5cclxuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIGFyZSBbNDldOTk5LlxyXG4gICAgICAgIC8vIElmIHNvLCByZXBlYXQgdGhlIHN1bW1hdGlvbiB3aXRoIGEgaGlnaGVyIHByZWNpc2lvbiwgb3RoZXJ3aXNlXHJcbiAgICAgICAgLy8gZS5nLiB3aXRoIHByZWNpc2lvbjogMTgsIHJvdW5kaW5nOiAxXHJcbiAgICAgICAgLy8gZXhwKDE4LjQwNDI3MjQ2MjU5NTAzNDA4MzU2Nzc5MzkxOTg0Mzc2MSkgPSA5ODM3MjU2MC4xMjI5OTk5OTk5IChzaG91bGQgYmUgOTgzNzI1NjAuMTIzKVxyXG4gICAgICAgIC8vIGB3cHIgLSBndWFyZGAgaXMgdGhlIGluZGV4IG9mIGZpcnN0IHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgIGlmIChzZCA9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgaWYgKHJlcCA8IDMgJiYgY2hlY2tSb3VuZGluZ0RpZ2l0cyhzdW0uZCwgd3ByIC0gZ3VhcmQsIHJtLCByZXApKSB7XHJcbiAgICAgICAgICAgIEN0b3IucHJlY2lzaW9uID0gd3ByICs9IDEwO1xyXG4gICAgICAgICAgICBkZW5vbWluYXRvciA9IHBvdyA9IHQgPSBuZXcgQ3RvcigxKTtcclxuICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgICAgIHJlcCsrO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbmFsaXNlKHN1bSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgcm0sIGV4dGVybmFsID0gdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc3VtID0gdDtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGxvZ2FyaXRobSBvZiBgeGAgcm91bmRlZCB0byBgc2RgIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzLlxyXG4gICAqXHJcbiAgICogIGxuKC1uKSAgICAgICAgPSBOYU5cclxuICAgKiAgbG4oMCkgICAgICAgICA9IC1JbmZpbml0eVxyXG4gICAqICBsbigtMCkgICAgICAgID0gLUluZmluaXR5XHJcbiAgICogIGxuKDEpICAgICAgICAgPSAwXHJcbiAgICogIGxuKEluZmluaXR5KSAgPSBJbmZpbml0eVxyXG4gICAqICBsbigtSW5maW5pdHkpID0gTmFOXHJcbiAgICogIGxuKE5hTikgICAgICAgPSBOYU5cclxuICAgKlxyXG4gICAqICBsbihuKSAobiAhPSAxKSBpcyBub24tdGVybWluYXRpbmcuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBuYXR1cmFsTG9nYXJpdGhtKHksIHNkKSB7XHJcbiAgICB2YXIgYywgYzAsIGRlbm9taW5hdG9yLCBlLCBudW1lcmF0b3IsIHJlcCwgc3VtLCB0LCB3cHIsIHgxLCB4MixcclxuICAgICAgbiA9IDEsXHJcbiAgICAgIGd1YXJkID0gMTAsXHJcbiAgICAgIHggPSB5LFxyXG4gICAgICB4ZCA9IHguZCxcclxuICAgICAgQ3RvciA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZyxcclxuICAgICAgcHIgPSBDdG9yLnByZWNpc2lvbjtcclxuXHJcbiAgICAvLyBJcyB4IG5lZ2F0aXZlIG9yIEluZmluaXR5LCBOYU4sIDAgb3IgMT9cclxuICAgIGlmICh4LnMgPCAwIHx8ICF4ZCB8fCAheGRbMF0gfHwgIXguZSAmJiB4ZFswXSA9PSAxICYmIHhkLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQ3Rvcih4ZCAmJiAheGRbMF0gPyAtMSAvIDAgOiB4LnMgIT0gMSA/IE5hTiA6IHhkID8gMCA6IHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZCA9PSBudWxsKSB7XHJcbiAgICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICAgIHdwciA9IHByO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3ByID0gc2Q7XHJcbiAgICB9XHJcblxyXG4gICAgQ3Rvci5wcmVjaXNpb24gPSB3cHIgKz0gZ3VhcmQ7XHJcbiAgICBjID0gZGlnaXRzVG9TdHJpbmcoeGQpO1xyXG4gICAgYzAgPSBjLmNoYXJBdCgwKTtcclxuXHJcbiAgICBpZiAoTWF0aC5hYnMoZSA9IHguZSkgPCAxLjVlMTUpIHtcclxuXHJcbiAgICAgIC8vIEFyZ3VtZW50IHJlZHVjdGlvbi5cclxuICAgICAgLy8gVGhlIHNlcmllcyBjb252ZXJnZXMgZmFzdGVyIHRoZSBjbG9zZXIgdGhlIGFyZ3VtZW50IGlzIHRvIDEsIHNvIHVzaW5nXHJcbiAgICAgIC8vIGxuKGFeYikgPSBiICogbG4oYSksICAgbG4oYSkgPSBsbihhXmIpIC8gYlxyXG4gICAgICAvLyBtdWx0aXBseSB0aGUgYXJndW1lbnQgYnkgaXRzZWxmIHVudGlsIHRoZSBsZWFkaW5nIGRpZ2l0cyBvZiB0aGUgc2lnbmlmaWNhbmQgYXJlIDcsIDgsIDksXHJcbiAgICAgIC8vIDEwLCAxMSwgMTIgb3IgMTMsIHJlY29yZGluZyB0aGUgbnVtYmVyIG9mIG11bHRpcGxpY2F0aW9ucyBzbyB0aGUgc3VtIG9mIHRoZSBzZXJpZXMgY2FuXHJcbiAgICAgIC8vIGxhdGVyIGJlIGRpdmlkZWQgYnkgdGhpcyBudW1iZXIsIHRoZW4gc2VwYXJhdGUgb3V0IHRoZSBwb3dlciBvZiAxMCB1c2luZ1xyXG4gICAgICAvLyBsbihhKjEwXmIpID0gbG4oYSkgKyBiKmxuKDEwKS5cclxuXHJcbiAgICAgIC8vIG1heCBuIGlzIDIxIChnaXZlcyAwLjksIDEuMCBvciAxLjEpICg5ZTE1IC8gMjEgPSA0LjJlMTQpLlxyXG4gICAgICAvL3doaWxlIChjMCA8IDkgJiYgYzAgIT0gMSB8fCBjMCA9PSAxICYmIGMuY2hhckF0KDEpID4gMSkge1xyXG4gICAgICAvLyBtYXggbiBpcyA2IChnaXZlcyAwLjcgLSAxLjMpXHJcbiAgICAgIHdoaWxlIChjMCA8IDcgJiYgYzAgIT0gMSB8fCBjMCA9PSAxICYmIGMuY2hhckF0KDEpID4gMykge1xyXG4gICAgICAgIHggPSB4LnRpbWVzKHkpO1xyXG4gICAgICAgIGMgPSBkaWdpdHNUb1N0cmluZyh4LmQpO1xyXG4gICAgICAgIGMwID0gYy5jaGFyQXQoMCk7XHJcbiAgICAgICAgbisrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlID0geC5lO1xyXG5cclxuICAgICAgaWYgKGMwID4gMSkge1xyXG4gICAgICAgIHggPSBuZXcgQ3RvcignMC4nICsgYyk7XHJcbiAgICAgICAgZSsrO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHggPSBuZXcgQ3RvcihjMCArICcuJyArIGMuc2xpY2UoMSkpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gVGhlIGFyZ3VtZW50IHJlZHVjdGlvbiBtZXRob2QgYWJvdmUgbWF5IHJlc3VsdCBpbiBvdmVyZmxvdyBpZiB0aGUgYXJndW1lbnQgeSBpcyBhIG1hc3NpdmVcclxuICAgICAgLy8gbnVtYmVyIHdpdGggZXhwb25lbnQgPj0gMTUwMDAwMDAwMDAwMDAwMCAoOWUxNSAvIDYgPSAxLjVlMTUpLCBzbyBpbnN0ZWFkIHJlY2FsbCB0aGlzXHJcbiAgICAgIC8vIGZ1bmN0aW9uIHVzaW5nIGxuKHgqMTBeZSkgPSBsbih4KSArIGUqbG4oMTApLlxyXG4gICAgICB0ID0gZ2V0TG4xMChDdG9yLCB3cHIgKyAyLCBwcikudGltZXMoZSArICcnKTtcclxuICAgICAgeCA9IG5hdHVyYWxMb2dhcml0aG0obmV3IEN0b3IoYzAgKyAnLicgKyBjLnNsaWNlKDEpKSwgd3ByIC0gZ3VhcmQpLnBsdXModCk7XHJcbiAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcblxyXG4gICAgICByZXR1cm4gc2QgPT0gbnVsbCA/IGZpbmFsaXNlKHgsIHByLCBybSwgZXh0ZXJuYWwgPSB0cnVlKSA6IHg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8geDEgaXMgeCByZWR1Y2VkIHRvIGEgdmFsdWUgbmVhciAxLlxyXG4gICAgeDEgPSB4O1xyXG5cclxuICAgIC8vIFRheWxvciBzZXJpZXMuXHJcbiAgICAvLyBsbih5KSA9IGxuKCgxICsgeCkvKDEgLSB4KSkgPSAyKHggKyB4XjMvMyArIHheNS81ICsgeF43LzcgKyAuLi4pXHJcbiAgICAvLyB3aGVyZSB4ID0gKHkgLSAxKS8oeSArIDEpICAgICh8eHwgPCAxKVxyXG4gICAgc3VtID0gbnVtZXJhdG9yID0geCA9IGRpdmlkZSh4Lm1pbnVzKDEpLCB4LnBsdXMoMSksIHdwciwgMSk7XHJcbiAgICB4MiA9IGZpbmFsaXNlKHgudGltZXMoeCksIHdwciwgMSk7XHJcbiAgICBkZW5vbWluYXRvciA9IDM7XHJcblxyXG4gICAgZm9yICg7Oykge1xyXG4gICAgICBudW1lcmF0b3IgPSBmaW5hbGlzZShudW1lcmF0b3IudGltZXMoeDIpLCB3cHIsIDEpO1xyXG4gICAgICB0ID0gc3VtLnBsdXMoZGl2aWRlKG51bWVyYXRvciwgbmV3IEN0b3IoZGVub21pbmF0b3IpLCB3cHIsIDEpKTtcclxuXHJcbiAgICAgIGlmIChkaWdpdHNUb1N0cmluZyh0LmQpLnNsaWNlKDAsIHdwcikgPT09IGRpZ2l0c1RvU3RyaW5nKHN1bS5kKS5zbGljZSgwLCB3cHIpKSB7XHJcbiAgICAgICAgc3VtID0gc3VtLnRpbWVzKDIpO1xyXG5cclxuICAgICAgICAvLyBSZXZlcnNlIHRoZSBhcmd1bWVudCByZWR1Y3Rpb24uIENoZWNrIHRoYXQgZSBpcyBub3QgMCBiZWNhdXNlLCBiZXNpZGVzIHByZXZlbnRpbmcgYW5cclxuICAgICAgICAvLyB1bm5lY2Vzc2FyeSBjYWxjdWxhdGlvbiwgLTAgKyAwID0gKzAgYW5kIHRvIGVuc3VyZSBjb3JyZWN0IHJvdW5kaW5nIC0wIG5lZWRzIHRvIHN0YXkgLTAuXHJcbiAgICAgICAgaWYgKGUgIT09IDApIHN1bSA9IHN1bS5wbHVzKGdldExuMTAoQ3Rvciwgd3ByICsgMiwgcHIpLnRpbWVzKGUgKyAnJykpO1xyXG4gICAgICAgIHN1bSA9IGRpdmlkZShzdW0sIG5ldyBDdG9yKG4pLCB3cHIsIDEpO1xyXG5cclxuICAgICAgICAvLyBJcyBybSA+IDMgYW5kIHRoZSBmaXJzdCA0IHJvdW5kaW5nIGRpZ2l0cyA0OTk5LCBvciBybSA8IDQgKG9yIHRoZSBzdW1tYXRpb24gaGFzXHJcbiAgICAgICAgLy8gYmVlbiByZXBlYXRlZCBwcmV2aW91c2x5KSBhbmQgdGhlIGZpcnN0IDQgcm91bmRpbmcgZGlnaXRzIDk5OTk/XHJcbiAgICAgICAgLy8gSWYgc28sIHJlc3RhcnQgdGhlIHN1bW1hdGlvbiB3aXRoIGEgaGlnaGVyIHByZWNpc2lvbiwgb3RoZXJ3aXNlXHJcbiAgICAgICAgLy8gZS5nLiB3aXRoIHByZWNpc2lvbjogMTIsIHJvdW5kaW5nOiAxXHJcbiAgICAgICAgLy8gbG4oMTM1NTIwMDI4LjYxMjYwOTE3MTQyNjUzODE1MzMpID0gMTguNzI0NjI5OTk5OSB3aGVuIGl0IHNob3VsZCBiZSAxOC43MjQ2My5cclxuICAgICAgICAvLyBgd3ByIC0gZ3VhcmRgIGlzIHRoZSBpbmRleCBvZiBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgICBpZiAoc2QgPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYgKGNoZWNrUm91bmRpbmdEaWdpdHMoc3VtLmQsIHdwciAtIGd1YXJkLCBybSwgcmVwKSkge1xyXG4gICAgICAgICAgICBDdG9yLnByZWNpc2lvbiA9IHdwciArPSBndWFyZDtcclxuICAgICAgICAgICAgdCA9IG51bWVyYXRvciA9IHggPSBkaXZpZGUoeDEubWludXMoMSksIHgxLnBsdXMoMSksIHdwciwgMSk7XHJcbiAgICAgICAgICAgIHgyID0gZmluYWxpc2UoeC50aW1lcyh4KSwgd3ByLCAxKTtcclxuICAgICAgICAgICAgZGVub21pbmF0b3IgPSByZXAgPSAxO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbmFsaXNlKHN1bSwgQ3Rvci5wcmVjaXNpb24gPSBwciwgcm0sIGV4dGVybmFsID0gdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIEN0b3IucHJlY2lzaW9uID0gcHI7XHJcbiAgICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc3VtID0gdDtcclxuICAgICAgZGVub21pbmF0b3IgKz0gMjtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLyDCsUluZmluaXR5LCBOYU4uXHJcbiAgZnVuY3Rpb24gbm9uRmluaXRlVG9TdHJpbmcoeCkge1xyXG4gICAgLy8gVW5zaWduZWQuXHJcbiAgICByZXR1cm4gU3RyaW5nKHgucyAqIHgucyAvIDApO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUGFyc2UgdGhlIHZhbHVlIG9mIGEgbmV3IERlY2ltYWwgYHhgIGZyb20gc3RyaW5nIGBzdHJgLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHBhcnNlRGVjaW1hbCh4LCBzdHIpIHtcclxuICAgIHZhciBlLCBpLCBsZW47XHJcblxyXG4gICAgLy8gRGVjaW1hbCBwb2ludD9cclxuICAgIGlmICgoZSA9IHN0ci5pbmRleE9mKCcuJykpID4gLTEpIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG5cclxuICAgIC8vIEV4cG9uZW50aWFsIGZvcm0/XHJcbiAgICBpZiAoKGkgPSBzdHIuc2VhcmNoKC9lL2kpKSA+IDApIHtcclxuXHJcbiAgICAgIC8vIERldGVybWluZSBleHBvbmVudC5cclxuICAgICAgaWYgKGUgPCAwKSBlID0gaTtcclxuICAgICAgZSArPSArc3RyLnNsaWNlKGkgKyAxKTtcclxuICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCBpKTtcclxuICAgIH0gZWxzZSBpZiAoZSA8IDApIHtcclxuXHJcbiAgICAgIC8vIEludGVnZXIuXHJcbiAgICAgIGUgPSBzdHIubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERldGVybWluZSBsZWFkaW5nIHplcm9zLlxyXG4gICAgZm9yIChpID0gMDsgc3RyLmNoYXJDb2RlQXQoaSkgPT09IDQ4OyBpKyspO1xyXG5cclxuICAgIC8vIERldGVybWluZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAobGVuID0gc3RyLmxlbmd0aDsgc3RyLmNoYXJDb2RlQXQobGVuIC0gMSkgPT09IDQ4OyAtLWxlbik7XHJcbiAgICBzdHIgPSBzdHIuc2xpY2UoaSwgbGVuKTtcclxuXHJcbiAgICBpZiAoc3RyKSB7XHJcbiAgICAgIGxlbiAtPSBpO1xyXG4gICAgICB4LmUgPSBlID0gZSAtIGkgLSAxO1xyXG4gICAgICB4LmQgPSBbXTtcclxuXHJcbiAgICAgIC8vIFRyYW5zZm9ybSBiYXNlXHJcblxyXG4gICAgICAvLyBlIGlzIHRoZSBiYXNlIDEwIGV4cG9uZW50LlxyXG4gICAgICAvLyBpIGlzIHdoZXJlIHRvIHNsaWNlIHN0ciB0byBnZXQgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGRpZ2l0cyBhcnJheS5cclxuICAgICAgaSA9IChlICsgMSkgJSBMT0dfQkFTRTtcclxuICAgICAgaWYgKGUgPCAwKSBpICs9IExPR19CQVNFO1xyXG5cclxuICAgICAgaWYgKGkgPCBsZW4pIHtcclxuICAgICAgICBpZiAoaSkgeC5kLnB1c2goK3N0ci5zbGljZSgwLCBpKSk7XHJcbiAgICAgICAgZm9yIChsZW4gLT0gTE9HX0JBU0U7IGkgPCBsZW47KSB4LmQucHVzaCgrc3RyLnNsaWNlKGksIGkgKz0gTE9HX0JBU0UpKTtcclxuICAgICAgICBzdHIgPSBzdHIuc2xpY2UoaSk7XHJcbiAgICAgICAgaSA9IExPR19CQVNFIC0gc3RyLmxlbmd0aDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpIC09IGxlbjtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yICg7IGktLTspIHN0ciArPSAnMCc7XHJcbiAgICAgIHguZC5wdXNoKCtzdHIpO1xyXG5cclxuICAgICAgaWYgKGV4dGVybmFsKSB7XHJcblxyXG4gICAgICAgIC8vIE92ZXJmbG93P1xyXG4gICAgICAgIGlmICh4LmUgPiB4LmNvbnN0cnVjdG9yLm1heEUpIHtcclxuXHJcbiAgICAgICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgICAgICB4LmUgPSBOYU47XHJcblxyXG4gICAgICAgIC8vIFVuZGVyZmxvdz9cclxuICAgICAgICB9IGVsc2UgaWYgKHguZSA8IHguY29uc3RydWN0b3IubWluRSkge1xyXG5cclxuICAgICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgICAgLy8geC5jb25zdHJ1Y3Rvci51bmRlcmZsb3cgPSB0cnVlO1xyXG4gICAgICAgIH0gLy8gZWxzZSB4LmNvbnN0cnVjdG9yLnVuZGVyZmxvdyA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gWmVyby5cclxuICAgICAgeC5lID0gMDtcclxuICAgICAgeC5kID0gWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUGFyc2UgdGhlIHZhbHVlIG9mIGEgbmV3IERlY2ltYWwgYHhgIGZyb20gYSBzdHJpbmcgYHN0cmAsIHdoaWNoIGlzIG5vdCBhIGRlY2ltYWwgdmFsdWUuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcGFyc2VPdGhlcih4LCBzdHIpIHtcclxuICAgIHZhciBiYXNlLCBDdG9yLCBkaXZpc29yLCBpLCBpc0Zsb2F0LCBsZW4sIHAsIHhkLCB4ZTtcclxuXHJcbiAgICBpZiAoc3RyLmluZGV4T2YoJ18nKSA+IC0xKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8oXFxkKV8oPz1cXGQpL2csICckMScpO1xyXG4gICAgICBpZiAoaXNEZWNpbWFsLnRlc3Qoc3RyKSkgcmV0dXJuIHBhcnNlRGVjaW1hbCh4LCBzdHIpO1xyXG4gICAgfSBlbHNlIGlmIChzdHIgPT09ICdJbmZpbml0eScgfHwgc3RyID09PSAnTmFOJykge1xyXG4gICAgICBpZiAoIStzdHIpIHgucyA9IE5hTjtcclxuICAgICAgeC5lID0gTmFOO1xyXG4gICAgICB4LmQgPSBudWxsO1xyXG4gICAgICByZXR1cm4geDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNIZXgudGVzdChzdHIpKSAge1xyXG4gICAgICBiYXNlID0gMTY7XHJcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfSBlbHNlIGlmIChpc0JpbmFyeS50ZXN0KHN0cikpICB7XHJcbiAgICAgIGJhc2UgPSAyO1xyXG4gICAgfSBlbHNlIGlmIChpc09jdGFsLnRlc3Qoc3RyKSkgIHtcclxuICAgICAgYmFzZSA9IDg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBzdHIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElzIHRoZXJlIGEgYmluYXJ5IGV4cG9uZW50IHBhcnQ/XHJcbiAgICBpID0gc3RyLnNlYXJjaCgvcC9pKTtcclxuXHJcbiAgICBpZiAoaSA+IDApIHtcclxuICAgICAgcCA9ICtzdHIuc2xpY2UoaSArIDEpO1xyXG4gICAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDIsIGkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3RyID0gc3RyLnNsaWNlKDIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbnZlcnQgYHN0cmAgYXMgYW4gaW50ZWdlciB0aGVuIGRpdmlkZSB0aGUgcmVzdWx0IGJ5IGBiYXNlYCByYWlzZWQgdG8gYSBwb3dlciBzdWNoIHRoYXQgdGhlXHJcbiAgICAvLyBmcmFjdGlvbiBwYXJ0IHdpbGwgYmUgcmVzdG9yZWQuXHJcbiAgICBpID0gc3RyLmluZGV4T2YoJy4nKTtcclxuICAgIGlzRmxvYXQgPSBpID49IDA7XHJcbiAgICBDdG9yID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICBpZiAoaXNGbG9hdCkge1xyXG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuICAgICAgbGVuID0gc3RyLmxlbmd0aDtcclxuICAgICAgaSA9IGxlbiAtIGk7XHJcblxyXG4gICAgICAvLyBsb2dbMTBdKDE2KSA9IDEuMjA0MS4uLiAsIGxvZ1sxMF0oODgpID0gMS45NDQ0Li4uLlxyXG4gICAgICBkaXZpc29yID0gaW50UG93KEN0b3IsIG5ldyBDdG9yKGJhc2UpLCBpLCBpICogMik7XHJcbiAgICB9XHJcblxyXG4gICAgeGQgPSBjb252ZXJ0QmFzZShzdHIsIGJhc2UsIEJBU0UpO1xyXG4gICAgeGUgPSB4ZC5sZW5ndGggLSAxO1xyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoaSA9IHhlOyB4ZFtpXSA9PT0gMDsgLS1pKSB4ZC5wb3AoKTtcclxuICAgIGlmIChpIDwgMCkgcmV0dXJuIG5ldyBDdG9yKHgucyAqIDApO1xyXG4gICAgeC5lID0gZ2V0QmFzZTEwRXhwb25lbnQoeGQsIHhlKTtcclxuICAgIHguZCA9IHhkO1xyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBBdCB3aGF0IHByZWNpc2lvbiB0byBwZXJmb3JtIHRoZSBkaXZpc2lvbiB0byBlbnN1cmUgZXhhY3QgY29udmVyc2lvbj9cclxuICAgIC8vIG1heERlY2ltYWxJbnRlZ2VyUGFydERpZ2l0Q291bnQgPSBjZWlsKGxvZ1sxMF0oYikgKiBvdGhlckJhc2VJbnRlZ2VyUGFydERpZ2l0Q291bnQpXHJcbiAgICAvLyBsb2dbMTBdKDIpID0gMC4zMDEwMywgbG9nWzEwXSg4KSA9IDAuOTAzMDksIGxvZ1sxMF0oMTYpID0gMS4yMDQxMlxyXG4gICAgLy8gRS5nLiBjZWlsKDEuMiAqIDMpID0gNCwgc28gdXAgdG8gNCBkZWNpbWFsIGRpZ2l0cyBhcmUgbmVlZGVkIHRvIHJlcHJlc2VudCAzIGhleCBpbnQgZGlnaXRzLlxyXG4gICAgLy8gbWF4RGVjaW1hbEZyYWN0aW9uUGFydERpZ2l0Q291bnQgPSB7SGV4OjR8T2N0OjN8QmluOjF9ICogb3RoZXJCYXNlRnJhY3Rpb25QYXJ0RGlnaXRDb3VudFxyXG4gICAgLy8gVGhlcmVmb3JlIHVzaW5nIDQgKiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBzdHIgd2lsbCBhbHdheXMgYmUgZW5vdWdoLlxyXG4gICAgaWYgKGlzRmxvYXQpIHggPSBkaXZpZGUoeCwgZGl2aXNvciwgbGVuICogNCk7XHJcblxyXG4gICAgLy8gTXVsdGlwbHkgYnkgdGhlIGJpbmFyeSBleHBvbmVudCBwYXJ0IGlmIHByZXNlbnQuXHJcbiAgICBpZiAocCkgeCA9IHgudGltZXMoTWF0aC5hYnMocCkgPCA1NCA/IG1hdGhwb3coMiwgcCkgOiBEZWNpbWFsLnBvdygyLCBwKSk7XHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIHg7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBzaW4oeCkgPSB4IC0geF4zLzMhICsgeF41LzUhIC0gLi4uXHJcbiAgICogfHh8IDwgcGkvMlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc2luZShDdG9yLCB4KSB7XHJcbiAgICB2YXIgayxcclxuICAgICAgbGVuID0geC5kLmxlbmd0aDtcclxuXHJcbiAgICBpZiAobGVuIDwgMykge1xyXG4gICAgICByZXR1cm4geC5pc1plcm8oKSA/IHggOiB0YXlsb3JTZXJpZXMoQ3RvciwgMiwgeCwgeCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQXJndW1lbnQgcmVkdWN0aW9uOiBzaW4oNXgpID0gMTYqc2luXjUoeCkgLSAyMCpzaW5eMyh4KSArIDUqc2luKHgpXHJcbiAgICAvLyBpLmUuIHNpbih4KSA9IDE2KnNpbl41KHgvNSkgLSAyMCpzaW5eMyh4LzUpICsgNSpzaW4oeC81KVxyXG4gICAgLy8gYW5kICBzaW4oeCkgPSBzaW4oeC81KSg1ICsgc2luXjIoeC81KSgxNnNpbl4yKHgvNSkgLSAyMCkpXHJcblxyXG4gICAgLy8gRXN0aW1hdGUgdGhlIG9wdGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHVzZSB0aGUgYXJndW1lbnQgcmVkdWN0aW9uLlxyXG4gICAgayA9IDEuNCAqIE1hdGguc3FydChsZW4pO1xyXG4gICAgayA9IGsgPiAxNiA/IDE2IDogayB8IDA7XHJcblxyXG4gICAgeCA9IHgudGltZXMoMSAvIHRpbnlQb3coNSwgaykpO1xyXG4gICAgeCA9IHRheWxvclNlcmllcyhDdG9yLCAyLCB4LCB4KTtcclxuXHJcbiAgICAvLyBSZXZlcnNlIGFyZ3VtZW50IHJlZHVjdGlvblxyXG4gICAgdmFyIHNpbjJfeCxcclxuICAgICAgZDUgPSBuZXcgQ3Rvcig1KSxcclxuICAgICAgZDE2ID0gbmV3IEN0b3IoMTYpLFxyXG4gICAgICBkMjAgPSBuZXcgQ3RvcigyMCk7XHJcbiAgICBmb3IgKDsgay0tOykge1xyXG4gICAgICBzaW4yX3ggPSB4LnRpbWVzKHgpO1xyXG4gICAgICB4ID0geC50aW1lcyhkNS5wbHVzKHNpbjJfeC50aW1lcyhkMTYudGltZXMoc2luMl94KS5taW51cyhkMjApKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB4O1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIENhbGN1bGF0ZSBUYXlsb3Igc2VyaWVzIGZvciBgY29zYCwgYGNvc2hgLCBgc2luYCBhbmQgYHNpbmhgLlxyXG4gIGZ1bmN0aW9uIHRheWxvclNlcmllcyhDdG9yLCBuLCB4LCB5LCBpc0h5cGVyYm9saWMpIHtcclxuICAgIHZhciBqLCB0LCB1LCB4MixcclxuICAgICAgaSA9IDEsXHJcbiAgICAgIHByID0gQ3Rvci5wcmVjaXNpb24sXHJcbiAgICAgIGsgPSBNYXRoLmNlaWwocHIgLyBMT0dfQkFTRSk7XHJcblxyXG4gICAgZXh0ZXJuYWwgPSBmYWxzZTtcclxuICAgIHgyID0geC50aW1lcyh4KTtcclxuICAgIHUgPSBuZXcgQ3Rvcih5KTtcclxuXHJcbiAgICBmb3IgKDs7KSB7XHJcbiAgICAgIHQgPSBkaXZpZGUodS50aW1lcyh4MiksIG5ldyBDdG9yKG4rKyAqIG4rKyksIHByLCAxKTtcclxuICAgICAgdSA9IGlzSHlwZXJib2xpYyA/IHkucGx1cyh0KSA6IHkubWludXModCk7XHJcbiAgICAgIHkgPSBkaXZpZGUodC50aW1lcyh4MiksIG5ldyBDdG9yKG4rKyAqIG4rKyksIHByLCAxKTtcclxuICAgICAgdCA9IHUucGx1cyh5KTtcclxuXHJcbiAgICAgIGlmICh0LmRba10gIT09IHZvaWQgMCkge1xyXG4gICAgICAgIGZvciAoaiA9IGs7IHQuZFtqXSA9PT0gdS5kW2pdICYmIGotLTspO1xyXG4gICAgICAgIGlmIChqID09IC0xKSBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaiA9IHU7XHJcbiAgICAgIHUgPSB5O1xyXG4gICAgICB5ID0gdDtcclxuICAgICAgdCA9IGo7XHJcbiAgICAgIGkrKztcclxuICAgIH1cclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcbiAgICB0LmQubGVuZ3RoID0gayArIDE7XHJcblxyXG4gICAgcmV0dXJuIHQ7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gRXhwb25lbnQgZSBtdXN0IGJlIHBvc2l0aXZlIGFuZCBub24temVyby5cclxuICBmdW5jdGlvbiB0aW55UG93KGIsIGUpIHtcclxuICAgIHZhciBuID0gYjtcclxuICAgIHdoaWxlICgtLWUpIG4gKj0gYjtcclxuICAgIHJldHVybiBuO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIFJldHVybiB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgYHhgIHJlZHVjZWQgdG8gbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGhhbGYgcGkuXHJcbiAgZnVuY3Rpb24gdG9MZXNzVGhhbkhhbGZQaShDdG9yLCB4KSB7XHJcbiAgICB2YXIgdCxcclxuICAgICAgaXNOZWcgPSB4LnMgPCAwLFxyXG4gICAgICBwaSA9IGdldFBpKEN0b3IsIEN0b3IucHJlY2lzaW9uLCAxKSxcclxuICAgICAgaGFsZlBpID0gcGkudGltZXMoMC41KTtcclxuXHJcbiAgICB4ID0geC5hYnMoKTtcclxuXHJcbiAgICBpZiAoeC5sdGUoaGFsZlBpKSkge1xyXG4gICAgICBxdWFkcmFudCA9IGlzTmVnID8gNCA6IDE7XHJcbiAgICAgIHJldHVybiB4O1xyXG4gICAgfVxyXG5cclxuICAgIHQgPSB4LmRpdlRvSW50KHBpKTtcclxuXHJcbiAgICBpZiAodC5pc1plcm8oKSkge1xyXG4gICAgICBxdWFkcmFudCA9IGlzTmVnID8gMyA6IDI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB4ID0geC5taW51cyh0LnRpbWVzKHBpKSk7XHJcblxyXG4gICAgICAvLyAwIDw9IHggPCBwaVxyXG4gICAgICBpZiAoeC5sdGUoaGFsZlBpKSkge1xyXG4gICAgICAgIHF1YWRyYW50ID0gaXNPZGQodCkgPyAoaXNOZWcgPyAyIDogMykgOiAoaXNOZWcgPyA0IDogMSk7XHJcbiAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHF1YWRyYW50ID0gaXNPZGQodCkgPyAoaXNOZWcgPyAxIDogNCkgOiAoaXNOZWcgPyAzIDogMik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHgubWludXMocGkpLmFicygpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiBEZWNpbWFsIGB4YCBhcyBhIHN0cmluZyBpbiBiYXNlIGBiYXNlT3V0YC5cclxuICAgKlxyXG4gICAqIElmIHRoZSBvcHRpb25hbCBgc2RgIGFyZ3VtZW50IGlzIHByZXNlbnQgaW5jbHVkZSBhIGJpbmFyeSBleHBvbmVudCBzdWZmaXguXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdG9TdHJpbmdCaW5hcnkoeCwgYmFzZU91dCwgc2QsIHJtKSB7XHJcbiAgICB2YXIgYmFzZSwgZSwgaSwgaywgbGVuLCByb3VuZFVwLCBzdHIsIHhkLCB5LFxyXG4gICAgICBDdG9yID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgaXNFeHAgPSBzZCAhPT0gdm9pZCAwO1xyXG5cclxuICAgIGlmIChpc0V4cCkge1xyXG4gICAgICBjaGVja0ludDMyKHNkLCAxLCBNQVhfRElHSVRTKTtcclxuICAgICAgaWYgKHJtID09PSB2b2lkIDApIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgICAgZWxzZSBjaGVja0ludDMyKHJtLCAwLCA4KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNkID0gQ3Rvci5wcmVjaXNpb247XHJcbiAgICAgIHJtID0gQ3Rvci5yb3VuZGluZztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXguaXNGaW5pdGUoKSkge1xyXG4gICAgICBzdHIgPSBub25GaW5pdGVUb1N0cmluZyh4KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN0ciA9IGZpbml0ZVRvU3RyaW5nKHgpO1xyXG4gICAgICBpID0gc3RyLmluZGV4T2YoJy4nKTtcclxuXHJcbiAgICAgIC8vIFVzZSBleHBvbmVudGlhbCBub3RhdGlvbiBhY2NvcmRpbmcgdG8gYHRvRXhwUG9zYCBhbmQgYHRvRXhwTmVnYD8gTm8sIGJ1dCBpZiByZXF1aXJlZDpcclxuICAgICAgLy8gbWF4QmluYXJ5RXhwb25lbnQgPSBmbG9vcigoZGVjaW1hbEV4cG9uZW50ICsgMSkgKiBsb2dbMl0oMTApKVxyXG4gICAgICAvLyBtaW5CaW5hcnlFeHBvbmVudCA9IGZsb29yKGRlY2ltYWxFeHBvbmVudCAqIGxvZ1syXSgxMCkpXHJcbiAgICAgIC8vIGxvZ1syXSgxMCkgPSAzLjMyMTkyODA5NDg4NzM2MjM0Nzg3MDMxOTQyOTQ4OTM5MDE3NTg2NFxyXG5cclxuICAgICAgaWYgKGlzRXhwKSB7XHJcbiAgICAgICAgYmFzZSA9IDI7XHJcbiAgICAgICAgaWYgKGJhc2VPdXQgPT0gMTYpIHtcclxuICAgICAgICAgIHNkID0gc2QgKiA0IC0gMztcclxuICAgICAgICB9IGVsc2UgaWYgKGJhc2VPdXQgPT0gOCkge1xyXG4gICAgICAgICAgc2QgPSBzZCAqIDMgLSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBiYXNlID0gYmFzZU91dDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ29udmVydCB0aGUgbnVtYmVyIGFzIGFuIGludGVnZXIgdGhlbiBkaXZpZGUgdGhlIHJlc3VsdCBieSBpdHMgYmFzZSByYWlzZWQgdG8gYSBwb3dlciBzdWNoXHJcbiAgICAgIC8vIHRoYXQgdGhlIGZyYWN0aW9uIHBhcnQgd2lsbCBiZSByZXN0b3JlZC5cclxuXHJcbiAgICAgIC8vIE5vbi1pbnRlZ2VyLlxyXG4gICAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoJy4nLCAnJyk7XHJcbiAgICAgICAgeSA9IG5ldyBDdG9yKDEpO1xyXG4gICAgICAgIHkuZSA9IHN0ci5sZW5ndGggLSBpO1xyXG4gICAgICAgIHkuZCA9IGNvbnZlcnRCYXNlKGZpbml0ZVRvU3RyaW5nKHkpLCAxMCwgYmFzZSk7XHJcbiAgICAgICAgeS5lID0geS5kLmxlbmd0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgeGQgPSBjb252ZXJ0QmFzZShzdHIsIDEwLCBiYXNlKTtcclxuICAgICAgZSA9IGxlbiA9IHhkLmxlbmd0aDtcclxuXHJcbiAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgZm9yICg7IHhkWy0tbGVuXSA9PSAwOykgeGQucG9wKCk7XHJcblxyXG4gICAgICBpZiAoIXhkWzBdKSB7XHJcbiAgICAgICAgc3RyID0gaXNFeHAgPyAnMHArMCcgOiAnMCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICBlLS07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHggPSBuZXcgQ3Rvcih4KTtcclxuICAgICAgICAgIHguZCA9IHhkO1xyXG4gICAgICAgICAgeC5lID0gZTtcclxuICAgICAgICAgIHggPSBkaXZpZGUoeCwgeSwgc2QsIHJtLCAwLCBiYXNlKTtcclxuICAgICAgICAgIHhkID0geC5kO1xyXG4gICAgICAgICAgZSA9IHguZTtcclxuICAgICAgICAgIHJvdW5kVXAgPSBpbmV4YWN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGhlIHJvdW5kaW5nIGRpZ2l0LCBpLmUuIHRoZSBkaWdpdCBhZnRlciB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgICAgICBpID0geGRbc2RdO1xyXG4gICAgICAgIGsgPSBiYXNlIC8gMjtcclxuICAgICAgICByb3VuZFVwID0gcm91bmRVcCB8fCB4ZFtzZCArIDFdICE9PSB2b2lkIDA7XHJcblxyXG4gICAgICAgIHJvdW5kVXAgPSBybSA8IDRcclxuICAgICAgICAgID8gKGkgIT09IHZvaWQgMCB8fCByb3VuZFVwKSAmJiAocm0gPT09IDAgfHwgcm0gPT09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICAgICAgOiBpID4gayB8fCBpID09PSBrICYmIChybSA9PT0gNCB8fCByb3VuZFVwIHx8IHJtID09PSA2ICYmIHhkW3NkIC0gMV0gJiAxIHx8XHJcbiAgICAgICAgICAgIHJtID09PSAoeC5zIDwgMCA/IDggOiA3KSk7XHJcblxyXG4gICAgICAgIHhkLmxlbmd0aCA9IHNkO1xyXG5cclxuICAgICAgICBpZiAocm91bmRVcCkge1xyXG5cclxuICAgICAgICAgIC8vIFJvdW5kaW5nIHVwIG1heSBtZWFuIHRoZSBwcmV2aW91cyBkaWdpdCBoYXMgdG8gYmUgcm91bmRlZCB1cCBhbmQgc28gb24uXHJcbiAgICAgICAgICBmb3IgKDsgKyt4ZFstLXNkXSA+IGJhc2UgLSAxOykge1xyXG4gICAgICAgICAgICB4ZFtzZF0gPSAwO1xyXG4gICAgICAgICAgICBpZiAoIXNkKSB7XHJcbiAgICAgICAgICAgICAgKytlO1xyXG4gICAgICAgICAgICAgIHhkLnVuc2hpZnQoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIERldGVybWluZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgICBmb3IgKGxlbiA9IHhkLmxlbmd0aDsgIXhkW2xlbiAtIDFdOyAtLWxlbik7XHJcblxyXG4gICAgICAgIC8vIEUuZy4gWzQsIDExLCAxNV0gYmVjb21lcyA0YmYuXHJcbiAgICAgICAgZm9yIChpID0gMCwgc3RyID0gJyc7IGkgPCBsZW47IGkrKykgc3RyICs9IE5VTUVSQUxTLmNoYXJBdCh4ZFtpXSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBiaW5hcnkgZXhwb25lbnQgc3VmZml4P1xyXG4gICAgICAgIGlmIChpc0V4cCkge1xyXG4gICAgICAgICAgaWYgKGxlbiA+IDEpIHtcclxuICAgICAgICAgICAgaWYgKGJhc2VPdXQgPT0gMTYgfHwgYmFzZU91dCA9PSA4KSB7XHJcbiAgICAgICAgICAgICAgaSA9IGJhc2VPdXQgPT0gMTYgPyA0IDogMztcclxuICAgICAgICAgICAgICBmb3IgKC0tbGVuOyBsZW4gJSBpOyBsZW4rKykgc3RyICs9ICcwJztcclxuICAgICAgICAgICAgICB4ZCA9IGNvbnZlcnRCYXNlKHN0ciwgYmFzZSwgYmFzZU91dCk7XHJcbiAgICAgICAgICAgICAgZm9yIChsZW4gPSB4ZC5sZW5ndGg7ICF4ZFtsZW4gLSAxXTsgLS1sZW4pO1xyXG5cclxuICAgICAgICAgICAgICAvLyB4ZFswXSB3aWxsIGFsd2F5cyBiZSBiZSAxXHJcbiAgICAgICAgICAgICAgZm9yIChpID0gMSwgc3RyID0gJzEuJzsgaSA8IGxlbjsgaSsrKSBzdHIgKz0gTlVNRVJBTFMuY2hhckF0KHhkW2ldKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzdHIgPSBzdHIuY2hhckF0KDApICsgJy4nICsgc3RyLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc3RyID0gIHN0ciArIChlIDwgMCA/ICdwJyA6ICdwKycpICsgZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcbiAgICAgICAgICBmb3IgKDsgKytlOykgc3RyID0gJzAnICsgc3RyO1xyXG4gICAgICAgICAgc3RyID0gJzAuJyArIHN0cjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKCsrZSA+IGxlbikgZm9yIChlIC09IGxlbjsgZS0tIDspIHN0ciArPSAnMCc7XHJcbiAgICAgICAgICBlbHNlIGlmIChlIDwgbGVuKSBzdHIgPSBzdHIuc2xpY2UoMCwgZSkgKyAnLicgKyBzdHIuc2xpY2UoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBzdHIgPSAoYmFzZU91dCA9PSAxNiA/ICcweCcgOiBiYXNlT3V0ID09IDIgPyAnMGInIDogYmFzZU91dCA9PSA4ID8gJzBvJyA6ICcnKSArIHN0cjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geC5zIDwgMCA/ICctJyArIHN0ciA6IHN0cjtcclxuICB9XHJcblxyXG5cclxuICAvLyBEb2VzIG5vdCBzdHJpcCB0cmFpbGluZyB6ZXJvcy5cclxuICBmdW5jdGlvbiB0cnVuY2F0ZShhcnIsIGxlbikge1xyXG4gICAgaWYgKGFyci5sZW5ndGggPiBsZW4pIHtcclxuICAgICAgYXJyLmxlbmd0aCA9IGxlbjtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gRGVjaW1hbCBtZXRob2RzXHJcblxyXG5cclxuICAvKlxyXG4gICAqICBhYnNcclxuICAgKiAgYWNvc1xyXG4gICAqICBhY29zaFxyXG4gICAqICBhZGRcclxuICAgKiAgYXNpblxyXG4gICAqICBhc2luaFxyXG4gICAqICBhdGFuXHJcbiAgICogIGF0YW5oXHJcbiAgICogIGF0YW4yXHJcbiAgICogIGNicnRcclxuICAgKiAgY2VpbFxyXG4gICAqICBjbGFtcFxyXG4gICAqICBjbG9uZVxyXG4gICAqICBjb25maWdcclxuICAgKiAgY29zXHJcbiAgICogIGNvc2hcclxuICAgKiAgZGl2XHJcbiAgICogIGV4cFxyXG4gICAqICBmbG9vclxyXG4gICAqICBoeXBvdFxyXG4gICAqICBsblxyXG4gICAqICBsb2dcclxuICAgKiAgbG9nMlxyXG4gICAqICBsb2cxMFxyXG4gICAqICBtYXhcclxuICAgKiAgbWluXHJcbiAgICogIG1vZFxyXG4gICAqICBtdWxcclxuICAgKiAgcG93XHJcbiAgICogIHJhbmRvbVxyXG4gICAqICByb3VuZFxyXG4gICAqICBzZXRcclxuICAgKiAgc2lnblxyXG4gICAqICBzaW5cclxuICAgKiAgc2luaFxyXG4gICAqICBzcXJ0XHJcbiAgICogIHN1YlxyXG4gICAqICBzdW1cclxuICAgKiAgdGFuXHJcbiAgICogIHRhbmhcclxuICAgKiAgdHJ1bmNcclxuICAgKi9cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFic29sdXRlIHZhbHVlIG9mIGB4YC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGFicyh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuYWJzKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjY29zaW5lIGluIHJhZGlhbnMgb2YgYHhgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYWNvcyh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuYWNvcygpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgY29zaW5lIG9mIGB4YCwgcm91bmRlZCB0b1xyXG4gICAqIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGFjb3NoKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5hY29zaCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHN1bSBvZiBgeGAgYW5kIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYWRkKHgsIHkpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5wbHVzKHkpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGFyY3NpbmUgaW4gcmFkaWFucyBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYXNpbih4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuYXNpbigpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGh5cGVyYm9saWMgc2luZSBvZiBgeGAsIHJvdW5kZWQgdG9cclxuICAgKiBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBhc2luaCh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuYXNpbmgoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBhcmN0YW5nZW50IGluIHJhZGlhbnMgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGF0YW4oeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmF0YW4oKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgb2YgYHhgLCByb3VuZGVkIHRvXHJcbiAgICogYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYXRhbmgoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmF0YW5oKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYXJjdGFuZ2VudCBpbiByYWRpYW5zIG9mIGB5L3hgIGluIHRoZSByYW5nZSAtcGkgdG8gcGlcclxuICAgKiAoaW5jbHVzaXZlKSwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogRG9tYWluOiBbLUluZmluaXR5LCBJbmZpbml0eV1cclxuICAgKiBSYW5nZTogWy1waSwgcGldXHJcbiAgICpcclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSB5LWNvb3JkaW5hdGUuXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgeC1jb29yZGluYXRlLlxyXG4gICAqXHJcbiAgICogYXRhbjIowrEwLCAtMCkgICAgICAgICAgICAgICA9IMKxcGlcclxuICAgKiBhdGFuMijCsTAsICswKSAgICAgICAgICAgICAgID0gwrEwXHJcbiAgICogYXRhbjIowrEwLCAteCkgICAgICAgICAgICAgICA9IMKxcGkgZm9yIHggPiAwXHJcbiAgICogYXRhbjIowrEwLCB4KSAgICAgICAgICAgICAgICA9IMKxMCBmb3IgeCA+IDBcclxuICAgKiBhdGFuMigteSwgwrEwKSAgICAgICAgICAgICAgID0gLXBpLzIgZm9yIHkgPiAwXHJcbiAgICogYXRhbjIoeSwgwrEwKSAgICAgICAgICAgICAgICA9IHBpLzIgZm9yIHkgPiAwXHJcbiAgICogYXRhbjIowrF5LCAtSW5maW5pdHkpICAgICAgICA9IMKxcGkgZm9yIGZpbml0ZSB5ID4gMFxyXG4gICAqIGF0YW4yKMKxeSwgK0luZmluaXR5KSAgICAgICAgPSDCsTAgZm9yIGZpbml0ZSB5ID4gMFxyXG4gICAqIGF0YW4yKMKxSW5maW5pdHksIHgpICAgICAgICAgPSDCsXBpLzIgZm9yIGZpbml0ZSB4XHJcbiAgICogYXRhbjIowrFJbmZpbml0eSwgLUluZmluaXR5KSA9IMKxMypwaS80XHJcbiAgICogYXRhbjIowrFJbmZpbml0eSwgK0luZmluaXR5KSA9IMKxcGkvNFxyXG4gICAqIGF0YW4yKE5hTiwgeCkgPSBOYU5cclxuICAgKiBhdGFuMih5LCBOYU4pID0gTmFOXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBhdGFuMih5LCB4KSB7XHJcbiAgICB5ID0gbmV3IHRoaXMoeSk7XHJcbiAgICB4ID0gbmV3IHRoaXMoeCk7XHJcbiAgICB2YXIgcixcclxuICAgICAgcHIgPSB0aGlzLnByZWNpc2lvbixcclxuICAgICAgcm0gPSB0aGlzLnJvdW5kaW5nLFxyXG4gICAgICB3cHIgPSBwciArIDQ7XHJcblxyXG4gICAgLy8gRWl0aGVyIE5hTlxyXG4gICAgaWYgKCF5LnMgfHwgIXgucykge1xyXG4gICAgICByID0gbmV3IHRoaXMoTmFOKTtcclxuXHJcbiAgICAvLyBCb3RoIMKxSW5maW5pdHlcclxuICAgIH0gZWxzZSBpZiAoIXkuZCAmJiAheC5kKSB7XHJcbiAgICAgIHIgPSBnZXRQaSh0aGlzLCB3cHIsIDEpLnRpbWVzKHgucyA+IDAgPyAwLjI1IDogMC43NSk7XHJcbiAgICAgIHIucyA9IHkucztcclxuXHJcbiAgICAvLyB4IGlzIMKxSW5maW5pdHkgb3IgeSBpcyDCsTBcclxuICAgIH0gZWxzZSBpZiAoIXguZCB8fCB5LmlzWmVybygpKSB7XHJcbiAgICAgIHIgPSB4LnMgPCAwID8gZ2V0UGkodGhpcywgcHIsIHJtKSA6IG5ldyB0aGlzKDApO1xyXG4gICAgICByLnMgPSB5LnM7XHJcblxyXG4gICAgLy8geSBpcyDCsUluZmluaXR5IG9yIHggaXMgwrEwXHJcbiAgICB9IGVsc2UgaWYgKCF5LmQgfHwgeC5pc1plcm8oKSkge1xyXG4gICAgICByID0gZ2V0UGkodGhpcywgd3ByLCAxKS50aW1lcygwLjUpO1xyXG4gICAgICByLnMgPSB5LnM7XHJcblxyXG4gICAgLy8gQm90aCBub24temVybyBhbmQgZmluaXRlXHJcbiAgICB9IGVsc2UgaWYgKHgucyA8IDApIHtcclxuICAgICAgdGhpcy5wcmVjaXNpb24gPSB3cHI7XHJcbiAgICAgIHRoaXMucm91bmRpbmcgPSAxO1xyXG4gICAgICByID0gdGhpcy5hdGFuKGRpdmlkZSh5LCB4LCB3cHIsIDEpKTtcclxuICAgICAgeCA9IGdldFBpKHRoaXMsIHdwciwgMSk7XHJcbiAgICAgIHRoaXMucHJlY2lzaW9uID0gcHI7XHJcbiAgICAgIHRoaXMucm91bmRpbmcgPSBybTtcclxuICAgICAgciA9IHkucyA8IDAgPyByLm1pbnVzKHgpIDogci5wbHVzKHgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgciA9IHRoaXMuYXRhbihkaXZpZGUoeSwgeCwgd3ByLCAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgY3ViZSByb290IG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBjYnJ0KHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5jYnJ0KCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgcm91bmRlZCB0byBhbiBpbnRlZ2VyIHVzaW5nIGBST1VORF9DRUlMYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNlaWwoeCkge1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgMik7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgY2xhbXBlZCB0byB0aGUgcmFuZ2UgZGVsaW5lYXRlZCBieSBgbWluYCBhbmQgYG1heGAuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICogbWluIHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICogbWF4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBjbGFtcCh4LCBtaW4sIG1heCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmNsYW1wKG1pbiwgbWF4KTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIENvbmZpZ3VyZSBnbG9iYWwgc2V0dGluZ3MgZm9yIGEgRGVjaW1hbCBjb25zdHJ1Y3Rvci5cclxuICAgKlxyXG4gICAqIGBvYmpgIGlzIGFuIG9iamVjdCB3aXRoIG9uZSBvciBtb3JlIG9mIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyxcclxuICAgKlxyXG4gICAqICAgcHJlY2lzaW9uICB7bnVtYmVyfVxyXG4gICAqICAgcm91bmRpbmcgICB7bnVtYmVyfVxyXG4gICAqICAgdG9FeHBOZWcgICB7bnVtYmVyfVxyXG4gICAqICAgdG9FeHBQb3MgICB7bnVtYmVyfVxyXG4gICAqICAgbWF4RSAgICAgICB7bnVtYmVyfVxyXG4gICAqICAgbWluRSAgICAgICB7bnVtYmVyfVxyXG4gICAqICAgbW9kdWxvICAgICB7bnVtYmVyfVxyXG4gICAqICAgY3J5cHRvICAgICB7Ym9vbGVhbnxudW1iZXJ9XHJcbiAgICogICBkZWZhdWx0cyAgIHt0cnVlfVxyXG4gICAqXHJcbiAgICogRS5nLiBEZWNpbWFsLmNvbmZpZyh7IHByZWNpc2lvbjogMjAsIHJvdW5kaW5nOiA0IH0pXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBjb25maWcob2JqKSB7XHJcbiAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgdGhyb3cgRXJyb3IoZGVjaW1hbEVycm9yICsgJ09iamVjdCBleHBlY3RlZCcpO1xyXG4gICAgdmFyIGksIHAsIHYsXHJcbiAgICAgIHVzZURlZmF1bHRzID0gb2JqLmRlZmF1bHRzID09PSB0cnVlLFxyXG4gICAgICBwcyA9IFtcclxuICAgICAgICAncHJlY2lzaW9uJywgMSwgTUFYX0RJR0lUUyxcclxuICAgICAgICAncm91bmRpbmcnLCAwLCA4LFxyXG4gICAgICAgICd0b0V4cE5lZycsIC1FWFBfTElNSVQsIDAsXHJcbiAgICAgICAgJ3RvRXhwUG9zJywgMCwgRVhQX0xJTUlULFxyXG4gICAgICAgICdtYXhFJywgMCwgRVhQX0xJTUlULFxyXG4gICAgICAgICdtaW5FJywgLUVYUF9MSU1JVCwgMCxcclxuICAgICAgICAnbW9kdWxvJywgMCwgOVxyXG4gICAgICBdO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBwcy5sZW5ndGg7IGkgKz0gMykge1xyXG4gICAgICBpZiAocCA9IHBzW2ldLCB1c2VEZWZhdWx0cykgdGhpc1twXSA9IERFRkFVTFRTW3BdO1xyXG4gICAgICBpZiAoKHYgPSBvYmpbcF0pICE9PSB2b2lkIDApIHtcclxuICAgICAgICBpZiAobWF0aGZsb29yKHYpID09PSB2ICYmIHYgPj0gcHNbaSArIDFdICYmIHYgPD0gcHNbaSArIDJdKSB0aGlzW3BdID0gdjtcclxuICAgICAgICBlbHNlIHRocm93IEVycm9yKGludmFsaWRBcmd1bWVudCArIHAgKyAnOiAnICsgdik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAocCA9ICdjcnlwdG8nLCB1c2VEZWZhdWx0cykgdGhpc1twXSA9IERFRkFVTFRTW3BdO1xyXG4gICAgaWYgKCh2ID0gb2JqW3BdKSAhPT0gdm9pZCAwKSB7XHJcbiAgICAgIGlmICh2ID09PSB0cnVlIHx8IHYgPT09IGZhbHNlIHx8IHYgPT09IDAgfHwgdiA9PT0gMSkge1xyXG4gICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIGNyeXB0byAhPSAndW5kZWZpbmVkJyAmJiBjcnlwdG8gJiZcclxuICAgICAgICAgICAgKGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgfHwgY3J5cHRvLnJhbmRvbUJ5dGVzKSkge1xyXG4gICAgICAgICAgICB0aGlzW3BdID0gdHJ1ZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGNyeXB0b1VuYXZhaWxhYmxlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpc1twXSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBFcnJvcihpbnZhbGlkQXJndW1lbnQgKyBwICsgJzogJyArIHYpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgY29zaW5lIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudFxyXG4gICAqIGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNvcyh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuY29zKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgaHlwZXJib2xpYyBjb3NpbmUgb2YgYHhgLCByb3VuZGVkIHRvIHByZWNpc2lvblxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgdmFsdWUgaW4gcmFkaWFucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNvc2goeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmNvc2goKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgRGVjaW1hbCBjb25zdHJ1Y3RvciB3aXRoIHRoZSBzYW1lIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyB0aGlzIERlY2ltYWxcclxuICAgKiBjb25zdHJ1Y3Rvci5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNsb25lKG9iaikge1xyXG4gICAgdmFyIGksIHAsIHBzO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGUgRGVjaW1hbCBjb25zdHJ1Y3RvciBhbmQgZXhwb3J0ZWQgZnVuY3Rpb24uXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCBpbnN0YW5jZS5cclxuICAgICAqXHJcbiAgICAgKiB2IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IEEgbnVtZXJpYyB2YWx1ZS5cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIERlY2ltYWwodikge1xyXG4gICAgICB2YXIgZSwgaSwgdCxcclxuICAgICAgICB4ID0gdGhpcztcclxuXHJcbiAgICAgIC8vIERlY2ltYWwgY2FsbGVkIHdpdGhvdXQgbmV3LlxyXG4gICAgICBpZiAoISh4IGluc3RhbmNlb2YgRGVjaW1hbCkpIHJldHVybiBuZXcgRGVjaW1hbCh2KTtcclxuXHJcbiAgICAgIC8vIFJldGFpbiBhIHJlZmVyZW5jZSB0byB0aGlzIERlY2ltYWwgY29uc3RydWN0b3IsIGFuZCBzaGFkb3cgRGVjaW1hbC5wcm90b3R5cGUuY29uc3RydWN0b3JcclxuICAgICAgLy8gd2hpY2ggcG9pbnRzIHRvIE9iamVjdC5cclxuICAgICAgeC5jb25zdHJ1Y3RvciA9IERlY2ltYWw7XHJcblxyXG4gICAgICAvLyBEdXBsaWNhdGUuXHJcbiAgICAgIGlmIChpc0RlY2ltYWxJbnN0YW5jZSh2KSkge1xyXG4gICAgICAgIHgucyA9IHYucztcclxuXHJcbiAgICAgICAgaWYgKGV4dGVybmFsKSB7XHJcbiAgICAgICAgICBpZiAoIXYuZCB8fCB2LmUgPiBEZWNpbWFsLm1heEUpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEluZmluaXR5LlxyXG4gICAgICAgICAgICB4LmUgPSBOYU47XHJcbiAgICAgICAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHYuZSA8IERlY2ltYWwubWluRSkge1xyXG5cclxuICAgICAgICAgICAgLy8gWmVyby5cclxuICAgICAgICAgICAgeC5lID0gMDtcclxuICAgICAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeC5lID0gdi5lO1xyXG4gICAgICAgICAgICB4LmQgPSB2LmQuc2xpY2UoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeC5lID0gdi5lO1xyXG4gICAgICAgICAgeC5kID0gdi5kID8gdi5kLnNsaWNlKCkgOiB2LmQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHQgPSB0eXBlb2YgdjtcclxuXHJcbiAgICAgIGlmICh0ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGlmICh2ID09PSAwKSB7XHJcbiAgICAgICAgICB4LnMgPSAxIC8gdiA8IDAgPyAtMSA6IDE7XHJcbiAgICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgICAgeC5kID0gWzBdO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHYgPCAwKSB7XHJcbiAgICAgICAgICB2ID0gLXY7XHJcbiAgICAgICAgICB4LnMgPSAtMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeC5zID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEZhc3QgcGF0aCBmb3Igc21hbGwgaW50ZWdlcnMuXHJcbiAgICAgICAgaWYgKHYgPT09IH5+diAmJiB2IDwgMWU3KSB7XHJcbiAgICAgICAgICBmb3IgKGUgPSAwLCBpID0gdjsgaSA+PSAxMDsgaSAvPSAxMCkgZSsrO1xyXG5cclxuICAgICAgICAgIGlmIChleHRlcm5hbCkge1xyXG4gICAgICAgICAgICBpZiAoZSA+IERlY2ltYWwubWF4RSkge1xyXG4gICAgICAgICAgICAgIHguZSA9IE5hTjtcclxuICAgICAgICAgICAgICB4LmQgPSBudWxsO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUgPCBEZWNpbWFsLm1pbkUpIHtcclxuICAgICAgICAgICAgICB4LmUgPSAwO1xyXG4gICAgICAgICAgICAgIHguZCA9IFswXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB4LmUgPSBlO1xyXG4gICAgICAgICAgICAgIHguZCA9IFt2XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeC5lID0gZTtcclxuICAgICAgICAgICAgeC5kID0gW3ZdO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gSW5maW5pdHksIE5hTi5cclxuICAgICAgICB9IGVsc2UgaWYgKHYgKiAwICE9PSAwKSB7XHJcbiAgICAgICAgICBpZiAoIXYpIHgucyA9IE5hTjtcclxuICAgICAgICAgIHguZSA9IE5hTjtcclxuICAgICAgICAgIHguZCA9IG51bGw7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyc2VEZWNpbWFsKHgsIHYudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKHQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEFyZ3VtZW50ICsgdik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE1pbnVzIHNpZ24/XHJcbiAgICAgIGlmICgoaSA9IHYuY2hhckNvZGVBdCgwKSkgPT09IDQ1KSB7XHJcbiAgICAgICAgdiA9IHYuc2xpY2UoMSk7XHJcbiAgICAgICAgeC5zID0gLTE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gUGx1cyBzaWduP1xyXG4gICAgICAgIGlmIChpID09PSA0MykgdiA9IHYuc2xpY2UoMSk7XHJcbiAgICAgICAgeC5zID0gMTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGlzRGVjaW1hbC50ZXN0KHYpID8gcGFyc2VEZWNpbWFsKHgsIHYpIDogcGFyc2VPdGhlcih4LCB2KTtcclxuICAgIH1cclxuXHJcbiAgICBEZWNpbWFsLnByb3RvdHlwZSA9IFA7XHJcblxyXG4gICAgRGVjaW1hbC5ST1VORF9VUCA9IDA7XHJcbiAgICBEZWNpbWFsLlJPVU5EX0RPV04gPSAxO1xyXG4gICAgRGVjaW1hbC5ST1VORF9DRUlMID0gMjtcclxuICAgIERlY2ltYWwuUk9VTkRfRkxPT1IgPSAzO1xyXG4gICAgRGVjaW1hbC5ST1VORF9IQUxGX1VQID0gNDtcclxuICAgIERlY2ltYWwuUk9VTkRfSEFMRl9ET1dOID0gNTtcclxuICAgIERlY2ltYWwuUk9VTkRfSEFMRl9FVkVOID0gNjtcclxuICAgIERlY2ltYWwuUk9VTkRfSEFMRl9DRUlMID0gNztcclxuICAgIERlY2ltYWwuUk9VTkRfSEFMRl9GTE9PUiA9IDg7XHJcbiAgICBEZWNpbWFsLkVVQ0xJRCA9IDk7XHJcblxyXG4gICAgRGVjaW1hbC5jb25maWcgPSBEZWNpbWFsLnNldCA9IGNvbmZpZztcclxuICAgIERlY2ltYWwuY2xvbmUgPSBjbG9uZTtcclxuICAgIERlY2ltYWwuaXNEZWNpbWFsID0gaXNEZWNpbWFsSW5zdGFuY2U7XHJcblxyXG4gICAgRGVjaW1hbC5hYnMgPSBhYnM7XHJcbiAgICBEZWNpbWFsLmFjb3MgPSBhY29zO1xyXG4gICAgRGVjaW1hbC5hY29zaCA9IGFjb3NoOyAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLmFkZCA9IGFkZDtcclxuICAgIERlY2ltYWwuYXNpbiA9IGFzaW47XHJcbiAgICBEZWNpbWFsLmFzaW5oID0gYXNpbmg7ICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwuYXRhbiA9IGF0YW47XHJcbiAgICBEZWNpbWFsLmF0YW5oID0gYXRhbmg7ICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwuYXRhbjIgPSBhdGFuMjtcclxuICAgIERlY2ltYWwuY2JydCA9IGNicnQ7ICAgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC5jZWlsID0gY2VpbDtcclxuICAgIERlY2ltYWwuY2xhbXAgPSBjbGFtcDtcclxuICAgIERlY2ltYWwuY29zID0gY29zO1xyXG4gICAgRGVjaW1hbC5jb3NoID0gY29zaDsgICAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLmRpdiA9IGRpdjtcclxuICAgIERlY2ltYWwuZXhwID0gZXhwO1xyXG4gICAgRGVjaW1hbC5mbG9vciA9IGZsb29yO1xyXG4gICAgRGVjaW1hbC5oeXBvdCA9IGh5cG90OyAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLmxuID0gbG47XHJcbiAgICBEZWNpbWFsLmxvZyA9IGxvZztcclxuICAgIERlY2ltYWwubG9nMTAgPSBsb2cxMDsgICAgICAgIC8vIEVTNlxyXG4gICAgRGVjaW1hbC5sb2cyID0gbG9nMjsgICAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLm1heCA9IG1heDtcclxuICAgIERlY2ltYWwubWluID0gbWluO1xyXG4gICAgRGVjaW1hbC5tb2QgPSBtb2Q7XHJcbiAgICBEZWNpbWFsLm11bCA9IG11bDtcclxuICAgIERlY2ltYWwucG93ID0gcG93O1xyXG4gICAgRGVjaW1hbC5yYW5kb20gPSByYW5kb207XHJcbiAgICBEZWNpbWFsLnJvdW5kID0gcm91bmQ7XHJcbiAgICBEZWNpbWFsLnNpZ24gPSBzaWduOyAgICAgICAgICAvLyBFUzZcclxuICAgIERlY2ltYWwuc2luID0gc2luO1xyXG4gICAgRGVjaW1hbC5zaW5oID0gc2luaDsgICAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLnNxcnQgPSBzcXJ0O1xyXG4gICAgRGVjaW1hbC5zdWIgPSBzdWI7XHJcbiAgICBEZWNpbWFsLnN1bSA9IHN1bTtcclxuICAgIERlY2ltYWwudGFuID0gdGFuO1xyXG4gICAgRGVjaW1hbC50YW5oID0gdGFuaDsgICAgICAgICAgLy8gRVM2XHJcbiAgICBEZWNpbWFsLnRydW5jID0gdHJ1bmM7ICAgICAgICAvLyBFUzZcclxuXHJcbiAgICBpZiAob2JqID09PSB2b2lkIDApIG9iaiA9IHt9O1xyXG4gICAgaWYgKG9iaikge1xyXG4gICAgICBpZiAob2JqLmRlZmF1bHRzICE9PSB0cnVlKSB7XHJcbiAgICAgICAgcHMgPSBbJ3ByZWNpc2lvbicsICdyb3VuZGluZycsICd0b0V4cE5lZycsICd0b0V4cFBvcycsICdtYXhFJywgJ21pbkUnLCAnbW9kdWxvJywgJ2NyeXB0byddO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBwcy5sZW5ndGg7KSBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShwID0gcHNbaSsrXSkpIG9ialtwXSA9IHRoaXNbcF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBEZWNpbWFsLmNvbmZpZyhvYmopO1xyXG5cclxuICAgIHJldHVybiBEZWNpbWFsO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIGRpdmlkZWQgYnkgYHlgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKiB5IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBkaXYoeCwgeSkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmRpdih5KTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBuYXR1cmFsIGV4cG9uZW50aWFsIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBwb3dlciB0byB3aGljaCB0byByYWlzZSB0aGUgYmFzZSBvZiB0aGUgbmF0dXJhbCBsb2cuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBleHAoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLmV4cCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIHJvdW5kIHRvIGFuIGludGVnZXIgdXNpbmcgYFJPVU5EX0ZMT09SYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGZsb29yKHgpIHtcclxuICAgIHJldHVybiBmaW5hbGlzZSh4ID0gbmV3IHRoaXMoeCksIHguZSArIDEsIDMpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHNxdWFyZSByb290IG9mIHRoZSBzdW0gb2YgdGhlIHNxdWFyZXMgb2YgdGhlIGFyZ3VtZW50cyxcclxuICAgKiByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBoeXBvdChhLCBiLCAuLi4pID0gc3FydChhXjIgKyBiXjIgKyAuLi4pXHJcbiAgICpcclxuICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGh5cG90KCkge1xyXG4gICAgdmFyIGksIG4sXHJcbiAgICAgIHQgPSBuZXcgdGhpcygwKTtcclxuXHJcbiAgICBleHRlcm5hbCA9IGZhbHNlO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOykge1xyXG4gICAgICBuID0gbmV3IHRoaXMoYXJndW1lbnRzW2krK10pO1xyXG4gICAgICBpZiAoIW4uZCkge1xyXG4gICAgICAgIGlmIChuLnMpIHtcclxuICAgICAgICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuICAgICAgICAgIHJldHVybiBuZXcgdGhpcygxIC8gMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHQgPSBuO1xyXG4gICAgICB9IGVsc2UgaWYgKHQuZCkge1xyXG4gICAgICAgIHQgPSB0LnBsdXMobi50aW1lcyhuKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHRlcm5hbCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIHQuc3FydCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgb2JqZWN0IGlzIGEgRGVjaW1hbCBpbnN0YW5jZSAod2hlcmUgRGVjaW1hbCBpcyBhbnkgRGVjaW1hbCBjb25zdHJ1Y3RvciksXHJcbiAgICogb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGlzRGVjaW1hbEluc3RhbmNlKG9iaikge1xyXG4gICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIERlY2ltYWwgfHwgb2JqICYmIG9iai50b1N0cmluZ1RhZyA9PT0gdGFnIHx8IGZhbHNlO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG5hdHVyYWwgbG9nYXJpdGhtIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBsbih4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkubG4oKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBsb2cgb2YgYHhgIHRvIHRoZSBiYXNlIGB5YCwgb3IgdG8gYmFzZSAxMCBpZiBubyBiYXNlXHJcbiAgICogaXMgc3BlY2lmaWVkLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiBsb2dbeV0oeClcclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIGFyZ3VtZW50IG9mIHRoZSBsb2dhcml0aG0uXHJcbiAgICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBUaGUgYmFzZSBvZiB0aGUgbG9nYXJpdGhtLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbG9nKHgsIHkpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5sb2coeSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgYmFzZSAyIGxvZ2FyaXRobSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbG9nMih4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKDIpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGJhc2UgMTAgbG9nYXJpdGhtIG9mIGB4YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYFxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBsb2cxMCh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkubG9nKDEwKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBtYXhpbXVtIG9mIHRoZSBhcmd1bWVudHMuXHJcbiAgICpcclxuICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG1heCgpIHtcclxuICAgIHJldHVybiBtYXhPck1pbih0aGlzLCBhcmd1bWVudHMsICdsdCcpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIG1pbmltdW0gb2YgdGhlIGFyZ3VtZW50cy5cclxuICAgKlxyXG4gICAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbWluKCkge1xyXG4gICAgcmV0dXJuIG1heE9yTWluKHRoaXMsIGFyZ3VtZW50cywgJ2d0Jyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbW9kdWxvIGB5YCwgcm91bmRlZCB0byBgcHJlY2lzaW9uYCBzaWduaWZpY2FudCBkaWdpdHNcclxuICAgKiB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9XHJcbiAgICogeSB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbW9kKHgsIHkpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5tb2QoeSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgbXVsdGlwbGllZCBieSBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnRcclxuICAgKiBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIG11bCh4LCB5KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkubXVsKHkpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIHJhaXNlZCB0byB0aGUgcG93ZXIgYHlgLCByb3VuZGVkIHRvIHByZWNpc2lvblxyXG4gICAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIGByb3VuZGluZ2AuXHJcbiAgICpcclxuICAgKiB4IHtudW1iZXJ8c3RyaW5nfERlY2ltYWx9IFRoZSBiYXNlLlxyXG4gICAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gVGhlIGV4cG9uZW50LlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcG93KHgsIHkpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5wb3coeSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm5zIGEgbmV3IERlY2ltYWwgd2l0aCBhIHJhbmRvbSB2YWx1ZSBlcXVhbCB0byBvciBncmVhdGVyIHRoYW4gMCBhbmQgbGVzcyB0aGFuIDEsIGFuZCB3aXRoXHJcbiAgICogYHNkYCwgb3IgYERlY2ltYWwucHJlY2lzaW9uYCBpZiBgc2RgIGlzIG9taXR0ZWQsIHNpZ25pZmljYW50IGRpZ2l0cyAob3IgbGVzcyBpZiB0cmFpbGluZyB6ZXJvc1xyXG4gICAqIGFyZSBwcm9kdWNlZCkuXHJcbiAgICpcclxuICAgKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMCB0byBNQVhfRElHSVRTIGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJhbmRvbShzZCkge1xyXG4gICAgdmFyIGQsIGUsIGssIG4sXHJcbiAgICAgIGkgPSAwLFxyXG4gICAgICByID0gbmV3IHRoaXMoMSksXHJcbiAgICAgIHJkID0gW107XHJcblxyXG4gICAgaWYgKHNkID09PSB2b2lkIDApIHNkID0gdGhpcy5wcmVjaXNpb247XHJcbiAgICBlbHNlIGNoZWNrSW50MzIoc2QsIDEsIE1BWF9ESUdJVFMpO1xyXG5cclxuICAgIGsgPSBNYXRoLmNlaWwoc2QgLyBMT0dfQkFTRSk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmNyeXB0bykge1xyXG4gICAgICBmb3IgKDsgaSA8IGs7KSByZFtpKytdID0gTWF0aC5yYW5kb20oKSAqIDFlNyB8IDA7XHJcblxyXG4gICAgLy8gQnJvd3NlcnMgc3VwcG9ydGluZyBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLlxyXG4gICAgfSBlbHNlIGlmIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XHJcbiAgICAgIGQgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheShrKSk7XHJcblxyXG4gICAgICBmb3IgKDsgaSA8IGs7KSB7XHJcbiAgICAgICAgbiA9IGRbaV07XHJcblxyXG4gICAgICAgIC8vIDAgPD0gbiA8IDQyOTQ5NjcyOTZcclxuICAgICAgICAvLyBQcm9iYWJpbGl0eSBuID49IDQuMjllOSwgaXMgNDk2NzI5NiAvIDQyOTQ5NjcyOTYgPSAwLjAwMTE2ICgxIGluIDg2NSkuXHJcbiAgICAgICAgaWYgKG4gPj0gNC4yOWU5KSB7XHJcbiAgICAgICAgICBkW2ldID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoMSkpWzBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgLy8gMCA8PSBuIDw9IDQyODk5OTk5OTlcclxuICAgICAgICAgIC8vIDAgPD0gKG4gJSAxZTcpIDw9IDk5OTk5OTlcclxuICAgICAgICAgIHJkW2krK10gPSBuICUgMWU3O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIC8vIE5vZGUuanMgc3VwcG9ydGluZyBjcnlwdG8ucmFuZG9tQnl0ZXMuXHJcbiAgICB9IGVsc2UgaWYgKGNyeXB0by5yYW5kb21CeXRlcykge1xyXG5cclxuICAgICAgLy8gYnVmZmVyXHJcbiAgICAgIGQgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoayAqPSA0KTtcclxuXHJcbiAgICAgIGZvciAoOyBpIDwgazspIHtcclxuXHJcbiAgICAgICAgLy8gMCA8PSBuIDwgMjE0NzQ4MzY0OFxyXG4gICAgICAgIG4gPSBkW2ldICsgKGRbaSArIDFdIDw8IDgpICsgKGRbaSArIDJdIDw8IDE2KSArICgoZFtpICsgM10gJiAweDdmKSA8PCAyNCk7XHJcblxyXG4gICAgICAgIC8vIFByb2JhYmlsaXR5IG4gPj0gMi4xNGU5LCBpcyA3NDgzNjQ4IC8gMjE0NzQ4MzY0OCA9IDAuMDAzNSAoMSBpbiAyODYpLlxyXG4gICAgICAgIGlmIChuID49IDIuMTRlOSkge1xyXG4gICAgICAgICAgY3J5cHRvLnJhbmRvbUJ5dGVzKDQpLmNvcHkoZCwgaSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAvLyAwIDw9IG4gPD0gMjEzOTk5OTk5OVxyXG4gICAgICAgICAgLy8gMCA8PSAobiAlIDFlNykgPD0gOTk5OTk5OVxyXG4gICAgICAgICAgcmQucHVzaChuICUgMWU3KTtcclxuICAgICAgICAgIGkgKz0gNDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGkgPSBrIC8gNDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IEVycm9yKGNyeXB0b1VuYXZhaWxhYmxlKTtcclxuICAgIH1cclxuXHJcbiAgICBrID0gcmRbLS1pXTtcclxuICAgIHNkICU9IExPR19CQVNFO1xyXG5cclxuICAgIC8vIENvbnZlcnQgdHJhaWxpbmcgZGlnaXRzIHRvIHplcm9zIGFjY29yZGluZyB0byBzZC5cclxuICAgIGlmIChrICYmIHNkKSB7XHJcbiAgICAgIG4gPSBtYXRocG93KDEwLCBMT0dfQkFTRSAtIHNkKTtcclxuICAgICAgcmRbaV0gPSAoayAvIG4gfCAwKSAqIG47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHdvcmRzIHdoaWNoIGFyZSB6ZXJvLlxyXG4gICAgZm9yICg7IHJkW2ldID09PSAwOyBpLS0pIHJkLnBvcCgpO1xyXG5cclxuICAgIC8vIFplcm8/XHJcbiAgICBpZiAoaSA8IDApIHtcclxuICAgICAgZSA9IDA7XHJcbiAgICAgIHJkID0gWzBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZSA9IC0xO1xyXG5cclxuICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgd29yZHMgd2hpY2ggYXJlIHplcm8gYW5kIGFkanVzdCBleHBvbmVudCBhY2NvcmRpbmdseS5cclxuICAgICAgZm9yICg7IHJkWzBdID09PSAwOyBlIC09IExPR19CQVNFKSByZC5zaGlmdCgpO1xyXG5cclxuICAgICAgLy8gQ291bnQgdGhlIGRpZ2l0cyBvZiB0aGUgZmlyc3Qgd29yZCBvZiByZCB0byBkZXRlcm1pbmUgbGVhZGluZyB6ZXJvcy5cclxuICAgICAgZm9yIChrID0gMSwgbiA9IHJkWzBdOyBuID49IDEwOyBuIC89IDEwKSBrKys7XHJcblxyXG4gICAgICAvLyBBZGp1c3QgdGhlIGV4cG9uZW50IGZvciBsZWFkaW5nIHplcm9zIG9mIHRoZSBmaXJzdCB3b3JkIG9mIHJkLlxyXG4gICAgICBpZiAoayA8IExPR19CQVNFKSBlIC09IExPR19CQVNFIC0gaztcclxuICAgIH1cclxuXHJcbiAgICByLmUgPSBlO1xyXG4gICAgci5kID0gcmQ7XHJcblxyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyBgeGAgcm91bmRlZCB0byBhbiBpbnRlZ2VyIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIFRvIGVtdWxhdGUgYE1hdGgucm91bmRgLCBzZXQgcm91bmRpbmcgdG8gNyAoUk9VTkRfSEFMRl9DRUlMKS5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJvdW5kKHgpIHtcclxuICAgIHJldHVybiBmaW5hbGlzZSh4ID0gbmV3IHRoaXMoeCksIHguZSArIDEsIHRoaXMucm91bmRpbmcpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuXHJcbiAgICogICAxICAgIGlmIHggPiAwLFxyXG4gICAqICAtMSAgICBpZiB4IDwgMCxcclxuICAgKiAgIDAgICAgaWYgeCBpcyAwLFxyXG4gICAqICAtMCAgICBpZiB4IGlzIC0wLFxyXG4gICAqICAgTmFOICBvdGhlcndpc2VcclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHNpZ24oeCkge1xyXG4gICAgeCA9IG5ldyB0aGlzKHgpO1xyXG4gICAgcmV0dXJuIHguZCA/ICh4LmRbMF0gPyB4LnMgOiAwICogeC5zKSA6IHgucyB8fCBOYU47XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzXHJcbiAgICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBzaW4oeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLnNpbigpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIGh5cGVyYm9saWMgc2luZSBvZiBgeGAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmBcclxuICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfSBBIHZhbHVlIGluIHJhZGlhbnMuXHJcbiAgICpcclxuICAgKi9cclxuICBmdW5jdGlvbiBzaW5oKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS5zaW5oKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgRGVjaW1hbCB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHNxcnQoeCkge1xyXG4gICAgcmV0dXJuIG5ldyB0aGlzKHgpLnNxcnQoKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIGB4YCBtaW51cyBgeWAsIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAgc2lnbmlmaWNhbnQgZGlnaXRzXHJcbiAgICogdXNpbmcgcm91bmRpbmcgbW9kZSBgcm91bmRpbmdgLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqIHkge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHN1Yih4LCB5KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkuc3ViKHkpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHN1bSBvZiB0aGUgYXJndW1lbnRzLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIE9ubHkgdGhlIHJlc3VsdCBpcyByb3VuZGVkLCBub3QgdGhlIGludGVybWVkaWF0ZSBjYWxjdWxhdGlvbnMuXHJcbiAgICpcclxuICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8RGVjaW1hbH1cclxuICAgKlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHN1bSgpIHtcclxuICAgIHZhciBpID0gMCxcclxuICAgICAgYXJncyA9IGFyZ3VtZW50cyxcclxuICAgICAgeCA9IG5ldyB0aGlzKGFyZ3NbaV0pO1xyXG5cclxuICAgIGV4dGVybmFsID0gZmFsc2U7XHJcbiAgICBmb3IgKDsgeC5zICYmICsraSA8IGFyZ3MubGVuZ3RoOykgeCA9IHgucGx1cyhhcmdzW2ldKTtcclxuICAgIGV4dGVybmFsID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gZmluYWxpc2UoeCwgdGhpcy5wcmVjaXNpb24sIHRoaXMucm91bmRpbmcpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgdGhlIHRhbmdlbnQgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gIHNpZ25pZmljYW50XHJcbiAgICogZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdGFuKHgpIHtcclxuICAgIHJldHVybiBuZXcgdGhpcyh4KS50YW4oKTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBEZWNpbWFsIHdob3NlIHZhbHVlIGlzIHRoZSBoeXBlcmJvbGljIHRhbmdlbnQgb2YgYHhgLCByb3VuZGVkIHRvIGBwcmVjaXNpb25gXHJcbiAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgYHJvdW5kaW5nYC5cclxuICAgKlxyXG4gICAqIHgge251bWJlcnxzdHJpbmd8RGVjaW1hbH0gQSB2YWx1ZSBpbiByYWRpYW5zLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdGFuaCh4KSB7XHJcbiAgICByZXR1cm4gbmV3IHRoaXMoeCkudGFuaCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IERlY2ltYWwgd2hvc2UgdmFsdWUgaXMgYHhgIHRydW5jYXRlZCB0byBhbiBpbnRlZ2VyLlxyXG4gICAqXHJcbiAgICogeCB7bnVtYmVyfHN0cmluZ3xEZWNpbWFsfVxyXG4gICAqXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdHJ1bmMoeCkge1xyXG4gICAgcmV0dXJuIGZpbmFsaXNlKHggPSBuZXcgdGhpcyh4KSwgeC5lICsgMSwgMSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gQ3JlYXRlIGFuZCBjb25maWd1cmUgaW5pdGlhbCBEZWNpbWFsIGNvbnN0cnVjdG9yLlxyXG4gIERlY2ltYWwgPSBjbG9uZShERUZBVUxUUyk7XHJcbiAgRGVjaW1hbC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBEZWNpbWFsO1xyXG4gIERlY2ltYWxbJ2RlZmF1bHQnXSA9IERlY2ltYWwuRGVjaW1hbCA9IERlY2ltYWw7XHJcblxyXG4gIC8vIENyZWF0ZSB0aGUgaW50ZXJuYWwgY29uc3RhbnRzIGZyb20gdGhlaXIgc3RyaW5nIHZhbHVlcy5cclxuICBMTjEwID0gbmV3IERlY2ltYWwoTE4xMCk7XHJcbiAgUEkgPSBuZXcgRGVjaW1hbChQSSk7XHJcblxyXG5cclxuICAvLyBFeHBvcnQuXHJcblxyXG5cclxuICAvLyBBTUQuXHJcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gRGVjaW1hbDtcclxuICAgIH0pO1xyXG5cclxuICAvLyBOb2RlIGFuZCBvdGhlciBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLlxyXG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnKSB7XHJcbiAgICAgIFBbU3ltYm9sWydmb3InXSgnbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKV0gPSBQLnRvU3RyaW5nO1xyXG4gICAgICBQW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnRGVjaW1hbCc7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBEZWNpbWFsO1xyXG5cclxuICAvLyBCcm93c2VyLlxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoIWdsb2JhbFNjb3BlKSB7XHJcbiAgICAgIGdsb2JhbFNjb3BlID0gdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZiAmJiBzZWxmLnNlbGYgPT0gc2VsZiA/IHNlbGYgOiB3aW5kb3c7XHJcbiAgICB9XHJcblxyXG4gICAgbm9Db25mbGljdCA9IGdsb2JhbFNjb3BlLkRlY2ltYWw7XHJcbiAgICBEZWNpbWFsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGdsb2JhbFNjb3BlLkRlY2ltYWwgPSBub0NvbmZsaWN0O1xyXG4gICAgICByZXR1cm4gRGVjaW1hbDtcclxuICAgIH07XHJcblxyXG4gICAgZ2xvYmFsU2NvcGUuRGVjaW1hbCA9IERlY2ltYWw7XHJcbiAgfVxyXG59KSh0aGlzKTtcclxuIiwiLyoqXG4qIEBsaWNlbnNlIE1JVFxuKiBAYXV0aG9yIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5sZXQgbGliU2ltcGxlTG9nID0gcmVxdWlyZSgnLi9NYW55ZmVzdC1Mb2dUb0NvbnNvbGUuanMnKTtcblxuLyoqXG4qIEhhc2ggVHJhbnNsYXRpb25cbipcbiogVGhpcyBpcyBhIHZlcnkgc2ltcGxlIHRyYW5zbGF0aW9uIHRhYmxlIGZvciBoYXNoZXMsIHdoaWNoIGFsbG93cyB0aGUgc2FtZSBzY2hlbWEgdG8gcmVzb2x2ZSBcbiogZGlmZmVyZW50bHkgYmFzZWQgb24gYSBsb2FkZWQgdHJhbnNsYXRpb24gdGFibGUuXG4qXG4qIFRoaXMgaXMgdG8gcHJldmVudCB0aGUgcmVxdWlyZW1lbnQgZm9yIG11dGF0aW5nIHNjaGVtYXMgb3ZlciBhbmQgb3ZlciBhZ2FpbiB3aGVuIHdlIHdhbnQgdG9cbiogcmV1c2UgdGhlIHN0cnVjdHVyZSBidXQgbG9vayB1cCBkYXRhIGVsZW1lbnRzIGJ5IGRpZmZlcmVudCBhZGRyZXNzZXMuXG4qXG4qIE9uZSBzaWRlLWVmZmVjdCBvZiB0aGlzIGlzIHRoYXQgYSB0cmFuc2xhdGlvbiB0YWJsZSBjYW4gXCJvdmVycmlkZVwiIHRoZSBidWlsdC1pbiBoYXNoZXMsIHNpbmNlXG4qIHRoaXMgaXMgYWx3YXlzIHVzZWQgdG8gcmVzb2x2ZSBoYXNoZXMgYmVmb3JlIGFueSBvZiB0aGUgZnVuY3Rpb25DYWxsQnlIYXNoKHBIYXNoLCAuLi4pIHBlcmZvcm1cbiogdGhlaXIgbG9va3VwcyBieSBoYXNoLlxuKlxuKiBAY2xhc3MgTWFueWZlc3RIYXNoVHJhbnNsYXRpb25cbiovXG5jbGFzcyBNYW55ZmVzdEhhc2hUcmFuc2xhdGlvblxue1xuXHRjb25zdHJ1Y3RvcihwSW5mb0xvZywgcEVycm9yTG9nKVxuXHR7XG5cdFx0Ly8gV2lyZSBpbiBsb2dnaW5nXG5cdFx0dGhpcy5sb2dJbmZvID0gKHR5cGVvZihwSW5mb0xvZykgPT09ICdmdW5jdGlvbicpID8gcEluZm9Mb2cgOiBsaWJTaW1wbGVMb2c7XG5cdFx0dGhpcy5sb2dFcnJvciA9ICh0eXBlb2YocEVycm9yTG9nKSA9PT0gJ2Z1bmN0aW9uJykgPyBwRXJyb3JMb2cgOiBsaWJTaW1wbGVMb2c7XG5cbiAgICAgICAgdGhpcy50cmFuc2xhdGlvblRhYmxlID0ge307XG5cdH1cblxuICAgIHRyYW5zbGF0aW9uQ291bnQoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMudHJhbnNsYXRpb25UYWJsZSkubGVuZ3RoO1xuICAgIH1cblxuICAgIGFkZFRyYW5zbGF0aW9uKHBUcmFuc2xhdGlvbilcbiAgICB7XG4gICAgICAgIC8vIFRoaXMgYWRkcyBhIHRyYW5zbGF0aW9uIGluIHRoZSBmb3JtIG9mOlxuICAgICAgICAvLyB7IFwiU291cmNlSGFzaFwiOiBcIkRlc3RpbmF0aW9uSGFzaFwiLCBcIlNlY29uZFNvdXJjZUhhc2hcIjpcIlNlY29uZERlc3RpbmF0aW9uSGFzaFwiIH1cbiAgICAgICAgaWYgKHR5cGVvZihwVHJhbnNsYXRpb24pICE9ICdvYmplY3QnKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmxvZ0Vycm9yKGBIYXNoIHRyYW5zbGF0aW9uIGFkZFRyYW5zbGF0aW9uIGV4cGVjdGVkIGEgdHJhbnNsYXRpb24gYmUgdHlwZSBvYmplY3QgYnV0IHdhcyBwYXNzZWQgaW4gJHt0eXBlb2YocFRyYW5zbGF0aW9uKX1gKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0bXBUcmFuc2xhdGlvblNvdXJjZXMgPSBPYmplY3Qua2V5cyhwVHJhbnNsYXRpb24pXG5cbiAgICAgICAgdG1wVHJhbnNsYXRpb25Tb3VyY2VzLmZvckVhY2goXG4gICAgICAgICAgICAocFRyYW5zbGF0aW9uU291cmNlKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YocFRyYW5zbGF0aW9uW3BUcmFuc2xhdGlvblNvdXJjZV0pICE9ICdzdHJpbmcnKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dFcnJvcihgSGFzaCB0cmFuc2xhdGlvbiBhZGRUcmFuc2xhdGlvbiBleHBlY3RlZCBhIHRyYW5zbGF0aW9uIGRlc3RpbmF0aW9uIGhhc2ggZm9yIFske3BUcmFuc2xhdGlvblNvdXJjZX1dIHRvIGJlIGEgc3RyaW5nIGJ1dCB0aGUgcmVmZXJyYW50IHdhcyBhICR7dHlwZW9mKHBUcmFuc2xhdGlvbltwVHJhbnNsYXRpb25Tb3VyY2VdKX1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvblRhYmxlW3BUcmFuc2xhdGlvblNvdXJjZV0gPSBwVHJhbnNsYXRpb25bcFRyYW5zbGF0aW9uU291cmNlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZW1vdmVUcmFuc2xhdGlvbkhhc2gocFRyYW5zbGF0aW9uSGFzaClcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zbGF0aW9uVGFibGUuaGFzT3duUHJvcGVydHkocFRyYW5zbGF0aW9uSGFzaCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnRyYW5zbGF0aW9uVGFibGVbcFRyYW5zbGF0aW9uSGFzaF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGlzIHJlbW92ZXMgdHJhbnNsYXRpb25zLlxuICAgIC8vIElmIHBhc3NlZCBhIHN0cmluZywganVzdCByZW1vdmVzIHRoZSBzaW5nbGUgb25lLlxuICAgIC8vIElmIHBhc3NlZCBhbiBvYmplY3QsIGl0IGRvZXMgYWxsIHRoZSBzb3VyY2Uga2V5cy5cbiAgICByZW1vdmVUcmFuc2xhdGlvbihwVHJhbnNsYXRpb24pXG4gICAge1xuICAgICAgICBpZiAodHlwZW9mKHBUcmFuc2xhdGlvbikgPT0gJ3N0cmluZycpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVHJhbnNsYXRpb25IYXNoKHBUcmFuc2xhdGlvbik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YocFRyYW5zbGF0aW9uKSA9PSAnb2JqZWN0JylcbiAgICAgICAge1xuICAgICAgICAgICAgbGV0IHRtcFRyYW5zbGF0aW9uU291cmNlcyA9IE9iamVjdC5rZXlzKHBUcmFuc2xhdGlvbilcblxuICAgICAgICAgICAgdG1wVHJhbnNsYXRpb25Tb3VyY2VzLmZvckVhY2goXG4gICAgICAgICAgICAgICAgKHBUcmFuc2xhdGlvblNvdXJjZSkgPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlVHJhbnNsYXRpb24ocFRyYW5zbGF0aW9uU291cmNlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5sb2dFcnJvcihgSGFzaCB0cmFuc2xhdGlvbiByZW1vdmVUcmFuc2xhdGlvbiBleHBlY3RlZCBlaXRoZXIgYSBzdHJpbmcgb3IgYW4gb2JqZWN0IGJ1dCB0aGUgcGFzc2VkLWluIHRyYW5zbGF0aW9uIHdhcyB0eXBlICR7dHlwZW9mKHBUcmFuc2xhdGlvbil9YCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhclRyYW5zbGF0aW9ucygpXG4gICAge1xuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uVGFibGUgPSB7fTtcbiAgICB9XG5cbiAgICB0cmFuc2xhdGUocFRyYW5zbGF0aW9uKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNsYXRpb25UYWJsZS5oYXNPd25Qcm9wZXJ0eShwVHJhbnNsYXRpb24pKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGlvblRhYmxlW3BUcmFuc2xhdGlvbl07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gcFRyYW5zbGF0aW9uO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hbnlmZXN0SGFzaFRyYW5zbGF0aW9uOyIsIi8qKlxuKiBAbGljZW5zZSBNSVRcbiogQGF1dGhvciA8c3RldmVuQHZlbG96by5jb20+XG4qL1xuXG4vKipcbiogTWFueWZlc3Qgc2ltcGxlIGxvZ2dpbmcgc2hpbSAoZm9yIGJyb3dzZXIgYW5kIGRlcGVuZGVuY3ktZnJlZSBydW5uaW5nKVxuKi9cblxuY29uc3QgbG9nVG9Db25zb2xlID0gKHBMb2dMaW5lLCBwTG9nT2JqZWN0KSA9Plxue1xuICAgIGxldCB0bXBMb2dMaW5lID0gKHR5cGVvZihwTG9nTGluZSkgPT09ICdzdHJpbmcnKSA/IHBMb2dMaW5lIDogJyc7XG5cbiAgICBjb25zb2xlLmxvZyhgW01hbnlmZXN0XSAke3RtcExvZ0xpbmV9YCk7XG5cbiAgICBpZiAocExvZ09iamVjdCkgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocExvZ09iamVjdCkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBsb2dUb0NvbnNvbGU7IiwiLyoqXG4qIEBsaWNlbnNlIE1JVFxuKiBAYXV0aG9yIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5sZXQgbGliU2ltcGxlTG9nID0gcmVxdWlyZSgnLi9NYW55ZmVzdC1Mb2dUb0NvbnNvbGUuanMnKTtcblxuLyoqXG4qIE9iamVjdCBBZGRyZXNzIFJlc29sdmVyXG4qIFxuKiBJTVBPUlRBTlQgTk9URTogVGhpcyBjb2RlIGlzIGludGVudGlvbmFsbHkgbW9yZSB2ZXJib3NlIHRoYW4gbmVjZXNzYXJ5LCB0b1xuKiAgICAgICAgICAgICAgICAgYmUgZXh0cmVtZWx5IGNsZWFyIHdoYXQgaXMgZ29pbmcgb24gaW4gdGhlIHJlY3Vyc2lvbiBmb3JcbiogICAgICAgICAgICAgICAgIGVhY2ggb2YgdGhlIHRocmVlIGFkZHJlc3MgcmVzb2x1dGlvbiBmdW5jdGlvbnMuXG4qIFxuKiAgICAgICAgICAgICAgICAgQWx0aG91Z2ggdGhlcmUgaXMgc29tZSBvcHBvcnR1bml0eSB0byByZXBlYXQgb3Vyc2VsdmVzIGFcbiogICAgICAgICAgICAgICAgIGJpdCBsZXNzIGluIHRoaXMgY29kZWJhc2UgKGUuZy4gd2l0aCBkZXRlY3Rpb24gb2YgYXJyYXlzXG4qICAgICAgICAgICAgICAgICB2ZXJzdXMgb2JqZWN0cyB2ZXJzdXMgZGlyZWN0IHByb3BlcnRpZXMpLCBpdCBjYW4gbWFrZVxuKiAgICAgICAgICAgICAgICAgZGVidWdnaW5nLi4gY2hhbGxlbmdpbmcuICBUaGUgbWluaWZpZWQgdmVyc2lvbiBvZiB0aGUgY29kZVxuKiAgICAgICAgICAgICAgICAgb3B0aW1pemVzIG91dCBhbG1vc3QgYW55dGhpbmcgcmVwZWF0ZWQgaW4gaGVyZS4gIFNvIHBsZWFzZVxuKiAgICAgICAgICAgICAgICAgYmUga2luZCBhbmQgcmV3aW5kLi4uIG1lYW5pbmcgcGxlYXNlIGtlZXAgdGhlIGNvZGViYXNlIGxlc3NcbiogICAgICAgICAgICAgICAgIHRlcnNlIGFuZCBtb3JlIHZlcmJvc2Ugc28gaHVtYW5zIGNhbiBjb21wcmVoZW5kIGl0LlxuKiAgICAgICAgICAgICAgICAgXG4qXG4qIEBjbGFzcyBNYW55ZmVzdE9iamVjdEFkZHJlc3NSZXNvbHZlclxuKi9cbmNsYXNzIE1hbnlmZXN0T2JqZWN0QWRkcmVzc1Jlc29sdmVyXG57XG5cdGNvbnN0cnVjdG9yKHBJbmZvTG9nLCBwRXJyb3JMb2cpXG5cdHtcblx0XHQvLyBXaXJlIGluIGxvZ2dpbmdcblx0XHR0aGlzLmxvZ0luZm8gPSAodHlwZW9mKHBJbmZvTG9nKSA9PSAnZnVuY3Rpb24nKSA/IHBJbmZvTG9nIDogbGliU2ltcGxlTG9nO1xuXHRcdHRoaXMubG9nRXJyb3IgPSAodHlwZW9mKHBFcnJvckxvZykgPT0gJ2Z1bmN0aW9uJykgPyBwRXJyb3JMb2cgOiBsaWJTaW1wbGVMb2c7XG5cdH1cblxuXHQvLyBXaGVuIGEgYm94ZWQgcHJvcGVydHkgaXMgcGFzc2VkIGluLCBpdCBzaG91bGQgaGF2ZSBxdW90ZXMgb2Ygc29tZVxuXHQvLyBraW5kIGFyb3VuZCBpdC5cblx0Ly9cblx0Ly8gRm9yIGluc3RhbmNlOlxuXHQvLyBcdFx0TXlWYWx1ZXNbJ05hbWUnXVxuXHQvLyBcdFx0TXlWYWx1ZXNbXCJBZ2VcIl1cblx0Ly8gXHRcdE15VmFsdWVzW2BDb3N0YF1cblx0Ly9cblx0Ly8gVGhpcyBmdW5jdGlvbiByZW1vdmVzIHRoZSB3cmFwcGluZyBxdW90ZXMuXG5cdC8vXG5cdC8vIFBsZWFzZSBub3RlIGl0ICpET0VTIE5PVCBQQVJTRSogdGVtcGxhdGUgbGl0ZXJhbHMsIHNvIGJhY2t0aWNrcyBqdXN0XG5cdC8vIGVuZCB1cCBkb2luZyB0aGUgc2FtZSB0aGluZyBhcyBvdGhlciBxdW90ZSB0eXBlcy5cblx0Ly9cblx0Ly8gVE9ETzogU2hvdWxkIHRlbXBsYXRlIGxpdGVyYWxzIGJlIHByb2Nlc3NlZD8gIElmIHNvIHdoYXQgc3RhdGUgZG8gdGhleSBoYXZlIGFjY2VzcyB0bz9cblx0Y2xlYW5XcmFwQ2hhcmFjdGVycyAocENoYXJhY3RlciwgcFN0cmluZylcblx0e1xuXHRcdGlmIChwU3RyaW5nLnN0YXJ0c1dpdGgocENoYXJhY3RlcikgJiYgcFN0cmluZy5lbmRzV2l0aChwQ2hhcmFjdGVyKSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gcFN0cmluZy5zdWJzdHJpbmcoMSwgcFN0cmluZy5sZW5ndGggLSAxKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHJldHVybiBwU3RyaW5nO1xuXHRcdH1cblx0fVxuXG5cdC8vIENoZWNrIGlmIGFuIGFkZHJlc3MgZXhpc3RzLlxuXHQvL1xuXHQvLyBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHRoZSBnZXRWYWx1ZUF0QWRkcmVzcyBmdW5jdGlvbiBpcyBhbWJpZ3VvdXMgb24gXG5cdC8vIHdoZXRoZXIgdGhlIGVsZW1lbnQvcHJvcGVydHkgaXMgYWN0dWFsbHkgdGhlcmUgb3Igbm90IChpdCByZXR1cm5zIFxuXHQvLyB1bmRlZmluZWQgd2hldGhlciB0aGUgcHJvcGVydHkgZXhpc3RzIG9yIG5vdCkuICBUaGlzIGZ1bmN0aW9uIGNoZWNrcyBmb3Jcblx0Ly8gZXhpc3RhbmNlIGFuZCByZXR1cm5zIHRydWUgb3IgZmFsc2UgZGVwZW5kZW50LlxuXHRjaGVja0FkZHJlc3NFeGlzdHMgKHBPYmplY3QsIHBBZGRyZXNzKVxuXHR7XG5cdFx0Ly8gVE9ETzogU2hvdWxkIHRoZXNlIHRocm93IGFuIGVycm9yP1xuXHRcdC8vIE1ha2Ugc3VyZSBwT2JqZWN0IGlzIGFuIG9iamVjdFxuXHRcdGlmICh0eXBlb2YocE9iamVjdCkgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblx0XHQvLyBNYWtlIHN1cmUgcEFkZHJlc3MgaXMgYSBzdHJpbmdcblx0XHRpZiAodHlwZW9mKHBBZGRyZXNzKSAhPSAnc3RyaW5nJykgcmV0dXJuIGZhbHNlO1xuXG5cdFx0Ly8gVE9ETzogTWFrZSB0aGlzIHdvcmsgZm9yIHRoaW5ncyBsaWtlIFNvbWVSb290T2JqZWN0Lk1ldGFkYXRhW1wiU29tZS5QZW9wbGUuVXNlLkJhZC5PYmplY3QuUHJvcGVydHkuTmFtZXNcIl1cblx0XHRsZXQgdG1wU2VwYXJhdG9ySW5kZXggPSBwQWRkcmVzcy5pbmRleE9mKCcuJyk7XG5cblx0XHQvLyBUaGlzIGlzIHRoZSB0ZXJtaW5hbCBhZGRyZXNzIHN0cmluZyAobm8gbW9yZSBkb3RzIHNvIHRoZSBSRUNVU0lPTiBFTkRTIElOIEhFUkUgc29tZWhvdylcblx0XHRpZiAodG1wU2VwYXJhdG9ySW5kZXggPT0gLTEpXG5cdFx0e1xuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIGFkZHJlc3MgcmVmZXJzIHRvIGEgYm94ZWQgcHJvcGVydHlcblx0XHRcdGxldCB0bXBCcmFja2V0U3RhcnRJbmRleCA9IHBBZGRyZXNzLmluZGV4T2YoJ1snKTtcblx0XHRcdGxldCB0bXBCcmFja2V0U3RvcEluZGV4ID0gcEFkZHJlc3MuaW5kZXhPZignXScpO1xuXHRcdFx0Ly8gQm94ZWQgZWxlbWVudHMgbG9vayBsaWtlIHRoaXM6XG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbMTBdXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbJ05hbWUnXVxuXHRcdFx0Ly8gXHRcdE15VmFsdWVzW1wiQWdlXCJdXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbYENvc3RgXVxuXHRcdFx0Ly9cblx0XHRcdC8vIFdoZW4gd2UgYXJlIHBhc3NlZCBTb21lT2JqZWN0W1wiTmFtZVwiXSB0aGlzIGNvZGUgYmVsb3cgcmVjdXJzZXMgYXMgaWYgaXQgd2VyZSBTb21lT2JqZWN0Lk5hbWVcblx0XHRcdC8vIFRoZSByZXF1aXJlbWVudHMgdG8gZGV0ZWN0IGEgYm94ZWQgZWxlbWVudCBhcmU6XG5cdFx0XHQvLyAgICAxKSBUaGUgc3RhcnQgYnJhY2tldCBpcyBhZnRlciBjaGFyYWN0ZXIgMFxuXHRcdFx0aWYgKCh0bXBCcmFja2V0U3RhcnRJbmRleCA+IDApIFxuXHRcdFx0Ly8gICAgMikgVGhlIGVuZCBicmFja2V0IGhhcyBzb21ldGhpbmcgYmV0d2VlbiB0aGVtXG5cdFx0XHRcdCYmICh0bXBCcmFja2V0U3RvcEluZGV4ID4gdG1wQnJhY2tldFN0YXJ0SW5kZXgpIFxuXHRcdFx0Ly8gICAgMykgVGhlcmUgaXMgZGF0YSBcblx0XHRcdFx0JiYgKHRtcEJyYWNrZXRTdG9wSW5kZXggLSB0bXBCcmFja2V0U3RhcnRJbmRleCA+IDApKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBUaGUgXCJOYW1lXCIgb2YgdGhlIE9iamVjdCBjb250YWluZWQgdG9vIHRoZSBsZWZ0IG9mIHRoZSBicmFja2V0XG5cdFx0XHRcdGxldCB0bXBCb3hlZFByb3BlcnR5TmFtZSA9IHBBZGRyZXNzLnN1YnN0cmluZygwLCB0bXBCcmFja2V0U3RhcnRJbmRleCkudHJpbSgpO1xuXG5cdFx0XHRcdC8vIElmIHRoZSBzdWJwcm9wZXJ0eSBkb2Vzbid0IHRlc3QgYXMgYSBwcm9wZXIgT2JqZWN0LCBub25lIG9mIHRoZSByZXN0IG9mIHRoaXMgaXMgcG9zc2libGUuXG5cdFx0XHRcdC8vIFRoaXMgaXMgYSByYXJlIGNhc2Ugd2hlcmUgQXJyYXlzIHRlc3RpbmcgYXMgT2JqZWN0cyBpcyB1c2VmdWxcblx0XHRcdFx0aWYgKHR5cGVvZihwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXSkgIT09ICdvYmplY3QnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVGhlIFwiUmVmZXJlbmNlXCIgdG8gdGhlIHByb3BlcnR5IHdpdGhpbiBpdCwgZWl0aGVyIGFuIGFycmF5IGVsZW1lbnQgb3Igb2JqZWN0IHByb3BlcnR5XG5cdFx0XHRcdGxldCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gcEFkZHJlc3Muc3Vic3RyaW5nKHRtcEJyYWNrZXRTdGFydEluZGV4KzEsIHRtcEJyYWNrZXRTdG9wSW5kZXgpLnRyaW0oKTtcblx0XHRcdFx0Ly8gQXR0ZW1wdCB0byBwYXJzZSB0aGUgcmVmZXJlbmNlIGFzIGEgbnVtYmVyLCB3aGljaCB3aWxsIGJlIHVzZWQgYXMgYW4gYXJyYXkgZWxlbWVudFxuXHRcdFx0XHRsZXQgdG1wQm94ZWRQcm9wZXJ0eU51bWJlciA9IHBhcnNlSW50KHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UsIDEwKTtcblxuXHRcdFx0XHQvLyBHdWFyZDogSWYgdGhlIHJlZmVycmFudCBpcyBhIG51bWJlciBhbmQgdGhlIGJveGVkIHByb3BlcnR5IGlzIG5vdCBhbiBhcnJheSwgb3IgdmljZSB2ZXJzYSwgcmV0dXJuIHVuZGVmaW5lZC5cblx0XHRcdFx0Ly8gICAgICAgIFRoaXMgc2VlbXMgY29uZnVzaW5nIHRvIG1lIGF0IGZpcnN0IHJlYWQsIHNvIGV4cGxhaW5hdGlvbjpcblx0XHRcdFx0Ly8gICAgICAgIElzIHRoZSBCb3hlZCBPYmplY3QgYW4gQXJyYXk/ICBUUlVFXG5cdFx0XHRcdC8vICAgICAgICBBbmQgaXMgdGhlIFJlZmVyZW5jZSBpbnNpZGUgdGhlIGJveGVkIE9iamVjdCBub3QgYSBudW1iZXI/IFRSVUVcblx0XHRcdFx0Ly8gICAgICAgIC0tPiAgU28gd2hlbiB0aGVzZSBhcmUgaW4gYWdyZWVtZW50LCBpdCdzIGFuIGltcG9zc2libGUgYWNjZXNzIHN0YXRlXG5cdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdKSA9PSBpc05hTih0bXBCb3hlZFByb3BlcnR5TnVtYmVyKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vICAgIDQpIElmIHRoZSBtaWRkbGUgcGFydCBpcyAqb25seSogYSBudW1iZXIgKG5vIHNpbmdsZSwgZG91YmxlIG9yIGJhY2t0aWNrIHF1b3RlcykgaXQgaXMgYW4gYXJyYXkgZWxlbWVudCxcblx0XHRcdFx0Ly8gICAgICAgb3RoZXJ3aXNlIHdlIHdpbGwgdHJ5IHRvIHRyZWF0IGl0IGFzIGEgZHluYW1pYyBvYmplY3QgcHJvcGVydHkuXG5cdFx0XHRcdGlmIChpc05hTih0bXBCb3hlZFByb3BlcnR5TnVtYmVyKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIFRoaXMgaXNuJ3QgYSBudW1iZXIgLi4uIGxldCdzIHRyZWF0IGl0IGFzIGEgZHluYW1pYyBvYmplY3QgcHJvcGVydHkuXG5cdFx0XHRcdFx0Ly8gV2Ugd291bGQgZXhwZWN0IHRoZSBwcm9wZXJ0eSB0byBiZSB3cmFwcGVkIGluIHNvbWUga2luZCBvZiBxdW90ZXMgc28gc3RyaXAgdGhlbVxuXHRcdFx0XHRcdHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSB0aGlzLmNsZWFuV3JhcENoYXJhY3RlcnMoJ1wiJywgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycygnYCcsIHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UpO1xuXHRcdFx0XHRcdHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSB0aGlzLmNsZWFuV3JhcENoYXJhY3RlcnMoXCInXCIsIHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UpO1xuXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIHByb3BlcnR5IGV4aXN0cy5cblx0XHRcdFx0XHRyZXR1cm4gcE9iamVjdFt0bXBCb3hlZFByb3BlcnR5TmFtZV0uaGFzT3duUHJvcGVydHkodG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gVXNlIHRoZSBuZXcgaW4gb3BlcmF0b3IgdG8gc2VlIGlmIHRoZSBlbGVtZW50IGlzIGluIHRoZSBhcnJheVxuXHRcdFx0XHRcdHJldHVybiAodG1wQm94ZWRQcm9wZXJ0eU51bWJlciBpbiBwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIHByb3BlcnR5IGV4aXN0c1xuXHRcdFx0XHRyZXR1cm4gcE9iamVjdC5oYXNPd25Qcm9wZXJ0eShwQWRkcmVzcyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRsZXQgdG1wU3ViT2JqZWN0TmFtZSA9IHBBZGRyZXNzLnN1YnN0cmluZygwLCB0bXBTZXBhcmF0b3JJbmRleCk7XG5cdFx0XHRsZXQgdG1wTmV3QWRkcmVzcyA9IHBBZGRyZXNzLnN1YnN0cmluZyh0bXBTZXBhcmF0b3JJbmRleCsxKTtcblxuXHRcdFx0Ly8gVGVzdCBpZiB0aGUgdG1wTmV3QWRkcmVzcyBpcyBhbiBhcnJheSBvciBvYmplY3Rcblx0XHRcdC8vIENoZWNrIGlmIGl0J3MgYSBib3hlZCBwcm9wZXJ0eVxuXHRcdFx0bGV0IHRtcEJyYWNrZXRTdGFydEluZGV4ID0gdG1wU3ViT2JqZWN0TmFtZS5pbmRleE9mKCdbJyk7XG5cdFx0XHRsZXQgdG1wQnJhY2tldFN0b3BJbmRleCA9IHRtcFN1Yk9iamVjdE5hbWUuaW5kZXhPZignXScpO1xuXHRcdFx0Ly8gQm94ZWQgZWxlbWVudHMgbG9vayBsaWtlIHRoaXM6XG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbNDJdXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbJ0NvbG9yJ11cblx0XHRcdC8vIFx0XHRNeVZhbHVlc1tcIldlaWdodFwiXVxuXHRcdFx0Ly8gXHRcdE15VmFsdWVzW2BEaWFtZXRlcmBdXG5cdFx0XHQvL1xuXHRcdFx0Ly8gV2hlbiB3ZSBhcmUgcGFzc2VkIFNvbWVPYmplY3RbXCJOYW1lXCJdIHRoaXMgY29kZSBiZWxvdyByZWN1cnNlcyBhcyBpZiBpdCB3ZXJlIFNvbWVPYmplY3QuTmFtZVxuXHRcdFx0Ly8gVGhlIHJlcXVpcmVtZW50cyB0byBkZXRlY3QgYSBib3hlZCBlbGVtZW50IGFyZTpcblx0XHRcdC8vICAgIDEpIFRoZSBzdGFydCBicmFja2V0IGlzIGFmdGVyIGNoYXJhY3RlciAwXG5cdFx0XHRpZiAoKHRtcEJyYWNrZXRTdGFydEluZGV4ID4gMCkgXG5cdFx0XHQvLyAgICAyKSBUaGUgZW5kIGJyYWNrZXQgaGFzIHNvbWV0aGluZyBiZXR3ZWVuIHRoZW1cblx0XHRcdFx0JiYgKHRtcEJyYWNrZXRTdG9wSW5kZXggPiB0bXBCcmFja2V0U3RhcnRJbmRleCkgXG5cdFx0XHQvLyAgICAzKSBUaGVyZSBpcyBkYXRhIFxuXHRcdFx0XHQmJiAodG1wQnJhY2tldFN0b3BJbmRleCAtIHRtcEJyYWNrZXRTdGFydEluZGV4ID4gMCkpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB0bXBCb3hlZFByb3BlcnR5TmFtZSA9IHRtcFN1Yk9iamVjdE5hbWUuc3Vic3RyaW5nKDAsIHRtcEJyYWNrZXRTdGFydEluZGV4KS50cmltKCk7XG5cblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSB0bXBTdWJPYmplY3ROYW1lLnN1YnN0cmluZyh0bXBCcmFja2V0U3RhcnRJbmRleCsxLCB0bXBCcmFja2V0U3RvcEluZGV4KS50cmltKCk7XG5cblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlOdW1iZXIgPSBwYXJzZUludCh0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlLCAxMCk7XG5cblx0XHRcdFx0Ly8gR3VhcmQ6IElmIHRoZSByZWZlcnJhbnQgaXMgYSBudW1iZXIgYW5kIHRoZSBib3hlZCBwcm9wZXJ0eSBpcyBub3QgYW4gYXJyYXksIG9yIHZpY2UgdmVyc2EsIHJldHVybiB1bmRlZmluZWQuXG5cdFx0XHRcdC8vICAgICAgICBUaGlzIHNlZW1zIGNvbmZ1c2luZyB0byBtZSBhdCBmaXJzdCByZWFkLCBzbyBleHBsYWluYXRpb246XG5cdFx0XHRcdC8vICAgICAgICBJcyB0aGUgQm94ZWQgT2JqZWN0IGFuIEFycmF5PyAgVFJVRVxuXHRcdFx0XHQvLyAgICAgICAgQW5kIGlzIHRoZSBSZWZlcmVuY2UgaW5zaWRlIHRoZSBib3hlZCBPYmplY3Qgbm90IGEgbnVtYmVyPyBUUlVFXG5cdFx0XHRcdC8vICAgICAgICAtLT4gIFNvIHdoZW4gdGhlc2UgYXJlIGluIGFncmVlbWVudCwgaXQncyBhbiBpbXBvc3NpYmxlIGFjY2VzcyBzdGF0ZVxuXHRcdFx0XHQvLyBUaGlzIGNvdWxkIGJlIGEgZmFpbHVyZSBpbiB0aGUgcmVjdXJzaW9uIGNoYWluIGJlY2F1c2UgdGhleSBwYXNzZWQgc29tZXRoaW5nIGxpa2UgdGhpcyBpbjpcblx0XHRcdFx0Ly8gICAgU3R1ZGVudERhdGEuU2VjdGlvbnMuQWxnZWJyYS5TdHVkZW50c1sxXS5UYXJkeVxuXHRcdFx0XHQvLyAgICAgICBCVVRcblx0XHRcdFx0Ly8gICAgICAgICBTdHVkZW50RGF0YS5TZWN0aW9ucy5BbGdlYnJhLlN0dWRlbnRzIGlzIGFuIG9iamVjdCwgc28gdGhlIFsxXS5UYXJkeSBpcyBub3QgcG9zc2libGUgdG8gYWNjZXNzXG5cdFx0XHRcdC8vIFRoaXMgY291bGQgYmUgYSBmYWlsdXJlIGluIHRoZSByZWN1cnNpb24gY2hhaW4gYmVjYXVzZSB0aGV5IHBhc3NlZCBzb21ldGhpbmcgbGlrZSB0aGlzIGluOlxuXHRcdFx0XHQvLyAgICBTdHVkZW50RGF0YS5TZWN0aW9ucy5BbGdlYnJhLlN0dWRlbnRzW1wiSmFuZURvZVwiXS5HcmFkZVxuXHRcdFx0XHQvLyAgICAgICBCVVRcblx0XHRcdFx0Ly8gICAgICAgICBTdHVkZW50RGF0YS5TZWN0aW9ucy5BbGdlYnJhLlN0dWRlbnRzIGlzIGFuIGFycmF5LCBzbyB0aGUgW1wiSmFuZURvZVwiXS5HcmFkZSBpcyBub3QgcG9zc2libGUgdG8gYWNjZXNzXG5cdFx0XHRcdC8vIFRPRE86IFNob3VsZCB0aGlzIGJlIGFuIGVycm9yIG9yIHNvbWV0aGluZz8gIFNob3VsZCB3ZSBrZWVwIGEgbG9nIG9mIGZhaWx1cmVzIGxpa2UgdGhpcz9cblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocE9iamVjdFt0bXBCb3hlZFByb3BlcnR5TmFtZV0pID09IGlzTmFOKHRtcEJveGVkUHJvcGVydHlOdW1iZXIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gQmVjYXVzZSB0aGlzIGlzIGFuIGltcG9zc2libGUgYWRkcmVzcywgdGhlIHByb3BlcnR5IGRvZXNuJ3QgZXhpc3Rcblx0XHRcdFx0XHQvLyBUT0RPOiBTaG91bGQgd2UgdGhyb3cgYW4gZXJyb3IgaW4gdGhpcyBjb25kaXRpb24/XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9UaGlzIGlzIGEgYnJhY2tldGVkIHZhbHVlXG5cdFx0XHRcdC8vICAgIDQpIElmIHRoZSBtaWRkbGUgcGFydCBpcyAqb25seSogYSBudW1iZXIgKG5vIHNpbmdsZSwgZG91YmxlIG9yIGJhY2t0aWNrIHF1b3RlcykgaXQgaXMgYW4gYXJyYXkgZWxlbWVudCxcblx0XHRcdFx0Ly8gICAgICAgb3RoZXJ3aXNlIHdlIHdpbGwgdHJ5IHRvIHJlYXQgaXQgYXMgYSBkeW5hbWljIG9iamVjdCBwcm9wZXJ0eS5cblx0XHRcdFx0aWYgKGlzTmFOKHRtcEJveGVkUHJvcGVydHlOdW1iZXIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gVGhpcyBpc24ndCBhIG51bWJlciAuLi4gbGV0J3MgdHJlYXQgaXQgYXMgYSBkeW5hbm1pYyBvYmplY3QgcHJvcGVydHkuXG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycygnXCInLCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblx0XHRcdFx0XHR0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gdGhpcy5jbGVhbldyYXBDaGFyYWN0ZXJzKCdgJywgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycyhcIidcIiwgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cblx0XHRcdFx0XHQvLyBSZWN1cnNlIGRpcmVjdGx5IGludG8gdGhlIHN1Ym9iamVjdFxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNoZWNrQWRkcmVzc0V4aXN0cyhwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXVt0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlXSwgdG1wTmV3QWRkcmVzcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gV2UgcGFyc2VkIGEgdmFsaWQgbnVtYmVyIG91dCBvZiB0aGUgYm94ZWQgcHJvcGVydHkgbmFtZSwgc28gcmVjdXJzZSBpbnRvIHRoZSBhcnJheVxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNoZWNrQWRkcmVzc0V4aXN0cyhwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXVt0bXBCb3hlZFByb3BlcnR5TnVtYmVyXSwgdG1wTmV3QWRkcmVzcyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgdGhlcmUgaXMgYW4gb2JqZWN0IHByb3BlcnR5IGFscmVhZHkgbmFtZWQgZm9yIHRoZSBzdWIgb2JqZWN0LCBidXQgaXQgaXNuJ3QgYW4gb2JqZWN0XG5cdFx0XHQvLyB0aGVuIHRoZSBzeXN0ZW0gY2FuJ3Qgc2V0IHRoZSB2YWx1ZSBpbiB0aGVyZS4gIEVycm9yIGFuZCBhYm9ydCFcblx0XHRcdGlmIChwT2JqZWN0Lmhhc093blByb3BlcnR5KHRtcFN1Yk9iamVjdE5hbWUpICYmIHR5cGVvZihwT2JqZWN0W3RtcFN1Yk9iamVjdE5hbWVdKSAhPT0gJ29iamVjdCcpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHBPYmplY3QuaGFzT3duUHJvcGVydHkodG1wU3ViT2JqZWN0TmFtZSkpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYSBzdWJvYmplY3QgcGFzcyB0aGF0IHRvIHRoZSByZWN1cnNpdmUgdGhpbmd5XG5cdFx0XHRcdHJldHVybiB0aGlzLmNoZWNrQWRkcmVzc0V4aXN0cyhwT2JqZWN0W3RtcFN1Yk9iamVjdE5hbWVdLCB0bXBOZXdBZGRyZXNzKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Ly8gQ3JlYXRlIGEgc3Vib2JqZWN0IGFuZCB0aGVuIHBhc3MgdGhhdFxuXHRcdFx0XHRwT2JqZWN0W3RtcFN1Yk9iamVjdE5hbWVdID0ge307XG5cdFx0XHRcdHJldHVybiB0aGlzLmNoZWNrQWRkcmVzc0V4aXN0cyhwT2JqZWN0W3RtcFN1Yk9iamVjdE5hbWVdLCB0bXBOZXdBZGRyZXNzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBHZXQgdGhlIHZhbHVlIG9mIGFuIGVsZW1lbnQgYXQgYW4gYWRkcmVzc1xuXHRnZXRWYWx1ZUF0QWRkcmVzcyAocE9iamVjdCwgcEFkZHJlc3MpXG5cdHtcblx0XHQvLyBNYWtlIHN1cmUgcE9iamVjdCBpcyBhbiBvYmplY3Rcblx0XHRpZiAodHlwZW9mKHBPYmplY3QpICE9ICdvYmplY3QnKSByZXR1cm4gdW5kZWZpbmVkO1xuXHRcdC8vIE1ha2Ugc3VyZSBwQWRkcmVzcyBpcyBhIHN0cmluZ1xuXHRcdGlmICh0eXBlb2YocEFkZHJlc3MpICE9ICdzdHJpbmcnKSByZXR1cm4gdW5kZWZpbmVkO1xuXG5cdFx0Ly8gVE9ETzogTWFrZSB0aGlzIHdvcmsgZm9yIHRoaW5ncyBsaWtlIFNvbWVSb290T2JqZWN0Lk1ldGFkYXRhW1wiU29tZS5QZW9wbGUuVXNlLkJhZC5PYmplY3QuUHJvcGVydHkuTmFtZXNcIl1cblx0XHRsZXQgdG1wU2VwYXJhdG9ySW5kZXggPSBwQWRkcmVzcy5pbmRleE9mKCcuJyk7XG5cblx0XHQvLyBUaGlzIGlzIHRoZSB0ZXJtaW5hbCBhZGRyZXNzIHN0cmluZyAobm8gbW9yZSBkb3RzIHNvIHRoZSBSRUNVU0lPTiBFTkRTIElOIEhFUkUgc29tZWhvdylcblx0XHRpZiAodG1wU2VwYXJhdG9ySW5kZXggPT0gLTEpXG5cdFx0e1xuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIGFkZHJlc3MgcmVmZXJzIHRvIGEgYm94ZWQgcHJvcGVydHlcblx0XHRcdGxldCB0bXBCcmFja2V0U3RhcnRJbmRleCA9IHBBZGRyZXNzLmluZGV4T2YoJ1snKTtcblx0XHRcdGxldCB0bXBCcmFja2V0U3RvcEluZGV4ID0gcEFkZHJlc3MuaW5kZXhPZignXScpO1xuXHRcdFx0Ly8gQm94ZWQgZWxlbWVudHMgbG9vayBsaWtlIHRoaXM6XG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbMTBdXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbJ05hbWUnXVxuXHRcdFx0Ly8gXHRcdE15VmFsdWVzW1wiQWdlXCJdXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbYENvc3RgXVxuXHRcdFx0Ly9cblx0XHRcdC8vIFdoZW4gd2UgYXJlIHBhc3NlZCBTb21lT2JqZWN0W1wiTmFtZVwiXSB0aGlzIGNvZGUgYmVsb3cgcmVjdXJzZXMgYXMgaWYgaXQgd2VyZSBTb21lT2JqZWN0Lk5hbWVcblx0XHRcdC8vIFRoZSByZXF1aXJlbWVudHMgdG8gZGV0ZWN0IGEgYm94ZWQgZWxlbWVudCBhcmU6XG5cdFx0XHQvLyAgICAxKSBUaGUgc3RhcnQgYnJhY2tldCBpcyBhZnRlciBjaGFyYWN0ZXIgMFxuXHRcdFx0aWYgKCh0bXBCcmFja2V0U3RhcnRJbmRleCA+IDApIFxuXHRcdFx0Ly8gICAgMikgVGhlIGVuZCBicmFja2V0IGhhcyBzb21ldGhpbmcgYmV0d2VlbiB0aGVtXG5cdFx0XHRcdCYmICh0bXBCcmFja2V0U3RvcEluZGV4ID4gdG1wQnJhY2tldFN0YXJ0SW5kZXgpIFxuXHRcdFx0Ly8gICAgMykgVGhlcmUgaXMgZGF0YSBcblx0XHRcdFx0JiYgKHRtcEJyYWNrZXRTdG9wSW5kZXggLSB0bXBCcmFja2V0U3RhcnRJbmRleCA+IDApKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBUaGUgXCJOYW1lXCIgb2YgdGhlIE9iamVjdCBjb250YWluZWQgdG9vIHRoZSBsZWZ0IG9mIHRoZSBicmFja2V0XG5cdFx0XHRcdGxldCB0bXBCb3hlZFByb3BlcnR5TmFtZSA9IHBBZGRyZXNzLnN1YnN0cmluZygwLCB0bXBCcmFja2V0U3RhcnRJbmRleCkudHJpbSgpO1xuXG5cdFx0XHRcdC8vIElmIHRoZSBzdWJwcm9wZXJ0eSBkb2Vzbid0IHRlc3QgYXMgYSBwcm9wZXIgT2JqZWN0LCBub25lIG9mIHRoZSByZXN0IG9mIHRoaXMgaXMgcG9zc2libGUuXG5cdFx0XHRcdC8vIFRoaXMgaXMgYSByYXJlIGNhc2Ugd2hlcmUgQXJyYXlzIHRlc3RpbmcgYXMgT2JqZWN0cyBpcyB1c2VmdWxcblx0XHRcdFx0aWYgKHR5cGVvZihwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXSkgIT09ICdvYmplY3QnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFRoZSBcIlJlZmVyZW5jZVwiIHRvIHRoZSBwcm9wZXJ0eSB3aXRoaW4gaXQsIGVpdGhlciBhbiBhcnJheSBlbGVtZW50IG9yIG9iamVjdCBwcm9wZXJ0eVxuXHRcdFx0XHRsZXQgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHBBZGRyZXNzLnN1YnN0cmluZyh0bXBCcmFja2V0U3RhcnRJbmRleCsxLCB0bXBCcmFja2V0U3RvcEluZGV4KS50cmltKCk7XG5cdFx0XHRcdC8vIEF0dGVtcHQgdG8gcGFyc2UgdGhlIHJlZmVyZW5jZSBhcyBhIG51bWJlciwgd2hpY2ggd2lsbCBiZSB1c2VkIGFzIGFuIGFycmF5IGVsZW1lbnRcblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlOdW1iZXIgPSBwYXJzZUludCh0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlLCAxMCk7XG5cblx0XHRcdFx0Ly8gR3VhcmQ6IElmIHRoZSByZWZlcnJhbnQgaXMgYSBudW1iZXIgYW5kIHRoZSBib3hlZCBwcm9wZXJ0eSBpcyBub3QgYW4gYXJyYXksIG9yIHZpY2UgdmVyc2EsIHJldHVybiB1bmRlZmluZWQuXG5cdFx0XHRcdC8vICAgICAgICBUaGlzIHNlZW1zIGNvbmZ1c2luZyB0byBtZSBhdCBmaXJzdCByZWFkLCBzbyBleHBsYWluYXRpb246XG5cdFx0XHRcdC8vICAgICAgICBJcyB0aGUgQm94ZWQgT2JqZWN0IGFuIEFycmF5PyAgVFJVRVxuXHRcdFx0XHQvLyAgICAgICAgQW5kIGlzIHRoZSBSZWZlcmVuY2UgaW5zaWRlIHRoZSBib3hlZCBPYmplY3Qgbm90IGEgbnVtYmVyPyBUUlVFXG5cdFx0XHRcdC8vICAgICAgICAtLT4gIFNvIHdoZW4gdGhlc2UgYXJlIGluIGFncmVlbWVudCwgaXQncyBhbiBpbXBvc3NpYmxlIGFjY2VzcyBzdGF0ZVxuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXSkgPT0gaXNOYU4odG1wQm94ZWRQcm9wZXJ0eU51bWJlcikpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gICAgNCkgSWYgdGhlIG1pZGRsZSBwYXJ0IGlzICpvbmx5KiBhIG51bWJlciAobm8gc2luZ2xlLCBkb3VibGUgb3IgYmFja3RpY2sgcXVvdGVzKSBpdCBpcyBhbiBhcnJheSBlbGVtZW50LFxuXHRcdFx0XHQvLyAgICAgICBvdGhlcndpc2Ugd2Ugd2lsbCB0cnkgdG8gdHJlYXQgaXQgYXMgYSBkeW5hbWljIG9iamVjdCBwcm9wZXJ0eS5cblx0XHRcdFx0aWYgKGlzTmFOKHRtcEJveGVkUHJvcGVydHlOdW1iZXIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gVGhpcyBpc24ndCBhIG51bWJlciAuLi4gbGV0J3MgdHJlYXQgaXQgYXMgYSBkeW5hbWljIG9iamVjdCBwcm9wZXJ0eS5cblx0XHRcdFx0XHQvLyBXZSB3b3VsZCBleHBlY3QgdGhlIHByb3BlcnR5IHRvIGJlIHdyYXBwZWQgaW4gc29tZSBraW5kIG9mIHF1b3RlcyBzbyBzdHJpcCB0aGVtXG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycygnXCInLCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblx0XHRcdFx0XHR0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gdGhpcy5jbGVhbldyYXBDaGFyYWN0ZXJzKCdgJywgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycyhcIidcIiwgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cblx0XHRcdFx0XHQvLyBSZXR1cm4gdGhlIHZhbHVlIGluIHRoZSBwcm9wZXJ0eVxuXHRcdFx0XHRcdHJldHVybiBwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXVt0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gcE9iamVjdFt0bXBCb3hlZFByb3BlcnR5TmFtZV1bdG1wQm94ZWRQcm9wZXJ0eU51bWJlcl07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Ly8gTm93IGlzIHRoZSBwb2ludCBpbiByZWN1cnNpb24gdG8gcmV0dXJuIHRoZSB2YWx1ZSBpbiB0aGUgYWRkcmVzc1xuXHRcdFx0XHRyZXR1cm4gcE9iamVjdFtwQWRkcmVzc107XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRsZXQgdG1wU3ViT2JqZWN0TmFtZSA9IHBBZGRyZXNzLnN1YnN0cmluZygwLCB0bXBTZXBhcmF0b3JJbmRleCk7XG5cdFx0XHRsZXQgdG1wTmV3QWRkcmVzcyA9IHBBZGRyZXNzLnN1YnN0cmluZyh0bXBTZXBhcmF0b3JJbmRleCsxKTtcblxuXHRcdFx0Ly8gVGVzdCBpZiB0aGUgdG1wTmV3QWRkcmVzcyBpcyBhbiBhcnJheSBvciBvYmplY3Rcblx0XHRcdC8vIENoZWNrIGlmIGl0J3MgYSBib3hlZCBwcm9wZXJ0eVxuXHRcdFx0bGV0IHRtcEJyYWNrZXRTdGFydEluZGV4ID0gdG1wU3ViT2JqZWN0TmFtZS5pbmRleE9mKCdbJyk7XG5cdFx0XHRsZXQgdG1wQnJhY2tldFN0b3BJbmRleCA9IHRtcFN1Yk9iamVjdE5hbWUuaW5kZXhPZignXScpO1xuXHRcdFx0Ly8gQm94ZWQgZWxlbWVudHMgbG9vayBsaWtlIHRoaXM6XG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbNDJdXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbJ0NvbG9yJ11cblx0XHRcdC8vIFx0XHRNeVZhbHVlc1tcIldlaWdodFwiXVxuXHRcdFx0Ly8gXHRcdE15VmFsdWVzW2BEaWFtZXRlcmBdXG5cdFx0XHQvL1xuXHRcdFx0Ly8gV2hlbiB3ZSBhcmUgcGFzc2VkIFNvbWVPYmplY3RbXCJOYW1lXCJdIHRoaXMgY29kZSBiZWxvdyByZWN1cnNlcyBhcyBpZiBpdCB3ZXJlIFNvbWVPYmplY3QuTmFtZVxuXHRcdFx0Ly8gVGhlIHJlcXVpcmVtZW50cyB0byBkZXRlY3QgYSBib3hlZCBlbGVtZW50IGFyZTpcblx0XHRcdC8vICAgIDEpIFRoZSBzdGFydCBicmFja2V0IGlzIGFmdGVyIGNoYXJhY3RlciAwXG5cdFx0XHRpZiAoKHRtcEJyYWNrZXRTdGFydEluZGV4ID4gMCkgXG5cdFx0XHQvLyAgICAyKSBUaGUgZW5kIGJyYWNrZXQgaGFzIHNvbWV0aGluZyBiZXR3ZWVuIHRoZW1cblx0XHRcdFx0JiYgKHRtcEJyYWNrZXRTdG9wSW5kZXggPiB0bXBCcmFja2V0U3RhcnRJbmRleCkgXG5cdFx0XHQvLyAgICAzKSBUaGVyZSBpcyBkYXRhIFxuXHRcdFx0XHQmJiAodG1wQnJhY2tldFN0b3BJbmRleCAtIHRtcEJyYWNrZXRTdGFydEluZGV4ID4gMCkpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB0bXBCb3hlZFByb3BlcnR5TmFtZSA9IHRtcFN1Yk9iamVjdE5hbWUuc3Vic3RyaW5nKDAsIHRtcEJyYWNrZXRTdGFydEluZGV4KS50cmltKCk7XG5cblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSB0bXBTdWJPYmplY3ROYW1lLnN1YnN0cmluZyh0bXBCcmFja2V0U3RhcnRJbmRleCsxLCB0bXBCcmFja2V0U3RvcEluZGV4KS50cmltKCk7XG5cblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlOdW1iZXIgPSBwYXJzZUludCh0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlLCAxMCk7XG5cblx0XHRcdFx0Ly8gR3VhcmQ6IElmIHRoZSByZWZlcnJhbnQgaXMgYSBudW1iZXIgYW5kIHRoZSBib3hlZCBwcm9wZXJ0eSBpcyBub3QgYW4gYXJyYXksIG9yIHZpY2UgdmVyc2EsIHJldHVybiB1bmRlZmluZWQuXG5cdFx0XHRcdC8vICAgICAgICBUaGlzIHNlZW1zIGNvbmZ1c2luZyB0byBtZSBhdCBmaXJzdCByZWFkLCBzbyBleHBsYWluYXRpb246XG5cdFx0XHRcdC8vICAgICAgICBJcyB0aGUgQm94ZWQgT2JqZWN0IGFuIEFycmF5PyAgVFJVRVxuXHRcdFx0XHQvLyAgICAgICAgQW5kIGlzIHRoZSBSZWZlcmVuY2UgaW5zaWRlIHRoZSBib3hlZCBPYmplY3Qgbm90IGEgbnVtYmVyPyBUUlVFXG5cdFx0XHRcdC8vICAgICAgICAtLT4gIFNvIHdoZW4gdGhlc2UgYXJlIGluIGFncmVlbWVudCwgaXQncyBhbiBpbXBvc3NpYmxlIGFjY2VzcyBzdGF0ZVxuXHRcdFx0XHQvLyBUaGlzIGNvdWxkIGJlIGEgZmFpbHVyZSBpbiB0aGUgcmVjdXJzaW9uIGNoYWluIGJlY2F1c2UgdGhleSBwYXNzZWQgc29tZXRoaW5nIGxpa2UgdGhpcyBpbjpcblx0XHRcdFx0Ly8gICAgU3R1ZGVudERhdGEuU2VjdGlvbnMuQWxnZWJyYS5TdHVkZW50c1sxXS5UYXJkeVxuXHRcdFx0XHQvLyAgICAgICBCVVRcblx0XHRcdFx0Ly8gICAgICAgICBTdHVkZW50RGF0YS5TZWN0aW9ucy5BbGdlYnJhLlN0dWRlbnRzIGlzIGFuIG9iamVjdCwgc28gdGhlIFsxXS5UYXJkeSBpcyBub3QgcG9zc2libGUgdG8gYWNjZXNzXG5cdFx0XHRcdC8vIFRoaXMgY291bGQgYmUgYSBmYWlsdXJlIGluIHRoZSByZWN1cnNpb24gY2hhaW4gYmVjYXVzZSB0aGV5IHBhc3NlZCBzb21ldGhpbmcgbGlrZSB0aGlzIGluOlxuXHRcdFx0XHQvLyAgICBTdHVkZW50RGF0YS5TZWN0aW9ucy5BbGdlYnJhLlN0dWRlbnRzW1wiSmFuZURvZVwiXS5HcmFkZVxuXHRcdFx0XHQvLyAgICAgICBCVVRcblx0XHRcdFx0Ly8gICAgICAgICBTdHVkZW50RGF0YS5TZWN0aW9ucy5BbGdlYnJhLlN0dWRlbnRzIGlzIGFuIGFycmF5LCBzbyB0aGUgW1wiSmFuZURvZVwiXS5HcmFkZSBpcyBub3QgcG9zc2libGUgdG8gYWNjZXNzXG5cdFx0XHRcdC8vIFRPRE86IFNob3VsZCB0aGlzIGJlIGFuIGVycm9yIG9yIHNvbWV0aGluZz8gIFNob3VsZCB3ZSBrZWVwIGEgbG9nIG9mIGZhaWx1cmVzIGxpa2UgdGhpcz9cblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocE9iamVjdFt0bXBCb3hlZFByb3BlcnR5TmFtZV0pID09IGlzTmFOKHRtcEJveGVkUHJvcGVydHlOdW1iZXIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vVGhpcyBpcyBhIGJyYWNrZXRlZCB2YWx1ZVxuXHRcdFx0XHQvLyAgICA0KSBJZiB0aGUgbWlkZGxlIHBhcnQgaXMgKm9ubHkqIGEgbnVtYmVyIChubyBzaW5nbGUsIGRvdWJsZSBvciBiYWNrdGljayBxdW90ZXMpIGl0IGlzIGFuIGFycmF5IGVsZW1lbnQsXG5cdFx0XHRcdC8vICAgICAgIG90aGVyd2lzZSB3ZSB3aWxsIHRyeSB0byByZWF0IGl0IGFzIGEgZHluYW1pYyBvYmplY3QgcHJvcGVydHkuXG5cdFx0XHRcdGlmIChpc05hTih0bXBCb3hlZFByb3BlcnR5TnVtYmVyKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIFRoaXMgaXNuJ3QgYSBudW1iZXIgLi4uIGxldCdzIHRyZWF0IGl0IGFzIGEgZHluYW5taWMgb2JqZWN0IHByb3BlcnR5LlxuXHRcdFx0XHRcdHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSB0aGlzLmNsZWFuV3JhcENoYXJhY3RlcnMoJ1wiJywgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycygnYCcsIHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UpO1xuXHRcdFx0XHRcdHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSB0aGlzLmNsZWFuV3JhcENoYXJhY3RlcnMoXCInXCIsIHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UpO1xuXG5cdFx0XHRcdFx0Ly8gUmVjdXJzZSBkaXJlY3RseSBpbnRvIHRoZSBzdWJvYmplY3Rcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRWYWx1ZUF0QWRkcmVzcyhwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXVt0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlXSwgdG1wTmV3QWRkcmVzcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gV2UgcGFyc2VkIGEgdmFsaWQgbnVtYmVyIG91dCBvZiB0aGUgYm94ZWQgcHJvcGVydHkgbmFtZSwgc28gcmVjdXJzZSBpbnRvIHRoZSBhcnJheVxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldFZhbHVlQXRBZGRyZXNzKHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdW3RtcEJveGVkUHJvcGVydHlOdW1iZXJdLCB0bXBOZXdBZGRyZXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiB0aGVyZSBpcyBhbiBvYmplY3QgcHJvcGVydHkgYWxyZWFkeSBuYW1lZCBmb3IgdGhlIHN1YiBvYmplY3QsIGJ1dCBpdCBpc24ndCBhbiBvYmplY3Rcblx0XHRcdC8vIHRoZW4gdGhlIHN5c3RlbSBjYW4ndCBzZXQgdGhlIHZhbHVlIGluIHRoZXJlLiAgRXJyb3IgYW5kIGFib3J0IVxuXHRcdFx0aWYgKHBPYmplY3QuaGFzT3duUHJvcGVydHkodG1wU3ViT2JqZWN0TmFtZSkgJiYgdHlwZW9mKHBPYmplY3RbdG1wU3ViT2JqZWN0TmFtZV0pICE9PSAnb2JqZWN0Jylcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHBPYmplY3QuaGFzT3duUHJvcGVydHkodG1wU3ViT2JqZWN0TmFtZSkpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYSBzdWJvYmplY3QgcGFzcyB0aGF0IHRvIHRoZSByZWN1cnNpdmUgdGhpbmd5XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldFZhbHVlQXRBZGRyZXNzKHBPYmplY3RbdG1wU3ViT2JqZWN0TmFtZV0sIHRtcE5ld0FkZHJlc3MpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBDcmVhdGUgYSBzdWJvYmplY3QgYW5kIHRoZW4gcGFzcyB0aGF0XG5cdFx0XHRcdHBPYmplY3RbdG1wU3ViT2JqZWN0TmFtZV0gPSB7fTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VmFsdWVBdEFkZHJlc3MocE9iamVjdFt0bXBTdWJPYmplY3ROYW1lXSwgdG1wTmV3QWRkcmVzcyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gU2V0IHRoZSB2YWx1ZSBvZiBhbiBlbGVtZW50IGF0IGFuIGFkZHJlc3Ncblx0c2V0VmFsdWVBdEFkZHJlc3MgKHBPYmplY3QsIHBBZGRyZXNzLCBwVmFsdWUpXG5cdHtcblx0XHQvLyBNYWtlIHN1cmUgcE9iamVjdCBpcyBhbiBvYmplY3Rcblx0XHRpZiAodHlwZW9mKHBPYmplY3QpICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG5cdFx0Ly8gTWFrZSBzdXJlIHBBZGRyZXNzIGlzIGEgc3RyaW5nXG5cdFx0aWYgKHR5cGVvZihwQWRkcmVzcykgIT0gJ3N0cmluZycpIHJldHVybiBmYWxzZTtcblxuXHRcdGxldCB0bXBTZXBhcmF0b3JJbmRleCA9IHBBZGRyZXNzLmluZGV4T2YoJy4nKTtcblxuXHRcdGlmICh0bXBTZXBhcmF0b3JJbmRleCA9PSAtMSlcblx0XHR7XG5cdFx0XHQvLyBDaGVjayBpZiBpdCdzIGEgYm94ZWQgcHJvcGVydHlcblx0XHRcdGxldCB0bXBCcmFja2V0U3RhcnRJbmRleCA9IHBBZGRyZXNzLmluZGV4T2YoJ1snKTtcblx0XHRcdGxldCB0bXBCcmFja2V0U3RvcEluZGV4ID0gcEFkZHJlc3MuaW5kZXhPZignXScpO1xuXHRcdFx0Ly8gQm94ZWQgZWxlbWVudHMgbG9vayBsaWtlIHRoaXM6XG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbMTBdXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbJ05hbWUnXVxuXHRcdFx0Ly8gXHRcdE15VmFsdWVzW1wiQWdlXCJdXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbYENvc3RgXVxuXHRcdFx0Ly9cblx0XHRcdC8vIFdoZW4gd2UgYXJlIHBhc3NlZCBTb21lT2JqZWN0W1wiTmFtZVwiXSB0aGlzIGNvZGUgYmVsb3cgcmVjdXJzZXMgYXMgaWYgaXQgd2VyZSBTb21lT2JqZWN0Lk5hbWVcblx0XHRcdC8vIFRoZSByZXF1aXJlbWVudHMgdG8gZGV0ZWN0IGEgYm94ZWQgZWxlbWVudCBhcmU6XG5cdFx0XHQvLyAgICAxKSBUaGUgc3RhcnQgYnJhY2tldCBpcyBhZnRlciBjaGFyYWN0ZXIgMFxuXHRcdFx0aWYgKCh0bXBCcmFja2V0U3RhcnRJbmRleCA+IDApIFxuXHRcdFx0Ly8gICAgMikgVGhlIGVuZCBicmFja2V0IGhhcyBzb21ldGhpbmcgYmV0d2VlbiB0aGVtXG5cdFx0XHRcdCYmICh0bXBCcmFja2V0U3RvcEluZGV4ID4gdG1wQnJhY2tldFN0YXJ0SW5kZXgpIFxuXHRcdFx0Ly8gICAgMykgVGhlcmUgaXMgZGF0YSBcblx0XHRcdFx0JiYgKHRtcEJyYWNrZXRTdG9wSW5kZXggLSB0bXBCcmFja2V0U3RhcnRJbmRleCA+IDApKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBUaGUgXCJOYW1lXCIgb2YgdGhlIE9iamVjdCBjb250YWluZWQgdG9vIHRoZSBsZWZ0IG9mIHRoZSBicmFja2V0XG5cdFx0XHRcdGxldCB0bXBCb3hlZFByb3BlcnR5TmFtZSA9IHBBZGRyZXNzLnN1YnN0cmluZygwLCB0bXBCcmFja2V0U3RhcnRJbmRleCkudHJpbSgpO1xuXG5cdFx0XHRcdC8vIElmIHRoZSBzdWJwcm9wZXJ0eSBkb2Vzbid0IHRlc3QgYXMgYSBwcm9wZXIgT2JqZWN0LCBub25lIG9mIHRoZSByZXN0IG9mIHRoaXMgaXMgcG9zc2libGUuXG5cdFx0XHRcdC8vIFRoaXMgaXMgYSByYXJlIGNhc2Ugd2hlcmUgQXJyYXlzIHRlc3RpbmcgYXMgT2JqZWN0cyBpcyB1c2VmdWxcblx0XHRcdFx0aWYgKHR5cGVvZihwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXSkgIT09ICdvYmplY3QnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVGhlIFwiUmVmZXJlbmNlXCIgdG8gdGhlIHByb3BlcnR5IHdpdGhpbiBpdCwgZWl0aGVyIGFuIGFycmF5IGVsZW1lbnQgb3Igb2JqZWN0IHByb3BlcnR5XG5cdFx0XHRcdGxldCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gcEFkZHJlc3Muc3Vic3RyaW5nKHRtcEJyYWNrZXRTdGFydEluZGV4KzEsIHRtcEJyYWNrZXRTdG9wSW5kZXgpLnRyaW0oKTtcblx0XHRcdFx0Ly8gQXR0ZW1wdCB0byBwYXJzZSB0aGUgcmVmZXJlbmNlIGFzIGEgbnVtYmVyLCB3aGljaCB3aWxsIGJlIHVzZWQgYXMgYW4gYXJyYXkgZWxlbWVudFxuXHRcdFx0XHRsZXQgdG1wQm94ZWRQcm9wZXJ0eU51bWJlciA9IHBhcnNlSW50KHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UsIDEwKTtcblxuXHRcdFx0XHQvLyBHdWFyZDogSWYgdGhlIHJlZmVycmFudCBpcyBhIG51bWJlciBhbmQgdGhlIGJveGVkIHByb3BlcnR5IGlzIG5vdCBhbiBhcnJheSwgb3IgdmljZSB2ZXJzYSwgcmV0dXJuIHVuZGVmaW5lZC5cblx0XHRcdFx0Ly8gICAgICAgIFRoaXMgc2VlbXMgY29uZnVzaW5nIHRvIG1lIGF0IGZpcnN0IHJlYWQsIHNvIGV4cGxhaW5hdGlvbjpcblx0XHRcdFx0Ly8gICAgICAgIElzIHRoZSBCb3hlZCBPYmplY3QgYW4gQXJyYXk/ICBUUlVFXG5cdFx0XHRcdC8vICAgICAgICBBbmQgaXMgdGhlIFJlZmVyZW5jZSBpbnNpZGUgdGhlIGJveGVkIE9iamVjdCBub3QgYSBudW1iZXI/IFRSVUVcblx0XHRcdFx0Ly8gICAgICAgIC0tPiAgU28gd2hlbiB0aGVzZSBhcmUgaW4gYWdyZWVtZW50LCBpdCdzIGFuIGltcG9zc2libGUgYWNjZXNzIHN0YXRlXG5cdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdKSA9PSBpc05hTih0bXBCb3hlZFByb3BlcnR5TnVtYmVyKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vICAgIDQpIElmIHRoZSBtaWRkbGUgcGFydCBpcyAqb25seSogYSBudW1iZXIgKG5vIHNpbmdsZSwgZG91YmxlIG9yIGJhY2t0aWNrIHF1b3RlcykgaXQgaXMgYW4gYXJyYXkgZWxlbWVudCxcblx0XHRcdFx0Ly8gICAgICAgb3RoZXJ3aXNlIHdlIHdpbGwgdHJ5IHRvIHRyZWF0IGl0IGFzIGEgZHluYW1pYyBvYmplY3QgcHJvcGVydHkuXG5cdFx0XHRcdGlmIChpc05hTih0bXBCb3hlZFByb3BlcnR5TnVtYmVyKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIFRoaXMgaXNuJ3QgYSBudW1iZXIgLi4uIGxldCdzIHRyZWF0IGl0IGFzIGEgZHluYW1pYyBvYmplY3QgcHJvcGVydHkuXG5cdFx0XHRcdFx0Ly8gV2Ugd291bGQgZXhwZWN0IHRoZSBwcm9wZXJ0eSB0byBiZSB3cmFwcGVkIGluIHNvbWUga2luZCBvZiBxdW90ZXMgc28gc3RyaXAgdGhlbVxuXHRcdFx0XHRcdHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSB0aGlzLmNsZWFuV3JhcENoYXJhY3RlcnMoJ1wiJywgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycygnYCcsIHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UpO1xuXHRcdFx0XHRcdHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSB0aGlzLmNsZWFuV3JhcENoYXJhY3RlcnMoXCInXCIsIHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UpO1xuXG5cdFx0XHRcdFx0Ly8gUmV0dXJuIHRoZSB2YWx1ZSBpbiB0aGUgcHJvcGVydHlcblx0XHRcdFx0XHRwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXVt0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlXSA9IHBWYWx1ZTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXVt0bXBCb3hlZFByb3BlcnR5TnVtYmVyXSA9IHBWYWx1ZTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBOb3cgaXMgdGhlIHRpbWUgaW4gcmVjdXJzaW9uIHRvIHNldCB0aGUgdmFsdWUgaW4gdGhlIG9iamVjdFxuXHRcdFx0XHRwT2JqZWN0W3BBZGRyZXNzXSA9IHBWYWx1ZTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRsZXQgdG1wU3ViT2JqZWN0TmFtZSA9IHBBZGRyZXNzLnN1YnN0cmluZygwLCB0bXBTZXBhcmF0b3JJbmRleCk7XG5cdFx0XHRsZXQgdG1wTmV3QWRkcmVzcyA9IHBBZGRyZXNzLnN1YnN0cmluZyh0bXBTZXBhcmF0b3JJbmRleCsxKTtcblxuXHRcdFx0Ly8gVGVzdCBpZiB0aGUgdG1wTmV3QWRkcmVzcyBpcyBhbiBhcnJheSBvciBvYmplY3Rcblx0XHRcdC8vIENoZWNrIGlmIGl0J3MgYSBib3hlZCBwcm9wZXJ0eVxuXHRcdFx0bGV0IHRtcEJyYWNrZXRTdGFydEluZGV4ID0gdG1wU3ViT2JqZWN0TmFtZS5pbmRleE9mKCdbJyk7XG5cdFx0XHRsZXQgdG1wQnJhY2tldFN0b3BJbmRleCA9IHRtcFN1Yk9iamVjdE5hbWUuaW5kZXhPZignXScpO1xuXHRcdFx0Ly8gQm94ZWQgZWxlbWVudHMgbG9vayBsaWtlIHRoaXM6XG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbNDJdXG5cdFx0XHQvLyBcdFx0TXlWYWx1ZXNbJ0NvbG9yJ11cblx0XHRcdC8vIFx0XHRNeVZhbHVlc1tcIldlaWdodFwiXVxuXHRcdFx0Ly8gXHRcdE15VmFsdWVzW2BEaWFtZXRlcmBdXG5cdFx0XHQvL1xuXHRcdFx0Ly8gV2hlbiB3ZSBhcmUgcGFzc2VkIFNvbWVPYmplY3RbXCJOYW1lXCJdIHRoaXMgY29kZSBiZWxvdyByZWN1cnNlcyBhcyBpZiBpdCB3ZXJlIFNvbWVPYmplY3QuTmFtZVxuXHRcdFx0Ly8gVGhlIHJlcXVpcmVtZW50cyB0byBkZXRlY3QgYSBib3hlZCBlbGVtZW50IGFyZTpcblx0XHRcdC8vICAgIDEpIFRoZSBzdGFydCBicmFja2V0IGlzIGFmdGVyIGNoYXJhY3RlciAwXG5cdFx0XHRpZiAoKHRtcEJyYWNrZXRTdGFydEluZGV4ID4gMCkgXG5cdFx0XHQvLyAgICAyKSBUaGUgZW5kIGJyYWNrZXQgaGFzIHNvbWV0aGluZyBiZXR3ZWVuIHRoZW1cblx0XHRcdFx0JiYgKHRtcEJyYWNrZXRTdG9wSW5kZXggPiB0bXBCcmFja2V0U3RhcnRJbmRleCkgXG5cdFx0XHQvLyAgICAzKSBUaGVyZSBpcyBkYXRhIFxuXHRcdFx0XHQmJiAodG1wQnJhY2tldFN0b3BJbmRleCAtIHRtcEJyYWNrZXRTdGFydEluZGV4ID4gMCkpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB0bXBCb3hlZFByb3BlcnR5TmFtZSA9IHRtcFN1Yk9iamVjdE5hbWUuc3Vic3RyaW5nKDAsIHRtcEJyYWNrZXRTdGFydEluZGV4KS50cmltKCk7XG5cblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlSZWZlcmVuY2UgPSB0bXBTdWJPYmplY3ROYW1lLnN1YnN0cmluZyh0bXBCcmFja2V0U3RhcnRJbmRleCsxLCB0bXBCcmFja2V0U3RvcEluZGV4KS50cmltKCk7XG5cblx0XHRcdFx0bGV0IHRtcEJveGVkUHJvcGVydHlOdW1iZXIgPSBwYXJzZUludCh0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlLCAxMCk7XG5cblx0XHRcdFx0Ly8gR3VhcmQ6IElmIHRoZSByZWZlcnJhbnQgaXMgYSBudW1iZXIgYW5kIHRoZSBib3hlZCBwcm9wZXJ0eSBpcyBub3QgYW4gYXJyYXksIG9yIHZpY2UgdmVyc2EsIHJldHVybiB1bmRlZmluZWQuXG5cdFx0XHRcdC8vICAgICAgICBUaGlzIHNlZW1zIGNvbmZ1c2luZyB0byBtZSBhdCBmaXJzdCByZWFkLCBzbyBleHBsYWluYXRpb246XG5cdFx0XHRcdC8vICAgICAgICBJcyB0aGUgQm94ZWQgT2JqZWN0IGFuIEFycmF5PyAgVFJVRVxuXHRcdFx0XHQvLyAgICAgICAgQW5kIGlzIHRoZSBSZWZlcmVuY2UgaW5zaWRlIHRoZSBib3hlZCBPYmplY3Qgbm90IGEgbnVtYmVyPyBUUlVFXG5cdFx0XHRcdC8vICAgICAgICAtLT4gIFNvIHdoZW4gdGhlc2UgYXJlIGluIGFncmVlbWVudCwgaXQncyBhbiBpbXBvc3NpYmxlIGFjY2VzcyBzdGF0ZVxuXHRcdFx0XHQvLyBUaGlzIGNvdWxkIGJlIGEgZmFpbHVyZSBpbiB0aGUgcmVjdXJzaW9uIGNoYWluIGJlY2F1c2UgdGhleSBwYXNzZWQgc29tZXRoaW5nIGxpa2UgdGhpcyBpbjpcblx0XHRcdFx0Ly8gICAgU3R1ZGVudERhdGEuU2VjdGlvbnMuQWxnZWJyYS5TdHVkZW50c1sxXS5UYXJkeVxuXHRcdFx0XHQvLyAgICAgICBCVVRcblx0XHRcdFx0Ly8gICAgICAgICBTdHVkZW50RGF0YS5TZWN0aW9ucy5BbGdlYnJhLlN0dWRlbnRzIGlzIGFuIG9iamVjdCwgc28gdGhlIFsxXS5UYXJkeSBpcyBub3QgcG9zc2libGUgdG8gYWNjZXNzXG5cdFx0XHRcdC8vIFRoaXMgY291bGQgYmUgYSBmYWlsdXJlIGluIHRoZSByZWN1cnNpb24gY2hhaW4gYmVjYXVzZSB0aGV5IHBhc3NlZCBzb21ldGhpbmcgbGlrZSB0aGlzIGluOlxuXHRcdFx0XHQvLyAgICBTdHVkZW50RGF0YS5TZWN0aW9ucy5BbGdlYnJhLlN0dWRlbnRzW1wiSmFuZURvZVwiXS5HcmFkZVxuXHRcdFx0XHQvLyAgICAgICBCVVRcblx0XHRcdFx0Ly8gICAgICAgICBTdHVkZW50RGF0YS5TZWN0aW9ucy5BbGdlYnJhLlN0dWRlbnRzIGlzIGFuIGFycmF5LCBzbyB0aGUgW1wiSmFuZURvZVwiXS5HcmFkZSBpcyBub3QgcG9zc2libGUgdG8gYWNjZXNzXG5cdFx0XHRcdC8vIFRPRE86IFNob3VsZCB0aGlzIGJlIGFuIGVycm9yIG9yIHNvbWV0aGluZz8gIFNob3VsZCB3ZSBrZWVwIGEgbG9nIG9mIGZhaWx1cmVzIGxpa2UgdGhpcz9cblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocE9iamVjdFt0bXBCb3hlZFByb3BlcnR5TmFtZV0pID09IGlzTmFOKHRtcEJveGVkUHJvcGVydHlOdW1iZXIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9UaGlzIGlzIGEgYnJhY2tldGVkIHZhbHVlXG5cdFx0XHRcdC8vICAgIDQpIElmIHRoZSBtaWRkbGUgcGFydCBpcyAqb25seSogYSBudW1iZXIgKG5vIHNpbmdsZSwgZG91YmxlIG9yIGJhY2t0aWNrIHF1b3RlcykgaXQgaXMgYW4gYXJyYXkgZWxlbWVudCxcblx0XHRcdFx0Ly8gICAgICAgb3RoZXJ3aXNlIHdlIHdpbGwgdHJ5IHRvIHJlYXQgaXQgYXMgYSBkeW5hbWljIG9iamVjdCBwcm9wZXJ0eS5cblx0XHRcdFx0aWYgKGlzTmFOKHRtcEJveGVkUHJvcGVydHlOdW1iZXIpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gVGhpcyBpc24ndCBhIG51bWJlciAuLi4gbGV0J3MgdHJlYXQgaXQgYXMgYSBkeW5hbm1pYyBvYmplY3QgcHJvcGVydHkuXG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycygnXCInLCB0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlKTtcblx0XHRcdFx0XHR0bXBCb3hlZFByb3BlcnR5UmVmZXJlbmNlID0gdGhpcy5jbGVhbldyYXBDaGFyYWN0ZXJzKCdgJywgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cdFx0XHRcdFx0dG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSA9IHRoaXMuY2xlYW5XcmFwQ2hhcmFjdGVycyhcIidcIiwgdG1wQm94ZWRQcm9wZXJ0eVJlZmVyZW5jZSk7XG5cblx0XHRcdFx0XHQvLyBSZWN1cnNlIGRpcmVjdGx5IGludG8gdGhlIHN1Ym9iamVjdFxuXHRcdFx0XHRcdHJldHVybiB0aGlzLnNldFZhbHVlQXRBZGRyZXNzKHBPYmplY3RbdG1wQm94ZWRQcm9wZXJ0eU5hbWVdW3RtcEJveGVkUHJvcGVydHlSZWZlcmVuY2VdLCB0bXBOZXdBZGRyZXNzLCBwVmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIFdlIHBhcnNlZCBhIHZhbGlkIG51bWJlciBvdXQgb2YgdGhlIGJveGVkIHByb3BlcnR5IG5hbWUsIHNvIHJlY3Vyc2UgaW50byB0aGUgYXJyYXlcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRWYWx1ZUF0QWRkcmVzcyhwT2JqZWN0W3RtcEJveGVkUHJvcGVydHlOYW1lXVt0bXBCb3hlZFByb3BlcnR5TnVtYmVyXSwgdG1wTmV3QWRkcmVzcywgcFZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiB0aGVyZSBpcyBhbiBvYmplY3QgcHJvcGVydHkgYWxyZWFkeSBuYW1lZCBmb3IgdGhlIHN1YiBvYmplY3QsIGJ1dCBpdCBpc24ndCBhbiBvYmplY3Rcblx0XHRcdC8vIHRoZW4gdGhlIHN5c3RlbSBjYW4ndCBzZXQgdGhlIHZhbHVlIGluIHRoZXJlLiAgRXJyb3IgYW5kIGFib3J0IVxuXHRcdFx0aWYgKHBPYmplY3QuaGFzT3duUHJvcGVydHkodG1wU3ViT2JqZWN0TmFtZSkgJiYgdHlwZW9mKHBPYmplY3RbdG1wU3ViT2JqZWN0TmFtZV0pICE9PSAnb2JqZWN0Jylcblx0XHRcdHtcblx0XHRcdFx0aWYgKCFwT2JqZWN0Lmhhc093blByb3BlcnR5KCdfX0VSUk9SJykpXG5cdFx0XHRcdFx0cE9iamVjdFsnX19FUlJPUiddID0ge307XG5cdFx0XHRcdC8vIFB1dCBpdCBpbiBhbiBlcnJvciBvYmplY3Qgc28gZGF0YSBpc24ndCBsb3N0XG5cdFx0XHRcdHBPYmplY3RbJ19fRVJST1InXVtwQWRkcmVzc10gPSBwVmFsdWU7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHBPYmplY3QuaGFzT3duUHJvcGVydHkodG1wU3ViT2JqZWN0TmFtZSkpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYSBzdWJvYmplY3QgcGFzcyB0aGF0IHRvIHRoZSByZWN1cnNpdmUgdGhpbmd5XG5cdFx0XHRcdHJldHVybiB0aGlzLnNldFZhbHVlQXRBZGRyZXNzKHBPYmplY3RbdG1wU3ViT2JqZWN0TmFtZV0sIHRtcE5ld0FkZHJlc3MsIHBWYWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdC8vIENyZWF0ZSBhIHN1Ym9iamVjdCBhbmQgdGhlbiBwYXNzIHRoYXRcblx0XHRcdFx0cE9iamVjdFt0bXBTdWJPYmplY3ROYW1lXSA9IHt9O1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRWYWx1ZUF0QWRkcmVzcyhwT2JqZWN0W3RtcFN1Yk9iamVjdE5hbWVdLCB0bXBOZXdBZGRyZXNzLCBwVmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYW55ZmVzdE9iamVjdEFkZHJlc3NSZXNvbHZlcjsiLCIvKipcbiogQGxpY2Vuc2UgTUlUXG4qIEBhdXRob3IgPHN0ZXZlbkB2ZWxvem8uY29tPlxuKi9cbmxldCBsaWJTaW1wbGVMb2cgPSByZXF1aXJlKCcuL01hbnlmZXN0LUxvZ1RvQ29uc29sZS5qcycpO1xuXG4vKipcbiogU2NoZW1hIE1hbmlwdWxhdGlvbiBGdW5jdGlvbnNcbipcbiogQGNsYXNzIE1hbnlmZXN0U2NoZW1hTWFuaXB1bGF0aW9uXG4qL1xuY2xhc3MgTWFueWZlc3RTY2hlbWFNYW5pcHVsYXRpb25cbntcblx0Y29uc3RydWN0b3IocEluZm9Mb2csIHBFcnJvckxvZylcblx0e1xuXHRcdC8vIFdpcmUgaW4gbG9nZ2luZ1xuXHRcdHRoaXMubG9nSW5mbyA9ICh0eXBlb2YocEluZm9Mb2cpID09PSAnZnVuY3Rpb24nKSA/IHBJbmZvTG9nIDogbGliU2ltcGxlTG9nO1xuXHRcdHRoaXMubG9nRXJyb3IgPSAodHlwZW9mKHBFcnJvckxvZykgPT09ICdmdW5jdGlvbicpID8gcEVycm9yTG9nIDogbGliU2ltcGxlTG9nO1xuXHR9XG5cbiAgICAvLyBUaGlzIHRyYW5zbGF0ZXMgdGhlIGRlZmF1bHQgYWRkcmVzcyBtYXBwaW5ncyB0byBzb21ldGhpbmcgZGlmZmVyZW50LlxuICAgIC8vXG4gICAgLy8gRm9yIGluc3RhbmNlIHlvdSBjYW4gcGFzcyBpbiBtYW55ZmVzdCBzY2hlbWEgZGVzY3JpcHRvciBvYmplY3Q6XG4gICAgLy8gXHR7XG5cdC8vXHQgIFwiQWRkcmVzcy5PZi5hXCI6IHsgXCJIYXNoXCI6IFwiYVwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9LFxuXHQvL1x0ICBcIkFkZHJlc3MuT2YuYlwiOiB7IFwiSGFzaFwiOiBcImJcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHQvLyAgfVxuICAgIC8vXG4gICAgLy9cbiAgICAvLyBBbmQgdGhlbiBhbiBhZGRyZXNzIG1hcHBpbmcgKGJhc2ljYWxseSBhIEhhc2gtPkFkZHJlc3MgbWFwKVxuICAgIC8vICB7XG4gICAgLy8gICAgXCJhXCI6IFwiTmV3LkFkZHJlc3MuT2YuYVwiLFxuICAgIC8vICAgIFwiYlwiOiBcIk5ldy5BZGRyZXNzLk9mLmJcIiAgXG4gICAgLy8gIH1cbiAgICAvL1xuICAgIC8vIE5PVEU6IFRoaXMgbXV0YXRlcyB0aGUgc2NoZW1hIG9iamVjdCBwZXJtYW5lbnRseSwgYWx0ZXJpbmcgdGhlIGJhc2UgaGFzaC5cbiAgICAvLyAgICAgICBJZiB0aGVyZSBpcyBhIGNvbGxpc2lvbiB3aXRoIGFuIGV4aXN0aW5nIGFkZHJlc3MsIGl0IGNhbiBsZWFkIHRvIG92ZXJ3cml0ZXMuXG4gICAgLy8gVE9ETzogRGlzY3VzcyB3aGF0IHNob3VsZCBoYXBwZW4gb24gY29sbGlzaW9ucy5cblx0cmVzb2x2ZUFkZHJlc3NNYXBwaW5ncyhwTWFueWZlc3RTY2hlbWFEZXNjcmlwdG9ycywgcEFkZHJlc3NNYXBwaW5nKVxuXHR7XG5cdFx0aWYgKHR5cGVvZihwTWFueWZlc3RTY2hlbWFEZXNjcmlwdG9ycykgIT0gJ29iamVjdCcpXG5cdFx0e1xuXHRcdFx0dGhpcy5sb2dFcnJvcihgQXR0ZW1wdGVkIHRvIHJlc29sdmUgYWRkcmVzcyBtYXBwaW5nIGJ1dCB0aGUgZGVzY3JpcHRvciB3YXMgbm90IGFuIG9iamVjdC5gKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mKHBBZGRyZXNzTWFwcGluZykgIT0gJ29iamVjdCcpXG5cdFx0e1xuXHRcdFx0Ly8gTm8gbWFwcGluZ3Mgd2VyZSBwYXNzZWQgaW5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIEdldCB0aGUgYXJyYXlzIG9mIGJvdGggdGhlIHNjaGVtYSBkZWZpbml0aW9uIGFuZCB0aGUgaGFzaCBtYXBwaW5nXG5cdFx0bGV0IHRtcE1hbnlmZXN0QWRkcmVzc2VzID0gT2JqZWN0LmtleXMocE1hbnlmZXN0U2NoZW1hRGVzY3JpcHRvcnMpO1xuXHRcdGxldCB0bXBIYXNoTWFwcGluZyA9IHt9O1xuXHRcdHRtcE1hbnlmZXN0QWRkcmVzc2VzLmZvckVhY2goXG5cdFx0XHQocEFkZHJlc3MpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGlmIChwTWFueWZlc3RTY2hlbWFEZXNjcmlwdG9yc1twQWRkcmVzc10uaGFzT3duUHJvcGVydHkoJ0hhc2gnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRtcEhhc2hNYXBwaW5nW3BNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzW3BBZGRyZXNzXS5IYXNoXSA9IHBBZGRyZXNzO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdGxldCB0bXBBZGRyZXNzTWFwcGluZ1NldCA9IE9iamVjdC5rZXlzKHBBZGRyZXNzTWFwcGluZyk7XG5cblx0XHR0bXBBZGRyZXNzTWFwcGluZ1NldC5mb3JFYWNoKFxuXHRcdFx0KHBJbnB1dEFkZHJlc3MpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGxldCB0bXBOZXdEZXNjcmlwdG9yQWRkcmVzcyA9IHBBZGRyZXNzTWFwcGluZ1twSW5wdXRBZGRyZXNzXTtcblx0XHRcdFx0bGV0IHRtcE9sZERlc2NyaXB0b3JBZGRyZXNzID0gZmFsc2U7XG5cdFx0XHRcdGxldCB0bXBEZXNjcmlwdG9yID0gZmFsc2U7XG5cblx0XHRcdFx0Ly8gU2VlIGlmIHRoZXJlIGlzIGEgbWF0Y2hpbmcgZGVzY3JpcHRvciBlaXRoZXIgYnkgQWRkcmVzcyBkaXJlY3RseSBvciBIYXNoXG5cdFx0XHRcdGlmIChwTWFueWZlc3RTY2hlbWFEZXNjcmlwdG9ycy5oYXNPd25Qcm9wZXJ0eShwSW5wdXRBZGRyZXNzKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRtcE9sZERlc2NyaXB0b3JBZGRyZXNzID0gcElucHV0QWRkcmVzcztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICh0bXBIYXNoTWFwcGluZy5oYXNPd25Qcm9wZXJ0eShwSW5wdXRBZGRyZXNzKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRtcE9sZERlc2NyaXB0b3JBZGRyZXNzID0gdG1wSGFzaE1hcHBpbmdbcElucHV0QWRkcmVzc107XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJZiB0aGVyZSB3YXMgYSBtYXRjaGluZyBkZXNjcmlwdG9yIGluIHRoZSBtYW5pZmVzdCwgc3RvcmUgaXQgaW4gdGhlIHRlbXBvcmFyeSBkZXNjcmlwdG9yXG5cdFx0XHRcdGlmICh0bXBPbGREZXNjcmlwdG9yQWRkcmVzcylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRtcERlc2NyaXB0b3IgPSBwTWFueWZlc3RTY2hlbWFEZXNjcmlwdG9yc1t0bXBPbGREZXNjcmlwdG9yQWRkcmVzc107XG5cdFx0XHRcdFx0ZGVsZXRlIHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzW3RtcE9sZERlc2NyaXB0b3JBZGRyZXNzXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvLyBDcmVhdGUgYSBuZXcgZGVzY3JpcHRvciEgIE1hcCBpdCB0byB0aGUgaW5wdXQgYWRkcmVzcy5cblx0XHRcdFx0XHR0bXBEZXNjcmlwdG9yID0geyBIYXNoOnBJbnB1dEFkZHJlc3MgfTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIE5vdyByZS1hZGQgdGhlIGRlc2NyaXB0b3IgdG8gdGhlIG1hbnlmZXN0IHNjaGVtYVxuXHRcdFx0XHRwTWFueWZlc3RTY2hlbWFEZXNjcmlwdG9yc1t0bXBOZXdEZXNjcmlwdG9yQWRkcmVzc10gPSB0bXBEZXNjcmlwdG9yO1xuXHRcdFx0fSk7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHNhZmVSZXNvbHZlQWRkcmVzc01hcHBpbmdzKHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzLCBwQWRkcmVzc01hcHBpbmcpXG5cdHtcblx0XHQvLyBUaGlzIHJldHVybnMgdGhlIGRlc2NyaXB0b3JzIGFzIGEgbmV3IG9iamVjdCwgc2FmZWx5IHJlbWFwcGluZyB3aXRob3V0IG11dGF0aW5nIHRoZSBvcmlnaW5hbCBzY2hlbWEgRGVzY3JpcHRvcnNcblx0XHRsZXQgdG1wTWFueWZlc3RTY2hlbWFEZXNjcmlwdG9ycyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocE1hbnlmZXN0U2NoZW1hRGVzY3JpcHRvcnMpKTtcblx0XHR0aGlzLnJlc29sdmVBZGRyZXNzTWFwcGluZ3ModG1wTWFueWZlc3RTY2hlbWFEZXNjcmlwdG9ycywgcEFkZHJlc3NNYXBwaW5nKTtcblx0XHRyZXR1cm4gdG1wTWFueWZlc3RTY2hlbWFEZXNjcmlwdG9ycztcblx0fVxuXG5cdG1lcmdlQWRkcmVzc01hcHBpbmdzKHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzRGVzdGluYXRpb24sIHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzU291cmNlKVxuXHR7XG5cdFx0aWYgKCh0eXBlb2YocE1hbnlmZXN0U2NoZW1hRGVzY3JpcHRvcnNTb3VyY2UpICE9ICdvYmplY3QnKSB8fCAodHlwZW9mKHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzRGVzdGluYXRpb24pICE9ICdvYmplY3QnKSlcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ0Vycm9yKGBBdHRlbXB0ZWQgdG8gbWVyZ2UgdHdvIHNjaGVtYSBkZXNjcmlwdG9ycyBidXQgYm90aCB3ZXJlIG5vdCBvYmplY3RzLmApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGxldCB0bXBTb3VyY2UgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzU291cmNlKSk7XG5cdFx0bGV0IHRtcE5ld01hbnlmZXN0U2NoZW1hRGVzY3JpcHRvcnMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHBNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzRGVzdGluYXRpb24pKTtcblxuXHRcdC8vIFRoZSBmaXJzdCBwYXNzZWQtaW4gc2V0IG9mIGRlc2NyaXB0b3JzIHRha2VzIHByZWNlZGVuY2UuXG5cdFx0bGV0IHRtcERlc2NyaXB0b3JBZGRyZXNzZXMgPSBPYmplY3Qua2V5cyh0bXBTb3VyY2UpO1xuXG5cdFx0dG1wRGVzY3JpcHRvckFkZHJlc3Nlcy5mb3JFYWNoKFxuXHRcdFx0KHBEZXNjcmlwdG9yQWRkcmVzcykgPT4gXG5cdFx0XHR7XG5cdFx0XHRcdGlmICghdG1wTmV3TWFueWZlc3RTY2hlbWFEZXNjcmlwdG9ycy5oYXNPd25Qcm9wZXJ0eShwRGVzY3JpcHRvckFkZHJlc3MpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dG1wTmV3TWFueWZlc3RTY2hlbWFEZXNjcmlwdG9yc1twRGVzY3JpcHRvckFkZHJlc3NdID0gdG1wU291cmNlW3BEZXNjcmlwdG9yQWRkcmVzc107XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFxuXHRcdHJldHVybiB0bXBOZXdNYW55ZmVzdFNjaGVtYURlc2NyaXB0b3JzO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWFueWZlc3RTY2hlbWFNYW5pcHVsYXRpb247IiwiLyoqXG4qIEBsaWNlbnNlIE1JVFxuKiBAYXV0aG9yIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5sZXQgbGliU2ltcGxlTG9nID0gcmVxdWlyZSgnLi9NYW55ZmVzdC1Mb2dUb0NvbnNvbGUuanMnKTtcbmxldCBsaWJPYmplY3RBZGRyZXNzUmVzb2x2ZXIgPSByZXF1aXJlKCcuL01hbnlmZXN0LU9iamVjdEFkZHJlc3NSZXNvbHZlci5qcycpO1xubGV0IGxpYkhhc2hUcmFuc2xhdGlvbiA9IHJlcXVpcmUoJy4vTWFueWZlc3QtSGFzaFRyYW5zbGF0aW9uLmpzJyk7XG5sZXQgbGliU2NoZW1hTWFuaXB1bGF0aW9uID0gcmVxdWlyZSgnLi9NYW55ZmVzdC1TY2hlbWFNYW5pcHVsYXRpb24uanMnKTtcblxuLyoqXG4qIE1hbnlmZXN0IG9iamVjdCBhZGRyZXNzLWJhc2VkIGRlc2NyaXB0aW9ucyBhbmQgbWFuaXB1bGF0aW9ucy5cbipcbiogQGNsYXNzIE1hbnlmZXN0XG4qL1xuY2xhc3MgTWFueWZlc3Rcbntcblx0Y29uc3RydWN0b3IocE1hbmlmZXN0LCBwSW5mb0xvZywgcEVycm9yTG9nLCBwT3B0aW9ucylcblx0e1xuXHRcdC8vIFdpcmUgaW4gbG9nZ2luZ1xuXHRcdHRoaXMubG9nSW5mbyA9ICh0eXBlb2YocEluZm9Mb2cpID09PSAnZnVuY3Rpb24nKSA/IHBJbmZvTG9nIDogbGliU2ltcGxlTG9nO1xuXHRcdHRoaXMubG9nRXJyb3IgPSAodHlwZW9mKHBFcnJvckxvZykgPT09ICdmdW5jdGlvbicpID8gcEVycm9yTG9nIDogbGliU2ltcGxlTG9nO1xuXG5cdFx0Ly8gQ3JlYXRlIGFuIG9iamVjdCBhZGRyZXNzIHJlc29sdmVyIGFuZCBtYXAgaW4gdGhlIGZ1bmN0aW9uc1xuXHRcdHRoaXMub2JqZWN0QWRkcmVzc1Jlc29sdmVyID0gbmV3IGxpYk9iamVjdEFkZHJlc3NSZXNvbHZlcih0aGlzLmxvZ0luZm8sIHRoaXMubG9nRXJyb3IpO1xuXG5cdFx0dGhpcy5vcHRpb25zID0gKFxuXHRcdFx0e1xuXHRcdFx0XHRzdHJpY3Q6IGZhbHNlLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWVzOiBcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcIlN0cmluZ1wiOiBcIlwiLFxuXHRcdFx0XHRcdFx0XCJOdW1iZXJcIjogMCxcblx0XHRcdFx0XHRcdFwiRmxvYXRcIjogMC4wLFxuXHRcdFx0XHRcdFx0XCJJbnRlZ2VyXCI6IDAsXG5cdFx0XHRcdFx0XHRcIkJvb2xlYW5cIjogZmFsc2UsXG5cdFx0XHRcdFx0XHRcIkJpbmFyeVwiOiAwLFxuXHRcdFx0XHRcdFx0XCJEYXRlVGltZVwiOiAwLFxuXHRcdFx0XHRcdFx0XCJBcnJheVwiOiBbXSxcblx0XHRcdFx0XHRcdFwiT2JqZWN0XCI6IHt9LFxuXHRcdFx0XHRcdFx0XCJOdWxsXCI6IG51bGxcblx0XHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdHRoaXMuc2NvcGUgPSB1bmRlZmluZWQ7XG5cdFx0dGhpcy5lbGVtZW50QWRkcmVzc2VzID0gdW5kZWZpbmVkO1xuXHRcdHRoaXMuZWxlbWVudEhhc2hlcyA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLmVsZW1lbnREZXNjcmlwdG9ycyA9IHVuZGVmaW5lZDtcblxuXHRcdHRoaXMucmVzZXQoKTtcblxuXHRcdGlmICh0eXBlb2YocE1hbmlmZXN0KSA9PT0gJ29iamVjdCcpXG5cdFx0e1xuXHRcdFx0dGhpcy5sb2FkTWFuaWZlc3QocE1hbmlmZXN0KTtcblx0XHR9XG5cblx0XHR0aGlzLnNjaGVtYU1hbmlwdWxhdGlvbnMgPSBuZXcgbGliU2NoZW1hTWFuaXB1bGF0aW9uKHRoaXMubG9nSW5mbywgdGhpcy5sb2dFcnJvcik7XG5cblx0XHR0aGlzLmhhc2hUcmFuc2xhdGlvbnMgPSBuZXcgbGliSGFzaFRyYW5zbGF0aW9uKHRoaXMubG9nSW5mbywgdGhpcy5sb2dFcnJvcik7XG5cdH1cblxuXHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHQgKiBTY2hlbWEgTWFuaWZlc3QgTG9hZGluZywgUmVhZGluZywgTWFuaXB1bGF0aW9uIGFuZCBTZXJpYWxpemF0aW9uIEZ1bmN0aW9uc1xuXHQgKi9cblxuXHQvLyBSZXNldCBjcml0aWNhbCBtYW5pZmVzdCBwcm9wZXJ0aWVzXG5cdHJlc2V0KClcblx0e1xuXHRcdHRoaXMuc2NvcGUgPSAnREVGQVVMVCc7XG5cdFx0dGhpcy5lbGVtZW50QWRkcmVzc2VzID0gW107XG5cdFx0dGhpcy5lbGVtZW50SGFzaGVzID0ge307XG5cdFx0dGhpcy5lbGVtZW50RGVzY3JpcHRvcnMgPSB7fTtcblx0fVxuXG5cdGNsb25lKClcblx0e1xuXHRcdC8vIE1ha2UgYSBjb3B5IG9mIHRoZSBvcHRpb25zIGluLXBsYWNlXG5cdFx0bGV0IHRtcE5ld09wdGlvbnMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMub3B0aW9ucykpO1xuXG5cdFx0bGV0IHRtcE5ld01hbnlmZXN0ID0gbmV3IE1hbnlmZXN0KHRoaXMuZ2V0TWFuaWZlc3QoKSwgdGhpcy5sb2dJbmZvLCB0aGlzLmxvZ0Vycm9yLCB0bXBOZXdPcHRpb25zKTtcblxuXHRcdC8vIEltcG9ydCB0aGUgaGFzaCB0cmFuc2xhdGlvbnNcblx0XHR0bXBOZXdNYW55ZmVzdC5oYXNoVHJhbnNsYXRpb25zLmFkZFRyYW5zbGF0aW9uKHRoaXMuaGFzaFRyYW5zbGF0aW9ucy50cmFuc2xhdGlvblRhYmxlKTtcblxuXHRcdHJldHVybiB0bXBOZXdNYW55ZmVzdDtcblx0fVxuXG5cdC8vIERlc2VyaWFsaXplIGEgTWFuaWZlc3QgZnJvbSBhIHN0cmluZ1xuXHRkZXNlcmlhbGl6ZShwTWFuaWZlc3RTdHJpbmcpXG5cdHtcblx0XHQvLyBUT0RPOiBBZGQgZ3VhcmRzIGZvciBiYWQgbWFuaWZlc3Qgc3RyaW5nXG5cdFx0cmV0dXJuIHRoaXMubG9hZE1hbmlmZXN0KEpTT04ucGFyc2UocE1hbmlmZXN0U3RyaW5nKSk7XG5cdH1cblxuXHQvLyBMb2FkIGEgbWFuaWZlc3QgZnJvbSBhbiBvYmplY3Rcblx0bG9hZE1hbmlmZXN0KHBNYW5pZmVzdClcblx0e1xuXHRcdGlmICh0eXBlb2YocE1hbmlmZXN0KSAhPT0gJ29iamVjdCcpXG5cdFx0e1xuXHRcdFx0dGhpcy5sb2dFcnJvcihgKCR7dGhpcy5zY29wZX0pIEVycm9yIGxvYWRpbmcgbWFuaWZlc3Q7IGV4cGVjdGluZyBhbiBvYmplY3QgYnV0IHBhcmFtZXRlciB3YXMgdHlwZSAke3R5cGVvZihwTWFuaWZlc3QpfS5gKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAocE1hbmlmZXN0Lmhhc093blByb3BlcnR5KCdTY29wZScpKVxuXHRcdHtcblx0XHRcdGlmICh0eXBlb2YocE1hbmlmZXN0LlNjb3BlKSA9PT0gJ3N0cmluZycpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuc2NvcGUgPSBwTWFuaWZlc3QuU2NvcGU7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMubG9nRXJyb3IoYCgke3RoaXMuc2NvcGV9KSBFcnJvciBsb2FkaW5nIHNjb3BlIGZyb20gbWFuaWZlc3Q7IGV4cGVjdGluZyBhIHN0cmluZyBidXQgcHJvcGVydHkgd2FzIHR5cGUgJHt0eXBlb2YocE1hbmlmZXN0LlNjb3BlKX0uYCwgcE1hbmlmZXN0KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMubG9nRXJyb3IoYCgke3RoaXMuc2NvcGV9KSBFcnJvciBsb2FkaW5nIHNjb3BlIGZyb20gbWFuaWZlc3Qgb2JqZWN0LiAgUHJvcGVydHkgXCJTY29wZVwiIGRvZXMgbm90IGV4aXN0IGluIHRoZSByb290IG9mIHRoZSBvYmplY3QuYCwgcE1hbmlmZXN0KTtcblx0XHR9XG5cblx0XHRpZiAocE1hbmlmZXN0Lmhhc093blByb3BlcnR5KCdEZXNjcmlwdG9ycycpKVxuXHRcdHtcblx0XHRcdGlmICh0eXBlb2YocE1hbmlmZXN0LkRlc2NyaXB0b3JzKSA9PT0gJ29iamVjdCcpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB0bXBEZXNjcmlwdGlvbkFkZHJlc3NlcyA9IE9iamVjdC5rZXlzKHBNYW5pZmVzdC5EZXNjcmlwdG9ycyk7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdG1wRGVzY3JpcHRpb25BZGRyZXNzZXMubGVuZ3RoOyBpKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLmFkZERlc2NyaXB0b3IodG1wRGVzY3JpcHRpb25BZGRyZXNzZXNbaV0sIHBNYW5pZmVzdC5EZXNjcmlwdG9yc1t0bXBEZXNjcmlwdGlvbkFkZHJlc3Nlc1tpXV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMubG9nRXJyb3IoYCgke3RoaXMuc2NvcGV9KSBFcnJvciBsb2FkaW5nIGRlc2NyaXB0aW9uIG9iamVjdCBmcm9tIG1hbmlmZXN0IG9iamVjdC4gIEV4cGVjdGluZyBhbiBvYmplY3QgaW4gJ01hbmlmZXN0LkRlc2NyaXB0b3JzJyBidXQgdGhlIHByb3BlcnR5IHdhcyB0eXBlICR7dHlwZW9mKHBNYW5pZmVzdC5EZXNjcmlwdG9ycyl9LmAsIHBNYW5pZmVzdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ0Vycm9yKGAoJHt0aGlzLnNjb3BlfSkgRXJyb3IgbG9hZGluZyBvYmplY3QgZGVzY3JpcHRpb24gZnJvbSBtYW5pZmVzdCBvYmplY3QuICBQcm9wZXJ0eSBcIkRlc2NyaXB0b3JzXCIgZG9lcyBub3QgZXhpc3QgaW4gdGhlIHJvb3Qgb2YgdGhlIE1hbmlmZXN0IG9iamVjdC5gLCBwTWFuaWZlc3QpO1xuXHRcdH1cblx0fVxuXG5cdC8vIFNlcmlhbGl6ZSB0aGUgTWFuaWZlc3QgdG8gYSBzdHJpbmdcblx0Ly8gVE9ETzogU2hvdWxkIHRoaXMgYWxzbyBzZXJpYWxpemUgdGhlIHRyYW5zbGF0aW9uIHRhYmxlP1xuXHRzZXJpYWxpemUoKVxuXHR7XG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuZ2V0TWFuaWZlc3QoKSk7XG5cdH1cblxuXHRnZXRNYW5pZmVzdCgpXG5cdHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0e1xuXHRcdFx0XHRTY29wZTogdGhpcy5zY29wZSxcblx0XHRcdFx0RGVzY3JpcHRvcnM6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5lbGVtZW50RGVzY3JpcHRvcnMpKVxuXHRcdFx0fSk7XG5cdH1cblxuXHQvLyBBZGQgYSBkZXNjcmlwdG9yIHRvIHRoZSBtYW5pZmVzdFxuXHRhZGREZXNjcmlwdG9yKHBBZGRyZXNzLCBwRGVzY3JpcHRvcilcblx0e1xuXHRcdGlmICh0eXBlb2YocERlc2NyaXB0b3IpID09PSAnb2JqZWN0Jylcblx0XHR7XG5cdFx0XHQvLyBBZGQgdGhlIEFkZHJlc3MgaW50byB0aGUgRGVzY3JpcHRvciBpZiBpdCBkb2Vzbid0IGV4aXN0OlxuXHRcdFx0aWYgKCFwRGVzY3JpcHRvci5oYXNPd25Qcm9wZXJ0eSgnQWRkcmVzcycpKVxuXHRcdFx0e1xuXHRcdFx0XHRwRGVzY3JpcHRvci5BZGRyZXNzID0gcEFkZHJlc3M7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghdGhpcy5lbGVtZW50RGVzY3JpcHRvcnMuaGFzT3duUHJvcGVydHkocEFkZHJlc3MpKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmVsZW1lbnRBZGRyZXNzZXMucHVzaChwQWRkcmVzcyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFkZCB0aGUgZWxlbWVudCBkZXNjcmlwdG9yIHRvIHRoZSBzY2hlbWFcblx0XHRcdHRoaXMuZWxlbWVudERlc2NyaXB0b3JzW3BBZGRyZXNzXSA9IHBEZXNjcmlwdG9yO1xuXG5cdFx0XHQvLyBBbHdheXMgYWRkIHRoZSBhZGRyZXNzIGFzIGEgaGFzaFxuXHRcdFx0dGhpcy5lbGVtZW50SGFzaGVzW3BBZGRyZXNzXSA9IHBBZGRyZXNzO1xuXG5cdFx0XHRpZiAocERlc2NyaXB0b3IuaGFzT3duUHJvcGVydHkoJ0hhc2gnKSlcblx0XHRcdHtcblx0XHRcdFx0Ly8gVE9ETzogQ2hlY2sgaWYgdGhpcyBpcyBhIGdvb2QgaWRlYSBvciBub3QuLlxuXHRcdFx0XHQvLyAgICAgICBDb2xsaXNpb25zIGFyZSBib3VuZCB0byBoYXBwZW4gd2l0aCBib3RoIHJlcHJlc2VudGF0aW9ucyBvZiB0aGUgYWRkcmVzcy9oYXNoIGluIGhlcmUgYW5kIGRldmVsb3BlcnMgYmVpbmcgYWJsZSB0byBjcmVhdGUgdGhlaXIgb3duIGhhc2hlcy5cblx0XHRcdFx0dGhpcy5lbGVtZW50SGFzaGVzW3BEZXNjcmlwdG9yLkhhc2hdID0gcEFkZHJlc3M7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHBEZXNjcmlwdG9yLkhhc2ggPSBwQWRkcmVzcztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ0Vycm9yKGAoJHt0aGlzLnNjb3BlfSkgRXJyb3IgbG9hZGluZyBvYmplY3QgZGVzY3JpcHRvciBmb3IgYWRkcmVzcyAnJHtwQWRkcmVzc30nIGZyb20gbWFuaWZlc3Qgb2JqZWN0LiAgRXhwZWN0aW5nIGFuIG9iamVjdCBidXQgcHJvcGVydHkgd2FzIHR5cGUgJHt0eXBlb2YocERlc2NyaXB0b3IpfS5gKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XHRcblx0fVxuXG5cdGdldERlc2NyaXB0b3JCeUhhc2gocEhhc2gpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5nZXREZXNjcmlwdG9yKHRoaXMucmVzb2x2ZUhhc2hBZGRyZXNzKHBIYXNoKSk7XG5cdH1cblxuXHRnZXREZXNjcmlwdG9yKHBBZGRyZXNzKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudERlc2NyaXB0b3JzW3BBZGRyZXNzXTtcblx0fVxuXG5cdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdCAqIEJlZ2lubmluZyBvZiBPYmplY3QgTWFuaXB1bGF0aW9uIChyZWFkICYgd3JpdGUpIEZ1bmN0aW9uc1xuXHQgKi9cblx0Ly8gQ2hlY2sgaWYgYW4gZWxlbWVudCBleGlzdHMgYnkgaXRzIGhhc2hcblx0Y2hlY2tBZGRyZXNzRXhpc3RzQnlIYXNoIChwT2JqZWN0LCBwSGFzaClcblx0e1xuXHRcdHJldHVybiB0aGlzLmNoZWNrQWRkcmVzc0V4aXN0cyhwT2JqZWN0LHRoaXMucmVzb2x2ZUhhc2hBZGRyZXNzKHBIYXNoKSk7XG5cdH1cblxuXHQvLyBDaGVjayBpZiBhbiBlbGVtZW50IGV4aXN0cyBhdCBhbiBhZGRyZXNzXG5cdGNoZWNrQWRkcmVzc0V4aXN0cyAocE9iamVjdCwgcEFkZHJlc3MpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5vYmplY3RBZGRyZXNzUmVzb2x2ZXIuY2hlY2tBZGRyZXNzRXhpc3RzKHBPYmplY3QsIHBBZGRyZXNzKTtcblx0fVxuXG5cdC8vIFR1cm4gYSBoYXNoIGludG8gYW4gYWRkcmVzcywgZmFjdG9yaW5nIGluIHRoZSB0cmFuc2xhdGlvbiB0YWJsZS5cblx0cmVzb2x2ZUhhc2hBZGRyZXNzKHBIYXNoKVxuXHR7XG5cdFx0bGV0IHRtcEFkZHJlc3MgPSB1bmRlZmluZWQ7XG5cblx0XHRsZXQgdG1wSW5FbGVtZW50SGFzaFRhYmxlID0gdGhpcy5lbGVtZW50SGFzaGVzLmhhc093blByb3BlcnR5KHBIYXNoKTtcblx0XHRsZXQgdG1wSW5UcmFuc2xhdGlvblRhYmxlID0gdGhpcy5oYXNoVHJhbnNsYXRpb25zLnRyYW5zbGF0aW9uVGFibGUuaGFzT3duUHJvcGVydHkocEhhc2gpO1xuXG5cdFx0Ly8gVGhlIG1vc3Qgc3RyYWlnaHRmb3J3YXJkOiB0aGUgaGFzaCBleGlzdHMsIG5vIHRyYW5zbGF0aW9ucy5cblx0XHRpZiAodG1wSW5FbGVtZW50SGFzaFRhYmxlICYmICF0bXBJblRyYW5zbGF0aW9uVGFibGUpXG5cdFx0e1xuXHRcdFx0dG1wQWRkcmVzcyA9IHRoaXMuZWxlbWVudEhhc2hlc1twSGFzaF07XG5cdFx0fVxuXHRcdC8vIFRoZXJlIGlzIGEgdHJhbnNsYXRpb24gZnJvbSBvbmUgaGFzaCB0byBhbm90aGVyLCBhbmQsIHRoZSBlbGVtZW50SGFzaGVzIGNvbnRhaW5zIHRoZSBwb2ludGVyIGVuZFxuXHRcdGVsc2UgaWYgKHRtcEluVHJhbnNsYXRpb25UYWJsZSAmJiB0aGlzLmVsZW1lbnRIYXNoZXMuaGFzT3duUHJvcGVydHkodGhpcy5oYXNoVHJhbnNsYXRpb25zLnRyYW5zbGF0ZShwSGFzaCkpKVxuXHRcdHtcblx0XHRcdHRtcEFkZHJlc3MgPSB0aGlzLmVsZW1lbnRIYXNoZXNbdGhpcy5oYXNoVHJhbnNsYXRpb25zLnRyYW5zbGF0ZShwSGFzaCldO1xuXHRcdH1cblx0XHQvLyBVc2UgdGhlIGxldmVsIG9mIGluZGlyZWN0aW9uIG9ubHkgaW4gdGhlIFRyYW5zbGF0aW9uIFRhYmxlIFxuXHRcdGVsc2UgaWYgKHRtcEluVHJhbnNsYXRpb25UYWJsZSlcblx0XHR7XG5cdFx0XHR0bXBBZGRyZXNzID0gdGhpcy5oYXNoVHJhbnNsYXRpb25zLnRyYW5zbGF0ZShwSGFzaCk7XG5cdFx0fVxuXHRcdC8vIEp1c3QgdHJlYXQgdGhlIGhhc2ggYXMgYW4gYWRkcmVzcy5cblx0XHQvLyBUT0RPOiBEaXNjdXNzIHRoaXMgLi4uIGl0IGlzIG1hZ2ljIGJ1dCBjb250cm92ZXJzaWFsXG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRtcEFkZHJlc3MgPSBwSGFzaDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdG1wQWRkcmVzcztcblx0fVxuXG5cdC8vIEdldCB0aGUgdmFsdWUgb2YgYW4gZWxlbWVudCBieSBpdHMgaGFzaFxuXHRnZXRWYWx1ZUJ5SGFzaCAocE9iamVjdCwgcEhhc2gpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5nZXRWYWx1ZUF0QWRkcmVzcyhwT2JqZWN0LCB0aGlzLnJlc29sdmVIYXNoQWRkcmVzcyhwSGFzaCkpO1xuXHR9XG5cblx0Ly8gR2V0IHRoZSB2YWx1ZSBvZiBhbiBlbGVtZW50IGF0IGFuIGFkZHJlc3Ncblx0Z2V0VmFsdWVBdEFkZHJlc3MgKHBPYmplY3QsIHBBZGRyZXNzKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMub2JqZWN0QWRkcmVzc1Jlc29sdmVyLmdldFZhbHVlQXRBZGRyZXNzKHBPYmplY3QsIHBBZGRyZXNzKTtcblx0fVxuXG5cdC8vIFNldCB0aGUgdmFsdWUgb2YgYW4gZWxlbWVudCBieSBpdHMgaGFzaFxuXHRzZXRWYWx1ZUJ5SGFzaChwT2JqZWN0LCBwSGFzaCwgcFZhbHVlKVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuc2V0VmFsdWVBdEFkZHJlc3MocE9iamVjdCwgdGhpcy5yZXNvbHZlSGFzaEFkZHJlc3MocEhhc2gpLCBwVmFsdWUpO1xuXHR9XG5cblxuXHQvLyBTZXQgdGhlIHZhbHVlIG9mIGFuIGVsZW1lbnQgYXQgYW4gYWRkcmVzc1xuXHRzZXRWYWx1ZUF0QWRkcmVzcyAocE9iamVjdCwgcEFkZHJlc3MsIHBWYWx1ZSlcblx0e1xuXHRcdHJldHVybiB0aGlzLm9iamVjdEFkZHJlc3NSZXNvbHZlci5zZXRWYWx1ZUF0QWRkcmVzcyhwT2JqZWN0LCBwQWRkcmVzcywgcFZhbHVlKTtcblx0fVxuXG5cdC8vIFZhbGlkYXRlIHRoZSBjb25zaXN0ZW5jeSBvZiBhbiBvYmplY3QgYWdhaW5zdCB0aGUgc2NoZW1hXG5cdHZhbGlkYXRlKHBPYmplY3QpXG5cdHtcblx0XHRsZXQgdG1wVmFsaWRhdGlvbkRhdGEgPVxuXHRcdHtcblx0XHRcdEVycm9yOiBudWxsLFxuXHRcdFx0RXJyb3JzOiBbXSxcblx0XHRcdE1pc3NpbmdFbGVtZW50czpbXVxuXHRcdH07XG5cblx0XHRpZiAodHlwZW9mKHBPYmplY3QpICE9PSAnb2JqZWN0Jylcblx0XHR7XG5cdFx0XHR0bXBWYWxpZGF0aW9uRGF0YS5FcnJvciA9IHRydWU7XG5cdFx0XHR0bXBWYWxpZGF0aW9uRGF0YS5FcnJvcnMucHVzaChgRXhwZWN0ZWQgcGFzc2VkIGluIG9iamVjdCB0byBiZSB0eXBlIG9iamVjdCBidXQgd2FzIHBhc3NlZCBpbiAke3R5cGVvZihwT2JqZWN0KX1gKTtcblx0XHR9XG5cblx0XHRsZXQgYWRkVmFsaWRhdGlvbkVycm9yID0gKHBBZGRyZXNzLCBwRXJyb3JNZXNzYWdlKSA9PlxuXHRcdHtcblx0XHRcdHRtcFZhbGlkYXRpb25EYXRhLkVycm9yID0gdHJ1ZTtcblx0XHRcdHRtcFZhbGlkYXRpb25EYXRhLkVycm9ycy5wdXNoKGBFbGVtZW50IGF0IGFkZHJlc3MgXCIke3BBZGRyZXNzfVwiICR7cEVycm9yTWVzc2FnZX0uYCk7XG5cdFx0fTtcblxuXHRcdC8vIE5vdyBlbnVtZXJhdGUgdGhyb3VnaCB0aGUgdmFsdWVzIGFuZCBjaGVjayBmb3IgYW5vbWFsaWVzIGJhc2VkIG9uIHRoZSBzY2hlbWFcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZWxlbWVudEFkZHJlc3Nlcy5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHRsZXQgdG1wRGVzY3JpcHRvciA9IHRoaXMuZ2V0RGVzY3JpcHRvcih0aGlzLmVsZW1lbnRBZGRyZXNzZXNbaV0pO1xuXHRcdFx0bGV0IHRtcFZhbHVlID0gdGhpcy5nZXRWYWx1ZUF0QWRkcmVzcyhwT2JqZWN0LCB0bXBEZXNjcmlwdG9yLkFkZHJlc3MpO1xuXG5cdFx0XHRpZiAodHlwZW9mKHRtcFZhbHVlKSA9PSAndW5kZWZpbmVkJylcblx0XHRcdHtcblx0XHRcdFx0Ly8gVGhpcyB3aWxsIHRlY2huaWNhbGx5IG1lYW4gdGhhdCBgT2JqZWN0LlNvbWUuVmFsdWUgPSB1bmRlZmluZWRgIHdpbGwgZW5kIHVwIHNob3dpbmcgYXMgXCJtaXNzaW5nXCJcblx0XHRcdFx0Ly8gVE9ETzogRG8gd2Ugd2FudCB0byBkbyBhIGRpZmZlcmVudCBtZXNzYWdlIGJhc2VkIG9uIGlmIHRoZSBwcm9wZXJ0eSBleGlzdHMgYnV0IGlzIHVuZGVmaW5lZD9cblx0XHRcdFx0dG1wVmFsaWRhdGlvbkRhdGEuTWlzc2luZ0VsZW1lbnRzLnB1c2godG1wRGVzY3JpcHRvci5BZGRyZXNzKTtcblx0XHRcdFx0aWYgKHRtcERlc2NyaXB0b3IuUmVxdWlyZWQgfHwgdGhpcy5vcHRpb25zLnN0cmljdClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFkZFZhbGlkYXRpb25FcnJvcih0bXBEZXNjcmlwdG9yLkFkZHJlc3MsICdpcyBmbGFnZ2VkIFJFUVVJUkVEIGJ1dCBpcyBub3Qgc2V0IGluIHRoZSBvYmplY3QnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBOb3cgc2VlIGlmIHRoZXJlIGlzIGEgZGF0YSB0eXBlIHNwZWNpZmllZCBmb3IgdGhpcyBlbGVtZW50XG5cdFx0XHRpZiAodG1wRGVzY3JpcHRvci5EYXRhVHlwZSlcblx0XHRcdHtcblx0XHRcdFx0bGV0IHRtcEVsZW1lbnRUeXBlID0gdHlwZW9mKHRtcFZhbHVlKTtcblx0XHRcdFx0c3dpdGNoKHRtcERlc2NyaXB0b3IuRGF0YVR5cGUudG9TdHJpbmcoKS50cmltKCkudG9Mb3dlckNhc2UoKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNhc2UgJ3N0cmluZyc6XG5cdFx0XHRcdFx0XHRpZiAodG1wRWxlbWVudFR5cGUgIT0gJ3N0cmluZycpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGFkZFZhbGlkYXRpb25FcnJvcih0bXBEZXNjcmlwdG9yLkFkZHJlc3MsIGBoYXMgYSBEYXRhVHlwZSAke3RtcERlc2NyaXB0b3IuRGF0YVR5cGV9IGJ1dCBpcyBvZiB0aGUgdHlwZSAke3RtcEVsZW1lbnRUeXBlfWApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlICdudW1iZXInOlxuXHRcdFx0XHRcdFx0aWYgKHRtcEVsZW1lbnRUeXBlICE9ICdudW1iZXInKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRhZGRWYWxpZGF0aW9uRXJyb3IodG1wRGVzY3JpcHRvci5BZGRyZXNzLCBgaGFzIGEgRGF0YVR5cGUgJHt0bXBEZXNjcmlwdG9yLkRhdGFUeXBlfSBidXQgaXMgb2YgdGhlIHR5cGUgJHt0bXBFbGVtZW50VHlwZX1gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnaW50ZWdlcic6XG5cdFx0XHRcdFx0XHRpZiAodG1wRWxlbWVudFR5cGUgIT0gJ251bWJlcicpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGFkZFZhbGlkYXRpb25FcnJvcih0bXBEZXNjcmlwdG9yLkFkZHJlc3MsIGBoYXMgYSBEYXRhVHlwZSAke3RtcERlc2NyaXB0b3IuRGF0YVR5cGV9IGJ1dCBpcyBvZiB0aGUgdHlwZSAke3RtcEVsZW1lbnRUeXBlfWApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRsZXQgdG1wVmFsdWVTdHJpbmcgPSB0bXBWYWx1ZS50b1N0cmluZygpO1xuXHRcdFx0XHRcdFx0XHRpZiAodG1wVmFsdWVTdHJpbmcuaW5kZXhPZignLicpID4gLTEpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBJcyB0aGlzIGFuIGVycm9yP1xuXHRcdFx0XHRcdFx0XHRcdGFkZFZhbGlkYXRpb25FcnJvcih0bXBEZXNjcmlwdG9yLkFkZHJlc3MsIGBoYXMgYSBEYXRhVHlwZSAke3RtcERlc2NyaXB0b3IuRGF0YVR5cGV9IGJ1dCBoYXMgYSBkZWNpbWFsIHBvaW50IGluIHRoZSBudW1iZXIuYCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnZmxvYXQnOlxuXHRcdFx0XHRcdFx0aWYgKHRtcEVsZW1lbnRUeXBlICE9ICdudW1iZXInKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRhZGRWYWxpZGF0aW9uRXJyb3IodG1wRGVzY3JpcHRvci5BZGRyZXNzLCBgaGFzIGEgRGF0YVR5cGUgJHt0bXBEZXNjcmlwdG9yLkRhdGFUeXBlfSBidXQgaXMgb2YgdGhlIHR5cGUgJHt0bXBFbGVtZW50VHlwZX1gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAnRGF0ZVRpbWUnOlxuXHRcdFx0XHRcdFx0bGV0IHRtcFZhbHVlRGF0ZSA9IG5ldyBEYXRlKHRtcFZhbHVlKTtcblx0XHRcdFx0XHRcdGlmICh0bXBWYWx1ZURhdGUudG9TdHJpbmcoKSA9PSAnSW52YWxpZCBEYXRlJylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0YWRkVmFsaWRhdGlvbkVycm9yKHRtcERlc2NyaXB0b3IuQWRkcmVzcywgYGhhcyBhIERhdGFUeXBlICR7dG1wRGVzY3JpcHRvci5EYXRhVHlwZX0gYnV0IGlzIG5vdCBwYXJzYWJsZSBhcyBhIERhdGUgYnkgSmF2YXNjcmlwdGApO1xuXHRcdFx0XHRcdFx0fVxuXHRcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGhpcyBpcyBhIHN0cmluZywgaW4gdGhlIGRlZmF1bHQgY2FzZVxuXHRcdFx0XHRcdFx0Ly8gTm90ZSB0aGlzIGlzIG9ubHkgd2hlbiBhIERhdGFUeXBlIGlzIHNwZWNpZmllZCBhbmQgaXQgaXMgYW4gdW5yZWNvZ25pemVkIGRhdGEgdHlwZS5cblx0XHRcdFx0XHRcdGlmICh0bXBFbGVtZW50VHlwZSAhPSAnc3RyaW5nJylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0YWRkVmFsaWRhdGlvbkVycm9yKHRtcERlc2NyaXB0b3IuQWRkcmVzcywgYGhhcyBhIERhdGFUeXBlICR7dG1wRGVzY3JpcHRvci5EYXRhVHlwZX0gKHdoaWNoIGF1dG8tY29udmVydGVkIHRvIFN0cmluZyBiZWNhdXNlIGl0IHdhcyB1bnJlY29nbml6ZWQpIGJ1dCBpcyBvZiB0aGUgdHlwZSAke3RtcEVsZW1lbnRUeXBlfWApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdG1wVmFsaWRhdGlvbkRhdGE7XG5cdH1cblxuXHQvLyBSZXR1cm5zIGEgZGVmYXVsdCB2YWx1ZSwgb3IsIHRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGUgZGF0YSB0eXBlICh3aGljaCBpcyBvdmVycmlkYWJsZSB3aXRoIGNvbmZpZ3VyYXRpb24pXG5cdGdldERlZmF1bHRWYWx1ZShwRGVzY3JpcHRvcilcblx0e1xuXHRcdGlmIChwRGVzY3JpcHRvci5oYXNPd25Qcm9wZXJ0eSgnRGVmYXVsdCcpKVxuXHRcdHtcblx0XHRcdHJldHVybiBwRGVzY3JpcHRvci5EZWZhdWx0O1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0Ly8gRGVmYXVsdCB0byBhIG51bGwgaWYgaXQgZG9lc24ndCBoYXZlIGEgdHlwZSBzcGVjaWZpZWQuXG5cdFx0XHQvLyBUaGlzIHdpbGwgZW5zdXJlIGEgcGxhY2Vob2xkZXIgaXMgY3JlYXRlZCBidXQgaXNuJ3QgbWlzaW50ZXJwcmV0ZWQuXG5cdFx0XHRsZXQgdG1wRGF0YVR5cGUgPSAocERlc2NyaXB0b3IuaGFzT3duUHJvcGVydHkoJ0RhdGFUeXBlJykpID8gcERlc2NyaXB0b3IuRGF0YVR5cGUgOiAnU3RyaW5nJztcblx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZGVmYXVsdFZhbHVlcy5oYXNPd25Qcm9wZXJ0eSh0bXBEYXRhVHlwZSkpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnMuZGVmYXVsdFZhbHVlc1t0bXBEYXRhVHlwZV07XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdC8vIGdpdmUgdXAgYW5kIHJldHVybiBudWxsXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIEVudW1lcmF0ZSB0aHJvdWdoIHRoZSBzY2hlbWEgYW5kIHBvcHVsYXRlIGRlZmF1bHQgdmFsdWVzIGlmIHRoZXkgZG9uJ3QgZXhpc3QuXG5cdHBvcHVsYXRlRGVmYXVsdHMocE9iamVjdCwgcE92ZXJ3cml0ZVByb3BlcnRpZXMpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5wb3B1bGF0ZU9iamVjdChwT2JqZWN0LCBwT3ZlcndyaXRlUHJvcGVydGllcyxcblx0XHRcdC8vIFRoaXMganVzdCBzZXRzIHVwIGEgc2ltcGxlIGZpbHRlciB0byBzZWUgaWYgdGhlcmUgaXMgYSBkZWZhdWx0IHNldC5cblx0XHRcdChwRGVzY3JpcHRvcikgPT5cblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHBEZXNjcmlwdG9yLmhhc093blByb3BlcnR5KCdEZWZhdWx0Jyk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8vIEZvcmNlZnVsbHkgcG9wdWxhdGUgYWxsIHZhbHVlcyBldmVuIGlmIHRoZXkgZG9uJ3QgaGF2ZSBkZWZhdWx0cy5cblx0Ly8gQmFzZWQgb24gdHlwZSwgdGhpcyBjYW4gZG8gdW5leHBlY3RlZCB0aGluZ3MuXG5cdHBvcHVsYXRlT2JqZWN0KHBPYmplY3QsIHBPdmVyd3JpdGVQcm9wZXJ0aWVzLCBmRmlsdGVyKVxuXHR7XG5cdFx0Ly8gQXV0b21hdGljYWxseSBjcmVhdGUgYW4gb2JqZWN0IGlmIG9uZSBpc24ndCBwYXNzZWQgaW4uXG5cdFx0bGV0IHRtcE9iamVjdCA9ICh0eXBlb2YocE9iamVjdCkgPT09ICdvYmplY3QnKSA/IHBPYmplY3QgOiB7fTtcblx0XHQvLyBEZWZhdWx0IHRvICpOT1QgT1ZFUldSSVRJTkcqIHByb3BlcnRpZXNcblx0XHRsZXQgdG1wT3ZlcndyaXRlUHJvcGVydGllcyA9ICh0eXBlb2YocE92ZXJ3cml0ZVByb3BlcnRpZXMpID09ICd1bmRlZmluZWQnKSA/IGZhbHNlIDogcE92ZXJ3cml0ZVByb3BlcnRpZXM7XG5cdFx0Ly8gVGhpcyBpcyBhIGZpbHRlciBmdW5jdGlvbiwgd2hpY2ggaXMgcGFzc2VkIHRoZSBzY2hlbWEgYW5kIGFsbG93cyBjb21wbGV4IGZpbHRlcmluZyBvZiBwb3B1bGF0aW9uXG5cdFx0Ly8gVGhlIGRlZmF1bHQgZmlsdGVyIGZ1bmN0aW9uIGp1c3QgcmV0dXJucyB0cnVlLCBwb3B1bGF0aW5nIGV2ZXJ5dGhpbmcuXG5cdFx0bGV0IHRtcEZpbHRlckZ1bmN0aW9uID0gKHR5cGVvZihmRmlsdGVyKSA9PSAnZnVuY3Rpb24nKSA/IGZGaWx0ZXIgOiAocERlc2NyaXB0b3IpID0+IHsgcmV0dXJuIHRydWU7IH07XG5cblx0XHR0aGlzLmVsZW1lbnRBZGRyZXNzZXMuZm9yRWFjaChcblx0XHRcdChwQWRkcmVzcykgPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IHRtcERlc2NyaXB0b3IgPSB0aGlzLmdldERlc2NyaXB0b3IocEFkZHJlc3MpO1xuXHRcdFx0XHQvLyBDaGVjayB0aGUgZmlsdGVyIGZ1bmN0aW9uIHRvIHNlZSBpZiB0aGlzIGlzIGFuIGFkZHJlc3Mgd2Ugd2FudCB0byBzZXQgdGhlIHZhbHVlIGZvci5cblx0XHRcdFx0aWYgKHRtcEZpbHRlckZ1bmN0aW9uKHRtcERlc2NyaXB0b3IpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly8gSWYgd2UgYXJlIG92ZXJ3cml0aW5nIHByb3BlcnRpZXMgT1IgdGhlIHByb3BlcnR5IGRvZXMgbm90IGV4aXN0XG5cdFx0XHRcdFx0aWYgKHRtcE92ZXJ3cml0ZVByb3BlcnRpZXMgfHwgIXRoaXMuY2hlY2tBZGRyZXNzRXhpc3RzKHRtcE9iamVjdCwgcEFkZHJlc3MpKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0VmFsdWVBdEFkZHJlc3ModG1wT2JqZWN0LCBwQWRkcmVzcywgdGhpcy5nZXREZWZhdWx0VmFsdWUodG1wRGVzY3JpcHRvcikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRyZXR1cm4gdG1wT2JqZWN0O1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hbnlmZXN0OyIsIi8qKlxuKiBQcmVjZWRlbnQgTWV0YS1UZW1wbGF0aW5nXG4qXG4qIEBsaWNlbnNlICAgICBNSVRcbipcbiogQGF1dGhvciAgICAgIFN0ZXZlbiBWZWxvem8gPHN0ZXZlbkB2ZWxvem8uY29tPlxuKlxuKiBAZGVzY3JpcHRpb24gUHJvY2VzcyB0ZXh0IHN0cmVhbXMsIHBhcnNpbmcgb3V0IG1ldGEtdGVtcGxhdGUgZXhwcmVzc2lvbnMuXG4qL1xudmFyIGxpYldvcmRUcmVlID0gcmVxdWlyZShgLi9Xb3JkVHJlZS5qc2ApO1xudmFyIGxpYlN0cmluZ1BhcnNlciA9IHJlcXVpcmUoYC4vU3RyaW5nUGFyc2VyLmpzYCk7XG5cbmNsYXNzIFByZWNlZGVudFxue1xuXHQvKipcblx0ICogUHJlY2VkZW50IENvbnN0cnVjdG9yXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHR0aGlzLldvcmRUcmVlID0gbmV3IGxpYldvcmRUcmVlKCk7XG5cdFx0XG5cdFx0dGhpcy5TdHJpbmdQYXJzZXIgPSBuZXcgbGliU3RyaW5nUGFyc2VyKCk7XG5cblx0XHR0aGlzLlBhcnNlVHJlZSA9IHRoaXMuV29yZFRyZWUuUGFyc2VUcmVlO1xuXHR9XG5cdFxuXHQvKipcblx0ICogQWRkIGEgUGF0dGVybiB0byB0aGUgUGFyc2UgVHJlZVxuXHQgKiBAbWV0aG9kIGFkZFBhdHRlcm5cblx0ICogQHBhcmFtIHtPYmplY3R9IHBUcmVlIC0gQSBub2RlIG9uIHRoZSBwYXJzZSB0cmVlIHRvIHB1c2ggdGhlIGNoYXJhY3RlcnMgaW50b1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gcFBhdHRlcm4gLSBUaGUgc3RyaW5nIHRvIGFkZCB0byB0aGUgdHJlZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gcEluZGV4IC0gY2FsbGJhY2sgZnVuY3Rpb25cblx0ICogQHJldHVybiB7Ym9vbH0gVHJ1ZSBpZiBhZGRpbmcgdGhlIHBhdHRlcm4gd2FzIHN1Y2Nlc3NmdWxcblx0ICovXG5cdGFkZFBhdHRlcm4ocFBhdHRlcm5TdGFydCwgcFBhdHRlcm5FbmQsIHBQYXJzZXIpXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5Xb3JkVHJlZS5hZGRQYXR0ZXJuKHBQYXR0ZXJuU3RhcnQsIHBQYXR0ZXJuRW5kLCBwUGFyc2VyKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIFBhcnNlIGEgc3RyaW5nIHdpdGggdGhlIGV4aXN0aW5nIHBhcnNlIHRyZWVcblx0ICogQG1ldGhvZCBwYXJzZVN0cmluZ1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gcFN0cmluZyAtIFRoZSBzdHJpbmcgdG8gcGFyc2Vcblx0ICogQHJldHVybiB7c3RyaW5nfSBUaGUgcmVzdWx0IGZyb20gdGhlIHBhcnNlclxuXHQgKi9cblx0cGFyc2VTdHJpbmcocFN0cmluZylcblx0e1xuXHRcdHJldHVybiB0aGlzLlN0cmluZ1BhcnNlci5wYXJzZVN0cmluZyhwU3RyaW5nLCB0aGlzLlBhcnNlVHJlZSk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcmVjZWRlbnQ7XG4iLCIvKipcbiogU3RyaW5nIFBhcnNlclxuKlxuKiBAbGljZW5zZSAgICAgTUlUXG4qXG4qIEBhdXRob3IgICAgICBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbipcbiogQGRlc2NyaXB0aW9uIFBhcnNlIGEgc3RyaW5nLCBwcm9wZXJseSBwcm9jZXNzaW5nIGVhY2ggbWF0Y2hlZCB0b2tlbiBpbiB0aGUgd29yZCB0cmVlLlxuKi9cblxuY2xhc3MgU3RyaW5nUGFyc2VyXG57XG5cdC8qKlxuXHQgKiBTdHJpbmdQYXJzZXIgQ29uc3RydWN0b3Jcblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHR9XG5cdFxuXHQvKipcblx0ICogQ3JlYXRlIGEgZnJlc2ggcGFyc2luZyBzdGF0ZSBvYmplY3QgdG8gd29yayB3aXRoLlxuXHQgKiBAbWV0aG9kIG5ld1BhcnNlclN0YXRlXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwUGFyc2VUcmVlIC0gQSBub2RlIG9uIHRoZSBwYXJzZSB0cmVlIHRvIGJlZ2luIHBhcnNpbmcgZnJvbSAodXN1YWxseSByb290KVxuXHQgKiBAcmV0dXJuIHtPYmplY3R9IEEgbmV3IHBhcnNlciBzdGF0ZSBvYmplY3QgZm9yIHJ1bm5pbmcgYSBjaGFyYWN0ZXIgcGFyc2VyIG9uXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRuZXdQYXJzZXJTdGF0ZSAocFBhcnNlVHJlZSlcblx0e1xuXHRcdHJldHVybiAoXG5cdFx0e1xuXHRcdCAgICBQYXJzZVRyZWU6IHBQYXJzZVRyZWUsXG5cblx0XHRcdE91dHB1dDogJycsXG5cdFx0XHRPdXRwdXRCdWZmZXI6ICcnLFxuXG5cdFx0XHRQYXR0ZXJuOiBmYWxzZSxcblxuXHRcdFx0UGF0dGVybk1hdGNoOiBmYWxzZSxcblx0XHRcdFBhdHRlcm5NYXRjaE91dHB1dEJ1ZmZlcjogJydcblx0XHR9KTtcblx0fVxuXHRcdFxuXHQvKipcblx0ICogQXNzaWduIGEgbm9kZSBvZiB0aGUgcGFyc2VyIHRyZWUgdG8gYmUgdGhlIG5leHQgcG90ZW50aWFsIG1hdGNoLlxuXHQgKiBJZiB0aGUgbm9kZSBoYXMgYSBQYXR0ZXJuRW5kIHByb3BlcnR5LCBpdCBpcyBhIHZhbGlkIG1hdGNoIGFuZCBzdXBlcmNlZGVzIHRoZSBsYXN0IHZhbGlkIG1hdGNoIChvciBiZWNvbWVzIHRoZSBpbml0aWFsIG1hdGNoKS5cblx0ICogQG1ldGhvZCBhc3NpZ25Ob2RlXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwTm9kZSAtIEEgbm9kZSBvbiB0aGUgcGFyc2UgdHJlZSB0byBhc3NpZ25cblx0ICogQHBhcmFtIHtPYmplY3R9IHBQYXJzZXJTdGF0ZSAtIFRoZSBzdGF0ZSBvYmplY3QgZm9yIHRoZSBjdXJyZW50IHBhcnNpbmcgdGFza1xuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0YXNzaWduTm9kZSAocE5vZGUsIHBQYXJzZXJTdGF0ZSlcblx0e1xuXHRcdHBQYXJzZXJTdGF0ZS5QYXR0ZXJuTWF0Y2ggPSBwTm9kZTtcblxuXHRcdC8vIElmIHRoZSBwYXR0ZXJuIGhhcyBhIEVORCB3ZSBjYW4gYXNzdW1lIGl0IGhhcyBhIHBhcnNlIGZ1bmN0aW9uLi4uXG5cdFx0aWYgKHBQYXJzZXJTdGF0ZS5QYXR0ZXJuTWF0Y2guaGFzT3duUHJvcGVydHkoJ1BhdHRlcm5FbmQnKSlcblx0XHR7XG5cdFx0XHQvLyAuLi4gdGhpcyBpcyB0aGUgbGVnaXRpbWF0ZSBzdGFydCBvZiBhIHBhdHRlcm4uXG5cdFx0XHRwUGFyc2VyU3RhdGUuUGF0dGVybiA9IHBQYXJzZXJTdGF0ZS5QYXR0ZXJuTWF0Y2g7XG5cdFx0fVxuXHR9XG5cdFxuXHQvKipcblx0ICogQXBwZW5kIGEgY2hhcmFjdGVyIHRvIHRoZSBvdXRwdXQgYnVmZmVyIGluIHRoZSBwYXJzZXIgc3RhdGUuXG5cdCAqIFRoaXMgb3V0cHV0IGJ1ZmZlciBpcyB1c2VkIHdoZW4gYSBwb3RlbnRpYWwgbWF0Y2ggaXMgYmVpbmcgZXhwbG9yZWQsIG9yIGEgbWF0Y2ggaXMgYmVpbmcgZXhwbG9yZWQuXG5cdCAqIEBtZXRob2QgYXBwZW5kT3V0cHV0QnVmZmVyXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwQ2hhcmFjdGVyIC0gVGhlIGNoYXJhY3RlciB0byBhcHBlbmRcblx0ICogQHBhcmFtIHtPYmplY3R9IHBQYXJzZXJTdGF0ZSAtIFRoZSBzdGF0ZSBvYmplY3QgZm9yIHRoZSBjdXJyZW50IHBhcnNpbmcgdGFza1xuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0YXBwZW5kT3V0cHV0QnVmZmVyIChwQ2hhcmFjdGVyLCBwUGFyc2VyU3RhdGUpXG5cdHtcblx0XHRwUGFyc2VyU3RhdGUuT3V0cHV0QnVmZmVyICs9IHBDaGFyYWN0ZXI7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBGbHVzaCB0aGUgb3V0cHV0IGJ1ZmZlciB0byB0aGUgb3V0cHV0IGFuZCBjbGVhciBpdC5cblx0ICogQG1ldGhvZCBmbHVzaE91dHB1dEJ1ZmZlclxuXHQgKiBAcGFyYW0ge09iamVjdH0gcFBhcnNlclN0YXRlIC0gVGhlIHN0YXRlIG9iamVjdCBmb3IgdGhlIGN1cnJlbnQgcGFyc2luZyB0YXNrXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmbHVzaE91dHB1dEJ1ZmZlciAocFBhcnNlclN0YXRlKVxuXHR7XG5cdFx0cFBhcnNlclN0YXRlLk91dHB1dCArPSBwUGFyc2VyU3RhdGUuT3V0cHV0QnVmZmVyO1xuXHRcdHBQYXJzZXJTdGF0ZS5PdXRwdXRCdWZmZXIgPSAnJztcblx0fVxuXG5cdFxuXHQvKipcblx0ICogQ2hlY2sgaWYgdGhlIHBhdHRlcm4gaGFzIGVuZGVkLiAgSWYgaXQgaGFzLCBwcm9wZXJseSBmbHVzaCB0aGUgYnVmZmVyIGFuZCBzdGFydCBsb29raW5nIGZvciBuZXcgcGF0dGVybnMuXG5cdCAqIEBtZXRob2QgY2hlY2tQYXR0ZXJuRW5kXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwUGFyc2VyU3RhdGUgLSBUaGUgc3RhdGUgb2JqZWN0IGZvciB0aGUgY3VycmVudCBwYXJzaW5nIHRhc2tcblx0ICogQHByaXZhdGVcblx0ICovXG5cdGNoZWNrUGF0dGVybkVuZCAocFBhcnNlclN0YXRlKVxuXHR7XG5cdFx0aWYgKChwUGFyc2VyU3RhdGUuT3V0cHV0QnVmZmVyLmxlbmd0aCA+PSBwUGFyc2VyU3RhdGUuUGF0dGVybi5QYXR0ZXJuRW5kLmxlbmd0aCtwUGFyc2VyU3RhdGUuUGF0dGVybi5QYXR0ZXJuU3RhcnQubGVuZ3RoKSAmJiBcblx0XHRcdChwUGFyc2VyU3RhdGUuT3V0cHV0QnVmZmVyLnN1YnN0cigtcFBhcnNlclN0YXRlLlBhdHRlcm4uUGF0dGVybkVuZC5sZW5ndGgpID09PSBwUGFyc2VyU3RhdGUuUGF0dGVybi5QYXR0ZXJuRW5kKSlcblx0XHR7XG5cdFx0XHQvLyAuLi4gdGhpcyBpcyB0aGUgZW5kIG9mIGEgcGF0dGVybiwgY3V0IG9mZiB0aGUgZW5kIHRhZyBhbmQgcGFyc2UgaXQuXG5cdFx0XHQvLyBUcmltIHRoZSBzdGFydCBhbmQgZW5kIHRhZ3Mgb2ZmIHRoZSBvdXRwdXQgYnVmZmVyIG5vd1xuXHRcdFx0cFBhcnNlclN0YXRlLk91dHB1dEJ1ZmZlciA9IHBQYXJzZXJTdGF0ZS5QYXR0ZXJuLlBhcnNlKHBQYXJzZXJTdGF0ZS5PdXRwdXRCdWZmZXIuc3Vic3RyKHBQYXJzZXJTdGF0ZS5QYXR0ZXJuLlBhdHRlcm5TdGFydC5sZW5ndGgsIHBQYXJzZXJTdGF0ZS5PdXRwdXRCdWZmZXIubGVuZ3RoIC0gKHBQYXJzZXJTdGF0ZS5QYXR0ZXJuLlBhdHRlcm5TdGFydC5sZW5ndGgrcFBhcnNlclN0YXRlLlBhdHRlcm4uUGF0dGVybkVuZC5sZW5ndGgpKSk7XG5cdFx0XHQvLyBGbHVzaCB0aGUgb3V0cHV0IGJ1ZmZlci5cblx0XHRcdHRoaXMuZmx1c2hPdXRwdXRCdWZmZXIocFBhcnNlclN0YXRlKTtcblx0XHRcdC8vIEVuZCBwYXR0ZXJuIG1vZGVcblx0XHRcdHBQYXJzZXJTdGF0ZS5QYXR0ZXJuID0gZmFsc2U7XG5cdFx0XHRwUGFyc2VyU3RhdGUuUGF0dGVybk1hdGNoID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cdFxuXHQvKipcblx0ICogUGFyc2UgYSBjaGFyYWN0ZXIgaW4gdGhlIGJ1ZmZlci5cblx0ICogQG1ldGhvZCBwYXJzZUNoYXJhY3RlclxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcENoYXJhY3RlciAtIFRoZSBjaGFyYWN0ZXIgdG8gYXBwZW5kXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwUGFyc2VyU3RhdGUgLSBUaGUgc3RhdGUgb2JqZWN0IGZvciB0aGUgY3VycmVudCBwYXJzaW5nIHRhc2tcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHBhcnNlQ2hhcmFjdGVyIChwQ2hhcmFjdGVyLCBwUGFyc2VyU3RhdGUpXG5cdHtcblx0XHQvLyAoMSkgSWYgd2UgYXJlbid0IGluIGEgcGF0dGVybiBtYXRjaCwgYW5kIHdlIGFyZW4ndCBwb3RlbnRpYWxseSBtYXRjaGluZywgYW5kIHRoaXMgbWF5IGJlIHRoZSBzdGFydCBvZiBhIG5ldyBwYXR0ZXJuLi4uLlxuXHRcdGlmICghcFBhcnNlclN0YXRlLlBhdHRlcm5NYXRjaCAmJiBwUGFyc2VyU3RhdGUuUGFyc2VUcmVlLmhhc093blByb3BlcnR5KHBDaGFyYWN0ZXIpKVxuXHRcdHtcblx0XHRcdC8vIC4uLiBhc3NpZ24gdGhlIG5vZGUgYXMgdGhlIG1hdGNoZWQgbm9kZS5cblx0XHRcdHRoaXMuYXNzaWduTm9kZShwUGFyc2VyU3RhdGUuUGFyc2VUcmVlW3BDaGFyYWN0ZXJdLCBwUGFyc2VyU3RhdGUpO1xuXHRcdFx0dGhpcy5hcHBlbmRPdXRwdXRCdWZmZXIocENoYXJhY3RlciwgcFBhcnNlclN0YXRlKTtcblx0XHR9XG5cdFx0Ly8gKDIpIElmIHdlIGFyZSBpbiBhIHBhdHRlcm4gbWF0Y2ggKGFjdGl2ZWx5IHNlZWluZyBpZiB0aGlzIGlzIHBhcnQgb2YgYSBuZXcgcGF0dGVybiB0b2tlbilcblx0XHRlbHNlIGlmIChwUGFyc2VyU3RhdGUuUGF0dGVybk1hdGNoKVxuXHRcdHtcblx0XHRcdC8vIElmIHRoZSBwYXR0ZXJuIGhhcyBhIHN1YnBhdHRlcm4gd2l0aCB0aGlzIGtleVxuXHRcdFx0aWYgKHBQYXJzZXJTdGF0ZS5QYXR0ZXJuTWF0Y2guaGFzT3duUHJvcGVydHkocENoYXJhY3RlcikpXG5cdFx0XHR7XG5cdFx0XHRcdC8vIENvbnRpbnVlIG1hdGNoaW5nIHBhdHRlcm5zLlxuXHRcdFx0XHR0aGlzLmFzc2lnbk5vZGUocFBhcnNlclN0YXRlLlBhdHRlcm5NYXRjaFtwQ2hhcmFjdGVyXSwgcFBhcnNlclN0YXRlKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuYXBwZW5kT3V0cHV0QnVmZmVyKHBDaGFyYWN0ZXIsIHBQYXJzZXJTdGF0ZSk7XG5cdFx0XHRpZiAocFBhcnNlclN0YXRlLlBhdHRlcm4pXG5cdFx0XHR7XG5cdFx0XHRcdC8vIC4uLiBDaGVjayBpZiB0aGlzIGlzIHRoZSBlbmQgb2YgdGhlIHBhdHRlcm4gKGlmIHdlIGFyZSBtYXRjaGluZyBhIHZhbGlkIHBhdHRlcm4pLi4uXG5cdFx0XHRcdHRoaXMuY2hlY2tQYXR0ZXJuRW5kKHBQYXJzZXJTdGF0ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vICgzKSBJZiB3ZSBhcmVuJ3QgaW4gYSBwYXR0ZXJuIG1hdGNoIG9yIHBhdHRlcm4sIGFuZCB0aGlzIGlzbid0IHRoZSBzdGFydCBvZiBhIG5ldyBwYXR0ZXJuIChSQVcgbW9kZSkuLi4uXG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHBQYXJzZXJTdGF0ZS5PdXRwdXQgKz0gcENoYXJhY3Rlcjtcblx0XHR9XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBQYXJzZSBhIHN0cmluZyBmb3IgbWF0Y2hlcywgYW5kIHByb2Nlc3MgYW55IHRlbXBsYXRlIHNlZ21lbnRzIHRoYXQgb2NjdXIuXG5cdCAqIEBtZXRob2QgcGFyc2VTdHJpbmdcblx0ICogQHBhcmFtIHtzdHJpbmd9IHBTdHJpbmcgLSBUaGUgc3RyaW5nIHRvIHBhcnNlLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcFBhcnNlVHJlZSAtIFRoZSBwYXJzZSB0cmVlIHRvIGJlZ2luIHBhcnNpbmcgZnJvbSAodXN1YWxseSByb290KVxuXHQgKi9cblx0cGFyc2VTdHJpbmcgKHBTdHJpbmcsIHBQYXJzZVRyZWUpXG5cdHtcblx0XHRsZXQgdG1wUGFyc2VyU3RhdGUgPSB0aGlzLm5ld1BhcnNlclN0YXRlKHBQYXJzZVRyZWUpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwU3RyaW5nLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdC8vIFRPRE86IFRoaXMgaXMgbm90IGZhc3QuXG5cdFx0XHR0aGlzLnBhcnNlQ2hhcmFjdGVyKHBTdHJpbmdbaV0sIHRtcFBhcnNlclN0YXRlKTtcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5mbHVzaE91dHB1dEJ1ZmZlcih0bXBQYXJzZXJTdGF0ZSk7XG5cdFx0XG5cdFx0cmV0dXJuIHRtcFBhcnNlclN0YXRlLk91dHB1dDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cmluZ1BhcnNlcjtcbiIsIi8qKlxuKiBXb3JkIFRyZWVcbipcbiogQGxpY2Vuc2UgICAgIE1JVFxuKlxuKiBAYXV0aG9yICAgICAgU3RldmVuIFZlbG96byA8c3RldmVuQHZlbG96by5jb20+XG4qXG4qIEBkZXNjcmlwdGlvbiBDcmVhdGUgYSB0cmVlIChkaXJlY3RlZCBncmFwaCkgb2YgSmF2YXNjcmlwdCBvYmplY3RzLCBvbmUgY2hhcmFjdGVyIHBlciBvYmplY3QuXG4qL1xuXG5jbGFzcyBXb3JkVHJlZVxue1xuXHQvKipcblx0ICogV29yZFRyZWUgQ29uc3RydWN0b3Jcblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHRoaXMuUGFyc2VUcmVlID0ge307XG5cdH1cblx0XG5cdC8qKiBcblx0ICogQWRkIGEgY2hpbGQgY2hhcmFjdGVyIHRvIGEgUGFyc2UgVHJlZSBub2RlXG5cdCAqIEBtZXRob2QgYWRkQ2hpbGRcblx0ICogQHBhcmFtIHtPYmplY3R9IHBUcmVlIC0gQSBwYXJzZSB0cmVlIHRvIHB1c2ggdGhlIGNoYXJhY3RlcnMgaW50b1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gcFBhdHRlcm4gLSBUaGUgc3RyaW5nIHRvIGFkZCB0byB0aGUgdHJlZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gcEluZGV4IC0gY2FsbGJhY2sgZnVuY3Rpb25cblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIHJlc3VsdGluZyBsZWFmIG5vZGUgdGhhdCB3YXMgYWRkZWQgKG9yIGZvdW5kKVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0YWRkQ2hpbGQgKHBUcmVlLCBwUGF0dGVybiwgcEluZGV4KVxuXHR7XG5cdFx0aWYgKHBJbmRleCA+IHBQYXR0ZXJuLmxlbmd0aClcblx0XHRcdHJldHVybiBwVHJlZTtcblx0XHRcblx0XHRpZiAoIXBUcmVlLmhhc093blByb3BlcnR5KHBQYXR0ZXJuW3BJbmRleF0pKVxuXHRcdFx0cFRyZWVbcFBhdHRlcm5bcEluZGV4XV0gPSB7fTtcblx0XHRcblx0XHRyZXR1cm4gcFRyZWVbcFBhdHRlcm5bcEluZGV4XV07XG5cdH1cblx0XG5cdC8qKiBBZGQgYSBQYXR0ZXJuIHRvIHRoZSBQYXJzZSBUcmVlXG5cdCAqIEBtZXRob2QgYWRkUGF0dGVyblxuXHQgKiBAcGFyYW0ge09iamVjdH0gcFRyZWUgLSBBIG5vZGUgb24gdGhlIHBhcnNlIHRyZWUgdG8gcHVzaCB0aGUgY2hhcmFjdGVycyBpbnRvXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwUGF0dGVybiAtIFRoZSBzdHJpbmcgdG8gYWRkIHRvIHRoZSB0cmVlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBwSW5kZXggLSBjYWxsYmFjayBmdW5jdGlvblxuXHQgKiBAcmV0dXJuIHtib29sfSBUcnVlIGlmIGFkZGluZyB0aGUgcGF0dGVybiB3YXMgc3VjY2Vzc2Z1bFxuXHQgKi9cblx0YWRkUGF0dGVybiAocFBhdHRlcm5TdGFydCwgcFBhdHRlcm5FbmQsIHBQYXJzZXIpXG5cdHtcblx0XHRpZiAocFBhdHRlcm5TdGFydC5sZW5ndGggPCAxKVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0bGV0IHRtcExlYWYgPSB0aGlzLlBhcnNlVHJlZTtcblxuXHRcdC8vIEFkZCB0aGUgdHJlZSBvZiBsZWF2ZXMgaXRlcmF0aXZlbHlcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBQYXR0ZXJuU3RhcnQubGVuZ3RoOyBpKyspXG5cdFx0XHR0bXBMZWFmID0gdGhpcy5hZGRDaGlsZCh0bXBMZWFmLCBwUGF0dGVyblN0YXJ0LCBpKTtcblxuXHRcdHRtcExlYWYuUGF0dGVyblN0YXJ0ID0gcFBhdHRlcm5TdGFydDtcblx0XHR0bXBMZWFmLlBhdHRlcm5FbmQgPSAoKHR5cGVvZihwUGF0dGVybkVuZCkgPT09ICdzdHJpbmcnKSAmJiAocFBhdHRlcm5FbmQubGVuZ3RoID4gMCkpID8gcFBhdHRlcm5FbmQgOiBwUGF0dGVyblN0YXJ0O1xuXHRcdHRtcExlYWYuUGFyc2UgPSAodHlwZW9mKHBQYXJzZXIpID09PSAnZnVuY3Rpb24nKSA/IHBQYXJzZXIgOiBcblx0XHRcdFx0XHRcdCh0eXBlb2YocFBhcnNlcikgPT09ICdzdHJpbmcnKSA/ICgpID0+IHsgcmV0dXJuIHBQYXJzZXI7IH0gOlxuXHRcdFx0XHRcdFx0KHBEYXRhKSA9PiB7IHJldHVybiBwRGF0YTsgfTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV29yZFRyZWU7XG4iLCIvKipcbiogQGxpY2Vuc2UgTUlUXG4qIEBhdXRob3IgPHN0ZXZlbkB2ZWxvem8uY29tPlxuKi9cblxuLyoqXG4qIEVsdWNpZGF0b3IgYnJvd3NlciBzaGltIGxvYWRlclxuKi9cblxuLy8gTG9hZCB0aGUgbWFueWZlc3QgbW9kdWxlIGludG8gdGhlIGJyb3dzZXIgZ2xvYmFsIGF1dG9tYXRpY2FsbHkuXG52YXIgbGliRWx1Y2lkYXRvciA9IHJlcXVpcmUoJy4vRWx1Y2lkYXRvci5qcycpO1xuXG5pZiAodHlwZW9mKHdpbmRvdykgPT09ICdvYmplY3QnKSB3aW5kb3cuRWx1Y2lkYXRvciA9IGxpYkVsdWNpZGF0b3I7XG5cbm1vZHVsZS5leHBvcnRzID0gbGliRWx1Y2lkYXRvcjsiLCIvKipcbiogQGxpY2Vuc2UgTUlUXG4qIEBhdXRob3IgPHN0ZXZlbkB2ZWxvem8uY29tPlxuKi9cblxuLyoqXG4qIEluc3RydWN0aW9uIFNldCBCYWNlIENsYXNzLlxuKlxuKiBAY2xhc3MgRWx1Y2lkYXRvckluc3RydWN0aW9uU2V0XG4qL1xuY2xhc3MgRWx1Y2lkYXRvckluc3RydWN0aW9uU2V0XG57XG4gICAgY29uc3RydWN0b3IocEVsdWNpZGF0b3IpXG4gICAge1xuICAgICAgICB0aGlzLmVsdWNpZGF0b3IgPSBwRWx1Y2lkYXRvcjtcblxuICAgICAgICB0aGlzLm5hbWVzcGFjZSA9ICdkZWZhdWx0JztcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYW4gZW1wdHkgbmFtZXNwYWNlIGZvciBpbnN0cnVjdGlvbnMgYW5kIG9wZXJhdGlvbnMgaWYgZWl0aGVyIG9uZSBkb2Vzbid0IGV4aXN0XG4gICAgaW5pdGlhbGl6ZU5hbWVzcGFjZShwTmFtZXNwYWNlKVxuICAgIHtcbiAgICAgICAgaWYgKHR5cGVvZihwTmFtZXNwYWNlKSA9PSAnc3RyaW5nJylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5uYW1lc3BhY2UgPSBwTmFtZXNwYWNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5lbHVjaWRhdG9yLmluc3RydWN0aW9uU2V0cy5oYXNPd25Qcm9wZXJ0eSh0aGlzLm5hbWVzcGFjZSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZWx1Y2lkYXRvci5pbnN0cnVjdGlvblNldHNbdGhpcy5uYW1lc3BhY2UudG9Mb3dlckNhc2UoKV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuZWx1Y2lkYXRvci5vcGVyYXRpb25TZXRzLmhhc093blByb3BlcnR5KHRoaXMubmFtZXNwYWNlKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5lbHVjaWRhdG9yLm9wZXJhdGlvblNldHNbdGhpcy5uYW1lc3BhY2UudG9Mb3dlckNhc2UoKV0gPSB7fTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBhbiBpbnN0cnVjdGlvbiB0byB0aGUgc2V0XG4gICAgYWRkSW5zdHJ1Y3Rpb24ocEluc3RydWN0aW9uSGFzaCwgZkluc3RydWN0aW9uRnVuY3Rpb24pXG4gICAge1xuICAgICAgICBpZiAodHlwZW9mKHBJbnN0cnVjdGlvbkhhc2gpICE9ICdzdHJpbmcnKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmVsdWNpZGF0b3IubG9nRXJyb3IoYEF0dGVtcHRlZCB0byBhZGQgYW4gaW5zdHJ1Y3Rpb24gd2l0aCBhbiBpbnZhbGlkIGhhc2g7IGV4cGVjdGVkIGEgc3RyaW5nIGJ1dCB0aGUgaW5zdHJ1Y3Rpb24gaGFzaCB0eXBlIHdhcyAke3R5cGVvZihwSW5zdHJ1Y3Rpb25IYXNoKX1gKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mKGZJbnN0cnVjdGlvbkZ1bmN0aW9uKSAhPSAnZnVuY3Rpb24nKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmVsdWNpZGF0b3IubG9nRXJyb3IoYEF0dGVtcHRlZCB0byBhZGQgYW4gaW5zdHJ1Y3Rpb24gd2l0aCBhbiBpbnZhbGlkIGZ1bmN0aW9uOyBleHBlY3RlZCBhIGZ1bmN0aW9uIGJ1dCB0eXBlIHdhcyAke3R5cGVvZihmSW5zdHJ1Y3Rpb25GdW5jdGlvbil9YCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsdWNpZGF0b3IuaW5zdHJ1Y3Rpb25TZXRzW3RoaXMubmFtZXNwYWNlLnRvTG93ZXJDYXNlKCldW3BJbnN0cnVjdGlvbkhhc2hdID0gZkluc3RydWN0aW9uRnVuY3Rpb247XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVJbnN0cnVjdGlvbnMoKVxuICAgIHtcbiAgICAgICAgLy8gVGhpcyBpcyB3aGVyZSB3ZSBtYXAgaW4gdGhlIGluc3RydWN0aW9ucy5cbiAgICAgICAgLy8gSWYgdGhlIGV4dGVuZGluZyBjbGFzcyBjYWxscyBzdXBlciBpdCB3aWxsIGluamVjdCBhIGhhcm1sZXNzIG5vb3AgaW50byB0aGUgc2NvcGUuXG4gICAgICAgIC8vIEl0IGlzbid0IHJlY29tbWVuZGVkIHRvIGRvIHRoZXNlIGlubGluZSBhcyBsYW1iZGFzLCBidXQgdGhpcyBjb2RlIGlzIGdlbmVyYWxseSBub3QgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkLlxuICAgICAgICAvLyBVbmxlc3MgdGhlIGRldmVsb3BlciB3YW50cyBhIG5vb3AgaW4gdGhlaXIgaW5zdHJ1Y3Rpb24gc2V0Li4uLi4uLi4uLi5cbiAgICAgICAgdGhpcy5hZGRJbnN0cnVjdGlvbignbm9vcCcsIFxuICAgICAgICAgICAgKHBPcGVyYXRpb24pID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcE9wZXJhdGlvbi5sb2dJbmZvKCdFeGVjdXRpbmcgYSBuby1vcGVyYXRpb24gb3BlcmF0aW9uLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gQWRkIGFuIG9wZXJhdGlvbiB0byB0aGUgc2V0XG4gICAgYWRkT3BlcmF0aW9uKHBPcGVyYXRpb25IYXNoLCBwT3BlcmF0aW9uKVxuICAgIHtcbiAgICAgICAgaWYgKHR5cGVvZihwT3BlcmF0aW9uSGFzaCkgIT0gJ3N0cmluZycpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZWx1Y2lkYXRvci5sb2dFcnJvcihgQXR0ZW1wdGVkIHRvIGFkZCBhbiBvcGVyYXRpb24gd2l0aCBhbiBpbnZhbGlkIGhhc2g7IGV4cGVjdGVkIGEgc3RyaW5nIGJ1dCB0aGUgb3BlcmF0aW9uIGhhc2ggdHlwZSB3YXMgJHt0eXBlb2YocE9wZXJhdGlvbkhhc2gpfWAsIHBPcGVyYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YocE9wZXJhdGlvbikgIT0gJ29iamVjdCcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZWx1Y2lkYXRvci5sb2dFcnJvcihgQXR0ZW1wdGVkIHRvIGFkZCBhbiBpbnZhbGlkIG9wZXJhdGlvbjsgZXhwZWN0ZWQgYW4gb2JqZWN0IGRhdGEgdHlwZSBidXQgdGhlIHR5cGUgd2FzICR7dHlwZW9mKHBPcGVyYXRpb24pfWAsIHBPcGVyYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIFZhbGlkYXRlIHRoZSBEZXNjcmlwdGlvbiBzdWJvYmplY3QsIHdoaWNoIGlzIGtleSB0byBmdW5jdGlvbmluZy5cbiAgICAgICAgaWYgKCFwT3BlcmF0aW9uLmhhc093blByb3BlcnR5KFwiRGVzY3JpcHRpb25cIikpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZWx1Y2lkYXRvci5sb2dFcnJvcihgQXR0ZW1wdGVkIHRvIGFkZCBhbiBvcGVyYXRpb24gd2l0aCBhbiBpbnZhbGlkIGRlc2NyaXB0aW9uOyBubyBEZXNjcmlwdGlvbiBzdWJvYmplY3Qgc2V0LmAsIHBPcGVyYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YocE9wZXJhdGlvbi5EZXNjcmlwdGlvbikgIT0gJ29iamVjdCcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZWx1Y2lkYXRvci5sb2dFcnJvcihgQXR0ZW1wdGVkIHRvIGFkZCBhbiBvcGVyYXRpb24gd2l0aCBhbiBpbnZhbGlkIGRlc2NyaXB0aW9uOyBEZXNjcmlwdGlvbiBzdWJvYmplY3Qgd2FzIG5vdCBhbiBvYmplY3QuICBUaGUgdHlwZSB3YXMgJHt0eXBlb2YocE9wZXJhdGlvbi5EZXNjcmlwdGlvbil9LmAsIHBPcGVyYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YocE9wZXJhdGlvbi5EZXNjcmlwdGlvbi5IYXNoKSAhPSAnc3RyaW5nJylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHR5cGVvZihwT3BlcmF0aW9uLkRlc2NyaXB0aW9uLk9wZXJhdGlvbikgPT0gJ3N0cmluZycpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gVXNlIHRoZSBcIk9wZXJhdGlvblwiIGFzIHRoZSBcIkhhc2hcIlxuICAgICAgICAgICAgICAgIHBPcGVyYXRpb24uRGVzY3JpcHRpb24uSGFzaCA9IHBPcGVyYXRpb24uRGVzY3JpcHRpb24uT3BlcmF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuZWx1Y2lkYXRvci5sb2dFcnJvcihgQXR0ZW1wdGVkIHRvIGFkZCBhbiBvcGVyYXRpb24gd2l0aCBhbiBpbnZhbGlkIGRlc2NyaXB0aW9uOyBEZXNjcmlwdGlvbiBzdWJvYmplY3QgZGlkIG5vdCBjb250YWluIGEgdmFsaWQgSGFzaCB3aGljaCBpcyByZXF1aXJlZCB0byBjYWxsIHRoZSBvcGVyYXRpb24uYCwgcE9wZXJhdGlvbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IGF1dG8gY3JlYXRlIGRhdGEgaWYgaXQgaXMgbWlzc2luZyBvciB3cm9uZyBpbiB0aGUgRGVzY3JpcHRpb25cbiAgICAgICAgaWYgKCh0eXBlb2YocE9wZXJhdGlvbi5EZXNjcmlwdGlvbi5OYW1lc3BhY2UpICE9ICdzdHJpbmcnKSB8fCAocE9wZXJhdGlvbi5EZXNjcmlwdGlvbi5OYW1lc3BhY2UgIT0gdGhpcy5uYW1lc3BhY2UpKVxuICAgICAgICB7XG4gICAgICAgICAgICBwT3BlcmF0aW9uLkRlc2NyaXB0aW9uLk5hbWVzcGFjZSA9IHRoaXMubmFtZXNwYWNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YocE9wZXJhdGlvbi5EZXNjcmlwdGlvbi5TdW1tYXJ5KSAhPSAnc3RyaW5nJylcbiAgICAgICAge1xuICAgICAgICAgICAgcE9wZXJhdGlvbi5EZXNjcmlwdGlvbi5TdW1tYXJ5ID0gYFske3BPcGVyYXRpb24uRGVzY3JpcHRpb24uTmFtZXNwYWNlfV0gWyR7cE9wZXJhdGlvbi5EZXNjcmlwdGlvbi5IYXNofV0gb3BlcmF0aW9uLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gaW5wdXRzLCBvciBvdXRwdXRzLCBvciBzdGVwcywgYWRkIHRoZW0uXG4gICAgICAgIGlmICghcE9wZXJhdGlvbi5oYXNPd25Qcm9wZXJ0eSgnSW5wdXRzJykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBPcGVyYXRpb24uSW5wdXRzID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwT3BlcmF0aW9uLmhhc093blByb3BlcnR5KCdPdXRwdXRzJykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBPcGVyYXRpb24uT3V0cHV0cyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmICghcE9wZXJhdGlvbi5oYXNPd25Qcm9wZXJ0eSgnU3RlcHMnKSlcbiAgICAgICAge1xuICAgICAgICAgICAgcE9wZXJhdGlvbi5TdGVwcyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIGlucHV0cywgb3Igb3V0cHV0cywgb3Igc3RlcHMsIGFkZCB0aGVtLlxuICAgICAgICAvLyBUT0RPOiBBZGQgYSBzdGVwIHdoZXJlIHdlIHRyeSB0byBsb2FkIHRoaXMgaW50byBNYW55ZmVzdCBhbmQgc2VlIHRoYXQgaXQncyB2YWxpZC5cbiAgICAgICAgaWYgKHR5cGVvZihwT3BlcmF0aW9uLklucHV0cykgIT09ICdvYmplY3QnKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmVsdWNpZGF0b3IubG9nRXJyb3IoYEF0dGVtcHRlZCB0byBhZGQgYW4gb3BlcmF0aW9uIHdpdGggYW4gaW52YWxpZCBJbnB1dHMgb2JqZWN0LmAsIHBPcGVyYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBpbnB1dHMsIG9yIG91dHB1dHMsIG9yIHN0ZXBzLCBhZGQgdGhlbS5cbiAgICAgICAgLy8gVE9ETzogQWRkIGEgc3RlcCB3aGVyZSB3ZSB0cnkgdG8gbG9hZCB0aGlzIGludG8gTWFueWZlc3QgYW5kIHNlZSB0aGF0IGl0J3MgdmFsaWQuXG4gICAgICAgIGlmICh0eXBlb2YocE9wZXJhdGlvbi5PdXRwdXRzKSAhPT0gJ29iamVjdCcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZWx1Y2lkYXRvci5sb2dFcnJvcihgQXR0ZW1wdGVkIHRvIGFkZCBhbiBvcGVyYXRpb24gd2l0aCBhbiBpbnZhbGlkIE91dHB1dHMgb2JqZWN0LmAsIHBPcGVyYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShwT3BlcmF0aW9uLlN0ZXBzKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5lbHVjaWRhdG9yLmxvZ0Vycm9yKGBBdHRlbXB0ZWQgdG8gYWRkIGFuIG9wZXJhdGlvbiB3aXRoIGFuIGludmFsaWQgU3RlcHMgYXJyYXkuYCwgcE9wZXJhdGlvbik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHRoaXMuZWx1Y2lkYXRvci5vcGVyYXRpb25TZXRzW3RoaXMubmFtZXNwYWNlLnRvTG93ZXJDYXNlKCldW3BPcGVyYXRpb25IYXNoLnRvTG93ZXJDYXNlKCldID0gcE9wZXJhdGlvbjtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZU9wZXJhdGlvbnMoKVxuICAgIHtcbiAgICAgICAgdGhpcy5hZGRPcGVyYXRpb24oJ25vb3AnLCBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIkRlc2NyaXB0aW9uXCI6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcIk9wZXJhdGlvblwiOiBcIm5vb3BcIixcbiAgICAgICAgICAgICAgICAgICAgXCJEZXNjcmlwdGlvblwiOiBcIk5vIG9wZXJhdGlvbiAtIG5vIGFmZmVjdCBvbiBhbnkgZGF0YS5cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRWx1Y2lkYXRvckluc3RydWN0aW9uU2V0OyIsIi8qKlxuKiBAbGljZW5zZSBNSVRcbiogQGF1dGhvciA8c3RldmVuQHZlbG96by5jb20+XG4qL1xuXG4vKipcbiogRWx1Y2lkYXRvciBzaW1wbGUgbG9nZ2luZyBzaGltIChmb3IgYnJvd3NlciBhbmQgZGVwZW5kZW5jeS1mcmVlIHJ1bm5pbmcpXG4qL1xuXG5jb25zdCBsb2dUb0NvbnNvbGUgPSAocExvZ0xpbmUsIHBMb2dPYmplY3QsIHBMb2dMZXZlbCkgPT5cbntcbiAgICBsZXQgdG1wTG9nTGluZSA9ICh0eXBlb2YocExvZ0xpbmUpID09PSAnc3RyaW5nJykgPyBwTG9nTGluZSA6ICcnO1xuICAgIGxldCB0bXBMb2dMZXZlbCA9ICh0eXBlb2YocExvZ0xldmVsKSA9PT0gJ3N0cmluZycpID8gcExvZ0xldmVsIDogJ0lORk8nO1xuXG4gICAgY29uc29sZS5sb2coYFtFbHVjaWRhdG9yOiR7dG1wTG9nTGV2ZWx9XSAke3RtcExvZ0xpbmV9YCk7XG5cbiAgICBpZiAocExvZ09iamVjdCkgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocExvZ09iamVjdCxudWxsLDQpK1wiXFxuXCIpO1xufTtcblxuY29uc3QgbG9nSW5mbyA9IChwTG9nTGluZSwgcExvZ09iamVjdCkgPT5cbntcbiAgICBsb2dUb0NvbnNvbGUocExvZ0xpbmUsIHBMb2dPYmplY3QsICdJbmZvJyk7XG59O1xuXG5cbmNvbnN0IGxvZ1dhcm5pbmcgPSAocExvZ0xpbmUsIHBMb2dPYmplY3QpID0+XG57XG4gICAgbG9nVG9Db25zb2xlKHBMb2dMaW5lLCBwTG9nT2JqZWN0LCAnV2FybmluZycpO1xufTtcblxuXG5jb25zdCBsb2dFcnJvciA9IChwTG9nTGluZSwgcExvZ09iamVjdCkgPT5cbntcbiAgICBsb2dUb0NvbnNvbGUocExvZ0xpbmUsIHBMb2dPYmplY3QsICdFcnJvcicpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG57XG4gICAgbG9nVG9Db25zb2xlOiBsb2dUb0NvbnNvbGUsXG4gICAgaW5mbzogbG9nSW5mbyxcbiAgICB3YXJuaW5nOiBsb2dXYXJuaW5nLFxuICAgIGVycm9yOiBsb2dFcnJvclxufSk7IiwiLyoqXG4qIEBsaWNlbnNlIE1JVFxuKiBAYXV0aG9yIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5jb25zdCBsaWJTaW1wbGVMb2cgPSByZXF1aXJlKCcuL0VsdWNpZGF0b3ItTG9nVG9Db25zb2xlLmpzJyk7XG5jb25zdCBsaWJNYW55ZmVzdCA9IHJlcXVpcmUoJ21hbnlmZXN0Jyk7XG5jb25zdCBsaWJQcmVjZWRlbnQgPSByZXF1aXJlKCdwcmVjZWRlbnQnKTtcblxuY29uc3QgbGliRWx1Y2lkYXRvckluc3RydWN0aW9uU2V0ID0gcmVxdWlyZSgnLi9FbHVjaWRhdG9yLUluc3RydWN0aW9uU2V0LmpzJyk7XG5cbi8qKlxuKiBFbHVjaWRhdG9yIG9iamVjdCBhZGRyZXNzLWJhc2VkIGRlc2NyaXB0aW9ucyBhbmQgbWFuaXB1bGF0aW9ucy5cbipcbiogQGNsYXNzIEVsdWNpZGF0b3JcbiovXG5jbGFzcyBFbHVjaWRhdG9yXG57XG4gICAgY29uc3RydWN0b3IocE9wZXJhdGlvbnMsIGZJbmZvTG9nLCBmRXJyb3JMb2cpXG4gICAge1xuICAgICAgICAvLyBXaXJlIGluIGxvZ2dpbmdcbiAgICAgICAgdGhpcy5sb2dJbmZvID0gKHR5cGVvZihmSW5mb0xvZykgPT09ICdmdW5jdGlvbicpID8gZkluZm9Mb2cgOiBsaWJTaW1wbGVMb2cuaW5mbztcbiAgICAgICAgdGhpcy5sb2dXYXJuaW5nID0gKHR5cGVvZihmV2FybmluZ0xvZykgPT09ICdmdW5jdGlvbicpID8gZldhcm5pbmdMb2cgOiBsaWJTaW1wbGVMb2cud2FybmluZztcbiAgICAgICAgdGhpcy5sb2dFcnJvciA9ICh0eXBlb2YoZkVycm9yTG9nKSA9PT0gJ2Z1bmN0aW9uJykgPyBmRXJyb3JMb2cgOiBsaWJTaW1wbGVMb2cuZXJyb3I7XG5cblx0XHQvLyBJbnN0cnVjdGlvbnMgYXJlIHRoZSBiYXNpYyBidWlsZGluZyBibG9ja3MgZm9yIG9wZXJhdGlvbnNcblx0XHR0aGlzLmluc3RydWN0aW9uU2V0cyA9IHt9O1xuXG5cdFx0Ly8gT3BlcmF0aW9ucyBhcmUgdGhlIHNvbHZlcnMgdGhhdCBjYW4gYmUgY2FsbGVkIChpbnN0cnVjdGlvbnMgY2FuJ3QgYmUgY2FsbGVkIGRpcmVjdGx5KVxuXHRcdC8vIFRoZXNlIGNhbiBiZSBhZGRlZCBhdCBydW4tdGltZSBhcyB3ZWxsXG5cdFx0dGhpcy5vcGVyYXRpb25TZXRzID0ge307XG5cblx0XHQvLyBEZWNpZGUgbGF0ZXIgaG93IHRvIG1ha2UgdGhpcyB0cnVseSB1bmlxdWUuXG5cdFx0dGhpcy5VVUlEID0gMDtcblxuXHRcdHRoaXMubG9hZERlZmF1bHRJbnN0cnVjdGlvblNldHMoKTtcbiAgICB9XG5cblx0Ly8gTG9hZCBhbiBpbnN0cnVjdGlvbiBzZXRcblx0bG9hZEluc3RydWN0aW9uU2V0KGNJbnN0cnVjdGlvblNldClcblx0e1xuXHRcdGxldCB0bXBJbnN0cnVjdGlvblNldCA9IG5ldyBjSW5zdHJ1Y3Rpb25TZXQodGhpcyk7XG5cdFx0Ly8gU2V0dXAgdGhlIG5hbWVzcGFjZVxuXHRcdHRtcEluc3RydWN0aW9uU2V0LmluaXRpYWxpemVOYW1lc3BhY2UoKTtcblx0XHR0bXBJbnN0cnVjdGlvblNldC5pbml0aWFsaXplSW5zdHJ1Y3Rpb25zKCk7XG5cdFx0dG1wSW5zdHJ1Y3Rpb25TZXQuaW5pdGlhbGl6ZU9wZXJhdGlvbnMoKTtcblx0fVxuXG5cdGxvYWREZWZhdWx0SW5zdHJ1Y3Rpb25TZXRzKClcblx0e1xuXHRcdC8vIFRoZSBqYXZhc2NyaXB0IG1hdGggaW5zdHJ1Y3Rpb25zIGFuZCBvcGVyYXRpb25zXG5cdFx0Ly8gVGhlc2UgcHJvdmlkZSB0aGUgXCJNYXRoXCIgbmFtZXNwYWNlXG5cdFx0dGhpcy5sb2FkSW5zdHJ1Y3Rpb25TZXQocmVxdWlyZShgLi9JbnN0cnVjdGlvblNldHMvTWF0aC1KYXZhc2NyaXB0LmpzYCkpO1xuXG5cdFx0Ly8gQSBwcmVjaXNpb24gamF2YXNjcmlwdCBsaWJyYXJ5IHRoYXQgaXMgY29uc2lzdGVudCBhY3Jvc3MgYnJvd3NlcnMsIHN0YWJsZSBhbmQgd2l0aG91dCBtYW50aXNzYSBpc3N1ZXNcblx0XHQvLyBUaGVzZSBwcm92aWRlIHRoZSBcIlByZWNpc2VNYXRoXCIgbmFtZXNwYWNlXG5cdFx0dGhpcy5sb2FkSW5zdHJ1Y3Rpb25TZXQocmVxdWlyZShgLi9JbnN0cnVjdGlvblNldHMvUHJlY2lzZU1hdGgtRGVjaW1hbC5qc2ApKTtcblxuXHRcdC8vIFRoZSBhYnN0cmFjdCBnZW9tZXRyeSBpbnN0cnVjdGlvbnMgYW5kIG9wZXJhdGlvbnNcblx0XHQvLyBUaGVzZSBwcm92aWRlIHRoZSBcIkdlb21ldHJ5XCIgbmFtZXNwYWNlXG5cdFx0dGhpcy5sb2FkSW5zdHJ1Y3Rpb25TZXQocmVxdWlyZShgLi9JbnN0cnVjdGlvblNldHMvR2VvbWV0cnkuanNgKSk7XG5cdH1cblxuXHRhZGRPcGVyYXRpb24ocE5hbWVzcGFjZSwgcE9wZXJhdGlvbkhhc2gsIHBPcGVyYXRpb24pXG5cdHtcbiAgICAgICAgaWYgKHR5cGVvZihwTmFtZXNwYWNlKSAhPSAnc3RyaW5nJylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5lbHVjaWRhdG9yLmxvZ0Vycm9yKGBBdHRlbXB0ZWQgdG8gYWRkIGFuIG9wZXJhdGlvbiBhdCBydW50aW1lIHZpYSBFbHVjaWRhdG9yLmFkZE9wZXJhdGlvbiB3aXRoIGFuIGludmFsaWQgbmFtZXNwYWNlOyBleHBlY3RlZCBhIHN0cmluZyBidXQgdGhlIHR5cGUgd2FzICR7dHlwZW9mKHBOYW1lc3BhY2UpfWAsIHBPcGVyYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cblx0XHRsZXQgdG1wT3BlcmF0aW9uSW5qZWN0b3IgPSBuZXcgbGliRWx1Y2lkYXRvckluc3RydWN0aW9uU2V0KHRoaXMpO1xuXHRcdHRtcE9wZXJhdGlvbkluamVjdG9yLmluaXRpYWxpemVOYW1lc3BhY2UocE5hbWVzcGFjZSk7XG5cblx0XHRyZXR1cm4gdG1wT3BlcmF0aW9uSW5qZWN0b3IuYWRkT3BlcmF0aW9uKHBPcGVyYXRpb25IYXNoLCBwT3BlcmF0aW9uKTtcblx0fVxuXG5cdHNvbHZlSW50ZXJuYWxPcGVyYXRpb24ocE5hbWVzcGFjZSwgcE9wZXJhdGlvbkhhc2gsIHBJbnB1dE9iamVjdCwgcE91dHB1dE9iamVjdCwgcERlc2NyaXB0aW9uTWFueWZlc3QsIHBJbnB1dEFkZHJlc3NNYXBwaW5nLCBwT3V0cHV0QWRkcmVzc01hcHBpbmcsIHBTb2x1dGlvbkNvbnRleHQpXG5cdHtcblx0XHRsZXQgdG1wT3BlcmF0aW9uID0gdGhpcy5vcGVyYXRpb25TZXRzW3BOYW1lc3BhY2UudG9Mb3dlckNhc2UoKV1bcE9wZXJhdGlvbkhhc2gudG9Mb3dlckNhc2UoKV07XG5cdFx0cmV0dXJuIHRoaXMuc29sdmVPcGVyYXRpb24odG1wT3BlcmF0aW9uLCBwSW5wdXRPYmplY3QsIHBPdXRwdXRPYmplY3QsIHBEZXNjcmlwdGlvbk1hbnlmZXN0LCBwSW5wdXRBZGRyZXNzTWFwcGluZywgcE91dHB1dEFkZHJlc3NNYXBwaW5nLCBwU29sdXRpb25Db250ZXh0KTtcblx0fVxuXG5cdHNvbHZlT3BlcmF0aW9uKHBPcGVyYXRpb25PYmplY3QsIHBJbnB1dE9iamVjdCwgcE91dHB1dE9iamVjdCwgcERlc2NyaXB0aW9uTWFueWZlc3QsIHBJbnB1dEFkZHJlc3NNYXBwaW5nLCBwT3V0cHV0QWRkcmVzc01hcHBpbmcsIHBTb2x1dGlvbkNvbnRleHQpXG5cdHtcblx0XHRsZXQgdG1wT3BlcmF0aW9uID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShwT3BlcmF0aW9uT2JqZWN0KSk7XG5cblx0XHQvLyBOb3cgdGhhdCB0aGUgb3BlcmF0aW9uIG9iamVjdCBoYXMgYmVlbiBjcmVhdGVkIHVuaXF1ZWx5LCBhcHBseSBhbnkgcGFzc2VkLWluIGFkZHJlc3MtaGFzaCByZW1hcHBpbmdzXG5cdFx0aWYgKHBJbnB1dEFkZHJlc3NNYXBwaW5nKVxuXHRcdHtcblx0XHRcdHRtcERlc2NyaXB0aW9uTWFueWZlc3Quc2NoZW1hTWFuaXB1bGF0aW9ucy5yZXNvbHZlQWRkcmVzc01hcHBpbmdzKHRtcE9wZXJhdGlvbi5JbnB1dHMsIHBJbnB1dEFkZHJlc3NNYXBwaW5nKTtcblx0XHR9XG5cdFx0aWYgKHBPdXRwdXRBZGRyZXNzTWFwcGluZylcblx0XHR7XG5cdFx0XHR0bXBEZXNjcmlwdGlvbk1hbnlmZXN0LnNjaGVtYU1hbmlwdWxhdGlvbnMucmVzb2x2ZUFkZHJlc3NNYXBwaW5ncyh0bXBPcGVyYXRpb24uSW5wdXRzLCBwT3V0cHV0QWRkcmVzc01hcHBpbmcpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YocElucHV0T2JqZWN0KSAhPSAnb2JqZWN0Jylcblx0XHR7XG4gICAgICAgICAgICB0aGlzLmxvZ0Vycm9yKGBBdHRlbXB0ZWQgdG8gcnVuIGEgc29sdmUgYnV0IHRoZSBwYXNzZWQgaW4gSW5wdXQgd2FzIG5vdCBhbiBvYmplY3QuICBUaGUgdHlwZSB3YXMgJHt0eXBlb2YocElucHV0T2JqZWN0KX0uYCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGxldCB0bXBJbnB1dE9iamVjdCA9IHBJbnB1dE9iamVjdDtcblxuXHRcdC8vIERlZmF1bHQgdG8gcmV1c2luZyB0aGUgaW5wdXQgb2JqZWN0IGFzIHRoZSBvdXRwdXQgb2JqZWN0LlxuXHRcdGxldCB0bXBPdXRwdXRPYmplY3QgPSB0bXBJbnB1dE9iamVjdDtcblxuXHRcdC8vIFRoaXMgaXMgaG93IHJlY3Vyc2l2ZSBzb2x1dGlvbnMgYmluZCB0aGVpciBjb250ZXh0IHRvZ2V0aGVyLlxuXHRcdGxldCB0bXBTb2x1dGlvbkNvbnRleHQgPSBwU29sdXRpb25Db250ZXh0O1xuXHRcdGlmICh0eXBlb2YodG1wU29sdXRpb25Db250ZXh0KSA9PT0gJ3VuZGVmaW5lZCcpXG5cdFx0e1xuXHRcdFx0dG1wU29sdXRpb25Db250ZXh0ID0gKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJTb2x1dGlvbkdVSURcIjogYFNvbHV0aW9uLSR7dGhpcy5VVUlEKyt9YCwgXG5cdFx0XHRcdFx0XCJTb2x1dGlvbkJhc2VOYW1lc3BhY2VcIjogcE9wZXJhdGlvbk9iamVjdC5EZXNjcmlwdGlvbi5OYW1lc3BhY2UsXG5cdFx0XHRcdFx0XCJTb2x1dGlvbkJhc2VPcGVyYXRpb25cIjogcE9wZXJhdGlvbk9iamVjdC5EZXNjcmlwdGlvbi5PcGVyYXRpb24sXG5cdFx0XHRcdFx0XCJTb2x1dGlvbkxvZ1wiOiBbXVxuXHRcdFx0XHR9KTtcblx0XHRcdFxuXHRcdFx0Ly8gVGhpcyBpcyB0aGUgcm9vdCBvcGVyYXRpb24sIHNlZSBpZiB0aGVyZSBhcmUgSW5wdXRzIGFuZCBPdXRwdXRzIGNyZWF0ZWQgLi4uIGlmIG5vdCwgY3JlYXRlIHRoZW0uXG5cdFx0XHRpZiAoIXRtcE9wZXJhdGlvbi5oYXNPd25Qcm9wZXJ0eSgnSW5wdXRzJykpXG5cdFx0XHR7XG5cdFx0XHRcdHRtcE9wZXJhdGlvbi5JbnB1dHMgPSB7fTtcblx0XHRcdH1cblx0XHRcdGlmICghdG1wT3BlcmF0aW9uLmhhc093blByb3BlcnR5KCdPdXRwdXRzJykpXG5cdFx0XHR7XG5cdFx0XHRcdHRtcE9wZXJhdGlvbi5PdXRwdXRzID0ge307XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRoaXMgaXMgdGhlIHJvb3QgT3BlcmF0aW9uLCBzZWUgaWYgdGhlcmUgaXMgYSBoYXNoIHRyYW5zbGF0aW9uIGF2YWlsYWJsZSBmb3IgZWl0aGVyIHNpZGUgKGlucHV0IG9yIG91dHB1dClcblx0XHRcdGlmICh0bXBPcGVyYXRpb24uaGFzT3duUHJvcGVydHkoJ0lucHV0SGFzaFRyYW5zbGF0aW9uVGFibGUnKSlcblx0XHRcdHtcblx0XHRcdFx0dG1wU29sdXRpb25Db250ZXh0LklucHV0SGFzaE1hcHBpbmcgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRtcE9wZXJhdGlvbi5JbnB1dEhhc2hUcmFuc2xhdGlvblRhYmxlKSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHRtcFNvbHV0aW9uQ29udGV4dC5JbnB1dEhhc2hNYXBwaW5nID0ge307XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0bXBPcGVyYXRpb24uaGFzT3duUHJvcGVydHkoJ091dHB1dEhhc2hUcmFuc2xhdGlvblRhYmxlJykpXG5cdFx0XHR7XG5cdFx0XHRcdHRtcFNvbHV0aW9uQ29udGV4dC5PdXRwdXRIYXNoTWFwcGluZyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodG1wT3BlcmF0aW9uLk91dHB1dEhhc2hUcmFuc2xhdGlvblRhYmxlKSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgodHlwZW9mKHBPdXRwdXRPYmplY3QpICE9ICdvYmplY3QnKVxuXHRcdFx0XHQmJiAodHlwZW9mKHRtcE91dHB1dEhhc2hNYXBwaW5nKSA9PSAndW5kZWZpbmVkJykgXG5cdFx0XHRcdCYmICh0eXBlb2YodG1wSW5wdXRIYXNoTWFwcGluZykgIT0gJ3VuZGVmaW5lZCcpKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBSZXVzZSB0aGUgaW5wdXQgaGFzaCBtYXBwaW5nIGlmOlxuXHRcdFx0XHQvLyAgIDEpIHdlIGF1dG8tbWFwcGVkIHRoZSBpbnB1dCBoYXNoIG1hcHBpbmcgdG8gdGhlIG91dHB1dCBiZWNhdXNlIG9ubHkgYW4gaW5wdXQgb2JqZWN0IHdhcyBzdXBwbGllZFxuXHRcdFx0XHQvLyAgIDIpIHRoZXJlICp3YXMgbm90KiBhbiBvdXRwdXQgaGFzaCBtYXBwaW5nIHN1cHBsaWVkXG5cdFx0XHRcdC8vICAgMykgdGhlcmUgKndhcyogYW4gaW5wdXQgaGFzaCBtYXBwaW5nIHN1cHBsaWVkXG5cdFx0XHRcdC8vXG5cdFx0XHRcdC8vIFRoaXMgc2VlbXMgc2ltcGxlIGF0IGZpcnN0IGJ1dCBleHBvc2VzIHNvbWUgcmVhbGx5IGludGVyZXN0aW5nIGJlaGF2aW9ycyBpbiB0ZXJtcyBvZlxuXHRcdFx0XHQvLyByZXVzaW5nIHRoZSBzYW1lIG9iamVjdCBhbmQgc2NoZW1hIGZvciBpbnB1dCBhbmQgb3V0cHV0LCBidXQgaGF2aW5nIGRpZmZlcmVudCBoYXNoXG5cdFx0XHRcdC8vIG1hcHBpbmdzIGZvciBlYWNoIG9mIHRoZW0uXG5cdFx0XHRcdHRtcFNvbHV0aW9uQ29udGV4dC5PdXRwdXRIYXNoTWFwcGluZyA9IHRtcFNvbHV0aW9uQ29udGV4dC5JbnB1dEhhc2hNYXBwaW5nO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YocE91dHB1dE9iamVjdCkgPT0gJ29iamVjdCcpXG5cdFx0e1xuXHRcdFx0Ly8gSWYgdGhlIGNhbGwgZGVmaW5lZCBhbiBleHBsaWNpdCwgZGlmZmVyZW50IG91dHB1dCBvYmplY3QgZnJvbSB0aGUgaW5wdXQgb2JqZWN0IHVzZSB0aGF0IGluc3RlYWQuXG5cdFx0XHR0bXBPdXRwdXRPYmplY3QgPSBwT3V0cHV0T2JqZWN0O1xuXHRcdH1cblxuXHRcdGxldCB0bXBEZXNjcmlwdGlvbk1hbnlmZXN0ID0gZmFsc2U7XG5cdFx0aWYgKHR5cGVvZihwRGVzY3JpcHRpb25NYW55ZmVzdCkgPT09ICd1bmRlZmluZWQnKVxuXHRcdHtcblx0XHRcdC8vIFdlIGFyZSBnb2luZyB0byB1c2UgdGhpcyBmb3Igc29tZSBjbGV2ZXIgc2NoZW1hIG1hbmlwdWxhdGlvbnMsIHRoZW4gcmVjcmVhdGUgdGhlIG9iamVjdFxuXHRcdFx0dG1wRGVzY3JpcHRpb25NYW55ZmVzdCA9IG5ldyBsaWJNYW55ZmVzdCgpO1xuXHRcdFx0Ly8gU3ludGhlc2l6ZSBhIG1hbnlmZXN0IGZyb20gdGhlIElucHV0IGFuZCBPdXRwdXQgcHJvcGVydGllc1xuXHRcdFx0bGV0IHRtcE1hbnlmZXN0U2NoZW1hID0gKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0U2NvcGU6ICdTb2x2ZXIgRGF0YSBQYXJ0IERlc2NyaXB0aW9ucycsXG5cdFx0XHRcdFx0RGVzY3JpcHRvcnM6IHRtcERlc2NyaXB0aW9uTWFueWZlc3Quc2NoZW1hTWFuaXB1bGF0aW9ucy5tZXJnZUFkZHJlc3NNYXBwaW5ncyh0bXBPcGVyYXRpb24uSW5wdXRzLCB0bXBPcGVyYXRpb24uT3V0cHV0cylcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdC8vIENsb25lIHRoZSBwYXNzZWQtaW4gbWFueWZlc3QsIHNvIG11dGF0aW9ucyBkbyBub3QgYWx0ZXIgdGhlIHVwc3RyZWFtIHZlcnNpb25cblx0XHRcdHRtcERlc2NyaXB0aW9uTWFueWZlc3QgPSBwRGVzY3JpcHRpb25NYW55ZmVzdC5jbG9uZSgpO1xuXHRcdH1cblx0XHRpZiAodG1wU29sdXRpb25Db250ZXh0LklucHV0SGFzaE1hcHBpbmcpXG5cdFx0e1xuXHRcdFx0dG1wRGVzY3JpcHRpb25NYW55ZmVzdC5oYXNoVHJhbnNsYXRpb25zLmFkZFRyYW5zbGF0aW9uKHRtcFNvbHV0aW9uQ29udGV4dC5JbnB1dEhhc2hNYXBwaW5nKTtcblx0XHR9XG5cdFx0aWYgKHRtcFNvbHV0aW9uQ29udGV4dC5PdXRwdXRIYXNoTWFwcGluZylcblx0XHR7XG5cdFx0XHR0bXBEZXNjcmlwdGlvbk1hbnlmZXN0Lmhhc2hUcmFuc2xhdGlvbnMuYWRkVHJhbnNsYXRpb24odG1wU29sdXRpb25Db250ZXh0Lk91dHB1dEhhc2hNYXBwaW5nKTtcdFx0XHRcblx0XHR9XG5cblxuXHRcdC8vIFNldCBzb21lIGtpbmQgb2YgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBvcGVyYXRpb25cblx0XHR0bXBPcGVyYXRpb24uVVVJRCA9IHRoaXMuVVVJRCsrO1xuXHRcdHRtcE9wZXJhdGlvbi5Tb2x1dGlvbkNvbnRleHQgPSB0bXBTb2x1dGlvbkNvbnRleHQ7XG5cblx0XHRpZiAodG1wT3BlcmF0aW9uLkRlc2NyaXB0aW9uLlN5bm9wc3lzKVxuXHRcdHtcblx0XHRcdHRtcFNvbHV0aW9uQ29udGV4dC5Tb2x1dGlvbkxvZy5wdXNoKGBbJHt0bXBPcGVyYXRpb24uVVVJRH1dOiBTb2x2ZXIgcnVubmluZyBvcGVyYXRpb24gJHt0bXBPcGVyYXRpb24uRGVzY3JpcHRpb24uU3lub3BzeXN9YCk7XG5cdFx0fVxuXG5cdFx0bGV0IHRtcFByZWNlZGVudCA9IG5ldyBsaWJQcmVjZWRlbnQoKTtcblx0XHR0bXBQcmVjZWRlbnQuYWRkUGF0dGVybigne3tOYW1lOicsICd9fScsXG5cdFx0XHQocEhhc2gpPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IHRtcEhhc2ggPSBwSGFzaC50cmltKCk7XG5cdFx0XHRcdGxldCB0bXBEZXNjcmlwdG9yID0gdG1wRGVzY3JpcHRpb25NYW55ZmVzdC5nZXREZXNjcmlwdG9yQnlIYXNoKHRtcEhhc2gpXG5cblx0XHRcdFx0Ly8gUmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgdmFsdWVcblx0XHRcdFx0aWYgKCh0eXBlb2YodG1wRGVzY3JpcHRvcikgPT0gJ29iamVjdCcpICAmJiB0bXBEZXNjcmlwdG9yLmhhc093blByb3BlcnR5KCdOYW1lJykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gdG1wRGVzY3JpcHRvci5OYW1lO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiB0bXBIYXNoO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR0bXBQcmVjZWRlbnQuYWRkUGF0dGVybigne3tJbnB1dFZhbHVlOicsICd9fScsXG5cdFx0XHQocEhhc2gpPT5cblx0XHRcdHtcblx0XHRcdFx0bGV0IHRtcEhhc2ggPSBwSGFzaC50cmltKCk7XG5cdFx0XHRcdHJldHVybiB0bXBEZXNjcmlwdGlvbk1hbnlmZXN0LmdldFZhbHVlQnlIYXNoKHRtcElucHV0T2JqZWN0LHRtcEhhc2gpO1xuXHRcdFx0fSk7XG5cdFx0dG1wUHJlY2VkZW50LmFkZFBhdHRlcm4oJ3t7T3V0cHV0VmFsdWU6JywgJ319Jyxcblx0XHRcdChwSGFzaCk9PlxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgdG1wSGFzaCA9IHBIYXNoLnRyaW0oKTtcblx0XHRcdFx0cmV0dXJuIHRtcERlc2NyaXB0aW9uTWFueWZlc3QuZ2V0VmFsdWVCeUhhc2godG1wT3V0cHV0T2JqZWN0LHRtcEhhc2gpO1xuXHRcdFx0fSk7XG5cblx0XHRpZiAodG1wT3BlcmF0aW9uLmhhc093blByb3BlcnR5KCdMb2cnKSAmJiB0bXBPcGVyYXRpb24uTG9nLmhhc093blByb3BlcnR5KCdQcmVPcGVyYXRpb24nKSlcblx0XHR7XG5cdFx0XHRpZiAodHlwZW9mKHRtcE9wZXJhdGlvbi5Mb2cuUHJlT3BlcmF0aW9uKSA9PSAnc3RyaW5nJylcblx0XHRcdHtcblx0XHRcdFx0dG1wT3BlcmF0aW9uLlNvbHV0aW9uQ29udGV4dC5Tb2x1dGlvbkxvZy5wdXNoKHRtcFByZWNlZGVudC5wYXJzZVN0cmluZyh0bXBPcGVyYXRpb24uTG9nLlByZU9wZXJhdGlvbikpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0bXBPcGVyYXRpb24uTG9nLlByZU9wZXJhdGlvbikpXG5cdFx0XHR7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdG1wT3BlcmF0aW9uLkxvZy5QcmVPcGVyYXRpb24ubGVuZ3RoOyBpKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoKHR5cGVvZih0bXBPcGVyYXRpb24uTG9nLlByZU9wZXJhdGlvbltpXSkgPT0gJ3N0cmluZycpKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRtcE9wZXJhdGlvbi5Tb2x1dGlvbkNvbnRleHQuU29sdXRpb25Mb2cucHVzaCh0bXBQcmVjZWRlbnQucGFyc2VTdHJpbmcodG1wT3BlcmF0aW9uLkxvZy5QcmVPcGVyYXRpb25baV0pKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBOb3cgc3RlcCB0aHJvdWdoIGVhY2ggb3BlcmF0aW9uIGFuZCBzb2x2ZVxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdG1wT3BlcmF0aW9uLlN0ZXBzLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdGxldCB0bXBTdGVwID0gdG1wT3BlcmF0aW9uLlN0ZXBzW2ldO1xuXG5cdFx0XHQvLyBJbnN0cnVjdGlvbnMgYXJlIGFsd2F5cyBlbmRwb2ludHMgLS0gdGhleSAqZG8gbm90KiByZWN1cnNlLlxuXHRcdFx0aWYgKHRtcFN0ZXAuaGFzT3duUHJvcGVydHkoJ0luc3RydWN0aW9uJykpXG5cdFx0XHR7XG5cdFx0XHRcdGxldCB0bXBJbnB1dFNjaGVtYSA9IChcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcIlNjb3BlXCI6IFwiSW5wdXRPYmplY3RcIixcblx0XHRcdFx0XHRcdFwiRGVzY3JpcHRvcnNcIjogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0bXBPcGVyYXRpb24uSW5wdXRzKSlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0Ly8gUGVyZm9ybSBzdGVwLXNwZWNpZmljIGFkZHJlc3MgbWFwcGluZ3MuXG5cdFx0XHRcdHRtcERlc2NyaXB0aW9uTWFueWZlc3Quc2NoZW1hTWFuaXB1bGF0aW9ucy5yZXNvbHZlQWRkcmVzc01hcHBpbmdzKHRtcElucHV0U2NoZW1hLkRlc2NyaXB0b3JzLCB0bXBTdGVwLklucHV0SGFzaEFkZHJlc3NNYXApO1xuXHRcdFx0XHRsZXQgdG1wSW5wdXRNYW55ZmVzdCA9IG5ldyBsaWJNYW55ZmVzdCh0bXBJbnB1dFNjaGVtYSk7XG5cdFx0XHRcdHRtcElucHV0TWFueWZlc3QuaGFzaFRyYW5zbGF0aW9ucy5hZGRUcmFuc2xhdGlvbih0bXBTb2x1dGlvbkNvbnRleHQuSW5wdXRIYXNoTWFwcGluZyk7XG5cblx0XHRcdFx0bGV0IHRtcE91dHB1dFNjaGVtYSA9IChcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcIlNjb3BlXCI6IFwiT3V0cHV0T2JqZWN0XCIsXG5cdFx0XHRcdFx0XHRcIkRlc2NyaXB0b3JzXCI6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodG1wT3BlcmF0aW9uLk91dHB1dHMpKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHRtcERlc2NyaXB0aW9uTWFueWZlc3Quc2NoZW1hTWFuaXB1bGF0aW9ucy5yZXNvbHZlQWRkcmVzc01hcHBpbmdzKHRtcE91dHB1dFNjaGVtYS5EZXNjcmlwdG9ycywgdG1wU3RlcC5PdXRwdXRIYXNoQWRkcmVzc01hcCk7XG5cdFx0XHRcdGxldCB0bXBPdXRwdXRNYW55ZmVzdCA9IG5ldyBsaWJNYW55ZmVzdCh0bXBPdXRwdXRTY2hlbWEpO1xuXHRcdFx0XHR0bXBPdXRwdXRNYW55ZmVzdC5oYXNoVHJhbnNsYXRpb25zLmFkZFRyYW5zbGF0aW9uKHRtcFNvbHV0aW9uQ29udGV4dC5PdXRwdXRIYXNoTWFwcGluZyk7XG5cdFxuXHRcdFx0XHQvLyBDb25zdHJ1Y3QgdGhlIGluc3RydWN0aW9uIHN0YXRlIG9iamVjdFxuXHRcdFx0XHRsZXQgdG1wSW5zdHJ1Y3Rpb25TdGF0ZSA9IChcblx0XHRcdFx0e1xuXHRcdFx0XHRcdEVsdWNpZGF0b3I6IHRoaXMsXG5cblx0XHRcdFx0XHROYW1lc3BhY2U6IHRtcFN0ZXAuTmFtZXNwYWNlLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0SW5zdHJ1Y3Rpb246IHRtcFN0ZXAuSW5zdHJ1Y3Rpb24udG9Mb3dlckNhc2UoKSxcblxuXHRcdFx0XHRcdE9wZXJhdGlvbjogdG1wT3BlcmF0aW9uLFxuXG5cdFx0XHRcdFx0SW5wdXRPYmplY3Q6IHRtcElucHV0T2JqZWN0LFxuXHRcdFx0XHRcdElucHV0TWFueWZlc3Q6IHRtcElucHV0TWFueWZlc3QsXG5cblx0XHRcdFx0XHRPdXRwdXRPYmplY3Q6IHRtcE91dHB1dE9iamVjdCxcblx0XHRcdFx0XHRPdXRwdXRNYW55ZmVzdDogdG1wT3V0cHV0TWFueWZlc3Rcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0aWYgKHRoaXMuaW5zdHJ1Y3Rpb25TZXRzW3RtcEluc3RydWN0aW9uU3RhdGUuTmFtZXNwYWNlXS5oYXNPd25Qcm9wZXJ0eSh0bXBJbnN0cnVjdGlvblN0YXRlLkluc3RydWN0aW9uKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxldCBmSW5zdHJ1Y3Rpb24gPSB0aGlzLmluc3RydWN0aW9uU2V0c1t0bXBJbnN0cnVjdGlvblN0YXRlLk5hbWVzcGFjZV1bdG1wSW5zdHJ1Y3Rpb25TdGF0ZS5JbnN0cnVjdGlvbl07XG5cdFx0XHRcdFx0Zkluc3RydWN0aW9uKHRtcEluc3RydWN0aW9uU3RhdGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIE9wZXJhdGlvbnMgcmVjdXJzZS5cblx0XHRcdGlmICh0bXBTdGVwLmhhc093blByb3BlcnR5KCdPcGVyYXRpb24nKSlcblx0XHRcdHtcblx0XHRcdFx0aWYgKHR5cGVvZih0bXBTdGVwLk9wZXJhdGlvbikgPT0gJ3N0cmluZycpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLnNvbHZlSW50ZXJuYWxPcGVyYXRpb24odG1wU3RlcC5OYW1lc3BhY2UsIHRtcFN0ZXAuT3BlcmF0aW9uLCB0bXBJbnB1dE9iamVjdCwgdG1wT3V0cHV0T2JqZWN0LCB0bXBEZXNjcmlwdGlvbk1hbnlmZXN0LCB0bXBTdGVwLklucHV0SGFzaEFkZHJlc3NNYXAsIHRtcFN0ZXAuT3V0cHV0SGFzaEFkZHJlc3NNYXAsIHRtcFNvbHV0aW9uQ29udGV4dCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mKHRtcFN0ZXAuT3BlcmF0aW9uKSA9PSAnb2JqZWN0Jylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIFlvdSBjYW4gZXZlbiBkZWZpbmUgYW4gaW5saW5lIG9iamVjdCBvcGVyYXRpb24hICBUaGlzIGdldHMgY3JhenkgZmFzdFxuXHRcdFx0XHRcdHRoaXMuc29sdmVPcGVyYXRpb24odG1wU3RlcC5PcGVyYXRpb24sIHRtcElucHV0T2JqZWN0LCB0bXBPdXRwdXRPYmplY3QsIHRtcERlc2NyaXB0aW9uTWFueWZlc3QsIHRtcFN0ZXAuSW5wdXRIYXNoQWRkcmVzc01hcCwgdG1wU3RlcC5PdXRwdXRIYXNoQWRkcmVzc01hcCwgdG1wU29sdXRpb25Db250ZXh0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0bXBPcGVyYXRpb24uaGFzT3duUHJvcGVydHkoJ0xvZycpICYmIHRtcE9wZXJhdGlvbi5Mb2cuaGFzT3duUHJvcGVydHkoJ1Bvc3RPcGVyYXRpb24nKSlcblx0XHR7XG5cdFx0XHRpZiAodHlwZW9mKHRtcE9wZXJhdGlvbi5Mb2cuUG9zdE9wZXJhdGlvbikgPT0gJ3N0cmluZycpXG5cdFx0XHR7XG5cdFx0XHRcdHRtcE9wZXJhdGlvbi5Tb2x1dGlvbkNvbnRleHQuU29sdXRpb25Mb2cucHVzaCh0bXBQcmVjZWRlbnQucGFyc2VTdHJpbmcodG1wT3BlcmF0aW9uLkxvZy5Qb3N0T3BlcmF0aW9uKSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChBcnJheS5pc0FycmF5KHRtcE9wZXJhdGlvbi5Mb2cuUHJlT3BlcmF0aW9uKSlcblx0XHRcdHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0bXBPcGVyYXRpb24uTG9nLlBvc3RPcGVyYXRpb24ubGVuZ3RoOyBpKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoKHR5cGVvZih0bXBPcGVyYXRpb24uTG9nLlBvc3RPcGVyYXRpb25baV0pID09ICdzdHJpbmcnKSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0bXBPcGVyYXRpb24uU29sdXRpb25Db250ZXh0LlNvbHV0aW9uTG9nLnB1c2godG1wUHJlY2VkZW50LnBhcnNlU3RyaW5nKHRtcE9wZXJhdGlvbi5Mb2cuUG9zdE9wZXJhdGlvbltpXSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0bXBTb2x1dGlvbkNvbnRleHQ7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRWx1Y2lkYXRvcjsiLCIvLyBTb2x1dGlvbiBwcm92aWRlcnMgYXJlIG1lYW50IHRvIGJlIHN0YXRlbGVzcywgYW5kIG5vdCBjbGFzc2VzLlxuLy8gVGhlc2Ugc29sdXRpb24gcHJvdmlkZXJzIGFyZSBha2luIHRvIGRyaXZlcnMsIGNvbm5lY3RpbmcgY29kZSBsaWJyYXJpZXMgb3IgXG4vLyBvdGhlciB0eXBlcyBvZiBiZWhhdmlvciB0byBtYXBwaW5nIG9wZXJhdGlvbnMuXG5cbmxldCBsaWJFbHVjaWRhdG9ySW5zdHJ1Y3Rpb25TZXQgPSByZXF1aXJlKCcuLi9FbHVjaWRhdG9yLUluc3RydWN0aW9uU2V0LmpzJyk7XG5cbmNsYXNzIEdlb21ldHJ5IGV4dGVuZHMgbGliRWx1Y2lkYXRvckluc3RydWN0aW9uU2V0XG57XG4gICAgY29uc3RydWN0b3IocEVsdWNpZGF0b3IpXG4gICAge1xuICAgICAgICBzdXBlcihwRWx1Y2lkYXRvcik7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlID0gJ0dlb21ldHJ5JztcbiAgICB9XG5cbiAgICAvLyBHZW9tZXRyeSBwcm92aWRlcyBubyBpbnN0cnVjdGlvbnNcbiAgICBpbml0aWFsaXplSW5zdHJ1Y3Rpb25zKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVPcGVyYXRpb25zKClcbiAgICB7XG4gICAgICAgIHRoaXMuYWRkT3BlcmF0aW9uKCdyZWN0YW5nbGVhcmVhJywgcmVxdWlyZShgLi9PcGVyYXRpb25zL0dlb21ldHJ5LVJlY3RhbmdsZUFyZWEuanNvbmApKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnk7IiwiLy8gU29sdXRpb24gcHJvdmlkZXJzIGFyZSBtZWFudCB0byBiZSBzdGF0ZWxlc3MsIGFuZCBub3QgY2xhc3Nlcy5cbi8vIFRoZXNlIHNvbHV0aW9uIHByb3ZpZGVycyBhcmUgYWtpbiB0byBkcml2ZXJzLCBjb25uZWN0aW5nIGNvZGUgbGlicmFyaWVzIG9yIFxuLy8gb3RoZXIgdHlwZXMgb2YgYmVoYXZpb3IgdG8gbWFwcGluZyBvcGVyYXRpb25zLlxuXG5sZXQgbGliRWx1Y2lkYXRvckluc3RydWN0aW9uU2V0ID0gcmVxdWlyZSgnLi4vRWx1Y2lkYXRvci1JbnN0cnVjdGlvblNldC5qcycpO1xuXG5sZXQgYWRkID0gKHBPcGVyYXRpb24pID0+XG57XG4gICAgLy8gVGhpcyBjb3VsZCBiZSBkb25lIGluIG9uZSBsaW5lLCBidXQsIHdvdWxkIGJlIG1vcmUgZGlmZmljdWx0IHRvIGNvbXByZWhlbmQuXG4gICAgbGV0IHRtcEEgPSBwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2EnKTtcbiAgICBsZXQgdG1wQiA9IHBPcGVyYXRpb24uSW5wdXRNYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLklucHV0T2JqZWN0LCAnYicpO1xuICAgIHBPcGVyYXRpb24uT3V0cHV0TWFueWZlc3Quc2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5PdXRwdXRPYmplY3QsICd4JywgdG1wQSArIHRtcEIpO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxubGV0IHN1YnRyYWN0ID0gKHBPcGVyYXRpb24pID0+XG57XG4gICAgLy8gVGhpcyBjb3VsZCBiZSBkb25lIGluIG9uZSBsaW5lLCBidXQsIHdvdWxkIGJlIG1vcmUgZGlmZmljdWx0IHRvIGNvbXByZWhlbmQuXG4gICAgbGV0IHRtcEEgPSBwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2EnKTtcbiAgICBsZXQgdG1wQiA9IHBPcGVyYXRpb24uSW5wdXRNYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLklucHV0T2JqZWN0LCAnYicpO1xuICAgIHBPcGVyYXRpb24uT3V0cHV0TWFueWZlc3Quc2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5PdXRwdXRPYmplY3QsICd4JywgdG1wQSAtIHRtcEIpO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxubGV0IG11bHRpcGx5ID0gKHBPcGVyYXRpb24pID0+XG57XG4gICAgLy8gVGhpcyBjb3VsZCBiZSBkb25lIGluIG9uZSBsaW5lLCBidXQsIHdvdWxkIGJlIG1vcmUgZGlmZmljdWx0IHRvIGNvbXByZWhlbmQuXG4gICAgbGV0IHRtcEEgPSBwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2EnKTtcbiAgICBsZXQgdG1wQiA9IHBPcGVyYXRpb24uSW5wdXRNYW55ZmVzdC5nZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLklucHV0T2JqZWN0LCAnYicpO1xuICAgIHBPcGVyYXRpb24uT3V0cHV0TWFueWZlc3Quc2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5PdXRwdXRPYmplY3QsICd4JywgdG1wQSAqIHRtcEIpO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxubGV0IGRpdmlkZSA9IChwT3BlcmF0aW9uKSA9Plxue1xuICAgIC8vIFRoaXMgY291bGQgYmUgZG9uZSBpbiBvbmUgbGluZSwgYnV0LCB3b3VsZCBiZSBtb3JlIGRpZmZpY3VsdCB0byBjb21wcmVoZW5kLlxuICAgIGxldCB0bXBBID0gcE9wZXJhdGlvbi5JbnB1dE1hbnlmZXN0LmdldFZhbHVlQnlIYXNoKHBPcGVyYXRpb24uSW5wdXRPYmplY3QsICdhJyk7XG4gICAgbGV0IHRtcEIgPSBwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2InKTtcbiAgICBwT3BlcmF0aW9uLk91dHB1dE1hbnlmZXN0LnNldFZhbHVlQnlIYXNoKHBPcGVyYXRpb24uT3V0cHV0T2JqZWN0LCAneCcsIHRtcEEgLyB0bXBCKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmNsYXNzIE1hdGhKYXZhc2NyaXB0IGV4dGVuZHMgbGliRWx1Y2lkYXRvckluc3RydWN0aW9uU2V0XG57XG4gICAgY29uc3RydWN0b3IocEVsdWNpZGF0b3IpXG4gICAge1xuICAgICAgICBzdXBlcihwRWx1Y2lkYXRvcik7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlID0gJ01hdGgnO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVJbnN0cnVjdGlvbnMoKVxuICAgIHtcbiAgICAgICAgdGhpcy5hZGRJbnN0cnVjdGlvbignYWRkJywgYWRkKTtcblxuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9uKCdzdWJ0cmFjdCcsIHN1YnRyYWN0KTtcbiAgICAgICAgdGhpcy5hZGRJbnN0cnVjdGlvbignc3ViJywgc3VidHJhY3QpO1xuXG4gICAgICAgIHRoaXMuYWRkSW5zdHJ1Y3Rpb24oJ211bHRpcGx5JywgbXVsdGlwbHkpO1xuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9uKCdtdWwnLCBtdWx0aXBseSk7XG5cbiAgICAgICAgdGhpcy5hZGRJbnN0cnVjdGlvbignZGl2aWRlJywgZGl2aWRlKTtcbiAgICAgICAgdGhpcy5hZGRJbnN0cnVjdGlvbignZGl2JywgZGl2aWRlKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplT3BlcmF0aW9ucygpXG4gICAge1xuICAgICAgICB0aGlzLmFkZE9wZXJhdGlvbignYWRkJywgcmVxdWlyZShgLi9PcGVyYXRpb25zL01hdGgtQWRkLmpzb25gKSk7XG4gICAgICAgIHRoaXMuYWRkT3BlcmF0aW9uKCdzdWJ0cmFjdCcsIHJlcXVpcmUoYC4vT3BlcmF0aW9ucy9NYXRoLVN1YnRyYWN0Lmpzb25gKSk7XG4gICAgICAgIHRoaXMuYWRkT3BlcmF0aW9uKCdtdWx0aXBseScsIHJlcXVpcmUoYC4vT3BlcmF0aW9ucy9NYXRoLU11bHRpcGx5Lmpzb25gKSk7XG4gICAgICAgIHRoaXMuYWRkT3BlcmF0aW9uKCdkaXZpZGUnLCByZXF1aXJlKGAuL09wZXJhdGlvbnMvTWF0aC1EaXZpZGUuanNvbmApKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWF0aEphdmFzY3JpcHQ7IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcIkRlc2NyaXB0aW9uXCI6XG5cdHtcblx0XHRcIk5hbWVzcGFjZVwiOiBcIkdlb21ldHJ5XCIsXG5cdFx0XCJPcGVyYXRpb25cIjogXCJSZWN0YW5nbGVBcmVhXCIsXG5cdFx0XCJTeW5vcHNpc1wiOiBcIlNvbHZlIGZvciB0aGUgYXJlYSBvZiBhIHJlY3RhbmdsZTogIEFyZWEgPSBXaWR0aCAqIEhlaWdodFwiXG5cdH0sXG5cblx0XCJJbnB1dHNcIjogXG5cdHtcblx0XHRcIldpZHRoXCI6IHsgXCJIYXNoXCI6XCJXaWR0aFwiLCBcIlR5cGVcIjpcIk51bWJlclwiIH0sXG5cdFx0XCJIZWlnaHRcIjogeyBcIkhhc2hcIjpcIkhlaWdodFwiLCBcIlR5cGVcIjpcIk51bWJlclwiIH1cblx0fSxcblxuXHRcIk91dHB1dHNcIjpcblx0e1xuXHRcdFwiQXJlYVwiOiB7IFwiSGFzaFwiOlwiQXJlYVwiLCBcIk5hbWVcIjogXCJBcmVhIG9mIHRoZSBSZWN0YW5nbGVcIn0sXG5cdFx0XCJSYXRpb1wiOiB7IFwiSGFzaFwiOlwiUmF0aW9cIiwgXCJOYW1lXCI6IFwiVGhlIFJhdGlvIGJldHdlZW4gdGhlIFdpZHRoIGFuZCB0aGUgSGVpZ2h0XCIgfVxuXHR9LFxuXHRcblx0XCJMb2dcIjpcblx0e1xuXHRcdFwiUHJlT3BlcmF0aW9uXCI6IFwiU29sdmUgZm9yIFsge3tOYW1lOkFyZWF9fSBdIGJhc2VkIG9uIFsge3tOYW1lOldpZHRofX0gXSBhbmQgWyB7e05hbWU6SGVpZ2h0fX0gXS5cIixcblx0XHRcIlBvc3RPcGVyYXRpb25cIjogXCJPcGVyYXRpb24gY29tcGxldGU7IFsge3tOYW1lOkFyZWF9fSBdID0ge3tJbnB1dFZhbHVlOldpZHRofX0gKiB7e0lucHV0VmFsdWU6SGVpZ2h0fX0gPSB7e091dHB1dFZhbHVlOkFyZWF9fVwiXG5cdH0sXG5cblx0XCJTdGVwc1wiOlxuXHRbXG5cdFx0e1xuXHRcdFx0XCJOYW1lc3BhY2VcIjogXCJNYXRoXCIsXG5cdFx0XHRcIkluc3RydWN0aW9uXCI6IFwibXVsdGlwbHlcIixcblx0XHRcdFwiSW5wdXRIYXNoQWRkcmVzc01hcFwiOiBcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwiYVwiOiBcIldpZHRoXCIsXG5cdFx0XHRcdFx0XCJiXCI6IFwiSGVpZ2h0XCJcblx0XHRcdFx0fSxcblx0XHRcdFwiT3V0cHV0SGFzaEFkZHJlc3NNYXBcIjpcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwieFwiOiBcIkFyZWFcIlxuXHRcdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcIk5hbWVzcGFjZVwiOiBcIk1hdGhcIixcblx0XHRcdFwiSW5zdHJ1Y3Rpb25cIjogXCJkaXZpZGVcIixcblx0XHRcdFwiSW5wdXRIYXNoQWRkcmVzc01hcFwiOiBcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwiYVwiOiBcIldpZHRoXCIsXG5cdFx0XHRcdFx0XCJiXCI6IFwiSGVpZ2h0XCJcblx0XHRcdFx0fSxcblx0XHRcdFwiT3V0cHV0SGFzaEFkZHJlc3NNYXBcIjpcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwieFwiOiBcIlJhdGlvXCJcblx0XHRcdFx0fVxuXHRcdH1cblx0XVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJEZXNjcmlwdGlvblwiOlxuXHR7XG5cdFx0XCJOYW1lc3BhY2VcIjogXCJNYXRoXCIsXG5cdFx0XCJPcGVyYXRpb25cIjogXCJBZGRcIixcblx0XHRcIlN5bm9wc2lzXCI6IFwiQWRkIHR3byBudW1iZXJzOiAgeCA9IGEgKyBiXCJcblx0fSxcblxuXHRcIklucHV0c1wiOiBcblx0e1xuXHRcdFwiYVwiOiB7IFwiSGFzaFwiOiBcImFcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfSxcblx0XHRcImJcIjogeyBcIkhhc2hcIjogXCJiXCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH1cblx0fSxcblxuXHRcIk91dHB1dHNcIjpcblx0e1xuXHRcdFwieFwiOiB7IFwiSGFzaFwiOiBcInhcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHR9LFxuXHRcblx0XCJMb2dcIjpcblx0e1xuXHRcdFwiUHJlT3BlcmF0aW9uXCI6IFwiQWRkIHt7TmFtZTphfX0gYW5kIHt7TmFtZTpifX0sIHN0b3JpbmcgdGhlIHZhbHVlIGluIHt7TmFtZTp4fX0uXCIsXG5cdFx0XCJQb3N0T3BlcmF0aW9uXCI6IFwiT3BlcmF0aW9uIGNvbXBsZXRlOiB7e05hbWU6eH19ID0ge3tJbnB1dFZhbHVlOmF9fSArIHt7SW5wdXRWYWx1ZTpifX0gPSB7e091dHB1dFZhbHVlOnh9fVwiXHRcdFxuXHR9LFxuXG5cdFwiU3RlcHNcIjpcblx0W1xuXHRcdHtcblx0XHRcdFwiTmFtZXNwYWNlXCI6IFwiTWF0aFwiLFxuXHRcdFx0XCJJbnN0cnVjdGlvblwiOiBcImFkZFwiXG5cdFx0fVxuXHRdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcIkRlc2NyaXB0aW9uXCI6XG5cdHtcblx0XHRcIk5hbWVzcGFjZVwiOiBcIk1hdGhcIixcblx0XHRcIk9wZXJhdGlvblwiOiBcIkRpdmlkZVwiLFxuXHRcdFwiU3lub3BzaXNcIjogXCJEaXZpZGUgdHdvIG51bWJlcnM6ICB4ID0gYSAvIGJcIlxuXHR9LFxuXG5cdFwiSW5wdXRzXCI6IFxuXHR7XG5cdFx0XCJhXCI6IHsgXCJIYXNoXCI6IFwiYVwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9LFxuXHRcdFwiYlwiOiB7IFwiSGFzaFwiOiBcImJcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHR9LFxuXG5cdFwiT3V0cHV0c1wiOlxuXHR7XG5cdFx0XCJ4XCI6IHsgXCJIYXNoXCI6IFwieFwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9XG5cdH0sXG5cdFxuXHRcIkxvZ1wiOlxuXHR7XG5cdFx0XCJQcmVPcGVyYXRpb25cIjogXCJEaXZpZGUge3tOYW1lOmF9fSBvdmVyIHt7TmFtZTpifX0sIHN0b3JpbmcgdGhlIHZhbHVlIGluIHt7TmFtZTp4fX0uXCIsXG5cdFx0XCJQb3N0T3BlcmF0aW9uXCI6IFwiT3BlcmF0aW9uIGNvbXBsZXRlOiB7e05hbWU6eH19ID0ge3tJbnB1dFZhbHVlOmF9fSAvIHt7SW5wdXRWYWx1ZTpifX0gPSB7e091dHB1dFZhbHVlOnh9fVwiXHRcdFxuXHR9LFxuXG5cdFwiU3RlcHNcIjpcblx0W1xuXHRcdHtcblx0XHRcdFwiTmFtZXNwYWNlXCI6IFwiTWF0aFwiLFxuXHRcdFx0XCJJbnN0cnVjdGlvblwiOiBcImRpdmlkZVwiXG5cdFx0fVxuXHRdXG59IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcIkRlc2NyaXB0aW9uXCI6XG5cdHtcblx0XHRcIk5hbWVzcGFjZVwiOiBcIk1hdGhcIixcblx0XHRcIk9wZXJhdGlvblwiOiBcIk11bHRpcGx5XCIsXG5cdFx0XCJTeW5vcHNpc1wiOiBcIk11bHRpcGx5IHR3byBudW1iZXJzOiAgeCA9IGEgKiBiXCJcblx0fSxcblxuXHRcIklucHV0c1wiOiBcblx0e1xuXHRcdFwiYVwiOiB7IFwiSGFzaFwiOiBcImFcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfSxcblx0XHRcImJcIjogeyBcIkhhc2hcIjogXCJiXCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH1cblx0fSxcblxuXHRcIk91dHB1dHNcIjpcblx0e1xuXHRcdFwieFwiOiB7IFwiSGFzaFwiOiBcInhcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHR9LFxuXHRcblx0XCJMb2dcIjpcblx0e1xuXHRcdFwiUHJlT3BlcmF0aW9uXCI6IFwiTXVsdGlwbHkge3tOYW1lOmF9fSBhbmQge3tOYW1lOmJ9fSwgc3RvcmluZyB0aGUgdmFsdWUgaW4ge3tOYW1lOnh9fS5cIixcblx0XHRcIlBvc3RPcGVyYXRpb25cIjogXCJPcGVyYXRpb24gY29tcGxldGU6IHt7TmFtZTp4fX0gPSB7e0lucHV0VmFsdWU6YX19ICoge3tJbnB1dFZhbHVlOmJ9fSA9IHt7T3V0cHV0VmFsdWU6eH19XCJcdFx0XG5cdH0sXG5cblx0XCJTdGVwc1wiOlxuXHRbXG5cdFx0e1xuXHRcdFx0XCJOYW1lc3BhY2VcIjogXCJNYXRoXCIsXG5cdFx0XHRcIkluc3RydWN0aW9uXCI6IFwibXVsdGlwbHlcIlxuXHRcdH1cblx0XVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJEZXNjcmlwdGlvblwiOlxuXHR7XG5cdFx0XCJOYW1lc3BhY2VcIjogXCJNYXRoXCIsXG5cdFx0XCJPcGVyYXRpb25cIjogXCJTdWJ0cmFjdFwiLFxuXHRcdFwiU3lub3BzaXNcIjogXCJTdWJ0cmFjdCB0d28gbnVtYmVyczogIHggPSBhIC0gYlwiXG5cdH0sXG5cblx0XCJJbnB1dHNcIjogXG5cdHtcblx0XHRcImFcIjogeyBcIkhhc2hcIjogXCJhXCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH0sXG5cdFx0XCJiXCI6IHsgXCJIYXNoXCI6IFwiYlwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9XG5cdH0sXG5cblx0XCJPdXRwdXRzXCI6XG5cdHtcblx0XHRcInhcIjogeyBcIkhhc2hcIjogXCJ4XCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH1cblx0fSxcblx0XG5cdFwiTG9nXCI6XG5cdHtcblx0XHRcIlByZU9wZXJhdGlvblwiOiBcIlN1YnRyYWN0IHt7TmFtZTphfX0gYW5kIHt7TmFtZTpifX0sIHN0b3JpbmcgdGhlIHZhbHVlIGluIHt7TmFtZTp4fX0uXCIsXG5cdFx0XCJQb3N0T3BlcmF0aW9uXCI6IFwiT3BlcmF0aW9uIGNvbXBsZXRlOiB7e05hbWU6eH19ID0ge3tJbnB1dFZhbHVlOmF9fSAtIHt7SW5wdXRWYWx1ZTpifX0gPSB7e091dHB1dFZhbHVlOnh9fVwiXHRcdFxuXHR9LFxuXG5cdFwiU3RlcHNcIjpcblx0W1xuXHRcdHtcblx0XHRcdFwiTmFtZXNwYWNlXCI6IFwiTWF0aFwiLFxuXHRcdFx0XCJJbnN0cnVjdGlvblwiOiBcInN1YnRyYWN0XCJcblx0XHR9XG5cdF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwiRGVzY3JpcHRpb25cIjpcblx0e1xuXHRcdFwiTmFtZXNwYWNlXCI6IFwiUHJlY2lzZU1hdGhcIixcblx0XHRcIk9wZXJhdGlvblwiOiBcIkFkZFwiLFxuXHRcdFwiU3lub3BzaXNcIjogXCJQcmVjaXNlbHkgYWRkIHR3byBudW1iZXJzOiAgeCA9IGEgKyBiXCJcblx0fSxcblxuXHRcIklucHV0c1wiOiBcblx0e1xuXHRcdFwiYVwiOiB7IFwiSGFzaFwiOiBcImFcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfSxcblx0XHRcImJcIjogeyBcIkhhc2hcIjogXCJiXCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH1cblx0fSxcblxuXHRcIk91dHB1dHNcIjpcblx0e1xuXHRcdFwieFwiOiB7IFwiSGFzaFwiOiBcInhcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHR9LFxuXHRcblx0XCJMb2dcIjpcblx0e1xuXHRcdFwiUHJlT3BlcmF0aW9uXCI6IFwiQWRkIHt7TmFtZTphfX0gYW5kIHt7TmFtZTpifX0sIHN0b3JpbmcgdGhlIHZhbHVlIGluIHt7TmFtZTp4fX0uXCIsXG5cdFx0XCJQb3N0T3BlcmF0aW9uXCI6IFwiT3BlcmF0aW9uIGNvbXBsZXRlOiB7e05hbWU6eH19ID0ge3tJbnB1dFZhbHVlOmF9fSArIHt7SW5wdXRWYWx1ZTpifX0gPSB7e091dHB1dFZhbHVlOnh9fVwiXHRcdFxuXHR9LFxuXG5cdFwiU3RlcHNcIjpcblx0W1xuXHRcdHtcblx0XHRcdFwiTmFtZXNwYWNlXCI6IFwiUHJlY2lzZU1hdGhcIixcblx0XHRcdFwiSW5zdHJ1Y3Rpb25cIjogXCJhZGRcIlxuXHRcdH1cblx0XVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJEZXNjcmlwdGlvblwiOlxuXHR7XG5cdFx0XCJOYW1lc3BhY2VcIjogXCJQcmVjaXNlTWF0aFwiLFxuXHRcdFwiT3BlcmF0aW9uXCI6IFwiRGl2aWRlXCIsXG5cdFx0XCJTeW5vcHNpc1wiOiBcIlByZWNpc2VseSBkaXZpZGUgdHdvIG51bWJlcnM6ICB4ID0gYSAvIGJcIlxuXHR9LFxuXG5cdFwiSW5wdXRzXCI6IFxuXHR7XG5cdFx0XCJhXCI6IHsgXCJIYXNoXCI6IFwiYVwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9LFxuXHRcdFwiYlwiOiB7IFwiSGFzaFwiOiBcImJcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHR9LFxuXG5cdFwiT3V0cHV0c1wiOlxuXHR7XG5cdFx0XCJ4XCI6IHsgXCJIYXNoXCI6IFwieFwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9XG5cdH0sXG5cdFxuXHRcIkxvZ1wiOlxuXHR7XG5cdFx0XCJQcmVPcGVyYXRpb25cIjogXCJEaXZpZGUge3tOYW1lOmF9fSBvdmVyIHt7TmFtZTpifX0sIHN0b3JpbmcgdGhlIHZhbHVlIGluIHt7TmFtZTp4fX0uXCIsXG5cdFx0XCJQb3N0T3BlcmF0aW9uXCI6IFwiT3BlcmF0aW9uIGNvbXBsZXRlOiB7e05hbWU6eH19ID0ge3tJbnB1dFZhbHVlOmF9fSAvIHt7SW5wdXRWYWx1ZTpifX0gPSB7e091dHB1dFZhbHVlOnh9fVwiXHRcdFxuXHR9LFxuXG5cdFwiU3RlcHNcIjpcblx0W1xuXHRcdHtcblx0XHRcdFwiTmFtZXNwYWNlXCI6IFwiUHJlY2lzZU1hdGhcIixcblx0XHRcdFwiSW5zdHJ1Y3Rpb25cIjogXCJkaXZpZGVcIlxuXHRcdH1cblx0XVxufSIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJEZXNjcmlwdGlvblwiOlxuXHR7XG5cdFx0XCJOYW1lc3BhY2VcIjogXCJQcmVjaXNlTWF0aFwiLFxuXHRcdFwiT3BlcmF0aW9uXCI6IFwiTXVsdGlwbHlcIixcblx0XHRcIlN5bm9wc2lzXCI6IFwiUHJlY2lzZWx5IG11bHRpcGx5IHR3byBudW1iZXJzOiAgeCA9IGEgKiBiXCJcblx0fSxcblxuXHRcIklucHV0c1wiOiBcblx0e1xuXHRcdFwiYVwiOiB7IFwiSGFzaFwiOiBcImFcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfSxcblx0XHRcImJcIjogeyBcIkhhc2hcIjogXCJiXCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH1cblx0fSxcblxuXHRcIk91dHB1dHNcIjpcblx0e1xuXHRcdFwieFwiOiB7IFwiSGFzaFwiOiBcInhcIiwgXCJUeXBlXCI6IFwiTnVtYmVyXCIgfVxuXHR9LFxuXHRcblx0XCJMb2dcIjpcblx0e1xuXHRcdFwiUHJlT3BlcmF0aW9uXCI6IFwiTXVsdGlwbHkge3tOYW1lOmF9fSBhbmQge3tOYW1lOmJ9fSwgc3RvcmluZyB0aGUgdmFsdWUgaW4ge3tOYW1lOnh9fS5cIixcblx0XHRcIlBvc3RPcGVyYXRpb25cIjogXCJPcGVyYXRpb24gY29tcGxldGU6IHt7TmFtZTp4fX0gPSB7e0lucHV0VmFsdWU6YX19ICoge3tJbnB1dFZhbHVlOmJ9fSA9IHt7T3V0cHV0VmFsdWU6eH19XCJcdFx0XG5cdH0sXG5cblx0XCJTdGVwc1wiOlxuXHRbXG5cdFx0e1xuXHRcdFx0XCJOYW1lc3BhY2VcIjogXCJQcmVjaXNlTWF0aFwiLFxuXHRcdFx0XCJJbnN0cnVjdGlvblwiOiBcIm11bHRpcGx5XCJcblx0XHR9XG5cdF1cbn0iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwiRGVzY3JpcHRpb25cIjpcblx0e1xuXHRcdFwiTmFtZXNwYWNlXCI6IFwiUHJlY2lzZU1hdGhcIixcblx0XHRcIk9wZXJhdGlvblwiOiBcIlN1YnRyYWN0XCIsXG5cdFx0XCJTeW5vcHNpc1wiOiBcIlByZWNpc2VseSBzdWJ0cmFjdCB0d28gbnVtYmVyczogIHggPSBhIC0gYlwiXG5cdH0sXG5cblx0XCJJbnB1dHNcIjogXG5cdHtcblx0XHRcImFcIjogeyBcIkhhc2hcIjogXCJhXCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH0sXG5cdFx0XCJiXCI6IHsgXCJIYXNoXCI6IFwiYlwiLCBcIlR5cGVcIjogXCJOdW1iZXJcIiB9XG5cdH0sXG5cblx0XCJPdXRwdXRzXCI6XG5cdHtcblx0XHRcInhcIjogeyBcIkhhc2hcIjogXCJ4XCIsIFwiVHlwZVwiOiBcIk51bWJlclwiIH1cblx0fSxcblx0XG5cdFwiTG9nXCI6XG5cdHtcblx0XHRcIlByZU9wZXJhdGlvblwiOiBcIlN1YnRyYWN0IHt7TmFtZTphfX0gYW5kIHt7TmFtZTpifX0sIHN0b3JpbmcgdGhlIHZhbHVlIGluIHt7TmFtZTp4fX0uXCIsXG5cdFx0XCJQb3N0T3BlcmF0aW9uXCI6IFwiT3BlcmF0aW9uIGNvbXBsZXRlOiB7e05hbWU6eH19ID0ge3tJbnB1dFZhbHVlOmF9fSAtIHt7SW5wdXRWYWx1ZTpifX0gPSB7e091dHB1dFZhbHVlOnh9fVwiXHRcdFxuXHR9LFxuXG5cdFwiU3RlcHNcIjpcblx0W1xuXHRcdHtcblx0XHRcdFwiTmFtZXNwYWNlXCI6IFwiUHJlY2lzZU1hdGhcIixcblx0XHRcdFwiSW5zdHJ1Y3Rpb25cIjogXCJzdWJ0cmFjdFwiXG5cdFx0fVxuXHRdXG59IiwibGV0IGxpYkVsdWNpZGF0b3JJbnN0cnVjdGlvblNldCA9IHJlcXVpcmUoJy4uL0VsdWNpZGF0b3ItSW5zdHJ1Y3Rpb25TZXQuanMnKTtcblxuY29uc3QgbGliRGVjaW1hbCA9IHJlcXVpcmUoJ2RlY2ltYWwuanMnKTtcblxubGV0IGFkZCA9IChwT3BlcmF0aW9uKSA9Plxue1xuICAgIC8vIFRoaXMgY291bGQgYmUgZG9uZSBpbiBvbmUgbGluZSwgYnV0LCB3b3VsZCBiZSBtb3JlIGRpZmZpY3VsdCB0byBjb21wcmVoZW5kLlxuICAgIGxldCB0bXBBID0gbmV3IGxpYkRlY2ltYWwocE9wZXJhdGlvbi5JbnB1dE1hbnlmZXN0LmdldFZhbHVlQnlIYXNoKHBPcGVyYXRpb24uSW5wdXRPYmplY3QsICdhJykpO1xuICAgIGxldCB0bXBCID0gbmV3IGxpYkRlY2ltYWwocE9wZXJhdGlvbi5JbnB1dE1hbnlmZXN0LmdldFZhbHVlQnlIYXNoKHBPcGVyYXRpb24uSW5wdXRPYmplY3QsICdiJykpO1xuICAgIHBPcGVyYXRpb24uT3V0cHV0TWFueWZlc3Quc2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5PdXRwdXRPYmplY3QsICd4JywgdG1wQS5wbHVzKHRtcEIpLnRvU3RyaW5nKCkpO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxubGV0IHN1YnRyYWN0ID0gKHBPcGVyYXRpb24pID0+XG57XG4gICAgLy8gVGhpcyBjb3VsZCBiZSBkb25lIGluIG9uZSBsaW5lLCBidXQsIHdvdWxkIGJlIG1vcmUgZGlmZmljdWx0IHRvIGNvbXByZWhlbmQuXG4gICAgbGV0IHRtcEEgPSBuZXcgbGliRGVjaW1hbChwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2EnKSk7XG4gICAgbGV0IHRtcEIgPSBuZXcgbGliRGVjaW1hbChwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2InKSk7XG4gICAgcE9wZXJhdGlvbi5PdXRwdXRNYW55ZmVzdC5zZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLk91dHB1dE9iamVjdCwgJ3gnLCB0bXBBLnN1Yih0bXBCKS50b1N0cmluZygpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmxldCBtdWx0aXBseSA9IChwT3BlcmF0aW9uKSA9Plxue1xuICAgIC8vIFRoaXMgY291bGQgYmUgZG9uZSBpbiBvbmUgbGluZSwgYnV0LCB3b3VsZCBiZSBtb3JlIGRpZmZpY3VsdCB0byBjb21wcmVoZW5kLlxuICAgIGxldCB0bXBBID0gbmV3IGxpYkRlY2ltYWwocE9wZXJhdGlvbi5JbnB1dE1hbnlmZXN0LmdldFZhbHVlQnlIYXNoKHBPcGVyYXRpb24uSW5wdXRPYmplY3QsICdhJykpO1xuICAgIGxldCB0bXBCID0gbmV3IGxpYkRlY2ltYWwocE9wZXJhdGlvbi5JbnB1dE1hbnlmZXN0LmdldFZhbHVlQnlIYXNoKHBPcGVyYXRpb24uSW5wdXRPYmplY3QsICdiJykpO1xuICAgIHBPcGVyYXRpb24uT3V0cHV0TWFueWZlc3Quc2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5PdXRwdXRPYmplY3QsICd4JywgdG1wQS5tdWwodG1wQikudG9TdHJpbmcoKSk7XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5sZXQgZGl2aWRlID0gKHBPcGVyYXRpb24pID0+XG57XG4gICAgLy8gVGhpcyBjb3VsZCBiZSBkb25lIGluIG9uZSBsaW5lLCBidXQsIHdvdWxkIGJlIG1vcmUgZGlmZmljdWx0IHRvIGNvbXByZWhlbmQuXG4gICAgbGV0IHRtcEEgPSBuZXcgbGliRGVjaW1hbChwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2EnKSk7XG4gICAgbGV0IHRtcEIgPSBuZXcgbGliRGVjaW1hbChwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2InKSk7XG4gICAgcE9wZXJhdGlvbi5PdXRwdXRNYW55ZmVzdC5zZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLk91dHB1dE9iamVjdCwgJ3gnLCB0bXBBLmRpdih0bXBCKS50b1N0cmluZygpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmxldCB0b0ZyYWN0aW9uID0gKHBPcGVyYXRpb24pID0+XG57XG4gICAgLy8gVGhpcyBjb3VsZCBiZSBkb25lIGluIG9uZSBsaW5lLCBidXQsIHdvdWxkIGJlIG1vcmUgZGlmZmljdWx0IHRvIGNvbXByZWhlbmQuXG4gICAgbGV0IHRtcEEgPSBuZXcgbGliRGVjaW1hbChwT3BlcmF0aW9uLklucHV0TWFueWZlc3QuZ2V0VmFsdWVCeUhhc2gocE9wZXJhdGlvbi5JbnB1dE9iamVjdCwgJ2EnKSk7XG4gICAgcE9wZXJhdGlvbi5PdXRwdXRNYW55ZmVzdC5zZXRWYWx1ZUJ5SGFzaChwT3BlcmF0aW9uLk91dHB1dE9iamVjdCwgJ3gnLCB0bXBBLnRvRnJhY3Rpb24oKS50b1N0cmluZygpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cblxuY2xhc3MgUHJlY2lzZU1hdGggZXh0ZW5kcyBsaWJFbHVjaWRhdG9ySW5zdHJ1Y3Rpb25TZXRcbntcbiAgICBjb25zdHJ1Y3RvcihwRWx1Y2lkYXRvcilcbiAgICB7XG4gICAgICAgIHN1cGVyKHBFbHVjaWRhdG9yKTtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2UgPSAnUHJlY2lzZU1hdGgnO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVJbnN0cnVjdGlvbnMoKVxuICAgIHtcbiAgICAgICAgdGhpcy5hZGRJbnN0cnVjdGlvbignYWRkJywgYWRkKTtcblxuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9uKCdzdWJ0cmFjdCcsIHN1YnRyYWN0KTtcbiAgICAgICAgdGhpcy5hZGRJbnN0cnVjdGlvbignc3ViJywgc3VidHJhY3QpO1xuXG4gICAgICAgIHRoaXMuYWRkSW5zdHJ1Y3Rpb24oJ211bHRpcGx5JywgbXVsdGlwbHkpO1xuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9uKCdtdWwnLCBtdWx0aXBseSk7XG5cbiAgICAgICAgdGhpcy5hZGRJbnN0cnVjdGlvbignZGl2aWRlJywgZGl2aWRlKTtcbiAgICAgICAgdGhpcy5hZGRJbnN0cnVjdGlvbignZGl2JywgZGl2aWRlKTtcblxuXHRcdHRoaXMuYWRkSW5zdHJ1Y3Rpb24oJ3RvZnJhY3Rpb24nLCB0b0ZyYWN0aW9uKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplT3BlcmF0aW9ucygpXG4gICAge1xuICAgICAgICB0aGlzLmFkZE9wZXJhdGlvbignYWRkJywgcmVxdWlyZShgLi9PcGVyYXRpb25zL1ByZWNpc2VNYXRoLUFkZC5qc29uYCkpO1xuICAgICAgICB0aGlzLmFkZE9wZXJhdGlvbignc3VidHJhY3QnLCByZXF1aXJlKGAuL09wZXJhdGlvbnMvUHJlY2lzZU1hdGgtU3VidHJhY3QuanNvbmApKTtcbiAgICAgICAgdGhpcy5hZGRPcGVyYXRpb24oJ211bHRpcGx5JywgcmVxdWlyZShgLi9PcGVyYXRpb25zL1ByZWNpc2VNYXRoLU11bHRpcGx5Lmpzb25gKSk7XG4gICAgICAgIHRoaXMuYWRkT3BlcmF0aW9uKCdkaXZpZGUnLCByZXF1aXJlKGAuL09wZXJhdGlvbnMvUHJlY2lzZU1hdGgtRGl2aWRlLmpzb25gKSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByZWNpc2VNYXRoOyJdfQ==
