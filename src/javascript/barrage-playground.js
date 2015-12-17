/**
 * Barrage for JavaScript.
 *
 * @author artisan.
 * @Date(2015-12-15)
 */

function BarragePlayground (options) {
  var defaults = {
    loop: false,
    time: {
      min: 5000,
      max: 10000
    },
    barrage: [],          // barrage
    maxLength: 5,         // Max length
    color: [],            // Color
    container: null       // Container
  };

  this.options = $.extend({}, defaults, options);

  /**
   * Mapping barrage.
   *
   * @type {Array}
   */
  this.barrage = this.options.barrage;


  /**
   * Backup barrage.
   * 
   * @type {Array}
   */
  this.backup = $.extend(true, [], this.options.barrage);

  /**
   * Define summary.
   * 
   * @type {Number}
   */
  this.summary = 1;

  /**
   * Barrage container.
   * 
   * @type {Object}
   */
  this.$container = $(this.options.container);

  this.store = [];
  
  this._runner();
};

/**
 * Start animate.
 * 
 * @return {Undefined}
 */
BarragePlayground.prototype.start = function () {
  var $barrage = this.$container.find('.barrage-builder'),
      $element = null, config = {}, surplus = 0;

  $barrage.stop().each(function (index, element) {
    $element = $(element);

    // Get cache object.
    config = $element.data('config');
    surplus = $element.data('surplus');

    surplus = surplus ? surplus : config.time;

    $element.animate({
      left: config.point
    }, surplus, 'linear',
      config.destroy);
  });
};

/**
 * Stop builder element animate.
 * 
 * @return {Undefined}
 */
BarragePlayground.prototype.pause = function () {
  var $elements = this.$container.find('.barrage-builder'),
      $element = null, surplus = null, startTime = null,
      millisecond = new Date().getTime(),
      config = {};

  $elements.each(function (index, element) {
    $element = $(element);
    now = new Date().getTime();
    config = $element.data('config');

    surplus =  config.time - (millisecond - config.startTime);

    $element.data('surplus', surplus).stop();
  });
};

/**
 * Insert some barrage to store.
 * 
 * @param  {Array} barrage Barrage.
 * @return {Array}         Inserted barrage.
 */
BarragePlayground.prototype.insert = function (barrage) {
  return this.barrage = this.barrage.concat(barrage);
};

BarragePlayground.prototype._runner = function () {

  this.summary--;

  // Is loop mode.
  if (this.options.loop) {
    if (this.barrage.length === 0) {
      // Copy barrage.
      this.barrage = $.extend(true, [], this.backup);
    }
  }

  if (this.barrage.length === 0) {
    return false;
  }

  this.store.shift();

  var barrage = null, i = 0, config,
      options = this.options,

      // Mapping variable from options.
      maxLength = options.maxLength,
      color = options.color,
      time = options.time,

      /// Cache container height.
      $height = this.$container.height(),
      
      // Increment. splice the barrage.
      increment = 0;

  for (; i < maxLength; i++) {
    barrage = this.barrage[ i ];

    if (this.summary >= maxLength) {
      continue; // Can not append child any more.
    }

    increment++;

    config = {
      barrage: barrage,
      color: color[this.random(0, color.length - 1)],
      time: this.random(time.min, time.max),
      container: this.$container,
      fontSize: this.random(14, 20),
      top: this.unique($height / 2, 15),
      callback: this._runner
    };

    new BarrageBuilder(config, this);
    this.summary++;
  }

  this.barrage.splice(0, increment);
};

/**
 * Random a number by given range.
 * 
 * @param  {Number} min min.
 * @param  {Number} max max.
 * @return {Number}     random.
 */
BarragePlayground.prototype.random = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Search nearly number from store.
 * 
 * @param  {Array}    store   store.
 * @param  {Number}   refer   refer.
 * @param  {Number}   offset  offset.
 * @return {Number}           index.
 */
BarragePlayground.prototype._hasNear = function (store, refer, offset) {
  var position = -1,
      result = null;

  if ($.isArray(store)) {
    $.each(store, function (index, item) {
      result = Math.abs(item - refer);

      if (result <= offset) {
        position = index;
        return false;
      }
    });
  }

  return position;
};

/**
 * Generate a unique.
 * 
 * @param  {Number} min min.
 * @param  {Number} max max.
 * @return {Number}     random.
 */
BarragePlayground.prototype.unique = function (min, max) {
  var maxLength = this.options.maxLength,
      random    = 0,
      hasNear   = -1;

  if ($.isNumeric(maxLength)) {
    if (this.store.length === maxLength) {
      return random;
    }

    random = this.random(min, max);
    hasNear = this._hasNear(this.store, random, 20);

    if (hasNear !== -1) {
      return this.unique(min, max);
    }

    this.store.push(random);
    return random;
  }

  return random;
};

BarragePlayground.prototype.destroy = function() {
  this.options = null;
  this.summary = null;
  this.$container = null;
  this.backup = null;
};
