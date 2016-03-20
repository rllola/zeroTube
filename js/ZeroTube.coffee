class ZeroTube extends ZeroFrame

	client: new WebTorrent()

	log: (args...) ->
		console.log "[ZeroTube]", args...

	init: ->
		@log "inited!"
		if WebTorrent.WEBRTC_SUPPORT
			@log "Webrtc supported !"
		else
	  	@log "not supported"

	# Wrapper websocket connection ready
	onOpenWebsocket: (e) =>
		@cmd "serverInfo", {}, (serverInfo) =>
			@log "mysite serverInfo response", serverInfo
		@cmd "siteInfo", {}, (siteInfo) =>
			@log "mysite siteInfo response", siteInfo

	selectUser: () =>
		@cmd "certSelect", [["zeroid.bit"]], (answer) =>
			@log answer
			return false

	submit: (e) =>
		query = document.getElementById("query").value
		@cmd "dbQuery", ["SELECT * FROM video WHERE title LIKE '%"+query+"%'"], (videos) =>
			for video, i in videos
	  		document.getElementById("result").innerHTML = "<article>
					<h1>"+video.title+"</h1>
					<small>Added on the "+new Date(video.added * 1000)+"</small>
					<p>"+video.description+"</p>
					<a href='#"+video.magnet+"' onclick='ZeroTube.watch(this, event);'>Watch</a>
				</article>"
				@log video
		e.preventDefault()

	watch: (element, event) =>
		torrentId = element.hash.substr(1, element.hash.len)
		@log torrentId
		@client.add torrentId, (torrent) =>
			@log torrent
			torrent.on 'download', (chunkSize) =>
			  @log 'chunk size:' + chunkSize
			  @log 'total downloaded: ' + torrent.downloaded
			  @log 'download speed: ' + torrent.downloadSpeed
			  @log 'progress: ' + torrent.progress
			  @log '======'
		  file = torrent.files[0]
			file.appendTo 'header'
		event.preventDefault()


window.ZeroTube = new ZeroTube()
