/**
 * Barrage builder for Barrage component.
 * 
 * @author artisan.
 * @Date(2015-12-15)
 */

function BarrageBuilder(options, context) {
  var defaults = {
    top: 0,
    fontSize: 14,
    color: '#333',
    barrage: '',
    time: 5000,
    container: null,
    callback: null
  };

  /**
   * Cache callback context.
   * 
   * @type {Object}
   */
  this.context = context;

  this.options = $.extend({}, defaults, options);

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
  this.options.left = this.$container.width();

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
  return $('<span class="barrage-builder" style="top: '+ attr.top +'px; left: '+ attr.left +'px; font-size:'+ attr.fontSize +'; color:'+ attr.color +';">'+ attr.barrage +'</span>');
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
