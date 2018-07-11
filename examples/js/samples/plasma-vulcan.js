(function (app, fx) {

    var e = {
        info: 'Plasma Vulcan',
        start: function (app, fx) {

            example.containers.floor.visible = true;

            var container = this.container = example.containers.standard;
            var content = this.content = new PIXI.Container();
            container.addChild(content);

            var back = PIXI.Sprite.from('gradient2');
            back.tint = 0x0088B0;
            back.anchor.y = 1;
            back.width = example.width;
            back.height = 300;
            back.y = example.floorY;
            back.alpha = 0.6;
            content.addChild(back);

            var vulcan1 = PIXI.Sprite.from('vulcan');
            vulcan1.anchor.set(0.5, 1);
            vulcan1.scale.set(0.8, 1);
            vulcan1.x = 400;
            vulcan1.y = example.floorY;
            content.addChild(vulcan1);


            var vulcan2 = PIXI.Sprite.from('vulcan');
            vulcan2.anchor.set(0.5, 1);
            vulcan2.x = 700;
            vulcan2.y = example.floorY;
            vulcan2.scale.set(0.8, 1.2);
            content.addChild(vulcan2);


            var emitter1 = fx.getParticleEmitter('side-plasma-vulcan');
            emitter1.init(container);
            emitter1.x = vulcan1.x;
            emitter1.y = example.floorY - vulcan1.height + 30;


            var emitter2 = fx.getParticleEmitter('side-plasma-vulcan');
            emitter2.init(container, true, 1.1);
            emitter2.x = vulcan2.x;
            emitter2.y = example.floorY - vulcan2.height + 30;

        },

        stop: function (app, fx) {
            this.container.removeChild(this.content);
            example.containers.floor.visible = false;

            fx.stopAllEffects();
        },

        resize: function() {

        }
    };

    example.list.push(e);

}());