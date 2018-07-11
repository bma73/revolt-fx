var example = {
    list: [],
    width: 1200,
    height: 640,
    floorY: 590,
    index: 0,
    containers: {
        back: new PIXI.Graphics(),
        gradient: new PIXI.Container(),
        nav: new PIXI.Container(),
        content: new PIXI.Container(),
        standard: new PIXI.Container(),
        particle: new PIXI.particles.ParticleContainer(100000),
        stats: new PIXI.Container(),
        floor: new PIXI.Graphics(),
        fader: new PIXI.Graphics()
    },
    next: function (direction) {
        direction = direction || 1;

        var fader = example.containers.fader;
        fader.alpha = 0;
        fader.visible = true;

        TweenMax.to(fader, 0.3, {
            pixi: {alpha: 1},
            onComplete: function () {

                example.list[example.index].stop(example.app, example.fx);

                if (direction == 1) {
                    example.index++;
                    if (example.index == example.list.length) {
                        example.index = 1;
                    }
                } else if (direction == -1) {
                    example.index--;
                    if (example.index == 0) {
                        example.index = example.list.length - 1;
                    }
                }
                example.show(example.index);


                TweenMax.to(fader, 0.3, {
                    pixi: {alpha: 0}, onComplete: function () {
                        fader.visible = false;
                    }
                })
            }
        });
    },
    show(index) {
        var e = example.list[index];
        this.currentExample = e;
        e.start(example.app, example.fx);
        example.info(e.info);

    },
    info: function (text) {
        this.infoText.text = text;
    },
    rnd: {
        float: function (min, max) {
            return Math.random() * (max - min) + min;
        },
        integer: function (min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },
        sign: function (chance) {
            if (chance === void 0) {
                chance = 0.5;
            }
            return Math.random() < chance ? 1 : -1;
        }
    },
    boot: function () {

        //Setup app
        var app = this.app = new PIXI.Application(example.width, example.height,
            {
                backgroundColor: 0,
                resolution: 1,
                autoResize: true
            });

        //Hack WebGL Add BlendMode
        if (app.renderer.type == 1) {
            app.renderer.state.blendModes[PIXI.BLEND_MODES.ADD] = [app.renderer.gl.ONE, app.renderer.gl.ONE];
        }

        document.getElementById('canvas').appendChild(app.view);

        var container = this.container = new PIXI.Container();

        var containers = this.containers;
        container.addChild(containers.back);
        container.addChild(containers.gradient);
        container.addChild(containers.content);
        containers.content.addChild(containers.standard);
        containers.content.addChild(containers.particle);
        container.addChild(containers.floor);
        container.addChild(containers.stats);
        container.addChild(containers.nav);
        container.addChild(containers.fader);
        containers.nav.visible = false;

        app.stage.addChild(container);

        containers.back.beginFill(0xffffff).drawRect(0, 0, this.width, this.height).endFill();
        containers.back.visible = false;

        containers.fader.beginFill(0x0a0a0a).drawRect(0, 0, this.width, this.height).endFill();
        containers.fader.visible = false;
        containers.fader.interactive = true;

        containers.floor.beginFill(0x151515).drawRect(0, 0, this.width, this.height - this.floorY).endFill();
        containers.floor.visible = false;

        containers.floor.y = this.floorY;

        var fonts = ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'];

        var stats = new PIXI.Text('', {fontFamily: fonts, fontWeight: 200, fontSize: 13, fill: 0x999999});
        stats.x = this.width - 10;
        stats.y = 10;
        stats.anchor.set(1, 0);
        containers.stats.addChild(stats);
        containers.stats.visible = false;

        var info = this.infoText = new PIXI.Text('', {fontFamily: fonts, fontWeight: 300, fontSize: 25, fill: 0x999999});
        info.x = 10;
        info.y = 10;
        containers.stats.addChild(info);

        var loading = new PIXI.Text('Loading...', {fontFamily: fonts, fontWeight: 100, fontSize: 40, fill: 0x999999});
        loading.anchor.set(0.5);
        loading.x = example.width * 0.5;
        loading.y = example.height * 0.5;
        container.addChild(loading);


        //Create RevoltFX instance
        var fx = this.fx = new revolt.FX();


        //Update
        app.ticker.add(function (delta) {
            fx.update();
            stats.text = 'Emitters ' + fx.emitterCount + ' / Particles ' + fx.particleCount + ' / ' + Math.round(app.ticker.FPS) + ' FPS';
        });

        var that = this;
        //Load the bundle data and the example spritesheet
        PIXI.loader
            .add('fx_settings', 'assets/default-bundle.json?' + Date.now())
            .add('fx_spritesheet', 'assets/revoltfx-spritesheet.json?' + Date.now())
            .add('example_spritesheet', 'assets/rfx-examples.json?' + Date.now())
            .load(function (loader, resources) {

                containers.back.visible = true;
                container.removeChild(loading);

                var back = PIXI.Sprite.fromFrame('gradient1');
                back.width = example.width;
                back.height = example.height;
                example.containers.gradient.addChild(back);

                var nextButton = this.nextButton = PIXI.Sprite.from('arrow');
                nextButton.interactive = true;
                nextButton.anchor.set(1);
                containers.nav.addChild(nextButton);
                nextButton.x = example.width - 20;
                nextButton.y = example.height - 20;
                nextButton.on('pointerup', function () {
                    example.next(1);
                });

                var prevButton = this.prevButton = PIXI.Sprite.from('arrow');
                prevButton.interactive = true;
                prevButton.anchor.set(1);
                prevButton.scale.x = -1;
                containers.nav.addChild(prevButton);
                prevButton.x = 20;
                prevButton.y = example.height - 20;
                prevButton.on('pointerup', function () {
                    example.next(-1);
                });

                //Init the bundle
                fx.initBundle(resources.fx_settings.data);

                //Overwrite floorY value for all emitters in bundle
                fx.setFloorY(example.floorY);
                fx.maxParticles = 10000;

                example.show(example.index);

                TweenMax.to(containers.fader, 0.3, {
                    pixi: {alpha: 0}, delay: 1, onComplete: function () {
                        containers.fader.visible = false;
                    }
                })

            });


        var resize = function () {
            var w = window.innerWidth - 20;
            var ratio = example.width / example.height;

            var h2 = w / ratio;
            var scale = h2 / example.height;
            container.scale.set(scale);
            app.renderer.resize(w, h2);
        };

        window.addEventListener('resize', resize);

        resize();
    }
};

