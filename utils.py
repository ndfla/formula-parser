import time

from flask import url_for


# 元のurl_forと同じ引数
def my_url_for(endpoint, **values):
    url = url_for(endpoint, **values) 
    return url + '?ts={}'.format(int(time.time()))
