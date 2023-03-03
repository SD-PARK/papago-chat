const socket = io('/chat');

// 세팅
socket.emit('login', (info) => {
    $('div#myProfile > p#myName').text(info.NAME);
    $('div#myProfile > p#tag').text(info.NAME_TAG);
});


/////////////// 친구 목록 관련 ///////////////

/** 친구 목록 출력 */
function printFriend(info, accent) {
    $('div#list').append(`
        <div class="friendCol" onclick="location.href='/main/@fr/${info.ROOM_ID}'">
            <img src="/client/img/neko1.png" class="profile">
            <img src="/client/img/flag/ko.png" class="flag">
            <p>${info.NAME}</p>
            <button onclick="deleteFriend('${info.ROOM_ID}')"></button>
        </div>
    `);
    if(accent) {
        $('div#title').text(info.NAME);
        $('div#list > div.friendCol').last().addClass('accent');
    }
}

/** 친구 검색 */
function searchFriend() {
    let val = addList_input.val();
    let searchInfo = {
        NAME: val.slice(0, -5),
        TAG: val.slice(-5)
    }
    socket.emit('addFriend', (searchInfo), (callback) => {
        if (callback == -1) {
            addList_input.css('outline','1px solid red');
            addList_p.text('이미 친구로 등록된 사용자예요!');
            addList_p.css('opacity', '1');
        } else if (callback) {
            addList_input.val('');
            mode = 0;
            modeSwap();
        } else {
            addList_input.css('outline','1px solid red');
            addList_p.text('이름과 태그가 정확한지 다시 한 번 확인해주세요.');
            addList_p.css('opacity', '1');
        }
    });
}

function deleteFriend(roomId) {
    socket.emit('deleteFriend', (roomId), (callback) => {
        mode = 0;
        modeSwap();
    });
}

/////////////// 채팅 관련 ///////////////

/** 메세지 송신 */
function sendChat() {
    let data = {
        MSG: $('input#send').val(),
        TIME: new Date()
    };
    $('input#send').val('');
    socket.emit('sendMessage', (data));
}

/** 메세지 수신 */
socket.on('msgReceive', (msgInfo) => {
    msgPrint(msgInfo);
});

/** 과거 메세지 출력 */
socket.on('chatLogs', (logs) => {
    console.log(logs);
    for(let log of logs) {
        msgPrint(log);
    }
});

/** 메세지 출력 관련 함수 */
let beforeInfo;
function msgPrint(info) {
    if(beforeInfo && (beforeInfo.NAME === info.NAME)) {
        let p = $('div#messages > div.message:nth-last-child(1) > p');
        p.text(beforeInfo.CHAT + '\n' + info.CHAT);
        beforeInfo.CHAT = p.text();
        p.html(p.html().replace(/\n/g, '<br/>'));
    } else {
        let time = new Intl.DateTimeFormat('ko', {dateStyle:'medium', timeStyle: 'short'}).format(new Date(info.SEND_TIME));
        $('div#messages').append(`
            <div class="message">
                <img src="/client/img/neko1.png" class="profile">
                <span class="name">${info.NAME}<span class="time">${time}</span></span>
                <p>${info.CHAT}</p>
            </div>`);
        beforeInfo = info;
    }
    
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
}