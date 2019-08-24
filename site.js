"use strict";

function transformQuote(response) {
  var quote = $("#quote")[0];

  quote.innerHTML = `${response.compliment}.`;
  shiftBackgroundGradient();
}

// Based on https://awik.io/determine-color-bright-dark-using-javascript/
function isColorDark(color) {
  // Variables for red, green, blue values
  var r, g, b, hsp;

  // If RGB --> Convert it to HEX: http://gist.github.com/983661
  color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

  r = color >> 16;
  g = (color >> 8) & 255;
  b = color & 255;

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  console.log(color, hsp);
  if (hsp > 100) {
    return false;
  }

  return true;
}

// Based off of https://css-tricks.com/snippets/javascript/lighten-darken-color/
function LightenDarkenColor(col, amt) {
  var usePound = false;

  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col, 16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

// Based off of https://webdevtrick.com/javascript-random-gradient-generator/
function shiftBackgroundGradient() {
  var colors = [];

  for (var i = 0; i < 25; i++) {
    colors.push(randomColor());
  }

  console.log(colors)

  var a = randomColor();
  var b = randomColor();
  var c = randomColor();
  var button_color = isColorDark(a) ? "#eeeeee" : "#111111";

  $("#gradient").css({
    background: a,
    background: `-moz-linear-gradient(to right,  ${a} 0%,  ${b} 100%)`,
    background: `-webkit-linear-gradient(to right,  ${a} 0%,  ${b} 100%)`,
    background: `linear-gradient(to right, ${a} 0%, ${b} 100%)`,
    filter: `progid:DXImageTransform.Microsoft.gradient( startColorstr='${a}', endColorstr='${b}',GradientType=1 )`
  });

  $("#quote").css("color", isColorDark(a) ? "#eeeeee" : "#333333")

  $("#colorA")
    .html(a)
    .css("color", a);
  $("#colorB")
    .html(b)
    .css("color", b);

  $("#refresh").css({
    background: a,
    color: button_color,
    "border-color": b
  });

  $("#refresh").hover(
    () => {
      $("#refresh").css({
        background: LightenDarkenColor(a, -30),
        color: "#ffffff"
      });
    },
    () => {
      $("#refresh").css({ background: a, color: button_color });
    }
  );
}

function getQuote() {
  $.ajax({
    url: "https://complimentr.com/api",
    crossDomain: true,
    success: response => transformQuote(response),
    error: error => console.error(error)
  });
}

// Listeners
$("#refresh").on("click", () => getQuote());
getQuote();
