//function fireworks(canvas_id) {
    let canvas_id = "fireworks_container";
    let canvas = document.getElementById(canvas_id);
    let canvas_styles = window.getComputedStyle(canvas);
    let width = 890; //canvas.innerWidth;
    let height = 315; //canvas.innerHeight;
    /*
    let width = parseInt(canvas_styles.getPropertyValue('width')); //890; //canvas.innerWidth;
    let height = parseInt(canvas_styles.getPropertyValue('height')); //315; //canvas.innerHeight;
    */

    // Create a Pixi renderer and set it to transparent
    const renderer = PIXI.autoDetectRenderer(width, height, {
        transparent: true
    });
    
    //Create a Pixi stage (for our objects)
    const stage = new PIXI.Container();

    // Add the renderer view to our html document
    $("#" + canvas_id).append(renderer.view);
    
    //const texture = PIXI.Texture.fromImage('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rp-0.png?123');
    const textures = [PIXI.Texture.WHITE];
    let currentTexture = 0;
    const particles = [];
    const gravity = 0.03;

    /*
    const initTextures = function() {
        for (let i = 0; i < 10; i++) {
            textures.push(PIXI.Texture.fromImage(`https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rp-${i}.png?123`));
        }
    };
    */

    const getParticle = function(texture, scale) {
        // get the first particle that has been used
        let particle;
        // check for a used particle (alpha <= 0)
        for (var i = 0, l = particles.length; i < l; i++) {
            if (particles[i].sprite.alpha <= 0) {
                particle = particles[i];
                break;
            }
        }
        // update characteristics of particle
        if (particle) {
            particle.reset(texture, scale);
            return particle;
        }

        // otherwise create a new particle
        particle = new Particle(texture, scale);
        particles.push(particle);
        stage.addChild(particle.sprite);
        return particle;
    };

    class Particle {
        constructor(texture, scale) {
            this.texture = texture;
            this.sprite = new PIXI.Sprite(this.texture);
            this.sprite.tint = 0xEBE9C1; //Change with the color wanted
            //this.sprite.scale.x = 0.2;
            //this.sprite.scale.y = 0.2;
            this.sprite.width = 10*scale;
            this.sprite.height = 10*scale;
            this.velocity = {x: 0, y: 0};
            this.explodeHeight = 0.4 + Math.random()*0.5;
        }

        reset(texture, scale) {
            this.sprite.alpha = 1;
            this.sprite.scale.x = scale;
            this.sprite.scale.y = scale;
            this.sprite.texture = texture;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.toExplode = false;
            this.exploded = false;
            this.fade = false;
        }

        setPosition(pos) {
            this.sprite.position.x = pos.x;
            this.sprite.position.y = pos.y;
        }
        
        setVelocity(vel) {
            this.velocity = vel;
        }
        
        update() {
            // this runs one step on each frame
            this.sprite.position.x += this.velocity.x;
            this.sprite.position.y += this.velocity.y;
            this.velocity.y += gravity;
            if (this.toExplode && !this.exploded) {
                // explode
                if (this.sprite.position.y < height * this.explodeHeight) {
                    this.sprite.alpha = 0;
                    this.exploded = true;
                    explode(this.sprite.position, this.sprite.texture, this.sprite.scale.x);
                }
            }
            
            if (this.fade) {
                this.sprite.alpha -= 0.01;
            }
        }
    }

    const explode = function(position, texture, scale) {
        // Number of pieces in the explosion
        const steps = 8 + Math.round(Math.random()*6);

        // size of explosion
        const radius = 2 + Math.random()*2;

        for (var i = 0; i < steps; i++) {
            // get velocity
            const x = radius * Math.cos(2 * Math.PI * i / steps);
            const y = radius * Math.sin(2 * Math.PI * i / steps);

            // add particle
            const particle = getParticle(texture, scale);
            particle.fade = true;
            particle.setPosition(position);
            particle.setVelocity({x, y});
        }
    };

    const launchParticle = function() {
        const particle = getParticle(textures[currentTexture], Math.random()*0.5);
        currentTexture++;
        if (currentTexture > textures.length-1) {
            currentTexture = 0;
        }
        particle.setPosition({x: Math.random()*width, y: height});
        const speed = height*0.01;
        particle.setVelocity({x: -speed/2 + Math.random()*speed, y: -speed + Math.random()*-1});
        particle.toExplode = true;
        
        // launch a new particle (to keep fireworks going)
        if (document.hasFocus()) {
            setTimeout(launchParticle, 200 + Math.random()*400);
        }
    };
    
    const loop = function() {
        requestAnimationFrame(loop);
        for (var i = 0, l = particles.length; i < l; i++) {
            particles[i].update();
        }
        renderer.render(stage);
    };

    //initTextures();
    launchParticle();
    loop();
//}

// Sparks
        let canvasContainer = $("#sparks_container");
        let widthSparks = canvasContainer.width();
        let heightSparks = canvasContainer.height();

        // Create a Pixi renderer and set it to transparent
        const rendererSparks = PIXI.autoDetectRenderer(widthSparks, heightSparks, {
            transparent: true
        });
        
        //Create a Pixi stage (for our objects)
        const stageSparks = new PIXI.Container();

        // Add the renderer view to our html document
        $("#sparks_container").append(rendererSparks.view);
        
        //const texture = PIXI.Texture.fromImage('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rp-0.png?123');
        const texturesSparks = [PIXI.Texture.WHITE];
        let currentTextureSparks = 0;
        const sparks = [];
        const gravitySparks = 0.5;

        /*
        const initTextures = function() {
            for (let i = 0; i < 10; i++) {
                textures.push(PIXI.Texture.fromImage(`https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rp-${i}.png?123`));
            }
        };
        */

        const getSpark = function(texture, scale) {
            // get the first particle that has been used
            let spark;
            // check for a used particle (alpha <= 0)
            for (var i = 0, l = sparks.length; i < l; i++) {
                if (sparks[i].sprite.alpha <= 0) {
                    spark = sparks[i];
                    break;
                }
            }
            // update characteristics of particle
            if (spark) {
                spark.reset(texture, scale);
                return spark;
            }
  
            // otherwise create a new particle
            spark = new Spark(texture, scale);
            sparks.push(spark);
            stageSparks.addChild(spark.sprite);
            return spark;
        };

        class Spark {
            constructor(texture, scale) {
                this.texture = texture;
                this.sprite = new PIXI.Sprite(this.texture);
                this.sprite.tint = 0xe7aa00; //Change with the color wanted
                this.sprite.scale.x = 1;
                this.sprite.scale.y = 1;
                this.sprite.width = 2; //.5*scale;
                this.sprite.height = 2; //.5*scale;
                this.velocity = {x: 0, y: 0};
                this.explodeHeight = 0.4 + Math.random()*0.5;
            }

            reset(texture, scale) {
                this.sprite.alpha = 1;
                //this.sprite.scale.x = scale;
                //this.sprite.scale.y = scale;
                this.sprite.texture = texture;
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.toExplode = false;
                this.exploded = false;
                this.fade = false;
            }

            setPosition(pos) {
                this.sprite.position.x = pos.x;
                this.sprite.position.y = pos.y;
            }
            
            setVelocity(vel) {
                this.velocity = vel;
            }
            
            update() {
                // this runs one step on each frame
                this.sprite.position.x += this.velocity.x;
                this.sprite.position.y += this.velocity.y;
                this.velocity.y += gravitySparks;
                if (this.toExplode && !this.exploded) {
                    // explode
                    if (this.sprite.position.y < height * this.explodeHeight) {
                        this.sprite.alpha = 0;
                        this.exploded = true;
                        explodeSparks(this.sprite.position, this.sprite.texture, this.sprite.scale.x);
                    }
                }
                
                if (this.fade) {
                    this.sprite.alpha -= 0.001;
                }
            }
        }

        const explodeSparks = function(position, texture, scale) {
            // Number of pieces in the explosion
            const steps = 20 + Math.round(Math.random()*20);

            // size of explosion
            //const radius = 2 + (Math.random() * 2);

            for (var i = 0; i < steps; i++) {
                const radius = 2 + (Math.random() * 2);
                // get velocity
                const x = radius * Math.cos(2 * Math.PI * i / steps);
                const y = Math.random() * 10; // * (i / steps); //radius * Math.sin(2 * Math.PI * i / steps);

                // add particle
                const spark = getSpark(texture, scale);
                spark.fade = true;
                spark.setPosition(position);
                spark.setVelocity({x, y});
            }
        };

        let total_sparks_count = 0;
        let sparks_max = 4;

        const launchSpark = function() {
            total_sparks_count++;
            if (total_sparks_count > sparks_max) {
                total_sparks_count = 1;
            }
            const spark = getSpark(texturesSparks[currentTextureSparks], Math.random());
            currentTextureSparks++;
            if (currentTextureSparks > texturesSparks.length-1) {
                currentTextureSparks = 0;
            }
            spark.setPosition({ x: (width/sparks_max)*total_sparks_count - (width/sparks_max/2), y: 1 });
            const speed = 1; //height*0.01;
            spark.setVelocity({x: Math.random()*speed, y: speed + Math.random()});
            spark.toExplode = true;
            
            // launch a new particle (to keep fireworks going)
            if (document.hasFocus()) {
                setTimeout(launchSpark, Math.round(Math.random()*10)); //200 + Math.random()*600);
            }
        };
        
        const loopSparks = function() {
            requestAnimationFrame(loopSparks);
            for (var i = 0, l = sparks.length; i < l; i++) {
                sparks[i].update();
            }
            rendererSparks.render(stageSparks);
        };

        //initTextures();
        launchSpark();
        loopSparks();