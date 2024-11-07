import { ChatRoomListInfo } from "../../types/chat";
import "../../styles/chatlist/ChatRoom.scss";
import { getIcon } from "../../utils/getIcon";
import { extractUserIdFromCookie } from "../../utils/extractUserIdFromCookie";
import { ReactComponent as Crown } from "../../assets/crown.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface ChatRoomProp {
  room: ChatRoomListInfo;
  onClick: () => void;
}

export default function ChatRoom({ room, onClick }: ChatRoomProp) {
  const userId = Number(extractUserIdFromCookie());
  const { unreadCounts } = useSelector((state: RootState) => state.chat);
  const unreadCount = unreadCounts[room.chatroomId];

  const formatTime = (datestring: string): string | undefined => {
    if(!datestring) return;
    const date = new Date(datestring); // 입력된 시간을 Date 객체로 변환
    const now = new Date(); // 현재 시간
    const diffTime = now.getTime() - date.getTime(); // 시간 차이 계산
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 일 단위로 변환

    if (diffDays === 0) {
      // 오늘인 경우 시간만 표시
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Seoul",
      };
      return new Intl.DateTimeFormat("ko-KR", options).format(date);
    } else if (diffDays === 1) {
      // 하루 전인 경우 '어제'로 표시
      return "어제";
    } else {
      // 이틀 이상 차이 나는 경우 "00월 00일" 형식으로 표시
      const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // UTC 기준 월
      const day = String(date.getUTCDate()).padStart(2, "0"); // UTC 기준 일
      return `${month}월 ${day}일`;
    }
  };

  return (
    <li className="chatroom-list" title={room.meetingTitle} onClick={onClick}>
      <div className="chatlist-column">
        <figure className="chatroom-icon">
          {getIcon(room.meetingCategoryName)}
        </figure>
        <div className="chatroom-info">
          <h4 className="chatroom-title">
            <div className="roomheader-icon">
              {userId === room.meetingHeader ? <Crown /> : null}
            </div>
            <div className="room-title">{room.meetingTitle}</div>
            <div className="capacity">
              <i className="xi-group"></i>
              <span className="room-capacity">{room.capacity}</span>
            </div>
          </h4>
          <div className="chatroom-lastmsg">{" " + room.lastMessage}</div>
        </div>
      </div>
      <div className="chatlist-column">
        <div className="lastmsg-time">
          {formatTime(room.lastMessageCreatedAt)}
        </div>
        <div>
          {unreadCount > 0 && (
            <div className="unread-badge">{" " + unreadCount}</div>
          )}
        </div>
      </div>
    </li>
  );
}
