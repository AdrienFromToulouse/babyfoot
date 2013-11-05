#! usr/bin/python

import subprocess
import os
import signal
import sys


ARGLIMIT = 2
MINPROC = 3

if len(sys.argv) > ARGLIMIT:
    sys.exit()

# for arg in sys.argv:
print sys.argv[1]

if sys.argv[1] == "start":

    process = subprocess.Popen("ps aux | grep worldcupbaby",
                               shell=True,
                               stdout=subprocess.PIPE,
                               )
    mylist = process.communicate()[0].split('\n')

    # grep the grep proc itself also... that's why 5
    if len(mylist) == MINPROC:
        process = subprocess.Popen("forever app/worldcupbaby.js > /tmp/worldcupbaby.log &",
                                   shell=True,
                                   stdout=subprocess.PIPE,
                                   )
    else:
        print "already started"


if sys.argv[1] == "stop":
    process = subprocess.Popen("ps aux | grep worldcupbaby",
                               shell=True,
                               stdout=subprocess.PIPE,
                               )

    mylist = process.communicate()[0].split('\n')
    nfields = len(mylist[0].split()) - 1
    
    for row in mylist[0:2]:
        pid = row.split(None, nfields)
        os.kill(int(pid[1]), signal.SIGTERM)
else:
    sys.exit()
    
