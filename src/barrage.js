/**
 * Barrage for JavaScript.
 *
 * @author artisan <codes.artisan@gmail.com>
 */

(function($){
  /**
   * Random a number by given range.
   *
   * @param  {Number} min min.
   * @param  {Number} max max.
   * @return {Number}     random.
   */
  var randomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  /**
   * Barrage
   *
   * @param {Object} options
   */
  function Barrage (options) {
    var defaults = {
      loop: false,
      timeRange: {
        min: 5000,
        max: 10000
      },
      css: {},
      barrages: [],          // barrages
      parallel: 5,         // Max length
      colors: [],            // Colors
      container: null       // Container
    };

    this.options = $.extend({}, defaults, options);

    /**
     * Mapping barrage.
     *
     * @type {Array}
     */
    this.barrages = this.options.barrages;


    /**
     * Backup barrage.
     *
     * @type {Array}
     */
    this.backup = $.extend(true, [], this.options.barrages);

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
  Barrage.prototype.start = function () {
    var $barrage = this.$container.find('.barrage-item'),
        $element = null, config = {}, surplus = 0;

    $barrage.stop().each(function (index, element) {
      $element = $(element);

      // Get cache object.
      config = $element.data('config');
      surplus = $element.data('surplus');

      surplus = surplus ? surplus : config.timeRange;

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
  Barrage.prototype.pause = function () {
    var $elements = this.$container.find('.barrage-item'),
        $element = null, surplus = null, startTime = null,
        millisecond = new Date().getTime(),
        config = {};

    $elements.each(function (index, element) {
      $element = $(element);
      now = new Date().getTime();
      config = $element.data('config');

      surplus =  config.timeRange - (millisecond - config.startTime);

      $element.data('surplus', surplus).stop();
    });
  };

  /**
   * Insert some barrage to store.
   *
   * @param  {Array} barrage Barrage.
   * @return {Array}         Inserted barrage.
   */
  Barrage.prototype.insert = function (barrage) {
    return this.barrages = this.barrages.concat(barrage);
  };

  Barrage.prototype._runner = function () {

    this.summary--;

    // Is loop mode.
    if (this.options.loop) {
      if (this.barrages.length === 0) {
        // Copy barrage.
        this.barrages = $.extend(true, [], this.backup);
      }
    }

    if (this.barrages.length === 0) {
      return false;
    }

    this.store.shift();

    var barrage = null, i = 0, config,
        options = this.options,

        // Mapping variable from options.
        parallel = options.parallel,
        colors = options.colors,
        timeRange = options.timeRange,

        /// Cache container height.
        $height = this.$container.height(),

        // Increment. splice the barrage.
        increment = 0;

    if ($height >= $(window).height()) {
      $height = $(window).height();
    }

    for (; i < parallel; i++) {
      barrage = this.barrages[ i ];

      if (this.summary >= parallel) {
        continue; // Can not append child any more.
      }

      increment++;

      config = {
        barrage: barrage,
        time: randomNumber(timeRange.min, timeRange.max),
        container: this.$container,
        callback: this._runner,
        css: $.extend(true, {
          color: colors[randomNumber(0, colors.length - 1)],
          fontSize: randomNumber(14, 20),
          top: this.uniqueTop($height / 2, 15),
        }, this.options.css)
      };

      new BarrageBuilder(config, this);
      this.summary++;
    }

    this.barrages.splice(0, increment);
  };

  /**
   * Search nearly number from store.
   *
   * @param  {Array}    store   store.
   * @param  {Number}   refer   refer.
   * @param  {Number}   offset  offset.
   * @return {Number}           index.
   */
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
   * Generate a uniqueTop.
   *
   * @param  {Number} min min.
   * @param  {Number} max max.
   * @return {Number}     random.
   */
  Barrage.prototype.uniqueTop = function (min, max) {
    var parallel = this.options.parallel,
        random    = 0,
        hasNear   = -1;

    if ($.isNumeric(parallel)) {
      if (this.store.length === parallel) {
        return random;
      }

      random = randomNumber(min, max);
      hasNear = this._hasNear(this.store, random, 20);

      if (hasNear !== -1) {
        return this.uniqueTop(min, max);
      }

      this.store.push(random);
      return random;
    }

    return random;
  };

  Barrage.prototype.destroy = function() {
    this.$container.find('.barrage-item').remove();
    this.options = null;
    this.summary = null;
    this.$container = null;
    this.backup = null;
  };


  /**
   * Barrage builder for Barrage component.
   *
   * @author artisan.
   * @Date(2015-12-15)
   */

  function BarrageBuilder(options, context) {
    var defaults = {
      css: {
        position: 'absolute',
        top: 0,
        fontSize: 14,
        color: '#333',
        zIndex: 99999999,
        whiteSpace: "nowrap"
      },
      barrage: '',
      time: 5000,
      container: window,
      callback: null,
    };

    /**
     * Cache callback context.
     *
     * @type {Object}
     */
    this.context = context;

    this.options = $.extend(true, defaults, options);

    this.element = null;

    /**
     * jQuery element.
     *
     * @type {Object}
     */
    this.$container = $(this.options.container);

    this.initialize();
  }

  BarrageBuilder.prototype.initialize = function () {
    this.options.css.left = this.$container.width() + randomNumber(0, 200);
    this.element = this.generator(this.options); // Generate element.
    this.$container.append(this.element);

    this.animation(-this.element.width(), this.options.time);
  };

  /**
   * Animate to given point.
   *
   * @param  {Number} point Move to point.
   * @param  {Number} time  millisecond
   * @return {Undefined}
   */
  BarrageBuilder.prototype.animation = function (point, time) {
    var that = this,

        // Cache callback.
        callback = this.options.callback,

        // On animation finish...
        onFinish = function () {
          return function () {
            that.destroy();
            if ($.isFunction(callback)) {
              callback.apply(that.context);
            }
          }
        };

    // Bind context.
    onFinish = onFinish.apply(this);

    this.element.animate({
          left: point
        }, time, 'linear', onFinish)
        .data('config', {
          startTime: new Date().getTime(),
          time: time,
          point: point,
          destroy: onFinish
        });
  };

  /**
   * Create subtitle element.
   *
   * @param  {Object} attr Attributes.
   * @return {Object}      jQuery element.
   */
  BarrageBuilder.prototype.generator = function (attr) {
    return $('<span class="barrage-item">'+ attr.barrage +'</span>').css(attr.css);
  };

  /**
   * Destroy object.
   *
   * @return {Undefined}
   */
  BarrageBuilder.prototype.destroy = function () {
    this.element.remove();
    this.element = null;
    this.options = null;
    this.$container = null;
  };

  window.Barrage = Barrage;

  $.fn.barrage = function($options){
      return new Barrage($options);
  };
}(jQuery))
