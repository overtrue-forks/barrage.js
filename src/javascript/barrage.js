/**
 * Barrage for JavaScript.
 *
 * @author artisan.
 * @Date(2015-12-15)
 */

var Barrage = function (options) {
  var defaults = {
    loop: true,
    time: {
      min: 5000,
      max: 10000
    },
    subtitle: [],         // Subtitle
    maxLength: 5,         // Max length
    color: [],            // Color
    theme: 'default',     // Theme
    container: null       // Container
  };

  this.options = $.extend({}, defaults, options);

  /**
   * Mapping subtitle.
   *
   * @type {Array}
   */
  this.subtitle = this.options.subtitle;


  /**
   * Backup subtitle.
   * 
   * @type {Array}
   */
  this.backup = $.extend(true, [], this.options.subtitle);

  /**
   * Define summary.
   * 
   * @type {Number}
   */
  this.summary = 1;

  /**
   * Barrage container.
   * @type {Object}
   */
  this.$container = $(this.options.container);

  this.store = [];

  this.event();
  this._runner();
};

Barrage.prototype.event = function () {
  this.$container.on('barrage:shift', this._shift.apply(this));
};

Barrage.prototype.start = function () {
  var $subtitle = this.$container.find('.barrage-subtitle'),
      $element = null, config;

  $subtitle.each(function (index, element) {
    $element = $(element);

    // Get cache object.
    config = $element.data();

    $element.animate({
      left: config.backup.point
    }, config.backup.time, 'linear');
  });
};

Barrage.prototype._shift = function () {
  var that = this;
  return function () {
    that.store.shift();
  };
};

Barrage.prototype.pause = function () {
  return this.$container.find('.barrage-subtitle').stop();
};

Barrage.prototype._runner = function () {

  this.summary--;

  // Is loop mode.
  if (this.options.loop) {
    if (this.subtitle.length === 0) {
      // Copy subtitle.
      this.subtitle = $.extend(true, [], this.backup);
    }
  }

  if (this.subtitle.length === 0) {
    return false;
  }

  this.$container.trigger('barrage:shift');

  var subtitle = null, i = 0, config,
      options = this.options,

      // Mapping variable from options.
      maxLength = options.maxLength,
      color = options.color,
      time = options.time,

      /// Cache container height.
      $height = this.$container.height(),
      
      // Increment. splice the subtitle.
      increment = 0;

  for (; i < maxLength; i++) {
    subtitle = this.subtitle[ i ];

    if (this.summary >= maxLength) {
      continue; // Can not append child any more.
    }

    increment++;

    config = {
      subtitle: subtitle,
      color: color[this.random(0, color.length - 1)],
      time: this.random(time.min, time.max),
      container: this.$container,
      fontSize: this.random(14, 20),
      top: this.unique($height / 2, 15),
      callback: this._runner
    };

    new Subtitle(config, this);
    this.summary++;
  }

  this.subtitle.splice(0, increment);
};

Barrage.prototype.random = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

Barrage.prototype._hasNear = function (store, refer, offset) {
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
 * @param  {Number} min min.
 * @param  {Number} max max.
 * @return {[type]}     [description]
 */
Barrage.prototype.unique = function (min, max) {
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

Barrage.prototype.destroy = function() {
  this.options = null;
  this.summary = null;
  this.$container = null;
  this.backup = null;
};
