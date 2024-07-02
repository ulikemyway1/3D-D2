import LilGUI from 'lil-gui';

class App {

  constructor() {
    this.jenkis = null;
    this.scene = document.querySelector('a-scene');
    this.camera = document.querySelector('#camera');
    this.plane = document.querySelector('#plane');
    this.GUI = new LilGUI();

    this.registerComponent();

    this.initGUI();
  }

  registerComponent() {

    AFRAME.registerComponent('click-to-move-jankis', {

      init: () => {
        this.plane.addEventListener('click', (event) => {
          const intersection = event.detail.intersection;
          if (intersection && this.jenkis) {
            const point = intersection.point;
            this.jenkis.setAttribute('position', point);
          }
        });

      }
    })


    AFRAME.registerComponent('mouse-rotate', {
      schema: {
        speed: { type: 'number', default: 0.3 }
      },

      init: function () {
        this.ifMouseDown = false;
        this.x_cord = 0;

        this.boundOnDocumentMouseDown = this.OnDocumentMouseDown.bind(this);
        this.boundOnDocumentMouseUp = this.OnDocumentMouseUp.bind(this);
        this.boundOnDocumentMouseMove = this.OnDocumentMouseMove.bind(this);

        this.el.addEventListener('mousedown', this.boundOnDocumentMouseDown);
        window.addEventListener('mouseup', this.boundOnDocumentMouseUp);
        window.addEventListener('mousemove', this.boundOnDocumentMouseMove);
      },

      remove: function () {
        this.el.removeEventListener('mousedown', this.boundOnDocumentMouseDown);
        window.removeEventListener('mouseup', this.boundOnDocumentMouseUp);
        window.removeEventListener('mousemove', this.boundOnDocumentMouseMove);
      },

      OnDocumentMouseDown: function (event) {
        this.ifMouseDown = true;
        this.x_cord = event.detail.mouseEvent.clientX;
        this.el.sceneEl.camera.el.setAttribute('look-controls', 'enabled', false);
      },

      OnDocumentMouseUp: function () {
        this.ifMouseDown = false;
        this.el.sceneEl.camera.el.setAttribute('look-controls', 'enabled', true);
      },

      OnDocumentMouseMove: function (event) {
        if (this.ifMouseDown) {
          const temp_x = event.clientX;

          if (Math.abs(this.x_cord - temp_x) > 2) {
            if (this.x_cord < temp_x) {
              this.el.object3D.rotation.y += this.data.speed;
            }

            else {
              this.el.object3D.rotation.y -= this.data.speed;
            }

            this.x_cord = temp_x;
          }
        }
      }
    });


    AFRAME.registerComponent('play-music', {
      isPlaying: false,

      toggleMusic: function (event) {
        if (this.isPlaying) {
          event.target.components.sound.stopSound();
        } else {
          event.target.components.sound.playSound();
        }
        this.isPlaying = !this.isPlaying;
      },

      init: function () {


        this.el.addEventListener('click', this.toggleMusic);
      },
      
      remove: function () {
        this.el.removeEventListener('click', this.toggleMusic);
      }

    });

  }

  initGUI() {
    const addJenkisButton = this.GUI.add({
      addJenkis: () => {
        if (!this.jenkis) {
          const jenkis = document.createElement('a-entity');
          jenkis.setAttribute('gltf-model', '#model');
          jenkis.setAttribute('scale', '1 1 1');
          jenkis.setAttribute('position', '0 0 -5');
          jenkis.id = 'jenkis';
          this.scene.appendChild(jenkis);
          this.jenkis = jenkis;
          addJenkisButton.disable();
          deleteJenkinsButton.enable();
        }


      }
    }, 'addJenkis').name('Add Jenkis');


    const deleteJenkinsButton = this.GUI.add({
      deleteJenkis: () => {
        if (this.jenkis) {
          this.jenkis.remove();
          this.jenkis = null;
          addJenkisButton.enable();
          deleteJencisButton.disable();
        }
      }
    }, 'deleteJenkis').name('Delete Jenkis');

    const toggleJenkisRotation = this.GUI.add({
      toggleJenkisRotation: () => {
        if (this.jenkis) {
          const rotateble = this.jenkis.getAttribute('mouse-rotate', '');
          if (rotateble) {
            this.jenkis.removeAttribute('mouse-rotate');
          } else {
            this.jenkis.setAttribute('mouse-rotate', '');
          }
        }
      }
    }, 'toggleJenkisRotation').name('Toggle Jenkis Rotation');

    deleteJenkinsButton.disable();


    const addSphere = this.GUI.add({
      addSphere: () => {
        const sphere = document.createElement('a-sphere');
        sphere.setAttribute('position', '0 1 -3');
        sphere.setAttribute('radius', '1');
        sphere.setAttribute('material', ' metalness:1.0; roughness:0.0');
        sphere.setAttribute('src', "url(textures/surounding.jpg)")
        this.scene.appendChild(sphere);
      }
    }, 'addSphere').name('Add Sphere');



  }

}

const app = new App();
