class Home extends Class

  log: (args...) ->
  		console.log "[ZeroTube - Home]", args...

  init: ->
    @log "Inititiation started !"

  show: ->
    @log "Render home page"

window.Home = new Home()
