#!/bin/sh

# This script init a new event session by removing the last games collection if any and insert
# a new one. That way the next first logged players will be associated to that game id.
# Then a new game document will be created following a Stop.

mongo asiance_babyfoot --eval 'db.games.remove({})'
mongo asiance_babyfoot --eval 'db.players.remove({})'
#mongo babyfootDb --eval 'db.games.save({created_at: new Date().getTime(),started_at : "spare" ,stopped_at : "spare",duration :"spare" ,score_team1 : "spare",score_team2 :"spare" ,broadOnChan :"spare" })'


