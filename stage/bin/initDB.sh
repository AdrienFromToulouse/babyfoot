#!/bin/sh

mongo asiance_babyfoot --eval 'db.games.remove({})'
mongo asiance_babyfoot --eval 'db.players.remove({})'


#mongo asiance_babyfoot --eval 'db.guests.save({created_at: new Date().getTime(),started_at : "spare" ,stopped_at : "spare",duration :"spare" ,score_team1 : "spare",score_team2 :"spare" ,broadOnChan :"spare" })'
