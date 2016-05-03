(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.liveChat = factory();
    }
}(this, function () {

    /*!
        DDP.js v0.6.0
        License: MIT
        https://github.com/mondora/ddp.js/
    */
    var liveChatDDPClient=function(){var t=function(){var t=0;return function(){return(t++).toString()}}(),e='{"server_id":"0"}',n=10,o=300,s=1e4,i=["added","changed","connected","error","failed","nosub","ready","removed","result","updated","ping","pong"],r="1",c=function(t){this._endpoint=t.endpoint,this._SocketConstructor=t.SocketConstructor,this._autoreconnect=!t.do_not_autoreconnect,this._ping_interval=t._ping_interval||s,this._socketInterceptFunction=t.socketInterceptFunction,this._onReadyCallbacks={},this._onStopCallbacks={},this._onErrorCallbacks={},this._onResultCallbacks={},this._onUpdatedCallbacks={},this._events={},this._queue=[],this.readyState=-1,this._reconnect_count=0,this._reconnect_incremental_timer=0,t.do_not_autoconnect||this.connect()};return c.prototype.constructor=c,c.prototype.connect=function(){this.readyState=0,this._socket=new this._SocketConstructor(this._endpoint),this._socket.onopen=this._on_socket_open.bind(this),this._socket.onmessage=this._on_socket_message.bind(this),this._socket.onerror=this._on_socket_error.bind(this),this._socket.onclose=this._on_socket_close.bind(this)},c.prototype.method=function(e,n,o,s){var i=t();return this._onResultCallbacks[i]=o,this._onUpdatedCallbacks[i]=s,this._send({msg:"method",id:i,method:e,params:n}),i},c.prototype.sub=function(e,n,o,s,i){var r=t();return this._onReadyCallbacks[r]=o,this._onStopCallbacks[r]=s,this._onErrorCallbacks[r]=i,this._send({msg:"sub",id:r,name:e,params:n}),r},c.prototype.unsub=function(t){return this._send({msg:"unsub",id:t}),t},c.prototype.on=function(t,e){this._events[t]=this._events[t]||[],this._events[t].push(e)},c.prototype.off=function(t,e){if(this._events[t]){var n=this._events[t].indexOf(e);-1!==n&&this._events[t].splice(n,1)}},c.prototype._emit=function(t){if(this._events[t]){var e=arguments,n=this;this._events[t].forEach(function(t){t.apply(n,Array.prototype.slice.call(e,1))})}},c.prototype._send=function(t){if(1!==this.readyState&&"connect"!==t.msg)return void this._queue.push(t);var e;e="undefined"==typeof EJSON?JSON.stringify(t):EJSON.stringify(t),this._socketInterceptFunction&&this._socketInterceptFunction({type:"socket_message_sent",message:e,timestamp:Date.now()}),this._socket.send(e)},c.prototype._try_reconnect=function(){this._reconnect_count<n?(setTimeout(this.connect.bind(this),this._reconnect_incremental_timer),this._reconnect_count+=1,this._reconnect_incremental_timer+=o*this._reconnect_count):setTimeout(this.connect.bind(this),this._reconnect_incremental_timer)},c.prototype._on_result=function(t){if(this._onResultCallbacks[t.id])this._onResultCallbacks[t.id](t.error,t.result),delete this._onResultCallbacks[t.id],t.error&&delete this._onUpdatedCallbacks[t.id];else if(t.error)throw delete this._onUpdatedCallbacks[t.id],t.error.message},c.prototype._on_updated=function(t){var e=this;t.methods.forEach(function(t){e._onUpdatedCallbacks[t]&&(e._onUpdatedCallbacks[t](),delete e._onUpdatedCallbacks[t])})},c.prototype._on_nosub=function(t){if(t.error){if(!this._onErrorCallbacks[t.id])throw delete this._onReadyCallbacks[t.id],delete this._onStopCallbacks[t.id],new Error(t.error);return this._onErrorCallbacks[t.id](t.error),delete this._onReadyCallbacks[t.id],delete this._onStopCallbacks[t.id],void delete this._onErrorCallbacks[t.id]}this._onStopCallbacks[t.id]&&this._onStopCallbacks[t.id](),delete this._onReadyCallbacks[t.id],delete this._onStopCallbacks[t.id],delete this._onErrorCallbacks[t.id]},c.prototype._on_ready=function(t){var e=this;t.subs.forEach(function(t){e._onReadyCallbacks[t]&&(e._onReadyCallbacks[t](),delete e._onReadyCallbacks[t])})},c.prototype._on_error=function(t){this._emit("error",t)},c.prototype._on_connected=function(e){var n=this,o=0===n._reconnect_count,s=o?"connected":"reconnected";n.readyState=1,n._reconnect_count=0,n._reconnect_incremental_timer=0;for(var i=n._queue.length,r=0;i>r;r++)n._send(n._queue.shift());n._emit(s,e),n._ping_interval_handle=setInterval(function(){var e=t();n._send({msg:"ping",id:e})},n._ping_interval)},c.prototype._on_failed=function(t){this.readyState=4,this._emit("failed",t)},c.prototype._on_added=function(t){this._emit("added",t)},c.prototype._on_removed=function(t){this._emit("removed",t)},c.prototype._on_changed=function(t){this._emit("changed",t)},c.prototype._on_ping=function(t){this._send({msg:"pong",id:t.id})},c.prototype._on_pong=function(t){},c.prototype._on_socket_close=function(){this._socketInterceptFunction&&this._socketInterceptFunction({type:"socket_close",timestamp:Date.now()}),clearInterval(this._ping_interval_handle),this.readyState=4,this._emit("socket_close"),this._autoreconnect&&this._try_reconnect()},c.prototype._on_socket_error=function(t){this._socketInterceptFunction&&this._socketInterceptFunction({type:"socket_error",error:JSON.stringify(t),timestamp:Date.now()}),clearInterval(this._ping_interval_handle),this.readyState=4,this._emit("socket_error",t)},c.prototype._on_socket_open=function(){this._socketInterceptFunction&&this._socketInterceptFunction({type:"socket_open",timestamp:Date.now()}),this._send({msg:"connect",version:r,support:[r]})},c.prototype._on_socket_message=function(t){this._socketInterceptFunction&&this._socketInterceptFunction({type:"socket_message_received",message:t.data,timestamp:Date.now()});var n;if(t.data!==e){try{if(n="undefined"==typeof EJSON?JSON.parse(t.data):EJSON.parse(t.data),-1===i.indexOf(n.msg))throw new Error}catch(o){return console.warn("Non DDP message received:"),void console.warn(t.data)}this["_on_"+n.msg](n)}},c}();

    /*!
        Based on Meteor Random (Random.id() only)
        License: MIT
        https://github.com/meteor/meteor/blob/devel/packages/random/random.js
    */
    var liveChatRandom=function(){function n(){return new r(r.Type.ALEA,{seeds:[new Date,i,d,u,Math.random()]})}var e=function(){function n(){var n=4022871197,e=function(e){e=e.toString();for(var t=0;t<e.length;t++){n+=e.charCodeAt(t);var r=.02519603282416938*n;n=r>>>0,r-=n,r*=n,n=r>>>0,r-=n,n+=4294967296*r}return 2.3283064365386963e-10*(n>>>0)};return e.version="Mash 0.9",e}return function(e){var t=0,r=0,o=0,i=1;0==e.length&&(e=[+new Date]);var d=n();t=d(" "),r=d(" "),o=d(" ");for(var u=0;u<e.length;u++)t-=d(e[u]),0>t&&(t+=1),r-=d(e[u]),0>r&&(r+=1),o-=d(e[u]),0>o&&(o+=1);d=null;var a=function(){var n=2091639*t+2.3283064365386963e-10*i;return t=r,r=o,o=n-(i=0|n)};return a.uint32=function(){return 4294967296*a()},a.fract53=function(){return a()+1.1102230246251565e-16*(2097152*a()|0)},a.version="Alea 0.9",a.args=e,a}(Array.prototype.slice.call(arguments))},t="23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz",r=function(n,t){var o=this;if(o.type=n,!r.Type[n])throw new Error("Unknown random generator type: "+n);if(n===r.Type.ALEA){if(!t.seeds)throw new Error("No seeds were provided for Alea PRNG");o.alea=e.apply(null,t.seeds)}};r.Type={BROWSER_CRYPTO:"BROWSER_CRYPTO",ALEA:"ALEA"},r.prototype.fraction=function(){var n=this;if(n.type===r.Type.ALEA)return n.alea();if(n.type===r.Type.BROWSER_CRYPTO){var e=new Uint32Array(1);return window.crypto.getRandomValues(e),2.3283064365386963e-10*e[0]}throw new Error("Unknown random generator type: "+n.type)},r.prototype.hexString=function(n){return this._randomString(n,"0123456789abcdef")},r.prototype.choice=function(n){var e=Math.floor(this.fraction()*n.length);return"string"==typeof n?n.substr(e,1):n[e]},r.prototype._randomString=function(n,e){for(var t=this,r=[],o=0;n>o;o++)r[o]=t.choice(e);return r.join("")},r.prototype.id=function(n){var e=this;return void 0===n&&(n=17),e._randomString(n,t)};var o,i="undefined"!=typeof window&&window.innerHeight||"undefined"!=typeof document&&document.documentElement&&document.documentElement.clientHeight||"undefined"!=typeof document&&document.body&&document.body.clientHeight||1,d="undefined"!=typeof window&&window.innerWidth||"undefined"!=typeof document&&document.documentElement&&document.documentElement.clientWidth||"undefined"!=typeof document&&document.body&&document.body.clientWidth||1,u="undefined"!=typeof navigator&&navigator.userAgent||"";return o="undefined"!=typeof window&&window.crypto&&window.crypto.getRandomValues?new r(r.Type.BROWSER_CRYPTO):n()}();

    return {
        // initialize the client chat box app
        init: function (clientAppId) {

            // helper function - creates DOM elem with class and id name
            var createDOMElem = function (tag, name) {
                var elem = document.createElement(tag);
                elem.id = name;
                elem.classList.add(name);
                return elem;
            };

            // create main chat box container
            var liveChatBoxCreate = function () {
                var box = createDOMElem('div', 'live-chat-box');
                var boxHeader = createDOMElem('div', 'live-chat-box-header');
                var messagesList = createDOMElem('div', 'live-chat-messages');
                var submitInput = createDOMElem('textarea', 'live-chat-submit-input');
                submitInput.rows = '1';
                submitInput.placeholder = 'Send message...';
                boxHeader.innerHTML = '<div class="live-chat-header-title"> Live Chat Demo </div>';
                box.appendChild(boxHeader);
                box.appendChild(messagesList);
                box.appendChild(submitInput);
                document.body.appendChild(box);
            };

            // group chat box elements
            var liveChatBox = function () {
                var msgContainer = document.getElementById('live-chat-messages');
                var submitInput = document.getElementById('live-chat-submit-input');
                var boxHeader = document.getElementById('live-chat-box-header');
                return {
                    container: msgContainer,
                    submitInput: submitInput,
                    boxHeader: boxHeader
                }
            };

            // create chat box message item
            var liveChatBoxMessage = function (fields) {
                var node = document.createElement('div');
                var messageNode = document.createElement('div');
                var avatar;
                node.classList.add('live-chat-message-item');

                messageNode.classList.add('message');
                messageNode.appendChild(document.createTextNode(fields.msg));
                node.appendChild(messageNode);

                return node;
            };

            // ddp init
            var ddp = new liveChatDDPClient({
                endpoint: 'ws://localhost:3000/websocket',
                SocketConstructor: WebSocket
            });
            // random userSessionId generator
            var userSessionId = liveChatRandom.id();
            var submitMsg = function (e) {
                var input = liveChatBox().submitInput;
                var key = e.keyCode || e.which;
                if (key === 13 && !e.shiftKey) {
                    e.preventDefault();
                    if (input.value.trim() !== '') {
                        ddp.method('addChatMessage', [input.value, clientAppId, userSessionId]);
                        input.value = '';
                    }
                }
                return false;
            };

            // ddp 'is connected' callback
            ddp.on('connected', function () {
                liveChatBoxCreate();
                // subscribe to the 'Chat.messagesList' publication
                ddp.sub('Chat.messagesList', [clientAppId, userSessionId]);
                // listen for changes - added new messages
                ddp.on('added', function (data) {
                    if (data.collection === 'chat') {
                        liveChatBox().container.appendChild(liveChatBoxMessage(data.fields));
                        var messages = document.querySelector('.live-chat-messages');
                    }
                });
                liveChatBox().submitInput.addEventListener('keydown', submitMsg, false);
            });

            ddp.on('socket_close', function () {
                console.log('Disconnected');
                liveChatBox().submitInput.removeEventListener('keydown', submitMsg, false);
            });
        }

    }
}));

