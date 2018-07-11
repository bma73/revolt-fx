(function (app, fx) {


    var e = {
        info: 'Stone Splash - Click to throw some stones',
        start: function (app, fx) {

            this.app = app;

            var container = this.container = example.containers.standard;
            var content = this.content = new PIXI.Container();
            var shadows = this.shadows = new PIXI.Container();
            this.container.addChild(shadows);
            this.container.addChild(content);

            example.containers.floor.visible = false;

            content.interactive = true;

            example.containers.gradient.visible = false;
            example.containers.back.tint = 0x134949;

            var back = PIXI.Sprite.from('gradient2');
            back.tint = 0x565707;
            back.anchor.y = 1;
            back.width = example.width;
            back.height = example.height;
            back.y = example.height;
            back.alpha = 0.3;
            back.blendMode = PIXI.BLEND_MODES.ADD;
            content.addChild(back);


            var ocean = fx.getParticleEmitter('top-ocean-sub1', true, true);
            ocean.init(container);
            ocean.settings.particleSettings.alphaStartMin = 0.6;
            ocean.settings.particleSettings.alphaStartMax = 0.8;
            ocean.x = example.width * 0.4;
            ocean.y = example.height * 0.5;

            var that = this;

            var throwStones = function(x,y) {

                var emitter = fx.getParticleEmitter('top-stone-splash');

                emitter.x = x;
                emitter.y = y;

                //Attach a shadow to each stone particle
                emitter.on.particleSpawned.add(function (particle) {
                    that.shadows.addChild(new Shadow(particle));
                });

                emitter.init(container);
            };

            content.on('pointerdown', function (e) {
                var local = e.data.getLocalPosition(content);
                throwStones(local.x, local.y);
            });

        },

        stop: function (app, fx) {
            example.containers.gradient.visible = true;
            this.container.removeChild(this.content);
            fx.stopAllEffects();
        },

        resize: function() {
        }
    };

    var Shadow = function (particle) {
        PIXI.Sprite.call(this, PIXI.Texture.from('fx-dot'));

        this.tint = 0;
        this.alpha = 0.1;
        this.anchor.set(0.5, 0.5);

        var that = this;

        //Register to particle update signals
        particle.on.updated.add(function (particle) {
            var fac = Math.sin(particle.time * Math.PI * 1.1);

            that.x = particle.x + 35 * fac;
            that.y = particle.y + 35 * fac;

            var scale = 1.1 - (0.2 * fac);
            that.scale.set(scale, scale);
        });

        particle.on.died.addOnce(function(particle) {
            that.parent.removeChild(that);
        });
    };

    Shadow.prototype = Object.create(PIXI.Sprite.prototype);


    example.list.push(e);

}());