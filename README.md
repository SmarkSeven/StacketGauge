# StackerGauge
A StackerGauge with D3.js v4
![](http://ocm1e5iqa.bkt.clouddn.com/stackergif.gif)

**use case:**
```
head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="./lib/d3.min.js"></script>
  <script src="./stackerGauge.js"></script>
  <style>
    body {
      display: flex;
      height: 100vh;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <svg id="stacker" width="300" height="100" style="font-family: Helvetica; font-weight: bold;" onclick="stacker.update(Math.random()*100)"></svg>
  <script language="JavaScript">
    let config = new StackerGaugeSettings()
    config.vertical = false
    config.barBoxPadding = 3
    const stacker = new StackerGauge("stacker", "NO", 55, config)
    stacker.render()
  </script>
</body>
</html>
```
