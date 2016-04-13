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
		@cmd "siteInfo", {}, (siteInfo) =>
			# Update currently selected username
			if siteInfo.cert_user_id
				document.getElementById("select_user").innerHTML = siteInfo.cert_user_id
				document.getElementById("add").style.display = 'block'
			@siteInfo = siteInfo	# Save site info data to allow access it later

	selectUser: () =>
		@cmd "certSelect", [["zeroid.bit"]]
		return false

	route: (cmd, message) ->
		if cmd == "setSiteInfo"
			if message.params.cert_user_id
				document.getElementById("select_user").innerHTML = message.params.cert_user_id
				document.getElementById("add").style.display = 'block'
			else
				document.getElementById("select_user").innerHTML = "Select user"
				document.getElementById("add").style.display = 'none'
			@siteInfo = message.params	# Save site info data to allow access it later

	submit: (e) =>
		query = document.getElementById("query").value
		@cmd "dbQuery", ["SELECT * FROM video WHERE title LIKE '%"+query+"%'"], (videos) =>
			@log videos
			if videos.length is 0
				document.getElementById("result").innerHTML = "<p>No Videos found</p>"
			else
				for video, i in videos
					document.getElementById("result").innerHTML = document.getElementById("result").innerHTML + "<article>
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

	addVideo: (event) =>
		if document.getElementById("videoFile").files.length > 0
			@log "We have a file to seed"
			@log "User info :", @siteInfo.auth_address
			if not @siteInfo.cert_user_id	# No account selected, display error
				@cmd "wrapperNotification", ["info", "Please, select your account."]
				return false

			inner_path = "data/users/#{@siteInfo.auth_address}/data.json"	# This is our data file

			torrent = @client.seed document.getElementById("videoFile").files[0], (torrent) =>
				@log 'Client is seeding:', torrent.infoHash
				# Load our current videos
				@cmd "fileGet", {"inner_path": inner_path, "required": false}, (data) =>
					if data	# Parse if already exits
						data = JSON.parse(data)
					else	# Not exits yet, use default data
						data = 	{"video": []}
					# Add the message to data
					data.video.push({
						"title": document.getElementById("videoTitle").value,
						"description": document.getElementById("videoDescription").value,
						"magnet": torrent.magnetURI,
						"date_added": (+new Date)
					})
					@log data[-1]
					# Encode data array to utf8 json text
					json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')))

					# Write file to disk
					@cmd "fileWrite", [inner_path, btoa(json_raw)], (res) =>
						if res == "ok"
							# Publish the file to other users
							@cmd "sitePublish", {"inner_path": inner_path}, (res) =>
								@log res
								document.getElementById("videoFile").files = []	# Reset the message input
						else
							@cmd "wrapperNotification", ["error", "File write error: #{res}"]
		else
			@log "Are you meesing with me ? This empty dude !"

		event.preventDefault()

window.ZeroTube = new ZeroTube()
