#!/bin/sh

#http://livegameup.asiance-dev.com:3300/login?b=1&p=3

for i in `seq 30 ${1}` 
do


    curl -IL "http://livegameup.asiance-dev.com:3300/login?b=1&p=3"
    
    echo "Welcome $i times"
done