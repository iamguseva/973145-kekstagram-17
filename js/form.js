'use strict';

(function () {
  var RESET_PIN_VALUE = 453;
  var RESET_PERCENT_VALUE = 100;
  var uploadFile = document.querySelector('#upload-file');
  var uploadOverlayImage = document.querySelector('.img-upload__overlay ');
  var uploadClose = uploadOverlayImage.querySelector('#upload-cancel');
  var slider = document.querySelector('.img-upload__effect-level');
  var uploadImageEffects = document.querySelector('.img-upload__effects ');
  var effectLevelPin = slider.querySelector('.effect-level__pin');
  var effectLevelLine = slider.querySelector('.effect-level__line');
  var effectLevelDepth = slider.querySelector('.effect-level__depth');
  var uploadPreviewImage = document.querySelector('.img-upload__preview img');
  var effectValue = slider.querySelector('.effect-level__value');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var comment = uploadOverlayImage.querySelector('.text__description');
  var hashtags = uploadOverlayImage.querySelector('.text__hashtags');
  var noneEffect = document.querySelector('input[value = "none"]');
  var form = document.querySelector('.img-upload__form');
  var formInput = document.querySelector('.img-upload__input');
  var picturesElement = document.querySelector('.pictures');
  var preview = document.querySelector('.img-upload__preview img');
  var onPopupEscapePress = function (evt) {
    window.util.onEscapePress(evt, closePopup);
  };

  var openPopup = function () {
    uploadOverlayImage.classList.remove('hidden');
    noneEffect.checked = true;
    hideSlider('none');
    changeEffect('none');
    applyEffect('none', 0);
    preview.src = '';
    window.preview.resetBackground();
    document.addEventListener('keydown', onPopupEscapePress);
    picturesElement.removeEventListener('click', window.bigPicture.onPicturesClick);
  };

  var closePopup = function () {
    uploadOverlayImage.classList.add('hidden');
    applyEffect('none', 0);
    document.removeEventListener('keydown', onPopupEscapePress);
    hashtags.value = '';
    comment.value = '';
    formInput.value = '';
    hashtags.style.border = '';
    comment.style.border = '';
    preview.src = '';
    window.preview.resetBackground();
    picturesElement.addEventListener('click', window.bigPicture.onPicturesClick);
  };

  var onSuccess = function () {
    closePopup();
    window.formUploadPopup.showSuccessMessage();
  };

  var onError = function () {
    closePopup();
    window.formUploadPopup.showErrorMessage();
  };

  var calculateValue = function (sliderValue, min, max) {
    if (sliderValue === 0) {
      return min;
    }
    return ((max - min) * sliderValue) / 100 + min;
  };

  var applyEffect = function (effectName, sliderValue) {
    switch (effectName) {
      case 'none':
        uploadPreviewImage.style.filter = '';
        break;
      case 'chrome':
        uploadPreviewImage.style.filter = 'grayscale(' + calculateValue(sliderValue, 0, 1) + ')';
        break;
      case 'sepia':
        uploadPreviewImage.style.filter = 'sepia(' + calculateValue(sliderValue, 0, 1) + ')';
        break;
      case 'marvin':
        uploadPreviewImage.style.filter = 'invert(' + calculateValue(sliderValue, 0, 100) + '%)';
        break;
      case 'phobos':
        uploadPreviewImage.style.filter = 'blur(' + calculateValue(sliderValue, 0, 3) + 'px)';
        break;
      case 'heat':
        uploadPreviewImage.style.filter = 'brightness(' + calculateValue(sliderValue, 1, 3) + ')';
        break;
    }

  };

  var changeEffect = function (effectName) {
    uploadPreviewImage.className = '';
    effectValue.classList.remove('hidden');
    uploadPreviewImage.classList.add('effects__preview--' + effectName);

    if (effectName === 'none') {
      effectValue.classList.add('hidden');
    }
  };

  var resetEffect = function (effect) {
    effectValue.value = RESET_PERCENT_VALUE;
    applyEffect(effect, RESET_PERCENT_VALUE);
    setLevelPin(RESET_PIN_VALUE);
  };

  var setLevelPin = function (level) {
    effectLevelPin.style.left = level + 'px';
    effectLevelDepth.style.width = level + 'px';
  };

  var hideSlider = function (effect) {
    if (effect) {
      slider.classList.add('hidden');
    } else {
      slider.classList.remove('hidden');
    }
  };

  var setEffect = function (effectToggle) {
    hideSlider(effectToggle.id === 'effect-none');
    resetEffect(effectToggle.value);
    changeEffect(effectToggle.value);
  };

  var applyPinMove = function (evt, shiftX) {
    var effectLevelPinWidth = effectLevelLine.offsetWidth;
    var displacementX = (effectLevelPin.offsetLeft - shiftX);
    displacementX = window.util.getValueInRange(displacementX, 0, effectLevelPinWidth);
    var percentValue = window.util.getPercent(evt.target.offsetLeft, effectLevelPinWidth);
    effectLevelValue.setAttribute('value', percentValue);
    applyEffect(document.querySelector('input[name = "effect"]:checked').value, percentValue);
    setLevelPin(displacementX);
  };

  var denySending = function (evt) {
    evt.preventDefault();
  };

  var onInputEnterPress = function (evt) {
    window.util.onEnterPress(evt, denySending);
  };

  hashtags.addEventListener('focus', function () {
    document.removeEventListener('keydown', onPopupEscapePress);
    document.addEventListener('keydown', onInputEnterPress);
  });

  hashtags.addEventListener('blur', function () {
    document.addEventListener('keydown', onPopupEscapePress);
    document.removeEventListener('keydown', onInputEnterPress);
  });

  comment.addEventListener('focus', function () {
    document.removeEventListener('keydown', onPopupEscapePress);
  });

  comment.addEventListener('blur', function () {
    document.addEventListener('keydown', onPopupEscapePress);
  });

  uploadImageEffects.addEventListener('click', function (evt) {
    var effectToggle = evt.target;
    if (effectToggle.localName === 'input') {
      setEffect(effectToggle);
    }
  });

  uploadFile.addEventListener('change', function () {
    openPopup();
    uploadFile.blur();
  });

  uploadClose.addEventListener('click', function () {
    closePopup();
  });

  uploadClose.addEventListener('keydown', function (evt) {
    window.util.onEnterPress(evt, closePopup);
  });

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startX = evt.clientX;
    var onMouseMove = function (moveEvt) {
      var shiftX = startX - moveEvt.clientX;
      startX = moveEvt.clientX;
      applyPinMove(evt, shiftX);
    };

    var onMouseUp = function (upEvt) {
      var shiftX = startX - upEvt.clientX;
      startX = upEvt.clientX;
      applyPinMove(evt, shiftX);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var data = new FormData(form);
    window.backend.save(data, onSuccess, onError);
    window.scale.editPictureSize(window.scale.MAX_SIZE);
  });
})();
