#!/bin/sh

# mongo asiance_babyfoot --eval 'db.games.remove({})'
# mongo asiance_babyfoot --eval 'db.players.remove({})'

mongo asiance_babyfoot --eval 'db.guests.remove()'

mongo asiance_babyfoot --eval 'db.guests.save({
personal: {
    fb_id: "176063032413299",
    name: "Leo Messi",
    link: "https://www.facebook.com/LeoMessi",
    picture: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/c23.23.284.284/s160x160/68110_534063749946557_2083332085_n.jpg",
  },
  ready: true
})'

mongo asiance_babyfoot --eval 'db.guests.save({
personal: {
    name: "Zinedine Zidane",
    link: "https://www.facebook.com/pages/Zinedine-Zidane-Official/474575265941412?ref=br_tf",
    picture: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/c72.39.483.483/s160x160/530155_474576132607992_1052054528_n.jpg",
  },
  ready: true
})'

mongo asiance_babyfoot --eval 'db.guests.save({
personal: {
    name: "Gianluigi Buffon",
    link: "https://www.facebook.com/GianluigiBuffon",
    picture: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/c125.27.337.337/s160x160/1045021_357926844330627_333840176_n.jpg",
  },
  ready: true
})'

mongo asiance_babyfoot --eval 'db.guests.save({
personal: {
    name: "Iker Casillas",
    link: "https://www.facebook.com/Iker.Casillas",
    picture: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc3/c10.10.160.160/970546_598371573526405_780160802_a.jpg",
  },
  ready: true
})'

mongo asiance_babyfoot --eval 'db.guests.save({
personal: {
    name: "Gennaro Gattuso",
    link: "https://www.facebook.com/GennaroIvanGattuso8",
    picture: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash4/c72.19.287.287/s160x160/1004762_10152064135664012_72565020_n.jpg",
  },
  ready: true
})'