import LilGUI from 'lil-gui';
import Jenkis from './public/animation/jenkis';


class App {

  constructor() {
    this.jenkis = null;
    this.scene = document.querySelector('a-scene');
    this.camera = document.querySelector('#camera');
    this.plane = document.querySelector('#plane');
    this.GUI = new LilGUI();
    this.registerComponent();
    this.sphere = document.getElementById("sphere");
    this.jenkisSpawnAnimation = null;
    this.jenkisRockAnimation = null;
    this.speaker = document.querySelector("a-entity#speaker");
    this.initGUI();
    this.envMapInit()
  }

  registerComponent() {

    AFRAME.registerComponent('click-to-move-jankis', {

      init: () => {
        this.plane.addEventListener('click', (event) => {
          const intersection = event.detail.intersection;
          if (intersection && this.jenkis) {
            const point = intersection.point;
            this.jenkis.setAttribute('position', point);
            this.jenkisSpawnAnimation.time = 0;
            this.jenkisSpawnAnimation.play();
   
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
          console.log(event.target)
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

    AFRAME.registerComponent('shadow-material', {
      init: function () {
        this.material = new THREE.ShadowMaterial();
        this.material.opacity = 0.3; // Adjust to make the shadow more or less transparent
        this.el.getOrCreateObject3D('mesh').material = this.material;
      }
    });

    AFRAME.registerComponent('draggable', {
      schema: {
        target: {type: 'selector'},
      },
      
      init: function () {
        this.targetEl = this.data.target;
        this.ifMouseDown = false;
        this.el.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.el.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.el.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        this.el.sceneEl.addEventListener('raycaster-intersected', this.onIntersect.bind(this));
      },
      
      onMouseDown: function (event) {
        this.ifMouseDown = true;
      },
      
      onMouseUp: function (event) {
        this.ifMouseDown = false;
      },
      
      onMouseLeave: function (event) {
        this.ifMouseDown = false;
      },
      
      onIntersect: function (event) {
        if (this.ifMouseDown) {
          const intersection = event.detail.getIntersection(this.el);
          if (intersection) {
            this.targetEl.setAttribute('animation', {
              property: 'position',
              to: `${intersection.point.x} ${intersection.point.y} ${intersection.point.z}`,
              dur: 200,
              easing: 'easeOutCubic'
            });
          }
        }
      }
    });
  }

  initGUI() {

    const addJenkisButton = this.GUI.add({
      addJenkis: async () => {
        if (!this.jenkis) {
          
          const jenkisObject =  new Jenkis();
          const jenkis = jenkisObject.getJenkis();
          this.jenkisRockAnimation = jenkisObject.getRockAnimation();
          jenkis.then((model) => {
            this.scene.appendChild(model);
            this.jenkis = model;
            this.jenkisSpawnAnimation = jenkisObject.spawn;
      
          } )
         
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
          deleteJenkinsButton.disable();
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

    const jenkinsRock = this.GUI.add({
      rock: () => {
        if (this.jenkis) {
          this.jenkisRockAnimation.leftArmAnimation.play();
          this.jenkisRockAnimation.leftForeArmAnimation.play();
          this.jenkisRockAnimation.finger1.play()
          this.jenkisRockAnimation.finger2.play()
          this.jenkisRockAnimation.finger3.play()
          this.jenkisRockAnimation.finger4.play()
          this.jenkisRockAnimation.finger5.play()
          this.jenkisRockAnimation.leftShoulderAnimation.play();
          this.jenkisRockAnimation.neckAnimation.play()
          this.speaker.components.sound.playSound();
        }
      }
    }, 'rock').name('Rock!!!');

    const jenkinsStopRock = this.GUI.add({
      stopRock: () => {
        if (this.jenkis) {
          this.jenkisRockAnimation.leftArmAnimation.pause();
          this.jenkisRockAnimation.leftForeArmAnimation.pause();
          this.jenkisRockAnimation.finger1.pause()
          this.jenkisRockAnimation.finger2.pause()
          this.jenkisRockAnimation.finger3.pause()
          this.jenkisRockAnimation.finger4.pause()
          this.jenkisRockAnimation.finger5.pause()
          this.jenkisRockAnimation.leftShoulderAnimation.pause();
          this.jenkisRockAnimation.neckAnimation.pause()
          this.speaker.components.sound.stopSound();
        }
      }
    }, 'stopRock').name('Stop Rock');
   
  }
  

  

  envMapInit() {
    setTimeout(() => {
      const envMap = new THREE.CubeTextureLoader()
      .setPath('textures/reflection/')
      .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
  
     
      this.sphere.getObject3D('mesh').material.envMap = envMap;
      this.sphere.getObject3D('mesh').material.refractionRatio = 2;
    }, 1000)
  
  }

}

const app = new App();
