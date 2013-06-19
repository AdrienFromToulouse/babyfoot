#!/bin/sh


#
# To test if there is a kind of timeout sometimes...
# That is check if the pending "bug" appears.
#

response=$(curl --write-out %{http_code} --silent --output /dev/null  http://livegameup.asiance-dev.com:3300/)

echo "$(date "+%m%d%Y %T") : $response" >> /tmp/cron_testing_res.log 2>&1

