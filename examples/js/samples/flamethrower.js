(function (app, fx) {


    var e = {
        info: 'Flamethrower - Press to fire',
        start: function (app, fx) {

            example.containers.floor.visible = false;

            this.app = app;

            var container = this.container = example.containers.standard;
            var content = this.content = new PIXI.Container();
            this.container.addChild(content);

            content.interactive = true;
            // content.hitArea = new PIXI.Rectangle(0, 0, app.renderer.width, app.renderer.height);

            var back = PIXI.Sprite.from('fx-light01');
            back.tint = 0xFF3000;
            back.anchor.set(0.5);
            back.x = example.width * 0.5;
            back.y = example.height * 0.5;
            back.alpha = 0.2;
            back.scale.set(4);
            content.addChild(back);

            this.obstacles = [];

            var n = 10;
            while (n--) {
                var obstacle = new Obstacle();
                content.addChild(obstacle);
                this.obstacles.push(obstacle);
            }

            this.weapon = PIXI.Sprite.from('gun');
            content.addChild(this.weapon);
            this.weapon.anchor.set(0.5, 0.5);
            this.weapon.x = example.width * 0.5;
            this.weapon.y = example.height * 0.5;

            this.mousePos = app.renderer.plugins.interaction.mouse.global;

            this.emitter = fx.getParticleEmitter('top-flamethrower', true, true);
            this.emitter.settings.spawnCountMin = 10;
            this.emitter.settings.spawnCountMax = 30;
            this.emitter.init(container);
            this.emitter.x = example.width * 0.5;
            this.emitter.y = example.height * 0.5;
            this.emitter.target = this.weapon;

            //Check if particle hits obstacle - every 30th frame
            var that = this;
            this.emitter.on.particleSpawned.add(function (particle) {
                particle.on.updated.add(function (particle) {
                    var n = that.obstacles.length;
                    while (n--) {
                        var obstacle = that.obstacles[n];
                        var dx = obstacle.x - particle.x;
                        var dy = obstacle.y - particle.y;
                        if (dx * dx + dy * dy <= (obstacle.radius * obstacle.radius) * 0.9) {
                            particle.stop();
                        }
                    }
                }, null, 30);
            });

            this.emitter.paused = true;


            var lookAt = function(e) {
                var local = e.data.getLocalPosition(content);
                var dx = local.x - that.weapon.x;
                var dy = local.y - that.weapon.y;

                that.weapon.rotation = Math.atan2(dy, dx);
            };

            content.on('pointerdown', function (e) {
                lookAt(e);
                that.emitter.paused = false;
            });

            content.on('pointerup', function (e) {
                that.emitter.paused = true;
            });

            content.on('pointermove', function (e) {
                lookAt(e);
            });


            this.mod = 60;
        },

        stop: function (app, fx) {
            this.obstacles = null;
            this.container.removeChild(this.content);
            example.containers.floor.visible = false;
            fx.stopAllEffects();
        },

        resize: function () {
            this.content.hitArea = new PIXI.Rectangle(0, 0, this.app.renderer.width, this.app.renderer.height);
        }
    };


    var Obstacle = function () {
        PIXI.Graphics.call(this);
        this.radius = example.rnd.float(30, 50);
        this.beginFill(0x0a0a0a).drawCircle(0, 0, this.radius).endFill();

        var angle = example.rnd.float(0, 2 * Math.PI);
        var dist = example.rnd.float(140, 250);
        this.x = example.width * 0.5 + Math.cos(angle) * dist;
        this.y = example.height * 0.5 + Math.sin(angle) * dist;
    };
    Obstacle.prototype = Object.create(PIXI.Graphics.prototype);


    example.list.push(e);

}());