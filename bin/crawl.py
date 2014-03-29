#!/usr/bin/python
import time
import sys
from urllib import urlopen


def find_between( s, first, last ):
    try:
        start = s.index( first ) + len( first )
        end = s.index( last, start )
        return s[start:end]
    except ValueError:
        return ""

searchString = sys.argv[1]
nullChars = "#+/*&^%@ "
for var in nullChars:
    searchString = searchString.replace(var, "")

ts = str(int(time.time()))
url = "http://otter.topsy.com/searchcount.js?callback=jQuery18303948229632806033_1383963981843&q=%23" + searchString + "&dynamic=1&mintime=1381378442&count_method=citation&call_timestamp=" + ts + "&apikey=09C43A9B270A470B8EB8F2946A9369F3&_=1383963983199"
html = urlopen(url).read()

found = find_between(html, "\"d\":", "}")
found = found[found.rfind(" "):]
print int(found), 
sys.stdout.write('')
