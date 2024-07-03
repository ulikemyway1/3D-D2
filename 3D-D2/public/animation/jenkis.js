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
            this.createLeftHandRockAnimation();

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
        const leftHand = jenkis.getObjectByName('mixamorigRightArm');



        if (leftHand) {
            this.jenkisParts.leftHand = leftHand;
        }

    }

    createLeftHandRockAnimation() {
        const leftHand = this.jenkisParts.leftHand;
        if (leftHand) {
            const controller = gsap.to(leftHand.rotation, {
                duration: 1,
                yoyo: true,
                repeat: -1,
                x: gradToRad(20),
                y: gradToRad(101),
                z: gradToRad(-120),
                ease: "linear",
            });
            controller.pause();

            this.rockAnimation.leftHandAnimation = controller;
        }


    }


    getJenkis() {
        return this.jenkis;
    }

    getRockAnimation() {
        return this.rockAnimation;
    }
}
