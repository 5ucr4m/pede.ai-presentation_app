export interface IUser {
    selected: boolean;
    userID: string;
    username: string;
    value: number;
}

interface addUserProps {
  user: {
    userID: string;
    username: string;
  },
  room: string;
}

interface selectCardProps {
  user: {
    userID: string;
    value: number | string;
  },
  room: string;
}

export class RoomControl {
  private rooms = new Map();
  private roomsStatus = new Map();

  async addUser(data: addUserProps) {
    const { user: { userID, username }, room } = data;

    const user = {
      selected: false,
      userID,
      username,
      value: 0,
    };

    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Map());
      this.roomsStatus.set(room, 'hide');
    }

    const users = this.rooms.get(room);
    users.set(userID, user);
  }

  async selectCard(data: selectCardProps) {
    const { user: { userID, value }, room } = data;

    const users = this.rooms.get(room);
    const user = users.get(userID);

    user.selected = true;
    user.value = value;
  }

  async showCards(room: string) {
    this.roomsStatus.set(room, 'show');
  }
  
  async resetGame(room: string) {
    this.roomsStatus.set(room, 'hide');
    const users = this.rooms.get(room);

    for (const [,user] of users) {
      user.selected = false;
      user.value = 0;
    }
  };

  async removeUser(userID: string, room: string) {
    const users = this.rooms.get(room);
    users.delete(userID);

    if (users.size === 0) {
      this.rooms.delete(room);
    }
  }


  async getUsers(room: string) {
    const list = [];
    const users = this.rooms.get(room);
    const isHide = this.roomsStatus.get(room) === 'hide';

    for (const [,user] of users) {

      list.push(isHide ? {
          selected: user.selected,
          userID: user.userID,
          username: user.username,
      } : user);
    }

    return list;
  }
}
