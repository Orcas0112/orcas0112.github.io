'use strict';
// Pack names, odds and externally hosted artwork mappings were preserved from the supplied extension.
// These are snapshot simulator values, not verified live official odds.
const PACKS = [
 {id:'medieval',name:'Medieval Pack',items:[['Witch','Uncommon',13.4],['Wizard','Uncommon',13.4],['Elf','Uncommon',13.4],['Fairy','Uncommon',13.4],['Slime Monster','Uncommon',13.4],['Dragon','Rare',9],['Jester','Rare',9],['Queen','Rare',9],['Unicorn','Epic',5],['King','Legendary',1]]},
 {id:'wonderland',name:'Wonderland Pack',items:[['Two of Spades','Uncommon',15.2],['Eat Me','Uncommon',15],['Drink Me','Uncommon',15],['Alice','Uncommon',15],['Queen of Hearts','Uncommon',15],['Cheshire Cat','Rare',6.5],['Dormouse','Rare',6.5],['White Rabbit','Rare',6.5],['Caterpillar','Epic',2.5],['Mad Hatter','Epic',2.5],['King of Hearts','Legendary',.3]]},
 {id:'space',name:'Space Pack',items:[['Alien','Uncommon',18.75],['Earth','Uncommon',18.75],['Meteor','Uncommon',18.75],['Stars','Uncommon',18.75],['Planet','Rare',10],['UFO','Rare',10],['Spaceship','Epic',4.5],['Astronaut','Legendary',.45],['Red Astronaut','Chroma',.05],['Brown Astronaut','Chroma',0],['Green Astronaut','Chroma',0],['Pink Astronaut','Chroma',0],['Orange Astronaut','Chroma',0],['Yellow Astronaut','Chroma',0],['Black Astronaut','Chroma',0]]},
 {id:'breakfast',name:'Breakfast Pack',items:[['Toast','Uncommon',12.5],['Cereal','Uncommon',12.5],['Yogurt','Uncommon',12.5],['Breakfast Combo','Uncommon',12.5],['Orange Juice','Uncommon',12.5],['Milk','Uncommon',12.5],['Pancakes','Rare',9],['Waffle','Rare',9],['French Toast','Epic',3.5],['Pizza','Epic',3.5]]},

 {id:'bot',name:'Bot Pack',items:[['Lil Bot','Uncommon',19.5],['Lovely Bot','Uncommon',19.5],['Angry Bot','Uncommon',19.5],['Happy Bot','Uncommon',19.5],['Watson','Rare',9],['Buddy Bot','Rare',9],['Brainy Bot','Epic',3.7],['Mega Bot','Legendary',.3]]},
 {id:'aquatic',name:'Aquatic Pack',items:[['Old Boot','Uncommon',15],['Jellyfish','Uncommon',15],['Clownfish','Uncommon',15],['Frog','Uncommon',15],['Crab','Uncommon',15],['Pufferfish','Rare',6.1],['Blobfish','Rare',6.1],['Octopus','Rare',6.1],['Narwhal','Epic',3],['Dolphin','Epic',3],['Baby Shark','Legendary',.5],['Megalodon','Legendary',.2]]},
 {id:'safari',name:'Safari Pack',items:[['Panda','Uncommon',15],['Sloth','Uncommon',15],['Tenrec','Uncommon',15],['Flamingo','Uncommon',15],['Zebra','Uncommon',15],['Elephant','Rare',7],['Lemur','Rare',7],['Peacock','Rare',7],['Chameleon','Epic',3.48],['Lion','Legendary',.5],['Rainbow Panda','Chroma',.02]]},
 {id:'dino',name:'Dino Pack',items:[['Amber','Uncommon',19.5],['Dino Egg','Uncommon',19.5],['Dino Fossil','Uncommon',19.5],['Stegosaurus','Uncommon',19.5],['Velociraptor','Rare',9],['Brontosaurus','Rare',9],['Triceratops','Epic',3.7],['Tyrannosaurus Rex','Legendary',.3]]},
 {id:'ice',name:'Ice Monster Pack',items:[['Ice Bat','Uncommon',19.5],['Ice Bug','Uncommon',19.5],['Ice Elemental','Uncommon',19.5],['Rock Monster','Uncommon',19.5],['Dink','Rare',8.5],['Donk','Rare',8.5],['Bush Monster','Epic',4.5],['Yeti','Legendary',.35],['Ice Slime','Chroma',.08],['Frozen Fossil','Chroma',.05],['Ice Crab','Chroma',.02]]},
 {id:'outback',name:'Outback Pack',items:[['Dingo','Uncommon',18.75],['Echidna','Uncommon',18.75],['Koala','Uncommon',18.75],['Kookaburra','Uncommon',18.75],['Platypus','Rare',7],['Joey','Rare',7],['Kangaroo','Rare',7],['Crocodile','Epic',3.6],['Sugar Glider','Legendary',.37],['Teal Platypus','Chroma',.03]]},
 {id:'pirate',name:'Pirate Pack',items:[['Deckhand','Uncommon',16],['Buccaneer','Uncommon',16],['Swashbuckler','Uncommon',16],['Treasure Map','Uncommon',16],['Seagull','Uncommon',16],['Jolly Pirate','Rare',8],['Pirate Ship','Rare',8],['Kraken','Epic',3.67],['Captain Blackbeard','Legendary',.3],['Pirate Pufferfish','Chroma',.03]]},
 {id:'bug',name:'Bug Pack',items:[['Ant','Uncommon',19.625],['Rhino Beetle','Uncommon',19.625],['Ladybug','Uncommon',19.625],['Fly','Uncommon',19.625],['Worm','Rare',9],['Bee','Rare',9],['Mantis','Epic',2.97],['Butterfly','Legendary',.5],['Blue Butterfly','Chroma',.03]]},
 {id:'lunch',name:'Lunch Pack',items:[['Bananas','Uncommon',18.75],['Watermelon','Uncommon',18.75],['Cheese','Uncommon',18.75],['Doughnut','Uncommon',18.75],['Taco','Rare',7],['Bao','Rare',7],['Sushi','Rare',7],['Cheeseburger','Epic',3.31],['Sandwich','Legendary',.65],['Half a Sandwich','Chroma',.04]]},
 // Released September 2026. Source names from published Dog Pack roster; independently simulated pack cost 50 tokens.
 // 5x15% + 3x7% + 3.57% + 0.40% + 0.03% = 100%.
 {id:'dog',name:'Dog Pack',items:[['Jack Russell Terrier','Uncommon',15],['Chihuahua','Uncommon',15],['Yorkshire Terrier','Uncommon',15],['Poodle','Uncommon',15],['German Shepherd','Uncommon',15],['Dalmatian','Rare',7],['Golden Retriever','Rare',7],['Saint Bernard','Rare',7],['Bloodhound','Epic',3.57],['Old English Sheepdog','Legendary',.4],['Robot Dog','Chroma',.03]]},
 {id:'spooky',name:'Spooky Pack',items:[['Pumpkin','Uncommon',15.2],['Swamp Monster','Uncommon',15.2],['Frankenstein','Uncommon',15.2],['Vampire','Uncommon',15.2],['Zombie','Uncommon',15.2],['Mummy','Rare',4],['Caramel Apple','Rare',4],['Candy Corn','Rare',4],['Crow','Rare',4],['Vampire Bat','Rare',4],['Werewolf','Epic',1.65],['Goo Monster','Epic',1.65],['Ghost','Legendary',.65],['Spooky Moth','Chroma',.05]]},
 {id:'autumn',name:'Autumn Pack',items:[['Black Bear','Uncommon',19.5],['Pumpkin Pie','Uncommon',19.5],['Chipmunk','Uncommon',19.5],['Cornucopia','Uncommon',19.5],['Autumn Cat','Rare',6],['Pumpkin Puppy','Rare',6],['Red Squirrel','Rare',6],['Autumn Crow','Epic',2.95],['Turkey','Legendary',1],['Goldfinch','Chroma',.05]]},
 {id:'blizzard',name:'Blizzard Pack',items:[['Snow Globe','Uncommon',14.5],['Holiday Gift','Uncommon',14.5],['Hot Chocolate','Uncommon',14.5],['Holiday Wreath','Uncommon',14.5],['Stocking','Uncommon',14.5],['Gingerbread Man','Rare',10.65],['Gingerbread House','Rare',10.65],['Snowman','Epic',5.15],['Santa Claus','Legendary',1],['Peppermint Bark','Chroma',.03],['Chilly Chameleon','Chroma',.02]]},
 {id:'lovely',name:'Lovely Pack',special:true,items:[['Lovely Frog','Chroma',100],['Lovely Peacock','Chroma',0]]},
 {id:'lucky',name:'Lucky Pack',special:true,items:[['Lucky Frog','Chroma',100],['Lucky Hamster','Chroma',0],['Lucky Bee','Chroma',0],['Lucky Cat','Chroma',0],['Leprechaun','Chroma',0]]},
 {id:'spring',name:'Spring Pack',special:true,items:[['Spring Frog','Chroma',100]]},
 {id:'farm',name:'Farm Animal Pack',free:true,items:[['Chick','Common',0],['Chicken','Common',0],['Cow','Common',0],['Goat','Common',0],['Horse','Common',0],['Pig','Common',0],['Sheep','Common',0],['Duck','Common',0],['Alpaca','Common',0]]},
 {id:'pet',name:'Pet Pack',free:true,items:[['Dog','Common',0],['Cat','Common',0],['Rabbit','Common',0],['Goldfish','Common',0],['Hamster','Common',0],['Turtle','Common',0],['Kitten','Common',0],['Puppy','Common',0]]},
 {id:'forest',name:'Forest Animal Pack',free:true,items:[['Bear','Common',0],['Moose','Common',0],['Fox','Common',0],['Raccoon','Common',0],['Squirrel','Common',0],['Owl','Common',0],['Hedgehog','Common',0],['Deer','Common',0],['Wolf','Common',0],['Beaver','Common',0]]},
 {id:'tropical',name:'Tropical Animal Pack',free:true,items:[['Tiger','Common',0],['Orangutan','Common',0],['Cockatoo','Common',0],['Parrot','Common',0],['Anaconda','Common',0],['Jaguar','Common',0],['Macaw','Common',0],['Toucan','Common',0],['Panther','Common',0],['Capuchin','Common',0],['Gorilla','Common',0],['Hippo','Common',0],['Rhino','Common',0],['Giraffe','Common',0]]},
 {id:'arctic',name:'Arctic Animal Pack',free:true,items:[['Snowy Owl','Common',0],['Polar Bear','Common',0],['Arctic Fox','Common',0],['Baby Penguin','Common',0],['Penguin','Common',0],['Arctic Hare','Common',0],['Seal','Common',0],['Walrus','Common',0]]},
 {id:'color',name:'Color Pack (Starter Gallery)',free:true,items:[['Light Blue','Common',0],['Black','Common',0],['Red','Common',0],['Purple','Common',0],['Pink','Common',0],['Orange','Common',0],['Lime','Common',0],['Green','Common',0],['Teal','Common',0],['Tan','Common',0],['Maroon','Common',0],['Gray','Common',0],['Mint','Common',0],['Salmon','Common',0],['Burgundy','Common',0],['Baby Blue','Common',0],['Dust','Common',0],['Brown','Common',0],['Dull Blue','Common',0],['Yellow','Common',0],['Blue','Common',0]]}
];
const IMAGE_URLS={"Witch":"https://blooket.s3.us-east-2.amazonaws.com/blooks/medieval/witch.svg","Wizard":"https://blooket.s3.us-east-2.amazonaws.com/blooks/medieval/wizard.svg","Elf":"https://blooket.s3.us-east-2.amazonaws.com/blooks/medieval/elf.svg","Fairy":"https://blooket.s3.us-east-2.amazonaws.com/blooks/medieval/fairy.svg","Slime Monster":"https://blooket.s3.us-east-2.amazonaws.com/blooks/medieval/slimeMonster.svg","Jester":"https://blooket.s3.us-east-2.amazonaws.com/blooks/medieval/jester.svg","Dragon":"https://blooket.s3.us-east-2.amazonaws.com/blooks/medieval/dragon.svg","Queen":"https://blooket.s3.us-east-2.amazonaws.com/blooks/medieval/queen.svg","Unicorn":"https://blooket.s3.us-east-2.amazonaws.com/blooks/medieval/unicorn.svg","King":"https://blooket.s3.us-east-2.amazonaws.com/blooks/medieval/king.svg","Two of Spades":"https://blooket.s3.us-east-2.amazonaws.com/blooks/wonderland/twoOfSpades.svg","Eat Me":"https://blooket.s3.us-east-2.amazonaws.com/blooks/wonderland/eat.svg","Drink Me":"https://blooket.s3.us-east-2.amazonaws.com/blooks/wonderland/drink.svg","Alice":"https://blooket.s3.us-east-2.amazonaws.com/blooks/wonderland/alice.svg","Queen of Hearts":"https://blooket.s3.us-east-2.amazonaws.com/blooks/wonderland/queenOfHearts.svg","Dormouse":"https://blooket.s3.us-east-2.amazonaws.com/blooks/wonderland/dormouse.svg","White Rabbit":"https://blooket.s3.us-east-2.amazonaws.com/blooks/wonderland/whiteRabbit.svg","Cheshire Cat":"https://blooket.s3.us-east-2.amazonaws.com/blooks/wonderland/cheshireCat.svg","Caterpillar":"https://blooket.s3.us-east-2.amazonaws.com/blooks/wonderland/caterpillar.svg","Mad Hatter":"https://blooket.s3.us-east-2.amazonaws.com/blooks/wonderland/madHatter.svg","King of Hearts":"https://blooket.s3.us-east-2.amazonaws.com/blooks/wonderland/kingOfHearts.svg","Toast":"https://blooket.s3.us-east-2.amazonaws.com/blooks/breakfast/toast.svg","Cereal":"https://blooket.s3.us-east-2.amazonaws.com/blooks/breakfast/cereal.svg","Yogurt":"https://blooket.s3.us-east-2.amazonaws.com/blooks/breakfast/yogurt.svg","Breakfast Combo":"https://blooket.s3.us-east-2.amazonaws.com/blooks/breakfast/breakfastCombo.svg","Orange Juice":"https://blooket.s3.us-east-2.amazonaws.com/blooks/breakfast/orangeJuice.svg","Milk":"https://blooket.s3.us-east-2.amazonaws.com/blooks/breakfast/milk.svg","Waffle":"https://blooket.s3.us-east-2.amazonaws.com/blooks/breakfast/waffle.svg","Pancakes":"https://blooket.s3.us-east-2.amazonaws.com/blooks/breakfast/pancakes.svg","French Toast":"https://blooket.s3.us-east-2.amazonaws.com/blooks/breakfast/frenchToast.svg","Pizza":"https://blooket.s3.us-east-2.amazonaws.com/blooks/foods/pizza.svg","Earth":"https://blooket.s3.us-east-2.amazonaws.com/blooks/space/earth.svg","Meteor":"https://blooket.s3.us-east-2.amazonaws.com/blooks/space/meteor.svg","Stars":"https://blooket.s3.us-east-2.amazonaws.com/blooks/space/stars.svg","Alien":"https://blooket.s3.us-east-2.amazonaws.com/blooks/space/alien.svg","Planet":"https://blooket.s3.us-east-2.amazonaws.com/blooks/space/planet.svg","UFO":"https://blooket.s3.us-east-2.amazonaws.com/blooks/space/UFO.svg","Spaceship":"https://blooket.s3.us-east-2.amazonaws.com/blooks/space/spaceship.svg","Astronaut":"https://blooket.s3.us-east-2.amazonaws.com/blooks/space/astronaut.svg","Lil Bot":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bots/lilBot.svg","Lovely Bot":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bots/lovelyBot.svg","Angry Bot":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bots/angryBot.svg","Happy Bot":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bots/happyBot.svg","Watson":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bots/watson.svg","Buddy Bot":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bots/buddyBot.svg","Brainy Bot":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bots/brainyBot.svg","Mega Bot":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bots/megaBot.svg","Old Boot":"https://blooket.s3.us-east-2.amazonaws.com/blooks/aquatic/oldBoot.svg","Jellyfish":"https://blooket.s3.us-east-2.amazonaws.com/blooks/aquatic/jellyfish.svg","Clownfish":"https://blooket.s3.us-east-2.amazonaws.com/blooks/aquatic/clownfish.svg","Frog":"https://blooket.s3.us-east-2.amazonaws.com/blooks/aquatic/frog.svg","Crab":"https://blooket.s3.us-east-2.amazonaws.com/blooks/aquatic/crab.svg","Pufferfish":"https://blooket.s3.us-east-2.amazonaws.com/blooks/aquatic/pufferFish.svg","Blobfish":"https://blooket.s3.us-east-2.amazonaws.com/blooks/aquatic/blobfish.svg","Octopus":"https://blooket.s3.us-east-2.amazonaws.com/blooks/aquatic/octopus.svg","Narwhal":"https://blooket.s3.us-east-2.amazonaws.com/blooks/aquatic/narwhal.svg","Baby Shark":"https://blooket.s3.us-east-2.amazonaws.com/blooks/aquatic/babyShark.svg","Megalodon":"https://blooket.s3.us-east-2.amazonaws.com/blooks/aquatic/megalodon.svg","Pumpkin":"https://blooket.s3.us-east-2.amazonaws.com/blooks/halloween/pumpkin.svg","Swamp Monster":"https://blooket.s3.us-east-2.amazonaws.com/blooks/halloween/swampMonster.svg","Frankenstein":"https://blooket.s3.us-east-2.amazonaws.com/blooks/halloween/frankenstein.svg","Vampire":"https://blooket.s3.us-east-2.amazonaws.com/blooks/halloween/vampire.svg","Zombie":"https://blooket.s3.us-east-2.amazonaws.com/blooks/halloween/zombie.svg","Mummy":"https://blooket.s3.us-east-2.amazonaws.com/blooks/halloween/mummy.svg","Werewolf":"https://blooket.s3.us-east-2.amazonaws.com/blooks/halloween/werewolf.svg","Ghost":"https://blooket.s3.us-east-2.amazonaws.com/blooks/halloween/ghost.svg","Snow Globe":"https://blooket.s3.us-east-2.amazonaws.com/blooks/winterHoliday/snowGlobe.svg","Holiday Gift":"https://blooket.s3.us-east-2.amazonaws.com/blooks/winterHoliday/holidayGift.svg","Hot Chocolate":"https://blooket.s3.us-east-2.amazonaws.com/blooks/winterHoliday/hotChocolate.svg","Holiday Wreath":"https://blooket.s3.us-east-2.amazonaws.com/blooks/winterHoliday/holidayWreath.svg","Gingerbread Man":"https://blooket.s3.us-east-2.amazonaws.com/blooks/winterHoliday/gingerbreadMan.svg","Gingerbread House":"https://blooket.s3.us-east-2.amazonaws.com/blooks/winterHoliday/gingerbreadHouse.svg","Snowman":"https://blooket.s3.us-east-2.amazonaws.com/blooks/winterHoliday/snowman.svg","Santa Claus":"https://blooket.s3.us-east-2.amazonaws.com/blooks/winterHoliday/santaClaus.svg","Red Astronaut":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/space/redAstronaut.svg","Brown Astronaut":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/space/brownAstronaut.svg","Green Astronaut":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/space/greenAstronaut.svg","Pink Astronaut":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/space/pinkAstronaut.svg","Orange Astronaut":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/space/orangeAstronaut.svg","Yellow Astronaut":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/space/yellowAstronaut.svg","Black Astronaut":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/space/blackAstronaut.svg","Spooky Ghost":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/halloween/spookyGhost.svg","Spooky Pumpkin":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/halloween/spookyPumpkin.svg","Spooky Mummy":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/halloween/spookyMummy.svg","Haunted Pumpkin":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/halloween/hauntedPumpkin.svg","Lovely Frog":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/aquatic/lovelyFrog.svg","Pirate Pufferfish":"https://blooket.s3.us-east-2.amazonaws.com/blooks/bonus/aquatic/piratePufferfish.svg","Chick":"https://blooket.s3.us-east-2.amazonaws.com/blooks/farmAnimals/chick.svg","Chicken":"https://blooket.s3.us-east-2.amazonaws.com/blooks/farmAnimals/chicken.svg","Cow":"https://blooket.s3.us-east-2.amazonaws.com/blooks/farmAnimals/cow.svg","Goat":"https://blooket.s3.us-east-2.amazonaws.com/blooks/farmAnimals/goat.svg","Horse":"https://blooket.s3.us-east-2.amazonaws.com/blooks/farmAnimals/horse.svg","Pig":"https://blooket.s3.us-east-2.amazonaws.com/blooks/farmAnimals/pig.svg","Sheep":"https://blooket.s3.us-east-2.amazonaws.com/blooks/farmAnimals/sheep.svg","Duck":"https://blooket.s3.us-east-2.amazonaws.com/blooks/farmAnimals/duck.svg","Dog":"https://blooket.s3.us-east-2.amazonaws.com/blooks/pets/dog.svg","Cat":"https://blooket.s3.us-east-2.amazonaws.com/blooks/pets/cat.svg","Goldfish":"https://blooket.s3.us-east-2.amazonaws.com/blooks/pets/goldfish.svg","Hamster":"https://blooket.s3.us-east-2.amazonaws.com/blooks/pets/hamster.svg","Turtle":"https://blooket.s3.us-east-2.amazonaws.com/blooks/pets/turtle.svg","Kitten":"https://blooket.s3.us-east-2.amazonaws.com/blooks/pets/kitten.svg","Puppy":"https://blooket.s3.us-east-2.amazonaws.com/blooks/pets/puppy.svg","Rabbit":"https://blooket.s3.us-east-2.amazonaws.com/blooks/pets/rabbit.svg","Bear":"https://blooket.s3.us-east-2.amazonaws.com/blooks/forestAnimals/bear.svg","Moose":"https://blooket.s3.us-east-2.amazonaws.com/blooks/forestAnimals/moose.svg","Fox":"https://blooket.s3.us-east-2.amazonaws.com/blooks/forestAnimals/fox.svg","Raccoon":"https://blooket.s3.us-east-2.amazonaws.com/blooks/forestAnimals/raccoon.svg","Squirrel":"https://blooket.s3.us-east-2.amazonaws.com/blooks/forestAnimals/squirrel.svg","Owl":"https://blooket.s3.us-east-2.amazonaws.com/blooks/forestAnimals/owl.svg","Hedgehog":"https://blooket.s3.us-east-2.amazonaws.com/blooks/forestAnimals/hedgehog.svg","Tiger":"https://blooket.s3.us-east-2.amazonaws.com/blooks/tropicalAnimals/tiger.svg","Orangutan":"https://blooket.s3.us-east-2.amazonaws.com/blooks/tropicalAnimals/orangutan.svg","Cockatoo":"https://blooket.s3.us-east-2.amazonaws.com/blooks/tropicalAnimals/cockatoo.svg","Parrot":"https://blooket.s3.us-east-2.amazonaws.com/blooks/tropicalAnimals/parrot.svg","Anaconda":"https://blooket.s3.us-east-2.amazonaws.com/blooks/tropicalAnimals/anaconda.svg","Jaguar":"https://blooket.s3.us-east-2.amazonaws.com/blooks/tropicalAnimals/jaguar.svg","Macaw":"https://blooket.s3.us-east-2.amazonaws.com/blooks/tropicalAnimals/macaw.svg","Toucan":"https://blooket.s3.us-east-2.amazonaws.com/blooks/tropicalAnimals/toucan.svg","Panther":"https://blooket.s3.us-east-2.amazonaws.com/blooks/tropicalAnimals/panther.svg","Capuchin":"https://blooket.s3.us-east-2.amazonaws.com/blooks/tropicalAnimals/capuchin.svg","Snowy Owl":"https://blooket.s3.us-east-2.amazonaws.com/blooks/arcticAnimals/snowyOwl.svg","Polar Bear":"https://blooket.s3.us-east-2.amazonaws.com/blooks/arcticAnimals/polarBear.svg","Arctic Fox":"https://blooket.s3.us-east-2.amazonaws.com/blooks/arcticAnimals/arcticFox.svg","Baby Penguin":"https://blooket.s3.us-east-2.amazonaws.com/blooks/arcticAnimals/babyPenguin.svg","Penguin":"https://blooket.s3.us-east-2.amazonaws.com/blooks/arcticAnimals/penguin.svg","Arctic Hare":"https://blooket.s3.us-east-2.amazonaws.com/blooks/arcticAnimals/arcticHare.svg","Seal":"https://blooket.s3.us-east-2.amazonaws.com/blooks/arcticAnimals/seal.svg","Walrus":"https://blooket.s3.us-east-2.amazonaws.com/blooks/arcticAnimals/walrus.svg"};
const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const EVENT_BLOOKS=[
 {id:'spooky-ghost',name:'Spooky Ghost',rarity:'Mystical',rate:0,pack:'event'},
 {id:'tim-the-alien',name:'Tim the Alien',rarity:'Mystical',rate:0,pack:'event'},
 {id:'phantom-king',name:'Phantom King',rarity:'Mystical',rate:0,pack:'event'},
 {id:'rainbow-astronaut',name:'Rainbow Astronaut',rarity:'Mystical',rate:0,pack:'event'},
 {id:'hamsta-claus',name:'Hamsta Claus',rarity:'Mystical',rate:0,pack:'event'},
 {id:'spooky-mummy',name:'Spooky Mummy',rarity:'Chroma',rate:0,pack:'event'}
];
// Documented archive entries stay in the collection only until their simulator unlock rules are decided.
// Catalog-only entries intentionally have no pack pull odds or automatic rewards.
const ADDITIONAL_BLOOKS = [
 {
  "name": "Spooky Pumpkin",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy prize · older event Blook",
  "catalogOnly": true
 },
 {
  "name": "Lovely Planet",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Seasonal",
  "sourceDetail": "Lovely",
  "catalogOnly": true
 },
 {
  "name": "Lovely Fox",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Seasonal",
  "sourceDetail": "Lovely",
  "catalogOnly": true
 },
 {
  "name": "Lovely Rabbit",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Seasonal",
  "sourceDetail": "Lovely",
  "catalogOnly": true
 },
 {
  "name": "Lovely Hedgehogs",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Seasonal",
  "sourceDetail": "Lovely",
  "catalogOnly": true
 },
 {
  "name": "Chocolate Rabbit",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Seasonal",
  "sourceDetail": "Spring",
  "catalogOnly": true
 },
 {
  "name": "Spring Rabbit",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Seasonal",
  "sourceDetail": "Spring",
  "catalogOnly": true
 },
 {
  "name": "Spring Deer",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Seasonal",
  "sourceDetail": "Spring",
  "catalogOnly": true
 },
 {
  "name": "Spring Dragon",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Seasonal",
  "sourceDetail": "Spring",
  "catalogOnly": true
 },
 {
  "name": "Chick Chicken",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy 2022",
  "catalogOnly": true
 },
 {
  "name": "Chicken Chick",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy 2022",
  "catalogOnly": true
 },
 {
  "name": "Raccoon Bandit",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy 2022",
  "catalogOnly": true
 },
 {
  "name": "Owl Sheriff",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy 2022",
  "catalogOnly": true
 },
 {
  "name": "Vampire Frog",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy 2022",
  "catalogOnly": true
 },
 {
  "name": "Anaconda Wizard",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy 2022",
  "catalogOnly": true
 },
 {
  "name": "Pumpkin King",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy 2022",
  "catalogOnly": true
 },
 {
  "name": "Santa Claws",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy 2023",
  "catalogOnly": true
 },
 {
  "name": "Cookies Combo",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy 2023",
  "catalogOnly": true
 },
 {
  "name": "Chilly Flamingo",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy 2023",
  "catalogOnly": true
 },
 {
  "name": "Snowy Bush Monster",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy 2023",
  "catalogOnly": true
 },
 {
  "name": "Nutcracker Koala",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Contest of Candy 2023",
  "catalogOnly": true
 },
 {
  "name": "Cyan Astronaut",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "PAC",
  "catalogOnly": true
 },
 {
  "name": "Lime Astronaut",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "PAC",
  "catalogOnly": true
 },
 {
  "name": "Agent Owl",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Potions of Pix’ahlia",
  "catalogOnly": true
 },
 {
  "name": "Master Elf",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Potions of Pix’ahlia",
  "catalogOnly": true
 },
 {
  "name": "White Peacock",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "LUNCH",
  "catalogOnly": true
 },
 {
  "name": "Tiger Zebra",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "LUNCH",
  "catalogOnly": true
 },
 {
  "name": "Party Pig",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Event",
  "sourceDetail": "Discord moderator",
  "catalogOnly": true
 },
 {
  "name": "Haunted Pumpkin",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Spooky Pack",
  "catalogOnly": true
 },
 {
  "name": "Pumpkin Cookie",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Spooky Pack",
  "catalogOnly": true
 },
 {
  "name": "Ghost Cookie",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Spooky Pack",
  "catalogOnly": true
 },
 {
  "name": "Red Gummy Bear",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Spooky Pack",
  "catalogOnly": true
 },
 {
  "name": "Green Gummy Bear",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Spooky Pack",
  "catalogOnly": true
 },
 {
  "name": "Blue Gummy Bear",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Spooky Pack",
  "catalogOnly": true
 },
 {
  "name": "Golden Pumpkin Pie",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Autumn Pack",
  "catalogOnly": true
 },
 {
  "name": "Frost Wreath",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Blizzard Pack",
  "catalogOnly": true
 },
 {
  "name": "Tropical Globe",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Blizzard Pack",
  "catalogOnly": true
 },
 {
  "name": "London Snow Globe",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Blizzard Pack",
  "catalogOnly": true
 },
 {
  "name": "Japan Snow Globe",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Blizzard Pack",
  "catalogOnly": true
 },
 {
  "name": "Egypt Snow Globe",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Blizzard Pack",
  "catalogOnly": true
 },
 {
  "name": "Paris Snow Globe",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Blizzard Pack",
  "catalogOnly": true
 },
 {
  "name": "New York Snow Globe",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Blizzard Pack",
  "catalogOnly": true
 },
 {
  "name": "Red Sweater Snowman",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Blizzard Pack",
  "catalogOnly": true
 },
 {
  "name": "Blue Sweater Snowman",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Blizzard Pack",
  "catalogOnly": true
 },
 {
  "name": "Elf Sweater Snowman",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Blizzard Pack",
  "catalogOnly": true
 },
 {
  "name": "Holiday Elf",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Blizzard Pack",
  "catalogOnly": true
 },
 {
  "name": "Cozy Baby Penguin",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Retired",
  "sourceDetail": "Former Blizzard Pack",
  "catalogOnly": true
 },
 {
  "name": "Wise Owl",
  "rarity": "Unique",
  "rate": 0,
  "pack": "archive",
  "source": "Unique",
  "sourceDetail": "Unique Blook",
  "catalogOnly": true
 },
 {
  "name": "Wise Caterpillar",
  "rarity": "Unique",
  "rate": 0,
  "pack": "archive",
  "source": "Unique",
  "sourceDetail": "Unique Blook",
  "catalogOnly": true
 },
 {
  "name": "Fuego",
  "rarity": "Unique",
  "rate": 0,
  "pack": "archive",
  "source": "Unique",
  "sourceDetail": "Unique Blook",
  "catalogOnly": true
 },

 {
  "name": "Skeleton Fish",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Pack archive",
  "sourceDetail": "Spooky Pack (unconfigured)",
  "catalogOnly": true
 },
 {
  "name": "Super Glider",
  "rarity": "Chroma",
  "rate": 0,
  "pack": "archive",
  "source": "Pack archive",
  "sourceDetail": "Spooky Pack (unconfigured)",
  "catalogOnly": true
 },
 {
  "name": "Reindeer",
  "rarity": "Rare",
  "rate": 0,
  "pack": "archive",
  "source": "Pack archive",
  "sourceDetail": "Blizzard Pack (unconfigured)",
  "catalogOnly": true
 },
 {
  "name": "Santa's Sleigh",
  "rarity": "Rare",
  "rate": 0,
  "pack": "archive",
  "source": "Pack archive",
  "sourceDetail": "Blizzard Pack (unconfigured)",
  "catalogOnly": true
 }
];
// Eight official 2026 design-contest honorable mentions drawn by the Blooket art team.
// These are showcase designs, NOT released Blooks or legitimate pack pulls.
const CONTEST_SHOWCASE_BLOOKS = [
  {
    "name": "Pinalele",
    "rarity": "Unique",
    "rate": 0,
    "pack": "archive",
    "source": "Unreleased",
    "sourceDetail": "2026 Design a Blook Contest \u00b7 honorable-mention artwork (not released as a playable Blook)",
    "catalogOnly": true,
    "unreleased": true
  },
  {
    "name": "Zzzorp",
    "rarity": "Unique",
    "rate": 0,
    "pack": "archive",
    "source": "Unreleased",
    "sourceDetail": "2026 Design a Blook Contest \u00b7 honorable-mention artwork (not released as a playable Blook)",
    "catalogOnly": true,
    "unreleased": true
  },
  {
    "name": "Omeisaurus",
    "rarity": "Unique",
    "rate": 0,
    "pack": "archive",
    "source": "Unreleased",
    "sourceDetail": "2026 Design a Blook Contest \u00b7 honorable-mention artwork (not released as a playable Blook)",
    "catalogOnly": true,
    "unreleased": true
  },
  {
    "name": "Mossy Golem",
    "rarity": "Unique",
    "rate": 0,
    "pack": "archive",
    "source": "Unreleased",
    "sourceDetail": "2026 Design a Blook Contest \u00b7 honorable-mention artwork (not released as a playable Blook)",
    "catalogOnly": true,
    "unreleased": true
  },
  {
    "name": "Leaf Slug",
    "rarity": "Unique",
    "rate": 0,
    "pack": "archive",
    "source": "Unreleased",
    "sourceDetail": "2026 Design a Blook Contest \u00b7 honorable-mention artwork (not released as a playable Blook)",
    "catalogOnly": true,
    "unreleased": true
  },
  {
    "name": "Galaxy Mayhem",
    "rarity": "Unique",
    "rate": 0,
    "pack": "archive",
    "source": "Unreleased",
    "sourceDetail": "2026 Design a Blook Contest \u00b7 honorable-mention artwork (not released as a playable Blook)",
    "catalogOnly": true,
    "unreleased": true
  },
  {
    "name": "Funky Feathers",
    "rarity": "Unique",
    "rate": 0,
    "pack": "archive",
    "source": "Unreleased",
    "sourceDetail": "2026 Design a Blook Contest \u00b7 honorable-mention artwork (not released as a playable Blook)",
    "catalogOnly": true,
    "unreleased": true
  },
  {
    "name": "Dragonfruit Dragon",
    "rarity": "Unique",
    "rate": 0,
    "pack": "archive",
    "source": "Unreleased",
    "sourceDetail": "2026 Design a Blook Contest \u00b7 honorable-mention artwork (not released as a playable Blook)",
    "catalogOnly": true,
    "unreleased": true
  }
];

// Verified as unreleased or inaccessible historical OG entries in community catalogs.
// Gallery-only: no pack odds, archive exchange, prizes, or invented artwork URLs.
const V6_UNRELEASED=[
 {name:"Rainbow Jellyfish",rarity:"Chroma",rate:0,pack:'archive',source:'Unreleased',sourceDetail:'Unreleased OG reference · gallery only',catalogOnly:true,unreleased:true},
 {name:"Blizzard Clownfish",rarity:"Chroma",rate:0,pack:'archive',source:'Unreleased',sourceDetail:'Unreleased OG reference · gallery only',catalogOnly:true,unreleased:true},
 {name:"Poison Dart Frog",rarity:"Chroma",rate:0,pack:'archive',source:'Unreleased',sourceDetail:'Unreleased OG reference · gallery only',catalogOnly:true,unreleased:true},
 {name:"Lemon Crab",rarity:"Chroma",rate:0,pack:'archive',source:'Unreleased',sourceDetail:'Unreleased OG reference · gallery only',catalogOnly:true,unreleased:true},
 {name:"Donut Blobfish",rarity:"Chroma",rate:0,pack:'archive',source:'Unreleased',sourceDetail:'Unreleased OG reference · gallery only',catalogOnly:true,unreleased:true},
 {name:"Crimson Octopus",rarity:"Chroma",rate:0,pack:'archive',source:'Unreleased',sourceDetail:'Unreleased OG reference · gallery only',catalogOnly:true,unreleased:true},
 {name:"Rainbow Narwhal",rarity:"Chroma",rate:0,pack:'archive',source:'Unreleased',sourceDetail:'Unreleased OG reference · gallery only',catalogOnly:true,unreleased:true},
 {name:"Blue Astronaut",rarity:"Chroma",rate:0,pack:'archive',source:'Unreleased',sourceDetail:'Unreleased OG reference · gallery only',catalogOnly:true,unreleased:true},
 {name:"Purple Astronaut",rarity:"Chroma",rate:0,pack:'archive',source:'Unreleased',sourceDetail:'Unreleased OG reference · gallery only',catalogOnly:true,unreleased:true},
 {name:"White",rarity:"Common",rate:0,pack:'archive',source:'Unreleased',sourceDetail:'Unreleased OG reference · gallery only',catalogOnly:true,unreleased:true}
];
// Two documented historical in-game Blook placeholders from the community Blook gallery.
// NOT released Blooks: simulator-only special shop items, no alleged official odds.
const V7_HISTORICAL_REFERENCES=[
 {name:'Under Construction',rarity:'Unique',rate:0,pack:'archive',source:'Unreleased',sourceDetail:'Historical Unique placeholder · unreleased',catalogOnly:true,unreleased:true},
 {name:'Astronaut of the Day Placeholder',rarity:'Unique',rate:0,pack:'archive',source:'Unreleased',sourceDetail:'Historical Space placeholder · unreleased',catalogOnly:true,unreleased:true}
];
// V8.2: documented real game-mode-only Blook appearances and two historical unreleased references.
// These are NOT additional official Market Blooks or confirmed collectible art assets.
// OG base icon previews are labeled as representative and are not claimed to be upgrade artwork.
const GAME_MODE_AND_HISTORY_BLOOKS = [
  {
    "name": "Level 3 Chick",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Chick"
  },
  {
    "name": "Level 5 Chick",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Chick"
  },
  {
    "name": "Level 3 Squirrel",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Squirrel"
  },
  {
    "name": "Level 5 Squirrel",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Squirrel"
  },
  {
    "name": "Level 3 Gorilla",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Gorilla"
  },
  {
    "name": "Level 5 Gorilla",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Gorilla"
  },
  {
    "name": "Level 2 Dragon",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 2 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Dragon"
  },
  {
    "name": "Level 5 Dragon",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Dragon"
  },
  {
    "name": "Level 3 Pig",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Pig"
  },
  {
    "name": "Level 5 Pig",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Pig"
  },
  {
    "name": "Level 3 Penguin",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Penguin"
  },
  {
    "name": "Level 5 Penguin",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Penguin"
  },
  {
    "name": "Level 3 Owl",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Owl"
  },
  {
    "name": "Level 5 Owl",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Owl"
  },
  {
    "name": "Level 3 Peacock",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Peacock"
  },
  {
    "name": "Level 5 Peacock",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Peacock"
  },
  {
    "name": "Level 3 Parrot",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Parrot"
  },
  {
    "name": "Level 5 Parrot",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Parrot"
  },
  {
    "name": "Level 3 Macaw",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Macaw"
  },
  {
    "name": "Level 5 Macaw",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Macaw"
  },
  {
    "name": "Level 5 Cockatoo",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Cockatoo"
  },
  {
    "name": "Level 3 Moose",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Moose"
  },
  {
    "name": "Level 5 Moose",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Moose"
  },
  {
    "name": "Level 3 Wizard",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Wizard"
  },
  {
    "name": "Level 5 Wizard",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Wizard"
  },
  {
    "name": "Level 3 Unicorn",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Unicorn"
  },
  {
    "name": "Level 5 Unicorn",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Unicorn"
  },
  {
    "name": "Level 3 Mega Bot",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Mega Bot"
  },
  {
    "name": "Level 5 Mega Bot",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Mega Bot"
  },
  {
    "name": "Level 3 Alien",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Alien"
  },
  {
    "name": "Level 5 Alien",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Alien"
  },
  {
    "name": "Level 2 King",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 2 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "King"
  },
  {
    "name": "Level 5 King",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "King"
  },
  {
    "name": "Level 3 Queen",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Queen"
  },
  {
    "name": "Level 5 Queen",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Queen"
  },
  {
    "name": "Level 3 Toucan",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Toucan"
  },
  {
    "name": "Level 5 Toucan",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 visual form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Toucan"
  },
  {
    "name": "Bird Nest",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 exclusive bird-nest tower · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Dino Egg"
  },
  {
    "name": "Blacktail Damselfish",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 3 Goldfish appearance · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Goldfish"
  },
  {
    "name": "Piranha",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 level 5 Goldfish appearance · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Goldfish"
  },
  {
    "name": "Cow Blook (TD2 Enemy)",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 exclusive enemy appearance · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Cow"
  },
  {
    "name": "Rainbow Blook (TD2 Enemy)",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 exclusive enemy appearance · not an official Market collectible",
    "catalogOnly": true
  },
  {
    "name": "Brown Oak Blook",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 exclusive enemy appearance · not an official Market collectible",
    "catalogOnly": true
  },
  {
    "name": "Stone Blook",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 exclusive enemy appearance · not an official Market collectible",
    "catalogOnly": true
  },
  {
    "name": "Metal Blook",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 exclusive enemy appearance · not an official Market collectible",
    "catalogOnly": true
  },
  {
    "name": "Obsidian Blook",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 2 exclusive enemy appearance · not an official Market collectible",
    "catalogOnly": true
  },
  {
    "name": "Red Slime Monster",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 1 enemy form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Slime Monster"
  },
  {
    "name": "Dark Slime Monster",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 1 enemy form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Slime Monster"
  },
  {
    "name": "Light Slime Monster",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Tower Defense 1 enemy form · not an official Market collectible",
    "catalogOnly": true,
    "previewBase": "Slime Monster"
  },
  {
    "name": "Mark",
    "rarity": "Game Mode",
    "rate": 0,
    "pack": "archive",
    "source": "Game Mode",
    "sourceDetail": "Official Blooket Market non-player character (NPC), not an official collectible Blook",
    "catalogOnly": true
  },
  {
    "name": "Skeleton",
    "rarity": "Unclassified",
    "rate": 0,
    "pack": "archive",
    "source": "Unreleased",
    "sourceDetail": "Unreleased/disputed historical Skeleton Blook reference · rarity unconfirmed; simulation-only shop",
    "catalogOnly": true,
    "unreleased": true
  },
  {
    "name": "Apple Pie",
    "rarity": "Unclassified",
    "rate": 0,
    "pack": "archive",
    "source": "Unreleased",
    "sourceDetail": "Unreleased/disputed historical Apple Pie Blook reference · rarity unconfirmed; simulation-only shop",
    "catalogOnly": true,
    "unreleased": true
  }
];
const CATALOG=Array.from(new Map(PACKS.flatMap(p=>p.items.map(([name,rarity,rate])=>[slug(name),{id:slug(name),name,rarity,rate,pack:p.id}]))).values()).concat(EVENT_BLOOKS,ADDITIONAL_BLOOKS.map(f=>({id:slug(f.name),...f})),V6_UNRELEASED.map(f=>({id:slug(f.name),...f})),V7_HISTORICAL_REFERENCES.map(f=>({id:slug(f.name),...f})),CONTEST_SHOWCASE_BLOOKS.map(f=>({id:slug(f.name),...f})),GAME_MODE_AND_HISTORY_BLOOKS.map(f=>({id:slug(f.name),...f})));


// V9.0.2: retired fan-made packs and all 39 original fan-made Blooks
// (including their three custom Mysticals) are no longer registered.
// Older saved OG progress remains compatible with this catalog.
const ORIGINAL_ART_URLS={};


// V9.0.4 — Transparent archive packs and actual starter packs.
// The Blooks are existing catalog references, NOT newly invented characters.
// Published/snapshot probabilities in original OG packs remain unchanged.
// These new packs are explicitly TWILIGHT BAZAAR-ONLY random-pull pools.
const VAULT_PACK_IDS=[];
for(const p of PACKS.filter(p=>p.free)){
 p.wasStarter=true;delete p.free;
 const size=p.items.length;
 p.items.forEach((entry,i)=>{
  entry[2]=i===size-1?Number((100-Math.floor(1000000/size)/10000*(size-1)).toFixed(4)):Math.floor(1000000/size)/10000;
  const f=CATALOG.find(f=>f.id===slug(entry[0]));if(f)f.rate=entry[2];
 });
}
const VAULT_DEFS=[
 {id:'space-colors',name:'Space Color Vault',desc:'Rotating Space Chromas are also obtainable here',accept:f=>f.pack==='space'&&f.rarity==='Chroma'&&f.rate===0},
 {id:'rare-finds',name:'Rare Finds Pack',desc:'Seasonal and archived finds',accept:f=>['Seasonal','Pack archive'].includes(f.source)},
 {id:'ultra-finds',name:'Ultra Finds Pack',desc:'Retired rewards and event archive',accept:f=>['Retired','Event'].includes(f.source)},
 {id:'secret-finds',name:'Secret Finds Pack',desc:'Unique discoveries',accept:f=>f.source==='Unique'},
 {id:'contest-vault',name:'Contest Showcase Pack',desc:'Contest showcase designs (not released Market Blooks)',accept:f=>f.source==='Unreleased'&&/contest|honor|showcase/i.test(f.sourceDetail||'')},
 {id:'history-vault',name:'History Pack',desc:'Unreleased and historical references; simulator-only',accept:f=>f.source==='Unreleased'},
 {id:'game-mode-vault',name:'Game Mode Pack',desc:'Tower Defense forms, enemies and NPCs; not Market collectibles',accept:f=>f.source==='Game Mode'},
 {id:'season-vault',name:'Seasonal Vault Pack',desc:'Zero-rate historical pack Chromas; simulator-only',accept:f=>{const p=PACKS.find(p=>p.id===f.pack);return Boolean(p?.special&&f.rate<=0);}}
];
function vaultWeight(f){
 return ({Common:20,Uncommon:16,Rare:10,Epic:5,Legendary:2,Chroma:0.4,Unique:0.35,Unclassified:2,'Game Mode':6})[f.rarity]||3;
}
for(const def of VAULT_DEFS){
 const found=CATALOG.filter(f=>f.rarity!=='Mystical'&&!PACKS.some(p=>p.simulatorVault&&p.id===f.pack)&&def.accept(f));
 if(!found.length)continue;
 const total=found.reduce((sum,f)=>sum+vaultWeight(f),0);
 let accumulated=0;
 const items=found.map((f,i)=>{
  const chance=i===found.length-1?Number((100-accumulated).toFixed(6)):Number((100*vaultWeight(f)/total).toFixed(6));
  accumulated+=chance;
  return [f.name,f.rarity,chance];
 });
 const p={id:def.id,name:def.name,simulatorVault:true,desc:def.desc,items};
 PACKS.push(p);VAULT_PACK_IDS.push(p.id);
 for(const f of found){f.originalCatalogPack=f.pack;f.pack=p.id;f.rate=items.find(x=>x[0]===f.name)[2];}
}
// Originally listed as an event-only, non-Mystical award.
// The event-archive pool provides a guaranteed path to a random trial-free award.
const SPOOKY_MUMMY=CATALOG.find(f=>f.name==='Spooky Mummy');
if(SPOOKY_MUMMY&&!VAULT_PACK_IDS.some(id=>SPOOKY_MUMMY.pack===id)){
 const p=PACKS.find(p=>p.id==='ultra-finds');
 if(p){p.items.push([SPOOKY_MUMMY.name,SPOOKY_MUMMY.rarity,0.3]);
  const base=p.items.reduce((s,x)=>s+x[2],0);
  p.items.forEach(x=>x[2]=Number((100*x[2]/base).toFixed(6)));
  p.items[p.items.length-1][2]=Number((100-p.items.slice(0,-1).reduce((s,x)=>s+x[2],0)).toFixed(6));
  SPOOKY_MUMMY.originalCatalogPack=SPOOKY_MUMMY.pack;SPOOKY_MUMMY.pack=p.id;
 }
}
// Expose every non-Mystical Blook through a positive-weight pack route.
const UNOBTAINABLE_CATALOG=CATALOG.filter(f=>f.rarity!=='Mystical'&&!PACKS.some(p=>p.items.some(x=>slug(x[0])===f.id&&x[2]>0)));
if(UNOBTAINABLE_CATALOG.length)throw Error('Unobtainable Blooks: '+UNOBTAINABLE_CATALOG.map(f=>f.name).join(', '));

const MAP=Object.fromEntries(CATALOG.map(x=>[x.id,x]));
const SPACE_DAYS=['Green Astronaut','Pink Astronaut','Yellow Astronaut','Black Astronaut','Orange Astronaut','Red Astronaut','Brown Astronaut'];
function availableItems(p){if(p.id!=='space')return p.items;const daily=SPACE_DAYS[new Date().getUTCDay()];return p.items.map(x=>x[1]==='Chroma'?[x[0],x[1],x[0]===daily?.05:0]:x)}
const RECIPES=[
 {id:'rare',title:'Medieval Exchange',desc:'Trade for an official Medieval rare.',requires:[['witch',3],['wizard',2]],shards:70,rewardPool:['dragon','jester','queen']},
 {id:'epic',title:'Wonderland Ritual',desc:'Trade for an official Wonderland Epic.',requires:[['alice',3],['drink-me',2]],shards:180,rewardPool:['caterpillar','mad-hatter']},
 {id:'legend',title:'Royal Exchange',desc:'Trade for the legendary King.',requires:[['dragon',2],['unicorn',1]],shards:500,rewardPool:['king']},
 {id:'chroma',title:'Space Chroma Exchange',desc:'Trade for an existing colored Astronaut Chroma.',requires:[['astronaut',2]],shards:1000,rewardPool:['red-astronaut','brown-astronaut','green-astronaut','pink-astronaut','orange-astronaut','yellow-astronaut','black-astronaut']},
 {id:'mystic',title:'Spooky Ghost Ritual',desc:'Fan-made trade for the existing Spooky Ghost Mystical; not an official redemption method.',requires:[['red-astronaut',1],['brown-astronaut',1]],shards:5000,rewardPool:['spooky-ghost']}
];

// Original-image URL references from a newer public asset index (third-party documented).
// The images are NOT bundled or redistributed with this site; these are remote references.
// The service may change or restrict access. Older URLs remain as fallbacks.
const CDN_EXCLUDE = new Set(['Peppermint Bark','Chilly Chameleon','Lucky Cat']);
const CDN_IMAGE_URLS = Object.fromEntries(CATALOG.filter(f => {
  const p=PACKS.find(p=>p.id===f.pack);
  return ((p && !p.free && !CDN_EXCLUDE.has(f.name)) || f.rarity==='Mystical');
}).map(f => {
  const slug=f.name==='Eat Me'?'eat':f.name==='Drink Me'?'drink':f.name==='Caramel Apple'?'caramelapple2':f.name.toLowerCase().replace(/[^a-z0-9]/g,'');
  return [f.name,`https://ac.blooket.com/marketassets/blooks/${slug}.svg`];
}));


IMAGE_URLS['Tim the Alien']='https://ac.blooket.com/marketassets/blooks/timthealien.svg';
IMAGE_URLS['Phantom King']='https://ac.blooket.com/marketassets/blooks/phantomking.svg';
IMAGE_URLS['Rainbow Astronaut']='https://ac.blooket.com/marketassets/blooks/rainbowastronaut.svg';
IMAGE_URLS['Hamsta Claus']='https://ac.blooket.com/marketassets/blooks/hamstaclaus.svg';
// New 2026 entries use the same public original-asset URL pattern as other packs.
// These URLs have not been verified reachable; the application visibly reports failures.
// Starter pack Alpaca link from the older public Blook icon asset index.
IMAGE_URLS['Alpaca']='https://blooket.s3.us-east-2.amazonaws.com/blooks/farmAnimals/alpaca.svg';

// Original artwork URL references for archive entries, from a public third-party list.
// This does not establish permission to redistribute them; no artworks are bundled.
const ARCHIVE_IMAGE_URLS = {
 "Agent Owl": "https://ac.blooket.com/marketassets/blooks/agentowl.svg",
 "Anaconda Wizard": "https://ac.blooket.com/marketassets/blooks/anacondawizard.svg",
 "Baby Blue": "https://ac.blooket.com/marketassets/blooks/babyblue.svg",
 "Beaver": "https://ac.blooket.com/marketassets/blooks/beaver.svg",
 "Black": "https://ac.blooket.com/marketassets/blooks/black.svg",
 "Blue": "https://ac.blooket.com/marketassets/blooks/blue.svg",
 "Blue Gummy Bear": "https://ac.blooket.com/marketassets/blooks/bluegummybear.svg",
 "Blue Sweater Snowman": "https://ac.blooket.com/marketassets/blooks/bluesweatersnowman.svg",
 "Brown": "https://ac.blooket.com/marketassets/blooks/brown.svg",
 "Burgundy": "https://ac.blooket.com/marketassets/blooks/burgandy.svg",
 "Chick Chicken": "https://ac.blooket.com/marketassets/blooks/chickchicken.svg",
 "Chicken Chick": "https://ac.blooket.com/marketassets/blooks/chickenchick.svg",
 "Chilly Flamingo": "https://ac.blooket.com/marketassets/blooks/chillyflamingo.svg",
 "Chocolate Rabbit": "https://ac.blooket.com/marketassets/blooks/chocolaterabbit.svg",
 "Cookies Combo": "https://ac.blooket.com/marketassets/blooks/cookiescombo.svg",
 "Cozy Baby Penguin": "https://ac.blooket.com/marketassets/blooks/cozybabypenguin.svg",
 "Cyan Astronaut": "https://ac.blooket.com/marketassets/blooks/cyanastronaut.svg",
 "Deer": "https://ac.blooket.com/marketassets/blooks/deer.svg",
 "Dull Blue": "https://ac.blooket.com/marketassets/blooks/dullblue.svg",
 "Dust": "https://ac.blooket.com/marketassets/blooks/dust.svg",
 "Egypt Snow Globe": "https://ac.blooket.com/marketassets/blooks/egyptsnowglobe.svg",
 "Elf Sweater Snowman": "https://ac.blooket.com/marketassets/blooks/elfsweatersnowman.svg",
 "Frost Wreath": "https://ac.blooket.com/marketassets/blooks/frostwreath.svg",
 "Ghost Cookie": "https://ac.blooket.com/marketassets/blooks/ghostcookie.svg",
 "Giraffe": "https://ac.blooket.com/marketassets/blooks/giraffe.svg",
 "Golden Pumpkin Pie": "https://ac.blooket.com/marketassets/blooks/goldenpumpkinpie.svg",
 "Gorilla": "https://ac.blooket.com/marketassets/blooks/gorilla.svg",
 "Gray": "https://ac.blooket.com/marketassets/blooks/gray.svg",
 "Green": "https://ac.blooket.com/marketassets/blooks/green.svg",
 "Green Gummy Bear": "https://ac.blooket.com/marketassets/blooks/greengummybear.svg",
 "Haunted Pumpkin": "https://ac.blooket.com/marketassets/blooks/hauntedpumpkin.svg",
 "Hippo": "https://ac.blooket.com/marketassets/blooks/hippo.svg",
 "Holiday Elf": "https://ac.blooket.com/marketassets/blooks/holidayelf.svg",
 "Japan Snow Globe": "https://ac.blooket.com/marketassets/blooks/japansnowglobe.svg",
 "Light Blue": "https://ac.blooket.com/marketassets/blooks/lightblue.svg",
 "Lime": "https://ac.blooket.com/marketassets/blooks/lime.svg",
 "Lime Astronaut": "https://ac.blooket.com/marketassets/blooks/limeastronaut.svg",
 "London Snow Globe": "https://ac.blooket.com/marketassets/blooks/londonsnowglobe.svg",
 "Lovely Fox": "https://ac.blooket.com/marketassets/blooks/lovelyfox.svg",
 "Lovely Planet": "https://ac.blooket.com/marketassets/blooks/lovelyplanet.svg",
 "Lovely Rabbit": "https://ac.blooket.com/marketassets/blooks/lovelyrabbit.svg",
 "Maroon": "https://ac.blooket.com/marketassets/blooks/maroon.svg",
 "Master Elf": "https://ac.blooket.com/marketassets/blooks/masterelf.svg",
 "Mint": "https://ac.blooket.com/marketassets/blooks/mint.svg",
 "New York Snow Globe": "https://ac.blooket.com/marketassets/blooks/newyorksnowglobe.svg",
 "Nutcracker Koala": "https://ac.blooket.com/marketassets/blooks/nutcrackerkoala.svg",
 "Orange": "https://ac.blooket.com/marketassets/blooks/orange.svg",
 "Owl Sheriff": "https://ac.blooket.com/marketassets/blooks/owlsheriff.svg",
 "Paris Snow Globe": "https://ac.blooket.com/marketassets/blooks/parissnowglobe.svg",
 "Party Pig": "https://ac.blooket.com/marketassets/blooks/partypig.svg",
 "Pink": "https://ac.blooket.com/marketassets/blooks/pink.svg",
 "Pumpkin Cookie": "https://ac.blooket.com/marketassets/blooks/pumpkincookie.svg",
 "Pumpkin King": "https://ac.blooket.com/marketassets/blooks/pumpkinking.svg",
 "Purple": "https://ac.blooket.com/marketassets/blooks/purple.svg",
 "Raccoon Bandit": "https://ac.blooket.com/marketassets/blooks/raccoonbandit.svg",
 "Red": "https://ac.blooket.com/marketassets/blooks/red.svg",
 "Red Gummy Bear": "https://ac.blooket.com/marketassets/blooks/redgummybear.svg",
 "Red Sweater Snowman": "https://ac.blooket.com/marketassets/blooks/redsweatersnowman.svg",
 "Reindeer": "https://ac.blooket.com/marketassets/blooks/reindeer.svg",
 "Rhino": "https://ac.blooket.com/marketassets/blooks/rhino.svg",
 "Salmon": "https://ac.blooket.com/marketassets/blooks/salmon.svg",
 "Santa Claws": "https://ac.blooket.com/marketassets/blooks/santaclaws.svg",
 "Skeleton Fish": "https://ac.blooket.com/marketassets/blooks/skeletonfish.svg",
 "Snowy Bush Monster": "https://ac.blooket.com/marketassets/blooks/snowybushmonster.svg",
 "Spring Deer": "https://ac.blooket.com/marketassets/blooks/springdeer.svg",
 "Spring Rabbit": "https://ac.blooket.com/marketassets/blooks/springrabbit.svg",
 "Super Glider": "https://ac.blooket.com/marketassets/blooks/superglider.svg",
 "Tan": "https://ac.blooket.com/marketassets/blooks/tan.svg",
 "Teal": "https://ac.blooket.com/marketassets/blooks/teal.svg",
 "Tiger Zebra": "https://ac.blooket.com/marketassets/blooks/tigerzebra.svg",
 "Tropical Globe": "https://ac.blooket.com/marketassets/blooks/tropicalglobe.svg",
 "Vampire Bat": "https://ac.blooket.com/marketassets/blooks/vampirebat.svg",
 "Vampire Frog": "https://ac.blooket.com/marketassets/blooks/vampirefrog.svg",
 "White Peacock": "https://ac.blooket.com/marketassets/blooks/whitepeacock.svg",
 "Wise Caterpillar": "https://ac.blooket.com/marketassets/blooks/wisecaterpillar.svg",
 "Wise Owl": "https://ac.blooket.com/marketassets/blooks/wiseowl.svg",
 "Wolf": "https://ac.blooket.com/marketassets/blooks/wolf.svg",
 "Yellow": "https://ac.blooket.com/marketassets/blooks/yellow.svg"
};
Object.assign(CDN_IMAGE_URLS, ARCHIVE_IMAGE_URLS);


// v4: independent fan-made event rules, NOT official Blooket rewards or pack probabilities.
// Adjust trial thresholds here in a later update without modifying pack odds.
// V7.1: significantly harder, persistent endgame challenges.
// Pack counts are cumulative within the current saved site; the required OG Blook is NOT consumed.
// These are independent Twilight Bazaar rules, NOT official Blooket methods.
const EVENT_TRIALS = [
 {id:'spooky-ghost',name:'Spooky Ghost',pack:'spooky',opens:750,required:'ghost',seals:180,subtitle:'The haunted lantern trial'},
 {id:'tim-the-alien',name:'Tim the Alien',pack:'space',opens:1200,required:'astronaut',seals:260,subtitle:'The cosmic visitor trial'},
 {id:'phantom-king',name:'Phantom King',pack:'medieval',opens:1500,required:'king',seals:320,subtitle:'The phantom throne trial'},
 {id:'rainbow-astronaut',name:'Rainbow Astronaut',pack:'space',opens:3000,required:'red-astronaut',seals:600,subtitle:'The spectrum explorer trial',hint:'Red Astronaut rotates into the Space Pack on Fridays (UTC) in this simulator.'},
 {id:'hamsta-claus',name:'Hamsta Claus',pack:'blizzard',opens:1800,required:'santa-claus',seals:380,subtitle:'The winter visitor trial'}

];
const EVENT_MISSIONS = [
 {id:'open',name:'Open 10 packs',description:'Open any ten paid packs today',stat:'opens',goal:10,reward:5},
 {id:'salvage',name:'Salvage 3 duplicates',description:'Salvage three spare Uncommon or Rare Blooks today',stat:'salvaged',goal:3,reward:3},
 {id:'spin',name:'Spin the lantern',description:'Use the hourly spin at least once today',stat:'spins',goal:1,reward:2},
 {id:'trade',name:'Make a trade',description:'Complete one Trading Altar recipe today',stat:'trades',goal:1,reward:3}
];
const EVENT_EXCHANGE_PRICES = {Seasonal:16,Event:27,Retired:23,Unique:40,'Pack archive':19};
