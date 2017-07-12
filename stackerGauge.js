class StackerGaugeSettings {
  constructor() {
    this.minValue = 0, // The gauge minimum value.
      this.maxValue = 100, // The gauge maximum value.
      this.cornerRoundingX = 10,
      this.cornerRoundingY = 10,
      this.barBoxPadding = 3,
      this.barPadding = 3,
      this.color = '#333', // The color of the outer circle.
      this.vertical = true,
      this.textLeftTop = true,
      this.textPx = 20,
      this.barThickness = 2,
      this.valuePrefix = '',
      this.valuePostfix = '',
      this.valueAnimateTime = 1000
  }
}

class StackerGauge {
  constructor(elementId, label, value, config) {
    this.elementId = elementId
    this.label = label
    this.config = config instanceof StackerGaugeSettings ? config : new StackerGaugeSettings()
    this.value = Math.min(this.config.maxValue, Math.max(this.config.minValue, value))
    this.render = this.render.bind(this)
  }
  render() {
    const config = this.config
    const value = this.value
    const stacker = d3.select(`#${this.elementId}`)
    const stackerWidth = parseInt(stacker.style('width'))
    const stackerHeight = parseInt(stacker.style('height'))

    const barBoxX = config.vertical ? (config.textLeftTop ? config.barBoxPadding + config.textPx : config.barBoxPadding) : config.barBoxPadding
    const barBoxY = config.vertical ? config.barBoxPadding : (config.textLeftTop ? config.barBoxPadding + config.textPx : config.barBoxPadding)
    const barBoxHeight = config.vertical ? (stackerHeight - config.barBoxPadding * 2) : (stackerHeight - config.textPx - config.barBoxPadding * 2)
    const barBoxWidth = config.vertical ? (stackerWidth - config.textPx - config.barBoxPadding * 2) : (stackerWidth - config.barBoxPadding * 2)
    const barClipPathBoxX = barBoxX + config.barPadding
    const barClipPathBoxY = barBoxY + config.barPadding
    const barClipPathBoxHeight = barBoxHeight - config.barPadding * 2
    const barClipPathBoxWidth = barBoxWidth - config.barPadding * 2

    const textRightBottomPaddingMultiplier = 0.25
    const textRotation = config.vertical ? -90 : 0
    const labelTextX = config.vertical ? (config.textLeftTop ? config.textPx : stackerWidth - (config.textPx * textRightBottomPaddingMultiplier)) : config.cornerRoundingX
    const labelTextY = config.vertical ? stackerHeight - config.cornerRoundingY : (config.textLeftTop ? config.textPx : stackerHeight - (config.textPx * textRightBottomPaddingMultiplier))
    const valueTextX = config.vertical ? (config.textLeftTop ? config.textPx : stackerWidth - (config.textPx * textRightBottomPaddingMultiplier)) : stackerWidth - config.cornerRoundingX
    const valueTextY = config.vertical ? config.cornerRoundingY : (config.textLeftTop ? config.textPx : stackerHeight - (config.textPx * textRightBottomPaddingMultiplier))

    // mask
    const defs = stacker.append('defs')
    const mask = defs.append('mask')
      .attr('id', `barboxMask_${this.elementId}`)

    mask.append('rect')
      .attr('width', stackerWidth)
      .attr('height', stackerHeight)
      .attr('rx', config.cornerRoundingX)
      .attr('ry', config.cornerRoundingY)
      .style('fill', 'white')

    mask.append('rect')
      .attr('x', barBoxX)
      .attr('y', barBoxY)
      .attr('rx', config.cornerRoundingX)
      .attr('ry', config.cornerRoundingY)
      .attr('height', barBoxHeight)
      .attr('width', barBoxWidth)
      .style('fill', 'black')

    mask.append('text')
      .text(this.label)
      .attr('text-anchor', 'start')
      .attr('font-size', `${config.textPx}px`)
      .attr('x', labelTextX)
      .attr('y', labelTextY)
      .style('fill', 'black')
      .attr('transform', `rotate(${textRotation} ${labelTextX} ${labelTextY})`)

    const valueText = mask.append('text')
      .text(config.valuePrefix + 0 + config.valuePostfix)
      .attr('V', 0)
      .attr('text-anchor', 'end')
      .attr('font-size', `${config.textPx}px`)
      .attr('x', valueTextX)
      .attr('y', valueTextY)
      .style('fill', 'black')
      .attr('transform', `rotate(${textRotation} ${valueTextX} ${valueTextY})`)

    const clipRect1 = defs.append('clipPath')
      .attr('id', `barClipPath_${this.elementId}`)
      .append('rect')
      .attr('x', barClipPathBoxX)
      .attr('y', barClipPathBoxY)
      .attr('height', barClipPathBoxHeight)
      .attr('width', barClipPathBoxWidth)

    const clipRect2 = defs.append('clipPath')
      .attr('id', `barClipPath_${this.elementId}2`)
      .append('rect')
      .attr('x', barClipPathBoxX)
      .attr('y', barClipPathBoxY)
      .attr('rx', config.cornerRoundingX)
      .attr('ry', config.cornerRoundingY)
      .attr('height', barClipPathBoxHeight)
      .attr('width', barClipPathBoxWidth)

    stacker.append('rect')
      .attr('height', stackerHeight)
      .attr('width', stackerWidth)
      .attr('rx', config.cornerRoundingX)
      .attr('ry', config.cornerRoundingY)
      .style('fill', config.color)
      .attr('mask', `url(#barboxMask_${this.elementId})`)

    const barGroup = stacker.append('g')
      .attr('clip-path', `url(#barClipPath_${this.elementId}2)`)
      .append('g')
      .attr('clip-path', `url(#barClipPath_${this.elementId})`)
      .attr('T', 0)

    const barCount = config.vertical ? barClipPathBoxHeight / (config.barThickness * 2) : barClipPathBoxWidth / (config.barThickness * 2)

    const barClipPathBoxScaleY = d3.scaleLinear().domain([barCount, 0]).range([0, barClipPathBoxHeight])
    const barClipPathBoxScaleX = d3.scaleLinear().domain([barCount, 0]).range([0, -barClipPathBoxWidth])

    //Draw all the bars.
    for (let i = 0; i < barCount; i++) {
      if (config.vertical) {
        barGroup.append('rect')
          .attr('x', barClipPathBoxX)
          .attr('y', (barClipPathBoxY + barClipPathBoxHeight - config.barThickness) - (i * config.barThickness * 2))
          .attr('height', config.barThickness)
          .attr('width', barClipPathBoxWidth)
          .style('fill', config.color)
      } else {
        barGroup.append('rect')
          .attr('x', barClipPathBoxX + i * config.barThickness * 2)
          .attr('y', barClipPathBoxY)
          .attr('height', barClipPathBoxHeight)
          .attr('width', config.barThickness)
          .style('fill', config.color)
      }
    }

    valueText.transition()
      .duration(config.valueAnimateTime)
      .tween('text', valueTextAnimator(value, config.valuePrefix, config.valuePostfix))

    function calcBarValue(value) {
      let bars =  Math.ceil(barCount * (value / ( config.maxValue - config.minValue)))
      if (bars === barCount && value < config.maxValue) {
        bars--
      }
      return bars
    }

    let bars = calcBarValue(value)

    clipRect1
      .attr('transform', config.vertical ? `translate(0,${barClipPathBoxY + barClipPathBoxHeight})` : `translate(${barClipPathBoxX - barClipPathBoxWidth},0)`)
      .transition()
      .duration(config.valueAnimateTime)
      .attr('transform', config.vertical ? `translate(0,${barClipPathBoxScaleY(bars)})` : `translate(${barClipPathBoxScaleX(bars)}, 0)`)

    this.update = function (value) {
      valueText.transition()
        .duration(config.valueAnimateTime)
        .tween('text', valueTextAnimator(value, config.valuePrefix, config.valuePostfix))

      let bars = calcBarValue(value)

      clipRect1.transition()
        .duration(config.valueAnimateTime)
        .attr('transform', config.vertical ? `translate(0,${barClipPathBoxScaleY(bars)})` : `translate(${barClipPathBoxScaleX(bars)}, 0)`)
    }
  }
}

function valueTextAnimator(value, valuePrefix, valuePostfix) {
  return function () {
    const i = d3.interpolate(d3.select(this).attr('V'), value);
    return (t) => {
      const newValue = Math.round(i(t))
      this.textContent = valuePrefix + newValue + valuePostfix
      d3.select(this).attr('V', newValue)
    }
  }
}
