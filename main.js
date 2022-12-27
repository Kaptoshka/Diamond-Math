const app = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: 0x87ceeb,
	transparent: false,
	antialias: true,
})
const gameOver = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: 0x00bfff,
	transparent: false,
	antialias: true,
})

app.stage.interactive = true
app.renderer.view.style.position = 'absolute'

document.body.appendChild(app.view)

const scoreStyle = new PIXI.TextStyle({
	fontFamily: 'Monocraft', //шрифт
	fontSize: 25 + window.innerWidth * 0.003, //размер
	fill: '#ffbf80', //заливка
	stroke: '#401c02', //обводка
	strokeThickness: 4, //толщина обводки
	dropShadow: true, //тень
	align: 'center',
})

const equationStyle = new PIXI.TextStyle({
	fontFamily: 'Monocraft', //шрифт
	fontSize: 17 + window.innerWidth * 0.003, //размер
	fill: '#2c2921', //заливка
	stroke: '#2c2921', //обводка
	strokeThickness: 1, //толщина обводки
	dropShadow: false, //тень
	align: 'center',
})

const gameOverStyle = new PIXI.TextStyle({
	fontFamily: 'Monocraft', //шрифт
	fontSize: 100 + window.innerWidth * 0.003, //размер
	fill: '#FF7518', //заливка
	stroke: '#8c2c03', //обводка
	strokeThickness: 5, //толщина обводки
	dropShadow: true, //тень
	align: 'center',
})

const gameOverScoreStyle = new PIXI.TextStyle({
	fontFamily: 'Monocraft', //шрифт
	fontSize: 70 + window.innerWidth * 0.003, //размер
	fill: '#FF7518', //заливка
	stroke: '#8c2c03', //обводка
	strokeThickness: 5, //толщина обводки
	dropShadow: true, //тень
	align: 'center',
})

const gameOverText = new PIXI.Text('Game Over', gameOverStyle)
gameOverText.anchor.set(0.5)
const finalScore = new PIXI.Text('', gameOverScoreStyle)
finalScore.anchor.set(0.5)
const fullHeartTexture = PIXI.Texture.from('img/png/Life/full_heart.png')
const emptyHeartTexture = PIXI.Texture.from('img/png/Life/empty_heart.png')
const enemyZone = PIXI.Sprite.from('img/png/GUI/blank_1.png')

let buttonYPosition // позиция по Y для кнопок
let posX = window.innerWidth * 0.03 //позиция по Х для новых сердец
let score = 0 //очки
let bit = score.toString().length // разрядность счета
let lives = 3 //жизни
let timeleft = 10 //таймер
let charSpeed = 2
let backgroundSpeed = 4
let keys = {}
let characterPosition = window.innerWidth * 0.15
let equationAnswer
let step = 250
let enemyMoveLeft
let isPause = false

let isPlaying = true

let isMenuOn = false
let gameOverCheck = false
let fightCheck = false
let solved = true
let spawnPos = 0
let run = false

const hearts = [] //массив сердец
let playerSheet = [] //таблица спрайтов игрока
let enemySheet = [] // противника
let shopSheet = [] // магазина (заднего фона)
let buttonSheet = [] // кнопки
const textureButton = PIXI.Texture.from('img/png/GUI/one_button_1.png') // текстура кнопки
const buttons = [] // массив кнопок
const buttonPosition = [] // массив позиций кнопок
const answTexts = [] //массив
const textPosition = [] // массив позиций текста
const divNumbers = [] // массив для чисел, которые делятся без остатка
const menuButtons = []

const restart = PIXI.Sprite.from('img/png/GUI/restart_1.png') //кнопка рестарта
restart.anchor.set(0.5)
restart.scale.set(0.2)
restart.interactive = true
restart.buttonMode = true

const pauseButton = PIXI.Sprite.from('img/png/GUI/pause_button.png') // кнопка паузы
pauseButton.anchor.set(0.5)
pauseButton.scale.set(2)
pauseButton.interactive = true
pauseButton.buttonMode = true

pauseButton.position.set(
	window.innerWidth / 2,
	window.innerHeight * 0.04,
)

const menu = PIXI.Sprite.from('img/png/GUI/menu.png') // меню
menu.anchor.set(0.5)
menu.scale.set(4, 3)
menu.position.set(
	window.innerWidth / 2,
	window.innerHeight / 2,
)

const scoreText = new PIXI.Text('SCORE: ' + score, scoreStyle) //счет
scoreText.anchor.set(0.5)
scoreText.position.set(window.innerWidth - 100 - bit * 10, window.innerHeight * 0.04)
app.loader
	.add([
		'img/sheets/Character/char_idle.json',
		'img/sheets/Character/char_attack.json',
		'img/sheets/Character/char_run.json',
		'img/sheets/Character/char_hurt.json',
		'img/sheets/Character/char_die.json',
		'img/sheets/Enemy/slime_idle.json',
		'img/sheets/Enemy/slime_attack.json',
		'img/sheets/Enemy/slime_move.json',
		'img/sheets/Enemy/slime_die.json',
		'img/sheets/Enemy/slime_spawn.json',
		'img/sheets/Background/shop.json',
		'img/sheets/GUI/button.json',
		'img/sheets/GUI/menu_button.json',
	])
	.load(doneLoading)

function doneLoading(resources) {
	createShopSheet()
	spawnShop(1500)
	createPlayerSheet()
	createPlayer()
	createEnemySheet()
	spawnEnemy(10)
	createButtonSheet()
	app.ticker.add(gameLoop)
}

function createPlayerSheet() {
	playerSheet['charIdleTextures'] = []
	for (let i = 1; i < 7; i++) {
		const charIdleTexture = PIXI.Texture.from(`char_idle_${i}.png`)
		playerSheet['charIdleTextures'].push(charIdleTexture)
	}
	playerSheet['charAttackTextures'] = []
	for (let i = 1; i < 7; i++) {
		const charAttackTexture = PIXI.Texture.from(`char_attack_${i}.png`)
		playerSheet['charAttackTextures'].push(charAttackTexture)
	}
	playerSheet['charRunTextures'] = []
	for (let i = 1; i < 9; i++) {
		const charRunTexture = PIXI.Texture.from(`char_run_${i}.png`)
		playerSheet['charRunTextures'].push(charRunTexture)
	}
	playerSheet['charHurtTextures'] = []
	for (let i = 1; i < 6; ++i) {
		const charHurtTexture = PIXI.Texture.from(`char_hurt_${i}.png`)
		playerSheet['charHurtTextures'].push(charHurtTexture)
	}
	playerSheet['charDieTextures'] = []
	for (let i = 1; i < 13; ++i) {
		const charDieTexture = PIXI.Texture.from(`char_die_${i}.png`)
		playerSheet['charDieTextures'].push(charDieTexture)
	}
}

function createPlayer() {
	character = new PIXI.AnimatedSprite(playerSheet.charIdleTextures)
	character.position.set(characterPosition, 470)
	character.scale.set(3)
	character.anchor.set(0.5)
	app.stage.addChild(character)
	character.play()
	character.animationSpeed = 0.1
	setParameters()
}

function createEnemySheet() {
	enemySheet['slimeIdleTextures'] = []
	for (let i = 1; i < 5; i++) {
		const slimeIdleTexture = PIXI.Texture.from(`slime_idle_${i}.png`)
		enemySheet['slimeIdleTextures'].push(slimeIdleTexture)
	}
	enemySheet['slimeAttackTextures'] = []
	for (let i = 1; i < 6; i++) {
		const slimeAttackTexture = PIXI.Texture.from(`slime_attack_${i}.png`)
		enemySheet['slimeAttackTextures'].push(slimeAttackTexture)
	}
	enemySheet['slimeMoveTextures'] = []
	for (let i = 1; i < 5; i++) {
		const slimeMoveTexture = PIXI.Texture.from(`slime_move_${i}.png`)
		enemySheet['slimeMoveTextures'].push(slimeMoveTexture)
	}
	enemySheet['slimeDieTextures'] = []
	for (let i = 1; i < 9; ++i) {
		const slimeDieTexture = PIXI.Texture.from(`slime_die_${i}.png`)
		enemySheet['slimeDieTextures'].push(slimeDieTexture)
	}
	enemySheet['slimeSpawnTextures'] = []
	for (let i = 8; i > 0; i--) {
		const slimeSpawnTexture = PIXI.Texture.from(`slime_die_${i}.png`);
		enemySheet['slimeSpawnTextures'].push(slimeSpawnTexture)
	}
}

function spawnEnemy(spawnCoef) {
	spawnPosition = character.x + getRandomIntBetween(15, spawnCoef * 4) * 50
	enemy = new PIXI.AnimatedSprite(enemySheet.slimeSpawnTextures)
	enemy.position.set(spawnPosition, 485)
	enemy.anchor.set(0.5)
	enemy.scale.set(3)
	enemy.loop = false
	app.stage.addChild(enemy)
	enemy.play()
	enemyMoveLeft = true
	enemy.animationSpeed = 0.1
}

function createShopSheet() {
	shopSheet['shopTextures'] = []
	for (let i = 1; i < 7; i++) {
		const shopTexture = PIXI.Texture.from(`shop_${i}.png`)
		shopSheet['shopTextures'].push(shopTexture)
	}
}

function spawnShop(spawnPos) {
	shop = new PIXI.AnimatedSprite(shopSheet.shopTextures)
	shop.position.set(spawnPos, 115)
	shop.scale.set(
		4 ,
		3.5, 
	)

	app.stage.addChild(shop)
	shop.play()
	shop.animationSpeed = 0.1
}

function createButtonSheet() {
	buttonSheet['buttonTextures'] = []
	for (let i = 1; i < 6; ++i) {
		const buttonTexture = PIXI.Texture.from(`one_button_${i}.png`)
		buttonSheet['buttonTextures'].push(buttonTexture)
	}
	buttonSheet['menuButtonTextures'] = []
	for (let i = 1; i < 3; ++i) {
		const menuButtonTexture = PIXI.Texture.from(`menu_button_${i}.png`)
		buttonSheet['menuButtonTextures'].push(menuButtonTexture)
	}
}

function setParameters() {
	buttonYPosition = character.y - 2 * 70
	// кнопки
	buttonPosition.push(
		window.innerWidth * 0.3 - character.width - 10,
		buttonYPosition,
	)
	buttonPosition.push(
		window.innerWidth * 0.3 - character.width - 10 + 75,
		buttonYPosition,
	)
	buttonPosition.push(
		window.innerWidth * 0.3 - character.width - 10 + 150,
		buttonYPosition,
	)
	textPosition.push(
		window.innerWidth * 0.3 - character.width - 10,
		buttonYPosition,
	)
	textPosition.push(
		window.innerWidth * 0.3 - character.width + 65,
		buttonYPosition,
	)
	textPosition.push(
		window.innerWidth * 0.3 - character.width + 140,
		buttonYPosition,
	)
	textPosition.push(window.innerWidth * 0.6, buttonYPosition)
	for (let i = 1; i < 11; ++i) {
		divNumbers[i] = []
		for (let j = 1; j < 11; ++j) {
			divNumbers[i].push(i * j)
		}
	}
	// const menu_button = new PIXI.AnimatedSprite(buttonSheet.menuButtonTextures)
	// menu_button.anchor.set(0.5)
	// menu_button.position.set(window.innerWidth / 2, window.innerHeight / 2)
	// menuButtons.push(menu_button)
}


// фоновая музыка
const mainMusic = new Howl({
	src: ['./sound/alt_theme_2.mp3'],
})
mainMusic.loop(true)
mainMusic.play()
Howler.volume(0.04)
// проигрыш
const loseMusic = new Howl({
	src: ['./sound/lose_music.wav'],
})
loseMusic.loop(false)
// удар мечом
const swordStrike = new Howl({
	src: ['./sound/sword_strike.wav'],
})
swordStrike.loop(false)
// звуки леса
const forestAmbient = new Howl({
	src: ['./sound/forest_ambient.wav'],
})
forestAmbient.loop(true)
forestAmbient.play()
// задний фон
const backgroundTexture = PIXI.Texture.from('img/png/Background/background.png')
const backgroundSprite = new PIXI.TilingSprite(
	backgroundTexture,
	app.screen.width,
	app.screen.height,
)

const backgroundEarthTexture = PIXI.Texture.from('img/png/Background/background_earth.png')
const backgroundEarthSprite = new PIXI.TilingSprite(
	backgroundEarthTexture,
	app.screen.width,
	app.screen.height,
)

backgroundSprite.tileScale.set(4, 3.3)
backgroundEarthSprite.tileScale.set(4, 3.3)
app.stage.addChild(backgroundSprite)
app.stage.addChild(pauseButton)
window.addEventListener('resize', function () {
	scoreStyle.fontSize = 25
})

function getRandomIntToMax(max) {
	//функция для получения рандомного числа от 0 до max
	return Math.floor(Math.random() * max)
}

function getRandomIntBetween(min, max) {
	//функция получения рандомного числа от min до max
	let rand = min + Math.random() * (max + 1 - min)
	return Math.floor(rand)
}

function getRandomIntExcept(min, max, firstException, secondException) {
	let rand = min + Math.random() * (max + 1 - min)
	console.log(Math.floor(rand), firstException)
	if ((Math.floor(rand) != firstException) && (Math.floor(rand) != secondException)) {
		return Math.floor(rand)
	} else {
		return getRandomIntExcept(min, max, firstException, secondException)
	}
}

for (let i = 0; i < 3; i++) {
	//заполнение массива сердец и вывод на экран
	const heart = new PIXI.Sprite(fullHeartTexture)
	heart.scale.set(3)
	heart.anchor.set(0.5)
	heart.position.set(posX, window.innerHeight * 0.04)
	app.stage.addChild(heart)
	hearts.push(heart)
	posX += 50
}
app.stage.addChild(scoreText)
function livesUpdate() {
	//обновление жизней
	for (let i = 0; i < hearts.length; i++) {
		if (hearts[hearts.length - i - 1].texture === fullHeartTexture) {
			hearts[hearts.length - i - 1].texture = emptyHeartTexture
			break
		}
	}
}

function getEquation() {
	solved = false
	app.stage.addChild(enemyZone)
	enemyZone.position.set(window.innerWidth * 0.6, buttonYPosition)
	enemyZone.scale.set(4, 3)
	enemyZone.anchor.set(0.5)
	for (let i = 0; i < 4; ++i) {
		const answText = new PIXI.Text('', equationStyle)
		answText.anchor.set(0.5)
		answText.x = textPosition[2 * i]
		answText.y = textPosition[2 * i + 1]
		answTexts.push(answText)
	}
	let sign = getRandomIntBetween(1, 4)
	let answer = -1000
	let a, b
	if (sign == 1) {
		a = getRandomIntBetween(1, 50)
		b = getRandomIntBetween(1, 50)
		answer = a + b
		answTexts[3].text = a + ' +  ???  = ' + answer
	} else if (sign == 2) {
		a = getRandomIntBetween(1, 50)
		b = getRandomIntBetween(1, a)
		answer = a - b
		answTexts[3].text = a + ' -  ???  = ' + answer
	} else if (sign == 3) {
		a = getRandomIntBetween(1, 10)
		b = getRandomIntBetween(1, 10)
		answer = a * b
		answTexts[3].text = a + '  •  ???  = ' + answer
	} else {
		a = getRandomIntBetween(1, 10)
		b = getRandomIntBetween(1, 10)
		answer = divNumbers[a][b - 1] / b
		answTexts[3].text = divNumbers[a][b - 1] + '  ∶  ???  = ' + answer
	}
	let rnd = getRandomIntBetween(1, 3)
	if (rnd == 1) {
		answTexts[0].text = b
		answTexts[1].text = getRandomIntExcept(b - 5, b + 5, b, -1000)
		answTexts[2].text = getRandomIntExcept(b - 5, b + 5, b, +answTexts[1].text)
	} else if (rnd == 2) {
		answTexts[0].text = getRandomIntExcept(b - 5, b + 5, b, -1000)
		answTexts[1].text = b
		answTexts[2].text = getRandomIntExcept(b - 5, b + 5, b, +answTexts[0].text)
	} else {
		answTexts[0].text = getRandomIntExcept(b - 5, b + 5, b, -1000)
		answTexts[1].text = getRandomIntExcept(b - 5, b + 5, b, +answTexts[0].text)
		answTexts[2].text = b
	}
	equationAnswer = b
	for (i = 0; i < 3; ++i) {
		const button = new PIXI.AnimatedSprite(buttonSheet.buttonTextures)
		button.scale.set(2, 2)
		button.anchor.set(0.5)
		button.x = buttonPosition[2 * i]
		button.y = buttonPosition[2 * i + 1]
		button.interactive = true
		button.cursor = 'pointer'
		button.animationSpeed = 0.3
		button.loop = false
		button.value = answTexts[i].text
		button.on('pointerdown', onButtonDown)
		// .on('pointerup', onButtonUp)
		// .on('pointerupoutside', onButtonUp)
		// .on('pointerover', onButtonOver)
		// .on('pointerout', onButtonOut);
		buttons.push(button)
	}
	for (let i = 0; i < 3; ++i) {
		app.stage.addChild(buttons[i])
		app.stage.addChild(answTexts[i])
	}
	app.stage.addChild(answTexts[3])
}

function onButtonDown() {
	this.play()
	if (equationAnswer == this.value) {	
		for (let i = 0; i < 3; ++i) {
			buttons[i].interactive = false
		}
		correctAnswer()
		return
	} else {
		app.stage.removeChild(this)
		for (let i = 0; i < 4; ++i) {
			if (answTexts[i].text == this.value) {
				app.stage.removeChild(answTexts[i])
			}	
		}
		wrongAnswer()
		return
	}
}

function correctAnswer() {
	swordStrike.play()
	enemy.textures = enemySheet.slimeDieTextures
	enemy.loop = false
	enemy.play()
	character.textures = playerSheet.charAttackTextures
	character.loop = false
	character.play()
	score += 1
	if (score.toString().length > bit) {
		bit = score.toString().length
		scoreText.x -= bit * 5
	}
	scoreText.text = 'SCORE: ' + score
	setTimeout(() => {
		run = true
		slowUnblur()
		for (let i = 0; i < 4; ++i) {
			app.stage.removeChild(buttons[i])
			app.stage.removeChild(answTexts[i])
		}
		buttons.splice(0, 3)
		answTexts.splice(0, 5)
		app.stage.removeChild(enemyZone)
		app.stage.removeChild(enemy)
		spawnEnemy(10)
		app.stage.addChild(character)
		character.textures = playerSheet.charIdleTextures
		character.loop = true
		character.play()
		fightCheck = false
		solved = true
	}, 1500)
}

function wrongAnswer() {
	lives -= 1
	livesUpdate()
	enemy.textures = enemySheet.slimeAttackTextures
	enemy.loop = false
	enemy.play()
	if (lives > 0) {
		character.textures = playerSheet.charHurtTextures
		character.loop = false
		character.play()
		setTimeout(() => {
			enemy.textures = enemySheet.slimeIdleTextures
			enemy.loop = true
			enemy.play()
			character.textures = playerSheet.charIdleTextures
			character.loop = true
			character.play()
		}, 900)
	} else {
		enemy.textures = enemySheet.slimeAttackTextures
		enemy.loop = false
		enemy.play()
		mainMusic.stop()
		loseMusic.play()
		character.textures = playerSheet.charDieTextures
		character.loop = false
		character.play()
		setTimeout(() => {
			gameOverCheck = true
			enemy.textures = enemySheet.slimeIdleTextures
			enemy.loop = true
			enemy.play()
		}, 2000)
	}
}

function collision(a, b) {
	//проверка коллизии между объектами а и b
	let aBox = a.getBounds()
	let bBox = b.getBounds()
	return (
		aBox.x + window.innerWidth * 0.3 > bBox.x &&
		aBox.x < bBox.x + bBox.width &&
		aBox.y + aBox.height > bBox.y &&
		aBox.y < bBox.y + bBox.height
	)
}

// keyboard event handler
window.addEventListener('keydown', keysDown)
window.addEventListener('keyup', keysUp)

function keysDown(e) {
	keys[e.keyCode] = true
}
function keysUp(e) {
	keys[e.keyCode] = false
}
const blurFilter = new PIXI.filters.BlurFilter()
blurFilter.blur = 5

let gameStart = true

// фильтры
function removeFilters(blur) {
	backgroundSprite.filters = []
	scoreText.filters = []
	character.filters = []
	enemy.filters = []
	shop.filters = []
	pauseButton.filters = []
	for (let i = 0; i < 3; ++i) {
		hearts[i].filters = []
	}	
}

pauseButton.on('pointertap', showMenu)

function showMenu() {
	blurEverything()
	pauseEverything()
	isPause = true
	Howler.volume(0.01)
	app.stage.addChild(menu)
}

function blurEverything() {
	blurFilter.blur = 5
	backgroundSprite.filters = [blurFilter]
	scoreText.filters = [blurFilter]
	character.filters = [blurFilter]
	enemy.filters = [blurFilter]
	shop.filters = [blurFilter]
	// pauseButton.filters = [blurFilter]
	for (let i = 0; i < 3; ++i) {
		hearts[i].filters = [blurFilter]
	}
}

function pauseEverything() {
	character.stop()
	enemy.stop()
	shop.stop()
}

function slowUnblur() {
	blurFilter.blur = 5
	while (blurFilter.blur > 0) {
		blurFilter.blur -= 0.1
		backgroundSprite.filters = [blurFilter]
		scoreText.filters = [blurFilter]
		character.filters = [blurFilter]
		enemy.filters = [blurFilter]
		shop.filters = [blurFilter]
		pauseButton.filters = [blurFilter]
		for (let i = 0; i < 3; ++i) {
			hearts[i].filters = [blurFilter]
		}
	}
	removeFilters()
}

function gameLoop(delta) {
	if (!isPause) {
		if (gameOverCheck) {
			isPlaying = false
			document.body.appendChild(gameOver.view)
			backgroundSprite.filters = [blurFilter]
			gameOver.stage.addChild(backgroundSprite)
			gameOver.renderer.view.style.position = 'absolute'
			gameOver.stage.addChild(gameOverText)
			gameOverText.position.set(
				gameOver.screen.width / 2,
				gameOver.screen.height * 0.3,
			)
			gameOver.stage.addChild(finalScore)
			finalScore.position.set(
				gameOver.screen.width / 2,
				gameOver.screen.height * 0.5,
			)
			finalScore.text = 'You scored ' + score + ' points'

			const scoreInput = document.getElementById('score')
			scoreInput.setAttribute('value', score)

			gameOver.stage.addChild(restart)
			restart.position.set(
				gameOver.screen.width / 2,
				gameOver.screen.height * 0.8,
			)

			restart.on('pointertap', () => {
				window.location.reload()
			})
		}
		if (gameStart) {
			backgroundSprite.filters = [blurFilter]
			scoreText.filters = [blurFilter]
			character.filters = [blurFilter]
			enemy.filters = [blurFilter]
			shop.filters = [blurFilter]
			pauseButton.filters = [blurFilter]
			for (let i = 0; i < 3; ++i) {
				hearts[i].filters = [blurFilter]
			}
			blurFilter.blur -= 0.1
			if (blurFilter.blur <= 0) {
				gameStart = false
				removeFilters()
			}
		}
		if (collision(character, enemy)) {
			fightCheck = true
		}
		if (shop.x + shop.width + 250 < 0) {
			app.stage.removeChild(shop);
			spawnShop(getRandomIntBetween(3, 5) * 1000);
		}
		if (!fightCheck) {
			if ((step > 0) && (enemyMoveLeft)) {
				if (step - 1 == 0) {
					enemyMoveLeft = false
					step = 500
					enemy.scale.x = -3
				}
				step--
				enemy.x -= 0.5
			} else if (step > 0) {
				enemy.x += 0.5
				step--
				if (step - 1 == 0) {
					step = 500
					enemy.scale.x = 3
					enemyMoveLeft = true
				}
			} 
			if (!enemy.playing) {
				enemy.textures = enemySheet.slimeIdleTextures
				enemy.loop = true;
				enemy.play();
			}
			// A || leftArrow
			if (keys['65'] || keys['37']) {
				if (run) {
					character.stop()
				}
				character.scale.x = -3
				run = false
				character.loop = false
				if (!character.playing) {
					character.textures = playerSheet.charRunTextures
					character.play()
				}
				if (character.x >= 30) {
					backgroundSprite.tilePosition.x += backgroundSpeed
					character.x -= 2 * charSpeed
					enemy.x += 2 * charSpeed
					shop.x += 2 * charSpeed
				}
			} else if (keys['68'] || keys['39']) {
				// D || rightArrow
				if (run) {
					character.stop()
				}
				charSpeed = 2
				left = false
				character.scale.x = 3
				run = false
				character.loop = false
				if (!character.playing) {
					character.textures = playerSheet.charRunTextures
					character.play()
				}
				if (character.x > window.innerWidth / 4) {
					backgroundSprite.tilePosition.x -= backgroundSpeed
				} else {
					backgroundSprite.tilePosition.x -= backgroundSpeed
					character.x += charSpeed
				}
				enemy.x -= 2 * charSpeed
				shop.x -= 2 * charSpeed
			} else {
				if (!run) {
					character.loop = true
					run = true
					character.textures = playerSheet.charIdleTextures
					character.play()
				}
			}
		} else {
			if (solved) {
				backgroundSprite.filters = [blurFilter]
				shop.filters = [blurFilter]
				blurFilter.blur = 5
				enemy.textures = enemySheet.slimeIdleTextures
				enemy.scale.x = 3
				enemy.play()
				enemy.loop = true
				character.scale.x = 3
				character.position.set(
					window.innerWidth * 0.3, 
					470,
				)
				enemy.position.set(
					window.innerWidth * 0.6, 
					485,
				)
				character.loop = true
				character.textures = playerSheet.charIdleTextures
				character.play()
				getEquation()
			}
		}
	} 
}
