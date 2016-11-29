/**
 * index.js v1.0.0
 * Copyright (c) 2016. Collin Haines.
 * Licensed under MIT (https://github.com/collinhaines/dataset-names/blob/master/LICENSE)
 */

/**
 * Constructor
 */
function Names () {
  this.fs        = require('fs');
  this.babyparse = require('babyparse');

  const file = this.fs.readFileSync('names.csv').toString();

  this.data = this.babyparse.parse(file, { header: true });
}

/**
 * Printer
 *
 * Prints the total regarding the given field.
 *
 * @param {String} field -- Header within the CSV.
 */
Names.prototype.totalField = function (field) {
  if (!this.data.meta.fields.hasOwnProperty(field)) {
    console.log('The field \'' + field + '\' does not exist.\n');

    console.log('Please use one of the following:');
    console.log(this.data.meta.fields.join('\n- '));

    return;
  }

  let total = {
    black: 0,
    white: 0
  };

  for (let i = 0; i < this.data.data.length; i++) {
    const item = this.data.data[i];

    if (item[field].toString() === "1") {
      if (item.black.toString() === "1") {
        total.black++;
      } else {
        total.white++;
      }
    }
  }

  let output = field + ':\n';
  output += '| Black   | White   | Total         |\n';
  output += '| ' + this.indention(total.black, 7);
  output += ' | ' + this.indention(total.white, 7);
  output += ' | ' + this.total(total.black + total.white) + ' |';

  console.log(output);
};

/**
 * In a visual appealing way, render the amount of spaces needed.
 *
 * @param  {String}  text  -- The text to be rendered.
 * @param  {Integer} total -- The total amount of spaces.
 * @return {String}
 */
Names.prototype.indention = function (text, total) {
  const repeat = total - text.toString().length;

  if (repeat > 0) {
    return ' '.repeat(repeat) + text;
  } else {
    return text;
  }
};

/**
 * Determines the percentage of the given integer and renders it
 * alongside the total of the previous two data cells.
 *
 * @param  {Integer} total -- Total of the previous two cells.
 * @return {String}
 */
Names.prototype.total = function (total) {
  let percentage = ((total / this.data.data.length) * 100).toString();

  if (percentage.length < 5) {
    percentage = percentage.substring(0, percentage.length);
  } else if (percentage.indexOf('.') === 1) {
    percentage = percentage.substring(0, 4);
  } else {
    percentage = percentage.substring(0, 5);
  }

  return this.indention(total + ' (' + percentage + '%)', 13);
};

new Names().totalField(process.argv.slice(2));
