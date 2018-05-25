Module.register("MMM-volumio-playing", {

    defaults: {
        maxRows: 10,
        fadePoint: 0.5,
        url: 'localhost',
    },
    
    playerState: {
        connected: false,
        state: 'pause',
        volume: 100,
        repeat: false,
        random: false,
        title:'',
        artist:'',
        album: '',
        duration:'',
        elapsed:''
    },

    wrapper: null,
    playerTime:null,
    playerBar: null,

    playerTimer: null,
    
    getStyles: function () {
        return ['font-awesome.css', 'MMM-volumio-playing.css'];
    },

    getScripts: function () {
        return ['socket.io/socket.io.js']
    },

    start: function () {
        var socket = io(this.config.hostname);
        var self=this;
        socket.on('pushState',function(message){
            self.playerState = {
                connected:message.uri!='',
                state:    message.status,
                title:    message.title,
                artist:   message.artist,
                album:    message.album,
                duration: message.duration,
                started:  Date.now() - message.seek/1
            }
            self.updateContent();
            self.updatePlayerTimer();
        })
        socket.on('connect',function(){
            socket.emit('getState','');
            self.updateContent();
        })
        socket.on('disconnect',function(){
            self.playerState.connected = false;
            self.updateContent();
        })
    },

    makeDiv: function(children,classes){
        var div = document.createElement('div');
        if(children) for(c of children) div.appendChild(c);
        if(classes)  div.className=classes;
        return div;
    },
    makeIcon: function(symbol,classes){
        var icon = document.createElement('i');
        icon.className = 'icon ' + symbol;
        if(classes) icon.className+=' '+classes;
        return icon;
    },
    
    getDuration: function(seconds) {
        var minutes = Math.floor(seconds / 60);
        var seconds = Math.floor(seconds - minutes * 60);
        if (seconds.toString().length < 2) 
            seconds = '0' + seconds;
        return ''+minutes+':'+seconds;
    },

    updatePlayer: function(){
        var elapsed = (Date.now() - this.playerState.started)/1000;
        var duration = this.playerState.duration;
        this.playerTime.innerHTML = this.getDuration(elapsed) + ' / ' + this.getDuration(duration);
        this.playerBar.value = elapsed;
        this.playerBar.max = duration;
    },

    getPlayingContent: function(playerState) {
        this.playerBar = document.createElement('progress');
        this.playerBar.className = 'player';
        this.playerTime = document.createElement('span');
        this.updatePlayer();
    
        var playerIcon = playerState.state=='play'? 'fa fa-play' : 'fa fa-pause';
        return this.makeDiv([
            this.makeDiv([this.makeIcon('fa fa-music'),  document.createTextNode(playerState.title)  ], 'infoText small bright'),
            this.makeDiv([this.makeIcon('fa fa-user'),   document.createTextNode(playerState.artist) ], 'infoText small bright'),
            this.makeDiv([this.makeIcon('fa fa-folder'), document.createTextNode(playerState.album)  ], 'infoText small'),
            this.makeDiv([this.makeIcon(playerIcon),     this.playerTime                             ], 'infoText small'),
            this.playerBar   
        ]);
    },

    getDisconnectedContent: function(){
        return this.makeDiv([this.makeIcon('fa fa-music'),  document.createTextNode("-")],'infoText small');
    },

    startPlayerTimer: function(){
        if(this.playerTimer)return;
        this.playerTimer = setInterval(this.updatePlayer.bind(this),500);
    },
    stopPlayerTimer: function(){
        clearInterval(this.playerTimer);
        this.playerTimer=null;
    },
    updatePlayerTimer: function(){
        if(this.playerState.state=='play')
            this.startPlayerTimer();
        else
            this.stopPlayerTimer();
    },

    updateContent: function() {
        if(this.wrapper.firstChild)
            this.wrapper.removeChild(this.wrapper.firstChild);
        if(this.playerState.connected){
            this.wrapper.appendChild(this.getPlayingContent(this.playerState));
            this.wrapper.className="wrapper connected";
        }else{
            this.wrapper.appendChild(this.getDisconnectedContent());
            this.wrapper.className="wrapper disconnected";
        }
    },

    // Override dom generator.
    getDom: function () {
        if(!this.wrapper)
            this.wrapper = document.createElement('div');
        this.updateContent();
        return this.wrapper;
    }
});