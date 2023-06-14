/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return new proto.constructor(...Object.values(JSON.parse(json)));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CSSBuilder {
  constructor() {
    this.tag = {
      elementName: '',
      idName: '',
      classNames: [],
      attributes: [],
      pseudoClasses: [],
      pseudoElement: '',
    };
  }

  static showError(i = 1) {
    if (i) throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    else throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  }

  checkOrder(n) {
    return Object.values(this.tag).slice(n).reduce((acc, el) => acc + !!el.length, 0);
  }

  element(value) {
    if (this.tag.elementName) CSSBuilder.showError();
    if (this.checkOrder(0)) CSSBuilder.showError(0);
    this.tag.elementName = value;
    return this;
  }

  id(value) {
    if (this.tag.idName) CSSBuilder.showError();
    if (this.checkOrder(1)) CSSBuilder.showError(0);
    this.tag.idName = value;
    return this;
  }

  class(value) {
    if (this.checkOrder(3)) CSSBuilder.showError(0);
    this.tag.classNames = [...this.tag.classNames, value];
    return this;
  }

  attr(value) {
    if (this.checkOrder(4)) CSSBuilder.showError(0);
    this.tag.attributes = [...this.tag.attributes, value];
    return this;
  }

  pseudoClass(value) {
    if (this.checkOrder(5)) CSSBuilder.showError(0);
    this.tag.pseudoClasses = [...this.tag.pseudoClasses, value];
    return this;
  }

  pseudoElement(value) {
    if (this.tag.pseudoElement) CSSBuilder.showError();
    this.tag.pseudoElement = value;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.tag.elementName = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    let selector = '';
    if (this.tag.elementName) selector += this.tag.elementName;
    if (this.tag.idName) selector += `#${this.tag.idName}`;
    if (this.tag.classNames.length > 0) selector += `.${this.tag.classNames.join('.')}`;
    if (this.tag.attributes.length > 0) selector += `[${this.tag.attributes.join('][')}]`;
    if (this.tag.pseudoClasses.length > 0) selector += `:${this.tag.pseudoClasses.join(':')}`;
    if (this.tag.pseudoElement) selector += `::${this.tag.pseudoElement}`;
    return selector;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CSSBuilder().element(value);
  },

  id(value) {
    return new CSSBuilder().id(value);
  },

  class(value) {
    return new CSSBuilder().class(value);
  },

  attr(value) {
    return new CSSBuilder().attr(value);
  },

  pseudoClass(value) {
    return new CSSBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CSSBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CSSBuilder().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
