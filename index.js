const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
canvas.width = 1408
canvas.height = 640

going = true


var CAM_X = -1600 + 1408 / 2
var CAM_Y = -1600 + 1408 / 2

var level = 2


var tilesheet = new Image()
tilesheet.src = "tiles.png"

var keys = {
    up: {
        pressed: false
    },
    down: {
        pressed: false
    },
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    shift: {
        pressed: false
    },
    enter : {
      pressed: false
    },
    space : {
      pressed: false
    },
    one : {
      pressed: false
    },
    two: {
      pressed: false
    }
}

class Player
{
    constructor()
    {
        this.x = canvas.width / 2 - 10
        this.y = canvas.height / 2 - 10
        this.speed = 5
        this.radius = 10
        this.dir = Math.PI
        this.length = 40
        this.type = 1
        this.max = 100
        this.health = this.max
        this.reloadTime = .2 * 58
        this.reloadTimer = 0
        this.reload = false
        this.aimRadius = 10

        this.kills = 0

        this.touchingBullet = false
    }

    draw()
    {
        if (this.type == 1)
        {
          

        }

        

        c.font = "50px Times New Roman"
        c.fillStyle = "black"
        c.fillText("Kills: " + this.kills, 20, 50)
         
        
       
       
    }
    update(tiles, bullets)
    {
        if (keys.up.pressed && !keys.shift.pressed)
        {
            for (var i = 0; i < this.speed; i++)
            {
                CAM_Y += 1
                
                
                
            }
            
        }
        if (keys.down.pressed && !keys.shift.pressed)
        {
            for (var i = 0; i < this.speed; i++)
            {
                
                
                
                CAM_Y -= 1
                
            }
        }
        if (keys.left.pressed && !keys.shift.pressed)
        {
          for (var i = 0; i < this.speed; i++)
            {
                
                
                
                CAM_X += 1
                
            }
            
            
            
            
        }
        if (keys.right.pressed && !keys.shift.pressed)
        {
          for (var i = 0; i < this.speed; i++)
            {
                
                
                
                CAM_X -= 1
                
            }
          
            
            
        }

        
        
    }
}

class Bullet
{
    constructor(x, y, type, dir, damage, target)
    {
        this.x = x
        this.y = y
        this.speed = 20
        this.dir = dir
        this.type = type
        this.alive = true
        this.damage = damage
        this.target = target
    }
    draw()
    {
        if (this.alive)
        {
            c.beginPath()
            c.lineWidth = 4
            c.strokeStyle = "black"
            c.moveTo(this.x + CAM_X, this.y + CAM_Y)
            c.lineTo(this.x + -Math.sin(this.dir) * 5 + CAM_X, this.y + Math.cos(this.dir) * 5 + CAM_Y)
            c.stroke()
        }
        return this.alive
        
    }
    update(tiles)
    {
        this.x += -Math.sin(this.dir)* this.speed
        this.y += Math.cos(this.dir)* this.speed
        tiles.forEach(tile =>
            {
                if (this.x + CAM_X < tile.x * 64 + 64 + CAM_X && this.x + 5  + CAM_X> tile.x * 64+ CAM_X && this.y + CAM_Y < tile.y * 64+ 64 + CAM_Y && this.y + 5 + CAM_Y > tile.y * 64+ CAM_Y)
                {
                    if (tile.type == -3)
                    {
                      if (this.target == 1)
                      {
                        
                      }
                      
                    }
                    else if (tile.type != 1 && tile.type != -2)
                    {
                        this.alive = false
                        
                    }
                    
                    
                }
                
                
            })

            if (this.x + CAM_X < -100)
            {
                this.alive = false
            }
            else if (this.x + CAM_X > 1600)
            {
                this.alive = false
            }
            else if (this.y + CAM_Y < -100)
            {
                this.alive = false
            }
            else if (this.y + CAM_Y > 750)
            {
                this.alive = false
            }
        
    }
}


class Enemy
{
    constructor(x, y, type, maxHealth)
    {
        this.x = x
        this.y = y
        this.prevX = 0
        this.prevY = 0
        this.type = type
        this.dir = 0
        this.speed = 1
        this.radius = 10
        this.relx = 0
        this.rely = 0
        this.length = 40
        this.alive = true
        this.max = maxHealth
        this.health = this.max
        this.touchingBullet = false
        this.reload = false
        this.reloadTime = 5 * 58
        this.reloadTimer = 0
        this.dist = 0
        this.fireDistance = 500
    }
    draw()
    {
        //outline
        c.beginPath()
        c.fillStyle = "black"
        c.strokeStyle = "black"
        c.lineWidth = 10
        c.moveTo(this.x + CAM_X, this.y + CAM_Y)
        c.lineTo(this.x - Math.sin(this.dir) * this.length / 2 + CAM_X, this.y + Math.cos(this.dir) * this.length / 2 + CAM_Y)
        c.stroke()

        //main line
        c.beginPath()
        c.lineWidth = 5
        c.strokeStyle = "grey"
        c.moveTo(this.x + CAM_X, this.y + CAM_Y)
        c.lineTo(this.x - Math.sin(this.dir) * (this.length / 2 - 4) + CAM_X, this.y + Math.cos(this.dir) * (this.length / 2 - 4) + CAM_Y)
        c.stroke()

       //circle
       c.beginPath()
       c.lineWidth = 5
       c.strokeStyle = "black"
       c.arc(this.x + CAM_X, this.y + CAM_Y, this.radius, 0, Math.PI * 2)
       c.fillStyle = "grey"
       c.fill()
       c.stroke()
    }
    update(allies, bullets, tiles)
    {
        this.dist = 9999999999999999999
        
        var d = 0
        var i = 0
        var index = 0
        
        
        allies.forEach(ally =>{
          d = Math.sqrt(Math.pow(((this.x + CAM_X) - (ally.x + CAM_X)), 2) + Math.pow(((this.y + CAM_Y) - (ally.y + CAM_Y)), 2))
          
          if (d < this.dist)
          {
            this.dist = d
            index = i
          }
          i++
          
        })
        
        
        this.relx = allies[index].x + CAM_X - (this.x + CAM_X)
        this.rely = allies[index].y + CAM_Y - (this.y + CAM_Y)
        this.dir = -Math.atan2(this.relx, this.rely)
        

        


            

        for (var i = 0; i < this.speed; i++)
        {
            
            
            
            if (this.reloadTimer <= this.reloadTime - 20 && this.dist >= 300)
            {
            this.y += 1
            tiles.forEach(tile =>
                {
                    
                    if (this.x + CAM_X - this.radius <  tile.x * 64 + 64 + CAM_X && this.x + this.radius + CAM_X > tile.x * 64 + CAM_X && this.y + CAM_Y - this.radius < tile.y * 64 + 64 + CAM_Y && this.y + this.radius + CAM_Y > tile.y * 64 + CAM_Y)
                    {
                        if (tile.type != 1 && tile.type != -2)
                        {
                            this.y -= 1
                        }
                       
                    }
                })
            }
            
            if (this.y == this.prevY && this.dist >= 300)
            {
              this.x -= 1
            }
            

            var tb = false
            bullets.forEach(bullet =>
                {
                    if (this.x + CAM_X - this.radius < bullet.x + CAM_X + 5 && this.x + this.radius + CAM_X > bullet.x + CAM_X && this.y + CAM_Y - this.radius < bullet.y + 5 + CAM_Y && this.y + this.radius + CAM_Y > bullet.y + CAM_Y)
                    {
                        
                        if (!this.touchingBullet && bullet.target == 1)
                        {
                            this.health -= bullet.damage
                            this.touchingBullet = true
                            bullet.alive = false
                            
                        }
                        tb = true
                    }
                    
                    
                })
            
            

            
            
        }
        if (!tb)
            {
                this.touchingBullet = false
            }
            if (this.health <= 0)
            {
                this.alive = false
                player.kills += 1
            }


            if (this.reload)
            {
                this.reloadTimer += 1
                if (this.reloadTimer > this.reloadTime)
                {
                    this.reload = false
                    this.reloadTimer = 0
                }
            }


            
        this.prevX = this.x
        this.prevY = this.y
        
        if (this.y >= 1334)
        {
          window.location.reload()
          going = false
        }
            return this.alive
        

    }
}

class Ally
{
    constructor(x, y, type, maxHealth)
    {
        this.x = x
        this.y = y
        this.type = type
        this.dir = 0
        this.speed = 5
        this.radius = 10
        this.relx = 0
        this.rely = 0
        this.length = 40
        this.alive = true
        this.max = maxHealth
        this.health = this.max
        this.touchingBullet = false
        this.reload = false
        this.reloadTime = 3 * 58
        this.reloadTimer = 0
        this.dist = 0
        this.fireDistance = 500
    }
    draw()
    {
        //outline
        c.beginPath()
        c.fillStyle = "black"
        c.strokeStyle = "black"
        c.lineWidth = 10
        c.moveTo(this.x + CAM_X, this.y + CAM_Y)
        c.lineTo(this.x - Math.sin(this.dir) * this.length / 2 + CAM_X, this.y + Math.cos(this.dir) * this.length / 2 + CAM_Y)
        c.stroke()

        //main line
        c.beginPath()
        c.lineWidth = 5
        c.strokeStyle = "blue"
        c.moveTo(this.x + CAM_X, this.y + CAM_Y)
        c.lineTo(this.x - Math.sin(this.dir) * (this.length / 2 - 4) + CAM_X, this.y + Math.cos(this.dir) * (this.length / 2 - 4) + CAM_Y)
        c.stroke()

       //circle
       c.beginPath()
       c.lineWidth = 5
       c.strokeStyle = "black"
       c.arc(this.x + CAM_X, this.y + CAM_Y, this.radius, 0, Math.PI * 2)
       c.fillStyle = "blue"
       c.fill()
       c.stroke()
    }
    update(enemies, bullets, tiles)
    {
      this.dist = 9999999999
      var d = 0
      var i = 0
      var index = 0
        enemies.forEach(enemy =>
        {
          d = Math.sqrt(Math.pow(((this.x + CAM_X) - (enemy.x + CAM_X)), 2) + Math.pow(((this.y + CAM_Y) - (enemy.y + CAM_Y)), 2))
          if (d < this.dist)
          {
            this.dist = d
            index = i
          }
          i++
        })
        this.relx = enemies[index].x + CAM_X - (this.x + CAM_X)
        this.rely = enemies[index].y + CAM_Y - (this.y + CAM_Y)
        this.dir = -Math.atan2( this.relx, this.rely)
        

        


            

        for (var i = 0; i < this.speed; i++)
        {
          /*if (level != 1)
          {
            
          
            if (this.dist >= this.fireDistance)
            {
                this.x += -Math.sin(this.dir)
            
            tiles.forEach(tile =>
                {
                    
                    if (this.x + CAM_X - this.radius <  tile.x * 64 + 64 + CAM_X && this.x + this.radius + CAM_X > tile.x * 64 + CAM_X && this.y + CAM_Y - this.radius < tile.y * 64 + 64 + CAM_Y && this.y + this.radius + CAM_Y > tile.y * 64 + CAM_Y)
                    {
                        if (tile.type != 1 && tile.type != -2)
                        {
                            this.x -= -Math.sin(this.dir)
                            
                        }
                        
                    }
                })
            }
            
            if (this.dist >= this.fireDistance)
            {
            this.y += Math.cos(this.dir)
            tiles.forEach(tile =>
                {
                    
                    if (this.x + CAM_X - this.radius <  tile.x * 64 + 64 + CAM_X && this.x + this.radius + CAM_X > tile.x * 64 + CAM_X && this.y + CAM_Y - this.radius < tile.y * 64 + 64 + CAM_Y && this.y + this.radius + CAM_Y > tile.y * 64 + CAM_Y)
                    {
                        if (tile.type != 1 && tile.type != -2)
                        {
                            this.y -= Math.cos(this.dir)
                        }
                       
                    }
                })
            }
          }*/

            var tb = false
            bullets.forEach(bullet =>
                {
                    if (this.x + CAM_X - this.radius < bullet.x + CAM_X + 5 && this.x + this.radius + CAM_X > bullet.x + CAM_X && this.y + CAM_Y - this.radius < bullet.y + 5 + CAM_Y && this.y + this.radius + CAM_Y > bullet.y + CAM_Y)
                    {
                        
                        if (!this.touchingBullet && bullet.target == 0)
                        {
                            this.health -= bullet.damage
                            this.touchingBullet = true
                            bullet.alive = false
                            
                        }
                        tb = true
                    }
                    
                    
                })
            
            if (!tb)
            {
                this.touchingBullet = false
            }
            if (this.health <= 0)
            {
                this.alive = false
                
            }


            if (this.reload)
            {
                this.reloadTimer += 1
                if (this.reloadTimer > this.reloadTime)
                {
                    this.reload = false
                    this.reloadTimer = 0
                }
            }


            

            return this.alive

            
            
        }
        

    }
}


class HealthBar
{
    constructor(x, y, width, max, health, shape)
    {
        this.x = x
        this.y = y
        this.max = max
        this.health = health
        this.width = width
        this.shape = shape
        this.frame = 0
    }
    draw()
    {
        if (this.shape == 1)
        {
            c.beginPath()
            c.lineWidth = 15
            c.moveTo(this.x + (this.width / 2) - (this.max / 2), this.y + 10)
            c.lineTo(this.x + (this.width / 2) + (this.max / 2), this.y + 10)
            c.stroke()
        }
        else if (this.shape == 2)
        {
            /*c.beginPath()
            c.lineWidth = 15
            c.strokeStyle = "black"
            c.moveTo(this.x - (this.max / 2), this.y - this.width - 25)
            c.lineTo(this.x + (this.max / 2), this.y - this.width - 25)
            c.stroke()*/

            c.fillStyle = 'black'
            c.fillRect(this.x - (this.max / 2), this.y - this.width - 25, this.max, 15)
            c.fillStyle = "rgb(50, 255, 50)"
            c.fillRect(this.x - (this.max / 2) + 3.5, this.y - this.width - 25 + 3.5, this.health - 7, 7)


            /*c.beginPath()
            c.lineWidth = 7
            c.strokeStyle = "rgb(50, 255, 50)"
            c.moveTo(this.x - (this.max / 2) + c.lineWidth, this.y - this.width - 25)
            c.lineTo(this.x + (this.health / 2) - c.lineWidth, this.y - this.width - 25)
            c.stroke()*/
        }
        
    }
    update(x, y, width, max, health)
    {
        this.x = x
        this.y = y
        this.max = max
        this.health = health
        this.width = width
        
        
    }
}

class Tile
{
    constructor(x, y, type)
    {
        this.x = x
        this.y = y
        this.width = 64
        this.height = 64
        this.type = type
        this.health = 75
        this.alive = true
        this.frame = Math.floor(Math.random() * 300) - 100
        this.patternx = Math.floor(Math.random() * 40) + 10
        this.patterny = Math.floor(Math.random() * 20) + 10
        this.patterns = Math.floor(Math.random() * 10) + 5
        this.patternx2 = Math.floor(Math.random() * 40) + 10
        this.patterny2 = Math.floor(Math.random() * 20) + 10
        this.patterns2 = Math.floor(Math.random() * 10) + 5
        this.patternx3 = Math.floor(Math.random() * 20) + 10
        this.patterny3 = Math.floor(Math.random() * 40) + 10
        this.patterns3 = Math.floor(Math.random() * 10) + 5
    }
    draw()
    {
        if (this.type == 0)
        {
            c.drawImage(tilesheet, this.type * 64 + 1, 0, 63, 63, this.x * 64 + CAM_X , this.y * 64 + CAM_Y, 64, 64)
        }
        else if (this.type == 1 || this.type == -2)
        {

        }
        else if (this.type == -3)
        {
          c.fillStyle = "rgb(87, 71, 41)"
          c.fillRect(this.x * 64 + CAM_X + 30, this.y * 64 + CAM_Y + 30, 65, 33)
          c.fillStyle = "tan"
          c.fillRect(this.x * 64 + CAM_X + this.patternx, this.y * 64 + CAM_Y + this.patterny + 20, this.patterns, this.patterns)
          c.fillRect(this.x * 64 + CAM_X + this.patternx2, this.y * 64 + CAM_Y + this.patterny2 + 20, this.patterns2, this.patterns2 )
          c.fillRect(this.x * 64 + CAM_X + this.patternx3, this.y * 64 + CAM_Y + this.patterny3 + 20, this.patterns3, this.patterns3)
        }
        else{
            c.fillStyle = "darkgrey"
            c.fillRect(this.x * 64 + CAM_X, this.y * 64 + CAM_Y, 65, 65)
            c.fillStyle = "grey"
            c.fillRect(this.x * 64 + CAM_X + this.patternx, this.y * 64 + CAM_Y + this.patterny, this.patterns, this.patterns)
            c.fillRect(this.x * 64 + CAM_X + this.patternx2, this.y * 64 + CAM_Y + this.patterny2, this.patterns2, this.patterns2)
            c.fillRect(this.x * 64 + CAM_X + this.patternx3, this.y * 64 + CAM_Y + this.patterny3, this.patterns3, this.patterns3)
        }
        
    }
    update()
    {
      
        
        if (this.type == -3)
        {
          bullets.forEach(bullet =>
                {
                    if (this.x * 64 + CAM_X  < bullet.x + CAM_X + 5 && this.x * 64 + CAM_X + 64 > bullet.x + CAM_X && this.y * 64 + CAM_Y  < bullet.y + 5 + CAM_Y && this.y * 64 + CAM_Y + 64 > bullet.y + CAM_Y)
                    {
                        
                        if (!this.touchingBullet && bullet.target == 0)
                        {
                            this.health -= bullet.damage
                            
                            bullet.alive = false
                            
                        }
                        
                    }
                    
                    
                })
          if (this.health <= 0)
          {
            this.alive = false
          }
        }
        
        if (this.type == 1 || this.type == -2)
        {
            
            this.frame += 1
            if (this.frame >= 300)
            {
                this.frame = Math.floor(Math.random() * 300) - 100
                
                return true
                
            }
            return false
        }
        
    }
}


//locations: Devil's Den, Little Round Top


function LoadLevel(level)
{
    
    if (level == 2)
    {
      tiles = []
        for (var i = 0; i < 50; i++)
        {
            tiles.push(new Tile(i, 0, 0))
            
            tiles.push(new Tile(i, 30, 0))
            
            
        }
        for (var i = 0; i < 30; i++)
        {
            
            tiles.push(new Tile(0, i, 0))
            tiles.push(new Tile(50, i, 0))
            
            
            
        }
        tiles.push(new Tile(50, 30, 0))
        
        
        for (var i = 0; i < 20; i++)
        {
          tiles.push(new Tile(15 + i, 5, 1))
        }
        
        for (var i = 0; i < 20; i++)
        {
          tiles.push(new Tile(15 + i, 20, -2))
          tiles.push(new Tile(15 + i, 19, -3))
        }
        
        
        tiles.push(new Tile(15, 11, 0))
        tiles.push(new Tile(16, 14, 0))
        tiles.push(new Tile(25, 15, 0))
        tiles.push(new Tile(21, 14, 0))
        tiles.push(new Tile(18, 15, 0))
        tiles.push(new Tile(27, 14, 0))
        tiles.push(new Tile(18, 12, 0))
        tiles.push(new Tile(23, 15, 0))
        
        tiles.push(new Tile(14, 10, 0))
        tiles.push(new Tile(11, 14, 0))
        tiles.push(new Tile(16, 13, 0))
        tiles.push(new Tile(32, 14, 0))
        tiles.push(new Tile(29, 15, 0))
        tiles.push(new Tile(24, 13, 0))
        tiles.push(new Tile(11, 12, 0))
        tiles.push(new Tile(13, 15, 0))
        
        
        tiles.push(new Tile(30, 10, 0))
        tiles.push(new Tile(21, 14, 0))
        tiles.push(new Tile(16, 13, 0))
        tiles.push(new Tile(31, 8, 0))
        tiles.push(new Tile(26, 9, 0))
        tiles.push(new Tile(6, 13, 0))
        tiles.push(new Tile(9, 12, 0))
        tiles.push(new Tile(10, 15, 0))
        
    }
    return tiles
    
}
allies = []
tiles = LoadLevel(level)
tiles.forEach(tile =>
            {
                
                if (tile.type == -2)
                {
                  allies.push(new Ally(tile.x * 64 + 32 + Math.floor(Math.random() * 20) - 10, tile.y * 64 + 32 + Math.floor(Math.random() * 20) - 10, 1, 50))
                }
                
                
                
            })

function NewWave(wave)
{
  if (wave == 1)
  {
    for (var i = 0; i < 1; i++)
    {
    tiles.forEach(tile =>
            {
                if (tile.type == 1)
                {
                    enemies.push(new Enemy(tile.x * 64 + 32 + Math.floor(Math.random() * 40) - 20 - (wave- 1) * 128, tile.y * 64 + 32 + Math.floor(Math.random() * 40) - 20, 1, 50))
                }
                
                
            })
  }
  }
  else {
    for (var i = 0; i < 2; i++)
  {
    tiles.forEach(tile =>
            {
                if (tile.type == 1)
                {
                    enemies.push(new Enemy(tile.x * 64 + 32 + Math.floor(Math.random() * 40) - 20 - (wave- 1) * 128, tile.y * 64 + 32 + Math.floor(Math.random() * 40) - 20, 1, 50))
                }
                
                
            })
  }
  }
  
  
}

wave = 1

player = new Player()
bullets = []
enemies = []


eh = new HealthBar(1, 1, 1, 1, 1, 2)



ah = new HealthBar(1, 1, 1, 1, 1, 2)


                
                
te = 0
ft = 16
ct = Date.now()

f = 0

time = 0

NewWave(wave)

function animate()
{
    st = ct
    requestAnimationFrame(animate)


    ct = Date.now()
    te += ct - st

    if (te >= ft)
    {
      if (going == true)
      {
        
      
        
        c.clearRect(0, 0, canvas.width, canvas.height)
        c.fillStyle = "forestgreen"
        c.fillRect(0, 0, canvas.width, canvas.height)
        
        
        var i = 0
        tiles.forEach(tile =>
            {
                if (tile.update() && tile.type == 1)
                {
                    
                }
                if (tile.alive == false)
                {
                  tiles.splice(i, 1)
                }
                tile.draw()
                i++
            })

        var i = 0
        enemies.forEach(enemy =>
            {
                enemy.draw()

                if (!enemy.update(allies, bullets, tiles))
                {
                    enemies.splice(i, 1)
                }
                
                if (enemy.reload == false)
                {
                    
                    if (enemy.dist <= enemy.fireDistance)
                    {
                        bullets.push(new Bullet(enemy.x , enemy.y , 1, enemy.dir, 10, 0))
                        enemy.reload = true
                    }
                    
                    
                }
                i++
                eh.update(enemy.x + CAM_X, enemy.y + CAM_Y, enemy.radius, enemy.max, enemy.health)
                eh.draw()
            })
            
        i = 0
        allies.forEach(ally => {
          
          if (enemies != "")
          {
            if (!ally.update(enemies, bullets, tiles))
            {
              allies.splice(i, 1)
            }
            if (ally.reload == false)
            {
              if (ally.dist <= ally.fireDistance)
              {
                bullets.push(new Bullet(ally.x, ally.y, 1, ally.dir, 10, 1))
                ally.reload = true
              }
            }
            
          }
          
          i++
            
          
          
          ally.draw()
          
          ah.update(ally.x + CAM_X, ally.y + CAM_Y, ally.radius, ally.max, ally.health)
          ah.draw()
        })
            
        
        var i = 0
        bullets.forEach(bullet =>
            {
                bullet.update(tiles)

                if (!bullet.draw())
                {
                    
                    bullets.splice(i, 1)
                    
                }
                i++
            })

        player.update(tiles, bullets)
        player.draw()


       
        
        
        
        
        
        
        
        if (player.kills >= 20 && wave == 1 || player.kills >= 40 && wave > 1)
        {
          if (wave == 4)
          {
            c.font = "40px Times New Roman"
            c.fillStyle = "black"
            c.fillText("Your army is low on supplies, and you can't hold of the confederacy for much longer.", 40, 200)
            c.fillText("Press 1 to Retreat or 2 to Charge the enemy", 40, 300)
            
            
            if (keys.one.pressed)
            {
              
              alert("You Lose, you were the leftmost flank of the army, and retreating meant the entire union army would be flanked by the Confederacy")
              keys.one.pressed = false
              window.location.reload()
              
            }
            if (keys.two.pressed)
            {
              
              alert("You Win, you charged the confederate division, causing them to retreat, Good Job general!")
              keys.two.pressed = false
              window.location.reload()
            }
          }
          if (f == 0)
          {
            time = 45
          }
          time = Math.round(100*time) / 100
          
          c.font = "50px Times New Roman"
          c.fillStyle = "black"
          c.fillText("Time: " + time, 200, 50)
          
          if (keys.left.pressed && keys.shift.pressed)
          {
            if (time > 0)
            {
              allies.forEach(ally =>{
              ally.x -= 1
            })
            time -= .1
            }
            
            
          }
          if (keys.right.pressed && keys.shift.pressed)
          {
            if (time > 0)
            {
               allies.forEach(ally =>
            {
              ally.x += 1
            })
            time -= .1
            }
           
          }
          if (keys.enter.pressed)
          {
            
            wave += 1
            NewWave(wave)
            player.kills = 0
            
            time = 120
          }
          if (keys.space.pressed && time >= 10)
          {
            allies.push(new Ally((mousex - CAM_X), mousey - CAM_Y, 1, 50))
            keys.space.pressed = false
            time -= 10
          }
          f++
          
        }
      }

        te = 0
    }
    

}
animate()



addEventListener('keydown', ({keyCode}) => {
    switch(keyCode)
    {
        case 87:
        //w
            keys.up.pressed = true
            break;
        case 65:
        //a
            keys.left.pressed = true
            break;
        case 83:
        //s
            keys.down.pressed = true
            break;
        case 68:
        //s
            keys.right.pressed = true
            break;
        case 38:
            keys.up.pressed = true
            break;
        case 37:
            keys.left.pressed = true
            break;
        case 40:
            keys.down.pressed = true
            break;
        case 39:
                keys.right.pressed = true
            break;
        case 69: // this is actually the e key, future me if you see this, I didn't feel like changing it from space because I am too lazy, hopefully you see this and don't spend a long time trying to figure it out
          keys.space.pressed = true
          break;
        
        case 13:
          keys.enter.pressed = true
          break;
        case 16:
            keys.shift.pressed = true;
            break;
        case 49:
          keys.one.pressed = true;
          break;
        case 50:
          keys.two.pressed = true;
          break;
    }
});

addEventListener('keyup', ({keyCode}) => {
    switch(keyCode)
    {
        case 87:
        //w
            keys.up.pressed = false
            break;
        case 65:
        //a
            keys.left.pressed = false
            break;
        case 83:
        //s
            keys.down.pressed = false
            break;
        case 68:
        //s
            keys.right.pressed = false
            break;
        case 38:
            keys.up.pressed = false
            break;
        case 37:
            keys.left.pressed = false
            break;
        case 40:
            keys.down.pressed = false
            break;
        case 39:
                keys.right.pressed = false
            break;
        case 13:
          keys.enter.pressed = false
          break;
        case 16:
            keys.shift.pressed = false;
            break;
        case 69:
          keys.space.pressed = false;
          break;
        case 49:
          keys.one.pressed = false;
          break;
        case 50:
          keys.two.pressed = false;
          break;
    }
});



var mousex = 0
var mousey = 0

document.onmousemove = function(e)
{
    mousex = e.offsetX
    mousey = e.offsetY
    
    
}


addEventListener("mousedown", doMouseDown, false)

function doMouseDown(e)
{
  if (player.kills >= 20 && wave == 1 || player.kills >= 40 && wave > 1)
  {
    
    if (time >= 5)
    {
      tiles.push(new Tile((mousex - 62 - CAM_X) / 64, 19, -3))
      time -= 5
    }
    
  }
  
  
}