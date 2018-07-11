![logo](https://samples.revoltfx.electronauts.net/assets/rfx-logo.png)

# RevoltFX
Particle and effect system for Pixi.js  
Create particle emitters and time based effect sequences. Emitters and sequences can be nested and spawned on different particle events.

**Check out the samples**  
**<https://samples.revoltfx.electronauts.net>**

![samples](https://samples.revoltfx.electronauts.net/assets/samples.png)

The system has already been stress tested in games like [Battleboats.io](https://battleboats.io) and [Jumbled.io](https://jumbled.io) 

## Editor
To easily create your own effects use the extensive RevoltFX online editor  
**<https://editor.revoltfx.electronauts.net>**

Fork the editor on Github  
<https://github.com/bma73/revolt-fx-editor>

![editor](https://samples.revoltfx.electronauts.net/assets/editor.png)

## Install
Via NPM

```sh
npm install revolt-fx
```

```js
import {FX} from 'revolt-fx'
const fx = new FX()
```

or via script tag

```js
<script src="path/revoltfx.min.js"></script>
```

```js
const fx = new revolt.FX()
```



## Usage
### Loading and initializing
There are different ways to load the needed assets:

**Using PIXI Loader** [(Example)](https://github.com/bma73/revolt-fx/blob/master/examples/loadbundle1.html)

```js
//Create a RevoltFX instance
const fx = new revolt.FX(); //loaded via the script tag

//Load the assets using PIXI loader...
PIXI.loader
    .add('fx_settings', 'assets/default-bundle.json')
    .add('fx_spritesheet', 'assets/revoltfx-spritesheet.json')
    .add('example_spritesheet', 'assets/rfx-examples.json')
    .load(function (loader, resources) {
		
		//Init the bundle
		fx.initBundle(resources.fx_settings.data);
				
		app.ticker.add(function () {
		    //Update the RevoltFX instance
		    fx.update();
		});

    });
```

**Using FX.loadBundleFiles** [(Example)](https://github.com/bma73/revolt-fx/blob/master/examples/loadbundle2.html)

```js
//Create a RevoltFX instance
    const fx = new revolt.FX(); //loaded via the script tag

    const rfxBundleSettings = 'assets/default-bundle.json';
    const rfxSpritesheet = 'assets/revoltfx-spritesheet.json';
    const additionalAssets = ['assets/rfx-examples.json'];

    //Load bundle files and the additional example spritesheet
    fx.loadBundleFiles(rfxBundleSettings, rfxSpritesheet, null, additionalAssets).then(function (data) {

        app.ticker.add(function () {
            //Update the RevoltFX instance
            fx.update();
        });

    }).catch(function (err) {
        console.log('Error', err);
    });
```

**Using FX.loadBundleZip** [(Example)](https://github.com/bma73/revolt-fx/blob/master/examples/loadbundle3.html)

You can pass a [JSZip](https://stuk.github.io/jszip/) instance to the **loadBundleZip** method to load the bundle zip file exported by the [editor](https://github.com/bma73/revolt-fx-editor).

```js
//Create a RevoltFX instance
const fx = new revolt.FX(); //loaded via the script tag

//Create a JSZip instance and pass it to the "loadBundleZip" method
const zip = new JSZip();

fx.loadBundleZip('assets/default-bundle.zip', zip, ['assets/rfx-examples.json']).then(function (data) {

       app.ticker.add(function () {
        //Update the RevoltFX instance
        fx.update();
    });

}).catch(function (err) {
    console.log('Error', err);
});
```

### Particle Emitters
After the system is initialized you can create particle emitters defined in your bundle by using their names:

```js
//Get the emitter 
const emitter = fx.getParticleEmitter('plasma-corona');

//Inititialize it with the target PIXI container
emitter.init(displayContainer);
```

You can also change the global scale of an emitter instance

```js
//Get the emitter 
const emitter = fx.getParticleEmitter('plasma-corona');

//Inititialize it with the target PIXI container and a scale of 2
emitter.init(displayContainer, true, 2);
```

Pause an emitter

```js
emitter.paused = true;
```

Stop an emitter to be recycled. Pass **true** (default) to the method, if the system shall wait until all particles have died, before recycling. 
 
```js
emitter.stop();
``` 

Set the x/y position and rotation

```js
emitter.x = 100;
emitter.y = 100;
emitter.rotation = Math.PI;
``` 

Set a target, so that the emitter will automatically adopt the target's position and rotation

```js
emitter.target = displayObject;
``` 

Set a target offset, so that the emitter will automatically offset its position

```js
emitter.targetOffet = 50;
```

### Effect Sequences
After the system is initialized you can create effect sequences defined in your bundle by using their names:

```js
//Get the effect sequence 
const sequence = fx.getEffectSequence('top-big-explosion');

//Inititialize it with the target PIXI container
sequence.init(displayContainer);
```

Set delay, autostart and scale

```js
//Get the effect sequence 
const sequence = fx.getEffectSequence('top-big-explosion');

const delay = 0.5;
const autostart = true;
const scale = 1.5;
sequence.init(displayContainer, delay, autostart, scale);
```

Set the x/y position and rotation

```js
sequence.init = 100;
sequence.init = 100;
sequence.init = Math.PI;
``` 

### Events
ParticleEmitters, Particles and EffectSequences dispatch signals on different events

#### ParticleEmitter

```js
emitter.on.started.add(emitter => { });
emitter.on.exhausted.add(emitter => { });
emitter.on.completed.add(emitter => { });
emitter.on.particleUpdated.add(particle => { });
emitter.on.particleSpawned.add(particle => { });
emitter.on.particleBounced.add(particle => { });
emitter.on.particleDied.add(particle => { });
``` 
*Usage* [(Example)](https://github.com/bma73/revolt-fx/blob/master/examples/events-particleemitter.html)

```js
emitter.on.particleSpawned.add(particle => {
    console.log('Particle spawned:', particle);
});

emitter.on.completed.addOnce(function(emitter) {
    console.log('Done');
});
``` 



#### Particle

```js
particle.on.bounced(particle => { });
particle.on.updated(particle => { });
particle.on.died(particle => { });
``` 

*Usage*

```js
emitter.on.particleSpawned.add(particle => {
    
    //Register for an update signal for that particle
    particle.on.updated.add(particle => {
        //Do something with the particle
        if (particle.x > 200 && particle.time >= 0.5) {
        	particle.stop();
        }
    });

    //Register for a died signal for that particle
    particle.on.died.add(particle => {
        console.log('Particle', particle, 'died');
    });
});
```


#### EffectSequence

```js
sequence.on.started(sequence => { });
sequence.on.exhausted(sequence => { });
sequence.on.completed(sequence => { });
sequence.on.effectSpawned((effectType, effect) => { });
sequence.on.triggerActivated(triggerValue => { });
```
*Usage* [(Example)](https://github.com/bma73/revolt-fx/blob/master/examples/events-particleemitter.html)

```js
sequence.on.effectSpawned.add((type, effect) => {
	console.log('Effect spawned:', type, effect);
});

sequence.on.triggerActivated.add(triggerValue => {
	console.log('Trigger:', triggerValue);
});
```


#### "Add" BlendMode artifacts with WebGL renderer####

If you encounter black artifacts on transparent particle areas which are using the "Add" blendmode (e.g. on mobile), try to hack the blendmode settings of the WebGL renderer instance:

```js
const renderer = app.renderer;
const gl = renderer.gl;
renderer.state.blendModes[PIXI.BLEND_MODES.ADD] = [gl.ONE, gl.ONE];
```


## Build
If you haven't already installed Grunt get it with

```sh
npm install -g grunt-cli
```
 

Clone the repository and to compile the Typescript sources and create the distribution version run  
 
```sh
npm install
npm run dist
```
