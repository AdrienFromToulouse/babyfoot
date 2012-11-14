#!/bin/sh

mongo babyfootDb --eval 'db.dropDatabase();'
mongo toto --eval 'db.dropDatabase();'