class HowTo extends Class

  log: (args...) ->
  		console.log "[ZeroTube - HowTo]", args...

  init: ->
    @log "Inititiation started !"

window.HowTo = new HowTo()
