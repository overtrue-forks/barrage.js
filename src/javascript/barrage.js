/**
 * Barrage for JavaScript.
 *
 * @author artisan.
 * @Date(2015-12-15)
 */

var Barrage = function (options) {
  var defaults = {
    loop: true,
    subtitle: [],         // Subtitle
    maxLength: 5,      // Max length
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

  this._runner();
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
    }, config.backup.time,
      'linear', config.destroy);
  });
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

  var subtitle = null, i = 0, config,
      options = this.options,

      // Mapping variable from options.
      maxLength = options.maxLength,
      color = options.color,

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
      time: this.random(5000, 10000),
      container: this.$container,
      fontSize: this.random(14, 20),
      top: this.random($height / 2, 20),
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

Barrage.prototype.unique = function () {
  var millisecond = new Date().getTime() + '';
  return parseInt(millisecond.split('').reverse().splice(0, 2).join(''));
};

Barrage.prototype.destroy = function() {
  this.options = null;
  this.summary = null;
  this.$container = null;
  this.backup = null;
};
