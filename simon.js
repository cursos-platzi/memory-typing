'use stric'

const levels = 15
let keys = generateKeys(levels)
const $keyboard = document.getElementById('keyboard')
const $reloadMessage = document.getElementById('reloadMessage')

nextRound(0)

function generateKeys(levels) {
  return new Array(levels).fill(0).map(generateRandomKey)
}

function generateRandomKey() {
  const min = 65
  const max = 90
  return Math.round(Math.random() * (max - min) + min)
}

function getElementByKeyCode(keyCode) {
  return document.querySelector(`[data-key="${keyCode}"]`)
}

function activate(keyCode, opts = {}) {
  const el = getElementByKeyCode(keyCode)
  el.classList.add('active')
  if (opts.success) {
    el.classList.add('success')
  } else if (opts.fail) {
    el.classList.add('fail')
  }
  setTimeout(() => deactivate(el), 500)

  function deactivate(el) {
    el.className = 'key'
  }
}

function nextRound(currentLevel) {  
  if (currentLevel === levels) {
    return swal(
      'You Win!',
      'Reload de page to start gain (press F5)',
      'success'
    )
  }
  swal({
    title: `Level ${currentLevel + 1} of ${levels}`,
    text: 'Moving to the next level',
    timer: 1500,
    onOpen: function () { swal.showLoading() }
  })
  .then(
    function () { }, //never resolved
    function (dismiss) { //handle rejection
      for (let i = 0; i <= currentLevel; i++) {
        setTimeout(() => { activate(keys[i]) }, 1000 * (i + 1))
      }

      let i = 0
      let currentKey = keys[i]
      window.addEventListener('keydown', onkeydown)

      function onkeydown(ev) {
        if (ev.keyCode === currentKey) {
          activate(currentKey, { success: true })
          i++

          if (i > currentLevel) {
            window.removeEventListener('keydown', onkeydown)
            setTimeout(() => { nextRound(i) }, 500)
          }

          currentKey = keys[i]
        } else {
          activate(ev.keyCode, { fail: true })
          window.removeEventListener('keydown', onkeydown)
          swal({
            title: 'Game Over',
            text: "Do you wanna play again?",
            type: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, let\'s go!',
            cancelButtonText: 'ÑO'
          })
          .then(
            function (resolved) {
              generateKeys(levels)
              nextRound(0)
            },
            function (rejected) {
              $keyboard.style.display = 'none'
              $reloadMessage.style.display = 'block'
            }
          )
        }
      }
    })
}