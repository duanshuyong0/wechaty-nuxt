import { Contact, Room, log } from 'wechaty'
import { Member as MemberModel, Bot } from '../../models'
import { Type } from '../../models/wechat/Contact'
import { saveOrGetContact } from './saveOrGetContact'
export async function saveRoomMember(bot: Bot, roomId: number, room: Room) {
  const owner: Contact | null = await room.owner()
  if (!owner) throw new Error("Can't get room owner!")

  const contacts: Contact[] | null = await room.memberAll()
  log.silly('RoomInitAllMembers', `${room}`)
  for (const contact of contacts) {
    // 群主的from为4 RoomOwner，不应该为3 RoomMemeber
    if (owner === contact) return
    const contactInstance = await saveOrGetContact(
      bot,
      contact,
      Type.RoomMemeber
    )
    // roomInstance.addMembers(contactInstance)
    await MemberModel.findOrCreate({
      where: {
        roomId,
        contactId: contactInstance.id
      }
    })
  }
}
