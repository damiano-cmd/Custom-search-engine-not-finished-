from bs4 import BeautifulSoup as BS
import requests
from pprint import pprint
import os
import pymongo
import json

cluster = pymongo.MongoClient("mongodb://localhost:27017/test")
db = cluster["test"]
dbc = db['sites']
data = {}

try:
    print('read the file')
    with open('./data.json', 'r') as f:
        data = json.load(f)
except:
    print('no file, new file')
    with open('data.json', 'w+') as f:
        f.write('{}')

class Spider:
    
    def __init__(self, start=[]):
        self.list = start
        self.parselist = []

    def run(self, types="scrape"):
        if types == "scrape":
            links = []
            for i in self.list:
                res = dbc.count_documents({'link': i})
                if res < 1:
                    data = {
                        'seoq': 0,
                        'seo': {
                            'description': '',
                            'keywords': [],
                            'author': ''
                        },
                        'title': '',
                        'hs': [],
                        'link': i
                    }

                    html = requests.get(i).text
                    bshtml = BS(html, 'html.parser')

                    a = bshtml.findAll('a', href=True)
                    for e in a:
                        if e['href']:
                            if ('gay' not in e['href']) and ('shemale' not in e['href']):
                                if (e['href'][0] == '/') or (e['href'][0] == 'h'):
                                    link = ''
                                    if e['href'][0] == '/':
                                        link = i.split('/')
                                        link = link[0] + '//' + link[2] + e['href']
                                    else:
                                        link = e['href']
                                    
                                    links.append(link)
                    
                    meta = bshtml.findAll('meta')
                    for e in meta:
                        if 'name' in e:
                            if e['name'] == 'description':
                                data['seoq'] += 1
                                data['description'] = e['content']
                            if e['name'] == 'keywords':
                                data['seoq'] += 1
                                data['keywords'] = e['content']
                            if e['name'] == 'author':
                                data['seoq'] += 1
                                data['author'] = e['content']
                    
                    title = bshtml.find('title')
                    if len(title) > 0:
                        data['title'] = title.text

                    hs = bshtml.findAll(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
                    for e in hs:
                        data['hs'].append(e.text)

                    dbc.insert_one(data)
            self.list = links
        elif types == "parse":
            parselist = []
            for i in self.list:
                html = requests.get(i).text
                parse = html.split(' ')
                for i in parse:
                    if ('http://' in i) or ('https://' in i):
                        parselist.append(i)
            self.parselist = parselist
    
    def filter(self):
        for i in self.parselist:
            for y in i.split(';')[0].split("'"):
                if 'http' in y:
                    y = y.split('"')
                    for e in y:
                        if 'http' in e:
                            self.list.append(e)
                            print(e)  

#https://www.xvideos.com/video53474421/bangbros_-_yummy_milf_kendra_lust_turns_out_young_buck_mike_adriano

g = Spider(data['links'])
g.run()
data['links'] = g.list
with open('data.json', 'w') as f:
    json.dump(data, f, indent=1)