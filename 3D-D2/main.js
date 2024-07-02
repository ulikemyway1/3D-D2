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
      addJenkis: () => {
        if (!this.jenkis) {
          const jenkis = document.createElement('a-entity');
          jenkis.setAttribute('gltf-model', '#model');
          jenkis.setAttribute('scale', '1 1 1');
          jenkis.setAttribute('position', '0 0 -5');
          jenkis.setAttribute('shadow', '');
          jenkis.setAttribute('draggable',"target: #jenkis")
          jenkis.id = 'jenkis';

          jenkis.addEventListener('model-loaded', function() {

            const model = this.getObject3D('mesh');
            const jenkisPieces = [];
            let index = 0;
            model.traverse(function(node) {
              index++
              if (index === 38 )
              jenkisPieces.push(node)
            });

            console.log( jenkisPieces)
            handAnimation(jenkisPieces[0])
          });
    

          this.scene.appendChild(jenkis);
          this.jenkis = jenkis;
          addJenkisButton.disable();
          deleteJenkinsButton.enable();
        }


      }
    }, 'addJenkis').name('Add Jenkis');

    function handAnimation (segment) {
      let targetRotation = {
        x: 1.7091365432734693 * (180 / Math.PI),
        y: 0.3842457317252173 * (180 / Math.PI),
        z: 1.3930402014111694 * (180 / Math.PI)
      };
      
      gsap.to(segment.rotation, {
        duration: 10, // Duration of the animation in seconds
        _x: targetRotation.x,
        _y: targetRotation.y,
       _z: targetRotation.z,
        ease: "power1.inOut" // Easing function for the animation
      });
    }

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

    const jenkinsRock = this.GUI.add({
      rock: () => {
        if (this.jenkis) {
          console.log(this.jenkis)
        }
      }
    }, 'rock').name('Rock!!!');





  }

}

const app = new App();
