/** 친구 <-> 채팅방 탭 전환 애니메이션 */
let mode = 0; // 0: 채팅방 탭, 1: 친구 탭 선택 중
let nowRoomId = ''; // 현재 채팅방 ID
function modeSwap(md) {
    // 탭 강조, 목록 출력
    let select_css = {
        'color': 'white',
        'font-weight': 'bold'};

    if (!md) {
        $('button#friends').css(select_css);
        $('button#rooms').removeAttr('style');
    } else {
        $('button#rooms').css(select_css);
        $('button#friends').removeAttr('style');
    }
    loadList(!md);

    if(addButtonStatus)
        addList();
    
    // 밑줄 애니메이션
    let left = 32.5 + (md * 172.5);
    $('#underline').animate({
        left: left
    }, 200);

    mode = !md;
}

function loadList(mode) {
    if(mode) {
        socket.emit('friendChatList', (friends) => {
            $('div#list').empty();
            for(let i of friends.LIST) {
                printFriend(i, (i.ROOM_ID === friends.ACCENT));
                nowRoomId = friends.ACCENT;
            }
        });
    } else {
        socket.emit('roomChatList', (room) => {
            $('div#list').empty();
            for(let i of room.LIST) {
                printRoom(i, (i.ROOM_ID === room.ACCENT));
                nowRoomId = room.ACCENT;
            }
        });
    }
}

let addButtonStatus = 0;
const addList_p = $('#addList > p');
const addList_input = $('#addList > input');
const addList_btn = $('#addList > button');
/** 애니메이션: 친구 추가 버튼 클릭 시 */
function addList() {
    if(mode) { // 친구 탭 선택 중
        if (addButtonStatus) {
            addList_input.animate({
                opacity: 0,
                'margin-left': '260px',
                width: '0px'
            }, 500);
            addList_btn.animate({
                opacity: 0.7,
                rotate: '0deg'
            }, 500);
            addList_input.css('outline', '1px solid white');
            addList_p.css('opacity', '0');
            addList_input.val('');
        } else {
            addList_input.animate({
                opacity: 1,
                margin: 0,
                width: '260px'
            }, 500);
            addList_btn.animate({
                opacity: 1,
                rotate: '45deg'
            }, 500);
        }
        addButtonStatus = !addButtonStatus;
    } else { // 채팅방 탭 선택 중
        loadAlert(createRoomApp);
    }
}

addList_input.keyup(() => {
    addList_input.css('outline', '1px solid white');
    addList_p.css('opacity', '0');
});