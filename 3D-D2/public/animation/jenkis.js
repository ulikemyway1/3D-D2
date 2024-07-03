import gradToRad from "../helpers/animationHelpres";

export default class Jenkis {



    constructor() {
        this.jenkis = this.createJenkis();
        this.jenkisParts = {};
        this.rockAnimation = {};
        this.mixer = null;
        this.spawn = null;
    }

    async createJenkis() {
        const jenkisEntity = document.createElement('a-entity');
        jenkisEntity.setAttribute('scale', '1 1 1');
        jenkisEntity.setAttribute('position', '0 0 -5');
        jenkisEntity.setAttribute('shadow', '');
        jenkisEntity.setAttribute('draggable', 'target: #jenkis');
        jenkisEntity.id = 'jenkis';

        try {
            const loader = new THREE.GLTFLoader();
            const jenkisModel = await loader.loadAsync('models/Jenkins.gltf');

            this.mixer = new THREE.AnimationMixer(jenkisModel.scene );
            console.log(this.mixer)
            this.findJenkisParts(jenkisModel.scene);
            this.findExistingAnimations(jenkisModel)
            this.createLeftArmRockAnimation();
            this.createLeftForeArmRockAnimation();
            this.createLeftHandRockFingersAnimatiom();
            this.createLeftShoulderAnimation();
            this.createNeckAnimation();
            jenkisEntity.setObject3D('mesh', jenkisModel.scene);
        } catch (error) {
            console.error(`Error loading Jenkis model: ${error.message}`);
        }

        return jenkisEntity;
    }

    findExistingAnimations(jenkisModel) {
        const animations = jenkisModel.animations;
        const spawnAnimationClip = THREE.AnimationClip.findByName(animations, '2_spawne');
        const spawnAnimation = this.mixer.clipAction( spawnAnimationClip );
        spawnAnimation.stop();
        this.spawn = spawnAnimation;
    }

    findJenkisParts(jenkis) {
        console.log(jenkis)
        this.jenkisParts.leftShoulder = jenkis.getObjectByName('mixamorigLeftShoulder');
        this.jenkisParts.leftArm = jenkis.getObjectByName('mixamorigLeftArm');
        this.jenkisParts.leftForeArm = jenkis.getObjectByName('mixamorigLeftForeArm');
        this.jenkisParts.leftHand = jenkis.getObjectByName('mixamorigLeftHand');
        this.jenkisParts.finger1 = jenkis.getObjectByName('mixamorigLeftHandThumb1');
        this.jenkisParts.finger2 = jenkis.getObjectByName('mixamorigLeftHandIndex1');
        this.jenkisParts.finger3 = jenkis.getObjectByName('mixamorigLeftHandMiddle1');
        this.jenkisParts.finger4 = jenkis.getObjectByName('mixamorigLeftHandRing1');
        this.jenkisParts.finger5 = jenkis.getObjectByName('mixamorigLeftHandPinky1');
        this.jenkisParts.neck = jenkis.getObjectByName('mixamorigNeck');
    

    }

    createLeftArmRockAnimation() {
        const leftArm = this.jenkisParts.leftArm;
        if (leftArm) {
            const controller = gsap.to(leftArm.rotation, {
                duration: 1,
                yoyo: false,
                repeat: 0,
                x: gradToRad(-29.17),
                y: gradToRad(-31.89),
                z: gradToRad(-7.91),
                ease: "linear",
            });
            controller.pause();

            this.rockAnimation.leftArmAnimation = controller;
        }
    }

    createLeftShoulderAnimation() {
        const leftShoulder = this.jenkisParts.leftShoulder;
        if (leftShoulder) {
            const controller = gsap.to(leftShoulder.rotation, {
                delay: 1,
                duration: 0.25,
                yoyo: true,
                repeat: -1,
                x: gradToRad(125,33),
                y: gradToRad(-18.15),
                z: gradToRad(-75.57),
                ease: "bounce.inOut",
            });
            controller.pause();

            this.rockAnimation.leftShoulderAnimation = controller;
        }
    }


    createLeftForeArmRockAnimation() {
        const leftForeArm = this.jenkisParts.leftForeArm;
        if (leftForeArm) {
            const controller = gsap.to(leftForeArm.rotation, {
                duration: 1,
                yoyo: false,
                repeat: 0,
                x: gradToRad(21.16),
                y: gradToRad(-41.78),
                z: gradToRad(95.46),
                ease: "linear",
            });
            controller.pause();
            this.rockAnimation.leftForeArmAnimation = controller;
        }

    }

    createLeftHandRockFingersAnimatiom() {
        const leftFinger1 = this.jenkisParts.finger1;
        if (leftFinger1) {
            const controller = gsap.to(leftFinger1.rotation, {
                duration: 1,
                yoyo: false,
                repeat: 0,
                x: gradToRad(30.32),
                y: gradToRad(-17.77),
                z: gradToRad(13.25),
                ease: "linear",
            });
            controller.pause();
            this.rockAnimation.finger1 = controller;
            console.log('finger')
        }

        const leftFinger2 = this.jenkisParts.finger2;
        if (leftFinger2) {
            const controller = gsap.to(leftFinger2.rotation, {
                duration: 1,
                yoyo: false,
                repeat: 0,
                x: gradToRad(3.90),
                y: gradToRad(-5.20),
                z: gradToRad(-2.84),
                ease: "linear",
            });
            controller.pause();
            this.rockAnimation.finger2 = controller;
            console.log('finger')
        }

        const leftFinger3 = this.jenkisParts.finger3;
        if (leftFinger3) {
            const controller = gsap.to(leftFinger3.rotation, {
                duration: 1,
                yoyo: false,
                repeat: 0,
                x: gradToRad(111.88),
                y: gradToRad(-3.69),
                z: gradToRad(2.72),
                ease: "linear",
            });
            controller.pause();
            this.rockAnimation.finger3 = controller;
            console.log('finger')
        }

        const leftFinger4 = this.jenkisParts.finger4;
        if (leftFinger4) {
            const controller = gsap.to(leftFinger4.rotation, {
                duration: 1,
                yoyo: false,
                repeat: 0,
                x: gradToRad(99.61),
                y: gradToRad(-17.24),
                z: gradToRad(5.42),
                ease: "linear",
            });
            controller.pause();
            this.rockAnimation.finger4 = controller;
            console.log('finger')
        }

        const leftFinger5 = this.jenkisParts.finger5;
        if (leftFinger5) {
            const controller = gsap.to(leftFinger5.rotation, {
                duration: 1,
                yoyo: false,
                repeat: 0,
                x: gradToRad(-22.04),
                y: gradToRad(-19.52),
                z: gradToRad(9.58),
                ease: "linear",
            });
            controller.pause();
            this.rockAnimation.finger5 = controller;
            console.log('finger')
        }

        

    }

    createNeckAnimation() {
        const neck = this.jenkisParts.neck;
        if (neck) {
            const controller = gsap.to(neck.rotation, {
                delay: 1,
                duration: 0.25,
                yoyo: true,
                repeat: -1,
                x: gradToRad(9.96),
                y: gradToRad(8.55),
                z: gradToRad(-5.04),
                ease: "power3.inOut",
            });
            controller.pause();
            this.rockAnimation.neckAnimation = controller;
        }
    }


    getJenkis() {
        return this.jenkis;
    }

    getRockAnimation() {
        return this.rockAnimation;
    }
}
