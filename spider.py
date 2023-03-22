import datetime
import time
import re
from threading import Thread
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy import text
from bs4 import BeautifulSoup
import requests
import json


def atoi(s):
  idx = 0
  for i, v in enumerate(s):
    if i == 0 and v == "-":
      idx+=1
      continue
    isC = False
    for j in range(0, 10):
      if v == str(j):
        isC = True
        break
    if isC!=True:
      break
    idx += 1
  if idx == 0:
    return 0
  return int(s[:idx])

######################

def ExecuteSql(sql):
  with engine.connect() as con:
    con.execute(text(sql))
    con.commit()

def ExecuteSqlSelect(sql):
  with engine.connect() as con:
    results = con.execute(text(sql))
    return results

def CreateDatabase(db_name):
  sql = f'create database if not exists {db_name};'
  ExecuteSql(sql)

def mysql_engine(user = 'root', password = 'qq123456', host = '127.0.0.1', port = '3306', database = 'flight'):
  if database == None:
    engine = create_engine("mysql+pymysql://{0}:{1}@{2}:{3}?charset={4}".format(user, password, host, port, 'utf8mb4'))
  else:
    engine = create_engine("mysql+pymysql://{0}:{1}@{2}:{3}/{4}?charset={5}".format(user, password, host, port, database, 'utf8mb4'))
  return engine

def CreateTables(sql):
  ExecuteSql(sql)

def InsertTable(t_name, data, key):
  sql = 'SELECT `id` FROM {} WHERE `{}`=\'{}\';'.format(t_name, key, data[key][0])
  with engine.connect() as con:
    results = con.execute(text(sql))
    if results.rowcount > 0:
      return
  df = pd.DataFrame(data)
  df.to_sql(t_name, engine, index=False, if_exists='append')

def InsertTableAndKeys(t_name, data, *keys):
  sql = 'SELECT `id` FROM {} WHERE'.format(t_name)
  for idx in range(len(keys)):
    if idx <= 0:
      sql += " `{}`=\'{}\'".format(keys[idx], data[keys[idx]][0])
    else:
      sql += " AND `{}`=\'{}\'".format(keys[idx], data[keys[idx]][0])
  sql += ";"
  with engine.connect() as con:
    results = con.execute(text(sql))
    if results.rowcount > 0:
      return
  df = pd.DataFrame(data)
  df.to_sql(t_name, engine, index=False, if_exists='append')

def InsertOrUpdateTableWeatherAndKeys(t_name, data, *keys):
  sql = 'SELECT `id` FROM {} WHERE'.format(t_name)
  for idx in range(len(keys)):
    if idx <= 0:
      sql += " `{}`=\'{}\'".format(keys[idx], data[keys[idx]][0])
    else:
      sql += " AND `{}`=\'{}\'".format(keys[idx], data[keys[idx]][0])
  sql += ";"
  with engine.connect() as con:
    results = con.execute(text(sql))
    if results.rowcount <= 0:
      df = pd.DataFrame(data)
      df.to_sql(t_name, engine, index=False, if_exists='append')
    else:
      sql = "UPDATE weather SET `weather` = '{}' , `temp_hour24` = '{}' WHERE `date` = '{}' and city_id = {}".\
              format(data["weather"][0],data["temp_hour24"][0],data["date"][0],data["city_id"][0])
      ExecuteSql(sql)

#城市表
def TableAirportCity(t_name = 'airport_city'):
  sql = 'CREATE TABLE IF NOT EXISTS {} (\
          `id` int UNSIGNED NOT NULL AUTO_INCREMENT,\
          `code` varchar(8) NOT NULL,\
          `name` varchar(16) NOT NULL COMMENT \'城市名称\',\
          `py` varchar(128) NOT NULL COMMENT \'城市名称全拼音\',\
          `pyh` char(1) NOT NULL,\
          `hot` tinyint(1) NOT NULL,\
          `zip` int NOT NULL,\
          PRIMARY KEY (`id`),\
          INDEX `code`(`code` ASC),\
          UNIQUE INDEX `name`(`name` ASC)\
        );'.format(t_name)
  CreateTables(sql)

def TableAirportCityInsert(data, t_name = 'airport_city'):
  InsertTable(t_name, data, "name")

def TableAirportCityUpdateHot(name, t_name = 'airport_city'):
  sql = 'UPDATE {} SET `hot` = 1 WHERE `name` = \'{}\';'.format(t_name, name)
  ExecuteSql(sql)

def TableAirportCitySelect(t_name = 'airport_city'):
  sql = "SELECT id,`code`,py FROM airport_city;"
  return ExecuteSqlSelect(sql)

#机场表
def TableAirport(t_name = 'airport'):
  sql = 'CREATE TABLE IF NOT EXISTS {} (\
          `id` int UNSIGNED NOT NULL AUTO_INCREMENT,\
          `code` varchar(8) NOT NULL,\
          `city_code` varchar(8) NOT NULL,\
          `name` varchar(16) NOT NULL COMMENT \'机场名称\',\
          PRIMARY KEY (`id`),\
          INDEX `city_code`(`city_code` ASC),\
          UNIQUE INDEX `code`(`code` ASC),\
          UNIQUE INDEX `name`(`name` ASC)\
        );'.format(t_name)
  CreateTables(sql)

def TableAirportInsert(data, t_name = 'airport'):
  InsertTable(t_name, data, "name")

#机场航站表
def TableAirportTerminal(t_name = 'airport_terminal'):
  sql = 'CREATE TABLE IF NOT EXISTS {} (\
          `id` int UNSIGNED NOT NULL AUTO_INCREMENT,\
          `name` varchar(8) NOT NULL,\
          `port_code` varchar(8) NOT NULL,\
          PRIMARY KEY (`id`),\
          INDEX `port_code`(`port_code`)\
        );'.format(t_name)
  CreateTables(sql)

def TableAirportTerminalInsert(data, t_name = 'airport_terminal'):
  InsertTableAndKeys(t_name, data, "name", "port_code")

#航司表
def TableAirline(t_name = 'airline'):
  sql = 'CREATE TABLE IF NOT EXISTS {} (\
          `id` int UNSIGNED NOT NULL AUTO_INCREMENT,\
          `name` varchar(16) NOT NULL COMMENT \'航司名称\',\
          `code` varchar(8) NOT NULL COMMENT \'航司代码\',\
          PRIMARY KEY (`id`),\
          UNIQUE INDEX `name`(`name` ASC),\
          UNIQUE INDEX `code`(`code` ASC)\
        );'.format(t_name)
  CreateTables(sql)

def TableAirlineInsert(data, t_name = 'airline'):
  InsertTable(t_name, data, "name")

#航司航班时刻表
def TableAirlineFlight(t_name = 'airline_flight'):
  sql = 'CREATE TABLE IF NOT EXISTS {} (\
          `id` int UNSIGNED NOT NULL AUTO_INCREMENT,\
          `airline_code` varchar(8) NOT NULL,\
          `flight_no` varchar(8) NOT NULL,\
          `aircraft_type` varchar(8) NOT NULL,\
          `on_time_rate` varchar(8) NOT NULL,\
          `depart_time` varchar(8) NOT NULL,\
          `depart_city_code` varchar(8) NOT NULL,\
          `depart_port_code` varchar(8) NOT NULL,\
          `depart_terminal` varchar(8) NOT NULL,\
          `arrive_time` varchar(8) NOT NULL,\
          `arrive_city_code` varchar(8) NOT NULL,\
          `arrive_port_code` varchar(8) NOT NULL,\
          `arrive_terminal` varchar(8) NOT NULL,\
          `stop_cityName` varchar(16),\
          `current_week_schedule` json NOT NULL,\
          PRIMARY KEY (`id`),\
          INDEX `flight_no`(`flight_no` ASC),\
          INDEX `airline_code`(`airline_code` ASC),\
          INDEX `depart_time`(`depart_time` ASC),\
          INDEX `depart_city_code`(`depart_city_code` ASC),\
          INDEX `depart_port_code`(`depart_port_code` ASC),\
          INDEX `arrive_time`(`arrive_time` ASC),\
          INDEX `arrive_city_code`(`arrive_city_code` ASC),\
          INDEX `arrive_port_code`(`arrive_port_code` ASC),\
          UNIQUE INDEX `flight_no_2`(`flight_no` ASC, `depart_time` ASC, `depart_port_code` ASC)\
        );'.format(t_name)
  CreateTables(sql)

def TableAirlineFlightInsert(data, t_name = 'airline_flight'):
  InsertTableAndKeys(t_name, data, "flight_no", "depart_port_code", "depart_time")

def TableAirportFlightSelect(t_name = 'airport'):
  sql = "SELECT distinct t1.depart_port_code, airline_flight.arrive_port_code FROM airline_flight JOIN \
          (SELECT depart_port_code, COUNT(arrive_port_code) as c FROM airline_flight GROUP BY `depart_port_code` ORDER BY c) as t1 \
          WHERE t1.depart_port_code = airline_flight.depart_port_code"
  #数据采集慢，规定为进出港重庆
  sql += " and (airline_flight.depart_port_code = 'CKG' or airline_flight.arrive_port_code = 'CKG');"
  return ExecuteSqlSelect(sql)

#航班实时动态(历史)
def TableFlight(t_name = 'flight'):
  sql = 'CREATE TABLE IF NOT EXISTS {} (\
          `id` int UNSIGNED NOT NULL AUTO_INCREMENT,\
          `date` date NOT NULL,\
          `flight_no` varchar(8) NOT NULL,\
          `airline_code` varchar(8) NOT NULL,\
          `depart_time` datetime NOT NULL,\
          `depart_city_code` varchar(8) NOT NULL,\
          `depart_port_code` varchar(8) NOT NULL,\
          `arrive_time` datetime NOT NULL,\
          `arrive_city_code` varchar(8) NOT NULL,\
          `arrive_port_code` varchar(8) NOT NULL,\
          `day_interval` int NOT NULL,\
          `srak` varchar(16) NOT NULL,\
          `srak_code` int NOT NULL,\
          `stop_city` varchar(16) NULL,\
          `ex` json NOT NULL,\
          PRIMARY KEY (`id`),\
          INDEX(`flight_no`),\
          INDEX(`date`, `flight_no`, `depart_time`, `depart_port_code`)\
        );'.format(t_name)
  CreateTables(sql)

def TableFlightInsert(data, t_name = 'flight'):
  InsertTableAndKeys(t_name, data, "date", "flight_no", "depart_port_code", "depart_time")


#天气表
def TableWeather(t_name = 'weather'):
  sql = 'CREATE TABLE IF NOT EXISTS {} (\
                  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,\
                  `city_id` int NOT NULL,\
                  `city_code` varchar(255) NOT NULL,\
                  `date` date NOT NULL,\
                  `weather` json NOT NULL,\
                  `temp_hour24` json NOT NULL,\
                  PRIMARY KEY (`id`),\
                  INDEX(`date`),\
                  INDEX(`city_id`),\
                  INDEX(`city_code`)\
                );'.format(t_name)
  CreateTables(sql)

def TableWeatherInsert(data, t_name = 'weather'):
  InsertOrUpdateTableWeatherAndKeys(t_name, data, "date", "city_id")

class spider:
  def __init__(self):
    # 准备请求头信息
    user_agent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
    accept_language = 'zh-CN,zh;q=0.9'
    accept_encoding = 'gzip, deflate, br'
    accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
    # 组装请求头
    headers = {
        'Accept': accept,
        'Accept-Language': accept_language,
        'Accept_Encoding': accept_encoding,
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': user_agent
    }
    self.headers = headers
    self.tmpCity = []
    self.dz = time.time()

  def Spider(self):
    self.SpiderCity()

    for idx in range(len(self.tmpCity)):
      for idx2 in range(len(self.tmpCity)):
        if idx == idx2:
          continue
        self.SpiderSchedule(self.tmpCity[idx], self.tmpCity[idx2])
    #目标网站
    #携程：https://flights.ctrip.com/domestic/schedule/
    #分析
  def SpiderCity(self):
    self.headers["accept"] = "application/json"
    self.headers["content-type"] = "application/json;charset=UTF-8"

    bContinue = True
    while bContinue:
      resp = requests.get('https://flights.ctrip.com/schedule/poi/get', headers = self.headers)
      code = resp.status_code
      if code != 200:
        return False
      try:
        jsonObj = resp.json()
      except json.JSONDecodeError as e:
        while True:
          msg = input("请浏览器打开网址(https://flights.ctrip.com/schedule/poi/get)验证(会出现多次验证)后输入字符Y继续:")
          if msg == 'Y':
            break
      else:
        bContinue = False

    if jsonObj["status"] != 0:
      return False
    city = []
    for key in jsonObj["data"]:
      subJsonObj = jsonObj["data"][key]
      if isinstance(subJsonObj, dict):
        for subKey in subJsonObj:
          items = subJsonObj[subKey]
          for idx in range(len(items)):
            if "(" in items[idx]["display"]:
              continue
            itemData = items[idx]["data"].split('|')
            if len(itemData)!= 4:
              return False
            TableAirportCityInsert({
              "code": [items[idx]["data"].split('|')[3]],
              "name": [items[idx]["display"]],
              "py": [items[idx]["data"].split('|')[0]],
              "pyh": [subKey],
              "hot": [0],
              "zip": [items[idx]["data"].split('|')[2]]
            })
            city.append(items[idx]["data"].split('|')[3])
    for key in jsonObj["data"]:
      subJsonObj = jsonObj["data"][key]
      if not isinstance(subJsonObj, dict):
        for idx in range(len(subJsonObj)):
          TableAirportCityUpdateHot(subJsonObj[idx]["display"])
        break

    self.tmpCity = list({}.fromkeys(city))
  def SpiderSchedule(self, b, t, p = None):
    jsonObj = {"departureCityCode":b,"arriveCityCode":t}
    if p != None:
      jsonObj = {"departureCityCode":b,"arriveCityCode":t, "pageNo":p}
    bContinue = True
    while bContinue:
      resp = requests.post("https://flights.ctrip.com/schedule/getScheduleByCityPair", headers = self.headers, json = jsonObj)
      code = resp.status_code
      if code != 200:
        return False
      if resp.text == "":
        return True
      try:
        jsonObj = resp.json()
      except json.JSONDecodeError as e:
        while True:
          msg = input("请浏览器打开网址(https://flights.ctrip.com/schedule/poi/get)验证(会出现多次验证)后输入字符Y继续:")
          if msg == 'Y':
            break
      else:
        bContinue = False

    items = jsonObj["scheduleVOList"]
    for idx in range(len(items)):
      if items[idx]["arriveCityCode"] != t:
        return False
      if items[idx]["departCityCode"] != b:
        return False
      TableAirportInsert({
        "city_code": [items[idx]["arriveCityCode"]],
        "name": [items[idx]["arrivePortName"]],
        "code": [items[idx]["arrivePortCode"]]
      })
      TableAirportInsert({
        "city_code": [items[idx]["departCityCode"]],
        "name": [items[idx]["departPortName"]],
        "code": [items[idx]["departPortCode"]]
      })
      tmpArriveTerminal = items[idx]["arriveTerminal"]
      if isinstance(tmpArriveTerminal, str) and len(tmpArriveTerminal) > 0:
        TableAirportTerminalInsert({
          "name": [tmpArriveTerminal],
          "port_code": [items[idx]["arrivePortCode"]],
        })
      else:
        tmpArriveTerminal = ""
      tmpDepartTerminal = items[idx]["departTerminal"]
      if isinstance(tmpDepartTerminal, str) and len(tmpDepartTerminal) > 0:
        TableAirportTerminalInsert({
          "name": [tmpDepartTerminal],
          "port_code": [items[idx]["departPortCode"]],
        })
      else:
        tmpDepartTerminal = ""
      TableAirlineInsert({
        "name":[items[idx]["airlineCompanyName"]],
        "code":[items[idx]["airlineCode"]]
      })

      tmpStopCityName = ""
      if isinstance(items[idx]["stopCityName"], str) and len(items[idx]["stopCityName"]) > 0:
        tmpStopCityName = items[idx]["stopCityName"]
      TableAirlineFlightInsert({
        "airline_code": [items[idx]["airlineCode"]],
        "flight_no": [items[idx]["flightNo"]],
        "aircraft_type": [items[idx]["aircraftType"]],
        "on_time_rate": [items[idx]["onTimeRate"]],
        "depart_time": [items[idx]["departTime"]],
        "depart_city_code": [items[idx]["departCityCode"]],
        "depart_port_code": [items[idx]["departPortCode"]],
        "depart_terminal": [tmpDepartTerminal],
        "arrive_time": [items[idx]["arriveTime"]],
        "arrive_city_code": [items[idx]["arriveCityCode"]],
        "arrive_port_code": [items[idx]["arrivePortCode"]],
        "arrive_terminal": [tmpArriveTerminal],
        "stop_cityName": [tmpStopCityName],
        "current_week_schedule": [json.dumps(items[idx]["currentWeekSchedule"],ensure_ascii=False)]
      })

    if jsonObj["curPage"] < jsonObj["totalPage"]:
      self.SpiderSchedule(b,t,jsonObj["curPage"]+1)

  def SpiderWeather(self):
    results = TableAirportCitySelect()
    for result in results:
      self.SpiderWeatherCurr(result)
  def SpiderWeatherCurr(self, city):
    url = 'https://m.tianqibag.com/{}/'.format(re.sub('[\'\\'', \' \']', '', city.py.lower()))
    resp = requests.get(url)
    code = resp.status_code
    if code != 200:
      return False
    html_doc = resp.text
    bs = BeautifulSoup(html_doc, 'html.parser')
    weather = {}
    temp_hour24 = {}
    ul = bs.find_all(lambda tag: tag.name=='ul' and tag.get('class')==['hourslist','clearfix'])
    if len(ul) != 1:
      return False
    lis = ul[0].contents
    if len(lis) != 24:
      return False
    tmp_temp_hour24 = {}
    for li in lis:
      d = atoi(li.contents[0].string.strip())
      v = {"d": d, "w": li.contents[2].string.strip(), "t": atoi(li.contents[3].string.strip())}
      tmp_temp_hour24[d] = v

    keys = sorted(tmp_temp_hour24.keys())
    for k in keys:
      temp_hour24[str(k)] = tmp_temp_hour24[k]
    weather["low"] = min(tmp_temp_hour24.values(), key=lambda x: x['t'])['t']
    weather["hight"] = max(tmp_temp_hour24.values(), key=lambda x: x['t'])['t']
    TableWeatherInsert({
      "city_id":[city.id],
      "city_code":[city.code],
      "date":[datetime.datetime.now().strftime('%Y-%m-%d')],
      "weather":[json.dumps(weather,ensure_ascii=False)],
      "temp_hour24":[json.dumps(temp_hour24,ensure_ascii=False)],
    })
    self.SpiderWeatherNext(city)
  def SpiderWeatherNext(self,city):
    url = 'https://m.tianqibag.com/{}/30.html'.format(re.sub('[\'\\'', \' \']', '',city.py.lower()))
    resp = requests.get(url)
    code = resp.status_code
    if code != 200:
      return False
    html_doc = resp.text
    bs = BeautifulSoup(html_doc, 'html.parser')
    tbody = bs.find_all(lambda tag: tag.name=='table')
    if len(tbody) != 3:
      return False
    trs = tbody[1].contents
    if len(trs) < 9:
      return False

    weather = {}
    temp_hour24 = {}
    for idx in range(3,9, 2):
      tr1 = trs[idx]
      tr2 = trs[idx+1]
      sh,yu  = divmod(idx, 2)
      data = (datetime.datetime.now() + datetime.timedelta(days=sh)).strftime("%Y-%m-%d")
      weather["hight"] = atoi(tr1.contents[4].string.strip())
      weather["low"] = atoi(tr2.contents[3].string.strip())
      TableWeatherInsert({
        "city_id":[city.id],
        "city_code":[city.code],
        "date":[data],
        "weather":[json.dumps(weather,ensure_ascii=False)],
        "temp_hour24":[json.dumps(temp_hour24,ensure_ascii=False)],
      })

  def SpiderFlight(self):
    dates = []
    dates.append(datetime.datetime.now().strftime('%Y-%m-%d'))
    dates.append((datetime.datetime.now() + datetime.timedelta(days=1)).strftime('%Y-%m-%d'))
    dates.append((datetime.datetime.now() + datetime.timedelta(days=2)).strftime('%Y-%m-%d'))
    results = TableAirportFlightSelect()
    for result in results:
        self.SpiderFlightCurr(dates[1], result.depart_port_code,result.arrive_port_code)
        self.SpiderFlightCurr(dates[2], result.depart_port_code,result.arrive_port_code)
  def SpiderFlightCurr(self,d,dc,ac):
    yzm = 'https://flights.ctrip.com/actualtime/list.html?departCity={}&arriveCity={}&departPort=&arrivePort=&date={}'.format(dc,ac,d)
    url = 'https://m.ctrip.com/restapi/soa2/14566/FlightVarListQuery'
    self.headers["accept"] = "application/json"
    jsonD = {"dCode":dc, "aCode":ac,"srchDate":d}
    jsonD = {"token":None,
                "dCode":dc,
                "aCode":ac,
                "queryType":2,
                "srchDate":d,
                "extparam":"",
                "head":{"cid":"0"+str(atoi("09031109117572415641")+self.dz),
                          "ctok":"",
                          "cver":"1.0",
                          "lang":"01",
                          "sid":"8888",
                          "syscode":"09",
                          "auth":"",
                          "xsid":"",
                          "extension":[{"name":"i18n.locale","value":"zh_CN"},{"name":"source","value":"online"}]
                        }
               }

    bContinue = True
    while bContinue:
      jsonD["head"]["cid"] = "0"+str(self.dz)
      jsonD["head"]["sid"] =  str(self.dz)
      resp = requests.post(url, headers = self.headers, json=jsonD)
      code = resp.status_code
      if code != 200:
        return False
      try:
        jsonObj = resp.json()
        if jsonObj["rt"] != 0:
          return False
      except KeyError or json.JSONDecodeError as e:
        while True:
          self.dz = time.time()
          msg = input("请浏览器打开网址({})验证(会出现多次验证)后输入字符Y继续:".format(yzm))
          if msg == 'Y':
            break
      else:
        bContinue = False
    for fl in jsonObj["flst"]:
      TableFlightInsert({
        "date":[d],
        "flight_no":[fl["fno"]],
        "airline_code":[fl["airlineCode"]],
        "depart_time":[fl["dTime"]],
        "depart_city_code":[""],
        "depart_port_code":[fl["dcode"]],
        "arrive_time":[fl["aTime"]],
        "arrive_city_code":[""],
        "arrive_port_code":[fl["acode"]],
        "day_interval":[fl["dayInterval"]],
        "srak":[fl["srak"]],
        "srak_code":[fl["color"]],
        "stop_city":[fl["stopCitys"]],
        "ex":[json.dumps(fl,ensure_ascii=False)]
      })

engine = mysql_engine(database=None)
CreateDatabase('flight')
engine = mysql_engine()
TableAirportCity()
TableAirport()
TableAirportTerminal()
TableAirline()
TableAirlineFlight()
TableFlight()
TableWeather()
spiderObj = spider()
spiderObj.SpiderWeather()
#航班时刻表等信息爬取
#thr1 = Thread(target=spiderObj.Spider(), args=("航班时刻表等信息爬取",))
#thr1.start()
#thr1.join()

#天气爬取
thr2 = Thread(target=spiderObj.SpiderWeather(), args=("天气爬取",))
thr2.start()
thr2.join()

#航班实时动态爬取
#thr3 = Thread(target=spiderObj.SpiderFlight(), args=("航班实时动态爬取",))
#thr3.start()
#thr3.join()


