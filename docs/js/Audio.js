// Start off by initializing a new context.
var context = new (window.AudioContext || window.webkitAudioContext)();

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";
  var loader = this;
  request.onload = function () {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function (buffer) {
        if (!buffer) {
          alert("error decoding file data: " + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function (error) {
        console.error("decodeAudioData error", error);
      }
    );
  };

  request.onerror = function () {
    alert("BufferLoader: XHR error");
  };

  request.send();
};

BufferLoader.prototype.load = function () {
  for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
};

function RapidSoundsSample(context) {
  var ctx = this;
  var loader = new BufferLoader(
    context,
    ["assets/Laser.mp3", "assets/Explosion.mp3"],
    onLoaded
  );

  function onLoaded(buffers) {
    ctx.buffers = buffers;
  }
  loader.load();
}

RapidSoundsSample.prototype.play = function (type) {
  var source = context.createBufferSource();
  var gain = context.createGain();
  source.buffer = this.buffers[type];
  source.connect(gain);
  gain.connect(context.destination);
  source[source.start ? "start" : "noteOn"](0);
};

var player = new RapidSoundsSample(context);

function playLaserFireSound() {
  player.play(0);
}

function playExplosionSound() {
  player.play(1);
}

export { playLaserFireSound, playExplosionSound };
