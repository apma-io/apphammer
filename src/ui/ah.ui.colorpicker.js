/******************************************************************************

  Copyright (c) 2016 IQumulus LLC

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


******************************************************************************/

(function () {
  var win = false,

      matColors = [
       [
        '#FFEBEE',
        '#FFCDD2',
        '#EF9A9A',
        '#E57373',
        '#EF5350',
        '#F44336',
        '#E53935',
        '#D32F2F',
        '#C62828',
        '#B71C1C',
        '#FF8A80',
        '#FF5252',
        '#FF1744',
        '#D50000'
      ],
      [
        '#FCE4EC',
        '#F8BBD0',
        '#F48FB1',
        '#F06292',
        '#EC407A',
        '#E91E63',
        '#D81B60',
        '#C2185B',
        '#AD1457',
        '#880E4F',
        '#FF80AB',
        '#FF4081',
        '#F50057',
        '#C51162'
      ],
      [
        '#F3E5F5',
        '#E1BEE7',
        '#CE93D8',
        '#BA68C8',
        '#AB47BC',
        '#9C27B0',
        '#8E24AA',
        '#7B1FA2',
        '#6A1B9A',
        '#4A148C',
        '#EA80FC',
        '#E040FB',
        '#D500F9',
        '#AA00FF'
      ],
      [
        '#EDE7F6',
        '#D1C4E9',
        '#B39DDB',
        '#9575CD',
        '#7E57C2',
        '#673AB7',
        '#5E35B1',
        '#512DA8',
        '#4527A0',
        '#311B92',
        '#B388FF',
        '#7C4DFF',
        '#651FFF',
        '#6200EA'
      ],
      [
        '#E8EAF6',
        '#C5CAE9',
        '#9FA8DA',
        '#7986CB',
        '#5C6BC0',
        '#3F51B5',
        '#3949AB',
        '#303F9F',
        '#283593',
        '#1A237E',
        '#8C9EFF',
        '#536DFE',
        '#3D5AFE',
        '#304FFE'
      ],
      [
        '#E3F2FD',
        '#BBDEFB',
        '#90CAF9',
        '#64B5F6',
        '#42A5F5',
        '#2196F3',
        '#1E88E5',
        '#1976D2',
        '#1565C0',
        '#0D47A1',
        '#82B1FF',
        '#448AFF',
        '#2979FF',
        '#2962FF'
      ],
      [
        '#E1F5FE',
        '#B3E5FC',
        '#81D4FA',
        '#4FC3F7',
        '#29B6F6',
        '#03A9F4',
        '#039BE5',
        '#0288D1',
        '#0277BD',
        '#01579B',
        '#80D8FF',
        '#40C4FF',
        '#00B0FF',
        '#0091EA'
      ],
      [
        '#E0F7FA',
        '#B2EBF2',
        '#80DEEA',
        '#4DD0E1',
        '#26C6DA',
        '#00BCD4',
        '#00ACC1',
        '#0097A7',
        '#00838F',
        '#006064',
        '#84FFFF',
        '#18FFFF',
        '#00E5FF',
        '#00B8D4'
      ],
      [
        '#E0F2F1',
        '#B2DFDB',
        '#80CBC4',
        '#4DB6AC',
        '#26A69A',
        '#009688',
        '#00897B',
        '#00796B',
        '#00695C',
        '#004D40',
        '#A7FFEB',
        '#64FFDA',
        '#1DE9B6',
        '#00BFA5'
      ],
      [
        '#E8F5E9',
        '#C8E6C9',
        '#A5D6A7',
        '#81C784',
        '#66BB6A',
        '#4CAF50',
        '#43A047',
        '#388E3C',
        '#2E7D32',
        '#1B5E20',
        '#B9F6CA',
        '#69F0AE',
        '#00E676',
        '#00C853'
      ],
      [
        '#F1F8E9',
        '#DCEDC8',
        '#C5E1A5',
        '#AED581',
        '#9CCC65',
        '#8BC34A',
        '#7CB342',
        '#689F38',
        '#558B2F',
        '#33691E',
        '#CCFF90',
        '#B2FF59',
        '#76FF03',
        '#64DD17'
      ],
      [
        '#F9FBE7',
        '#F0F4C3',
        '#E6EE9C',
        '#DCE775',
        '#D4E157',
        '#CDDC39',
        '#C0CA33',
        '#AFB42B',
        '#9E9D24',
        '#827717',
        '#F4FF81',
        '#EEFF41',
        '#C6FF00',
        '#AEEA00'
      ],
      [
        '#FFFDE7',
        '#FFF9C4',
        '#FFF59D',
        '#FFF176',
        '#FFEE58',
        '#FFEB3B',
        '#FDD835',
        '#FBC02D',
        '#F9A825',
        '#F57F17',
        '#FFFF8D',
        '#FFFF00',
        '#FFEA00',
        '#FFD600'
      ],
      [
        '#FFF8E1',
        '#FFECB3',
        '#FFE082',
        '#FFD54F',
        '#FFCA28',
        '#FFC107',
        '#FFB300',
        '#FFA000',
        '#FF8F00',
        '#FF6F00',
        '#FFE57F',
        '#FFD740',
        '#FFC400',
        '#FFAB00'
      ],
      [
        '#FFF3E0',
        '#FFE0B2',
        '#FFCC80',
        '#FFB74D',
        '#FFA726',
        '#FF9800',
        '#FB8C00',
        '#F57C00',
        '#EF6C00',
        '#E65100',
        '#FFD180',
        '#FFAB40',
        '#FF9100',
        '#FF6D00'
      ],
      [
        '#FBE9E7',
        '#FFCCBC',
        '#FFAB91',
        '#FF8A65',
        '#FF7043',
        '#FF5722',
        '#F4511E',
        '#E64A19',
        '#D84315',
        '#BF360C',
        '#FF9E80',
        '#FF6E40',
        '#FF3D00',
        '#DD2C00'
      ],
      [
        '#EFEBE9',
        '#D7CCC8',
        '#BCAAA4',
        '#A1887F',
        '#8D6E63',
        '#795548',
        '#6D4C41',
        '#5D4037',
        '#4E342E',
        '#3E2723',
        '#3E2723',
        '#3E2723',
        '#3E2723',
        '#3E2723'
      ],
      [
        '#FAFAFA',
        '#F5F5F5',
        '#EEEEEE',
        '#E0E0E0',
        '#BDBDBD',
        '#9E9E9E',
        '#757575',
        '#616161',
        '#424242',
        '#212121',
        '#212121',
        '#212121',
        '#212121',
        '#212121'
      ],
      [
        '#ECEFF1',
        '#CFD8DC',
        '#B0BEC5',
        '#90A4AE',
        '#78909C',
        '#607D8B',
        '#546E7A',
        '#455A64',
        '#37474F',
        '#37474F',
        '#37474F',
        '#37474F',
        '#37474F',
        '#37474F'
      ],
      [
        '#000',
        '#FFF'
      ]

      ],
      colors = [
        '#F44336',
        '#B71C1C',
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFEB3B',
        '#FFC107',
        '#FF9800',
        '#FF5722',
        '#795548',
        '#795548',
        '#607D8B',
        '#000000',
        '#FFFFFF'
      ]
  ;

  /////////////////////////////////////////////////////////////////////////////


  
  function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

  function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
  }

  function getContrasting(color) {
    var rgb = hexToRgb(color);

    if (rgb && (rgb.r + rgb.g + rgb.b) / 3 < 160) {
      return '#FFF';
    } else if (rgb) {
      return '#000';
    }
  }

  function CreatePicker() {
    var callback = false
    ;

    function build(target, selectedColor) {
      var container = ah.dom.cr('div', 'ah-colorpicker'),
          input = ah.dom.cr('input', 'ah-transition input'),
          addIcon = ah.dom.cr('div', 'ah-transition icon add fa fa-plus-circle'),
          copyIcon = ah.dom.cr('div', 'ah-transition icon copy fa fa-copy'),
          picker = ah.dom.cr('div', 'picker'),
          colorsContainer = ah.dom.cr('div', 'colors ah-prettyscroll'),
          okBtn = ah.dom.cr('div', 'ah-noselection ah-transition button', 'OK'),
          canvas = ah.dom.cr('canvas', 'canvas'),
          ctx = canvas.getContext('2d')
      ;

      target.innerHTML = '';

      canvas.width = 255;
      canvas.height = 210;

      function updateInputCol() {
        ah.dom.style(input, {
          background: input.value,
          color: getContrasting(input.value)
        });

        ah.dom.style([addIcon, copyIcon], {
          color: getContrasting(input.value)
        });

        if (ah.isFn(callback)) {
          callback(input.value);
        }
      }

      function buildColors() {
        colorsContainer.innerHTML = '';
        colors.forEach(function (col) {
          var c = ah.dom.cr('div', 'color');
          ah.dom.style(c, {
            background: col
          });

          ah.dom.on(c, 'click', function () {
            input.value = col;
            updateInputCol();
          });

          ah.dom.on(c, 'contextmenu', function (e) {
            if (confirm('Remove ' + col + ' from palette?')) {
              colors = colors.filter(function (c) {
                return c !== col;
              });
              buildColors();
            }
            if (e.stopPropagation) {
              e.stopPropagation();
            }
            e.preventDefault();
            return false;
          });

          ah.dom.ap(colorsContainer, c);
        });
      }

      function buildWheel() {
        var col = 0;

        matColors.forEach(function (column, colIndex) {
          column.forEach(function (row, rowIndex) {
            ctx.fillStyle = row;
            ctx.fillRect(colIndex * 13, rowIndex * 15, 13, 15);
            ctx.fill();

          });
        });
      }

      if (selectedColor) {
        input.value = selectedColor;
        updateInputCol();
      }

      buildWheel();
      buildColors();

      ah.dom.on(canvas, 'mousedown', function (e) {
        var upper, mover;

        document.body.className += ' ah-noselection';

        function pickColor(e) {
          var bb = canvas.getBoundingClientRect(),
              pos = findPos(canvas),
              canvasX = (e.pageX - bb.left),
              canvasY = (e.pageY - bb.top),
              p = ctx.getImageData(canvasX, canvasY, 1, 1).data,
              hexColor = '#' + ('000000' + rgbToHex(p[0], p[1], p[2])).slice(-6)
          ;

          //console.log(canvasX + ',' + canvasY);
          //console.log(p[0] + ' ' + p[1] + ' ' + p[2]);

          input.value = hexColor;
          updateInputCol(hexColor);
        }

        mover = ah.dom.on(canvas, 'mousemove', function (e) {
          pickColor(e);
        });

        upper = ah.dom.on(document.body, 'mouseup', function () {
          upper();
          mover();

          document.body.className = document.body.className.replace(' ah-noselection', '');
        });

        pickColor(e);
      });

      ah.dom.on(input, 'keyup', function (e) {
        updateInputCol(input.value);
      });

      ah.dom.on(okBtn, 'click', function () {
        if (ah.isFn(callback)) {
          callback(input.value);
        }
        win.hide();
      });

      ah.dom.on(addIcon, 'click', function () {
        var exists = colors.filter(function (c) { return c === input.value}).length > 0;
        if (!exists) {
          colors.push(input.value);
          buildColors();
        } else {
          ah.snackBar('<span style="color:' + input.value + '">' + input.value + '</span> already in your palette...');
        }
      });

      ah.dom.ap(target,
        ah.dom.ap(container,
          ah.dom.ap(ah.dom.cr('div'),
            addIcon,
            //copyIcon,
            input
          ),
          ah.dom.ap(picker,
            canvas
          ),
          colorsContainer//,
          //okBtn
        )
      );

    }

    function open(selected, fn) {
      build(win.body, selected);
      win.show();      
      callback = fn;
    }

    function openNoWindow(target, selected, fn) {
      build(target, selected);
      callback = fn;
    }

    /////////////////////////////////////////////////////////////////////////////


    return {
      open: open,
      openNoWindow: openNoWindow
    }
  };

   //Set up stuff
  ah.ready(function () {
    win = ah.ui.Window({
      title: 'COLOR PICKER',
      canClose: false,
      canMaximize: false,
      canResize: false,
      height:445,
      width:255,
      isModal: true,
      center: true
    });
    //build(win.body);
    win.hide();
  });

  //Export e
  ah.ui.ColorPicker = function () {
    var cp = CreatePicker();
    cp.open.apply(undefined, arguments); 
    return cp;   
  };

  ah.ui.ColorPickerEmbed = function () {
    var cp = CreatePicker();
    cp.openNoWindow.apply(undefined, arguments);
    return cp;
  };

  ah.getContrastingColor = getContrasting;

})();