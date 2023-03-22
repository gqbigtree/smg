from flask import Flask, redirect, jsonify
from sqlalchemy import create_engine
from sqlalchemy import text
import json
import datetime

app = Flask(__name__)


def mysql_engine(user = 'root', password = 'qq123456', host = '127.0.0.1', port = '3306', database = 'flight'):
  if database == None:
    engine = create_engine("mysql+pymysql://{0}:{1}@{2}:{3}?charset={4}".format(user, password, host, port, 'utf8mb4'))
  else:
    engine = create_engine("mysql+pymysql://{0}:{1}@{2}:{3}/{4}?charset={5}".format(user, password, host, port, database, 'utf8mb4'))
  return engine

engine = mysql_engine()

def ExecuteSqlSelect(sql):
  with engine.connect() as con:
    results = con.execute(text(sql))
    return results

@app.route('/')
def index():
	return redirect('/static/index.html')

#机场进出港班次
@app.route('/server/airportline', methods=['POST'])
def airportline():
  #暂定
  # param
  cityCode = "CKG"

  # resp
  data = {"cn":[],"cv":[],"jn":[],"jv":[]}
  sql = "SELECT airport_city.`name` as cname, t1.num as num FROM \
        (SELECT  arrive_port_code, COUNT(id) as num FROM airline_flight \
          WHERE depart_port_code = '{}' \
          GROUP BY arrive_port_code) as t1 JOIN airport_city \
          WHERE t1.arrive_port_code = airport_city.`code` ORDER BY num DESC;".format(cityCode)
  results = ExecuteSqlSelect(sql)
  for result in results:
    data["cn"].append(result.cname)
    data["cv"].append(result.num)

  sql = "SELECT airport_city.`name` as cname, t1.num as num FROM \
        (SELECT  depart_port_code, COUNT(id) as num FROM airline_flight \
          WHERE arrive_port_code = '{}' \
          GROUP BY depart_port_code) as t1 JOIN airport_city \
          WHERE t1.depart_port_code = airport_city.`code` ORDER BY num DESC".format(cityCode)
  results = ExecuteSqlSelect(sql)
  for result in results:
    data["jn"].append(result.cname)
    data["jv"].append(result.num)
  return jsonify(data)

#机场航线试图
@app.route('/server/airline', methods=['POST'])
def airline():
  #暂定
  # param
  cityCode = "CKG"

  # resp
  data = []
  sql = "SELECT 	airport_city.`name` as cname, t2.jname as jname, t2.num as num  FROM \
(SELECT t1.depart_port_code, airport_city.`name` as jname, t1.num as num FROM \
(SELECT  depart_port_code, arrive_port_code, COUNT(id) as num FROM airline_flight \
	WHERE depart_port_code = '{}' \
	GROUP BY arrive_port_code) as t1 JOIN airport_city \
	WHERE t1.arrive_port_code = airport_city.`code` ORDER BY num DESC) as t2 JOIN airport_city \
	WHERE t2.depart_port_code = airport_city.`code` ORDER BY num DESC;".format(cityCode)
  results = ExecuteSqlSelect(sql)
  key = ''
  value = []
  for result in results:
    key = result.cname
    value.append([{ "name": result.cname }, { "name": result.jname, "value": result.num }])
  data.append([key, value])

  sql = "SELECT 	t2.cname as cname, airport_city.`name` as jname, t2.num as num  FROM \
(SELECT t1.arrive_port_code, airport_city.`name` as cname, t1.num as num FROM \
(SELECT  arrive_port_code, depart_port_code, COUNT(id) as num FROM airline_flight \
	WHERE arrive_port_code = 'CKG' \
	GROUP BY depart_port_code) as t1 JOIN airport_city \
	WHERE t1.depart_port_code = airport_city.`code` ORDER BY num DESC) as t2 JOIN airport_city \
	WHERE t2.arrive_port_code = airport_city.`code` ORDER BY num DESC;".format(cityCode)
  results = ExecuteSqlSelect(sql)

  for result in results:
    data.append([result.cname, [[{ "name": result.cname }, { "name": result.jname, "value": result.num }]]])
  return jsonify(data)

#机场繁荣排名
@app.route('/server/airport', methods=['POST'])
def airport():
  #暂定
  # param
  cityCode = "CKG"

  # resp
  data = {"fr":0,"tt":0,"jc":0}
  sql = "SELECT depart_port_code, COUNT(id) as num FROM airline_flight GROUP BY depart_port_code ORDER BY num;"
  results = ExecuteSqlSelect(sql)
  fr = True
  data["tt"] += results.rowcount
  for result in results:
    if result.depart_port_code == cityCode:
      data["fr"] = data["tt"] - data["fr"]
      data["jc"] += result.num
      fr = False
    if fr:
      data["fr"] += 1
  return jsonify(data)

#城市云图
@app.route('/server/city', methods=['POST'])
def city():
  #暂定
  # param
  cityCode = "CKG"

  # resp
  data = []
  sql = " SELECT  airport_city.`name` as cityName, COUNT(flight.id) as num FROM flight JOIN airport_city \
    WHERE flight.arrive_port_code = airport_city.`code` \
    AND (depart_port_code='{}') \
    GROUP BY cityName".\
    format(cityCode)
  results = ExecuteSqlSelect(sql)
  for result in results:
    data.append({"name":result.cityName, "value": result.num})
  return jsonify(data)

#航班概览
@app.route('/server/flight', methods=['POST'])
def flight():
  #暂定 - 数据抓取了19-23号
  # param
  date = "2023-03-19"
  cityCode = "CKG"

  # resp
  data = {
    "data": [],
    "flightsType": ["航班总数", "正常数", "延误数", "取消数"],
    "dataTime": [],
  }
  date5  = (datetime.datetime.strptime(date,"%Y-%m-%d") + datetime.timedelta(days=4)).strftime('%Y-%m-%d')
  keyV = {}
  for i in range(5):
     dateMD = (datetime.datetime.strptime(date,"%Y-%m-%d") + datetime.timedelta(days=i)).strftime('%m月%d日')
     data["dataTime"].append(dateMD)
     key = (datetime.datetime.strptime(date,"%Y-%m-%d") + datetime.timedelta(days=i)).strftime('%Y-%m-%d')
     keyV[key] = [0,0,0,0]

  sql = "select date,srak_code,COUNT(id) as num FROM flight \
          WHERE date>='{}' AND date<='{}' AND (depart_port_code='{}' or arrive_port_code='{}') \
          GROUP BY date, srak_code ORDER BY date;".\
            format(date, date5, cityCode, cityCode)
  results = ExecuteSqlSelect(sql)
  for result in results:
    keyDate = result.date.strftime("%Y-%m-%d")
    if result.srak_code == 1:
      keyV[keyDate][1] = result.num
    elif result.srak_code == 2:
      keyV[keyDate][2] = result.num
    elif result.srak_code == 3:
      keyV[keyDate][3] = result.num
  for k in keyV:
     keyV[k][0] = keyV[k][1]+keyV[k][2]+keyV[k][3]
     data["data"].append(keyV[k])

  return jsonify(data)

#天气
@app.route('/server/weather', methods=['POST'])
def weather():
  #暂定 - 数据抓取了22-24号
  # param
  date = "2023-03-22"
  cityCode = "CKG"

  # resp
  data = {
    "weather": "",
    "curTemp": 0,
    "keyTimes": ["今天"],
    "temps": { "hight": [], "low": [] }
  }

  date2MD = (datetime.datetime.strptime(date,"%Y-%m-%d") + datetime.timedelta(days=1)).strftime('%m月%d日')
  date3MD = (datetime.datetime.strptime(date,"%Y-%m-%d") + datetime.timedelta(days=2)).strftime('%m月%d日')
  date3 = (datetime.datetime.strptime(date,"%Y-%m-%d") + datetime.timedelta(days=2)).strftime('%Y-%m-%d')
  sql = "select * FROM weather WHERE city_code='{}' AND `date` >= '{}' AND `date` <= '{}';".\
          format(cityCode, date, date3)
  results = ExecuteSqlSelect(sql)

  idx = 0
  for result in results:
    if idx == 0:
      k =str(int(datetime.datetime.now().strftime('%H')))
      temp_hour24 = json.loads(result.temp_hour24)
      data["weather"] = temp_hour24[k]["w"]
      data["curTemp"] = temp_hour24[k]["t"]
      data["keyTimes"].append(date2MD)
      data["keyTimes"].append(date3MD)
    idx+=1
    weather = json.loads(result.weather)
    data["temps"]["hight"].append(weather["hight"])
    data["temps"]["low"].append(weather["low"])
  return jsonify(data)

#进出港机场信息
@app.route('/server/airportflight', methods=['POST'])
def airportflight():
  #暂定 - 数据抓取了22-24号
  # param
  date = "2023-03-22"
  cityCode = "CKG"

  # resp
  data = {
    "n" : "",
    "v":[[],[]]
  }
  sql = "SELECT t_n.name, t_cyw.cyw, t_cgm.cgm, t_jyw.jyw, t_jgm.jgm FROM \
          (SELECT name FROM airport WHERE `code`= '{}') as t_n, \
          (SELECT COUNT(id) AS cyw FROM flight WHERE depart_port_code = '{}' AND `date`='{}' AND srak='航班延误') AS t_cyw, \
          (SELECT COUNT(id) AS cgm FROM flight WHERE depart_port_code = '{}' AND `date`='{}') AS t_cgm, \
          (SELECT COUNT(id) AS jyw FROM flight WHERE arrive_port_code = '{}' AND `date`='{}' AND srak='航班延误') AS t_jyw, \
          (SELECT COUNT(id) AS jgm FROM flight WHERE arrive_port_code = '{}' AND `date`='{}') AS t_jgm;".\
                    format(cityCode,cityCode,date,cityCode,date,cityCode,date,cityCode,date)
  results = ExecuteSqlSelect(sql)
  for result in results:
    data["n"] = result.name
    clv = (result.cgm - result.cyw) / result.cgm
    ctt = result.cyw*10

    jlv = (result.jgm - result.jyw) / result.jgm
    jtt = result.jyw*10

    data["v"][0] = [result.cgm,result.cyw,clv,ctt,0]
    data["v"][1] = [result.jgm,result.jyw,jlv,jtt,0]
    break

  return jsonify(data)

if __name__ == '__main__':
	app.run(port=80)