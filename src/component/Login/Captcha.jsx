import React, { Component } from "react";

let defaultDataObj = {
  identifyCodes: {
    type: String,
    default: "1234567890",
  },
  identifyCode: {
    type: String,
    default: "1234",
  },
  fontSizeMin: {
    type: Number,
    default: 16,
  },
  fontSizeMax: {
    type: Number,
    default: 40,
  },
  backgroundColorMin: {
    type: Number,
    default: 180,
  },
  backgroundColorMax: {
    type: Number,
    default: 240,
  },
  colorMin: {
    type: Number,
    default: 50,
  },
  colorMax: {
    type: Number,
    default: 160,
  },
  lineColorMin: {
    type: Number,
    default: 40,
  },
  lineColorMax: {
    type: Number,
    default: 180,
  },
  dotColorMin: {
    type: Number,
    default: 0,
  },
  dotColorMax: {
    type: Number,
    default: 255,
  },
  contentWidth: {
    type: Number,
    default: 112,
  },
  contentHeight: {
    type: Number,
    default: 38,
  },
};
class Captcha extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 生成一个随机数
  randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  // 生成一个随机的颜色
  randomColor = (min, max) => {
    let r = this.randomNum(min, max);
    let g = this.randomNum(min, max);
    let b = this.randomNum(min, max);
    return "rgb(" + r + "," + g + "," + b + ")";
  };

  drawPic = () => {
    let canvas = document.getElementById("s-canvas");
    let ctx = canvas.getContext("2d");

    console.log(canvas);
    console.log(ctx);
    ctx.textBaseline = "bottom";
    // 绘制背景

    console.log(defaultDataObj.backgroundColorMin);
    ctx.fillStyle = this.randomColor(
      defaultDataObj.backgroundColorMin.default,
      defaultDataObj.backgroundColorMax.default
    );
    ctx.fillRect(
      0,
      0,
      defaultDataObj.contentWidth.default,
      defaultDataObj.contentHeight.default
    );
    // 绘制文字
    for (let i = 0; i < defaultDataObj.identifyCode.default.length; i++) {
      this.drawText(ctx, defaultDataObj.identifyCode.default[i], i);
    }

    this.drawLine(ctx);
    this.drawDot(ctx);
  };

  drawText = (ctx, txt, i) => {
    ctx.fillStyle = this.randomColor(
      defaultDataObj.colorMin.default,
      defaultDataObj.colorMax.default
    );
    ctx.font =
      this.randomNum(
        defaultDataObj.fontSizeMin.default,
        defaultDataObj.fontSizeMax.default
      ) + "px SimHei";
    let x =
      (i + 1) *
      (defaultDataObj.contentWidth.default /
        (defaultDataObj.identifyCode.default.length + 1));
    let y = this.randomNum(
      defaultDataObj.fontSizeMax.default,
      defaultDataObj.contentHeight.default - 5
    );
    var deg = this.randomNum(-45, 45);
    // 修改坐标原点和旋转角度
    ctx.translate(x, y);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(txt, 0, 0);
    // 恢复坐标原点和旋转角度
    ctx.rotate((-deg * Math.PI) / 180);
    ctx.translate(-x, -y);
  };

  drawLine = (ctx) => {
    // 绘制干扰线
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = this.randomColor(
        defaultDataObj.lineColorMin.default,
        defaultDataObj.lineColorMax.default
      );
      ctx.beginPath();
      ctx.moveTo(
        this.randomNum(0, defaultDataObj.contentWidth.default),
        this.randomNum(0, defaultDataObj.contentHeight.default)
      );
      ctx.lineTo(
        this.randomNum(0, defaultDataObj.contentWidth.default),
        this.randomNum(0, defaultDataObj.contentHeight.default)
      );
      ctx.stroke();
    }
  };

  drawDot(ctx) {
    // 绘制干扰点
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = this.randomColor(0, 255);
      ctx.beginPath();
      ctx.arc(
        this.randomNum(0, this.contentWidth),
        this.randomNum(0, this.contentHeight),
        1,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }

  changeCode = () => {
    this.refreshCode();
  };

  makeCode = (o, l) => {
    for (let i = 0; i < l; i++) {
      defaultDataObj.identifyCode.default +=
        defaultDataObj.identifyCodes.default[
          this.randomNum(0, defaultDataObj.identifyCodes.default.length)
        ];
    }

    console.log("校验", defaultDataObj.identifyCode.default);
    sessionStorage.setItem('img-code', defaultDataObj.identifyCode.default)
    this.drawPic();
  };

  refreshCode = () => {
    defaultDataObj.identifyCode.default = "";
    this.makeCode(defaultDataObj.identifyCodes.default, 4);
  };

  render() {
    return (
      <div>
        <canvas id="s-canvas" width="112px" height="38"></canvas>
        <a style={{fontSize: 10}} onClick={this.changeCode}>点击切换验证码</a>
        {/* <button onClick={this.changeCode}>切换验证码</button> */}
      </div>
    );
  }

  componentDidMount() {
    this.refreshCode();
  }
}

export default Captcha;