window.onload = function () {
// Create a scene and a camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a renderer and add it to the document
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a light and add it to the scene
var light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 0);
scene.add(light);
var ai;
// Create a pet model and add it to the scene
var loader = new THREE.GLTFLoader();
var pet;
loader.load('pet.glb', function (gltf) {
  pet = gltf.scene;
  pet.scale.set(0.5, 0.5, 0.5);
  pet.position.set(0, 0, -5);
  scene.add(pet);
  
// Create an AI for the pet
var ai = new PetAI(pet);

// Create a user interface for interacting with the pet
var ui = new PetUI(ai);

});

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  
    // Check if the ai variable is defined before calling the update method
    if (ai) {
      ai.update();
      ui.update();
    }
  }
  animate();

// Define the PetAI class
function PetAI(pet) {
  this.pet = pet; // The pet model
  this.name = 'Fluffy'; // The pet name
  this.hunger = 50; // The pet hunger level (0-100)
  this.happiness = 50; // The pet happiness level (0-100)
  this.energy = 50; // The pet energy level (0-100)
  this.state = 'idle'; // The pet state ('idle', 'sleeping', 'eating', 'playing', 'following')
  this.target = null; // The target object for the pet to follow or interact with
}

// Define the update method for the PetAI class
PetAI.prototype.update = function () {
  // Update the pet levels based on time and state
  this.hunger -= 0.01;
  this.energy -= 0.01;
  if (this.state === 'sleeping') {
    this.happiness += 0.02;
    this.energy += 0.05;
    if (this.energy > 80) {
      this.wakeUp();
    }
  } else if (this.state === 'eating') {
    this.hunger += 0.05;
    this.happiness += 0.01;
    if (this.hunger > 80) {
      this.stopEating();
    }
  } else if (this.state === 'playing') {
    this.happiness += 0.05;
    this.energy -= 0.05;
    if (this.energy < 20) {
      this.stopPlaying();
    }
  } else if (this.state === 'following') {
    this.happiness += 0.01;
    this.energy -= 0.02;
    if (this.energy < 20) {
      this.stopFollowing();
    }
    if (this.target) {
      this.moveTo(this.target.position);
    }
  } else if (this.state === 'idle') {
    this.happiness -= 0.01;
    if (this.hunger < 20) {
      this.findFood();
    } else if (this.energy < 20) {
      this.sleep();
    } else if (this.happiness < 20) {
      this.findToy();
    } else {
      this.randomMove();
    }
  }

  // Clamp the pet levels between 0 and 100
  this.hunger = Math.min(Math.max(this.hunger, 0), 100);
  this.happiness = Math.min(Math.max(this.happiness, 0),

100);
this.energy = Math.min(Math.max(this.energy,0),100);

// Make the pet model look at the camera
this.pet.lookAt(camera.position);

// Make the pet model animate based on state
if(this.state === 'sleeping'){
this.pet.rotation.x = Math.PI/2; // Lie down
}else{
this.pet.rotation.x =0; // Stand up
}
// Make the pet model animate based on state
if (this.state === 'sleeping') {
  this.pet.rotation.x = Math.PI / 2; // Lie down
} else {
  this.pet.rotation.x = 0; // Stand up
}
if (this.state === 'eating') {
  this.pet.rotation.y += 0.1; // Nod head
} else if (this.state === 'playing') {
  this.pet.rotation.z += 0.1; // Wag tail
}
};
// Define some helper methods for the PetAI class
PetAI.prototype.moveTo = function (position) {
  // Move the pet model towards a given position
  var direction = position.clone().sub(this.pet.position).normalize();
  var speed = 0.1;
  this.pet.position.add(direction.multiplyScalar(speed));
};

PetAI.prototype.randomMove = function () {
  // Move the pet model randomly
  var angle = Math.random() * Math.PI * 2;
  var distance = Math.random() * 0.1;
  var x = Math.cos(angle) * distance;
  var z = Math.sin(angle) * distance;
  this.pet.position.x += x;
  this.pet.position.z += z;
};

PetAI.prototype.findFood = function () {
  // Find a food object in the scene and set it as the target
  var food = scene.getObjectByName('food');
  if (food) {
    this.target = food;
    this.state = 'following';
    console.log(this.name + ' is hungry and looking for food.');
  } else {
    console.log(this.name + ' is hungry but there is no food.');
  }
};

PetAI.prototype.findToy = function () {
  // Find a toy object in the scene and set it as the target
  var toy = scene.getObjectByName('toy');
  if (toy) {
    this.target = toy;
    this.state = 'following';
    console.log(this.name + ' is bored and looking for a toy.');
  } else {
    console.log(this.name + ' is bored but there is no toy.');
  }
};

PetAI.prototype.sleep = function () {
  // Set the state to sleeping
  this.state = 'sleeping';
  console.log(this.name + ' is tired and sleeping.');
};

PetAI.prototype.wakeUp = function () {
  // Set the state to idle
  this.state = 'idle';
  console.log(this.name + ' is awake and ready to play.');
};

PetAI.prototype.eat = function () {
  // Set the state to eating
  this.state = 'eating';
  console.log(this.name + ' is eating.');
};

PetAI.prototype.stopEating = function () {
  // Set the state to idle and remove the target
  this.state = 'idle';
  this.target = null;
  console.log(this.name + ' is full and happy.');
};

PetAI.prototype.play = function () {
  // Set the state to playing
  this.state = 'playing';
  console.log(this.name + ' is playing.');
};

PetAI.prototype.stopPlaying = function () {
  // Set the state to idle and remove the target
  this.state = 'idle';
  this.target = null;
  console.log(this.name + ' is tired and needs a nap.');
};

PetAI.prototype.follow = function (object) {
  // Set the target to a given object and the state to following
  this.target = object;
  this.state = 'following';
  console.log(this.name + ' is following ' + object.name + '.');
};

PetAI.prototype.stopFollowing = function () {
  // Set the state to idle and remove the target
  this.state = 'idle';
  this.target = null;
  console.log(this.name + ' is no longer following anything.');
};

// Define the PetUI class
function PetUI(ai) {
  this.ai = ai; // The pet AI
  this.container = document.getElementById('ui'); // The UI container element
  this.nameLabel = document.getElementById('name'); // The name label element
  this.hungerBar = document.getElementById('hunger'); // The hunger bar element
  this.happinessBar = document.getElementById('happiness'); // The happiness bar element
  this.energyBar = document.getElementById('energy'); // The energy bar element
}
PetUI.prototype.update = function () {
  // Update the UI elements based on the pet AI levels and state
  this.nameLabel.textContent = this.ai.name;
  this.hungerBar.style.width = this.ai.hunger + '%';
  this.happinessBar.style.width = this.ai.happiness + '%';
  this.energyBar.style.width = this.ai.energy + '%';
};

// Define some event listeners for the UI elements
document.getElementById('feed').addEventListener('click', function () {
  // Create a food object and add it to the scene
  var food = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshLambertMaterial({ color: 0xff0000 })
  );
  food.name = 'food';
  food.position.set(Math.random() * 10 - 5, 0.25, Math.random() * 10 - 5);
  scene.add(food);
});

document.getElementById('play').addEventListener('click', function () {
  // Create a toy object and add it to the scene
  var toy = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 32, 32),
    new THREE.MeshLambertMaterial({ color: 0x00ff00 })
  );
  toy.name = 'toy';
  toy.position.set(Math.random() * 10 - 5, 0.25, Math.random() * 10 - 5);
  scene.add(toy);
});
document.getElementById('pet').addEventListener('click', function () {
    // Make the pet follow the camera
    ai.follow(camera);
  });
  
  document.getElementById('rename').addEventListener('click', function () {
    // Prompt the user to enter a new name for the pet
    var newName = prompt('Enter a new name for your pet:');
    if (newName) {
      ai.name = newName;
    }
  });}