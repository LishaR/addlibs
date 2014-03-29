#!/usr/bin/python
import time
import sys
import json
from StringIO import StringIO
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
url = "http://otter.topsy.com/searchhistogram.js?callback=jQuery18305000729341991246_1383972190643&q=%23" + searchString + "&slice=86400&period=30&count_method=citation&call_timestamp=" + ts + "&apikey=09C43A9B270A470B8EB8F2946A9369F3&_=1383972192716"
html = urlopen(url).read()


found = find_between(html, "\"histogram\": [", "]")
array = found.split(", ")
text = "["
for var in array:
    text += "\"" + var + "\", "
text = text[0:len(text)-2]
text += "]"
print text
