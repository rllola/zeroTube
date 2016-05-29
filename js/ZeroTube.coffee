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
				document.getElementById("login").style.display = 'none'
			@siteInfo = siteInfo	# Save site info data to allow access it later
		@cmd "dbQuery", ["SELECT * FROM video ORDER BY date_added DESC LIMIT 5"], (videos) =>
			$("#result").html("<h2>Latest Videos Added</h2><br/>")
			for video, i in videos
				@client.add video.magnet, (torrent) =>
					torrent.pause()
					$("#"+torrent.infoHash).html(torrent.numPeers+" peers")
					torrent.on 'wire', (wire) =>
						$("#"+torrent.infoHash).html(torrent.numPeers+" peers")
				$("#result").html($("#result").html() + "<article>
					<a href='#"+video.magnet+"' onclick='ZeroTube.watch(this, event);'><h3>"+video.title+" <span id='"+video.video_id+"' class='label label-pill label-info'>0 Peers</span></h3></a>
					<small>Added "+moment(video.date_added).fromNow()+"</small>
					<p>"+video.description+"</p>
				</article>")

	selectUser: () =>
		@cmd "certSelect", [["zeroid.bit"]]
		return false

	route: (cmd, message) ->
		if cmd == "setSiteInfo"
			if message.params.cert_user_id
				document.getElementById("select_user").innerHTML = message.params.cert_user_id
				document.getElementById("add").style.display = 'block'
				document.getElementById("login").style.display = 'none'
			else
				document.getElementById("select_user").innerHTML = "Select user"
				document.getElementById("add").style.display = 'none'
				document.getElementById("login").style.display = 'block'
			@siteInfo = message.params	# Save site info data to allow access it later

	submit: (e) =>
		query = document.getElementById("query").value
		@cmd "dbQuery", ["SELECT * FROM video WHERE title LIKE '%"+query+"%'"], (videos) =>
			@log videos
			if videos.length is 0
				$("#result").html("<p>No Videos found</p>")
			else
				$("#result").html("")
				for video, i in videos
					@client.add video.magnet, (torrent) =>
						torrent.pause()
						$("#"+torrent.infoHash).html(torrent.numPeers+" peers")
						torrent.on 'wire', (wire) =>
							$("#"+torrent.infoHash).html(torrent.numPeers+" peers")
					$("#result").html($("#result").html() + "<article>
						<a href='#"+video.magnet+"' onclick='ZeroTube.watch(this, event);'><h3>"+video.title+" <span id='"+video.video_id+"' class='label label-pill label-info'> 0 peers</span></h3></a>
						<small>Added "+moment(video.date_added).fromNow()+"</small>
						<p>"+video.description+"</p>
					</article>")
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
			$("#video").show();
			file.renderTo '#video'
		event.preventDefault()

	addVideo: (event) =>
		event.preventDefault()
		if document.getElementById("videoFile").files.length > 0
			@log "We have a file to seed"
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
						"video_id": torrent.infoHash,
						"title": document.getElementById("videoTitle").value,
						"description": document.getElementById("videoDescription").value,
						"magnet": torrent.magnetURI,
						"date_added": (+new Date)
					})
					# Encode data array to utf8 json text
					json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')))

					# Write file to disk
					@cmd "fileWrite", [inner_path, btoa(json_raw)], (res) =>
						if res == "ok"
							# Publish the file to other users
							@cmd "sitePublish", {"inner_path": inner_path}, (res) =>
								document.getElementById("videoFile").files = []	# Reset the message input
						else
							@cmd "wrapperNotification", ["error", "File write error: #{res}"]
		else
			@log "Are you meesing with me ? This empty dude !"
		event.preventDefault()

window.ZeroTube = new ZeroTube()
