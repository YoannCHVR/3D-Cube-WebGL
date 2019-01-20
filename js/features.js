panel = document.querySelectorAll('#panel');

// ----------- ROTATION ----------- //

rotateRange = {
  x: document.getElementById('xRotate'),
  y: document.getElementById('yRotate'),
  z: document.getElementById('zRotate')
};

panelRotation = {
  x: panel[0].childNodes[1].childNodes[1],
  y: panel[0].childNodes[1].childNodes[3],
  z: panel[0].childNodes[1].childNodes[5]
};

rotateRange.x.addEventListener('input', function () {
    rotate.x = panelRotation.x.innerHTML = this.value;
});

rotateRange.y.addEventListener('input', function () {
    rotate.y = panelRotation.y.innerHTML = this.value;
});

rotateRange.z.addEventListener('input', function () {
    rotate.z = panelRotation.z.innerHTML = this.value;
});

// ----------- TRANSLATION ----------- //

translateRange = {
  x: document.getElementById('xTranslate'),
  y: document.getElementById('yTranslate'),
  z: document.getElementById('zTranslate')
};

panelTranslation = {
  x: panel[0].childNodes[3].childNodes[1],
  y: panel[0].childNodes[3].childNodes[3],
  z: panel[0].childNodes[3].childNodes[5]
};

translateRange.x.addEventListener('input', function () {
    translate.x = panelTranslation.x.innerHTML = this.value;
});

translateRange.y.addEventListener('input', function () {
    translate.y = panelTranslation.y.innerHTML = this.value;
});

translateRange.z.addEventListener('input', function () {
    translate.z = panelTranslation.z.innerHTML = this.value;
});

// ----------- SCALE ----------- //

scaleRange = document.getElementById('scale');
zoom = document.querySelector('#zoom > span > span');

scaleRange.addEventListener('input', function () {
    scale = zoom.innerHTML = this.value;
});

fovRange = document.getElementById('fov');
